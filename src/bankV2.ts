import type { Passage, Question, SkillId } from './types'

const c = (a: string, b: string, c: string, d: string) => [
  { id: 'A', text: a }, { id: 'B', text: b }, { id: 'C', text: c }, { id: 'D', text: d },
]

type P5Seed = [string, [string, string, string, string], string, SkillId[], string, 1 | 2 | 3 | 4 | 5]

const p5Seeds: P5Seed[] = [
  ['The finance team reviewed the figures _____ before presenting them to the board.', ['careful','carefully','carefulness','care'], 'B', ['part-of-speech'], 'The blank modifies the verb “reviewed,” so the adverb “carefully” is required.', 1],
  ['The new scheduling system has greatly improved staff _____.', ['productive','productively','productivity','produce'], 'C', ['part-of-speech','vocabulary'], 'After the verb “improved,” a noun naming what improved is needed. “Productivity” is the noun.', 2],
  ['Customers praised the technician for his _____ response to the service request.', ['prompt','promptly','promptness','prompting'], 'A', ['part-of-speech','vocabulary'], 'The blank modifies the noun “response,” so the adjective “prompt” is required.', 2],
  ['The expansion was completed _____ and within the approved budget.', ['success','successful','successfully','succeed'], 'C', ['part-of-speech'], 'The adverb “successfully” modifies “was completed.”', 1],
  ['The consultant gave a highly _____ presentation on workplace safety.', ['inform','information','informative','informatively'], 'C', ['part-of-speech'], 'An adjective is needed before the noun “presentation”; “informative” is correct.', 2],
  ['The company plans to _____ its online ordering system next quarter.', ['modern','modernize','modernly','modernization'], 'B', ['part-of-speech','verb-tense'], 'After “plans to,” use the base verb. “Modernize” is the verb form.', 2],
  ['The manager expressed her _____ with the quality of the revised proposal.', ['satisfy','satisfied','satisfaction','satisfactorily'], 'C', ['part-of-speech','collocation'], 'The possessive “her” is followed by a noun; “satisfaction” is correct.', 2],
  ['Our representatives are available to answer questions _____ during business hours.', ['direct','direction','directly','directed'], 'C', ['part-of-speech'], 'The blank modifies “answer,” so an adverb is required.', 2],
  ['The laboratory follows _____ established safety procedures.', ['strict','strictly','strictness','stricter'], 'B', ['part-of-speech'], 'An adverb modifies the participial adjective “established”; “strictly established” is the correct structure.', 3],
  ['The committee found the revised timeline more _____ than the original one.', ['realism','realistic','realistically','realize'], 'B', ['part-of-speech','comparison'], 'After “more,” an adjective describing “timeline” is required: “realistic.”', 2],
  ['The software automatically sends a _____ when a payment is received.', ['notify','notification','notified','notifying'], 'B', ['part-of-speech','vocabulary'], 'The article “a” requires a countable noun; “notification” fits.', 1],
  ['Employees should handle confidential documents with great _____.', ['careful','carefully','care','caring'], 'C', ['part-of-speech','collocation'], 'The phrase “with great care” requires a noun.', 2],
  ['The hotel lobby was _____ renovated before the holiday season.', ['complete','completion','completely','completing'], 'C', ['part-of-speech','passive'], 'The adverb “completely” modifies the passive verb phrase “was renovated.”', 2],
  ['The supplier provided a _____ explanation for the unexpected price increase.', ['reason','reasonable','reasonably','reasoning'], 'B', ['part-of-speech','vocabulary'], 'An adjective is required before “explanation.”', 2],
  ['The new policy is intended to reduce _____ delays in the approval process.', ['unnecessary','unnecessarily','necessity','unnecessity'], 'A', ['part-of-speech','vocabulary'], 'The adjective “unnecessary” modifies the noun “delays.”', 2],
  ['The sales department reacted _____ to the competitor’s announcement.', ['immediate','immediately','immediacy','more immediate'], 'B', ['part-of-speech'], 'The adverb “immediately” modifies “reacted.”', 1],
  ['A detailed _____ of the equipment will be conducted on Friday.', ['inspect','inspection','inspective','inspecting'], 'B', ['part-of-speech','vocabulary'], 'After “a detailed,” a noun is required; “inspection” is correct.', 2],
  ['The revised brochure is visually _____ and easier to read.', ['appeal','appealing','appealingly','appealed'], 'B', ['part-of-speech'], 'After the linking verb “is,” an adjective describing the brochure is needed.', 2],
  ['Management responded to the complaint in a _____ manner.', ['profession','professional','professionally','professionalism'], 'B', ['part-of-speech','collocation'], 'An adjective is needed before “manner.”', 1],
  ['The research findings were _____ different from what the team had expected.', ['surprise','surprised','surprising','surprisingly'], 'D', ['part-of-speech'], 'The adverb “surprisingly” modifies the adjective “different.”', 3],

  ['The final report must be submitted _____ noon on Thursday.', ['by','during','among','through'], 'A', ['preposition'], '“By noon” marks a deadline: no later than noon.', 1],
  ['The maintenance crew worked _____ the night to restore power.', ['throughout','beside','between','toward'], 'A', ['preposition'], '“Throughout the night” means during the whole period.', 2],
  ['The training room is located _____ the cafeteria and the main conference hall.', ['among','between','across','within'], 'B', ['preposition'], '“Between” is used for two specific places or items.', 1],
  ['All visitors must check in _____ the reception desk upon arrival.', ['at','for','into','from'], 'A', ['preposition','collocation'], 'The fixed phrase is “check in at the reception desk.”', 1],
  ['The company is responsible _____ arranging transportation for the delegates.', ['to','for','with','of'], 'B', ['preposition','collocation'], 'The fixed pattern is “be responsible for + noun/gerund.”', 1],
  ['Applicants must comply _____ all documentation requirements.', ['to','with','for','at'], 'B', ['preposition','collocation'], 'The verb “comply” takes the preposition “with.”', 2],
  ['The seminar is open _____ all full-time employees.', ['to','for','from','with'], 'A', ['preposition','collocation'], 'The fixed phrase is “be open to someone.”', 1],
  ['Please refer _____ page 18 for the updated warranty conditions.', ['at','to','with','from'], 'B', ['preposition','collocation'], 'The verb phrase is “refer to.”', 1],
  ['The company invested heavily _____ new manufacturing equipment.', ['at','in','of','by'], 'B', ['preposition','collocation'], 'The correct collocation is “invest in.”', 2],
  ['The new policy will take effect _____ the beginning of next month.', ['in','at','by','from'], 'B', ['preposition'], 'The standard phrase is “at the beginning of.”', 1],
  ['Ms. Gomez has been in charge _____ the project since January.', ['of','for','to','with'], 'A', ['preposition','collocation'], 'The fixed expression is “in charge of.”', 1],
  ['The shipment was delayed _____ severe weather near the port.', ['because','because of','although','unless'], 'B', ['preposition','conjunction'], '“Because of” is followed by the noun phrase “severe weather.”', 2],
  ['The two departments worked closely _____ each other during the transition.', ['with','from','at','upon'], 'A', ['preposition','collocation'], 'The natural phrase is “work closely with.”', 1],
  ['Employees may request reimbursement _____ approved business expenses.', ['for','to','of','with'], 'A', ['preposition','collocation'], 'One requests reimbursement “for” an expense.', 2],
  ['The warranty applies only _____ products purchased from authorized dealers.', ['on','to','at','from'], 'B', ['preposition','collocation'], 'The correct phrase is “apply to.”', 2],
  ['The manager congratulated the team _____ exceeding its quarterly target.', ['on','for','at','of'], 'A', ['preposition','collocation'], 'The verb pattern is “congratulate someone on doing something.”', 3],
  ['The invoice should be sent directly _____ the accounts payable department.', ['at','to','for','onto'], 'B', ['preposition'], 'Use “to” for the destination or recipient.', 1],
  ['The director will speak _____ behalf of the entire organization.', ['at','on','in','for'], 'B', ['preposition','collocation'], 'The fixed expression is “on behalf of.”', 2],
  ['The office will remain closed _____ the public holiday.', ['during','between','among','beside'], 'A', ['preposition'], '“During” is used with an event or period such as a holiday.', 1],
  ['The discount is available _____ members who renew before December 1.', ['for','of','at','by'], 'A', ['preposition','collocation'], 'The adjective “available” commonly takes “for” when naming eligible people.', 2],

  ['The outdoor event will proceed _____ the weather conditions become unsafe.', ['unless','because','whereas','so that'], 'A', ['conjunction'], '“Unless” means “except if”; the event proceeds except if conditions become unsafe.', 2],
  ['Ms. Chen arrived early _____ she could test the presentation equipment.', ['so that','despite','during','whereas'], 'A', ['conjunction'], '“So that” introduces purpose and is followed by a full clause.', 2],
  ['The proposal was approved _____ several members had raised concerns.', ['although','because of','in order to','unless'], 'A', ['conjunction'], '“Although” introduces a contrast between the concerns and the approval.', 2],
  ['The store extended its hours _____ customer traffic had increased significantly.', ['because','unless','while','despite'], 'A', ['conjunction'], '“Because” introduces the reason for extending the hours.', 1],
  ['Please contact the help desk _____ you experience any difficulty logging in.', ['if','despite','since then','during'], 'A', ['conjunction'], '“If” introduces the condition under which the user should contact the help desk.', 1],
  ['The team will begin testing _____ the prototype is delivered.', ['once','despite','rather than','because of'], 'A', ['conjunction'], '“Once” means as soon as/after the prototype is delivered.', 2],
  ['The factory increased output, _____ demand continued to rise.', ['as','unless','despite','instead'], 'A', ['conjunction'], '“As” can mean because/while and logically links rising demand with increased output.', 3],
  ['_____ the budget is limited, the department will prioritize essential repairs.', ['Since','Despite','During','In spite'], 'A', ['conjunction'], '“Since” introduces a reason and can precede a full clause.', 2],
  ['The contract will remain valid _____ both parties agree to terminate it.', ['until','because','whereas','therefore'], 'A', ['conjunction'], '“Until” marks the condition/time at which validity ends.', 2],
  ['The company hired additional staff _____ reduce customer waiting times.', ['in order to','although','because','despite'], 'A', ['conjunction','verb-tense'], '“In order to” is followed by a base verb and expresses purpose.', 1],
  ['The conference was moved online _____ a transportation strike was announced.', ['after','despite','unless','whereas'], 'A', ['conjunction','context'], '“After” correctly indicates the sequence of events.', 2],
  ['Mr. Diaz will attend the meeting _____ he can return from Osaka in time.', ['provided that','despite','in addition to','because of'], 'A', ['conjunction'], '“Provided that” introduces a condition.', 3],
  ['The software is easy to install, _____ some users may need help configuring advanced settings.', ['although','because','so that','unless'], 'A', ['conjunction'], '“Although” introduces a contrast.', 2],
  ['We will notify all applicants _____ a final decision has been made.', ['when','despite','because of','rather than'], 'A', ['conjunction'], '“When” introduces the time at which notification will occur.', 1],
  ['_____ the shipment arrives today, production can restart tomorrow morning.', ['If','While','Despite','Because of'], 'A', ['conjunction'], '“If” introduces the condition necessary for production to restart.', 1],
  ['The restaurant remained busy _____ it had recently increased its prices.', ['even though','because of','in order to','therefore'], 'A', ['conjunction'], '“Even though” introduces a strong contrast and is followed by a clause.', 2],
  ['The manager checked the figures twice _____ submitting the report.', ['before','unless','because','whereas'], 'A', ['conjunction','verb-tense'], '“Before + gerund” correctly shows that checking happened prior to submission.', 2],
  ['The company will expand overseas _____ domestic sales remain stable.', ['as long as','despite','because of','whereas'], 'A', ['conjunction'], '“As long as” introduces a condition.', 3],
  ['The supplier lowered its price _____ remain competitive.', ['to','although','because','while'], 'A', ['conjunction','verb-tense'], 'The infinitive “to remain” expresses purpose.', 1],
  ['_____ the survey results are finalized, they will be shared with department heads.', ['As soon as','Despite','Because of','In contrast'], 'A', ['conjunction'], '“As soon as” introduces the time condition for sharing the results.', 2],

  ['By the time the guests arrived, the catering team _____ the dining area.', ['has prepared','had prepared','prepares','is preparing'], 'B', ['verb-tense'], 'Past perfect “had prepared” shows an action completed before another past action.', 3],
  ['The new branch _____ more than 2,000 customers since it opened.', ['serves','served','has served','is serving'], 'C', ['verb-tense'], '“Since it opened” calls for the present perfect to describe activity from the past until now.', 2],
  ['All applications _____ by the human resources department before interviews are scheduled.', ['review','are reviewed','reviewed','have reviewing'], 'B', ['passive','verb-tense'], 'Applications receive the action, so the present simple passive “are reviewed” is required.', 2],
  ['The equipment _____ before it is returned to the storage room.', ['must inspect','must be inspected','must inspected','must be inspecting'], 'B', ['passive','verb-tense'], 'A modal passive uses “must be + past participle.”', 2],
  ['Neither the supervisor nor the technicians _____ available this afternoon.', ['is','are','was','be'], 'B', ['subject-verb'], 'With “neither A nor B,” agreement normally follows the nearer subject; “technicians” is plural.', 2],
  ['Each of the conference rooms _____ equipped with a video display.', ['are','is','have','be'], 'B', ['subject-verb'], 'The subject “Each” is singular, so “is” is required.', 2],
  ['The results of the customer survey _____ encouraging.', ['was','is','are','has'], 'C', ['subject-verb'], 'The head noun “results” is plural, so “are” is correct.', 1],
  ['The company _____ a new distribution center next spring.', ['opens','opened','will open','has open'], 'C', ['verb-tense'], '“Next spring” signals a future event, so “will open” is appropriate.', 1],
  ['The committee _____ three times this month to discuss the merger.', ['met','has met','meets','was meeting'], 'B', ['verb-tense'], '“This month” is an unfinished time period, so present perfect fits.', 3],
  ['The office computers _____ when the power outage occurred.', ['were being updated','are updated','have updated','update'], 'A', ['verb-tense','passive'], 'Past continuous passive shows an action in progress when another past event occurred.', 4],
  ['Ms. Ito _____ the contract before she noticed the pricing error.', ['signed','had signed','has signed','signs'], 'B', ['verb-tense'], 'The signing happened before another past event, so past perfect is clearest.', 3],
  ['If the client approves the design today, production _____ immediately.', ['began','will begin','has begun','beginning'], 'B', ['verb-tense','conjunction'], 'In a first conditional, use present simple in the if-clause and “will + base verb” in the result.', 2],
  ['The conference organizer requested that all speakers _____ their slides in advance.', ['submit','submits','submitted','submitting'], 'A', ['verb-tense'], 'After “request that,” formal English uses the subjunctive base form “submit.”', 3],
  ['A list of approved vendors _____ on the company intranet.', ['are posted','is posted','post','have posted'], 'B', ['subject-verb','passive'], 'The head subject “A list” is singular and receives the action: “is posted.”', 3],
  ['The invoices _____ yet, so payment cannot be processed.', ['have not been approved','did not approve','are not approving','have not approve'], 'A', ['passive','verb-tense'], 'Present perfect passive “have not been approved” matches “yet” and the passive meaning.', 3],
  ['Several employees _____ to the new office before the end of the month.', ['will transfer','will be transferred','have transferring','transfers'], 'B', ['passive','verb-tense'], 'Employees receive the transfer action, so future passive “will be transferred” is correct.', 2],
  ['The number of online orders _____ steadily over the past six months.', ['have increased','has increased','increase','are increasing'], 'B', ['subject-verb','verb-tense'], 'The subject is singular “The number,” and “over the past six months” supports present perfect.', 4],
  ['Our legal team _____ the agreement at the moment.', ['reviews','is reviewing','reviewed','has review'], 'B', ['verb-tense'], '“At the moment” signals an action in progress, so present continuous is needed.', 1],
  ['The packages _____ by noon tomorrow if there are no further delays.', ['deliver','will have been delivered','delivered','have delivering'], 'B', ['passive','verb-tense'], 'Future perfect passive shows completion by a future deadline.', 4],
  ['One of the new interns _____ fluent in both Korean and English.', ['are','is','have','be'], 'B', ['subject-verb'], 'The subject “One” is singular, so “is” is correct.', 1],

  ['The employee _____ organized the charity event received an award.', ['which','who','whose','where'], 'B', ['relative-clause'], '“Who” refers to a person and serves as the subject of the relative clause.', 1],
  ['The building _____ roof was damaged will remain closed this week.', ['who','which','whose','where'], 'C', ['relative-clause'], '“Whose” shows possession: the building’s roof.', 2],
  ['The warehouse, _____ opened last year, has already reached full capacity.', ['who','which','where','what'], 'B', ['relative-clause'], 'A nonrestrictive clause referring to a thing uses “which.”', 2],
  ['The city _____ the annual trade fair is held has expanded its convention center.', ['which','where','who','whose'], 'B', ['relative-clause'], '“Where” introduces a relative clause referring to a place.', 2],
  ['Employees should keep _____ ID cards visible while on company property.', ['they','their','theirs','themselves'], 'B', ['pronoun'], 'A possessive adjective is required before the noun “ID cards.”', 1],
  ['The two proposals are similar, but _____ offers a lower implementation cost.', ['one','ones','itself','each other'], 'A', ['pronoun'], '“One” substitutes for one of two singular proposals.', 2],
  ['Managers are expected to familiarize _____ with the updated safety manual.', ['them','their','themselves','theirs'], 'C', ['pronoun'], 'The subject and object refer to the same people, requiring the reflexive “themselves.”', 2],
  ['This year’s conference attracted far _____ participants than last year’s event.', ['many','more','most','much'], 'B', ['comparison'], '“Than” signals a comparative; with countable “participants,” use “more.”', 1],
  ['The express delivery option is slightly _____ than standard shipping.', ['expensive','more expensive','most expensive','expensively'], 'B', ['comparison'], '“Than” requires a comparative adjective: “more expensive.”', 1],
  ['Of the three proposals, the second is the _____ practical.', ['more','most','much','very'], 'B', ['comparison'], 'Comparing three items requires the superlative “the most practical.”', 1],
  ['The updated model operates more quietly _____ its predecessor.', ['as','than','from','like'], 'B', ['comparison'], 'A comparative adverb phrase uses “more quietly than.”', 1],
  ['The new office is not as spacious _____ the previous location.', ['than','as','like','from'], 'B', ['comparison'], 'The equality pattern is “as + adjective + as.”', 1],
  ['The company will reimburse employees _____ travel expenses were approved in advance.', ['who','whose','which','where'], 'B', ['relative-clause'], '“Whose” shows that the travel expenses belong to the employees.', 3],
  ['The consultant with _____ we met recommended a different supplier.', ['who','whom','which','whose'], 'B', ['relative-clause'], 'After the preposition “with,” the object form “whom” is formally correct.', 4],
  ['All participants must submit _____ completed evaluation forms before leaving.', ['they','their','theirs','them'], 'B', ['pronoun'], 'A possessive adjective is needed before “completed evaluation forms.”', 1],
  ['Sales were considerably _____ in the second quarter than in the first.', ['high','higher','highest','highly'], 'B', ['comparison'], 'The word “than” requires the comparative “higher.”', 2],
  ['The revised procedure is both faster and _____ reliable.', ['more','most','many','muchest'], 'A', ['comparison'], 'Parallel comparison requires “faster and more reliable.”', 2],
  ['The director thanked everyone _____ had contributed to the successful launch.', ['which','who','where','whose'], 'B', ['relative-clause'], 'The antecedent “everyone” refers to people, so “who” is correct.', 1],
  ['The printer in the copy room is newer than _____ in reception.', ['that','those','these','them'], 'A', ['pronoun','comparison'], '“That” substitutes for the singular noun “printer” to avoid repetition.', 3],
  ['Among the applicants, Ms. Lewis has the _____ experience in international sales.', ['more','most','much','many'], 'B', ['comparison'], '“Among the applicants” indicates a group comparison, requiring the superlative “most.”', 1],

  ['The board decided to _____ the decision until additional data were available.', ['postpone','preserve','predict','purchase'], 'A', ['vocabulary','collocation'], '“Postpone a decision” means delay making or carrying out the decision.', 2],
  ['Please _____ the attached form and return it by e-mail.', ['complete','compete','compliment','compile'], 'A', ['vocabulary','collocation'], '“Complete a form” is the natural business collocation.', 1],
  ['The hotel offers a complimentary shuttle for the _____ of its guests.', ['convenience','conviction','conversation','conversion'], 'A', ['vocabulary','collocation'], '“For the convenience of” is a common phrase meaning to make something easier for someone.', 2],
  ['The manufacturer has issued a product _____ because of a safety concern.', ['recall','receipt','recovery','reviewer'], 'A', ['vocabulary','collocation'], 'A “product recall” is the withdrawal of a product because of a defect or safety issue.', 2],
  ['The meeting agenda is _____ to change if the client requests additional topics.', ['subject','object','liable','dependent'], 'A', ['vocabulary','collocation'], 'The fixed phrase “subject to change” means it may be changed.', 3],
  ['The manager asked employees to _____ any technical problems immediately.', ['report','relate','repeat','return'], 'A', ['vocabulary','collocation'], '“Report a problem” means formally inform someone about it.', 1],
  ['The new advertising campaign is intended to _____ brand awareness.', ['raise','rise','arise','lifted'], 'A', ['vocabulary','collocation'], '“Raise awareness” is the standard collocation; “raise” takes an object.', 2],
  ['The company will _____ a survey to measure customer satisfaction.', ['conduct','construct','contact','contain'], 'A', ['vocabulary','collocation'], '“Conduct a survey” means carry it out.', 2],
  ['We regret any _____ caused by the temporary closure of the parking area.', ['inconvenience','inconsistency','inexperience','independence'], 'A', ['vocabulary','collocation'], '“Cause inconvenience” is the standard phrase for trouble or difficulty caused to customers.', 2],
  ['The contract clearly _____ the responsibilities of both parties.', ['outlines','outcomes','outgrows','outweighs'], 'A', ['vocabulary','collocation'], '“Outline responsibilities” means describe them clearly and concisely.', 2],
  ['The company has taken steps to _____ energy consumption at its factories.', ['reduce','refuse','release','restore'], 'A', ['vocabulary','collocation'], '“Reduce consumption” means use less energy.', 1],
  ['The accounting error was discovered during a routine _____.', ['audit','audition','audience','authority'], 'A', ['vocabulary'], 'An “audit” is an official examination of financial records.', 2],
  ['Please keep your receipt as _____ of purchase.', ['proof','approval','permission','advice'], 'A', ['vocabulary','collocation'], 'The fixed phrase is “proof of purchase.”', 1],
  ['The retailer plans to _____ a new loyalty program next month.', ['launch','land','lead','lend'], 'A', ['vocabulary','collocation'], '“Launch a program” means introduce or start it publicly.', 1],
  ['The factory has enough raw materials to _____ production for another month.', ['maintain','mention','measure','manage'], 'A', ['vocabulary','collocation'], '“Maintain production” means keep production at the needed level.', 2],
  ['The candidate’s experience closely _____ the requirements listed in the job posting.', ['matches','mixes','marks','moves'], 'A', ['vocabulary','collocation'], '“Match requirements” means correspond well with them.', 2],
  ['The airline will _____ passengers if the flight is cancelled.', ['accommodate','accumulate','accompany','accomplish'], 'A', ['vocabulary'], 'In travel contexts, “accommodate passengers” means make suitable arrangements for them.', 3],
  ['The revised policy will _____ employees to work remotely two days per week.', ['allow','avoid','admit','arrange'], 'A', ['vocabulary','collocation'], 'The pattern is “allow someone to do something.”', 1],
  ['The supplier guaranteed that all replacement parts would be _____ within 48 hours.', ['available','avoidable','advisable','acceptable'], 'A', ['vocabulary'], '“Available” means ready for use or obtainable.', 1],
  ['The company is seeking ways to _____ its delivery process.', ['streamline','strengthen up','straighten out of','stream'], 'A', ['vocabulary','collocation'], '“Streamline a process” means make it simpler and more efficient.', 3],
]

export const extraPart5: Question[] = p5Seeds.map((seed, i) => ({
  id: `v2-p5-${String(i + 1).padStart(3, '0')}`,
  part: 5,
  stem: seed[0],
  choices: c(...seed[1]),
  answer: seed[2],
  skills: seed[3],
  explanation: seed[4],
  difficulty: seed[5],
}))

// Reading bank is appended below. All content is original TOEIC-style practice material.

export const extraPassages: Passage[] = [
  { id:'v2-p6-01', part:6, kind:'email', title:'New Inventory System', body:`To: Warehouse Staff
From: Operations
Subject: Inventory system training

Beginning November 3, all inventory updates will be entered through the new StockFlow system. Staff members who regularly handle shipments are [1] _____ to attend a 45-minute training session this week.

The sessions will be offered on Tuesday and Thursday at 2:00 P.M. in Conference Room C. [2] _____, employees should continue using the current spreadsheet until Friday afternoon.

[3] _____

Please bring your employee ID and a laptop to the session. Technical support will be available throughout the first week of the [4] _____ to answer questions.`, questions:['v2-p6-01-q1','v2-p6-01-q2','v2-p6-01-q3','v2-p6-01-q4'] },
  { id:'v2-p6-02', part:6, kind:'notice', title:'Lobby Entrance Closure', body:`NOTICE TO TENANTS

The main lobby entrance will be closed from March 14 through March 16 while the automatic doors are [1] _____. During this time, all tenants and visitors should use the east entrance beside the parking garage.

Security staff will be stationed there from 7:00 A.M. to 9:00 P.M. [2] _____ the temporary route is clearly marked, visitors may wish to allow extra time to reach upper floors.

[3] _____

We apologize for any [4] _____ this work may cause and appreciate your cooperation.`, questions:['v2-p6-02-q1','v2-p6-02-q2','v2-p6-02-q3','v2-p6-02-q4'] },
  { id:'v2-p6-03', part:6, kind:'email', title:'Client Workshop Confirmation', body:`Dear Ms. Narita,

Thank you for registering your team for the Customer Analytics Workshop on July 8. We have [1] _____ seats for all six participants listed on your form.

The workshop begins at 9:30 A.M., and check-in opens 30 minutes earlier. Coffee and a light breakfast will be available in the lobby. [2] _____, lunch will be served at 12:30 P.M.

[3] _____

If any participant has a dietary restriction, please let us know by July 2 so that we can make the necessary [4] _____.

Best regards,
Training Services`, questions:['v2-p6-03-q1','v2-p6-03-q2','v2-p6-03-q3','v2-p6-03-q4'] },
  { id:'v2-p6-04', part:6, kind:'article', title:'Local Manufacturer Expands', body:`Rinwell Manufacturing announced Monday that it will open a second production facility outside Chiang Mai. The new site is expected to [1] _____ approximately 180 workers when it begins operating next year.

Company officials said the expansion became necessary after overseas orders rose by 35 percent. [2] _____, Rinwell has invested in automated packaging equipment to increase capacity at its existing plant.

[3] _____

Construction of the new facility is scheduled to begin in January and is expected to be [4] _____ within ten months.`, questions:['v2-p6-04-q1','v2-p6-04-q2','v2-p6-04-q3','v2-p6-04-q4'] },
  { id:'v2-p6-05', part:6, kind:'message', title:'IT Maintenance Reminder', body:`SYSTEM MAINTENANCE REMINDER

The employee portal will be unavailable on Saturday from 10:00 P.M. until approximately 1:00 A.M. while the IT department [1] _____ a security update.

Employees should save any online forms before the maintenance period begins. [2] _____, unfinished forms may be lost when the system restarts.

[3] _____

Normal access is expected to resume by 1:00 A.M. If the work takes longer than expected, an update will be [4] _____ on the company status page.`, questions:['v2-p6-05-q1','v2-p6-05-q2','v2-p6-05-q3','v2-p6-05-q4'] },
  { id:'v2-p6-06', part:6, kind:'advertisement', title:'Executive Language Course', body:`COMMUNICATE WITH CONFIDENCE

BrightPath Language Center is now accepting applications for its six-week Business English Intensive. The course is designed for professionals who need to communicate [1] _____ with international clients and colleagues.

Classes meet twice a week in small groups of no more than eight learners. [2] _____, each participant receives one private coaching session.

[3] _____

A placement interview is required before enrollment so that learners can be assigned to the most [4] _____ level.`, questions:['v2-p6-06-q1','v2-p6-06-q2','v2-p6-06-q3','v2-p6-06-q4'] },
  { id:'v2-p6-07', part:6, kind:'email', title:'Catering Order Adjustment', body:`Hi Lucas,

I just received the updated attendance estimate for Friday's product launch. We now expect 85 guests rather than 60, so could you please [1] _____ our catering order?

We would like to keep the same menu, but we will need additional vegetarian meals. [2] _____, please add two more beverage stations near the registration area.

[3] _____

Could you send me a revised quotation by tomorrow afternoon? I need to submit the final amount for [4] _____ before the end of the day.

Thanks,
Maya`, questions:['v2-p6-07-q1','v2-p6-07-q2','v2-p6-07-q3','v2-p6-07-q4'] },
  { id:'v2-p6-08', part:6, kind:'notice', title:'Parking Permit Renewal', body:`ANNUAL PARKING PERMIT RENEWAL

Employees who currently hold a parking permit must renew it by December 15. Renewal forms are available online and should be [1] _____ electronically.

The fee remains unchanged at 900 baht per month. [2] _____, employees who no longer require a parking space should notify Facilities so that the space can be reassigned.

[3] _____

New permits will be distributed during the final week of December and will become [4] _____ on January 1.`, questions:['v2-p6-08-q1','v2-p6-08-q2','v2-p6-08-q3','v2-p6-08-q4'] },

  { id:'v2-p7-01', part:7, kind:'email', title:'Conference Room Reservation', body:`From: Anika Bose
To: Facilities Desk
Subject: Room change for April 6

Hello,

Our project review on April 6 was originally booked in Room 312 for 12 people. Two colleagues from the Singapore office have now confirmed that they will attend in person, and our design consultant will also join us. Could you move the reservation to a room that seats at least 16 people?

We will need a large display with an HDMI connection because the consultant plans to show several prototypes. The meeting is scheduled from 1:30 to 3:00 P.M., but I would like access 20 minutes early to test the equipment.

If no larger room is available on the third floor, a room on another floor is fine.

Thank you,
Anika`, questions:['v2-p7-01-q1','v2-p7-01-q2','v2-p7-01-q3','v2-p7-01-q4'] },
  { id:'v2-p7-02', part:7, kind:'notice', title:'Library Service Update', body:`SERVICE UPDATE — HARBOR CITY LIBRARY

The second-floor study area will be closed from August 2 to August 10 while new lighting and additional electrical outlets are installed. During the closure, individual study desks will be available on the fourth floor on a first-come, first-served basis.

Group study rooms on the second floor will remain open and can still be reserved through the library Web site. However, visitors must reach those rooms using the west staircase because the central hallway will be blocked.

To reduce noise during construction, drilling will be limited to 8:30 A.M.–11:30 A.M. on weekdays. The library's regular opening hours will not change.`, questions:['v2-p7-02-q1','v2-p7-02-q2','v2-p7-02-q3','v2-p7-02-q4'] },
  { id:'v2-p7-03', part:7, kind:'advertisement', title:'Airport Express Pass', body:`TRAVEL MORE, WAIT LESS

The MetroLink Airport Express Pass is designed for frequent business travelers.

For 1,250 baht per month, pass holders receive:
• Six one-way trips between Central Station and the airport
• Priority boarding during weekday rush hours
• One complimentary date change per reservation
• A 15% discount on additional airport trips

Passes are valid for 30 days from the date of first use, not the purchase date. Unused trips do not carry over to a new pass.

Corporate customers purchasing ten or more passes at one time may request a monthly invoice instead of paying by credit card. Visit the MetroLink service counter for corporate enrollment.`, questions:['v2-p7-03-q1','v2-p7-03-q2','v2-p7-03-q3','v2-p7-03-q4'] },
  { id:'v2-p7-04', part:7, kind:'article', title:'Neighborhood Café Adds Evening Service', body:`RIVER PARK — Morning Table Café, known for breakfast and lunch, will begin serving dinner three nights a week starting next month. Owner Elisa Tran said the change follows repeated requests from customers who work in nearby office buildings.

The new dinner service will be offered Thursday through Saturday from 5:30 P.M. to 9:30 P.M. Instead of expanding the daytime menu, the café will introduce a smaller evening menu featuring seasonal dishes and shareable plates.

Tran said the café hired two additional cooks but will use its current service staff. Reservations will be accepted for dinner only. During breakfast and lunch, the café will continue its walk-in policy.

A trial dinner service held last month sold out on both evenings, which Tran said gave the team confidence to proceed with the change.`, questions:['v2-p7-04-q1','v2-p7-04-q2','v2-p7-04-q3','v2-p7-04-q4'] },
  { id:'v2-p7-05', part:7, kind:'message', title:'Team Chat: Printer Delivery', body:`10:12 Mina: The new color printer arrived, but the driver left it in the first-floor receiving area.
10:14 Owen: I can ask Building Services to move it to our floor.
10:15 Mina: Thanks. It needs to go in the small copy room, not beside the reception desk.
10:18 Owen: Got it. Did the extra paper trays arrive too?
10:20 Mina: Yes, there are two boxes marked “Accessories.” Please keep those with the printer.
10:23 Owen: Building Services can move everything at 2:00. Someone from our team needs to meet them upstairs.
10:25 Mina: I have a client call then. Could you do it?
10:26 Owen: Sure. I'll be there.`, questions:['v2-p7-05-q1','v2-p7-05-q2','v2-p7-05-q3','v2-p7-05-q4'] },
  { id:'v2-p7-06', part:7, kind:'email', title:'Supplier Sample Request', body:`Dear Mr. Kwan,

Thank you for sending the updated catalog. We are particularly interested in the recycled-fabric tote bags on page 18. Before placing a large order, we would like to evaluate the material and print quality.

Could you send us two samples in navy and two in gray? Please print our current logo on one bag of each color and leave the other two blank. Our marketing team will compare them at its meeting on September 9.

If possible, please use your standard shipping service rather than express delivery. We do not need the samples before September 5, and keeping the delivery cost low is more important than receiving them early.

Best regards,
Sara Malik
Northway Events`, questions:['v2-p7-06-q1','v2-p7-06-q2','v2-p7-06-q3','v2-p7-06-q4'] },
  { id:'v2-p7-07', part:7, kind:'notice', title:'Fitness Center Membership Changes', body:`MEMBERSHIP POLICY UPDATE

Effective January 1, Peak Fitness Center will introduce a new membership structure.

Standard Membership — 1,100 THB/month
Access Monday–Friday, 6 A.M.–10 P.M.

Plus Membership — 1,450 THB/month
Access every day, 5 A.M.–11 P.M.
Includes two guest passes per month.

Current members do not need to sign a new contract. Their existing memberships will automatically convert to Standard Membership unless they request Plus Membership by December 20.

Members who prepaid for six or twelve months will not be charged any additional amount until their current prepaid period ends.`, questions:['v2-p7-07-q1','v2-p7-07-q2','v2-p7-07-q3','v2-p7-07-q4'] },
  { id:'v2-p7-08', part:7, kind:'article', title:'Delivery Company Tests Electric Vans', body:`CityRoute Logistics has begun a six-month trial of twelve electric delivery vans in central Bangkok. The company says the vehicles will primarily serve routes with frequent stops and relatively short daily distances.

According to operations director Preecha Anan, the trial is intended to measure charging time, maintenance costs, and driver satisfaction before the company decides whether to purchase additional electric vehicles.

Charging stations were installed at two distribution centers last month. Drivers assigned to the trial completed a short training course on battery management and route planning.

CityRoute has not announced a date for replacing its existing fuel-powered fleet. Anan emphasized that the company will review the trial data before making any long-term investment decision.`, questions:['v2-p7-08-q1','v2-p7-08-q2','v2-p7-08-q3','v2-p7-08-q4'] },
  { id:'v2-p7-09', part:7, kind:'multi', title:'Hotel Notice + Guest Message', body:`HOTEL NOTICE
Rooftop Pool Maintenance
The rooftop pool will close at 6:00 P.M. on Tuesday, May 12, for scheduled filter maintenance and will reopen at noon on Wednesday, May 13. The fitness center on Level 5 will remain open as usual from 5:30 A.M. to 11:00 P.M. Guests who would like to swim during the closure may request a complimentary day pass to the Riverside Sports Club at the front desk.

GUEST MESSAGE
To: Front Desk
From: Room 1422 — A. Romero
I have a flight late Wednesday afternoon and was hoping to swim in the morning before checking out. I saw the notice about the pool. Could you arrange the alternative pass for me? If the sports club requires advance booking, please reserve a 9:00 A.M. time. I can pick up the pass after breakfast.`, questions:['v2-p7-09-q1','v2-p7-09-q2','v2-p7-09-q3','v2-p7-09-q4'] },
  { id:'v2-p7-10', part:7, kind:'multi', title:'Job Posting + Applicant E-mail', body:`JOB POSTING — Event Operations Coordinator
Morrow Arts Center seeks an organized coordinator to support exhibitions, workshops, and evening events. Responsibilities include vendor scheduling, room setup, supply purchasing, and on-site coordination.

Requirements:
• Two years of event or hospitality experience
• Availability for at least two evenings per week
• Strong spreadsheet and written communication skills
• Experience with ticketing software preferred but not required

Applications close June 18.

E-MAIL
Dear Hiring Team,

I am applying for the Event Operations Coordinator position. For the past three years I have worked at a conference hotel, where I coordinate meeting rooms, outside vendors, and guest requests. I regularly work evening events and use spreadsheets to track equipment and catering orders.

I have not used your ticketing platform, but I recently completed an online course on event-registration systems and am comfortable learning new software.

Sincerely,
Nadia Flores`, questions:['v2-p7-10-q1','v2-p7-10-q2','v2-p7-10-q3','v2-p7-10-q4'] },
  { id:'v2-p7-11', part:7, kind:'multi', title:'Store Promotion + Receipt', body:`WEEKEND HOME OFFICE SALE
Friday–Sunday only
• Office chairs: 20% off
• Desk lamps: buy one, get the second 50% off
• Storage cabinets: 15% off
• Free local delivery on purchases over 8,000 THB after discounts

RECEIPT — Saturday
ErgoFlex Chair ........ 5,600
ErgoFlex Chair ........ 5,600
LED Desk Lamp ......... 1,200
LED Desk Lamp ......... 1,200
Storage Cabinet ....... 4,000

Promotional discounts are applied at checkout. Delivery address: 18 Sathon Road, Bangkok.`, questions:['v2-p7-11-q1','v2-p7-11-q2','v2-p7-11-q3','v2-p7-11-q4'] },
  { id:'v2-p7-12', part:7, kind:'multi', title:'Train Schedule + Message', body:`AIRPORT RAIL SCHEDULE — CENTRAL STATION
Train A  06:40 → Airport 07:12
Train B  07:10 → Airport 07:42
Train C  07:40 → Airport 08:12
Train D  08:10 → Airport 08:42

Passenger advisory: Beginning Monday, trains will depart from Platform 4 instead of Platform 2 because of renovation work. Please arrive at the platform at least five minutes before departure.

MESSAGE
To: Ken
My flight boards at 9:15 tomorrow. I was planning to take the 7:40 train, but the airline just asked international passengers to arrive at the gate 60 minutes before boarding. I also need about 20 minutes after reaching the airport to check my bag and get to the gate. I think I should leave earlier. — Mei`, questions:['v2-p7-12-q1','v2-p7-12-q2','v2-p7-12-q3','v2-p7-12-q4'] },
]

export const extraPart6: Question[] = [
  { id:'v2-p6-01-q1', part:6, passageId:'v2-p6-01', stem:'Blank [1]', choices:c('require','required','requiring','requirement'), answer:'B', skills:['part-of-speech','passive','context'], difficulty:2, explanation:'The passive structure “are required to attend” needs the past participle “required.”' },
  { id:'v2-p6-01-q2', part:6, passageId:'v2-p6-01', stem:'Blank [2]', choices:c('Until then','For example','Otherwise','In contrast'), answer:'A', skills:['context','sentence-placement'], difficulty:2, explanation:'“Until then” links the upcoming training/system change with the instruction to keep using the current spreadsheet before the switch.' },
  { id:'v2-p6-01-q3', part:6, passageId:'v2-p6-01', stem:'Blank [3]', choices:c('The old warehouse was built more than a decade ago.','Registration is not necessary; employees may attend either session.','Several products will be discontinued next year.','The cafeteria closes at 4:00 P.M. on Fridays.'), answer:'B', skills:['sentence-placement','context'], difficulty:3, explanation:'The paragraph is about training logistics, so the sentence explaining attendance and registration fits naturally.' },
  { id:'v2-p6-01-q4', part:6, passageId:'v2-p6-01', stem:'Blank [4]', choices:c('implementation','implement','implemented','implementing'), answer:'A', skills:['part-of-speech','context'], difficulty:2, explanation:'“The first week of the implementation” requires a noun after “the.”' },

  { id:'v2-p6-02-q1', part:6, passageId:'v2-p6-02', stem:'Blank [1]', choices:c('replace','replaced','replacing','replacement'), answer:'B', skills:['passive','part-of-speech'], difficulty:2, explanation:'The doors receive the action, so “are replaced” is the correct passive structure.' },
  { id:'v2-p6-02-q2', part:6, passageId:'v2-p6-02', stem:'Blank [2]', choices:c('Although','Because of','Unless','Therefore'), answer:'A', skills:['conjunction','context'], difficulty:3, explanation:'“Although” introduces the contrast: the route is marked, but visitors may still need extra time.' },
  { id:'v2-p6-02-q3', part:6, passageId:'v2-p6-02', stem:'Blank [3]', choices:c('Deliveries should also use the east entrance during the closure.','The company picnic will be held next month.','New parking permits are available online.','Tenants may renew leases at any time.'), answer:'A', skills:['sentence-placement','context'], difficulty:2, explanation:'The passage concerns temporary access during the entrance closure; delivery instructions fit that topic.' },
  { id:'v2-p6-02-q4', part:6, passageId:'v2-p6-02', stem:'Blank [4]', choices:c('convenience','inconvenience','convenient','inconveniently'), answer:'B', skills:['vocabulary','part-of-speech'], difficulty:2, explanation:'The standard phrase is “apologize for any inconvenience.”' },

  { id:'v2-p6-03-q1', part:6, passageId:'v2-p6-03', stem:'Blank [1]', choices:c('reserved','reserving','reservation','reserve'), answer:'A', skills:['verb-tense','context'], difficulty:2, explanation:'Present perfect “have reserved” correctly describes a completed reservation relevant now.' },
  { id:'v2-p6-03-q2', part:6, passageId:'v2-p6-03', stem:'Blank [2]', choices:c('Similarly','In addition','Instead','Nevertheless'), answer:'B', skills:['context','conjunction'], difficulty:2, explanation:'“In addition” adds another service provided during the workshop.' },
  { id:'v2-p6-03-q3', part:6, passageId:'v2-p6-03', stem:'Blank [3]', choices:c('Please bring a laptop, as several activities will be completed online.','The building was sold to a hotel company last year.','Our accounting office closes at noon on Fridays.','Several instructors commute by train.'), answer:'A', skills:['sentence-placement','context'], difficulty:2, explanation:'A laptop instruction logically belongs with workshop preparation details.' },
  { id:'v2-p6-03-q4', part:6, passageId:'v2-p6-03', stem:'Blank [4]', choices:c('arrangements','arranges','arranged','arranging'), answer:'A', skills:['part-of-speech','collocation'], difficulty:2, explanation:'The fixed phrase is “make the necessary arrangements,” requiring a plural noun.' },

  { id:'v2-p6-04-q1', part:6, passageId:'v2-p6-04', stem:'Blank [1]', choices:c('employee','employ','employment','employing'), answer:'B', skills:['part-of-speech','vocabulary'], difficulty:2, explanation:'After “expected to,” use the base verb “employ.”' },
  { id:'v2-p6-04-q2', part:6, passageId:'v2-p6-04', stem:'Blank [2]', choices:c('Meanwhile','Otherwise','For example','Despite'), answer:'A', skills:['context','conjunction'], difficulty:3, explanation:'“Meanwhile” shows that the company is also increasing capacity at its existing plant during the expansion process.' },
  { id:'v2-p6-04-q3', part:6, passageId:'v2-p6-04', stem:'Blank [3]', choices:c('The company expects most new positions to be filled locally.','The city library will extend its weekend hours.','Customers can return items within seven days.','The current factory cafeteria was recently remodeled.'), answer:'A', skills:['sentence-placement','context'], difficulty:2, explanation:'The article has just introduced the new facility and jobs, so a sentence about local hiring fits.' },
  { id:'v2-p6-04-q4', part:6, passageId:'v2-p6-04', stem:'Blank [4]', choices:c('complete','completion','completely','completed'), answer:'D', skills:['passive','part-of-speech'], difficulty:2, explanation:'The passive phrase “is expected to be completed” requires the past participle.' },

  { id:'v2-p6-05-q1', part:6, passageId:'v2-p6-05', stem:'Blank [1]', choices:c('installs','installed','will install','has installing'), answer:'C', skills:['verb-tense','context'], difficulty:2, explanation:'The maintenance is a future scheduled activity, so “will install” fits.' },
  { id:'v2-p6-05-q2', part:6, passageId:'v2-p6-05', stem:'Blank [2]', choices:c('Otherwise','Similarly','Therefore','For instance'), answer:'A', skills:['context','conjunction'], difficulty:2, explanation:'“Otherwise” introduces the consequence of not saving unfinished forms.' },
  { id:'v2-p6-05-q3', part:6, passageId:'v2-p6-05', stem:'Blank [3]', choices:c('Users who are already signed in will be disconnected when maintenance begins.','The marketing team will meet in Room 5.','The company has ordered new office chairs.','Parking fees will increase next month.'), answer:'A', skills:['sentence-placement','context'], difficulty:2, explanation:'This sentence directly explains what will happen to users during system maintenance.' },
  { id:'v2-p6-05-q4', part:6, passageId:'v2-p6-05', stem:'Blank [4]', choices:c('post','posting','posted','poster'), answer:'C', skills:['passive','part-of-speech'], difficulty:2, explanation:'The future passive “will be posted” requires a past participle.' },

  { id:'v2-p6-06-q1', part:6, passageId:'v2-p6-06', stem:'Blank [1]', choices:c('effect','effective','effectively','effectiveness'), answer:'C', skills:['part-of-speech'], difficulty:2, explanation:'An adverb is needed to modify the verb “communicate.”' },
  { id:'v2-p6-06-q2', part:6, passageId:'v2-p6-06', stem:'Blank [2]', choices:c('In addition','Instead','Nevertheless','As a result of'), answer:'A', skills:['context','conjunction'], difficulty:2, explanation:'The private coaching session is an additional benefit, so “In addition” fits.' },
  { id:'v2-p6-06-q3', part:6, passageId:'v2-p6-06', stem:'Blank [3]', choices:c('Morning and evening schedules are available.','The building was constructed in 1998.','All textbooks are printed overseas.','The center also rents meeting rooms by the hour.'), answer:'A', skills:['sentence-placement','context'], difficulty:2, explanation:'Schedule options are relevant information for prospective course participants.' },
  { id:'v2-p6-06-q4', part:6, passageId:'v2-p6-06', stem:'Blank [4]', choices:c('appropriate','appropriately','appropriation','appropriate to'), answer:'A', skills:['part-of-speech','context'], difficulty:2, explanation:'An adjective is needed before “level”; “appropriate” is correct.' },

  { id:'v2-p6-07-q1', part:6, passageId:'v2-p6-07', stem:'Blank [1]', choices:c('revise','revised','revision','revising'), answer:'A', skills:['verb-tense','context'], difficulty:1, explanation:'After “could you please,” use the base verb “revise.”' },
  { id:'v2-p6-07-q2', part:6, passageId:'v2-p6-07', stem:'Blank [2]', choices:c('In addition','However','Otherwise','Instead of'), answer:'A', skills:['context','conjunction'], difficulty:2, explanation:'The beverage stations are another requested change, so “In addition” is appropriate.' },
  { id:'v2-p6-07-q3', part:6, passageId:'v2-p6-07', stem:'Blank [3]', choices:c('The event begins at 6:30 P.M., with guest check-in starting at 6:00.','Our office printer needs new ink.','The contract was signed three years ago.','Please cancel the entire food order.'), answer:'A', skills:['sentence-placement','context'], difficulty:2, explanation:'Event timing is directly relevant to catering setup and service planning.' },
  { id:'v2-p6-07-q4', part:6, passageId:'v2-p6-07', stem:'Blank [4]', choices:c('approval','approve','approved','approving'), answer:'A', skills:['part-of-speech','collocation'], difficulty:2, explanation:'The phrase “submit the final amount for approval” requires a noun.' },

  { id:'v2-p6-08-q1', part:6, passageId:'v2-p6-08', stem:'Blank [1]', choices:c('submit','submitted','submitting','submission'), answer:'B', skills:['passive','part-of-speech'], difficulty:2, explanation:'The passive phrase “should be submitted” requires the past participle.' },
  { id:'v2-p6-08-q2', part:6, passageId:'v2-p6-08', stem:'Blank [2]', choices:c('Meanwhile','Therefore','For example','Similarly to'), answer:'A', skills:['context','conjunction'], difficulty:3, explanation:'“Meanwhile” smoothly shifts to a related instruction for employees who will not renew.' },
  { id:'v2-p6-08-q3', part:6, passageId:'v2-p6-08', stem:'Blank [3]', choices:c('Permits not renewed by the deadline may be offered to employees on the waiting list.','The cafeteria introduced a new menu in June.','Visitors may borrow umbrellas from reception.','The annual party will begin at 7:00 P.M.'), answer:'A', skills:['sentence-placement','context'], difficulty:2, explanation:'The sentence explains the consequence of missing the renewal deadline and fits the parking topic.' },
  { id:'v2-p6-08-q4', part:6, passageId:'v2-p6-08', stem:'Blank [4]', choices:c('effect','effective','effectively','effecting'), answer:'B', skills:['part-of-speech','vocabulary'], difficulty:2, explanation:'After “become,” an adjective is needed; “effective” means valid or in force.' },
]

export const extraPart7: Question[] = [
  { id:'v2-p7-01-q1', part:7, passageId:'v2-p7-01', stem:'Why does Ms. Bose want to change rooms?', choices:c('The current room has faulty equipment.','More people will attend than expected.','The meeting time has changed.','The consultant requested another floor.'), answer:'B', skills:['detail','paraphrase'], difficulty:2, explanation:'Three additional attendees are now joining, so the original room for 12 is too small.' },
  { id:'v2-p7-01-q2', part:7, passageId:'v2-p7-01', stem:'What equipment is specifically needed?', choices:c('A video camera','A large display with HDMI','A conference phone','A wireless printer'), answer:'B', skills:['detail'], difficulty:1, explanation:'She asks for a large display with an HDMI connection.' },
  { id:'v2-p7-01-q3', part:7, passageId:'v2-p7-01', stem:'At approximately what time does Ms. Bose want to enter the room?', choices:c('1:10 P.M.','1:30 P.M.','2:40 P.M.','3:20 P.M.'), answer:'A', skills:['detail','inference'], difficulty:2, explanation:'The meeting starts at 1:30 P.M. and she wants access 20 minutes early, which is 1:10 P.M.' },
  { id:'v2-p7-01-q4', part:7, passageId:'v2-p7-01', stem:'What can be inferred about Ms. Bose?', choices:c('She is willing to use another floor.','She plans to cancel the meeting.','She is responsible for catering.','She prefers a room for exactly 12 people.'), answer:'A', skills:['inference'], difficulty:1, explanation:'She explicitly says a room on another floor is acceptable if necessary.' },

  { id:'v2-p7-02-q1', part:7, passageId:'v2-p7-02', stem:'Why will the study area close?', choices:c('For new furniture','For lighting and electrical work','For a private event','For carpet cleaning'), answer:'B', skills:['detail','paraphrase'], difficulty:1, explanation:'The notice says new lighting and additional electrical outlets will be installed.' },
  { id:'v2-p7-02-q2', part:7, passageId:'v2-p7-02', stem:'What will remain available on the second floor?', choices:c('Individual desks','The central hallway','Group study rooms','The information desk'), answer:'C', skills:['detail'], difficulty:1, explanation:'Group study rooms will remain open.' },
  { id:'v2-p7-02-q3', part:7, passageId:'v2-p7-02', stem:'Why should some visitors use the west staircase?', choices:c('An elevator is out of service.','The central hallway will be blocked.','The fourth floor is full.','The east entrance closes early.'), answer:'B', skills:['detail','paraphrase'], difficulty:1, explanation:'The notice says the central hallway will be blocked during construction.' },
  { id:'v2-p7-02-q4', part:7, passageId:'v2-p7-02', stem:'What is NOT changing during the project?', choices:c('Library opening hours','Location of individual desks','Access route to group rooms','Noise levels in the morning'), answer:'A', skills:['detail'], difficulty:2, explanation:'The notice explicitly states that regular opening hours will not change.' },

  { id:'v2-p7-03-q1', part:7, passageId:'v2-p7-03', stem:'Who is the pass mainly intended for?', choices:c('Airport employees','Frequent business travelers','Tour groups','Students commuting downtown'), answer:'B', skills:['purpose','main-idea'], difficulty:1, explanation:'The advertisement directly says the pass is designed for frequent business travelers.' },
  { id:'v2-p7-03-q2', part:7, passageId:'v2-p7-03', stem:'When does the 30-day validity period begin?', choices:c('On the purchase date','On the first day of the month','On the date of first use','After the sixth trip'), answer:'C', skills:['detail'], difficulty:1, explanation:'The pass is valid for 30 days from the date of first use.' },
  { id:'v2-p7-03-q3', part:7, passageId:'v2-p7-03', stem:'What benefit applies to trips beyond the six included?', choices:c('They are free on weekends.','They receive a 15% discount.','They can be transferred to another person.','They carry over to the next month.'), answer:'B', skills:['detail','paraphrase'], difficulty:1, explanation:'Additional airport trips are discounted by 15%.' },
  { id:'v2-p7-03-q4', part:7, passageId:'v2-p7-03', stem:'What is suggested about corporate customers?', choices:c('They may qualify for invoicing with a bulk purchase.','They cannot use priority boarding.','They must pay only in cash.','They receive unlimited trips.'), answer:'A', skills:['inference','detail'], difficulty:2, explanation:'Companies buying ten or more passes may request a monthly invoice.' },

  { id:'v2-p7-04-q1', part:7, passageId:'v2-p7-04', stem:'Why is Morning Table Café adding dinner service?', choices:c('A nearby restaurant closed.','Customers requested it.','Breakfast sales decreased.','The owner hired a new manager.'), answer:'B', skills:['detail','paraphrase'], difficulty:1, explanation:'The owner says the change follows repeated customer requests.' },
  { id:'v2-p7-04-q2', part:7, passageId:'v2-p7-04', stem:'On which day will dinner NOT be served?', choices:c('Thursday','Friday','Saturday','Sunday'), answer:'D', skills:['detail'], difficulty:1, explanation:'Dinner is offered Thursday through Saturday only.' },
  { id:'v2-p7-04-q3', part:7, passageId:'v2-p7-04', stem:'What will be different about dinner service?', choices:c('Reservations will be accepted.','The café will close earlier.','Only current staff will work.','The breakfast menu will be used.'), answer:'A', skills:['detail','paraphrase'], difficulty:2, explanation:'Reservations are accepted for dinner, while breakfast and lunch remain walk-in only.' },
  { id:'v2-p7-04-q4', part:7, passageId:'v2-p7-04', stem:'What gave the owner confidence in the change?', choices:c('A successful trial service','A new advertising campaign','Lower food costs','A larger kitchen'), answer:'A', skills:['inference','detail'], difficulty:1, explanation:'The trial dinner service sold out on both evenings.' },

  { id:'v2-p7-05-q1', part:7, passageId:'v2-p7-05', stem:'Where should the printer be placed?', choices:c('In reception','In the receiving area','In the small copy room','Beside the elevators'), answer:'C', skills:['detail'], difficulty:1, explanation:'Mina specifies that the printer should go in the small copy room.' },
  { id:'v2-p7-05-q2', part:7, passageId:'v2-p7-05', stem:'What is inside the boxes marked “Accessories”?', choices:c('Ink cartridges','Paper trays','Power cables','Instruction manuals'), answer:'B', skills:['detail','paraphrase'], difficulty:1, explanation:'Owen asks about extra paper trays, and Mina says they are in two boxes marked “Accessories.”' },
  { id:'v2-p7-05-q3', part:7, passageId:'v2-p7-05', stem:'Why can Mina not meet Building Services?', choices:c('She is out of the office.','She has a client call.','She is installing software.','She is attending training.'), answer:'B', skills:['detail'], difficulty:1, explanation:'Mina says she has a client call at 2:00.' },
  { id:'v2-p7-05-q4', part:7, passageId:'v2-p7-05', stem:'What will Owen most likely do at 2:00?', choices:c('Call the printer supplier','Meet Building Services upstairs','Return the printer','Join Mina’s client call'), answer:'B', skills:['inference'], difficulty:1, explanation:'Owen agrees to meet Building Services when they move the printer at 2:00.' },

  { id:'v2-p7-06-q1', part:7, passageId:'v2-p7-06', stem:'Why does Ms. Malik request samples?', choices:c('To test material and printing quality','To photograph them for a catalog','To replace damaged products','To give them to clients'), answer:'A', skills:['purpose','detail'], difficulty:1, explanation:'She wants to evaluate the material and print quality before a large order.' },
  { id:'v2-p7-06-q2', part:7, passageId:'v2-p7-06', stem:'How many samples should include the logo?', choices:c('One','Two','Three','Four'), answer:'B', skills:['detail','inference'], difficulty:2, explanation:'One navy and one gray bag should have the logo, so two bags total.' },
  { id:'v2-p7-06-q3', part:7, passageId:'v2-p7-06', stem:'What is more important than fast delivery?', choices:c('Receiving more colors','Keeping shipping cost low','Using express service','Getting samples before September 1'), answer:'B', skills:['detail','paraphrase'], difficulty:1, explanation:'She says keeping delivery cost low is more important than receiving the samples early.' },
  { id:'v2-p7-06-q4', part:7, passageId:'v2-p7-06', stem:'What will happen on September 9?', choices:c('A large order will ship.','A marketing team will compare the samples.','The catalog will be updated.','The supplier will change prices.'), answer:'B', skills:['detail'], difficulty:1, explanation:'The marketing team will compare the samples at its September 9 meeting.' },

  { id:'v2-p7-07-q1', part:7, passageId:'v2-p7-07', stem:'What is included with Plus Membership?', choices:c('Unlimited personal training','Two guest passes per month','Free parking','A lower monthly fee'), answer:'B', skills:['detail'], difficulty:1, explanation:'Plus Membership includes two guest passes per month.' },
  { id:'v2-p7-07-q2', part:7, passageId:'v2-p7-07', stem:'What will happen to a current member who takes no action?', choices:c('Membership will end.','Membership will become Standard.','Membership will become Plus.','A new contract must be signed.'), answer:'B', skills:['inference','detail'], difficulty:2, explanation:'Existing memberships automatically convert to Standard unless Plus is requested.' },
  { id:'v2-p7-07-q3', part:7, passageId:'v2-p7-07', stem:'By when should a member request Plus Membership?', choices:c('December 1','December 20','January 1','At the end of a prepaid period'), answer:'B', skills:['detail'], difficulty:1, explanation:'The request deadline is December 20.' },
  { id:'v2-p7-07-q4', part:7, passageId:'v2-p7-07', stem:'What is indicated about prepaid members?', choices:c('They must pay the difference immediately.','Their current prepaid price remains until the period ends.','They cannot choose Plus Membership.','Their contracts expire on January 1.'), answer:'B', skills:['detail','paraphrase'], difficulty:2, explanation:'No additional charge applies until the existing prepaid period ends.' },

  { id:'v2-p7-08-q1', part:7, passageId:'v2-p7-08', stem:'What is the main purpose of the six-month trial?', choices:c('To advertise a new delivery service','To evaluate electric vans before further investment','To replace all fuel-powered vehicles immediately','To train new drivers'), answer:'B', skills:['main-idea','purpose'], difficulty:1, explanation:'The company is gathering operating data before deciding whether to buy more electric vehicles.' },
  { id:'v2-p7-08-q2', part:7, passageId:'v2-p7-08', stem:'What type of routes will the vans mainly serve?', choices:c('Long-distance highway routes','Routes with frequent stops and short distances','International freight routes','Routes to only one distribution center'), answer:'B', skills:['detail'], difficulty:1, explanation:'The article says the vans will mainly serve frequent-stop, short-distance routes.' },
  { id:'v2-p7-08-q3', part:7, passageId:'v2-p7-08', stem:'What did participating drivers do before the trial?', choices:c('Installed charging stations','Completed a training course','Purchased new vehicles','Changed distribution centers'), answer:'B', skills:['detail'], difficulty:1, explanation:'Drivers completed training on battery management and route planning.' },
  { id:'v2-p7-08-q4', part:7, passageId:'v2-p7-08', stem:'What has NOT yet been decided?', choices:c('Where charging stations are located','How many vans are in the trial','When to replace the existing fuel-powered fleet','How long the trial will last'), answer:'C', skills:['detail','inference'], difficulty:2, explanation:'The company has not announced a date for replacing the current fuel-powered fleet.' },

  { id:'v2-p7-09-q1', part:7, passageId:'v2-p7-09', stem:'When will the hotel pool reopen?', choices:c('Tuesday at 6:00 P.M.','Wednesday at 9:00 A.M.','Wednesday at noon','Thursday morning'), answer:'C', skills:['multi-text','detail'], difficulty:1, explanation:'The notice says the pool will reopen at noon on Wednesday, May 13.' },
  { id:'v2-p7-09-q2', part:7, passageId:'v2-p7-09', stem:'What alternative does the hotel offer during the closure?', choices:c('A fitness class','A complimentary sports-club day pass','A room upgrade','A late checkout'), answer:'B', skills:['multi-text','detail'], difficulty:1, explanation:'Guests may request a complimentary pass to Riverside Sports Club.' },
  { id:'v2-p7-09-q3', part:7, passageId:'v2-p7-09', stem:'Why does Mr. Romero request the alternative?', choices:c('He plans to swim Wednesday morning.','The fitness center is closed.','His flight was cancelled.','He wants to bring a guest.'), answer:'A', skills:['multi-text','inference'], difficulty:2, explanation:'He wants to swim Wednesday morning before checkout, while the hotel pool is still closed.' },
  { id:'v2-p7-09-q4', part:7, passageId:'v2-p7-09', stem:'What does Mr. Romero ask the front desk to do if necessary?', choices:c('Change his flight','Book a 9:00 A.M. time','Extend the pool hours','Move him to another hotel'), answer:'B', skills:['multi-text','detail'], difficulty:1, explanation:'He asks for a 9:00 A.M. reservation if the sports club requires advance booking.' },

  { id:'v2-p7-10-q1', part:7, passageId:'v2-p7-10', stem:'Which job requirement does Ms. Flores clearly exceed?', choices:c('Ticketing software experience','Two years of relevant experience','A graduate degree','Weekend-only availability'), answer:'B', skills:['multi-text','inference'], difficulty:2, explanation:'The job asks for two years of event/hospitality experience; she has three years at a conference hotel.' },
  { id:'v2-p7-10-q2', part:7, passageId:'v2-p7-10', stem:'Which listed responsibility is similar to Ms. Flores’s current work?', choices:c('Designing exhibitions','Coordinating vendors and rooms','Developing ticketing software','Teaching workshops'), answer:'B', skills:['multi-text','paraphrase'], difficulty:2, explanation:'Her current role includes meeting rooms and outside vendors, directly matching vendor scheduling and room setup.' },
  { id:'v2-p7-10-q3', part:7, passageId:'v2-p7-10', stem:'What preferred qualification does Ms. Flores lack?', choices:c('Spreadsheet skills','Evening availability','Direct experience with the ticketing platform','Written communication skills'), answer:'C', skills:['multi-text','detail'], difficulty:1, explanation:'She says she has not used the employer’s ticketing platform.' },
  { id:'v2-p7-10-q4', part:7, passageId:'v2-p7-10', stem:'Why does Ms. Flores mention an online course?', choices:c('To show she is preparing to learn registration software','To request reimbursement','To explain a gap in employment','To prove she can teach classes'), answer:'A', skills:['multi-text','inference','purpose'], difficulty:3, explanation:'The course addresses her lack of direct ticketing-platform experience and shows relevant preparation.' },

  { id:'v2-p7-11-q1', part:7, passageId:'v2-p7-11', stem:'Which item receives the largest percentage discount?', choices:c('Office chair','Second desk lamp','Storage cabinet','First desk lamp'), answer:'B', skills:['multi-text','detail'], difficulty:2, explanation:'The second desk lamp is 50% off, greater than the 20% chair and 15% cabinet discounts.' },
  { id:'v2-p7-11-q2', part:7, passageId:'v2-p7-11', stem:'How much is the discount on the two office chairs before other promotions?', choices:c('1,120 THB','2,240 THB','4,480 THB','5,600 THB'), answer:'B', skills:['multi-text','inference'], difficulty:3, explanation:'Two chairs cost 11,200 THB total; 20% of 11,200 is 2,240 THB.' },
  { id:'v2-p7-11-q3', part:7, passageId:'v2-p7-11', stem:'What can be inferred about delivery for this purchase?', choices:c('It will qualify for free local delivery.','It must be collected in store.','It costs exactly 800 THB.','It is available only on Friday.'), answer:'A', skills:['multi-text','inference'], difficulty:3, explanation:'Even after listed discounts, the total remains above 8,000 THB, and the receipt has a local Bangkok delivery address.' },
  { id:'v2-p7-11-q4', part:7, passageId:'v2-p7-11', stem:'On what day was the purchase made?', choices:c('Thursday','Friday','Saturday','Sunday'), answer:'C', skills:['multi-text','detail'], difficulty:1, explanation:'The receipt is labeled “Saturday.”' },

  { id:'v2-p7-12-q1', part:7, passageId:'v2-p7-12', stem:'From which platform will trains depart beginning Monday?', choices:c('Platform 1','Platform 2','Platform 3','Platform 4'), answer:'D', skills:['multi-text','detail'], difficulty:1, explanation:'The advisory says departures move from Platform 2 to Platform 4.' },
  { id:'v2-p7-12-q2', part:7, passageId:'v2-p7-12', stem:'By what time should Mei be at the gate?', choices:c('7:55','8:15','8:35','9:15'), answer:'B', skills:['multi-text','inference'], difficulty:2, explanation:'Boarding is at 9:15 and international passengers should arrive at the gate 60 minutes earlier, at 8:15.' },
  { id:'v2-p7-12-q3', part:7, passageId:'v2-p7-12', stem:'Which train is the latest one that reasonably meets Mei’s stated timing needs?', choices:c('Train A','Train B','Train C','Train D'), answer:'B', skills:['multi-text','inference'], difficulty:4, explanation:'Train B arrives at 7:42, leaving 33 minutes before the 8:15 gate target; Mei says she needs about 20 minutes after arrival. Train C arrives at 8:12, which is too late.' },
  { id:'v2-p7-12-q4', part:7, passageId:'v2-p7-12', stem:'Why does Mei want to change her original plan?', choices:c('The train platform changed.','The airline gave an earlier gate-arrival recommendation.','Train C was cancelled.','She no longer needs to check a bag.'), answer:'B', skills:['multi-text','paraphrase'], difficulty:2, explanation:'The airline’s request to reach the gate 60 minutes before boarding makes her original 7:40 train too risky.' },
]
