import frappe
from frappe.model.document import Document


class HeliosThemePreset(Document):
    def validate(self):
        if self.is_default:
            others = frappe.get_all(
                "Helios Theme Preset",
                filters={"is_default": 1, "name": ["!=", self.name]},
                pluck="name",
            )
            for o in others:
                frappe.db.set_value("Helios Theme Preset", o, "is_default", 0)
