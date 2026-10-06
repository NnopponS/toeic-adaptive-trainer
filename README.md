# TOEIC Reading Coach

Mobile-first adaptive TOEIC Reading trainer for the October 17, 2026 exam sprint.

## What is included

- Part 5: 214 original TOEIC-style questions
- Part 6: 40 questions across 10 business texts
- Part 7: 60 questions across single- and multi-document sets
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

The Firebase web configuration has production-safe client defaults in `src/firebase.ts`, so GitHub -> Netlify deployment works without manually copying Vite environment variables. These values are public Firebase web-app identifiers, not server credentials.

> Important: the current Realtime Database is in test mode. That is convenient for development, but a publicly deployed site should eventually use Firebase Authentication and restrictive RTDB rules.

## Local development

```bash
cd D:\Project\toeic-adaptive-trainer
npm install
npm run dev
```

## Verify

```bash
npm run build
npm run lint
```

## Netlify

The repository includes `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback: `/* -> /index.html`

Connect the GitHub repository to Netlify and deploy from the `main` branch.
