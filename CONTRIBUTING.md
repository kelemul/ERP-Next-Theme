# Contributing to HeliosDesk

Thank you for considering contributing! We welcome bug reports, feature requests, code changes, and documentation improvements.

## Code of Conduct

This project adheres to the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## How to Contribute

### Reporting Bugs

1. Search existing [issues](https://github.com/kelemul/ERP-Next-Theme/issues) first
2. Use the **Bug Report** template
3. Include:
   - Frappe version (`bench version`)
   - HeliosDesk version (from App Versions)
   - Browser and OS
   - Steps to reproduce
   - Expected vs actual behaviour
   - Screenshots if applicable
   - Console errors (F12 > Console)

### Feature Requests

1. Use the **Feature Request** template
2. Describe the problem you're solving
3. Explain the proposed solution clearly
4. Attach mockups or examples if helpful

### Pull Requests

1. Fork the repo and create your branch from `master`
2. Use conventional commit messages:

   | Prefix | Use |
   |---|---|
   | `feat:` | New feature |
   | `fix:` | Bug fix |
   | `refactor:` | Code change that neither fixes nor adds |
   | `style:` | CSS / visual changes only |
   | `docs:` | Documentation only |
   | `perf:` | Performance improvement |
   | `chore:` | Maintenance, deps, config |

3. Keep changes focused — one PR per feature/fix
4. Update `README.md` if introducing new options
5. Ensure your branch is rebased on latest `master`

### Development Setup

```bash
bench get-app https://github.com/kelemul/ERP-Next-Theme.git
bench --site dev.local install-app helios_desk
bench watch
```

### CSS Guidelines

- Use `var(--hd-*)` custom properties from `helios_base.css`
- Place new component styles in existing files by category
- Keep overrides to a minimum — prefer themed variables
- Test in both light and dark mode

### JavaScript Guidelines

- All modules are IIFE-wrapped for encapsulation
- Use `window.hd*` namespace for public APIs
- Dependencies load in order via `hooks.py`
- Keep the flash-free `helios_init.js` as lean as possible

## Need Help?

Open a [Discussion](https://github.com/kelemul/ERP-Next-Theme/discussions) or join the conversation on existing issues.
