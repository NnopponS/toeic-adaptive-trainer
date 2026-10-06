# TOEIC Adaptive Trainer

Local-first TOEIC Reading trainer for an October 17, 2026 exam sprint.

## Current bank

- Part 5: 150 original TOEIC-style questions
- Part 6: 40 questions across 10 business texts
- Part 7: 60 questions across single- and multi-document reading sets
- Full Reading simulation: 30 Part 5 + 16 Part 6 + 54 Part 7 = 100 questions / 75 minutes

The app follows the current TOEIC Reading structure, but it does not copy official ETS/IIBC questions. All practice content in this repository is original.

## Fastest workflow

1. Run adaptive Part 5 every day.
2. When an answer is wrong, select the reason: Grammar, Vocabulary, Misread, Rushed, or Guessed.
3. Complete the daily 70-question mission.
4. Use Part 6 for fast context decisions and Part 7 for evidence scanning/paraphrase.
5. Use the 75-minute simulation to test pacing.
6. Return to ChatGPT and ask it to read `data/learner-summary.md` and `data/learner-progress.json`, then create the next personalized question batch.

## Persistent feedback

The browser still saves progress in localStorage, but the Vite dev server also writes:

- `data/learner-progress.json` — full learner state and attempt history
- `data/learner-summary.md` — compact agent-readable summary of weak skills, recent mistakes, error reasons, timing, improvement, and part accuracy

These files update automatically after practice. They are the handoff contract for future personalized question generation.

## Adaptive behavior

Question priority increases when:
- the exact question was missed,
- a tagged skill has low mastery,
- a skill recently received an error boost,
- the learner self-reports grammar/vocabulary/misread/rushed/guess patterns.

Recently seen questions are temporarily cooled down to avoid answer memorization. Once recent accuracy rises, the scheduler gives more weight to harder questions.

## Progress metrics

The dashboard shows:
- days until October 17,
- daily 70-question completion,
- reading readiness,
- recent accuracy,
- baseline vs recent improvement,
- Part 5/6/7 accuracy,
- skill mastery,
- mistake reasons,
- recent error notebook.

## Run

```bash
cd D:\Project\toeic-adaptive-trainer
npm install
npm run dev
```

Open the local Vite URL, normally http://localhost:5173.

## Verify

```bash
npm run build
npm run lint
```
