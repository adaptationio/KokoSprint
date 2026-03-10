const CATEGORY_STYLES = {
  warmup: {
    label: 'WARM-UP',
    text: 'text-warning',
    bg: 'bg-warning/10',
  },
  drills: {
    label: 'DRILLS',
    text: 'text-electric',
    bg: 'bg-electric/10',
  },
  strength: {
    label: 'STRENGTH',
    text: 'text-neon',
    bg: 'bg-neon/10',
  },
  plyometrics: {
    label: 'PLYOMETRICS',
    text: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  sprints: {
    label: 'SPRINTS',
    text: 'text-red-400',
    bg: 'bg-red-400/10',
  },
  cooldown: {
    label: 'COOL-DOWN',
    text: 'text-blue-300',
    bg: 'bg-blue-300/10',
  },
}

export default function ExerciseCard({ exercise }) {
  const { name, category, why, setsReps, safetyNote, notes, youtubeSearch } = exercise
  const style = CATEGORY_STYLES[category] ?? {
    label: category.toUpperCase(),
    text: 'text-text-secondary',
    bg: 'bg-white/10',
  }

  return (
    <div className="bg-surface rounded-xl p-5 border border-white/5 flex flex-col gap-2">
      {/* Name + category badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold uppercase leading-tight text-text-primary flex-1">
          {name}
        </h3>
        <span
          className={`shrink-0 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${style.text} ${style.bg}`}
        >
          {style.label}
        </span>
      </div>

      {/* Why description */}
      {why && (
        <p className="text-sm text-text-secondary mt-1">{why}</p>
      )}

      {/* Sets / reps */}
      {setsReps && (
        <p className="text-sm text-text-secondary">
          <span className="text-text-primary font-semibold">Volume:</span> {setsReps}
        </p>
      )}

      {/* Notes */}
      {notes && (
        <p className="text-xs text-text-secondary italic">{notes}</p>
      )}

      {/* Safety note */}
      {safetyNote && (
        <p className="text-xs text-warning mt-1">⚠️ {safetyNote}</p>
      )}

      {/* YouTube link — pushed to bottom */}
      <div className="mt-auto pt-3">
        <a
          href={youtubeSearch}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-electric active:opacity-70 transition-opacity"
        >
          WATCH VIDEO ▶
        </a>
      </div>
    </div>
  )
}
