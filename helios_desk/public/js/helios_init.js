/*
 * HELIOSDESK — Flash-Free Initializer
 * Runs synchronously before DOM paint to prevent theme flash.
 */
(function () {
  "use strict";

  // 1. Theme mode (light/dark/auto)
  var mode = localStorage.getItem("hd_theme_mode") || "Light";
  // Backward compat: old "Auto" → "Automatic"
  if (mode === "Auto") mode = "Automatic";
  if (mode === "Automatic") {
    mode = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "Dark"
      : "Light";
  }
  if (mode === "Dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.backgroundColor = "#0F172A";
  }

  // 2. Density
  var density = localStorage.getItem("hd_density") || "Comfortable";
  document.documentElement.setAttribute("data-density", density);

  // 3. Font scale
  var fontScale = localStorage.getItem("hd_font_scale");
  if (fontScale) {
    document.documentElement.style.fontSize = fontScale + "%";
  }

  // 4. Sidebar state
  var sidebarExpanded =
    localStorage.getItem("hd_sidebar_expanded") !== "false";
  if (!sidebarExpanded) {
    document.documentElement.classList.add("hd-sidebar-collapsed");
  }

  // 5. Inline theme CSS from cache (if available)
  var cachedCSS = localStorage.getItem("hd_theme_css");
  if (cachedCSS) {
    var style = document.createElement("style");
    style.id = "hd-dynamic-theme";
    style.textContent = cachedCSS;
    document.head.appendChild(style);
  }
})();
