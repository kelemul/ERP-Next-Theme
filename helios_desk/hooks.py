app_name = "helios_desk"
app_title = "HeliosDesk Theme"
app_publisher = "HeliosDesk"
app_description = "Premium modern theme for Frappe / ERPNext"
app_email = "support@heliosdesk.io"
app_license = "MIT"
app_url = "https://heliosdesk.io"

required_apps = ["frappe"]

after_install = "helios_desk.setup.after_install"
after_migrate = "helios_desk.setup.after_migrate"

boot_session = "helios_desk.boot.add_boot_data"

doc_events = {
    "Helios Theme Settings": {
        "after_save": "helios_desk.events.theme_settings_after_save",
    },
}

# ---------------------------------------------------------------------------
#  Asset registration — load order matters
# ---------------------------------------------------------------------------

app_include_css = [
    # 1. Base design tokens + Frappe bridge (loaded first)
    "/assets/helios_desk/css/helios_base.css",
    # 2. Layout components
    "/assets/helios_desk/css/helios_sidebar.css",
    "/assets/helios_desk/css/helios_navbar.css",
    "/assets/helios_desk/css/helios_forms.css",
    "/assets/helios_desk/css/helios_tables.css",
    "/assets/helios_desk/css/helios_modals.css",
    "/assets/helios_desk/css/helios_cards.css",
    # 3. Feature styles
    "/assets/helios_desk/css/helios_command.css",
    "/assets/helios_desk/css/helios_notifications.css",
    "/assets/helios_desk/css/helios_smart_home.css",
    "/assets/helios_desk/css/helios_progressive.css",
    "/assets/helios_desk/css/helios_login.css",
    # 4. Density + dark mode (override everything)
    "/assets/helios_desk/css/helios_density.css",
    "/assets/helios_desk/css/helios_dark.css",
    # 5. Polish — motion, glass, refinements
    "/assets/helios_desk/css/helios_polish.css",
]

app_include_js = [
    # 1. Flash-free IIFE (runs before DOM paint)
    "/assets/helios_desk/js/helios_init.js",
    # 2. Core modules
    "/assets/helios_desk/js/helios_dark.js",
    "/assets/helios_desk/js/helios_density.js",
    "/assets/helios_desk/js/helios_font.js",
    "/assets/helios_desk/js/helios_brand.js",
    # 3. UI components
    "/assets/helios_desk/js/helios_toolbar.js",
    "/assets/helios_desk/js/helios_sidebar.js",
    "/assets/helios_desk/js/helios_options.js",
    "/assets/helios_desk/js/helios_command.js",
    "/assets/helios_desk/js/helios_notifications.js",
    "/assets/helios_desk/js/helios_smart_home.js",
    "/assets/helios_desk/js/helios_progressive.js",
    "/assets/helios_desk/js/helios_modules.js",
    "/assets/helios_desk/js/helios_shortcuts.js",
    # 5. Main bootstrap (loads theme CSS, applies boot prefs)
    "/assets/helios_desk/js/helios.js",
    # 6. Login page (web context)
    "/assets/helios_desk/js/helios_login.js",
]

web_include_css = ["/assets/helios_desk/css/helios_login.css"]
web_include_js = ["/assets/helios_desk/js/helios_login.js"]

fixtures = [
    {
        "dt": "Custom Field",
        "filters": [["dt", "in", ["User"]]],
    },
]

scheduler_events = {
    "daily": [],
}

has_permission = {
    "Helios Theme Settings": "helios_desk.api.has_permission",
}

permission_query_conditions = {
    "Helios Theme Settings": "helios_desk.api.permission_query",
}
