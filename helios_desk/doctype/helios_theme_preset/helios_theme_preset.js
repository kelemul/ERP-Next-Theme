frappe.ui.form.on("Helios Theme Preset", {
    refresh: function (frm) {
        frm.add_custom_button(__("Apply Preset"), function () {
            frm.save("Save", null, null, function () {
                frappe.call({
                    method: "helios_desk.api.apply_preset",
                    args: { preset_name: frm.doc.name },
                    callback: function () {
                        localStorage.removeItem("hd_theme_css");
                        frappe.show_alert({
                            message: __("Preset applied — reloading..."),
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
});
