<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# player

## Purpose
Music player components for audio playback functionality.

## Key Files

| File | Description |
|------|-------------|
| `MusicPlayer.tsx` | Full-featured music player with album art, play/pause, progress display, restart, and action buttons |
| `MusicPlayer.css` | Player styles with emotion-themed colors |

## For AI Agents

### Working In This Directory
- Uses HTML5 Audio element (hidden)
- No seek bar - only play/pause and restart
- Emotion color applied via CSS custom property
- Auto-play attempted on mount (may fail due to browser policy)
- Warning banner informs users to keep screen on

### Testing Requirements
- Test audio playback works correctly
- Verify progress bar updates
- Test with different emotion colors
- Check autoplay behavior

### Common Patterns
- `useRef` for audio element access
- `useState` for playback state
- `useEffect` for autoplay on track change
- Time formatting utility function
- Dynamic CSS variables for theming

## Dependencies

### Internal
- `types/emotion.ts` - Track type
- `constants/emotions.ts` - `getEmotionById` for colors

<!-- MANUAL: -->
