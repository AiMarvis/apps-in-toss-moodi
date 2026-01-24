<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# hooks

## Purpose
Custom React hooks that encapsulate business logic, API calls, and state management.

## Key Files

| File | Description |
|------|-------------|
| `useAuth.ts` | Authentication state and login/logout operations |
| `useCredits.ts` | Credit balance and refresh logic |
| `useDiary.ts` | Diary/calendar data management |
| `useIap.ts` | In-app purchase flow for credits |
| `useMusicGeneration.ts` | Core music generation hook - handles Suno API polling and status |
| `useMyTracks.ts` | User's track library with pagination and deletion |

## For AI Agents

### Working In This Directory
- Hooks encapsulate complex async logic
- Use `useCallback` and `useMemo` for optimization
- State changes should be atomic and predictable
- Error states should provide user-friendly Korean messages

### Testing Requirements
- Test hooks with React Testing Library
- Mock Firebase functions for unit tests
- Verify loading/error/success states

### Common Patterns
- Return object with state and handler functions
- Use refs for non-reactive values (polling timers)
- Call `ensureAuth()` before authenticated API calls
- Integrate with Zustand stores via `useAuthStore`

## Dependencies

### Internal
- `api/` - API layer functions
- `stores/` - Zustand stores
- `lib/ensureAuth.ts` - Authentication helper
- `utils/errorHandler.ts` - Error message extraction

### External
- `react` - Hooks API

<!-- MANUAL: -->
