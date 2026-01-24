<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# pages

## Purpose
Page-level components that correspond to routes in the application. Each page represents a distinct screen in the user journey.

## Key Files

| File | Description |
|------|-------------|
| `SplashPage.tsx` | Initial splash screen with app logo |
| `IntroductionPage.tsx` | Onboarding/welcome screen for new users |
| `HomePage.tsx` | Main emotion selection screen - choose mood and generate music |
| `LoadingPage.tsx` | Music generation progress screen with animations |
| `PlayerPage.tsx` | Music playback screen with controls |
| `LibraryPage.tsx` | User's saved tracks library |
| `CalendarPage.tsx` | Calendar view of emotional diary entries |
| `CreditStorePage.tsx` | In-app purchase screen for buying credits |
| `SettingsPage.tsx` | App settings and account management |

## For AI Agents

### Working In This Directory
- Pages handle route-level orchestration
- Use hooks for business logic, keep pages thin
- Navigation via `react-router-dom` hooks
- State passed via location state or stores

### Testing Requirements
- Test navigation flows between pages
- Verify protected routes require authentication
- Test loading and error states

### Common Patterns
- Import hooks for data and actions
- Use TabBar on main screens (home, library, calendar, settings)
- Full-screen pages for splash, intro, loading, player
- Korean text for all UI elements

## Dependencies

### Internal
- `components/` - UI building blocks
- `hooks/` - Business logic
- `stores/` - Global state

### External
- `react-router-dom` - Routing

<!-- MANUAL: -->
