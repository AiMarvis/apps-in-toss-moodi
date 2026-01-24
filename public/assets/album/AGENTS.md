<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# album

## Purpose
Album art SVG files for each of the 6 emotions. Used as visual representation for generated tracks.

## Key Files

| File | Description |
|------|-------------|
| `album_sad.svg` | Album art for sad emotion (blue tones) |
| `album_anxious.svg` | Album art for anxious emotion (purple tones) |
| `album_angry.svg` | Album art for angry emotion (red tones) |
| `album_depressed.svg` | Album art for depressed emotion (gray tones) |
| `album_tired.svg` | Album art for tired emotion (amber tones) |
| `album_calm.svg` | Album art for calm emotion (green tones) |

## For AI Agents

### Working In This Directory
- All files are SVG format for scalability
- Color schemes match emotion colors in constants
- Referenced via `/assets/album/album_{emotion}.svg` paths
- May also be uploaded to Cloud Storage for backend use

### Testing Requirements
- Verify all 6 emotion SVGs exist
- Check rendering at different sizes

### Common Patterns
- Naming: `album_{emotion}.svg`
- Consistent sizing across all files

<!-- MANUAL: -->
