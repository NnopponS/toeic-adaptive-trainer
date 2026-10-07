import type {
  AttemptMode,
  ErrorReason,
  LearnerTier,
  Part,
  Passage,
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
  ruleStats: {},
  vocabReview: {},
  mockCompletions: 0,
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
    ruleStats: input?.ruleStats ?? {},
    vocabReview: input?.vocabReview ?? {},
    mockCompletions: input?.mockCompletions ?? 0,
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
  next.modifiedAt = now

  const vocabSelected = (question.skills.includes('vocabulary') || question.skills.includes('collocation'))
    ? question.choices.find(choice => choice.id === selected)?.text
    : undefined
  const vocabAnswer = (question.skills.includes('vocabulary') || question.skills.includes('collocation'))
    ? question.choices.find(choice => choice.id === question.answer)?.text
    : undefined

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
    ruleId: question.ruleId ?? question.skills[0],
    chapterIds: question.chapterIds,
    vocabSelected,
    vocabAnswer,
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
    const speedTarget = (question.targetSeconds ?? (question.part === 5 ? 25 : question.part === 6 ? 45 : 75)) * 1000
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

  const ruleId = question.ruleId ?? question.skills[0]
  if (ruleId) {
    const old = next.ruleStats[ruleId] ?? {
      attempts: 0,
      correct: 0,
      recent: [],
      totalMs: 0,
      mastery: 50,
      dueBoost: 0,
    }
    const recent = [correct, ...old.recent].slice(0, 10)
    const recentAcc = recent.filter(Boolean).length / recent.length
    const speedTarget = (question.targetSeconds ?? (question.part === 5 ? 25 : question.part === 6 ? 45 : 75)) * 1000
    const speedFactor = clamp(speedTarget / Math.max(elapsedMs, 1), 0.6, 1.06)
    const evidence = recentAcc * 100 * speedFactor * (1 + Math.max(0, question.difficulty - 2) * 0.05)
    next.ruleStats[ruleId] = {
      attempts: old.attempts + 1,
      correct: old.correct + (correct ? 1 : 0),
      recent,
      totalMs: old.totalMs + elapsedMs,
      mastery: clamp(old.mastery * 0.65 + evidence * 0.35),
      dueBoost: correct ? Math.max(0, old.dueBoost - 15) : Math.min(100, old.dueBoost + 45),
      lastPracticedAt: now,
    }
  }

  return next
}

export function addFeedbackToLatest(state: TrainerState, reason?: ErrorReason, confidence?: 1 | 2 | 3) {
  if (!state.attempts.length) return state
  const next = structuredClone(normalizeState(state))
  const attempt = next.attempts[0]
  const rating = confidence ?? attempt.confidence
  const confidencePenalty = (value?: number) => attempt.correct ? value === 1 ? 10 : value === 2 ? 4 : 0 : 0
  const penalty = confidencePenalty(rating)
  attempt.confidenceBase ??= {skills:{}}
  for (const skill of attempt.skills) {
    const stats=next.skills[skill]
    if (stats) {
      const base=attempt.confidenceBase.skills[skill] ??= {mastery:stats.mastery,dueBoost:stats.dueBoost}
      stats.mastery=clamp(base.mastery-penalty); stats.dueBoost=clamp(base.dueBoost+penalty*2)
    }
  }
  const rule=attempt.ruleId ? next.ruleStats[attempt.ruleId] : undefined
  if (rule) {
    const base=attempt.confidenceBase.rule ??= {mastery:rule.mastery,dueBoost:rule.dueBoost}
    rule.mastery=clamp(base.mastery-penalty); rule.dueBoost=clamp(base.dueBoost+penalty*2)
  }
  next.attempts[0] = { ...attempt, errorReason: reason ?? attempt.errorReason, confidence: rating }
  next.modifiedAt=Date.now()
  return next
}

export function markVocabReview(state: TrainerState, word: string, knewIt: boolean) {
  const next = structuredClone(normalizeState(state))
  const key = word.trim().toLowerCase()
  if (!key) return next
  const old = next.vocabReview[key] ?? { seen:0, hard:0, known:0 }
  next.vocabReview[key] = {
    seen: old.seen + 1,
    hard: old.hard + (knewIt ? 0 : 1),
    known: old.known + (knewIt ? 1 : 0),
    lastAt: Date.now(),
  }
  next.modifiedAt=Date.now()
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
  next.modifiedAt=now
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
  const ruleId = q.ruleId ?? q.skills[0]
  const rule = ruleId ? s.ruleStats[ruleId] : undefined
  const attempts = s.attempts
  const lastQuestionIndex = attempts.findIndex(a => a.questionId === q.id)
  const lastRuleIndex = ruleId ? attempts.findIndex(a => a.ruleId === ruleId) : -1
  const questionExposure = attempts.filter(a => a.questionId === q.id).length
  const recentSameRule = ruleId ? attempts.slice(0, 4).filter(a => a.ruleId === ruleId).length : 0

  const mistakeWeight = Math.min(48, (s.questionMistakes[q.id] ?? 0) * 11)
  const streakRelief = Math.min((s.questionCorrectStreak[q.id] ?? 0) * 7, 28)
  const weakSkillWeight = q.skills.reduce((sum, skill) => {
    const value = s.skills[skill]
    return sum + (value ? (100 - value.mastery) * 0.48 + value.dueBoost * 0.45 : 16)
  }, 0)
  const ruleWeight = rule
    ? (100 - rule.mastery) * 0.7 + rule.dueBoost * 0.55
    : 24
  const coverageBonus = rule ? Math.max(0, 24 - rule.attempts * 3) : 24

  const combinedMastery = [
    ...q.skills.map(skill => s.skills[skill]?.mastery).filter((value): value is number => typeof value === 'number'),
    ...(rule ? [rule.mastery] : []),
  ]
  const mastery = combinedMastery.length
    ? combinedMastery.reduce((a, b) => a + b, 0) / combinedMastery.length
    : 50
  const targetDifficulty = mastery < 45 ? 1.8 : mastery < 62 ? 2.5 : mastery < 78 ? 3.4 : 4.2
  const difficultyFit = Math.max(-14, 20 - Math.abs(q.difficulty - targetDifficulty) * 10)

  const targetMs = (q.targetSeconds ?? (q.part === 5 ? 25 : q.part === 6 ? 45 : 75)) * 1000
  const speedBonus = rule?.attempts && rule.totalMs / rule.attempts > targetMs * 1.2 ? 16 : 0
  const remediationBonus = lastRuleIndex >= 0 && lastRuleIndex <= 6 && attempts[lastRuleIndex]?.correct === false && lastQuestionIndex !== 0 ? 22 : 0
  const feedbackBonus = attempts.slice(0, 12)
    .filter(a => !a.correct && a.errorReason && a.skills.some(skill => q.skills.includes(skill)))
    .reduce((sum, a) => {
      if (a.errorReason === 'grammar' && !q.skills.includes('vocabulary')) return sum + 7
      if (a.errorReason === 'vocabulary' && (q.skills.includes('vocabulary') || q.skills.includes('collocation'))) return sum + 9
      if (a.errorReason === 'misread' && q.part >= 6) return sum + 6
      if ((a.errorReason === 'rushed' || a.errorReason === 'guess') && q.difficulty <= 3) return sum + 5
      return sum + 2
    }, 0)
  const uncertaintyBonus = attempts.slice(0, 12)
    .filter(a => a.correct && a.confidence && a.confidence < 3 && a.skills.some(skill => q.skills.includes(skill)))
    .reduce((sum, a) => sum + (a.confidence === 1 ? 14 : 7), 0)
  const spacingBonus = rule?.lastPracticedAt && Date.now() - rule.lastPracticedAt > 86_400_000 ? 14 : 0
  const freshBonus = questionExposure === 0 ? 10 : 0
  const normalizedChoices = q.choices.map(choice => choice.text.trim().toLowerCase())
  const vocabReviewBonus = Object.entries(s.vocabReview ?? {}).reduce((sum, [word, review]) => {
    if (!normalizedChoices.includes(word)) return sum
    return sum + Math.min(28, review.hard * 9 + Math.max(0, review.seen - review.known) * 3)
  }, 0)
  const recentWrongVocabBonus = attempts.slice(0, 80)
    .filter(a => !a.correct && a.vocabSelected && normalizedChoices.includes(a.vocabSelected.toLowerCase()))
    .reduce((sum) => sum + 7, 0)
  const authenticPart7Bonus = q.part === 7 && q.id.startsWith('v7-p7-') ? 30 : 0
  const part7DepthBonus = q.part === 7 ? Math.max(0, q.difficulty - 2) * 7 : 0

  const recentQuestionPenalty = lastQuestionIndex >= 0 && lastQuestionIndex < 8 ? 90 : lastQuestionIndex >= 8 && lastQuestionIndex < 24 ? 24 : 0
  const interleavePenalty = recentSameRule >= 3 ? 26 : recentSameRule === 2 ? 10 : 0
  const overExposurePenalty = Math.max(0, questionExposure - 2) * 5

  return Math.max(
    1,
    8
      + mistakeWeight
      + weakSkillWeight
      + ruleWeight
      + coverageBonus
      + difficultyFit
      + speedBonus
      + remediationBonus
      + feedbackBonus
      + uncertaintyBonus
      + spacingBonus
      + freshBonus
      + vocabReviewBonus
      + recentWrongVocabBonus
      + authenticPart7Bonus
      + part7DepthBonus
      - streakRelief
      - recentQuestionPenalty
      - interleavePenalty
      - overExposurePenalty,
  )
}

export function pickAdaptiveQuestion(state: TrainerState, questions: Question[], excludeId?: string): Question {
  const base = questions.filter(q => q.id !== excludeId)
  if (!base.length) return questions[0]
  const recentIds = new Set(normalizeState(state).attempts.slice(0, 8).map(a => a.questionId))
  const freshEnough = base.filter(q => !recentIds.has(q.id))
  const pool = freshEnough.length >= Math.min(8, base.length) ? freshEnough : base
  const suitable = pool.filter(q => {
    const values=q.skills.map(skill=>state.skills[skill]?.mastery).filter((n): n is number=>typeof n==='number')
    const mastery=values.length ? values.reduce((a,b)=>a+b,0)/values.length : 50
    const ceiling=mastery<45 ? 2 : mastery<65 ? 3 : mastery<80 ? 4 : 5
    const floor=mastery<45 ? 1 : mastery<80 ? 2 : 3
    return q.difficulty>=floor && q.difficulty<=ceiling
  })
  const weighted = (suitable.length ? suitable : pool).map(q => ({ q, w: questionWeight(state, q) }))
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

export function completeReadingSample(questions: Question[], passages: Record<string,Passage>, target: number) {
  const byId=new Map(questions.map(q=>[q.id,q]))
  const groups=Object.values(passages).filter(p=>p.part===questions[0]?.part)
    .map(p=>p.questions.map(id=>byId.get(id)))
    .filter((group):group is Question[]=>group.length>0 && group.every(q=>Boolean(q)))
    .filter(group=>questions[0]?.part!==6 || group.length===4)
  for (let i=groups.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [groups[i],groups[j]]=[groups[j],groups[i]] }
  // Exact count from whole passages; never cut a document's question set in half.
  const sets=new Map<number,Question[]>([[0,[]]])
  for (const group of groups) {
    for (const [count,picked] of [...sets]) {
      const size=count+group.length
      if (size<=target && !sets.has(size)) sets.set(size,[...picked,...group])
    }
    if (sets.has(target)) return sets.get(target)!
  }
  throw new Error(`Not enough complete Part ${questions[0]?.part} passages for ${target} questions`)
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

export function skillAssessment(state: TrainerState, skill: SkillId) {
  const value = normalizeState(state).skills[skill]
  if (!value?.attempts) return { value: null as number | null, label: 'Not assessed', attempts: 0 }
  if (value.attempts < 3) return { value: null as number | null, label: `Calibrating ${value.attempts}/3`, attempts: value.attempts }
  return { value: Math.round(value.mastery), label: `${Math.round(value.mastery)}% mastery`, attempts: value.attempts }
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

const readinessSkills: SkillId[] = [
  'part-of-speech','verb-tense','subject-verb','passive','preposition','conjunction',
  'relative-clause','pronoun','comparison','vocabulary','collocation','context',
  'sentence-placement','main-idea','detail','inference','purpose','paraphrase','multi-text',
]

export function readinessReport(state: TrainerState) {
  const s = normalizeState(state)
  const partTargets: Record<Part, number> = { 5: 90, 6: 48, 7: 54 }
  const partCounts = {
    5: s.attempts.filter(a => a.part === 5).length,
    6: s.attempts.filter(a => a.part === 6).length,
    7: s.attempts.filter(a => a.part === 7).length,
  }
  const recent = s.attempts.slice(0, 80)
  const acc = recent.length ? windowAccuracy(recent) : 0
  const assessedSkills = readinessSkills
    .map(skill => ({ skill, state: s.skills[skill] }))
    .filter(item => (item.state?.attempts ?? 0) >= 6)
  const mastery = assessedSkills.length
    ? assessedSkills.reduce((sum, item) => sum + item.state!.mastery, 0) / assessedSkills.length
    : 0
  const speed = recent.length
    ? recent.filter(a => a.elapsedMs <= (a.part === 5 ? 25_000 : a.part === 6 ? 45_000 : 75_000)).length / recent.length * 100
    : 0
  const skillCoverage = assessedSkills.length / readinessSkills.length * 100
  const partCoverage = ([5, 6, 7] as Part[])
    .map(part => Math.min(100, partCounts[part] / partTargets[part] * 100))
    .reduce((a, b) => a + b, 0) / 3
  const mockQuestions = s.attempts.filter(a => a.mode === 'mock').length
  const mockCompletions = s.mockCompletions
  const mockCoverage = Math.min(100, mockCompletions * 100)
  const evidence = clamp(skillCoverage * 0.5 + partCoverage * 0.35 + mockCoverage * 0.15)
  const raw = clamp(acc * 0.45 + mastery * 0.35 + speed * 0.2)
  const score = s.totalAnswered ? Math.round(raw * (0.35 + evidence / 100 * 0.65)) : 0

  const weakestRules = Object.entries(s.ruleStats)
    .map(([ruleId, value]) => ({
      ruleId,
      mastery: Math.round(value.mastery),
      attempts: value.attempts,
      accuracy: value.attempts ? Math.round(value.correct / value.attempts * 100) : 0,
      avgSeconds: avgTimeForSkill(value),
    }))
    .sort((a, b) => a.mastery - b.mastery || b.attempts - a.attempts)
    .slice(0, 8)

  const gaps = readinessSkills
    .filter(skill => (s.skills[skill]?.attempts ?? 0) < 6)
    .map(skill => ({ skill, attempts: s.skills[skill]?.attempts ?? 0, target: 6 }))

  const gates = [
    { key:'part5-coverage', label:'Part 5 evidence', current:partCounts[5], target:partTargets[5], passed:partCounts[5] >= partTargets[5] },
    { key:'part6-coverage', label:'Part 6 evidence', current:partCounts[6], target:partTargets[6], passed:partCounts[6] >= partTargets[6] },
    { key:'part7-coverage', label:'Part 7 evidence', current:partCounts[7], target:partTargets[7], passed:partCounts[7] >= partTargets[7] },
    { key:'skill-coverage', label:'Skills assessed', current:assessedSkills.length, target:readinessSkills.length, passed:assessedSkills.length === readinessSkills.length },
    { key:'recent-accuracy', label:'Recent accuracy', current:acc, target:85, passed:acc >= 85 },
    { key:'timing', label:'On-time answers', current:Math.round(speed), target:85, passed:speed >= 85 },
    { key:'full-mock', label:'Full mock completed', current:mockCompletions, target:1, passed:mockCompletions >= 1 },
  ]

  const nextActions: string[] = []
  if (gaps.length) nextActions.push(`Assess ${gaps.slice(0, 3).map(g => g.skill).join(', ')}`)
  if (weakestRules.length) nextActions.push(`Remediate ${weakestRules.slice(0, 2).map(r => r.ruleId).join(', ')}`)
  if (partCounts[6] < partTargets[6]) nextActions.push('Build Part 6 speed and context coverage')
  if (partCounts[7] < partTargets[7]) nextActions.push('Build Part 7 evidence-reading coverage')
  if (mockCompletions < 1 && partCoverage >= 70) nextActions.push('Complete one full 100-question timed Reading mock')

  return {
    score,
    recentAccuracy: acc,
    mastery: Math.round(mastery),
    onTimeRate: Math.round(speed),
    skillCoverage: Math.round(skillCoverage),
    partCoverage: Math.round(partCoverage),
    evidenceCoverage: Math.round(evidence),
    partCounts,
    mockQuestions,
    mockCompletions,
    gates,
    gaps,
    weakestRules,
    nextActions,
  }
}

export function readiness(state: TrainerState) {
  return readinessReport(state).score
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
  const s = normalizeState(state)
  const due = dueLessonSkills(s)
  if (due.length) return due[0]

  const lessonSkills: SkillId[] = [
    'verb-tense','part-of-speech','preposition','conjunction','subject-verb',
    'passive','relative-clause','pronoun','comparison','collocation',
  ]
  const measured = lessonSkills
    .map(skill => ({ skill, state: s.skills[skill] }))
    .filter(item => (item.state?.attempts ?? 0) >= 3)
    .sort((a, b) => (a.state?.mastery ?? 50) - (b.state?.mastery ?? 50))
  const weak = measured[0]
  if (weak?.state && weak.state.mastery < 65) return weak.skill

  const calibrating = lessonSkills
    .map(skill => ({ skill, attempts: s.skills[skill]?.attempts ?? 0 }))
    .filter(item => item.attempts < 3)
    .sort((a, b) => a.attempts - b.attempts)
  if (calibrating.length) return calibrating[0].skill

  return weak?.skill ?? 'verb-tense'
}

export function dailyTargets(state?: TrainerState) {
  const days = daysToExam()
  const total = days <= 2 ? 40 : days <= 5 ? 65 : 70
  const label = days <= 2 ? 'Light review' : days <= 5 ? 'Exam simulation phase' : 'Accuracy + speed build'
  if (!state?.totalAnswered) {
    const part5 = Math.round(total * 0.5)
    const part6 = Math.round(total * 0.18)
    return { part5, part6, part7: total - part5 - part6, total, label }
  }

  const s = normalizeState(state)
  const base: Record<Part, number> = { 5: 1.25, 6: 0.85, 7: 1 }
  const partTargets: Record<Part, number> = { 5: 90, 6: 48, 7: 54 }
  const weights = ([5, 6, 7] as Part[]).map(part => {
    const attempts = s.attempts.filter(a => a.part === part)
    const acc = attempts.length ? windowAccuracy(attempts.slice(0, 30)) : 50
    const coverage = Math.min(1, attempts.length / partTargets[part])
    return {
      part,
      weight: base[part] + (100 - acc) / 75 + (1 - coverage) * 0.9,
    }
  })
  const weightTotal = weights.reduce((sum, item) => sum + item.weight, 0)
  const minimums: Record<Part, number> = { 5: Math.min(15, total), 6: Math.min(8, total), 7: Math.min(10, total) }
  const remaining = Math.max(0, total - minimums[5] - minimums[6] - minimums[7])
  const allocated = Object.fromEntries(weights.map(item => [
    item.part,
    minimums[item.part] + Math.round(remaining * item.weight / weightTotal),
  ])) as Record<Part, number>
  const delta = total - allocated[5] - allocated[6] - allocated[7]
  allocated[5] += delta
  return { part5: allocated[5], part6: allocated[6], part7: allocated[7], total, label }
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
  const targets = dailyTargets(s)
  const readinessData = readinessReport(s)
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
    readinessReport: readinessData,
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
    recentUncertainCorrect: s.attempts.filter(a => a.correct && a.confidence && a.confidence < 3).slice(0, 40),
    vocabReview: s.vocabReview,
    recentWrongVocabulary: s.attempts.filter(a => !a.correct && a.vocabSelected).slice(0, 40),
  }
}

if (import.meta.env.DEV) {
  const q = { id:'self', part:5, stem:'x', choices:[], answer:'A', skills:['verb-tense'], difficulty:2, explanation:'x', ruleId:'tense.self' } as Question
  const checked = recordAttempt(emptyState(), q, 'B', 30_000)
  const sameRule = { ...q, id:'self-same', ruleId:'tense.self' }
  const otherRule = { ...q, id:'self-other', ruleId:'tense.other' }
  console.assert(
    checked.questionMistakes.self === 1
      && checked.skills['verb-tense']!.mastery < 50
      && checked.ruleStats['tense.self']?.attempts === 1
      && questionWeight(checked, sameRule) > questionWeight(checked, otherRule),
    'adaptive self-check failed',
  )
}
