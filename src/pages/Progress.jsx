import { useAppContext } from '../context/AppContext'
import { useProgress } from '../hooks/useProgress'
import PBCards from '../components/progress/PBCards'
import LogEntryForm from '../components/progress/LogEntryForm'
import ProgressChart from '../components/progress/ProgressChart'

export default function Progress() {
  const { state } = useAppContext()
  const { getProgressByMetric, METRIC_LABELS } = useProgress()

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-text-secondary text-sm uppercase tracking-wider animate-pulse">
          Loading…
        </p>
      </div>
    )
  }

  // Collect metrics that have at least one log entry
  const metricsWithData = Object.keys(METRIC_LABELS).filter((metric) => {
    return state.progressLogs.some((log) => log.metric_type === metric)
  })

  const hasAnyData = metricsWithData.length > 0

  return (
    <div className="p-4 pb-24 flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Page heading */}
      <h1 className="text-2xl font-bold text-text-primary uppercase tracking-wider">
        Progress
      </h1>

      {/* Personal best cards */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
          Personal Bests
        </h2>
        <PBCards />
      </section>

      {/* Log entry form */}
      <LogEntryForm />

      {/* Charts section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">
          Your Progress
        </h2>

        {hasAnyData ? (
          metricsWithData.map((metric) => {
            const data = getProgressByMetric(metric)
            return (
              <ProgressChart
                key={metric}
                metricType={metric}
                data={data}
                metricInfo={METRIC_LABELS[metric]}
              />
            )
          })
        ) : (
          <div className="bg-surface rounded-xl p-8 text-center">
            <p className="text-2xl mb-3">🏃</p>
            <p className="text-text-primary font-bold mb-1">
              No progress data yet
            </p>
            <p className="text-text-secondary text-sm">
              Complete your first test to start tracking progress!
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
