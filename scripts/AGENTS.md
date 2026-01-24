<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# scripts

## Purpose
Development and build scripts for the Moodi project. Contains custom dev server launchers and deployment utilities.

## Key Files

| File | Description |
|------|-------------|
| `dev.mjs` | Standard Vite development server launcher |
| `granite-dev.mjs` | Granite (AppsInToss) development server with platform features |
| `copy-to-local.sh` | Shell script for copying files locally |

## For AI Agents

### Working In This Directory
- Scripts are Node.js ES modules (.mjs)
- `npm run dev` uses `granite-dev.mjs` by default
- `npm run dev:vite` uses standard Vite server

### Testing Requirements
- Test scripts manually by running them
- Verify dev server starts correctly

### Common Patterns
- Use ES module syntax (import/export)
- Exit gracefully on errors

## Dependencies

### External
- `vite` - Dev server
- Granite CLI tools for AppsInToss development

<!-- MANUAL: -->
