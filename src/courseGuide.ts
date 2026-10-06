import type { Question, SkillId } from './types'

export interface CourseChapter {
  id: number
  title: string
  file: string
  sections: string[]
  memorize: string[]
  coachTip?: string
}

export const courseChapters: CourseChapter[] = [
  { id:1, title:'Nouns', file:'Chapter1-Nouns.pdf', sections:['1.1 Noun Suffixes','Noun positions'], memorize:[
    'Nouns can be the subject, the object, or follow a preposition.',
    'Common noun endings in this chapter include -tion, -ment, -ship, -dence, -sis, -ty, -ness, -age, and -hood.',
    'A singular countable person noun normally needs a determiner/article.',
  ]},
  { id:2, title:'Determiners', file:'Chapter2-Determiners.pdf', sections:['2.1 Determiners before singular/plural nouns'], memorize:[
    'a/an/one/every/each/another/this/that + singular countable noun.',
    'much/little/an amount of + uncountable noun.',
    'many/a number of/several/numerous/few/these/those/numbers + plural countable noun.',
    'Possessives, the, some, and any can introduce nouns; check the noun form after them.',
  ]},
  { id:3, title:'Adjectives', file:'Chapter3-Adjectives.pdf', sections:['3.1 Adjective Suffixes','Adjective positions'], memorize:[
    'Adjective positions: before a noun, after be, and after linking verbs.',
    'Linking verbs highlighted in the chapter include smell, taste, sound, look, feel, seem, remain, appear, and become.',
    'Common adjective endings include -al, -ble, -ous, -ful, -less, -ic, -ish, and -tive.',
  ]},
  { id:4, title:'Determiners + Nouns Test', file:'Chapter4- Det-N Test.pdf', sections:['4.1 Determiners + Nouns practice'], memorize:[
    'Before choosing by meaning, mark the structure around the blank: determiner + noun, adjective + noun, or preposition + noun.',
    'If the choices share one word family, decide the required part of speech first.',
  ]},
  { id:5, title:'Adverbs', file:'Chapter5-Adverbs.pdf', sections:['5.1 What adverbs modify','5.2 Adverb positions'], memorize:[
    'Adverbs modify verbs, adjectives, and other adverbs.',
    'Many adverbs end in -ly, but common adverbs such as very, quite, so, too, fast, forward, and backward do not.',
    'When an adverb modifies an adjective or another adverb, it normally comes before it.',
  ]},
  { id:6, title:'Nouns / Adjectives / Adverbs Summary', file:'Chapter6 (Nouns / Adjectives / Adverbs)', sections:['6.1 Summary'], memorize:[
    'Noun positions: subject, object, and after prepositions.',
    'Adjective positions: before nouns, after be, and after linking verbs.',
    'Use determiner number clues to decide singular, plural, or uncountable noun forms.',
  ]},
  { id:7, title:'Verbs', file:'Chapter7-verbs.pdf', sections:['7.1 Verb Suffixes'], memorize:[
    'Recognize common verb-form clues such as -ize, -en, and -ify.',
    'The chapter groups frequent verb families such as organize/realize, shorten/widen, identify/notify, approve/improve, and respect/expect.',
    'When choices are one word family, first decide whether the blank needs a finite verb, noun, adjective, or adverb.',
  ]},
  { id:8, title:'Pronouns', file:'Chapter8-Pronouns.pdf', sections:['8.1 Pronoun table'], memorize:[
    'Memorize the five columns: subject, object, possessive adjective + noun, possessive pronoun without a noun, reflexive.',
    'Before a noun: my/your/our/their/his/her/its.',
    'After a verb or preposition when an object is needed: me/you/us/them/him/her/it.',
    'Use a reflexive form when the subject and object are the same person/thing.',
  ]},
  { id:9, title:'Relative Pronouns', file:'Chapter9-Relative Pronouns.pdf', sections:['9.1 Wh-words / Relative Pronouns'], memorize:[
    'Relative clauses act like adjectives and describe a noun.',
    'Person: who/whom; possession: whose; thing: which/that; place: where; time: when.',
    'If a Wh-word follows a noun and links a describing clause, read it as a relative word rather than a direct question word.',
  ]},
  { id:10, title:'Subject + Verb Agreement', file:'Chapter10-S-V Agreement.pdf', sections:['10.1 Subject + Verb Agreement'], memorize:[
    'Find the real subject before choosing the verb.',
    'Ignore nouns inside prepositional phrases and relative clauses when identifying the head subject.',
    'In present simple, a singular third-person subject takes V-s; a plural subject takes the base form.',
  ]},
  { id:11, title:'Tense', file:'Chapter11-Tense.pdf', sections:['11.1 12 Tenses','Tense keywords'], memorize:[
    'Simple: past V2, present V1, future will + V1.',
    'Continuous: was/were + V-ing, am/is/are + V-ing, will be + V-ing.',
    'Perfect: had + V3, have/has + V3, will have + V3.',
    'Perfect continuous: had been / have-has been / will have been + V-ing.',
    'Exam order: identify the tense family quickly, then use time keywords and event sequence to choose the form.',
  ]},
  { id:12, title:'Prepositions', file:'Chapter12-Preposition.pdf', sections:['12.1 Frequent prepositions','12.4 TOEIC preposition patterns'], memorize:[
    'Time: during + period/event, by + deadline, within + length of time.',
    'Movement/position groups in the chapter include in/on/at/across, over/above/under/below/around/along, and through/throughout.',
    'between is normally for two; among is for a group.',
    'Memorize prepositions together with the words around them, not as isolated translations.',
  ]},
  { id:13, title:'Phrasal Verbs / Verb + Preposition', file:'Chapter13-Pharasal Verbs.pdf', sections:['13.1 Verb + in/on/at','13.2 Verb + to/with/about','13.3 Verb + for/of/from'], memorize:[
    'Treat verb + preposition as one chunk.',
    'The chapter groups common “in” phrases such as engaged in, involved in, interested in, believe in, participate in, result in, specialize in, and succeed in.',
    'A TOEIC-style example in the chapter tests rely on.',
    'When the verb is known, recall its partner preposition before translating the whole sentence.',
  ]},
  { id:14, title:'Active–Passive Voice', file:'Chapter14-ActivePassive.pdf', sections:['14.1 Active-Passive Voice','14.2 Structure'], memorize:[
    'Active: the subject performs the action.',
    'Passive: the subject receives the action.',
    'Core passive structure: BE + V3.',
    'After deciding active/passive, choose the tense of BE to match the time signal.',
  ]},
  { id:15, title:'Participles', file:'Chapter15-Participles.pdf', sections:['15.1 Participles (V-ing / V3)'], memorize:[
    'Participles function as adjectives and can appear before nouns, after be, and after linking verbs.',
    'A fast meaning check from the chapter: -ing = causing the feeling; -ed = feeling/affected.',
    'Remember pairs such as interesting/interested, exciting/excited, boring/bored, confusing/confused, tiring/tired, and surprising/surprised.',
  ]},
  { id:16, title:'If-Clause', file:'Chapter16-If-Clause.pdf', sections:['16.1 Three If-Clause patterns'], memorize:[
    'Type 1: If + V1, ... will + V1.',
    'Type 2: If + V2, ... would + V1.',
    'Type 3: If + had + V3, ... would have + V3.',
    'Decide whether the condition is real future, unreal present, or unreal past before choosing the form.',
  ]},
  { id:17, title:'Gerund–Infinitive', file:'Chapter17-GerundInf.pdf', sections:['17.1 Gerund functions','Gerund verb patterns'], memorize:[
    'Gerund (V-ing) functions like a noun: it can be a subject and can follow a preposition.',
    'After a preposition, use V-ing.',
    'The chapter groups verbs/phrases commonly followed by V-ing, including enjoy, mind, cannot stand, cannot help, keep, continue, and spend/waste time or money.',
    'Phrases ending in preposition to, such as look forward to and be used/accustomed to, take V-ing after that to.',
  ]},
  { id:18, title:'Comparisons', file:'Chapter18-Comparisions.pdf', sections:['18.1 Comparative/Superlative','18.2 Comparison keywords'], memorize:[
    'Comparative: -er or more; superlative: -est or most.',
    'Short adjectives commonly take -er/-est; longer adjectives commonly take more/most.',
    'Memorize irregulars: good-better-best, bad-worse-worst, much-more-most, little-less-least.',
    'Keyword patterns: than → comparative; as ... as → equality.',
  ]},
  { id:19, title:'Connectors', file:'Chapter19-Connectors.pdf', sections:['19.1 Four connector types','19.2 Conjunctions'], memorize:[
    'The chapter separates connectors into conjunctions, prepositions, adverbs, and FANBOYS.',
    'because + S + V, but because of + noun/noun phrase.',
    'FANBOYS: for, and, nor, but, or, yet, so.',
    'Choose the relationship first, then choose the connector form that matches the grammar after it.',
  ]},
  { id:20, title:'Question Tags', file:'Chapter20-QuestionTags.pdf', sections:['20.1 Question Tags','20.2 Building tags'], memorize:[
    'A positive statement normally takes a negative tag; a negative statement takes a positive tag.',
    'Reuse the sentence auxiliary and match the pronoun in the tag.',
    'This chapter is mainly useful for Listening Part 2, so it is not a priority in the current Reading-only plan.',
  ]},
  { id:21, title:'Vocabulary', file:'Chapter21-Vocabs.pdf', sections:['Vocabulary sets and usage'], memorize:[
    'Use this chapter as the main vocabulary review bank when a mistake is caused by word meaning.',
    'Study each item together with its part of speech and common business collocation rather than as an isolated translation.',
    'For Part 7, connect a word to likely paraphrases/synonyms because the question and passage often use different wording.',
  ], coachTip:'This chapter is extensive, so the app points you here after vocabulary/collocation mistakes instead of pretending one short rule covers the whole bank.' },
  { id:26, title:'Reading Part 5 — Incomplete Sentences', file:'Chapter26-Part5-Reading-Incom.pdf', sections:['26.1–26.3 Part 5 practice'], memorize:[
    'Use grammar structure first when the choices are forms of the same word.',
    'This chapter mixes word form, pronouns, prepositions, passive/tense, adverbs, vocabulary, and connectors in exam-style sentences.',
    'Correlative pairs appearing in the chapter include both ... and, either ... or, neither ... nor, and not only ... but also.',
  ]},
  { id:27, title:'Reading Part 6 — Text Completion', file:'Chapter27-Reading-TextCom.pdf', sections:['27.1 What Part 6 tests','27.2 Reading Part 6','Sentence insertion'], memorize:[
    'Part 6 in this course tests vocabulary, suffix/word form, verb/tense, connectors, and missing-sentence placement.',
    'For a grammar blank, solve the local sentence first; for context/connector/sentence insertion, read the surrounding sentences.',
    'For a missing sentence, check what idea must connect naturally before and after the blank.',
  ]},
  { id:28, title:'Reading Part 7 — Reading Comprehension', file:'Chapter28-Reading-Comprehension.pdf', sections:['28.1 Reading strategy','28.3 Keyword–choice matching'], memorize:[
    'Single passage: read the question quickly, identify what/when/where/why, find keywords or synonyms, skim to locate the evidence, then read that line carefully.',
    'Double/triple passages: skim all documents, identify how they relate, summarize each document, then answer the questions.',
    'Expect paraphrases: charge ↔ fee, reschedule ↔ postpone/put off, cancel ↔ call off, clients ↔ customers, dangerous ↔ unsafe.',
    'Do not search only for exact repeated words; search for equivalent meaning.',
  ]},
]

export const courseChapterById = Object.fromEntries(courseChapters.map(chapter => [chapter.id, chapter])) as Record<number, CourseChapter>

export const skillChapterIds: Record<SkillId, number[]> = {
  'part-of-speech': [6, 1, 3, 5, 7, 15],
  'verb-tense': [11, 7, 17],
  'subject-verb': [10],
  passive: [14],
  preposition: [12, 13],
  conjunction: [19, 16],
  'relative-clause': [9],
  pronoun: [8],
  comparison: [18],
  vocabulary: [21],
  collocation: [13, 21],
  context: [27],
  'sentence-placement': [27],
  'main-idea': [28],
  detail: [28],
  inference: [28],
  purpose: [28],
  paraphrase: [28, 21],
  'multi-text': [28],
}

export function chaptersForSkill(skill: SkillId) {
  return (skillChapterIds[skill] ?? []).map(id => courseChapterById[id]).filter(Boolean)
}

export function chaptersForQuestion(question: Question) {
  const ids: number[] = [...(question.chapterIds ?? [])]
  for (const skill of question.skills) {
    for (const id of skillChapterIds[skill] ?? []) {
      if (!ids.includes(id)) ids.push(id)
    }
  }
  const partChapter = question.part === 5 ? 26 : question.part === 6 ? 27 : 28
  if (!ids.includes(partChapter)) ids.push(partChapter)
  return ids.map(id => courseChapterById[id]).filter(Boolean)
}

export const readingCourseChapters = courseChapters.filter(chapter =>
  chapter.id <= 21 || chapter.id === 26 || chapter.id === 27 || chapter.id === 28,
)
