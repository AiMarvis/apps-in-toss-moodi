# Draft: Moodi TDS Migration & Release Preparation

## Requirements (confirmed)

### Task 1: TDS Component Migration (CRITICAL)
- **Status**: Required for AppsInToss review
- **Current state**: Custom CSS components, no @toss/tds-mobile package
- **Goal**: Install TDS Mobile and migrate all interactive components

### Task 2: Debug Code Removal
- **Status**: COMPLETED - alert() already removed from ensureAuth.ts

### Task 3: Purchase History Page (RECOMMENDED)
- **Status**: Pending user decision on implementation approach
- **Goal**: Display IAP order history using `IAP.getCompletedOrRefundedOrders()`

---

## Codebase Analysis

### Current Package State
- `@apps-in-toss/web-framework`: ^1.5.3 (needs update to 1.7.1?)
- **MISSING**: `@toss/tds-mobile`, `@toss/tds-mobile-ait`, `@emotion/react`

### App.tsx Current State
- No TDSMobileAITProvider wrapper
- Uses BrowserRouter directly
- Only imports `./styles/global.css`

### Components Requiring Migration

#### Buttons (many locations)
| File | Button Classes | Count |
|------|---------------|-------|
| `HomePage.tsx` | generate-button, music-type-chip, lyrics-option, language-option | 15+ |
| `CreditStorePage.tsx` | back-button, retry-button, dismiss-button, buy-button | 4+ |
| `PlayerPage.tsx` | back-button | 1 |
| `SettingsPage.tsx` | login-button, logout-button | 2 |
| `MusicPlayer.tsx` | play-button, restart-button, action-button, share-button, regenerate-button | 5+ |
| `ConfirmModal.tsx` | modal-cancel, modal-confirm | 2 |
| `TabBar.tsx` | tab-item | 4 |
| `EmotionChip.tsx` | emotion-chip | 6+ |

#### TextAreas/Inputs
| File | Element | Notes |
|------|---------|-------|
| `HomePage.tsx` | emotion-textarea | Main text input |

#### Modals
| File | Type | Notes |
|------|------|-------|
| `ConfirmModal.tsx` | Custom modal | Should migrate to TDS Dialog |

#### Navigation
| File | Type | Notes |
|------|------|-------|
| `TabBar.tsx` | Custom bottom nav | Consider TDS BottomNavigation or keep if styled correctly |

### Purchase History API Available
```typescript
interface CompletedOrRefundedOrdersResult {
  hasNext: boolean;
  nextKey?: string | null;
  orders: {
    orderId: string;
    sku: string;
    status: 'COMPLETED' | 'REFUNDED';
    date: string;
  }[];
}
```

---

## Decisions Confirmed

### TDS Migration Scope
- **Primary buttons ONLY**: generate-button, buy-button, confirm/cancel in modal, login/logout
- **KEEP CUSTOM**: EmotionChip, music-type chips, lyrics-option chips, TabBar
- **Modal**: Migrate ConfirmModal to TDS ConfirmDialog
- **TextArea**: Migrate emotion-textarea to TDS TextField/TextArea

### Purchase History
- **Location**: Add section within existing CreditStorePage (not new page)
- **Display**: orderId, sku, date, status
- **Pagination**: Simple "Load More" button

### SDK
- Already at 1.7.1 (installed) - no upgrade needed

---

## Technical Decisions (CONFIRMED)

### TDS Setup
- Install: `@toss/tds-mobile`, `@toss/tds-mobile-ait`, `@emotion/react`
- Wrap BrowserRouter with TDSMobileAITProvider
- Keep existing tokens.css for custom color overrides (dark theme)

### Migration Strategy
- **Phase 1**: Setup TDS and Provider wrapper
- **Phase 2**: Migrate primary action buttons (generate, buy, confirm)
- **Phase 3**: Migrate secondary buttons (back, retry, action)
- **Phase 4**: Migrate ConfirmModal to TDS Dialog
- **Phase 5**: Migrate TextArea

### Keep Custom (tentative)
- EmotionChip (custom emotion-based styling)
- TabBar (custom with emoji icons)
- Chip-style option buttons (music-type, lyrics-option)

---

## Research Findings

### From AppsInToss Documentation
- TDSMobileAITProvider is required wrapper
- Use `@toss/tds-mobile` for web, `@toss/tds-mobile-ait` for AIT integration
- Button, TextArea, Dialog are core components
- Examples show Button with onClick, size prop

### IAP API
- `IAP.getCompletedOrRefundedOrders()` returns paginated order history
- Max 50 orders per page
- Use `nextKey` parameter for pagination
