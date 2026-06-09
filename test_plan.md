1. *Refactor `PlayerContext` to remove `progress` state*
   - Remove `progress` state from `frontend/src/context/PlayerContext.jsx` to avoid global re-renders on every `timeupdate` event.
   - Stop exporting `progress` and instead export `audioRef` from `PlayerContext.Provider`.
2. *Update `Dashboard` component*
   - Remove the unused `progress` variable from the `useContext(PlayerContext)` destructured variables in `frontend/src/pages/Dashboard.jsx`.
3. *Implement local progress state in `BottomPlayer`*
   - Update `frontend/src/components/BottomPlayer.jsx` to use a local `progress` state.
   - Implement a `useEffect` hook to listen to `audioRef.current`'s `timeupdate` event and update the local `progress` state independently, preventing full application re-renders.
4. *Complete pre commit steps*
   - Complete pre commit steps to make sure proper testing, verifications, reviews and reflections are done.
5. *Create PR*
   - Submit the change with a descriptive commit message highlighting the performance optimization.
