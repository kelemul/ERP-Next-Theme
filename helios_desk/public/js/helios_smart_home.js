/*
 * HELIOSDESK — Smart Home Dashboard
 * Enhanced workspace replacement with KPI cards, pending items, quick-create shortcuts.
 */
(function () {
  "use strict";

  function enhanceHome() {
    var page = document.querySelector(".page-content");
    if (!page) return;

    // Check if we are on the workspace/home page
    var isHome = window.location.hash.indexOf("#workspaces") >= 0 || window.location.hash === "";
    if (!isHome && frappe.get_route && frappe.get_route()[0] !== "") return;

    // Only inject once
    if (document.querySelector(".hd-sh-section")) return;

    // Create smart home sections
    var container = document.querySelector(".page-container .container-fluid") ||
      document.querySelector(".page-content-wrapper");
    if (!container) return;

    var wrapper = document.createElement("div");
    wrapper.className = "hd-smart-home";

    // 1. KPI Cards Row
    var kpiRow = document.createElement("div");
    kpiRow.className = "hd-sh-section";
    kpiRow.innerHTML = '<div class="hd-sh-section-title">Key Metrics</div><div class="hd-sh-kpi-grid" id="hd-kpi-grid"></div>';
    wrapper.appendChild(kpiRow);

    // 2. Quick Create
    var quickRow = document.createElement("div");
    quickRow.className = "hd-sh-section";
    quickRow.innerHTML = '<div class="hd-sh-section-title">Quick Create</div><div class="hd-sh-quick-grid" id="hd-quick-grid"></div>';
    wrapper.appendChild(quickRow);

    // 3. Pending Items
    var pendingRow = document.createElement("div");
    pendingRow.className = "hd-sh-section";
    pendingRow.innerHTML = '<div class="hd-sh-section-title">Pending Items</div><div class="hd-sh-pending" id="hd-pending-list"></div>';
    wrapper.appendChild(pendingRow);

    // 4. Recent Documents
    var recentRow = document.createElement("div");
    recentRow.className = "hd-sh-section";
    recentRow.innerHTML = '<div class="hd-sh-section-title">Recent Documents</div><div class="hd-sh-recent" id="hd-recent-list"></div>';
    wrapper.appendChild(recentRow);

    container.insertBefore(wrapper, container.firstChild);

    // Load data
    loadKPIs();
    loadQuickCreate();
    loadPending();
    loadRecent();

    // Refresh every 60 seconds
    setInterval(function () {
      loadKPIs();
      loadPending();
    }, 60000);
  }

  function loadKPIs() {
    var grid = document.getElementById("hd-kpi-grid");
    if (!grid) return;

    frappe.call({
      method: "helios_desk.api.get_kpi_data",
      callback: function (r) {
        if (!r.message) {
          grid.innerHTML = '<div class="hd-sh-empty">No metrics available</div>';
          return;
        }
        var html = "";
        (r.message || []).forEach(function (kpi) {
          html +=
            '<div class="hd-sh-kpi-card" onclick="frappe.set_route(\'' +
            (kpi.route || "") +
            '\')">' +
            '<div class="hd-sh-kpi-number">' +
            (kpi.value || 0) +
            "</div>" +
            '<div class="hd-sh-kpi-label">' +
            (kpi.label || "") +
            "</div>" +
            '<div class="hd-sh-kpi-trend ' +
            ((kpi.trend || "").toLowerCase() === "up"
              ? "hd-trend-up"
              : "hd-trend-down") +
            '">' +
            (kpi.trend_text || "") +
            "</div>" +
            "</div>";
        });
        grid.innerHTML = html;
      },
      silent: true,
    });
  }

  function loadQuickCreate() {
    var grid = document.getElementById("hd-quick-grid");
    if (!grid) return;

    frappe.call({
      method: "helios_desk.api.get_quick_create_list",
      callback: function (r) {
        if (!r.message || r.message.length === 0) {
          grid.innerHTML = '<div class="hd-sh-empty">No quick-create docs</div>';
          return;
        }
        var html = "";
        (r.message || []).forEach(function (d) {
          html +=
            '<div class="hd-sh-quick-btn" onclick="frappe.new_doc(\'' +
            d +
            '\')">' +
            frappe.boot.doctype_meta &&
            frappe.boot.doctype_icon &&
            frappe.boot.doctype_icon[d]
              ? frappe.boot.doctype_icon[d] + " "
              : "" +
              (d.replace(/_/g, " ").replace(/\b\w/g, function (c) {
                return c.toUpperCase();
              })) +
            "</div>";
        });
        grid.innerHTML = html;
      },
      silent: true,
    });
  }

  function loadPending() {
    var list = document.getElementById("hd-pending-list");
    if (!list) return;

    frappe.call({
      method: "helios_desk.api.get_pending_items",
      callback: function (r) {
        if (!r.message || r.message.length === 0) {
          list.innerHTML = '<div class="hd-sh-empty">No pending items</div>';
          return;
        }
        var html = "";
        (r.message || []).forEach(function (item) {
          html +=
            '<div class="hd-sh-pending-item" onclick="frappe.set_route(\'Form\',\'' +
            (item.doctype || "") +
            "','" +
            (item.name || "") +
            '\')">' +
            '<div class="hd-sh-pending-info">' +
            '<span class="hd-sh-pending-title">' +
            (item.subject || item.title || item.name || "") +
            "</span>" +
            '<span class="hd-sh-pending-meta">' +
            (item.doctype || "") +
            " · " +
            (item.status || "") +
            "</span>" +
            "</div>" +
            "</div>";
        });
        list.innerHTML = html;
      },
      silent: true,
    });
  }

  function loadRecent() {
    var list = document.getElementById("hd-recent-list");
    if (!list) return;

    try {
      var recent = JSON.parse(
        localStorage.getItem("hd_recent_docs") || "[]"
      );
      if (recent.length === 0) {
        list.innerHTML = '<div class="hd-sh-empty">No recently viewed documents</div>';
        return;
      }
      var html = "";
      recent.slice(0, 10).forEach(function (r) {
        html +=
          '<div class="hd-sh-pending-item" onclick="frappe.set_route(\'Form\',\'' +
          (r.doctype || "") +
          "','" +
          (r.name || "") +
          '\')">' +
          '<div class="hd-sh-pending-info">' +
          '<span class="hd-sh-pending-title">' +
          (r.label || r.name || "") +
          "</span>" +
          '<span class="hd-sh-pending-meta">' +
          (r.doctype || "") +
          " · " +
          (r.time || "") +
          "</span>" +
          "</div>" +
          "</div>";
      });
      list.innerHTML = html;
    } catch (e) {
      list.innerHTML = '<div class="hd-sh-empty">Error loading recents</div>';
    }
  }

  // Hook into Frappe route change
  if (frappe.events) {
    frappe.events.on("route_options_set", function () {
      setTimeout(enhanceHome, 500);
    });
  }

  // Track viewed documents for recents
  function trackRecent() {
    var route = frappe.get_route && frappe.get_route();
    if (!route || route[0] !== "Form" || !route[1] || !route[2]) return;
    var doctype = route[1];
    var name = route[2];
    var meta = frappe.boot.doctype_meta && frappe.boot.doctype_meta[doctype];
    var label = meta && meta.name;
    if (!label) label = name;

    try {
      var recent = JSON.parse(
        localStorage.getItem("hd_recent_docs") || "[]"
      );
      recent = recent.filter(function (r) {
        return !(r.doctype === doctype && r.name === name);
      });
      recent.unshift({
        doctype: doctype,
        name: name,
        label: label,
        time: new Date().toISOString(),
      });
      if (recent.length > 30) recent = recent.slice(0, 30);
      localStorage.setItem("hd_recent_docs", JSON.stringify(recent));
    } catch (e) {
      // ignore
    }
  }

  // Init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      enhanceHome();
      trackRecent();
    });
  } else {
    enhanceHome();
    trackRecent();
  }

  // Track on route change
  if (frappe.events) {
    frappe.events.on("route_options_set", trackRecent);
  }
})();
