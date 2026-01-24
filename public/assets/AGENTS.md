<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# assets (public)

## Purpose
Public static assets organized by type. Contains album artwork, emotion icons, and other visual assets.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `album/` | Album art SVGs for each emotion (see `album/AGENTS.md`) |
| `emotions/` | Emotion icon assets |
| `icons/` | UI icons and app icons |

## For AI Agents

### Working In This Directory
- All assets are served at `/assets/*` URLs
- Prefer SVG for illustrations and icons
- Optimize images for mobile performance
- Follow consistent naming conventions

### Testing Requirements
- Verify assets load correctly in browser
- Check file sizes are reasonable

### Common Patterns
- Naming: `{type}_{emotion}.svg` for emotion-specific assets
- Use descriptive folder structure

<!-- MANUAL: -->
