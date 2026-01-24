<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-01-25 | Updated: 2026-01-25 -->

# calendar

## Purpose
Calendar view components for displaying the user's emotional diary over time.

## Key Files

| File | Description |
|------|-------------|
| `CalendarView.tsx` | Calendar grid showing days with emotion entries |

## For AI Agents

### Working In This Directory
- Displays monthly calendar grid
- Days with tracks show emotion indicators
- Uses date-fns for date manipulation
- Navigate between months

### Testing Requirements
- Test month navigation
- Verify emotion indicators display correctly
- Check date selection behavior

### Common Patterns
- Grid layout for calendar
- Emotion colors/emojis on days with entries
- Korean date formatting

## Dependencies

### Internal
- `types/diary.ts` - Diary entry types
- `hooks/useDiary.ts` - Diary data hook

### External
- `date-fns` - Date utilities

<!-- MANUAL: -->
