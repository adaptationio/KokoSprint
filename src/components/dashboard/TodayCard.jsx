import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { useTraining } from '../../hooks/useTraining'
import { RACE_DAY } from '../../data/trainingPlan'

export default function TodayCard() {
  const { getTodaySession } = useTraining()
  const session = getTodaySession()
  const today = format(new Date(), 'yyyy-MM-dd')

  if (!session) {
    // After race day — show celebration
    if (today > RACE_DAY) {
      return (
        <div className="bg-surface rounded-xl p-6 flex flex-col items-center gap-3 text-center">
          <p className="text-4xl">🏅</p>
          <p className="text-xl font-black text-neon uppercase tracking-widest">
            Training Complete!
          </p>
          <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
            You crushed the program and gave it your all on race day. Be proud of everything you achieved!
          </p>
        </div>
      )
    }
    return (
      <div className="bg-surface rounded-xl p-6">
        <p className="text-text-secondary text-sm uppercase tracking-wider font-semibold">
          No session scheduled today
        </p>
      </div>
    )
  }

  if (session.type === 'race') {
    return (
      <div className="bg-surface rounded-xl p-6 flex flex-col items-center gap-3">
        <p className="text-4xl font-black text-neon uppercase tracking-widest drop-shadow-[0_0_16px_#39FF1480]">
          RACE DAY
        </p>
        <p className="text-text-secondary text-sm uppercase tracking-wider">
          Today is the big day — go get it!
        </p>
      </div>
    )
  }

  if (session.type === 'rest') {
    return (
      <div className="bg-surface rounded-xl p-6 flex flex-col gap-2">
        <p className="text-xl font-bold text-text-primary uppercase tracking-wider">Rest Day</p>
        <p className="text-text-secondary text-sm">Recovery is training too.</p>
      </div>
    )
  }

  if (session.type === 'taper') {
    return (
      <div className="bg-surface rounded-xl p-6 flex flex-col gap-2">
        <p className="text-xs font-semibold text-electric uppercase tracking-widest mb-1">
          Taper Week
        </p>
        <p className="text-xl font-bold text-text-primary uppercase tracking-wider">
          {session.title}
        </p>
        {session.notes && (
          <p className="text-text-secondary text-sm mt-1">{session.notes}</p>
        )}
      </div>
    )
  }

  // Regular training session (home or oval)
  const sessionTypeLabel = session.type === 'oval' ? 'OVAL' : 'HOME'
  const exerciseCount = session.exercises?.length ?? 0

  return (
    <div className="bg-surface rounded-xl p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest">
          Week {session.weekNumber} / Day {session.dayNumber} — {sessionTypeLabel} Session
        </p>
        <p className="text-xl font-bold text-text-primary uppercase tracking-wider leading-tight">
          {session.title}
        </p>
        {session.notes && session.notes !== 'REST' && (
          <p className="text-text-secondary text-xs mt-0.5">{session.notes}</p>
        )}
      </div>

      {/* Exercise count */}
      <p className="text-text-secondary text-sm">
        <span className="text-text-primary font-semibold">{exerciseCount}</span> exercises planned
      </p>

      {/* CTA */}
      <Link
        to="/training"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-neon text-bg font-bold uppercase tracking-wider text-sm px-6 py-3 w-full
          shadow-[0_0_16px_#39FF1440] hover:shadow-[0_0_24px_#39FF1460] active:scale-95 transition-all"
      >
        Start Session
      </Link>
    </div>
  )
}
