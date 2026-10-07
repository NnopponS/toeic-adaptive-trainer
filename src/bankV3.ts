import type { Passage, Question, SkillId } from './types'

const c = (a: string, b: string, c: string, d: string) => [
  { id: 'A', text: a }, { id: 'B', text: b }, { id: 'C', text: c }, { id: 'D', text: d },
]

type Seed = [
  string,
  [string, string, string, string],
  string,
  SkillId[],
  1 | 2 | 3 | 4 | 5,
  string,
]

const seeds: Seed[] = [
  // Tense / verb form
  ['Since joining the company, Ms. Ortega _____ three major software migrations.', ['oversees','oversaw','has overseen','is overseeing'], 'C', ['verb-tense'], 2, '“Since joining” links a past starting point to the present, so the present perfect “has overseen” is required.'],
  ['By the time the inspection team arrived, the technicians _____ the faulty valve.', ['replace','had replaced','have replaced','are replacing'], 'B', ['verb-tense'], 3, 'The replacement happened before another past event, so the past perfect “had replaced” is correct.'],
  ['The company _____ its revised travel policy at the staff meeting tomorrow.', ['announces','announced','will announce','has announced'], 'C', ['verb-tense'], 1, '“Tomorrow” places the announcement in the future, making “will announce” the best choice.'],
  ['While the accountant _____ the figures, she noticed an unusual charge.', ['checks','was checking','has checked','had checked'], 'B', ['verb-tense'], 3, 'The checking was in progress when another past action occurred, so past continuous is required.'],
  ['The replacement parts _____ yet, so the repair cannot begin.', ['did not arrive','have not arrived','are not arriving','had not arrive'], 'B', ['verb-tense'], 3, '“Yet” plus a present consequence calls for the present perfect: “have not arrived.”'],
  ['At this time next week, the audit team _____ the regional offices in Osaka.', ['visits','visited','will be visiting','has visited'], 'C', ['verb-tense'], 4, '“At this time next week” describes an action that will be in progress in the future, so future continuous fits.'],
  ['The warehouse staff _____ all outgoing orders before the system went offline.', ['processed','had processed','has processed','processes'], 'B', ['verb-tense'], 3, 'The processing was completed before a later past event, requiring past perfect.'],
  ['The marketing department _____ the survey results every quarter.', ['reviews','reviewed','is reviewing','has reviewed'], 'A', ['verb-tense'], 1, '“Every quarter” describes a repeated routine, so the simple present “reviews” is correct.'],
  ['This is the first time the company _____ a fully virtual trade show.', ['hosts','hosted','has hosted','had hosted'], 'C', ['verb-tense'], 4, '“This is the first time” commonly takes the present perfect to describe experience up to now.'],
  ['The construction crew _____ the lobby when guests began arriving.', ['renovates','was renovating','has renovated','had renovate'], 'B', ['verb-tense'], 3, 'The renovation was in progress when guests began arriving, so past continuous is correct.'],

  // Passive
  ['All expense claims must _____ by a department manager before payment.', ['approve','be approved','approved','be approving'], 'B', ['passive'], 2, 'The claims receive the approval; modal passive is “must be + past participle.”'],
  ['The final schedule _____ to all participants by e-mail yesterday.', ['sent','was sent','has sent','is sending'], 'B', ['passive','verb-tense'], 2, 'The schedule receives the action and “yesterday” calls for simple past passive: “was sent.”'],
  ['Several conference rooms _____ while the main hall is being renovated.', ['will use','will be used','have using','use'], 'B', ['passive','verb-tense'], 2, 'The rooms receive the action, so future passive “will be used” is correct.'],
  ['The equipment has _____ regularly since it was installed.', ['inspect','been inspected','inspecting','been inspect'], 'B', ['passive','verb-tense'], 3, 'Present perfect passive requires “has been + past participle.”'],
  ['Visitors are asked to wear badges that _____ at the reception desk.', ['issue','are issued','issued','are issuing'], 'B', ['passive','relative-clause'], 3, 'The badges receive the action, so the relative clause needs the passive “are issued.”'],
  ['The new branch is expected _____ by the end of March.', ['complete','to complete','to be completed','completing'], 'C', ['passive','verb-tense'], 3, 'The branch receives the completion action; after “is expected,” use “to be + past participle.”'],

  // Subject-verb agreement
  ['A list of approved suppliers _____ available on the company intranet.', ['are','is','have','be'], 'B', ['subject-verb'], 2, 'The head subject is singular “A list,” so “is” is required.'],
  ['Each of the new employees _____ a security card on the first day.', ['receive','receives','receiving','have received'], 'B', ['subject-verb'], 2, '“Each” is singular even though “employees” is plural, so use “receives.”'],
  ['Neither the director nor the assistants _____ available to answer questions this morning.', ['is','are','was','be'], 'B', ['subject-verb'], 3, 'With “neither…nor,” agreement follows the nearer subject; “assistants” is plural.'],
  ['The number of online reservations _____ sharply since the promotion began.', ['have increased','has increased','are increasing','increase'], 'B', ['subject-verb','verb-tense'], 4, 'The head subject “The number” is singular, and “since” supports the present perfect “has increased.”'],
  ['One of the conference speakers _____ written a book on supply-chain management.', ['have','has','are','were'], 'B', ['subject-verb'], 2, 'The head subject is “One,” so the singular auxiliary “has” is needed.'],
  ['The quality of the replacement parts _____ inspected before shipment.', ['are','is','have','were'], 'B', ['subject-verb','passive'], 3, 'The head subject is singular “quality,” so “is inspected” is correct.'],

  // Word form
  ['The consultant gave a highly _____ explanation of the proposed changes.', ['clarity','clear','clearly','clarify'], 'B', ['part-of-speech'], 2, 'The blank modifies the noun “explanation,” so the adjective “clear” is required.'],
  ['Employees responded _____ to the emergency drill.', ['calm','calmly','calmness','calming'], 'B', ['part-of-speech'], 1, 'The blank modifies the verb “responded,” so the adverb “calmly” is required.'],
  ['The company is seeking ways to improve operational _____.', ['efficient','efficiently','efficiency','efficienciesly'], 'C', ['part-of-speech','vocabulary'], 2, 'After “improve,” a noun naming what will improve is needed: “efficiency.”'],
  ['The revised brochure is more visually _____ than the previous version.', ['appeal','appealing','appealingly','appealed'], 'B', ['part-of-speech','comparison'], 3, 'After “more visually,” an adjective describing the brochure is needed: “appealing.”'],
  ['A _____ of the safety procedures will take place on Monday.', ['review','reviewer','reviewing','reviewed'], 'A', ['part-of-speech','vocabulary'], 2, 'The article “A” requires a noun; “review” is the correct noun in this context.'],
  ['The supplier apologized for the _____ delivery of the components.', ['delay','delayed','delaying','delayedly'], 'B', ['part-of-speech'], 2, 'An adjective is needed before the noun “delivery”; “delayed” is correct.'],
  ['The survey results were _____ positive despite the shorter response period.', ['surprise','surprised','surprising','surprisingly'], 'D', ['part-of-speech'], 3, 'The blank modifies the adjective “positive,” so the adverb “surprisingly” is required.'],
  ['The laboratory conducts _____ inspections of all testing equipment.', ['period','periodic','periodically','periodicity'], 'B', ['part-of-speech'], 2, 'The blank modifies the noun “inspections,” requiring the adjective “periodic.”'],

  // Prepositions / fixed phrases
  ['The training materials will be available online _____ Monday morning.', ['by','among','beside','through'], 'A', ['preposition'], 1, '“By Monday morning” expresses a deadline: no later than Monday morning.'],
  ['Please submit all reimbursement requests _____ the finance department.', ['to','at','of','upon'], 'A', ['preposition','collocation'], 1, '“Submit something to a department/person” is the standard pattern.'],
  ['The new warranty applies _____ purchases made after January 1.', ['for','to','with','by'], 'B', ['preposition','collocation'], 2, 'The fixed phrase is “apply to,” meaning affect or concern.'],
  ['The manager congratulated the sales team _____ exceeding its quarterly target.', ['on','for','at','with'], 'A', ['preposition','collocation'], 3, 'The fixed pattern is “congratulate someone on doing something.”'],
  ['The research team worked _____ several external consultants during the pilot project.', ['with','for','at','from'], 'A', ['preposition','collocation'], 1, '“Work with someone” is the natural collocation for collaboration.'],
  ['The company invested heavily _____ automated packaging equipment.', ['in','at','of','into to'], 'A', ['preposition','collocation'], 2, 'The standard phrase is “invest in” something.'],
  ['Ms. Ahmed will speak _____ behalf of the regional office.', ['on','in','at','for'], 'A', ['preposition','collocation'], 2, 'The fixed expression is “on behalf of.”'],
  ['The support team is available _____ customers from 8:00 A.M. to 8:00 P.M.', ['to','for','at','by'], 'A', ['preposition','collocation'], 2, 'The standard pattern is “available to someone” when stating who can access a service or person.'],

  // Conjunctions / connectors
  ['The seminar will be postponed _____ the speaker is unable to travel.', ['if','despite','whereas','so that'], 'A', ['conjunction'], 1, '“If” introduces the condition under which the seminar will be postponed.'],
  ['_____ demand increased unexpectedly, the factory added a second production shift.', ['Because','Unless','Although','Despite'], 'A', ['conjunction'], 2, 'The first clause gives the reason for adding a second shift, so “Because” is correct.'],
  ['The application was approved _____ one document had to be corrected first.', ['although','because','unless','so that'], 'A', ['conjunction'], 2, '“Although” expresses contrast between the correction issue and the final approval.'],
  ['Please save your work frequently _____ you do not lose any changes.', ['so that','whereas','despite','until'], 'A', ['conjunction'], 2, '“So that” introduces the purpose of saving frequently.'],
  ['The store will remain open _____ the renovation work becomes unsafe for customers.', ['unless','because','although','during'], 'A', ['conjunction'], 3, '“Unless” means the store stays open except if the work becomes unsafe.'],
  ['We will send the final itinerary _____ all hotel reservations have been confirmed.', ['once','despite','because of','whereas'], 'A', ['conjunction'], 2, '“Once” introduces the time/condition after which the itinerary will be sent.'],
  ['_____ the new system is more secure, some employees find it less convenient.', ['Although','Because','Unless','Therefore'], 'A', ['conjunction'], 2, 'The sentence contrasts improved security with reduced convenience, requiring “Although.”'],
  ['The company will expand the pilot program _____ the initial results remain positive.', ['as long as','despite','because of','whereas'], 'A', ['conjunction'], 3, '“As long as” introduces the condition that must continue to be true.'],

  // Relative clauses / pronouns
  ['The consultant _____ prepared the report will present the findings tomorrow.', ['which','who','whose','where'], 'B', ['relative-clause'], 1, 'The antecedent is a person and the blank is the subject of “prepared,” so “who” is correct.'],
  ['The factory, _____ opened in 2019, now employs more than 400 people.', ['who','which','where','whose'], 'B', ['relative-clause'], 2, 'A nonrestrictive clause referring to a thing uses “which.”'],
  ['The client _____ contract expires next month has requested a renewal proposal.', ['who','which','whose','where'], 'C', ['relative-clause'], 2, '“Whose” shows possession: the client’s contract.'],
  ['The conference center _____ the workshop will be held is near the station.', ['which','where','who','whose'], 'B', ['relative-clause'], 2, 'The conference center is the location of the workshop, so “where” is correct.'],
  ['Employees should bring _____ completed forms to the orientation session.', ['they','their','theirs','them'], 'B', ['pronoun'], 1, 'A possessive adjective is required before the noun “completed forms,” so “their” is correct.'],
  ['The two printers are similar, but _____ uses less energy.', ['one','ones','them','each other'], 'A', ['pronoun'], 2, '“One” substitutes for one singular printer from the pair.'],

  // Comparison
  ['The express service is considerably _____ than standard delivery.', ['fast','faster','fastest','fastly'], 'B', ['comparison'], 1, '“Than” signals the comparative form “faster.”'],
  ['This year’s exhibition space is nearly twice as large _____ last year’s.', ['than','as','like','from'], 'B', ['comparison'], 2, 'The multiplier pattern is “twice as + adjective + as.”'],
  ['Of all five proposals, this one is the _____ practical.', ['more','most','much','very'], 'B', ['comparison'], 1, 'Comparing one item with a group of five requires the superlative “most.”'],
  ['The revised process operates more _____ than the previous one.', ['efficient','efficiently','more efficient','efficiency'], 'B', ['comparison','part-of-speech'], 3, 'The verb “operates” needs an adverb; “more efficiently” is the comparative adverb structure.'],

  // Vocabulary / collocations
  ['The manufacturer issued a product _____ after discovering a safety defect.', ['recall','returning','retreat','receipt'], 'A', ['vocabulary','collocation'], 2, 'A “product recall” is the standard term for withdrawing a defective or unsafe product.'],
  ['The director asked each department to _____ its spending for the next quarter.', ['estimate','esteem','establishing','estate'], 'A', ['vocabulary','collocation'], 2, '“Estimate spending” means calculate an approximate future amount and is the natural business phrase.'],
  ['The company plans to _____ a new customer loyalty program in January.', ['launch','land','lend','leave'], 'A', ['vocabulary','collocation'], 1, 'Companies “launch” a program when they introduce it publicly.'],
  ['The updated procedure is intended to _____ the approval process.', ['streamline','stream','straight','strength'], 'A', ['vocabulary','collocation'], 3, '“Streamline a process” means make it simpler and more efficient.'],
  ['Please _____ any technical problems to the IT help desk immediately.', ['report','repeat','reply','return'], 'A', ['vocabulary','collocation'], 1, 'The natural collocation is “report a problem.”'],
  ['The supplier agreed to _____ the damaged items at no additional charge.', ['replace','reserve','repeat','recover'], 'A', ['vocabulary','collocation'], 1, '“Replace damaged items” is the appropriate business phrase.'],
  ['The agreement clearly _____ the responsibilities of both parties.', ['outlines','outcomes','outgrows','outweighs'], 'A', ['vocabulary','collocation'], 2, '“Outline responsibilities” means describe them clearly and concisely.'],
  ['The hotel offers a complimentary shuttle for the _____ of conference guests.', ['convenience','conviction','conversion','conversation'], 'A', ['vocabulary','collocation'], 2, 'The fixed phrase “for the convenience of” means to make something easier for someone.'],
]

export const extraPart5V3: Question[] = seeds.map((seed, index) => {
  const base: Question = {
    id: `v3-p5-${String(index + 1).padStart(3, '0')}`,
    part: 5,
    stem: seed[0],
    choices: c(...seed[1]),
    answer: seed[2],
    skills: seed[3],
    difficulty: seed[4],
    explanation: seed[5],
    source: 'core',
    ruleId: seed[3].includes('collocation') ? 'vocab.business-collocation'
      : seed[3].includes('part-of-speech') ? 'part-of-speech'
      : seed[3][0],
  }

  if (seed[0] === 'The director asked each department to _____ its spending for the next quarter.') {
    return {
      ...base,
      explanationTh:'หลัง “asked each department to” ต้องเป็น V1 และความหมายต้องเข้ากับ spending: estimate spending = ประมาณการค่าใช้จ่ายสำหรับไตรมาสหน้า',
      translationTh:'ผู้อำนวยการขอให้แต่ละแผนกประมาณการค่าใช้จ่ายของตนสำหรับไตรมาสหน้า',
      choiceTranslationsTh:{
        A:'estimate = ประมาณ/คาดคะเน',
        B:'esteem = ยกย่อง/เคารพ',
        C:'establishing = การกำลังก่อตั้ง/จัดตั้ง (V-ing)',
        D:'estate = ทรัพย์สิน/ที่ดิน/กองมรดก (N.)',
      },
      whyOthers:{
        B:'“Esteem” can be a verb, but it means respect or admire; you do not “esteem spending.”',
        C:'After infinitive “to,” use V1. “Establishing” is V-ing, and its meaning is also wrong here.',
        D:'“Estate” is a noun meaning property/land/assets. After infinitive “to,” the sentence needs a base verb.',
      },
    }
  }

  return base
})

export const extraPassagesV3: Passage[] = [
  {
    id: 'v3-p6-09',
    part: 6,
    kind: 'email',
    title: 'Customer Support Office Move',
    body: `To: Customer Support Staff
From: Operations
Subject: Fourth-floor relocation

The Customer Support Department will move to the fourth floor next month. The move is scheduled to [1] _____ on November 3.

To minimize disruption, employees should pack personal items before leaving on Friday. [2] _____, the IT team will transfer computers and telephone equipment over the weekend.

[3] _____

Normal customer-support operations will resume at 8:30 A.M. on Monday. Please contact Operations if you require special [4] _____ during the move.`,
    questions: ['v3-p6-09-q1','v3-p6-09-q2','v3-p6-09-q3','v3-p6-09-q4'],
  },
  {
    id: 'v3-p6-10',
    part: 6,
    kind: 'notice',
    title: 'Professional Development Seminar',
    body: `PROFESSIONAL DEVELOPMENT SEMINAR

Employees interested in attending the November leadership seminar should [1] _____ the online registration form by October 22.

The seminar will focus on delegation, meeting management, and giving constructive feedback. [2] _____, participants will complete two small-group exercises based on workplace scenarios.

[3] _____

Because space is limited, registrations will be accepted in the order they are received. A confirmation message will be sent once a place has been [4] _____.`,
    questions: ['v3-p6-10-q1','v3-p6-10-q2','v3-p6-10-q3','v3-p6-10-q4'],
  },
]

export const extraPart6V3: Question[] = [
  { id:'v3-p6-09-q1', part:6, passageId:'v3-p6-09', stem:'Blank [1]', choices:c('begin','began','beginning','begins'), answer:'A', skills:['verb-tense','context'], difficulty:2, explanation:'After “is scheduled to,” the base form of the verb is required: “to begin.”' },
  { id:'v3-p6-09-q2', part:6, passageId:'v3-p6-09', stem:'Blank [2]', choices:c('Meanwhile','However','Otherwise','For example'), answer:'A', skills:['context','conjunction'], difficulty:2, explanation:'“Meanwhile” correctly introduces another activity happening during the same relocation period.' },
  { id:'v3-p6-09-q3', part:6, passageId:'v3-p6-09', stem:'Blank [3]', choices:c('Employees should take their laptops home unless instructed otherwise.','The company cafeteria introduced a new breakfast menu.','Several customers requested printed catalogs last month.','The parking garage closes at midnight.'), answer:'A', skills:['sentence-placement','context'], difficulty:3, explanation:'The surrounding paragraph gives practical instructions for the office move, so the laptop instruction fits the topic and sequence.' },
  { id:'v3-p6-09-q4', part:6, passageId:'v3-p6-09', stem:'Blank [4]', choices:c('arrange','arranged','arrangements','arranging'), answer:'C', skills:['part-of-speech','collocation'], difficulty:2, explanation:'The fixed expression is “special arrangements,” so a plural noun is required.' },

  { id:'v3-p6-10-q1', part:6, passageId:'v3-p6-10', stem:'Blank [1]', choices:c('complete','completed','completion','completely'), answer:'A', skills:['verb-tense','part-of-speech'], difficulty:1, explanation:'After “should,” use the base verb “complete.”' },
  { id:'v3-p6-10-q2', part:6, passageId:'v3-p6-10', stem:'Blank [2]', choices:c('In addition','Instead','Nevertheless','As a result of'), answer:'A', skills:['context','conjunction'], difficulty:2, explanation:'The group exercises are an additional part of the seminar, so “In addition” fits.' },
  { id:'v3-p6-10-q3', part:6, passageId:'v3-p6-10', stem:'Blank [3]', choices:c('The program is designed for employees who currently supervise others or expect to do so soon.','The main office was renovated during the summer.','Parking permits are issued by the security department.','The cafeteria serves lunch until 2:00 P.M.'), answer:'A', skills:['sentence-placement','context'], difficulty:3, explanation:'The sentence describes the intended participants, which logically belongs with the seminar description and registration information.' },
  { id:'v3-p6-10-q4', part:6, passageId:'v3-p6-10', stem:'Blank [4]', choices:c('reserve','reserved','reservation','reserving'), answer:'B', skills:['passive','part-of-speech'], difficulty:2, explanation:'The present perfect passive structure is “has been reserved,” requiring the past participle “reserved.”' },
]
