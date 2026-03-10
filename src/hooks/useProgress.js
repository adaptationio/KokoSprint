import { useCallback } from 'react'
import { useAppContext } from '../context/AppContext'
import { supabase } from '../lib/supabase'

const METRIC_LABELS = {
  '30m_time': { name: '30M TIME', unit: 's', lowerIsBetter: true },
  '60m_time': { name: '60M TIME', unit: 's', lowerIsBetter: true },
  'broad_jump': { name: 'BROAD JUMP', unit: 'm', lowerIsBetter: false },
  'plank_hold': { name: 'PLANK HOLD', unit: 's', lowerIsBetter: false },
}

export function useProgress() {
  const { state, refreshData } = useAppContext()

  // Log a new progress entry
  const logProgress = useCallback(async (date, metricType, value) => {
    const { data } = await supabase
      .from('progress_logs')
      .insert({ log_date: date, metric_type: metricType, value: parseFloat(value) })
      .select()
      .single()
    await refreshData()
    return data // includes is_pb from trigger
  }, [refreshData])

  // Get all entries for a specific metric (sorted by date)
  const getProgressByMetric = useCallback((metricType) => {
    return state.progressLogs
      .filter(log => log.metric_type === metricType)
      .sort((a, b) => a.log_date.localeCompare(b.log_date))
  }, [state.progressLogs])

  // Get personal bests for all metrics
  const getPersonalBests = useCallback(() => {
    const pbs = {}
    for (const [metric, info] of Object.entries(METRIC_LABELS)) {
      const entries = state.progressLogs.filter(log => log.metric_type === metric)
      if (entries.length === 0) continue
      const best = info.lowerIsBetter
        ? entries.reduce((min, e) => e.value < min.value ? e : min)
        : entries.reduce((max, e) => e.value > max.value ? e : max)
      pbs[metric] = { ...best, ...info }
    }
    return pbs
  }, [state.progressLogs])

  // Get the most recent PB
  const getLatestPB = useCallback(() => {
    const pbEntries = state.progressLogs.filter(log => log.is_pb)
    if (pbEntries.length === 0) return null
    const sorted = [...pbEntries].sort((a, b) => b.created_at.localeCompare(a.created_at))
    return { ...sorted[0], ...METRIC_LABELS[sorted[0].metric_type] }
  }, [state.progressLogs])

  return { logProgress, getProgressByMetric, getPersonalBests, getLatestPB, METRIC_LABELS }
}
