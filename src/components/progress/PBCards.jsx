import { useProgress } from '../../hooks/useProgress'

const METRIC_ORDER = ['30m_time', '60m_time', 'broad_jump', 'plank_hold']

export default function PBCards() {
  const { getPersonalBests, METRIC_LABELS } = useProgress()
  const pbs = getPersonalBests()

  return (
    <div className="relative">
    <div className="flex gap-3 overflow-x-auto snap-x pb-2 scrollbar-hide">
      {METRIC_ORDER.map((metric) => {
        const info = METRIC_LABELS[metric]
        const pb = pbs[metric]

        return (
          <div
            key={metric}
            className="flex-shrink-0 snap-start bg-surface rounded-xl p-4 border-t-2 border-neon"
            style={{ minWidth: '140px' }}
          >
            <p className="text-xs uppercase tracking-wider text-text-secondary mb-2">
              {info.name}
            </p>
            {pb ? (
              <>
                <p className="text-2xl font-bold text-text-primary leading-none">
                  {pb.value}
                  <span className="text-sm font-normal text-text-secondary ml-1">
                    {info.unit}
                  </span>
                </p>
                <p className="text-xs text-text-secondary mt-2">
                  {new Date(pb.log_date).toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'UTC',
                  })}
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-text-secondary leading-none">—</p>
                <p className="text-xs text-text-secondary mt-2">No data yet</p>
              </>
            )}
          </div>
        )
      })}
    </div>
    {/* Scroll affordance fade on right edge */}
    <div
      className="absolute right-0 top-0 bottom-2 w-8 pointer-events-none"
      style={{ background: 'linear-gradient(90deg, transparent, var(--color-bg))' }}
    />
    </div>
  )
}
