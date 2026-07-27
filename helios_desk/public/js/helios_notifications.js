/*
 * HELIOSDESK — Notification Panel
 */
(function () {
  "use strict";

  var panel, backdrop;

  function createPanel() {
    if (document.querySelector(".hd-notif-panel")) return;

    backdrop = document.createElement("div");
    backdrop.className = "hd-notif-backdrop";
    backdrop.style.display = "none";
    backdrop.addEventListener("click", close);

    panel = document.createElement("div");
    panel.className = "hd-notif-panel";
    panel.style.display = "none";

    // Header
    var header = document.createElement("div");
    header.className = "hd-notif-header";
    header.innerHTML =
      "<h3>Notifications</h3>" +
      '<button class="hd-notif-close">&times;</button>';
    header.querySelector(".hd-notif-close").addEventListener("click", close);
    panel.appendChild(header);

    // Tabs
    var tabs = document.createElement("div");
    tabs.className = "hd-notif-tabs";
    tabs.innerHTML =
      '<button class="hd-notif-tab active" data-tab="all">All</button>' +
      '<button class="hd-notif-tab" data-tab="unread">Unread</button>' +
      '<button class="hd-notif-tab" data-tab="mentions">Mentions</button>';
    tabs.querySelectorAll(".hd-notif-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs
          .querySelectorAll(".hd-notif-tab")
          .forEach(function (t) {
            t.classList.remove("active");
          });
        this.classList.add("active");
        fetchNotifications(this.dataset.tab);
      });
    });
    panel.appendChild(tabs);

    // List
    var list = document.createElement("div");
    list.className = "hd-notif-list";
    panel.appendChild(list);

    // Footer
    var footer = document.createElement("div");
    footer.className = "hd-notif-footer";
    footer.innerHTML =
      '<button class="btn btn-xs btn-default" onclick="frappe.call({method:\'frappe.desk.notifications.clear_notifications\'}); this.closest(\'.hd-notif-panel\').querySelector(\'.hd-notif-list\').innerHTML=\'<div class=\\\'hd-notif-empty\\\'>No notifications</div>\'">' +
      "Mark All Read</button>" +
      '<button class="btn btn-xs btn-default" onclick="window.open(\'/desk#notification-settings\',\'_blank\')">Settings</button>';
    panel.appendChild(footer);

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    // Real-time listener
    if (frappe.realtime) {
      frappe.realtime.on("show_notification", function () {
        if (panel.style.display !== "block") {
          updateBadge();
        }
      });
    }
  }

  function toggle() {
    if (panel.style.display === "block") {
      close();
    } else {
      open();
    }
  }

  function open() {
    panel.style.display = "flex";
    backdrop.style.display = "block";
    fetchNotifications("all");
    document.dispatchEvent(new CustomEvent("hd:notifications-open"));
  }

  function close() {
    panel.style.display = "none";
    backdrop.style.display = "none";
    document.dispatchEvent(new CustomEvent("hd:notifications-close"));
  }

  function fetchNotifications(tab) {
    var list = panel.querySelector(".hd-notif-list");
    list.innerHTML =
      '<div class="hd-notif-loading"><div class="hd-spinner"></div></div>';

    frappe.call({
      method: "helios_desk.api.get_notifications",
      args: { tab: tab || "all" },
      callback: function (r) {
        if (r.message) {
          renderNotifications(r.message);
          updateBadge(r.message.unread_count);
        } else {
          list.innerHTML =
            '<div class="hd-notif-empty">No notifications</div>';
        }
      },
      silent: true,
    });
  }

  function renderNotifications(data) {
    var list = panel.querySelector(".hd-notif-list");
    var items = data.notifications || [];
    if (items.length === 0) {
      list.innerHTML =
        '<div class="hd-notif-empty">No notifications</div>';
      return;
    }

    var html = "";
    items.forEach(function (n) {
      var isUnread = n.read === 0 || n.read === false || !n.read;
      html +=
        '<div class="hd-notif-item' +
        (isUnread ? " unread" : "") +
        '">' +
        '<div class="hd-notif-icon">' +
        (n.icon || "🔔") +
        "</div>" +
        '<div class="hd-notif-content">' +
        '<div class="hd-notif-title">' +
        (n.title || n.subject || "") +
        "</div>" +
        '<div class="hd-notif-text">' +
        (n.text || n.content || "") +
        "</div>" +
        '<div class="hd-notif-time">' +
        (n.creation
          ? frappe.datetime.comment_when(n.creation)
          : "") +
        "</div>" +
        "</div>" +
        "</div>";
    });
    list.innerHTML = html;

    // Click to open document
    list.querySelectorAll(".hd-notif-item").forEach(function (el, idx) {
      el.addEventListener("click", function () {
        var n = items[idx];
        if (n && n.doctype && n.docname) {
          frappe.set_route("Form", n.doctype, n.docname);
          close();
        }
      });
    });
  }

  function updateBadge(count) {
    var badge = document.querySelector(".hd-notif-bell .hd-badge");
    if (!badge) return;
    if (count === undefined) {
      frappe.call({
        method: "helios_desk.api.get_unread_count",
        callback: function (r) {
          updateBadge(r.message || 0);
        },
        silent: true,
      });
      return;
    }
    if (count > 0) {
      badge.textContent = count > 99 ? "99+" : count;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  }

  // Exposed API
  window.hdNotifications = {
    toggle: toggle,
    open: open,
    close: close,
    updateBadge: updateBadge,
  };

  // Init
  function init() {
    createPanel();
    updateBadge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
