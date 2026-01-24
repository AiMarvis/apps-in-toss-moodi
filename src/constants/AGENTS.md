<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# constants

## Purpose
Application constants including emotion definitions, credit products, and configuration values.

## Key Files

| File | Description |
|------|-------------|
| `emotions.ts` | 6 emotion keywords (sad, anxious, angry, depressed, tired, calm) with labels, emojis, colors, and album art mappings. Also defines credit products for IAP. |

## For AI Agents

### Working In This Directory
- Emotion keywords are the core domain concept
- Each emotion has: id, label (Korean), emoji, color
- Album art paths map to `public/assets/album/` SVGs
- Credit products define IAP SKUs and pricing

### Testing Requirements
- Ensure all emotion IDs match the `EmotionKeyword` type
- Verify album art paths exist

### Common Patterns
- Export typed constants
- Use helper functions like `getEmotionById()`
- Korean labels for UI display

## Dependencies

### Internal
- `types/emotion.ts` - Type definitions

<!-- MANUAL: -->
