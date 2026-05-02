## 2026-05-02 - Context Provider Re-render Optimization
**Learning:** React context providers exposing high-frequency state updates (like <audio> timeupdate firing 4x/sec) will cause massive global re-renders across all consumer components.
**Action:** Lift rapidly changing state (like media player progress) out of global Context. Instead, expose mutable refs (e.g., audioRef) and attach isolated event listeners directly within the component that actually needs to render the updates (e.g., the progress bar element).
