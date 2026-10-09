import type { Attempt, Part, Question, SkillId, TrainerState } from './types'

/**
 * The question writer's rule ID often identifies a single item (exam2.conjunction.27).
 * A learner cannot transfer knowledge if every new item becomes its own new rule.
 * Group only structurally equivalent patterns; preserve original IDs in history.
 */
export function conceptKey(ruleId?: string, skills: SkillId[] = [], part?: Part): string {
  const id = (ruleId ?? '').trim().toLowerCase()
  if (!id) return skills[0] ?? 'unknown'
  if (/^(exam2?|adaptive-\d+)\.conjunction\./.test(id)) return 'connector.clause-vs-phrase'
  if (id === 'conjunction' && part === 5) return 'connector.clause-vs-phrase'
  if (/^connector\.(clause-vs-phrase|condition-purpose)/.test(id)) return id
  if (/^wordform\./.test(id)) return id
  if (/^(exam2?)\.part-of-speech\./.test(id)) return 'part-of-speech'
  if (/^(exam2?)\.verb-tense\./.test(id)) return 'verb-tense'
  if (/^(exam2?)\.vocabulary\./.test(id)) return 'vocabulary'
  if (/^(exam2?)\.collocation\./.test(id)) return 'collocation'
  if (/^(exam2?)\.subject-verb\./.test(id) || /^sva\./.test(id)) return 'subject-verb'
  if (/^(exam2?)\.passive\./.test(id)) return 'passive'
  if (/^gerund\./.test(id) || /^verb-pattern\.anticipate/.test(id)) return 'gerund.after-preposition'
  if (/^p6\.fixed-phrase/.test(id)) return 'p6.fixed-phrase'
  if (/^p6\.(connector|fixed)/.test(id)) return 'p6.context'
  if (/^p7\.not-except/.test(id)) return 'p7.not-except'
  if (/^(tense\.|conditional\.|inversion\.)/.test(id)) return 'verb-tense'
  if (/^vocab\./.test(id)) return id
  return id
}

export const isSecureTransfer = (attempt: Attempt) =>
  attempt.correct && (attempt.confidence ?? 3) === 3
    && attempt.elapsedMs <= (attempt.targetMs ?? (attempt.part === 5 ? 25_000 : attempt.part === 6 ? 45_000 : 75_000)) * 1.25

export type AdaptiveNeed = {
  concept: string
  skill: SkillId
  attempts: number
  misses: number
  recentMisses: number
  insecure: number
  independentTransfers: number
  priority: number
  lastAt: number
}

export function adaptiveNeeds(state: TrainerState, now = Date.now()): AdaptiveNeed[] {
  const groups = new Map<string, Attempt[]>()
  // Attempts are already latest-first and historical IDs must continue to work.
  for (const a of state.attempts.slice(0, 180)) {
    const concept = conceptKey(a.ruleId, a.skills, a.part)
    if (!concept || concept === 'unknown') continue
    const group = groups.get(concept) ?? []
    group.push(a)
    groups.set(concept, group)
  }
  const result: AdaptiveNeed[] = []
  for (const [concept, attempts] of groups) {
    const recent = attempts.slice(0, 8)
    const misses = recent.filter(a => !a.correct).length
    const recentMisses = attempts.slice(0, 4).filter(a => !a.correct).length
    const insecure = recent.filter(a => !isSecureTransfer(a)).length
    // Genuine transfer requires DIFFERENT questions and confidence/speed.
    // Count only secure transfers after the last incorrect / uncertain attempt.
    const secureIds = new Set<string>()
    for (const a of attempts) {
      if (!isSecureTransfer(a)) break
      secureIds.add(a.questionId)
      if (secureIds.size >= 3) break
    }
    const independentTransfers = secureIds.size
    const latestAt = attempts[0]?.at ?? 0
    const ageDays = Math.max(0, (now - latestAt) / 86_400_000)
    const mastered = independentTransfers >= 3
    const skill = attempts[0].skills[0] ?? 'context'
    const weakness = 100 - (state.skills[skill]?.mastery ?? 50)
    const due = ageDays > (mastered ? 3 : 1) ? 15 : 0
    const priority = mastered
      ? Math.min(25, 4 + due)
      : Math.round(Math.min(150,
        misses * 13 + recentMisses * 9 + Math.max(0, insecure - misses) * 5
        + (3 - independentTransfers) * 8 + weakness * 0.23 + due
      ))
    result.push({ concept, skill, attempts: recent.length, misses, recentMisses, insecure,
      independentTransfers, priority, lastAt: latestAt })
  }
  return result.sort((a,b) => b.priority - a.priority || b.recentMisses - a.recentMisses)
}

export function adaptiveReason(state: TrainerState, question: Question) {
  const concept = conceptKey(question.ruleId, question.skills, question.part)
  const need = adaptiveNeeds(state).find(item => item.concept === concept)
  const seen = state.attempts.some(a => a.questionId === question.id)
  if (need?.recentMisses) return {
    labelTh: 'ฝึกจุดที่เพิ่งพลาด', labelEn: 'Recent weak pattern',
    detailTh: `หัวข้อ ${concept} มีข้อผิดใน 4 ครั้งล่าสุด ${need.recentMisses} ครั้ง จึงเลือกประโยค${seen?'ทบทวน':'ใหม่'}มาทดสอบความเข้าใจ`,
    detailEn: `Recent errors in ${concept}; checking transfer with ${seen?'review':'a new'} question.`,
  }
  if (need && need.independentTransfers < 3 && need.insecure > 0) return {
    labelTh: 'ทวนจนมั่นใจจริง', labelEn: 'Verify transfer',
    detailTh: `เรื่อง ${concept} ยังไม่มีคำตอบที่ถูก มั่นใจ และทันเวลาในโจทย์ใหม่ 3 ข้อ จึงยังไม่ปลดออกจากรายการทบทวน`,
    detailEn: `The ${concept} pattern needs three secure answers on different examples.`,
  }
  const under = question.skills.find(s => (state.skills[s]?.attempts ?? 0) < 6)
  if (under) return {
    labelTh: 'เก็บหลักฐานทักษะที่ยังน้อย', labelEn: 'Skill coverage',
    detailTh: `ทักษะ ${under} ยังมีคำตอบไม่ถึง 6 ข้อ จึงต้องทดสอบเพิ่มเติมก่อนสรุปความแม่น`,
    detailEn: `The ${under} skill has fewer than six measured attempts.`,
  }
  return { labelTh: 'ทดสอบการนำไปใช้', labelEn: 'New-context transfer',
    detailTh: 'เลือกประโยคที่เปลี่ยนบริบทและตัวลวง เพื่อวัดความเข้าใจ ไม่ใช่จำคำตอบจากข้อเดิม',
    detailEn: 'Tests a pattern with different wording instead of memorizing an old answer.' }
}

export function recommendedReadingPart(state: TrainerState): { part: Part; reasonTh: string; reasonEn: string } {
  const counts = { 5: 0, 6: 0, 7: 0 }
  for (const a of state.attempts) if (a.part === 5 || a.part === 6 || a.part === 7) counts[a.part]++
  const targets = { 5: 90, 6: 48, 7: 54 }
  const deficits = ([5,6,7] as Part[]).map(part => ({part,ratio: Math.max(0,1-counts[part]/targets[part])}))
  // No extra Part 5 recommendation when Part 5 coverage is already sufficient.
  const pick = deficits.sort((a,b) => b.ratio - a.ratio)[0]
  const part = pick.part
  const reasonTh = `Part ${part} ทำแล้ว ${counts[part]}/${targets[part]} ข้อที่ต้องการสำหรับความครอบคลุม จึงควรเก็บหลักฐานส่วนนี้เพิ่ม`
  const reasonEn = `Part ${part} has ${counts[part]}/${targets[part]} target practice answers; build coverage here next.`
  return {part,reasonTh,reasonEn}
}
