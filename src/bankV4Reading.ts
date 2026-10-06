import type { Passage, Question, SkillId } from './types'

const c = (a: string, b: string, c: string, d: string) => [
  { id: 'A', text: a }, { id: 'B', text: b }, { id: 'C', text: c }, { id: 'D', text: d },
]

type Q6 = {
  choices: [string, string, string, string]
  answer: string
  skills: SkillId[]
  difficulty: 1 | 2 | 3 | 4 | 5
  explanation: string
  ruleId: string
  chapterIds: number[]
}

type S6 = { kind: Passage['kind']; title: string; body: string; questions: Q6[] }

const p6Seeds: S6[] = [
  {
    kind:'notice',
    title:'Office Access During Renovation',
    body:"NOTICE TO ALL STAFF\n\nRenovation work on the third floor will begin next Monday. Employees who normally work in that area will be [1] _____ assigned to meeting rooms on the second floor.\n\nPlease remove all personal items from your desks by Friday afternoon. [2] _____, any items left behind may be moved by the facilities team.\n\nThe work is expected to last approximately two weeks. Access to the third floor will be restricted [3] _____ safety reasons.\n\n[4] _____\n\nThank you for your cooperation.",
    questions:[
      { choices:['temporary','temporarily','temporariness','temporize'], answer:'B', skills:['part-of-speech'], difficulty:2, explanation:'An adverb is needed to modify assigned, so temporarily is correct.', ruleId:'p6.word-form', chapterIds:[5,27] },
      { choices:['Therefore','Although','Unless','Meanwhile'], answer:'A', skills:['context','conjunction'], difficulty:2, explanation:'The second sentence gives a result of the removal request, so Therefore fits.', ruleId:'p6.connector-context', chapterIds:[19,27] },
      { choices:['for','with','at','to'], answer:'A', skills:['preposition','collocation'], difficulty:2, explanation:'For safety reasons is the natural fixed expression.', ruleId:'p6.fixed-phrase', chapterIds:[12,27] },
      { choices:['Updated floor maps will be posted near the elevators.','The cafeteria menu changes every Wednesday.','All employees must submit vacation requests online.','The company picnic was held last month.'], answer:'A', skills:['sentence-placement','context'], difficulty:3, explanation:'A sentence about floor maps logically supports staff navigating around the renovation area.', ruleId:'p6.sentence-placement', chapterIds:[27] },
    ],
  },
  {
    kind:'email',
    title:'Customer Service Training Reminder',
    body:"From: Training Team\nTo: Customer Support Staff\nSubject: Friday Workshop\n\nThis is a reminder that the customer service workshop will take place this Friday from 1:00 to 4:00 P.M. The session [1] _____ several techniques for handling difficult conversations.\n\nParticipants should bring a notebook and arrive ten minutes early. The training room is located [2] _____ the main cafeteria and Conference Room B.\n\nBecause attendance is required, anyone who cannot attend must notify a supervisor [3] _____ possible.\n\n[4] _____\n\nWe look forward to seeing you there.",
    questions:[
      { choices:['covers','covered','has covering','cover'], answer:'A', skills:['verb-tense','subject-verb'], difficulty:2, explanation:'The singular subject session takes the present simple verb covers.', ruleId:'p6.verb-form', chapterIds:[10,11,27] },
      { choices:['between','among','during','toward'], answer:'A', skills:['preposition'], difficulty:1, explanation:'Between is used because the room is between two specific places.', ruleId:'p6.preposition', chapterIds:[12,27] },
      { choices:['as soon as','despite','unless','whereas'], answer:'A', skills:['context','conjunction'], difficulty:2, explanation:'As soon as possible is the standard phrase.', ruleId:'p6.connector-context', chapterIds:[19,27] },
      { choices:['A short break will be provided halfway through the session.','The parking garage was built in 2018.','The finance team moved to another floor.','The company recently changed its logo.'], answer:'A', skills:['sentence-placement','context'], difficulty:3, explanation:'A sentence about the workshop schedule belongs naturally before the closing line.', ruleId:'p6.sentence-placement', chapterIds:[27] },
    ],
  },
  {
    kind:'email',
    title:'Shipment Schedule Update',
    body:"Dear Ms. Torres,\n\nWe are writing to update you on order LT-482. The shipment was originally scheduled to leave on Tuesday, but one component [1] _____ additional inspection.\n\nThe quality review has now been completed, and the order will leave our warehouse tomorrow. We have also upgraded the delivery service [2] _____ no additional charge.\n\nThe carrier will send a tracking number once the package [3] _____ collected.\n\n[4] _____\n\nWe apologize for the delay and appreciate your patience.",
    questions:[
      { choices:['required','requiring','require','has require'], answer:'A', skills:['verb-tense','vocabulary'], difficulty:2, explanation:'The completed past event requires the simple-past verb required.', ruleId:'p6.verb-form', chapterIds:[11,27] },
      { choices:['at','for','with','by'], answer:'A', skills:['preposition','collocation'], difficulty:2, explanation:'At no additional charge is the natural fixed phrase.', ruleId:'p6.fixed-phrase', chapterIds:[12,27] },
      { choices:['is','was','has','be'], answer:'A', skills:['passive','verb-tense'], difficulty:3, explanation:'After once in a future time clause, present simple passive is collected is correct.', ruleId:'p6.passive-tense', chapterIds:[11,14,27] },
      { choices:['Delivery is expected by Monday afternoon.','Our annual picnic will be held in June.','The accounting office is on the fourth floor.','Please remember to update your password.'], answer:'A', skills:['sentence-placement','detail'], difficulty:2, explanation:'The missing sentence should continue the shipment timeline.', ruleId:'p6.sentence-placement', chapterIds:[27] },
    ],
  },
  {
    kind:'notice',
    title:'New Expense Policy',
    body:"Beginning November 1, employees must submit travel expenses through the new online reimbursement portal.\n\nReceipts should be uploaded within five business days [1] _____ the trip ends. Claims without supporting documents may be delayed.\n\nManagers are responsible [2] _____ reviewing each request before it is forwarded to Finance.\n\nThe new system was introduced to process reimbursements more [3] _____ and reduce paperwork.\n\n[4] _____\n\nQuestions may be sent to Finance Support.",
    questions:[
      { choices:['after','among','beside','throughout'], answer:'A', skills:['preposition','context'], difficulty:2, explanation:'After correctly marks the time following the trip.', ruleId:'p6.preposition', chapterIds:[12,27] },
      { choices:['for','to','with','at'], answer:'A', skills:['preposition','collocation'], difficulty:1, explanation:'The fixed pattern is responsible for plus gerund.', ruleId:'p6.fixed-phrase', chapterIds:[13,17,27] },
      { choices:['efficient','efficiently','efficiency','efficiencies'], answer:'B', skills:['part-of-speech'], difficulty:2, explanation:'Efficiently is the adverb that modifies process.', ruleId:'p6.word-form', chapterIds:[5,27] },
      { choices:['A step-by-step guide is available on the employee intranet.','The sales conference attracted 300 visitors.','Employees receive free coffee on Fridays.','The warehouse closes at 6:00 P.M.'], answer:'A', skills:['sentence-placement','context'], difficulty:3, explanation:'A guide on the intranet supports employees using the new portal.', ruleId:'p6.sentence-placement', chapterIds:[27] },
    ],
  },
  {
    kind:'message',
    title:'Software Maintenance Message',
    body:"IT NOTICE\n\nThe customer database will be unavailable from 8:00 P.M. to 10:00 P.M. tonight while a security update is installed.\n\nEmployees should save their work and log out [1] _____ 7:55 P.M. Any unsaved changes may be lost when the maintenance begins.\n\nThe IT team [2] _____ the update in a test environment earlier this week and does not expect any major problems.\n\nIf the work finishes ahead of schedule, access [3] _____ restored before 10:00 P.M.\n\n[4] _____",
    questions:[
      { choices:['by','during','among','toward'], answer:'A', skills:['preposition'], difficulty:1, explanation:'By 7:55 P.M. marks the logout deadline.', ruleId:'p6.preposition', chapterIds:[12,27] },
      { choices:['tests','tested','has testing','is test'], answer:'B', skills:['verb-tense'], difficulty:2, explanation:'Earlier this week describes a completed past action here, so tested fits.', ruleId:'p6.verb-form', chapterIds:[11,27] },
      { choices:['will be','will','has','was'], answer:'A', skills:['passive','verb-tense'], difficulty:3, explanation:'Access receives the action, so future passive will be restored is required.', ruleId:'p6.passive-tense', chapterIds:[14,27] },
      { choices:['A confirmation message will be sent when maintenance is complete.','Employees may request new chairs from Facilities.','The annual budget meeting is next month.','Parking permits expire in December.'], answer:'A', skills:['sentence-placement','context'], difficulty:2, explanation:'A confirmation message logically follows the discussion of restored access.', ruleId:'p6.sentence-placement', chapterIds:[27] },
    ],
  },
  {
    kind:'email',
    title:'Interview Schedule Confirmation',
    body:"Dear Mr. Wilson,\n\nThank you for applying for the operations coordinator position. We would like to invite you to an interview on Tuesday, October 20 at 10:30 A.M.\n\nThe interview will take approximately 45 minutes and [1] _____ conducted by two department managers.\n\nPlease arrive 10 minutes early and bring a copy of your resume. If you need to change the appointment, contact us [2] _____ possible.\n\nOur office is located on the fifth floor of the Riverside Building, [3] _____ is directly across from Central Station.\n\n[4] _____",
    questions:[
      { choices:['be','is','being','been'], answer:'A', skills:['passive','verb-tense'], difficulty:2, explanation:'After will, passive voice requires be plus past participle.', ruleId:'p6.passive-tense', chapterIds:[14,27] },
      { choices:['as soon as','although','despite','whereas'], answer:'A', skills:['conjunction','context'], difficulty:1, explanation:'As soon as possible is the standard expression.', ruleId:'p6.connector-context', chapterIds:[19,27] },
      { choices:['which','who','where','whose'], answer:'A', skills:['relative-clause'], difficulty:2, explanation:'The antecedent is a building, so the nonrestrictive relative clause uses which.', ruleId:'p6.relative', chapterIds:[9,27] },
      { choices:['Please check in with the receptionist when you arrive.','The company cafeteria offers vegetarian soup on Thursdays.','A product launch was held last year.','The building was painted blue in 2015.'], answer:'A', skills:['sentence-placement','context'], difficulty:2, explanation:'Check-in instructions fit naturally at the end of an interview confirmation.', ruleId:'p6.sentence-placement', chapterIds:[27] },
    ],
  },
  {
    kind:'notice',
    title:'Product Safety Recall',
    body:"IMPORTANT PRODUCT NOTICE\n\nNorthstar Appliances is voluntarily recalling model KT-44 electric kettles sold between May and August.\n\nA small number of units may overheat during use. Customers who own this model should stop using it [1] _____ and contact customer service.\n\nAffected kettles can be returned to any Northstar store [2] _____ a full refund or replacement.\n\nCustomers do not need the original packaging, but proof of purchase is [3] _____ if available.\n\n[4] _____",
    questions:[
      { choices:['immediate','immediately','immediacy','more immediate'], answer:'B', skills:['part-of-speech'], difficulty:1, explanation:'Immediately is the adverb modifying stop using.', ruleId:'p6.word-form', chapterIds:[5,27] },
      { choices:['for','with','at','among'], answer:'A', skills:['preposition','collocation'], difficulty:1, explanation:'The product is returned for a refund or replacement.', ruleId:'p6.fixed-phrase', chapterIds:[12,27] },
      { choices:['help','helpful','helpfully','helpfulness'], answer:'B', skills:['part-of-speech'], difficulty:2, explanation:'After is, an adjective is needed, so helpful fits.', ruleId:'p6.word-form', chapterIds:[3,27] },
      { choices:['A list of affected serial numbers is posted on our website.','Northstar opened its first store 25 years ago.','Kettles are available in four colors.','Employees receive discounts on kitchen products.'], answer:'A', skills:['sentence-placement','context'], difficulty:3, explanation:'Serial numbers help customers determine whether their kettle is affected.', ruleId:'p6.sentence-placement', chapterIds:[27] },
    ],
  },
  {
    kind:'message',
    title:'Team Project Update',
    body:"PROJECT UPDATE\n\nThe design team has completed the first version of the mobile app interface. User testing will begin on Monday and continue through Wednesday.\n\nBefore testing starts, all prototype links must be checked to ensure that they work [1] _____.\n\nThe research team will collect feedback from at least 20 participants and summarize the results [2] _____ Thursday morning.\n\nIf major usability issues are identified, the team [3] _____ another test round before final approval.\n\n[4] _____",
    questions:[
      { choices:['proper','properly','property','propriety'], answer:'B', skills:['part-of-speech'], difficulty:2, explanation:'Properly is the adverb modifying work.', ruleId:'p6.word-form', chapterIds:[5,27] },
      { choices:['by','during','among','beside'], answer:'A', skills:['preposition'], difficulty:1, explanation:'By Thursday morning marks the deadline.', ruleId:'p6.preposition', chapterIds:[12,27] },
      { choices:['schedule','scheduled','will schedule','has scheduled'], answer:'C', skills:['verb-tense','conjunction'], difficulty:3, explanation:'The if-clause uses present simple and the result uses will plus base verb.', ruleId:'p6.if-clause', chapterIds:[16,27] },
      { choices:['The final design will be sent to development after approval.','The office printer needs more paper.','The company holiday party is in December.','The cafeteria accepts credit cards.'], answer:'A', skills:['sentence-placement','context'], difficulty:2, explanation:'The sentence logically describes the next project step.', ruleId:'p6.sentence-placement', chapterIds:[27] },
    ],
  },
]

export const extraPart6V4: Question[] = []
const p6Passages: Passage[] = []

p6Seeds.forEach((seed, passageIndex) => {
  const passageId = 'p6-v4-' + String(passageIndex + 1).padStart(2, '0')
  const ids = seed.questions.map((_, qIndex) => passageId + '-q' + (qIndex + 1))
  p6Passages.push({ id:passageId, part:6, kind:seed.kind, title:seed.title, body:seed.body, questions:ids })
  seed.questions.forEach((q, qIndex) => {
    extraPart6V4.push({
      id:ids[qIndex], part:6, passageId, stem:'[' + (qIndex + 1) + '] _____', choices:c(...q.choices), answer:q.answer,
      skills:q.skills, difficulty:q.difficulty, explanation:q.explanation, ruleId:q.ruleId, chapterIds:q.chapterIds,
      targetSeconds:q.skills.includes('sentence-placement') ? 55 : 40,
    })
  })
})

type Q7 = {
  stem: string
  choices: [string, string, string, string]
  answer: string
  skills: SkillId[]
  difficulty: 1 | 2 | 3 | 4 | 5
  explanation: string
  ruleId: string
}
type S7 = { kind: Passage['kind']; title: string; body: string; questions: Q7[] }

const p7Seeds: S7[] = [
  {
    kind:'email',
    title:'Email: Meeting Room Change',
    body:"From: Aiko Tanaka\nTo: Product Team\nSubject: Thursday Client Meeting\n\nThe client meeting scheduled for Thursday at 2:00 P.M. will now be held in Conference Room C instead of Room A. Room A is being used for an equipment inspection that is expected to continue until late afternoon.\n\nPlease send any final presentation changes to me by noon on Wednesday so I can prepare the client packet. I will print copies for everyone attending the meeting.\n\nVisitors should check in at the reception desk on the first floor. I have already sent the guest list to Security.",
    questions:[
      { stem:'Why was the meeting moved to Conference Room C?', choices:['Room A is being inspected.','The client requested a larger room.','Conference Room C has new equipment.','Room A is reserved for lunch.'], answer:'A', skills:['detail','paraphrase'], difficulty:1, explanation:'Room A is being used for an equipment inspection.', ruleId:'p7.detail' },
      { stem:'When should presentation changes be sent?', choices:['Tuesday morning','Wednesday by noon','Thursday at 2:00 P.M.','Thursday afternoon'], answer:'B', skills:['detail'], difficulty:1, explanation:'Aiko asks for final changes by noon on Wednesday.', ruleId:'p7.detail' },
      { stem:'What will Aiko most likely do after receiving the final changes?', choices:['Prepare and print the client packet.','Cancel the equipment inspection.','Call Security to remove a visitor.','Reserve another building.'], answer:'A', skills:['inference','detail'], difficulty:2, explanation:'She says she will prepare the client packet and print copies.', ruleId:'p7.inference' },
      { stem:'What has Aiko already done?', choices:['Printed all presentation copies.','Sent the guest list to Security.','Met with the client.','Inspected Conference Room A.'], answer:'B', skills:['detail'], difficulty:1, explanation:'The guest list has already been sent to Security.', ruleId:'p7.detail' },
    ],
  },
  {
    kind:'notice',
    title:'Parking Garage Maintenance',
    body:"NOTICE TO BUILDING OCCUPANTS\n\nThe south parking garage will be closed from Saturday, November 7 at 6:00 A.M. until Sunday, November 8 at 6:00 P.M. while new lighting is installed.\n\nEmployees who need weekend access may use the north garage at no charge. Please enter through Gate 2 and display your company parking permit on the dashboard.\n\nVehicles left in the south garage after 10:00 P.M. Friday may be towed at the owner’s expense.\n\nNormal access to both garages will resume Monday morning.",
    questions:[
      { stem:'Why will the south garage be closed?', choices:['For a security inspection','For lighting installation','For repainting','For a company event'], answer:'B', skills:['detail'], difficulty:1, explanation:'New lighting will be installed during the closure.', ruleId:'p7.detail' },
      { stem:'Where should employees park during the closure?', choices:['At a public lot','In the north garage','On the street','At Gate 1'], answer:'B', skills:['detail'], difficulty:1, explanation:'Employees needing weekend access may use the north garage.', ruleId:'p7.detail' },
      { stem:'What could happen to a vehicle left in the south garage late Friday?', choices:['It may be towed.','It will receive free service.','Its permit will be renewed.','It will be moved to Gate 2.'], answer:'A', skills:['detail','paraphrase'], difficulty:2, explanation:'Vehicles left after 10:00 P.M. Friday may be towed.', ruleId:'p7.paraphrase' },
      { stem:'When will normal parking access resume?', choices:['Saturday morning','Sunday morning','Sunday afternoon','Monday morning'], answer:'D', skills:['detail'], difficulty:1, explanation:'Normal access resumes Monday morning.', ruleId:'p7.detail' },
    ],
  },
  {
    kind:'advertisement',
    title:'City Business Center Membership',
    body:"CITY BUSINESS CENTER\n\nMONTHLY MEMBERSHIP — 3,900 THB\n• Access to shared work areas Monday–Saturday, 7:00 A.M.–9:00 P.M.\n• 10 hours of meeting-room use per month\n• High-speed Wi-Fi and printing credits\n• Complimentary coffee and tea\n\nMembers who sign up for six months receive one additional month at no charge.\n\nPrivate offices are available separately and require a minimum three-month agreement.\n\nTours are offered weekdays between 10:00 A.M. and 4:00 P.M. No appointment is required.",
    questions:[
      { stem:'What is the main purpose of the advertisement?', choices:['To recruit office staff','To promote workspace memberships','To sell office furniture','To announce a building closure'], answer:'B', skills:['purpose','main-idea'], difficulty:1, explanation:'The advertisement promotes memberships at a business center.', ruleId:'p7.purpose' },
      { stem:'What is included in the monthly membership?', choices:['Unlimited private office use','Ten meeting-room hours','Free parking','Daily lunch'], answer:'B', skills:['detail'], difficulty:1, explanation:'The membership includes 10 meeting-room hours per month.', ruleId:'p7.detail' },
      { stem:'How can a member receive an extra month free?', choices:['Pay for six months','Book a tour','Rent a private office','Bring a new member'], answer:'A', skills:['detail','paraphrase'], difficulty:1, explanation:'Signing up for six months provides one additional month at no charge.', ruleId:'p7.paraphrase' },
      { stem:'What is true about tours?', choices:['They require reservations.','They are available every day.','They are offered on weekdays.','They cost 300 THB.'], answer:'C', skills:['detail'], difficulty:2, explanation:'Tours are offered on weekdays.', ruleId:'p7.detail' },
    ],
  },
  {
    kind:'article',
    title:'Local Manufacturer Expands Production',
    body:"RIVERDALE — Hartwell Components has completed an expansion of its Riverdale factory, adding 2,000 square meters of production space and installing three automated assembly lines.\n\nAccording to plant manager Elise Martin, the expansion will allow the company to increase output by approximately 30 percent without extending operating hours. Hartwell expects to hire 25 additional technicians over the next six months.\n\nThe company began the project last October after receiving several large orders from overseas customers. Construction was originally expected to finish in August but was completed three weeks ahead of schedule.\n\nA public tour of the new production area will be offered during the city’s Industry Day event next month.",
    questions:[
      { stem:'What did Hartwell Components add to its factory?', choices:['A research laboratory','Automated assembly lines','A customer service center','An employee cafeteria'], answer:'B', skills:['detail'], difficulty:1, explanation:'Three automated assembly lines were installed.', ruleId:'p7.detail' },
      { stem:'What is one expected result of the expansion?', choices:['Longer operating hours','A 30 percent increase in output','Fewer overseas orders','A reduction in factory space'], answer:'B', skills:['detail','paraphrase'], difficulty:2, explanation:'The expansion is expected to increase output by about 30 percent.', ruleId:'p7.paraphrase' },
      { stem:'Why did the company begin the expansion project?', choices:['It received large overseas orders.','It lost several technicians.','The city required renovations.','Its operating hours were reduced.'], answer:'A', skills:['detail','inference'], difficulty:2, explanation:'The project began after several large overseas orders were received.', ruleId:'p7.inference' },
      { stem:'What is suggested about the construction schedule?', choices:['It was delayed by three weeks.','It finished earlier than planned.','It began in August.','It is still incomplete.'], answer:'B', skills:['inference','paraphrase'], difficulty:2, explanation:'The expansion was completed three weeks ahead of schedule.', ruleId:'p7.inference' },
    ],
  },
  {
    kind:'multi',
    title:'Message + Training Schedule',
    body:"MESSAGE\nFrom: Rosa\nTo: Kevin\n\nI registered you for the new-supervisor training next Tuesday. The morning session on performance feedback is required, but you can choose either the 1:00 P.M. conflict-management workshop or the 2:30 P.M. scheduling workshop. Please let me know which afternoon session you prefer by Friday. I also reserved a seat for you at the networking lunch.\n\nTRAINING SCHEDULE — TUESDAY\n9:00–10:30 Giving Effective Performance Feedback\n10:45–12:00 Workplace Safety for Supervisors\n12:00–1:00 Networking Lunch\n1:00–2:15 Managing Workplace Conflict\n2:30–3:45 Building Efficient Staff Schedules",
    questions:[
      { stem:'Which session does Rosa say is required?', choices:['Workplace Safety','Performance Feedback','Workplace Conflict','Staff Schedules'], answer:'B', skills:['multi-text','detail'], difficulty:1, explanation:'Rosa says the performance-feedback session is required.', ruleId:'p7.multi-text' },
      { stem:'What must Kevin do by Friday?', choices:['Pay for lunch','Select an afternoon session','Submit a safety report','Meet with Rosa'], answer:'B', skills:['multi-text','detail'], difficulty:1, explanation:'He must tell Rosa which afternoon session he prefers.', ruleId:'p7.multi-text' },
      { stem:'If Kevin chooses the scheduling workshop, when will it begin?', choices:['10:45 A.M.','12:00 P.M.','1:00 P.M.','2:30 P.M.'], answer:'D', skills:['multi-text','detail'], difficulty:1, explanation:'The scheduling workshop begins at 2:30 P.M.', ruleId:'p7.multi-text' },
      { stem:'What can be inferred about Kevin’s lunch?', choices:['It is not reserved.','Rosa has reserved a place for him.','It begins at 1:00 P.M.','It takes place off-site.'], answer:'B', skills:['multi-text','inference'], difficulty:2, explanation:'Rosa says she reserved a seat for him at the networking lunch.', ruleId:'p7.multi-text' },
    ],
  },
  {
    kind:'email',
    title:'Email: Invoice Correction',
    body:"From: Eastport Billing\nTo: Marston Accounts\nSubject: Revised Invoice 7731\n\nThank you for pointing out the pricing error on invoice 7731. The unit price for item BR-18 was entered incorrectly, which increased the total by 4,800 THB.\n\nA corrected invoice is attached. Please disregard the previous version and use the revised document for payment processing.\n\nBecause your payment deadline is this Friday, we have updated our system so that no late fee will be added while your team processes the correction.",
    questions:[
      { stem:'Why was the invoice revised?', choices:['An item was missing.','A unit price was incorrect.','The customer changed the order.','A payment was late.'], answer:'B', skills:['detail','paraphrase'], difficulty:1, explanation:'The unit price for item BR-18 was entered incorrectly.', ruleId:'p7.paraphrase' },
      { stem:'What should the accounts team do with the previous invoice?', choices:['Pay it immediately.','Send it back.','Disregard it.','Add a late fee.'], answer:'C', skills:['detail'], difficulty:1, explanation:'The email instructs the team to disregard the previous version.', ruleId:'p7.detail' },
      { stem:'How much did the pricing error increase the total?', choices:['1,800 THB','4,800 THB','7,731 THB','18,000 THB'], answer:'B', skills:['detail'], difficulty:1, explanation:'The error increased the total by 4,800 THB.', ruleId:'p7.detail' },
      { stem:'Why will no late fee be charged?', choices:['The deadline was canceled.','The supplier made the correction necessary.','The customer paid in cash.','The order was returned.'], answer:'B', skills:['inference','purpose'], difficulty:2, explanation:'The supplier caused the invoice error and is allowing time to process the correction.', ruleId:'p7.inference' },
    ],
  },
  {
    kind:'multi',
    title:'Order Confirmation + Delivery Message',
    body:"ORDER CONFIRMATION\nOrder: GX-2908\nCustomer: Linh Tran\n2 Ergonomic Desk Chairs — 7,800 THB each\n1 Adjustable Monitor Arm — 2,600 THB\nDelivery fee — 500 THB\nExpected delivery: Wednesday, November 11\n\nDELIVERY MESSAGE\nHello Ms. Tran,\nYour order is scheduled to arrive between 1:00 and 3:00 P.M. tomorrow. The driver will call approximately 20 minutes before arrival. Because the chairs require assembly, please make sure the delivery team can access the room where they will be used. Assembly is included at no additional charge.",
    questions:[
      { stem:'How many chairs did Ms. Tran order?', choices:['One','Two','Three','Four'], answer:'B', skills:['multi-text','detail'], difficulty:1, explanation:'The order lists two ergonomic desk chairs.', ruleId:'p7.multi-text' },
      { stem:'What service is included at no additional charge?', choices:['Express delivery','Chair assembly','Old furniture removal','Weekend delivery'], answer:'B', skills:['multi-text','detail'], difficulty:1, explanation:'Chair assembly is included at no additional charge.', ruleId:'p7.multi-text' },
      { stem:'What will the driver do before arriving?', choices:['Send a new invoice','Call Ms. Tran','Assemble the chairs at the warehouse','Change the delivery time'], answer:'B', skills:['multi-text','detail'], difficulty:1, explanation:'The driver will call about 20 minutes before arrival.', ruleId:'p7.multi-text' },
      { stem:'Why should Ms. Tran make the room accessible?', choices:['The order must be inspected there.','The chairs will be assembled there.','The driver needs to collect old furniture.','The monitor arm requires a wall inspection.'], answer:'B', skills:['multi-text','inference'], difficulty:2, explanation:'The chairs require assembly in the room where they will be used.', ruleId:'p7.multi-text' },
    ],
  },
  {
    kind:'article',
    title:'Company Introduces Flexible Work Pilot',
    body:"Starting next month, Treston Media will begin a six-month flexible-work pilot for employees at its Bangkok office.\n\nEligible staff may work from home up to two days per week with supervisor approval. Teams must maintain at least 60 percent in-office coverage each day so that client meetings and on-site tasks can continue without disruption.\n\nHuman Resources will survey participants after three months and again at the end of the pilot. The company will evaluate productivity, employee satisfaction, and office-space use before deciding whether to make the arrangement permanent.\n\nEmployees in laboratory, reception, and facilities roles are not eligible because their duties require them to be on site.",
    questions:[
      { stem:'How long will the pilot program last?', choices:['Two days','Three months','Six months','One year'], answer:'C', skills:['detail'], difficulty:1, explanation:'The flexible-work pilot will last six months.', ruleId:'p7.detail' },
      { stem:'What condition must teams maintain?', choices:['At least 60 percent in-office coverage','Two client meetings each day','Full attendance on Fridays','A separate home office'], answer:'A', skills:['detail','paraphrase'], difficulty:2, explanation:'Teams must keep at least 60 percent of staff in the office each day.', ruleId:'p7.paraphrase' },
      { stem:'Why will HR survey participants?', choices:['To decide whether to continue the policy','To choose new office furniture','To calculate travel expenses','To assign supervisors'], answer:'A', skills:['purpose','inference'], difficulty:2, explanation:'The surveys help evaluate the pilot before a permanent decision is made.', ruleId:'p7.purpose' },
      { stem:'Who is NOT eligible for the program?', choices:['Marketing staff','Finance staff','Reception staff','Sales staff'], answer:'C', skills:['detail'], difficulty:1, explanation:'Reception roles are specifically listed as not eligible.', ruleId:'p7.detail' },
    ],
  },
]

export const extraPart7V4: Question[] = []
const p7Passages: Passage[] = []

p7Seeds.forEach((seed, passageIndex) => {
  const passageId = 'p7-v4-' + String(passageIndex + 1).padStart(2, '0')
  const ids = seed.questions.map((_, qIndex) => passageId + '-q' + (qIndex + 1))
  p7Passages.push({ id:passageId, part:7, kind:seed.kind, title:seed.title, body:seed.body, questions:ids })
  seed.questions.forEach((q, qIndex) => {
    extraPart7V4.push({
      id:ids[qIndex], part:7, passageId, stem:q.stem, choices:c(...q.choices), answer:q.answer, skills:q.skills,
      difficulty:q.difficulty, explanation:q.explanation, ruleId:q.ruleId, chapterIds:[28],
      targetSeconds:q.skills.includes('multi-text') ? 85 : q.difficulty >= 3 ? 80 : 70,
    })
  })
})

export const extraPassagesV4: Passage[] = [...p6Passages, ...p7Passages]
