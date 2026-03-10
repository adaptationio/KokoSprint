# KokoSprint — Design Specification

**Date:** 2026-03-10
**Race Day:** 2026-04-02 (23 days from today)
**User:** Kokopelli (11-year-old sprint athlete)

---

## 1. Overview

KokoSprint is a mobile-first web app for tracking sprint training over a 3-week program leading to race day. It is designed for a single user (Koko), hosted on GitHub Pages, with Supabase for persistent data storage across devices.

**Core principle:** This app should feel like mission control for an athlete preparing for a race, not a homework tracker with a dark theme.

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React + Vite | Component model, ecosystem (Recharts, Framer Motion) |
| Styling | Tailwind CSS | Fast to build, custom dark/neon theme |
| Charts | Recharts | Lightweight, React-native |
| Animation | Framer Motion | Page transitions, progress ring, celebrations |
| Database | Supabase (Postgres) | Persistent cross-device storage, free tier |
| Hosting | GitHub Pages | Free, static, reliable |
| State | React Context + useReducer | Sufficient for single-user app |
| Routing | Hash-based (`/#/training`) | Avoids GitHub Pages SPA 404 issues |
| Date handling | date-fns | Store dates as YYYY-MM-DD local strings |

**Vite config:** `base: '/KokoSprint/'`

---

## 3. Supabase Schema

**Project URL:** https://gluofwkznjecmdlxmxrm.supabase.co
**Anon Key:** (stored in env/config)

### Tables

#### `training_sessions`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| session_date | date | YYYY-MM-DD local date |
| week_number | int | 1, 2, or 3 |
| session_type | text | 'home' or 'oval' |
| completed | boolean | All exercises done? |
| session_rating | text | 'easy', 'good', 'tough', 'crushed_it' (nullable) |
| notes | text | Optional session notes |
| created_at | timestamptz | Auto |

#### `exercise_logs`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| session_date | date | FK reference |
| exercise_id | text | Maps to exercise in app config |
| completed | boolean | Checked off? |
| created_at | timestamptz | Auto |

#### `progress_logs`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| log_date | date | YYYY-MM-DD |
| metric_type | text | '30m_time', '60m_time', 'broad_jump', 'plank_hold' |
| value | numeric | Time in seconds or distance in metres |
| is_pb | boolean | Personal best flag |
| created_at | timestamptz | Auto |

#### `achievements`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| achievement_id | text | Maps to achievement definition |
| unlocked_at | timestamptz | When earned |

### RLS Policies
- Enable RLS on all tables
- Anon key: SELECT and INSERT only (no DELETE, no UPDATE on critical fields)
- Use database triggers to set `is_pb` automatically on progress_logs insert

### Keep-Alive
- GitHub Actions cron job runs daily, pings Supabase to prevent free-tier pause

---

## 4. Navigation & Screens

**Bottom tab bar with 4 tabs + 1 overlay:**

### Tab 1: Dashboard (Home)
- **Race Day Countdown** — large countdown timer ("16 DAYS TO RACE DAY") with animated progress ring that fills as race day approaches
- **Today's Session Card** — prominent "START TODAY'S SESSION" button, shows session type and exercise count
- **Streak Heat Map** — GitHub-style calendar grid, completed days glow neon green, missed days are just dark (no red/failure markers)
- **Latest PB** — if she set one recently, highlight it here
- **Achievements avatar icon** — tap to open achievements drawer overlay

### Tab 2: Today's Training
- **Session header** — "Week 2 / Day 4 — Home Session"
- **Warm-up checklist** — always shown first (light jog, leg swings, high knees, A-skips)
- **Exercise list** — vertical scrollable list, each item has:
  - Checkbox with neon flash micro-animation on completion
  - Exercise name (bold)
  - "Why" line in smaller text ("Builds explosive power off the blocks")
  - YouTube thumbnail — taps to open video link (not embedded iframe)
  - Sets/reps info
- **Cool-down checklist** — shown after exercises (stretching, light jog)
- **Notes field** — collapsed by default, "Add a note" link expands it
- **Session Complete** — triggers when last item checked:
  - Full-screen celebration (particle animation, neon flash)
  - "SESSION 14 OF 21 COMPLETE" in big bold text
  - Emoji rating slides up: Easy / Good / Tough / Crushed It
  - "Tomorrow's Preview" card at the bottom

### Tab 3: Progress
- **Personal Bests section** at top — highlight cards for each metric showing best value and date
- **Log new entry** — simple form: select metric type, enter value, save
- **Charts** — simple line charts (one per metric) showing improvement over time, PB points highlighted with a star marker
- **Self-referential comparisons** — "0.3s faster than last Tuesday"

### Tab 4: Exercise Library
- **All exercises** grouped by category:
  - Warm-Up & Drills
  - Bodyweight Strength
  - Plyometrics
  - Sprint Work
- Each exercise shows: name, why line, YouTube thumbnail link, sets/reps recommendation
- Searchable/filterable by category

### Overlay: Achievements Drawer
- Opens from avatar/trophy icon on Dashboard
- Badge grid with locked/unlocked states
- Achievements:
  - "First Session" — complete first training session
  - "3-Day Streak" — 3 sessions in a row
  - "Week 1 Done" — complete all Week 1 sessions
  - "PB Breaker" — set a new personal best
  - "Full Week" — complete every session in a week
  - "Speed Demon" — improve 30m time by 0.3s+
  - "Race Ready" — complete the taper week
  - "All In" — complete every single session in the program

---

## 5. Visual Design

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Background | Near-black | #0A0A0F |
| Surface/Card | Dark gray | #1A1A2E |
| Primary accent | Neon green | #39FF14 |
| Secondary accent | Electric blue | #00D4FF |
| Text primary | White | #F0F0F0 |
| Text secondary | Gray | #8888A0 |
| Success/Complete | Neon green | #39FF14 |
| Warning | Amber | #FFB800 |

### Typography
- **Font:** Inter (geometric sans-serif)
- **Headers:** Bold 700+, ALL CAPS for section headers
- **Body:** Regular 400, 16px base for mobile readability
- Contrast ratios verified for neon-on-dark at body text sizes

### Design Rules
- No gradients, no illustrations, no mascots
- Subtle border-radius (8-12px max), not pillow-shaped
- Micro-animations on interactions (checkbox flash, page transitions)
- Confetti/particle effect on new PBs and session completion
- Rest days shown with a message like "REST DAY — Recovery is training too" (celebrated, not empty)

---

## 6. Training Plan — 3-Week Program

### Schedule Overview
- **Week 1 (Mar 10-16):** Activation & Assessment — 2 home + 1 oval (3 sessions)
- **Week 2 (Mar 17-23):** Build & Sharpen — 2 home + 1-2 oval (3-4 sessions)
- **Week 3 (Mar 24 - Apr 1):** Taper & Race Prep — 2 light home + 1 oval early week (2-3 sessions)
- **Apr 1:** Complete rest
- **Apr 2:** RACE DAY

### Rest Day Rules
- Minimum 1 full rest day between hard sessions
- Never two high-intensity days back-to-back
- Rest days are celebrated in the app, not shown as failures

### Exercise Library

#### Warm-Up (Every Session)
| Exercise | Duration/Reps | Why |
|----------|--------------|-----|
| Light jog | 5 minutes | Gets blood flowing to muscles |
| Leg swings (front/back) | 10 each leg | Opens up hip flexors for sprinting |
| Leg swings (side to side) | 10 each leg | Loosens inner and outer hip muscles |
| Hip circles | 10 each direction | Warms up hip joints for explosive movement |

#### Drills (Teach Sprint Mechanics)
| Exercise | Sets x Reps | Why | Priority |
|----------|------------|-----|----------|
| High knees | 2 x 20m | Patterns knee drive — the engine of sprinting | Top |
| A-skips | 2 x 20m | Teaches the exact knee-drive motion used in sprinting | Top |
| B-skips | 2 x 20m | Adds leg extension to A-skip — full sprint leg cycle | Second |
| Butt kicks | 2 x 20m | Trains fast foot recovery under the body | Second |
| Arm swing drills | 2 x 30 sec | Arms drive the legs — cheek to hip pocket, 90 degree elbows | Top |
| Wall drives | 3 x 10 each leg | Teaches forward lean and drive phase off the start | Top |

#### Bodyweight Strength
| Exercise | Sets x Reps | Why | Priority |
|----------|------------|-----|----------|
| Glute bridges | 3 x 12 | Activates glutes — the biggest power muscle for sprinting | Top |
| Bodyweight squats | 3 x 12 | Builds leg strength for pushing off the ground | Second |
| Calf raises (off a step) | 3 x 15 | Strengthens ankles for explosive toe-off | Second |
| Plank holds | 3 x 30 sec | Core stability keeps your body straight when sprinting fast | Top |
| Dead bugs | 3 x 8 each side | Core control without stressing the spine | Second |
| Push-ups | 2 x 10 | Upper body strength for arm drive power | Third |
| Lunges | 2 x 8 each leg | Single-leg strength mirrors the sprint stride | Third |
| Side-lying leg raises | 2 x 12 each | Hip stability prevents knees caving in | Third |

#### Plyometrics (Explosive Power)
| Exercise | Sets x Reps | Why | Notes |
|----------|------------|-----|-------|
| Broad jumps | 3 x 5 | Horizontal power — directly transfers to acceleration | Land softly, bent knees |
| Skipping for height | 3 x 20m | Reactive power with low injury risk | Big powerful skips, not fast |
| Trampoline jumps | 3 x 30 sec | Builds reactive leg stiffness — key trait in fast sprinters | Focus on quick bounce |
| Jump squats | 2 x 5 | Explosive lower body power | LOW reps only, quality landings |
| Bounding | 3 x 4 bounds | Exaggerated sprint strides build power | On grass only, limit volume |
| Lateral hops | 2 x 8 each way | Lateral stability and ankle strength | Stop if knees cave inward |

#### Sprint Work (Oval/Track)
| Exercise | Sets x Reps | Why | Priority |
|----------|------------|-----|----------|
| 30m sprints (timed) | 4-6 reps | Race-specific speed, short enough for quality | Top |
| 60m sprints | 2-3 reps | Extended speed endurance | Second |
| Flying 20s | 3-4 reps | Pure top speed without start variable | Second |
| Stride-outs (80%) | 3-4 x 60m | Teaches relaxation at speed | Second |
| Reaction starts | 5-6 reps | Practice race start from various positions | Top |
| Shuttle runs (5/10/15m) | 2-3 sets | Acceleration and direction change | Third |

#### Cool-Down (Every Session)
| Exercise | Duration | Why |
|----------|----------|-----|
| Light jog | 3-5 minutes | Gradually brings heart rate down |
| Quad stretch | 30 sec each leg | Prevents tightness after sprinting |
| Hamstring stretch | 30 sec each leg | Protects against hamstring pulls |
| Calf stretch | 30 sec each leg | Relieves tension from explosive work |
| Hip flexor stretch | 30 sec each side | Keeps hips mobile for long strides |

### Weekly Session Plans

#### WEEK 1 — Activation & Assessment (70-80% intensity)

**Day 1 (Home — Mon Mar 10):**
- Warm-up checklist
- High knees 2x20m, A-skips 2x20m, arm swing drills 2x30s
- Glute bridges 3x12, bodyweight squats 3x12, plank holds 3x30s
- Broad jumps 3x5, skipping for height 3x20m
- Cool-down

**Day 2 (Oval — Wed Mar 12) — BASELINE TEST:**
- Warm-up checklist
- Wall drives 3x10, A-skips 2x20m, butt kicks 2x20m
- **TEST: 30m sprint (best of 3), broad jump (best of 3), plank hold (max time)**
- Stride-outs 3x60m at 80%
- Reaction starts 5x from standing
- Cool-down

**Day 3 (Home — Fri Mar 14):**
- Warm-up checklist
- High knees 2x20m, B-skips 2x20m, arm swing drills 2x30s
- Glute bridges 3x12, calf raises 3x15, dead bugs 3x8
- Trampoline jumps 3x30s, lateral hops 2x8
- Push-ups 2x10, lunges 2x8
- Cool-down

**Sat Mar 15 & Sun Mar 16:** REST — Recovery is training too

#### WEEK 2 — Build & Sharpen (85-95% intensity)

**Day 4 (Home — Mon Mar 17):**
- Warm-up checklist
- High knees 2x20m, A-skips 2x20m, wall drives 3x10
- Glute bridges 3x12, bodyweight squats 3x12, plank holds 3x40s
- Jump squats 2x5, broad jumps 3x5, bounding 3x4
- Cool-down

**Day 5 (Oval — Wed Mar 19):**
- Warm-up checklist
- A-skips 2x20m, B-skips 2x20m, arm swing drills
- 30m sprints x5 (timed — compare to baseline)
- Flying 20s x3
- Reaction starts 6x from various positions (standing, sitting, lying)
- Stride-outs 3x60m
- Cool-down

**Day 6 (Home — Fri Mar 21):**
- Warm-up checklist
- High knees 2x20m, butt kicks 2x20m, wall drives 3x10
- Calf raises 3x15, dead bugs 3x8, side-lying leg raises 2x12
- Skipping for height 3x20m, trampoline jumps 3x30s, broad jumps 3x5
- Push-ups 2x10, lunges 2x8
- Cool-down

**Day 7 (Oval — Sat Mar 22, OPTIONAL):**
- Warm-up checklist
- A-skips 2x20m, arm swing drills
- 60m sprints x3 (timed)
- Shuttle runs 2 sets
- Stride-outs 3x60m
- Cool-down

**Sun Mar 23:** REST

#### WEEK 3 — Taper & Race Prep (Reduce volume, keep intensity)

**Day 8 (Home — Mon Mar 24):**
- Warm-up checklist
- High knees 2x20m, A-skips 2x20m
- Glute bridges 2x10, plank holds 2x30s (reduced volume)
- Broad jumps 2x5, skipping for height 2x20m
- Cool-down
- **Mental prep: talk through race day — what to expect, where to stand, how the starter works**

**Day 9 (Oval — Wed Mar 26):**
- Warm-up checklist
- A-skips 2x20m, arm swing drills
- 30m sprints x3 (timed — sharp but low volume)
- Reaction starts 4x
- Stride-outs 2x60m
- **Practice race-day warm-up sequence**
- Cool-down

**Day 10 (Home — Fri Mar 28):**
- Warm-up checklist
- Light drills: A-skips 2x20m, arm swings 2x30s
- Glute bridges 2x10, plank holds 2x20s
- Trampoline jumps 2x20s
- Cool-down
- **Last proper session**

**Sat Mar 29:** Light movement only — 10 min easy walk/jog, a couple of stride-outs
**Sun Mar 30:** REST
**Mon Mar 31:** Very light shakeout — practice race-day warm-up routine only
**Tue Apr 1:** COMPLETE REST — hydrate, eat well, sleep well
**Wed Apr 2:** RACE DAY

### Race Day Checklist
- [ ] Water bottle (filled)
- [ ] Snack (banana, muesli bar — eat 2 hours before)
- [ ] Running shoes
- [ ] Comfortable clothes / race outfit
- [ ] Sunscreen
- [ ] Arrive 30+ minutes early
- [ ] Race-day warm-up: 5 min light jog, leg swings (10 each), 2x high knees 20m, 2x A-skips 20m, 2x build-up sprints (easy to 90%), rest 2-3 min, RACE
- [ ] Remember: stay on balls of feet, drive knees up, pump arms cheek to hip pocket, hands relaxed

### Coaching Cues (Displayed In-App)
- "Stay on the balls of your feet"
- "Drive your knees forward and UP"
- "Hands relaxed — hold a chip without crushing it"
- "Arms pump from cheek to hip pocket, not side to side"
- "You're not just doing exercises — you're training like an athlete"

### Safety Rules
- If any JOINT pain (not muscle soreness), stop that exercise immediately
- Always train on grass for bounding/plyometrics, not concrete
- Land softly with bent knees on all jumps
- If knees cave inward on lateral hops, stop and substitute side-lying leg raises
- No heavy weights — bodyweight only at this age

---

## 7. Data Backup

- **Export:** Button in settings that downloads all data as JSON file
- **Import:** Upload JSON to restore data
- **Automated:** GitHub Actions nightly cron that pings Supabase (keeps project alive)

---

## 8. Deployment

1. GitHub repo: `adaptationio/KokoSprint`
2. GitHub Actions workflow: builds Vite app on push, deploys to `gh-pages` branch
3. Live URL: `https://adaptationio.github.io/KokoSprint/`
4. Supabase tables created via migration SQL

---

## 9. MVP Priority

**Ship in this order:**
1. Dashboard with countdown + Today's Training with checkboxes (core daily use)
2. Progress logging + charts
3. Exercise library with YouTube links
4. Achievements + celebrations
5. Export/import backup
