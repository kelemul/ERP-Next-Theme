/*
 * HELIOSDESK — Font Size Controller
 * Steps: 85, 92.5, 100, 107.5, 115, 125
 */
(function () {
  "use strict";

  var STEPS = [85, 92.5, 100, 107.5, 115, 125];

  window.hdFont = {
    current: function () {
      return parseFloat(localStorage.getItem("hd_font_scale")) || 100;
    },

    set: function (pct) {
      pct = Math.max(75, Math.min(150, pct));
      localStorage.setItem("hd_font_scale", pct);
      document.documentElement.style.fontSize = pct + "%";

      if (frappe.session && frappe.session.user) {
        frappe.call({
          method: "frappe.client.set_value",
          args: {
            doctype: "User",
            name: frappe.session.user,
            fieldname: "hd_font_scale",
            value: pct,
          },
          silent: true,
        });
      }

      document.dispatchEvent(
        new CustomEvent("hd:font-changed", { detail: { scale: pct } })
      );
    },

    increase: function () {
      var cur = this.current();
      for (var i = 0; i < STEPS.length; i++) {
        if (STEPS[i] > cur) {
          this.set(STEPS[i]);
          return;
        }
      }
      this.set(STEPS[STEPS.length - 1]);
    },

    decrease: function () {
      var cur = this.current();
      for (var i = STEPS.length - 1; i >= 0; i--) {
        if (STEPS[i] < cur) {
          this.set(STEPS[i]);
          return;
        }
      }
      this.set(STEPS[0]);
    },

    reset: function () {
      this.set(100);
    },
  };
})();
