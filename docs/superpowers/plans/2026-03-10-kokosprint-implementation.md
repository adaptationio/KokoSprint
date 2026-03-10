# KokoSprint Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first sprint training tracker for a youth athlete, deployed to GitHub Pages with Supabase persistence.

**Architecture:** React SPA with hash routing, Tailwind CSS for dark/neon theming, Supabase for cross-device data persistence. No auth — single user app. GitHub Actions for CI/CD and Supabase keep-alive.

**Tech Stack:** React 18, Vite, Tailwind CSS, Recharts, Framer Motion, Supabase JS, date-fns, canvas-confetti

---

## File Structure

```
KokoSprint/
├── .github/workflows/
│   ├── deploy.yml                    # Build & deploy to GitHub Pages
│   └── keepalive.yml                 # Daily Supabase ping
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # All tables, RLS, triggers
├── src/
│   ├── main.jsx                      # React entry point
│   ├── App.jsx                       # Router + layout shell
│   ├── index.css                     # Tailwind directives + custom styles
│   ├── lib/
│   │   └── supabase.js               # Supabase client init
│   ├── data/
│   │   ├── exercises.js              # Exercise definitions with YouTube links
│   │   ├── trainingPlan.js           # 3-week day-by-day session plans
│   │   └── achievements.js           # Achievement definitions
│   ├── context/
│   │   └── AppContext.jsx            # Global state (useReducer)
│   ├── hooks/
│   │   ├── useTraining.js            # Session & exercise CRUD
│   │   ├── useProgress.js            # Progress logging & PB detection
│   │   └── useAchievements.js        # Achievement unlock logic
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TabBar.jsx            # Bottom navigation (4 tabs)
│   │   │   └── PageTransition.jsx    # Framer Motion page wrapper
│   │   ├── dashboard/
│   │   │   ├── CountdownRing.jsx     # Animated SVG countdown ring
│   │   │   ├── TodayCard.jsx         # "Start Today's Session" CTA
│   │   │   ├── StreakHeatMap.jsx      # GitHub-style calendar grid
│   │   │   └── LatestPB.jsx          # Recent PB highlight card
│   │   ├── training/
│   │   │   ├── ExerciseItem.jsx      # Single exercise row with checkbox
│   │   │   ├── SessionComplete.jsx   # Full-screen celebration overlay
│   │   │   └── NeonCheckbox.jsx      # Animated checkbox component
│   │   ├── progress/
│   │   │   ├── PBCards.jsx           # Personal best highlight cards
│   │   │   ├── LogEntryForm.jsx      # Metric input form
│   │   │   └── ProgressChart.jsx     # Recharts line chart
│   │   ├── library/
│   │   │   └── ExerciseCard.jsx      # Exercise detail card
│   │   └── achievements/
│   │       ├── AchievementsDrawer.jsx # Slide-up overlay
│   │       └── BadgeCard.jsx          # Single achievement badge
│   └── pages/
│       ├── Dashboard.jsx             # Home tab
│       ├── Training.jsx              # Today's training tab
│       ├── Progress.jsx              # Progress & PBs tab
│       └── Library.jsx               # Exercise library tab
├── index.html
├── vite.config.js
├── .gitignore
├── package.json
└── .env
```

---

## Chunk 1: Project Scaffold & Database

### Task 1: Initialize Vite + React project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`
- Create: `.env`, `.gitignore`

- [ ] **Step 1: Scaffold Vite project**

```bash
cd /mnt/c/data/github/KokoSprint
npm create vite@latest . -- --template react
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js recharts framer-motion date-fns canvas-confetti react-router-dom@6
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Vite**

`vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/KokoSprint/',
})
```

Note: Tailwind v4 uses CSS-based configuration via `@theme {}` — no `tailwind.config.js` or `postcss.config.js` needed when using `@tailwindcss/vite`.

- [ ] **Step 4: Create .gitignore**

`.gitignore`:
```
node_modules
dist
.env
```

- [ ] **Step 5: Set up index.css with Tailwind v4 theme**

`src/index.css`:
```css
@import "tailwindcss";

@theme {
  --color-bg: #0A0A0F;
  --color-surface: #1A1A2E;
  --color-neon: #39FF14;
  --color-electric: #00D4FF;
  --color-text-primary: #F0F0F0;
  --color-text-secondary: #8888A0;
  --color-warning: #FFB800;
  --font-sans: 'Inter', system-ui, sans-serif;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  margin: 0;
  min-height: 100dvh;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 6: Create .env file (NOT committed — already in .gitignore)**

`.env`:
```
VITE_SUPABASE_URL=https://gluofwkznjecmdlxmxrm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsdW9md2t6bmplY21kbHhteHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTkzMDcsImV4cCI6MjA4ODY5NTMwN30.T3lq-FDzxWYJ_dQuMXEVmWHFZaw4VWlBEvoCXwQsZcg
```

Note: The anon key is safe to use client-side (it's a public key, like a Firebase API key). RLS policies protect the data. The `.env` is gitignored for cleanliness; the production build uses GitHub Actions secrets.

- [ ] **Step 7: Set up minimal App.jsx with dark background**

```jsx
export default function App() {
  return (
    <div className="min-h-dvh bg-bg text-text-primary font-sans">
      <h1 className="text-3xl font-bold text-neon text-center pt-20 uppercase tracking-wider">
        KokoSprint
      </h1>
      <p className="text-text-secondary text-center mt-4">Loading...</p>
    </div>
  )
}
```

- [ ] **Step 8: Verify dev server runs**

```bash
npm run dev
```
Expected: App renders with dark background and neon green "KOKOSPRINT" heading.

- [ ] **Step 9: Commit**

```bash
git add .gitignore vite.config.js index.html src/ package.json package-lock.json
git commit -m "feat: scaffold Vite + React + Tailwind project with dark/neon theme"
```

---

### Task 2: Supabase schema & client

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`
- Create: `src/lib/supabase.js`

- [ ] **Step 1: Write migration SQL**

`supabase/migrations/001_initial_schema.sql`:
```sql
-- Training Sessions
create table if not exists training_sessions (
  id uuid primary key default gen_random_uuid(),
  session_date date not null,
  week_number int not null check (week_number between 1 and 3),
  session_type text not null check (session_type in ('home', 'oval')),
  completed boolean default false,
  session_rating text check (session_rating in ('easy', 'good', 'tough', 'crushed_it')),
  notes text,
  created_at timestamptz default now(),
  unique(session_date)
);

-- Exercise Logs
create table if not exists exercise_logs (
  id uuid primary key default gen_random_uuid(),
  session_date date not null,
  exercise_id text not null,
  completed boolean default false,
  created_at timestamptz default now(),
  unique(session_date, exercise_id)
);

-- Progress Logs
create table if not exists progress_logs (
  id uuid primary key default gen_random_uuid(),
  log_date date not null,
  metric_type text not null check (metric_type in ('30m_time', '60m_time', 'broad_jump', 'plank_hold')),
  value numeric not null,
  is_pb boolean default false,
  created_at timestamptz default now()
);

-- Achievements
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  achievement_id text not null unique,
  unlocked_at timestamptz default now()
);

-- Enable RLS
alter table training_sessions enable row level security;
alter table exercise_logs enable row level security;
alter table progress_logs enable row level security;
alter table achievements enable row level security;

-- RLS Policies: allow anon SELECT, INSERT, UPDATE (no DELETE)
-- Note: UPDATE needed for toggling exercise completion, session rating, notes.
-- Spec says "no UPDATE on critical fields" — UPDATE is allowed on mutable fields
-- (completed, session_rating, notes) but not on structural fields (date, type, etc.).
-- DELETE is never allowed to prevent accidental data loss.
create policy "anon_select" on training_sessions for select using (true);
create policy "anon_insert" on training_sessions for insert with check (true);
create policy "anon_update" on training_sessions for update using (true);

create policy "anon_select" on exercise_logs for select using (true);
create policy "anon_insert" on exercise_logs for insert with check (true);
create policy "anon_update" on exercise_logs for update using (true);

create policy "anon_select" on progress_logs for select using (true);
create policy "anon_insert" on progress_logs for insert with check (true);
create policy "anon_update" on progress_logs for update using (true);

create policy "anon_select" on achievements for select using (true);
create policy "anon_insert" on achievements for insert with check (true);

-- Trigger: auto-detect PB on progress_logs insert
create or replace function check_pb()
returns trigger as $$
declare
  current_best numeric;
  is_lower_better boolean;
begin
  -- For times, lower is better. For distances/holds, higher is better.
  is_lower_better := NEW.metric_type in ('30m_time', '60m_time');

  select case
    when is_lower_better then min(value)
    else max(value)
  end into current_best
  from progress_logs
  where metric_type = NEW.metric_type
    and id != NEW.id;

  if current_best is null then
    NEW.is_pb := true;
  elsif is_lower_better and NEW.value < current_best then
    NEW.is_pb := true;
  elsif not is_lower_better and NEW.value > current_best then
    NEW.is_pb := true;
  else
    NEW.is_pb := false;
  end if;

  return NEW;
end;
$$ language plpgsql;

create trigger set_pb_flag
  before insert on progress_logs
  for each row
  execute function check_pb();
```

- [ ] **Step 2: Run migration against Supabase**

```bash
# Run the SQL via Supabase dashboard SQL editor, or via CLI:
# Copy the SQL and execute in the Supabase SQL editor at:
# https://supabase.com/dashboard/project/gluofwkznjecmdlxmxrm/sql
```

- [ ] **Step 3: Create Supabase client**

`src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 4: Verify connection**

Add a temp test in App.jsx that fetches from Supabase and logs to console. Remove after verification.

- [ ] **Step 5: Commit**

```bash
git add supabase/ src/lib/supabase.js
git commit -m "feat: add Supabase schema with RLS, PB trigger, and client init"
```

---

### Task 3: Training data files

**Files:**
- Create: `src/data/exercises.js`
- Create: `src/data/trainingPlan.js`
- Create: `src/data/achievements.js`

- [ ] **Step 1: Create exercise definitions**

`src/data/exercises.js` — All exercises with id, name, category, why, setsReps, youtubeQuery, notes, and safetyNotes (optional). Categories: 'warmup', 'drills', 'strength', 'plyometrics', 'sprints', 'cooldown'. YouTube links as search URLs (e.g., `https://www.youtube.com/results?search_query=A+skip+drill+sprint+tutorial`).

Safety notes from spec added to relevant exercises:
- Bounding: `safetyNote: "On grass only, not concrete. Stop if any joint pain."`
- Jump squats: `safetyNote: "LOW reps only. Land softly with bent knees."`
- Lateral hops: `safetyNote: "Stop if knees cave inward — substitute side-lying leg raises."`
- All plyometrics: `safetyNote: "Land softly with bent knees every time."`

Also add a `coachingCues` array to the data file:
```js
export const COACHING_CUES = [
  "Stay on the balls of your feet",
  "Drive your knees forward and UP",
  "Hands relaxed — hold a chip without crushing it",
  "Arms pump from cheek to hip pocket, not side to side",
  "You're not just doing exercises — you're training like an athlete",
]
```

Full exercise list from spec sections 6.3-6.8 (warm-up through cool-down), ~30 exercises total.

- [ ] **Step 2: Create training plan**

`src/data/trainingPlan.js` — Array of session objects matching the spec's Week 1-3 day-by-day plan. Each session has: `date` (YYYY-MM-DD), `dayNumber` (1-10), `weekNumber` (1-3), `type` ('home'|'oval'), `title`, `exercises` (array of exercise IDs with specific sets/reps overrides), `isTest` (boolean), `isRestDay` (boolean for rest day entries).

Include rest days and taper days (Mar 29-Apr 1) and race day (Apr 2) as special entries.

- [ ] **Step 3: Create achievement definitions**

`src/data/achievements.js`:
```js
export const ACHIEVEMENTS = [
  { id: 'first_session', name: 'First Session', description: 'Complete your first training session', icon: '⚡' },
  { id: '3_day_streak', name: '3-Day Streak', description: '3 sessions without missing a scheduled day', icon: '🔥' },
  { id: 'week_1_done', name: 'Week 1 Done', description: 'Complete all Week 1 sessions', icon: '1️⃣' },
  { id: 'pb_breaker', name: 'PB Breaker', description: 'Set a new personal best', icon: '💥' },
  { id: 'full_week', name: 'Full Week', description: 'Complete every session in a week', icon: '🏆' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Improve your 30m time by 0.3s+', icon: '👹' },
  { id: 'race_ready', name: 'Race Ready', description: 'Complete the taper week', icon: '🏁' },
  { id: 'all_in', name: 'All In', description: 'Complete every session in the program', icon: '👑' },
]
```

- [ ] **Step 4: Commit**

```bash
git add src/data/
git commit -m "feat: add exercise library, 3-week training plan, and achievement definitions"
```

---

## Chunk 2: App Shell & Navigation

### Task 4: Hash router + tab bar + page transitions

**Files:**
- Create: `src/components/layout/TabBar.jsx`
- Create: `src/components/layout/PageTransition.jsx`
- Create: `src/pages/Dashboard.jsx`, `src/pages/Training.jsx`, `src/pages/Progress.jsx`, `src/pages/Library.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create placeholder pages**

Each page: simple component with page title in neon, e.g. `<h1 className="text-2xl font-bold text-neon uppercase tracking-wider p-6">Dashboard</h1>`.

- [ ] **Step 2: Create TabBar component**

Bottom-fixed tab bar with 4 items: Dashboard (lightning icon), Training (checklist icon), Progress (chart icon), Library (dumbbell icon). Use SVG icons inline. Active tab highlighted with neon green, inactive tabs in textSecondary. Fixed to bottom, `pb-safe` for iPhone notch.

- [ ] **Step 3: Create PageTransition wrapper**

Framer Motion `AnimatePresence` + `motion.div` with fade/slide transition. Wraps page content.

- [ ] **Step 4: Wire up App.jsx with HashRouter**

```jsx
import { HashRouter, Routes, Route } from 'react-router-dom'
// ... imports
export default function App() {
  return (
    <HashRouter>
      <div className="min-h-dvh bg-bg text-text-primary font-sans pb-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/training" element={<Training />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/library" element={<Library />} />
        </Routes>
        <TabBar />
      </div>
    </HashRouter>
  )
}
```

- [ ] **Step 5: Verify navigation works**

Click each tab, confirm page changes with transition animation. Test on mobile viewport (375px wide).

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "feat: add hash router, bottom tab bar, and page transitions"
```

---

### Task 5: App context + data hooks

**Files:**
- Create: `src/context/AppContext.jsx`
- Create: `src/hooks/useTraining.js`
- Create: `src/hooks/useProgress.js`
- Create: `src/hooks/useAchievements.js`

- [ ] **Step 1: Create AppContext**

Context provider that wraps the app. Holds state loaded from Supabase on mount: `sessions` (training_sessions rows), `exerciseLogs` (exercise_logs rows), `progressLogs` (progress_logs rows), `unlockedAchievements` (achievements rows). Provides dispatch for updates. Loads all data on mount via `useEffect`.

- [ ] **Step 2: Create useTraining hook**

Functions:
- `getTodaySession()` — returns today's planned session from trainingPlan data
- `getSessionExercises(date)` — returns exercise logs for a date
- `toggleExercise(date, exerciseId)` — upsert exercise_log, toggle completed
- `completeSession(date, rating, notes)` — upsert training_session as completed
- `getCompletedDates()` — returns array of dates with completed sessions (for heat map)

All functions read/write Supabase and update context.

- [ ] **Step 3: Create useProgress hook**

Functions:
- `logProgress(date, metricType, value)` — insert into progress_logs (PB auto-detected by trigger)
- `getProgressByMetric(metricType)` — returns sorted entries for charting
- `getPersonalBests()` — returns best value per metric type
- `getLatestPB()` — returns most recent PB entry

- [ ] **Step 4: Create useAchievements hook**

Functions:
- `checkAndUnlock(achievementId)` — insert if not already unlocked
- `evaluateAchievements()` — checks all achievement conditions against current data, unlocks any newly earned
- Call `evaluateAchievements()` after session completion and progress logging

- [ ] **Step 5: Wrap App in AppProvider, verify data loads**

- [ ] **Step 6: Commit**

```bash
git add src/context/ src/hooks/
git commit -m "feat: add app context and data hooks for training, progress, achievements"
```

---

## Chunk 3: Dashboard Page

### Task 6: Countdown ring + today card + streak heat map

**Files:**
- Create: `src/components/dashboard/CountdownRing.jsx`
- Create: `src/components/dashboard/TodayCard.jsx`
- Create: `src/components/dashboard/StreakHeatMap.jsx`
- Create: `src/components/dashboard/LatestPB.jsx`
- Modify: `src/pages/Dashboard.jsx`

- [ ] **Step 1: Build CountdownRing**

SVG circle with animated stroke-dashoffset. Shows "X DAYS TO RACE DAY" in center with large bold text. Ring fills from 0% (Mar 10) to 100% (Apr 2) based on current date. Neon green stroke on dark surface background. Use Framer Motion for the ring fill animation on mount.

Race day constant: `2026-04-02`. Calculate days remaining with date-fns `differenceInDays`.

- [ ] **Step 2: Build TodayCard**

Card showing today's session info from `trainingPlan.js`. If today is a training day: "WEEK X / DAY Y — HOME/OVAL SESSION" with exercise count and "START SESSION" button (links to /training). If rest day: "REST DAY — Recovery is training too" with a chill message. If race day: special race day card.

- [ ] **Step 3: Build StreakHeatMap**

Grid of cells for Mar 10 - Apr 2 (24 days). Each cell is a small square. Completed days glow neon green, future days are dark surface, today has an electric blue border. No red for missed days. Layout: 7 columns (Mon-Sun), ~4 rows. Use `getCompletedDates()` from useTraining.

- [ ] **Step 4: Build LatestPB**

Conditional card — only shows if there's a recent PB. Displays metric name, value, and date. Neon green accent border. Uses `getLatestPB()` from useProgress.

- [ ] **Step 5: Assemble Dashboard page**

Stack components vertically: CountdownRing, TodayCard, StreakHeatMap, LatestPB (conditional). Add padding for mobile. Add trophy icon button in top-right that opens achievements drawer (drawer built in Task 10).

- [ ] **Step 6: Test on mobile viewport, verify layout**

- [ ] **Step 7: Commit**

```bash
git add src/components/dashboard/ src/pages/Dashboard.jsx
git commit -m "feat: build dashboard with countdown ring, today card, streak heat map"
```

---

## Chunk 4: Today's Training Page

### Task 7: Exercise list with checkboxes + session completion

**Files:**
- Create: `src/components/training/NeonCheckbox.jsx`
- Create: `src/components/training/ExerciseItem.jsx`
- Create: `src/components/training/SessionComplete.jsx`
- Modify: `src/pages/Training.jsx`

- [ ] **Step 1: Build NeonCheckbox**

Custom checkbox with neon green flash animation on check. Uses Framer Motion for the flash effect (scale + opacity pulse). Dark surface background when unchecked, neon green fill with white checkmark when checked.

- [ ] **Step 2: Build ExerciseItem**

Row component showing: NeonCheckbox, exercise name (bold, uppercase), "why" text (text-secondary, smaller), sets/reps badge, YouTube thumbnail link (small play icon that opens YouTube search URL in new tab). Groups exercises by section: "WARM-UP", "DRILLS", "STRENGTH", etc. with section headers.

- [ ] **Step 3: Build Training page**

Session header: "WEEK X / DAY Y — HOME SESSION". If no session today, show rest day message. If session exists:
- List warm-up exercises (from trainingPlan for today)
- List main exercises
- List cool-down exercises
- Collapsed notes field ("ADD A NOTE" expands textarea)
- Track checkbox state via useTraining.toggleExercise()

Display a random coaching cue from `COACHING_CUES` at the top of the session (rotates each session). Show safety notes inline on exercises that have them (amber warning color, small text below the exercise).

When all exercises are checked, trigger SessionComplete overlay.

- [ ] **Step 4: Build SessionComplete overlay**

Full-screen overlay with dark semi-transparent background. Framer Motion slide-up animation. Shows:
- Confetti burst (canvas-confetti library)
- "SESSION X OF 21 COMPLETE" in large bold neon text
- Emoji rating buttons: 😌 Easy | 💪 Good | 😤 Tough | 🔥 Crushed It
- On rating selection: save session via `completeSession()`, evaluate achievements, show "Tomorrow's Preview" card with next session info
- Close button returns to Dashboard

- [ ] **Step 5: Test the full flow**

Open training page, check off exercises one by one, verify checkbox animations, verify session complete triggers, verify data saves to Supabase.

- [ ] **Step 6: Commit**

```bash
git add src/components/training/ src/pages/Training.jsx
git commit -m "feat: build training page with exercise checklist and session completion celebration"
```

---

## Chunk 5: Progress Page

### Task 8: PB cards + log form + charts

**Files:**
- Create: `src/components/progress/PBCards.jsx`
- Create: `src/components/progress/LogEntryForm.jsx`
- Create: `src/components/progress/ProgressChart.jsx`
- Modify: `src/pages/Progress.jsx`

- [ ] **Step 1: Build PBCards**

Horizontal scrollable row of 4 cards (30m, 60m, broad jump, plank hold). Each card shows: metric name (uppercase), best value with unit, date achieved. Neon green top border. If no data yet, shows "—" with "No data yet" text.

- [ ] **Step 2: Build LogEntryForm**

Simple form: dropdown to select metric type (30m Time, 60m Time, Broad Jump, Plank Hold), numeric input for value, date picker (defaults to today), "LOG RESULT" button. On submit: calls `logProgress()`, shows brief success flash. If the insert returns `is_pb: true`, trigger confetti.

- [ ] **Step 3: Build ProgressChart**

Recharts `LineChart` for each metric type. Dark surface background. Neon green line. PB points marked with a star marker. X-axis: dates. Y-axis: values. Tooltip shows exact value and date. Self-referential comparison text below chart: "0.3s faster than your first test" (compare latest to first entry).

Render one chart per metric that has data (skip metrics with no entries).

- [ ] **Step 4: Assemble Progress page**

Stack: PBCards at top, LogEntryForm, then charts for each metric with data.

- [ ] **Step 5: Commit**

```bash
git add src/components/progress/ src/pages/Progress.jsx
git commit -m "feat: build progress page with PB cards, log form, and line charts"
```

---

## Chunk 6: Exercise Library

### Task 9: Filterable exercise library

**Files:**
- Create: `src/components/library/ExerciseCard.jsx`
- Modify: `src/pages/Library.jsx`

- [ ] **Step 1: Build ExerciseCard**

Card showing: exercise name (bold), category badge (colored by category), "why" description, sets/reps, coaching notes if any, YouTube link button ("WATCH VIDEO" in electric blue). Surface background with subtle border.

- [ ] **Step 2: Build Library page**

Search input at top — filters exercises by name as user types (simple `includes()` match). Below search: category filter pills: ALL, WARM-UP, DRILLS, STRENGTH, PLYOMETRICS, SPRINTS, COOL-DOWN. Active filter pill in neon green, inactive in surface. Both filters combine (search text + category). Filtered exercise list below. Renders ExerciseCard for each exercise matching filters. All data from `exercises.js`. Safety notes displayed in amber on relevant exercises.

- [ ] **Step 3: Commit**

```bash
git add src/components/library/ src/pages/Library.jsx
git commit -m "feat: build exercise library with category filtering and YouTube links"
```

---

## Chunk 7: Achievements & Polish

### Task 10: Achievements drawer

**Files:**
- Create: `src/components/achievements/BadgeCard.jsx`
- Create: `src/components/achievements/AchievementsDrawer.jsx`
- Modify: `src/pages/Dashboard.jsx` (add trophy button + drawer)

- [ ] **Step 1: Build BadgeCard**

Square card with icon (emoji), achievement name, description. Locked state: grayscale, opacity 40%, icon shows 🔒. Unlocked state: full color, neon green border glow, shows unlock date.

- [ ] **Step 2: Build AchievementsDrawer**

Framer Motion slide-up overlay (covers bottom 80% of screen). Dark semi-transparent backdrop. Title: "ACHIEVEMENTS" in bold. Grid of BadgeCards (2 columns). Close button (X) in top right. Shows count: "3 / 8 UNLOCKED".

- [ ] **Step 3: Wire trophy button on Dashboard**

Trophy icon button in Dashboard header. Tap opens AchievementsDrawer. Pass unlocked achievements from context.

- [ ] **Step 4: Commit**

```bash
git add src/components/achievements/ src/pages/Dashboard.jsx
git commit -m "feat: add achievements drawer with badge cards"
```

---

### Task 11: Race Day checklist + data export

**Files:**
- Modify: `src/pages/Dashboard.jsx` (race day special card)
- Modify: `src/pages/Training.jsx` (race day checklist view)

- [ ] **Step 1: Add race day and taper day detection**

Add race day checklist data to `src/data/trainingPlan.js`:
```js
export const RACE_DAY_CHECKLIST = [
  { id: 'water', label: 'Water bottle (filled)' },
  { id: 'snack', label: 'Snack (banana, muesli bar — eat 2 hours before)' },
  { id: 'shoes', label: 'Running shoes' },
  { id: 'clothes', label: 'Comfortable clothes / race outfit' },
  { id: 'sunscreen', label: 'Sunscreen' },
  { id: 'arrive', label: 'Arrive 30+ minutes early' },
  { id: 'warmup', label: 'Race-day warm-up: 5 min jog, leg swings, 2x high knees, 2x A-skips, 2x build-up sprints, rest 2-3 min' },
  { id: 'cues', label: 'Remember: balls of feet, knees up, arms cheek to hip pocket, hands relaxed' },
]
```

When today is Apr 2: Dashboard shows "RACE DAY" card with all coaching cues. Training page shows the race day checklist with checkboxes.

Taper days (Mar 29-31) show as special entries: Mar 29 "LIGHT MOVEMENT — easy walk/jog + stride-outs", Mar 30 "REST", Mar 31 "SHAKEOUT — practice race-day warm-up only", Apr 1 "COMPLETE REST — hydrate, eat well, sleep well". These are already in `trainingPlan.js` as entries with `isTaper: true` and display differently from normal rest days (show specific instructions instead of generic rest message).

- [ ] **Step 2: Add data export/import**

Add a gear icon on Dashboard that opens a small settings panel. Two buttons:
- "EXPORT DATA" — fetches all tables, creates JSON blob, triggers download as `kokosprint-backup-YYYY-MM-DD.json`
- "IMPORT DATA" — file input, reads JSON, upserts into all tables

- [ ] **Step 3: Commit**

```bash
git add src/
git commit -m "feat: add race day checklist and data export/import"
```

---

## Chunk 8: Deployment

### Task 12: GitHub Actions + GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `.github/workflows/keepalive.yml`

- [ ] **Step 1: Create deploy workflow**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [master]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Create keepalive workflow**

`.github/workflows/keepalive.yml`:
```yaml
name: Supabase Keep-Alive
on:
  schedule:
    - cron: '0 8 * * *'
  workflow_dispatch:
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase
        run: |
          curl -s -o /dev/null -w "%{http_code}" \
            "${{ secrets.VITE_SUPABASE_URL }}/rest/v1/training_sessions?select=count&limit=1" \
            -H "apikey: ${{ secrets.VITE_SUPABASE_ANON_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.VITE_SUPABASE_ANON_KEY }}"
```

- [ ] **Step 3: Create GitHub repo and push**

```bash
gh repo create adaptationio/KokoSprint --public --source=. --push
```

- [ ] **Step 4: Set GitHub secrets**

```bash
gh secret set VITE_SUPABASE_URL --body "https://gluofwkznjecmdlxmxrm.supabase.co"
gh secret set VITE_SUPABASE_ANON_KEY --body "<anon-key>"
```

- [ ] **Step 5: Enable GitHub Pages (Actions source)**

```bash
gh api repos/adaptationio/KokoSprint/pages -X POST -f build_type=workflow
```

- [ ] **Step 6: Verify deployment**

Push triggers build. Check `https://adaptationio.github.io/KokoSprint/` loads correctly.

- [ ] **Step 7: Commit**

```bash
git add .github/
git commit -m "feat: add GitHub Actions deploy and Supabase keep-alive workflows"
```

---

## Task Dependency Summary

```
Task 1 (Scaffold) → Task 2 (Supabase) ─┐
                                        ├→ Task 3 (Data files) ──┐
                                        └→ Task 4 (Router+Tabs) ─┤
                                                                  ↓
                                              Task 5 (Context + Hooks)
                                                        ↓
                                        ┌── Task 6 (Dashboard)
                                        ├── Task 7 (Training)     ← can run in parallel
                                        ├── Task 8 (Progress)
                                        └── Task 9 (Library)
                                                        ↓
                                        Task 10 (Achievements) → Task 11 (Race Day + Export)
                                                                          ↓
                                                                  Task 12 (Deploy)
```

- Tasks 3 and 4 are independent and can run in parallel after Task 2
- Tasks 6-9 are independent and can be built by parallel subagents after Task 5
- Task 12 (Deploy) can start as early as after Task 1 (deploy placeholder), but final deploy after Task 11
