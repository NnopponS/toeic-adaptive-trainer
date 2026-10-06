import type {
  AttemptMode,
  ErrorReason,
  LearnerTier,
  Part,
  Question,
  SkillId,
  SkillState,
  TrainerState,
} from './types'

export const EXAM_DATE = new Date('2026-10-17T09:00:00+07:00')
export const DAILY_GOAL = 70

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n))
const dayKey = (date = new Date()) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const emptyState = (): TrainerState => ({
  attempts: [],
  skills: {},
  questionMistakes: {},
  questionCorrectStreak: {},
  totalCorrect: 0,
  totalAnswered: 0,
  currentStreak: 0,
  bestStreak: 0,
  xp: 0,
  studyDates: [],
  lessonResults: {},
})

export function normalizeState(input?: Partial<TrainerState> | null): TrainerState {
  return {
    ...emptyState(),
    ...input,
    attempts: Array.isArray(input?.attempts) ? input!.attempts! : [],
    skills: input?.skills ?? {},
    questionMistakes: input?.questionMistakes ?? {},
    questionCorrectStreak: input?.questionCorrectStreak ?? {},
    studyDates: Array.isArray(input?.studyDates) ? input!.studyDates! : [],
    lessonResults: input?.lessonResults ?? {},
    xp: input?.xp ?? 0,
  }
}

export function recordAttempt(
  state: TrainerState,
  question: Question,
  selected: string,
  elapsedMs: number,
  meta: { mode?: AttemptMode; lessonSkill?: SkillId } = {},
): TrainerState {
  const correct = selected === question.answer
  const next = structuredClone(normalizeState(state))
  const now = Date.now()

  next.attempts.unshift({
    questionId: question.id,
    part: question.part,
    correct,
    selected,
    elapsedMs,
    at: now,
    skills: question.skills,
    mode: meta.mode ?? 'adaptive',
    lessonSkill: meta.lessonSkill,
    difficulty: question.difficulty,
  })
  next.attempts = next.attempts.slice(0, 1600)
  next.totalAnswered += 1
  next.totalCorrect += correct ? 1 : 0
  next.currentStreak = correct ? next.currentStreak + 1 : 0
  next.bestStreak = Math.max(next.bestStreak, next.currentStreak)
  next.xp += correct ? 10 + question.difficulty * 2 : 2
  next.studyDates = Array.from(new Set([...next.studyDates, dayKey()])).slice(-120)

  next.questionMistakes[question.id] = (next.questionMistakes[question.id] ?? 0) + (correct ? 0 : 1)
  next.questionCorrectStreak[question.id] = correct
    ? (next.questionCorrectStreak[question.id] ?? 0) + 1
    : 0

  for (const skill of question.skills) {
    const old: SkillState = next.skills[skill] ?? {
      attempts: 0,
      correct: 0,
      recent: [],
      totalMs: 0,
      mastery: 50,
      dueBoost: 0,
    }
    const recent = [correct, ...old.recent].slice(0, 12)
    const recentAcc = recent.filter(Boolean).length / recent.length
    const speedTarget = question.part === 5 ? 25_000 : question.part === 6 ? 45_000 : 75_000
    const speedFactor = clamp(speedTarget / Math.max(elapsedMs, 1), 0.55, 1.08)
    const difficultyBonus = 1 + Math.max(0, question.difficulty - 2) * 0.04
    const evidence = recentAcc * 100 * speedFactor * difficultyBonus
    next.skills[skill] = {
      attempts: old.attempts + 1,
      correct: old.correct + (correct ? 1 : 0),
      recent,
      totalMs: old.totalMs + elapsedMs,
      mastery: clamp(old.mastery * 0.7 + evidence * 0.3),
      dueBoost: correct ? Math.max(0, old.dueBoost - 12) : Math.min(100, old.dueBoost + 40),
      lastPracticedAt: now,
    }
  }
  return next
}

export function addFeedbackToLatest(state: TrainerState, reason?: ErrorReason, confidence?: 1 | 2 | 3) {
  if (!state.attempts.length) return state
  const next = structuredClone(normalizeState(state))
  next.attempts[0] = { ...next.attempts[0], errorReason: reason, confidence }
  return next
}

export function completeLesson(
  state: TrainerState,
  skill: SkillId,
  score: number,
  total: number,
  avgSeconds: number,
) {
  const next = structuredClone(normalizeState(state))
  const percent = Math.round(score / Math.max(1, total) * 100)
  const old = next.lessonResults[skill]
  const intervalDays = percent >= 90 ? 3 : percent >= 80 ? 2 : 1
  const now = Date.now()
  next.lessonResults[skill] = {
    skill,
    attempts: (old?.attempts ?? 0) + 1,
    bestScore: Math.max(old?.bestScore ?? 0, percent),
    lastScore: percent,
    lastAvgSeconds: avgSeconds,
    lastCompletedAt: now,
    nextReviewAt: now + intervalDays * 86_400_000,
  }
  next.xp += Math.max(10, score * 4)
  const s = next.skills[skill]
  if (s) {
    s.mastery = clamp(s.mastery + (percent >= 80 ? 6 : -2))
    s.dueBoost = percent >= 80 ? Math.max(0, s.dueBoost - 30) : Math.min(100, s.dueBoost + 30)
  }
  return next
}

export function questionWeight(state: TrainerState, q: Question) {
  const s = normalizeState(state)
  const mistakeWeight = (s.questionMistakes[q.id] ?? 0) * 14
  const streakRelief = Math.min((s.questionCorrectStreak[q.id] ?? 0) * 8, 28)
  const weakSkillWeight = q.skills.reduce((sum, skill) => {
    const value = s.skills[skill]
    return sum + (value ? (100 - value.mastery) * 0.7 + value.dueBoost * 0.6 : 22)
  }, 0)
  const recentRepeatPenalty = s.attempts.slice(0, 10).some(a => a.questionId === q.id) ? 45 : 0

  const skillMastery = q.skills
    .map(skill => s.skills[skill]?.mastery ?? 50)
    .reduce((a, b) => a + b, 0) / Math.max(1, q.skills.length)
  const targetDifficulty = skillMastery < 45 ? 1.7 : skillMastery < 62 ? 2.5 : skillMastery < 78 ? 3.4 : 4.3
  const difficultyFit = Math.max(-12, 18 - Math.abs(q.difficulty - targetDifficulty) * 9)

  return Math.max(2, 10 + mistakeWeight + weakSkillWeight + difficultyFit - streakRelief - recentRepeatPenalty)
}

export function pickAdaptiveQuestion(state: TrainerState, questions: Question[], excludeId?: string): Question {
  const pool = questions.filter(q => q.id !== excludeId)
  if (!pool.length) return questions[0]
  const weighted = pool.map(q => ({ q, w: questionWeight(state, q) }))
  const total = weighted.reduce((sum, item) => sum + item.w, 0)
  let r = Math.random() * total
  for (const item of weighted) {
    r -= item.w
    if (r <= 0) return item.q
  }
  return weighted[weighted.length - 1].q
}

export function questionsForSkill(state: TrainerState, questions: Question[], skill: SkillId, count = 10) {
  const exact = questions.filter(q => q.skills.includes(skill))
  const sorted = [...exact].sort((a, b) => questionWeight(state, b) - questionWeight(state, a))
  const fresh = sorted.filter(q => !state.attempts.slice(0, 16).some(a => a.questionId === q.id))
  const source = fresh.length >= count ? fresh : sorted
  return source.slice(0, Math.min(count, source.length))
}

export function weakestSkills(state: TrainerState, limit = 6) {
  return Object.entries(normalizeState(state).skills)
    .map(([skill, value]) => ({ skill: skill as SkillId, ...value! }))
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, limit)
}

export function accuracy(state: TrainerState) {
  const s = normalizeState(state)
  return s.totalAnswered ? Math.round((s.totalCorrect / s.totalAnswered) * 100) : 0
}

export function avgTimeForSkill(s: SkillState) {
  return s.attempts ? Math.round(s.totalMs / s.attempts / 1000) : 0
}

function windowAccuracy(items: TrainerState['attempts']) {
  if (!items.length) return 0
  return Math.round(items.filter(a => a.correct).length / items.length * 100)
}

export function recentAccuracy(state: TrainerState, count = 30) {
  return windowAccuracy(normalizeState(state).attempts.slice(0, count))
}

export function improvement(state: TrainerState) {
  const s = normalizeState(state)
  if (s.attempts.length < 10) return { baseline: accuracy(s), recent: accuracy(s), delta: 0 }
  const chronological = [...s.attempts].reverse()
  const n = Math.min(25, Math.max(5, Math.floor(chronological.length / 3)))
  const baseline = windowAccuracy(chronological.slice(0, n))
  const recent = windowAccuracy(s.attempts.slice(0, n))
  return { baseline, recent, delta: recent - baseline }
}

export function readiness(state: TrainerState) {
  const s = normalizeState(state)
  if (!s.totalAnswered) return 0
  const acc = recentAccuracy(s, 40)
  const skillValues = Object.values(s.skills).map(x => x!.mastery)
  const mastery = skillValues.length ? skillValues.reduce((a, b) => a + b, 0) / skillValues.length : 50
  const timed = s.attempts.slice(0, 40)
  const speed = timed.length
    ? timed.filter(a => a.elapsedMs <= (a.part === 5 ? 25_000 : a.part === 6 ? 45_000 : 75_000)).length / timed.length * 100
    : 0
  const raw = clamp(acc * 0.52 + mastery * 0.33 + speed * 0.15)
  const evidence = Math.min(1, s.totalAnswered / 40)
  return Math.round(raw * (0.55 + evidence * 0.45))
}

export function learnerTier(state: TrainerState): LearnerTier {
  const s = normalizeState(state)
  if (s.totalAnswered < 20) return 'Calibrating'
  const score = readiness(s)
  if (score < 45) return 'Foundation'
  if (score < 60) return 'Developing'
  if (score < 72) return 'Building'
  if (score < 85) return 'Strong'
  return 'Exam Ready'
}

export function skillTier(mastery = 50) {
  if (mastery < 45) return 'Learn'
  if (mastery < 65) return 'Build'
  if (mastery < 80) return 'Practice'
  return 'Challenge'
}

export function attemptsToday(state: TrainerState) {
  const today = dayKey()
  return normalizeState(state).attempts.filter(a => dayKey(new Date(a.at)) === today).length
}

export function daysToExam(now = new Date()) {
  const ms = EXAM_DATE.getTime() - now.getTime()
  return Math.max(0, Math.ceil(ms / 86_400_000))
}

export function partAccuracy(state: TrainerState, part: Part) {
  return windowAccuracy(normalizeState(state).attempts.filter(a => a.part === part))
}

export function mistakeReasons(state: TrainerState) {
  const counts: Partial<Record<ErrorReason, number>> = {}
  for (const attempt of normalizeState(state).attempts) {
    if (!attempt.errorReason) continue
    counts[attempt.errorReason] = (counts[attempt.errorReason] ?? 0) + 1
  }
  return counts
}

export function studyStreak(state: TrainerState) {
  const dates = new Set(normalizeState(state).studyDates)
  if (!dates.size) return 0
  const cursor = new Date()
  if (!dates.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (dates.has(dayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function dueLessonSkills(state: TrainerState) {
  const s = normalizeState(state)
  const now = Date.now()
  return Object.values(s.lessonResults)
    .filter(result => result && result.nextReviewAt <= now)
    .sort((a, b) => a!.nextReviewAt - b!.nextReviewAt)
    .map(result => result!.skill)
}

export function nextFocusSkill(state: TrainerState): SkillId {
  const due = dueLessonSkills(state)
  if (due.length) return due[0]
  const weak = weakestSkills(state, 1)
  return weak[0]?.skill ?? 'verb-tense'
}

export function dailyTargets() {
  const days = daysToExam()
  if (days <= 2) return { part5: 20, part6: 8, part7: 12, total: 40, label: 'Light review' }
  if (days <= 5) return { part5: 30, part6: 12, part7: 23, total: 65, label: 'Exam simulation phase' }
  return { part5: 35, part6: 12, part7: 23, total: 70, label: 'Accuracy + speed build' }
}

export function buildAgentSummary(state: TrainerState) {
  const s = normalizeState(state)
  const weak = weakestSkills(s, 10).map(skill => ({
    skill: skill.skill,
    mastery: Math.round(skill.mastery),
    attempts: skill.attempts,
    accuracy: skill.attempts ? Math.round(skill.correct / skill.attempts * 100) : 0,
    avgSeconds: avgTimeForSkill(skill),
    tier: skillTier(skill.mastery),
  }))
  const trend = improvement(s)
  const targets = dailyTargets()
  return {
    updatedAt: new Date().toISOString(),
    examDate: EXAM_DATE.toISOString(),
    daysToExam: daysToExam(),
    learnerTier: learnerTier(s),
    nextFocusSkill: nextFocusSkill(s),
    xp: s.xp,
    studyStreak: studyStreak(s),
    totals: {
      answered: s.totalAnswered,
      correct: s.totalCorrect,
      accuracy: accuracy(s),
      recentAccuracy: recentAccuracy(s),
      readiness: readiness(s),
      today: attemptsToday(s),
      dailyGoal: targets.total,
    },
    improvement: trend,
    partAccuracy: {
      part5: partAccuracy(s, 5),
      part6: partAccuracy(s, 6),
      part7: partAccuracy(s, 7),
    },
    weakestSkills: weak,
    dueLessonSkills: dueLessonSkills(s),
    lessonResults: s.lessonResults,
    mistakeReasons: mistakeReasons(s),
    recentMistakes: s.attempts.filter(a => !a.correct).slice(0, 40),
  }
}

if (import.meta.env.DEV) {
  const q = { id:'self', part:5, stem:'x', choices:[], answer:'A', skills:['verb-tense'], difficulty:2, explanation:'x' } as Question
  const checked = recordAttempt(emptyState(), q, 'B', 30_000)
  console.assert(checked.questionMistakes.self === 1 && checked.skills['verb-tense']!.mastery < 50, 'adaptive self-check failed')
}
