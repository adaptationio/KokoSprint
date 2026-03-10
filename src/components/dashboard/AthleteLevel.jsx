import { useMemo } from 'react'
import { useAppContext } from '../../context/AppContext'

const LEVELS = [
  { name: 'Rookie Sprinter', minXP: 0, color: '#8888A0' },
  { name: 'Speed Trainee', minXP: 50, color: '#00D4FF' },
  { name: 'Track Athlete', minXP: 150, color: '#39FF14' },
  { name: 'Sprint Specialist', minXP: 300, color: '#FFB800' },
  { name: 'Speed Demon', minXP: 500, color: '#FF6B35' },
  { name: 'Elite Sprinter', minXP: 750, color: '#FF4444' },
  { name: 'Champion', minXP: 1000, color: '#D946EF' },
]

function getLevel(xp) {
  let level = LEVELS[0]
  let nextLevel = LEVELS[1]
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      level = LEVELS[i]
      nextLevel = LEVELS[i + 1] || null
      break
    }
  }
  return { level, nextLevel }
}

export default function AthleteLevel() {
  const { state } = useAppContext()

  const xp = useMemo(() => {
    let total = 0
    // 20 XP per completed session
    total += state.sessions.filter(s => s.completed).length * 20
    // 5 XP per completed exercise
    total += state.exerciseLogs.filter(l => l.completed).length * 5
    // 15 XP per progress log
    total += state.progressLogs.length * 15
    // 30 XP per achievement
    total += state.unlockedAchievements.length * 30
    return total
  }, [state.sessions, state.exerciseLogs, state.progressLogs, state.unlockedAchievements])

  const { level, nextLevel } = getLevel(xp)

  const progressPct = nextLevel
    ? ((xp - level.minXP) / (nextLevel.minXP - level.minXP)) * 100
    : 100

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{ background: 'rgba(26,26,46,0.7)', border: `1px solid ${level.color}22` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: level.color }}
          >
            {level.name}
          </span>
        </div>
        <span className="text-xs font-bold text-text-secondary tabular-nums">
          {xp} XP
        </span>
      </div>

      {/* Progress bar to next level */}
      {nextLevel && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(progressPct, 100)}%`,
                background: level.color,
                boxShadow: `0 0 8px ${level.color}66`,
              }}
            />
          </div>
          <span className="text-[10px] text-text-secondary whitespace-nowrap">
            {nextLevel.name}
          </span>
        </div>
      )}

      {!nextLevel && (
        <p className="text-[10px] text-text-secondary uppercase tracking-wider">Max level reached</p>
      )}
    </div>
  )
}
