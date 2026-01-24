<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# utils (functions)

## Purpose
Helper functions for Firebase Cloud Functions, specifically for music generation content.

## Key Files

| File | Description |
|------|-------------|
| `generators.ts` | Content generators - music prompts, titles, descriptions, and album art URLs for each emotion |

## For AI Agents

### Working In This Directory
- `buildMusicPrompt()` creates Suno API prompts from emotion + user text
- `generateTitle()` picks random Korean title for emotion
- `generateDescription()` returns Korean description
- `getAlbumArt()` returns Cloud Storage URL for album art

### Testing Requirements
- Verify prompts are appropriate for each emotion
- Check title randomization works
- Ensure album art URLs are valid

### Common Patterns
- Emotion-keyed Record objects for mappings
- English prompts for Suno API
- Korean titles/descriptions for UI
- Album art stored in Cloud Storage at fixed URLs

## Dependencies

### Internal
- `../types.ts` - EmotionKeyword type

<!-- MANUAL: -->
