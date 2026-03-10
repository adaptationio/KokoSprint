import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { format, parseISO } from 'date-fns'

// Custom dot: PB entries render as electric-blue star-shaped highlight
function CustomDot({ cx, cy, payload }) {
  if (payload?.is_pb) {
    return (
      <g key={`pb-${cx}-${cy}`}>
        <circle cx={cx} cy={cy} r={7} fill="#00D4FF" stroke="#0A0A0F" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={3} fill="#0A0A0F" />
      </g>
    )
  }
  return <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={3} fill="#39FF14" stroke="none" />
}

// Custom tooltip with dark theme
function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  const isPB = entry?.payload?.is_pb

  return (
    <div
      className="rounded-lg p-3 text-sm"
      style={{
        backgroundColor: '#1A1A2E',
        border: '1px solid #39FF14',
        color: '#F0F0F0',
        minWidth: '120px',
      }}
    >
      <p className="text-xs text-text-secondary mb-1">
        {label ? format(parseISO(label), 'MMM d, yyyy') : ''}
      </p>
      <p className="font-bold text-text-primary">
        {entry.value}
        <span className="text-xs font-normal text-text-secondary ml-1">{unit}</span>
      </p>
      {isPB && (
        <p className="text-xs text-electric font-bold mt-1">Personal Best</p>
      )}
    </div>
  )
}

// Build self-referential comparison text
function buildComparisonText(data, metricInfo) {
  if (!data || data.length < 2) return null
  const first = data[0]
  const latest = data[data.length - 1]
  const diff = Math.abs(latest.value - first.value)
  const diffRounded = Math.round(diff * 100) / 100

  if (diffRounded === 0) return 'Same as your first test'

  const improved = metricInfo.lowerIsBetter
    ? latest.value < first.value
    : latest.value > first.value

  if (metricInfo.unit === 's') {
    if (metricInfo.lowerIsBetter) {
      return improved
        ? `${diffRounded}s faster than your first test`
        : `${diffRounded}s slower than your first test`
    } else {
      return improved
        ? `${diffRounded}s longer than your first test`
        : `${diffRounded}s shorter than your first test`
    }
  }
  if (metricInfo.unit === 'm') {
    return improved
      ? `${(diffRounded * 100).toFixed(0)}cm further than your first jump`
      : `${(diffRounded * 100).toFixed(0)}cm shorter than your first jump`
  }
  return null
}

export default function ProgressChart({ data, metricInfo }) {
  const comparisonText = buildComparisonText(data, metricInfo)

  return (
    <div className="bg-surface rounded-xl p-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">
        {metricInfo.name}
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A1A2E" vertical={false} />
          <XAxis
            dataKey="log_date"
            tickFormatter={(d) => {
              try { return format(parseISO(d), 'MMM d') } catch { return d }
            }}
            tick={{ fill: '#8888A0', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8888A0', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            content={<CustomTooltip unit={metricInfo.unit} />}
            cursor={{ stroke: '#8888A0', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#39FF14"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 5, fill: '#39FF14', stroke: '#0A0A0F', strokeWidth: 2 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>

      {comparisonText && (
        <p className="text-xs text-text-secondary mt-3 text-center">
          {comparisonText}
        </p>
      )}
    </div>
  )
}
