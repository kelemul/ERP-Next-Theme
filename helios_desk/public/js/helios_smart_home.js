/*
 * HELIOSDESK — Smart Home Dashboard
 * Enhanced workspace replacement with KPI cards, pending items, quick-create shortcuts.
 */
(function () {
  "use strict";

  function isHomePage() {
    try {
      var route = frappe.get_route && frappe.get_route();
      if (!route) return false;
      // Home page
      if (route.length === 1 && route[0] === "") return true;
      // Workspace page
      if (route[0] === "workspaces") return true;
    } catch (e) {
      return false;
    }
    return false;
  }

  function enhanceHome() {
    if (!isHomePage()) return;
    if (document.querySelector(".hd-smart-home")) return;

    var container =
      document.querySelector(".page-content .page-content-wrapper") ||
      document.querySelector(".layout-main-section") ||
      document.querySelector(".container-fluid") ||
      document.querySelector(".page-body > .row") ||
      document.querySelector(".page-content");
    if (!container) return;

    var wrapper = document.createElement("div");
    wrapper.className = "hd-smart-home";

    var html =
      '<div class="hd-sh-section"><div class="hd-sh-section-title">Key Metrics</div><div class="hd-sh-kpi-grid" id="hd-kpi-grid"></div></div>' +
      '<div class="hd-sh-section"><div class="hd-sh-section-title">Quick Create</div><div class="hd-sh-quick-grid" id="hd-quick-grid"></div></div>' +
      '<div class="hd-sh-section"><div class="hd-sh-section-title">Pending Items</div><div class="hd-sh-pending" id="hd-pending-list"></div></div>' +
      '<div class="hd-sh-section"><div class="hd-sh-section-title">Recent Documents</div><div class="hd-sh-recent" id="hd-recent-list"></div></div>';
    wrapper.innerHTML = html;

    // Insert at top of content area
    var target = container.querySelector(".page-wrapper") || container;
    target.insertBefore(wrapper, target.firstChild);

    loadKPIs();
    loadQuickCreate();
    loadPending();
    loadRecent();

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
        if (!r.message || r.message.length === 0) {
          grid.innerHTML = '<div class="hd-sh-empty">No metrics available</div>';
          return;
        }
        var html = "";
        r.message.forEach(function (kpi) {
          html +=
            '<div class="hd-sh-kpi-card">' +
            '<div class="hd-sh-kpi-number">' +
            (kpi.value || 0) +
            "</div>" +
            '<div class="hd-sh-kpi-label">' +
            frappe.utils.escape_html(kpi.label || "") +
            "</div>" +
            '<div class="hd-sh-kpi-trend">' +
            frappe.utils.escape_html(kpi.trend_text || "") +
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
        r.message.forEach(function (d) {
          var label = d
            .replace(/_/g, " ")
            .replace(/\b\w/g, function (c) {
              return c.toUpperCase();
            });
          var icon = "";
          try {
            icon =
              frappe.boot.doctype_icon &&
              frappe.boot.doctype_icon[d]
                ? frappe.boot.doctype_icon[d] + " "
                : "";
          } catch (e) {
            icon = "";
          }
          html +=
            '<div class="hd-sh-quick-btn" onclick="frappe.new_doc(\'' +
            d +
            "\')\">" +
            icon +
            label +
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
        r.message.forEach(function (item) {
          html +=
            '<div class="hd-sh-pending-item" onclick="frappe.set_route(\'Form\',\'' +
            (item.doctype || "") +
            "','" +
            (item.name || "") +
            '\')">' +
            '<div class="hd-sh-pending-info">' +
            "<strong>" +
            frappe.utils.escape_html(
              item.subject || item.title || item.name || ""
            ) +
            "</strong>" +
            '<div class="hd-sh-pending-meta">' +
            frappe.utils.escape_html(item.doctype || "") +
            " &middot; " +
            frappe.utils.escape_html(item.status || "") +
            "</div>" +
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
        list.innerHTML =
          '<div class="hd-sh-empty">No recently viewed documents</div>';
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
          "<strong>" +
          frappe.utils.escape_html(r.label || r.name || "") +
          "</strong>" +
          '<div class="hd-sh-pending-meta">' +
          frappe.utils.escape_html(r.doctype || "") +
          " &middot; " +
          (r.time
            ? frappe.datetime.comment_when(r.time)
            : "") +
          "</div>" +
          "</div>" +
          "</div>";
      });
      list.innerHTML = html;
    } catch (e) {
      list.innerHTML =
        '<div class="hd-sh-empty">Error loading recents</div>';
    }
  }

  function trackRecent() {
    try {
      var route = frappe.get_route && frappe.get_route();
      if (!route || route[0] !== "Form" || !route[1] || !route[2]) return;
      var recent = JSON.parse(
        localStorage.getItem("hd_recent_docs") || "[]"
      );
      recent = recent.filter(function (r) {
        return !(r.doctype === route[1] && r.name === route[2]);
      });
      recent.unshift({
        doctype: route[1],
        name: route[2],
        label: route[2],
        time: new Date().toISOString(),
      });
      if (recent.length > 30) recent = recent.slice(0, 30);
      localStorage.setItem("hd_recent_docs", JSON.stringify(recent));
    } catch (e) {
      /* ignore */
    }
  }

  // Init on page load
  function init() {
    // Try immediately
    enhanceHome();
    trackRecent();

    // Re-try after frappe is fully ready
    var tries = 0;
    var interval = setInterval(function () {
      tries++;
      if (tries > 20) {
        clearInterval(interval);
        return;
      }
      if (typeof frappe !== "undefined" && frappe.get_route) {
        clearInterval(interval);
        enhanceHome();
        trackRecent();
      }
    }, 250);
  }

  // Hook into Frappe route changes
  $(document).on("route", function () {
    setTimeout(function () {
      enhanceHome();
      trackRecent();
    }, 300);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
