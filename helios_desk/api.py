import frappe
from frappe import _
import colorsys
import json


# ---------------------------------------------------------------------------
#  Server-side colour-palette generator
#  Superior to CSS color-mix() — works in ALL browsers, zero client cost
# ---------------------------------------------------------------------------
def hex_to_rgb(hex_str):
    h = hex_str.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def rgb_to_hex(r, g, b):
    return f"#{int(r):02x}{int(g):02x}{int(b):02x}"


def lighten(hex_str, factor):
    """Factor 0-1, 0 = unchanged, 1 = white"""
    r, g, b = hex_to_rgb(hex_str)
    r += (255 - r) * factor
    g += (255 - g) * factor
    b += (255 - b) * factor
    return rgb_to_hex(r, g, b)


def darken(hex_str, factor):
    """Factor 0-1, 0 = unchanged, 1 = black"""
    r, g, b = hex_to_rgb(hex_str)
    r -= r * factor
    g -= g * factor
    b -= b * factor
    return rgb_to_hex(r, g, b)


def mix(hex1, hex2, weight=0.5):
    """weight 0 = hex1, 1 = hex2"""
    r1, g1, b1 = hex_to_rgb(hex1)
    r2, g2, b2 = hex_to_rgb(hex2)
    r = r1 + (r2 - r1) * weight
    g = g1 + (g2 - g1) * weight
    b = b1 + (b2 - b1) * weight
    return rgb_to_hex(r, g, b)


def get_contrast_text(hex_str):
    """Return black or white depending on luminance"""
    r, g, b = hex_to_rgb(hex_str)
    lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return "#0F172A" if lum > 0.5 else "#FFFFFF"


def build_palette(brand, accent):
    """Generate a full colour palette from brand + accent colours."""
    return {
        # Brand scale
        "--hd-brand": brand,
        "--hd-brand-50": lighten(brand, 0.92),
        "--hd-brand-100": lighten(brand, 0.82),
        "--hd-brand-200": lighten(brand, 0.62),
        "--hd-brand-300": lighten(brand, 0.42),
        "--hd-brand-400": lighten(brand, 0.22),
        "--hd-brand-500": brand,
        "--hd-brand-600": darken(brand, 0.12),
        "--hd-brand-700": darken(brand, 0.25),
        "--hd-brand-800": darken(brand, 0.40),
        "--hd-brand-900": darken(brand, 0.55),
        "--hd-brand-text": get_contrast_text(brand),
        # Accent scale
        "--hd-accent": accent,
        "--hd-accent-50": lighten(accent, 0.92),
        "--hd-accent-100": lighten(accent, 0.80),
        "--hd-accent-200": lighten(accent, 0.60),
        "--hd-accent-300": lighten(accent, 0.40),
        "--hd-accent-400": lighten(accent, 0.20),
        "--hd-accent-500": accent,
        "--hd-accent-600": darken(accent, 0.12),
        "--hd-accent-700": darken(accent, 0.25),
        "--hd-accent-hover": darken(accent, 0.10),
        "--hd-accent-text": get_contrast_text(accent),
        # Semantic (light mode)
        "--hd-bg": "#F8FAFC",
        "--hd-bg-alt": "#F1F5F9",
        "--hd-surface": "#FFFFFF",
        "--hd-surface-hover": "#F8FAFC",
        "--hd-border": "#E2E8F0",
        "--hd-border-light": "#F1F5F9",
        "--hd-text": "#0F172A",
        "--hd-text-secondary": "#475569",
        "--hd-text-muted": "#94A3B8",
        "--hd-sidebar-bg": "#FFFFFF",
        "--hd-sidebar-hover": "#F8FAFC",
        "--hd-sidebar-active": brand,
        "--hd-sidebar-text": "#475569",
        "--hd-sidebar-text-active": get_contrast_text(brand),
        "--hd-navbar-bg": brand,
        "--hd-navbar-text": get_contrast_text(brand),
        "--hd-input-bg": "#FFFFFF",
        "--hd-input-border": "#CBD5E1",
        "--hd-input-focus": brand,
        # Shadows
        "--hd-shadow-sm": "0 1px 2px rgba(15,23,42,0.04)",
        "--hd-shadow-md": "0 4px 12px rgba(15,23,42,0.06)",
        "--hd-shadow-lg": "0 12px 40px rgba(15,23,42,0.08)",
        "--hd-shadow-xl": "0 24px 60px rgba(15,23,42,0.12)",
        # Glass
        "--hd-glass-bg": "rgba(255,255,255,0.72)",
        "--hd-glass-border": "rgba(255,255,255,0.18)",
        "--hd-glass-shadow": "0 8px 32px rgba(15,23,42,0.08)",
    }


def build_dark_palette(brand, accent):
    """Generate dark-mode palette from the same brand + accent."""
    return {
        "--hd-bg": "#0F172A",
        "--hd-bg-alt": "#1E293B",
        "--hd-surface": "#1E293B",
        "--hd-surface-hover": "#273548",
        "--hd-border": "#334155",
        "--hd-border-light": "#1E293B",
        "--hd-text": "#F1F5F9",
        "--hd-text-secondary": "#94A3B8",
        "--hd-text-muted": "#64748B",
        "--hd-sidebar-bg": "#1E293B",
        "--hd-sidebar-hover": "#273548",
        "--hd-sidebar-active": brand,
        "--hd-sidebar-text": "#94A3B8",
        "--hd-sidebar-text-active": get_contrast_text(brand),
        "--hd-navbar-bg": darken(brand, 0.20),
        "--hd-navbar-text": get_contrast_text(darken(brand, 0.20)),
        "--hd-input-bg": "#273548",
        "--hd-input-border": "#475569",
        "--hd-input-focus": brand,
        "--hd-shadow-sm": "0 1px 2px rgba(0,0,0,0.20)",
        "--hd-shadow-md": "0 4px 12px rgba(0,0,0,0.30)",
        "--hd-shadow-lg": "0 12px 40px rgba(0,0,0,0.40)",
        "--hd-shadow-xl": "0 24px 60px rgba(0,0,0,0.50)",
        "--hd-glass-bg": "rgba(30,41,59,0.80)",
        "--hd-glass-border": "rgba(51,65,85,0.40)",
        "--hd-glass-shadow": "0 8px 32px rgba(0,0,0,0.30)",
    }


# ---------------------------------------------------------------------------
#  Public API
# ---------------------------------------------------------------------------

@frappe.whitelist(allow_guest=True)
def get_theme_css(primary_color=None, brand_style=None):
    """Return the full :root { … } CSS block with the computed palette.
    Pass primary_color to preview unsaved changes."""
    try:
        if primary_color:
            brand = primary_color
        else:
            settings = frappe.get_single("Helios Theme Settings")
            brand = settings.primary_color or "#6366F1"
        accent = mix(brand, "#F59E0B", 0.4)
    except Exception:
        brand = "#6366F1"
        accent = "#F59E0B"

    palette = build_palette(brand, accent)
    dark = build_dark_palette(brand, accent)

    lines = [":root {"]
    for key, val in palette.items():
        lines.append(f"  {key}: {val};")
    lines.append("}")

    lines.append('[data-theme="dark"] {')
    for key, val in dark.items():
        lines.append(f"  {key}: {val};")
    lines.append("}")

    # Bridge Frappe's native variables
    lines.append(""":root {
  --primary: var(--hd-brand);
  --primary-color: var(--hd-brand);
  --primary-light: var(--hd-brand-100);
  --btn-primary-bg: var(--hd-brand);
  --bg-color: var(--hd-bg);
  --fg-color: var(--hd-surface);
  --card-bg: var(--hd-surface);
  --bg-light-gray: var(--hd-bg-alt);
  --bg-gray: var(--hd-bg-alt);
  --text-color: var(--hd-text);
  --text-muted: var(--hd-text-muted);
  --text-light: var(--hd-text-secondary);
  --heading-color: var(--hd-text);
  --navbar-bg: var(--hd-navbar-bg);
  --navbar-color: var(--hd-navbar-text);
  --sidebar-bg: var(--hd-sidebar-bg);
  --sidebar-color: var(--hd-sidebar-text);
  --sidebar-select-color: var(--hd-sidebar-active);
  --sidebar-hover-color: var(--hd-sidebar-hover);
  --sidebar-border-color: var(--hd-border);
  --border-color: var(--hd-border);
  --border-radius: 8px;
  --border-radius-sm: 6px;
  --border-radius-md: 12px;
  --control-bg: var(--hd-input-bg);
  --awesome-bar-bg: var(--hd-input-bg);
  --shadow-sm: var(--hd-shadow-sm);
  --shadow-md: var(--hd-shadow-md);
  --shadow-lg: var(--hd-shadow-lg);
}""")

    return "\n".join(lines)


@frappe.whitelist()
def get_branding():
    """Return company name / logo / favicon for white-label."""
    try:
        settings = frappe.get_single("Helios Theme Settings")
    except Exception:
        return {"company_name": "HeliosDesk", "logo": "", "favicon": "", "tagline": ""}
    return {
        "company_name": settings.company_name or "HeliosDesk",
        "logo": settings.logo if settings.logo else "",
        "favicon": settings.favicon if settings.favicon else "",
        "tagline": settings.company_tagline or "",
    }


@frappe.whitelist()
def get_workspaces():
    """Return workspace list (Frappe v15/v16 compatible)."""
    try:
        from frappe.desk.desktop import get_workspaces as _gw
        return _gw()
    except ImportError:
        try:
            from frappe.desk.desktop import get_workspace_sidebar_items as _gw
            return _gw()
        except ImportError:
            return []


@frappe.whitelist()
def get_available_languages():
    return frappe.get_languages()


@frappe.whitelist()
def set_user_language(lang_code):
    frappe.db.set_value("User", frappe.session.user, "language", lang_code)
    frappe.cache().delete_key(f"lang#{frappe.session.user}")
    return "ok"


@frappe.whitelist()
def reset_workspace_for_user():
    frappe.db.delete("User Workspace", {"user": frappe.session.user})
    return "ok"


@frappe.whitelist()
def set_user_theme(mode):
    # Backward compat: old "Auto" → "Automatic"
    if mode == "Auto":
        mode = "Automatic"
    allowed = ["Light", "Dark", "Automatic"]
    if mode not in allowed:
        frappe.throw(_("Invalid theme mode. Use Light, Dark or Automatic."))
    frappe.db.set_value("User", frappe.session.user, "desk_theme", mode)
    return "ok"


@frappe.whitelist()
def get_user_preferences():
    user = frappe.get_doc("User", frappe.session.user)
    return {
        "theme_mode": user.desk_theme or "Light",
        "density": user.get_onload().get("hd_density", "Comfortable"),
        "font_scale": user.get_onload().get("hd_font_scale", 100),
    }


@frappe.whitelist()
def preview_color(color):
    """Return hue offset for a given hex color."""
    r, g, b = hex_to_rgb(color)
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    return {"hue_offset": round((h - 0.5) * 60, 1)}


@frappe.whitelist()
def broadcast_theme():
    """Manually broadcast current theme to all users."""
    from helios_desk.events import _broadcast_theme_update
    _broadcast_theme_update()
    return "ok"


@frappe.whitelist()
def get_kpi_data():
    """Return KPI metrics for Smart Home dashboard."""
    kpis = []
    try:
        todo_count = frappe.db.count("ToDo", {"status": "Open"})
        kpis.append({"label": "Open ToDos", "value": todo_count, "trend": "neutral", "trend_text": "", "route": "List/ToDo"})
    except Exception:
        pass
    try:
        user_count = frappe.db.count("User", {"enabled": 1})
        kpis.append({"label": "Active Users", "value": user_count, "trend": "neutral", "trend_text": "", "route": "List/User"})
    except Exception:
        pass
    return kpis


@frappe.whitelist()
def get_quick_create_list():
    """Return doctypes suitable for quick-create."""
    return ["ToDo", "Event", "Note"]


@frappe.whitelist()
def get_pending_items():
    """Return pending open ToDos for the current user."""
    items = frappe.get_all("ToDo", filters={"status": "Open", "allocated_to": frappe.session.user}, fields=["name", "description", "status", "doctype"], limit=10)
    result = []
    for item in items:
        result.append({"subject": item.description or item.name, "name": item.name, "doctype": "ToDo", "status": item.status})
    return result


@frappe.whitelist()
def get_notifications(tab="all"):
    """Return notifications for the notification panel."""
    notifications = frappe.get_all("Notification Log", filters={"for_user": frappe.session.user}, fields=["*"], limit=20, order_by="creation desc")
    unread_count = frappe.db.count("Notification Log", {"for_user": frappe.session.user, "read": 0})
    return {"notifications": notifications, "unread_count": unread_count}


@frappe.whitelist()
def get_unread_count():
    return frappe.db.count("Notification Log", {"for_user": frappe.session.user, "read": 0})


@frappe.whitelist()
def apply_preset(preset_name):
    """Apply a theme preset to the active Helios Theme Settings."""
    preset = frappe.get_doc("Helios Theme Preset", preset_name)
    settings = frappe.get_single("Helios Theme Settings")
    settings.primary_color = preset.primary_color
    settings.brand_style = preset.brand_style
    settings.sidebar_style = preset.sidebar_style
    settings.navbar_style = preset.navbar_style
    settings.save(ignore_permissions=True)
    broadcast_theme()
    return "ok"


def has_permission(doc, ptype, user):
    if ptype == "read":
        return True
    return "System Manager" in frappe.get_roles(user)


def permission_query(doctype, user):
    if "System Manager" in frappe.get_roles(user):
        return ""
    return "1=0"
