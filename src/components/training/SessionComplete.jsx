import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { TRAINING_PLAN } from '../../data/trainingPlan'

const RATINGS = [
  { value: 'easy', emoji: '😌', label: 'Easy' },
  { value: 'good', emoji: '💪', label: 'Good' },
  { value: 'tough', emoji: '😤', label: 'Tough' },
  { value: 'crushed_it', emoji: '🔥', label: 'Crushed It' },
]

function TomorrowPreview({ currentDate }) {
  const currentIndex = TRAINING_PLAN.findIndex((s) => s.date === currentDate)
  if (currentIndex === -1) return null

  // Find the next non-rest session after today
  const nextSessions = TRAINING_PLAN.slice(currentIndex + 1)
  const nextTraining = nextSessions.find(
    (s) => s.type !== 'rest' && s.type !== 'taper' && s.type !== 'race'
  )
  const nextDay = nextSessions[0] // the very next day in the plan

  if (!nextDay && !nextTraining) return null

  const preview = nextDay || nextTraining

  return (
    <div
      className="rounded-xl p-4 mt-4 flex flex-col gap-1"
      style={{ background: 'rgba(26,26,46,0.9)', border: '1px solid rgba(0,212,255,0.2)' }}
    >
      <p className="text-xs font-semibold text-electric uppercase tracking-widest">
        Up Next
      </p>
      <p className="text-sm font-bold text-text-primary uppercase tracking-wide">
        {preview.title}
      </p>
      {preview.type === 'rest' && (
        <p className="text-xs text-text-secondary">Rest day — recovery is training too.</p>
      )}
      {preview.type === 'taper' && preview.notes && (
        <p className="text-xs text-text-secondary">{preview.notes}</p>
      )}
      {preview.type !== 'rest' && preview.type !== 'taper' && preview.exercises?.length > 0 && (
        <p className="text-xs text-text-secondary">
          {preview.exercises.length} exercises
          {preview.weekNumber && preview.dayNumber
            ? ` · Week ${preview.weekNumber} / Day ${preview.dayNumber}`
            : ''}
        </p>
      )}
    </div>
  )
}

export default function SessionComplete({ sessionNumber, totalSessions, currentDate, onRate, onClose }) {
  const [selectedRating, setSelectedRating] = useState(null)
  const [rated, setRated] = useState(false)

  useEffect(() => {
    // Fire confetti burst on mount
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#39FF14', '#00D4FF', '#FFB800'],
    })

    // Second burst for extra impact
    const timer = setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { x: 0.2, y: 0.7 },
        colors: ['#39FF14', '#FFB800'],
      })
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { x: 0.8, y: 0.7 },
        colors: ['#00D4FF', '#39FF14'],
      })
    }, 250)

    return () => clearTimeout(timer)
  }, [])

  async function handleRate(value) {
    setSelectedRating(value)
    setRated(true)
    try {
      await onRate(value)
    } catch {
      // Rating saved locally even if network fails
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => {
        // Only close if clicking backdrop, not content
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="w-full max-w-lg rounded-t-3xl px-6 pt-8 pb-10 flex flex-col gap-6"
        style={{
          background: 'linear-gradient(180deg, #1A1A2E 0%, #0A0A1A 100%)',
          border: '1px solid rgba(57,255,20,0.2)',
          borderBottom: 'none',
          maxHeight: '90dvh',
          overflowY: 'auto',
        }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto -mt-2" />

        {/* Hero title */}
        <div className="text-center">
          <motion.p
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', damping: 14 }}
            className="text-4xl font-black uppercase tracking-widest leading-tight"
            style={{
              color: '#39FF14',
              textShadow: '0 0 20px #39FF1466, 0 0 40px #39FF1433',
            }}
          >
            SESSION {sessionNumber}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg font-bold text-text-primary uppercase tracking-widest mt-1"
          >
            of {totalSessions} Complete
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-text-secondary text-sm mt-2"
          >
            You showed up. That's what champions do.
          </motion.p>
        </div>

        {/* Rating section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <p className="text-center text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
            How did it feel?
          </p>
          <div className="grid grid-cols-4 gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                onClick={() => handleRate(r.value)}
                disabled={rated}
                className={
                  'flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all duration-200 ' +
                  (selectedRating === r.value
                    ? 'ring-2 ring-neon shadow-[0_0_12px_#39FF1444]'
                    : rated
                    ? 'opacity-40'
                    : 'hover:bg-white/10 active:scale-95')
                }
                style={{
                  background:
                    selectedRating === r.value
                      ? 'rgba(57,255,20,0.12)'
                      : 'rgba(26,26,46,0.9)',
                  minHeight: 72,
                }}
              >
                <span className="text-2xl leading-none">{r.emoji}</span>
                <span className="text-xs text-text-secondary font-medium leading-tight text-center">
                  {r.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tomorrow's preview — appears after rating */}
        <AnimatePresence>
          {rated && currentDate && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TomorrowPreview currentDate={currentDate} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Done button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={onClose}
          className="w-full rounded-xl py-4 font-bold uppercase tracking-widest text-sm transition-all duration-150 active:scale-95"
          style={{
            background: rated ? '#39FF14' : 'rgba(57,255,20,0.15)',
            color: rated ? '#0A0A0F' : '#39FF14',
            boxShadow: rated ? '0 0 20px #39FF1444' : 'none',
          }}
        >
          {rated ? 'Done — Keep Going!' : 'Close'}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
