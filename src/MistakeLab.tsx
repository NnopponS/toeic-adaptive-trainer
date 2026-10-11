import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { addFeedbackToLatest, markVocabReview, recordAttempt } from './adaptive'
import { watchMistakeLab } from './firebase'
import type { MistakeLabContent, RepairQuestion, TrainerState } from './types'
import './MistakeLab.css'

type Tab = 'overview' | 'practice' | 'cards'
type StateSetter = Dispatch<SetStateAction<TrainerState>>
const groups = ['grammar', 'reading'] as const

export default function MistakeLab({ state, setState, english }: { state: TrainerState; setState: StateSetter; english: boolean }) {
  const [content, setContent] = useState<MistakeLabContent | null>(null)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('overview')
  const [focus, setFocus] = useState('all')
  const [activeId, setActiveId] = useState('')
  const [selected, setSelected] = useState('')
  const [checked, setChecked] = useState(false)
  const [confidence, setConfidence] = useState<0 | 1 | 2 | 3>(0)
  const [round, setRound] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const [cardIndex, setCardIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const startAt = useRef(0)
  const t = (en: string, th: string) => english ? en : th

  useEffect(() => watchMistakeLab((data, message) => { setContent(data); setError(message ?? '') }), [])

  const topics = useMemo(() => (content?.topics ?? []).map(topic => {
    const past = state.attempts.filter(a => !a.correct && a.skills.includes(topic.skill)).slice(0, 80).length
    const rule = state.ruleStats[topic.ruleId]
    const mastery = state.skills[topic.skill]?.mastery
    const score = topic.priority + Math.min(18, past * 2) +
      Math.round((100 - (mastery ?? 50)) / 7) + Math.round((rule?.dueBoost ?? 0) / 8)
    const related = (content?.questions ?? []).filter(q => q.focusId === topic.id)
    const answered = related.filter(q => state.attempts.some(a => a.questionId === q.id)).length
    return { ...topic, past, mastery, score, answered, total: related.length }
  }).sort((a, b) => b.score - a.score), [content, state])

  const questionPool = useMemo(() => (content?.questions ?? []).filter(q =>
    focus === 'all' || q.focusId === focus
  ), [content, focus])

  const topicById = useMemo(() => Object.fromEntries((content?.topics ?? []).map(topic => [topic.id, topic])), [content])
  const seen = useMemo(() => new Set(state.attempts.map(a => a.questionId)), [state.attempts])
  const ordered = (pool: RepairQuestion[], done: string[]) => [...pool].sort((a, b) => {
    const score = (q: RepairQuestion) => {
      const topic = topics.find(item => item.id === q.focusId)
      const practicedInTopic = done.filter(id => pool.find(item => item.id === id)?.focusId === q.focusId).length
      const prior = state.attempts.find(attempt => attempt.questionId === q.id)
      return (seen.has(q.id) ? 0 : 350) + (topic?.score ?? 0) * 2
        - practicedInTopic * 28 + (!prior ? 50 : prior.correct ? -80 : 60)
    }
    return score(b) - score(a) || a.id.localeCompare(b.id)
  })
  const question = questionPool.find(q => q.id === activeId) ??
    ordered(questionPool.filter(q => !round.includes(q.id)), round)[0]
  const activeTopic = question ? topicById[question.focusId] : undefined
  const passage = content?.passages.find(item => item.id === question?.passageId)
  const totalCount = content?.questions.length ?? 0
  const card = content?.flashcards[cardIndex % Math.max(1, content.flashcards.length)]

  useEffect(() => { startAt.current = performance.now() }, [question?.id, tab])
  const resetQuestion = () => { setSelected(''); setChecked(false); setConfidence(0); startAt.current = performance.now() }
  const setTopicFilter = (id: string) => { setFocus(id); setActiveId(''); setRound([]); setFinished(false); resetQuestion() }

  const submitAnswer = (id: string) => {
    if (!question || checked) return
    setSelected(id)
    setChecked(true)
    setRound(list => list.includes(question.id) ? list : [...list, question.id])
    setState(current => recordAttempt(current, question, id, Math.max(1000, performance.now() - startAt.current), { mode: 'review' }))
  }
  const rateAnswer = (value: 1 | 2 | 3) => {
    if (confidence || !checked) return
    setConfidence(value)
    setState(current => addFeedbackToLatest(current, undefined, value))
  }
  const nextQuestion = () => {
    const next = ordered(questionPool.filter(q => !round.includes(q.id)), round)[0]
    if (!next) { setFinished(true); setActiveId(''); return }
    setActiveId(next.id)
    resetQuestion()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const startPractice = (id = 'all') => { setTopicFilter(id); setTab('practice'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const reviewCard = (knew: boolean) => {
    if (!card || !content) return
    setState(current => markVocabReview(current, card.word.toLowerCase(), knew))
    setCardIndex(current => (current + 1) % Math.max(1, content.flashcards.length))
    setRevealed(false)
  }

  if (error) return <div className="screen mistake-lab"><h1>{t('Mistake Lab', 'ห้องซ่อมจุดอ่อน')}</h1><p role="alert">{t('Could not load Firebase data: ', 'โหลดข้อมูล Firebase ไม่สำเร็จ: ')}{error}</p></div>
  if (!content) return <div className="screen mistake-lab"><h1>{t('Mistake Lab', 'ห้องซ่อมจุดอ่อน')}</h1><p>{t('Connecting to your Firebase practice data…', 'กำลังโหลดโจทย์และผลวิเคราะห์จาก Firebase…')}</p></div>

  return <div className="screen mistake-lab">
    <header className="ml-head">
      <span className="eyebrow">PERSONALIZED REPAIR · FIREBASE LIVE</span>
      <h1>{t('Mistake Lab', 'ห้องซ่อมจุดอ่อน')}</h1>
      <p>{t('Mistakes you send in chat become targeted exercises here; no manual entry needed.', 'ข้อที่คุณส่งในแชตจะถูกวิเคราะห์และเปลี่ยนเป็นแบบฝึกตรงจุดนี้ ไม่ต้องกรอกในเว็บเอง')}</p>
    </header>
    <div className="ml-switch" role="tablist" aria-label={t('Mistake Lab sections', 'ส่วนของห้องซ่อมจุดอ่อน')}>
      {([['overview','Analysis','วิเคราะห์'],['practice','Practice','ฝึกโจทย์'],['cards','Flashcards','การ์ดศัพท์']] as const).map(([id,en,th]) =>
        <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{t(en,th)}</button>)}
    </div>

    {tab === 'overview' && <>
      <div className="ml-stats">
        <div><b>{content.mistakes.length}</b><small>{t('External mistakes reviewed','ข้อผิดที่วิเคราะห์จากภายนอก')}</small></div>
        <div><b>{totalCount}</b><small>{t('New practice questions','โจทย์ใหม่ให้ฝึก')}</small></div>
        <div><b>{content.flashcards.length}</b><small>{t('Confirmed missed words','ศัพท์ผิดจริงเท่านั้น')}</small></div>
      </div>
      <section className="ml-panel">
        <div className="ml-panel-heading"><div><span className="eyebrow">{t('WHAT TO FIX FIRST', 'เรียงความสำคัญจากความผิดจริง')}</span><h2>{t('Your repair plan', 'แผนแก้จุดอ่อนของคุณ')}</h2></div><button className="ml-action" onClick={() => startPractice()}>{t('Start practice', 'เริ่มฝึก')} →</button></div>
        <p className="ml-muted">{t('Order adapts to your earlier TOEIC answers and mastery. These are study priorities, not an official test score.', 'ลำดับใช้ประวัติข้อที่ผิดและ mastery จาก Firebase ร่วมกับข้อที่ส่งทางแชต ไม่ใช่คะแนน TOEIC จริง')}</p>
        {topics.map((topic, index) => <article key={topic.id} className="ml-topic">
          <div className="ml-topic-title"><span className="ml-rank">{index + 1}</span><div><b>{english ? topic.titleEn : topic.titleTh}</b><small>{topic.source} · {topic.past} {t('previous misses in this skill', 'ข้อผิดเดิมในทักษะนี้')}</small></div><span className="ml-kind">{topic.kind}</span></div>
          <p><strong>{t('Where you went wrong: ', 'พลาดตรงไหน: ')}</strong>{topic.diagnosisTh}</p>
          <p><strong>{t('How to improve: ', 'ต้องปรับอย่างไร: ')}</strong>{topic.actionTh}</p>
          <div className="ml-topic-footer"><small>{topic.answered}/{topic.total} {t('new drills attempted','โจทย์ใหม่ที่ได้ลอง')} {topic.mastery == null ? '' : '· Mastery ' + Math.round(topic.mastery) + '%'}</small>
            {topic.kind === 'vocab' ? <button onClick={() => setTab('cards')}>{t('Review cards','ทวนศัพท์')} →</button> : <button onClick={() => startPractice(topic.id)}>{t('Train this topic','ฝึกเฉพาะเรื่องนี้')} →</button>}</div>
        </article>)}
      </section>
      <section className="ml-panel"><h2>{t('Your verified external mistakes', '7 ข้อผิดจริงที่คุณส่งมา')}</h2><p className="ml-muted">{t('These are diagnostic records; exercises use new original wording.', 'ข้อเดิมมีไว้ดูสาเหตุ โจทย์ฝึกจะเป็นสถานการณ์ใหม่ ไม่ใช่จำคำตอบเก่า')}</p>
        {content.mistakes.map(item => <details className="ml-evidence" key={item.id}>
          <summary><b>{item.id.replace('external-20261011-', '').toUpperCase()} · Part {item.part}</b><span>{item.chosen} → {item.correct}</span></summary>
          <p>{item.stem}</p><p>{t('Your answer','คุณเลือก')}: <strong>{item.chosenText}</strong> · {t('Correct','ที่ถูก')}: <strong>{item.correctText}</strong></p>
          <p className="ml-explanation">{item.analysisTh}</p>
        </details>)}
      </section>
    </>}

    {tab === 'cards' && <section className="ml-panel">
      <div className="ml-panel-heading"><h2>{t('Only words you actually missed', 'Flashcards เฉพาะคำที่เคยผิดจริง')}</h2><span className="ml-kind">{card ? cardIndex % content.flashcards.length + 1 : 0}/{content.flashcards.length}</span></div>
      <p className="ml-muted">{t('No unrelated vocabulary is mixed in. Tap to reveal; your recall ratings sync with your existing study progress.', 'ไม่มีคำศัพท์สุ่มปน แตะการ์ดเพื่อเปิดเฉลย กดจำได้/ยังไม่แม่นเพื่อบันทึกผลกลับ Firebase')}</p>
      {card ? <>
        <button type="button" className={'ml-flashcard' + (revealed ? ' revealed' : '')} onClick={() => setRevealed(true)} aria-expanded={revealed}>
          <span>{t('MISSED WORD', 'คำที่เคยพลาด')} · {card.pos}</span>
          <strong>{card.word}</strong>
          {revealed ? <div className="ml-flashback">
            <b>{card.meaningTh}</b>
            <p>{card.pattern}</p>
            <p className="ml-example">{card.example}</p>
            <p>{card.translationTh}</p>
            <p><b>{t('Common confusion:', 'สับสนกับ:')}</b> {card.contrastTh}</p>
          </div> : <em>{t('Tap to reveal meaning and contrast →','แตะเพื่อเปิดคำแปลและคำที่สับสน →')}</em>}
        </button>
        <small className="ml-muted">{card.source}</small>
        {revealed && <div className="ml-card-buttons">
          <button onClick={() => reviewCard(false)}>{t('Still weak — review again','ยังไม่แม่น · ทวนซ้ำ')}</button>
          <button onClick={() => reviewCard(true)}>{t('I remembered it','จำได้แล้ว')}</button>
        </div>}
      </> : <p>{t('No confirmed missed vocabulary yet.', 'ยังไม่มีคำศัพท์ที่ยืนยันว่าตอบผิด')}</p>}
    </section>}

    {tab === 'practice' && <section className="ml-panel ml-practice">
      <div className="ml-panel-heading"><div><span className="eyebrow">{t('TARGETED TOEIC PRACTICE', 'โจทย์ซ่อมจุดอ่อนแบบ TOEIC')}</span><h2>{t('Train with new examples', 'ฝึกโจทย์ใหม่ที่ตรงกับข้อผิด')}</h2></div><span className="ml-kind">{round.length}/{questionPool.length}</span></div>
      <label className="ml-select-label">{t('Focus topic','เลือกเรื่องที่อยากฝึก')}
        <select value={focus} onChange={e => setTopicFilter(e.target.value)}>
          <option value="all">{t('Adaptive: all my weaknesses','Adaptive · เน้นทุกจุดอ่อน')}</option>
          {topics.filter(topic => groups.includes(topic.kind as typeof groups[number]) && topic.total).map(topic =>
            <option value={topic.id} key={topic.id}>{english ? topic.titleEn : topic.titleTh} ({topic.total})</option>)}
        </select>
      </label>
      {finished ? <div className="ml-done">
        <h3>{t('Set completed!', 'จบชุดฝึกแล้ว')}</h3><p>{round.length} {t('distinct questions completed. Results are included in your regular Firebase progress.', 'ข้อที่ไม่ซ้ำ คะแนนบันทึกลงความก้าวหน้า Firebase เดิมแล้ว')}</p>
        <button className="ml-action" onClick={() => setTopicFilter(focus)}>{t('Practice the set again', 'ฝึกทบทวนอีกรอบ')}</button>
      </div> : question ? <>
        <div className="ml-qmeta"><span>Part {question.part}</span><span>{english ? activeTopic?.titleEn : activeTopic?.titleTh}</span><span>{seen.has(question.id) ? t('Review','ทบทวน') : t('New','ข้อใหม่')}</span></div>
        {passage && <article className="ml-passage"><small>{passage.kind.toUpperCase()} · {t('Read before answering', 'อ่านก่อนตอบ')}</small><h3>{passage.title}</h3><div>{passage.body.split('\n').map((line, index) => <p key={index}>{line || '\u00a0'}</p>)}</div></article>}
        <h3 className="ml-stem">{question.part === 5 ? question.stem : question.part === 6 ? t('Choose the best answer for ', 'เลือกคำตอบที่เหมาะสมสำหรับ ') + question.stem : question.stem}</h3>
        <div className="ml-options" role="group" aria-label={t('Answer choices','ตัวเลือกคำตอบ')}>
          {question.choices.map(choice => <button key={choice.id} type="button" disabled={checked}
            className={checked && choice.id === question.answer ? 'correct' : checked && choice.id === selected ? 'wrong' : ''} onClick={() => submitAnswer(choice.id)}>
            <b>{choice.id}</b><span>{choice.text}</span>{checked && choice.id === question.answer ? <span aria-label="correct">✓</span> : null}
          </button>)}
        </div>
        {checked && <div className="ml-rationale" aria-live="polite">
          <h3>{selected === question.answer ? t('Correct — now verify the rule', 'ถูกแล้ว · เช็กว่ารู้เหตุผลจริงไหม') : t('Incorrect — here is the exact mistake', 'ยังผิด · มาดูจุดที่พลาดจริง')}</h3>
          {activeTopic && <p><b>{t('Your improvement target: ', 'ประเด็นที่ต้องปรับ: ')}</b>{activeTopic.actionTh}</p>}
          <p className="ml-explanation">{question.explanationTh}</p>
          <div className="ml-choice-analysis">{question.choices.map(choice =>
            <div key={choice.id} className={choice.id === question.answer ? 'answer' : choice.id === selected ? 'chosen' : ''}><b>{choice.id}. {choice.text}</b><span>{question.whyOthersTh?.[choice.id] ?? question.coaching?.choiceReasons[choice.id]}</span></div>)}</div>
          <p className="ml-muted">{t('How confident were you? Your rating improves adaptive prioritization.', 'มั่นใจแค่ไหน? ระดับความมั่นใจช่วยให้ Adaptive เลือกข้อที่ควรฝึกซ้ำ')}</p>
          <div className="ml-confidence">{([1,2,3] as const).map(value => <button type="button" key={value} disabled={confidence !== 0} className={confidence === value ? 'active' : ''} onClick={() => rateAnswer(value)}>{value === 1 ? t('Guessed', 'เดา') : value === 2 ? t('Unsure', 'ยังลังเล') : t('Confident', 'มั่นใจ')}</button>)}</div>
          <button type="button" className="ml-action ml-next" disabled={!confidence} onClick={nextQuestion}>{t('Next new question','ข้อถัดไป')} →</button>
        </div>}
      </> : <p>{t('This topic has no published questions yet.', 'ยังไม่มีโจทย์หัวข้อนี้จาก Firebase')}</p>}
    </section>}
  </div>
}
