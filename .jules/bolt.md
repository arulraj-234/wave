## 2024-05-18 - Avoid storing playback progress in global React Context
**Learning:** Frequent updates to Context state (like a progress bar updating 4 times a second via `timeupdate`) forces re-renders on every component that consumes that context.
**Action:** Instead of storing `progress` in PlayerContext, export the `audioRef` itself. Let components that need progress (like BottomPlayer) listen to `audioRef.current.addEventListener('timeupdate', ...)` locally and manage their own `progress` state. This drastically reduces global re-renders.
