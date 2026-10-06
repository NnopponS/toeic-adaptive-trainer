import { initializeApp } from 'firebase/app'
import { get, getDatabase, onValue, ref, set, update } from 'firebase/database'
import { buildAgentSummary, dailyTargets, normalizeState } from './adaptive'
import type { FirebaseQuestionBank, Question, TrainerState } from './types'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const USER = 'solo'
const base = `users/${USER}`

const localDay = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export async function loadCloudState() {
  const snapshot = await get(ref(db, `${base}/state`))
  return snapshot.exists() ? normalizeState(snapshot.val() as TrainerState) : null
}

export async function syncCloudState(state: TrainerState) {
  const safe = normalizeState(state)
  const summary = buildAgentSummary(safe)
  const targets = dailyTargets()
  const todayAttempts = safe.attempts.filter(attempt => {
    const d = new Date(attempt.at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return key === localDay()
  })

  const payload = {
    [`${base}/state`]: safe,
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
      schemaVersion: 3,
      appVersion: '3.0.0',
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
  return onValue(ref(db, 'questionBank'), snapshot => {
    const bank = (snapshot.val() ?? {}) as FirebaseQuestionBank
    const questions = Object.values(bank.personalized ?? {})
      .filter(q => q && q.id && q.part && Array.isArray(q.choices))
      .map(q => ({ ...q, source: 'personalized' as const }))
    callback(questions)
  })
}

export async function publishQuestionBankManifest(counts: { part5: number; part6: number; part7: number }) {
  await set(ref(db, 'questionBank/meta'), {
    ...counts,
    appBankVersion: 3,
    updatedAt: Date.now(),
    note: 'Core bank is bundled with the app; personalized questions under questionBank/personalized are loaded live.',
  })
}

export { db }
