import { parseISO, format, isSameDay, isAfter, startOfDay } from 'date-fns'
import { useTraining } from '../../hooks/useTraining'
import { TRAINING_PLAN, PROGRAM_START, RACE_DAY } from '../../data/trainingPlan'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

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

export default function StreakHeatMap() {
  const { getCompletedDates } = useTraining()
  const completedDates = getCompletedDates() // string[] 'yyyy-MM-dd'

  const today = startOfDay(new Date())
  const programDates = getProgramDates()

  // Build a lookup set for O(1) checks
  const completedSet = new Set(completedDates)

  // Build a lookup for plan day types
  const planMap = {}
  for (const session of TRAINING_PLAN) {
    planMap[session.date] = session.type
  }

  // Organise dates into rows (weeks), anchored to Mon–Sun grid
  // Find the Monday-index offset of the first date so we can pad correctly
  const firstDate = programDates[0]
  const firstOffset = getMondayIndex(firstDate) // 0=Mon … 6=Sun

  // Total cells = offset + programDates.length, rounded up to full weeks
  const totalCells = Math.ceil((firstOffset + programDates.length) / 7) * 7

  // Build the flat grid: null for padding, Date for real days
  const grid = []
  for (let i = 0; i < firstOffset; i++) grid.push(null)
  for (const d of programDates) grid.push(d)
  while (grid.length < totalCells) grid.push(null)

  // Split into rows of 7
  const rows = []
  for (let i = 0; i < grid.length; i += 7) {
    rows.push(grid.slice(i, i + 7))
  }

  return (
    <div className="bg-surface rounded-xl p-5 flex flex-col gap-3">
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest">
        Training Calendar
      </p>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 gap-1.5">
        {DAY_LABELS.map((label, i) => (
          <div key={i} className="flex items-center justify-center">
            <span className="text-[10px] font-semibold text-text-secondary uppercase">{label}</span>
          </div>
        ))}
      </div>

      {/* Calendar rows */}
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-7 gap-1.5">
          {row.map((date, colIdx) => {
            if (!date) {
              // Empty padding cell
              return <div key={colIdx} className="aspect-square rounded-sm" />
            }

            const dateStr = format(date, 'yyyy-MM-dd')
            const isToday = isSameDay(date, today)
            const isFuture = isAfter(startOfDay(date), today)
            const isCompleted = completedSet.has(dateStr)
            const sessionType = planMap[dateStr]
            const isActiveDay = sessionType && sessionType !== 'rest'

            let cellClass = 'aspect-square rounded-sm flex items-center justify-center relative'
            let innerClass = 'text-[8px] font-semibold'

            if (isCompleted) {
              // Completed: neon green with glow
              cellClass += ' bg-neon shadow-[0_0_6px_#39FF14]'
              innerClass += ' text-bg'
            } else if (isToday) {
              // Today: electric blue border
              cellClass += ' bg-surface border-2 border-electric'
              innerClass += ' text-electric'
            } else if (isFuture) {
              // Future: very subtle
              cellClass += ' bg-surface/50'
              innerClass += ' text-text-secondary/40'
            } else {
              // Past incomplete: dark surface (no red)
              cellClass += isActiveDay ? ' bg-surface/80' : ' bg-surface/30'
              innerClass += isActiveDay ? ' text-text-secondary/60' : ' text-text-secondary/30'
            }

            return (
              <div key={colIdx} className={cellClass} title={dateStr}>
                <span className={innerClass}>{date.getDate()}</span>
              </div>
            )
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-neon shadow-[0_0_4px_#39FF14]" />
          <span className="text-[10px] text-text-secondary">Done</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm border-2 border-electric" />
          <span className="text-[10px] text-text-secondary">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-surface/50" />
          <span className="text-[10px] text-text-secondary">Upcoming</span>
        </div>
      </div>
    </div>
  )
}
