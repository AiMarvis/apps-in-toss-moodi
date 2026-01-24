<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# styles

## Purpose
Global CSS styles and design tokens. Provides app-wide styling foundation using CSS custom properties.

## Key Files

| File | Description |
|------|-------------|
| `global.css` | Global styles, CSS reset, and base typography |
| `tokens.css` | TDS (Toss Design System) design tokens - colors, spacing, typography scales as CSS custom properties |

## For AI Agents

### Working In This Directory
- Use CSS custom properties (variables) for theming
- TDS tokens follow Toss design guidelines
- Import `global.css` once in App.tsx
- Tokens should be used throughout components

### Testing Requirements
- Verify CSS variables are applied correctly
- Test on different screen sizes

### Common Patterns
- CSS custom properties for colors: `--color-*`
- Spacing tokens: `--spacing-*`
- Typography: `--font-*`
- Use `var(--token-name)` in component styles

## Dependencies

### External
- Follows Toss Design System conventions

<!-- MANUAL: -->
