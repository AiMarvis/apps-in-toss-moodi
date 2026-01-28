# Moodi TDS Migration & Release Preparation

## TL;DR

> **Quick Summary**: Install TDS Mobile packages, wrap app with TDSMobileAITProvider, migrate primary action buttons + ConfirmModal + TextArea to TDS components, and add purchase history section to CreditStorePage.
> 
> **Deliverables**:
> - TDS Mobile packages installed and configured
> - App.tsx wrapped with TDSMobileAITProvider
> - Primary buttons migrated to TDS Button
> - ConfirmModal replaced with TDS ConfirmDialog
> - TextArea migrated to TDS component
> - Purchase history UI added to CreditStorePage
> 
> **Estimated Effort**: Medium (4-6 hours)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 -> Task 2 -> Task 3 -> Task 6 -> Task 7

---

## Context

### Original Request
Prepare Moodi for AppsInToss release by:
1. Migrating to TDS Mobile components (CRITICAL - required for review)
2. Adding purchase history UI (RECOMMENDED)

### Interview Summary
**Key Discussions**:
- Scope: PRIMARY buttons only (generate, buy, confirm, login/logout), NOT chip-style buttons
- Keep custom: EmotionChip, music-type chips, lyrics-option chips, TabBar (emoji icons)
- Modal: Migrate ConfirmModal to TDS ConfirmDialog
- TextArea: Migrate emotion-textarea to TDS
- Purchase History: Add as section within existing CreditStorePage
- SDK: Already at 1.7.1 installed - no upgrade needed

**Research Findings**:
- TDSMobileAITProvider from `@toss/tds-mobile-ait` is required wrapper
- Packages needed: `@toss/tds-mobile`, `@toss/tds-mobile-ait`, `@emotion/react@^11`
- TDS Button props: `color="primary"`, `variant="fill"`, `size`, `display="full"`
- ConfirmDialog API available from `@toss/tds-mobile`

---

## Work Objectives

### Core Objective
Integrate TDS Mobile components to pass AppsInToss review requirements while preserving app's custom visual identity for emotion-based styling.

### Concrete Deliverables
- `package.json` with TDS dependencies added
- `src/App.tsx` with TDSMobileAITProvider wrapper
- `src/pages/HomePage.tsx` with TDS Button for generate action
- `src/pages/HomePage.tsx` with TDS TextArea for emotion input
- `src/pages/CreditStorePage.tsx` with TDS Buttons + purchase history section
- `src/pages/SettingsPage.tsx` with TDS Buttons for login/logout
- `src/components/common/ConfirmModal.tsx` replaced with TDS ConfirmDialog wrapper
- `src/hooks/usePurchaseHistory.ts` new hook for fetching order history

### Definition of Done
- [ ] `npm run dev` starts without errors
- [ ] `npm run lint` passes
- [ ] `npm run build` completes successfully
- [ ] App renders with TDS components visible
- [ ] Generate button, Buy buttons, Login/Logout buttons use TDS styling
- [ ] ConfirmModal shows TDS Dialog styling
- [ ] TextArea shows TDS styling
- [ ] Purchase history section displays in CreditStorePage

### Must Have
- TDSMobileAITProvider wrapping the app
- Primary action buttons using TDS Button
- ConfirmModal using TDS ConfirmDialog
- TextArea using TDS component
- Purchase history section in CreditStorePage

### Must NOT Have (Guardrails)
- DO NOT migrate EmotionChip - keep custom emotion.color styling
- DO NOT migrate TabBar - keep custom emoji icons
- DO NOT migrate chip-style buttons (music-type, lyrics-option, language-option)
- DO NOT create separate route for purchase history
- DO NOT modify secondary buttons in MusicPlayer (play, restart, share, regenerate)
- DO NOT change existing dark theme colors
- DO NOT add alert() or console.log for debugging in production code

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: Manual-only
- **Framework**: none

### Manual QA Only

Each TODO includes detailed verification procedures using browser automation.

**Evidence Required:**
- Commands run with actual output
- Screenshots for visual changes
- Build/lint output captured

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Install TDS packages
└── Task 7: Create usePurchaseHistory hook

Wave 2 (After Wave 1):
├── Task 2: Add TDSMobileAITProvider wrapper
├── Task 3: Migrate HomePage buttons + TextArea
├── Task 4: Migrate CreditStorePage buttons
├── Task 5: Migrate SettingsPage buttons
└── Task 6: Migrate ConfirmModal to TDS Dialog

Wave 3 (After Wave 2):
└── Task 8: Add purchase history section to CreditStorePage

Final:
└── Task 9: Final verification and cleanup

Critical Path: Task 1 -> Task 2 -> Task 3 -> Task 6 -> Task 9
Parallel Speedup: ~50% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2,3,4,5,6,8 | 7 |
| 2 | 1 | 3,4,5,6 | None |
| 3 | 2 | 9 | 4,5,6 |
| 4 | 2 | 8,9 | 3,5,6 |
| 5 | 2 | 9 | 3,4,6 |
| 6 | 2 | 9 | 3,4,5 |
| 7 | None | 8 | 1 |
| 8 | 4,7 | 9 | None |
| 9 | 3,4,5,6,8 | None | None |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 7 | quick category, parallel background |
| 2 | 2, 3, 4, 5, 6 | visual-engineering category with TDS skill |
| 3 | 8, 9 | visual-engineering category |

---

## TODOs

- [ ] 1. Install TDS Mobile packages

  **What to do**:
  - Run `npm install @toss/tds-mobile @toss/tds-mobile-ait @emotion/react@^11`
  - Verify packages appear in package.json dependencies
  - Run `npm run dev` to ensure no immediate conflicts

  **Must NOT do**:
  - Do not upgrade @apps-in-toss/web-framework (already at 1.7.1)
  - Do not modify any source files yet

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple npm install command, no complex logic
  - **Skills**: None required
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed for package installation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 7)
  - **Blocks**: Tasks 2, 3, 4, 5, 6, 8
  - **Blocked By**: None (can start immediately)

  **References**:
  - `package.json` - Current dependencies list, add new packages here
  - AppsInToss docs on TDS Mobile - Package requirements

  **Acceptance Criteria**:
  - [ ] `npm install` completes without errors
  - [ ] `package.json` contains `@toss/tds-mobile`, `@toss/tds-mobile-ait`, `@emotion/react`
  - [ ] `npm run dev` starts without import errors
  - [ ] `npm run build` completes successfully

  **Commit**: YES
  - Message: `chore: install TDS Mobile packages`
  - Files: `package.json`, `package-lock.json`
  - Pre-commit: `npm run build`

---

- [ ] 2. Add TDSMobileAITProvider to App.tsx

  **What to do**:
  - Import `TDSMobileAITProvider` from `@toss/tds-mobile-ait`
  - Wrap the `BrowserRouter` component with `TDSMobileAITProvider`
  - Keep existing imports and logic unchanged

  **Must NOT do**:
  - Do not remove existing global.css import
  - Do not modify routing logic
  - Do not add any theme customization yet

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file edit, simple wrapper addition
  - **Skills**: None required
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Overkill for simple wrapper

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (after Task 1)
  - **Blocks**: Tasks 3, 4, 5, 6
  - **Blocked By**: Task 1

  **References**:
  - `src/App.tsx:74-87` - Current App component structure, wrap BrowserRouter here
  - AppsInToss docs - TDSMobileAITProvider usage pattern

  **Pattern Reference**:
  ```tsx
  import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';
  
  function App() {
    return (
      <TDSMobileAITProvider>
        <BrowserRouter>
          ...
        </BrowserRouter>
      </TDSMobileAITProvider>
    );
  }
  ```

  **Acceptance Criteria**:
  - [ ] App.tsx imports TDSMobileAITProvider
  - [ ] BrowserRouter is wrapped with TDSMobileAITProvider
  - [ ] Using playwright browser automation:
    - Navigate to: `http://localhost:5173/`
    - Verify: App renders without errors
    - Screenshot: Save to `.sisyphus/evidence/task-2-provider.png`
  - [ ] `npm run lint` passes
  - [ ] `npm run build` completes

  **Commit**: YES
  - Message: `feat: add TDSMobileAITProvider wrapper`
  - Files: `src/App.tsx`
  - Pre-commit: `npm run lint && npm run build`

---

- [ ] 3. Migrate HomePage generate button and TextArea to TDS

  **What to do**:
  - Import `Button` and `TextArea` (or `TextField`) from `@toss/tds-mobile`
  - Replace the generate-button with TDS Button:
    - Props: `color="primary"`, `variant="fill"`, `size="large"`, `display="full"`
    - Keep onClick handler and disabled logic
    - Keep button text "🎵 나만의 음악 만들기"
  - Replace emotion-textarea with TDS TextArea:
    - Keep value, onChange, placeholder, disabled props
    - Maintain character count logic externally

  **Must NOT do**:
  - Do NOT migrate music-type-chip buttons
  - Do NOT migrate lyrics-option buttons  
  - Do NOT migrate language-option buttons
  - Do NOT change EmotionChip component
  - Do NOT remove existing CSS classes (may be needed for layout)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component migration requires visual verification
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: TDS component integration and styling
  - **Skills Evaluated but Omitted**:
    - `playwright`: Will use for verification but not primary skill

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5, 6)
  - **Blocks**: Task 9
  - **Blocked By**: Task 2

  **References**:
  - `src/pages/HomePage.tsx:205-211` - generate-button to replace with TDS Button
  - `src/pages/HomePage.tsx:177-188` - emotion-textarea to replace with TDS TextArea
  - `src/pages/HomePage.css` - Existing styles (keep layout classes)
  - TDS docs - Button and TextArea component APIs

  **Acceptance Criteria**:
  - [ ] HomePage imports Button and TextArea from @toss/tds-mobile
  - [ ] Generate button uses TDS Button component
  - [ ] TextArea uses TDS TextArea component
  - [ ] Character count still displays correctly
  - [ ] Using playwright browser automation:
    - Navigate to: `http://localhost:5173/`
    - Verify: Generate button has TDS styling (rounded corners, primary color)
    - Verify: TextArea has TDS styling
    - Action: Type text in TextArea, verify character count updates
    - Screenshot: Save to `.sisyphus/evidence/task-3-homepage.png`
  - [ ] `npm run lint` passes

  **Commit**: YES
  - Message: `feat(HomePage): migrate generate button and TextArea to TDS`
  - Files: `src/pages/HomePage.tsx`
  - Pre-commit: `npm run lint`

---

- [ ] 4. Migrate CreditStorePage buttons to TDS

  **What to do**:
  - Import `Button` from `@toss/tds-mobile`
  - Replace back-button with TDS Button (variant="text" or icon button)
  - Replace buy-button with TDS Button (color="primary", variant="fill")
  - Replace retry-button with TDS Button (color="secondary" or "primary")
  - Replace dismiss-button with TDS Button (variant="text")
  - Keep all onClick handlers and disabled logic

  **Must NOT do**:
  - Do NOT modify package-card layout
  - Do NOT change loading overlay styling
  - Do NOT add purchase history yet (Task 8)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Multiple button migrations, visual verification needed
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: TDS Button variants and props
  - **Skills Evaluated but Omitted**:
    - None

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 5, 6)
  - **Blocks**: Task 8, Task 9
  - **Blocked By**: Task 2

  **References**:
  - `src/pages/CreditStorePage.tsx:100-102` - back-button to migrate
  - `src/pages/CreditStorePage.tsx:127-133` - retry-button to migrate
  - `src/pages/CreditStorePage.tsx:135-140` - dismiss-button to migrate
  - `src/pages/CreditStorePage.tsx:160-166` - buy-button to migrate
  - `src/pages/CreditStorePage.css` - Keep layout styles

  **Acceptance Criteria**:
  - [ ] CreditStorePage imports Button from @toss/tds-mobile
  - [ ] All 4 button types use TDS Button component
  - [ ] Using playwright browser automation:
    - Navigate to: `http://localhost:5173/store`
    - Verify: Back button visible in header
    - Verify: Buy buttons have TDS primary styling
    - Screenshot: Save to `.sisyphus/evidence/task-4-storepage.png`
  - [ ] `npm run lint` passes

  **Commit**: YES
  - Message: `feat(CreditStorePage): migrate buttons to TDS`
  - Files: `src/pages/CreditStorePage.tsx`
  - Pre-commit: `npm run lint`

---

- [ ] 5. Migrate SettingsPage login/logout buttons to TDS

  **What to do**:
  - Import `Button` from `@toss/tds-mobile`
  - Replace login-button with TDS Button (color="primary", variant="fill")
  - Replace logout-button with TDS Button (variant="text" or color="secondary")
  - Keep onClick handlers and disabled logic

  **Must NOT do**:
  - Do NOT modify menu-item click handlers (they are divs, not buttons)
  - Do NOT change settings-card layout

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Only 2 buttons to migrate, straightforward
  - **Skills**: None required
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Simple migration

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4, 6)
  - **Blocks**: Task 9
  - **Blocked By**: Task 2

  **References**:
  - `src/pages/SettingsPage.tsx:49-55` - login-button to migrate
  - `src/pages/SettingsPage.tsx:73-75` - logout-button to migrate
  - `src/pages/SettingsPage.css` - Keep existing layout

  **Acceptance Criteria**:
  - [ ] SettingsPage imports Button from @toss/tds-mobile
  - [ ] Login button uses TDS Button with primary styling
  - [ ] Logout button uses TDS Button
  - [ ] Using playwright browser automation:
    - Navigate to: `http://localhost:5173/settings`
    - Verify: Login or Logout button visible (depends on auth state)
    - Screenshot: Save to `.sisyphus/evidence/task-5-settings.png`
  - [ ] `npm run lint` passes

  **Commit**: YES
  - Message: `feat(SettingsPage): migrate login/logout buttons to TDS`
  - Files: `src/pages/SettingsPage.tsx`
  - Pre-commit: `npm run lint`

---

- [ ] 6. Migrate ConfirmModal to TDS ConfirmDialog

  **What to do**:
  - Import `ConfirmDialog` (or equivalent dialog component) from `@toss/tds-mobile`
  - Refactor ConfirmModal to use TDS Dialog internally while keeping same props interface
  - Map existing props to TDS Dialog props:
    - isOpen -> open
    - title -> title
    - message -> description/content
    - confirmText -> confirmText
    - cancelText -> cancelText
    - onConfirm -> onConfirm
    - onCancel -> onCancel/onClose
    - variant -> determine danger styling

  **Must NOT do**:
  - Do NOT change ConfirmModalProps interface (keep backward compatible)
  - Do NOT change how consumers use ConfirmModal

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Dialog migration requires understanding TDS Dialog API
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Modal/Dialog patterns
  - **Skills Evaluated but Omitted**:
    - None

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4, 5)
  - **Blocks**: Task 9
  - **Blocked By**: Task 2

  **References**:
  - `src/components/common/ConfirmModal.tsx:1-46` - Current implementation to refactor
  - `src/components/common/ConfirmModal.css` - May become unused after migration
  - TDS docs - ConfirmDialog or Dialog component API

  **Acceptance Criteria**:
  - [ ] ConfirmModal.tsx uses TDS Dialog component internally
  - [ ] Props interface remains unchanged (backward compatible)
  - [ ] All existing usages continue to work
  - [ ] Using playwright browser automation:
    - Navigate to a page that triggers ConfirmModal (e.g., delete track in library)
    - Trigger the modal
    - Verify: Modal shows with TDS styling
    - Screenshot: Save to `.sisyphus/evidence/task-6-modal.png`
  - [ ] `npm run lint` passes

  **Commit**: YES
  - Message: `feat(ConfirmModal): migrate to TDS Dialog`
  - Files: `src/components/common/ConfirmModal.tsx`
  - Pre-commit: `npm run lint`

---

- [ ] 7. Create usePurchaseHistory hook

  **What to do**:
  - Create new file `src/hooks/usePurchaseHistory.ts`
  - Import IAP from `@apps-in-toss/web-framework`
  - Implement hook that:
    - Calls `IAP.getCompletedOrRefundedOrders()`
    - Manages loading, error, orders state
    - Supports pagination with loadMore function using nextKey
    - Returns { orders, loading, error, hasMore, loadMore, refetch }

  **Must NOT do**:
  - Do NOT integrate with CreditStorePage yet (Task 8)
  - Do NOT add UI components

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single hook file, clear API to implement
  - **Skills**: None required
  - **Skills Evaluated but Omitted**:
    - None

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 8
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/hooks/useIap.ts:80-117` - Similar pattern for IAP API calls
  - `src/hooks/useCredits.ts` - Hook pattern with loading/error states
  - AppsInToss docs - `getCompletedOrRefundedOrders` API signature and response

  **API Reference**:
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

  **Acceptance Criteria**:
  - [ ] File `src/hooks/usePurchaseHistory.ts` exists
  - [ ] Hook exports { orders, loading, error, hasMore, loadMore, refetch }
  - [ ] Uses IAP.getCompletedOrRefundedOrders() for fetching
  - [ ] Implements pagination with nextKey
  - [ ] `npm run lint` passes
  - [ ] TypeScript compiles without errors: `npx tsc --noEmit`

  **Commit**: YES
  - Message: `feat: add usePurchaseHistory hook`
  - Files: `src/hooks/usePurchaseHistory.ts`
  - Pre-commit: `npm run lint`

---

- [ ] 8. Add purchase history section to CreditStorePage

  **What to do**:
  - Import usePurchaseHistory hook
  - Add new section below packages for "구매 내역" (Purchase History)
  - Display orders list with:
    - orderId (truncated)
    - SKU mapped to product name (use CREDIT_PRODUCTS constant)
    - date formatted in Korean (use date-fns)
    - status badge (완료/환불됨)
  - Add "더 보기" (Load More) button if hasMore is true
  - Show empty state if no orders
  - Show loading spinner while fetching

  **Must NOT do**:
  - Do NOT create separate page/route
  - Do NOT show detailed order information
  - Do NOT add order editing/management

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI implementation with list rendering
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: List UI patterns, empty states
  - **Skills Evaluated but Omitted**:
    - None

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (after Tasks 4, 7)
  - **Blocks**: Task 9
  - **Blocked By**: Task 4, Task 7

  **References**:
  - `src/pages/CreditStorePage.tsx:145-170` - packages-section pattern to follow
  - `src/pages/CreditStorePage.css` - Add new styles for history section
  - `src/hooks/usePurchaseHistory.ts` - Hook to use (from Task 7)
  - `src/constants/emotions.ts:CREDIT_PRODUCTS` - Map SKU to product name
  - `date-fns` - Format dates in Korean

  **Acceptance Criteria**:
  - [ ] CreditStorePage imports and uses usePurchaseHistory
  - [ ] New "구매 내역" section visible below packages
  - [ ] Orders display orderId, product name, date, status
  - [ ] Load More button appears if hasMore=true
  - [ ] Empty state shows "구매 내역이 없어요" if no orders
  - [ ] Using playwright browser automation:
    - Navigate to: `http://localhost:5173/store`
    - Scroll to purchase history section
    - Verify: Section title "구매 내역" visible
    - Screenshot: Save to `.sisyphus/evidence/task-8-history.png`
  - [ ] `npm run lint` passes

  **Commit**: YES
  - Message: `feat(CreditStorePage): add purchase history section`
  - Files: `src/pages/CreditStorePage.tsx`, `src/pages/CreditStorePage.css`
  - Pre-commit: `npm run lint`

---

- [ ] 9. Final verification and CSS cleanup

  **What to do**:
  - Run full build: `npm run build`
  - Run lint: `npm run lint`
  - Start dev server and verify all migrated components
  - Review CSS files for orphaned styles that can be removed:
    - `src/pages/HomePage.css` - generate-button styles (may keep for layout)
    - `src/pages/CreditStorePage.css` - button styles
    - `src/pages/SettingsPage.css` - button styles
    - `src/components/common/ConfirmModal.css` - may be fully removable
  - Test all user flows work correctly

  **Must NOT do**:
  - Do NOT delete CSS rules that affect layout (margins, padding)
  - Do NOT modify component logic
  - Do NOT introduce new features

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Verification and minor cleanup
  - **Skills**: [`playwright`]
    - `playwright`: Full app verification
  - **Skills Evaluated but Omitted**:
    - None

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Final (after all other tasks)
  - **Blocks**: None
  - **Blocked By**: Tasks 3, 4, 5, 6, 8

  **References**:
  - All modified files from previous tasks
  - `.sisyphus/evidence/` - Review all screenshots

  **Acceptance Criteria**:
  - [ ] `npm run build` completes without errors
  - [ ] `npm run lint` passes with no warnings
  - [ ] Using playwright browser automation:
    - Navigate to: `http://localhost:5173/`
    - Complete flow: Select emotion -> Enter text -> Click generate
    - Navigate to: `http://localhost:5173/store`
    - Verify: All buttons have TDS styling
    - Verify: Purchase history section visible
    - Navigate to: `http://localhost:5173/settings`
    - Verify: Login/Logout buttons have TDS styling
    - Screenshot: Save to `.sisyphus/evidence/task-9-final.png`
  - [ ] No console errors in browser DevTools

  **Commit**: YES
  - Message: `chore: cleanup orphaned CSS after TDS migration`
  - Files: Modified CSS files only
  - Pre-commit: `npm run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `chore: install TDS Mobile packages` | package.json, package-lock.json | npm run build |
| 2 | `feat: add TDSMobileAITProvider wrapper` | src/App.tsx | npm run lint && npm run build |
| 3 | `feat(HomePage): migrate generate button and TextArea to TDS` | src/pages/HomePage.tsx | npm run lint |
| 4 | `feat(CreditStorePage): migrate buttons to TDS` | src/pages/CreditStorePage.tsx | npm run lint |
| 5 | `feat(SettingsPage): migrate login/logout buttons to TDS` | src/pages/SettingsPage.tsx | npm run lint |
| 6 | `feat(ConfirmModal): migrate to TDS Dialog` | src/components/common/ConfirmModal.tsx | npm run lint |
| 7 | `feat: add usePurchaseHistory hook` | src/hooks/usePurchaseHistory.ts | npm run lint |
| 8 | `feat(CreditStorePage): add purchase history section` | src/pages/CreditStorePage.tsx, .css | npm run lint |
| 9 | `chore: cleanup orphaned CSS after TDS migration` | CSS files | npm run build |

---

## Success Criteria

### Verification Commands
```bash
npm run lint          # Expected: 0 errors, 0 warnings
npm run build         # Expected: Build successful
npm run dev           # Expected: App starts on localhost:5173
```

### Final Checklist
- [ ] TDSMobileAITProvider wraps the app
- [ ] All primary action buttons use TDS Button
- [ ] ConfirmModal uses TDS Dialog
- [ ] TextArea uses TDS component
- [ ] Purchase history section visible in CreditStorePage
- [ ] EmotionChip, TabBar, chip-style buttons remain UNCHANGED
- [ ] No alert() calls in codebase
- [ ] All existing functionality preserved
