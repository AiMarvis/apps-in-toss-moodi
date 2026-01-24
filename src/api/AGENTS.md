<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# api

## Purpose
API layer that wraps Firebase callable functions. Provides typed interfaces for communicating with the backend Cloud Functions.

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | Barrel export for all API modules |
| `musicApi.ts` | Music generation and status checking APIs |
| `trackApi.ts` | Track CRUD operations (get, delete) |
| `userApi.ts` | User information retrieval |

## For AI Agents

### Working In This Directory
- Each API module wraps specific Firebase callable functions
- Functions are imported from `lib/firebase.ts`
- All functions are async and return typed responses
- Error handling is done at the hook level, not here

### Testing Requirements
- Verify API calls work with Firebase emulator
- Check error responses are properly typed

### Common Patterns
- Thin wrappers around `httpsCallable` functions
- Extract `.data` from Firebase callable responses
- Export typed request/response interfaces

## Dependencies

### Internal
- `lib/firebase.ts` - Firebase callable function references
- `types/emotion.ts` - Shared type definitions

### External
- `firebase/functions` - Firebase Functions SDK

<!-- MANUAL: -->
