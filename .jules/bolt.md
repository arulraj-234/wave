## 2024-05-18 - PlayerContext Re-render Optimization
**Learning:** In a split-domain architecture using React context, putting rapidly changing state like `progress` (updated several times a second on `<audio>` `timeupdate`) into a top-level provider like `PlayerContext` forces expensive global re-renders.
**Action:** Extract rapidly changing UI states from global contexts. Instead, expose the stable `ref` (like `audioRef`) and allow subscriber components (like `BottomPlayer`) to listen to native DOM events and manage their own local state.
