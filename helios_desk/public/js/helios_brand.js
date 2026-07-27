/*
 * HELIOSDESK — White-Label Branding
 */
(function () {
  "use strict";

  function applyBranding(data) {
    if (!data) return;

    // Company name in sidebar header
    var sidebarHeader = document.querySelector(".sidebar-header .hd-company-name");
    if (sidebarHeader && data.company_name) {
      sidebarHeader.textContent = data.company_name;
    }

    // Logo in sidebar
    var logoImg = document.querySelector(".sidebar-header .hd-logo img");
    var logoDiv = document.querySelector(".sidebar-header .hd-logo");
    if (data.logo && logoImg) {
      logoImg.src = data.logo;
      logoImg.style.display = "block";
      if (logoDiv) logoDiv.style.display = "none";
    } else if (logoDiv && data.company_name) {
      logoDiv.textContent = data.company_name.charAt(0).toUpperCase();
      logoDiv.style.display = "flex";
    }

    // Favicon
    if (data.favicon) {
      var link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = data.favicon;
      document.head.appendChild(link);
    }

    // Document title
    if (data.company_name) {
      document.title = data.company_name + " — " + (data.tagline || "ERP");
    }
  }

  // Try boot data first
  if (
    frappe.boot &&
    frappe.boot.hd_branding &&
    frappe.boot.hd_branding.company_name
  ) {
    applyBranding(frappe.boot.hd_branding);
  } else {
    // Fetch from API
    frappe.call({
      method: "helios_desk.api.get_branding",
      callback: function (r) {
        if (r.message) applyBranding(r.message);
      },
      silent: true,
    });
  }
})();
