import { parseISO, format, isSameDay, isAfter, startOfDay } from 'date-fns'
import { useTraining } from '../../hooks/useTraining'
import { TRAINING_PLAN, PROGRAM_START, RACE_DAY } from '../../data/trainingPlan'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// Type-based styling for uncompleted future/past cells
const TYPE_INDICATORS = {
  home:  { dot: '#A78BFA' },  // purple
  oval:  { dot: '#00D4FF' },  // electric blue
  rest:  { dot: null },
  taper: { dot: '#FFB800' },  // amber
  race:  { dot: '#39FF14' },  // neon
}

// Build an ordered list of all dates in the program (Mar 10 – Apr 2)
function getProgramDates() {
  const start = parseISO(PROGRAM_START)
  const end = parseISO(RACE_DAY)
  const dates = []
  const cursor = new Date(start)
  while (cursor <= end) {
    dates.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

// Day-of-week index: 0=Mon … 6=Sun (getDay() returns 0=Sun, so map it)
function getMondayIndex(date) {
  const d = date.getDay()
  return d === 0 ? 6 : d - 1
}

// Compute current training streak (consecutive completed training days, skipping rest/taper)
function computeStreak(completedSet, todayStr) {
  let streak = 0
  const trainingDays = TRAINING_PLAN
    .filter(s => s.type !== 'rest' && s.type !== 'taper' && s.type !== 'race')
    .filter(s => s.date <= todayStr)
    .reverse()

  for (const s of trainingDays) {
    if (completedSet.has(s.date)) streak++
    else break
  }
  return streak
}

export default function StreakHeatMap() {
  const { getCompletedDates } = useTraining()
  const completedDates = getCompletedDates() // string[] 'yyyy-MM-dd'

  const today = startOfDay(new Date())
  const todayStr = format(today, 'yyyy-MM-dd')
  const programDates = getProgramDates()

  // Build a lookup set for O(1) checks
  const completedSet = new Set(completedDates)

  // Build a lookup for plan sessions
  const planMap = {}
  for (const session of TRAINING_PLAN) {
    planMap[session.date] = session
  }

  // Compute streak
  const streak = computeStreak(completedSet, todayStr)

  // Organise dates into rows (weeks), anchored to Mon–Sun grid
  const firstDate = programDates[0]
  const firstOffset = getMondayIndex(firstDate)

  const totalCells = Math.ceil((firstOffset + programDates.length) / 7) * 7

  const grid = []
  for (let i = 0; i < firstOffset; i++) grid.push(null)
  for (const d of programDates) grid.push(d)
  while (grid.length < totalCells) grid.push(null)

  const rows = []
  for (let i = 0; i < grid.length; i += 7) {
    rows.push(grid.slice(i, i + 7))
  }

  return (
    <div className="bg-surface rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest">
          Training Calendar
        </p>
        {streak > 0 && (
          <p className="text-xs font-bold text-warning uppercase tracking-wider flex items-center gap-1">
            <span className={streak >= 5 ? 'text-base' : streak >= 3 ? 'text-sm' : 'text-xs'}>
              🔥
            </span>
            {streak}-day streak
          </p>
        )}
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 gap-1.5">
        {DAY_LABELS.map((label, i) => (
          <div key={i} className="flex items-center justify-center">
            <span className="text-xs font-semibold text-text-secondary uppercase">{label}</span>
          </div>
        ))}
      </div>

      {/* Calendar rows */}
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-7 gap-1.5">
          {row.map((date, colIdx) => {
            if (!date) {
              return <div key={colIdx} className="aspect-square rounded-sm" />
            }

            const dateStr = format(date, 'yyyy-MM-dd')
            const isToday = isSameDay(date, today)
            const isFuture = isAfter(startOfDay(date), today)
            const isCompleted = completedSet.has(dateStr)
            const session = planMap[dateStr]
            const sessionType = session?.type
            const isActiveDay = sessionType && sessionType !== 'rest'
            const typeInfo = TYPE_INDICATORS[sessionType] || {}

            let cellClass = 'aspect-square rounded-sm flex flex-col items-center justify-center relative'
            let innerClass = 'text-[11px] font-semibold leading-none'

            if (isCompleted) {
              cellClass += ' bg-neon shadow-[0_0_6px_#39FF14]'
              innerClass += ' text-bg'
            } else if (isToday) {
              cellClass += ' bg-surface border-2 border-electric'
              innerClass += ' text-electric'
            } else if (isFuture) {
              cellClass += ' bg-surface/50'
              innerClass += ' text-text-secondary/50'
            } else {
              cellClass += isActiveDay ? ' bg-surface/80' : ' bg-surface/30'
              innerClass += isActiveDay ? ' text-text-secondary/60' : ' text-text-secondary/30'
            }

            return (
              <div key={colIdx} className={cellClass} title={session?.title || dateStr}>
                <span className={innerClass}>{date.getDate()}</span>
                {/* Type indicator dot for non-rest, non-completed days */}
                {!isCompleted && typeInfo.dot && (
                  <div
                    className="w-1 h-1 rounded-full mt-0.5"
                    style={{ backgroundColor: typeInfo.dot, opacity: isFuture ? 0.4 : 0.7 }}
                  />
                )}
              </div>
            )
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-3 mt-1 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-neon shadow-[0_0_4px_#39FF14]" />
          <span className="text-xs text-text-secondary">Done</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm border-2 border-electric" />
          <span className="text-xs text-text-secondary">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#A78BFA' }} />
          <span className="text-xs text-text-secondary">Home</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00D4FF' }} />
          <span className="text-xs text-text-secondary">Oval</span>
        </div>
      </div>
    </div>
  )
}
