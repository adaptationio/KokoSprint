import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import CountdownRing from '../components/dashboard/CountdownRing'
import TodayCard from '../components/dashboard/TodayCard'
import StreakHeatMap from '../components/dashboard/StreakHeatMap'
import LatestPB from '../components/dashboard/LatestPB'
import AchievementsDrawer from '../components/achievements/AchievementsDrawer'

function LoadingSkeleton() {
  return (
    <div className="p-5 flex flex-col gap-6 animate-pulse">
      {/* Ring placeholder */}
      <div className="flex justify-center">
        <div className="w-[200px] h-[200px] rounded-full bg-surface" />
      </div>
      {/* Card placeholders */}
      <div className="bg-surface rounded-xl h-32" />
      <div className="bg-surface rounded-xl h-48" />
    </div>
  )
}

export default function Dashboard() {
  const { state } = useAppContext()
  const [showAchievements, setShowAchievements] = useState(false)

  if (state.loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="p-5 flex flex-col gap-6 max-w-lg mx-auto">
      {/* Top bar: title + icon buttons */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-lg font-black text-text-primary uppercase tracking-widest">
          KokoSprint
        </h1>
        <div className="flex items-center gap-3">
          {/* Trophy button — achievements drawer */}
          <button
            aria-label="Achievements"
            onClick={() => setShowAchievements(true)}
            className="text-text-secondary hover:text-neon transition-colors text-xl leading-none p-1"
          >
            🏆
          </button>
          {/* Gear button — export/import (Task 11) */}
          <button
            aria-label="Settings"
            className="text-text-secondary hover:text-electric transition-colors text-xl leading-none p-1"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Countdown ring — centred */}
      <div className="flex justify-center">
        <CountdownRing />
      </div>

      {/* Today's session card */}
      <TodayCard />

      {/* Streak heat map */}
      <StreakHeatMap />

      {/* Latest PB — only renders when there's a PB */}
      <LatestPB />

      {/* Achievements drawer */}
      <AchievementsDrawer
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
    </div>
  )
}
