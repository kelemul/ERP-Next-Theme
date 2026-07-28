frappe.ui.form.on("Helios Theme Preset", {
    refresh: function (frm) {
        frm.add_custom_button(__("Apply Preset"), function () {
            frappe.call({
                method: "helios_desk.api.apply_preset",
                args: { preset_name: frm.doc.name },
                callback: function () {
                    frappe.show_alert({
                        message: __("Preset applied and broadcast"),
                        indicator: "green",
                    });
                },
            });
        });
    },
});
