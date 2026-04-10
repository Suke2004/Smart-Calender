# Future Implementation Plan: Academic Ledger V2

Now that the core, predictive Academic Ledger is complete, here is a blueprint for taking the feature to the next level by significantly increasing interactivity and utility.

## User Review Required

> [!IMPORTANT]
> **Weekly Timetable Automation**: A major planned feature is allowing the creation of recurring schedules. The app would automatically prompt you to mark attendance right as the class ends. I recommend using `date-fns` integration for this.
> **Calendar Data Injection**: V2 will visually blend the Monthly Calendar View with the Academic Ledger, turning the calendar grid into a heatmap of productivity.

## Proposed Upgrades (V2)

### 1. The Interactive Timetable Engine
- **Concept**: Users can define a weekly recurring schedule (e.g., "Data Structures" every Mon/Wed at 10 AM).
- **Execution**: The Oracle Dashboard will display a "Up Next" widget. At the end of a scheduled class, an interactive, non-intrusive notification pill will slide in asking: *"Did you attend Data Structures today? [Yes] [No]"*.

### 2. Calendar-Grid Integration
- **Concept**: Merge attendance data directly into the user's monthly view.
- **Execution**: Modify `CalendarCell.tsx` to read from `useAcademy`. If the user marked attendance on that day, small colored theme dots (matching the subject color) will appear on the calendar day cell. A hollow circle means absent, a filled circle means present.

### 3. Data Visualization (Motion Charts)
- **Concept**: Add historical trend tracking. 
- **Execution**: Implement beautiful, clean SVG line charts using `framer-motion` inside `AcademyView.tsx`. When a user expands a `SubjectCard`, it will animate to show a 30-day graphical trendline of their attendance percentage dipping or rising.

### 4. Advanced Gamification
- **Concept**: Expand the Archetype system.
- **Execution**: Add "Streak Tracking" (e.g., "7-day flawless streak!"). Introduce subtle micro-animations (like a small confetti burst) when hitting the exact target percentage from a deficit.

## Open Questions
- **Priority**: Which of these ideas excites you the most? Should we prioritize the **Timetable Automation** or the **Visual Calendar Grid Integration** first?
- **Graphs**: Do you prefer minimalist line-graphs or bar-charts for viewing semester-long trends?

## Verification Plan (V2)
- Validate timetable notifications against real local time scheduling.
- Ensure the SVG motion charts do not bloat the application bundle or reduce scrolling performance on mobile.
