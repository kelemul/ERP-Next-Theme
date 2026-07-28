<p align="center">
  <img src="https://img.shields.io/badge/Frappe-15%2B-blue?style=for-the-badge&logo=frappe" alt="Frappe">
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="MIT License">
  <img src="https://img.shields.io/github/v/release/kelemul/ERP-Next-Theme?style=for-the-badge" alt="Release">
  <img src="https://img.shields.io/github/stars/kelemul/ERP-Next-Theme?style=for-the-badge" alt="Stars">
</p>

<h1 align="center">☀️ HeliosDesk — Premium Theme for Frappe / ERPNext</h1>

<p align="center">
  A modern, performance-optimised theme with server-side palette generation, AI command palette,<br>
  smart home dashboard, real-time broadcast, and a flash-free loading experience.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#support">Support ☕</a>
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Server-Side Palette** | CSS custom properties generated in Python (colorsys) — no `color-mix()`, works in every browser |
| 🌙 **Dark Mode** | Light / Dark / Auto (follows OS preference) with zero flash |
| 📏 **Three Densities** | Comfortable, Compact, Ultra-Compact — each user picks their preference |
| 🔍 **Command Palette** | Ctrl+K search across modules, actions, and recently viewed documents |
| 🔔 **Notification Panel** | Slide-in panel with All / Unread / Mentions tabs |
| 🏠 **Smart Home Dashboard** | KPI cards, quick-create grid, pending items, recent documents |
| 🪟 **Glass Effects** | Frosted navbar, dropdowns, and modals with `backdrop-filter` |
| 📱 **Progressive Forms** | Collapse less-used fields behind "Show more" toggles |
| 🏷️ **White-Label Branding** | Company name, logo, favicon — configured in one place |
| ⚡ **Flash-Free Init** | Inline IIFE runs before DOM paint — no theme flicker |
| 🔄 **Real-Time Broadcast** | Theme updates pushed to all connected users instantly |
| ♿ **Accessible** | Respects `prefers-reduced-motion`, supports keyboard navigation |
| 🖨️ **Print-Ready** | Clean print styles hide chrome, keep content |

## 📸 Screenshots

> _Screenshots coming soon. Contributions welcome!_

## 🚀 Installation

### Prerequisites

- Frappe Bench v5+ (Frappe v15+)
- Python 3.10+

### Install the app

```bash
# Navigate to your bench directory
cd ~/frappe-bench

# Get the app
bench get-app https://github.com/kelemul/ERP-Next-Theme.git

# Install on your site
bench --site your-site.com install-app helios_desk

# Run migration to sync doctypes
bench --site your-site.com migrate

# Build assets
bench build
```

### Upgrade

```bash
bench get-app --branch master https://github.com/kelemul/ERP-Next-Theme.git
bench --site your-site.com migrate
bench build
bench clear-cache
```

## 🎨 Usage

1. Go to **HeliosDesk Theme > Helios Theme Settings**
2. Set your **Primary Color**, **Brand Style**, **Sidebar Style**, **Navbar Style**
3. Click **Apply Theme Now** — the theme applies instantly to all users
4. Each user can override their **density** and **font size** via the gear icon in the toolbar

### Save & Share Presets

1. Go to **HeliosDesk Theme > Helios Theme Preset**
2. Create presets with different colour schemes
3. Click **Apply Preset** to broadcast to all users

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+K` | Command palette |
| `Ctrl+Shift+T` | Toggle theme mode |
| `Ctrl+Shift+D` | Cycle display density |
| `Ctrl+Shift+F` | Increase font size |
| `Ctrl+Shift+L` | Toggle sidebar |
| `Ctrl+Shift+H` | Go to home |

## ⚙️ Configuration

All settings are managed through **Helios Theme Settings** (single doctype, System Manager only).

| Field | Description |
|---|---|
| **Primary Color** | Brand colour — the palette generator derives 9 shades automatically |
| **Brand Style** | Modern, Classic, Minimal, Bold, Warm |
| **Sidebar Style** | Gradient, Solid, Frosted |
| **Navbar Style** | Frosted, Solid, Colored |
| **Default Theme Mode** | Light / Dark / Auto (new users inherit this) |
| **Default Density** | Comfortable / Compact / Ultra-Compact |
| **Custom CSS / JS** | Inject your own overrides |

## 🧑‍💻 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing`)
5. Open a Pull Request

## 🧪 Development

```bash
# Clone and set up
bench get-app https://github.com/kelemul/ERP-Next-Theme.git
bench --site dev.local install-app helios_desk

# Watch for changes
bench watch
```

## ☕ Support

If HeliosDesk helps your business, consider supporting its development:

<p align="center">
  <a href="https://www.buymeacoffee.com/kelemul">
    <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee">
  </a>
  <a href="https://github.com/sponsors/kelemul">
    <img src="https://img.shields.io/badge/GitHub%20Sponsors-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="GitHub Sponsors">
  </a>
</p>

## 📄 License

**HeliosDesk** is released under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/kelemul">kelemul</a>
</p>
