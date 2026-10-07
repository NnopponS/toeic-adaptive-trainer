import react from '@vitejs/plugin-react'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { defineConfig, type Plugin } from 'vite'

function learnerProgressPlugin(): Plugin {
  const dataDir = path.resolve(process.cwd(), 'data')
  const progressFile = path.join(dataDir, 'learner-progress.json')
  const summaryFile = path.join(dataDir, 'learner-summary.md')

  return {
    name: 'learner-progress-persistence',
    configureServer(server) {
      server.middlewares.use('/api/progress', async (req, res) => {
        try {
          if (req.method === 'GET') {
            const text = await fs.readFile(progressFile, 'utf8').catch(() => '{}')
            res.setHeader('Content-Type', 'application/json')
            res.end(text)
            return
          }

          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end('Method not allowed')
            return
          }

          let raw = ''
          for await (const chunk of req) {
            raw += chunk
            if (raw.length > 4_000_000) throw new Error('Progress payload too large')
          }

          const payload = JSON.parse(raw)
          await fs.mkdir(dataDir, { recursive: true })
          await fs.writeFile(progressFile, JSON.stringify(payload, null, 2), 'utf8')

          const s = payload.summary ?? {}
          const weak = (s.weakestSkills ?? [])
            .map((x: { skill: string; mastery: number; attempts: number; accuracy: number; avgSeconds: number }) =>
              `- ${x.skill}: mastery ${x.mastery}%, accuracy ${x.accuracy}%, ${x.attempts} attempts, avg ${x.avgSeconds}s`)
            .join('\n')
          const mistakes = (s.recentMistakes ?? [])
            .slice(0, 20)
            .map((x: { questionId: string; selected: string; elapsedMs: number; skills: string[]; errorReason?: string }) =>
              `- ${x.questionId}: selected ${x.selected}, ${Math.round(x.elapsedMs / 1000)}s, skills=${x.skills.join('/')}${x.errorReason ? `, reason=${x.errorReason}` : ''}`)
            .join('\n')

          const md = `# TOEIC Learner Summary

Updated: ${s.updatedAt ?? new Date().toISOString()}
Exam: October 17, 2026
Days remaining: ${s.daysToExam ?? '?'}

## Current performance
- Answered: ${s.totals?.answered ?? 0}
- Overall accuracy: ${s.totals?.accuracy ?? 0}%
- Recent accuracy: ${s.totals?.recentAccuracy ?? 0}%
- Readiness: ${s.totals?.readiness ?? 0}%
- Today: ${s.totals?.today ?? 0}/${s.totals?.dailyGoal ?? 70}
- Improvement: ${s.improvement?.delta ?? 0} percentage points (baseline ${s.improvement?.baseline ?? 0}% → recent ${s.improvement?.recent ?? 0}%)
- Part 5 accuracy: ${s.partAccuracy?.part5 ?? 0}%
- Part 6 accuracy: ${s.partAccuracy?.part6 ?? 0}%
- Part 7 accuracy: ${s.partAccuracy?.part7 ?? 0}%

## Weakest skills
${weak || '- No skill evidence yet'}

## Self-reported mistake reasons
${Object.entries(s.mistakeReasons ?? {}).map(([k, v]) => `- ${k}: ${v}`).join('\n') || '- No self-reported reasons yet'}

## Recent mistakes
${mistakes || '- No mistakes recorded yet'}

## Agent instruction
Use this file plus learner-progress.json when extending the bank. Prefer new questions that target low-mastery skills, repeated distractor patterns, slow responses, and self-reported mistake reasons. Do not merely repeat identical wording.
`
          await fs.writeFile(summaryFile, md, 'utf8')
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true }))
        } catch (error) {
          res.statusCode = 500
          res.end(JSON.stringify({ ok: false, error: String(error) }))
        }
      })
    },
  }
}

export default defineConfig(({ command }) => ({
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify('6.1.0'),
    'import.meta.env.VITE_BUILD_ID': JSON.stringify(process.env.GITHUB_SHA?.slice(0, 7) ?? execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim()),
  },
  // GitHub Pages hosts this repository under /toeic-adaptive-trainer/.
  // Local development remains rooted at /.
  base: command === 'build' ? '/toeic-adaptive-trainer/' : '/',
  plugins: [react(), learnerProgressPlugin()],
}))
