import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// Transpile the real modules so this check runs with Node, without a test dependency.
const dir = path.resolve('.project/local/coaching-check')
assert.equal(path.dirname(dir), path.resolve('.project/local'))
await mkdir(dir, { recursive: true })
const compiled = new Set()
async function compile(name) {
  if (compiled.has(name)) return
  compiled.add(name)
  let source = await readFile(`src/${name}.ts${name === 'App' ? 'x' : ''}`, 'utf8')
  source = source.replace(/import '\.\/[^']+\.css'/g, '').replaceAll('import.meta.env', '({ DEV: false })')
  const imports = [...source.matchAll(/from ['"]\.\/([^'"]+)['"]/g)].map(m => m[1])
  for (const dep of imports) await compile(dep)
  source = source.replace(/from ['"]\.\/([^'"]+)['"]/g, "from './$1.mjs'")
  if (name === 'App') source += '\nexport { labelWords, correctSentenceForMap, inspectionText, buildQuestionAnalysis, blankRequirement, QuestionCard, practicePool, BottomNav, PassageDocument, stepWordIndexes, chooseFresher };'
  await writeFile(path.join(dir, `${name}.mjs`), ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText)
}
try {
  await compile('App')
  const { labelWords, correctSentenceForMap, inspectionText, blankRequirement, QuestionCard, practicePool, BottomNav, PassageDocument, stepWordIndexes } = await import(pathToFileURL(path.join(dir, 'App.mjs')))
  const { allQuestions, part5, part6, part7, passageById } = await import(pathToFileURL(path.join(dir, 'data.mjs')))
  const { coachingQuestions, coachingPart6, coachingPart7, foundationCoaching } = await import(pathToFileURL(path.join(dir, 'bankCoaching.mjs')))
  const { reviewedGrammar, grammarClasses, grammarFunctions } = await import(pathToFileURL(path.join(dir, 'grammarGuide.mjs')))
  const { lessons } = await import(pathToFileURL(path.join(dir, 'lessons.mjs')))
  const { emptyState, recordAttempt, addFeedbackToLatest, pickAdaptiveQuestion, completeReadingSample, markVocabReview, classifyAttempt, questionTargetMs } = await import(pathToFileURL(path.join(dir,'adaptive.mjs')))
  const { courseCards, courseSources, cardIsDue, recallForQuestion } = await import(pathToFileURL(path.join(dir,'courseCards.mjs')))
  assert.equal(recallForQuestion(coachingQuestions.find(q=>q.id==='coach-p5-14')).chapter,19,'connector errors should recall connectors, not unrelated if-clause notes')
  assert.equal(courseSources.length,30)
  assert.equal(Object.keys(foundationCoaching).length,31)
  for (const q of practicePool(part5,false)) {
    assert.ok(q.coaching, `reviewed Part 5 needs authored coaching: ${q.id}`)
    assert.equal(q.coaching.steps.length,3)
    assert.deepEqual(Object.keys(q.coaching.choiceReasons),['A','B','C','D'])
    for (const clue of q.coaching.focus) assert.ok(q.stem.includes(clue), `${q.id}: ${clue}`)
    for (const choice of q.choices) assert.equal(inspectionText(q,choice.id,'th'),q.coaching.choiceReasons[choice.id])
  }
  for (const letter of ['B','C','D']) {
    const q=allQuestions.find(q=>q.id==='p5-v4-20-07')
    assert.ok(q.coaching.choiceReasons[letter].startsWith(q.choices.find(c=>c.id===letter).text))
  }
  assert.equal(new Set(courseCards.map(card=>card.id)).size,courseCards.length)
  for (const source of courseSources) assert.ok(courseCards.some(card=>card.chapter===source.id),`course coverage: ${source.file}`)
  for (const card of courseCards) for (const field of ['title','memory','pages','prompt','answer']) assert.ok(card[field],`${card.id}/${field}`)
  const recalled=markVocabReview(emptyState(),`card:${courseCards[0].id}`,true)
  assert.equal(cardIsDue(recalled,courseCards[0].id),false)
  assert.equal(cardIsDue(recalled,courseCards[0].id,Date.now()+4*86_400_000),true)
  for (const [pool,target] of [[part6,16],[part7,54]]) {
    for (let i=0;i<20;i++) {
      const sample=completeReadingSample(practicePool(pool,true),passageById,target)
      assert.equal(sample.length,target)
      assert.equal(new Set(sample.map(q=>q.id)).size,target)
      for (const id of new Set(sample.map(q=>q.passageId))) assert.deepEqual(sample.filter(q=>q.passageId===id).map(q=>q.id),passageById[id].questions,'mock must preserve every question in each passage')
    }
  }
  assert.ok(practicePool(part5,true).length>=30,'there must be enough reviewed challenge questions for the mock')
  const { chooseFresher } = await import(pathToFileURL(path.join(dir,'App.mjs')))
  const leak = renderToStaticMarkup(createElement(QuestionCard,{question:coachingQuestions[0],selected:'',checked:false,activeStep:3,onSelect:()=>{}}))
  assert.ok(leak.match(/<h2.*?<\/h2>/s)[0].includes('_____'), 'a previous explanation step must never reveal the next unanswered question')
  const answered = recordAttempt(emptyState(),coachingQuestions[0],coachingQuestions[0].answer,18000)
  const feedback = addFeedbackToLatest(answered,undefined,1)
  assert.ok(feedback.skills['part-of-speech'].mastery < answered.skills['part-of-speech'].mastery, 'a correct guess is weaker mastery evidence than a confident answer')
  assert.equal(addFeedbackToLatest(feedback,'guess').attempts[0].confidence,1,'changing the reason must preserve confidence')
  assert.equal(addFeedbackToLatest(feedback,undefined,1).skills['part-of-speech'].mastery,feedback.skills['part-of-speech'].mastery,'repeat feedback must not apply the penalty twice')
  const boundary=structuredClone(answered)
  boundary.skills['part-of-speech'].mastery=3
  boundary.skills['part-of-speech'].dueBoost=95
  const restored=addFeedbackToLatest(addFeedbackToLatest(boundary,undefined,1),undefined,3)
  assert.equal(restored.skills['part-of-speech'].mastery,3,'changing confidence must restore the baseline even at the mastery clamp')
  assert.equal(restored.skills['part-of-speech'].dueBoost,95,'changing confidence must restore the baseline even at the due-weight clamp')
  const newerCloud = {...feedback,modifiedAt:Date.now()+1000}
  assert.equal(chooseFresher(answered,newerCloud),newerCloud,'feedback updates must survive cloud hydration even if the latest answer timestamp is unchanged')
  const originalRandom = Math.random
  try {
    Math.random = () => .999
    const calibration = pickAdaptiveQuestion(emptyState(),[{...coachingQuestions[0],id:'foundation',difficulty:2},{...coachingQuestions[0],id:'advanced',difficulty:5}])
    assert.equal(calibration.id,'foundation','calibration must not jump to an advanced question just because the lottery picks it')
  } finally { Math.random=originalRandom }
  const examples = lessons.flatMap(lesson => lesson.workedExamples.map(example => ({ ...example, part:5,skills:[lesson.skill] })))
  const annotationErrors = []
  for (const [id,tags] of Object.entries(reviewedGrammar)) {
    const q = [...allQuestions,...examples].find(q => q.id === id)
    assert.ok(q, id)
    const words = labelWords(q, undefined, 'th').filter(word => !word.punctuation)
    const specs = tags.split(' ')
    if (words.length !== specs.length) annotationErrors.push(`${id}: ${words.length} words, ${specs.length} tags\n${words.map((w,i)=>`${i}:${w.text}`).join(' ')}`)
    specs.forEach(tag => { const [pos,role]=tag.split(':'); assert.ok(grammarClasses[pos],pos); if (role) assert.ok(grammarFunctions[role],role) })
  }
  assert.deepEqual(annotationErrors, [], 'reviewed annotations must align exactly with the sentence')
  const comparison = examples.find(q => q.id === 'cmp-1')
  comparison.coaching = {focus:['than'], steps:[],memory:'',choiceReasons:{}}
  const comparisonWords = labelWords(comparison, undefined, 'th')
  assert.deepEqual([...stepWordIndexes(comparison, undefined, 0, comparisonWords)].map(i => comparisonWords[i].text), ['sales','were'])
  assert.deepEqual([...stepWordIndexes(comparison, undefined, 1, comparisonWords)].map(i => comparisonWords[i].text), ['than'])
  assert.deepEqual([...stepWordIndexes(comparison, undefined, 3, comparisonWords)].map(i => comparisonWords[i].text), ['higher'])
  assert.equal(comparisonWords.find(w=>w.text==='higher').pos, 'Adj. ขั้นกว่า')
  const question = {
    id: 'check', part: 5, stem: 'The manager checked the figures twice _____ submitting the report.',
    choices: [{ id: 'A', text: 'before' }], answer: 'A', skills: ['conjunction'], difficulty: 3, explanation: 'before + V-ing',
  }
  const words = labelWords(question, undefined, 'en')
  for (const text of ['manager', 'figures', 'report']) {
    assert.equal(words.find(w => w.text === text)?.pos, 'N.', `${text} is a noun in this sentence`)
  }
  assert.equal(words.find(w => w.text === 'before')?.pos, 'Prep.', 'before + V-ing is prepositional')
  const repeated = { ...question, stem: 'The new system is as efficient _____ the old one.', choices: [{id:'A', text:'as'}] }
  const marked = labelWords(repeated, undefined, 'en').filter(w => w.answer)
  assert.equal(marked.length, 1)
  assert.equal(labelWords(repeated, undefined, 'en').findIndex(w => w.answer), 6, 'mark the filled blank, not the first identical word')
  assert.equal(new Set(allQuestions.map(q => q.id)).size, allQuestions.length, 'bank IDs must be unique')
  const v8 = part7.filter(q=>q.id.startsWith('v8-p7-'))
  assert.equal(v8.length,20,'V8 Part 7 bank should provide four complete five-question sets')
  assert.equal(new Set(v8.map(q=>q.passageId)).size,4,'V8 should include four distinct passages')
  assert.ok(v8.some(q=>/NOT|EXCEPT/.test(q.stem)),'V8 should include NOT/EXCEPT questions')
  assert.ok(v8.some(q=>q.skills.includes('multi-text')),'V8 should require cross-document reasoning')
  for (const q of v8) assert.ok(q.targetSeconds && q.targetSeconds>=75,'V8 Part 7 questions must carry realistic timing targets')
  const v8Triple=passageById['v8-p7-04']
  assert.equal((v8Triple.body.match(/DOCUMENT \d/g)??[]).length,3,'V8 includes a triple-document passage')
  const v8Html=renderToStaticMarkup(createElement(PassageDocument,{passage:v8Triple,part:7,question:v8[15],selected:'',checked:false}))
  assert.ok(v8Html.includes('multi-doc-header') && v8Html.includes('DOCUMENT 3'),'multi-document UI renders separated document cards')
  const speedTarget=questionTargetMs(coachingQuestions[0])
  assert.equal(classifyAttempt(true,speedTarget*1.4,speedTarget),'correct-slow')
  assert.equal(classifyAttempt(false,speedTarget*.4,speedTarget),'rushed')
  assert.equal(classifyAttempt(false,speedTarget,speedTarget),'knowledge-gap')
  assert.equal(classifyAttempt(true,speedTarget*.7,speedTarget,1),'fast-guess')
  const vocabQ=allQuestions.find(q=>q.id==='vocab-repair-streamline')
  const vocabMiss=recordAttempt(emptyState(),vocabQ,'B',20_000)
  assert.ok(vocabMiss.vocabReview['streamline']?.hard>0,'wrong vocab answers immediately enter the review loop')
  const vocabCorrect=recordAttempt(emptyState(),vocabQ,vocabQ.answer,20_000)
  const vocabUnsure=addFeedbackToLatest(vocabCorrect,undefined,1)
  assert.ok(vocabUnsure.vocabReview['streamline']?.hard>0,'low-confidence correct vocab answers also enter review')
  for (const q of [...coachingQuestions,...coachingPart6,...coachingPart7]) {
    assert.equal(q.coaching.steps.length, 3)
    for (const choice of q.choices) {
      assert.ok(q.coaching.choiceReasons[choice.id], `authored reason for ${q.id}/${choice.id}`)
      assert.equal(inspectionText(q, choice.id, 'th'), q.coaching.choiceReasons[choice.id])
    }
  }
  for (const q of coachingPart6) {
    const marker = q.stem.match(/\[\d+\]/)[0]
    const line = passageById[q.passageId].body.split(/(?<=[.!?])\s+(?=[A-Z]|\[\d+\])|\n/).find(line => line.includes(marker))
    const words = labelWords(q,line,'th').filter(word=>!word.punctuation)
    assert.equal(words.length, reviewedGrammar[q.id].split(' ').length, `reviewed tags cover the full active sentence in ${q.id}`)
  }
  for (const q of coachingQuestions) {
    assert.equal(q.coaching.steps.length, 3)
    assert.ok(q.choices.find(c => c.id === q.answer))
    for (const clue of q.coaching.focus) assert.ok(q.stem.includes(clue), `focus occurs in ${q.id}: ${clue}`)
    for (const choice of q.choices) assert.equal(inspectionText(q, choice.id, 'th'), q.coaching.choiceReasons[choice.id])
    for (const selected of [q.answer, q.choices.find(c => c.id !== q.answer).id]) {
      const html = renderToStaticMarkup(createElement(QuestionCard, { question: q, selected, checked: true, activeStep:3, onSelect: () => {} }))
      assert.equal((html.match(/<h2/g) ?? []).length, 1, 'one sentence, annotated in place')
      assert.ok(html.includes('popover="auto"') && html.includes('thinking-next'))
      assert.ok(html.includes(q.coaching.memory))
    }
    const before = renderToStaticMarkup(createElement(QuestionCard, { question: q, selected: '', checked: false, onSelect: () => {} }))
    assert.ok(!before.includes('popover="auto"') && !before.includes('sentence-word answer'), 'no answer leak before submission')
    assert.ok(before.includes('sentence-exam') && before.includes('_____'), 'practice starts as a normal exam-style sentence')
    assert.ok(!before.includes('word-pos') && !before.includes('word-function') && !before.includes('sentence-tools') && !before.includes('clause-outline') && !before.includes('grammar-estimate'), 'grammar/POS/function hints stay hidden until submission')
    const overview = renderToStaticMarkup(createElement(QuestionCard, { question:q, selected:q.answer, checked:true, onSelect:()=>{} }))
    assert.ok(overview.includes('มองภาพรวมประโยค') && !overview.includes('เลือกแล้วเช็ก'), 'popup shows just the current step')
  }
  assert.match(blankRequirement(coachingQuestions.find(q => q.id === 'coach-p5-11')).labelEn, /gerund/)
  assert.ok(practicePool(part5, true).every(q => q.difficulty >= 3))
  for (const bank of [part6, part7]) {
    const eligible = practicePool(bank, true)
    for (const q of eligible) assert.equal(eligible.filter(x => x.passageId === q.passageId).length, bank.filter(x => x.passageId === q.passageId).length, 'reading sets stay complete')
  }
  const p6 = part6[0]
  const p6Before = renderToStaticMarkup(createElement(PassageDocument, { passage: passageById[p6.passageId], part: 6, question: p6, selected: '', checked: false }))
  assert.ok(p6Before.includes('sentence-exam') && p6Before.includes('_____') && !p6Before.includes('word-pos') && !p6Before.includes('sentence-tools'), 'Part 6 stays exam-clean before submission')
  const documentHtml = renderToStaticMarkup(createElement(PassageDocument, { passage: passageById[p6.passageId], part: 6, question: p6, selected: p6.answer, checked: true }))
  assert.ok(documentHtml.includes('sentence-inline') && !documentHtml.includes('answer-sheet'), 'Part 6 annotation stays in document')
  const secondBlank = {...question, part:6, stem:'[2] _____', choices:[{id:'A',text:'reviewed'}]}
  assert.equal(correctSentenceForMap(secondBlank, 'The [1] _____ was [2] _____.'), 'The [1] _____ was reviewed.', 'fill only the active blank in a multi-blank sentence')
  const p6Popup = renderToStaticMarkup(createElement(PassageDocument, { passage:passageById[coachingPart6[0].passageId], part:6, question:coachingPart6[0], selected:coachingPart6[0].answer, checked:true, activeStep:3, onStep:()=>{} }))
  assert.equal((p6Popup.match(/popover="auto"/g) ?? []).length, 1, 'Part 6 thinking popup belongs to the active sentence')
  for (const q of [coachingQuestions[0],coachingPart6[0]]) {
    const mock = renderToStaticMarkup(createElement(QuestionCard,{question:q,selected:'',checked:false,onSelect:()=>{},showGrammar:false}))
    assert.equal((mock.match(/<h2/g) ?? []).length, 1)
    assert.ok(!mock.includes('word-pos') && !mock.includes('popover='), 'simulation keeps grammar coaching out of the timed question')
  }
  const crossReference = coachingPart7[1]
  const readingProps = {passage:passageById[crossReference.passageId],part:7,question:crossReference,selected:crossReference.answer,checked:true}
  const readingEvidence = renderToStaticMarkup(createElement(PassageDocument,{...readingProps,activeStep:2}))
  for (const clue of crossReference.coaching.focus) assert.ok(readingEvidence.includes(`class="passage-evidence-hit">${clue}</mark>`), `highlight every cross-document clue: ${clue}`)
  const readingOverview = renderToStaticMarkup(createElement(PassageDocument,{...readingProps,activeStep:0}))
  assert.ok(!readingOverview.includes('passage-evidence-hit'), 'reading evidence appears at its step, not before')
  const nav = renderToStaticMarkup(createElement(BottomNav, { view: 'part5', navigate: () => {} }))
  assert.match(nav, /nav-button active[^>]*>.*?ฝึก/)
  console.log(`PASS: ${Object.keys(reviewedGrammar).length} reviewed sentences, ${coachingQuestions.length + coachingPart6.length + coachingPart7.length + Object.keys(foundationCoaching).length} authored explanations, ${courseCards.length} recall cards / ${courseSources.length} PDFs, V8 Part 7 realism, vocab repair loop, speed diagnosis, calibration, confidence, hydration, four-step popup, exact blank position, answer visibility, complete reading sets, inline Part 6, navigation`)
} finally {
  await rm(dir, { recursive: true, force: true })
}
