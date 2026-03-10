import { AnimatePresence, motion } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { useAchievements } from '../../hooks/useAchievements'
import { ACHIEVEMENTS } from '../../data/achievements'
import BadgeCard from './BadgeCard'

export default function AchievementsDrawer({ isOpen, onClose }) {
  const { state } = useAppContext()
  const { isUnlocked } = useAchievements()

  const unlockedCount = ACHIEVEMENTS.filter(a => isUnlocked(a.id)).length

  function getUnlockedAt(achievementId) {
    const record = state.unlockedAchievements.find(
      a => a.achievement_id === achievementId
    )
    return record?.created_at ?? null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/80 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg rounded-t-2xl"
            style={{ height: '80dvh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
              <div>
                <h2 className="font-black text-base uppercase tracking-widest text-text-primary">
                  Achievements
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  {unlockedCount > 0
                    ? `${unlockedCount} / ${ACHIEVEMENTS.length} Unlocked`
                    : 'Your first badge is waiting!'}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close achievements"
                className="text-text-secondary hover:text-text-primary transition-colors text-2xl leading-none p-1 -mr-1"
              >
                ×
              </button>
            </div>

            {/* Scrollable grid */}
            <div className="overflow-y-auto h-[calc(100%-5rem)] px-6 pb-8">
              <div className="grid grid-cols-2 gap-3">
                {ACHIEVEMENTS.map(achievement => (
                  <BadgeCard
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={isUnlocked(achievement.id)}
                    unlockedAt={getUnlockedAt(achievement.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
