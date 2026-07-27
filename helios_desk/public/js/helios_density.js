/*
 * HELIOSDESK — Display Density Controller
 * Three modes: Comfortable, Compact, Ultra-Compact
 */
(function () {
  "use strict";

  window.hdDensity = {
    current: function () {
      return localStorage.getItem("hd_density") || "Comfortable";
    },

    set: function (mode) {
      localStorage.setItem("hd_density", mode);
      document.documentElement.setAttribute("data-density", mode);

      // Persist to User onload
      if (frappe.session && frappe.session.user) {
        frappe.call({
          method: "frappe.client.set_value",
          args: {
            doctype: "User",
            name: frappe.session.user,
            fieldname: "hd_density",
            value: mode,
          },
          silent: true,
        });
      }

      document.dispatchEvent(
        new CustomEvent("hd:density-changed", { detail: { density: mode } })
      );
    },

    toggle: function () {
      var modes = ["Comfortable", "Compact", "Ultra-Compact"];
      var cur = this.current();
      var idx = modes.indexOf(cur);
      var next = modes[(idx + 1) % modes.length];
      this.set(next);
    },

    cycle: function () {
      this.toggle();
    },
  };
})();
