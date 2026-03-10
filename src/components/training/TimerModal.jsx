import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTimer, formatTime } from '../../hooks/useTimer'

// Sound effects for timer
function playBeep(freq = 880, duration = 0.15) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Audio not available
  }
}

function playGoSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [523, 784, 1047]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05)
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.3)
      osc.start(ctx.currentTime + i * 0.05)
      osc.stop(ctx.currentTime + i * 0.05 + 0.3)
    })
  } catch {
    // Audio not available
  }
}

function playDoneSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ;[880, 1047, 1319].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)
      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4)
      osc.start(ctx.currentTime + i * 0.1)
      osc.stop(ctx.currentTime + i * 0.1 + 0.4)
    })
  } catch {
    // Audio not available
  }
}

// Timer types:
// 'sprint'    — On your marks > Set > GO! > stopwatch
// 'stopwatch' — plain stopwatch
// 'countdown' — countdown from duration (seconds)
export default function TimerModal({ mode = 'sprint', durationSec, exerciseName, onClose }) {
  const { phase, elapsed, remaining, startSprint, startStopwatch, startCountdown, stop, reset } = useTimer()

  // Play sounds on phase transitions
  useEffect(() => {
    if (phase === 'marks') playBeep(440, 0.3)
    if (phase === 'set') playBeep(660, 0.3)
    if (phase === 'go') playGoSound()
    if (phase === 'done') playDoneSound()
  }, [phase])

  function handleStart() {
    if (mode === 'sprint') {
      startSprint()
    } else if (mode === 'countdown' && durationSec) {
      startCountdown(durationSec * 1000)
    } else {
      startStopwatch()
    }
  }

  function handleStop() {
    stop()
  }

  function handleReset() {
    reset()
  }

  // Phase display
  const phaseDisplay = {
    marks: { text: 'ON YOUR MARKS', color: '#FFB800', scale: 1.2 },
    set: { text: 'SET', color: '#00D4FF', scale: 1.5 },
    go: { text: 'GO!', color: '#39FF14', scale: 2 },
  }

  const isCountdown = mode === 'countdown'
  const displayTime = isCountdown ? remaining : elapsed

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && phase === 'idle') onClose()
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm mx-4 rounded-3xl px-6 pt-8 pb-8 flex flex-col items-center gap-6"
        style={{
          background: 'linear-gradient(180deg, #1A1A2E 0%, #0A0A1A 100%)',
          border: '1px solid rgba(57,255,20,0.2)',
        }}
      >
        {/* Exercise name */}
        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest text-center">
          {exerciseName || (mode === 'sprint' ? 'Sprint Timer' : 'Timer')}
        </p>

        {/* Countdown sequence */}
        <AnimatePresence mode="wait">
          {phaseDisplay[phase] && (
            <motion.div
              key={phase}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: phaseDisplay[phase].scale, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="flex items-center justify-center"
              style={{ minHeight: 120 }}
            >
              <p
                className="text-4xl font-black uppercase tracking-widest"
                style={{
                  color: phaseDisplay[phase].color,
                  textShadow: `0 0 30px ${phaseDisplay[phase].color}66, 0 0 60px ${phaseDisplay[phase].color}33`,
                }}
              >
                {phaseDisplay[phase].text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer display */}
        {(phase === 'running' || phase === 'done' || phase === 'idle') && !phaseDisplay[phase] && (
          <div className="flex flex-col items-center gap-2" style={{ minHeight: 120, justifyContent: 'center' }}>
            <p
              className="font-mono text-6xl font-black tabular-nums"
              style={{
                color: phase === 'done' ? '#39FF14' : '#F0F0F0',
                textShadow: phase === 'done' ? '0 0 20px #39FF1466' : 'none',
              }}
            >
              {formatTime(displayTime)}
            </p>
            {phase === 'done' && (
              <p className="text-neon text-sm font-bold uppercase tracking-widest">
                {isCountdown ? 'Time!' : 'Stopped'}
              </p>
            )}
            {phase === 'running' && isCountdown && (
              <p className="text-xs text-text-secondary uppercase tracking-wider">remaining</p>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3 w-full">
          {phase === 'idle' && (
            <button
              onClick={handleStart}
              className="flex-1 rounded-xl py-4 font-bold uppercase tracking-widest text-sm transition-all active:scale-95"
              style={{
                background: '#39FF14',
                color: '#0A0A0F',
                boxShadow: '0 0 20px #39FF1444',
              }}
            >
              {mode === 'sprint' ? 'Start Sprint' : 'Start'}
            </button>
          )}

          {phase === 'running' && !isCountdown && (
            <button
              onClick={handleStop}
              className="flex-1 rounded-xl py-4 font-bold uppercase tracking-widest text-sm transition-all active:scale-95"
              style={{
                background: '#FF4444',
                color: '#FFFFFF',
                boxShadow: '0 0 20px #FF444444',
              }}
            >
              Stop
            </button>
          )}

          {phase === 'done' && (
            <>
              <button
                onClick={handleReset}
                className="flex-1 rounded-xl py-4 font-bold uppercase tracking-widest text-sm transition-all active:scale-95"
                style={{
                  background: 'rgba(0,212,255,0.15)',
                  color: '#00D4FF',
                }}
              >
                Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl py-4 font-bold uppercase tracking-widest text-sm transition-all active:scale-95"
                style={{
                  background: '#39FF14',
                  color: '#0A0A0F',
                  boxShadow: '0 0 20px #39FF1444',
                }}
              >
                Done
              </button>
            </>
          )}
        </div>

        {/* Close button for non-running states */}
        {(phase === 'idle' || phase === 'marks' || phase === 'set' || phase === 'go') && (
          <button
            onClick={onClose}
            className="text-xs text-text-secondary uppercase tracking-wider hover:text-text-primary transition-colors py-1"
          >
            Cancel
          </button>
        )}
      </motion.div>
    </motion.div>
  )
}
