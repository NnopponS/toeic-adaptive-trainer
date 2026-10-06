# Adaptive Agent Workflow

Use this workflow whenever the learner says they finished studying and asks ChatGPT/lnwjud to review progress or adapt the trainer.

1. Run `npm run firebase:inspect`.
2. Read `users/solo/summary.readinessReport`, especially:
   - `gaps` for skills with too little evidence.
   - `weakestRules` for rule-level accuracy/mastery/speed.
   - `gates` for Part 5/6/7 coverage, recent accuracy, timing, and full-mock evidence.
   - `nextActions` for the current priority.
3. Inspect `recentWrong` to distinguish grammar, vocabulary, misread, rushed, and guessed mistakes.
4. Prefer adding targeted questions live under `questionBank/personalized` instead of redeploying the app when only content needs to change. Part 6/7 personalized sets may also include passages under `questionBank/passages`. New questions should include:
   - unique `id`
   - `part`, `stem`, four `choices`, `answer`
   - `skills`
   - `difficulty` 1-5
   - `explanation`
   - specific `ruleId`
   - `chapterIds` from the learner course
   - optional `targetSeconds`
5. Create a JSON array of targeted questions and run:
   `npm run firebase:personalize -- path/to/questions.json`
6. Change application code only when the data shows a structural problem (selection logic, timing model, missing chapter mapping, UI, or analytics), not just because one rule is weak.
7. Never overwrite `users/solo/state` while personalizing. The learner history is the evidence source.
8. After code changes, run build/lint and push to main.

The readiness percentage is a training-coverage metric, not a guaranteed TOEIC score. A high score requires broad skill evidence, Part 5/6/7 coverage, strong recent accuracy, acceptable timing, and at least one full Reading mock.
