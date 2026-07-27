import frappe


def add_boot_data(bootinfo):
    """Inject HeliosDesk settings into boot session."""
    try:
        settings = frappe.get_single("Helios Theme Settings")
    except Exception:
        return

    bootinfo.hd_settings = {
        "company_name": settings.company_name or "HeliosDesk",
        "primary_color": settings.primary_color or "#6366F1",
        "brand_style": settings.brand_style or "Modern",
        "sidebar_style": settings.sidebar_style or "Gradient",
        "navbar_style": settings.navbar_style or "Frosted",
        "default_theme_mode": settings.default_theme_mode or "Light",
        "default_density": settings.default_density or "Comfortable",
        "default_font_scale": settings.default_font_scale or 100,
        "enable_command_palette": bool(settings.enable_command_palette),
        "enable_smart_home": bool(settings.enable_smart_home),
        "enable_progressive_forms": bool(settings.enable_progressive_forms),
        "enable_real_time_broadcast": bool(settings.enable_real_time_broadcast),
    }

    branding = _get_branding(settings)
    bootinfo.hd_branding = branding
    bootinfo.hd_install_key = str(frappe.utils.now())[:10]


def _get_branding(settings):
    return {
        "company_name": settings.company_name or "",
        "logo": settings.logo if settings.logo else "",
        "favicon": settings.favicon if settings.favicon else "",
        "tagline": settings.company_tagline or "",
    }
