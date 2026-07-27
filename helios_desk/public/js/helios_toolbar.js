/*
 * HELIOSDESK — Top Toolbar Builder
 */
(function () {
  "use strict";

  function buildToolbar() {
    if (document.querySelector(".hd-toolbar")) return;

    var toolbar = document.createElement("div");
    toolbar.className = "hd-toolbar";

    // Left section
    var left = document.createElement("div");
    left.className = "hd-toolbar-left";

    // Clock
    var clock = document.createElement("span");
    clock.className = "hd-clock";
    left.appendChild(clock);

    // Search button
    var searchBtn = document.createElement("div");
    searchBtn.className = "hd-search-btn";
    searchBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Search <kbd>Ctrl+K</kbd>';
    searchBtn.addEventListener("click", function () {
      if (window.hdCommand) {
        window.hdCommand.open();
      }
    });
    left.appendChild(searchBtn);

    toolbar.appendChild(left);

    // Right section
    var right = document.createElement("div");
    right.className = "hd-toolbar-right";

    // Dark mode toggle
    var darkBtn = document.createElement("button");
    darkBtn.className = "hd-tb-btn hd-dark-toggle";
    darkBtn.title = "Toggle theme";
    darkBtn.addEventListener("click", function () {
      if (window.hdThemeMode) window.hdThemeMode.toggle();
    });
    right.appendChild(darkBtn);

    // Quick nav: Home
    var homeBtn = document.createElement("button");
    homeBtn.className = "hd-tb-btn";
    homeBtn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
    homeBtn.title = "Home";
    homeBtn.addEventListener("click", function () {
      frappe.set_route("");
    });
    right.appendChild(homeBtn);

    // Notification bell anchor
    var notifBell = document.createElement("div");
    notifBell.className = "hd-notif-bell";
    var bellBtn = document.createElement("button");
    bellBtn.className = "hd-tb-btn";
    bellBtn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
    bellBtn.title = "Notifications";
    bellBtn.addEventListener("click", function () {
      if (window.hdNotifications) window.hdNotifications.toggle();
    });
    notifBell.appendChild(bellBtn);
    var badge = document.createElement("span");
    badge.className = "hd-badge";
    badge.style.display = "none";
    notifBell.appendChild(badge);
    right.appendChild(notifBell);

    // Divider
    var div = document.createElement("div");
    div.className = "hd-divider";
    right.appendChild(div);

    // User avatar
    var userBtn = document.createElement("button");
    userBtn.className = "hd-user-btn";
    var user =
      frappe.boot && frappe.boot.user
        ? frappe.boot.user
        : { name: "U", fullname: "User" };
    var initials = (user.fullname || "U").charAt(0).toUpperCase();
    // Try first letters of first/last name
    var parts = (user.fullname || "").split(" ");
    if (parts.length >= 2) {
      initials = (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    userBtn.textContent = initials;
    userBtn.title = user.fullname || "User";
    userBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      showUserDropdown(userBtn);
    });
    right.appendChild(userBtn);

    toolbar.appendChild(right);

    // Insert after navbar
    var navbar = document.querySelector(".navbar");
    if (navbar && navbar.parentNode) {
      navbar.parentNode.insertBefore(toolbar, navbar.nextSibling);
    } else {
      var pageContainer = document.querySelector(".page-container");
      if (pageContainer) {
        pageContainer.parentNode.insertBefore(toolbar, pageContainer);
      } else {
        document.body.insertBefore(toolbar, document.body.firstChild);
      }
    }

    // Start clock
    updateClock(clock);
    setInterval(function () {
      updateClock(clock);
    }, 1000);

    // Update dark toggle icon
    if (window.hdThemeMode) {
      window.hdThemeMode._updateToggleIcon(
        window.hdThemeMode.current()
      );
    }
  }

  function updateClock(el) {
    var now = new Date();
    var h = now.getHours().toString().padStart(2, "0");
    var m = now.getMinutes().toString().padStart(2, "0");
    el.textContent = h + ":" + m;
  }

  function showUserDropdown(anchor) {
    var existing = document.querySelector(".hd-user-dropdown");
    if (existing) {
      existing.remove();
      return;
    }

    var dd = document.createElement("div");
    dd.className = "dropdown-menu hd-user-dropdown";
    dd.style.cssText =
      "position:fixed;top:" +
      (anchor.getBoundingClientRect().bottom + 4) +
      "px;right:16px;min-width:220px;z-index:1070;";

    var user = frappe.boot.user || {};
    dd.innerHTML =
      '<div style="padding:12px 16px;border-bottom:1px solid var(--hd-border);font-weight:600;font-size:13px;">' +
      (user.fullname || "User") +
      '<br><span style="font-weight:400;font-size:11px;color:var(--hd-text-muted)">' +
      (user.email || "") +
      "</span></div>" +
      '<li><a onclick="frappe.set_route(\'Form\',\'User\',\'' +
      (user.name || "") +
      '\')">Edit Profile</a></li>' +
      '<li><a onclick="window.hdThemeMode?hdThemeMode.toggle():''">Toggle Theme</a></li>' +
      '<li><a onclick="frappe.call({method:\'helios_desk.api.reset_workspace_for_user\',callback:function(){frappe.show_alert(\'Layout Reset\');location.reload()}})">Reset Layout</a></li>' +
      '<li class="divider"></li>' +
      '<li><a href="/?cmd=web_logout">Logout</a></li>';

    document.body.appendChild(dd);

    setTimeout(function () {
      document.addEventListener(
        "click",
        function close(e) {
          if (!dd.contains(e.target) && e.target !== anchor) {
            dd.remove();
            document.removeEventListener("click", close);
          }
        },
        { once: false }
      );
    }, 0);
  }

  // Init on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildToolbar);
  } else {
    buildToolbar();
  }
})();
