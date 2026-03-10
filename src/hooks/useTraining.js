import { useCallback } from 'react'
import { useAppContext } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import { TRAINING_PLAN } from '../data/trainingPlan'
import { format } from 'date-fns'

export function useTraining() {
  const { state, refreshData } = useAppContext()

  // Get today's planned session from the static training plan
  const getTodaySession = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return TRAINING_PLAN.find(s => s.date === today) || null
  }, [])

  // Get exercise logs for a specific date
  const getSessionExercises = useCallback((date) => {
    return state.exerciseLogs.filter(log => log.session_date === date)
  }, [state.exerciseLogs])

  // Toggle an exercise's completed status (upsert)
  const toggleExercise = useCallback(async (date, exerciseId) => {
    const existing = state.exerciseLogs.find(
      log => log.session_date === date && log.exercise_id === exerciseId
    )

    if (existing) {
      const { error } = await supabase
        .from('exercise_logs')
        .update({ completed: !existing.completed })
        .eq('id', existing.id)
      if (error) throw new Error(error.message)
    } else {
      const { error } = await supabase
        .from('exercise_logs')
        .insert({ session_date: date, exercise_id: exerciseId, completed: true })
      if (error) throw new Error(error.message)
    }
    await refreshData()
  }, [state.exerciseLogs, refreshData])

  // Complete a session with rating and notes
  const completeSession = useCallback(async (date, rating, notes) => {
    const planSession = TRAINING_PLAN.find(s => s.date === date)
    if (!planSession) return

    const existing = state.sessions.find(s => s.session_date === date)
    if (existing) {
      const { error } = await supabase
        .from('training_sessions')
        .update({ completed: true, session_rating: rating, notes })
        .eq('id', existing.id)
      if (error) throw new Error(error.message)
    } else {
      const { error } = await supabase
        .from('training_sessions')
        .insert({
          session_date: date,
          week_number: planSession.weekNumber,
          session_type: planSession.type,
          completed: true,
          session_rating: rating,
          notes,
        })
      if (error) throw new Error(error.message)
    }
    await refreshData()
  }, [state.sessions, refreshData])

  // Get all completed dates for the heat map
  const getCompletedDates = useCallback(() => {
    return state.sessions
      .filter(s => s.completed)
      .map(s => s.session_date)
  }, [state.sessions])

  return { getTodaySession, getSessionExercises, toggleExercise, completeSession, getCompletedDates }
}
