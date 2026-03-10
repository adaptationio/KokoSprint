import { useState, useMemo } from 'react'
import EXERCISES from '../data/exercises'
import ExerciseCard from '../components/library/ExerciseCard'

const FILTER_CATEGORIES = [
  { label: 'ALL', value: 'all' },
  { label: 'WARM-UP', value: 'warmup' },
  { label: 'DRILLS', value: 'drills' },
  { label: 'STRENGTH', value: 'strength' },
  { label: 'PLYOMETRICS', value: 'plyometrics' },
  { label: 'SPRINTS', value: 'sprints' },
  { label: 'COOL-DOWN', value: 'cooldown' },
]

export default function Library() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return EXERCISES.filter((ex) => {
      const matchesSearch = query === '' || ex.name.toLowerCase().includes(query)
      const matchesCategory = activeCategory === 'all' || ex.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  return (
    <div className="flex flex-col gap-5 p-4 pb-8">
      {/* Page title */}
      <h1 className="text-2xl font-bold uppercase tracking-wider text-text-primary">
        Exercise Library
      </h1>

      {/* Search input */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search exercises..."
        className="w-full bg-bg border border-text-secondary/20 rounded-lg p-3 text-text-primary placeholder:text-text-secondary text-sm
          focus:border-neon focus:outline-none transition-colors"
      />

      {/* Category filter pills — horizontally scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {FILTER_CATEGORIES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-colors
              ${activeCategory === value
                ? 'bg-neon text-bg font-bold'
                : 'bg-surface text-text-secondary'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Count indicator */}
      <p className="text-xs text-text-secondary -mt-1">
        Showing {filtered.length} of {EXERCISES.length} exercises
      </p>

      {/* Exercise list */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      ) : (
        <p className="text-text-secondary text-sm text-center py-10">
          No exercises found
        </p>
      )}
    </div>
  )
}
