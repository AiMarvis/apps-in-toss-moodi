<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# types

## Purpose
TypeScript type definitions shared across the application.

## Key Files

| File | Description |
|------|-------------|
| `emotion.ts` | Core domain types - EmotionKeyword, Track, User, EmotionInfo |
| `diary.ts` | Diary/calendar entry types |
| `svg.d.ts` | SVG module declaration for importing .svg files |

## For AI Agents

### Working In This Directory
- Define shared types that are used across multiple modules
- Use `type` for type aliases, `interface` for object shapes
- Export all types for use in other modules
- Keep types close to their domain (emotion-related in emotion.ts)

### Testing Requirements
- Types are checked at compile time
- Ensure consistency between frontend and backend types

### Common Patterns
- `EmotionKeyword` is a union of 6 emotion strings
- `Track` represents a generated music track
- `User` represents the authenticated user
- Use explicit `export` for all types

## Dependencies

### External
- TypeScript's built-in types

<!-- MANUAL: -->
