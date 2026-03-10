export default function BadgeCard({ achievement, unlocked, unlockedAt }) {
  const formattedDate = unlockedAt
    ? new Date(unlockedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  if (unlocked) {
    return (
      <div
        className="bg-surface rounded-xl p-4 border border-neon/30 flex flex-col items-center text-center gap-2"
        style={{ boxShadow: '0 0 15px rgba(57,255,20,0.15)' }}
      >
        <span className="text-4xl leading-none">{achievement.icon}</span>
        <p className="font-bold text-sm text-text-primary leading-tight">{achievement.name}</p>
        <p className="text-xs text-text-secondary leading-snug">{achievement.description}</p>
        <p className="text-xs text-neon mt-auto pt-1">{formattedDate}</p>
      </div>
    )
  }

  return (
    <div className="bg-surface/50 rounded-xl p-4 border border-white/5 flex flex-col items-center text-center gap-2 opacity-40">
      <span className="text-4xl leading-none">🔒</span>
      <p className="font-bold text-sm text-text-secondary leading-tight">{achievement.name}</p>
      <p className="text-xs text-text-secondary/50 leading-snug">{achievement.description}</p>
    </div>
  )
}
