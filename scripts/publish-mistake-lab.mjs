import { readFile } from 'node:fs/promises'

const file = process.argv.find(arg => arg.endsWith('.json'))
const checkOnly = process.argv.includes('--check')
if (!file) throw new Error('Usage: node scripts/publish-mistake-lab.mjs [--check] mistake-lab/file.json')
const pack = JSON.parse(await readFile(file, 'utf8'))
const DB = process.env.FIREBASE_DB || 'https://toeic-study-c4905-default-rtdb.asia-southeast1.firebasedatabase.app'

function unique(items, name) {
  if (!Array.isArray(items)) throw new Error(name + ' must be an array')
  const ids = items.map(item => item.id)
  if (ids.some(id => !id || id.split('').some(char => '.#$[]/'.includes(char))) || ids.length !== new Set(ids).size) {
    throw new Error('Invalid or duplicate ' + name + ' IDs')
  }
  return items
}
for (const key of ['topics', 'mistakes', 'flashcards', 'questions', 'passages']) unique(pack[key], key)
const topics = new Set(pack.topics.map(item => item.id))
const questions = new Map(pack.questions.map(item => [item.id, item]))
const stems = new Set()
for (const q of pack.questions) {
  const body = q.stem?.replace(/\s+/g, ' ').trim().toLowerCase()
  if (!body || !topics.has(q.focusId) || ![5, 6, 7].includes(q.part) ||
      !Array.isArray(q.choices) || q.choices.length !== 4 ||
      q.choices.map(c => c.id).join(',') !== 'A,B,C,D' ||
      !q.choices.find(c => c.id === q.answer) ||
      !q.explanationTh || !q.coaching?.steps || q.coaching.steps.length !== 3 ||
      q.choices.some(c => !q.whyOthersTh?.[c.id])) {
    throw new Error('Invalid or unexplained question: ' + q.id)
  }
  // The four blanks in a Part 6 document are distinct even though their stems
  // would otherwise look like short placeholders.
  const identity = q.part + '|' + (q.passageId ?? '') + '|' + body
  if (stems.has(identity)) throw new Error('Duplicate question stem: ' + q.id)
  stems.add(identity)
}
for (const passage of pack.passages) {
  if (![6,7].includes(passage.part) || !Array.isArray(passage.questions) ||
      passage.questions.length !== 4 || !passage.body) throw new Error('Invalid passage: ' + passage.id)
  if (passage.questions.some((id, i) => !questions.has(id) ||
      questions.get(id).passageId !== passage.id || questions.get(id).part !== passage.part ||
      (passage.part === 6 && !passage.body.includes('[' + (i + 1) + '] _____')))) {
    throw new Error('Incomplete linked passage: ' + passage.id)
  }
}
if (pack.mistakes.some(item => !topics.has(item.focusId) || item.chosen === item.correct)) {
  throw new Error('Invalid user mistake mapping')
}
const expectedFlashcards = new Set(['commend', 'generous', 'regardless', 'simulated'])
if (pack.flashcards.some(item => !expectedFlashcards.has(item.word))) {
  throw new Error('Flashcard without verified wrong-answer evidence')
}
console.log('Validated', pack.questions.length, 'unique original questions,',
  pack.passages.length, 'complete passages,', pack.topics.length,
  'focus topics,', pack.flashcards.length, 'verified missed words.')
if (checkOnly) process.exit(0)

// PATCH child maps by ID. Never replace learner history or a previous mistake batch.
async function publish(key, values) {
  const rows = Object.fromEntries(values.map(item => [item.id, item]))
  if (!Object.keys(rows).length) return
  const response = await fetch(DB + '/mistakeLab/' + key + '.json', {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rows),
  })
  if (!response.ok) throw new Error('Firebase ' + key + ' failed ' + response.status + ': ' + await response.text())
}
for (const key of ['topics','mistakes','flashcards','questions','passages']) await publish(key, pack[key])
const meta = await fetch(DB + '/mistakeLab/meta.json', {
  method: 'PATCH', headers: { 'Content-Type':'application/json' },
  body: JSON.stringify({schemaVersion:1, latestBatch:pack.createdAt, updatedAt:Date.now()}),
})
if (!meta.ok) throw new Error('Firebase metadata update failed: ' + meta.status)
const verify = await fetch(DB + '/mistakeLab/meta.json').then(r => r.json())
if (verify.schemaVersion !== 1) throw new Error('Published Firebase metadata could not be verified')
console.log('Published and verified mistakeLab/* to Firebase; /users/solo/state was not changed.')
