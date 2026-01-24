<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# moodi-local

## Purpose
Moodi (무디) is an AI-powered emotion-based music generation mini-app for the AppsInToss (토스) platform. Users select an emotion keyword, and the app generates personalized music using the Suno API. Built with React 19, TypeScript, and Firebase.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Project dependencies and scripts |
| `App.tsx` | Main application component with routing |
| `vite.config.ts` | Vite build configuration |
| `granite.config.ts` | Granite (AppsInToss) platform configuration |
| `tsconfig.json` | TypeScript configuration |
| `firebase.json` | Firebase project configuration |
| `firestore.rules` | Firestore security rules |
| `storage.rules` | Cloud Storage security rules |
| `.firebaserc` | Firebase project aliases |
| `moodi.ait` | AppsInToss mini-app configuration |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | Frontend React application source code (see `src/AGENTS.md`) |
| `functions/` | Firebase Cloud Functions backend (see `functions/AGENTS.md`) |
| `public/` | Static assets served directly (see `public/AGENTS.md`) |
| `scripts/` | Development and build scripts (see `scripts/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- This is an AppsInToss mini-app - use `@apps-in-toss/web-framework` APIs
- Use `npm run dev` for development (runs Granite dev server)
- Firebase Functions require separate deployment with `firebase deploy --only functions`
- Environment variables must be prefixed with `VITE_` for frontend access
- Secrets like `SUNO_API_KEY` are managed via Firebase Secret Manager

### Testing Requirements
- Run `npm run lint` to check for code style issues
- Test Firebase Functions locally with `firebase emulators:start`
- Test the mini-app in the Toss app environment

### Common Patterns
- Anonymous/Toss authentication via Firebase Auth
- Callable Cloud Functions for API endpoints
- Zustand for state management
- CSS Modules with TDS design tokens
- Korean language throughout the UI

## Dependencies

### External
- `react` 19.x - UI framework
- `react-router-dom` 7.x - Client-side routing
- `zustand` 5.x - State management
- `firebase` 12.x - Authentication, Firestore, Storage, Functions
- `@apps-in-toss/web-framework` - Toss mini-app SDK
- `date-fns` 4.x - Date manipulation
- `vite` 7.x - Build tool

<!-- MANUAL: -->
