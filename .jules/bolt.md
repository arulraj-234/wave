## 2024-05-24 - Frontend Re-rendering bottleneck with PlayerContext
**Learning:** `PlayerContext` in the frontend stores `progress` which updates frequently (`timeupdate` event from audio), causing every component consuming `PlayerContext` to re-render several times a second.
**Action:** Expose `audioRef` from `PlayerContext` and move `progress` state locally to `BottomPlayer.jsx` using an event listener.
