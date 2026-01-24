<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# common

## Purpose
Shared UI components used throughout the Moodi app. Contains reusable building blocks for the interface.

## Key Files

| File | Description |
|------|-------------|
| `TabBar.tsx` | Bottom navigation bar with Home, Calendar, Library, Settings tabs |
| `TabBar.css` | TabBar styles |
| `EmotionChip.tsx` | Emotion selection chip component with emoji and label |
| `TrackItem.tsx` | Track list item for library and search results |
| `LoadingAnimation.tsx` | Loading spinner/animation component |
| `ConfirmModal.tsx` | Confirmation dialog modal |
| `AsyncDataRenderer.tsx` | Wrapper for handling async data states (loading, error, success) |

## For AI Agents

### Working In This Directory
- Components should be purely presentational
- Each component has co-located .css file
- Use Korean labels for all text
- TabBar hides on specific routes (loading, player, store)

### Testing Requirements
- Test components with different prop combinations
- Verify tab navigation works correctly
- Check responsive behavior

### Common Patterns
- Functional components with TypeScript
- Props interfaces defined in component file
- Use `useNavigate` and `useLocation` from react-router
- Emoji icons with aria-labels for accessibility

## Dependencies

### Internal
- `constants/emotions.ts` - Emotion data
- `types/emotion.ts` - Type definitions

### External
- `react-router-dom` - Navigation

<!-- MANUAL: -->
