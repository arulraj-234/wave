import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PlayerProvider } from './context/PlayerContext'
import { ToastProvider } from './context/ToastContext'

import { PerformanceProvider } from './context/PerformanceContext'
import { MotionConfig } from 'motion/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PerformanceProvider>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <PlayerProvider>
            <App />
          </PlayerProvider>
        </ToastProvider>
      </MotionConfig>
    </PerformanceProvider>
  </StrictMode>,
)
