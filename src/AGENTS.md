<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# src

## Purpose
Frontend React application source code for the Moodi mini-app. Contains all React components, hooks, pages, state management, and utilities for the emotion-based music generation experience.

## Key Files

| File | Description |
|------|-------------|
| `App.tsx` | Root component with routing and splash guard logic |
| `main.tsx` | Application entry point, renders App to DOM |
| `vite-env.d.ts` | Vite environment type declarations |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | API layer functions for Firebase callable functions (see `api/AGENTS.md`) |
| `assets/` | Static assets bundled by Vite |
| `components/` | Reusable React components (see `components/AGENTS.md`) |
| `constants/` | Application constants and configuration (see `constants/AGENTS.md`) |
| `hooks/` | Custom React hooks for business logic (see `hooks/AGENTS.md`) |
| `lib/` | External service configurations (Firebase) (see `lib/AGENTS.md`) |
| `pages/` | Page-level components for each route (see `pages/AGENTS.md`) |
| `stores/` | Zustand state management stores (see `stores/AGENTS.md`) |
| `styles/` | Global CSS and design tokens (see `styles/AGENTS.md`) |
| `types/` | TypeScript type definitions (see `types/AGENTS.md`) |
| `utils/` | Utility functions and helpers (see `utils/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Use React 19 features (no legacy patterns)
- Import paths use `src/` relative imports
- All UI text should be in Korean
- Follow TDS (Toss Design System) design patterns
- Prefer functional components with hooks

### Testing Requirements
- Test components in the Toss app simulator
- Verify authentication flows work correctly
- Check responsive design for mobile screens

### Common Patterns
- Pages handle route-level logic
- Hooks encapsulate business logic and API calls
- Stores manage global state with Zustand
- Components are presentational and reusable

## Dependencies

### Internal
- `functions/` - Backend Cloud Functions called via Firebase

### External
- `react` - UI framework
- `react-router-dom` - Routing
- `zustand` - State management
- `firebase` - Backend services
- `@apps-in-toss/web-framework` - Toss SDK

<!-- MANUAL: -->
