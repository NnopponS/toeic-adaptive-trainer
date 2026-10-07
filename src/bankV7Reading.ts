import type { Passage, Question, SkillId } from './types'

const c = (a:string,b:string,c:string,d:string) => [
  {id:'A',text:a},{id:'B',text:b},{id:'C',text:c},{id:'D',text:d},
]

type Q = {
  stem:string
  choices:[string,string,string,string]
  answer:string
  skills:SkillId[]
  difficulty:1|2|3|4|5
  explanation:string
  explanationTh:string
  evidence:string
  ruleId:string
  choiceTranslationsTh?:Record<string,string>
  whyOthers?:Record<string,string>
}

type Seed = {
  kind:Passage['kind']
  title:string
  body:string
  visual:Passage['visual']
  visualTitle:string
  visualData:string[]
  questions:Q[]
}

const seeds:Seed[] = [
  {
    kind:'multi',
    title:'Northbridge Arts Week — Volunteer Assignment',
    body:`DOCUMENT 1 — VOLUNTEER PORTAL

Thank you for joining Northbridge Arts Week. Volunteers should arrive 25 minutes before their first assignment and check in at the information desk inside Hall A. A staff member will provide a badge and a radio, both of which must be returned before leaving.

Volunteers assigned to outdoor locations should review the weather notice posted in the portal at 7:00 A.M. each day. If an outdoor activity is moved indoors, the assignment time will remain the same unless a coordinator sends a separate message.

The evening film screening usually ends at 9:15 P.M. Volunteers working that event should not use the east exit afterward because the street outside will be closed for overnight construction.

---
DOCUMENT 2 — MESSAGE FROM COORDINATOR

To: Narin
From: Chloe
Time: Friday 4:46 P.M.

Thanks for agreeing to cover Maya's shift tomorrow. She had been assigned to the sculpture walk, but the forecast now shows thunderstorms from noon onward. We have moved the sculpture walk to Gallery 3. Please keep the same start time shown in the portal.

After that assignment, go directly to the film screening. You do not need to check in a second time. I have already updated your badge access so that you can enter through the west lobby after 6:00 P.M.`,
    visual:'calendar',
    visualTitle:'NARIN — SATURDAY ASSIGNMENTS',
    visualData:[
      '10:30 A.M.|Visitor welcome desk|Hall A|10:05 check-in',
      '1:00 P.M.|Sculpture walk|Courtyard|Moved if weather changes',
      '6:30 P.M.|Film screening support|Theater 2|Ends about 9:15',
    ],
    questions:[
      {
        stem:'What should Narin do first on Saturday?',
        choices:['Go directly to Gallery 3.','Check in at the Hall A information desk.','Pick up Maya at the west lobby.','Review the construction schedule.'],
        answer:'B',skills:['multi-text','inference'],difficulty:3,
        explanation:'His first assignment is at 10:30 A.M., and the portal requires volunteers to check in 25 minutes before their first assignment at Hall A.',
        explanationTh:'ต้องเชื่อม “first assignment 10:30” กับกฎใน portal ที่ให้ check in ก่อนงานแรก 25 นาทีที่ Hall A จึงต้องไป information desk ก่อน ไม่ใช่ไป Gallery 3 ทันที',
        evidence:'Volunteers should arrive 25 minutes before their first assignment and check in at the information desk inside Hall A.',
        ruleId:'p7.multi-text',
      },
      {
        stem:'Where will Narin most likely be at 1:00 P.M.?',
        choices:['The courtyard','Gallery 3','Hall A','Theater 2'],
        answer:'B',skills:['multi-text','inference'],difficulty:3,
        explanation:'The calendar lists the sculpture walk at 1:00 P.M., and Chloe says it has been moved from the courtyard to Gallery 3 without changing the start time.',
        explanationTh:'ตารางบอก sculpture walk เวลา 1:00 และข้อความของ Chloe บอกว่าย้ายจาก courtyard ไป Gallery 3 โดยเวลาเดิม ดังนั้น 1:00 เขาควรอยู่ Gallery 3',
        evidence:'We have moved the sculpture walk to Gallery 3. Please keep the same start time shown in the portal.',
        ruleId:'p7.multi-text',
      },
      {
        stem:'What is implied about Narin’s access badge?',
        choices:['It will work at an additional entrance in the evening.','It must be exchanged after each assignment.','It was originally issued to Maya.','It can be kept after the festival.'],
        answer:'A',skills:['inference','paraphrase'],difficulty:4,
        explanation:'Chloe says she updated the badge so Narin can enter through the west lobby after 6:00 P.M., implying the badge now grants additional evening access.',
        explanationTh:'ไม่ได้พูดตรง ๆ ว่า “additional entrance” แต่บอกว่าอัปเดต badge แล้วให้เข้า west lobby หลัง 6 โมงได้ จึงอนุมานว่า badge ถูกเพิ่มสิทธิ์การเข้าอีกทางในช่วงเย็น',
        evidence:'I have already updated your badge access so that you can enter through the west lobby after 6:00 P.M.',
        ruleId:'p7.inference',
      },
      {
        stem:'Why should Narin avoid the east exit after the film screening?',
        choices:['It is reserved for performers.','The street outside will be unavailable.','Badges do not work there after 9:00 P.M.','The information desk will be closed.'],
        answer:'B',skills:['detail','paraphrase'],difficulty:3,
        explanation:'The portal says the street outside the east exit will be closed for overnight construction.',
        explanationTh:'คำตอบไม่ได้ใช้คำว่า “closed for construction” ตรง ๆ แต่ paraphrase เป็น “street outside will be unavailable”',
        evidence:'the street outside will be closed for overnight construction.',
        ruleId:'p7.paraphrase',
      },
      {
        stem:'The word “cover” in Chloe’s message is closest in meaning to',
        choices:['protect','replace','report','observe'],
        answer:'B',skills:['paraphrase','vocabulary'],difficulty:4,
        explanation:'In “cover Maya’s shift,” cover means work in another person’s place, so “replace” is closest.',
        explanationTh:'ในวลี “cover Maya’s shift” คำว่า cover ไม่ได้แปลว่า “ปกคลุม” แต่หมายถึงไปทำงานแทนคนอื่น ดังนั้นใกล้กับ replace = ทำแทน/แทนที่',
        evidence:'Thanks for agreeing to cover Maya\'s shift tomorrow.',
        ruleId:'p7.word-in-context',
        choiceTranslationsTh:{A:'protect = ปกป้อง',B:'replace = แทนที่/ทำแทน',C:'report = รายงาน',D:'observe = สังเกต'},
      },
    ],
  },
  {
    kind:'multi',
    title:'Aurora Workspace — Order Adjustment',
    body:`DOCUMENT 1 — CUSTOMER E-MAIL

From: Elise Morgan
To: Aurora Workspace Support
Subject: Order AW-7318

The desks arrived this morning and are in good condition. However, the two task lamps are much taller than the dimensions shown on the product page and will not fit beneath the shelves above our workstations.

I would prefer to exchange the lamps for model L-42 rather than receive a refund. If possible, please apply the amount I already paid toward the replacement lamps. I can bring the original lamps to your Central Avenue showroom on Thursday afternoon.

---
DOCUMENT 2 — EXCHANGE POLICY

Standard merchandise may be returned within 30 days if it is unused and accompanied by the original receipt. Opened lighting products may be exchanged for another lighting product of equal or greater value. When the replacement costs more, the customer pays the difference. Delivery charges are not credited toward exchanges.

Items purchased with a volume discount are subject to the same exchange rules, but any replacement item is priced at the current single-item price.`,
    visual:'invoice',
    visualTitle:'AURORA WORKSPACE — INVOICE AW-7318',
    visualData:[
      'Item|Qty|Unit price|Line total',
      'Oakline Desk D-18|4|4,800 THB|19,200 THB',
      'Task Lamp L-38|2|1,250 THB|2,500 THB',
      'Volume discount||-1,900 THB|-1,900 THB',
      'Delivery||650 THB|650 THB',
      'TOTAL|||20,450 THB',
      'Replacement Lamp L-42|Current price|1,590 THB each|',
    ],
    questions:[
      {
        stem:'Why does Ms. Morgan want to exchange the lamps?',
        choices:['Their light is too weak.','Their dimensions are unsuitable.','Their finish does not match the desks.','They arrived damaged.'],
        answer:'B',skills:['detail','paraphrase'],difficulty:3,
        explanation:'She says the lamps are taller than the listed dimensions and will not fit beneath the shelves.',
        explanationTh:'โจทย์เปลี่ยนจาก “too tall / will not fit” เป็น “dimensions are unsuitable” ต้องจับความหมาย ไม่ใช่หา exact word',
        evidence:'the two task lamps are much taller than the dimensions shown on the product page and will not fit beneath the shelves',
        ruleId:'p7.paraphrase',
      },
      {
        stem:'How much additional money will Ms. Morgan most likely pay for the two replacement lamps, excluding any new delivery charge?',
        choices:['680 THB','1,250 THB','1,900 THB','3,180 THB'],
        answer:'A',skills:['multi-text','inference'],difficulty:5,
        explanation:'She paid 1,250 THB each for two lamps (2,500 THB). The replacements are 1,590 THB each (3,180 THB). The exchange policy says she pays the difference, so 3,180 − 2,500 = 680 THB.',
        explanationTh:'ต้องคำนวณข้ามเอกสาร: ของเดิม 2×1,250 = 2,500 บาท ของใหม่ 2×1,590 = 3,180 บาท และ policy ให้จ่ายส่วนต่าง ดังนั้นเพิ่ม 680 บาท',
        evidence:'When the replacement costs more, the customer pays the difference.',
        ruleId:'p7.multi-text',
      },
      {
        stem:'Why will the delivery charge on the invoice most likely NOT reduce the cost of the replacement lamps?',
        choices:['The lamps were bought with a discount.','Delivery fees are excluded from exchange credit.','The desks were not returned.','The exchange will occur in person.'],
        answer:'B',skills:['multi-text','inference'],difficulty:4,
        explanation:'The policy explicitly says delivery charges are not credited toward exchanges.',
        explanationTh:'แม้ invoice จะมี delivery 650 บาท แต่ policy บอกชัดว่า delivery charges are not credited toward exchanges จึงเอามาหักราคาของใหม่ไม่ได้',
        evidence:'Delivery charges are not credited toward exchanges.',
        ruleId:'p7.inference',
      },
      {
        stem:'What is indicated about the original lamps?',
        choices:['They cost less than model L-42.','They were purchased separately from the desks.','They have already been returned.','They were marked as final-sale items.'],
        answer:'A',skills:['multi-text','inference'],difficulty:3,
        explanation:'The invoice shows L-38 at 1,250 THB each and L-42 at 1,590 THB each.',
        explanationTh:'ต้องเปรียบเทียบราคาใน invoice: L-38 = 1,250 ต่อชิ้น ขณะที่ L-42 = 1,590 จึงสรุปว่าของเดิมถูกกว่า',
        evidence:'Task Lamp L-38|2|1,250 THB|2,500 THB',
        ruleId:'p7.multi-text',
      },
      {
        stem:'In the policy, the word “credited” is closest in meaning to',
        choices:['recorded as a payment','praised publicly','repaired without charge','delivered separately'],
        answer:'A',skills:['paraphrase','vocabulary'],difficulty:4,
        explanation:'Here “credited toward exchanges” means counted as money already paid that can reduce the amount due.',
        explanationTh:'credit ในบริบทการเงินหมายถึง “นำยอดไปหัก/นับเป็นเงินที่ชำระแล้ว” ไม่ใช่ชมเชยหรือซ่อมให้ฟรี',
        evidence:'Delivery charges are not credited toward exchanges.',
        ruleId:'p7.word-in-context',
        choiceTranslationsTh:{A:'นับเป็นยอดเงิน/นำไปหักยอด',B:'ได้รับคำชม',C:'ซ่อมโดยไม่คิดเงิน',D:'จัดส่งแยก'},
      },
    ],
  },
  {
    kind:'multi',
    title:'Regional Research Forum — Schedule Change',
    body:`DOCUMENT 1 — FORUM NOTICE

The Regional Research Forum will take place at Meridian Center on October 22. Attendees may collect badges from 8:00 A.M. onward in the ground-floor lobby. Because two sessions attracted more registrations than expected, the organizers have reassigned several rooms.

Anyone registered for “Urban Data in Practice” should check the updated room list before going upstairs. The session itself will still begin at the originally announced time. The networking lunch remains in the Garden Hall.

— [1] — Participants who selected the laboratory tour during registration will receive a separate message with their assigned departure group. — [2] — Space on the tour is limited, so participants should not join a different group without permission. — [3] — The buses will leave from the west entrance, not the main lobby. — [4] —

---
DOCUMENT 2 — MESSAGE

11:18 A.M.
Mira: I’m running about ten minutes late after the panel. Can you save me a seat for Urban Data?
11:20 A.M.
Leo: Yes. I’m already in the new room. The sign near the elevator still shows the old one, so use the update in the app.
11:21 A.M.
Mira: Thanks. I also got Group C for the lab tour.
11:22 A.M.
Leo: Same here. We should have plenty of time after lunch.`,
    visual:'directory',
    visualTitle:'MERIDIAN CENTER — UPDATED ROOM LIST',
    visualData:[
      'Ground floor|Badge pickup|Main lobby',
      'Level 2|Urban Data in Practice|Room 2B · 11:30 A.M.',
      'Level 3|Climate Modeling|Room 3D · 10:15 A.M.',
      'Ground floor|Networking lunch|Garden Hall · 12:45 P.M.',
      'West entrance|Lab Tour Group C bus|2:20 P.M.',
    ],
    questions:[
      {
        stem:'What problem does Leo warn Mira about?',
        choices:['A session has been canceled.','A posted sign contains outdated information.','Badge pickup has moved upstairs.','The app is temporarily unavailable.'],
        answer:'B',skills:['multi-text','inference'],difficulty:4,
        explanation:'Leo says the sign near the elevator still shows the old room and tells Mira to use the app update.',
        explanationTh:'โจทย์ไม่ได้ใช้คำว่า outdated โดยตรง แต่ “sign still shows the old one” = ป้ายยังเป็นข้อมูลเก่า',
        evidence:'The sign near the elevator still shows the old one',
        ruleId:'p7.inference',
      },
      {
        stem:'At approximately what time will Mira most likely arrive at the Urban Data session?',
        choices:['11:20 A.M.','11:30 A.M.','11:40 A.M.','12:45 P.M.'],
        answer:'C',skills:['multi-text','inference'],difficulty:4,
        explanation:'At 11:18 she says she is running about ten minutes late after the panel. The session begins at 11:30, so she is likely to arrive around 11:40.',
        explanationTh:'ต้องเชื่อมเวลา 11:18 + “late about ten minutes” กับ session 11:30 ดังนั้นคาดว่าไปถึงประมาณ 11:40',
        evidence:'I’m running about ten minutes late after the panel.',
        ruleId:'p7.multi-text',
      },
      {
        stem:'Where should Mira go for the laboratory tour?',
        choices:['The main lobby','Room 2B','The west entrance','Garden Hall'],
        answer:'C',skills:['multi-text','detail'],difficulty:3,
        explanation:'Mira is in Group C, and the directory lists the Group C bus at the west entrance.',
        explanationTh:'ข้อความบอก Mira ได้ Group C และ directory บอก Group C bus ออกจาก west entrance',
        evidence:'West entrance|Lab Tour Group C bus|2:20 P.M.',
        ruleId:'p7.multi-text',
      },
      {
        stem:'In which position [1]–[4] does the following sentence best belong? “Tour assignments cannot be changed through the mobile app.”',
        choices:['[1]','[2]','[3]','[4]'],
        answer:'C',skills:['sentence-placement','context'],difficulty:5,
        explanation:'The sentence fits after the rule that participants should not join a different group and before the bus-location detail. It continues the topic of restrictions on changing tour groups.',
        explanationTh:'ประโยคนี้พูดเรื่อง “เปลี่ยนกลุ่มไม่ได้ผ่าน app” จึงควรอยู่หลังประโยคห้ามไป group อื่นโดยไม่ได้รับอนุญาต และก่อนเปลี่ยนหัวข้อไปเรื่องจุดขึ้นรถ',
        evidence:'Space on the tour is limited, so participants should not join a different group without permission.',
        ruleId:'p7.sentence-placement',
      },
      {
        stem:'What can be inferred about Leo?',
        choices:['He arrived before Mira at the reassigned room.','He is not registered for the lab tour.','He plans to skip the networking lunch.','He works for Meridian Center.'],
        answer:'A',skills:['inference'],difficulty:3,
        explanation:'Leo says he is already in the new room and offers to save Mira a seat.',
        explanationTh:'คำว่า “I’m already in the new room” + “save me a seat” แปลว่า Leo ไปถึงห้องใหม่ก่อน Mira แล้ว',
        evidence:'I’m already in the new room.',
        ruleId:'p7.inference',
      },
    ],
  },
  {
    kind:'article',
    title:'Old Market Hall Reopens in Phases',
    body:`The century-old Old Market Hall will reopen gradually beginning next month after an eighteen-month renovation. Rather than waiting until every section is complete, the city has chosen a phased opening so that long-time vendors can resume business sooner.

The west wing, which contains most produce and flower stalls, will open on November 6. The central food court will follow two weeks later. Work on the east wing is expected to continue until January because contractors discovered water damage behind several walls during construction. City officials said the discovery did not increase the project’s total budget, but it did require the schedule to be revised.

Visitors will notice that the building looks familiar despite extensive upgrades. Original signs and ironwork were restored, while electrical wiring, ventilation, and fire-safety systems were replaced. A new indoor loading zone was also added so delivery trucks no longer need to stop on Market Street during morning traffic.

— [1] — The city expects some confusion during the first month because entrances will change as each section opens. — [2] — Temporary signs will direct visitors from the transit stop to whichever entrances are operating. — [3] — Officials therefore recommend allowing extra time for a first visit. — [4] —`,
    visual:'map',
    visualTitle:'OLD MARKET HALL — PHASED OPENING',
    visualData:[
      'WEST|Produce + flowers|Opens Nov 6',
      'CENTER|Food court|Opens Nov 20',
      'EAST|Craft + household stalls|Expected January',
      'NORTH|Indoor loading zone|Deliveries only',
      'SOUTH|Main transit stop|Visitor approach',
    ],
    questions:[
      {
        stem:'Why did the city decide to reopen the market gradually?',
        choices:['To allow some vendors to return earlier.','To reduce the number of visitors permanently.','To avoid restoring the original signs.','To move all deliveries to Market Street.'],
        answer:'A',skills:['purpose','paraphrase'],difficulty:3,
        explanation:'The article says the phased opening was chosen so long-time vendors could resume business sooner.',
        explanationTh:'“resume business sooner” ถูก paraphrase เป็น “allow some vendors to return earlier”',
        evidence:'so that long-time vendors can resume business sooner.',
        ruleId:'p7.paraphrase',
      },
      {
        stem:'What is suggested about the water damage?',
        choices:['It caused the project to exceed its budget.','It was discovered before renovation began.','It affected the planned completion timing.','It was limited to the west wing.'],
        answer:'C',skills:['inference','paraphrase'],difficulty:4,
        explanation:'Officials said the damage did not increase the total budget but did require the schedule to be revised.',
        explanationTh:'ต้องแยก budget กับ schedule: งบไม่เพิ่ม แต่เวลาเปลี่ยน ดังนั้นผลคือกระทบ timeline',
        evidence:'it did require the schedule to be revised.',
        ruleId:'p7.inference',
      },
      {
        stem:'What new feature is intended to reduce disruption on Market Street?',
        choices:['A transit stop','An indoor loading zone','A flower entrance','A food court'],
        answer:'B',skills:['detail','inference'],difficulty:3,
        explanation:'The indoor loading zone means delivery trucks no longer need to stop on Market Street during morning traffic.',
        explanationTh:'ไม่ได้ถามตรงว่า “อะไรถูกเพิ่ม” แต่ถาม feature ที่ลด disruption บนถนน ซึ่งต้องเชื่อมเหตุผลของ loading zone',
        evidence:'A new indoor loading zone was also added so delivery trucks no longer need to stop on Market Street during morning traffic.',
        ruleId:'p7.inference',
      },
      {
        stem:'In which position [1]–[4] does the following sentence best belong? “Not every entrance will be available throughout this transition.”',
        choices:['[1]','[2]','[3]','[4]'],
        answer:'A',skills:['sentence-placement','context'],difficulty:5,
        explanation:'The sentence introduces the entrance-access problem that the next sentence develops by mentioning confusion as sections open.',
        explanationTh:'ประโยคที่แทรกเปิดหัวเรื่อง “บางทางเข้าจะยังใช้ไม่ได้” แล้วประโยคถัดไปพูดต่อเรื่อง entrance เปลี่ยน จึงเหมาะที่ [1]',
        evidence:'The city expects some confusion during the first month because entrances will change as each section opens.',
        ruleId:'p7.sentence-placement',
      },
      {
        stem:'The word “phased” in paragraph 1 is closest in meaning to',
        choices:['opened in stages','privately funded','temporarily closed','carefully inspected'],
        answer:'A',skills:['vocabulary','paraphrase'],difficulty:4,
        explanation:'A phased opening occurs in separate stages rather than all at once.',
        explanationTh:'phased = ทำเป็นช่วง/เป็นระยะ ไม่ใช่เปิดทั้งหมดพร้อมกัน',
        evidence:'the city has chosen a phased opening',
        ruleId:'p7.word-in-context',
        choiceTranslationsTh:{A:'เปิดเป็นช่วง ๆ / เป็นขั้นตอน',B:'ใช้เงินทุนเอกชน',C:'ปิดชั่วคราว',D:'ตรวจอย่างละเอียด'},
      },
    ],
  },
  {
    kind:'multi',
    title:'CityLink Evening Transit Pilot',
    body:`DOCUMENT 1 — NEWS BRIEF

CityLink Transit will extend service on Routes 4 and 7 for a twelve-week evening pilot beginning November 2. The transit agency introduced the trial after a rider survey found that many hospital, restaurant, and event workers finish their shifts after the current final buses have departed.

During the pilot, the agency will compare ridership with operating costs and will also ask passengers to rate reliability. Officials emphasized that the trial is not yet a permanent schedule change. A decision about continuing the later service will be made in February.

---
DOCUMENT 2 — RIDER NOTE

I usually leave the Eastside Medical Center between 10:20 and 10:35 P.M. My apartment is near Pine Square. Route 4 gets me there with one transfer, but I often miss the current final connection because it leaves Central Station at 10:30. If the pilot gives me a later connection, I can stop paying for a taxi several nights a week.
— S. Rivera`,
    visual:'schedule',
    visualTitle:'PILOT — LAST DEPARTURE FROM CENTRAL STATION',
    visualData:[
      'Route|Current final departure|Pilot final departure',
      'Route 4|10:30 P.M.|11:10 P.M.',
      'Route 7|10:15 P.M.|10:55 P.M.',
    ],
    questions:[
      {
        stem:'What is the main reason CityLink is testing later service?',
        choices:['To respond to riders whose work ends late.','To reduce daytime traffic near hospitals.','To replace taxi companies.','To prepare for a permanent route closure.'],
        answer:'A',skills:['purpose','paraphrase'],difficulty:3,
        explanation:'The pilot responds to workers whose shifts end after the current final buses.',
        explanationTh:'คำตอบ paraphrase “finish shifts after final buses” เป็น “work ends late”',
        evidence:'many hospital, restaurant, and event workers finish their shifts after the current final buses have departed.',
        ruleId:'p7.purpose',
      },
      {
        stem:'What does the article indicate will affect the February decision?',
        choices:['Only passenger complaints','Ridership, costs, and reliability feedback','The number of taxis near Central Station','Construction at Eastside Medical Center'],
        answer:'B',skills:['detail','paraphrase'],difficulty:4,
        explanation:'The agency will compare ridership with operating costs and ask passengers to rate reliability before deciding whether to continue.',
        explanationTh:'ต้องรวม 3 ปัจจัยจากบทความ: ridership + operating costs + reliability feedback',
        evidence:'the agency will compare ridership with operating costs and will also ask passengers to rate reliability.',
        ruleId:'p7.paraphrase',
      },
      {
        stem:'Which pilot change is most relevant to S. Rivera?',
        choices:['A later Route 4 departure from Central Station','An earlier Route 7 departure','A new stop at Eastside Medical Center','A direct route to Pine Square with no transfer'],
        answer:'A',skills:['multi-text','inference'],difficulty:4,
        explanation:'Rivera misses the current 10:30 Route 4 connection. The pilot chart shows Route 4’s last departure moving later.',
        explanationTh:'ข้อความบอกว่าพลาด connection Route 4 เวลา 10:30 และ chart แสดงว่า Route 4 pilot ขยายเวลารถเที่ยวสุดท้าย จึงเป็น change ที่เกี่ยวที่สุด',
        evidence:'I often miss the current final connection because it leaves Central Station at 10:30.',
        ruleId:'p7.multi-text',
      },
      {
        stem:'What is most likely true if the pilot works well for S. Rivera?',
        choices:['The rider may spend less on transportation.','The rider will no longer need to transfer.','The rider will move closer to work.','The rider will switch to Route 7.'],
        answer:'A',skills:['inference','multi-text'],difficulty:4,
        explanation:'Rivera says a later connection would allow them to stop paying for a taxi several nights a week.',
        explanationTh:'ไม่ได้พูดตรง ๆ ว่า “spend less” แต่ถ้าไม่ต้องจ่าย taxi หลายคืน ค่าเดินทางย่อมลดลง',
        evidence:'I can stop paying for a taxi several nights a week.',
        ruleId:'p7.inference',
      },
      {
        stem:'Which statement is NOT supported by the documents?',
        choices:['The pilot lasts twelve weeks.','The later service is already permanent.','Reliability will be evaluated.','Some late-shift workers currently miss the last buses.'],
        answer:'B',skills:['detail','inference'],difficulty:4,
        explanation:'The article explicitly says the trial is not yet a permanent schedule change.',
        explanationTh:'คำถาม NOT: ตัวเลือก B ขัดกับข้อความ “not yet a permanent schedule change” โดยตรง',
        evidence:'the trial is not yet a permanent schedule change.',
        ruleId:'p7.not-supported',
      },
    ],
  },
  {
    kind:'multi',
    title:'Museum Membership Renewal',
    body:`DOCUMENT 1 — MEMBER WEB PAGE

Renew your Harbor Museum membership by December 10 to keep uninterrupted digital access to member lectures and exhibition previews. Members who renew for two years receive one complimentary guest pass valid through March 31.

Current members may apply any unused store credit to membership fees, but promotional coupons cannot be combined with store credit. Student memberships require current proof of enrollment at the time of renewal.

---
DOCUMENT 2 — E-MAIL

From: Hana Ito
To: Membership Desk
Subject: Renewal question

My membership expires December 18. I still have 600 THB of store credit from returning a book in September, and I also received the SAVE10 coupon in last month’s newsletter.

I plan to renew for two years because my sister will visit in February and I would like to take her to the new photography exhibition. I am no longer a student, so I assume I should choose the regular membership.

Could you confirm which discount or credit I can actually use online?`,
    visual:'coupon',
    visualTitle:'HARBOR MUSEUM — SAVE10',
    visualData:[
      'SAVE10|10% OFF|One-year regular membership only',
      'Valid through Dec 15|Online renewals|Cannot be combined with other promotional codes',
      'Regular membership|1 year 2,400 THB|2 years 4,300 THB',
      'Student membership|1 year 1,500 THB|Proof required',
    ],
    questions:[
      {
        stem:'Why does Ms. Ito prefer a two-year renewal?',
        choices:['She wants a guest benefit for a future visit.','The one-year membership has been discontinued.','Her store credit expires in February.','She wants to keep student pricing.'],
        answer:'A',skills:['multi-text','inference'],difficulty:4,
        explanation:'She says her sister will visit in February, and the web page says two-year renewals receive a guest pass valid through March 31.',
        explanationTh:'ต้องเชื่อมอีเมล “sister will visit in February” กับ benefit ของ 2-year renewal ที่ให้ guest pass ถึง March 31',
        evidence:'Members who renew for two years receive one complimentary guest pass valid through March 31.',
        ruleId:'p7.multi-text',
      },
      {
        stem:'Which option can Ms. Ito most likely apply to a two-year renewal?',
        choices:['The SAVE10 coupon only','Her 600 THB store credit','Student pricing','Both SAVE10 and store credit'],
        answer:'B',skills:['multi-text','inference'],difficulty:4,
        explanation:'The coupon is for one-year regular membership only, while unused store credit may be applied to membership fees.',
        explanationTh:'coupon จำกัด 1-year regular membership แต่ store credit ใช้กับ membership fees ได้ ดังนั้น 2-year ใช้ store credit',
        evidence:'Current members may apply any unused store credit to membership fees',
        ruleId:'p7.multi-text',
      },
      {
        stem:'What is indicated about Ms. Ito’s current membership?',
        choices:['It has already expired.','It will expire after the early-renewal date.','It is a student membership for two years.','It includes unlimited guest passes.'],
        answer:'B',skills:['inference','multi-text'],difficulty:3,
        explanation:'Her membership expires December 18, while the web page’s early renewal date is December 10.',
        explanationTh:'เปรียบเทียบวันที่: early-renewal Dec 10 แต่ membership หมด Dec 18 จึงหมดหลัง deadline',
        evidence:'My membership expires December 18.',
        ruleId:'p7.inference',
      },
      {
        stem:'In the web page, “uninterrupted” is closest in meaning to',
        choices:['continuous','discounted','temporary','limited'],
        answer:'A',skills:['vocabulary','paraphrase'],difficulty:4,
        explanation:'Uninterrupted access means access that continues without a break.',
        explanationTh:'uninterrupted = ต่อเนื่องโดยไม่ขาดช่วง',
        evidence:'to keep uninterrupted digital access',
        ruleId:'p7.word-in-context',
        choiceTranslationsTh:{A:'continuous = ต่อเนื่อง',B:'discounted = ลดราคา',C:'temporary = ชั่วคราว',D:'limited = จำกัด'},
      },
      {
        stem:'What will Ms. Ito probably select during renewal?',
        choices:['A student membership','A one-year regular membership','A two-year regular membership','A guest-only pass'],
        answer:'C',skills:['detail','inference'],difficulty:3,
        explanation:'She says she plans to renew for two years and is no longer a student, so regular two-year membership fits.',
        explanationTh:'อีเมลให้ข้อมูล 2 จุด: “renew for two years” และ “no longer a student” จึงเลือก regular 2-year',
        evidence:'I plan to renew for two years',
        ruleId:'p7.inference',
      },
    ],
  },
]

export const extraPart7V7:Question[]=[]
export const extraPassagesV7:Passage[]=[]

seeds.forEach((seed,pIndex)=>{
  const passageId='v7-p7-'+String(pIndex+1).padStart(2,'0')
  const ids=seed.questions.map((_,qIndex)=>passageId+'-q'+(qIndex+1))
  extraPassagesV7.push({
    id:passageId,
    part:7,
    kind:seed.kind,
    title:seed.title,
    body:seed.body,
    questions:ids,
    visual:seed.visual,
    visualTitle:seed.visualTitle,
    visualData:seed.visualData,
    sourceLabel:'Original high-fidelity TOEIC-style practice modeled on official ETS Part 7 document and question patterns; not official ETS questions.',
  })
  seed.questions.forEach((q,qIndex)=>{
    extraPart7V7.push({
      id:ids[qIndex],
      part:7,
      passageId,
      stem:q.stem,
      choices:c(...q.choices),
      answer:q.answer,
      skills:q.skills,
      difficulty:q.difficulty,
      explanation:q.explanation,
      explanationTh:q.explanationTh,
      evidence:q.evidence,
      ruleId:q.ruleId,
      choiceTranslationsTh:q.choiceTranslationsTh,
      whyOthers:q.whyOthers,
      targetSeconds:q.difficulty>=5?105:q.difficulty>=4?90:75,
      source:'core',
    })
  })
})
