# TOEIC Reading Coach

Mobile-first adaptive TOEIC Reading trainer for the October 17, 2026 exam sprint.

## What is included

- Parts 5–7: original TOEIC-style questions, with 37 additional challenge questions in version 5
- Part 6: complete business text sets, including sentence insertion
- Part 7: single- and multi-document sets, including invoices and cross-document calculations
- Full Reading simulation: 30 Part 5 + 16 Part 6 + 54 Part 7 = 100 questions / 75 minutes
- Mobile-first PWA interface
- Firebase Realtime Database progress sync
- Live Firebase personalized-question bank
- Adaptive mastery, difficulty, spaced review, XP, streak, weak-point analytics

All bundled practice questions are original. Local reference PDFs under `example-toeic/` are used only for private style/difficulty calibration and are excluded from Git.

## Part 5 learning loop

Focused Part 5 lessons use:

1. Detect a weak grammar pattern.
2. Teach 5 worked examples with clue, rule, explanation, and common trap.
3. Give a 10-question mastery check on the same pattern.
4. Update mastery and difficulty from accuracy + response time.
5. Schedule the pattern for spaced review.
6. Mix it back into adaptive practice after the pattern improves.

Current guided topics include verb tense, word form, prepositions, conjunctions, subject-verb agreement, passive voice, relative clauses, pronouns, comparisons, and business collocations.

## Firebase

Firebase project: `toeic-study-c4905`

The web client syncs the single-user learner profile under:

`/users/solo/`

Personalized questions can be added live under:

`/questionBank/personalized/`

The Firebase web configuration has production-safe client defaults in `src/firebase.ts`, so GitHub Pages deployment works without manually copying Vite environment variables. These values are public Firebase web-app identifiers, not server credentials.

> Important: the current Realtime Database is in test mode. That is convenient for development, but a publicly deployed site should eventually use Firebase Authentication and restrictive RTDB rules.

## Local development

```bash
cd D:\Project\toeic-adaptive-trainer
npm install
npm run dev
```

## Verify

```bash
npm run check:coaching
npm run build
npm run lint
```

## GitHub Pages

The repository deploys automatically with `.github/workflows/deploy-pages.yml` whenever `main` is pushed.

Production URL:

`https://nnoppons.github.io/toeic-adaptive-trainer/`

The production Vite build uses the project-site base path `/toeic-adaptive-trainer/`, and the PWA manifest/service worker use the same scope.

## Version 5 coaching

Learn contains worked examples, chapter reminders, and mastery checks. Practice contains Part 5, 6, 7, and the timed reading simulation. Practice defaults to challenge questions while keeping every question in each reading set together; the all-level adaptive pool remains selectable.

The question itself carries word classes and sentence functions. The native thinking popup shows one step at a time: whole structure, clue, blank function, and final answer. Word highlights follow the step. Tap any choice after checking to inspect its reason.

87 sentences have reviewed positional grammar tags (50 worked examples and 37 new questions); older questions use explicitly marked automatic labels. New questions include specific reasons for all four choices. Course summaries stay collapsed until needed.

The footer shows version and Git commit so local and deployed builds can be compared. The CI workflow runs the coaching checks before deployment.
