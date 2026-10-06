const DB = process.env.FIREBASE_DB || 'https://toeic-study-c4905-default-rtdb.asia-southeast1.firebasedatabase.app'

async function get(path) {
  const response = await fetch(`${DB}/${path}.json`)
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
  return response.json()
}

const [summary, state, bank] = await Promise.all([
  get('users/solo/summary'),
  get('users/solo/state'),
  get('questionBank/meta'),
])

const attempts = Array.isArray(state?.attempts) ? state.attempts.slice(0, 80) : []
const recentWrong = attempts.filter(item => item && item.correct === false).slice(0, 20)

console.log(JSON.stringify({
  inspectedAt: new Date().toISOString(),
  bank,
  summary,
  recentWrong,
}, null, 2))
