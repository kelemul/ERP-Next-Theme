/*
 * HELIOSDESK — Main Application Bootstrap
 * Loads all submodules in dependency order and triggers the final flash-free paint.
 */
(function () {
  "use strict";

  // Mark HeliosDesk as active
  window.__HD_ACTIVE__ = true;
  document.documentElement.classList.add("hd-active");

  // Load theme CSS from server (async)
  function loadThemeCSS() {
    // Only fetch if not already cached
    if (localStorage.getItem("hd_theme_css")) return;

    frappe.call({
      method: "helios_desk.api.get_theme_css",
      callback: function (r) {
        if (r.message) {
          var style =
            document.getElementById("hd-dynamic-theme") ||
            document.createElement("style");
          style.id = "hd-dynamic-theme";
          style.textContent = r.message;
          if (!style.parentNode) document.head.appendChild(style);
          localStorage.setItem("hd_theme_css", r.message);
        }
      },
      silent: true,
    });
  }

  // Apply user preferences from boot data
  function applyBootPreferences() {
    var prefs = frappe.boot && frappe.boot.hd_settings;
    if (!prefs) return;

    if (prefs.theme_mode && window.hdThemeMode) {
      window.hdThemeMode.set(prefs.theme_mode);
    }
    if (prefs.density && window.hdDensity) {
      window.hdDensity.set(prefs.density);
    }
    if (prefs.font_scale && window.hdFont) {
      window.hdFont.set(parseFloat(prefs.font_scale));
    }
  }

  // Init all when DOM is ready
  function init() {
    loadThemeCSS();

    // Wait for Frappe framework
    var checkFrappe = setInterval(function () {
      if (typeof frappe !== "undefined" && frappe.boot) {
        clearInterval(checkFrappe);
        applyBootPreferences();

        // Branding is loaded by helios_brand.js
        // Realtime listeners are set up in helios_dark.js
      }
    }, 50);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
