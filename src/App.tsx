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

function passageWithActiveBlank(body: string, stem: string) {
  const blank = stem.match(/\[(\d+)\]/)?.[1]
  const pieces = body.split(/(\[\d+\]\s*_____)/g)
  return pieces.map((piece, index) => {
    const match = piece.match(/\[(\d+)\]/)
    if (!match) return <span key={index}>{piece}</span>
    const active = match[1] === blank
    return <mark key={index} className={active ? 'passage-blank active' : 'passage-blank'}>{piece}</mark>
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

function App() {
  const [view, setView] = useState<View>('home')
  const [state, setState] = useState<TrainerState>(() => loadLocalState())
  const [hydrated, setHydrated] = useState(false)
  const [connected, setConnected] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState(false)
  const [remoteQuestions, setRemoteQuestions] = useState<Question[]>([])
  const [lessonSkill, setLessonSkill] = useState<SkillId | null>(null)
  const [quickPart5, setQuickPart5] = useState(false)
  const [lang, setLang] = useState<Language>(() => localStorage.getItem(LANG_STORAGE_KEY) === 'en' ? 'en' : 'th')

  const allPart5 = useMemo(
    () => [...part5, ...remoteQuestions.filter(q => q.part === 5)],
    [remoteQuestions],
  )

  useEffect(() => {
    const stopConnection = watchConnection(setConnected)
    const stopQuestions = watchPersonalizedQuestions(setRemoteQuestions)

    loadCloudState()
      .then(cloud => setState(local => chooseFresher(normalizeState(local), cloud)))
      .catch(() => undefined)
      .finally(() => setHydrated(true))

    publishQuestionBankManifest({ part5: part5.length, part6: part6.length, part7: part7.length }).catch(() => undefined)
    return () => {
      stopConnection()
      stopQuestions()
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
        .catch(() => setSyncError(true))
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
              remoteCount={remoteQuestions.length}
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
              pool={part6}
              readingSwitch={part => navigate(part === 6 ? 'part6' : 'part7')}
            />
          )}
          {view === 'part7' && (
            <PracticeScreen
              part={7}
              state={state}
              setState={setState}
              pool={part7}
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
        <div className={`cloud-state ${connected ? 'online' : ''}`}>
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
  remoteCount,
}: {
  state: TrainerState
  startLesson: (skill: SkillId) => void
  navigate: (view: View) => void
  startQuickPart5: () => void
  remoteCount: number
}) {
  const lang = useLanguage()
  const focus = nextFocusSkill(state)
  const focusLesson = lessonBySkill[focus] ?? lessons[0]
  const focusText = localizedLesson(focusLesson, lang)
  const targets = dailyTargets()
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
          <PracticePartCard className="mint" part="5" title={L(lang, 'Grammar', 'ไวยากรณ์')} count={part5.length + remoteCount} progress={partAccuracy(state, 5)} onClick={startQuickPart5} />
          <PracticePartCard className="sky" part="6" title={L(lang, 'Text Completion', 'เติมข้อความ')} count={part6.length} progress={partAccuracy(state, 6)} onClick={() => navigate('part6')} />
          <PracticePartCard className="sun" part="7" title={L(lang, 'Reading', 'การอ่าน')} count={part7.length} progress={partAccuracy(state, 7)} onClick={() => navigate('part7')} />
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

function PracticeScreen({
  part,
  state,
  setState,
  pool,
  onBack,
  readingSwitch,
}: {
  part: Part
  state: TrainerState
  setState: StateSetter
  pool: Question[]
  onBack?: () => void
  readingSwitch?: (part: 6 | 7) => void
}) {
  const lang = useLanguage()
  const [question, setQuestion] = useState<Question>(() => pickAdaptiveQuestion(state, pool))
  const [selected, setSelected] = useState('')
  const [checked, setChecked] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [reason, setReason] = useState<ErrorReason | ''>('')
  const startedAt = useRef(performance.now())

  useEffect(() => {
    setQuestion(pickAdaptiveQuestion(state, pool))
    setSelected('')
    setChecked(false)
    setReason('')
    startedAt.current = performance.now()
    // reset only when pool/part changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [part, pool])

  const passage = question?.passageId ? passageById[question.passageId] : undefined
  if (!question) return <div className="screen"><div className="empty-state">{L(lang, 'No questions available.', 'ยังไม่มีโจทย์ในชุดนี้')}</div></div>

  const targets = dailyTargets()
  const partTarget = part === 5 ? targets.part5 : part === 6 ? targets.part6 : targets.part7
  const partDone = todayPartCount(state, part)

  const submit = () => {
    if (!selected || checked) return
    const ms = performance.now() - startedAt.current
    setElapsed(ms)
    setState(current => recordAttempt(current, question, selected, ms, { mode: 'adaptive' }))
    setChecked(true)
  }

  const next = () => {
    setQuestion(pickAdaptiveQuestion(state, pool, question.id))
    setSelected('')
    setChecked(false)
    setElapsed(0)
    setReason('')
    startedAt.current = performance.now()
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
          <small>{question.skills.slice(0, 2).map(skill => localizedSkill(skill, lang)).join(' · ')}</small>
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
        <span>{partDone}/{partTarget} {L(lang, `Part ${part} today`, `ข้อ Part ${part} วันนี้`)}</span>
      </div>

      {passage && (
        <article className="reading-passage">
          <div className="passage-heading">
            <span className="doc-type">{passage.kind.toUpperCase()}</span>
            <span className="passage-instruction">{part === 6
              ? L(lang, 'Choose the best option for the highlighted blank.', 'เลือกคำตอบที่ดีที่สุดสำหรับช่องว่างที่ไฮไลต์')
              : L(lang, 'Read the document and answer from the evidence.', 'อ่านเอกสารและตอบจากหลักฐานในบทความ')}</span>
          </div>
          <h2>{passage.title}</h2>
          <div className="passage-copy">{part === 6 ? passageWithActiveBlank(passage.body, question.stem) : passage.body}</div>
        </article>
      )}

      <QuestionCard question={question} selected={selected} checked={checked} onSelect={setSelected} />

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
            setState(current => addFeedbackToLatest(current, r))
          }}
          onNext={next}
          nextLabel={L(lang, 'Next question', 'ข้อถัดไป')}
        />
      )}
    </div>
  )
}

function QuestionCard({
  question,
  selected,
  checked,
  onSelect,
}: {
  question: Question
  selected: string
  checked: boolean
  onSelect: (id: string) => void
}) {
  const lang = useLanguage()
  return (
    <section className="mobile-question-card">
      <div className="question-badges">
        <span className="question-skill">{question.skills.slice(0, 2).map(skill => localizedSkill(skill, lang)).join(' · ')}</span>
        <span className="difficulty-badge">{L(lang, 'Level', 'ระดับ')} {question.difficulty}</span>
      </div>
      <h2>{question.stem}</h2>
      <div className="choices">
        {question.choices.map(choice => {
          const selectedChoice = selected === choice.id
          const correctChoice = checked && choice.id === question.answer
          const wrongChoice = checked && selectedChoice && choice.id !== question.answer
          return (
            <button
              key={choice.id}
              disabled={checked}
              className={['choice', selectedChoice ? 'selected' : '', correctChoice ? 'correct' : '', wrongChoice ? 'wrong' : ''].join(' ')}
              onClick={() => onSelect(choice.id)}
            >
              <span>{choice.id}</span>
              <b>{choice.text}</b>
              {correctChoice && <strong>✓</strong>}
              {wrongChoice && <strong>×</strong>}
            </button>
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
  onNext,
  nextLabel,
}: {
  question: Question
  selected: string
  correct: boolean
  elapsed: number
  reason: ErrorReason | ''
  onReason: (reason: ErrorReason) => void
  onNext: () => void
  nextLabel: string
}) {
  const lang = useLanguage()
  const answerText = question.choices.find(c => c.id === question.answer)?.text
  const courseRefs = chaptersForQuestion(question)
  const thaiExplanation = `คำตอบ ${question.answer}. ${answerText ?? ''} ถูก เพราะข้อนี้วัดเรื่อง ${localizedSkill(question.skills[0], lang)} — ${fallbackWrongExplanation(question, lang)}`
  return (
    <section className={correct ? 'feedback-panel correct' : 'feedback-panel wrong'}>
      <div className="feedback-heading">
        <span>{correct ? '✓' : '×'}</span>
        <div>
          <b>{correct ? L(lang, 'Correct!', 'ถูกต้อง!') : L(lang, 'Not quite right!', 'ยังไม่ถูก')}</b>
          <small>{correct
            ? L(lang, `Nice pattern recognition · ${formatTime(elapsed)}`, `จับรูปแบบได้ดี · ${formatTime(elapsed)}`)
            : L(lang, `Correct answer: ${question.answer}. ${answerText}`, `คำตอบที่ถูก: ${question.answer}. ${answerText}`)}</small>
        </div>
      </div>
      <div className="explain-box">
        <p>{lang === 'th' ? thaiExplanation : question.explanation}</p>
        {!correct && <p><b>{L(lang, 'Why your answer fails:', 'ทำไมคำตอบที่เลือกถึงผิด:')}</b> {lang === 'th' ? fallbackWrongExplanation(question, lang) : (question.whyOthers?.[selected] ?? fallbackWrongExplanation(question, lang))}</p>}
      </div>
      {!correct && courseRefs[0] && (
        <div className="mistake-study-card">
          <div className="mistake-study-head">
            <span>{L(lang, 'Review this chapter', 'กลับไปอ่านบทนี้')}</span>
            <b>{L(lang, 'Chapter', 'บทที่')} {courseRefs[0].id} · {localizedChapterTitle(courseRefs[0].id, courseRefs[0].title, lang)}</b>
          </div>
          <p className="mistake-study-section">{lang === 'th' ? `บทที่ ${courseRefs[0].id} · ${localizedChapterTitle(courseRefs[0].id, courseRefs[0].title, lang)}` : courseRefs[0].sections.join(' · ')}</p>
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
      {!correct && (
        <div className="rule-note">
          <b>{L(lang, 'Rule to remember', 'กฎที่ต้องจำ')}</b>
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
    return [...shuffle(part5).slice(0, 30), ...shuffle(part6).slice(0, 16), ...shuffle(part7).slice(0, 54)]
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
    setState(current => recordAttempt(current, q, selected, elapsed, { mode: 'mock' }))
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
