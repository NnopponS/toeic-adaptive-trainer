export type Part = 5 | 6 | 7

export type SkillId =
  | 'part-of-speech'
  | 'verb-tense'
  | 'subject-verb'
  | 'passive'
  | 'preposition'
  | 'conjunction'
  | 'relative-clause'
  | 'pronoun'
  | 'comparison'
  | 'vocabulary'
  | 'collocation'
  | 'context'
  | 'sentence-placement'
  | 'main-idea'
  | 'detail'
  | 'inference'
  | 'purpose'
  | 'paraphrase'
  | 'multi-text'

export type ErrorReason = 'grammar' | 'vocabulary' | 'misread' | 'rushed' | 'guess'
export type AttemptDiagnosis = 'on-target' | 'correct-slow' | 'knowledge-gap' | 'rushed' | 'uncertain' | 'fast-guess'
export type AttemptMode = 'adaptive' | 'mastery' | 'mock' | 'review'
export type LearnerTier = 'Calibrating' | 'Foundation' | 'Developing' | 'Building' | 'Strong' | 'Exam Ready'

export interface Choice {
  id: string
  text: string
}

export interface Question {
  id: string
  part: Part
  stem: string
  choices: Choice[]
  answer: string
  skills: SkillId[]
  difficulty: 1 | 2 | 3 | 4 | 5
  explanation: string
  explanationTh?: string
  translationTh?: string
  choiceTranslationsTh?: Record<string, string>
  evidence?: string
  whyOthers?: Record<string, string>
  whyOthersTh?: Record<string, string>
  /** Authored = checked item-specific Thai A-D; contextualized = evidence-based enhancement from legacy source. */
  rationaleSource?: 'authored' | 'contextualized'
  passageId?: string
  source?: 'core' | 'personalized'
  createdAt?: number
  ruleId?: string
  chapterIds?: number[]
  targetSeconds?: number
  coaching?: {
    focus: string[]
    steps: [string, string, string]
    memory: string
    choiceReasons: Record<string, string>
    breakdown?: { subject: string; verb: string; object?: string; blankRole: string; signal: string; pattern: string }
  }
}

export interface Passage {
  id: string
  part: 6 | 7
  kind: 'email' | 'notice' | 'article' | 'message' | 'advertisement' | 'multi'
  title: string
  body: string
  questions: string[]
  sourceLabel?: string
  examStyle?: boolean
  visual?: 'floor-plan' | 'schedule' | 'receipt' | 'poster' | 'chart' | 'route' | 'table' | 'menu' | 'web-page' | 'invoice' | 'calendar' | 'chat' | 'directory' | 'coupon' | 'map'
  visualTitle?: string
  visualData?: string[]
}

export interface SkillState {
  attempts: number
  correct: number
  recent: boolean[]
  totalMs: number
  mastery: number
  dueBoost: number
  lastPracticedAt?: number
}

export interface Attempt {
  questionId: string
  part?: Part
  correct: boolean
  selected: string
  elapsedMs: number
  targetMs?: number
  diagnosis?: AttemptDiagnosis
  at: number
  skills: SkillId[]
  errorReason?: ErrorReason
  confidence?: 1 | 2 | 3
  confidenceBase?: { skills: Partial<Record<SkillId,Pick<SkillState,'mastery'|'dueBoost'>>>; rule?: Pick<SkillState,'mastery'|'dueBoost'> }
  mode?: AttemptMode
  lessonSkill?: SkillId
  difficulty?: number
  ruleId?: string
  chapterIds?: number[]
  vocabSelected?: string
  vocabAnswer?: string
  vocabReviewApplied?: boolean
}

export interface LessonResult {
  skill: SkillId
  attempts: number
  bestScore: number
  lastScore: number
  lastAvgSeconds: number
  lastCompletedAt: number
  nextReviewAt: number
}

export interface VocabReviewState {
  seen: number
  hard: number
  known: number
  lastAt?: number
}

export interface TrainerState {
  modifiedAt?: number
  attempts: Attempt[]
  skills: Partial<Record<SkillId, SkillState>>
  questionMistakes: Record<string, number>
  questionCorrectStreak: Record<string, number>
  totalCorrect: number
  totalAnswered: number
  currentStreak: number
  bestStreak: number
  xp: number
  studyDates: string[]
  lessonResults: Partial<Record<SkillId, LessonResult>>
  ruleStats: Record<string, SkillState>
  vocabReview: Record<string, VocabReviewState>
  mockCompletions: number
}

export interface WorkedExample {
  id: string
  skill: SkillId
  stem: string
  choices: Choice[]
  answer: string
  clue: string
  rule: string
  explanation: string
  trap: string
  difficulty: 1 | 2 | 3 | 4 | 5
}

export interface LessonDefinition {
  skill: SkillId
  title: string
  shortTitle: string
  icon: string
  summary: string
  strategy: string[]
  workedExamples: WorkedExample[]
  practiceCount: number
  passScore: number
}

export interface FirebaseQuestionBank {
  version?: number
  personalized?: Record<string, Question>
  passages?: Record<string, Passage>
}

export type View = 'home' | 'learn' | 'practice' | 'part5' | 'part6' | 'part7' | 'mock' | 'analytics' | 'review' | 'vocab'
