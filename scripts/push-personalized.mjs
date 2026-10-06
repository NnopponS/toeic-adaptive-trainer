import { readFile } from 'node:fs/promises'

const DB = process.env.FIREBASE_DB || 'https://toeic-study-c4905-default-rtdb.asia-southeast1.firebasedatabase.app'
const file = process.argv[2]

if (!file) {
  console.error('Usage: npm run firebase:personalize -- path/to/content.json')
  process.exit(1)
}

const input = JSON.parse(await readFile(file, 'utf8'))
const questions = Array.isArray(input)
  ? input
  : Array.isArray(input.questions)
    ? input.questions
    : input.questions
      ? Object.values(input.questions)
      : []
const passages = Array.isArray(input?.passages)
  ? input.passages
  : input?.passages
    ? Object.values(input.passages)
    : []

const questionPayload = Object.fromEntries(questions.map(question => {
  if (!question?.id || !question?.part || !Array.isArray(question?.choices)) {
    throw new Error('Each personalized question needs id, part, and choices')
  }
  return [question.id, { ...question, source:'personalized', createdAt:question.createdAt || Date.now() }]
}))

const passagePayload = Object.fromEntries(passages.map(passage => {
  if (!passage?.id || ![6, 7].includes(passage?.part) || !passage?.body || !Array.isArray(passage?.questions)) {
    throw new Error('Each personalized passage needs id, part 6/7, body, and questions')
  }
  return [passage.id, passage]
}))

async function patch(path, payload) {
  if (!Object.keys(payload).length) return
  const response = await fetch(`${DB}/questionBank/${path}.json`, {
    method:'PATCH',
    headers:{ 'content-type':'application/json' },
    body:JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
}

await patch('personalized', questionPayload)
await patch('passages', passagePayload)

console.log(`Uploaded ${Object.keys(questionPayload).length} personalized questions and ${Object.keys(passagePayload).length} passages.`)
