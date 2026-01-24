<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# functions

## Purpose
Firebase Cloud Functions backend for the Moodi app. Handles music generation via Suno API, user authentication with Toss login, credit management, and track storage operations.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Functions dependencies (firebase-functions, axios, etc.) |
| `tsconfig.json` | TypeScript configuration for Node.js environment |
| `.eslintrc.js` | ESLint configuration for functions |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | TypeScript source files (see `src/AGENTS.md`) |
| `lib/` | Compiled JavaScript output (auto-generated, do not edit) |

## For AI Agents

### Working In This Directory
- Use Firebase Functions v1 API (not v2)
- Secrets are managed via `defineSecret()` and Firebase Secret Manager
- Deploy with `firebase deploy --only functions`
- Run `npm run build` before deploying to compile TypeScript

### Testing Requirements
- Test locally with Firebase Emulator Suite
- Check function logs with `firebase functions:log`
- Verify Firestore security rules work with functions

### Common Patterns
- Use `functions.https.onCall()` for authenticated client calls
- Use `functions.https.onRequest()` for webhooks/callbacks
- Use `functions.auth.user().onCreate()` for user creation triggers
- Error handling with `functions.https.HttpsError`

## Dependencies

### Internal
- Uses Firestore collections: `users`, `tracks`, `pendingTasks`
- Uses Cloud Storage bucket for audio files

### External
- `firebase-functions` - Cloud Functions SDK
- `firebase-admin` - Admin SDK for Firestore/Storage
- `axios` - HTTP client for Suno API calls

<!-- MANUAL: -->
