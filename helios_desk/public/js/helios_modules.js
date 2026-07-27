/*
 * HELIOSDESK — Module Grid Enhancer
 * Adds visual polish to the module workspace grid.
 */
(function () {
  "use strict";

  function enhanceModuleGrid() {
    var grid = document.querySelector(".module-grid");
    if (!grid) return;
    if (grid.classList.contains("hd-enhanced")) return;
    grid.classList.add("hd-enhanced");

    // Add module icons based on Frappe boot data
    var icons = {};
    if (frappe.boot && frappe.boot.doctype_icon) {
      icons = frappe.boot.doctype_icon;
    }

    grid.querySelectorAll(".module-grid-item").forEach(function (item) {
      var link = item.getAttribute("data-module") ||
        (item.querySelector("a") &&
          item
            .querySelector("a")
            .getAttribute("data-module-name")) ||
        item.textContent.trim();

      // Add data-module attribute
      item.setAttribute("data-module", link);

      // Apply icon background
      var icon = icons[link];
      if (icon) {
        item.style.setProperty("--hd-module-icon", "'" + icon + "'");
        var iconEl = document.createElement("span");
        iconEl.className = "hd-module-icon";
        iconEl.textContent = icon;
        if (!item.querySelector(".hd-module-icon")) {
          item.insertBefore(iconEl, item.firstChild);
        }
      }
    });
  }

  // Watch for route changes
  function watchRoute() {
    if (frappe.events) {
      frappe.events.on("route_options_set", function () {
        setTimeout(enhanceModuleGrid, 300);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      enhanceModuleGrid();
      watchRoute();
    });
  } else {
    enhanceModuleGrid();
    watchRoute();
  }
})();
