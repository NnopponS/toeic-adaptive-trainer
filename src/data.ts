import type { Passage, Question, SkillId } from './types'
import { completeRationales } from './rationaleCompletion'
import { examPart5 } from './bankExamP5'
import { advancedPart5 } from './bankExamV2P5'
import { advancedPart6, advancedPart6Passages } from './bankExamV2P6'
import { rationaleFixes } from './bankRationaleFixes'
import { coachingQuestions, coachingPart6, coachingPart7, coachingPassages, foundationCoaching } from './bankCoaching'
import { extraPart5, extraPart6, extraPart7, extraPassages } from './bankV2'
import { extraPart5V3, extraPart6V3, extraPassagesV3 } from './bankV3'
import { extraPart5V4 } from './bankV4P5'
import { extraPart6V4, extraPart7V4, extraPassagesV4 } from './bankV4Reading'
import { extraPart7V5, extraPassagesV5 } from './bankV5Reading'
import { extraPart7V7, extraPassagesV7 } from './bankV7Reading'
import { extraPart7V8, extraPassagesV8 } from './bankV8Reading'
import { extraReadingV9, extraPassagesV9 } from './bankV9Reading'
import { vocabRepairQuestions } from './bankVocabRepair'
import { extraPart6V6, extraPassagesV6 } from './bankV6Reading'

export const skillLabels: Record<SkillId, string> = {
  'part-of-speech': 'Part of Speech',
  'verb-tense': 'Verb Tense',
  'subject-verb': 'Subject–Verb Agreement',
  passive: 'Passive Voice',
  preposition: 'Prepositions',
  conjunction: 'Conjunctions',
  'relative-clause': 'Relative Clauses',
  pronoun: 'Pronouns',
  comparison: 'Comparisons',
  vocabulary: 'Vocabulary',
  collocation: 'Collocations',
  context: 'Context',
  'sentence-placement': 'Sentence Placement',
  'main-idea': 'Main Idea',
  detail: 'Detail',
  inference: 'Inference',
  purpose: 'Purpose',
  paraphrase: 'Paraphrase',
  'multi-text': 'Multi-text Linking',
}

const c = (a: string, b: string, c: string, d: string) => [
  { id: 'A', text: a }, { id: 'B', text: b }, { id: 'C', text: c }, { id: 'D', text: d },
]

const basePart5: Question[] = [
  { id:'p5-01', part:5, stem:'The marketing team responded _____ to the sudden change in customer demand.', choices:c('quick','quickly','quicken','quickness'), answer:'B', skills:['part-of-speech'], difficulty:1, explanation:'The blank modifies the verb “responded,” so an adverb is required. “Quickly” is the adverb form.', whyOthers:{A:'“Quick” is an adjective.',C:'“Quicken” is a verb.',D:'“Quickness” is a noun.'}},
  { id:'p5-02', part:5, stem:'All expense reports must be submitted _____ Friday afternoon.', choices:c('by','among','during','beside'), answer:'A', skills:['preposition'], difficulty:1, explanation:'“By Friday afternoon” means no later than that deadline. TOEIC often tests deadline prepositions such as by, before, and until.', whyOthers:{B:'“Among” is used within a group.',C:'“During” requires a period/event rather than a deadline point.',D:'“Beside” means next to.'}},
  { id:'p5-03', part:5, stem:'Neither the regional manager nor the assistants _____ authorized to approve the purchase.', choices:c('is','are','has','be'), answer:'B', skills:['subject-verb'], difficulty:2, explanation:'With “neither A nor B,” the verb usually agrees with the nearer subject. “Assistants” is plural, so “are” is correct.', whyOthers:{A:'Singular verb does not agree with “assistants.”',C:'Needs a complement verb “authorized,” not “has authorized.”',D:'Bare infinitive cannot serve as the finite verb here.'}},
  { id:'p5-04', part:5, stem:'The conference room _____ before the overseas delegation arrived.', choices:c('cleaned','had cleaned','had been cleaned','has cleaning'), answer:'C', skills:['verb-tense','passive'], difficulty:3, explanation:'The room receives the action, so passive voice is required. The cleaning happened before another past event (“arrived”), so past perfect passive “had been cleaned” is best.', whyOthers:{A:'Active/simple past does not fit the passive meaning.',B:'Active voice implies the room cleaned something.',D:'Incorrect verb form.'}},
  { id:'p5-05', part:5, stem:'Ms. Patel will lead the workshop, _____ she has extensive experience in staff training.', choices:c('because','unless','despite','whereas'), answer:'A', skills:['conjunction'], difficulty:2, explanation:'The second clause gives the reason she will lead the workshop, so the causal conjunction “because” fits.', whyOthers:{B:'“Unless” expresses a condition.',C:'“Despite” is a preposition and cannot directly join two full clauses.',D:'“Whereas” contrasts two ideas.'}},
  { id:'p5-06', part:5, stem:'The software update, _____ was released last week, includes several security improvements.', choices:c('who','which','where','what'), answer:'B', skills:['relative-clause'], difficulty:2, explanation:'The antecedent is a thing (“software update”), and the clause is nonrestrictive, so “which” is correct.', whyOthers:{A:'“Who” refers to people.',C:'“Where” refers to a place.',D:'“What” does not follow an expressed antecedent.'}},
  { id:'p5-07', part:5, stem:'Employees are encouraged to familiarize _____ with the new emergency procedures.', choices:c('them','their','themselves','theirs'), answer:'C', skills:['pronoun'], difficulty:2, explanation:'The subject and object refer to the same people, so the reflexive pronoun “themselves” is required.', whyOthers:{A:'Object pronoun, not reflexive.',B:'Possessive adjective requires a noun.',D:'Possessive pronoun does not fit after “familiarize.”'}},
  { id:'p5-08', part:5, stem:'This quarter’s operating costs were significantly _____ than analysts had predicted.', choices:c('low','lower','lowest','more low'), answer:'B', skills:['comparison'], difficulty:1, explanation:'The word “than” signals a comparative form. The comparative of “low” is “lower.”', whyOthers:{A:'Base form cannot pair with “than” here.',C:'Superlative needs a group comparison.',D:'Incorrect comparative formation.'}},
  { id:'p5-09', part:5, stem:'The hotel offers complimentary airport _____ for guests staying three nights or longer.', choices:c('transportation','transporting','transported','transports'), answer:'A', skills:['vocabulary','collocation'], difficulty:2, explanation:'“Airport transportation” is a common noun collocation meaning transport service to or from an airport.', whyOthers:{B:'Gerund form is not natural in this noun phrase.',C:'Past participle does not fit.',D:'Plural verb/noun is not the standard collocation here.'}},
  { id:'p5-10', part:5, stem:'Please _____ the attached document carefully before signing the agreement.', choices:c('review','reviews','reviewed','reviewing'), answer:'A', skills:['verb-tense'], difficulty:1, explanation:'After “Please,” use the base form of the verb in an imperative: “Please review …”', whyOthers:{B:'Third-person singular form.',C:'Past tense.',D:'Gerund/present participle.'}},
  { id:'p5-11', part:5, stem:'The board postponed its decision _____ additional financial data could be reviewed.', choices:c('so that','in spite of','due to','even'), answer:'A', skills:['conjunction'], difficulty:3, explanation:'“So that” introduces a purpose/result clause and can be followed by a full clause: “additional financial data could be reviewed.”', whyOthers:{B:'Prepositional phrase; cannot directly introduce this clause.',C:'“Due to” must be followed by a noun phrase.',D:'“Even” alone is not a conjunction here.'}},
  { id:'p5-12', part:5, stem:'Applicants should have at least three years of _____ experience in project management.', choices:c('relevance','relevant','relevantly','relate'), answer:'B', skills:['part-of-speech'], difficulty:1, explanation:'The blank modifies the noun “experience,” so an adjective is required. “Relevant” is the adjective.', whyOthers:{A:'Noun.',C:'Adverb.',D:'Verb.'}},
  { id:'p5-13', part:5, stem:'The factory will remain closed _____ routine maintenance is completed.', choices:c('until','between','despite','throughout'), answer:'A', skills:['conjunction','preposition'], difficulty:2, explanation:'“Until” introduces the ending condition for the closure: it remains closed up to the time maintenance is completed.', whyOthers:{B:'“Between” needs two endpoints.',C:'“Despite” takes a noun phrase, not this clause.',D:'“Throughout” takes a noun phrase describing a period.'}},
  { id:'p5-14', part:5, stem:'Customer complaints have decreased _____ since the company introduced its new support system.', choices:c('notice','noticeable','noticeably','noticed'), answer:'C', skills:['part-of-speech'], difficulty:2, explanation:'The blank modifies the verb phrase “have decreased,” so an adverb is needed. “Noticeably” is correct.', whyOthers:{A:'Noun/verb.',B:'Adjective.',D:'Past participle.'}},
  { id:'p5-15', part:5, stem:'The supplier agreed to _____ the damaged units at no additional cost.', choices:c('replace','replacement','replaced','replacing'), answer:'A', skills:['verb-tense','collocation'], difficulty:1, explanation:'The pattern is “agree to + base verb,” so “replace” is required.', whyOthers:{B:'Noun.',C:'Past form.',D:'Gerund; “agree to replacing” is not the intended pattern here.'}},
  { id:'p5-16', part:5, stem:'Because the auditorium has limited seating, early registration is highly _____.', choices:c('recommend','recommended','recommending','recommendation'), answer:'B', skills:['passive','part-of-speech'], difficulty:2, explanation:'The phrase “is highly recommended” is a common passive collocation. A past participle is needed after “is.”', whyOthers:{A:'Base verb cannot follow “is” this way.',C:'Would imply the registration is doing the recommending.',D:'Noun does not fit after “is highly.”'}},
  { id:'p5-17', part:5, stem:'The accounting department will issue refunds _____ five business days of receiving a valid request.', choices:c('within','across','among','beside'), answer:'A', skills:['preposition','vocabulary'], difficulty:2, explanation:'“Within five business days” means before the end of that period and is a common business-time expression.', whyOthers:{B:'“Across” indicates movement or distribution over an area.',C:'“Among” refers to members of a group.',D:'“Beside” means next to.'}},
  { id:'p5-18', part:5, stem:'Mr. Han was asked to prepare a _____ summary of the survey findings.', choices:c('concise','concisely','conciseness','concising'), answer:'A', skills:['part-of-speech','vocabulary'], difficulty:2, explanation:'The blank modifies the noun “summary,” so the adjective “concise” is required.', whyOthers:{B:'Adverb.',C:'Noun.',D:'Not a standard form.'}},
  { id:'p5-19', part:5, stem:'Sales have increased steadily _____ the new branch opened in March.', choices:c('since','unless','whereas','despite'), answer:'A', skills:['conjunction','verb-tense'], difficulty:2, explanation:'Present perfect “have increased” commonly pairs with “since” to mark the starting point of an action continuing to the present.', whyOthers:{B:'Conditional meaning does not fit.',C:'Introduces contrast.',D:'Preposition and cannot introduce this full clause.'}},
  { id:'p5-20', part:5, stem:'The director requested that every department _____ its annual budget proposal by May 1.', choices:c('submit','submits','submitted','submitting'), answer:'A', skills:['verb-tense'], difficulty:3, explanation:'After verbs such as “request that,” formal business English often uses the subjunctive base form: “that every department submit.”', whyOthers:{B:'Indicative third-person form is not used in this subjunctive pattern.',C:'Past tense is not required.',D:'Gerund cannot serve as the clause verb.'}},
  { id:'p5-21', part:5, stem:'The new warehouse is nearly twice as large _____ the company’s previous facility.', choices:c('than','as','like','from'), answer:'B', skills:['comparison'], difficulty:2, explanation:'The equality/comparison pattern is “as + adjective + as,” including “twice as large as.”', whyOthers:{A:'“Than” follows comparative forms such as “larger than.”',C:'Does not complete the standard comparison pattern.',D:'Used with “different from,” not this structure.'}},
  { id:'p5-22', part:5, stem:'The contract will automatically renew _____ either party gives written notice of cancellation.', choices:c('unless','because','therefore','during'), answer:'A', skills:['conjunction'], difficulty:3, explanation:'“Unless” means “if not”: renewal happens if neither party gives notice.', whyOthers:{B:'Gives a reason rather than an exception condition.',C:'Conjunctive adverb; cannot directly connect the clause this way.',D:'Preposition, not a clause conjunction here.'}},
  { id:'p5-23', part:5, stem:'Visitors must wear the identification badge _____ to them at reception.', choices:c('issue','issued','issuing','issues'), answer:'B', skills:['passive','relative-clause'], difficulty:3, explanation:'“Issued to them at reception” is a reduced passive relative clause meaning “that was issued to them.”', whyOthers:{A:'Base verb cannot modify “badge” this way.',C:'Would suggest the badge issues something.',D:'Finite verb does not fit the reduced clause.'}},
  { id:'p5-24', part:5, stem:'The committee reached a decision only after _____ all three proposals carefully.', choices:c('review','reviewed','reviewing','reviews'), answer:'C', skills:['preposition','verb-tense'], difficulty:2, explanation:'Here “after” functions as a preposition, so it is followed by a gerund: “after reviewing.”', whyOthers:{A:'Base verb cannot follow prepositional “after.”',B:'Past form does not fit.',D:'Finite verb form does not fit.'}},
  { id:'p5-25', part:5, stem:'Due to unexpectedly high demand, some models are currently _____.', choices:c('unavailable','unavailability','unavailably','unavail'), answer:'A', skills:['part-of-speech','vocabulary'], difficulty:1, explanation:'After the linking verb “are,” an adjective describing the models is required: “unavailable.”', whyOthers:{B:'Noun.',C:'Adverb.',D:'Not a standard word.'}},
  { id:'p5-26', part:5, stem:'Customers who register online will receive a confirmation e-mail _____ after completing the form.', choices:c('prompt','promptly','promptness','prompted'), answer:'B', skills:['part-of-speech'], difficulty:1, explanation:'The blank modifies the verb “receive,” so the adverb “promptly” is required.', whyOthers:{A:'Adjective/noun.',C:'Noun.',D:'Past participle.'}},
  { id:'p5-27', part:5, stem:'The museum’s new exhibit has attracted _____ more visitors than expected.', choices:c('consider','considerable','considerably','consideration'), answer:'C', skills:['part-of-speech','comparison'], difficulty:3, explanation:'An adverb is needed to modify the comparative phrase “more visitors.” “Considerably more” is a common TOEIC-style construction.', whyOthers:{A:'Verb.',B:'Adjective.',D:'Noun.'}},
  { id:'p5-28', part:5, stem:'Ms. Rivera is responsible _____ coordinating travel arrangements for visiting executives.', choices:c('for','to','with','at'), answer:'A', skills:['preposition','collocation'], difficulty:1, explanation:'The fixed collocation is “be responsible for + noun/gerund.”', whyOthers:{B:'“Responsible to” usually identifies the person one reports to.',C:'Not the standard collocation.',D:'Not the standard collocation.'}},
  { id:'p5-29', part:5, stem:'Any employee _____ wishes to attend the seminar should notify a supervisor by Wednesday.', choices:c('who','which','whose','where'), answer:'A', skills:['relative-clause'], difficulty:1, explanation:'The antecedent is a person (“employee”) serving as the subject of the relative clause, so “who” is correct.', whyOthers:{B:'Normally refers to things.',C:'Possessive relative pronoun and would need a following noun.',D:'Refers to places.'}},
  { id:'p5-30', part:5, stem:'Production cannot resume until the damaged equipment has been fully _____.', choices:c('repair','repairs','repaired','repairing'), answer:'C', skills:['passive','verb-tense'], difficulty:2, explanation:'The present perfect passive pattern is “has been + past participle,” so “repaired” is required.', whyOthers:{A:'Base verb.',B:'Present-tense verb/plural noun.',D:'Present participle does not form the passive here.'}},
]

const basePassages: Passage[] = [
  { id:'p7-01', part:7, kind:'email', title:'Email: Delivery Delay', body:`From: lena.cho@brightline.example
To: marco.rossi@northbay.example
Subject: Order NB-1842

Dear Mr. Rossi,

I am writing to let you know that shipment NB-1842 will leave our warehouse one day later than originally scheduled. A replacement part for one of the items arrived this morning, and our quality team needs additional time to inspect it before the order can be packed.

We now expect the shipment to depart on Thursday and reach your office by Monday afternoon. I have upgraded the delivery service at no extra charge. The tracking number will be sent automatically once the carrier collects the package.

I apologize for the inconvenience and appreciate your patience.

Best,
Lena Cho
Brightline Components`, questions:['p7-01-q1','p7-01-q2','p7-01-q3','p7-01-q4']},
  { id:'p7-02', part:7, kind:'advertisement', title:'Weekend Business Writing Workshop', body:`ClearWrite Institute

BUSINESS WRITING FOR BUSY PROFESSIONALS
Saturday, October 24 | 9:00 A.M.–3:30 P.M.

Improve the clarity and tone of your e-mails, reports, and proposals in this practical one-day workshop. Participants will revise sample business documents, receive instructor feedback, and leave with a reusable editing checklist.

Fee: 2,400 THB
Early registration: 1,900 THB through October 10
Fee includes lunch and digital course materials.

Location: Riverfront Learning Center, Room 405

Seats are limited to 24 participants. Register online and bring a laptop or tablet for the editing activities.`, questions:['p7-02-q1','p7-02-q2','p7-02-q3','p7-02-q4']},
  { id:'p7-03', part:7, kind:'multi', title:'Message + Schedule', body:`MESSAGE
To: Priya
From: Daniel
I finished the first draft of the product brochure. Could you review the pricing table before our client call? I may not be able to join the 10:00 design check-in because the supplier meeting was moved to that time. If you see anything urgent, send me a message before 11:30.

TODAY'S SCHEDULE
9:00–9:30  Sales briefing
10:00–10:30 Design check-in
10:00–11:00 Supplier meeting
11:30–12:00 Client call
2:00–3:00   Website review`, questions:['p7-03-q1','p7-03-q2','p7-03-q3','p7-03-q4']},
]

const basePart7: Question[] = [
  { id:'p7-01-q1', part:7, passageId:'p7-01', stem:'Why is the shipment leaving later than planned?', choices:c('The carrier changed its route.','A part requires inspection.','The customer changed the order.','The warehouse is closed.'), answer:'B', skills:['detail','paraphrase'], difficulty:2, explanation:'A replacement part arrived and the quality team needs time to inspect it before packing.' },
  { id:'p7-01-q2', part:7, passageId:'p7-01', stem:'When is the order expected to arrive?', choices:c('Thursday morning','Friday afternoon','Monday afternoon','Tuesday morning'), answer:'C', skills:['detail'], difficulty:1, explanation:'The email says the shipment should reach the office by Monday afternoon.' },
  { id:'p7-01-q3', part:7, passageId:'p7-01', stem:'What did Ms. Cho do to compensate for the delay?', choices:c('Reduced the order price','Added another item','Upgraded the delivery service','Extended the warranty'), answer:'C', skills:['detail','paraphrase'], difficulty:2, explanation:'She says she upgraded the delivery service at no extra charge.' },
  { id:'p7-01-q4', part:7, passageId:'p7-01', stem:'What will most likely happen after the carrier collects the package?', choices:c('A tracking number will be sent.','The order will be inspected again.','Mr. Rossi will receive a refund.','The warehouse will call the client.'), answer:'A', skills:['inference','detail'], difficulty:2, explanation:'The email states that the tracking number will be sent automatically once the carrier collects the package.' },
  { id:'p7-02-q1', part:7, passageId:'p7-02', stem:'What is the main purpose of the advertisement?', choices:c('To recruit writing instructors','To promote a professional workshop','To announce a new office location','To sell editing software'), answer:'B', skills:['purpose','main-idea'], difficulty:1, explanation:'The advertisement promotes a one-day business writing workshop for professionals.' },
  { id:'p7-02-q2', part:7, passageId:'p7-02', stem:'How can a participant pay less for the workshop?', choices:c('Bring a laptop','Register by October 10','Skip lunch','Attend with a colleague'), answer:'B', skills:['detail','paraphrase'], difficulty:1, explanation:'The early registration fee is lower and is available through October 10.' },
  { id:'p7-02-q3', part:7, passageId:'p7-02', stem:'What is included in the registration fee?', choices:c('Printed textbooks','Transportation','Lunch and digital materials','Private coaching'), answer:'C', skills:['detail'], difficulty:1, explanation:'The advertisement states that the fee includes lunch and digital course materials.' },
  { id:'p7-02-q4', part:7, passageId:'p7-02', stem:'What are participants asked to bring?', choices:c('A laptop or tablet','A printed proposal','A company ID card','A writing sample'), answer:'A', skills:['detail'], difficulty:1, explanation:'Participants are asked to bring a laptop or tablet for editing activities.' },
  { id:'p7-03-q1', part:7, passageId:'p7-03', stem:'What does Daniel ask Priya to review?', choices:c('A website design','A supplier contract','A pricing table','A sales report'), answer:'C', skills:['detail'], difficulty:1, explanation:'Daniel specifically asks Priya to review the pricing table in the brochure.' },
  { id:'p7-03-q2', part:7, passageId:'p7-03', stem:'Why might Daniel miss the design check-in?', choices:c('He has a client call.','He will attend a supplier meeting.','He is revising the brochure.','He has a sales briefing.'), answer:'B', skills:['multi-text','inference'], difficulty:2, explanation:'The message says the supplier meeting was moved to 10:00, which overlaps the 10:00 design check-in.' },
  { id:'p7-03-q3', part:7, passageId:'p7-03', stem:'At what time is Daniel’s client call?', choices:c('9:00','10:00','11:30','2:00'), answer:'C', skills:['multi-text','detail'], difficulty:1, explanation:'The schedule lists the client call from 11:30 to 12:00.' },
  { id:'p7-03-q4', part:7, passageId:'p7-03', stem:'What can be inferred about the 10:00 time slot?', choices:c('Daniel has two conflicting commitments.','Priya is unavailable all morning.','The client call was postponed.','The website review was cancelled.'), answer:'A', skills:['multi-text','inference'], difficulty:2, explanation:'Both the design check-in and supplier meeting are scheduled at 10:00, creating a conflict for Daniel.' },
]

export const passages = [...basePassages, ...extraPassages, ...extraPassagesV3, ...extraPassagesV4, ...extraPassagesV5, ...extraPassagesV6, ...extraPassagesV7, ...extraPassagesV8, ...coachingPassages, ...extraPassagesV9, ...advancedPart6Passages]
export const passageById: Record<string, Passage> = Object.fromEntries(passages.map(p => [p.id, p]))
export const part5 = [...basePart5, ...extraPart5, ...extraPart5V3, ...extraPart5V4, ...vocabRepairQuestions, ...coachingQuestions, ...examPart5, ...advancedPart5]
  .map(q => completeRationales({...q,...foundationCoaching[q.id],...rationaleFixes[q.id]},passageById))
export const part6 = [...extraPart6, ...extraPart6V3, ...extraPart6V4, ...extraPart6V6, ...coachingPart6, ...extraReadingV9.filter(q => q.part === 6), ...advancedPart6]
  .map(q => completeRationales(q,passageById))
export const part7 = [...basePart7, ...extraPart7, ...extraPart7V4, ...extraPart7V5, ...extraPart7V7, ...extraPart7V8, ...coachingPart7, ...extraReadingV9.filter(q => q.part === 7)]
  .map(q => completeRationales(q,passageById))
export const allQuestions = [...part5, ...part6, ...part7]
export const questionById = Object.fromEntries(allQuestions.map(q => [q.id, q]))
