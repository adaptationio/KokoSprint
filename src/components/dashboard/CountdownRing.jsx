import { motion } from 'framer-motion'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { RACE_DAY, PROGRAM_START } from '../../data/trainingPlan'

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

  return (
    <div className="flex flex-col items-center gap-2">
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
    </div>
  )
}
