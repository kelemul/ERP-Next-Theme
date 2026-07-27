frappe.ui.form.on("Helios Theme Settings", {
    refresh: function (frm) {
        // Preview button
        frm.add_custom_button(__("Preview Theme"), function () {
            frappe.call({
                method: "helios_desk.api.get_theme_css",
                args: { settings_name: frm.doc.name },
                callback: function (r) {
                    if (r.message) {
                        var w = window.open("", "_blank", "width=1400,height=900");
                        w.document.write(
                            "<html><head><style>" +
                            r.message +
                            "</style></head><body>" +
                            "<h1>Theme Preview</h1><p>Apply this CSS and inspect the result.</p>" +
                            "</body></html>"
                        );
                    }
                },
            });
        });

        // Reset to defaults
        frm.add_custom_button(__("Reset to Defaults"), function () {
            frappe.call({
                method: "frappe.client.set_value",
                args: {
                    doctype: "Helios Theme Settings",
                    name: "Helios Theme Settings",
                    fieldname: "primary_color",
                    value: "#6366F1",
                },
                callback: function () {
                    frm.reload_doc();
                },
            });
        });

        // Apply button
        frm.add_custom_button(__("Apply Theme Now"), function () {
            frm.save();
            frappe.call({
                method: "helios_desk.api.broadcast_theme",
                callback: function () {
                    frappe.show_alert({
                        message: __("Theme applied and broadcast to all users"),
                        indicator: "green",
                    });
                },
            });
        });
    },

    primary_color: function (frm) {
        frappe.call({
            method: "helios_desk.api.preview_color",
            args: { color: frm.doc.primary_color },
            callback: function (r) {
                if (r.message) {
                    frm.set_value("primary_hue_offset", r.message.hue_offset);
                }
            },
        });
    },
});
