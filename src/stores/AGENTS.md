<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# stores

## Purpose
Zustand state management stores for global application state.

## Key Files

| File | Description |
|------|-------------|
| `authStore.ts` | Authentication state - user, credits, loading status. Handles login/logout and auth state subscription. |

## For AI Agents

### Working In This Directory
- Uses Zustand for lightweight state management
- Store is created with `create<StoreType>()`
- Actions are defined alongside state in the store
- Subscribe to Firebase auth state changes

### Testing Requirements
- Test store state updates
- Verify auth state sync with Firebase
- Test credit increment/decrement logic

### Common Patterns
- Use `set()` to update state
- Use `get()` to access current state in actions
- Return unsubscribe functions from initialization
- Optimistic updates for credit changes

## Dependencies

### Internal
- `lib/firebase.ts` - Firebase auth instance
- `lib/ensureAuth.ts` - Toss login function

### External
- `zustand` - State management
- `firebase/auth` - Auth state subscription

<!-- MANUAL: -->
