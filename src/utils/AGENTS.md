<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# utils

## Purpose
Utility functions and helper modules for common operations.

## Key Files

| File | Description |
|------|-------------|
| `errorHandler.ts` | Error message extraction and classification (credit errors, auth errors) |
| `logger.ts` | Logging utility for debugging |

## For AI Agents

### Working In This Directory
- Keep utilities pure and side-effect free when possible
- Error handler extracts user-friendly Korean messages
- Logger can be disabled in production

### Testing Requirements
- Unit test utility functions
- Verify error messages are user-friendly

### Common Patterns
- Export individual functions, not classes
- Handle Firebase error codes specially
- Return Korean error messages for UI display

## Dependencies

### External
- Firebase error types

<!-- MANUAL: -->
