<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# components

## Purpose
Reusable React components organized by feature domain. Contains UI building blocks used across multiple pages.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `calendar/` | Calendar view components (see `calendar/AGENTS.md`) |
| `common/` | Shared UI components used throughout the app (see `common/AGENTS.md`) |
| `credit/` | Credit display and purchase components (see `credit/AGENTS.md`) |
| `player/` | Music player components (see `player/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Components should be presentational when possible
- Use CSS modules for styling (co-located .css files)
- Props interfaces should be defined in the component file
- Export components via barrel exports if needed

### Testing Requirements
- Test components render correctly with various props
- Verify responsive behavior on different screen sizes

### Common Patterns
- Functional components with TypeScript
- Destructured props with type annotations
- Korean text for all user-facing strings
- TDS design tokens for colors/spacing

## Dependencies

### Internal
- `types/` - Shared type definitions
- `constants/` - Emotion and product constants
- `styles/` - Global CSS variables

### External
- `react` - Component framework

<!-- MANUAL: -->
