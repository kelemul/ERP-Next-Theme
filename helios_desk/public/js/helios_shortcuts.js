/*
 * HELIOSDESK — Keyboard Shortcuts
 * Active only on desk pages, not the login screen.
 */
(function () {
  "use strict";

  function initShortcuts() {
    document.addEventListener("keydown", function (e) {
      // Skip if focus is in input/textarea
      var tag = e.target && e.target.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        e.target.isContentEditable
      )
        return;

      // Skip if command palette is open
      var cmdOverlay = document.getElementById("hd-command-overlay");
      if (cmdOverlay && cmdOverlay.style.display === "block") return;

      var ctrl = e.ctrlKey || e.metaKey;

      // Ctrl+Shift+D — toggle density
      if (ctrl && e.shiftKey && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        if (window.hdDensity) {
          window.hdDensity.toggle();
          frappe.show_alert({
            message:
              "Density: " + window.hdDensity.current(),
            indicator: "green",
          });
        }
      }

      // Ctrl+Shift+F — toggle font size
      if (ctrl && e.shiftKey && (e.key === "F" || e.key === "f")) {
        e.preventDefault();
        if (window.hdFont) {
          window.hdFont.increase();
          frappe.show_alert({
            message:
              "Font: " + window.hdFont.current() + "%",
            indicator: "blue",
          });
        }
      }

      // Ctrl+Shift+L — toggle sidebar
      if (ctrl && e.shiftKey && (e.key === "L" || e.key === "l")) {
        e.preventDefault();
        var sb = document.querySelector(".sidebar-collapse-btn");
        if (sb) sb.click();
      }

      // Ctrl+Shift+T — toggle theme
      if (ctrl && e.shiftKey && (e.key === "t" || e.key === "T")) {
        e.preventDefault();
        if (window.hdThemeMode) {
          window.hdThemeMode.toggle();
          frappe.show_alert({
            message:
              "Theme: " + window.hdThemeMode.current(),
            indicator: "orange",
          });
        }
      }

      // Ctrl+Shift+H — go home
      if (ctrl && e.shiftKey && (e.key === "H" || e.key === "h")) {
        e.preventDefault();
        frappe.set_route("");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShortcuts);
  } else {
    initShortcuts();
  }
})();
