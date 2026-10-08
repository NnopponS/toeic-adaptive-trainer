import { createContext, useContext, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import './App.css'
import {
  addFeedbackToLatest,
  attemptsToday,
  classifyAttempt,
  completeLesson,
  completeReadingSample,
  dailyTargets,
  daysToExam,
  dueLessonSkills,
  emptyState,
  improvement,
  learnerTier,
  markVocabReview,
  nextFocusSkill,
  normalizeState,
  partAccuracy,
  pickAdaptiveQuestion,
  questionsForSkill,
  questionTargetMs,
  recentAccuracy,
  readinessReport,
  recordAttempt,
  skillAssessment,
  studyStreak,
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
import { chaptersForQuestion, chaptersForSkill } from './courseGuide'
import { courseCards, courseSources, courseSkills, cardIsDue, recallForQuestion, type CourseCard } from './courseCards'
import { grammarClasses, grammarFunctions, reviewedGrammar } from './grammarGuide'
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
  AttemptDiagnosis,
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
const sandbox = import.meta.env.DEV && typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('sandbox')
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
  return Math.max(state.modifiedAt ?? 0,state.attempts[0]?.at ?? 0,...Object.values(state.vocabReview).map(review=>review.lastAt ?? 0),...Object.values(state.lessonResults).map(result=>result?.lastCompletedAt ?? 0))
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

function speedDiagnosisCopy(diagnosis: AttemptDiagnosis, lang: Language) {
  const labels: Record<AttemptDiagnosis, [string, string]> = {
    'on-target': ['On target', 'อยู่ในเวลาเป้า'],
    'correct-slow': ['Correct but slow', 'ถูกแต่ช้าเกินเป้า'],
    'knowledge-gap': ['Knowledge gap', 'ยังไม่แม่นเนื้อหา'],
    rushed: ['Rushed', 'รีบเกินไป'],
    uncertain: ['Correct but uncertain', 'ถูกแต่ยังไม่มั่นใจ'],
    'fast-guess': ['Fast guess', 'ตอบเร็วแบบเดา'],
  }
  return labels[diagnosis][lang === 'th' ? 1 : 0]
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
  return question.explanation
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
  estimate: { pos:'verb / noun', en:'estimate = calculate an approximate amount', th:'estimate = ประมาณ/คาดคะเนจำนวนหรือค่าใช้จ่าย' },
  esteem: { pos:'verb / noun', en:'esteem = respect or admire someone/something', th:'esteem = ยกย่อง/เคารพ ไม่ได้แปลว่า “ประมาณค่าใช้จ่าย”' },
  establishing: { pos:'V-ing', en:'establishing = creating or setting something up', th:'establishing = การกำลังก่อตั้ง/จัดตั้ง เป็นรูป V-ing' },
  estate: { pos:'noun', en:'estate = property, land, or the assets of a person', th:'estate = ทรัพย์สิน/ที่ดิน/กองมรดก เป็นคำนาม' },
  recall: { pos:'noun / verb', en:'product recall = withdrawal of an unsafe product', th:'recall ใน product recall = การเรียกคืนสินค้า' },
  returning: { pos:'V-ing', en:'returning = coming or sending back', th:'returning = การกลับ/การส่งคืน เป็น V-ing' },
  retreat: { pos:'noun / verb', en:'retreat = move back or a withdrawal, not a product recall', th:'retreat = การถอย/ล่าถอย ไม่ใช้กับการเรียกคืนสินค้า' },
  receipt: { pos:'noun', en:'receipt = proof that payment or goods were received', th:'receipt = ใบเสร็จ/หลักฐานการรับ' },
  launch: { pos:'verb / noun', en:'launch a program = introduce or start it', th:'launch a program = เปิดตัว/เริ่มโครงการ' },
  land: { pos:'verb / noun', en:'land = arrive on the ground or obtain something', th:'land = ลงจอด/ได้มา ไม่ใช้ว่าเปิดตัวโครงการ' },
  lend: { pos:'verb', en:'lend = give something temporarily', th:'lend = ให้ยืม' },
  leave: { pos:'verb / noun', en:'leave = go away or allow something to remain', th:'leave = ออกไป/ปล่อยไว้' },
  streamline: { pos:'verb', en:'streamline a process = make it simpler and more efficient', th:'streamline a process = ทำกระบวนการให้กระชับและมีประสิทธิภาพขึ้น' },
  stream: { pos:'noun / verb', en:'stream = a flow, or transmit media continuously', th:'stream = กระแส/สตรีมข้อมูล ไม่ได้แปลว่าปรับกระบวนการให้คล่องตัว' },
  straight: { pos:'adjective / adverb', en:'straight = direct or not curved', th:'straight = ตรง/โดยตรง เป็น Adj./Adv. ไม่ใช่กริยาในตำแหน่งนี้' },
  strength: { pos:'noun', en:'strength = power or a strong quality', th:'strength = ความแข็งแรง/จุดแข็ง เป็นคำนาม' },
  report: { pos:'verb / noun', en:'report a problem = formally tell someone about it', th:'report a problem = รายงาน/แจ้งปัญหา' },
  repeat: { pos:'verb', en:'repeat = say or do again', th:'repeat = ทำ/พูดซ้ำ' },
  reply: { pos:'verb / noun', en:'reply = answer; normally reply to a message/person', th:'reply = ตอบกลับ มักใช้ reply to ...' },
  return: { pos:'verb / noun', en:'return = go/give back', th:'return = กลับ/คืน' },
  replace: { pos:'verb', en:'replace damaged items = substitute new items for damaged ones', th:'replace damaged items = เปลี่ยนของที่เสียด้วยของใหม่' },
  reserve: { pos:'verb', en:'reserve = book or keep for future use', th:'reserve = จอง/กันไว้' },
  recover: { pos:'verb', en:'recover = get back or become well again', th:'recover = ฟื้นตัว/กู้คืน' },
  convenience: { pos:'noun', en:'for the convenience of = to make something easier for someone', th:'convenience = ความสะดวก; for the convenience of = เพื่อความสะดวกของ...' },
  conviction: { pos:'noun', en:'conviction = a strong belief or a criminal judgment', th:'conviction = ความเชื่อมั่น/คำพิพากษาว่ามีความผิด' },
  conversion: { pos:'noun', en:'conversion = changing from one form to another', th:'conversion = การเปลี่ยนรูป/การแปลง' },
  conversation: { pos:'noun', en:'conversation = a spoken exchange between people', th:'conversation = การสนทนา' },
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

const vocabGlossaryTh: Record<string, string> = {
  promptly:'อย่างรวดเร็ว / โดยทันที',
  prompt:'รวดเร็ว / ทันที',
  clear:'ชัดเจน (Adj.)',
  clearly:'อย่างชัดเจน (Adv.)',
  clarity:'ความชัดเจน (N.)',
  clarify:'ทำให้ชัดเจน (V.)',
  review:'การทบทวน / ทบทวน',
  reviewer:'ผู้ทบทวน / ผู้ตรวจ',
  reviewing:'กำลังทบทวน (V-ing)',
  reviewed:'ถูกทบทวนแล้ว / ทบทวนแล้ว (V2/V3)',
  satisfactorily:'อย่างน่าพอใจ',
  satisfaction:'ความพึงพอใจ',
  carefully:'อย่างระมัดระวัง',
  care:'ความระมัดระวัง / การดูแล',
  contain:'บรรจุ / ประกอบด้วย',
  contact:'ติดต่อ',
  conduct:'ดำเนินการ',
  dependent:'ขึ้นอยู่กับ / ต้องพึ่งพา',
  subject:'อยู่ภายใต้ / มีแนวโน้มที่จะ (ในวลี subject to)',
  inconsistency:'ความไม่สอดคล้องกัน',
  inconvenience:'ความไม่สะดวก',
  productivity:'ผลิตภาพ / ประสิทธิผลในการทำงาน',
  notification:'การแจ้งเตือน',
  realistic:'สมจริง / เป็นไปได้จริง',
  strict:'เข้มงวด',
  strictly:'อย่างเคร่งครัด',
  appealing:'น่าดึงดูด',
  appeal:'ดึงดูด / การอุทธรณ์',
  recall:'การเรียกคืนสินค้า',
  receipt:'ใบเสร็จ',
  retreat:'การถอย / ล่าถอย',
  estimate:'ประมาณ / ประเมิน',
  esteem:'ยกย่อง / เคารพ',
  estate:'ทรัพย์สิน / ที่ดิน / กองมรดก',
  streamline:'ทำให้กระชับและมีประสิทธิภาพขึ้น',
  proof:'หลักฐาน',
  permission:'การอนุญาต',
  approval:'การอนุมัติ',
  advice:'คำแนะนำ',
  postpone:'เลื่อนออกไป',
  preserve:'เก็บรักษา',
  predict:'คาดการณ์',
  purchase:'ซื้อ',
  raise:'เพิ่ม / ยกระดับ (ต้องมีกรรม)',
  rise:'เพิ่มขึ้น (ไม่รับกรรม)',
  arise:'เกิดขึ้น',
  outline:'สรุปโครง / ระบุใจความสำคัญ',
  outlines:'ระบุ / สรุปขอบเขต',
  outweighs:'มีน้ำหนักมากกว่า / สำคัญกว่า',
  unavailable:'ไม่พร้อมใช้งาน / ไม่มี',
  concise:'กระชับ',
  convenient:'สะดวก',
  conveniently:'อย่างสะดวก',
  initiative:'โครงการริเริ่ม',
  accommodate:'รองรับ / จัดให้ตามความต้องการ',
  fulfill:'ทำให้สำเร็จ / ตอบสนองคำขอ',
  expand:'ขยายขอบเขต',
  relocate:'ย้ายสถานที่',
  select:'เลือก',
  effect:'ผล / ในวลี take effect = เริ่มมีผล',
  affect:'ส่งผลกระทบ',
  engaging:'น่าสนใจ / ชวนติดตาม',
  provide:'ให้ / จัดให้',
  limited:'มีจำนวนจำกัด',
  encouraged:'ได้รับการแนะนำ / ส่งเสริม',
  phase:'ช่วง / ระยะ',
  phased:'เป็นช่วง ๆ / เป็นขั้นตอน',
  credit:'ยอดเครดิต / เงินที่นำไปหักได้',
  credited:'ถูกนำไปหักยอด / นับเป็นเงินที่ชำระแล้ว',
  cover:'ทำแทน / รับช่วงแทน',
  uninterrupted:'ต่อเนื่องโดยไม่ขาดช่วง',
}

const vocabPosOverrides: Record<string, string> = {
  promptly:'adverb', prompt:'adjective / noun', clear:'adjective', clearly:'adverb', clarity:'noun', clarify:'verb',
  review:'noun / verb', reviewer:'noun', reviewing:'V-ing', reviewed:'V2 / V3',
  satisfactorily:'adverb', satisfaction:'noun',
  carefully:'adverb', care:'noun / verb', dependent:'adjective', subject:'adjective / noun / verb',
  inconsistency:'noun', inconvenience:'noun', productivity:'noun', notification:'noun',
  realistic:'adjective', strictly:'adverb', appealing:'adjective', recall:'noun / verb',
  estimate:'verb / noun', esteem:'verb / noun', estate:'noun', proof:'noun',
  postpone:'verb', preserve:'verb', predict:'verb', purchase:'verb / noun',
  raise:'verb', rise:'verb / noun', arise:'verb', concise:'adjective',
  unavailable:'adjective', initiative:'noun', accommodate:'verb', fulfill:'verb',
  expand:'verb', relocate:'verb', select:'verb', effect:'noun', affect:'verb',
  limited:'adjective', encouraged:'past participle / adjective', phased:'adjective / past participle',
  credited:'past participle / verb', cover:'verb', uninterrupted:'adjective',
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
    } else if (/\bthan\b/i.test(after)) {
      needed = L(lang, 'a comparative adjective or adverb', 'Adj. หรือ Adv. ขั้นกว่า')
      memory = L(lang, 'Comparative (-er / more + adjective or adverb) + than', 'ขั้นกว่า (-er / more + Adj. หรือ Adv.) + than')
      steps.push(
        L(lang, 'Locate “than” after the blank.', 'เห็น than หลังช่องว่าง → มีการเปรียบเทียบ'),
        L(lang, 'Choose a comparative; use an adjective for a noun/state, an adverb for an action.', 'เลือกรูปขั้นกว่า แล้วดูว่าขยายคำนาม/บอกสภาพ (Adj.) หรือขยายการกระทำ (Adv.)'),
        localizedQuestionExplanation(question, lang),
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


type BlankRequirement = {
  labelEn: string
  labelTh: string
  accepts: (pos: string) => boolean
  clueEn: string
  clueTh: string
}

function blankRequirement(question: Question): BlankRequirement | null {
  const stem = question.stem
  if (question.ruleId === 'gerund.after-preposition' || /\b(?:committed|accustomed|used|object|look forward)\s+to\s+_{3,}/i.test(stem)) {
    return {
      labelEn: 'noun or gerund after a preposition', labelTh: 'N. หรือ V-ing หลัง preposition',
      accepts: pos => /noun|ing|gerund/i.test(pos),
      clueEn: 'This to belongs to a preposition phrase, not an infinitive.',
      clueTh: 'to ในวลีนี้เป็น preposition จึงตามด้วย N. / V-ing ไม่ใช่ V1',
    }
  }
  if (/\b(should|can|could|will|would|may|might|must|shall)\s+_{3,}/i.test(stem)) {
    const modal = stem.match(/\b(should|can|could|will|would|may|might|must|shall)\s+_{3,}/i)?.[1] ?? 'modal'
    return {
      labelEn:'base verb (V1)', labelTh:'กริยา V1',
      accepts:pos => /verb|V1/i.test(pos) && !/ing|participle|noun/i.test(pos),
      clueEn:'"' + modal + ' + ___" requires the base verb.',
      clueTh:'เห็น "' + modal + ' + ___" → หลัง modal ต้องเป็น V1',
    }
  }
  if (/\bto\s+_{3,}/i.test(stem)) {
    return {
      labelEn:'base verb (V1) after infinitive "to"', labelTh:'กริยา V1 หลัง infinitive "to"',
      accepts:pos => /verb/i.test(pos) && !/ing|participle/i.test(pos),
      clueEn:'This "to" introduces an infinitive, so the next word must be the base verb.',
      clueTh:'ตรงนี้ "to" เป็น infinitive marker → หลัง to ต้องเป็น V1 ไม่ใช่ N., Adj. หรือ V-ing',
    }
  }
  if (/\b(has|have|had)\s+_{3,}/i.test(stem)) {
    return {
      labelEn:'past participle (V3)', labelTh:'กริยา V3',
      accepts:pos => /V3|participle|verb/i.test(pos) && !/ing/i.test(pos),
      clueEn:'has/have/had + V3 forms the perfect tense.',
      clueTh:'เห็น has/have/had หน้า blank → ต้องตามด้วย V3',
    }
  }
  if (/\b(a|an|the|this|that|these|those|my|your|his|her|its|our|their)\s+_{3,}\s+[A-Za-z]/i.test(stem)) {
    return {
      labelEn:'adjective before the following noun', labelTh:'adjective เพื่อขยายคำนามด้านหลัง',
      accepts:pos => /adjective|Adj/i.test(pos),
      clueEn:'Determiner + ___ + noun usually requires an adjective in the blank.',
      clueTh:'เห็น determiner + blank + N. → blank ต้องเป็น Adj. เพื่อขยาย N.',
    }
  }
  return null
}

function preciseChoiceReason(question: Question, choiceId: string, lang: Language) {
  const choice = question.choices.find(c => c.id === choiceId)
  if (!choice) return ''
  const answer = question.choices.find(c => c.id === question.answer)
  const word = choice.text.toLowerCase()
  const lex = choiceLexicon[word]
  const pos = lex?.pos ?? inferWordClass(choice.text)
  const requirement = blankRequirement(question)
  const specific = question.whyOthers?.[choiceId]

  if (choiceId === question.answer) {
    const structure = requirement ? L(lang, requirement.clueEn, requirement.clueTh) + ' ' : ''
    const meaning = lex ? L(lang, lex.en, lex.th) + ' ' : ''
    return lang === 'th'
      ? '✓ ถูก: ' + structure + meaning + localizedQuestionExplanation(question, lang)
      : '✓ Correct: ' + structure + meaning + question.explanation
  }

  if (requirement && !requirement.accepts(pos)) {
    return lang === 'th'
      ? '✗ ตัดออกได้จาก Grammar ทันที: ' + requirement.clueTh + ' แต่ "' + choice.text + '" เป็น ' + pos + (lex ? ' — ' + lex.th : '')
      : '✗ Grammar eliminates this choice: ' + requirement.clueEn + ' But "' + choice.text + '" is ' + pos + (lex ? ' — ' + lex.en : '') + '.'
  }

  if (specific) {
    if (lang === 'en') return '✗ ' + specific
    return '✗ รูปคำอาจผ่าน Grammar แต่ความหมาย/การใช้ไม่ผ่าน: "' + choice.text + '"' + (lex ? ' = ' + lex.th : '') + ' ส่วนคำตอบ "' + (answer?.text ?? '') + '" ใช้ในประโยคนี้เพราะ ' + localizedQuestionExplanation(question, lang)
  }

  if (lex) {
    return lang === 'th'
      ? '✗ ' + (requirement ? 'รูปคำผ่านเงื่อนไข ' + requirement.labelTh + ' แต่' : '') + 'ความหมายไม่ตรง: ' + lex.th + ' ในขณะที่ประโยคต้องใช้ "' + (answer?.text ?? '') + '" — ' + localizedQuestionExplanation(question, lang)
      : '✗ ' + (requirement ? 'The blank needs ' + requirement.labelEn + '. ' : '') + lex.en + ', but the sentence needs "' + (answer?.text ?? '') + '": ' + question.explanation
  }

  return lang === 'th'
    ? '✗ "' + choice.text + '" เป็น ' + pos + '; ' + (requirement ? requirement.clueTh + ' ' : '') + 'คำตอบที่ถูกคือ "' + (answer?.text ?? '') + '" เพราะ ' + localizedQuestionExplanation(question, lang)
    : '✗ "' + choice.text + '" is ' + pos + '. ' + (requirement ? requirement.clueEn + ' ' : '') + 'The correct answer is "' + (answer?.text ?? '') + '" because ' + question.explanation
}

function explainChoice(question: Question, choiceId: string, analysis: QuestionAnalysis, lang: Language) {
  const choice = question.choices.find(c => c.id === choiceId)
  if (!choice) return ''
  const word = choice.text.toLowerCase()
  const correct = choice.id === question.answer
  const lex = choiceLexicon[word]
  const rule = question.ruleId ?? question.skills[0]
  const specific = question.whyOthers?.[choice.id]

  if (question.skills.includes('vocabulary') || question.skills.includes('collocation')) {
    return preciseChoiceReason(question, choiceId, lang)
  }

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
const grammarConjunctions = new Set(['and','but','or','nor','although','though','because','if','unless','while','whereas','when','whenever','before','after','since','once','whether','so','yet','as','than'])
const grammarPrepositions = new Set(['in','on','at','by','for','from','with','without','of','to','into','onto','over','under','between','among','through','throughout','during','despite','beside','near','within','across','about','against','around','behind','beyond','until','upon'])
const grammarAdverbs = new Set(['not','very','too','so','quite','rather','almost','nearly','only','also','already','still','just','even','more','most','less','least','well','soon','now','then','today','tomorrow','yesterday','here','there','approximately','especially','generally','normally','usually','often','always','never','immediately','currently','recently','finally','carefully','quickly','slowly','properly','efficiently','successfully','once','twice'])
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
  const number = question.stem.match(/\[(\d+)\]/)?.[1]
  const active = number ? new RegExp(`\\[${number}\\]\\s*_____`) : /_____/
  return (active.test(source) ? source.replace(active, answerText) : source.replace(/_____/, answerText))
    .replace(/^\[\d+\]\s*/, '')
}

function tokenizeGrammar(text: string): string[] {
  return text.match(/[A-Z](?:\.[A-Z])+\.?|[A-Za-z]+(?:-[A-Za-z]+)*(?:['’][A-Za-z]+|['’])?|\d+(?:[.,:]\d+)?|[–—-]|[^\sA-Za-z0-9]/g) ?? []
}

function basePos(word: string, previous = '', next = '') {
  const w = word.toLowerCase().replace(/[’]/g, "'")
  const p = previous.toLowerCase()
  const n = next.toLowerCase()

  if (/^[^A-Za-z0-9]+$/.test(word)) return 'Punct.'
  if (/^\d/.test(word)) return 'Number'
  if (grammarDeterminers.has(w)) return 'Det.'
  if (grammarPossessives.has(w)) return 'Poss. Det.'
  if (grammarPronouns.has(w)) return 'Pron.'
  if (grammarModals.has(w)) return 'Modal'
  if (grammarBe.has(w)) return 'V. be'
  if (grammarHave.has(w) || grammarDo.has(w)) return 'Aux./V.'
  if (['before','after','since','until'].includes(w) && (/ing$/.test(n) || grammarDeterminers.has(n))) return 'Prep.'
  if (grammarConjunctions.has(w)) return 'Conj.'
  if (grammarPrepositions.has(w)) return w === 'to' && (grammarModals.has(p) || p === '') ? 'to' : 'Prep.'
  if (/['’]s$/.test(word)) return 'Poss. N.'
  if (/ing$/.test(w) && (grammarPrepositions.has(p) || ['before','after','since'].includes(p))) return 'Gerund (N.)'
  if (grammarAdverbs.has(w) || /ly$/.test(w)) return 'Adv.'
  if (grammarAdjectives.has(w) || /(ous|ful|less|ive|able|ible|al|ic|ary|ory)$/.test(w)) return 'Adj.'
  if (grammarVerbLexicon.has(w) && (grammarDeterminers.has(p) || grammarPossessives.has(p))) return 'N.'
  if (grammarVerbLexicon.has(w) || /(ed|ing|ize|ise|ify)$/.test(w)) return 'V.'
  if (grammarModals.has(p) || (p === 'to' && !['look','forward','used','object'].includes(previous.toLowerCase()))) return 'V1'
  if (grammarHave.has(p)) return 'V3'
  if (grammarBe.has(p) && /ing$/.test(w)) return 'V-ing'
  if (grammarBe.has(p) && /(ed|en)$/.test(w)) return 'V3/Adj.'
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
  const source = contextText ?? question.stem
  const number = question.stem.match(/\[(\d+)\]/)?.[1]
  const activeBlank = number ? source.match(new RegExp(`\\[${number}\\]\\s*_____`)) : null
  const blankIndex = activeBlank?.index ?? source.indexOf('_____')
  const prefix = blankIndex < 0 ? '' : source.slice(0, blankIndex).replace(/^\[\d+\]\s*/, '').replace(/\[\d+\]\s*$/, '')
  const answerStart = blankIndex < 0 ? -1 : tokenizeGrammar(prefix).length
  const answerLength = tokenizeGrammar(answerText).length
  for (let i = answerStart; i >= 0 && i < answerStart + answerLength; i += 1) {
    if (words[i]) { words[i].answer = true; words[i].tone = 'answer' }
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
        for (let i = lastMarker + 1; i < head; i += 1) {
          if (words[i].pos === 'Det.' || words[i].pos === 'Poss. Det.') {
            words[i].role = L(lang, 'comparison target determiner', 'ตัวกำหนดของสิ่งที่นำมาเปรียบเทียบ')
            words[i].tone = 'object'
          } else if (words[i].pos === 'Adj.' || words[i].pos === 'Poss. N.' || words[i].pos === 'N.') {
            words[i].role = L(lang, 'comparison target modifier', 'คำขยายสิ่งที่นำมาเปรียบเทียบ')
            words[i].tone = 'object'
          }
        }
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

  const reviewed = reviewedGrammar[question.id]?.split(' ')
  const lexical = words.filter(word => !word.punctuation)
  if (reviewed?.length === lexical.length) {
    reviewed.forEach((tag, index) => {
      const [pos, role] = tag.split(':')
      lexical[index].pos = grammarClasses[pos]
      lexical[index].role = role ? grammarFunctions[role][lang === 'th' ? 0 : 1] : ''
    })
  }
  words.forEach((word, index) => {
    if (word.punctuation || word.role) return
    word.role = word.pos.includes('Det.') ? L(lang,'noun determiner','ตัวกำหนดนาม')
      : word.pos === 'Adv.' ? (words[index + 1]?.pos.startsWith('Adj.') ? L(lang,'adjective modifier','ขยาย Adj.') : L(lang,'verb/phrase modifier','ขยายกริยา/วลี'))
      : word.pos.startsWith('Adj.') ? L(lang,'noun/state modifier','ขยายนาม/บอกสภาพ')
      : word.pos === 'Prep.' ? L(lang,'introduces noun phrase','นำ noun phrase')
      : word.pos === 'Inf. to' ? L(lang,'introduces V1','นำ infinitive V1')
      : word.pos === 'Conj.' ? L(lang,'connects clauses','เชื่อมประโยค')
      : word.pos.includes('N.') ? L(lang,'noun in this phrase','นามในวลี')
      : word.pos === 'V1' ? L(lang,'infinitive verb','กริยา infinitive')
      : word.pos.startsWith('V') ? L(lang,'verb form','รูปกริยา') : L(lang,'word in this phrase','คำในวลี')
  })

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

function stepWordIndexes(question: Question, contextText: string | undefined, step: number, words: GrammarWord[]) {
  const indices = new Set<number>()
  const answerStart = words.findIndex(word => word.answer)
  if (step === 0) {
    words.forEach((word, index) => { if (/main subject|ประธานหลัก|ประธานแท้|main verb|กริยาหลัก|^auxiliary$|^กริยาช่วย$/.test(word.role) && !word.answer) indices.add(index) })
    return indices
  }
  if (step === 3) {
    words.forEach((word, index) => { if (word.answer) indices.add(index) })
    return indices
  }
  if (step === 2) {
    if (question.skills.includes('subject-verb')) {
      words.forEach((word, index) => { if (/subject|ประธาน/.test(word.role) || word.answer) indices.add(index) })
    } else {
      for (let index = Math.max(0, answerStart - 2); index <= Math.min(words.length - 1, answerStart + 2); index += 1) if (!words[index].punctuation) indices.add(index)
    }
    return indices
  }
  // ponytail: legacy questions use signal matching; authored focus phrases replace it as the bank is reviewed.
  const targets = question.coaching?.focus.length ? question.coaching.focus : ['than','since','by','until','despite','although','been','to']
  const tokens = words.map(word => word.text.toLowerCase())
  for (const target of targets) {
    const parts = tokenizeGrammar(target.toLowerCase()).filter(part => /^[a-z0-9]/i.test(part))
    for (let start = 0; start < tokens.length; start += 1) {
      if (parts.length && parts.every((part, offset) => tokens[start + offset] === part)) for (let offset = 0; offset < parts.length; offset += 1) indices.add(start + offset)
    }
  }
  if (!indices.size && answerStart >= 0) {
    if (answerStart > 0) indices.add(answerStart - 1)
    if (answerStart + 1 < words.length) indices.add(answerStart + 1)
  }
  void contextText
  return indices
}

// ponytail: flat clause spans from reviewed roles; author nested spans if needed.
function sentenceGroups(question: Question, words: GrammarWord[]) {
  const tags = reviewedGrammar[question.id]?.split(' ')
  const lexical = words.filter(word => !word.punctuation)
  if (!tags || tags.length !== lexical.length) return [{ tone: 'plain', words }]
  const tones = words.map(() => 'main')
  let tone = 'main'
  let lexicalIndex = 0
  words.forEach((word, index) => {
    if (word.punctuation) {
      tones[index] = tone
      if (/[,.;!?]/.test(word.text)) tone = 'main'
      return
    }
    const role = tags[lexicalIndex++].split(':')[1]
    if (['CL', 'RS', 'RV', 'RAUX', 'RO'].includes(role)) {
      if (tone === 'main' && role === 'RS') {
        for (let i = index - 1; i >= 0 && !words[i].punctuation && /determiner|modifier|ตัวกำหนด|ขยายนาม/.test(words[i].role); i--) tones[i] = 'subordinate'
      }
      tone = 'subordinate'
    } else if (role === 'RC') tone = 'phrase'
    else if (['S', 'V', 'AUX', 'O', 'C', 'OC'].includes(role)) {
      if (tone !== 'main' && role === 'S') {
        for (let i = index - 1; i >= 0 && !words[i].punctuation && /determiner|modifier|ตัวกำหนด|ขยายนาม/.test(words[i].role); i--) tones[i] = 'main'
      }
      tone = 'main'
    }
    tones[index] = tone
  })
  const groups: { tone: string; words: GrammarWord[] }[] = []
  words.forEach((word, index) => {
    if (groups.at(-1)?.tone !== tones[index]) groups.push({ tone: tones[index], words: [] })
    groups.at(-1)!.words.push(word)
  })
  return groups
}

function AnnotatedSentence({
  question,
  selected,
  contextText,
  checked = true,
  onBlankClick,
}: {
  question: Question
  selected: string
  contextText?: string
  checked?: boolean
  onBlankClick?: () => void
}) {
  const lang = useLanguage()
  const [inspectedWord, setInspectedWord] = useState<number | null>(null)
  const words = labelWords(question, contextText, lang)
  const highlights = checked ? stepWordIndexes(question, contextText, 1, words) : new Set<number>()
  const firstAnswer = words.findIndex(word => word.answer)
  const inspected = inspectedWord === null ? null : words[inspectedWord]
  const reviewed = reviewedGrammar[question.id]?.split(' ').length === words.filter(word => !word.punctuation).length
  if (!checked) {
    return (
      <h2 id={`sentence-${question.id}`} className="sentence-inline sentence-exam" aria-label={contextText ?? question.stem}>
        {words.map((word, index) => word.punctuation
          ? /^[,.;:!?]$/.test(word.text) && index > 0 && !words[index - 1].punctuation ? null : <span className="grammar-punctuation" key={`${word.text}-${index}`}>{word.text}</span>
          : word.answer && index !== firstAnswer ? null
            : word.answer
              ? onBlankClick
                ? <button type="button" className="exam-blank" key={`${word.text}-${index}`} onClick={onBlankClick} aria-label={L(lang,'Answer blank','ช่องว่างคำตอบ')}>_____</button>
                : <span className="exam-blank" key={`${word.text}-${index}`}>_____</span>
              : <span className="exam-word" key={`${word.text}-${index}`}>{word.text}{/^[,.;:!?]$/.test(words[index + 1]?.text ?? '') ? words[index + 1].text : ''}</span>)}
      </h2>
    )
  }
  return (
    <>
      <h2 id={`sentence-${question.id}`} className="sentence-inline sentence-grouped" aria-label={correctSentenceForMap(question, contextText)}>
        {sentenceGroups(question, words).map((group, groupIndex) => <span className={`clause-group clause-${group.tone}`} key={groupIndex}>
          {group.words.map(word => {
            const index = words.indexOf(word)
            return word.punctuation ? <span key={index}>{word.text} </span> : <span key={index} className={word.answer ? 'filled-answer' : highlights.has(index) ? 'clue-word' : ''}>{word.text}{words[index + 1]?.punctuation ? '' : ' '}</span>
          })}
        </span>)}
      </h2>
      {reviewed && <div className="clause-legend"><span className="clause-main">{L(lang,'Main clause','ประโยคหลัก')}</span><span className="clause-subordinate">{L(lang,'Subordinate clause','ประโยครอง')}</span><span className="clause-phrase">{L(lang,'Reduced phrase','วลีลดรูป')}</span></div>}
      <AnswerWalkthrough question={question} selected={selected} contextText={contextText} />
      {question.part < 7 && <details className="grammar-details"><summary>{L(lang,'Word roles','ดูชนิดและหน้าที่คำ')}</summary>
        <div className="grammar-detail-words">{words.map((word, index) => !word.punctuation && <button type="button" aria-pressed={inspectedWord === index} className="sentence-word" key={index} onClick={() => setInspectedWord(inspectedWord === index ? null : index)}><b>{word.text}</b><small className="word-pos">{word.pos}</small><small className="word-function">{word.role}</small></button>)}</div>
        {inspected && <p className="word-inspector">{inspected.text} · {inspected.pos} · {inspected.role}</p>}
        {!reviewed && <small className="grammar-estimate">{L(lang,'Automatic word labels may be inaccurate. Use the explanation to decide.','ป้ายคำอัตโนมัติอาจคลาดเคลื่อน ให้ยึดเฉลยในการตัดสิน')}</small>}
      </details>}
    </>
  )
}

function inspectionText(question: Question, choiceId: string, lang: Language) {
  const choice = question.choices.find(item => item.id === choiceId)
  if (!choice) return ''
  if (lang === 'th' && question.coaching?.choiceReasons[choiceId]) return question.coaching.choiceReasons[choiceId]
  if (choiceId === question.answer) return localizedQuestionExplanation(question, lang)
  if (question.whyOthers?.[choiceId]) return question.whyOthers[choiceId]
  if (question.part <= 6) {
    return explainChoice(question, choiceId, buildQuestionAnalysis(question, lang), lang)
  }
  return fallbackWrongExplanation(question, lang)
}

function ChoiceInspection({ question, choiceId }: { question: Question; choiceId: string }) {
  const lang = useLanguage()
  const correct = choiceId === question.answer
  const choice = question.choices.find(item => item.id === choiceId)
  const lex = choice ? choiceLexicon[choice.text.toLowerCase()] : undefined
  const pos = choice ? (lex?.pos ?? inferWordClass(choice.text)) : ''
  const meaningTh = question.choiceTranslationsTh?.[choiceId] ?? lex?.th
  return (
    <div className={correct ? 'choice-inspection correct' : 'choice-inspection wrong'}>
      <b>{correct ? L(lang,'Why this choice works','ทำไมตัวนี้ถูก') : L(lang,'Why this choice fails','ทำไมตัวนี้ผิด')}</b>
      {choice && question.part < 7 && !choice.text.includes(' ') && (
        <div className="choice-facts">
          <span><strong>{L(lang,'Word class','ชนิดคำ')}:</strong> {pos}</span>
          {lang === 'th' && meaningTh && <span><strong>ความหมาย:</strong> {meaningTh}</span>}
        </div>
      )}
      <p>{inspectionText(question, choiceId, lang)}</p>
      {question.part === 7 && question.evidence && correct && (
        <small><strong>{L(lang,'Evidence','หลักฐาน')}:</strong> “{question.evidence}”</small>
      )}
    </div>
  )
}


if (import.meta.env.DEV) {
  const grammarMapSelfCheck: Question = {
    id:'grammar-map-self-check',
    part:5,
    stem:'The new warehouse is nearly twice as large _____ the company’s previous facility.',
    choices:[
      {id:'A',text:'than'},{id:'B',text:'as'},{id:'C',text:'like'},{id:'D',text:'from'},
    ],
    answer:'B',
    skills:['comparison'],
    difficulty:2,
    explanation:'twice as + adjective + as',
    ruleId:'comparison.patterns',
  }
  const tags = labelWords(grammarMapSelfCheck, grammarMapSelfCheck.stem, 'en')
  const byText = (value:string) => tags.filter(item => item.text.toLowerCase() === value.toLowerCase())
  console.assert(
    byText('warehouse').some(item => item.role.includes('SUBJECT'))
      && byText('is').some(item => item.role.includes('verb'))
      && byText('nearly').some(item => item.pos === 'Adv.')
      && byText('twice').some(item => item.role === 'multiplier')
      && byText('large').some(item => item.pos === 'Adj.')
      && byText('as').some(item => item.answer)
      && byText('facility').some(item => item.role.includes('comparison target')),
    'word-level grammar map self-check failed',
  )
}

function AnswerWalkthrough({ question, selected, contextText }: { question: Question; selected: string; contextText?: string }) {
  const lang = useLanguage()
  const authored = lang === 'th' ? question.coaching : undefined
  const clues = authored?.focus ?? (question.evidence ? [question.evidence] : [])
  const reason = inspectionText(question, question.answer, lang)
  const memory = authored?.memory ?? (question.part < 7 ? spottingRules(question, contextText, lang)[0] : undefined)
  return (
    <div className="answer-summary">
      {clues.length > 0 && <p><b>{L(lang,'Look for','จุดสังเกต')}:</b> {clues.map((clue, index) => <span key={clue}>{index > 0 && ' · '}<u>{clue}</u></span>)}</p>}
      <p><b>{L(lang,'Why it works','เหตุผลที่ถูก')}:</b> {reason}</p>
      {selected && selected !== question.answer && <p className="choice-trap"><b>{L(lang,'Your choice','ตัวที่คุณเลือก')}:</b> {inspectionText(question, selected, lang)}</p>}
      {memory && memory !== reason && <p className="memory-line"><b>{L(lang,'Remember','จำสั้น ๆ')}:</b> {memory}</p>}
      {question.translationTh && lang === 'th' && <details><summary>แปลประโยค</summary><p>{question.translationTh}</p></details>}
    </div>
  )
}

function lineKey(row: string[], index: number) {
  return `${index}-${row.join('-')}`
}


type VocabCard = {
  key: string
  word: string
  meaningTh: string
  pos: string
  correctWord: string
  correctMeaningTh: string
  sentence: string
  explanation: string
  mistakes: number
  lastAt: number
  trigger: 'missed' | 'uncertain'
}

function normalizedVocabKey(word: string) {
  return word.trim().toLowerCase()
}

function isUsefulVocabQuestion(question: Question) {
  if (question.skills.includes('vocabulary')) return true
  if (question.choiceTranslationsTh && Object.keys(question.choiceTranslationsTh).length) return true
  const commonFunctionWords = new Set(['to','for','at','with','by','in','on','of','from','as','than','during','after','before'])
  if (question.skills.includes('collocation')) {
    return question.choices.some(choice => choice.text.length > 4 && !commonFunctionWords.has(choice.text.toLowerCase()))
  }
  if (question.skills.includes('part-of-speech')) {
    return question.choices.some(choice => Boolean(vocabGlossaryTh[normalizedVocabKey(choice.text)]))
  }
  return false
}

function choiceMeaningTh(question: Question, choiceId: string) {
  const choice = question.choices.find(item => item.id === choiceId)
  if (!choice) return ''
  const explicit = question.choiceTranslationsTh?.[choiceId]
  if (explicit) return explicit
  const key = normalizedVocabKey(choice.text)
  return choiceLexicon[key]?.th ?? vocabGlossaryTh[key] ?? ''
}

function choicePosLabel(choiceText: string) {
  const key = normalizedVocabKey(choiceText)
  return choiceLexicon[key]?.pos ?? vocabPosOverrides[key] ?? inferWordClass(choiceText)
}

function buildVocabCards(
  state: TrainerState,
  questionMap: Record<string, Question>,
  passageMap: Record<string, Passage>,
): VocabCard[] {
  const cards = new Map<string, VocabCard>()
  for (const attempt of state.attempts) {
    const reinforcement = attempt.correct && attempt.vocabReviewApplied && (attempt.confidence ?? 3) < 3
    if (attempt.correct && !reinforcement) continue
    const question = questionMap[attempt.questionId]
    if (!question || (!isUsefulVocabQuestion(question) && attempt.errorReason !== 'vocabulary')) continue
    const selectedChoice = question.choices.find(choice => choice.id === attempt.selected)
    const answerChoice = question.choices.find(choice => choice.id === question.answer)
    if (!selectedChoice || !answerChoice) continue
    const focusChoice = attempt.correct ? answerChoice : selectedChoice
    const key = normalizedVocabKey(focusChoice.text)
    const existing = cards.get(key)
    const passage = question.passageId ? passageMap[question.passageId] : undefined
    const context = passage
      ? activeContextForBlank(passage.body, question.stem)
      : question.stem
    const sentence = correctSentenceForMap(question, context)
    const next: VocabCard = {
      key,
      word:focusChoice.text,
      meaningTh:choiceMeaningTh(question, focusChoice.id) || 'คำนี้ยังไม่มีคำแปลเฉพาะในคลัง — ระบบจะเก็บไว้ให้เพิ่มคำแปลเมื่อพบซ้ำ',
      pos:choicePosLabel(selectedChoice.text),
      correctWord:answerChoice.text,
      correctMeaningTh:choiceMeaningTh(question, answerChoice.id) || vocabGlossaryTh[normalizedVocabKey(answerChoice.text)] || '',
      sentence,
      explanation:localizedQuestionExplanation(question, 'th'),
      mistakes:(existing?.mistakes ?? 0) + (attempt.correct ? 0 : 1),
      lastAt:Math.max(existing?.lastAt ?? 0, attempt.at),
      trigger:attempt.correct ? 'uncertain' : 'missed',
    }
    cards.set(key, next)
  }
  return [...cards.values()].sort((a,b) => {
    const ar=state.vocabReview?.[a.key]; const br=state.vocabReview?.[b.key]
    const ap=a.mistakes*4+(ar?.hard??0)*3+Math.max(0,(ar?.seen??0)-(ar?.known??0))
    const bp=b.mistakes*4+(br?.hard??0)*3+Math.max(0,(br?.seen??0)-(br?.known??0))
    return bp-ap || b.lastAt-a.lastAt
  })
}

function VocabReview({
  state,
  setState,
  questionMap,
  passageMap,
  onBack,
}: {
  state: TrainerState
  setState: StateSetter
  questionMap: Record<string, Question>
  passageMap: Record<string, Passage>
  onBack: () => void
}) {
  const lang = useLanguage()
  const cards = useMemo(() => buildVocabCards(state, questionMap, passageMap), [state, questionMap, passageMap])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  if (!cards.length) {
    return (
      <div className="screen vocab-screen">
        <button className="round-back" onClick={onBack}>‹</button>
        <div className="empty-state">{L(lang,'No missed vocabulary yet. Words you miss will automatically become flashcards here.','ยังไม่มีคำศัพท์ที่ตอบผิด คำศัพท์ที่คุณพลาดจะถูกสร้างเป็น Flashcard อัตโนมัติที่นี่')}</div>
      </div>
    )
  }

  const card = cards[index % cards.length]
  const review = state.vocabReview?.[card.key]
  const next = (knewIt:boolean) => {
    setState(current => markVocabReview(current, card.key, knewIt))
    setRevealed(false)
    setIndex(current => (current + 1) % cards.length)
  }

  return (
    <div className="screen vocab-screen">
      <div className="vocab-topbar">
        <button className="round-back" onClick={onBack}>‹</button>
        <div>
          <span>{L(lang,'VOCAB REPAIR','ซ่อมจุดอ่อนคำศัพท์')}</span>
          <b>{index % cards.length + 1}/{cards.length} {L(lang,'missed words','คำที่เคยพลาด')}</b>
        </div>
        <span className="vocab-count">{card.mistakes}×</span>
      </div>

      <section className={revealed ? 'flashcard revealed' : 'flashcard'} onClick={() => setRevealed(true)}>
        <div className="flashcard-front">
          <small>{card.trigger === 'missed' ? L(lang,'YOU PREVIOUSLY CHOSE','คำที่คุณเคยเลือกผิด') : L(lang,'REINFORCE THIS WORD','คำที่ตอบถูกแต่ยังลังเล')}</small>
          <h1>{card.word}</h1>
          <span>{card.pos}</span>
          {!revealed && <button>{L(lang,'Tap to reveal','แตะเพื่อดูความหมาย')}</button>}
        </div>
        {revealed && (
          <div className="flashcard-back">
            <div className="flash-meaning">
              <span>{L(lang,'Meaning','ความหมาย')}</span>
              <b>{lang === 'th' ? card.meaningTh : card.word}</b>
            </div>
            <div className="flash-contrast">
              <span>{L(lang,'Correct answer in that question','คำที่ถูกในโจทย์เดิม')}</span>
              <b>{card.correctWord}</b>
              {lang === 'th' && card.correctMeaningTh && <small>{card.correctMeaningTh}</small>}
            </div>
            <div className="flash-context">
              <span>{L(lang,'Correct context','ประโยคที่ถูก')}</span>
              <p>{card.sentence}</p>
            </div>
            <div className="flash-reason">
              <span>{L(lang,'Why','ทำไม')}</span>
              <p>{card.explanation}</p>
            </div>
          </div>
        )}
      </section>

      {revealed && (
        <div className="vocab-actions">
          <button className="vocab-hard" onClick={() => next(false)}>{L(lang,'Still weak','ยังไม่แม่น')}</button>
          <button className="vocab-known" onClick={() => next(true)}>{L(lang,'I know it','จำได้แล้ว')}</button>
        </div>
      )}

      <section className="vocab-memory-note">
        <b>{L(lang,'Adaptive memory','Adaptive จะจำคำนี้')}</b>
        <p>{L(
          lang,
          'Words marked “Still weak” receive extra weight when they appear in future questions. Correct answers do not remove them immediately; repeated successful review lowers the priority gradually.',
          'คำที่กด “ยังไม่แม่น” จะถูกเพิ่มน้ำหนักเมื่อโผล่ในโจทย์ครั้งต่อ ๆ ไป ต่อให้ตอบถูกครั้งเดียวก็ยังไม่หายจากระบบทันที ต้องทวนถูกซ้ำจึงค่อยลดความสำคัญ',
        )}</p>
        {review && <small>{L(lang,'Reviews','ทวนแล้ว')}: {review.seen} · {L(lang,'Hard','ยังไม่แม่น')}: {review.hard} · {L(lang,'Known','จำได้')}: {review.known}</small>}
      </section>
    </div>
  )
}

function PassageVisual({ passage }: { passage: Passage }) {
  if (!passage.visual || !passage.visualData?.length) return null
  const rows = passage.visualData.map(line => line.split('|').map(part => part.trim()))

  if (passage.visual === 'invoice') {
    return (
      <div className="passage-visual visual-invoice">
        <div className="invoice-brand"><span>AW</span><div><b>{passage.visualTitle}</b><small>Invoice / account document</small></div></div>
        <div className="visual-table-body invoice-lines">
          {rows.map((row,index) => (
            <div className={index === 0 ? 'visual-table-row invoice-head' : row[0] === 'TOTAL' ? 'visual-table-row invoice-total' : 'visual-table-row'} key={lineKey(row,index)}>
              {row.map((cell,cellIndex)=><span key={cellIndex}>{cell}</span>)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (passage.visual === 'calendar') {
    return (
      <div className="passage-visual visual-calendar">
        <strong>{passage.visualTitle}</strong>
        <div className="calendar-stack">
          {rows.map((row,index)=>(
            <div className="calendar-event" key={lineKey(row,index)}>
              <time>{row[0]}</time><div><b>{row[1]}</b><span>{row[2]}</span><small>{row[3]}</small></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (passage.visual === 'chat') {
    return (
      <div className="passage-visual visual-chat">
        <strong>{passage.visualTitle}</strong>
        <div className="chat-stack">
          {rows.map((row,index)=>(
            <div className={index % 2 ? 'chat-bubble mine' : 'chat-bubble'} key={lineKey(row,index)}>
              <small>{row[0]} · {row[1]}</small><span>{row.slice(2).join(' · ')}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (passage.visual === 'directory' || passage.visual === 'map') {
    return (
      <div className={`passage-visual visual-directory visual-${passage.visual}`}>
        <strong>{passage.visualTitle}</strong>
        <div className="directory-grid">
          {rows.map((row,index)=>(
            <div className="directory-card" key={lineKey(row,index)}>
              <span>{row[0]}</span><b>{row[1]}</b><small>{row.slice(2).join(' · ')}</small>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (passage.visual === 'coupon') {
    return (
      <div className="passage-visual visual-coupon-wrap">
        <strong>{passage.visualTitle}</strong>
        {rows.map((row,index)=>(
          <div className={index === 0 ? 'coupon-ticket hero' : 'coupon-ticket'} key={lineKey(row,index)}>
            <b>{row[0]}</b><span>{row[1]}</span><small>{row.slice(2).join(' · ')}</small>
          </div>
        ))}
      </div>
    )
  }

  if (passage.visual === 'web-page') {
    return (
      <div className="passage-visual visual-webpage">
        <div className="browser-bar"><i/><i/><i/><span>secure member portal</span></div>
        <strong>{passage.visualTitle}</strong>
        <div className="webpage-grid">
          {rows.map((row,index)=><div key={lineKey(row,index)}><b>{row[0]}</b><span>{row[1]}</span><small>{row.slice(2).join(' · ')}</small></div>)}
        </div>
      </div>
    )
  }

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
        {passage.visualTitle === 'DESIGN FORWARD 2026' && <img className="conference-banner" src={`${import.meta.env.BASE_URL}conference-banner.png`} alt="" loading="lazy" width="2172" height="724" />}
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

function highlightPassageEvidence(text: string, evidence?: string | string[]) {
  if (!evidence) return text
  const targets = (Array.isArray(evidence) ? evidence : [evidence]).filter(Boolean)
  if (!targets.length) return text
  const pattern = new RegExp(`(${targets.map(target => target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return text.split(pattern).map((piece,index) => index % 2 ? <mark key={index} className="passage-evidence-hit">{piece}</mark> : piece)
}

function PassageText({ passage, evidence }: { passage: Passage; evidence?: string | string[] }) {
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
            return <div key={line}><b>{label}</b><span>{highlightPassageEvidence(rest.join(':').trim(), evidence)}</span></div>
          })}
        </div>
        <div className="passage-copy">{highlightPassageEvidence(body, evidence)}</div>
      </>
    )
  }

  if (passage.kind === 'multi') {
    const blocks = passage.body.includes('\n---\n')
      ? passage.body.split(/\n---\n/)
      : passage.body.split(/\n\n+/)
    return (
      <div className="multi-document">
        {blocks.map((block, index) => {
          const trimmed = block.trim()
          const match = trimmed.match(/^(DOCUMENT\s+\d+\s+—\s+[^\n]+)\n?/i)
          const label = match?.[1] ?? 'DOCUMENT ' + (index + 1)
          const copy = match ? trimmed.slice(match[0].length).trim() : trimmed
          return <section className="multi-doc-section" key={index}>
            <header className="multi-doc-header"><span>{String(index + 1).padStart(2,'0')}</span><b>{label}</b></header>
            <div className="multi-doc-copy">{highlightPassageEvidence(copy, evidence)}</div>
          </section>
        })}
      </div>
    )
  }

  return <div className="passage-copy">{highlightPassageEvidence(passage.body, evidence)}</div>
}

function PassageDocument({
  passage,
  part,
  question,
  selected,
  checked,
  onBlankClick,
  onAnswer,
  completedAnswers = {},
}: {
  passage: Passage
  part: Part
  question: Question
  selected: string
  checked: boolean
  onBlankClick?: () => void
  onAnswer?: (id: string) => void
  completedAnswers?: Record<string, string>
}) {
  const lang = useLanguage()
  const [openBlank, setOpenBlank] = useState(false)
  const marker = question.stem.match(/\[\d+\]/)?.[0]
  const pickerId = `blank-choices-${question.id}`
  return (
    <article id={`reading-${question.id}`} className={`reading-passage doc-${passage.kind}`}>
      <div className="passage-heading">
        <span className="doc-type">{passage.kind.toUpperCase()}</span>
        <span className="passage-instruction">{part === 6
          ? L(lang, 'Tap the highlighted blank to answer.', 'แตะช่องว่างที่ไฮไลต์เพื่อเลือกคำตอบ')
          : L(lang, 'Read the document and answer from the evidence.', 'อ่านเอกสารและตอบจากหลักฐานในบทความ')}</span>
      </div>
      <h2>{passage.title}</h2>
      {part === 7 && passage.kind !== 'multi' && <PassageVisual passage={passage} />}
      {part === 6 && onAnswer
        ? <div className="passage-copy p6-inline-document">{passage.body.split('\n').map((line, index) => <div className="p6-paragraph" key={index}>
          {line.split(/(\[\d+\]\s*_{2,})/g).map((piece, pieceIndex) => {
            const number = piece.match(/^\[(\d+)\]\s*_{2,}$/)?.[1]
            if (!number) return <span key={pieceIndex}>{piece}</span>
            const id = passage.questions[Number(number) - 1]
            if (`[${number}]` !== marker) return <span className={completedAnswers[id] ? 'p6-completed' : 'p6-future-blank'} key={pieceIndex}>[{number}] {completedAnswers[id] ?? '_____'}</span>
            const text = checked ? question.choices.find(c => c.id === question.answer)?.text : question.choices.find(c => c.id === selected)?.text
            return <button className={`p6-active-blank ${checked ? 'p6-completed' : ''}`} type="button" key={pieceIndex} disabled={checked} aria-expanded={openBlank && !checked} aria-controls={pickerId} aria-label={L(lang,`Choose answer for blank ${number}`,`เลือกคำตอบช่อง ${number}`)} onClick={() => setOpenBlank(value => !value)}>[{number}] {text ?? '_____'}</button>
          })}
          {line.includes(marker ?? '@@none@@') && openBlank && !checked && <div id={pickerId} className="p6-inline-choices" role="group" aria-label={L(lang,'Answer choices','ตัวเลือกคำตอบ')} onKeyDown={event => { if (event.key === 'Escape') setOpenBlank(false) }}>
            <div className="p6-picker-heading"><b>{L(lang,'Blank','ช่อง')} {marker}</b><button type="button" aria-label={L(lang,'Close choices','ปิดตัวเลือก')} onClick={() => setOpenBlank(false)}>×</button></div>
            {question.choices.map(choice => <button type="button" className={`choice ${selected === choice.id ? 'selected' : ''}`} key={choice.id} onClick={() => { setOpenBlank(false); onAnswer(choice.id) }}><span>{choice.id}</span><b>{choice.text}</b></button>)}
          </div>}
        </div>)}{checked && <AnswerWalkthrough question={question} selected={selected} contextText={activeContextForBlank(passage.body, question.stem)} />}</div>
        : part === 6
        ? <div className="passage-copy">{passage.body.split(/(?<=[.!?])\s+(?=[A-Z]|\[\d+\])|\n/).map((line, index) => line.includes(question.stem.match(/\[\d+\]/)?.[0] ?? '@@none@@')
          ? <div key={index}><AnnotatedSentence key={question.id} question={question} selected={selected} contextText={line} checked={checked} onBlankClick={onBlankClick} /></div>
          : <div key={index}>{line || '\u00a0'}</div>)}</div>
        : <PassageText passage={passage} evidence={checked ? question.coaching?.focus ?? question.evidence : undefined} />}
      {part === 7 && passage.kind === 'multi' && passage.visual && (
        <div className="multi-reference-document">
          <span>{L(lang, 'REFERENCE DOCUMENT', 'เอกสารประกอบ')}</span>
          <PassageVisual passage={passage} />
        </div>
      )}
      {passage.sourceLabel && <small className="passage-source-label">{passage.sourceLabel}</small>}
    </article>
  )
}


function App() {
  const [view, setView] = useState<View>('home')
  const [state, setState] = useState<TrainerState>(() => sandbox ? emptyState() : loadLocalState())
  const [hydrated, setHydrated] = useState(sandbox)
  const [connected, setConnected] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState(false)
  const [remoteQuestions, setRemoteQuestions] = useState<Question[]>([])
  const [remotePassages, setRemotePassages] = useState<Passage[]>([])
  const [lessonSkill, setLessonSkill] = useState<SkillId | null>(null)
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
  const allQuestionById = useMemo(
    () => Object.fromEntries([...allPart5, ...allPart6, ...allPart7].map(question => [question.id, question])),
    [allPart5, allPart6, allPart7],
  )
  const vocabCardCount = useMemo(
    () => buildVocabCards(state, allQuestionById, allPassageById).length,
    [state, allQuestionById, allPassageById],
  )

  useEffect(() => {
    if (sandbox) return
    const stopQuestions = watchPersonalizedQuestions(setRemoteQuestions)
    const stopPassages = watchPersonalizedPassages(setRemotePassages)

    let stopped=false
    let readVersion=0
    const hydrate = () => {
      const version=++readVersion
      setHydrated(false)
      return loadCloudState()
      .then(cloud => {
        if (stopped || version !== readVersion) return
        setState(local => chooseFresher(normalizeState(local), cloud))
        setHydrated(true)
        setSyncError(false)
      })
      .catch(() => { if (!stopped && version === readVersion) setSyncError(true) })
    }
    void hydrate()
    const stopConnection = watchConnection(online => {
      setConnected(online)
      readVersion++
      setHydrated(false)
      if (online) void hydrate()
    })
    // Keep local work safe until the first successful cloud read, then retry when online.
    window.addEventListener('online', hydrate)
    window.addEventListener('focus', hydrate)

    publishQuestionBankManifest({ part5: part5.length, part6: part6.length, part7: part7.length }).catch(() => undefined)
    return () => {
      stopped=true
      window.removeEventListener('online', hydrate)
      window.removeEventListener('focus', hydrate)
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
    if (sandbox) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    if (!hydrated || !connected) return

    const timer = window.setTimeout(() => {
      setSyncing(true)
      syncCloudState(normalized)
        .then(() => setSyncError(false))
        .catch(error => {
          console.error('Firebase sync failed', error)
          setSyncError(true)
        })
        .finally(() => setSyncing(false))
    }, 350)
    return () => window.clearTimeout(timer)
  }, [state, hydrated, connected])

  const navigate = (next: View) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setView(next)
    setLessonSkill(null)
  }

  const startLesson = (skill: SkillId) => {
    setView('learn')
    setLessonSkill(skill)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startQuickPart5 = () => {
    setView('part5')
    setLessonSkill(null)
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
          {sandbox && <small className="sandbox-note">โหมดทดสอบ · ไม่บันทึกผลจริง</small>}
          {view === 'home' && (
            <Home
              state={state}
              startLesson={startLesson}
              navigate={navigate}
              startQuickPart5={startQuickPart5}
              questionCounts={{ 5: practicePool(allPart5,false).length, 6: practicePool(allPart6,false,allPassageById).length, 7: practicePool(allPart7,false,allPassageById).length }}
              vocabCount={vocabCardCount}
            />
          )}
          {view === 'learn' && (lessonSkill && lessonBySkill[lessonSkill]
            ? <LessonSession key={lessonSkill} lesson={lessonBySkill[lessonSkill]!} state={state} setState={setState} pool={practicePool(allPart5,false)} onExit={() => setLessonSkill(null)} />
            : <Part5Hub state={state} setState={setState} startLesson={startLesson} navigate={navigate} />)}
          {view === 'practice' && <PracticeHub state={state} navigate={navigate} counts={{5: practicePool(allPart5,false).length, 6: practicePool(allPart6,false,allPassageById).length, 7: practicePool(allPart7,false,allPassageById).length}} />}
          {view === 'part5' && <PracticeScreen part={5} state={state} setState={setState} pool={allPart5} onBack={() => navigate('practice')} />}
          {view === 'part6' && (
            <PracticeScreen
              part={6}
              state={state}
              setState={setState}
              pool={allPart6}
              passageMap={allPassageById}
              onBack={() => navigate('practice')}
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
              onBack={() => navigate('practice')}
              readingSwitch={part => navigate(part === 6 ? 'part6' : 'part7')}
            />
          )}
          {view === 'vocab' && (
            <VocabReview
              state={state}
              setState={setState}
              questionMap={allQuestionById}
              passageMap={allPassageById}
              onBack={() => navigate('home')}
            />
          )}
          {view === 'mock' && <MockTest setState={setState} />}
          {view === 'analytics' && (
            <Analytics
              state={state}
              startLesson={startLesson}
              navigate={navigate}
              vocabCount={vocabCardCount}
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
      <NavButton active={view === 'learn'} label={L(lang, 'Learn', 'เรียน')} icon="learn" onClick={() => navigate('learn')} />
      <NavButton active={['practice','part5','part6','part7','mock'].includes(view)} label={L(lang, 'Practice', 'ฝึก')} icon="practice" onClick={() => navigate('practice')} />
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

function Home({ state, startLesson, navigate, startQuickPart5, questionCounts, vocabCount }: {
  state: TrainerState; startLesson: (skill: SkillId) => void; navigate: (view: View) => void
  startQuickPart5: () => void; questionCounts: Record<Part,number>; vocabCount: number
}) {
  const lang=useLanguage()
  const focus=nextFocusSkill(state)
  const lesson=lessonBySkill[focus] ?? lessons[0]
  const assessment=skillAssessment(state,focus)
  const today=attemptsToday(state)
  const due=courseCards.filter(card=>cardIsDue(state,card.id) && courseSkills(card.chapter).includes(focus)).length
  const uncertain=state.attempts.slice(0,30).filter(a=>a.confidence===1 || a.confidence===2).length
  return <div className="screen home-screen coach-home">
    <div className="home-greeting"><span>{greetingLabel(lang)}</span><span>{studyStreak(state)} {L(lang,'day streak','วันต่อเนื่อง')} · {daysToExam()} {L(lang,'days to exam','วันก่อนสอบ')}</span></div>
    <section className="today-hero">
      <div className="hero-copy"><span className="eyebrow">YOUR NEXT SMALL WIN</span><h1>{L(lang,'Less guessing.\nMore confidence.','ลดการเดา\nเพิ่มความมั่นใจ')}</h1><p>{L(lang,'Today’s focus','วันนี้เน้น')} · <b>{localizedSkill(focus,lang)}</b></p></div>
      <div className="hero-art" aria-hidden="true"><div className="orbit-dot">✦</div><Mascot size={112}/><span className="floating-note">S + V → ✓</span></div>
      <div className="hero-insight"><span>{assessment.value===null ? L(lang,'Building your profile','กำลังวัดพื้นฐาน') : `${L(lang,'Mastery','ความแม่น')} ${assessment.value}%`}</span><b>{today} {L(lang,'answers today','ข้อวันนี้')}</b></div>
    </section>
    <section className="daily-route"><div className="section-title"><h2>{L(lang,'Your next 15 minutes','15 นาทีถัดไปของคุณ')}</h2><span className="tiny-label">ADAPTIVE</span></div>
      <button className="route-row" onClick={()=>navigate('learn')}><span className="route-number">01</span><span><b>{L(lang,'Recall one useful pattern','ปลุกความจำด้วยการ์ดทริค')}</b><small>{L(lang,'Recall before revealing','ลองนึกก่อนเปิดคำตอบ')} · {due} {L(lang,'focus cards due','การ์ดในจุดที่ควรทวน')}</small></span><strong>↗</strong></button>
      <button className="route-row primary-route" onClick={startQuickPart5}><span className="route-number">02</span><span><b>{L(lang,'Practice a short adaptive set','ฝึกชุดสั้น ปรับตามจุดอ่อน')}</b><small>{L(lang,'6 questions · new examples of your weak patterns','6 ข้อ · ฝึก pattern ที่ยังไม่แม่น')}</small></span><strong>→</strong></button>
      <button className="route-row" onClick={()=>startLesson(lesson.skill)}><span className="route-number">03</span><span><b>{L(lang,'Repair, then prove you know it','เข้าใจวิธีคิด แล้ววัดความแม่น')}</b><small>{localizedLesson(lesson,lang).shortTitle} · {uncertain ? L(lang,`${uncertain} recent unsure answers`,`${uncertain} ข้อล่าสุดที่ยังลังเล`) : L(lang,'Worked examples → mastery check','ตัวอย่างสอน → วัดความแม่น')}</small></span><strong>↗</strong></button>
    </section>
    <SectionTitle title={L(lang,'Train each Reading part','ฝึก Reading ทีละพาร์ต')} action={L(lang,'See all','ดูทั้งหมด')} onAction={()=>navigate('practice')}/>
    <div className="part-cards-mobile"><PracticePartCard className="mint" part="5" title={L(lang,'Grammar','โครงสร้าง')} count={questionCounts[5]} progress={partAccuracy(state,5)} onClick={startQuickPart5}/><PracticePartCard className="sky" part="6" title={L(lang,'Context','บริบท')} count={questionCounts[6]} progress={partAccuracy(state,6)} onClick={()=>navigate('part6')}/><PracticePartCard className="sun" part="7" title={L(lang,'Evidence','หลักฐาน')} count={questionCounts[7]} progress={partAccuracy(state,7)} onClick={()=>navigate('part7')}/></div>
    <div className="home-links"><button onClick={()=>navigate('vocab')}>Aa {L(lang,'Vocabulary repair','ทวนศัพท์ที่พลาด')} <b>{vocabCount}</b></button><button onClick={()=>navigate('mock')}>◷ {L(lang,'75-min simulation','จำลองสอบ 75 นาที')} →</button></div>
    <p className="build-version">v{import.meta.env.VITE_APP_VERSION} · {import.meta.env.VITE_BUILD_ID}</p>
  </div>
}

function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="section-title-row">
      <h2>{title}</h2>
      {action && <button onClick={onAction}>{action} ›</button>}
    </div>
  )
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

function PracticeHub({ state, navigate, counts }: { state: TrainerState; navigate: (view: View) => void; counts: Record<Part, number> }) {
  const lang = useLanguage()
  return <div className="screen practice-hub">
    <div className="screen-intro"><span className="tiny-label">READING PRACTICE</span><h1>{L(lang,'Practice with a purpose','ฝึกให้แม่นทีละจุด')}</h1><p>{L(lang,'Choose a part. Start with challenging questions, or switch to adaptive review. Explanations appear after you submit.','เลือกพาร์ต เริ่มด้วยโจทย์เข้มข้น หรือเปลี่ยนเป็นทวนจุดอ่อน เฉลยและจุดสังเกตจะเปิดหลังส่งคำตอบ')}</p></div>
    <div className="part-cards-mobile">
      {([5,6,7] as const).map(part => <PracticePartCard key={part} className={part === 5 ? 'mint' : part === 6 ? 'sky' : 'sun'} part={String(part)} title={part === 5 ? L(lang,'Incomplete Sentences','เติมคำในประโยค') : part === 6 ? L(lang,'Text Completion','เติมข้อความ') : L(lang,'Reading Comprehension','อ่านจับใจความ')} count={counts[part]} progress={partAccuracy(state,part)} onClick={() => navigate(part === 5 ? 'part5' : part === 6 ? 'part6' : 'part7')} />)}
    </div>
    <section className="practice-roadmap"><h2>{L(lang,'One repeatable method','ใช้วิธีคิดเดียวกันทุกข้อ')}</h2><p>{L(lang,'Structure → meaning → eliminate → verify. For reading, locate evidence before choosing.','โครงสร้าง → ความหมาย → ตัดตัวเลือก → ตรวจซ้ำ ส่วนโจทย์อ่านให้หาหลักฐานก่อนเลือก')}</p><small>{L(lang,'Original TOEIC-style practice, with business contexts and plausible distractors.','โจทย์แต่งใหม่ในรูปแบบ TOEIC เน้นบริบทธุรกิจและตัวลวงที่ใกล้เคียง')}</small></section>
    <button className="mock-banner" onClick={() => navigate('mock')}><span><b>{L(lang,'Reading simulation · 75 minutes','จำลองสอบ Reading · 75 นาที')}</b><small>Part 5: 30 · Part 6: 16 · Part 7: 54</small></span><strong>›</strong></button>
  </div>
}

function Part5Hub({ state, setState, startLesson, navigate }: {
  state: TrainerState; setState: StateSetter; startLesson: (skill: SkillId) => void; navigate: (view: View) => void
}) {
  const lang=useLanguage()
  const [tab,setTab]=useState<'cards'|'lessons'>('cards')
  return <div className="screen learn-screen">
    <div className="screen-intro compact-intro"><span className="eyebrow">LEARN / RECALL / APPLY</span><h1>{L(lang,'Make the pattern stick.','จำให้เป็น ใช้ให้ได้')}</h1><p>{L(lang,'One idea at a time. Recall it, then use it.','ทีละทริค ลองนึกก่อน แล้วค่อยนำไปใช้กับโจทย์')}</p></div>
    <div className="segment library-switch"><button className={tab==='cards'?'active':''} onClick={()=>setTab('cards')}>{L(lang,'Memory library','คลังทริค & ความจำ')}</button><button className={tab==='lessons'?'active':''} onClick={()=>setTab('lessons')}>{L(lang,'Guided lessons','บทเรียนพร้อมตัวอย่าง')}</button></div>
    {tab==='cards' ? <CourseMemoryBank state={state} setState={setState} startLesson={startLesson} navigate={navigate}/> : <div className="guided-grid">{lessons.map(lesson=>{const assessment=skillAssessment(state,lesson.skill);const result=state.lessonResults[lesson.skill];return <button className="guided-card" key={lesson.skill} onClick={()=>startLesson(lesson.skill)}><span className="lesson-icon">{lesson.icon}</span><b>{localizedLesson(lesson,lang).shortTitle}</b><small>{L(lang,'5 examples · mastery check','5 ตัวอย่าง · แบบวัดความแม่น')}</small><Progress value={assessment.value??0}/><span>{result ? `${L(lang,'Best','ดีที่สุด')} ${result.bestScore}%` : localizedAssessmentLabel(assessment,lang)}</span></button>})}</div>}
  </div>
}

function MemoryCard({card,state,setState,onNext}: {card:CourseCard;state:TrainerState;setState:StateSetter;onNext:()=>void}) {
  const lang=useLanguage()
  const [revealed,setRevealed]=useState(false)
  const [studied,setStudied]=useState(false)
  const source=courseSources.find(s=>s.id===card.chapter)
  const review=state.vocabReview[`card:${card.id}`]
  const mark=(knew:boolean)=>{setState(current=>markVocabReview(current,`card:${card.id}`,knew));setStudied(true)}
  const patternRow=(pattern:string)=>{const [a,b]=pattern.split('→');return <div key={pattern}><b>{a}</b>{b && <><span aria-hidden="true">→</span><span>{b}</span></>}</div>}
  return <div className="memory-card-shell" key={card.id}>
    <article className={`memory-card ${revealed ? 'memory-card-back' : 'memory-card-front'}`}>
      <div className="memory-card-top">
        <span className="flashcard-chapter">{L(lang,'CHAPTER','บท')} {card.chapter<=28?card.chapter:'＋'}</span>
        <span className="recall-status">{review?.known ? L(lang,`${review.known} recalls`,`จำได้ ${review.known} ครั้ง`) : L(lang,'New card','การ์ดใหม่')}</span>
      </div>

      {!revealed ? <>
        <div className="flashcard-front-mark" aria-hidden="true"><span>✦</span><strong>Aa</strong></div>
        <div className="flashcard-front-copy">
          <span className="eyebrow">{L(lang,'RECALL CARD','การ์ดทบทวน')}</span>
          <h2>{card.title}</h2>
          <p className="flashcard-prompt">{card.prompt}</p>
          <div className="flashcard-instruction"><span aria-hidden="true">◌</span><p>{L(lang,'Answer in your head first. No grammar labels, no hint panel—just recall the pattern.','ลองตอบในใจก่อน ยังไม่เปิดกฎหรือเฉลย แล้วค่อยพลิกการ์ดเช็กตัวเอง')}</p></div>
        </div>
        <button className="recall-reveal flashcard-flip" onClick={()=>setRevealed(true)}>{L(lang,'Flip to reveal','พลิกดูด้านหลัง')} <span aria-hidden="true">↗</span></button>
      </> : <>
        <div className="flashcard-back-head">
          <div><span className="eyebrow">{L(lang,'ANSWER + MEMORY HOOK','เฉลย + ทริคจำ')}</span><h2>{card.title}</h2></div>
          <button className="flashcard-reset" onClick={()=>setRevealed(false)} aria-label={L(lang,'Show card front','กลับด้านหน้า')}>↺</button>
        </div>

        <div className="flashcard-answer-block" aria-live="polite"><small>{L(lang,'ANSWER','คำตอบ')}</small><p>{card.answer}</p></div>
        <div className="memory-hook"><span aria-hidden="true">✦</span><div><small>{L(lang,'MEMORY HOOK','ทริคจำ')}</small><p>{card.memory}</p></div></div>
        <div className="pattern-map">{card.patterns.slice(0,4).map(patternRow)}</div>
        {card.patterns.length>4 && <details className="more-patterns"><summary>{L(lang,`See ${card.patterns.length-4} more patterns`,`ดูอีก ${card.patterns.length-4} รูปแบบ`)}</summary><div className="pattern-map">{card.patterns.slice(4).map(patternRow)}</div></details>}
        {card.example && <div className="memory-example"><small>{L(lang,'SEE IT IN A SENTENCE','ดูในประโยคจริง')}</small><p>{card.example}</p></div>}

        {!studied ? <div className="recall-actions flashcard-rating"><div><b>{L(lang,'How did recall feel?','เมื่อกี้นึกได้ไหม?')}</b><small>{L(lang,'Your rating schedules the next review.','ระบบจะใช้คำตอบนี้จัดรอบทบทวนครั้งถัดไป')}</small></div><div><button onClick={()=>mark(false)}>{L(lang,'Needs another look','ยังจำไม่ได้')}</button><button onClick={()=>mark(true)}>{L(lang,'Recalled it','นึกได้เอง')} ✓</button></div></div> : <div className="recall-saved flashcard-saved"><span>✓ {L(lang,'Review scheduled','จัดรอบทบทวนให้แล้ว')}</span><button onClick={onNext}>{L(lang,'Next card','การ์ดถัดไป')} →</button></div>}
        <details className="card-source"><summary>{L(lang,'Source & review timing','อ้างอิง & รอบทบทวน')}</summary><small>{source?.file} · {L(lang,'pages','หน้า')} {card.pages}<br/>{L(lang,'Original summary. Recall again in 1, 3 or 7 days based on your recalls.','สรุปและตัวอย่างเขียนใหม่ · ทวนใน 1, 3 หรือ 7 วันตามผลที่นึกได้')}</small></details>
      </>}
    </article>
  </div>
}

function CourseMemoryBank({state,setState,startLesson,navigate}: {state:TrainerState;setState:StateSetter;startLesson:(skill:SkillId)=>void;navigate:(view:View)=>void}) {
  const lang=useLanguage()
  const [category,setCategory]=useState('focus')
  const [search,setSearch]=useState('')
  const [chapter,setChapter]=useState<number|null>(null)
  const [index,setIndex]=useState(0)
  const focus=nextFocusSkill(state)
  const [dueIds]=useState(()=>new Set(courseCards.filter(card=>cardIsDue(state,card.id)).map(card=>card.id)))
  const matches=courseCards.filter(card=>{
    const group=category==='all' || (category==='focus' ? courseSkills(card.chapter).includes(focus) && dueIds.has(card.id) : category==='grammar' ? card.chapter<=20 || card.chapter===30 : category==='vocab' ? [13,21].includes(card.chapter) : category==='listening' ? card.chapter>=22 && card.chapter<=25 : card.chapter>=26 && card.chapter<=29)
    return group && (!chapter || card.chapter===chapter) && [card.title,card.memory,...card.patterns].join(' ').toLowerCase().includes(search.trim().toLowerCase())
  })
  const card=matches[Math.min(index,Math.max(0,matches.length-1))]
  const available=courseSources.filter(source=>courseCards.some(card=>card.chapter===source.id))
  const next=()=>setIndex(i=>i+1<matches.length ? i+1 : 0)
  return <section className="course-library">
    <div className="library-stat"><span className="library-mark" aria-hidden="true">✦</span><div><b>{courseCards.length} {L(lang,'memory cards','การ์ดจำ')}</b><small>{courseSources.length} PDF · {L(lang,'Grammar, vocabulary, listening and reading','Grammar · ศัพท์ · Listening · Reading')}</small></div></div>
    <label className="library-search"><span aria-hidden="true">⌕</span><input type="search" placeholder={L(lang,'Search a word or pattern…','ค้นหา เช่น unless, คุ้นเคย, ประธาน…')} aria-label={L(lang,'Search memory cards','ค้นหาการ์ดทริค')} value={search} onChange={event=>{setSearch(event.target.value);setIndex(0)}}/></label>
    <div className="library-filters" role="group" aria-label={L(lang,'Card categories','หมวดการ์ด')}>{[['focus',L(lang,'For you','ควรทวน')],['grammar','Grammar'],['vocab',L(lang,'Vocab','ศัพท์')],['listening','Listening'],['reading','Reading'],['all',L(lang,'All','ทั้งหมด')]].map(([id,title])=><button className={category===id?'active':''} key={id} onClick={()=>{setCategory(id);setChapter(null);setIndex(0)}}>{title}</button>)}</div>
    <div className="card-pagination"><label>{L(lang,'Chapter','บทเรียน')} <select aria-label={L(lang,'Choose chapter','เลือกบทเรียน')} value={chapter??''} onChange={event=>{setChapter(event.target.value?Number(event.target.value):null);setCategory('all');setIndex(0)}}><option value="">{L(lang,'All chapters','ทุกบท')}</option>{available.map(source=><option key={source.id} value={source.id}>{source.id<=28?`${source.id}. `:''}{localizedChapterTitle(source.id,source.title,lang)}</option>)}</select></label><span>{matches.length ? `${Math.min(index+1,matches.length)} / ${matches.length}` : '0'}</span></div>
    {card ? <><MemoryCard key={card.id} card={card} state={state} setState={setState} onNext={next}/><div className="card-controls"><button disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}>← {L(lang,'Previous','ก่อนหน้า')}</button><button onClick={next}>{L(lang,'Next card','การ์ดถัดไป')} →</button></div><button className="apply-card" onClick={()=>card.chapter>=22 && card.chapter<=25 ? next() : card.chapter===27 || card.chapter===28 ? navigate(card.chapter===27?'part6':'part7') : startLesson(courseSkills(card.chapter)[0]??focus)}>{card.chapter>=22 && card.chapter<=25 ? L(lang,'Next Listening strategy','ทริค Listening ถัดไป') : L(lang,'Use this pattern in a question','นำ pattern นี้ไปใช้กับโจทย์')} ↗</button></> : <div className="empty-state"><b>{L(lang,'No cards here right now','ยังไม่มีการ์ดในตัวกรองนี้')}</b><p>{L(lang,'Try All or choose another chapter.','เลือกทั้งหมด หรือเปลี่ยนคำค้นเพื่อทวนเรื่องอื่น')}</p><button className="recall-reveal" onClick={()=>{setCategory('all');setSearch('');setChapter(null);setIndex(0)}}>{L(lang,'Show all cards','เปิดทุกการ์ด')}</button></div>}
    <details className="source-index"><summary>{L(lang,'Browse course coverage','ดูบทเรียนและแหล่งอ้างอิงทั้งหมด')} · {available.length}</summary><div>{available.map(source=><button key={source.id} onClick={()=>{setCategory('all');setChapter(source.id);setSearch('');setIndex(0);window.scrollTo({top:140,behavior:'smooth'})}}><span>{source.id<=28?source.id:'＋'}</span><b>{localizedChapterTitle(source.id,source.title,lang)}</b><small>{courseCards.filter(card=>card.chapter===source.id).length} {L(lang,'cards','การ์ด')}</small></button>)}</div></details>
  </section>
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
  const [practiceQuestions, setPracticeQuestions] = useState(() => questionsForSkill(state, pool, lesson.skill, lesson.practiceCount))
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [times, setTimes] = useState<number[]>([])
  const [reason, setReasonState] = useState<ErrorReason | ''>('')
  const [lessonConfidence, setLessonConfidence] = useState<1 | 2 | 3 | 0>(0)
  const startedAt = useRef(0)
  const courseRefs = chaptersForSkill(lesson.skill)

  const resetLesson = () => {
    setPracticeQuestions(questionsForSkill(state, pool, lesson.skill, lesson.practiceCount))
    setPhase('examples')
    setExampleIndex(0)
    setPracticeIndex(0)
    setSelected('')
    setChecked(false)
    setScore(0)
    setTimes([])
    setReasonState('')
    setLessonConfidence(0)
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
          <details className="lesson-course-note"><summary>{L(lang,'Review the course rule','ทวนหลักจากบทที่เคยเรียน')}</summary>
            <div className="lesson-course-head">
              <span>{L(lang, 'YOUR COURSE', 'อ้างอิงจากบทที่คุณเรียนจริง')}</span>
              <b>{L(lang, 'Chapter', 'บทที่')} {courseRefs[0].id} · {localizedChapterTitle(courseRefs[0].id, courseRefs[0].title, lang)}</b>
            </div>
            <div className="lesson-course-memory">
              <strong>{L(lang, 'Memorize', 'ต้องท่องจำ')}</strong>
              <ul>{localizedChapterTips(courseRefs[0].id, courseRefs[0].memorize, lang).slice(0, 3).map(item => <li key={item}>{item}</li>)}</ul>
            </div>
          </details>
        )}
        <QuestionCard key={example.id} question={{ ...example, part: 5, skills: [lesson.skill], explanation: example.explanation, explanationTh: exampleText.explanation,
          coaching: { focus: example.clue.match(/[“”]([^“”]+)[“”]/)?.slice(1) ?? [], steps: [exampleText.clue, exampleText.rule, exampleText.explanation], memory: exampleText.rule, choiceReasons: { [example.answer]: exampleText.explanation } },
        }} selected={example.answer} checked onSelect={() => undefined} />
        <button className="back-link" onClick={() => { setPhase('practice'); startedAt.current = performance.now() }}>{L(lang,'Already know this? Go to mastery check','จำหลักได้แล้ว → ไปวัดความแม่น')}</button>
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
    const passed = score / Math.max(1,practiceQuestions.length) >= lesson.passScore / lesson.practiceCount
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
    setLessonConfidence(0)
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
        key={question.id}
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
            setState(current => addFeedbackToLatest(current, r, lessonConfidence || undefined))
          }}
          confidence={lessonConfidence}
          onConfidence={value => {
            setLessonConfidence(value)
            setState(current => addFeedbackToLatest(current, reason || undefined, value))
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
  const baseCandidates = candidates.length ? candidates : pool
  const picked = pickAdaptiveQuestion(state, baseCandidates)
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

function practicePool(questions: Question[], exam: boolean, map: Record<string, Passage> = passageById) {
  if (questions[0]?.part !== 5) {
    const realistic = questions.filter(q => q.passageId && map[q.passageId]?.examStyle)
    if (realistic.length) questions = realistic
  }
  // Part 5 uses reviewed word roles; the full historical bank remains available in past results.
  if (questions[0]?.part===5) {
    const reviewed=questions.filter(q=>reviewedGrammar[q.id])
    if (reviewed.length) questions=reviewed
  }
  if (!exam) return questions
  const passageIds = new Set(questions.filter(q => q.difficulty >= 3).map(q => q.passageId).filter(Boolean))
  const challenging = questions.filter(q => q.passageId ? passageIds.has(q.passageId) : q.difficulty >= 3)
  return challenging.length ? challenging : questions
}

function PracticeScreen({
  part,
  state,
  setState,
  pool: sourcePool,
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
  const [exam, setExam] = useState(part !== 5)
  const activePassageMap = passageMap ?? passageById
  const pool = useMemo(() => practicePool(sourcePool, exam, activePassageMap), [sourcePool, exam, activePassageMap])
  const [question, setQuestion] = useState<Question>(() => firstQuestionOfPickedPassage(state, pool, activePassageMap))
  const [selected, setSelected] = useState('')
  const [checked, setChecked] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [reason, setReason] = useState<ErrorReason | ''>('')
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 0>(0)
  const [extraPractice, setExtraPractice] = useState(false)
  const [session, setSession] = useState<{question:Question;selected:string;correct:boolean;seconds:number;confidence:number}[]>([])
  const [finishedSet, setFinishedSet] = useState(false)
  const [dailyComplete, setDailyComplete] = useState(false)
  const startedAt = useRef(0)

  useEffect(() => {
    setQuestion(firstQuestionOfPickedPassage(state, pool, activePassageMap))
    setSelected('')
    setChecked(false)
    setReason('')
    setConfidence(0)
    setExtraPractice(false)
    setSession([])
    setFinishedSet(false)
    setDailyComplete(false)
    startedAt.current = performance.now()
    // reset only when pool/part changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [part, exam])

  const passage = question?.passageId ? activePassageMap[question.passageId] : undefined
  const passageQuestionIds = passage?.questions.filter(id => pool.some(q => q.id === id)) ?? []
  const passageQuestionIndex = passageQuestionIds.indexOf(question?.id ?? '')
  const questionContext = part === 6 && passage && question ? activeContextForBlank(passage.body, question.stem) : question?.stem
  if (!question) return <div className="screen"><div className="empty-state">{L(lang, 'No questions available.', 'ยังไม่มีโจทย์ในชุดนี้')}</div></div>

  const targets = dailyTargets(state)
  const partTarget = part === 5 ? targets.part5 : part === 6 ? targets.part6 : targets.part7
  const partDone = todayPartCount(state, part)
  const passageBoundary = part === 5 || !passage || passageQuestionIndex >= passageQuestionIds.length - 1
  const goalReached = partDone >= partTarget
  const showDailyComplete = goalReached && !extraPractice && !checked && (session.length===0 || dailyComplete)

  const submit = (answerId = selected) => {
    if (!answerId || checked) return
    const ms = performance.now() - startedAt.current
    setSelected(answerId)
    setElapsed(ms)
    setSession(items=>[...items,{question,selected:answerId,correct:answerId===question.answer,seconds:ms/1000,confidence:0}])
    setState(current => recordAttempt(current, question, answerId, ms, { mode: 'adaptive' }))
    setChecked(true)
  }

  const next = () => {
    if (session.length>=6 && passageBoundary) {
      setFinishedSet(true)
      window.scrollTo({top:0,behavior:'smooth'})
      return
    }
    if (!extraPractice && goalReached && passageBoundary) {
      setDailyComplete(true)
      setSelected('')
      setChecked(false)
      setElapsed(0)
      setReason('')
      setConfidence(0)
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
    startedAt.current = performance.now()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (finishedSet) {
    const diagnosed=session.map(item=>({...item,diagnosis:classifyAttempt(item.correct,item.seconds*1000,questionTargetMs(item.question),item.confidence===0?undefined:item.confidence as 1|2|3)}))
    const errors=diagnosed.filter(item=>!item.correct || item.confidence===1 || item.confidence===2)
    const slow=diagnosed.filter(item=>item.diagnosis==='correct-slow')
    const rushed=diagnosed.filter(item=>item.diagnosis==='rushed' || item.diagnosis==='fast-guess')
    const repair=errors[0]?.question ?? slow[0]?.question ?? rushed[0]?.question
    const recall=repair ? recallForQuestion(repair) : undefined
    return <div className="screen set-result"><div className="set-score">{session.filter(item=>item.correct).length}<small>/{session.length}</small></div><h1>{L(lang,'A small set. A clear next step.','จบชุดนี้ รู้จุดที่ควรแก้')}</h1><div className="set-metrics"><div><b>{session.filter(item=>!item.correct).length}</b><small>{L(lang,'Knowledge misses','ผิดเนื้อหา')}</small></div><div><b>{slow.length}</b><small>{L(lang,'Correct but slow','ถูกแต่ช้า')}</small></div><div><b>{rushed.length}</b><small>{L(lang,'Rushed / fast guess','รีบ / เดาเร็ว')}</small></div></div>
      <div className="set-repair"><span className="eyebrow">{L(lang,'YOUR NEXT FOCUS','จุดที่ควรทวนต่อ')}</span><p>{repair ? repair.skills.map(skill=>localizedSkill(skill,lang)).join(' · ') : L(lang,'Keep testing the pattern with new questions.','ฝึกข้อใหม่ต่อ เพื่อยืนยันว่าใช้ pattern ได้จริง')}</p>{recall && <><b>{recall.title}</b><p>{recall.memory}</p><details><summary>{L(lang,'Quick recall','ลองนึกสั้น ๆ')}</summary><p>{recall.prompt}</p><details><summary>{L(lang,'Reveal','เปิดคำตอบ')}</summary><p>{recall.answer}</p></details></details></>}</div>
      <button className="big-next" onClick={()=>{setSession([]);setFinishedSet(false);setExtraPractice(true);setQuestion(firstQuestionOfPickedPassage(state,pool,activePassageMap,question.passageId));setSelected('');setChecked(false);setReason('');setConfidence(0);startedAt.current=performance.now()}}>{L(lang,'Start next adaptive set','เริ่มชุดถัดไปตามจุดอ่อน')} →</button><button className="back-link" onClick={onBack}>{L(lang,'Finish for now','พักก่อน กลับไปหน้าฝึก')}</button>
    </div>
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
            ? `${L(lang, 'Question', 'ข้อย่อย')} ${passageQuestionIndex + 1}/${passageQuestionIds.length}`
            : L(lang,'Choose the best answer','เลือกคำตอบที่เหมาะสม')}{checked ? ` · ${question.skills.slice(0, 2).map(skill => localizedSkill(skill, lang)).join(' · ')}` : ''}</small>
        </div>
        <span className="practice-part-tag">P{part}</span>
      </div>

      {readingSwitch && (
        <div className="segment">
          <button className={part === 6 ? 'active' : ''} onClick={() => readingSwitch(6)}>Part 6</button>
          <button className={part === 7 ? 'active' : ''} onClick={() => readingSwitch(7)}>Part 7</button>
        </div>
      )}

      <label className="practice-mode">{L(lang,'Question difficulty','ความเข้มข้นของโจทย์')}<select aria-label={L(lang,'Question difficulty','ความเข้มข้นของโจทย์')} value={exam ? 'exam' : 'adaptive'} onChange={event => setExam(event.target.value === 'exam')}><option value="exam">{L(lang,'Challenge · Level 3–5','เข้มข้น · ระดับ 3–5')}</option><option value="adaptive">{L(lang,'Adaptive · All levels','ปรับตามจุดอ่อน · ทุกระดับ')}</option></select></label>
      <div className="practice-progress">
        <Progress value={partDone / Math.max(1, partTarget) * 100} />
        <span>{partDone}/{partTarget} {L(lang, `Part ${part} today`, `ข้อ Part ${part} วันนี้`)}{extraPractice ? L(lang, ' · extra', ' · ฝึกเพิ่ม') : ''}</span>
      </div>
      <div className="session-status"><b>{L(lang,'SHORT SET','ชุดสั้น')} · {L(lang,'Question','ข้อ')} {session.length + (checked ? 0 : 1)}</b><span>{L(lang,'6+ questions · finish the whole passage','6 ข้อขึ้นไป · ทำให้จบทั้งบทความ')}</span></div>
      {checked && <details className="adaptive-why"><summary>{L(lang,'Why this question?','ทำไมระบบเลือกข้อนี้?')}</summary><p>{L(lang,'Selection balances difficulty with weak skills, missed patterns, confidence, speed, spacing and recent exposure.','ระบบจัดน้ำหนักจากระดับที่ทำได้ จุดอ่อน pattern ที่พลาด ความมั่นใจ เวลา และระยะทบทวน พร้อมลดข้อที่เพิ่งเห็น')} · {question.skills.map(skill=>`${localizedSkill(skill,lang)} ${skillAssessment(state,skill).value??'—'}%`).join(' / ')}</p></details>}

      {passage && (
        <PassageDocument
          key={question.id}
          passage={passage}
          part={part}
          question={question}
          selected={selected}
          checked={checked}
          onAnswer={part === 6 ? submit : undefined}
          completedAnswers={Object.fromEntries(session.map(item => [item.question.id, item.question.choices.find(c => c.id === item.question.answer)?.text ?? '']))}
        />
      )}

      <div id="active-question">
          {part !== 6 && <QuestionCard key={question.id} question={question} selected={selected} checked={checked} onSelect={setSelected} contextText={questionContext} />}
          {!checked ? (part === 6 ? null :
            <button className="big-next" disabled={!selected} onClick={() => submit()}>{L(lang, 'Check answer', 'ตรวจคำตอบ')} <span>›</span></button>
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
                setSession(items=>items.map((item,index)=>index===items.length-1?{...item,confidence:value}:item))
                setState(current => addFeedbackToLatest(current, reason || undefined, value))
              }}
              onNext={next}
              nextLabel={session.length>=6 && passageBoundary ? L(lang,'See set results','ดูสรุปชุดนี้') : !extraPractice && goalReached && passageBoundary
                ? L(lang, 'Finish today’s target', 'จบตามเป้าหมายวันนี้')
                : L(lang, 'Next question', 'ข้อถัดไป')}
            />
          )}
      </div>
    </div>
  )
}

function QuestionCard({
  question,
  selected,
  checked,
  onSelect,
  contextText,
  showGrammar = true,
}: {
  question: Question
  selected: string
  checked: boolean
  onSelect: (id: string) => void
  contextText?: string
  showGrammar?: boolean
}) {
  const lang = useLanguage()
  const [inspectedChoice, setInspectedChoice] = useState('')

  return (
    <section className="mobile-question-card">
      <div className="question-badges">
        <span className="question-skill">{checked ? question.skills.slice(0, 2).map(skill => localizedSkill(skill, lang)).join(' · ') : `Part ${question.part}`}</span>
        {checked && <span className="difficulty-badge">{L(lang, 'Level', 'ระดับ')} {question.difficulty}</span>}
      </div>

      {!showGrammar ? <h2>{question.stem}</h2> : question.part !== 6
        ? <AnnotatedSentence key={question.id} question={question} selected={selected} contextText={contextText} checked={checked} />
        : null}


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
  const targetMs = questionTargetMs(question)
  const diagnosis = classifyAttempt(correct, elapsed, targetMs, confidence || undefined, reason || undefined)
  const ratio = elapsed / Math.max(targetMs,1)
  return (
    <section className={correct ? 'feedback-panel correct' : 'feedback-panel wrong'}>
      <div className="feedback-heading">
        <span>{correct ? '✓' : '×'}</span>
        <div>
          <b>{correct ? L(lang, 'Correct!', 'ถูกต้อง!') : L(lang, 'Not quite right!', 'ยังไม่ถูก')}</b>
          <small>{correct
            ? L(lang, `Correct answer · ${formatTime(elapsed)}`, `ตอบถูก · ${formatTime(elapsed)}`)
            : L(
                lang,
                `You chose ${selected}. ${selectedText} · Correct: ${question.answer}. ${answerText}`,
                `คุณเลือก ${selected}. ${selectedText} · คำตอบที่ถูก: ${question.answer}. ${answerText}`,
              )}</small>
        </div>
      </div>
      <div className={`speed-diagnosis ${diagnosis}`}>
        <div><b>{speedDiagnosisCopy(diagnosis, lang)}</b><small>{L(lang,'Target','เป้า')} {formatTime(targetMs)} · {L(lang,'Actual','ใช้จริง')} {formatTime(elapsed)}</small></div>
        <span>{ratio > 1.25 ? '↘' : ratio < 0.55 ? '⚡' : '✓'}</span>
      </div>
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
  const [answers,setAnswers] = useState<Record<string,string>>({})
  const [reviewIndex,setReviewIndex] = useState(0)
  const [showReview,setShowReview] = useState(false)
  const deadline=useRef(0)
  const [remaining, setRemaining] = useState(75 * 60)
  const questionStarted = useRef(0)

  const makeTest = () => {
    const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)

    return [
      ...shuffle(practicePool(part5,true)).slice(0, 30),
      ...completeReadingSample(practicePool(part6,true), passageById, 16),
      ...completeReadingSample(practicePool(part7,true), passageById, 54),
    ]
  }

  const start = () => {
    setQuestions(makeTest())
    setStarted(true)
    setFinished(false)
    setIndex(0)
    setSelected('')
    setCorrectCount(0)
    setAnswers({})
    setShowReview(false)
    setReviewIndex(0)
    deadline.current=Date.now()+75*60*1000
    setRemaining(75 * 60)
    questionStarted.current = performance.now()
  }

  useEffect(() => {
    if (!started || finished) return
    const timer = window.setInterval(() => {
      const seconds=Math.max(0,Math.ceil((deadline.current-Date.now())/1000))
      setRemaining(seconds)
      if (!seconds) setFinished(true)
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
    const missed=questions.filter(q=>answers[q.id]!==q.answer)
    const review=missed[Math.min(reviewIndex,Math.max(0,missed.length-1))]
    if (showReview && review) {
      const doc=review.passageId ? passageById[review.passageId] : undefined
      return <div className="screen practice-screen"><button className="back-link" onClick={()=>setShowReview(false)}>{L(lang,'Back to results','กลับไปผลสอบ')}</button><p>{L(lang,'Review','ทบทวน')} {reviewIndex+1}/{missed.length}</p>{doc && <PassageDocument passage={doc} part={review.part} question={review} selected={answers[review.id]??''} checked/>}<QuestionCard key={review.id} question={review} selected={answers[review.id]??''} checked onSelect={()=>undefined}/><button className="big-next" onClick={()=>reviewIndex+1<missed.length ? setReviewIndex(i=>i+1) : setShowReview(false)}>{L(lang,'Next review','ทบทวนข้อถัดไป')} →</button></div>
    }
    return (
      <div className="screen result-screen">
        <div className="result-badge pass">✓</div>
        <span className="tiny-label">{L(lang, 'SIMULATION COMPLETE', 'ทำชุดจำลองเสร็จแล้ว')}</span>
        <h1>{correctCount}/100 {L(lang, 'correct', 'ข้อถูก')}</h1>
        <Progress value={percent} />
        <p>{L(lang,'Your submitted answers update the adaptive plan. Review errors and unanswered items below.','คำตอบที่ส่งนำไปปรับแผน Adaptive แล้ว เปิดทบทวนข้อผิดและข้อที่ยังไม่ได้ตอบได้ด้านล่าง')}</p>{missed.length>0 && <button className="big-next" onClick={()=>setShowReview(true)}>{L(lang,'Review missed questions','ทบทวนข้อผิด / ยังไม่ได้ตอบ')} · {missed.length} →</button>}
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
    setAnswers(current=>({...current,[q.id]:selected}))
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
      {passage && (q.part === 6
        ? <PassageDocument key={q.id} passage={passage} part={6} question={q} selected={selected} checked={false} onAnswer={setSelected} completedAnswers={Object.fromEntries(questions.filter(item => answers[item.id]).map(item => [item.id,item.choices.find(c => c.id === answers[item.id])?.text ?? '']))} />
        : <article className="reading-passage"><span className="doc-type">PART {q.part}</span><h2>{passage.title}</h2><PassageVisual passage={passage} /><PassageText passage={passage} /></article>)}
      {q.part !== 6 && <QuestionCard key={q.id} question={q} selected={selected} checked={false} onSelect={setSelected} showGrammar={false} />}
      <button className="big-next" disabled={!selected} onClick={next}>{index === 99 ? L(lang, 'Finish', 'ส่งคำตอบ') : L(lang, 'Next', 'ข้อถัดไป')} <span>›</span></button>
      <small className="mock-note">{L(lang, 'No answer feedback during simulation.', 'โหมดจำลองสอบจะยังไม่เฉลยระหว่างทำ')}</small>
    </div>
  )
}

function Analytics({
  state,
  startLesson,
  navigate,
  vocabCount,
}: {
  state: TrainerState
  startLesson: (skill: SkillId) => void
  navigate: (view: View) => void
  vocabCount: number
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
  const recentDiagnoses = state.attempts.slice(0,40)
  const speedSummary = {
    onTarget: recentDiagnoses.filter(a=>a.diagnosis==='on-target').length,
    slow: recentDiagnoses.filter(a=>a.diagnosis==='correct-slow').length,
    knowledge: recentDiagnoses.filter(a=>a.diagnosis==='knowledge-gap').length,
    rushed: recentDiagnoses.filter(a=>a.diagnosis==='rushed' || a.diagnosis==='fast-guess').length,
    uncertain: recentDiagnoses.filter(a=>a.diagnosis==='uncertain').length,
  }

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

      <SectionTitle title={L(lang, 'Speed & Accuracy Diagnosis', 'วิเคราะห์ความเร็วและความแม่น')} />
      <section className="diagnosis-grid">
        <div><span>✓</span><b>{speedSummary.onTarget}</b><small>{L(lang,'On target','ถูกและทันเวลา')}</small></div>
        <div><span>◷</span><b>{speedSummary.slow}</b><small>{L(lang,'Correct but slow','ถูกแต่ช้า')}</small></div>
        <div><span>×</span><b>{speedSummary.knowledge}</b><small>{L(lang,'Knowledge gap','ยังไม่แม่น')}</small></div>
        <div><span>⚡</span><b>{speedSummary.rushed}</b><small>{L(lang,'Rushed / fast guess','รีบ / เดาเร็ว')}</small></div>
        <div><span>?</span><b>{speedSummary.uncertain}</b><small>{L(lang,'Correct but unsure','ถูกแต่ลังเล')}</small></div>
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

      {vocabCount > 0 && (
        <button className="vocab-analytics-banner" onClick={() => navigate('vocab')}>
          <span><b>{L(lang,'Vocabulary repair deck','คลังคำศัพท์ที่ต้องซ่อม')}</b><small>{L(lang,'Built automatically from words you actually missed','สร้างจากคำที่คุณตอบผิดจริงและจำไว้ใน Firebase')}</small></span>
          <strong>{vocabCount} {L(lang,'words','คำ')} ›</strong>
        </button>
      )}

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
