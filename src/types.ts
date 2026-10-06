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
  whyOthers?: Record<string, string>
  passageId?: string
  source?: 'core' | 'personalized'
  createdAt?: number
}

export interface Passage {
  id: string
  part: 6 | 7
  kind: 'email' | 'notice' | 'article' | 'message' | 'advertisement' | 'multi'
  title: string
  body: string
  questions: string[]
  sourceLabel?: string
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
  at: number
  skills: SkillId[]
  errorReason?: ErrorReason
  confidence?: 1 | 2 | 3
  mode?: AttemptMode
  lessonSkill?: SkillId
  difficulty?: number
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

export interface TrainerState {
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
}

export type View = 'home' | 'part5' | 'part6' | 'part7' | 'mock' | 'analytics' | 'review'
