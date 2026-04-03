package com.wave.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Allow auto-play for audio
        getBridge().getWebView().getSettings().setMediaPlaybackRequiresUserGesture(false);
    }

    @Override
    public void onPause() {
        super.onPause();

        // Resume WebView timers immediately so audio/JS keeps running in background
        // BridgeActivity.onPause() calls webView.onPause() which pauses timers & audio
        // We need to undo that for background playback
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            webView.onResume();   // re-enable JS timers
            webView.resumeTimers(); // re-enable global JS timers
        }
    }

    @Override
    public void onResume() {
        super.onResume();
    }
}
