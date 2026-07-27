/*
 * HELIOSDESK — Sidebar Controller
 */
(function () {
  "use strict";

  function initSidebar() {
    var container = document.querySelector(".sidebar-container");
    if (!container) return;

    // Add header with logo + company name
    var header = document.createElement("div");
    header.className = "sidebar-header";

    var logo = document.createElement("div");
    logo.className = "hd-logo";
    logo.textContent = "H"; // Will be replaced by branding

    var name = document.createElement("span");
    name.className = "hd-company-name";
    name.textContent = "HeliosDesk";

    header.appendChild(logo);
    header.appendChild(name);

    var existingHeader = container.querySelector(".sidebar-header");
    if (!existingHeader) {
      container.insertBefore(header, container.firstChild);
    }

    // Collapse toggle button
    var collapseBtn = document.createElement("div");
    collapseBtn.className = "sidebar-collapse-btn";
    collapseBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>';

    collapseBtn.addEventListener("click", function () {
      var isExpanded = container.classList.toggle("collapsed");
      document.documentElement.classList.toggle(
        "hd-sidebar-collapsed",
        !isExpanded
      );
      localStorage.setItem("hd_sidebar_expanded", !isExpanded);
      // Dispatch event for Frappe
      frappe.events && frappe.events.trigger("sidebar_collapse", isExpanded);
    });

    var existingCollapse = container.querySelector(".sidebar-collapse-btn");
    if (!existingCollapse) {
      container.appendChild(collapseBtn);
    }

    // Restore collapsed state
    if (document.documentElement.classList.contains("hd-sidebar-collapsed")) {
      container.classList.add("collapsed");
    }
  }

  // Wait for DOM and Frappe sidebar
  function waitAndInit() {
    if (document.querySelector(".sidebar-container")) {
      initSidebar();
    } else {
      var observer = new MutationObserver(function () {
        if (document.querySelector(".sidebar-container")) {
          initSidebar();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitAndInit);
  } else {
    waitAndInit();
  }
})();
