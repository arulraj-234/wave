"""
precompute.py — Background Precomputation Manager

Runs on a background daemon thread to periodically rebuild
the recommendation matrices without blocking Flask requests.

Schedule:
  - On startup: build all matrices immediately
  - Every 30 min: refresh content similarity matrix
  - Every 60 min: refresh collaborative co-occurrence + Markov transitions
"""

import threading
import time
import traceback


_thread = None
_running = False


def _precompute_loop():
    """Main background loop. Runs forever on a daemon thread."""
    global _running
    
    # Initial delay — let the Flask app fully boot and DB pool initialize
    time.sleep(5)
    
    print("[RecEngine] Background precomputation thread started")
    
    cycle = 0
    while _running:
        try:
            start = time.time()
            
            # Always rebuild content similarity (lightweight with ~20 songs)
            from engine.features import build_similarity_matrix
            build_similarity_matrix()
            
            # Every other cycle (i.e., every 60 min), rebuild heavier matrices
            if cycle % 2 == 0:
                from engine.collaborative import build_cooccurrence_matrix
                build_cooccurrence_matrix()
                
                from engine.session import build_transition_matrix
                build_transition_matrix()
            
            elapsed = round(time.time() - start, 2)
            print(f"[RecEngine] Precomputation cycle {cycle} completed in {elapsed}s")
            
        except Exception as e:
            print(f"[RecEngine] Precomputation error: {e}")
            traceback.print_exc()
        
        cycle += 1
        
        # Sleep for 30 minutes between cycles
        for _ in range(1800):  # Check _running every second so we can shut down quickly
            if not _running:
                break
            time.sleep(1)
    
    print("[RecEngine] Background precomputation thread stopped")


def start():
    """Start the background precomputation thread."""
    global _thread, _running
    
    if _thread and _thread.is_alive():
        print("[RecEngine] Precomputation thread already running")
        return
    
    _running = True
    _thread = threading.Thread(target=_precompute_loop, daemon=True, name="RecEnginePrecompute")
    _thread.start()
    print("[RecEngine] Background precomputation thread launched")


def stop():
    """Signal the background thread to stop."""
    global _running
    _running = False
    print("[RecEngine] Stopping precomputation thread...")
