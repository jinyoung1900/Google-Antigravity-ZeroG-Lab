# Plan: Chronos Tracker PWA & Power Features

Implementation of a professional Progressive Web App (PWA) with multi-tracking, goals, analytics, and Pomodoro mode.

## Proposed Changes

### [Component] Multi-Timer & Core Logic
- **State Refactor**: Change `activeLogId` (string | null) to `activeLogIds` (string[]) to support simultaneous tracking.
- **Timer Logic**: Update `useEffect` interval to update `currentTime` for all active logs.
- **Start/Stop**: Adjust logic to allow multiple active sessions.

### [Component] Daily Goals Tab
- **New State**: `goals` object mapping activity IDs to target durations (minutes).
- **UI**: Add "GOALS" tab.
- **Visuals**: Progress bars showing "Actual vs Target" for each activity with a goal.
- **Refinement**: Added inline target editing directly on the GOALS tab for quick adjustments.

### [Component] Insights Tab
- **UI**: Add "INSIGHTS" tab.
- **Features**: 
  - Comparison logic (Today vs Average).
  - Weekly heat-map concept (simple grid visualization).

### [Component] Pomodoro Focus Mode
- **Toggle**: A dedicated Pomodoro switcher with a "🍅" theme.
- **Logic**: 25m work / 5m break cycles integrated into the timer logic.
- **UI**: Timer is visible in the dedicated "Pomodoro" card whenever the mode is enabled.
- **Refinement**: Pomodoro toggle is decoupled from active sessions—disabling the mode allows sessions to continue in "Classic" mode.
- **Notifications**: Visual/Auditory cues for cycle completion (if possible).

### [Component] PWA Setup
- Generate high-res app icon.
- Provide 192x192 and 512x512 PNG assets.
- Install and configure `vite-plugin-pwa`.
- Define manifest: standalone display, theme colors, and icons.
- Enable auto-update for the service worker.

### [Component] Native App Bridge (Capacitor)
- Initialize Capacitor CLI.
- Set App ID: `com.chronos.tracker`.
- Set Web Dir: `dist`.
- Add and sync native platform folders (Android & iOS).

## Verification Plan

### Manual Verification
- Start two timers at once and verify both durations increment.
- Set a goal for "Work" and verify the progress bar fills as you track.
- Switch to Insights and check if correct week-over-week trends appear.
- Test Pomodoro mode: ensure it stops tracking after 25 minutes automatically.
- **PWA Test**: Verify the app can be "Installed" from the browser and runs in standalone mode.
- **Persistence Check**: Verify logs remain after closing the "Installed" app and restarting it.
