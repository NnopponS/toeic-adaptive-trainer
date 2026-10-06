# TOEIC Adaptive Trainer — v2 Exam Sprint

## Deadline
Exam date: October 17, 2026.

## Product objective
Reduce the user's Part 5 error rate while increasing Part 6/7 reading speed before the exam. Every practice attempt should make the next practice set more targeted.

## Learning loop
1. Present an original TOEIC-style question tagged by skill.
2. Record answer, response time, part, and question ID.
3. On errors, optionally record the learner's reason: grammar, vocabulary, misread, rushed, or guessed.
4. Update per-skill mastery and repeat priority.
5. Cool down very recent questions to train the pattern rather than memorize the answer.
6. Increase difficulty when recent accuracy becomes strong.
7. Persist the full learner state to data/learner-progress.json.
8. Generate data/learner-summary.md for future agent sessions.
9. Future agents read those files and extend the bank around real weak patterns.

## Content contract
- Part 5: 150 questions.
- Part 6: 40 questions / 10 texts.
- Part 7: 60 questions including multiple-document sets.
- Full simulation can draw the official Reading counts: 30 / 16 / 54.

## Daily training target
70 questions per day:
- 35 Part 5 adaptive
- 12 Part 6 speed questions
- 23 Part 7 reading questions

As the exam approaches, use the 75-minute simulation more often while keeping targeted weak-point drills.

## Quality boundaries
- Do not copy or redistribute official ETS/IIBC sample question text.
- Original questions may imitate the format, business contexts, skill types, and difficulty patterns.
- Every question must have an answer, skill tags, difficulty, and explanation.
- Preserve learner progress files when updating the code or question bank.

## Verification
- npm run build
- npm run lint
- Browser QA: dashboard, Part 5 feedback reason, Part 6 text completion, Part 7 multi-text, mock timer/counts, feedback-file persistence.
