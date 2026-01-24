<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# src (functions)

## Purpose
TypeScript source files for Firebase Cloud Functions. Contains all backend logic for music generation, user management, and Toss integration.

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | Main entry point - exports all Cloud Functions (generateMusic, checkAndSaveMusic, getMyTracks, deleteTrack, createUser, getUserInfo, loginWithToss, tossUnlinkCallback, sunoCallback) |
| `types.ts` | TypeScript type definitions for request/response interfaces |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `utils/` | Helper functions for music generation (see `utils/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Functions use Firebase Functions v1 API
- Secrets are accessed via `defineSecret()` and `.value()`
- All callable functions verify `context.auth` for authentication
- Toss login uses mTLS with certificate from Secret Manager

### Key Functions

| Function | Type | Description |
|----------|------|-------------|
| `generateMusic` | callable | Start music generation via Suno API |
| `checkAndSaveMusic` | callable | Poll status and save completed tracks |
| `getMyTracks` | callable | List user's tracks with pagination |
| `deleteTrack` | callable | Delete a track and its audio file |
| `createUser` | auth trigger | Initialize new user on first login |
| `getUserInfo` | callable | Get user credits and stats |
| `loginWithToss` | callable | Toss OAuth login, returns Firebase custom token |
| `tossUnlinkCallback` | HTTP | Webhook for Toss account unlinking |
| `sunoCallback` | HTTP | Webhook for Suno API completion |

### Testing Requirements
- Test with Firebase Emulator Suite
- Verify Firestore security rules
- Test Toss login in sandbox environment

### Common Patterns
- Use `functions.https.HttpsError` for typed errors
- Store audio files in Cloud Storage at `tracks/{userId}/{trackId}.mp3`
- Use Firestore transactions for atomic operations
- Log important events for debugging

## Dependencies

### External
- `firebase-functions` - Functions SDK
- `firebase-admin` - Admin SDK
- `axios` - HTTP client for Suno API

<!-- MANUAL: -->
