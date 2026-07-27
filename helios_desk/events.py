import frappe
from helios_desk.api import get_theme_css, get_branding


def theme_settings_after_save(doc, method=None):
    """Broadcast CSS + branding to all connected users in real time."""
    frappe.enqueue(
        "_broadcast_theme_update",
        queue="short",
        timeout=30,
    )


def _broadcast_theme_update():
    try:
        css = get_theme_css()
        branding = get_branding()
        frappe.publish_realtime(
            "hd_theme_changed",
            {"css": css, "branding": branding},
            room="site",
            after_commit=True,
        )
    except Exception:
        frappe.log_error(frappe.get_traceback(), "HeliosDesk broadcast error")
