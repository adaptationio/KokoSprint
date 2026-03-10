import { motion } from 'framer-motion'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { RACE_DAY, PROGRAM_START } from '../../data/trainingPlan'

// Special milestone messages for key countdown numbers
const MILESTONES = {
  21: { text: '3 weeks to go — the journey begins!', color: '#00D4FF' },
  14: { text: '2 weeks! Your speed is building.', color: '#00D4FF' },
  10: { text: 'Single digits coming! Keep pushing.', color: '#FFB800' },
  7: { text: '1 WEEK! You can taste it.', color: '#FFB800' },
  5: { text: '5 days — taper time. Rest = power.', color: '#D946EF' },
  3: { text: '3 days! Your body is READY.', color: '#FF6B35' },
  2: { text: 'Almost there. Stay loose, stay sharp.', color: '#FF6B35' },
  1: { text: 'TOMORROW! Early bed, big dreams.', color: '#FF4444' },
  0: { text: "IT'S RACE DAY! GO GET IT! 🔥", color: '#39FF14' },
}

const MOTIVATIONAL_QUOTES = [
  "Every rep is making you faster",
  "Champions train when they don't feel like it",
  "You're building something special",
  "Trust the process — speed is coming",
  "Today's effort = race day confidence",
  "Your future self is cheering you on",
  "One session closer to your best race",
  "Speed is earned, not given",
  "You've got this, Koko!",
  "Show up. Work hard. Get faster.",
  "The track is waiting for you",
  "Every stride counts",
  "Train like a champion today",
  "Believe in the work you're putting in",
  "Race day will be YOUR day",
  "Small steps, big speed",
  "The countdown is on — let's go!",
  "Your legs are getting stronger every day",
  "Focus. Train. Dominate.",
  "You're already faster than yesterday",
  "The finish line is calling your name",
  "Sprint training superstar in the making",
  "Give it everything today",
  "Race day? You were BORN for this!",
]

const SIZE = 200
const STROKE_WIDTH = 8
const RADIUS = 90
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const CENTER = SIZE / 2

export default function CountdownRing() {
  const today = new Date()
  const raceDay = parseISO(RACE_DAY)
  const programStart = parseISO(PROGRAM_START)

  const totalDays = differenceInCalendarDays(raceDay, programStart)
  const daysRemaining = Math.max(0, differenceInCalendarDays(raceDay, today))
  const daysElapsed = totalDays - daysRemaining
  const progress = Math.min(1, Math.max(0, daysElapsed / totalDays))

  const targetDashoffset = CIRCUMFERENCE * (1 - progress)

  // Check for milestone message first, then fall back to rotating quotes
  const milestone = MILESTONES[daysRemaining]
  const quote = milestone?.text || MOTIVATIONAL_QUOTES[daysRemaining % MOTIVATIONAL_QUOTES.length]

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="drop-shadow-[0_0_16px_#39FF1440]"
      >
        {/* Background track circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#1A1A2E"
          strokeWidth={STROKE_WIDTH}
        />

        {/* Progress ring — animated on mount */}
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#39FF14"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: targetDashoffset }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${CENTER}px ${CENTER}px` }}
        />

        {/* Center text */}
        <text
          x={CENTER}
          y={CENTER - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={daysRemaining === 0 ? '#39FF14' : '#F0F0F0'}
          fontSize={daysRemaining === 0 ? '28' : '44'}
          fontWeight="700"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="-2"
        >
          {daysRemaining === 0 ? 'RACE' : daysRemaining}
        </text>

        {/* Sub-label */}
        <text
          x={CENTER}
          y={CENTER + 26}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={daysRemaining === 0 ? '#39FF14' : '#8888A0'}
          fontSize="11"
          fontWeight="600"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="1.5"
        >
          {daysRemaining === 0 ? 'DAY!' : 'DAYS TO RACE DAY'}
        </text>
      </svg>
      <p
        className="text-sm italic text-center max-w-[240px] leading-snug font-semibold"
        style={{ color: milestone?.color || '#8888A0' }}
      >
        {milestone ? quote : <>&ldquo;{quote}&rdquo;</>}
      </p>
    </div>
  )
}
