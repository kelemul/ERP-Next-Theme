frappe.ui.form.on("Helios Theme Settings", {
    refresh: function (frm) {
        // Preview button
        frm.add_custom_button(__("Preview Theme"), function () {
            frappe.call({
                method: "helios_desk.api.get_theme_css",
                args: { primary_color: frm.doc.primary_color || "#6366F1" },
                callback: function (r) {
                    if (r.message) {
                        var existing = document.getElementById("hd-preview-theme");
                        if (existing) existing.remove();
                        var style = document.createElement("style");
                        style.id = "hd-preview-theme";
                        style.textContent = r.message;
                        document.head.appendChild(style);
                        frappe.show_alert({
                            message: __("Theme preview applied. Close to revert."),
                            indicator: "green",
                        });
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
            frm.save("Save", null, null, function () {
                frappe.call({
                    method: "helios_desk.api.broadcast_theme",
                    callback: function () {
                        localStorage.removeItem("hd_theme_css");
                        frappe.show_alert({
                            message: __("Theme applied — reloading..."),
                            indicator: "green",
                        });
                        setTimeout(function () {
                            location.reload();
                        }, 600);
                    },
                });
            });
        });
    },

    primary_color: function (frm) {
        if (frm.doc.primary_color) {
            frappe.call({
                method: "helios_desk.api.get_theme_css",
                args: { primary_color: frm.doc.primary_color },
                callback: function (r) {
                    if (r.message) {
                        var existing = document.getElementById("hd-preview-theme");
                        if (!existing) {
                            existing = document.createElement("style");
                            existing.id = "hd-preview-theme";
                            document.head.appendChild(existing);
                        }
                        existing.textContent = r.message;
                    }
                },
            });
        }
    },
});
