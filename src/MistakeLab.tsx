import { useState } from 'react'
import './MistakeLab.css'
import type { SkillId, TrainerState } from './types'
import { skillLabels } from './data'
import { thaiSkillLabels } from './i18n'

type Entry = { id: string; at: number; source: string; part: 5 | 6 | 7; prompt: string; wrong: string; correct: string; skill: SkillId; why: string }
const KEY = 'toeic-external-mistakes-v1'
const skills = Object.keys(skillLabels) as SkillId[]
function load(): Entry[] {
  try { const data: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]'); return Array.isArray(data) ? data.filter(x => x && typeof x.id === 'string' && skills.includes(x.skill)) : [] } catch { return [] }
}
export default function MistakeLab({ state, navigate, english }: { state: TrainerState; navigate: (part: 5 | 6 | 7) => void; english: boolean }) {
  const [entries, setEntries] = useState<Entry[]>(load)
  const [source, setSource] = useState('')
  const [part, setPart] = useState<5 | 6 | 7>(5)
  const [prompt, setPrompt] = useState('')
  const [wrong, setWrong] = useState('')
  const [correct, setCorrect] = useState('')
  const [skill, setSkill] = useState<SkillId>('verb-tense')
  const [why, setWhy] = useState('')
  const t = (en: string, th: string) => english ? en : th
  const label = (id: SkillId) => english ? skillLabels[id] : thaiSkillLabels[id] ?? skillLabels[id]
  const save = (next: Entry[]) => { localStorage.setItem(KEY, JSON.stringify(next)); setEntries(next) }
  const ranked = skills.map(id => ({ id, count: entries.filter(e => e.skill === id).length, mastery: state.skills[id]?.mastery })).filter(s => s.count).sort((a, b) => b.count - a.count || (a.mastery ?? 100) - (b.mastery ?? 100))
  return <div className="screen mistake-lab">
    <span className="eyebrow">REAL EXAM · MISTAKE LAB</span>
    <h1>{t('Analyze mistakes', 'วิเคราะห์ข้อผิดจากข้อสอบจริง')}</h1>
    <p>{t('Record mistakes from external exams and practice your weak topics. Existing lessons and progress remain unchanged.', 'บันทึกข้อผิดจากข้อสอบภายนอก แล้วเน้นฝึกหัวข้อที่พลาดโดยไม่ลบระบบเดิม')}</p>
    <div className="mistake-stats"><span><b>{entries.length}</b>{t('Mistakes', 'ข้อที่พลาด')}</span><span><b>{ranked.length}</b>{t('Weak topics', 'หัวข้อที่ต้องแก้')}</span></div>
    <section className="mistake-panel"><h2>{t('Record a wrong answer', 'บันทึกข้อที่ทำผิด')}</h2>
      <form onSubmit={e => { e.preventDefault(); if (!prompt.trim() || !correct.trim()) return; save([{ id: crypto.randomUUID(), at: Date.now(), source: source.trim(), part, prompt: prompt.trim(), wrong: wrong.trim(), correct: correct.trim(), skill, why: why.trim() }, ...entries]); setPrompt(''); setWrong(''); setCorrect(''); setWhy('') }}>
        <label>{t('Exam source', 'ชื่อชุดข้อสอบ')}<input value={source} onChange={e => setSource(e.target.value)} placeholder="TOEIC test #1" /></label>
        <label>Part<select value={part} onChange={e => setPart(Number(e.target.value) as 5 | 6 | 7)}><option value={5}>Part 5</option><option value={6}>Part 6</option><option value={7}>Part 7</option></select></label>
        <label>{t('Question and choices', 'โจทย์และตัวเลือก')}<textarea required rows={5} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t('Paste question, options and relevant passage', 'วางโจทย์ ตัวเลือก และข้อความที่เกี่ยวข้อง')} /></label>
        <div className="mistake-fields"><label>{t('Your answer', 'คำตอบที่เลือก')}<input value={wrong} onChange={e => setWrong(e.target.value)} /></label><label>{t('Correct answer', 'คำตอบที่ถูก')}<input required value={correct} onChange={e => setCorrect(e.target.value)} /></label></div>
        <label>{t('Weak topic', 'หัวข้อที่พลาด')}<select value={skill} onChange={e => setSkill(e.target.value as SkillId)}>{skills.map(s => <option key={s} value={s}>{label(s)}</option>)}</select></label>
        <label>{t('Reason / rule to remember', 'พลาดเพราะอะไร / กฎที่ควรจำ')}<textarea rows={3} value={why} onChange={e => setWhy(e.target.value)} placeholder={t('Explain why you got it wrong', 'เช่น ไม่รู้ศัพท์ อ่านผิด หรือใช้ tense ไม่ถูก')} /></label>
        <button className="mistake-save" type="submit">{t('Save mistake', 'บันทึกข้อผิด')}</button>
      </form>
    </section>
    <section className="mistake-panel"><h2>{t('Priority weaknesses', 'หัวข้อที่ต้องเน้นฝึก')}</h2>
      {ranked.length ? ranked.map(s => <div className="mistake-priority" key={s.id}><div><b>{label(s.id)}</b><small>{s.count} {t('mistake(s)', 'ข้อผิด')} · {s.mastery == null ? t('Not yet assessed', 'ยังไม่ประเมิน') : t('Existing mastery', 'ความแม่นเดิม') + ' ' + Math.round(s.mastery) + '%'}</small></div><button onClick={() => navigate(entries.find(e => e.skill === s.id)!.part)}>{t('Practice →', 'ฝึก Part นี้ →')}</button></div>) : <p>{t('Add a mistake to see your priorities.', 'บันทึกข้อแรกเพื่อดูจุดอ่อน')}</p>}
    </section>
    <section className="mistake-panel"><h2>{t('Mistake history', 'ประวัติข้อผิด')}</h2>{entries.map(e => <article className="mistake-entry" key={e.id}><strong>{label(e.skill)} · Part {e.part}</strong><small>{e.source || t('External test', 'ข้อสอบภายนอก')} · {new Date(e.at).toLocaleDateString(english ? 'en-US' : 'th-TH')}</small><p>{e.prompt}</p><p>{t('Selected', 'เลือก')}: {e.wrong || '—'} · {t('Correct', 'ถูก')}: <b>{e.correct}</b></p>{e.why && <p className="mistake-why">{e.why}</p>}<button onClick={() => { if (window.confirm(t('Remove this entry?', 'ลบข้อนี้?'))) save(entries.filter(item => item.id !== e.id)) }}>{t('Delete', 'ลบ')}</button></article>)}</section>
    <p>{t('Saved in this browser only; cross-device sync is not yet available.', 'บันทึกในเบราว์เซอร์เครื่องนี้เท่านั้น ยังไม่ซิงก์ข้ามอุปกรณ์')}</p>
  </div>
}
