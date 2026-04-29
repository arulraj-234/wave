## 2024-04-29 - [Context Re-rendering Optimization]
**Learning:** Frequent `timeupdate` events trigger state updates on the `<audio>` element (like updating the `progress` state in `PlayerContext.jsx`). Throttling this state update to mitigate context re-renders causes visual stutter in components that consume the `progress` (like `BottomPlayer`).
**Action:** Need to find a way to avoid re-rendering the whole context, but keeping the progress bar smooth.
