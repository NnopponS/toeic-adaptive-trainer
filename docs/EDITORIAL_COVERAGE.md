# Historical TOEIC choice-rationale audit (9 October 2026)

## Scope and coverage

Every bundled question in Part 5, Part 6, and Part 7 is audited by `scripts/check-coaching.mjs`.
The bank currently contains **802 questions / 3,208 A–D explanations**:

| Part | Questions | Authored and individually checked in prior edits | Contextualized from legacy stem, choices, explanations and evidence | A–D present |
| --- | ---: | ---: | ---: | ---: |
| Part 5 | 447 | 94 | 353 | 447 |
| Part 6 | 152 | 24 | 128 | 152 |
| Part 7 | 203 | 5 | 198 | 203 |
| **Total** | **802** | **123** | **679** | **802** |

Part 5/6/7 practice, mock questions, and lesson worked examples now display separate explanations
for A, B, C and D after answering. The additional live Firebase questions receive the
same completion pass when loaded. The 802 count excludes live Firebase packs and worked examples.

## Provenance and honesty

- `rationaleSource: authored`: a question already has individually written reason fields for all four choices.
- `rationaleSource: contextualized`: the missing rationales were constructed from the actual item, its
  explanation, the correct choice and the distractors. For Reading, the passage and cited evidence are
  also consulted. Such a rationale is **not certified as manually reviewed**, and the UI does not
  display the Reviewed label.
- The original authored `coaching.choiceReasons` or `whyOthersTh` always takes precedence.
  English `whyOthers` survives and is used as supporting information in previously missing Thai reasons.
- An explanation's presence is not proof that the underlying TOEIC-like question has one
  unambiguously correct answer. There is no claim that 679 generated historical rationales
  have been individually verified by an independent human examiner.

## Automated acceptance criteria

The coaching CI now fails when **any** bundled question lacks one of A–D, has missing/duplicate
answer identifiers, duplicate answer text, a missing core explanation, or a Part 6/7 passage
reference that is absent. It verifies that both NOT/EXCEPT evidence questions and questions
such as "What is NOT changing?" use the correct interpretation of negative phrasing.
It tests a Part 5 word-form distractor, a Part 7 number/exception case, and retained hand-authored
coaching.

## Quality-review workflow for future edits

1. Use the item ID (not just a topic) and reproduce the complete sentence or passage.
2. Verify the official answer against grammar, semantics and the document; repair any
   ambiguity rather than defending a bad key.
3. For each A–D option explain its part of speech/tense/collocation or its supported,
   unsupported or contradicted reading claim.
4. For a wrong vocabulary item give its Thai meaning when available.
5. Attach the evidence phrase or compare the exact subject, action, number, time or condition.
6. Only after all four options have been individually checked may the item be marked authored.
   Keep non-reviewed contextualized completions visibly distinct in the learner UI.

No student attempt, mastery, or cloud progress record is modified by this coverage pass.
