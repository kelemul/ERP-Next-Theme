/*
 * HELIOSDESK — Dark Mode Controller
 */
(function () {
  "use strict";

  window.hdThemeMode = {
    current: function () {
      return localStorage.getItem("hd_theme_mode") || "Light";
    },

    resolve: function (mode) {
      if (mode === "Auto") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "Dark"
          : "Light";
      }
      return mode;
    },

    set: function (mode) {
      var resolved = this.resolve(mode);
      localStorage.setItem("hd_theme_mode", mode);

      if (resolved === "Dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        document.documentElement.style.backgroundColor = "#0F172A";
      } else {
        document.documentElement.removeAttribute("data-theme");
        document.documentElement.style.backgroundColor = "";
      }

      // Persist to server (avoid frappe.client.set_value conflicts)
      frappe.call({
        method: "helios_desk.api.set_user_theme",
        args: { mode: mode },
        silent: true,
      });

      this._updateToggleIcon(mode);
    },

    toggle: function () {
      var modes = ["Light", "Dark", "Auto"];
      var cur = this.current();
      var idx = modes.indexOf(cur);
      var next = modes[(idx + 1) % modes.length];
      this.set(next);
    },

    _updateToggleIcon: function (mode) {
      var btn = document.querySelector(".hd-dark-toggle");
      if (!btn) return;
      var icons = { Light: "☀️", Dark: "🌙", Auto: "🌓" };
      btn.textContent = icons[mode] || "🌓";
      btn.title = "Theme: " + mode + " (click to cycle)";
    },

    init: function () {
      var self = this;

      // Listen for OS preference changes in Auto mode
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", function () {
          if (self.current() === "Auto") {
            self.set("Auto");
          }
        });

      // Listen for realtime theme changes
      if (frappe.realtime) {
        frappe.realtime.on("hd_theme_changed", function (data) {
          if (data.css) {
            var style =
              document.getElementById("hd-dynamic-theme") ||
              document.createElement("style");
            style.id = "hd-dynamic-theme";
            style.textContent = data.css;
            if (!style.parentNode) document.head.appendChild(style);
            localStorage.setItem("hd_theme_css", data.css);
          }
        });
      }
    },
  };

  // Init on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      window.hdThemeMode.init();
    });
  } else {
    window.hdThemeMode.init();
  }
})();
