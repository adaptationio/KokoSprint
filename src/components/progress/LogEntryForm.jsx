import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { useProgress } from '../../hooks/useProgress'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function LogEntryForm() {
  const { logProgress, METRIC_LABELS } = useProgress()
  const [metric, setMetric] = useState('30m_time')
  const [value, setValue] = useState('')
  const [date, setDate] = useState(todayISO())
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Fade success message after 2s
  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => setSuccess(false), 2000)
    return () => clearTimeout(timer)
  }, [success])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!value || isNaN(parseFloat(value))) {
      setError('Please enter a valid number.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const result = await logProgress(date, metric, value)
      if (result?.is_pb) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#39FF14', '#00D4FF', '#FFB800', '#F0F0F0'],
        })
      }
      setValue('')
      setDate(todayISO())
      setSuccess(true)
    } catch {
      setError('Failed to log result. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full bg-bg border border-text-secondary/20 text-text-primary rounded-lg p-3 ' +
    'focus:border-neon focus:outline-none transition-colors'

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-xl p-6 flex flex-col gap-4"
    >
      <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
        Log a Result
      </h2>

      {/* Metric select */}
      <div>
        <label className="block text-xs text-text-secondary mb-1 uppercase tracking-wide">
          Metric
        </label>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className={inputClass}
        >
          {Object.entries(METRIC_LABELS).map(([key, info]) => (
            <option key={key} value={key}>
              {info.name} ({info.unit})
            </option>
          ))}
        </select>
      </div>

      {/* Value input */}
      <div>
        <label className="block text-xs text-text-secondary mb-1 uppercase tracking-wide">
          Value ({METRIC_LABELS[metric].unit})
        </label>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={metric.includes('time') ? 'e.g. 4.32' : 'e.g. 2.45'}
          className={inputClass}
          required
        />
      </div>

      {/* Date input */}
      <div>
        <label className="block text-xs text-text-secondary mb-1 uppercase tracking-wide">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-warning">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="bg-neon text-bg font-bold uppercase tracking-wider rounded-lg py-3 px-6 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Logging…' : 'Log Result'}
      </button>

      {/* Success message */}
      {success && (
        <p className="text-center text-neon text-sm font-bold animate-pulse">
          Logged!
        </p>
      )}
    </form>
  )
}
