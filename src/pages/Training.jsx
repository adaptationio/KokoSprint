import { useState, useMemo, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { useAppContext } from '../context/AppContext'
import { useTraining } from '../hooks/useTraining'
import { useAchievements } from '../hooks/useAchievements'
import { EXERCISES_BY_ID, COACHING_CUES } from '../data/exercises'
import { TOTAL_SESSIONS, RACE_DAY, RACE_DAY_CHECKLIST } from '../data/trainingPlan'
import ExerciseItem from '../components/training/ExerciseItem'
import SessionComplete from '../components/training/SessionComplete'
import TimerModal from '../components/training/TimerModal'

// Map category ids to display labels and ordering
const SECTION_CONFIG = [
  { key: 'warmup',      label: 'Warm-Up' },
  { key: 'drills',      label: 'Drills' },
  { key: 'strength',    label: 'Strength' },
  { key: 'plyometrics', label: 'Plyometrics' },
  { key: 'sprints',     label: 'Sprint Work' },
  { key: 'cooldown',    label: 'Cool-Down' },
]

function groupExercisesBySection(planExercises) {
  const groups = {}
  for (const item of planExercises) {
    const ex = EXERCISES_BY_ID[item.exerciseId]
    if (!ex) continue
    const cat = ex.category
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item)
  }
  return groups
}

function pickRandomCue() {
  return COACHING_CUES[Math.floor(Math.random() * COACHING_CUES.length)]
}

// ── REST DAY ─────────────────────────────────────────────────────────────────
function RestDayScreen({ session }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] px-6 text-center gap-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{ background: 'rgba(57,255,20,0.08)' }}
      >
        😴
      </div>
      <p className="text-3xl font-black text-text-primary uppercase tracking-widest">
        Rest Day
      </p>
      <p className="text-text-secondary text-base max-w-xs leading-relaxed">
        Recovery is training too. Let your muscles repair and come back stronger tomorrow.
      </p>
      {session?.notes && session.notes !== 'REST' && (
        <p className="text-xs text-text-secondary italic mt-2">{session.notes}</p>
      )}
    </div>
  )
}

// ── TAPER DAY ────────────────────────────────────────────────────────────────
function TaperDayScreen({ session }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] px-6 text-center gap-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{ background: 'rgba(0,212,255,0.08)' }}
      >
        🌙
      </div>
      <p className="text-xs font-semibold text-electric uppercase tracking-widest">
        Taper Week
      </p>
      <p className="text-2xl font-black text-text-primary uppercase tracking-widest leading-tight">
        {session.title}
      </p>
      {session.notes && (
        <p className="text-text-secondary text-sm max-w-xs leading-relaxed mt-1">
          {session.notes}
        </p>
      )}
      <p className="text-xs text-text-secondary italic mt-2">
        Your body is priming itself for race day. Trust the process.
      </p>
    </div>
  )
}

// ── RACE DAY ─────────────────────────────────────────────────────────────────
function RaceDayScreen() {
  const [checked, setChecked] = useState(() =>
    Object.fromEntries(RACE_DAY_CHECKLIST.map((item) => [item.id, false]))
  )

  function toggleItem(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const doneCount = Object.values(checked).filter(Boolean).length
  const allDone = doneCount === RACE_DAY_CHECKLIST.length

  return (
    <div className="flex flex-col items-center px-4 pb-16 pt-6 gap-6 max-w-lg mx-auto">
      {/* Hero */}
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
          style={{
            background: 'rgba(57,255,20,0.12)',
            boxShadow: '0 0 40px #39FF1455',
          }}
        >
          🏁
        </div>
        <p
          className="text-5xl font-black uppercase tracking-widest leading-none"
          style={{
            color: '#39FF14',
            textShadow: '0 0 24px #39FF1480',
          }}
        >
          Race Day
        </p>
        <p className="text-text-secondary text-sm max-w-xs leading-relaxed">
          This is what you trained for. Warm up properly, trust your body, and go all out.
        </p>
      </div>

      {/* Checklist */}
      <div className="w-full rounded-xl overflow-hidden" style={{ background: 'rgba(26,26,46,0.85)', border: '1px solid rgba(57,255,20,0.15)' }}>
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <p className="text-xs font-bold text-neon uppercase tracking-widest">Race Day Checklist</p>
          <p className="text-xs font-semibold text-text-secondary">
            <span style={{ color: allDone ? '#39FF14' : '#F0F0F0' }}>{doneCount}</span>/{RACE_DAY_CHECKLIST.length}
          </p>
        </div>
        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {RACE_DAY_CHECKLIST.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-100 active:opacity-70"
              style={{ background: checked[item.id] ? 'rgba(57,255,20,0.06)' : 'transparent' }}
            >
              {/* Checkbox */}
              <div
                className="mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all duration-150"
                style={{
                  borderColor: checked[item.id] ? '#39FF14' : 'rgba(136,136,160,0.4)',
                  background: checked[item.id] ? '#39FF14' : 'transparent',
                }}
              >
                {checked[item.id] && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4.5L4 7.5L10 1" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <p
                className="text-sm leading-snug transition-colors duration-150"
                style={{ color: checked[item.id] ? 'rgba(240,240,240,0.5)' : '#F0F0F0', textDecoration: checked[item.id] ? 'line-through' : 'none' }}
              >
                {item.label}
              </p>
            </button>
          ))}
        </div>
        {allDone && (
          <div className="px-4 py-3 text-center" style={{ background: 'rgba(57,255,20,0.08)' }}>
            <p className="text-neon text-sm font-bold uppercase tracking-wider">You&apos;re ready. Go get it! 🔥</p>
          </div>
        )}
      </div>

      {/* Coaching cues */}
      <div className="w-full rounded-xl overflow-hidden" style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.18)' }}>
        <p className="text-xs font-bold text-electric uppercase tracking-widest px-4 pt-4 pb-2">Coaching Cues</p>
        <div className="px-4 pb-4 flex flex-col gap-2">
          {COACHING_CUES.map((cue, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-electric text-xs mt-0.5 flex-shrink-0">→</span>
              <p className="text-sm text-text-primary leading-snug italic">&ldquo;{cue}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({ label }) {
  return (
    <div className="flex items-center gap-3 mt-6 mb-1">
      <p className="text-xs font-bold text-electric uppercase tracking-widest whitespace-nowrap">
        {label}
      </p>
      <div className="flex-1 h-px" style={{ background: 'rgba(0,212,255,0.15)' }} />
    </div>
  )
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ done, total }) {
  const pct = total > 0 ? (done / total) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: pct === 100
              ? 'linear-gradient(90deg, #39FF14, #00D4FF)'
              : '#39FF14',
            boxShadow: pct > 0 ? '0 0 8px #39FF1488' : 'none',
          }}
        />
      </div>
      <p className="text-xs font-bold text-text-secondary whitespace-nowrap">
        <span className="text-text-primary">{done}</span> / {total}
      </p>
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Training() {
  const { getTodaySession, getSessionExercises, toggleExercise, completeSession } = useTraining()
  const { evaluateAchievements } = useAchievements()
  const { state } = useAppContext()

  const today = format(new Date(), 'yyyy-MM-dd')
  const session = getTodaySession()
  const exerciseLogs = getSessionExercises(today)

  // Check if session is already completed in DB to prevent re-firing overlay on navigation
  const isAlreadyCompleted = useMemo(() => {
    return state.sessions.some(s => s.session_date === today && s.completed)
  }, [state.sessions, today])

  const [noteOpen, setNoteOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [showComplete, setShowComplete] = useState(false)
  const [completionHandled, setCompletionHandled] = useState(false)
  const [timerExercise, setTimerExercise] = useState(null)

  // Pick a random coaching cue once per mount
  const coachingCue = useRef(pickRandomCue())

  // Build checked map from exercise logs
  const checkedMap = useMemo(() => {
    const map = {}
    for (const log of exerciseLogs) {
      map[log.exercise_id] = log.completed
    }
    return map
  }, [exerciseLogs])

  // Count totals
  const totalExercises = session?.exercises?.length ?? 0
  const checkedCount = useMemo(() => {
    if (!session?.exercises) return 0
    return session.exercises.filter((item) => checkedMap[item.exerciseId]).length
  }, [session, checkedMap])

  // Trigger session complete overlay when all exercises checked (only if not already completed)
  useEffect(() => {
    if (
      totalExercises > 0 &&
      checkedCount === totalExercises &&
      !completionHandled &&
      !isAlreadyCompleted &&
      !showComplete
    ) {
      setShowComplete(true)
    }
  }, [checkedCount, totalExercises, completionHandled, isAlreadyCompleted, showComplete])

  async function handleToggle(exerciseId) {
    await toggleExercise(today, exerciseId)
  }

  async function handleRate(rating) {
    await completeSession(today, rating, noteText || null)
    await evaluateAchievements()
    setCompletionHandled(true)
  }

  function handleClose() {
    setShowComplete(false)
  }

  // ── Non-training day screens ─────────────────────────────────────────────
  if (!session) {
    if (today > RACE_DAY) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60dvh] px-6 text-center gap-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{ background: 'rgba(57,255,20,0.08)' }}
          >
            🏅
          </div>
          <p className="text-3xl font-black text-neon uppercase tracking-widest">
            Program Complete
          </p>
          <p className="text-text-secondary text-base max-w-xs leading-relaxed">
            You did it! Check your Progress tab to see how far you&apos;ve come.
          </p>
        </div>
      )
    }
    return (
      <div className="p-6">
        <RestDayScreen session={null} />
      </div>
    )
  }

  if (session.type === 'rest') {
    return (
      <div className="p-6">
        <RestDayScreen session={session} />
      </div>
    )
  }

  if (session.type === 'taper') {
    return (
      <div className="p-6">
        <TaperDayScreen session={session} />
      </div>
    )
  }

  if (session.type === 'race') {
    return <RaceDayScreen />
  }

  // ── Training session ────────────────────────────────────────────────────
  const sessionTypeLabel = session.type === 'oval' ? 'OVAL' : 'HOME'
  const groups = groupExercisesBySection(session.exercises)

  // Count this session's number among all completed sessions
  const sessionNumber = session.dayNumber ?? '?'

  return (
    <div className="flex flex-col pb-32 max-w-2xl mx-auto">
      {/* ── Header ── */}
      <div
        className="px-5 pt-6 pb-5 sticky top-0 z-10"
        style={{
          background: 'linear-gradient(180deg, #0A0A0F 80%, transparent)',
        }}
      >
        {/* Session label */}
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-0.5">
          Week {session.weekNumber} / Day {session.dayNumber} — {sessionTypeLabel} Session
        </p>

        {/* Session title */}
        <p className="text-2xl font-black text-text-primary uppercase tracking-wider leading-tight">
          {session.title}
        </p>

        {/* Coaching cue */}
        <p className="text-sm text-electric italic mt-2 leading-snug">
          "{coachingCue.current}"
        </p>

        {/* Progress bar */}
        <div className="mt-4">
          <ProgressBar done={checkedCount} total={totalExercises} />
        </div>
      </div>

      {/* ── Exercise list ── */}
      <div className="px-4">
        {SECTION_CONFIG.map(({ key, label }) => {
          const items = groups[key]
          if (!items || items.length === 0) return null
          return (
            <div key={key}>
              <SectionHeader label={label} />
              <div
                className="rounded-xl overflow-hidden"
                style={{ background: 'rgba(26,26,46,0.7)' }}
              >
                {items.map((item) => {
                  const ex = EXERCISES_BY_ID[item.exerciseId]
                  return (
                    <ExerciseItem
                      key={item.exerciseId}
                      exercise={ex}
                      checked={!!checkedMap[item.exerciseId]}
                      onToggle={() => handleToggle(item.exerciseId)}
                      overrideSetsReps={item.setsReps}
                      onTimer={(exercise) => setTimerExercise(exercise)}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Optional session notes from plan */}
        {session.notes && session.notes !== 'REST' && (
          <div className="mt-4 rounded-xl px-4 py-3" style={{ background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.2)' }}>
            <p className="text-xs text-warning font-semibold uppercase tracking-wider mb-0.5">
              Coach Note
            </p>
            <p className="text-sm text-text-secondary leading-snug">{session.notes}</p>
          </div>
        )}

        {/* ── Add a note ── */}
        <div className="mt-5">
          {!noteOpen ? (
            <button
              onClick={() => setNoteOpen(true)}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-electric transition-colors duration-150 py-2"
            >
              <span className="text-base leading-none">📝</span>
              <span className="uppercase tracking-wider font-semibold text-xs">Add a Note</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Session Note
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="How did it go? Any PBs, feelings, insights..."
                rows={3}
                autoFocus
                className="w-full rounded-xl px-4 py-3 text-sm text-text-primary resize-none outline-none focus:ring-2 focus:ring-electric/40 transition-all"
                style={{
                  background: 'rgba(26,26,46,0.9)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  caretColor: '#00D4FF',
                }}
              />
              <button
                onClick={() => setNoteOpen(false)}
                className="self-end text-xs text-text-secondary hover:text-text-primary transition-colors py-1"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* ── Manual complete button (for re-trigger or already done) ── */}
        {checkedCount === totalExercises && totalExercises > 0 && (
          <button
            onClick={() => setShowComplete(true)}
            className="mt-4 w-full rounded-xl py-4 font-bold uppercase tracking-widest text-sm transition-all duration-150 active:scale-95"
            style={{
              background: '#39FF14',
              color: '#0A0A0F',
              boxShadow: '0 0 20px #39FF1444',
            }}
          >
            Session Complete 🎉
          </button>
        )}
      </div>

      {/* ── Timer Modal ── */}
      <AnimatePresence>
        {timerExercise && (
          <TimerModal
            mode={timerExercise.timerType}
            durationSec={timerExercise.timerDuration}
            exerciseName={timerExercise.name}
            onClose={() => setTimerExercise(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Session Complete overlay ── */}
      <AnimatePresence>
        {showComplete && (
          <SessionComplete
            sessionNumber={sessionNumber}
            totalSessions={TOTAL_SESSIONS}
            currentDate={today}
            onRate={handleRate}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
