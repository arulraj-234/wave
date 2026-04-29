import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import api, { resolveUrl } from '../api';
import { App as CapacitorApp } from '@capacitor/app';
import { CapacitorMusicControls } from 'capacitor-music-controls-plugin';
import { useToast } from './ToastContext';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const toast = useToast();
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);

  // Load persistent volume, shuffle, and repeat state
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('wave_volume');
    return saved !== null ? parseFloat(saved) : 0.7;
  });
  const [shuffleMode, setShuffleMode] = useState(() => {
    const saved = localStorage.getItem('wave_shuffle');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [repeatMode, setRepeatMode] = useState(() => {
    const saved = localStorage.getItem('wave_repeat');
    return saved !== null ? saved : 'off';
  });

  const [likedSongs, setLikedSongs] = useState(new Set());
  const [playlists, setPlaylists] = useState([]);
  const [likedPlaylists, setLikedPlaylists] = useState([]);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFullScreenPlayer, setIsFullScreenPlayer] = useState(false);
  const [sleepTimer, setSleepTimerState] = useState(null); // remaining seconds
  const sleepTimerRef = useRef(null);
  const audioRef = useRef(new Audio());
  const preloadAudioRef = useRef(new Audio()); // Hidden audio element for preloading next track
  const accumulatedDurationRef = useRef(0);
  const lastPlayTimeRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Enforce aggressive pre-buffering for high quality audio streams, but smart load the next track
  useEffect(() => {
    if (audioRef.current) audioRef.current.preload = 'auto';
    if (preloadAudioRef.current) preloadAudioRef.current.preload = 'metadata'; // wait for 70% progress marker
  }, []);

  // Re-export resolveUrl from api.js for use by components via context
  const resolveBackendUrl = resolveUrl;

  const fetchLikedSongs = async () => {
    try {
      const response = await api.get(`/api/songs/liked/${user.id}`);
      const likedIds = new Set(response.data.songs.map(s => s.song_id));
      setLikedSongs(likedIds);
    } catch (error) {
      console.error("Error fetching liked songs:", error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await api.get(`/api/playlists/user/${user.id}`);
      setPlaylists(response.data.playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const fetchLikedPlaylists = async () => {
    if (!user.id) return;
    try {
      const response = await api.get(`/api/playlists/liked/${user.id}`);
      setLikedPlaylists(response.data.playlists || []);
    } catch (error) {
      console.error("Error fetching liked playlists:", error);
    }
  };

  useEffect(() => {
    if (user.id) {
      fetchLikedSongs();
      fetchPlaylists();
      fetchLikedPlaylists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  // Stable refs for event listeners
  const controlsRef = useRef({ playNext: () => { }, playPrevious: () => { }, togglePlay: () => { } });
  controlsRef.current = {
    playNext: () => playNext(),
    playPrevious: () => playPrevious(),
    togglePlay: () => togglePlay()
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Capacitor) return;

    const handleControlsEvent = (action) => {
      const message = action.message || action;
      switch (message) {
        case 'music-controls-next': controlsRef.current.playNext(); break;
        case 'music-controls-previous': controlsRef.current.playPrevious(); break;
        case 'music-controls-pause':
        case 'music-controls-play':
        case 'music-controls-toggle-play-pause': controlsRef.current.togglePlay(); break;
        case 'music-controls-destroy':
          audioRef.current?.pause();
          setIsPlaying(false);
          try { CapacitorMusicControls.updateIsPlaying({ isPlaying: false }); } catch (e) { }
          break;
      }
    };

    let listenerObj = null;
    try {
      CapacitorMusicControls.addListener("controlsNotification", handleControlsEvent)
        .then(l => listenerObj = l).catch(e => console.log('MusicControls init err', e));

      const androidListener = (event) => handleControlsEvent(event.message || event);
      document.addEventListener("controlsNotification", androidListener);

      return () => {
        if (listenerObj) listenerObj.remove();
        document.removeEventListener("controlsNotification", androidListener);
        try { CapacitorMusicControls.destroy(); } catch (e) { }
      };
    } catch (err) {
      console.error("Music Controls init failed", err);
    }
  }, []);

  const createPlaylist = async (title) => {
    try {
      await api.post('/api/playlists', {
        title,
        user_id: user.id
      });
      fetchPlaylists();
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  const addSongToPlaylist = async (playlistId, songId) => {
    try {
      await api.post(`/api/playlists/${playlistId}/songs`, {
        song_id: songId
      });
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  const toggleLike = async (songId) => {
    if (!user.id) return;
    
    // 1. Optimistic Update
    const isCurrentlyLiked = likedSongs.has(songId);
    setLikedSongs(prev => {
      const next = new Set(prev);
      if (isCurrentlyLiked) next.delete(songId);
      else next.add(songId);
      return next;
    });

    try {
      // 2. Network Request
      const response = await api.post(`/api/songs/${songId}/like`, { user_id: user.id });
      
      // 3. Optional Server Sync (If server disagreed with our optimistic flip)
      if (response.data.liked !== !isCurrentlyLiked) {
        setLikedSongs(prev => {
          const next = new Set(prev);
          if (response.data.liked) next.add(songId);
          else next.delete(songId);
          return next;
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // 4. Rollback on Failure
      setLikedSongs(prev => {
        const next = new Set(prev);
        if (isCurrentlyLiked) next.add(songId);
        else next.delete(songId);
        return next;
      });
      // Try to invoke toast if available
      if (toast) toast.error('Failed to update library. Connection error.');
    }
  };

  const toggleLikePlaylist = async (playlist) => {
    if (!user.id || !playlist) return;
    try {
      const saavnId = playlist.saavn_id || playlist.id;
      if (!saavnId) return;

      const isLiked = likedPlaylists.some(p => p.saavn_playlist_id === saavnId);

      if (isLiked) {
        await api.delete(`/api/playlists/liked/${saavnId}`);
        setLikedPlaylists(prev => prev.filter(p => p.saavn_playlist_id !== saavnId));
      } else {
        await api.post('/api/playlists/liked', {
          user_id: user.id,
          saavn_playlist_id: saavnId,
          title: playlist.title || playlist.name,
          cover_image_url: playlist.cover_image_url || playlist.image
        });
        fetchLikedPlaylists();
      }
    } catch (error) {
      console.error("Error toggling playlist like:", error);
    }
  };

  const fetchAndPlaySimilar = async (seedSong) => {
    if (!seedSong) return;
    try {
      const response = await api.get(`/api/songs/recommendations/${user.id || 0}`);
      const suggestions = response.data.songs || [];
      if (suggestions.length > 0) {
        const historyIds = new Set(history.map(s => s.song_id || s.saavn_id));
        historyIds.add(seedSong.song_id || seedSong.saavn_id);
        const freshSongs = suggestions.filter(s => !historyIds.has(s.song_id || s.saavn_id));
        if (freshSongs.length > 0) {
          startPlayback(freshSongs[0]);
          setQueue(freshSongs.slice(1));
          return;
        }
      }
      setIsPlaying(false);
    } catch (err) {
      console.error("Autoplay fetch failed:", err);
      setIsPlaying(false);
    }
  };

  // Record a stream with actual listen duration
  const recordStream = useCallback((songId, listenDuration) => {
    api.post(`/api/songs/${songId}/stream`, {
      user_id: user.id ? user.id : null,
      listen_duration: Math.round(listenDuration || 0)
    }).catch(err => console.error("Stream tracking error:", err));
  }, [user.id]);

  // Record a skip event (negative signal for recommendation engine)
  const recordSkip = useCallback((songId, skipPosition) => {
    if (!user.id || !songId) return;
    api.post(`/api/songs/${songId}/skip`, {
      user_id: user.id,
      skip_position: Math.round(skipPosition || 0)
    }).catch(err => console.error("Skip tracking error:", err));
  }, [user.id]);

  // Internal: start playing a specific song object
  const startPlayback = useCallback(async (song) => {
    if (!song) return;

    let targetSong = song;

    // Adaptive Quality Determination
    let adaptiveQuality = 'high'; // Default 320kbps
    if (navigator.connection && navigator.connection.effectiveType) {
      if (navigator.connection.effectiveType === '3g') adaptiveQuality = 'medium'; // 160kbps
      else if (navigator.connection.effectiveType === '2g' || navigator.connection.effectiveType === 'slow-2g') adaptiveQuality = 'low'; // 96kbps
    }

    // Intercept raw JioSaavn songs from the queue and auto-import them on the fly
    if ((song.source === 'jiosaavn' || !song.song_id) && song.saavn_id) {
      try {
        const importPayload = { ...song, quality_override: adaptiveQuality };
        const res = await api.post('/api/jiosaavn/import', importPayload);
        if (res.data.success) {
          const imported = res.data.song;
          targetSong = {
            song_id: imported.song_id,
            saavn_id: song.saavn_id,
            title: imported.title,
            audio_url: imported.audio_url,
            cover_image_url: imported.cover_image_url,
            duration: imported.duration,
            artist_id: imported.artist_id,
            artist_name: imported.artist_name,
            artists: imported.artists,
            source: 'local'
          };

          // Silently upgrade the queue array with the localized database song pointer
          setQueue(prev => {
            const next = [...prev];
            const idx = next.findIndex(s => s.saavn_id === targetSong.saavn_id);
            if (idx >= 0) next[idx] = targetSong;
            return next;
          });
        }
      } catch (err) {
        console.error("Auto-import failed during queue progression:", err);
      }
    }

    // Record listen duration for previously playing song
    if (currentSong) {
      let finalDuration = accumulatedDurationRef.current;
      if (lastPlayTimeRef.current && !audioRef.current.paused) {
        finalDuration += (Date.now() - lastPlayTimeRef.current) / 1000;
      }
      if (finalDuration >= 20 && currentSong.song_id) {
        recordStream(currentSong.song_id, finalDuration);
      }
    }

    if (!targetSong.audio_url) return;

    const audioUrl = resolveUrl(targetSong.audio_url);
    audioRef.current.src = audioUrl;
    audioRef.current.play().catch(err => console.error("Playback error:", err));

    setCurrentSong(targetSong);
    setIsPlaying(true);

    accumulatedDurationRef.current = 0;
    lastPlayTimeRef.current = Date.now();

    // Setup Media Session API (lock screen / notification controls)
    if ('mediaSession' in navigator) {
      const coverUrl = targetSong.cover_image_url ? resolveUrl(targetSong.cover_image_url) : '';
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: targetSong.title,
        artist: targetSong.artist_name,
        album: targetSong.album_name || 'Wave',
        artwork: coverUrl ? [
          { src: coverUrl, sizes: '96x96', type: 'image/jpeg' },
          { src: coverUrl, sizes: '256x256', type: 'image/jpeg' },
          { src: coverUrl, sizes: '512x512', type: 'image/jpeg' }
        ] : []
      });
      navigator.mediaSession.playbackState = 'playing';
    }

    // Native Media Controls for Android
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      try {
        const coverUrl = targetSong.cover_image_url ? resolveUrl(targetSong.cover_image_url) : '';
        CapacitorMusicControls.create({
          track: targetSong.title || 'Unknown Track',
          artist: targetSong.artist_name || 'Unknown Artist',
          album: targetSong.album_name || 'Wave Music',
          cover: coverUrl,
          isPlaying: true,
          dismissable: false,
          hasPrev: true,
          hasNext: true,
          hasClose: true,
          // Android 14 requirements
          ticker: `Now playing: ${targetSong.title}`,
          playIcon: 'media_play',
          pauseIcon: 'media_pause',
          prevIcon: 'media_prev',
          nextIcon: 'media_next',
          closeIcon: 'media_close',
          notificationIcon: 'notification'
        }).catch(err => console.error("Native Controls Create Error:", err));
      } catch (err) {
        console.log("CapacitorMusicControls sync error:", err);
      }
    }
  }, [currentSong, recordStream]);


  // Bind Media Session API action handlers dynamically
  // Note: we use refs or ensure we depend on the exact functions
  // so stale closures don't break hardware media keys.
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious());
      navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.fastSeek && ('fastSeek' in audioRef.current)) {
          audioRef.current.fastSeek(details.seekTime);
          return;
        }
        const percentage = (details.seekTime / audioRef.current.duration) * 100;
        seek(percentage);
      });
    }
  }, [currentSong, queue, history, repeatMode, shuffleMode]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);

        // Update MediaSession position state for lock screen seekbar
        if ('mediaSession' in navigator && navigator.mediaSession.setPositionState) {
          try {
            navigator.mediaSession.setPositionState({
              duration: audio.duration,
              playbackRate: audio.playbackRate,
              position: audio.currentTime
            });
          } catch (e) { /* ignore */ }
        }

        // Gapless Preloading Logic (70% playback threshold)
        if (audio.duration > 0 && (audio.currentTime / audio.duration) >= 0.70 && queue.length > 0) {
          const nextSong = queue[0];
          // Determine quality for next track prefetch identically to startPlayback
          let adaptiveQuality = 'high';
          if (navigator.connection && navigator.connection.effectiveType) {
            if (navigator.connection.effectiveType === '3g') adaptiveQuality = 'medium';
            else if (navigator.connection.effectiveType === '2g' || navigator.connection.effectiveType === 'slow-2g') adaptiveQuality = 'low';
          }
          
          // Use the adaptive quality to get the URL or hit the import endpoint if needed
          const preloadSource = nextSong.source === 'jiosaavn' || !nextSong.song_id ? 
            { ...nextSong, quality_override: adaptiveQuality } : nextSong;
            
          // Instead of instantly calling the API to import, we just rely on the audio_url if it exists.
          // True pre-fetching for raw JioSaavn links without audio_url is complex here, 
          // so we only preload if audio_url is already resolved.
          if (preloadSource.audio_url) {
            const nextUrl = resolveUrl(preloadSource.audio_url);
            if (nextUrl && preloadAudioRef.current.src !== nextUrl) {
              preloadAudioRef.current.src = nextUrl;
              preloadAudioRef.current.load();
            }
          }
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      // Repeat one: loop the current song
      if (repeatMode === 'one') {
        let finalDuration = accumulatedDurationRef.current;
        if (lastPlayTimeRef.current) {
          finalDuration += (Date.now() - lastPlayTimeRef.current) / 1000;
          lastPlayTimeRef.current = Date.now();
        }
        if (finalDuration >= 20 && currentSong?.song_id) {
          recordStream(currentSong.song_id, finalDuration);
        }
        accumulatedDurationRef.current = 0;

        audio.currentTime = 0;
        audio.play();
        return;
      }

      // Consumption Logic
      setQueue(prevQueue => {
        if (prevQueue.length === 0) {
          if (currentSong) {
            setTimeout(() => fetchAndPlaySimilar(currentSong), 0);
          } else {
            setIsPlaying(false);
          }
          return [];
        }

        const nextSong = prevQueue[0];
        const remainingQueue = prevQueue.slice(1);

        if (repeatMode === 'all') {
          const nextQueue = [...remainingQueue, currentSong];
          setTimeout(() => startPlayback(nextSong), 0);
          return nextQueue;
        }

        setHistory(prevHist => [...prevHist, currentSong]);
        setTimeout(() => startPlayback(nextSong), 0);
        return remainingQueue;
      });
    };

    const handlePlay = () => {
      lastPlayTimeRef.current = Date.now();
    };

    const handlePause = () => {
      if (lastPlayTimeRef.current) {
        accumulatedDurationRef.current += (Date.now() - lastPlayTimeRef.current) / 1000;
        lastPlayTimeRef.current = null;
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [queue, startPlayback, repeatMode, shuffleMode, currentSong, history, user.id]);

  // Sync remaining playback time on refresh/tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentSong && currentSong.song_id) {
        let finalDuration = accumulatedDurationRef.current;
        if (lastPlayTimeRef.current && !audioRef.current.paused) {
          finalDuration += (Date.now() - lastPlayTimeRef.current) / 1000;
        }
        if (finalDuration >= 20) {
          const apiUrl = resolveBackendUrl(`/api/songs/${currentSong.song_id}/stream`);
          fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({
              user_id: user.id ? user.id : null,
              listen_duration: Math.round(finalDuration)
            }),
            headers: { 'Content-Type': 'application/json' },
            keepalive: true
          }).catch(err => console.error("Unload sync error:", err));
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentSong, user.id]);

  // Play a song, optionally setting the queue to a list of songs
  const playSong = (song, songList = null) => {
    if (songList && Array.isArray(songList)) {
      const idx = songList.findIndex(s =>
        (s.song_id && song.song_id && s.song_id === song.song_id) ||
        (s.saavn_id && song.saavn_id && s.saavn_id === song.saavn_id)
      );
      setQueue(songList.slice(idx >= 0 ? idx + 1 : 1));
    }

    if (currentSong?.song_id === song.song_id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    if (songList && Array.isArray(songList)) {
      const idx = songList.findIndex(s =>
        (s.song_id && song.song_id && s.song_id === song.song_id) ||
        (s.saavn_id && song.saavn_id && s.saavn_id === song.saavn_id)
      );
      setQueue(songList.slice(idx >= 0 ? idx + 1 : 1));
    } else {
      setQueue([]);
    }

    startPlayback(song);
  };

  const playNext = () => {
    // Track skip if user clicked next before 30s of listening
    if (currentSong?.song_id) {
      let listenedSoFar = accumulatedDurationRef.current;
      if (lastPlayTimeRef.current && !audioRef.current.paused) {
        listenedSoFar += (Date.now() - lastPlayTimeRef.current) / 1000;
      }
      if (listenedSoFar < 30) {
        recordSkip(currentSong.song_id, Math.round(listenedSoFar));
      }
    }

    if (queue.length === 0) {
      if (currentSong) fetchAndPlaySimilar(currentSong);
      return;
    }

    setQueue(prevQueue => {
      if (prevQueue.length === 0) return [];

      const nextSong = prevQueue[0];
      const remainingQueue = prevQueue.slice(1);

      if (repeatMode === 'all') {
        const nextQueue = [...remainingQueue, currentSong];
        setTimeout(() => startPlayback(nextSong), 0);
        return nextQueue;
      }

      setHistory(prev => [...prev, currentSong]);
      setTimeout(() => startPlayback(nextSong), 0);
      return remainingQueue;
    });
  };

  const playPrevious = () => {
    // If more than 3 seconds into the song, restart it.
    if (audioRef.current.currentTime > 3) {
      let finalDuration = accumulatedDurationRef.current;
      if (lastPlayTimeRef.current && !audioRef.current.paused) {
        finalDuration += (Date.now() - lastPlayTimeRef.current) / 1000;
        lastPlayTimeRef.current = Date.now();
      }
      if (finalDuration >= 20 && currentSong?.song_id) {
        recordStream(currentSong.song_id, finalDuration);
      }
      accumulatedDurationRef.current = 0;

      audioRef.current.currentTime = 0;
      return;
    }

    if (history.length === 0) {
      // Nothing to go back to, just restart
      audioRef.current.currentTime = 0;
      return;
    }

    // History Logic: Pop from history and prepend to queue
    const prevSong = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setQueue(prevQueue => [currentSong, ...prevQueue]);
    startPlayback(prevSong);
  };

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
      try {
        if (window.Capacitor?.isNativePlatform()) {
          CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
        }
      } catch (e) { }
    } else {
      audioRef.current.play();
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
      try {
        if (window.Capacitor?.isNativePlatform()) {
          CapacitorMusicControls.updateIsPlaying({ isPlaying: true });
        }
      } catch (e) { }
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (percentage) => {
    if (!currentSong || !audioRef.current.duration) return;

    if (percentage === 0) {
      let finalDuration = accumulatedDurationRef.current;
      if (lastPlayTimeRef.current && !audioRef.current.paused) {
        finalDuration += (Date.now() - lastPlayTimeRef.current) / 1000;
        lastPlayTimeRef.current = Date.now();
      }
      if (finalDuration >= 20 && currentSong.song_id) {
        recordStream(currentSong.song_id, finalDuration);
      }
      accumulatedDurationRef.current = 0;
    }

    const time = (percentage / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
  };

  // Set initial audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  const setVolume = (val) => {
    const v = Math.max(0, Math.min(1, val));
    audioRef.current.volume = v;
    setVolumeState(v);
    localStorage.setItem('wave_volume', v.toString());
  };

  const toggleShuffle = () => {
    setShuffleMode(prev => {
      const next = !prev;
      localStorage.setItem('wave_shuffle', JSON.stringify(next));
      return next;
    });
    setQueue(prevQueue => {
      if (!shuffleMode && prevQueue.length > 1) {
        return [...prevQueue].sort(() => Math.random() - 0.5);
      }
      return prevQueue;
    });
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      const next = prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off';
      localStorage.setItem('wave_repeat', next);
      return next;
    });
  };

  // ─── Queue Management ─────────────────────────────────
  const addToQueue = (song) => {
    setQueue(prev => [...prev, song]);
  };

  const removeFromQueue = (index) => {
    setQueue(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const reorderQueue = (sourceIndex, destinationIndex) => {
    if (sourceIndex < 0 || sourceIndex >= queue.length || destinationIndex < 0 || destinationIndex >= queue.length) return;
    setQueue(prevQueue => {
      const newQueue = Array.from(prevQueue);
      const [movedItem] = newQueue.splice(sourceIndex, 1);
      newQueue.splice(destinationIndex, 0, movedItem);
      return newQueue;
    });
  };

  const clearQueue = () => {
    setQueue([]);
  };

  // ─── Sleep Timer ─────────────────────────────────
  const setSleepTimer = (minutes) => {
    // Clear any existing timer
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }

    if (!minutes || minutes <= 0) {
      setSleepTimerState(null);
      return;
    }

    let remaining = minutes * 60;
    setSleepTimerState(remaining);

    sleepTimerRef.current = setInterval(() => {
      remaining -= 1;
      setSleepTimerState(remaining);
      if (remaining <= 0) {
        clearInterval(sleepTimerRef.current);
        sleepTimerRef.current = null;
        setSleepTimerState(null);
        // Pause playback
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }, 1000);
  };

  const cancelSleepTimer = () => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    setSleepTimerState(null);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    };
  }, []);

  // Hardware Back Button / Gesture Integration
  useEffect(() => {
    const backButtonListener = CapacitorApp.addListener('backButton', () => {
      if (isFullScreenPlayer) {
        setIsFullScreenPlayer(false);
      } else if (window.history.length > 1) {
        // Use history.length since HashRouter doesn't report canGoBack correctly
        window.history.back();
      } else {
        CapacitorApp.exitApp();
      }
    });

    return () => {
      backButtonListener.then(listener => listener.remove()).catch(() => { });
    };
  }, [isFullScreenPlayer]);

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, duration, volume, audioRef,
      likedSongs, toggleLike,
      playlists, createPlaylist, addSongToPlaylist,
      likedPlaylists, fetchLikedPlaylists, toggleLikePlaylist,
      playSong, togglePlay, seek, setVolume,
      playNext, playPrevious, queue,
      shuffleMode, repeatMode, toggleShuffle, toggleRepeat,
      addToQueue, removeFromQueue, clearQueue, reorderQueue,
      sleepTimer, setSleepTimer, cancelSleepTimer,
      isSidebarCollapsed, setIsSidebarCollapsed,
      isFullScreenPlayer, setIsFullScreenPlayer,
      fetchAndPlaySimilar,
      resolveUrl: resolveBackendUrl
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
