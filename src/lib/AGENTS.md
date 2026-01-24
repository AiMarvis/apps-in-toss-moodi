<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# lib

## Purpose
External service configurations and integrations. Contains Firebase initialization and authentication helpers.

## Key Files

| File | Description |
|------|-------------|
| `firebase.ts` | Firebase app initialization, auth, functions, firestore, storage. Defines all callable function references with types. |
| `ensureAuth.ts` | Authentication helper functions - ensures user is authenticated before API calls, handles Toss login flow |

## For AI Agents

### Working In This Directory
- Firebase config reads from `VITE_*` environment variables
- Emulator connections enabled when `VITE_USE_EMULATOR=true`
- All callable functions are typed with request/response interfaces
- Toss login uses custom token flow

### Testing Requirements
- Test with Firebase emulators for local development
- Verify environment variables are correctly configured
- Test Toss login in AppsInToss sandbox environment

### Common Patterns
- Export singleton Firebase instances
- Type all callable function parameters and responses
- Use `httpsCallable` for authenticated function calls

## Dependencies

### Internal
- `types/emotion.ts` - Track and EmotionKeyword types

### External
- `firebase/app` - Core Firebase
- `firebase/auth` - Authentication
- `firebase/functions` - Cloud Functions
- `firebase/firestore` - Firestore database
- `firebase/storage` - Cloud Storage
- `@apps-in-toss/web-framework` - Toss SDK for login

<!-- MANUAL: -->
