import { useState, useRef, useCallback, useEffect } from 'react'

// Timer modes:
// 'sprint'   – "On your marks → Set → GO!" countdown then stopwatch
// 'stopwatch' – plain stopwatch (for timed exercises like plank holds)
// 'countdown' – countdown from a set duration (for rest periods)

export function useTimer() {
  const [phase, setPhase] = useState('idle') // idle | marks | set | go | running | done
  const [elapsed, setElapsed] = useState(0)  // ms
  const [remaining, setRemaining] = useState(0) // ms (countdown mode)
  const startRef = useRef(null)
  const rafRef = useRef(null)
  const durationRef = useRef(0)
  const modeRef = useRef('sprint')

  const tick = useCallback(() => {
    if (!startRef.current) return
    const now = performance.now()
    const ms = now - startRef.current

    if (modeRef.current === 'countdown') {
      const rem = Math.max(0, durationRef.current - ms)
      setRemaining(rem)
      if (rem <= 0) {
        setPhase('done')
        return
      }
    } else {
      setElapsed(ms)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  // Start sprint sequence: marks → set → GO!
  const startSprint = useCallback(() => {
    setPhase('marks')
    setElapsed(0)

    setTimeout(() => {
      setPhase('set')
      setTimeout(() => {
        setPhase('go')
        setTimeout(() => {
          modeRef.current = 'sprint'
          startRef.current = performance.now()
          setPhase('running')
          rafRef.current = requestAnimationFrame(tick)
        }, 600)
      }, 1500)
    }, 1500)
  }, [tick])

  // Start plain stopwatch
  const startStopwatch = useCallback(() => {
    modeRef.current = 'stopwatch'
    setElapsed(0)
    startRef.current = performance.now()
    setPhase('running')
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  // Start countdown (durationMs in milliseconds)
  const startCountdown = useCallback((durationMs) => {
    modeRef.current = 'countdown'
    durationRef.current = durationMs
    setRemaining(durationMs)
    startRef.current = performance.now()
    setPhase('running')
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  // Stop and return elapsed time
  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    const final = startRef.current ? performance.now() - startRef.current : 0
    startRef.current = null
    setPhase('done')
    setElapsed(final)
    return final
  }, [])

  // Reset everything
  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    startRef.current = null
    setPhase('idle')
    setElapsed(0)
    setRemaining(0)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return {
    phase,
    elapsed,
    remaining,
    startSprint,
    startStopwatch,
    startCountdown,
    stop,
    reset,
  }
}

// Format ms to display string
export function formatTime(ms) {
  const totalSec = ms / 1000
  const mins = Math.floor(totalSec / 60)
  const secs = totalSec % 60
  if (mins > 0) {
    return `${mins}:${secs.toFixed(2).padStart(5, '0')}`
  }
  return secs.toFixed(2)
}
