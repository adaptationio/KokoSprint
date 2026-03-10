import { useState, useRef } from 'react'
import { format } from 'date-fns'
import { useAppContext } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import CountdownRing from '../components/dashboard/CountdownRing'
import TodayCard from '../components/dashboard/TodayCard'
import StreakHeatMap from '../components/dashboard/StreakHeatMap'
import LatestPB from '../components/dashboard/LatestPB'
import AchievementsDrawer from '../components/achievements/AchievementsDrawer'
import AthleteLevel from '../components/dashboard/AthleteLevel'

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

// ── SETTINGS PANEL ────────────────────────────────────────────────────────────
function SettingsPanel({ onClose, refreshData }) {
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'success'|'error', message }
  const fileInputRef = useRef(null)

  async function handleExport() {
    setExporting(true)
    setStatus(null)
    try {
      const [sessions, exerciseLogs, progressLogs, achievements] = await Promise.all([
        supabase.from('training_sessions').select('*'),
        supabase.from('exercise_logs').select('*'),
        supabase.from('progress_logs').select('*'),
        supabase.from('achievements').select('*'),
      ])

      const data = {
        exportDate: new Date().toISOString(),
        training_sessions: sessions.data,
        exercise_logs: exerciseLogs.data,
        progress_logs: progressLogs.data,
        achievements: achievements.data,
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kokosprint-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
      a.click()
      URL.revokeObjectURL(url)
      setStatus({ type: 'success', message: 'Export downloaded.' })
    } catch {
      setStatus({ type: 'error', message: 'Export failed. Try again.' })
    } finally {
      setExporting(false)
    }
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset the input so the same file can be re-selected
    e.target.value = ''

    const confirmed = window.confirm(
      'This will merge the backup data with your existing data. Continue?'
    )
    if (!confirmed) return

    setImporting(true)
    setStatus(null)
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      const upserts = []

      if (Array.isArray(data.training_sessions) && data.training_sessions.length > 0) {
        upserts.push(
          supabase.from('training_sessions').upsert(data.training_sessions, { onConflict: 'session_date' })
        )
      }
      if (Array.isArray(data.exercise_logs) && data.exercise_logs.length > 0) {
        upserts.push(
          supabase.from('exercise_logs').upsert(data.exercise_logs, { onConflict: 'id' })
        )
      }
      if (Array.isArray(data.progress_logs) && data.progress_logs.length > 0) {
        upserts.push(
          supabase.from('progress_logs').upsert(data.progress_logs, { onConflict: 'id' })
        )
      }
      if (Array.isArray(data.achievements) && data.achievements.length > 0) {
        upserts.push(
          supabase.from('achievements').upsert(data.achievements, { onConflict: 'id' })
        )
      }

      await Promise.all(upserts)
      await refreshData()
      setStatus({ type: 'success', message: 'Data imported successfully.' })
    } catch {
      setStatus({ type: 'error', message: 'Import failed. Check the file format.' })
    } finally {
      setImporting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30"
        style={{ background: 'rgba(10,10,15,0.6)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed bottom-20 left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm rounded-2xl p-6 flex flex-col gap-4"
        style={{
          background: '#1A1A2E',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.5)',
          transform: 'translateX(-50%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-black text-text-primary uppercase tracking-widest">Settings</p>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors text-lg leading-none p-1"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* Status message */}
        {status && (
          <p
            className="text-xs font-semibold text-center rounded-lg px-3 py-2"
            style={{
              background: status.type === 'success' ? 'rgba(57,255,20,0.1)' : 'rgba(255,80,80,0.1)',
              color: status.type === 'success' ? '#39FF14' : '#FF5050',
            }}
          >
            {status.message}
          </p>
        )}

        {/* Export button */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center justify-center gap-2 w-full rounded-lg py-3 font-bold uppercase tracking-wider text-sm transition-all duration-150 active:scale-95 disabled:opacity-50"
          style={{ background: '#39FF14', color: '#0A0A0F' }}
        >
          {/* Download arrow icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2v8M5 7l3 3 3-3M2 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {exporting ? 'Exporting…' : 'Export Data'}
        </button>

        {/* Import button */}
        <button
          onClick={handleImportClick}
          disabled={importing}
          className="flex items-center justify-center gap-2 w-full rounded-lg py-3 font-bold uppercase tracking-wider text-sm transition-all duration-150 active:scale-95 disabled:opacity-50"
          style={{
            background: 'transparent',
            border: '1px solid rgba(136,136,160,0.2)',
            color: '#F0F0F0',
          }}
        >
          {/* Upload arrow icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 10V2M5 5l3-3 3 3M2 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {importing ? 'Importing…' : 'Import Data'}
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileSelect}
        />

        <p className="text-xs text-text-secondary text-center leading-relaxed">
          Export creates a JSON backup of all your training data. Import merges a backup into your current data.
        </p>
      </div>
    </>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { state, refreshData } = useAppContext()
  const [showAchievements, setShowAchievements] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  if (state.loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="p-5 flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Top bar: title + icon buttons */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-lg font-black text-text-primary uppercase tracking-widest">
          KokoSprint
        </h1>
        <div className="flex items-center gap-3">
          {/* Trophy button — achievements drawer (44px min touch target) */}
          <button
            aria-label="Achievements"
            onClick={() => setShowAchievements(true)}
            className="text-text-secondary hover:text-neon transition-colors text-xl leading-none flex items-center justify-center"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            🏆
          </button>
          {/* Gear button — export/import settings (44px min touch target) */}
          <button
            aria-label="Settings"
            onClick={() => setShowSettings((v) => !v)}
            className="text-text-secondary hover:text-electric transition-colors text-xl leading-none flex items-center justify-center"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Athlete level */}
      <AthleteLevel />

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

      {/* Settings panel */}
      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          refreshData={refreshData}
        />
      )}
    </div>
  )
}
