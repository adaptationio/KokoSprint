import { useCallback } from 'react'
import { useAppContext } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import { TRAINING_PLAN } from '../data/trainingPlan'

export function useAchievements() {
  const { state, refreshData } = useAppContext()

  const isUnlocked = useCallback((achievementId) => {
    return state.unlockedAchievements.some(a => a.achievement_id === achievementId)
  }, [state.unlockedAchievements])

  const unlock = useCallback(async (achievementId) => {
    if (isUnlocked(achievementId)) return
    const { error } = await supabase.from('achievements').insert({ achievement_id: achievementId })
    if (error) throw new Error(error.message)
    await refreshData()
  }, [isUnlocked, refreshData])

  const evaluateAchievements = useCallback(async () => {
    const completedSessions = state.sessions.filter(s => s.completed)
    const completedDates = completedSessions.map(s => s.session_date)

    // First Session
    if (completedSessions.length >= 1) await unlock('first_session')

    // PB Breaker
    if (state.progressLogs.some(log => log.is_pb)) await unlock('pb_breaker')

    // Week 1 Done — all week 1 training days completed
    const week1Days = TRAINING_PLAN.filter(d => d.weekNumber === 1 && d.type !== 'rest' && d.type !== 'taper' && d.type !== 'race')
    if (week1Days.length > 0 && week1Days.every(d => completedDates.includes(d.date))) {
      await unlock('week_1_done')
    }

    // Full Week — any week where all required (non-optional) training days are completed
    for (const week of [1, 2, 3]) {
      const weekDays = TRAINING_PLAN.filter(d => d.weekNumber === week && d.type !== 'rest' && d.type !== 'taper' && d.type !== 'race' && !d.optional)
      if (weekDays.length > 0 && weekDays.every(d => completedDates.includes(d.date))) {
        await unlock('full_week')
        break
      }
    }

    // 3-Day Streak — 3 consecutive scheduled training days completed
    const trainingDays = TRAINING_PLAN.filter(d => d.type !== 'rest' && d.type !== 'taper' && d.type !== 'race')
    let streak = 0
    for (const day of trainingDays) {
      if (completedDates.includes(day.date)) {
        streak++
        if (streak >= 3) { await unlock('3_day_streak'); break }
      } else {
        streak = 0
      }
    }

    // Speed Demon — 30m time improved by 0.3s+
    const times30m = state.progressLogs
      .filter(log => log.metric_type === '30m_time')
      .sort((a, b) => a.log_date.localeCompare(b.log_date))
    if (times30m.length >= 2) {
      const first = times30m[0].value
      const best = Math.min(...times30m.map(t => t.value))
      if (first - best >= 0.3) await unlock('speed_demon')
    }

    // Race Ready — completed taper week (all Week 3 training sessions)
    const week3Days = TRAINING_PLAN.filter(d => d.weekNumber === 3 && d.type !== 'rest' && d.type !== 'taper' && d.type !== 'race')
    if (week3Days.length > 0 && week3Days.every(d => completedDates.includes(d.date))) {
      await unlock('race_ready')
    }

    // All In — every required training session completed
    const allTrainingDays = TRAINING_PLAN.filter(d => d.type !== 'rest' && d.type !== 'taper' && d.type !== 'race' && !d.optional)
    if (allTrainingDays.length > 0 && allTrainingDays.every(d => completedDates.includes(d.date))) {
      await unlock('all_in')
    }
  }, [state.sessions, state.progressLogs, unlock])

  return { isUnlocked, unlock, evaluateAchievements }
}
