<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# public

## Purpose
Static assets served directly without processing. Contains the HTML entry point, manifest, and public assets like album art and emotion icons.

## Key Files

| File | Description |
|------|-------------|
| `index.html` | HTML entry point (Vite injects app bundle) |
| `manifest.json` | PWA manifest configuration |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `assets/` | Static assets organized by type (see `assets/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Files here are served as-is at the root URL
- Do not put sensitive information in public files
- Large assets should be uploaded to Firebase Storage instead
- Update manifest.json when changing app metadata

### Testing Requirements
- Verify assets load correctly in the browser
- Check manifest.json validity for PWA features

### Common Patterns
- Use absolute paths like `/assets/...` in code
- SVG preferred for icons and illustrations

## Dependencies

### Internal
- Referenced by `src/` components via absolute paths

<!-- MANUAL: -->
