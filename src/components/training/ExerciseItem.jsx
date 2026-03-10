import NeonCheckbox from './NeonCheckbox'

// Play icon SVG (YouTube)
function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1" />
      <path d="M6.5 5.5L11 8L6.5 10.5V5.5Z" fill="currentColor" />
    </svg>
  )
}

export default function ExerciseItem({ exercise, checked, onToggle, overrideSetsReps }) {
  if (!exercise) return null

  const setsReps = overrideSetsReps || exercise.setsReps

  return (
    <div
      className="flex items-start gap-3 py-3 px-1 border-b border-white/5 last:border-0"
    >
      {/* Checkbox — min 44px tap target handled internally */}
      <NeonCheckbox checked={checked} onChange={onToggle} />

      {/* Exercise info */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p
              className={
                'text-base font-bold leading-tight transition-colors duration-200 ' +
                (checked ? 'text-text-secondary line-through' : 'text-text-primary')
              }
            >
              {exercise.name}
            </p>
            {exercise.why && (
              <p className="text-xs text-text-secondary mt-0.5 leading-snug">
                {exercise.why}
              </p>
            )}
          </div>

          {/* Right side: sets/reps + YouTube */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {/* Sets/reps pill */}
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-electric whitespace-nowrap"
              style={{ background: 'rgba(0,212,255,0.12)' }}
            >
              {setsReps}
            </span>

            {/* YouTube link — 44px min touch target */}
            {exercise.youtubeSearch && (
              <a
                href={exercise.youtubeSearch}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 text-text-secondary hover:text-electric transition-colors duration-150"
                style={{ minWidth: 44, minHeight: 44 }}
                aria-label={`Watch ${exercise.name} tutorial on YouTube`}
                onClick={(e) => e.stopPropagation()}
              >
                <PlayIcon />
                <span className="text-[10px] font-semibold uppercase tracking-wide">Video</span>
              </a>
            )}
          </div>
        </div>

        {/* Safety note */}
        {exercise.safetyNote && (
          <p className="text-xs text-warning mt-1.5 leading-snug">
            ⚠️ {exercise.safetyNote}
          </p>
        )}

        {/* Notes */}
        {exercise.notes && (
          <p className="text-xs text-text-secondary italic mt-1 leading-snug">
            {exercise.notes}
          </p>
        )}
      </div>
    </div>
  )
}
