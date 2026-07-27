import frappe


def after_install():
    _seed_defaults()


def after_migrate():
    _seed_defaults()


def _seed_defaults():
    try:
        settings = frappe.get_single("Helios Theme Settings")
        if not settings.creation or settings.creation == frappe.utils.now():
            settings.company_name = settings.company_name or "Your Company"
            settings.primary_color = settings.primary_color or "#6366F1"
            settings.default_theme_mode = "Light"
            settings.default_density = "Comfortable"
            settings.default_font_scale = 100
            settings.enable_command_palette = 1
            settings.enable_smart_home = 1
            settings.enable_progressive_forms = 1
            settings.enable_real_time_broadcast = 1
            settings.save(ignore_permissions=True)
    except Exception:
        frappe.log_error(frappe.get_traceback(), "HeliosDesk Setup Error")
