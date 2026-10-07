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
3. Give a mastery check of up to 10 reviewed questions on the same pattern (80% to pass).
4. Update mastery and difficulty from accuracy, response time, and confidence.
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

## Version 6 recall studio

Home shows three next actions: recall a pattern, practice a short adaptive set, and learn with worked examples. Learn separates the recall library from guided lessons. The library has 185 original recall cards referencing all 30 local course PDFs (444 pages), including grammar, vocabulary chunks, mnemonic cues, Listening strategies and Reading methods. Search by keyword, filter by chapter/category, and browse one card at a time. Longer pattern sets stay collapsed. Hide the note, try recalling, reveal, then rate the recall to schedule a 1-, 3-, or 7-day review. These are authored summaries and examples, not reproductions of every exercise, song or handwritten mark. Raw course PDFs remain private.

Practice starts with calibrated adaptive difficulty and offers a challenge setting. Short sets end after at least six answers at a passage boundary, with errors, uncertain answers, slow answers and a relevant recall card. Correct guesses count as weaker mastery evidence; repeated confidence ratings do not stack penalties. Part 5 uses 55 questions with reviewed word roles and authored Thai reasons for A–D. The larger historical bank remains available for learner history. Reading practice retains complete passage groups. Listening content currently teaches strategies and recall; the timed simulation is Reading only.

The sentence carries word classes and sentence functions. Its native thinking popup shows one step at a time: whole structure, clue, blank function, and final answer. Highlights follow the step; the blank stays hidden until the last step. Tap A–D after checking to inspect the specific reason. There are 118 reviewed positional grammar maps and 68 authored question explanations; older reading questions clearly mark automatic word labels.

The mock samples exactly 30/16/54 questions while keeping every reading set complete. Its deadline clock accounts for background-tab timer delays. Submitted answers can be reviewed after completion. Cloud hydration uses answer, feedback and recall modification times; an unsuccessful initial read cannot overwrite cloud progress with local defaults. Local progress is retained while offline and hydration retries on the browser's online event.

Layout, card transitions and progress animations use CSS, with reduced-motion support. `npm run check:coaching` checks source coverage, card parsing/review timing, confidence/calibration, hydration freshness, grammar alignment, answer visibility, complete mock samples and document annotations. UI checks use the development-only `?sandbox=1` route, which disables cloud and progress writes; it is unavailable in production. The footer shows version and Git commit for comparing local and deployed builds.

Reading format is calibrated against the [ETS sample test](https://www.ets.org/content/dam/ets-org/fr/pdfs/toeic/sample-test-listening-reading.pdf). Original practice difficulty is an internal training scale, not an official ETS score prediction.
