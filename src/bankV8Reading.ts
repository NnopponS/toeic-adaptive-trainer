import type { Passage, Question } from './types'

const c = (a:string,b:string,c:string,d:string) => [
  {id:'A',text:a},{id:'B',text:b},{id:'C',text:c},{id:'D',text:d},
]

export const extraPassagesV8: Passage[] = [
  {
    id:'v8-p7-01',
    part:7,
    kind:'email',
    title:'Email: Regional Sales Training',
    body:`From: maya.chen@northstar.example
To: regional-sales@northstar.example
Date: September 28
Subject: October product training — action required

Hello everyone,

Our October product training will take place on Friday, October 16, at the Riverside Conference Center. The morning session begins at 8:45 A.M., but please arrive by 8:20 so that badges can be distributed before the first presentation. The program ends at 4:30 P.M.

This training is required for employees who joined the sales division after April 1. Other sales staff may attend if space remains. Managers should submit the names of required attendees by October 5. Optional participants should register directly through the staff portal beginning October 6.

A printed workbook will be provided at the event. Because several demonstrations require the new mobile sales application, participants should install version 4.2 on a company phone or tablet before arriving. Employees who cannot install the application should contact IT no later than October 12.

Lunch will be served in the conference center. Vegetarian meals are available, but they must be requested on the registration form. Parking at the center costs 180 THB for the day. Employees who travel together in a company vehicle can have the parking charge reimbursed by attaching the receipt to the usual expense form.

If you were scheduled to attend the smaller October 9 session, you do not need to register again. Your reservation has already been transferred to October 16.

Thank you,
Maya Chen
Regional Training Coordinator`,
    questions:['v8-p7-01-q1','v8-p7-01-q2','v8-p7-01-q3','v8-p7-01-q4','v8-p7-01-q5'],
    sourceLabel:'Original TOEIC-style practice with paraphrase and inference distractors; not an official ETS question.',
  },
  {
    id:'v8-p7-02',
    part:7,
    kind:'notice',
    title:'Building Access Notice',
    body:`HARBORPOINT BUSINESS CENTER
Temporary Access Changes — October 21–23

The main lobby entrance will be closed for floor replacement from Wednesday, October 21, through Friday, October 23. During this period, employees and visitors must use the east entrance on Lark Street.

Security staff will be stationed at the east entrance from 6:30 A.M. to 9:00 P.M. Visitors arriving outside those hours must call the company they are visiting and wait for an employee to meet them.

Deliveries larger than a standard parcel may not enter through the east lobby. Vendors making large deliveries should use Loading Bay 2 between 7:00 A.M. and 3:00 P.M. and must reserve a 30-minute unloading period in advance.

The underground parking garage will remain open. However, the elevator nearest the main lobby will be unavailable. Drivers should use the south elevator, which stops on all office floors.

The café on the first floor will close at 2:00 P.M. on October 22 for equipment maintenance and reopen at its regular time the next morning.

Tenants with questions should contact Building Services rather than the security desk.`,
    questions:['v8-p7-02-q1','v8-p7-02-q2','v8-p7-02-q3','v8-p7-02-q4','v8-p7-02-q5'],
    visual:'schedule',
    visualTitle:'SERVICE WINDOW SUMMARY',
    visualData:[
      'East entrance|6:30 A.M.–9:00 P.M.|Security staffed',
      'Loading Bay 2|7:00 A.M.–3:00 P.M.|Large deliveries · reservation required',
      'South elevator|All day|Stops on all office floors',
      'Café|Oct. 22 · closes 2:00 P.M.|Reopens next morning',
    ],
    sourceLabel:'Original TOEIC-style notice with schedule cross-checking; not an official ETS question.',
  },
  {
    id:'v8-p7-03',
    part:7,
    kind:'multi',
    title:'Order Issue: Email + Return Policy',
    body:`DOCUMENT 1 — EMAIL
From: orders@graniteoffice.example
To: arun.patel@cliftondesign.example
Date: November 3
Subject: Order GO-7719

Dear Mr. Patel,

Thank you for contacting us about the six adjustable desk lamps delivered yesterday. I am sorry that two lamps arrived with cracked bases.

We can ship two replacement lamps today at no charge. If you prefer a refund instead, please reply before 2:00 P.M. and we will e-mail a prepaid return label. The four undamaged lamps do not need to be returned.

I also noticed that your order received the 8 percent corporate account discount, but the invoice still shows a standard delivery fee. Because the order total after discount was below 12,000 THB, that delivery fee was applied correctly under our current policy.

Best regards,
Nina Alvarez
Customer Care

---

DOCUMENT 2 — ONLINE RETURN POLICY
Granite Office Supply

Damaged or defective items:
• Report damage within 7 calendar days of delivery.
• Replacement items are shipped without an additional delivery charge.
• Customers requesting a refund must return the damaged item using our prepaid label.

Standard returns:
• Unused items may be returned within 30 days.
• Standard-return delivery costs are not refundable.

Corporate accounts:
• Contract discounts are applied before delivery-fee thresholds are calculated.
• Orders of 12,000 THB or more after discount qualify for free standard delivery.
• Store credit may be applied to future purchases but does not reduce the delivery-fee threshold.`,
    questions:['v8-p7-03-q1','v8-p7-03-q2','v8-p7-03-q3','v8-p7-03-q4','v8-p7-03-q5'],
    visual:'invoice',
    visualTitle:'GO-7719 — ACCOUNT SUMMARY',
    visualData:[
      'ITEM|QTY|AMOUNT',
      'Adjustable desk lamp|6|11,400 THB',
      'Corporate discount|8%|-912 THB',
      'Delivery|1|320 THB',
      'TOTAL||10,808 THB',
    ],
    sourceLabel:'Original double-document TOEIC-style practice; not an official ETS question.',
  },
  {
    id:'v8-p7-04',
    part:7,
    kind:'multi',
    title:'Conference Update: Announcement + Chat + Shuttle Schedule',
    body:`DOCUMENT 1 — CONFERENCE ANNOUNCEMENT
Pacific Retail Forum — November 12

Because attendance has exceeded the capacity of Hall B, the opening keynote will now be held in Hall A. The starting time remains 9:00 A.M. Doors will open at 8:30.

The workshop “Reducing Checkout Delays” has been moved from Room 204 to Room 318 and will begin 15 minutes later than originally listed, at 1:45 P.M. The workshop will still end at 3:00 P.M.

Participants registered for the supplier networking lunch should pick up a blue meal ticket at the registration desk before 11:30 A.M. Tickets will not be issued at the restaurant.

---

DOCUMENT 2 — TEAM CHAT
8:06 — Lena: I am on the hotel shuttle now. It should reach the convention center around 8:35.
8:08 — Omar: Great. I already picked up our badges, so go straight to Hall A.
8:10 — Lena: Thanks. I also signed up for the checkout workshop. My old schedule says Room 204 at 1:30.
8:12 — Omar: The location and time both changed. I will send you the update.
8:15 — Lena: Perfect. I have the supplier lunch too, so I will stop at registration before the keynote if there is time.

---

DOCUMENT 3 — HOTEL SHUTTLE
Hotel → Convention Center
7:45 A.M.
8:15 A.M.
8:45 A.M.
12:30 P.M.

Convention Center → Hotel
4:15 P.M.
5:00 P.M.
6:15 P.M.

Travel time is approximately 20 minutes. During heavy traffic, allow an additional 10 minutes.`,
    questions:['v8-p7-04-q1','v8-p7-04-q2','v8-p7-04-q3','v8-p7-04-q4','v8-p7-04-q5'],
    visual:'chat',
    visualTitle:'TEAM CHAT SNAPSHOT',
    visualData:[
      '8:06|Lena|On hotel shuttle · ETA about 8:35',
      '8:08|Omar|Badges already collected · go to Hall A',
      '8:10|Lena|Old workshop schedule says Room 204 · 1:30',
      '8:12|Omar|Both location and time changed',
    ],
    sourceLabel:'Original triple-document TOEIC-style practice requiring cross-document reasoning; not an official ETS question.',
  },
]

export const extraPart7V8: Question[] = [
  {
    id:'v8-p7-01-q1',part:7,passageId:'v8-p7-01',
    stem:'What is the main purpose of the email?',
    choices:c('To announce a change in the company sales structure','To give registration and preparation instructions for a training event','To invite employees to apply for a new sales position','To explain how to claim travel expenses after a conference'),
    answer:'B',skills:['purpose','paraphrase'],difficulty:3,ruleId:'p7.purpose',
    explanation:'The email explains who must attend, how to register, what to prepare, meal and parking details, and what happens to prior registrations.',
    explanationTh:'อีเมลนี้ไม่ได้ประกาศแค่วันอบรม แต่ให้ขั้นตอนลงทะเบียน การเตรียมอุปกรณ์ อาหาร ที่จอดรถ และการย้าย reservation',
    evidence:'Managers should submit the names of required attendees by October 5.',
    targetSeconds:80,
  },
  {
    id:'v8-p7-01-q2',part:7,passageId:'v8-p7-01',
    stem:'Who is required to attend the training?',
    choices:c('All employees in the sales division','Sales employees hired after April 1','Only regional sales managers','Employees who attended the October 9 session'),
    answer:'B',skills:['detail','paraphrase'],difficulty:3,ruleId:'p7.detail',
    explanation:'Attendance is mandatory for employees who joined the sales division after April 1.',
    explanationTh:'required attendees คือคนที่เข้าฝ่ายขายหลัง April 1 ไม่ใช่พนักงานขายทุกคน',
    evidence:'required for employees who joined the sales division after April 1',
    targetSeconds:75,
  },
  {
    id:'v8-p7-01-q3',part:7,passageId:'v8-p7-01',
    stem:'What should an employee do if the mobile application cannot be installed?',
    choices:c('Request a printed workbook','Contact IT by October 12','Bring a personal laptop instead','Register as an optional participant'),
    answer:'B',skills:['detail','paraphrase'],difficulty:3,ruleId:'p7.detail',
    explanation:'The email instructs employees who cannot install the application to contact IT no later than October 12.',
    explanationTh:'โจทย์ paraphrase “cannot be installed” ตรงกับ “cannot install the application” และต้อง contact IT by Oct 12',
    evidence:'should contact IT no later than October 12',
    targetSeconds:75,
  },
  {
    id:'v8-p7-01-q4',part:7,passageId:'v8-p7-01',
    stem:'Which of the following is NOT indicated about the training?',
    choices:c('Lunch is included.','A workbook will be supplied.','Parking is free for all participants.','The event ends in the late afternoon.'),
    answer:'C',skills:['detail','inference'],difficulty:4,ruleId:'p7.not-except',
    explanation:'Parking costs 180 THB. Reimbursement is possible only for employees traveling together in a company vehicle and submitting the receipt.',
    explanationTh:'คำถาม NOT: ไม่มีข้อมูลว่าจอดฟรีทุกคน ตรงกันข้ามคือมีค่าจอด 180 บาทและคืนได้เฉพาะบางกรณี',
    evidence:'Parking at the center costs 180 THB for the day.',
    targetSeconds:90,
  },
  {
    id:'v8-p7-01-q5',part:7,passageId:'v8-p7-01',
    stem:'What can be inferred about employees previously assigned to the October 9 session?',
    choices:c('They must ask a manager to register them again.','Their attendance has already been moved to the new date.','They may attend only if space remains.','They will receive a refund for the earlier session.'),
    answer:'B',skills:['inference','paraphrase'],difficulty:4,ruleId:'p7.inference',
    explanation:'The email says their reservation has already been transferred to October 16, so no new registration is needed.',
    explanationTh:'reservation เดิมถูก transferred ไป Oct 16 แล้ว จึงอนุมานได้ว่า attendance ถูกย้ายให้เรียบร้อย',
    evidence:'Your reservation has already been transferred to October 16.',
    targetSeconds:90,
  },
  {
    id:'v8-p7-02-q1',part:7,passageId:'v8-p7-02',
    stem:'Why was the notice posted?',
    choices:c('To introduce a permanent visitor policy','To explain temporary building-access arrangements','To advertise newly renovated office space','To announce that the parking garage will close'),
    answer:'B',skills:['purpose','main-idea','paraphrase'],difficulty:3,ruleId:'p7.purpose',
    explanation:'The notice explains temporary entrances, delivery procedures, elevator access, and a café closure during lobby work.',
    explanationTh:'จุดประสงค์คือแจ้งวิธีเข้าอาคารชั่วคราวช่วงปิด main lobby ไม่ใช่นโยบายถาวร',
    evidence:'Temporary Access Changes — October 21–23',
    targetSeconds:80,
  },
  {
    id:'v8-p7-02-q2',part:7,passageId:'v8-p7-02',
    stem:'What must a vendor do before making a large delivery?',
    choices:c('Call the security desk after arriving','Reserve an unloading period','Enter through the east lobby','Use the south elevator'),
    answer:'B',skills:['detail','paraphrase'],difficulty:3,ruleId:'p7.detail',
    explanation:'Large-delivery vendors must reserve a 30-minute unloading period before using Loading Bay 2.',
    explanationTh:'ต้อง reserve 30-minute unloading period ล่วงหน้า',
    evidence:'must reserve a 30-minute unloading period in advance',
    targetSeconds:75,
  },
  {
    id:'v8-p7-02-q3',part:7,passageId:'v8-p7-02',
    stem:'A visitor arrives at 9:20 P.M. on October 22. What will the visitor most likely need to do?',
    choices:c('Wait for an employee from the host company','Use Loading Bay 2','Return the following morning','Pay a special entrance fee'),
    answer:'A',skills:['inference','detail'],difficulty:4,ruleId:'p7.inference',
    explanation:'Security is staffed only until 9:00 P.M.; visitors outside those hours must call the host company and wait for an employee.',
    explanationTh:'9:20 P.M. อยู่นอกช่วง staffed 6:30–9:00 จึงต้องให้พนักงานบริษัทที่ไปพบมารับ',
    evidence:'Visitors arriving outside those hours must call the company they are visiting and wait for an employee to meet them.',
    targetSeconds:90,
  },
  {
    id:'v8-p7-02-q4',part:7,passageId:'v8-p7-02',
    stem:'Which service will remain available throughout the three-day period?',
    choices:c('The elevator nearest the main lobby','The first-floor café at its normal hours','The underground parking garage','Security at the east entrance 24 hours a day'),
    answer:'C',skills:['detail','paraphrase'],difficulty:3,ruleId:'p7.detail',
    explanation:'The garage remains open. The other choices are either unavailable or available only during limited hours.',
    explanationTh:'garage เปิดตลอดช่วง แต่ elevator ใกล้ lobby ปิด, café ปิดเร็วหนึ่งวัน, security ไม่ได้ 24 ชั่วโมง',
    evidence:'The underground parking garage will remain open.',
    targetSeconds:80,
  },
  {
    id:'v8-p7-02-q5',part:7,passageId:'v8-p7-02',
    stem:'Which of the following is true EXCEPT?',
    choices:c('Large deliveries have restricted hours.','The south elevator serves every office floor.','Tenants should direct questions to Building Services.','The café will remain closed for the rest of the week.'),
    answer:'D',skills:['detail','paraphrase'],difficulty:4,ruleId:'p7.not-except',
    explanation:'The café closes early on October 22 and reopens the next morning; it is not closed for the rest of the week.',
    explanationTh:'EXCEPT = หาอันที่ไม่จริง ข้อ D ผิดเพราะ café เปิดใหม่เช้าวันถัดไป',
    evidence:'reopen at its regular time the next morning',
    targetSeconds:95,
  },
  {
    id:'v8-p7-03-q1',part:7,passageId:'v8-p7-03',
    stem:'Why did Mr. Patel contact Granite Office Supply?',
    choices:c('To question a corporate discount','To report damaged merchandise','To request a larger future order','To complain about a delayed shipment'),
    answer:'B',skills:['main-idea','paraphrase'],difficulty:3,ruleId:'p7.main-idea',
    explanation:'The response apologizes because two of six lamps arrived with cracked bases, showing the original contact concerned damaged items.',
    explanationTh:'แม้เราไม่เห็นอีเมลต้นฉบับของลูกค้า แต่คำตอบระบุชัดว่ามี lamp 2 ชิ้นฐานแตก จึงสรุปว่าเขาติดต่อเรื่องสินค้าเสียหาย',
    evidence:'two lamps arrived with cracked bases',
    targetSeconds:85,
  },
  {
    id:'v8-p7-03-q2',part:7,passageId:'v8-p7-03',
    stem:'What must Mr. Patel do if he wants money returned rather than replacement lamps?',
    choices:c('Reply before 2:00 P.M.','Return all six lamps.','Pay for the return shipment.','Cancel his corporate account.'),
    answer:'A',skills:['multi-text','detail','paraphrase'],difficulty:3,ruleId:'p7.multi-text',
    explanation:'The email says he should reply before 2:00 P.M. to request a refund; then a prepaid return label will be sent.',
    explanationTh:'refund path มี deadline ก่อน 2:00 P.M. และบริษัทออก prepaid label ให้',
    evidence:'If you prefer a refund instead, please reply before 2:00 P.M.',
    targetSeconds:85,
  },
  {
    id:'v8-p7-03-q3',part:7,passageId:'v8-p7-03',
    stem:'Why was a delivery fee charged on order GO-7719?',
    choices:c('The order contained damaged items.','The total after the corporate discount was below the free-delivery threshold.','The customer requested expedited delivery.','Store credit was used on the order.'),
    answer:'B',skills:['multi-text','inference','paraphrase'],difficulty:4,ruleId:'p7.multi-text',
    explanation:'The invoice total after the 8% discount is below the 12,000 THB free-delivery threshold. The policy says discounts are applied before the threshold is calculated.',
    explanationTh:'ต้องเชื่อม invoice กับ policy: หลัง discount ยอดต่ำกว่า 12,000 จึงยังมี delivery fee',
    evidence:'Orders of 12,000 THB or more after discount qualify for free standard delivery.',
    targetSeconds:100,
  },
  {
    id:'v8-p7-03-q4',part:7,passageId:'v8-p7-03',
    stem:'Which statement is NOT supported by the documents?',
    choices:c('Replacement lamps can be sent without another delivery charge.','A refund requires the damaged lamps to be returned.','The four undamaged lamps may be kept.','The delivery fee will be refunded because the lamps were damaged.'),
    answer:'D',skills:['multi-text','detail'],difficulty:5,ruleId:'p7.not-except',
    explanation:'Nothing says the original delivery fee will be refunded. The policy says replacement items ship without an additional charge, which is different.',
    explanationTh:'ตัวลวงสำคัญ: free replacement shipping ไม่ได้แปลว่า refund delivery fee เดิม',
    evidence:'Replacement items are shipped without an additional delivery charge.',
    targetSeconds:110,
  },
  {
    id:'v8-p7-03-q5',part:7,passageId:'v8-p7-03',
    stem:'In the policy, “threshold” is closest in meaning to',
    choices:c('minimum amount','delivery address','discount code','return deadline'),
    answer:'A',skills:['vocabulary','paraphrase'],difficulty:4,ruleId:'p7.word-in-context',
    explanation:'A threshold here is the minimum order amount that must be reached to qualify for free delivery.',
    explanationTh:'threshold ในบริบทนี้ = ยอดขั้นต่ำที่ต้องถึง',
    evidence:'delivery-fee thresholds',
    choiceTranslationsTh:{A:'minimum amount = จำนวนขั้นต่ำ',B:'delivery address = ที่อยู่จัดส่ง',C:'discount code = รหัสส่วนลด',D:'return deadline = กำหนดคืนสินค้า'},
    targetSeconds:90,
  },
  {
    id:'v8-p7-04-q1',part:7,passageId:'v8-p7-04',
    stem:'Why was the opening keynote moved to Hall A?',
    choices:c('The original hall could not hold all expected participants.','Hall B is being used for the supplier lunch.','The keynote speaker requested a larger stage.','The hotel shuttle arrives closer to Hall A.'),
    answer:'A',skills:['detail','paraphrase'],difficulty:3,ruleId:'p7.detail',
    explanation:'Attendance exceeded Hall B’s capacity, so the keynote was moved to Hall A.',
    explanationTh:'exceeded the capacity = คนมากเกินความจุของ Hall B',
    evidence:'attendance has exceeded the capacity of Hall B',
    targetSeconds:80,
  },
  {
    id:'v8-p7-04-q2',part:7,passageId:'v8-p7-04',
    stem:'What information in Lena’s old schedule is no longer correct?',
    choices:c('Only the workshop room','Only the workshop start time','Both the room and the start time','The workshop end time'),
    answer:'C',skills:['multi-text','detail'],difficulty:4,ruleId:'p7.multi-text',
    explanation:'Lena’s old schedule shows Room 204 at 1:30. The announcement changes the workshop to Room 318 at 1:45 while keeping the 3:00 end time.',
    explanationTh:'ต้องเทียบ chat กับ announcement: room และ start time เปลี่ยนทั้งคู่ แต่ end time ยัง 3:00',
    evidence:'moved from Room 204 to Room 318 and will begin 15 minutes later',
    targetSeconds:95,
  },
  {
    id:'v8-p7-04-q3',part:7,passageId:'v8-p7-04',
    stem:'What should Lena probably do before 11:30 A.M.?',
    choices:c('Pick up a blue meal ticket','Return to the hotel','Attend the checkout workshop','Meet the shuttle driver'),
    answer:'A',skills:['multi-text','inference'],difficulty:4,ruleId:'p7.inference',
    explanation:'She is registered for the supplier lunch, and the announcement says those participants must collect a blue ticket before 11:30 A.M.',
    explanationTh:'chat บอกว่า Lena มี supplier lunch และ announcement บอกว่าต้องรับ blue ticket ก่อน 11:30',
    evidence:'pick up a blue meal ticket at the registration desk before 11:30 A.M.',
    targetSeconds:95,
  },
  {
    id:'v8-p7-04-q4',part:7,passageId:'v8-p7-04',
    stem:'What can be inferred about Lena’s trip to the convention center?',
    choices:c('She took the 8:15 A.M. hotel shuttle.','She will miss the entire keynote.','She left the hotel at 7:45 A.M.','She plans to return to the hotel at noon.'),
    answer:'A',skills:['multi-text','inference'],difficulty:5,ruleId:'p7.multi-text',
    explanation:'At 8:06 she says she is on the shuttle and expects to arrive about 8:35. The 8:15 shuttle would arrive about 8:35 under the normal 20-minute travel time.',
    explanationTh:'ต้องเชื่อมเวลา chat กับ shuttle schedule: ETA 8:35 ตรงกับ shuttle 8:15 + 20 นาที',
    evidence:'It should reach the convention center around 8:35.',
    targetSeconds:110,
  },
  {
    id:'v8-p7-04-q5',part:7,passageId:'v8-p7-04',
    stem:'Which of the following is true EXCEPT?',
    choices:c('Omar has already collected the team’s badges.','The keynote still begins at 9:00 A.M.','The checkout workshop now starts at 1:45 P.M.','Meal tickets can be collected at the restaurant.'),
    answer:'D',skills:['multi-text','detail'],difficulty:5,ruleId:'p7.not-except',
    explanation:'The announcement explicitly says meal tickets will not be issued at the restaurant.',
    explanationTh:'EXCEPT: ข้อ D ผิด เพราะ meal tickets ต้องรับที่ registration desk และ “will not be issued at the restaurant”',
    evidence:'Tickets will not be issued at the restaurant.',
    targetSeconds:105,
  },
]
