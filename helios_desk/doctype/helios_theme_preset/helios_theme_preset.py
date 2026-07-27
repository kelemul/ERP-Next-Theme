import frappe
from frappe.model.document import Document


class HeliosThemePreset(Document):
    def validate(self):
        if self.is_default:
            frappe.db.set_value(
                "Helios Theme Preset",
                {"is_default": 1, "name": ("!=", self.name)},
                "is_default",
                0,
            )
