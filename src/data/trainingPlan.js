export const RACE_DAY = '2026-04-02'
export const PROGRAM_START = '2026-03-10'
export const TOTAL_SESSIONS = 10

// Shorthand for all 4 warm-up exercises
const WARMUP_ALL = [
  { exerciseId: 'light_jog' },
  { exerciseId: 'leg_swings_fb' },
  { exerciseId: 'leg_swings_ss' },
  { exerciseId: 'hip_circles' },
]

// Shorthand for all 5 cool-down exercises
const COOLDOWN_ALL = [
  { exerciseId: 'cooldown_jog' },
  { exerciseId: 'quad_stretch' },
  { exerciseId: 'hamstring_stretch' },
  { exerciseId: 'calf_stretch' },
  { exerciseId: 'hip_flexor_stretch' },
]

export const TRAINING_PLAN = [
  // ── WEEK 1: Activation & Assessment ────────────────────────────────────────

  {
    date: '2026-03-10',
    dayNumber: 1,
    weekNumber: 1,
    type: 'home',
    title: 'Activation & First Steps',
    isTest: false,
    exercises: [
      ...WARMUP_ALL,
      { exerciseId: 'high_knees', setsReps: '2x20m' },
      { exerciseId: 'a_skips', setsReps: '2x20m' },
      { exerciseId: 'arm_swing_drills', setsReps: '2x30sec' },
      { exerciseId: 'glute_bridges', setsReps: '3x12' },
      { exerciseId: 'bodyweight_squats', setsReps: '3x12' },
      { exerciseId: 'plank_holds', setsReps: '3x30sec' },
      { exerciseId: 'broad_jumps', setsReps: '3x5' },
      { exerciseId: 'skipping_height', setsReps: '3x20m' },
      ...COOLDOWN_ALL,
    ],
  },

  {
    date: '2026-03-11',
    dayNumber: null,
    weekNumber: 1,
    type: 'rest',
    title: 'Rest Day',
    isTest: false,
    exercises: [],
    notes: 'REST',
  },

  {
    date: '2026-03-12',
    dayNumber: 2,
    weekNumber: 1,
    type: 'oval',
    title: 'Baseline Test Day',
    isTest: true,
    exercises: [
      ...WARMUP_ALL,
      { exerciseId: 'wall_drives', setsReps: '3x10 each leg' },
      { exerciseId: 'a_skips', setsReps: '2x20m' },
      { exerciseId: 'butt_kicks', setsReps: '2x20m' },
      { exerciseId: 'sprint_30m', setsReps: 'TEST: best of 3' },
      { exerciseId: 'broad_jumps', setsReps: 'TEST: best of 3' },
      { exerciseId: 'plank_holds', setsReps: 'TEST: max time' },
      { exerciseId: 'stride_outs', setsReps: '3x60m' },
      { exerciseId: 'reaction_starts', setsReps: '5 reps' },
      ...COOLDOWN_ALL,
    ],
  },

  {
    date: '2026-03-13',
    dayNumber: null,
    weekNumber: 1,
    type: 'rest',
    title: 'Rest Day',
    isTest: false,
    exercises: [],
    notes: 'REST',
  },

  {
    date: '2026-03-14',
    dayNumber: 3,
    weekNumber: 1,
    type: 'home',
    title: 'Power & Core',
    isTest: false,
    exercises: [
      ...WARMUP_ALL,
      { exerciseId: 'high_knees', setsReps: '2x20m' },
      { exerciseId: 'b_skips', setsReps: '2x20m' },
      { exerciseId: 'arm_swing_drills', setsReps: '2x30sec' },
      { exerciseId: 'glute_bridges', setsReps: '3x12' },
      { exerciseId: 'calf_raises', setsReps: '3x15' },
      { exerciseId: 'dead_bugs', setsReps: '3x8 each side' },
      { exerciseId: 'trampoline_jumps', setsReps: '3x30sec' },
      { exerciseId: 'lateral_hops', setsReps: '2x8 each way' },
      { exerciseId: 'push_ups', setsReps: '2x10' },
      { exerciseId: 'lunges', setsReps: '2x8 each leg' },
      ...COOLDOWN_ALL,
    ],
  },

  {
    date: '2026-03-15',
    dayNumber: null,
    weekNumber: 1,
    type: 'rest',
    title: 'Rest Day',
    isTest: false,
    exercises: [],
    notes: 'REST',
  },

  {
    date: '2026-03-16',
    dayNumber: null,
    weekNumber: 1,
    type: 'rest',
    title: 'Rest Day',
    isTest: false,
    exercises: [],
    notes: 'REST',
  },

  // ── WEEK 2: Build & Sharpen ─────────────────────────────────────────────────

  {
    date: '2026-03-17',
    dayNumber: 4,
    weekNumber: 2,
    type: 'home',
    title: 'Strength & Explosive Power',
    isTest: false,
    exercises: [
      ...WARMUP_ALL,
      { exerciseId: 'high_knees', setsReps: '2x20m' },
      { exerciseId: 'a_skips', setsReps: '2x20m' },
      { exerciseId: 'wall_drives', setsReps: '3x10 each leg' },
      { exerciseId: 'glute_bridges', setsReps: '3x12' },
      { exerciseId: 'bodyweight_squats', setsReps: '3x12' },
      { exerciseId: 'plank_holds', setsReps: '3x40sec' },
      { exerciseId: 'jump_squats', setsReps: '2x5' },
      { exerciseId: 'broad_jumps', setsReps: '3x5' },
      { exerciseId: 'bounding', setsReps: '3x4 bounds' },
      ...COOLDOWN_ALL,
    ],
  },

  {
    date: '2026-03-18',
    dayNumber: null,
    weekNumber: 2,
    type: 'rest',
    title: 'Rest Day',
    isTest: false,
    exercises: [],
    notes: 'REST',
  },

  {
    date: '2026-03-19',
    dayNumber: 5,
    weekNumber: 2,
    type: 'oval',
    title: 'Speed & Reaction',
    isTest: false,
    exercises: [
      ...WARMUP_ALL,
      { exerciseId: 'a_skips', setsReps: '2x20m' },
      { exerciseId: 'b_skips', setsReps: '2x20m' },
      { exerciseId: 'arm_swing_drills', setsReps: '2x30sec' },
      { exerciseId: 'sprint_30m', setsReps: '5 reps' },
      { exerciseId: 'flying_20s', setsReps: '3 reps' },
      { exerciseId: 'reaction_starts', setsReps: '6 reps' },
      { exerciseId: 'stride_outs', setsReps: '3x60m' },
      ...COOLDOWN_ALL,
    ],
  },

  {
    date: '2026-03-20',
    dayNumber: null,
    weekNumber: 2,
    type: 'rest',
    title: 'Rest Day',
    isTest: false,
    exercises: [],
    notes: 'REST',
  },

  {
    date: '2026-03-21',
    dayNumber: 6,
    weekNumber: 2,
    type: 'home',
    title: 'Stability & Plyometrics',
    isTest: false,
    exercises: [
      ...WARMUP_ALL,
      { exerciseId: 'high_knees', setsReps: '2x20m' },
      { exerciseId: 'butt_kicks', setsReps: '2x20m' },
      { exerciseId: 'wall_drives', setsReps: '3x10 each leg' },
      { exerciseId: 'calf_raises', setsReps: '3x15' },
      { exerciseId: 'dead_bugs', setsReps: '3x8 each side' },
      { exerciseId: 'side_leg_raises', setsReps: '2x12 each' },
      { exerciseId: 'skipping_height', setsReps: '3x20m' },
      { exerciseId: 'trampoline_jumps', setsReps: '3x30sec' },
      { exerciseId: 'broad_jumps', setsReps: '3x5' },
      { exerciseId: 'push_ups', setsReps: '2x10' },
      { exerciseId: 'lunges', setsReps: '2x8 each leg' },
      ...COOLDOWN_ALL,
    ],
  },

  {
    date: '2026-03-22',
    dayNumber: 7,
    weekNumber: 2,
    type: 'oval',
    title: 'Endurance Sprints (Optional)',
    isTest: false,
    notes: 'OPTIONAL session — only if feeling good and recovered',
    exercises: [
      ...WARMUP_ALL,
      { exerciseId: 'a_skips', setsReps: '2x20m' },
      { exerciseId: 'arm_swing_drills', setsReps: '2x30sec' },
      { exerciseId: 'sprint_60m', setsReps: '3 reps' },
      { exerciseId: 'shuttle_runs', setsReps: '2 sets' },
      { exerciseId: 'stride_outs', setsReps: '3x60m' },
      ...COOLDOWN_ALL,
    ],
  },

  {
    date: '2026-03-23',
    dayNumber: null,
    weekNumber: 2,
    type: 'rest',
    title: 'Rest Day',
    isTest: false,
    exercises: [],
    notes: 'REST',
  },

  // ── WEEK 3: Taper & Race Prep ───────────────────────────────────────────────

  {
    date: '2026-03-24',
    dayNumber: 8,
    weekNumber: 3,
    type: 'home',
    title: 'Reduced Load & Mental Prep',
    isTest: false,
    notes: 'Mental prep: talk through race day',
    exercises: [
      ...WARMUP_ALL,
      { exerciseId: 'high_knees', setsReps: '2x20m' },
      { exerciseId: 'a_skips', setsReps: '2x20m' },
      { exerciseId: 'glute_bridges', setsReps: '2x10' },
      { exerciseId: 'plank_holds', setsReps: '2x30sec' },
      { exerciseId: 'broad_jumps', setsReps: '2x5' },
      { exerciseId: 'skipping_height', setsReps: '2x20m' },
      ...COOLDOWN_ALL,
    ],
  },

  {
    date: '2026-03-25',
    dayNumber: null,
    weekNumber: 3,
    type: 'rest',
    title: 'Rest Day',
    isTest: false,
    exercises: [],
    notes: 'REST',
  },

  {
    date: '2026-03-26',
    dayNumber: 9,
    weekNumber: 3,
    type: 'oval',
    title: 'Race-Day Rehearsal',
    isTest: false,
    notes: 'Practice race-day warm-up sequence',
    exercises: [
      ...WARMUP_ALL,
      { exerciseId: 'a_skips', setsReps: '2x20m' },
      { exerciseId: 'arm_swing_drills', setsReps: '2x30sec' },
      { exerciseId: 'sprint_30m', setsReps: '3 reps' },
      { exerciseId: 'reaction_starts', setsReps: '4 reps' },
      { exerciseId: 'stride_outs', setsReps: '2x60m' },
      ...COOLDOWN_ALL,
    ],
  },

  {
    date: '2026-03-27',
    dayNumber: null,
    weekNumber: 3,
    type: 'rest',
    title: 'Rest Day',
    isTest: false,
    exercises: [],
    notes: 'REST',
  },

  {
    date: '2026-03-28',
    dayNumber: 10,
    weekNumber: 3,
    type: 'home',
    title: 'Last Proper Session',
    isTest: false,
    notes: 'Last proper session',
    exercises: [
      ...WARMUP_ALL,
      { exerciseId: 'a_skips', setsReps: '2x20m' },
      { exerciseId: 'arm_swing_drills', setsReps: '2x30sec' },
      { exerciseId: 'glute_bridges', setsReps: '2x10' },
      { exerciseId: 'plank_holds', setsReps: '2x20sec' },
      { exerciseId: 'trampoline_jumps', setsReps: '2x20sec' },
      ...COOLDOWN_ALL,
    ],
  },

  {
    date: '2026-03-29',
    dayNumber: null,
    weekNumber: 3,
    type: 'taper',
    title: 'Light Movement',
    isTest: false,
    exercises: [],
    notes: 'Light movement — 10 min easy walk/jog, a couple of stride-outs',
  },

  {
    date: '2026-03-30',
    dayNumber: null,
    weekNumber: 3,
    type: 'rest',
    title: 'Rest Day',
    isTest: false,
    exercises: [],
    notes: 'REST',
  },

  {
    date: '2026-03-31',
    dayNumber: null,
    weekNumber: 3,
    type: 'taper',
    title: 'Very Light Shakeout',
    isTest: false,
    exercises: [],
    notes: 'Very light shakeout — practice race-day warm-up routine only',
  },

  {
    date: '2026-04-01',
    dayNumber: null,
    weekNumber: 3,
    type: 'rest',
    title: 'Complete Rest',
    isTest: false,
    exercises: [],
    notes: 'COMPLETE REST — hydrate, eat well, sleep well',
  },

  {
    date: '2026-04-02',
    dayNumber: null,
    weekNumber: 3,
    type: 'race',
    title: 'RACE DAY',
    isTest: false,
    exercises: [],
    notes: 'RACE DAY',
  },
]

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

export default TRAINING_PLAN
