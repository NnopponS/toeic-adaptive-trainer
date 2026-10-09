import { initializeApp } from 'firebase/app'
import { get, getDatabase, onValue, ref, update } from 'firebase/database'
import { buildAgentSummary, dailyTargets, normalizeState } from './adaptive'
import type { Passage, Question, TrainerState } from './types'

// Firebase web configuration is intentionally client-visible. Environment
// variables override these defaults when present, but the defaults keep
// GitHub -> Netlify deploys zero-config for this single-user study app.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDIvGwUhidzPDItLXy3bcHY6aM5ebM9zHQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'toeic-study-c4905.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://toeic-study-c4905-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'toeic-study-c4905',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'toeic-study-c4905.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '329309163147',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:329309163147:web:974c41a7f718ea15ae8e8e',
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const USER = 'solo'
const base = `users/${USER}`

const encodeRuleKey = (key: string) => key
  .replaceAll('%', '%25')
  .replaceAll('.', '%2E')
  .replaceAll('#', '%23')
  .replaceAll('$', '%24')
  .replaceAll('[', '%5B')
  .replaceAll(']', '%5D')
  .replaceAll('/', '%2F')

const decodeRuleKey = (key: string) => key
  .replaceAll('%2F', '/')
  .replaceAll('%5D', ']')
  .replaceAll('%5B', '[')
  .replaceAll('%24', '$')
  .replaceAll('%23', '#')
  .replaceAll('%2E', '.')
  .replaceAll('%25', '%')

const encodeRuleStats = (ruleStats: TrainerState['ruleStats']) => Object.fromEntries(
  Object.entries(ruleStats ?? {}).map(([key, value]) => [encodeRuleKey(key), value]),
)

const decodeRuleStats = (ruleStats: TrainerState['ruleStats'] | undefined) => Object.fromEntries(
  Object.entries(ruleStats ?? {}).map(([key, value]) => [decodeRuleKey(key), value]),
)

const localDay = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export async function loadCloudState() {
  const snapshot = await get(ref(db, `${base}/state`))
  if (!snapshot.exists()) return null
  const raw = snapshot.val() as TrainerState
  return normalizeState({ ...raw, ruleStats: decodeRuleStats(raw.ruleStats) })
}

export async function syncCloudState(state: TrainerState) {
  const safe = normalizeState(state)
  const cloudState = { ...safe, ruleStats: encodeRuleStats(safe.ruleStats) }
  const summary = buildAgentSummary(safe)
  const targets = dailyTargets(safe)
  const todayAttempts = safe.attempts.filter(attempt => {
    const d = new Date(attempt.at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return key === localDay()
  })

  const payload = {
    [`${base}/state`]: cloudState,
    [`${base}/summary`]: summary,
    [`${base}/daily/${localDay()}`]: {
      answered: todayAttempts.length,
      correct: todayAttempts.filter(a => a.correct).length,
      part5: todayAttempts.filter(a => a.part === 5).length,
      part6: todayAttempts.filter(a => a.part === 6).length,
      part7: todayAttempts.filter(a => a.part === 7).length,
      target: targets.total,
      updatedAt: Date.now(),
    },
    [`${base}/meta`]: {
      schemaVersion: 7,
      appVersion: '6.4.0',
      adaptiveVersion: 'v13-concept-transfer',
      lastSyncAt: Date.now(),
      examDate: '2026-10-17',
    },
  }

  // Firebase rejects undefined values; JSON round-trip strips optional fields cleanly.
  await update(ref(db), JSON.parse(JSON.stringify(payload)))
}

export function watchConnection(callback: (connected: boolean) => void) {
  return onValue(ref(db, '.info/connected'), snapshot => callback(snapshot.val() === true))
}

export function watchPersonalizedQuestions(callback: (questions: Question[]) => void) {
  return onValue(ref(db, 'questionBank/personalized'), snapshot => {
    const questions = Object.values((snapshot.val() ?? {}) as Record<string, Question>)
      .filter(q => q && q.id && q.part && Array.isArray(q.choices))
      .map(q => ({ ...q, source: 'personalized' as const }))
    callback(questions)
  })
}

export function watchPersonalizedPassages(callback: (passages: Passage[]) => void) {
  return onValue(ref(db, 'questionBank/passages'), snapshot => {
    const passages = Object.values((snapshot.val() ?? {}) as Record<string, Passage>)
      .filter(p => p && p.id && (p.part === 6 || p.part === 7) && Array.isArray(p.questions))
    callback(passages)
  })
}

export async function publishQuestionBankManifest(counts: { part5: number; part6: number; part7: number }) {
  await update(ref(db, 'questionBank/meta'), {
    ...counts,
    appBankVersion: 8,
    updatedAt: Date.now(),
    note: 'Core bank is bundled with the app; personalized questions and Part 6/7 passages are loaded live from Firebase.',
  })
}

export { db }
