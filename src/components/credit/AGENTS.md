<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# credit

## Purpose
Credit display and management components for the in-app purchase system.

## Key Files

| File | Description |
|------|-------------|
| `CreditIndicator.tsx` | Credit balance indicator shown in the UI |

## For AI Agents

### Working In This Directory
- Displays current credit count
- May link to credit store page
- Updates when credits change

### Testing Requirements
- Verify credit display updates correctly
- Test navigation to store

### Common Patterns
- Subscribe to authStore for credit balance
- Compact display for header/inline use

## Dependencies

### Internal
- `stores/authStore.ts` - Credit balance state

<!-- MANUAL: -->
