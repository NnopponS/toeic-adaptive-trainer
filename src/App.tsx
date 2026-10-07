import { createContext, useContext, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import './App.css'
import {
  addFeedbackToLatest,
  attemptsToday,
  completeLesson,
  dailyTargets,
  daysToExam,
  dueLessonSkills,
  emptyState,
  improvement,
  learnerTier,
  nextFocusSkill,
  normalizeState,
  partAccuracy,
  pickAdaptiveQuestion,
  questionsForSkill,
  recentAccuracy,
  readinessReport,
  recordAttempt,
  skillAssessment,
  skillTier,
  studyStreak,
  weakestSkills,
} from './adaptive'
import { part5, part6, part7, passageById, skillLabels } from './data'
import {
  loadCloudState,
  publishQuestionBankManifest,
  syncCloudState,
  watchConnection,
  watchPersonalizedPassages,
  watchPersonalizedQuestions,
} from './firebase'
import { lessonBySkill, lessons } from './lessons'
import { chaptersForQuestion, chaptersForSkill, readingCourseChapters } from './courseGuide'
import {
  LANG_STORAGE_KEY,
  L,
  thaiChapterTips,
  thaiChapterTitles,
  thaiExamples,
  thaiLessonMeta,
  thaiSkillLabels,
  type Language,
} from './i18n'
import type {
  ErrorReason,
  LessonDefinition,
  Part,
  Passage,
  Question,
  SkillId,
  TrainerState,
  View,
} from './types'

const STORAGE_KEY = 'toeic-adaptive-trainer-v3'
const LEGACY_STORAGE_KEY = 'toeic-adaptive-trainer-v1'
type StateSetter = Dispatch<SetStateAction<TrainerState>>

const LanguageContext = createContext<Language>('th')
const useLanguage = () => useContext(LanguageContext)

function localizedSkill(skill: SkillId, lang: Language) {
  return lang === 'th' ? thaiSkillLabels[skill] : skillLabels[skill]
}

function localizedLesson(lesson: LessonDefinition, lang: Language) {
  const th = thaiLessonMeta[lesson.skill]
  if (lang === 'en' || !th) return {
    title: lesson.title,
    shortTitle: lesson.shortTitle,
    summary: lesson.summary,
    strategy: lesson.strategy,
  }
  return th
}

function localizedExample(example: LessonDefinition['workedExamples'][number], lang: Language) {
  return lang === 'th' ? (thaiExamples[example.id] ?? example) : example
}

function localizedChapterTitle(id: number, title: string, lang: Language) {
  return lang === 'th' ? (thaiChapterTitles[id] ?? title) : title
}

function localizedChapterTips(id: number, fallback: string[], lang: Language) {
  return lang === 'th' ? (thaiChapterTips[id] ?? fallback) : fallback
}

function localizedTier(tier: ReturnType<typeof learnerTier>, lang: Language) {
  if (lang === 'en') return tier
  const map: Record<ReturnType<typeof learnerTier>, string> = {
    Calibrating: 'กำลังประเมินระดับ',
    Foundation: 'พื้นฐาน',
    Developing: 'กำลังพัฒนา',
    Building: 'กำลังสร้างความแม่น',
    Strong: 'แข็งแรง',
    'Exam Ready': 'พร้อมสอบ',
  }
  return map[tier]
}

function localizedSkillTierName(tier: ReturnType<typeof skillTier>, lang: Language) {
  if (lang === 'en') return tier
  return ({ Learn:'ต้องเรียน', Build:'กำลังสร้างพื้นฐาน', Practice:'ฝึกเพิ่ม', Challenge:'ระดับท้าทาย' } as Record<string,string>)[tier] ?? tier
}

function localizedGateLabel(key: string, fallback: string, lang: Language) {
  if (lang === 'en') return fallback
  const labels: Record<string, string> = {
    'part5-coverage': 'หลักฐาน Part 5',
    'part6-coverage': 'หลักฐาน Part 6',
    'part7-coverage': 'หลักฐาน Part 7',
    'skill-coverage': 'หัวข้อที่ประเมินแล้ว',
    'recent-accuracy': 'ความถูกต้องล่าสุด',
    'timing': 'ตอบทันเวลา',
    'full-mock': 'ทำข้อสอบจำลองเต็มชุด',
  }
  return labels[key] ?? fallback
}

function localizedRuleId(ruleId: string, lang: Language) {
  if (lang === 'en') return ruleId
  const rules: Record<string, string> = {
    'wordform.adjective-before-noun':'Adjective หน้าคำนาม',
    'wordform.adverb-modifier':'Adverb ขยายคำ',
    'wordform.noun-position':'ตำแหน่ง Noun',
    'tense.present-perfect-since':'Present Perfect กับ since',
    'tense.past-perfect-sequence':'Past Perfect และลำดับเหตุการณ์',
    'tense.future-progressive':'Future / Future Continuous',
    'sva.head-subject':'หาประธานตัวจริง',
    'sva.correlative':'S–V กับ either/neither',
    'passive.core':'Passive Voice',
    'gerund.after-preposition':'V-ing หลัง Preposition',
    'infinitive.pattern':'Infinitive: to + V1',
    'preposition.time':'Preposition บอกเวลา',
    'preposition.verb-collocation':'Verb + Preposition',
    'connector.clause-vs-phrase':'Connector: clause vs phrase',
    'connector.condition-purpose':'Connector: เงื่อนไข/จุดประสงค์',
    'relative.pronouns':'Relative Pronouns',
    'pronoun.forms':'รูป Pronouns',
    'comparison.patterns':'รูปเปรียบเทียบ',
    'participle.feeling':'Participles -ing/-ed',
    'vocab.business-collocation':'คำศัพท์และวลีธุรกิจ',
    'p6.word-form':'Part 6 ชนิดคำ',
    'p6.connector-context':'Part 6 คำเชื่อมจากบริบท',
    'p6.fixed-phrase':'Part 6 วลีตายตัว',
    'p6.sentence-placement':'Part 6 วางประโยค',
    'p6.preposition':'Part 6 Preposition',
    'p6.verb-form':'Part 6 รูปกริยา',
    'p6.passive-tense':'Part 6 Passive/Tense',
    'p6.relative':'Part 6 Relative Clause',
    'p6.if-clause':'Part 6 If-Clause',
    'p7.detail':'Part 7 หารายละเอียด',
    'p7.paraphrase':'Part 7 Paraphrase',
    'p7.inference':'Part 7 การอนุมาน',
    'p7.purpose':'Part 7 จุดประสงค์',
    'p7.multi-text':'Part 7 เชื่อมหลายบทความ',
  }
  return rules[ruleId] ?? ruleId
}

function localizedNextAction(action: string, lang: Language) {
  if (lang === 'en') return action
  if (action.startsWith('Assess ')) {
    const skills = action.slice(7).split(', ').map(value => thaiSkillLabels[value as SkillId] ?? value)
    return 'เก็บข้อมูลเพิ่ม: ' + skills.join(', ')
  }
  if (action.startsWith('Remediate ')) {
    const rules = action.slice(10).split(', ').map(value => localizedRuleId(value, lang))
    return 'แก้จุดอ่อนซ้ำ: ' + rules.join(', ')
  }
  if (action.includes('Part 6')) return 'เพิ่มความเร็วและความแม่น Part 6'
  if (action.includes('Part 7')) return 'เพิ่มการอ่านหาหลักฐาน Part 7'
  if (action.includes('100-question')) return 'ทำข้อสอบ Reading จำลอง 100 ข้อแบบจับเวลา 1 ชุด'
  return action
}

function localizedAssessmentLabel(
  assessment: ReturnType<typeof skillAssessment>,
  lang: Language,
) {
  if (lang === 'en') return assessment.label
  if (!assessment.attempts) return 'ยังไม่ได้ประเมิน'
  if (assessment.value === null) return `กำลังประเมิน ${assessment.attempts}/3`
  return `ความแม่น ${assessment.value}%`
}

function loadLocalState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY)
    return raw ? normalizeState(JSON.parse(raw)) : emptyState()
  } catch {
    return emptyState()
  }
}

function latestTime(state: TrainerState) {
  return state.attempts[0]?.at ?? 0
}

function chooseFresher(local: TrainerState, cloud: TrainerState | null) {
  if (!cloud) return local
  if (latestTime(cloud) > latestTime(local)) return cloud
  if (latestTime(cloud) === latestTime(local) && cloud.totalAnswered > local.totalAnswered) return cloud
  return local
}

function formatTime(ms: number) {
  return `${Math.max(1, Math.round(ms / 1000))}s`
}

function pct(n: number) {
  return `${Math.max(0, Math.min(100, Math.round(n)))}%`
}

function todayKey(timestamp: number) {
  const d = new Date(timestamp)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function todayPartCount(state: TrainerState, part: Part) {
  const today = todayKey(Date.now())
  return state.attempts.filter(a => a.part === part && todayKey(a.at) === today).length
}

function greetingLabel(lang: Language) {
  const hour = new Date().getHours()
  if (hour < 12) return L(lang, 'Morning study plan', 'แผนฝึกช่วงเช้า')
  if (hour < 18) return L(lang, 'Today’s study plan', 'แผนฝึกวันนี้')
  return L(lang, 'Evening study plan', 'แผนฝึกช่วงเย็น')
}

function passageWithActiveBlank(
  body: string,
  stem: string,
  options?: {
    selectedText?: string
    checked?: boolean
    correct?: boolean
    onClick?: () => void
  },
) {
  const blank = stem.match(/\[(\d+)\]/)?.[1]
  const pieces = body.split(/(\[\d+\]\s*_____)/g)
  return pieces.map((piece, index) => {
    const match = piece.match(/\[(\d+)\]/)
    if (!match) return <span key={index}>{piece}</span>
    const active = match[1] === blank
    const label = active && options?.selectedText ? `[${match[1]}] ${options.selectedText}` : piece
    const stateClass = active && options?.checked
      ? (options.correct ? ' correct' : ' wrong')
      : active && options?.selectedText
        ? ' chosen'
        : ''
    if (active && options?.onClick) {
      return (
        <button
          key={index}
          type="button"
          className={`passage-blank active tappable${stateClass}`}
          onClick={options.onClick}
        >
          {label}
        </button>
      )
    }
    return <mark key={index} className={active ? 'passage-blank active' : 'passage-blank'}>{label}</mark>
  })
}

function fallbackWrongExplanation(question: Question, lang: Language) {
  const skill = question.skills[0]
  const en: Partial<Record<SkillId, string>> = {
    'part-of-speech': 'Identify the word class before meaning. Check what sits directly before and after the blank: noun positions, adjective positions, and adverb positions have strong structural clues.',
    'verb-tense': 'Use the time signal and event sequence first. Decide present/past/future, then simple/continuous/perfect, and only then compare the verb forms.',
    'subject-verb': 'Find the true head subject and ignore distracting nouns in prepositional phrases. The verb must agree with that head subject.',
    passive: 'Ask who performs the action. If the subject receives the action, use the correct form of be + past participle.',
    preposition: 'This depends on either a time/place relationship or a fixed business phrase. Learn common verb/adjective + preposition combinations as chunks.',
    conjunction: 'Decide the logical relationship first: reason, contrast, condition, purpose, or time. Then choose the connector that expresses that relationship.',
    'relative-clause': 'Match the relative word to both the antecedent and its job inside the clause: person, thing, place, possession, subject, or object.',
    pronoun: 'Check whether the blank needs a subject, object, possessive adjective, possessive pronoun, or reflexive form.',
    comparison: 'Look for signals such as than, as…as, twice as, and of the three. They determine comparative, equality, or superlative structure.',
    vocabulary: 'The selected word does not fit the business meaning or natural usage. Compare nearby nouns and verbs and look for common TOEIC collocations.',
    collocation: 'This is a fixed business word combination. Learn the phrase as one unit instead of translating each word separately.',
    context: 'Read one sentence before and after the blank. Track topic, time, reference words, and the logical connection.',
    'sentence-placement': 'The inserted sentence must connect naturally to both sides through topic continuity, reference words, and sequence.',
    detail: 'Return to the exact person, date, number, action, or condition in the passage. Avoid answering from memory of the general topic.',
    inference: 'Choose only what is strongly supported by the text. An answer that is merely possible is not enough.',
    purpose: 'Ask why the writer created this message/document, not just what one sentence says.',
    paraphrase: 'The passage and answer often use different words for the same idea. Search for equivalent meaning rather than exact word matches.',
    'main-idea': 'The best answer must cover the overall purpose of the whole text, not one narrow detail.',
    'multi-text': 'Track which fact comes from which document, then combine only the facts needed by the question.',
  }
  const th: Partial<Record<SkillId, string>> = {
    'part-of-speech': 'หาชนิดคำก่อนดูความหมาย ดูคำหน้า–หลังช่องว่างว่าโครงสร้างต้องการ noun, adjective หรือ adverb แล้วค่อยตัดตัวเลือก',
    'verb-tense': 'หาคำบอกเวลาและลำดับเหตุการณ์ก่อน แยก Present/Past/Future แล้วค่อยดู Simple/Continuous/Perfect',
    'subject-verb': 'หาประธานตัวจริงและตัดวลีบุพบทออกในใจ กริยาต้องสอดคล้องกับ head subject ไม่ใช่คำนามที่อยู่ใกล้ช่องว่าง',
    passive: 'ถามว่าประธานเป็นผู้ทำหรือผู้ถูกกระทำ ถ้าถูกกระทำให้ใช้รูปของ be + V3 ให้ตรงกับ tense',
    preposition: 'ดูว่าเป็นความสัมพันธ์เวลา/สถานที่หรือ fixed phrase และจำ verb/adjective + preposition เป็นชุดเดียว',
    conjunction: 'หาความสัมพันธ์ก่อนว่าเป็นเหตุผล ขัดแย้ง เงื่อนไข จุดประสงค์ หรือเวลา แล้วเลือก connector ให้ตรงโครงสร้าง',
    'relative-clause': 'ดูทั้งคำนามที่ถูกขยายและหน้าที่ใน clause ว่าเป็นคน สิ่งของ สถานที่ ความเป็นเจ้าของ ประธาน หรือกรรม',
    pronoun: 'เช็กว่าช่องว่างต้องการ subject, object, possessive adjective, possessive pronoun หรือ reflexive',
    comparison: 'มองคำสัญญาณ เช่น than, as…as, twice as และ of the three เพื่อแยก comparative/equality/superlative',
    vocabulary: 'คำที่เลือกไม่เข้าความหมายหรือการใช้ตามธรรมชาติ ให้ดูคำรอบข้างและ collocation ที่ใช้จริงในบริบทธุรกิจ',
    collocation: 'ข้อนี้เป็น fixed combination ให้จำทั้งวลีเป็นก้อนเดียว ไม่แปลทีละคำ',
    context: 'อ่านหนึ่งประโยคก่อนและหลังช่องว่าง แล้วตาม topic, เวลา, reference words และความสัมพันธ์ของใจความ',
    'sentence-placement': 'ประโยคที่แทรกต้องเชื่อมได้ทั้งด้านหน้าและด้านหลังผ่านหัวข้อ reference words และลำดับเหตุการณ์',
    detail: 'กลับไปหาหลักฐานตรง ๆ เช่น คน วันที่ ตัวเลข การกระทำ หรือเงื่อนไข แล้วตอบจากบรรทัดนั้น',
    inference: 'เลือกเฉพาะสิ่งที่ข้อความสนับสนุนอย่างชัดเจน คำตอบที่ “เป็นไปได้” แต่ไม่มีหลักฐานพอยังไม่พอ',
    purpose: 'ถามว่าผู้เขียนสร้างข้อความนี้เพื่ออะไร ไม่ใช่แค่ประโยคใดประโยคหนึ่งพูดว่าอะไร',
    paraphrase: 'โจทย์กับ passage มักใช้คนละคำแต่ความหมายเดียวกัน ให้หา synonym/paraphrase แทนการหา exact word',
    'main-idea': 'คำตอบต้องครอบคลุมจุดประสงค์หลักของทั้งบท ไม่ใช่รายละเอียดเล็ก ๆ จุดเดียว',
    'multi-text': 'แยกว่า facts มาจากเอกสารไหน แล้วค่อยรวมเฉพาะข้อมูลที่คำถามต้องการ',
  }
  return lang === 'th'
    ? (th[skill] ?? 'ทบทวนรูปแบบไวยากรณ์ ความหมาย และบริบทรอบช่องว่างก่อนเทียบตัวเลือกอีกครั้ง')
    : (en[skill] ?? 'Re-check the grammar pattern, meaning, and context before comparing the answer choices again.')
}


function localizedQuestionExplanation(question: Question, lang: Language) {
  if (lang === 'en') return question.explanation
  if (question.explanationTh) return question.explanationTh
  const byRule: Record<string, string> = {
    'wordform.adjective-before-noun':'ช่องว่างอยู่หน้าคำนาม จึงต้องใช้ adjective เพื่อขยายคำนาม ไม่ใช่ noun/adverb/verb',
    'wordform.adverb-modifier':'ช่องว่างทำหน้าที่ขยายกริยาหรือ adjective จึงต้องใช้ adverb',
    'wordform.noun-position':'ตำแหน่งนี้ต้องการ noun เพราะทำหน้าที่เป็นประธาน กรรม หรืออยู่หลัง article/possessive',
    'tense.present-perfect-since':'คำว่า since บอกจุดเริ่มต้นในอดีตและช่วงเวลายังเชื่อมถึงปัจจุบัน จึงใช้ present perfect: has/have + V3',
    'tense.past-perfect-sequence':'มีเหตุการณ์อดีต 2 เหตุการณ์ เหตุการณ์ที่เกิดก่อนใช้ past perfect: had + V3',
    'tense.future-progressive':'บริบทพูดถึงเหตุการณ์ในอนาคต ให้เลือก future form ที่ตรงกับช่วงเวลาและลำดับเหตุการณ์',
    'sva.head-subject':'ต้องหาประธานตัวจริงก่อนแล้วจึงผันกริยาให้ตรง อย่าหลงคำนามที่อยู่ใกล้กริยาแต่เป็นเพียงส่วนขยาย',
    'sva.correlative':'either...or / neither...nor ให้กริยาสอดคล้องกับประธานที่อยู่ใกล้กริยามากกว่า',
    'passive.core':'ประธานเป็นผู้ถูกกระทำ จึงต้องใช้ passive voice: be + V3 และผัน be ให้ตรงกับ tense',
    'gerund.after-preposition':'หลัง preposition ถ้าตามด้วยกริยาให้ใช้ V-ing',
    'infinitive.pattern':'โครงสร้างนี้ต้องใช้ infinitive: to + V1',
    'preposition.time':'ให้ดูความหมายเวลา เช่น deadline, จุดเริ่มต้น, ระยะเวลา หรือวัน/เวลาเฉพาะ แล้วเลือก preposition ให้ตรง',
    'preposition.verb-collocation':'เป็น fixed collocation ต้องจำ verb/adjective + preposition เป็นชุดเดียว',
    'connector.clause-vs-phrase':'ดูสิ่งที่ตามหลังช่องว่างก่อน: conjunction ตามด้วย clause ส่วน preposition เช่น despite/because of ตามด้วย noun phrase',
    'connector.condition-purpose':'หาความสัมพันธ์ของใจความก่อนว่าเป็นเงื่อนไข เหตุผล จุดประสงค์ เวลา หรือความขัดแย้ง',
    'relative.pronouns':'เลือก relative pronoun จากคำนามข้างหน้าและหน้าที่ใน relative clause',
    'pronoun.forms':'ดูว่าช่องว่างต้องการ subject/object/possessive/reflexive form',
    'comparison.patterns':'คำอย่าง than, as...as และ of the group เป็นตัวบอกว่าใช้ comparative, equality หรือ superlative',
    'participle.feeling':'-ing ใช้กับสิ่งที่ก่อให้เกิดความรู้สึก ส่วน -ed ใช้กับผู้ที่รู้สึก',
    'vocab.business-collocation':'ต้องเลือกคำที่เข้าความหมายธุรกิจและจับคู่กับคำรอบข้างได้เป็นธรรมชาติ',
    'p6.word-form':'Part 6 ต้องดูทั้งชนิดคำและประโยครอบช่องว่าง ไม่ใช่แปลคำแยกจากบริบท',
    'p6.connector-context':'อ่านประโยคก่อนและหลังแล้วเลือกคำเชื่อมให้ตรงความสัมพันธ์ของเนื้อหา',
    'p6.fixed-phrase':'ข้อนี้ทดสอบวลีตายตัว ให้จำเป็น chunk และตรวจว่าความหมายเข้ากับย่อหน้าด้วย',
    'p6.sentence-placement':'ประโยคที่หายไปต้องเชื่อมกับทั้งประโยคก่อนหน้าและหลังผ่านหัวข้อ ลำดับเหตุการณ์ และ reference words',
    'p6.preposition':'ดูทั้ง fixed phrase และความสัมพันธ์เวลา/สถานที่ของย่อหน้า',
    'p6.verb-form':'หา subject, time signal และ voice ก่อนเลือก tense/verb form',
    'p6.passive-tense':'ประธานถูกกระทำ จึงต้องใช้ passive และผัน tense ให้ตรงกับบริบท',
    'p6.relative':'เลือก relative word ให้ตรงกับ antecedent และหน้าที่ใน clause',
    'p6.if-clause':'ดูรูป if-clause และ result clause เป็นคู่ ไม่เลือก tense จากประโยคเดียว',
  }
  return byRule[question.ruleId ?? ''] ?? fallbackWrongExplanation(question, lang)
}

type AnalysisTone = 'subject' | 'verb' | 'clue' | 'blank' | 'object' | 'modifier'

type AnalysisSegment = {
  text: string
  label: string
  tone: AnalysisTone
}

type QuestionAnalysis = {
  needed: string
  memory: string
  steps: string[]
  segments: AnalysisSegment[]
}

const choiceLexicon: Record<string, { pos: string; en: string; th: string }> = {
  as: { pos:'connector', en:'used in equality patterns such as as ... as and twice as ... as', th:'ใช้ในโครงสร้างเท่ากัน เช่น as ... as และ twice as ... as' },
  than: { pos:'connector', en:'used after a comparative: larger than / more efficient than', th:'ใช้หลัง comparative เช่น larger than / more efficient than' },
  like: { pos:'preposition', en:'means similar to; it does not complete the as ... as pattern', th:'แปลว่า “เหมือน” แต่ไม่ได้ใช้ปิดโครงสร้าง as ... as' },
  from: { pos:'preposition', en:'means from/origin; common in different from, not in as ... as', th:'แปลว่า “จาก” และพบใน different from ไม่ใช่โครงสร้าง as ... as' },
  efficient: { pos:'adjective', en:'describes a noun: an efficient system', th:'adjective ใช้ขยายคำนาม เช่น an efficient system' },
  efficiently: { pos:'adverb', en:'modifies a verb/adjective: work efficiently', th:'adverb ใช้ขยายกริยา/คุณศัพท์ เช่น work efficiently' },
  efficiency: { pos:'noun', en:'a noun meaning the state of being efficient', th:'noun หมายถึง “ประสิทธิภาพ”' },
  efficiencies: { pos:'plural noun', en:'plural noun; refers to efficiencies or savings', th:'คำนามพหูพจน์ ใช้พูดถึงประสิทธิภาพ/ความคุ้มหลายด้าน' },
  conduct: { pos:'verb', en:'conduct a survey = carry out a survey', th:'verb: conduct a survey = ดำเนินการสำรวจ' },
  construct: { pos:'verb', en:'construct = build something physical or structural', th:'verb: construct = ก่อสร้าง/สร้างสิ่งหรือโครงสร้าง' },
  contain: { pos:'verb', en:'contain = hold or include something', th:'verb: contain = บรรจุ/ประกอบด้วย' },
  contact: { pos:'verb', en:'contact = communicate with a person or organization', th:'verb: contact = ติดต่อบุคคลหรือหน่วยงาน' },
  is: { pos:'singular verb', en:'finite singular form of be', th:'กริยา be สำหรับประธานเอกพจน์' },
  are: { pos:'plural verb', en:'finite plural form of be', th:'กริยา be สำหรับประธานพหูพจน์' },
  has: { pos:'singular auxiliary', en:'singular auxiliary for he/she/it or a singular head subject', th:'กริยาช่วยสำหรับประธานเอกพจน์' },
  have: { pos:'plural/base auxiliary', en:'used with plural subjects or I/you/we/they', th:'กริยาช่วยที่ใช้กับประธานพหูพจน์ หรือ I/you/we/they' },
  be: { pos:'base verb', en:'bare infinitive; it needs a modal/to or another structure', th:'กริยารูป base form ต้องมี modal/to หรือโครงสร้างรองรับ' },
}

const connectorUsage: Record<string, { type: string; pattern: string; relation: string; th: string }> = {
  although: { type:'conjunction', pattern:'Although + S + V', relation:'contrast', th:'แม้ว่า + ประโยคเต็ม' },
  though: { type:'conjunction', pattern:'Though + S + V', relation:'contrast', th:'แม้ว่า + ประโยคเต็ม' },
  whereas: { type:'conjunction', pattern:'Whereas + S + V', relation:'contrast', th:'ในขณะที่/แต่ + ประโยคเต็ม' },
  despite: { type:'preposition', pattern:'Despite + N / V-ing', relation:'contrast', th:'แม้ว่า แต่ต้องตามด้วยคำนามหรือ V-ing' },
  because: { type:'conjunction', pattern:'Because + S + V', relation:'reason', th:'เพราะว่า + ประโยคเต็ม' },
  'because of': { type:'preposition phrase', pattern:'Because of + N / V-ing', relation:'reason', th:'เพราะ + คำนามหรือ V-ing' },
  during: { type:'preposition', pattern:'During + N', relation:'time', th:'ระหว่าง + คำนาม' },
  unless: { type:'conjunction', pattern:'Unless + S + V', relation:'condition', th:'เว้นแต่ + ประโยคเต็ม' },
  if: { type:'conjunction', pattern:'If + S + V', relation:'condition', th:'ถ้า + ประโยคเต็ม' },
}

function simpleClauseParts(text: string) {
  const clean = text.trim().replace(/^[,;]+|[.?!]+$/g, '').trim()
  if (!clean) return null
  const verb = /\b(am|is|are|was|were|has|have|had|will|would|can|could|should|must|may|might|do|does|did|[A-Za-z]+ed)\b/i.exec(clean)
  if (!verb || verb.index <= 0) return null
  return {
    subject: clean.slice(0, verb.index).trim(),
    predicate: clean.slice(verb.index).trim(),
  }
}

function relationLabel(relation: string, lang: Language) {
  const th: Record<string,string> = { contrast:'ความขัดแย้ง', reason:'เหตุผล', time:'เวลา', condition:'เงื่อนไข' }
  return lang === 'th' ? (th[relation] ?? relation) : relation
}


function inferWordClass(word: string) {
  const value = word.toLowerCase().replace(/[^a-z-]/g, '')
  const known = choiceLexicon[value]
  if (known) return known.pos
  if (value.endsWith('ly')) return 'adverb'
  if (/(tion|sion|ment|ness|ity|ance|ence|ship|ism|ure)$/.test(value)) return 'noun'
  if (/(ous|ful|less|ive|able|ible|al|ic|ary|ory)$/.test(value)) return 'adjective'
  if (/(ing|ed)$/.test(value)) return 'verb/participle'
  return 'word/form'
}

function stemAroundBlank(stem: string) {
  const match = stem.match(/_{3,}/)
  if (!match || match.index === undefined) return { before: stem, after: '' }
  return {
    before: stem.slice(0, match.index).trim(),
    after: stem.slice(match.index + match[0].length).trim(),
  }
}

function splitSubjectAux(before: string) {
  const m = before.match(/^(.+?)\s+(is|are|was|were|has|have|had|will|would|can|could|should|must|may|might)\s*(.*)$/i)
  return m ? { subject:m[1].trim(), aux:m[2].trim(), middle:m[3].trim() } : null
}

function buildQuestionAnalysis(question: Question, lang: Language): QuestionAnalysis {
  const rule = question.ruleId ?? question.skills[0]
  const { before, after } = stemAroundBlank(question.stem)
  const explanation = question.explanation.toLowerCase()
  const segments: AnalysisSegment[] = []
  const steps: string[] = []
  let needed = localizedQuestionExplanation(question, lang)
  let memory = localizedQuestionExplanation(question, lang)

  const addDefault = () => {
    if (before) segments.push({ text:before, label:L(lang,'before the blank','ส่วนก่อนช่องว่าง'), tone:'modifier' })
    segments.push({ text:'_____', label:L(lang,'missing part','สิ่งที่ขาด'), tone:'blank' })
    if (after) segments.push({ text:after, label:L(lang,'after the blank','ส่วนหลังช่องว่าง'), tone:'object' })
  }

  if (rule === 'connector.clause-vs-phrase') {
    const afterPieces = after.split(',').map(value => value.trim()).filter(Boolean)
    const first = afterPieces[0] ?? ''
    const second = afterPieces.slice(1).join(', ')
    const firstClause = simpleClauseParts(first)
    const secondClause = simpleClauseParts(second)
    const followingIsClause = Boolean(firstClause)

    if (before) {
      const beforeClause = simpleClauseParts(before)
      if (beforeClause) {
        segments.push({ text:beforeClause.subject, label:L(lang,'subject','ประธาน'), tone:'subject' })
        segments.push({ text:beforeClause.predicate, label:L(lang,'verb/predicate','กริยา/ภาคแสดง'), tone:'verb' })
      } else {
        segments.push({ text:before, label:L(lang,'main clause','ประโยคหลัก'), tone:'modifier' })
      }
    }

    segments.push({
      text:'_____',
      label:followingIsClause
        ? L(lang,'needs conjunction','ต้องเป็น conjunction')
        : L(lang,'needs preposition/phrase connector','ต้องเป็น preposition/phrase connector'),
      tone:'blank',
    })

    if (firstClause) {
      segments.push({ text:firstClause.subject, label:L(lang,'subject','ประธาน'), tone:'subject' })
      segments.push({ text:firstClause.predicate, label:L(lang,'verb/predicate','กริยา/ภาคแสดง'), tone:'verb' })
    } else if (first) {
      segments.push({ text:first, label:L(lang,'noun phrase / V-ing phrase','noun phrase / V-ing'), tone:'object' })
    }

    if (secondClause) {
      segments.push({ text:secondClause.subject, label:L(lang,'main-clause subject','ประธานประโยคหลัก'), tone:'subject' })
      segments.push({ text:secondClause.predicate, label:L(lang,'main-clause verb/predicate','กริยา/ภาคแสดงของประโยคหลัก'), tone:'verb' })
    } else if (second) {
      segments.push({ text:second, label:L(lang,'main clause','ประโยคหลัก'), tone:'modifier' })
    }

    needed = followingIsClause
      ? L(lang, 'a conjunction that can be followed by a full clause (S + V)', 'conjunction ที่ตามด้วยประโยคเต็ม (S + V)')
      : L(lang, 'a preposition/phrase connector followed by a noun phrase or V-ing', 'preposition/phrase connector ที่ตามด้วย noun phrase หรือ V-ing')

    memory = L(
      lang,
      'Although/Because/Unless + S + V · Despite/Because of/During + noun phrase (or V-ing where natural)',
      'จำคู่ให้เป็นสูตร: Although/Because/Unless + S + V · Despite/Because of/During + noun phrase (หรือ V-ing ที่ใช้ได้)',
    )

    steps.push(
      L(lang, 'Look immediately after the blank: is it a full clause (subject + verb) or a noun phrase?', 'มองหลังช่องว่างก่อนเลยว่าเป็น “ประโยคเต็ม S + V” หรือ “noun phrase”'),
      L(lang, 'Choose the connector family that matches that structure.', 'เลือกตระกูลคำเชื่อมให้ตรงโครงสร้าง'),
      L(lang, 'Only after that, check the logical meaning (contrast, reason, time, condition).', 'จากนั้นค่อยเช็กความหมายว่าเป็น ขัดแย้ง / เหตุผล / เวลา / เงื่อนไข'),
    )
  } else if (rule === 'comparison.patterns' || rule === 'comparison') {
    const aux = splitSubjectAux(before)
    if (aux) {
      segments.push({ text:aux.subject, label:L(lang,'true subject','ประธานแท้'), tone:'subject' })
      segments.push({ text:aux.aux, label:L(lang,'main/linking verb','กริยาหลัก/กริยาเชื่อม'), tone:'verb' })
      if (aux.middle) segments.push({ text:aux.middle, label:L(lang,'comparison signal','คำสัญญาณเปรียบเทียบ'), tone:'clue' })
    } else {
      segments.push({ text:before, label:L(lang,'comparison structure','โครงสร้างเปรียบเทียบ'), tone:'clue' })
    }
    segments.push({ text:'_____', label:L(lang,'comparison connector','คำเชื่อมที่ขาด'), tone:'blank' })
    if (after) segments.push({ text:after, label:L(lang,'comparison target','สิ่งที่นำมาเปรียบเทียบ'), tone:'object' })

    if (/twice\s+as|three times\s+as|half\s+as|as\s+\w+/i.test(before)) {
      needed = L(lang, 'the second “as” that closes the equality/multiplier pattern', 'คำว่า “as” ตัวที่สองเพื่อปิดโครงสร้างการเปรียบเทียบแบบเท่ากัน/หลายเท่า')
      memory = L(lang, 'Multiplier + as + adjective/adverb + as + comparison target', 'จำเป็นสูตร: จำนวนเท่า + as + adjective/adverb + as + สิ่งที่เปรียบเทียบ')
      steps.push(
        L(lang, 'Spot “twice as / as ...” before the blank.', 'เห็น “twice as / as ...” ก่อนช่องว่าง'),
        L(lang, 'This is not a normal comparative with “than”; it is the as ... as pattern.', 'นี่ไม่ใช่ comparative ปกติที่ใช้ than แต่เป็นโครงสร้าง as ... as'),
        L(lang, 'Close the pattern with “as”.', 'จึงต้องปิดโครงสร้างด้วย “as”'),
      )
    } else {
      needed = L(lang, 'the connector required by the comparison pattern', 'คำเชื่อมที่ตรงกับรูปแบบการเปรียบเทียบ')
      steps.push(
        L(lang, 'Find the comparison signal (more/-er, as...as, most, less).', 'หาคำสัญญาณเปรียบเทียบ เช่น more/-er, as...as, most, less'),
        L(lang, 'Match the connector to that pattern.', 'จับคู่ connector ให้ตรงสูตร'),
        L(lang, 'Then check meaning.', 'ค่อยตรวจความหมายอีกครั้ง'),
      )
    }
  } else if (rule === 'subject-verb' || question.skills.includes('subject-verb')) {
    const lower = before.toLowerCase()
    if (lower.includes(' neither ') || lower.startsWith('neither ') || lower.includes(' either ') || lower.startsWith('either ')) {
      const pieces = before.split(/\b(?:nor|or)\b/i)
      const left = pieces[0]?.trim()
      const near = pieces[1]?.trim()
      if (left) segments.push({ text:left, label:L(lang,'first subject','ประธานชุดแรก'), tone:'subject' })
      if (near) segments.push({ text:near, label:L(lang,'nearest subject controls agreement','ประธานที่อยู่ใกล้กริยาที่สุด'), tone:'clue' })
      segments.push({ text:'_____', label:L(lang,'finite verb','กริยาที่ต้องผัน'), tone:'blank' })
      if (after) segments.push({ text:after, label:L(lang,'complement','ส่วนเติมเต็ม'), tone:'object' })
      needed = L(lang, 'a verb that agrees with the nearer subject', 'กริยาที่สอดคล้องกับประธานที่อยู่ใกล้กริยามากที่สุด')
      memory = L(lang, 'With either...or / neither...nor, TOEIC normally makes the verb agree with the nearer subject.', 'either...or / neither...nor ให้กริยาสอดคล้องกับประธานตัวที่อยู่ใกล้กริยาที่สุด')
    } else {
      const ofIndex = lower.indexOf(' of ')
      const head = ofIndex >= 0 ? before.slice(0, ofIndex).trim() : before.trim()
      const modifier = ofIndex >= 0 ? before.slice(ofIndex).trim() : ''
      segments.push({ text:head, label:L(lang,'head subject','ประธานแท้ (head subject)'), tone:'subject' })
      if (modifier) segments.push({ text:modifier, label:L(lang,'modifier — ignore for agreement','ส่วนขยาย ไม่ใช้ตัดสินเอก/พหูพจน์'), tone:'modifier' })
      segments.push({ text:'_____', label:L(lang,'verb that must agree with the head subject','กริยาที่ต้องผันตามประธานแท้'), tone:'blank' })
      if (after) segments.push({ text:after, label:L(lang,'complement','ส่วนเติมเต็ม'), tone:'object' })
      const singular = /singular|“each”|head subject is “one”|head subject “the number”|head subject is singular|“a list”/i.test(question.explanation)
      needed = singular
        ? L(lang, 'a singular finite verb', 'กริยารูปเอกพจน์')
        : L(lang, 'the finite verb that agrees with the head subject', 'กริยาที่ตรงกับจำนวนของประธานแท้')
      memory = L(lang, 'Cross out “of + noun” mentally. The noun nearest the blank is often a TOEIC trap.', 'เวลาเจอ “of + noun” ให้ขีดทิ้งในใจ แล้วผันกริยาตาม head subject ไม่ใช่คำนามที่อยู่ใกล้ช่องว่าง')
    }
    steps.push(
      L(lang, 'Find the head subject.', 'หา head subject / ประธานแท้'),
      L(lang, 'Ignore prepositional phrases and distracting nouns.', 'ตัดวลีขยาย เช่น of + noun ออกจากการตัดสิน'),
      L(lang, 'Choose the verb form that agrees with that subject.', 'เลือกกริยาเอกพจน์/พหูพจน์ให้ตรงประธานแท้'),
    )
  } else if (rule === 'vocab.business-collocation' || rule === 'vocabulary' || rule === 'collocation' || question.skills.includes('collocation')) {
    const aux = splitSubjectAux(before)
    if (aux) {
      segments.push({ text:aux.subject, label:L(lang,'subject','ประธาน'), tone:'subject' })
      segments.push({ text:aux.aux, label:L(lang,'modal/auxiliary','modal / กริยาช่วย'), tone:'verb' })
      if (aux.middle) segments.push({ text:aux.middle, label:L(lang,'context','บริบท'), tone:'modifier' })
    } else if (before) {
      segments.push({ text:before, label:L(lang,'context before the verb','บริบทก่อนกริยา'), tone:'subject' })
    }
    segments.push({ text:'_____', label:L(lang,'base verb + correct collocation','V1 ที่ต้องจับคู่กับกรรมให้เป็นธรรมชาติ'), tone:'blank' })
    if (after) segments.push({ text:after, label:L(lang,'object / collocation partner','กรรม / คำที่ต้องจับคู่กับกริยา'), tone:'object' })
    needed = L(lang, 'a grammatically valid base verb whose meaning forms the natural business collocation', 'กริยา V1 ที่ถูกทั้งไวยากรณ์และจับคู่กับคำนามด้านหลังได้เป็น collocation ธรรมชาติ')
    memory = L(lang, 'If all choices are the same word class, grammar cannot decide the answer. Switch to meaning + collocation.', 'ถ้าตัวเลือกเป็นชนิดคำเดียวกันหมด ไวยากรณ์ตัดไม่ได้ ต้องเปลี่ยนไปดู “ความหมาย + collocation”')
    steps.push(
      L(lang, 'Use the modal/verb pattern to identify the required form (for example, will + V1).', 'ใช้โครงสร้างก่อน เช่น will + V1 เพื่อเช็กว่ารูปคำถูก'),
      L(lang, 'Notice that several choices may all be verbs.', 'สังเกตว่าหลายตัวเลือกอาจเป็น verb ถูกไวยากรณ์เหมือนกัน'),
      L(lang, 'Choose the verb that naturally goes with the object.', 'เลือก verb ที่ใช้คู่กับกรรมด้านหลังจริง ๆ'),
    )
  } else if (rule.startsWith('wordform.') || rule === 'part-of-speech' || question.skills.includes('part-of-speech')) {
    let form = explanation.includes('adverb') ? 'adverb'
      : explanation.includes('adjective') ? 'adjective'
        : explanation.includes('noun') ? 'noun'
          : explanation.includes('base verb') ? 'base verb'
            : 'required word class'
    const aux = splitSubjectAux(before)
    if (aux) {
      segments.push({ text:aux.subject, label:L(lang,'subject','ประธาน'), tone:'subject' })
      segments.push({ text:aux.aux, label:L(lang,'verb/auxiliary','กริยา/กริยาช่วย'), tone:'verb' })
      if (aux.middle) segments.push({ text:aux.middle, label:L(lang,'word being modified / signal','คำที่ถูกขยาย / จุดสังเกต'), tone:'clue' })
    } else if (before) {
      segments.push({ text:before, label:L(lang,'structure before the blank','โครงสร้างก่อนช่องว่าง'), tone:'clue' })
    }
    segments.push({ text:'_____', label:L(lang, `needs ${form}`, `ต้องเป็น ${form}`), tone:'blank' })
    if (after) segments.push({ text:after, label:L(lang,'word after the blank','คำหลังช่องว่าง'), tone:'object' })
    needed = lang === 'th' ? `คำชนิด ${form}` : form
    memory = form === 'adverb'
      ? L(lang, 'Adverbs commonly modify verbs/adjectives; many end in -ly. Ask “what does the blank modify?” before translating.', 'adverb ใช้ขยาย verb/adjective เป็นหลัก หลายคำลงท้าย -ly ให้ถามก่อนว่า “ช่องว่างกำลังขยายคำไหน” แล้วค่อยแปล')
      : form === 'adjective'
        ? L(lang, 'Adjectives describe nouns and often appear directly before a noun or after a linking verb.', 'adjective ใช้ขยาย noun มักอยู่หน้าคำนามหรือหลัง linking verb')
        : form === 'noun'
          ? L(lang, 'Nouns commonly follow articles/possessives and can serve as subjects or objects.', 'noun มักอยู่หลัง article/possessive และทำหน้าที่เป็นประธานหรือกรรม')
          : localizedQuestionExplanation(question, lang)
    steps.push(
      L(lang, 'Ignore meaning for a moment and locate the blank’s grammatical job.', 'พักเรื่องความหมายก่อน แล้วหาหน้าที่ไวยากรณ์ของช่องว่าง'),
      L(lang, `The sentence needs a ${form} here.`, `ตำแหน่งนี้ต้องการ ${form}`),
      L(lang, 'Eliminate choices with the wrong word class, then check meaning.', 'ตัดตัวเลือกที่ชนิดคำผิดก่อน แล้วค่อยเช็กความหมาย'),
    )
  } else if (rule === 'tense.present-perfect-since' || (question.skills.includes('verb-tense') && /since/i.test(question.stem))) {
    addDefault()
    needed = L(lang, 'present perfect: has/have + past participle (V3)', 'Present Perfect: has/have + V3')
    memory = L(lang, 'since + starting point → present perfect when the time period continues to now', 'since + จุดเริ่มต้น → ใช้ Present Perfect เมื่อช่วงเวลายังเชื่อมถึงปัจจุบัน')
    steps.push(
      L(lang, 'Find the signal “since”.', 'หาคำสัญญาณ “since”'),
      L(lang, 'Check that the period continues to the present.', 'เช็กว่าช่วงเวลายังเชื่อมกับปัจจุบัน'),
      L(lang, 'Use has/have + V3.', 'ใช้ has/have + V3'),
    )
  } else if (rule === 'passive.core' || question.skills.includes('passive')) {
    addDefault()
    needed = L(lang, 'the correct tense of BE + past participle (V3)', 'BE ที่ผันตาม tense + V3')
    memory = L(lang, 'If the subject receives the action, build the verb as BE + V3.', 'ถ้าประธานเป็นผู้ถูกกระทำ ให้สร้างกริยาเป็น BE + V3')
    steps.push(
      L(lang, 'Identify the subject.', 'หา subject'),
      L(lang, 'Ask whether it performs or receives the action.', 'ถามว่าประธานทำเองหรือถูกกระทำ'),
      L(lang, 'If it receives the action, choose BE + V3 with the correct tense.', 'ถ้าถูกกระทำ ใช้ BE + V3 และผัน BE ให้ตรง tense'),
    )
  } else {
    addDefault()
    steps.push(
      L(lang, 'Identify the grammar pattern around the blank.', 'หาโครงสร้างไวยากรณ์รอบช่องว่าง'),
      L(lang, 'Use the strongest signal word or structure.', 'ใช้คำสัญญาณหรือโครงสร้างที่ชัดที่สุด'),
      L(lang, 'Then compare meaning and collocation.', 'ค่อยเทียบความหมายและ collocation'),
    )
  }

  return { needed, memory, steps, segments }
}

function explainChoice(question: Question, choiceId: string, analysis: QuestionAnalysis, lang: Language) {
  const choice = question.choices.find(c => c.id === choiceId)
  if (!choice) return ''
  const word = choice.text.toLowerCase()
  const correct = choice.id === question.answer
  const lex = choiceLexicon[word]
  const rule = question.ruleId ?? question.skills[0]
  const specific = question.whyOthers?.[choice.id]

  if (correct) {
    const base = localizedQuestionExplanation(question, lang)
    return lang === 'th'
      ? `✓ ถูก — ${lex ? lex.th + ' และ ' : ''}${base}`
      : `✓ Correct — ${lex ? lex.en + '. ' : ''}${question.explanation}`
  }

  if (specific && lang === 'en') return `✗ ${specific}`

  if (rule === 'connector.clause-vs-phrase') {
    const usage = connectorUsage[word]
    if (usage) {
      return lang === 'th'
        ? `✗ “${choice.text}” เป็น ${usage.type}: ${usage.th} · แต่โจทย์นี้ต้องการ ${analysis.needed}`
        : `✗ “${choice.text}” is a ${usage.type}: ${usage.pattern}. This blank needs ${analysis.needed}.`
    }
  }

  if (rule === 'comparison.patterns' || rule === 'comparison') {
    if (lex) return lang === 'th'
      ? `✗ ${lex.pos}: ${lex.th} จึงไม่ตรง pattern ที่โจทย์ต้องการ`
      : `✗ ${lex.pos}: ${lex.en}; it does not match this comparison pattern.`
  }

  if (rule.startsWith('wordform.') || rule === 'part-of-speech' || question.skills.includes('part-of-speech')) {
    const pos = inferWordClass(choice.text)
    return lang === 'th'
      ? `✗ “${choice.text}” เป็น ${pos} แต่ช่องนี้ต้องการ ${analysis.needed}`
      : `✗ “${choice.text}” is ${pos}, but this blank needs ${analysis.needed}.`
  }

  if (rule === 'subject-verb' || question.skills.includes('subject-verb')) {
    const pos = inferWordClass(choice.text)
    return lang === 'th'
      ? `✗ “${choice.text}” เป็น ${pos}; รูปกริยานี้ไม่สอดคล้องกับประธานแท้ที่วิเคราะห์ไว้ด้านบน`
      : `✗ “${choice.text}” is ${pos}; it does not agree with the head subject identified above.`
  }

  if (lex) return lang === 'th'
    ? `✗ ${lex.pos}: ${lex.th} แต่ความหมาย/คำที่ใช้คู่กันไม่เข้ากับประโยคนี้`
    : `✗ ${lex.pos}: ${lex.en}, but its meaning/collocation does not fit this sentence.`

  return lang === 'th'
    ? `✗ “${choice.text}” ไม่ตรงทั้งรูปแบบที่ต้องการ (${analysis.needed}) หรือความหมาย/collocation ของประโยคนี้`
    : `✗ “${choice.text}” does not satisfy the required pattern (${analysis.needed}) or the sentence’s meaning/collocation.`
}

type WordRoleTone = 'subject' | 'verb' | 'adjective' | 'adverb' | 'noun' | 'object' | 'connector' | 'answer' | 'other'

type GrammarWord = {
  text: string
  pos: string
  role: string
  tone: WordRoleTone
  answer?: boolean
  punctuation?: boolean
}

const grammarDeterminers = new Set(['a','an','the','this','that','these','those','each','every','either','neither','some','any','no','many','much','few','several','both','another'])
const grammarPossessives = new Set(['my','your','his','her','its','our','their','whose'])
const grammarPronouns = new Set(['i','you','he','she','it','we','they','me','him','her','us','them','who','whom','which','what'])
const grammarModals = new Set(['can','could','may','might','must','shall','should','will','would'])
const grammarBe = new Set(['am','is','are','was','were','be','been','being'])
const grammarHave = new Set(['have','has','had'])
const grammarDo = new Set(['do','does','did'])
const grammarConjunctions = new Set(['and','but','or','nor','although','though','because','if','unless','while','whereas','when','whenever','before','after','since','once','whether','so','yet'])
const grammarPrepositions = new Set(['in','on','at','by','for','from','with','without','of','to','into','onto','over','under','between','among','through','throughout','during','despite','beside','near','within','across','about','against','around','behind','beyond','until','upon'])
const grammarAdverbs = new Set(['not','very','too','so','quite','rather','almost','nearly','only','also','already','still','just','even','more','most','less','least','well','soon','now','then','today','tomorrow','yesterday','here','there','approximately','especially','generally','normally','usually','often','always','never','immediately','currently','recently','finally','carefully','quickly','slowly','properly','efficiently','successfully'])
const grammarAdjectives = new Set(['new','previous','current','final','available','important','necessary','additional','large','small','high','low','effective','efficient','reliable','expensive','helpful','required','interested','interesting','experienced','senior','major','public','private','original','corrected','revised','shared','technical','medical','regional','monthly','daily','annual','local','international','full','free','late','early','open','closed','ready'])
const grammarVerbLexicon = new Set(['respond','responded','submit','submitted','complete','completed','conduct','construct','contain','contact','develop','raise','open','improve','interact','rise','rises','benefit','benefits','attend','hold','held','stop','use','return','returned','need','collect','summarize','identify','identified','schedule','scheduled','send','sent','arrive','receive','received','increase','hire','begin','began','finish','finished','offer','offered','reserve','reserved','prepare','print','install','installed','move','moved','require','requires','work','works','plan','plans','agree','agreed','replace','report','launch','streamline','process','processes','inspect','inspected','explain','explained','operate','operated','provide','provided','include','included','sign','signed','meet','met','review','reviewed','release','released'])

function activeContextForBlank(body: string, stem: string) {
  const blank = stem.match(/\[(\d+)\]/)?.[1]
  if (!blank) return stem
  const marker = `[${blank}]`
  const lines = body.split('\n').map(line => line.trim()).filter(Boolean)
  const index = lines.findIndex(line => line.includes(marker))
  if (index < 0) return stem
  const line = lines[index]
  if (!/^\[\d+\]\s*_____\s*$/.test(line)) return line
  return [lines[index - 1], line, lines[index + 1]].filter(Boolean).join(' ')
}

function correctSentenceForMap(question: Question, contextText?: string) {
  const answerText = question.choices.find(choice => choice.id === question.answer)?.text ?? ''
  const source = contextText ?? question.stem
  if (!source.includes('_____')) return source
  return source
    .replace(/\[\d+\]\s*_____/, '@@ANSWER@@')
    .replace(/_____/, '@@ANSWER@@')
    .replace('@@ANSWER@@', answerText)
}

function tokenizeGrammar(text: string) {
  return text.match(/[A-Za-z]+(?:['’][A-Za-z]+)?|\d+(?:[.,:]\d+)?|[–—-]|[^\sA-Za-z0-9]/g) ?? []
}

function basePos(word: string, previous = '', next = '') {
  const w = word.toLowerCase().replace(/[’]/g, "'")
  const p = previous.toLowerCase()
  const n = next.toLowerCase()

  if (/^[,.;:!?()[\]]$/.test(word)) return 'Punct.'
  if (/^\d/.test(word)) return 'Number'
  if (grammarDeterminers.has(w)) return 'Det.'
  if (grammarPossessives.has(w)) return 'Poss. Det.'
  if (grammarPronouns.has(w)) return 'Pron.'
  if (grammarModals.has(w)) return 'Modal'
  if (grammarBe.has(w)) return 'V. be'
  if (grammarHave.has(w) || grammarDo.has(w)) return 'Aux./V.'
  if (grammarConjunctions.has(w)) return 'Conj.'
  if (grammarPrepositions.has(w)) return w === 'to' && (grammarModals.has(p) || p === '') ? 'to' : 'Prep.'
  if (/['’]s$/.test(word)) return 'Poss. N.'
  if (grammarAdverbs.has(w) || /ly$/.test(w)) return 'Adv.'
  if (grammarAdjectives.has(w) || /(ous|ful|less|ive|able|ible|al|ic|ary|ory)$/.test(w)) return 'Adj.'
  if (grammarVerbLexicon.has(w) || /(ed|ing|ize|ise|ify)$/.test(w)) return 'V.'
  if (grammarModals.has(p) || (p === 'to' && !['look','forward','used','object'].includes(previous.toLowerCase()))) return 'V1'
  if (grammarHave.has(p)) return 'V3'
  if (grammarBe.has(p) && /ing$/.test(w)) return 'V-ing'
  if (grammarBe.has(p) && /(ed|en)$/.test(w)) return 'V3/Adj.'
  if (grammarDeterminers.has(p) && n && !grammarBe.has(n) && !grammarVerbLexicon.has(n) && !/[,.!?]/.test(next)) return 'Adj.'
  if (/(tion|sion|ment|ness|ity|ance|ence|ship|ism|ure|er|or)$/.test(w)) return 'N.'
  return 'N.'
}

function isFiniteVerbPos(pos: string, word: string) {
  const w = word.toLowerCase()
  return pos === 'Modal' || pos === 'V. be' || pos === 'Aux./V.' || (pos.startsWith('V') && !['to'].includes(w))
}

function labelWords(question: Question, contextText: string | undefined, lang: Language): GrammarWord[] {
  const sentence = correctSentenceForMap(question, contextText)
  const raw = tokenizeGrammar(sentence)
  const words: GrammarWord[] = raw.map((text, index) => {
    const previous = raw[index - 1] ?? ''
    const next = raw[index + 1] ?? ''
    const pos = basePos(text, previous, next)
    const punctuation = pos === 'Punct.'
    const tone: WordRoleTone = punctuation
      ? 'other'
      : pos.startsWith('V') || pos === 'Modal' || pos === 'Aux./V.'
        ? 'verb'
        : pos === 'Adj.'
          ? 'adjective'
          : pos === 'Adv.'
            ? 'adverb'
            : pos.includes('N.')
              ? 'noun'
              : pos === 'Conj.' || pos === 'Prep.'
                ? 'connector'
                : 'other'
    return { text, pos, role: '', tone, punctuation }
  })

  const answerText = question.choices.find(choice => choice.id === question.answer)?.text ?? ''
  let answerMarked = false
  for (const token of words) {
    if (!answerMarked && token.text.toLowerCase() === answerText.toLowerCase()) {
      token.answer = true
      token.tone = 'answer'
      answerMarked = true
    }
  }

  // Preposition objects.
  for (let i = 0; i < words.length; i += 1) {
    if (words[i].pos !== 'Prep.') continue
    for (let j = i + 1; j < words.length; j += 1) {
      if (words[j].punctuation || words[j].pos === 'Conj.' || isFiniteVerbPos(words[j].pos, words[j].text)) break
      if (words[j].pos.includes('N.') || words[j].pos === 'Pron.') {
        words[j].role = L(lang, 'object of preposition', 'กรรมของ preposition')
        words[j].tone = 'object'
        break
      }
    }
  }

  // Find subject and predicate for each clause-like span.
  const boundaries = [-1]
  words.forEach((token, index) => {
    if ([',',';','.','?','!'].includes(token.text)) boundaries.push(index)
  })
  boundaries.push(words.length)

  for (let b = 0; b < boundaries.length - 1; b += 1) {
    const start = boundaries[b] + 1
    const end = boundaries[b + 1]
    if (start >= end) continue
    let finite = -1
    for (let i = start; i < end; i += 1) {
      if (isFiniteVerbPos(words[i].pos, words[i].text)) { finite = i; break }
    }
    if (finite < 0) continue

    // If clause begins with a subordinating conjunction, skip it.
    let subjectStart = start
    if (words[subjectStart]?.pos === 'Conj.') subjectStart += 1

    let subjectHead = -1
    let prepDepth = false
    for (let i = subjectStart; i < finite; i += 1) {
      if (words[i].pos === 'Prep.') { prepDepth = true; continue }
      if (prepDepth && (words[i].punctuation || words[i].pos === 'Conj.')) prepDepth = false
      if (!prepDepth && (words[i].pos.includes('N.') || words[i].pos === 'Pron.')) subjectHead = i
    }
    if (subjectHead >= 0) {
      words[subjectHead].role = L(lang, 'SUBJECT head', 'ประธานแท้')
      words[subjectHead].tone = 'subject'
      for (let i = subjectStart; i < subjectHead; i += 1) {
        if (words[i].punctuation || words[i].pos === 'Prep.') continue
        if (words[i].pos === 'Det.' || words[i].pos === 'Poss. Det.') {
          words[i].role = L(lang, 'subject determiner', 'ตัวกำหนดของประธาน')
          words[i].tone = 'subject'
        } else if (words[i].pos === 'Adj.' || words[i].pos.includes('N.')) {
          words[i].role = L(lang, 'subject modifier', 'คำขยายประธาน')
          words[i].tone = 'subject'
        }
      }
    }

    words[finite].role = grammarBe.has(words[finite].text.toLowerCase())
      ? L(lang, 'linking/auxiliary verb', 'กริยาเชื่อม/กริยาช่วย')
      : words[finite].pos === 'Modal'
        ? L(lang, 'modal auxiliary', 'modal verb')
        : L(lang, 'finite verb', 'กริยาหลักที่ผันแล้ว')
    words[finite].tone = 'verb'

    // Main verb after modal/auxiliary.
    for (let i = finite + 1; i < Math.min(end, finite + 4); i += 1) {
      if (words[i].pos.startsWith('V') && words[i].pos !== 'V. be') {
        words[i].role = L(lang, 'main verb', 'กริยาหลัก')
        words[i].tone = 'verb'
        break
      }
    }

    const linking = grammarBe.has(words[finite].text.toLowerCase()) || ['seem','seems','become','became','remain','remains','appear','appears'].includes(words[finite].text.toLowerCase())
    let objectHead = -1
    for (let i = finite + 1; i < end; i += 1) {
      if (words[i].pos === 'Prep.') continue
      if (words[i].role === L(lang, 'object of preposition', 'กรรมของ preposition')) continue
      if (words[i].pos.includes('N.') || words[i].pos === 'Pron.') {
        objectHead = i
        break
      }
      if (linking && words[i].pos === 'Adj.') {
        words[i].role = L(lang, 'subject complement', 'ส่วนเติมเต็มประธาน')
        words[i].tone = 'adjective'
      }
    }
    if (objectHead >= 0 && !linking) {
      words[objectHead].role = L(lang, 'OBJECT head', 'กรรมหลัก')
      words[objectHead].tone = 'object'
      for (let i = Math.max(finite + 1, objectHead - 3); i < objectHead; i += 1) {
        if (words[i].pos === 'Det.' || words[i].pos === 'Poss. Det.') {
          words[i].role = L(lang, 'object determiner', 'ตัวกำหนดของกรรม')
          words[i].tone = 'object'
        } else if (words[i].pos === 'Adj.' || words[i].pos === 'Poss. N.') {
          words[i].role = L(lang, 'object modifier', 'คำขยายกรรม')
          words[i].tone = 'object'
        }
      }
    }
  }

  // Rule-specific precision.
  if (question.ruleId === 'comparison.patterns' || question.skills.includes('comparison')) {
    const markers = words.map((w, i) => ['as','than'].includes(w.text.toLowerCase()) ? i : -1).filter(i => i >= 0)
    markers.forEach(i => {
      words[i].pos = 'Comparison'
      words[i].role = words[i].answer ? L(lang, 'required comparison marker', 'คำเชื่อมเปรียบเทียบที่ต้องเติม') : L(lang, 'comparison marker', 'คำสัญญาณเปรียบเทียบ')
      words[i].tone = words[i].answer ? 'answer' : 'connector'
    })
    const lastMarker = markers[markers.length - 1]
    if (lastMarker !== undefined) {
      let head = -1
      for (let i = lastMarker + 1; i < words.length; i += 1) if (words[i].pos.includes('N.')) head = i
      if (head >= 0) {
        words[head].role = L(lang, 'comparison target head', 'คำนามหลักที่นำมาเปรียบเทียบ')
        words[head].tone = 'object'
      }
    }
    words.forEach(token => {
      if (token.text.toLowerCase() === 'twice') { token.pos = 'Adv.'; token.role = L(lang,'multiplier','จำนวนเท่า'); token.tone = 'adverb' }
      if (token.text.toLowerCase() === 'nearly') { token.pos = 'Adv.'; token.role = L(lang,'degree modifier','คำขยายระดับ'); token.tone = 'adverb' }
    })
  }

  // Make the filled correct answer unmistakable.
  for (const token of words) {
    if (!token.answer) continue
    const inferred = inferWordClass(token.text)
    if (question.ruleId?.startsWith('wordform.') || question.ruleId?.includes('word-form') || question.skills.includes('part-of-speech')) {
      token.pos = inferred
    }
    token.role = token.role
      ? `${token.role} · ${L(lang,'CORRECT ANSWER','คำตอบที่ถูก')}`
      : L(lang, 'CORRECT ANSWER', 'คำตอบที่ถูก')
    token.tone = 'answer'
  }

  return words
}

function spottingRules(question: Question, contextText: string | undefined, lang: Language) {
  const text = contextText ?? question.stem
  const tips: string[] = []
  const add = (en: string, th: string) => {
    const value = L(lang, en, th)
    if (!tips.includes(value)) tips.push(value)
  }

  if (/\b(should|can|could|will|would|may|might|must)\s+(?:\[\d+\]\s*)?_{3,}/i.test(text)) {
    add('modal + V1: should/can/will/must + base verb', 'เห็น should/can/will/must หน้า blank → หลัง modal ต้องเป็น V1')
  }
  if (/\b(has|have|had)\s+(?:\[\d+\]\s*)?_{3,}/i.test(text)) {
    add('has/have/had + V3', 'เห็น has/have/had หน้า blank → มองหา V3')
  }
  if (/\b(am|is|are|was|were|be|been)\s+(?:\[\d+\]\s*)?_{3,}/i.test(text)) {
    add('After BE: adjective for a state, V-ing for an ongoing action, V3 for passive/result.', 'หลัง BE ต้องแยกความหมาย: บอกสภาพ → Adj.; กำลังทำ → V-ing; ถูกกระทำ → V3')
  }
  if (/\b(a|an|the|this|that|these|those|my|your|his|her|its|our|their)\s+(?:\[\d+\]\s*)?_{3,}\s+[A-Za-z]/i.test(text)) {
    add('determiner + ___ + noun → usually adjective', 'เห็น a/the/this/their + blank + N. → blank มักเป็น Adj. เพื่อขยาย N.')
  }
  if (/\b(by|for|of|in|on|at|with|without|during|despite)\s+(?:\[\d+\]\s*)?_{3,}/i.test(text)) {
    add('preposition + N./pronoun/V-ing', 'หลัง preposition → N. / pronoun / V-ing ไม่ใช่ V1 ลอย ๆ')
  }
  if (question.ruleId === 'connector.clause-vs-phrase') {
    add('S + V after the blank → conjunction; noun/V-ing → preposition phrase.', 'หลัง blank เป็น S + V → ใช้ conjunction; ถ้าเป็น N./V-ing → ใช้ preposition phrase')
  }
  if (question.ruleId === 'comparison.patterns' || question.skills.includes('comparison')) {
    add('comparative + than; as + adj/adv + as; twice/three times + as + adj/adv + as', 'จำ pattern: comparative + than; as + adj/adv + as; twice/three times + as + adj/adv + as')
  }
  if (question.skills.includes('part-of-speech')) {
    add('Suffix is a clue, not the final answer: -tion/-ment/-ness/-ity → often N.; -ive/-al/-ous/-ful → often Adj.; -ly → often Adv.', 'ดูท้ายคำช่วยตัดชนิดคำ: -tion/-ment/-ness/-ity มัก N.; -ive/-al/-ous/-ful มัก Adj.; -ly มัก Adv. แต่ต้องเช็กหน้าที่ในประโยคด้วย')
  }
  if (question.skills.includes('collocation') || question.skills.includes('vocabulary')) {
    add('If every choice is the same word class, grammar cannot finish the question—use meaning + collocation.', 'ถ้าตัวเลือกเป็นชนิดคำเดียวกันหมด Grammar ตัดไม่จบ ต้องดูความหมาย + collocation')
  }
  return tips.slice(0, 4)
}

function WordLevelGrammarMap({
  question,
  selected,
  contextText,
}: {
  question: Question
  selected: string
  contextText?: string
}) {
  const lang = useLanguage()
  const words = labelWords(question, contextText, lang)
  const tips = spottingRules(question, contextText, lang)
  const correct = selected === question.answer
  const answerText = question.choices.find(choice => choice.id === question.answer)?.text ?? ''
  const selectedText = question.choices.find(choice => choice.id === selected)?.text ?? ''

  return (
    <section className={correct ? 'word-grammar-map correct' : 'word-grammar-map wrong'}>
      <div className="word-map-head">
        <b>{L(lang, 'Word-by-word grammar map', 'วงและแยกหน้าที่ทุกคำ')}</b>
        <span>{correct ? L(lang,'correct answer','ตอบถูก') : L(lang,'corrected sentence','ประโยคที่แก้ถูกแล้ว')}</span>
      </div>
      <div className="word-map-sentence">
        {words.map((word, index) => word.punctuation
          ? <span className="grammar-punctuation" key={`${word.text}-${index}`}>{word.text}</span>
          : (
            <span className={`grammar-word ${word.tone}${word.answer ? ' answer' : ''}`} key={`${word.text}-${index}`}>
              <b>{word.text}</b>
              <em>{word.pos}</em>
              {word.role && <small>{word.role}</small>}
            </span>
          ))}
      </div>
      {!correct && (
        <p className="word-map-mistake">
          <strong>{L(lang,'You chose','คุณเลือก')}:</strong> {selectedText}
          <span>→</span>
          <strong>{L(lang,'should be','ควรเป็น')}:</strong> {answerText}
        </p>
      )}
      {tips.length > 0 && (
        <div className="spotting-rule-box">
          <strong>{L(lang,'How to spot it next time','ครั้งหน้าดูจากตรงไหน')}</strong>
          {tips.map(tip => <span key={tip}>• {tip}</span>)}
        </div>
      )}
    </section>
  )
}

function inspectionText(question: Question, choiceId: string, lang: Language) {
  const choice = question.choices.find(item => item.id === choiceId)
  if (!choice) return ''
  if (choiceId === question.answer) return localizedQuestionExplanation(question, lang)
  if (lang === 'en' && question.whyOthers?.[choiceId]) return question.whyOthers[choiceId]
  if (question.skills.includes('part-of-speech')) {
    return lang === 'th'
      ? `“${choice.text}” เป็น ${inferWordClass(choice.text)} แต่ต้องเช็กกับตำแหน่งที่ไฮไลต์ใน Grammar map ว่าช่องนี้ต้องทำหน้าที่อะไร`
      : `“${choice.text}” is ${inferWordClass(choice.text)}; compare that with the highlighted blank's required role.`
  }
  return fallbackWrongExplanation(question, lang)
}

function ChoiceInspection({ question, choiceId }: { question: Question; choiceId: string }) {
  const lang = useLanguage()
  const correct = choiceId === question.answer
  return (
    <div className={correct ? 'choice-inspection correct' : 'choice-inspection wrong'}>
      <b>{correct ? L(lang,'Why this choice works','ทำไมตัวนี้ถูก') : L(lang,'Why this choice fails','ทำไมตัวนี้ผิด')}</b>
      <p>{inspectionText(question, choiceId, lang)}</p>
      {question.part === 7 && question.evidence && correct && (
        <small><strong>{L(lang,'Evidence','หลักฐาน')}:</strong> “{question.evidence}”</small>
      )}
    </div>
  )
}

function compactMistakeInsight(question: Question, selected: string, analysis: QuestionAnalysis, lang: Language) {
  const selectedText = question.choices.find(c => c.id === selected)?.text ?? selected
  const answerText = question.choices.find(c => c.id === question.answer)?.text ?? question.answer
  const rule = question.ruleId ?? question.skills[0]

  if (rule === 'connector.clause-vs-phrase') {
    const wrong = connectorUsage[selectedText.toLowerCase()]
    const right = connectorUsage[answerText.toLowerCase()]
    if (wrong && right) {
      const sameMeaning = wrong.relation === right.relation
      return lang === 'th'
        ? `คุณเลือก “${selectedText}” เพราะ${sameMeaning ? `ความหมายใกล้กับ “${answerText}” (${relationLabel(right.relation, lang)}) ซึ่งคิดด้านความหมายถูก` : `ตีความความสัมพันธ์เป็น ${relationLabel(wrong.relation, lang)}`} แต่พลาด “รูปหลังคำเชื่อม”: ${wrong.pattern} ขณะที่โจทย์นี้ต้อง ${right.pattern} จึงตอบ ${answerText}`
        : `You chose “${selectedText}” because ${sameMeaning ? `its meaning is close to “${answerText}” (${right.relation}), so your meaning was reasonable` : `you read the relation as ${wrong.relation}`}, but the grammar pattern is wrong: ${wrong.pattern}; this sentence needs ${right.pattern}.`
    }
  }

  if (rule === 'comparison.patterns' || rule === 'comparison') {
    return lang === 'th'
      ? `คุณเลือก “${selectedText}” เพราะมองว่าเป็นการเปรียบเทียบ แต่พลาด pattern หลักของโจทย์: ${analysis.memory} จึงต้องใช้ “${answerText}”`
      : `You recognized a comparison, but missed the exact pattern: ${analysis.memory}. Therefore the answer is “${answerText}”.`
  }

  if (rule.startsWith('wordform.') || rule === 'part-of-speech' || question.skills.includes('part-of-speech')) {
    return lang === 'th'
      ? `คุณเลือก “${selectedText}” (${inferWordClass(selectedText)}) แต่ช่องนี้ต้องการ ${analysis.needed} — ให้ดู “หน้าที่ของช่องว่าง” ก่อนแปลความหมาย`
      : `You chose “${selectedText}” (${inferWordClass(selectedText)}), but the blank needs ${analysis.needed}. Identify the blank's job before translating.`
  }

  if (rule === 'subject-verb' || question.skills.includes('subject-verb')) {
    return lang === 'th'
      ? `คุณน่าจะตามคำนามที่อยู่ใกล้ช่องว่างมากเกินไป ให้ย้อนหา head subject ที่ไฮไลต์ด้านบน แล้วผันกริยาตามประธานแท้ จึงได้ “${answerText}”`
      : `You likely followed the noun nearest the blank. Use the highlighted head subject instead; that gives “${answerText}”.`
  }

  if (rule === 'vocab.business-collocation' || question.skills.includes('collocation')) {
    return lang === 'th'
      ? `รูปคำอาจถูกไวยากรณ์เหมือนกันหลายข้อ แต่ “${selectedText}” ไม่จับคู่กับคำรอบข้างแบบธรรมชาติ ข้อนี้ต้องดู collocation จึงเป็น “${answerText}”`
      : `Several choices may be grammatically possible, but “${selectedText}” is not the natural collocation here. The correct collocation uses “${answerText}”.`
  }

  return lang === 'th'
    ? `คุณเลือก “${selectedText}” แต่โจทย์ต้องการ ${analysis.needed} จึงต้องเป็น “${answerText}”`
    : `You chose “${selectedText}”, but the blank needs ${analysis.needed}; therefore choose “${answerText}”.`
}

function CompactMistakeCoach({
  question,
  selected,
  contextText,
}: {
  question: Question
  selected: string
  contextText?: string
}) {
  const lang = useLanguage()
  const analysis = buildQuestionAnalysis(question, lang)
  return (
    <div className="compact-mistake-coach" aria-live="polite">
      <WordLevelGrammarMap question={question} selected={selected} contextText={contextText} />
      <div className="compact-mistake-lines">
        <p><strong>{L(lang, 'Blank needs:', 'ช่องว่างต้องเป็น:')}</strong> {analysis.needed}</p>
        <p className="mistake-why"><strong>{L(lang, 'Your mistake:', 'จุดที่เข้าใจผิด:')}</strong> {compactMistakeInsight(question, selected, analysis, lang)}</p>
        <p className="mini-memory"><strong>{L(lang, 'Remember:', 'จำสั้น ๆ:')}</strong> {analysis.memory}</p>
      </div>
    </div>
  )
}

function selectedChoiceExplanation(question: Question, selected: string, lang: Language) {
  const selectedText = question.choices.find(c => c.id === selected)?.text ?? ''
  const answerText = question.choices.find(c => c.id === question.answer)?.text ?? ''
  const correct = selected === question.answer
  if (correct) {
    return lang === 'th'
      ? `ถูก — ${localizedQuestionExplanation(question, lang)}`
      : `Correct. ${question.explanation}`
  }
  return lang === 'th'
    ? `คุณเลือก ${selected}. ${selectedText} แต่คำตอบคือ ${question.answer}. ${answerText}`
    : `You chose ${selected}. ${selectedText}; the correct answer is ${question.answer}. ${answerText}.`
}

function lineKey(row: string[], index: number) {
  return `${index}-${row.join('-')}`
}

function PassageVisual({ passage }: { passage: Passage }) {
  if (!passage.visual || !passage.visualData?.length) return null
  const rows = passage.visualData.map(line => line.split('|').map(part => part.trim()))

  if (passage.visual === 'floor-plan') {
    return (
      <div className="passage-visual visual-floor-plan">
        <strong>{passage.visualTitle}</strong>
        <div className="floor-grid">
          {rows.map((row, index) => (
            <div className={index === 2 ? 'floor-unit occupied' : 'floor-unit'} key={lineKey(row, index)}>
              <b>{row[0]}</b><span>{row[1]}</span><small>{row[2]}</small>
            </div>
          ))}
          <div className="floor-courtyard">COURTYARD</div>
        </div>
      </div>
    )
  }

  if (passage.visual === 'chart') {
    return (
      <div className="passage-visual visual-chart">
        <strong>{passage.visualTitle}</strong>
        {rows.map((row, index) => {
          const value = Math.max(0, Math.min(100, Number.parseInt(row[1] ?? '0', 10) || 0))
          return (
            <div className="chart-row" key={lineKey(row, index)}>
              <span>{row[0]}</span><div><i style={{ width: `${value}%` }} /></div><b>{value}%</b>
            </div>
          )
        })}
      </div>
    )
  }

  if (passage.visual === 'route') {
    return (
      <div className="passage-visual visual-route">
        <strong>{passage.visualTitle}</strong>
        <div className="route-line">
          {rows.map((row, index) => (
            <div className="route-stop" key={lineKey(row, index)}>
              <span>{index + 1}</span><b>{row[0]}</b><small>{row[1]}</small>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (passage.visual === 'poster') {
    return (
      <div className="passage-visual visual-poster">
        <strong>{passage.visualTitle}</strong>
        {rows.map((row, index) => <div className="poster-line" key={lineKey(row, index)}><b>{row[0]}</b><span>{row.slice(1).join(' · ')}</span></div>)}
      </div>
    )
  }

  return (
    <div className={`passage-visual visual-table visual-${passage.visual}`}>
      <strong>{passage.visualTitle}</strong>
      <div className="visual-table-body">
        {rows.map((row, index) => (
          <div className="visual-table-row" key={lineKey(row, index)}>
            {row.map((cell, cellIndex) => <span key={cellIndex}>{cell}</span>)}
          </div>
        ))}
      </div>
    </div>
  )
}

function PassageText({ passage }: { passage: Passage }) {
  const lines = passage.body.split('\n')
  const emailHeaders = passage.kind === 'email'
    ? lines.filter(line => /^(From|To|Subject|Date):/i.test(line)).slice(0, 4)
    : []
  const body = emailHeaders.length
    ? lines.filter(line => !emailHeaders.includes(line)).join('\n').trim()
    : passage.body

  if (emailHeaders.length) {
    return (
      <>
        <div className="email-meta">
          {emailHeaders.map(line => {
            const [label, ...rest] = line.split(':')
            return <div key={line}><b>{label}</b><span>{rest.join(':').trim()}</span></div>
          })}
        </div>
        <div className="passage-copy">{body}</div>
      </>
    )
  }

  if (passage.kind === 'multi') {
    return (
      <div className="multi-document">
        {passage.body.split(/\n\n+/).map((block, index) => (
          <div className="multi-doc-section" key={index}>{block}</div>
        ))}
      </div>
    )
  }

  return <div className="passage-copy">{passage.body}</div>
}

function PassageDocument({
  passage,
  part,
  question,
  selected,
  checked,
  onBlankClick,
}: {
  passage: Passage
  part: Part
  question: Question
  selected: string
  checked: boolean
  onBlankClick?: () => void
}) {
  const lang = useLanguage()
  const selectedText = question.choices.find(choice => choice.id === selected)?.text
  return (
    <article className={`reading-passage doc-${passage.kind}`}>
      <div className="passage-heading">
        <span className="doc-type">{passage.kind.toUpperCase()}</span>
        <span className="passage-instruction">{part === 6
          ? L(lang, 'Tap the highlighted blank to answer.', 'แตะช่องว่างที่ไฮไลต์เพื่อเลือกคำตอบ')
          : L(lang, 'Read the document and answer from the evidence.', 'อ่านเอกสารและตอบจากหลักฐานในบทความ')}</span>
      </div>
      <h2>{passage.title}</h2>
      {part === 7 && <PassageVisual passage={passage} />}
      {part === 6
        ? <div className="passage-copy">{passageWithActiveBlank(passage.body, question.stem, {
            selectedText,
            checked,
            correct: selected === question.answer,
            onClick: onBlankClick,
          })}</div>
        : <PassageText passage={passage} />}
      {passage.sourceLabel && <small className="passage-source-label">{passage.sourceLabel}</small>}
    </article>
  )
}


function App() {
  const [view, setView] = useState<View>('home')
  const [state, setState] = useState<TrainerState>(() => loadLocalState())
  const [hydrated, setHydrated] = useState(false)
  const [connected, setConnected] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState(false)
  const [remoteQuestions, setRemoteQuestions] = useState<Question[]>([])
  const [remotePassages, setRemotePassages] = useState<Passage[]>([])
  const [lessonSkill, setLessonSkill] = useState<SkillId | null>(null)
  const [quickPart5, setQuickPart5] = useState(false)
  const [lang, setLang] = useState<Language>(() => localStorage.getItem(LANG_STORAGE_KEY) === 'en' ? 'en' : 'th')

  const allPart5 = useMemo(
    () => [...part5, ...remoteQuestions.filter(q => q.part === 5)],
    [remoteQuestions],
  )
  const allPart6 = useMemo(
    () => [...part6, ...remoteQuestions.filter(q => q.part === 6)],
    [remoteQuestions],
  )
  const allPart7 = useMemo(
    () => [...part7, ...remoteQuestions.filter(q => q.part === 7)],
    [remoteQuestions],
  )
  const allPassageById = useMemo(
    () => ({ ...passageById, ...Object.fromEntries(remotePassages.map(p => [p.id, p])) }),
    [remotePassages],
  )

  useEffect(() => {
    const stopConnection = watchConnection(setConnected)
    const stopQuestions = watchPersonalizedQuestions(setRemoteQuestions)
    const stopPassages = watchPersonalizedPassages(setRemotePassages)

    loadCloudState()
      .then(cloud => setState(local => chooseFresher(normalizeState(local), cloud)))
      .catch(() => undefined)
      .finally(() => setHydrated(true))

    publishQuestionBankManifest({ part5: part5.length, part6: part6.length, part7: part7.length }).catch(() => undefined)
    return () => {
      stopConnection()
      stopQuestions()
      stopPassages()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const normalized = normalizeState(state)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    if (!hydrated) return

    setSyncing(true)
    const timer = window.setTimeout(() => {
      syncCloudState(normalized)
        .then(() => setSyncError(false))
        .catch(error => {
          console.error('Firebase sync failed', error)
          setSyncError(true)
        })
        .finally(() => setSyncing(false))
    }, 350)
    return () => window.clearTimeout(timer)
  }, [state, hydrated])

  const navigate = (next: View) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setView(next)
    if (next !== 'part5') {
      setLessonSkill(null)
      setQuickPart5(false)
    }
  }

  const startLesson = (skill: SkillId) => {
    setView('part5')
    setQuickPart5(false)
    setLessonSkill(skill)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startQuickPart5 = () => {
    setView('part5')
    setLessonSkill(null)
    setQuickPart5(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <LanguageContext.Provider value={lang}>
      <div className="app-shell">
        <div className="mobile-frame">
          <AppHeader
            connected={connected}
            syncing={syncing}
            syncError={syncError}
            state={state}
            onHome={() => navigate('home')}
            lang={lang}
            setLang={setLang}
          />

        <main className="app-main">
          {view === 'home' && (
            <Home
              state={state}
              startLesson={startLesson}
              navigate={navigate}
              startQuickPart5={startQuickPart5}
              questionCounts={{ 5: allPart5.length, 6: allPart6.length, 7: allPart7.length }}
            />
          )}
          {view === 'part5' && (
            lessonSkill && lessonBySkill[lessonSkill] ? (
              <LessonSession
                lesson={lessonBySkill[lessonSkill]!}
                state={state}
                setState={setState}
                pool={allPart5}
                onExit={() => setLessonSkill(null)}
              />
            ) : quickPart5 ? (
              <PracticeScreen
                part={5}
                state={state}
                setState={setState}
                pool={allPart5}
                onBack={() => setQuickPart5(false)}
              />
            ) : (
              <Part5Hub
                state={state}
                startLesson={startLesson}
                startQuick={startQuickPart5}
              />
            )
          )}
          {view === 'part6' && (
            <PracticeScreen
              part={6}
              state={state}
              setState={setState}
              pool={allPart6}
              passageMap={allPassageById}
              onBack={() => navigate('home')}
              readingSwitch={part => navigate(part === 6 ? 'part6' : 'part7')}
            />
          )}
          {view === 'part7' && (
            <PracticeScreen
              part={7}
              state={state}
              setState={setState}
              pool={allPart7}
              passageMap={allPassageById}
              onBack={() => navigate('home')}
              readingSwitch={part => navigate(part === 6 ? 'part6' : 'part7')}
            />
          )}
          {view === 'mock' && <MockTest setState={setState} />}
          {view === 'analytics' && (
            <Analytics
              state={state}
              startLesson={startLesson}
            />
          )}
          {view === 'review' && (
            <ReviewDue state={state} startLesson={startLesson} />
          )}
        </main>

          <BottomNav view={view} navigate={navigate} />
        </div>
      </div>
    </LanguageContext.Provider>
  )
}

function AppHeader({
  connected,
  syncing,
  syncError,
  state,
  onHome,
  lang,
  setLang,
}: {
  connected: boolean
  syncing: boolean
  syncError: boolean
  state: TrainerState
  onHome: () => void
  lang: Language
  setLang: (lang: Language) => void
}) {
  return (
    <header className="app-header">
      <button className="brand-mini" onClick={onHome}>
        <Mascot size={38} />
        <span>
          <b>TOEIC Coach</b>
          <small>{state.totalAnswered
            ? L(lang, `${state.totalAnswered} answered · ${learnerTier(state)}`, `ทำแล้ว ${state.totalAnswered} ข้อ · ${localizedTier(learnerTier(state), lang)}`)
            : L(lang, 'Ready to start your first set', 'พร้อมเริ่มชุดแรก')}</small>
        </span>
      </button>
      <div className="header-actions">
        <div className="language-toggle" aria-label={L(lang, 'Language', 'ภาษา')}>
          <button className={lang === 'th' ? 'active' : ''} onClick={() => setLang('th')}>TH</button>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        </div>
        <div className={`cloud-state ${syncError ? 'error' : connected ? 'online' : ''}`}>
          <span />
          {syncing
            ? L(lang, 'Saving', 'กำลังบันทึก')
            : syncError
              ? L(lang, 'Sync issue', 'ซิงก์มีปัญหา')
              : connected
                ? L(lang, 'Synced', 'ซิงก์แล้ว')
                : L(lang, 'Offline', 'ออฟไลน์')}
        </div>
      </div>
    </header>
  )
}

function BottomNav({ view, navigate }: { view: View; navigate: (view: View) => void }) {
  const lang = useLanguage()
  return (
    <nav className="bottom-nav" aria-label={L(lang, 'Main navigation', 'เมนูหลัก')}>
      <NavButton active={view === 'home'} label={L(lang, 'Home', 'หน้าหลัก')} icon="home" onClick={() => navigate('home')} />
      <NavButton active={view === 'part5'} label={L(lang, 'Learn', 'เรียน')} icon="learn" onClick={() => navigate('part5')} />
      <NavButton active={view === 'part6' || view === 'part7'} label={L(lang, 'Practice', 'ฝึก')} icon="practice" onClick={() => navigate('part6')} />
      <NavButton active={view === 'analytics'} label={L(lang, 'Progress', 'ผลลัพธ์')} icon="progress" onClick={() => navigate('analytics')} />
    </nav>
  )
}

function NavButton({ active, label, icon, onClick }: { active: boolean; label: string; icon: 'home' | 'learn' | 'practice' | 'progress'; onClick: () => void }) {
  return (
    <button className={active ? 'nav-button active' : 'nav-button'} onClick={onClick}>
      <NavIcon kind={icon} />
      <b>{label}</b>
    </button>
  )
}

function NavIcon({ kind }: { kind: 'home' | 'learn' | 'practice' | 'progress' }) {
  if (kind === 'home') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-4v6H5a1.5 1.5 0 0 1-1.5-1.5z" /></svg>
  if (kind === 'learn') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a2 2 0 0 1 2 2v15a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 20.5zM20 5.5A2.5 2.5 0 0 0 17.5 3H13a2 2 0 0 0-2 2v15a2 2 0 0 1 2-2h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></svg>
  if (kind === 'practice') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8.5 9.5l2 2 5-5M8.5 15.5h7" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20V11h3v9zm5.5 0V5h3v15zm5.5 0v-7h3v7z" /></svg>
}

function Home({
  state,
  startLesson,
  navigate,
  startQuickPart5,
  questionCounts,
}: {
  state: TrainerState
  startLesson: (skill: SkillId) => void
  navigate: (view: View) => void
  startQuickPart5: () => void
  questionCounts: Record<Part, number>
}) {
  const lang = useLanguage()
  const focus = nextFocusSkill(state)
  const focusLesson = lessonBySkill[focus] ?? lessons[0]
  const focusText = localizedLesson(focusLesson, lang)
  const targets = dailyTargets(state)
  const today = attemptsToday(state)
  const todayAttempts = state.attempts.filter(a => todayKey(a.at) === todayKey(Date.now()))
  const p6done = todayAttempts.filter(a => a.part === 6).length
  const p7done = todayAttempts.filter(a => a.part === 7).length
  const weak = weakestSkills(state, 3)
  const focusAssessment = skillAssessment(state, focus)

  return (
    <div className="screen home-screen">
      <section className="welcome">
        <div>
          <span className="hello">{greetingLabel(lang)}</span>
          <h1>TOEIC Reading Coach</h1>
          <p>{state.totalAnswered
            ? L(lang, `${state.totalAnswered} questions completed · ${learnerTier(state)} level`, `ทำแล้ว ${state.totalAnswered} ข้อ · ระดับ ${localizedTier(learnerTier(state), lang)}`)
            : L(lang, 'Start with a short diagnostic and build your plan from real results.', 'เริ่มจากการประเมินสั้น ๆ แล้วให้ระบบสร้างแผนจากผลจริงของคุณ')}</p>
        </div>
        <Mascot size={94} />
      </section>

      <section className="stat-row">
        <StatBox value={studyStreak(state)} label={L(lang, 'day streak', 'วันต่อเนื่อง')} accent="orange" />
        <StatBox value={`${Math.min(100, Math.round(today / Math.max(1, targets.total) * 100))}%`} label={L(lang, 'daily goal', 'เป้าหมายวันนี้')} accent="green" ring />
        <StatBox value={daysToExam()} label={L(lang, 'days left', 'วันก่อนสอบ')} accent="blue" />
      </section>

      <button className="continue-button" onClick={() => startLesson(focusLesson.skill)}>
        <span className="play-dot">▶</span>
        <span>
          <b>{L(lang, 'Continue personalized lesson', 'เรียนต่อจากบทที่เหมาะกับคุณ')}</b>
          <small>{focusText.shortTitle} · {L(lang, '5 examples + 10 practice', 'ตัวอย่าง 5 ข้อ + ฝึกจริง 10 ข้อ')}</small>
        </span>
        <strong>›</strong>
      </button>

      <section className="section-block">
        <SectionTitle title={L(lang, 'Your Learning Path', 'เส้นทางการเรียนของคุณ')} action={L(lang, 'See all', 'ดูทั้งหมด')} onAction={() => navigate('analytics')} />
        <div className="learning-path">
          <PathNode done={partAccuracy(state, 5) >= 75} active label="Part 5" sub={L(lang, 'Grammar', 'ไวยากรณ์')} />
          <PathLine />
          <PathNode done={partAccuracy(state, 6) >= 75} active={partAccuracy(state, 5) >= 65} label="Part 6" sub={L(lang, 'Text Completion', 'เติมข้อความ')} />
          <PathLine />
          <PathNode done={partAccuracy(state, 7) >= 75} active={partAccuracy(state, 6) >= 60} label="Part 7" sub={L(lang, 'Reading', 'การอ่าน')} />
        </div>
      </section>

      <section className="section-block">
        <SectionTitle title={L(lang, 'Practice by Part', 'ฝึกแยกตามพาร์ต')} />
        <div className="part-cards-mobile">
          <PracticePartCard className="mint" part="5" title={L(lang, 'Grammar', 'ไวยากรณ์')} count={questionCounts[5]} progress={partAccuracy(state, 5)} onClick={startQuickPart5} />
          <PracticePartCard className="sky" part="6" title={L(lang, 'Text Completion', 'เติมข้อความ')} count={questionCounts[6]} progress={partAccuracy(state, 6)} onClick={() => navigate('part6')} />
          <PracticePartCard className="sun" part="7" title={L(lang, 'Reading', 'การอ่าน')} count={questionCounts[7]} progress={partAccuracy(state, 7)} onClick={() => navigate('part7')} />
        </div>
      </section>

      <section className="section-block">
        <div className="adaptive-heading">
          <div>
            <span className="tiny-label">{L(lang, 'ADAPTIVE PLAN TODAY', 'แผน ADAPTIVE วันนี้')}</span>
            <h2>{L(lang, '3 tasks for your level', '3 งานที่เหมาะกับระดับคุณ')}</h2>
          </div>
          <span className="tier-pill">{state.totalAnswered ? localizedTier(learnerTier(state), lang) : L(lang, 'Start here', 'เริ่มตรงนี้')}</span>
        </div>
        <div className="task-stack">
          <TaskCard
            icon="T"
            title={L(lang, `Learn: ${focusLesson.shortTitle}`, `เรียน: ${focusText.shortTitle}`)}
            subtitle={L(lang, '5 worked examples + mastery check', 'ตัวอย่างอธิบาย 5 ข้อ + แบบวัดความแม่น')}
            value={focusAssessment.value ?? Math.min(100, focusAssessment.attempts / 3 * 100)}
            right={focusAssessment.value !== null ? `${focusAssessment.value}%` : focusAssessment.attempts ? `${focusAssessment.attempts}/3` : L(lang, 'New', 'ใหม่')}
            onClick={() => startLesson(focus)}
          />
          <TaskCard icon="6" title={L(lang, 'Part 6 speed set', 'Part 6 ฝึกทำให้เร็ว')} subtitle={L(lang, `${targets.part6} questions today`, `วันนี้ ${targets.part6} ข้อ`)} value={p6done / targets.part6 * 100} right={`${Math.min(p6done, targets.part6)}/${targets.part6}`} onClick={() => navigate('part6')} />
          <TaskCard icon="7" title={L(lang, 'Part 7 evidence reading', 'Part 7 อ่านหาหลักฐาน')} subtitle={L(lang, `${targets.part7} questions today`, `วันนี้ ${targets.part7} ข้อ`)} value={p7done / targets.part7 * 100} right={`${Math.min(p7done, targets.part7)}/${targets.part7}`} onClick={() => navigate('part7')} />
        </div>
      </section>

      <section className="focus-card">
        <div className="focus-copy">
          <span className="tiny-label">{L(lang, 'YOUR CURRENT PRIORITY', 'สิ่งที่ควรเน้นตอนนี้')}</span>
          <h2>{focusText.title}</h2>
          <p>{weak.length
            ? L(lang, `Your weakest measured skill is currently ${skillLabels[focus]}. We will teach the pattern before testing it again.`, `จุดที่อ่อนที่สุดที่วัดได้ตอนนี้คือ ${localizedSkill(focus, lang)} ระบบจะสอน pattern ก่อนแล้วค่อยให้ทำซ้ำ`)
            : L(lang, 'Start here to build your first diagnostic profile.', 'เริ่มตรงนี้เพื่อสร้างโปรไฟล์ระดับจริงของคุณ')}</p>
          <button onClick={() => startLesson(focus)}>{L(lang, 'Start focused lesson', 'เริ่มบทเรียนเฉพาะจุด')}</button>
        </div>
        <Mascot size={88} />
      </section>

      <button className="mock-banner" onClick={() => navigate('mock')}>
        <span><b>{L(lang, '75-minute Reading Simulation', 'จำลองสอบ Reading 75 นาที')}</b><small>30 Part 5 · 16 Part 6 · 54 Part 7</small></span>
        <strong>{L(lang, 'Start', 'เริ่ม')} ›</strong>
      </button>

      <div className="home-spacer" />
    </div>
  )
}

function StatBox({ value, label, accent, ring = false }: { value: number | string; label: string; accent: string; ring?: boolean }) {
  return (
    <div className={`stat-box ${accent}`}>
      <div className={ring ? 'stat-value ring' : 'stat-value'}>{value}</div>
      <span>{label}</span>
    </div>
  )
}

function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="section-title-row">
      <h2>{title}</h2>
      {action && <button onClick={onAction}>{action} ›</button>}
    </div>
  )
}

function PathNode({ done, active, label, sub }: { done: boolean; active: boolean; label: string; sub: string }) {
  return (
    <div className={`path-node ${active ? 'active' : ''}`}>
      <div>{done ? '✓' : active ? '◆' : '•'}</div>
      <b>{label}</b>
      <span>{sub}</span>
    </div>
  )
}

function PathLine() {
  return <div className="path-line"><span /></div>
}

function PracticePartCard({
  className,
  part,
  title,
  count,
  progress,
  onClick,
}: {
  className: string
  part: string
  title: string
  count: number
  progress: number
  onClick: () => void
}) {
  const lang = useLanguage()
  return (
    <button className={`practice-part-card ${className}`} onClick={onClick}>
      <span className="part-mini-icon">{part}</span>
      <b>Part {part}<br />{title}</b>
      <small>{count} {L(lang, 'questions', 'ข้อ')}</small>
      <Progress value={progress} />
      <strong>›</strong>
    </button>
  )
}

function TaskCard({
  icon,
  title,
  subtitle,
  value,
  right,
  onClick,
}: {
  icon: string
  title: string
  subtitle: string
  value: number
  right: string
  onClick: () => void
}) {
  return (
    <button className="task-card" onClick={onClick}>
      <span className="task-icon">{icon}</span>
      <div className="task-copy"><b>{title}</b><small>{subtitle}</small><Progress value={value} /></div>
      <strong>{right}</strong>
    </button>
  )
}

function Part5Hub({
  state,
  startLesson,
  startQuick,
}: {
  state: TrainerState
  startLesson: (skill: SkillId) => void
  startQuick: () => void
}) {
  const lang = useLanguage()
  const focus = nextFocusSkill(state)
  const due = new Set(dueLessonSkills(state))
  const overallMastery = averagePart5Mastery(state)
  const sorted = [...lessons].sort((a, b) => {
    if (a.skill === focus) return -1
    if (b.skill === focus) return 1
    const aScore = skillAssessment(state, a.skill).value ?? -1
    const bScore = skillAssessment(state, b.skill).value ?? -1
    return aScore - bScore
  })

  return (
    <div className="screen learn-screen">
      <div className="screen-intro">
        <span className="tiny-label">{L(lang, 'PART 5 · LEARN BEFORE YOU TEST', 'PART 5 · เรียนให้เข้าใจก่อนทำจริง')}</span>
        <h1>{L(lang, 'Fix the pattern, then prove it.', 'แก้จุดอ่อนให้เข้าใจก่อน แล้วค่อยพิสูจน์ด้วยโจทย์จริง')}</h1>
        <p>{L(lang, 'Every focused lesson gives you 5 fully explained examples first, followed by a 10-question mastery check.', 'แต่ละบทจะสอนด้วยตัวอย่างอธิบายละเอียด 5 ข้อก่อน แล้วให้ทำแบบวัดความแม่น 10 ข้อ')}</p>
      </div>

      <div className="level-card">
        <div>
          <span>{L(lang, 'Current Part 5 level', 'ระดับ Part 5 ตอนนี้')}</span>
          <strong>{overallMastery === null ? L(lang, 'Not assessed yet', 'ยังไม่ได้ประเมิน') : localizedSkillTierName(skillTier(overallMastery), lang)}</strong>
          <small>{overallMastery === null ? L(lang, 'Do at least 3 questions in a skill before mastery is shown.', 'ทำอย่างน้อย 3 ข้อในหัวข้อนั้นก่อน ระบบจึงจะแสดงค่าความแม่น') : L(lang, `${partAccuracy(state, 5)}% measured accuracy`, `ความถูกต้องที่วัดได้ ${partAccuracy(state, 5)}%`)}</small>
        </div>
        <div className={overallMastery === null ? 'level-orbit unassessed' : 'level-orbit'}><span>{overallMastery === null ? '—' : `${Math.round(overallMastery)}%`}</span></div>
      </div>

      <button className="quick-drill" onClick={startQuick}>
        <span className="quick-icon">⚡</span>
        <span><b>{L(lang, 'Quick adaptive drill', 'ฝึกด่วนแบบ Adaptive')}</b><small>{L(lang, 'Jump straight into mixed Part 5 questions', 'เข้าโจทย์ Part 5 แบบผสมทันที')}</small></span>
        <strong>›</strong>
      </button>

      <SectionTitle title={L(lang, 'Recommended lessons', 'บทเรียนที่แนะนำ')} />
      <div className="lesson-list">
        {sorted.map(lesson => {
          const assessment = skillAssessment(state, lesson.skill)
          const result = state.lessonResults[lesson.skill]
          const chapter = chaptersForSkill(lesson.skill)[0]
          const lessonText = localizedLesson(lesson, lang)
          return (
            <button className={lesson.skill === focus ? 'lesson-card recommended' : 'lesson-card'} key={lesson.skill} onClick={() => startLesson(lesson.skill)}>
              <span className="lesson-icon">{lesson.icon}</span>
              <div className="lesson-card-copy">
                <div className="lesson-title-line">
                  <b>{lessonText.shortTitle}</b>
                  {lesson.skill === focus && <span>{L(lang, 'Recommended', 'แนะนำ')}</span>}
                  {due.has(lesson.skill) && <span className="due">{L(lang, 'Review due', 'ถึงเวลาทบทวน')}</span>}
                </div>
                {chapter && <span className="course-ref-mini">{L(lang, 'Chapter', 'บทที่')} {chapter.id} · {localizedChapterTitle(chapter.id, chapter.title, lang)}</span>}
                <small>{lessonText.summary}</small>
                <Progress value={assessment.value ?? Math.min(100, assessment.attempts / 3 * 100)} />
                <div className="lesson-meta">
                  <span>{localizedAssessmentLabel(assessment, lang)}</span>
                  <span>{result ? L(lang, `Best check ${result.bestScore}%`, `คะแนนดีที่สุด ${result.bestScore}%`) : L(lang, 'Not completed yet', 'ยังไม่เคยทำจบบท')}</span>
                </div>
              </div>
              <strong>›</strong>
            </button>
          )
        })}
      </div>

      <CourseMemoryBank />
    </div>
  )
}

function averagePart5Mastery(state: TrainerState) {
  const p5Skills: SkillId[] = ['part-of-speech','verb-tense','subject-verb','passive','preposition','conjunction','relative-clause','pronoun','comparison','vocabulary','collocation']
  const values = p5Skills
    .map(skill => skillAssessment(state, skill))
    .filter(item => item.value !== null)
    .map(item => item.value as number)
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null
}

function CourseMemoryBank() {
  const lang = useLanguage()
  const grammar = readingCourseChapters.filter(chapter => chapter.id <= 21)
  const reading = readingCourseChapters.filter(chapter => chapter.id >= 26)

  const renderChapter = (chapter: (typeof readingCourseChapters)[number]) => (
    <details className="course-chapter" key={chapter.id}>
      <summary>
        <span>{L(lang, 'Chapter', 'บทที่')} {chapter.id}</span>
        <b>{localizedChapterTitle(chapter.id, chapter.title, lang)}</b>
        <strong>＋</strong>
      </summary>
      <div className="course-chapter-body">
        <small>{lang === 'th' ? `บทที่ ${chapter.id} · ${localizedChapterTitle(chapter.id, chapter.title, lang)}` : chapter.sections.join(' · ')}</small>
        <h4>{L(lang, 'Memorize these', 'ต้องท่องจำ')}</h4>
        <ul>{localizedChapterTips(chapter.id, chapter.memorize, lang).map(item => <li key={item}>{item}</li>)}</ul>
        {chapter.coachTip && <p className="coach-tip">{L(lang, chapter.coachTip, 'บทนี้มีเนื้อหาค่อนข้างกว้าง ระบบจะพาคุณกลับมาทบทวนเมื่อพบว่าพลาดคำศัพท์หรือรูปแบบที่เกี่ยวข้อง')}</p>}
        <span className="source-file">{L(lang, 'Source', 'อ้างอิงจาก')}: {chapter.file}</span>
      </div>
    </details>
  )

  return (
    <section className="course-memory-bank">
      <SectionTitle title={L(lang, 'Your course memory bank', 'คลังสรุปจากบทเรียนจริงของคุณ')} />
      <p className="course-memory-intro">{L(lang, 'Summaries from the material you actually study in ', 'สรุปจากไฟล์ที่คุณเรียนจริงใน ')}<b>content-TOEIC/TOEIC</b>{L(lang, '. Use it to review only the rules worth memorizing.', ' ใช้ทบทวนเฉพาะกฎที่ต้องจำ โดยไม่ต้องไล่เปิดทุก PDF')}</p>
      <h3>{L(lang, 'Grammar chapters', 'บทไวยากรณ์')}</h3>
      <div className="course-chapter-list">{grammar.map(renderChapter)}</div>
      <h3>{L(lang, 'Reading chapters', 'บท Reading')}</h3>
      <div className="course-chapter-list">{reading.map(renderChapter)}</div>
    </section>
  )
}

function LessonSession({
  lesson,
  state,
  setState,
  pool,
  onExit,
}: {
  lesson: LessonDefinition
  state: TrainerState
  setState: StateSetter
  pool: Question[]
  onExit: () => void
}) {
  const lang = useLanguage()
  const lessonText = localizedLesson(lesson, lang)
  const [phase, setPhase] = useState<'examples' | 'practice' | 'result'>('examples')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [practiceQuestions] = useState(() => questionsForSkill(state, pool, lesson.skill, lesson.practiceCount))
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [times, setTimes] = useState<number[]>([])
  const [reason, setReasonState] = useState<ErrorReason | ''>('')
  const startedAt = useRef(performance.now())
  const courseRefs = chaptersForSkill(lesson.skill)

  const resetLesson = () => {
    setPhase('examples')
    setExampleIndex(0)
    setPracticeIndex(0)
    setSelected('')
    setChecked(false)
    setScore(0)
    setTimes([])
    setReasonState('')
    startedAt.current = performance.now()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (phase === 'examples') {
    const example = lesson.workedExamples[exampleIndex]
    const exampleText = localizedExample(example, lang)
    return (
      <div className="screen lesson-screen">
        <LessonTopBar label={lessonText.shortTitle} step={exampleIndex + 1} total={lesson.workedExamples.length} onBack={onExit} mode={L(lang, 'Learn', 'เรียน')} />
        <div className="lesson-hero">
          <span className="lesson-big-icon">{lesson.icon}</span>
          <div><span className="tiny-label">{L(lang, 'WORKED EXAMPLE', 'ตัวอย่างสอน')} {exampleIndex + 1}/5</span><h1>{lessonText.title}</h1></div>
        </div>
        <div className="strategy-strip"><b>{L(lang, 'Strategy:', 'วิธีคิด:')}</b> {lessonText.strategy[exampleIndex % lessonText.strategy.length]}</div>
        {courseRefs[0] && (
          <section className="lesson-course-note">
            <div className="lesson-course-head">
              <span>{L(lang, 'YOUR COURSE', 'อ้างอิงจากบทที่คุณเรียนจริง')}</span>
              <b>{L(lang, 'Chapter', 'บทที่')} {courseRefs[0].id} · {localizedChapterTitle(courseRefs[0].id, courseRefs[0].title, lang)}</b>
            </div>
            <div className="lesson-course-memory">
              <strong>{L(lang, 'Memorize', 'ต้องท่องจำ')}</strong>
              <ul>{localizedChapterTips(courseRefs[0].id, courseRefs[0].memorize, lang).slice(0, 3).map(item => <li key={item}>{item}</li>)}</ul>
            </div>
          </section>
        )}
        <section className="worked-card">
          <span className="difficulty-pill">{L(lang, 'Level', 'ระดับ')} {example.difficulty}</span>
          <h2>{example.stem}</h2>
          <div className="choices worked">
            {example.choices.map(choice => (
              <div key={choice.id} className={choice.id === example.answer ? 'choice correct fixed' : 'choice fixed'}>
                <span>{choice.id}</span><b>{choice.text}</b>{choice.id === example.answer && <strong>✓</strong>}
              </div>
            ))}
          </div>
        </section>
        <section className="teaching-card">
          <div className="teach-row"><span className="teach-icon clue">1</span><div><b>{L(lang, 'Spot the clue', 'จับจุดสังเกต')}</b><p>{exampleText.clue}</p></div></div>
          <div className="teach-row"><span className="teach-icon rule">2</span><div><b>{L(lang, 'Apply the rule', 'ใช้กฎนี้')}</b><p>{exampleText.rule}</p></div></div>
          <div className="teach-row"><span className="teach-icon why">3</span><div><b>{L(lang, 'Why this answer', 'ทำไมข้อนี้ตอบแบบนี้')}</b><p>{exampleText.explanation}</p></div></div>
          <div className="trap-box"><b>{L(lang, 'Common trap', 'กับดักที่พบบ่อย')}</b><p>{exampleText.trap}</p></div>
        </section>
        <button className="big-next" onClick={() => {
          if (exampleIndex < lesson.workedExamples.length - 1) {
            setExampleIndex(i => i + 1)
          } else {
            setPhase('practice')
            startedAt.current = performance.now()
          }
        }}>
          {exampleIndex < lesson.workedExamples.length - 1
            ? L(lang, 'Next example', 'ตัวอย่างถัดไป')
            : L(lang, `Start ${practiceQuestions.length}-question mastery check`, `เริ่มทำจริง ${practiceQuestions.length} ข้อ`)} <span>›</span>
        </button>
      </div>
    )
  }

  if (phase === 'result') {
    const percent = Math.round(score / Math.max(1, practiceQuestions.length) * 100)
    const passed = score >= Math.min(lesson.passScore, practiceQuestions.length)
    const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length / 1000) : 0
    return (
      <div className="screen result-screen">
        <div className={passed ? 'result-badge pass' : 'result-badge retry'}>{passed ? '✓' : '↻'}</div>
        <span className="tiny-label">{passed ? L(lang, 'MASTERY CHECK PASSED', 'ผ่านแบบวัดความแม่นแล้ว') : L(lang, 'ONE MORE ROUND WILL HELP', 'ทวนอีกหนึ่งรอบจะช่วยให้แม่นขึ้น')}</span>
        <h1>{score}/{practiceQuestions.length} {L(lang, 'correct', 'ข้อถูก')}</h1>
        <p>{passed
          ? L(lang, `Nice. ${lesson.shortTitle} is moving toward automatic recognition.`, `ดีมาก ${lessonText.shortTitle} เริ่มตอบได้เป็นอัตโนมัติมากขึ้นแล้ว`)
          : L(lang, `Review the examples again. Your next ${lesson.shortTitle} set will stay near this level before becoming harder.`, `กลับไปทวนตัวอย่างอีกครั้ง ชุดถัดไปของ ${lessonText.shortTitle} จะยังอยู่ใกล้ระดับนี้ก่อนค่อยยากขึ้น`)}</p>
        <div className="result-stats">
          <div><span>{L(lang, 'Score', 'คะแนน')}</span><b>{percent}%</b></div>
          <div><span>{L(lang, 'Avg time', 'เวลาเฉลี่ย')}</span><b>{avg}s</b></div>
          <div><span>{L(lang, 'XP earned', 'XP ที่ได้')}</span><b>+{Math.max(10, score * 4)}</b></div>
        </div>
        <Progress value={percent} />
        <div className="result-actions">
          {!passed && <button className="secondary-action" onClick={resetLesson}>{L(lang, 'Repeat lesson', 'เรียนบทนี้ซ้ำ')}</button>}
          <button className="primary-action" onClick={onExit}>{L(lang, 'Back to lessons', 'กลับไปหน้าบทเรียน')}</button>
        </div>
      </div>
    )
  }

  const question = practiceQuestions[practiceIndex]
  if (!question) {
    return (
      <div className="screen lesson-screen">
        <button className="back-link" onClick={onExit}>‹ {L(lang, 'Back', 'กลับ')}</button>
        <div className="empty-state">{L(lang, 'Not enough questions are tagged for this skill yet. The personalized bank can add more from Firebase.', 'ตอนนี้ยังมีโจทย์ที่แท็กหัวข้อนี้ไม่พอ ระบบสามารถเพิ่มโจทย์เฉพาะจุดจาก Firebase ได้ภายหลัง')}</div>
      </div>
    )
  }

  const correct = checked && selected === question.answer
  const submit = () => {
    if (!selected || checked) return
    const elapsed = performance.now() - startedAt.current
    setTimes(items => [...items, elapsed])
    if (selected === question.answer) setScore(v => v + 1)
    setState(current => recordAttempt(current, question, selected, elapsed, { mode: 'mastery', lessonSkill: lesson.skill }))
    setChecked(true)
  }

  const next = () => {
    if (practiceIndex >= practiceQuestions.length - 1) {
      const finalScore = score
      const finalCorrect = selected === question.answer
      const recordedScore = finalCorrect ? finalScore + (checked ? 0 : 1) : finalScore
      const avgSeconds = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length / 1000) : 0
      setState(current => completeLesson(current, lesson.skill, recordedScore, practiceQuestions.length, avgSeconds))
      setPhase('result')
      return
    }
    setPracticeIndex(i => i + 1)
    setSelected('')
    setChecked(false)
    setReasonState('')
    startedAt.current = performance.now()
  }

  return (
    <div className="screen lesson-screen">
      <LessonTopBar label={lessonText.shortTitle} step={practiceIndex + 1} total={practiceQuestions.length} onBack={onExit} mode={L(lang, 'Practice', 'ทำจริง')} />
      <div className="mastery-banner">
        <span>{L(lang, 'Mastery check', 'แบบวัดความแม่น')}</span>
        <b>{score} {L(lang, 'correct', 'ข้อถูก')}</b>
      </div>
      <QuestionCard
        question={question}
        selected={selected}
        checked={checked}
        onSelect={setSelected}
      />
      {!checked ? (
        <button className="big-next" disabled={!selected} onClick={submit}>{L(lang, 'Check answer', 'ตรวจคำตอบ')} <span>›</span></button>
      ) : (
        <FeedbackCard
          question={question}
          selected={selected}
          correct={correct}
          elapsed={times[times.length - 1] ?? 0}
          reason={reason}
          onReason={r => {
            setReasonState(r)
            setState(current => addFeedbackToLatest(current, r))
          }}
          onNext={next}
          nextLabel={practiceIndex === practiceQuestions.length - 1 ? L(lang, 'See result', 'ดูผลลัพธ์') : L(lang, 'Next question', 'ข้อถัดไป')}
        />
      )}
    </div>
  )
}

function LessonTopBar({ label, step, total, onBack, mode }: { label: string; step: number; total: number; onBack: () => void; mode: string }) {
  return (
    <div className="lesson-topbar">
      <button onClick={onBack}>‹</button>
      <div><b>{label}</b><small>{mode} · {step}/{total}</small></div>
      <Progress value={step / total * 100} />
    </div>
  )
}

function firstQuestionOfPickedPassage(
  state: TrainerState,
  pool: Question[],
  map: Record<string, Passage>,
  excludePassageId?: string,
) {
  const candidates = excludePassageId
    ? pool.filter(q => q.passageId !== excludePassageId)
    : pool
  const picked = pickAdaptiveQuestion(state, candidates.length ? candidates : pool)
  if (!picked.passageId) return picked
  const passage = map[picked.passageId]
  const firstId = passage?.questions.find(id => pool.some(q => q.id === id))
  return pool.find(q => q.id === firstId) ?? picked
}

function nextQuestionInSamePassage(
  question: Question,
  pool: Question[],
  map: Record<string, Passage>,
) {
  if (!question.passageId) return undefined
  const ids = map[question.passageId]?.questions ?? []
  const current = ids.indexOf(question.id)
  if (current < 0) return undefined
  for (let i = current + 1; i < ids.length; i += 1) {
    const next = pool.find(q => q.id === ids[i])
    if (next) return next
  }
  return undefined
}

if (import.meta.env.DEV) {
  const samplePassage = Object.values(passageById).find(p => p.part === 6 && p.questions.length > 1)
  if (samplePassage) {
    const samplePool = part6.filter(q => samplePassage.questions.includes(q.id))
    const first = firstQuestionOfPickedPassage(emptyState(), samplePool, passageById)
    const second = nextQuestionInSamePassage(first, samplePool, passageById)
    console.assert(
      first.id === samplePassage.questions[0] && second?.id === samplePassage.questions[1],
      'Part 6/7 passage sequencing self-check failed',
    )
  }
}

function DailyPartComplete({
  part,
  done,
  target,
  onExit,
  onExtra,
}: {
  part: Part
  done: number
  target: number
  onExit?: () => void
  onExtra: () => void
}) {
  const lang = useLanguage()
  return (
    <div className="screen practice-screen">
      <section className="daily-part-complete">
        <span className="complete-check">✓</span>
        <small>{L(lang, 'DAILY TARGET COMPLETE', 'ครบเป้าหมายวันนี้แล้ว')}</small>
        <h1>{L(lang, `Part ${part} is done for today`, `Part ${part} วันนี้พอแล้ว`)}</h1>
        <p>{L(
          lang,
          `You completed ${done} questions. Today’s adaptive target was ${target}. The trainer will not keep feeding questions automatically after the target.`,
          `คุณทำแล้ว ${done} ข้อ เป้าหมาย Adaptive วันนี้คือ ${target} ข้อ ระบบจะหยุดสุ่มโจทย์ต่ออัตโนมัติเมื่อครบเป้า`,
        )}</p>
        {done > target && (
          <div className="over-target-note">{L(
            lang,
            `You went ${done - target} questions beyond the target. Those answers still count in your learning data.`,
            `วันนี้คุณทำเกินเป้ามา ${done - target} ข้อ ข้อมูลทั้งหมดที่ทำเกินยังถูกเก็บไว้ใช้วิเคราะห์เหมือนเดิม`,
          )}</div>
        )}
        <div className="daily-complete-actions">
          {onExit && <button className="big-next" onClick={onExit}>{L(lang, 'Finish for now', 'จบการฝึกตอนนี้')} <span>✓</span></button>}
          <button className="secondary-action" onClick={onExtra}>{L(lang, 'Optional extra practice', 'ฝึกเพิ่มแบบสมัครใจ')}</button>
        </div>
      </section>
    </div>
  )
}

function PracticeScreen({
  part,
  state,
  setState,
  pool,
  passageMap,
  onBack,
  readingSwitch,
}: {
  part: Part
  state: TrainerState
  setState: StateSetter
  pool: Question[]
  passageMap?: Record<string, Passage>
  onBack?: () => void
  readingSwitch?: (part: 6 | 7) => void
}) {
  const lang = useLanguage()
  const activePassageMap = passageMap ?? passageById
  const [question, setQuestion] = useState<Question>(() => firstQuestionOfPickedPassage(state, pool, activePassageMap))
  const [selected, setSelected] = useState('')
  const [checked, setChecked] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [reason, setReason] = useState<ErrorReason | ''>('')
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 0>(0)
  const [part6PickerOpen, setPart6PickerOpen] = useState(false)
  const [extraPractice, setExtraPractice] = useState(false)
  const startedAt = useRef(performance.now())

  useEffect(() => {
    setQuestion(firstQuestionOfPickedPassage(state, pool, activePassageMap))
    setSelected('')
    setChecked(false)
    setReason('')
    setConfidence(0)
    setPart6PickerOpen(false)
    setExtraPractice(false)
    startedAt.current = performance.now()
    // reset only when pool/part changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [part, pool])

  const passage = question?.passageId ? activePassageMap[question.passageId] : undefined
  const passageQuestionIds = passage?.questions.filter(id => pool.some(q => q.id === id)) ?? []
  const passageQuestionIndex = passageQuestionIds.indexOf(question.id)
  const questionContext = part === 6 && passage ? activeContextForBlank(passage.body, question.stem) : question.stem
  if (!question) return <div className="screen"><div className="empty-state">{L(lang, 'No questions available.', 'ยังไม่มีโจทย์ในชุดนี้')}</div></div>

  const targets = dailyTargets(state)
  const partTarget = part === 5 ? targets.part5 : part === 6 ? targets.part6 : targets.part7
  const partDone = todayPartCount(state, part)
  const passageBoundary = part === 5 || !passage || passageQuestionIndex >= passageQuestionIds.length - 1
  const goalReached = partDone >= partTarget
  const showDailyComplete = goalReached && !extraPractice && !checked

  const submit = () => {
    if (!selected || checked) return
    const ms = performance.now() - startedAt.current
    setElapsed(ms)
    setState(current => recordAttempt(current, question, selected, ms, { mode: 'adaptive' }))
    setChecked(true)
  }

  const next = () => {
    if (!extraPractice && goalReached && passageBoundary) {
      setSelected('')
      setChecked(false)
      setElapsed(0)
      setReason('')
      setPart6PickerOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const sequential = nextQuestionInSamePassage(question, pool, activePassageMap)
    setQuestion(sequential ?? firstQuestionOfPickedPassage(state, pool, activePassageMap, question.passageId))
    setSelected('')
    setChecked(false)
    setElapsed(0)
    setReason('')
    setConfidence(0)
    setPart6PickerOpen(false)
    startedAt.current = performance.now()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (showDailyComplete) {
    return (
      <DailyPartComplete
        part={part}
        done={partDone}
        target={partTarget}
        onExit={onBack}
        onExtra={() => {
          setExtraPractice(true)
          startedAt.current = performance.now()
        }}
      />
    )
  }

  return (
    <div className="screen practice-screen">
      <div className="practice-toolbar">
        {onBack ? <button className="round-back" onClick={onBack} aria-label={L(lang, 'Back', 'กลับ')}>‹</button> : <span />}
        <div>
          <b>Part {part}: {part === 5
            ? L(lang, 'Incomplete Sentences', 'เติมคำในประโยค')
            : part === 6
              ? L(lang, 'Text Completion', 'เติมข้อความ')
              : L(lang, 'Reading Comprehension', 'อ่านจับใจความ')}</b>
          <small>{passageQuestionIndex >= 0
            ? `${L(lang, 'Question', 'ข้อย่อย')} ${passageQuestionIndex + 1}/${passageQuestionIds.length} · `
            : ''}{question.skills.slice(0, 2).map(skill => localizedSkill(skill, lang)).join(' · ')}</small>
        </div>
        <span className="practice-part-tag">P{part}</span>
      </div>

      {readingSwitch && (
        <div className="segment">
          <button className={part === 6 ? 'active' : ''} onClick={() => readingSwitch(6)}>Part 6</button>
          <button className={part === 7 ? 'active' : ''} onClick={() => readingSwitch(7)}>Part 7</button>
        </div>
      )}

      <div className="practice-progress">
        <Progress value={partDone / Math.max(1, partTarget) * 100} />
        <span>{partDone}/{partTarget} {L(lang, `Part ${part} today`, `ข้อ Part ${part} วันนี้`)}{extraPractice ? L(lang, ' · extra', ' · ฝึกเพิ่ม') : ''}</span>
      </div>

      {passage && (
        <PassageDocument
          passage={passage}
          part={part}
          question={question}
          selected={selected}
          checked={checked}
          onBlankClick={part === 6 ? () => setPart6PickerOpen(true) : undefined}
        />
      )}

      {part === 6 ? (
        <>
          <button className="part6-answer-trigger" onClick={() => setPart6PickerOpen(true)}>
            <span>{question.stem.match(/\[(\d+)\]/)?.[0] ?? '[ ]'}</span>
            <b>{selected
              ? question.choices.find(choice => choice.id === selected)?.text
              : L(lang, 'Tap the blank above to choose an answer', 'แตะช่องว่างด้านบนเพื่อเลือกคำตอบ')}</b>
            <strong>›</strong>
          </button>

          {part6PickerOpen && (
            <div className="answer-sheet-backdrop" role="presentation" onClick={() => setPart6PickerOpen(false)}>
              <section className="answer-sheet" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
                <div className="answer-sheet-head">
                  <div>
                    <span>{L(lang, 'Part 6 answer', 'ตอบ Part 6')}</span>
                    <b>{question.stem}</b>
                  </div>
                  <button onClick={() => setPart6PickerOpen(false)} aria-label={L(lang, 'Close', 'ปิด')}>×</button>
                </div>
                <QuestionCard question={question} selected={selected} checked={checked} onSelect={setSelected} contextText={questionContext} />
                {!checked ? (
                  <button className="big-next" disabled={!selected} onClick={submit}>{L(lang, 'Check answer', 'ตรวจคำตอบ')} <span>›</span></button>
                ) : (
                  <FeedbackCard
                    question={question}
                    selected={selected}
                    correct={selected === question.answer}
                    elapsed={elapsed}
                    reason={reason}
                    onReason={r => {
                      setReason(r)
                      setState(current => addFeedbackToLatest(current, r, confidence || undefined))
                    }}
                    confidence={confidence}
                    onConfidence={value => {
                      setConfidence(value)
                      setState(current => addFeedbackToLatest(current, reason || undefined, value))
                    }}
                    onNext={next}
                    nextLabel={!extraPractice && goalReached && passageBoundary
                      ? L(lang, 'Finish today’s target', 'จบตามเป้าหมายวันนี้')
                      : L(lang, 'Next blank', 'ช่องถัดไป')}
                  />
                )}
              </section>
            </div>
          )}
        </>
      ) : (
        <>
          <QuestionCard question={question} selected={selected} checked={checked} onSelect={setSelected} contextText={questionContext} />
          {!checked ? (
            <button className="big-next" disabled={!selected} onClick={submit}>{L(lang, 'Check answer', 'ตรวจคำตอบ')} <span>›</span></button>
          ) : (
            <FeedbackCard
              question={question}
              selected={selected}
              correct={selected === question.answer}
              elapsed={elapsed}
              reason={reason}
              onReason={r => {
                setReason(r)
                setState(current => addFeedbackToLatest(current, r, confidence || undefined))
              }}
              confidence={confidence}
              onConfidence={value => {
                setConfidence(value)
                setState(current => addFeedbackToLatest(current, reason || undefined, value))
              }}
              onNext={next}
              nextLabel={!extraPractice && goalReached && passageBoundary
                ? L(lang, 'Finish today’s target', 'จบตามเป้าหมายวันนี้')
                : L(lang, 'Next question', 'ข้อถัดไป')}
            />
          )}
        </>
      )}
    </div>
  )
}

function QuestionCard({
  question,
  selected,
  checked,
  onSelect,
  contextText,
}: {
  question: Question
  selected: string
  checked: boolean
  onSelect: (id: string) => void
  contextText?: string
}) {
  const lang = useLanguage()
  const [inspectedChoice, setInspectedChoice] = useState('')

  useEffect(() => {
    setInspectedChoice('')
  }, [question.id])

  const correct = checked && selected === question.answer

  return (
    <section className="mobile-question-card">
      <div className="question-badges">
        <span className="question-skill">{question.skills.slice(0, 2).map(skill => localizedSkill(skill, lang)).join(' · ')}</span>
        <span className="difficulty-badge">{L(lang, 'Level', 'ระดับ')} {question.difficulty}</span>
      </div>

      <h2>{question.stem}</h2>

      {checked && question.part <= 6 && (
        correct
          ? <WordLevelGrammarMap question={question} selected={selected} contextText={contextText} />
          : <CompactMistakeCoach question={question} selected={selected} contextText={contextText} />
      )}

      {checked && question.part === 7 && (
        <details className="p7-question-grammar">
          <summary>{L(lang,'Show grammar map of this question','ดู Grammar map ของคำถามนี้')}</summary>
          <WordLevelGrammarMap question={question} selected={selected} contextText={question.stem} />
        </details>
      )}

      {checked && (
        <p className="inspect-choice-hint">{L(
          lang,
          'Tap any A–D choice to inspect why it is right or wrong. This will not change your submitted answer.',
          'หลังตรวจแล้ว แตะ A–D ตัวไหนก็ได้เพื่อดูว่าทำไมถูก/ผิด โดยไม่เปลี่ยนคำตอบที่ส่งไปแล้ว',
        )}</p>
      )}

      <div className="choices">
        {question.choices.map(choice => {
          const selectedChoice = selected === choice.id
          const correctChoice = checked && choice.id === question.answer
          const wrongChoice = checked && selectedChoice && choice.id !== question.answer
          const inspecting = checked && inspectedChoice === choice.id
          return (
            <div className="choice-item" key={choice.id}>
              <button
                className={['choice', checked ? 'inspectable' : '', selectedChoice ? 'selected' : '', correctChoice ? 'correct' : '', wrongChoice ? 'wrong' : ''].join(' ')}
                onClick={() => checked
                  ? setInspectedChoice(current => current === choice.id ? '' : choice.id)
                  : onSelect(choice.id)}
              >
                <span>{choice.id}</span>
                <b>{choice.text}</b>
                {correctChoice && <strong>✓</strong>}
                {wrongChoice && <strong>×</strong>}
              </button>

              {inspecting && <ChoiceInspection question={question} choiceId={choice.id} />}

              {checked && selectedChoice && question.part === 7 && !inspecting && (
                <div className={`inline-choice-feedback ${choice.id === question.answer ? 'correct' : 'wrong'}`} aria-live="polite">
                  <b>{choice.id === question.answer
                    ? L(lang, 'Why this is correct', 'ทำไมข้อนี้ถูก')
                    : L(lang, 'Why this is wrong', 'ทำไมข้อนี้ผิด')}</b>
                  <p className="answer-result-summary">{selectedChoiceExplanation(question, selected, lang)}</p>
                  {question.evidence && (
                    <div className="inline-evidence">
                      <strong>{L(lang, 'Evidence in the passage', 'หลักฐานในบทความ')}</strong>
                      <span>“{question.evidence}”</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}


function FeedbackCard({
  question,
  selected,
  correct,
  elapsed,
  reason,
  onReason,
  confidence = 0,
  onConfidence,
  onNext,
  nextLabel,
}: {
  question: Question
  selected: string
  correct: boolean
  elapsed: number
  reason: ErrorReason | ''
  onReason: (reason: ErrorReason) => void
  confidence?: 1 | 2 | 3 | 0
  onConfidence?: (value: 1 | 2 | 3) => void
  onNext: () => void
  nextLabel: string
}) {
  const lang = useLanguage()
  const answerText = question.choices.find(c => c.id === question.answer)?.text
  const selectedText = question.choices.find(c => c.id === selected)?.text
  const courseRefs = chaptersForQuestion(question)
  return (
    <section className={correct ? 'feedback-panel correct' : 'feedback-panel wrong'}>
      <div className="feedback-heading">
        <span>{correct ? '✓' : '×'}</span>
        <div>
          <b>{correct ? L(lang, 'Correct!', 'ถูกต้อง!') : L(lang, 'Not quite right!', 'ยังไม่ถูก')}</b>
          <small>{correct
            ? L(lang, `Nice pattern recognition · ${formatTime(elapsed)}`, `จับรูปแบบได้ดี · ${formatTime(elapsed)}`)
            : L(
                lang,
                `You chose ${selected}. ${selectedText} · Correct: ${question.answer}. ${answerText}`,
                `คุณเลือก ${selected}. ${selectedText} · คำตอบที่ถูก: ${question.answer}. ${answerText}`,
              )}</small>
        </div>
      </div>
      {question.part === 7 && (
        <p className="feedback-inline-note">{L(
          lang,
          'The explanation and passage evidence are shown directly under your selected answer.',
          'คำอธิบายและหลักฐานจากบทความอยู่ใต้ตัวเลือกที่คุณกด',
        )}</p>
      )}
      {!correct && courseRefs[0] && (
        <details className="mistake-study-card mistake-study-collapsible">
          <summary>
            <span>{L(lang, 'Review chapter', 'ทบทวนบทนี้')}</span>
            <b>{L(lang, 'Chapter', 'บทที่')} {courseRefs[0].id} · {localizedChapterTitle(courseRefs[0].id, courseRefs[0].title, lang)}</b>
          </summary>
          <div className="mistake-study-body">
            <strong>{L(lang, 'What to memorize next', 'สิ่งที่ต้องท่องจำเพิ่ม')}</strong>
            <ul>{localizedChapterTips(courseRefs[0].id, courseRefs[0].memorize, lang).slice(0, 4).map(item => <li key={item}>{item}</li>)}</ul>
            {courseRefs.length > 1 && (
              <div className="related-chapters">
                <span>{L(lang, 'Related:', 'บทที่เกี่ยวข้อง:')}</span>
                {courseRefs.slice(1, 4).map(chapter => <b key={chapter.id}>{L(lang, 'Ch.', 'บท')} {chapter.id} {localizedChapterTitle(chapter.id, chapter.title, lang)}</b>)}
              </div>
            )}
            <small>{L(lang, 'Source', 'อ้างอิงจาก')}: content-TOEIC/TOEIC/{courseRefs[0].file}</small>
          </div>
        </details>
      )}
      {onConfidence && (
        <div className="confidence-picker">
          <b>{L(lang, 'How sure were you?', 'ตอนตอบมั่นใจแค่ไหน?')}</b>
          <small>{L(lang, 'A correct guess should still come back in adaptive practice.', 'ถ้าตอบถูกเพราะเดา/ลังเล ระบบจะเอา pattern นี้กลับมาฝึกซ้ำ')}</small>
          <div>
            {([
              [3,L(lang,'Sure','มั่นใจ')],
              [2,L(lang,'Unsure','ลังเล')],
              [1,L(lang,'Guessed','เดา')],
            ] as [1|2|3,string][]).map(([value,label]) => (
              <button key={value} className={confidence === value ? 'active' : ''} onClick={() => onConfidence(value)}>{label}</button>
            ))}
          </div>
        </div>
      )}
      {!correct && (
        <div className="reason-picker">
          <b>{L(lang, 'Why did you miss it?', 'พลาดเพราะอะไร?')}</b>
          <small>{L(lang, 'This trains your next personalized set.', 'ข้อมูลนี้จะช่วยให้ชุดถัดไปเลือกโจทย์ได้ตรงจุดมากขึ้น')}</small>
          <div>
            {([
              ['grammar',L(lang, 'Grammar', 'ไวยากรณ์')],
              ['vocabulary',L(lang, 'Vocabulary', 'คำศัพท์')],
              ['misread',L(lang, 'Misread', 'อ่านพลาด')],
              ['rushed',L(lang, 'Rushed', 'รีบเกินไป')],
              ['guess',L(lang, 'Guessed', 'เดา')],
            ] as [ErrorReason,string][]).map(([id, label]) => (
              <button key={id} className={reason === id ? 'active' : ''} onClick={() => onReason(id)}>{label}</button>
            ))}
          </div>
        </div>
      )}
      {!correct && question.part === 7 && (
        <div className="rule-note">
          <b>{L(lang, 'Reading rule to remember', 'กฎการอ่านที่ต้องจำ')}</b>
          <p>{fallbackWrongExplanation(question, lang)}</p>
        </div>
      )}
      <button className="big-next" onClick={onNext}>{nextLabel} <span>›</span></button>
    </section>
  )
}

function MockTest({ setState }: { setState: StateSetter }) {
  const lang = useLanguage()
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [correctCount, setCorrectCount] = useState(0)
  const [remaining, setRemaining] = useState(75 * 60)
  const questionStarted = useRef(performance.now())

  const makeTest = () => {
    const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)
    const orderedReadingSample = (items: Question[], target: number) => {
      const byId = new Map(items.map(q => [q.id, q]))
      const groups = shuffle(
        Object.values(passageById)
          .map(passage => passage.questions.map(id => byId.get(id)).filter((q): q is Question => Boolean(q)))
          .filter(group => group.length),
      )
      const selected: Question[] = []
      for (const group of groups) {
        if (selected.length >= target) break
        selected.push(...group.slice(0, target - selected.length))
      }
      if (selected.length < target) {
        const used = new Set(selected.map(q => q.id))
        selected.push(...shuffle(items.filter(q => !used.has(q.id))).slice(0, target - selected.length))
      }
      return selected
    }

    return [
      ...shuffle(part5).slice(0, 30),
      ...orderedReadingSample(part6, 16),
      ...orderedReadingSample(part7, 54),
    ]
  }

  const start = () => {
    setQuestions(makeTest())
    setStarted(true)
    setFinished(false)
    setIndex(0)
    setSelected('')
    setCorrectCount(0)
    setRemaining(75 * 60)
    questionStarted.current = performance.now()
  }

  useEffect(() => {
    if (!started || finished) return
    const timer = window.setInterval(() => {
      setRemaining(value => {
        if (value <= 1) {
          setFinished(true)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [started, finished])

  if (!started) {
    return (
      <div className="screen mock-screen">
        <div className="mock-mascot"><Mascot size={110} /></div>
        <span className="tiny-label">{L(lang, 'FULL READING SIMULATION', 'จำลองสอบ READING เต็มชุด')}</span>
        <h1>100 {L(lang, 'questions', 'ข้อ')}<br />75 {L(lang, 'minutes', 'นาที')}</h1>
        <p>{L(lang, 'Use this after targeted practice to test pacing under exam-like pressure. No instant explanations until the end.', 'ใช้หลังจากฝึกเฉพาะจุดแล้ว เพื่อทดสอบการแบ่งเวลาแบบใกล้เคียงข้อสอบจริง โดยจะไม่เฉลยทันทีจนกว่าจะทำจบ')}</p>
        <div className="mock-counts">
          <div><b>30</b><span>Part 5</span></div>
          <div><b>16</b><span>Part 6</span></div>
          <div><b>54</b><span>Part 7</span></div>
        </div>
        <button className="big-next" onClick={start}>{L(lang, 'Start simulation', 'เริ่มจำลองสอบ')} <span>›</span></button>
      </div>
    )
  }

  if (finished || !questions[index]) {
    const percent = Math.round(correctCount / 100 * 100)
    return (
      <div className="screen result-screen">
        <div className="result-badge pass">✓</div>
        <span className="tiny-label">{L(lang, 'SIMULATION COMPLETE', 'ทำชุดจำลองเสร็จแล้ว')}</span>
        <h1>{correctCount}/100 {L(lang, 'correct', 'ข้อถูก')}</h1>
        <Progress value={percent} />
        <p>{L(lang, 'All responses were added to your adaptive learner model and synced to Firebase.', 'คำตอบทั้งหมดถูกนำไปอัปเดตโมเดล Adaptive ของคุณและซิงก์กับ Firebase แล้ว')}</p>
        <button className="primary-action" onClick={start}>{L(lang, 'Try another simulation', 'ทำชุดจำลองอีกครั้ง')}</button>
      </div>
    )
  }

  const q = questions[index]
  const passage = q.passageId ? passageById[q.passageId] : undefined
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')

  const next = () => {
    if (!selected) return
    const elapsed = performance.now() - questionStarted.current
    if (selected === q.answer) setCorrectCount(v => v + 1)
    setState(current => {
      const nextState = recordAttempt(current, q, selected, elapsed, { mode: 'mock' })
      if (index >= questions.length - 1) nextState.mockCompletions += 1
      return nextState
    })
    if (index >= questions.length - 1) {
      setFinished(true)
      return
    }
    setIndex(v => v + 1)
    setSelected('')
    questionStarted.current = performance.now()
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="screen practice-screen">
      <div className="mock-sticky">
        <span><b>{index + 1}</b>/100</span>
        <Progress value={(index + 1) / 100 * 100} />
        <strong className={remaining < 600 ? 'urgent' : ''}>{mm}:{ss}</strong>
      </div>
      {passage && <article className="reading-passage"><span className="doc-type">PART {q.part}</span><h2>{passage.title}</h2><div>{passage.body}</div></article>}
      <QuestionCard question={q} selected={selected} checked={false} onSelect={setSelected} />
      <button className="big-next" disabled={!selected} onClick={next}>{index === 99 ? L(lang, 'Finish', 'ส่งคำตอบ') : L(lang, 'Next', 'ข้อถัดไป')} <span>›</span></button>
      <small className="mock-note">{L(lang, 'No answer feedback during simulation.', 'โหมดจำลองสอบจะยังไม่เฉลยระหว่างทำ')}</small>
    </div>
  )
}

function Analytics({
  state,
  startLesson,
}: {
  state: TrainerState
  startLesson: (skill: SkillId) => void
}) {
  const lang = useLanguage()
  const skills = useMemo(() => (
    Object.entries(state.skills)
      .map(([id, skill]) => ({ id: id as SkillId, ...skill! }))
      .sort((a, b) => a.mastery - b.mastery)
  ), [state.skills])
  const weak = skills.slice(0, 4)
  const recentMistakes = state.attempts.filter(a => !a.correct).slice(0, 6)
  const trend = improvement(state)
  const series = dailyAccuracySeries(state)
  const readinessData = readinessReport(state)

  return (
    <div className="screen analytics-screen">
      <div className="profile-title"><h1>{L(lang, 'My Progress', 'ความก้าวหน้าของฉัน')}</h1><span>{state.totalAnswered} {L(lang, 'answered', 'ข้อที่ทำแล้ว')}</span></div>
      <section className="profile-card">
        <Mascot size={72} />
        <div className="profile-copy">
          <b>{state.totalAnswered ? localizedTier(learnerTier(state), lang) : L(lang, 'No learning data yet', 'ยังไม่มีข้อมูลการเรียน')}</b>
          <span>{state.totalAnswered
            ? L(lang, `${recentAccuracy(state)}% recent accuracy · ${studyStreak(state)} day streak`, `ความถูกต้องล่าสุด ${recentAccuracy(state)}% · ต่อเนื่อง ${studyStreak(state)} วัน`)
            : L(lang, 'Complete your first practice set to create your profile.', 'ทำชุดแรกให้เสร็จเพื่อสร้างโปรไฟล์ระดับของคุณ')}</span>
          <Progress value={state.totalAnswered ? recentAccuracy(state) : 0} />
          <small>{state.totalAnswered
            ? L(lang, `Next focus: ${skillLabels[nextFocusSkill(state)]}`, `หัวข้อถัดไปที่ควรเน้น: ${localizedSkill(nextFocusSkill(state), lang)}`)
            : L(lang, 'Your weak points and review plan will appear here.', 'จุดอ่อนและแผนทบทวนจะปรากฏตรงนี้หลังเริ่มฝึก')}</small>
        </div>
      </section>

      <section className="readiness-card">
        <div className="readiness-head">
          <div>
            <span>{L(lang, 'EXAM READINESS', 'ความพร้อมก่อนสอบ')}</span>
            <h2>{readinessData.score}%</h2>
          </div>
          <b>{L(lang, 'Evidence', 'ข้อมูลที่เก็บแล้ว')} {readinessData.evidenceCoverage}%</b>
        </div>
        <Progress value={readinessData.score} />
        <p>{L(
          lang,
          'This is a training-readiness score, not a guaranteed TOEIC result. Reach the gates below to remove blind spots before exam day.',
          'คะแนนนี้คือความพร้อมจากข้อมูลการฝึก ไม่ใช่การรับประกันคะแนน TOEIC เป้าหมายคือทำ Gate ด้านล่างให้ครบเพื่อลดจุดบอดก่อนวันสอบ',
        )}</p>
        <div className="readiness-gates">
          {readinessData.gates.map(gate => (
            <div className={gate.passed ? 'readiness-gate passed' : 'readiness-gate'} key={gate.key}>
              <span>{gate.passed ? '✓' : '○'}</span>
              <div><b>{localizedGateLabel(gate.key, gate.label, lang)}</b><small>{gate.current}/{gate.target}</small></div>
            </div>
          ))}
        </div>
        {!!readinessData.nextActions.length && (
          <div className="readiness-next">
            <strong>{L(lang, 'Next best actions', 'สิ่งที่ควรทำต่อ')}</strong>
            {readinessData.nextActions.slice(0, 3).map(action => <span key={action}>• {localizedNextAction(action, lang)}</span>)}
          </div>
        )}
      </section>

      <SectionTitle title={L(lang, 'Skill Mastery', 'ความแม่นแต่ละหัวข้อ')} />
      <section className="mastery-list">
        {skills.length ? skills.slice(0, 10).map(skill => (
          <button key={skill.id} onClick={() => lessonBySkill[skill.id] && startLesson(skill.id)}>
            <span className="skill-icon">{lessonBySkill[skill.id]?.icon ?? '•'}</span>
            <div><b>{localizedSkill(skill.id, lang)}</b><Progress value={skill.mastery} /></div>
            <strong>{Math.round(skill.mastery)}%</strong>
          </button>
        )) : <div className="empty-state">{L(lang, 'Complete a few questions to build your skill map.', 'ทำโจทย์สักเล็กน้อยก่อน เพื่อให้ระบบสร้างแผนที่ทักษะของคุณ')}</div>}
      </section>

      <section className="chart-card">
        <div className="chart-title"><div><h2>{L(lang, 'Recent Accuracy', 'ความถูกต้องล่าสุด')}</h2><small>{L(lang, 'Last 14 days', '14 วันที่ผ่านมา')}</small></div><span>{recentAccuracy(state)}% <b>{trend.delta >= 0 ? '+' : ''}{trend.delta}</b></span></div>
        <AccuracyChart values={series} />
      </section>

      <SectionTitle title={L(lang, 'Weak Points', 'จุดที่ยังอ่อน')} />
      <section className="weak-list-mobile">
        {weak.length ? weak.map(skill => (
          <button key={skill.id} onClick={() => lessonBySkill[skill.id] && startLesson(skill.id)}>
            <span>{localizedSkill(skill.id, lang)}</span>
            <Progress value={skill.mastery} />
            <b>{Math.round(skill.mastery)}%</b>
          </button>
        )) : <div className="empty-state">{L(lang, 'No weak-point data yet.', 'ยังไม่มีข้อมูลจุดอ่อน')}</div>}
      </section>

      <SectionTitle title={L(lang, 'Recent Mistakes', 'ข้อที่พลาดล่าสุด')} />
      <section className="mistake-list">
        {recentMistakes.length ? recentMistakes.map((attempt, i) => (
          <button
            key={`${attempt.at}-${i}`}
            onClick={() => lessonBySkill[attempt.skills[0]] && startLesson(attempt.skills[0])}
          >
            <span className="mistake-icon">×</span>
            <div><b>Part {attempt.part} · {attempt.skills.map(s => localizedSkill(s, lang)).join(' / ')}</b><small>{attempt.errorReason ? `${L(lang, 'Reason', 'สาเหตุ')}: ${attempt.errorReason} · ` : ''}{Math.round(attempt.elapsedMs / 1000)}s</small></div>
            <strong>{lessonBySkill[attempt.skills[0]] ? L(lang, 'Review', 'ทบทวน') : L(lang, 'Saved', 'บันทึกแล้ว')}</strong>
          </button>
        )) : <div className="empty-state">{L(lang, 'No mistakes yet.', 'ยังไม่มีข้อที่พลาด')}</div>}
      </section>

    </div>
  )
}

function ReviewDue({ state, startLesson }: { state: TrainerState; startLesson: (skill: SkillId) => void }) {
  const lang = useLanguage()
  const due = dueLessonSkills(state)
  return (
    <div className="screen learn-screen">
      <div className="screen-intro">
        <span className="tiny-label">{L(lang, 'SPACED REVIEW', 'ทบทวนแบบเว้นระยะ')}</span>
        <h1>{L(lang, 'Keep weak patterns from fading.', 'ทวนจุดที่ยังอ่อนก่อนจะลืม')}</h1>
        <p>{L(lang, 'Lessons reappear after 1–3 days depending on your mastery-check score.', 'บทเรียนจะกลับมาให้ทวนอีกใน 1–3 วัน ตามคะแนนแบบวัดความแม่นของคุณ')}</p>
      </div>
      <div className="lesson-list">
        {due.length ? due.map(skill => {
          const lesson = lessonBySkill[skill]
          if (!lesson) return null
          const assessment = skillAssessment(state, skill)
          const lessonText = localizedLesson(lesson, lang)
          return <button className="lesson-card recommended" key={skill} onClick={() => startLesson(skill)}><span className="lesson-icon">{lesson.icon}</span><div className="lesson-card-copy"><b>{lessonText.title}</b><small>{L(lang, 'Review due now', 'ถึงเวลาทบทวนแล้ว')} · {localizedAssessmentLabel(assessment, lang)}</small><Progress value={assessment.value ?? Math.min(100, assessment.attempts / 3 * 100)} /></div><strong>›</strong></button>
        }) : <div className="empty-state">{L(lang, 'Nothing is due right now. Keep practicing and the review queue will schedule itself.', 'ตอนนี้ยังไม่มีบทที่ถึงเวลาทบทวน ฝึกต่อไปแล้วระบบจะจัดคิวทบทวนให้เอง')}</div>}
      </div>
    </div>
  )
}

function dailyAccuracySeries(state: TrainerState) {
  const values: number[] = []
  for (let offset = 13; offset >= 0; offset -= 1) {
    const d = new Date()
    d.setDate(d.getDate() - offset)
    const key = todayKey(d.getTime())
    const attempts = state.attempts.filter(a => todayKey(a.at) === key)
    values.push(attempts.length ? Math.round(attempts.filter(a => a.correct).length / attempts.length * 100) : 0)
  }
  return values
}

function AccuracyChart({ values }: { values: number[] }) {
  const width = 320
  const height = 120
  const points = values.map((value, index) => {
    const x = 8 + index * ((width - 16) / Math.max(1, values.length - 1))
    const y = height - 8 - value / 100 * (height - 22)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg className="accuracy-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Recent accuracy trend">
      <line x1="8" y1="20" x2={width - 8} y2="20" />
      <line x1="8" y1="60" x2={width - 8} y2="60" />
      <line x1="8" y1="100" x2={width - 8} y2="100" />
      <polyline points={points} fill="none" />
      {values.map((value, index) => {
        const x = 8 + index * ((width - 16) / Math.max(1, values.length - 1))
        const y = height - 8 - value / 100 * (height - 22)
        return <circle key={index} cx={x} cy={y} r="3" />
      })}
    </svg>
  )
}

function Progress({ value }: { value: number }) {
  return <div className="progress"><span style={{ width: pct(value) }} /></div>
}

function Mascot({ size = 72 }: { size?: number }) {
  return (
    <svg className="mascot" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 18 C43 10 43 5 50 2 C52 8 55 12 61 15" fill="none" stroke="#21b777" strokeWidth="5" strokeLinecap="round" />
      <path d="M51 8 C42 4 36 7 35 15 C44 16 49 13 51 8Z" fill="#55ce8c" />
      <circle cx="50" cy="56" r="34" fill="#eaf8ff" stroke="#6bbaf3" strokeWidth="3" />
      <path d="M18 58 C22 38 34 26 50 24 C66 27 79 39 82 58 C77 80 66 90 50 91 C34 90 23 80 18 58Z" fill="#ffffff" />
      <path d="M18 58 C23 43 31 34 39 30 C34 47 34 69 40 87 C29 83 21 73 18 58Z" fill="#59aef0" opacity=".85" />
      <path d="M82 58 C77 43 69 34 61 30 C66 47 66 69 60 87 C71 83 79 73 82 58Z" fill="#59aef0" opacity=".85" />
      <circle cx="40" cy="55" r="3.3" fill="#18304d" />
      <circle cx="60" cy="55" r="3.3" fill="#18304d" />
      <path d="M44 66 Q50 71 56 66" fill="none" stroke="#18304d" strokeWidth="2.7" strokeLinecap="round" />
      <circle cx="33" cy="65" r="4" fill="#ffd1c9" opacity=".8" />
      <circle cx="67" cy="65" r="4" fill="#ffd1c9" opacity=".8" />
      <path d="M36 75 Q50 68 64 75 L61 88 Q50 84 39 88Z" fill="#3d7eea" />
      <path d="M50 72 V85" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}

export default App
