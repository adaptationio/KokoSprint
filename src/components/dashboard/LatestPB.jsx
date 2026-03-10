import { format, parseISO } from 'date-fns'
import { useProgress } from '../../hooks/useProgress'

export default function LatestPB() {
  const { getLatestPB } = useProgress()
  const pb = getLatestPB()

  if (!pb) return null

  const dateLabel = pb.log_date
    ? format(parseISO(pb.log_date), 'MMM d, yyyy')
    : ''

  return (
    <div className="bg-surface rounded-xl p-5 border-l-4 border-neon flex flex-col gap-2">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 self-start">
        <span className="bg-neon text-bg text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
          New PB
        </span>
      </div>

      {/* Metric name */}
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest">
        {pb.name}
      </p>

      {/* Value */}
      <p className="text-3xl font-black text-neon leading-none">
        {pb.value}
        <span className="text-lg font-semibold text-text-secondary ml-1">{pb.unit}</span>
      </p>

      {/* Date */}
      {dateLabel && (
        <p className="text-xs text-text-secondary">{dateLabel}</p>
      )}
    </div>
  )
}
