import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext()

const initialState = {
  sessions: [],
  exerciseLogs: [],
  progressLogs: [],
  unlockedAchievements: [],
  loading: true,
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SESSIONS': return { ...state, sessions: action.payload }
    case 'SET_EXERCISE_LOGS': return { ...state, exerciseLogs: action.payload }
    case 'SET_PROGRESS_LOGS': return { ...state, progressLogs: action.payload }
    case 'SET_ACHIEVEMENTS': return { ...state, unlockedAchievements: action.payload }
    case 'SET_LOADING': return { ...state, loading: action.payload }
    case 'SET_ERROR': return { ...state, error: action.payload }
    default: return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const refreshData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const [sessions, exerciseLogs, progressLogs, achievements] = await Promise.all([
        supabase.from('training_sessions').select('*'),
        supabase.from('exercise_logs').select('*'),
        supabase.from('progress_logs').select('*').order('log_date', { ascending: true }),
        supabase.from('achievements').select('*'),
      ])
      const err = sessions.error || exerciseLogs.error || progressLogs.error || achievements.error
      if (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message })
      }
      dispatch({ type: 'SET_SESSIONS', payload: sessions.data || [] })
      dispatch({ type: 'SET_EXERCISE_LOGS', payload: exerciseLogs.data || [] })
      dispatch({ type: 'SET_PROGRESS_LOGS', payload: progressLogs.data || [] })
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements.data || [] })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to load data' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  useEffect(() => { refreshData() }, [refreshData])

  return (
    <AppContext.Provider value={{ state, dispatch, refreshData }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}
