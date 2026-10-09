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
  source = source.replace(/import '\.\/[^']+\.css'/g, '').replaceAll('import.meta.env', '({ DEV: false, BASE_URL: '/' })')
  const imports = [...source.matchAll(/from ['"]\.\/([^'"]+)['"]/g)].map(m => m[1])
  for (const dep of imports) await compile(dep)
  source = source.replace(/from ['"]\.\/([^'"]+)['"]/g, "from './$1.mjs'")
  if (name === 'App') source += '\nexport { labelWords, correctSentenceForMap, inspectionText, buildQuestionAnalysis, blankRequirement, QuestionCard, practicePool, BottomNav, PassageDocument, stepWordIndexes, chooseFresher, sentenceGroups, firstQuestionOfPickedPassage, PracticeScreen };'
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
  const { emptyState, recordAttempt, addFeedbackToLatest, pickAdaptiveQuestion, completeReadingSample, markVocabReview, classifyAttempt, questionTargetMs, repairNeeds, questionWeight, questionFingerprint } = await import(pathToFileURL(path.join(dir,'adaptive.mjs')))
  const { courseCards, courseSources, cardIsDue, recallForQuestion } = await import(pathToFileURL(path.join(dir,'courseCards.mjs')))
  assert.equal(recallForQuestion(coachingQuestions.find(q=>q.id==='coach-p5-14')).chapter,19,'connector errors should recall connectors, not unrelated if-clause notes')
  assert.equal(courseSources.length,30)
  assert.equal(Object.keys(foundationCoaching).length,31)
  for (const q of part5.filter(q=>reviewedGrammar[q.id])) {
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
  assert.ok(practicePool(part5,true).length>=30,'there must be enough challenging Part 5 questions for the mock')
  assert.ok(practicePool(part5,false).length>150,'full Part 5 pool must not be limited to grammar-map examples')
  assert.ok(new Set(practicePool(part5,false).map(q=>q.id)).size===practicePool(part5,false).length,'no duplicate IDs in practice');
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
  // Execute the real hydration effect with an offline/reconnecting Firebase connection.
  const appSource = await readFile('src/App.tsx','utf8')
  const hydrationStart = appSource.indexOf('    const stopQuestions = watchPersonalizedQuestions')
  const hydrationBody = appSource.slice(hydrationStart,appSource.indexOf('  }, [])',hydrationStart))
  const pendingReads = []
  const listeners = new Map()
  let connection, hydrated=false, syncError=false, local=answered
  const stopHydration = new Function('deps', `const { watchPersonalizedQuestions, watchPersonalizedPassages, watchConnection, loadCloudState, setRemoteQuestions, setRemotePassages, setState, setHydrated, setSyncError, setConnected, chooseFresher, normalizeState, publishQuestionBankManifest, part5, part6, part7, window } = deps; ${hydrationBody}`)({
    watchPersonalizedQuestions:()=>()=>{}, watchPersonalizedPassages:()=>()=>{},
    watchConnection:callback=>{connection=callback; return ()=>{}},
    loadCloudState:()=>new Promise(resolve=>pendingReads.push(resolve)),
    setRemoteQuestions:()=>{}, setRemotePassages:()=>{}, setConnected:()=>{},
    setState:updater=>{local=updater(local)}, setHydrated:value=>{hydrated=value}, setSyncError:value=>{syncError=value},
    chooseFresher, normalizeState:s=>s, part5, part6, part7,
    publishQuestionBankManifest:()=>Promise.resolve(),
    window:{addEventListener:(name,callback)=>listeners.set(name,callback),removeEventListener:name=>listeners.delete(name)},
  })
  connection(false)
  pendingReads[0](newerCloud)
  await Promise.resolve()
  assert.equal(hydrated,false,'a read completed after disconnect must not unlock cloud writes')
  connection(true)
  assert.equal(pendingReads.length,2,'Firebase reconnect triggers a fresh cloud read')
  pendingReads[1](newerCloud)
  await Promise.resolve()
  assert.equal(hydrated,true)
  assert.equal(local,newerCloud)
  listeners.get('focus')()
  assert.equal(hydrated,false,'returning to the app pauses uploads until cloud state is read')
  stopHydration()
  pendingReads[2](answered)
  await Promise.resolve()
  assert.equal(local,newerCloud,'a stopped hydration cannot replace local progress')
  assert.equal(syncError,false)
  assert.equal(listeners.size,0,'cleanup removes retry listeners')
  const { extraPassagesV9, extraReadingV9 } = await import(pathToFileURL(path.join(dir,'bankV9Reading.mjs')))
  const { PracticeScreen } = await import(pathToFileURL(path.join(dir,'App.mjs')))
  assert.equal(extraReadingV9.filter(q=>q.part===6).length,24)
  assert.equal(extraReadingV9.filter(q=>q.part===7).length,16)
  for (const passage of extraPassagesV9) {
    const words=passage.body.split(/\s+/).filter(Boolean).length
    assert.ok(words >= (passage.part===6 ? 170 : passage.kind==='multi' ? 320 : 230), `${passage.id}: full reading passage (${words} words)`)
    const questions=extraReadingV9.filter(q=>q.passageId===passage.id)
    assert.deepEqual(questions.map(q=>q.id),passage.questions)
    for (const q of questions) {
      assert.equal(q.choices.length,4)
      assert.equal(new Set(q.choices.map(c=>c.text)).size,4)
      assert.ok(q.choices.some(c=>c.id===q.answer))
      assert.ok(q.explanation && q.explanationTh)
      for (const c of q.choices.filter(c=>c.id!==q.answer)) assert.ok(q.whyOthers[c.id], `${q.id}: distractor rationale ${c.id}`)
      if (q.evidence) assert.ok(passage.body.includes(q.evidence),`${q.id}: evidence must occur in the document`)
    }
    if (passage.part===6) {
      assert.equal(questions.length,4)
      assert.equal(questions.filter(q=>q.skills.includes('sentence-placement')).length,1)
      for (let number=1;number<=4;number++) assert.equal((passage.body.match(new RegExp(`\\[${number}\\] _____`,'g'))??[]).length,1)
    }
  }
  for (const bank of [part6,part7]) {
    assert.ok(practicePool(bank,true).every(q=>passageById[q.passageId].examStyle),'exam practice excludes legacy mini-passages')
    assert.ok(practicePool(bank,false).every(q=>passageById[q.passageId].examStyle),'adaptive reading still uses full documents')
  }
  const inlineQ=extraReadingV9.find(q=>q.id==='v9-p6-01-q1')
  const inlinePassage=passageById[inlineQ.passageId]
  const inlineBefore=renderToStaticMarkup(createElement(PassageDocument,{passage:inlinePassage,part:6,question:inlineQ,selected:'',checked:false,onAnswer:()=>{}}))
  assert.equal((inlineBefore.match(/class="p6-active-blank/g)??[]).length,1,'one active answer location in the document')
  assert.ok(inlineBefore.includes('aria-expanded="false"') && !inlineBefore.includes('p6-inline-choices') && !inlineBefore.includes('answer-summary'),'choices and feedback are collapsed before tapping the blank')
  const practiceHtml=renderToStaticMarkup(createElement(PracticeScreen,{part:6,state:emptyState(),setState:()=>{},pool:part6,passageMap:passageById}))
  assert.ok(practiceHtml.includes('p6-inline-document') && !practiceHtml.includes('mobile-question-card'),'Part 6 has no duplicated bottom answer card')
  const inlineAfter=renderToStaticMarkup(createElement(PassageDocument,{passage:inlinePassage,part:6,question:inlineQ,selected:'B',checked:true,onAnswer:()=>{}}))
  assert.equal((inlineAfter.match(/class="answer-summary"/g)??[]).length,1)
  assert.ok(inlineAfter.includes('[1] is scheduled') && !inlineAfter.includes('p6-inline-choices'),'submitted blank is filled and its picker is closed')
  const submitStart=appSource.indexOf('  const submit = (answerId = selected)',appSource.indexOf('function PracticeScreen'))
  const submitBody=appSource.slice(submitStart,appSource.indexOf('  const next =',submitStart))
  let submitted=emptyState(), submittedChoice='', checkedInline=false
  const submitInline=new Function('deps',`const { selected, checked, question, performance, startedAt, setSelected, setElapsed, setSession, setState, setChecked, recordAttempt }=deps; ${submitBody} return submit;`)({
    selected:'A',checked:false,question:inlineQ,performance:{now:()=>30_000},startedAt:{current:0},
    setSelected:id=>{submittedChoice=id},setElapsed:()=>{},setSession:()=>{},setState:updater=>{submitted=updater(submitted)},setChecked:value=>{checkedInline=value},recordAttempt,
  })
  submitInline('B')
  assert.equal(submittedChoice,'B')
  assert.equal(submitted.attempts[0].selected,'B','inline submission records the clicked choice, not the previous React state')
  assert.equal(submitted.attempts[0].correct,true)
  assert.equal(checkedInline,true)
  const originalRandom = Math.random
  try {
    Math.random = () => .999
    const calibration = pickAdaptiveQuestion(emptyState(),[{...coachingQuestions[0],id:'foundation',difficulty:2},{...coachingQuestions[0],id:'advanced',difficulty:5}])
    assert.equal(calibration.id,'foundation','calibration must not jump to an advanced question just because the lottery picks it')
  } finally { Math.random=originalRandom }
  const { sentenceGroups, firstQuestionOfPickedPassage } = await import(pathToFileURL(path.join(dir,'App.mjs')))
  const clauseQ = allQuestions.find(q=>q.id==='p5-06')
  const grouped = sentenceGroups(clauseQ,labelWords(clauseQ,undefined,'en'))
  assert.deepEqual(grouped.filter(g=>g.tone==='subordinate').flatMap(g=>g.words).filter(w=>!w.punctuation).map(w=>w.text), ['which','was','released','last','week'], 'relative clause underline must cover its whole phrase')
  const repairQ = coachingQuestions.find(q=>q.id==='coach-p5-12')
  const missed = recordAttempt(emptyState(),repairQ,'C',30_000)
  const transferQ = {...repairQ,id:'new-transfer'}
  const unrelatedQ = {...repairQ,id:'other-rule',ruleId:'other.rule'}
  assert.ok(repairNeeds(missed)[repairQ.ruleId]>=24)
  assert.ok(questionWeight(missed,transferQ)>questionWeight(missed,unrelatedQ), 'new questions on the missed pattern get priority')
  let repaired=missed
  for (let i=0;i<3;i++) repaired=recordAttempt(repaired,{...repairQ,id:`transfer-${i}`},repairQ.answer,20_000)
  assert.equal(repairNeeds(repaired)[repairQ.ruleId],0,'three secure answers retire the targeted repair')
  let memorized=missed
  for (let i=0;i<3;i++) memorized=recordAttempt(memorized,repairQ,repairQ.answer,20_000)
  assert.ok(repairNeeds(memorized)[repairQ.ruleId]>=24,'repeating the same question does not prove transfer')
  const uncertainRepair=addFeedbackToLatest(repaired,undefined,1)
  assert.ok(repairNeeds(uncertainRepair)[repairQ.ruleId]>0,'a guess must reopen repair')
  try {
    Math.random=()=>0
    assert.equal(pickAdaptiveQuestion(missed,[unrelatedQ,transferQ],repairQ.id).id,transferQ.id,'repair branch picks the unresolved pattern')
    const readingMiss=recordAttempt(emptyState(),{...repairQ,part:7,ruleId:'p7.multi-text',skills:['multi-text'],difficulty:2},'C',70_000)
    const easyReading={...repairQ,id:'easy-reading',part:7,ruleId:'p7.multi-text',skills:['multi-text'],difficulty:2}
    const advancedReading={...easyReading,id:'v7-p7-hard',ruleId:'p7.other',difficulty:5}
    assert.equal(firstQuestionOfPickedPassage(readingMiss,[easyReading,advancedReading],{}).id,'easy-reading','reading repair must not be forced into advanced sets')
  } finally { Math.random=originalRandom }
  const blankCss = await readFile('src/App.css','utf8')
  assert.ok(!blankCss.includes('border-bottom:2px solid #49677d'), 'exam blank must not have a second underline')
  const poster=Object.values(passageById).find(p=>p.visual==='poster')
  const posterQ=allQuestions.find(q=>q.id===poster.questions[0])
  const posterHtml=renderToStaticMarkup(createElement(PassageDocument,{passage:poster,part:7,question:posterQ,selected:'',checked:false}))
  assert.ok(posterHtml.includes('conference-banner.png') && posterHtml.includes('Sky Lounge'),'photo banner preserves the answer-bearing schedule')
  assert.ok(passageById['v8-p7-04'].body.includes('8:26 — Lena: I am on the hotel shuttle'), 'shuttle chat must occur after the 8:15 departure')
  const snapshotPath=path.resolve('.project/local/firebase-current.json')
  const snapshot=await readFile(snapshotPath,'utf8').then(JSON.parse).catch(()=>null)
  if (snapshot) {
    const current={...emptyState(),...snapshot}
    const needs=repairNeeds(current)
    assert.ok(needs['gerund.after-preposition']>=24,'current learner needs repair on gerunds after prepositions')
    assert.ok(needs['part-of-speech']>=24,'current learner needs word-form repair')
    console.log(`Firebase snapshot: ${current.totalAnswered} answers; active repairs: ${Object.entries(needs).filter(([,pressure])=>pressure>=24).map(([rule])=>rule).join(', ')}`)
  }
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
      assert.ok(html.includes('answer-summary') && !html.includes('popover='), 'explanation is inline without a step popup')
      assert.ok(html.includes(q.coaching.memory))
    }
    const before = renderToStaticMarkup(createElement(QuestionCard, { question: q, selected: '', checked: false, onSelect: () => {} }))
    assert.ok(!before.includes('popover="auto"') && !before.includes('sentence-word answer'), 'no answer leak before submission')
    assert.ok(before.includes('sentence-exam') && before.includes('_____'), 'practice starts as a normal exam-style sentence')
    assert.ok(!before.includes('word-pos') && !before.includes('word-function') && !before.includes('sentence-tools') && !before.includes('clause-outline') && !before.includes('grammar-estimate'), 'grammar/POS/function hints stay hidden until submission')
    const overview = renderToStaticMarkup(createElement(QuestionCard, { question:q, selected:q.answer, checked:true, onSelect:()=>{} }))
    assert.ok(overview.includes('เหตุผลที่ถูก') && !overview.includes('/4'), 'short explanation is visible immediately')
  }
  assert.match(blankRequirement(coachingQuestions.find(q => q.id === 'coach-p5-11')).labelEn, /gerund/)
  assert.ok(practicePool(part5, true).every(q => q.difficulty >= 3))
  const freshTestPool = practicePool(part5,true).slice(0,24)
  let freshState = emptyState()
  const chosen = []
  for (let i=0;i<freshTestPool.length;i++) {
    const nextQ = pickAdaptiveQuestion(freshState, freshTestPool)
    chosen.push(nextQ.id)
    freshState=recordAttempt(freshState,nextQ,nextQ.answer,25_000)
  }
  assert.equal(new Set(chosen).size,freshTestPool.length,'adaptive must exhaust fresh items before repeating')
  assert.equal(new Set(practicePool(part5,false).map(questionFingerprint)).size, practicePool(part5,false).length, 'canonical Part 5 duplicates must be removed')

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
  const p6Explanation = renderToStaticMarkup(createElement(PassageDocument, { passage:passageById[coachingPart6[0].passageId], part:6, question:coachingPart6[0], selected:coachingPart6[0].answer, checked:true, activeStep:3, onStep:()=>{} }))
  assert.equal((p6Explanation.match(/class="answer-summary"/g) ?? []).length, 1, 'Part 6 has one inline explanation for the active blank')
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
  assert.ok(readingOverview.includes('passage-evidence-hit'), 'reading evidence appears as soon as the answer is checked')
  const nav = renderToStaticMarkup(createElement(BottomNav, { view: 'part5', navigate: () => {} }))
  assert.match(nav, /nav-button active[^>]*>.*?ฝึก/)
  console.log(`PASS: ${Object.keys(reviewedGrammar).length} reviewed sentences, ${coachingQuestions.length + coachingPart6.length + coachingPart7.length + Object.keys(foundationCoaching).length} authored explanations, ${courseCards.length} recall cards / ${courseSources.length} PDFs, 40 V9 reading questions, exam-style pools, vocab repair loop, speed diagnosis, calibration, confidence, hydration, inline explanation, clause underlines, targeted repair, exact blank position, answer visibility, complete reading sets, inline Part 6, navigation`)
} finally {
  await rm(dir, { recursive: true, force: true })
}
