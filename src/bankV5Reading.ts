import type { Passage, Question, SkillId } from './types'

const c = (a: string, b: string, c: string, d: string) => [
  { id: 'A', text: a }, { id: 'B', text: b }, { id: 'C', text: c }, { id: 'D', text: d },
]

type Q = {
  stem: string
  choices: [string,string,string,string]
  answer: string
  skills: SkillId[]
  difficulty: 1 | 2 | 3 | 4 | 5
  explanation: string
  explanationTh: string
  evidence: string
  ruleId: string
}

type Seed = {
  kind: Passage['kind']
  title: string
  body: string
  visual?: Passage['visual']
  visualTitle?: string
  visualData?: string[]
  questions: Q[]
}

const seeds: Seed[] = [
  {
    kind:'multi',
    title:'Retail Space Inquiry + Floor Plan',
    body:"EMAIL\nFrom: Maya Ortiz\nTo: Leasing Office\nSubject: Bakery location\n\nI am looking for a retail unit of at least 300 square meters for a new bakery. A small kitchen is essential, and deliveries will arrive every morning, so easy access from the service corridor would be helpful. Please let me know which currently available unit best meets these needs.",
    visual:'floor-plan',
    visualTitle:'RIVERFRONT PLAZA — AVAILABLE UNITS',
    visualData:['Unit 101|245 m²|Available · street entrance','Unit 102|320 m²|Available · service corridor nearby','Unit 104|350 m²|Occupied · Green Leaf Café','Unit 105|315 m²|Available · kitchen included','Unit 106|290 m²|Available · rear entrance'],
    questions:[
      {stem:'What is Ms. Ortiz mainly asking the leasing office to do?',choices:['Recommend a suitable retail unit.','Reduce the monthly rent.','Arrange a bakery inspection.','Contact a delivery company.'],answer:'A',skills:['purpose','multi-text'],difficulty:2,explanation:'Her e-mail lists space and facility requirements and asks which available unit best meets them.',explanationTh:'อีเมลนี้มีหน้าที่บอก requirement ของร้านแล้วขอให้สำนักงานเช่าแนะนำยูนิตที่เหมาะที่สุด จึงตอบว่าให้แนะนำพื้นที่ที่ตรงความต้องการ',evidence:'Please let me know which currently available unit best meets these needs.',ruleId:'p7.multi-text'},
      {stem:'Which unit best satisfies all of Ms. Ortiz’s stated requirements?',choices:['Unit 101','Unit 102','Unit 105','Unit 106'],answer:'C',skills:['multi-text','inference'],difficulty:3,explanation:'Unit 105 is over 300 m², is available, and is the only available unit explicitly shown as including a kitchen.',explanationTh:'ต้องรวมข้อมูลจากอีเมลกับแปลน: ต้องอย่างน้อย 300 m² + available + มี kitchen เมื่อเทียบทุกยูนิต Unit 105 ตรงครบที่สุด',evidence:'Unit 105 — 315 m² — Available · kitchen included',ruleId:'p7.multi-text'},
      {stem:'Why is Unit 104 not a possible choice for Ms. Ortiz?',choices:['It is too small.','It has no street entrance.','It is already occupied.','It is far from the service corridor.'],answer:'C',skills:['detail','paraphrase'],difficulty:2,explanation:'The floor plan identifies Unit 104 as occupied by Green Leaf Café.',explanationTh:'ในแปลนระบุ Unit 104 ว่า Occupied จึงไม่ใช่พื้นที่ที่เปิดให้เช่าอยู่ในตอนนี้',evidence:'Unit 104 — 350 m² — Occupied · Green Leaf Café',ruleId:'p7.detail'},
      {stem:'What feature is especially important to Ms. Ortiz besides size?',choices:['A kitchen','A conference room','A courtyard view','An upper floor'],answer:'A',skills:['detail'],difficulty:1,explanation:'She says that a small kitchen is essential.',explanationTh:'คำว่า essential หมายถึงจำเป็นมาก อีเมลระบุชัดว่าต้องมี small kitchen',evidence:'A small kitchen is essential.',ruleId:'p7.detail'},
    ],
  },
  {
    kind:'advertisement',
    title:'Harbor Table Weekend Specials',
    body:"Harbor Table is introducing a new weekend dining program. Guests who reserve Friday or Saturday dinner before 3:00 P.M. on the same day receive a complimentary dessert. Groups of six or more should call the restaurant directly. The dining room closes at 10:30 P.M., but the kitchen accepts final orders at 9:45 P.M.",
    visual:'menu',
    visualTitle:'WEEKEND DINNER MENU',
    visualData:['Friday|Grilled salmon set|620 THB','Saturday|Roast chicken set|540 THB','Vegetarian|Mushroom risotto|480 THB','Dessert|Lemon tart|180 THB'],
    questions:[
      {stem:'What is the purpose of the advertisement?',choices:['To announce weekend dining offers.','To recruit restaurant employees.','To explain a delivery delay.','To advertise cooking classes.'],answer:'A',skills:['purpose','main-idea'],difficulty:1,explanation:'The advertisement promotes weekend dinner specials and a reservation benefit.',explanationTh:'ใจความหลักคือโปรโมตเมนูมื้อเย็นวันศุกร์–เสาร์และสิทธิ์ของผู้จอง จึงเป็นโฆษณาข้อเสนอช่วงสุดสัปดาห์',evidence:'Harbor Table is introducing a new weekend dining program.',ruleId:'p7.purpose'},
      {stem:'How can a guest receive a complimentary dessert?',choices:['Order the salmon set.','Reserve dinner before 3:00 P.M.','Arrive after 9:45 P.M.','Bring at least six guests.'],answer:'B',skills:['detail','paraphrase'],difficulty:2,explanation:'Guests who reserve Friday or Saturday dinner before 3:00 P.M. receive a free dessert.',explanationTh:'โจทย์ paraphrase complimentary = free และเงื่อนไขคือจองมื้อเย็นก่อน 3 โมงเย็นของวันนั้น',evidence:'Guests who reserve Friday or Saturday dinner before 3:00 P.M. on the same day receive a complimentary dessert.',ruleId:'p7.paraphrase'},
      {stem:'What should a party of eight do?',choices:['Order before 9:00 P.M.','Call the restaurant directly.','Pay for dessert in advance.','Use the weekday menu.'],answer:'B',skills:['detail','inference'],difficulty:2,explanation:'Eight people is a group of six or more, and such groups are instructed to call directly.',explanationTh:'8 คนเข้าเงื่อนไข groups of six or more ดังนั้นต้องโทรหาร้านโดยตรง',evidence:'Groups of six or more should call the restaurant directly.',ruleId:'p7.inference'},
      {stem:'What is the latest time the kitchen will accept an order?',choices:['3:00 P.M.','9:15 P.M.','9:45 P.M.','10:30 P.M.'],answer:'C',skills:['detail'],difficulty:1,explanation:'The dining room closes later, but final kitchen orders are accepted at 9:45 P.M.',explanationTh:'อย่าสับสนเวลา dining room ปิด 10:30 กับเวลารับออเดอร์สุดท้าย ซึ่งระบุ 9:45 P.M.',evidence:'the kitchen accepts final orders at 9:45 P.M.',ruleId:'p7.detail'},
    ],
  },
  {
    kind:'multi',
    title:'Train Schedule + Client Visit Message',
    body:"MESSAGE\nFrom: Elena\nTo: Marcus\n\nThe client presentation should finish around 1:40 P.M. Please take the earliest train after that to Northport. A driver will meet you at Northport Station, so send me the train number once you board. You must arrive before the 4:30 factory tour.",
    visual:'schedule',
    visualTitle:'CENTRAL → NORTHPORT',
    visualData:['Train 218|1:25 P.M.|2:35 P.M.','Train 224|1:55 P.M.|3:05 P.M.','Train 230|2:20 P.M.|3:30 P.M.','Train 236|3:05 P.M.|4:15 P.M.'],
    questions:[
      {stem:'Which train should Marcus take if the presentation ends as expected?',choices:['Train 218','Train 224','Train 230','Train 236'],answer:'B',skills:['multi-text','inference'],difficulty:3,explanation:'The presentation ends at about 1:40 P.M.; the earliest train after that is Train 224 at 1:55 P.M.',explanationTh:'ต้องเทียบเวลาจบ presentation 1:40 กับตาราง รถไฟเที่ยวแรกที่ออกหลังเวลานั้นคือ Train 224 เวลา 1:55 P.M.',evidence:'Please take the earliest train after that to Northport.',ruleId:'p7.multi-text'},
      {stem:'What should Marcus do after boarding the train?',choices:['Call the factory guide.','Send Elena the train number.','Change the tour time.','Reserve a taxi.'],answer:'B',skills:['detail'],difficulty:1,explanation:'Elena asks him to send the train number once he boards.',explanationTh:'ประโยคสั่งตรง ๆ คือให้ส่งหมายเลขรถไฟหลังขึ้นรถแล้ว',evidence:'send me the train number once you board.',ruleId:'p7.detail'},
      {stem:'What can be inferred about Train 236?',choices:['It is not the intended choice for Marcus.','It requires a transfer.','It is the fastest train.','It leaves before the presentation.'],answer:'A',skills:['inference','multi-text'],difficulty:3,explanation:'Elena asks for the earliest train after 1:40 P.M.; several earlier trains are available before Train 236.',explanationTh:'Elena ขอ earliest train หลัง 1:40 และมี Train 224/230 ออกก่อน Train 236 ดังนั้น 236 ไม่ใช่เที่ยวที่ตั้งใจให้เลือก',evidence:'Please take the earliest train after that to Northport.',ruleId:'p7.inference'},
      {stem:'Who will meet Marcus at Northport Station?',choices:['Elena','A driver','The client','A tour guide'],answer:'B',skills:['detail'],difficulty:1,explanation:'The message explicitly says that a driver will meet him at the station.',explanationTh:'ตอบจากหลักฐานตรง ๆ ว่า a driver จะมารับที่สถานี',evidence:'A driver will meet you at Northport Station.',ruleId:'p7.detail'},
    ],
  },
  {
    kind:'multi',
    title:'Store Receipt + Return Policy',
    body:"RETURN POLICY\nUnused merchandise may be returned within 30 days with the original receipt. Electronics that have been opened can be exchanged only if defective. Sale items marked FINAL are not eligible for return or exchange.",
    visual:'receipt',
    visualTitle:'NORTHLINE HOME — RECEIPT',
    visualData:['Oct 4|Order 78319|Cashier 12','Desk Lamp|1 × 890 THB|890 THB','Wireless Keyboard|1 × 1,490 THB|1,490 THB','Storage Box FINAL|2 × 220 THB|440 THB','TOTAL||2,820 THB'],
    questions:[
      {stem:'Which item cannot be returned or exchanged under any condition stated?',choices:['Desk lamp','Wireless keyboard','Storage box','All items can be returned'],answer:'C',skills:['multi-text','detail'],difficulty:2,explanation:'The receipt marks the storage box FINAL, and the policy says FINAL sale items cannot be returned or exchanged.',explanationTh:'ต้องเชื่อมคำว่า FINAL ในใบเสร็จกับกฎ “Sale items marked FINAL are not eligible…” จึงเป็น Storage Box',evidence:'Sale items marked FINAL are not eligible for return or exchange.',ruleId:'p7.multi-text'},
      {stem:'If the wireless keyboard has been opened, when can it be exchanged?',choices:['Whenever the customer changes their mind.','Only if it is defective.','Only within seven days.','After paying a restocking fee.'],answer:'B',skills:['detail','paraphrase'],difficulty:2,explanation:'Opened electronics are exchangeable only when defective.',explanationTh:'keyboard เป็น electronics และถ้าเปิดแล้ว กฎระบุว่าแลกได้เฉพาะกรณี defective เท่านั้น',evidence:'Electronics that have been opened can be exchanged only if defective.',ruleId:'p7.paraphrase'},
      {stem:'What does a customer normally need in order to return an unused item?',choices:['The original receipt','A manager’s signature','The product box only','A membership card'],answer:'A',skills:['detail'],difficulty:1,explanation:'The policy requires the original receipt for standard returns.',explanationTh:'เงื่อนไขคืนสินค้าทั่วไปคือ unused + within 30 days + original receipt',evidence:'Unused merchandise may be returned within 30 days with the original receipt.',ruleId:'p7.detail'},
      {stem:'How much was paid for the two storage boxes?',choices:['220 THB','440 THB','890 THB','1,490 THB'],answer:'B',skills:['multi-text','detail'],difficulty:1,explanation:'The receipt shows two storage boxes at 220 THB each, totaling 440 THB.',explanationTh:'อ่านตารางใบเสร็จ: 2 × 220 THB = 440 THB',evidence:'Storage Box FINAL — 2 × 220 THB — 440 THB',ruleId:'p7.multi-text'},
    ],
  },
  {
    kind:'article',
    title:'Employee Shuttle Survey',
    body:"Westbridge Systems surveyed 240 employees before revising its commuter program. Human Resources said the company will first address the issues that affect the largest share of respondents. A pilot schedule will be announced next month, and another survey will be conducted after the pilot has operated for six weeks.",
    visual:'chart',
    visualTitle:'TOP COMMUTER CONCERNS',
    visualData:['Late evening service|62','Crowded buses|48','Few pickup points|35','Morning frequency|29'],
    questions:[
      {stem:'Which issue will the company most likely address first?',choices:['Morning frequency','Few pickup points','Crowded buses','Late evening service'],answer:'D',skills:['inference','detail'],difficulty:2,explanation:'HR will prioritize the issue affecting the largest share of respondents; late evening service is highest at 62%.',explanationTh:'บทความบอกว่าจะจัดการปัญหาที่กระทบคนมากที่สุดก่อน และกราฟแสดง Late evening service สูงสุด 62%',evidence:'the company will first address the issues that affect the largest share of respondents.',ruleId:'p7.inference'},
      {stem:'How many employees were surveyed?',choices:['62','240','290','480'],answer:'B',skills:['detail'],difficulty:1,explanation:'The article states that 240 employees took part in the survey.',explanationTh:'ตัวเลข 240 เป็นจำนวนพนักงานที่สำรวจ ไม่ใช่เปอร์เซ็นต์ในกราฟ',evidence:'Westbridge Systems surveyed 240 employees',ruleId:'p7.detail'},
      {stem:'When will another survey be conducted?',choices:['Before the pilot starts','After six weeks of the pilot','At the end of the year','Immediately next month'],answer:'B',skills:['detail','paraphrase'],difficulty:2,explanation:'The follow-up survey will occur after the pilot has operated for six weeks.',explanationTh:'follow-up survey จะทำหลัง pilot ดำเนินมาแล้ว 6 สัปดาห์',evidence:'another survey will be conducted after the pilot has operated for six weeks.',ruleId:'p7.paraphrase'},
      {stem:'What is NOT listed as a commuter concern?',choices:['Crowded buses','Parking fees','Few pickup points','Morning frequency'],answer:'B',skills:['detail'],difficulty:2,explanation:'Parking fees do not appear in the chart.',explanationTh:'คำถาม NOT ต้องตรวจตัวเลือกทีละข้อ กราฟมี crowded buses, pickup points และ morning frequency แต่ไม่มี parking fees',evidence:'TOP COMMUTER CONCERNS',ruleId:'p7.detail'},
    ],
  },
  {
    kind:'advertisement',
    title:'Design Forward Conference',
    body:"Design Forward 2026 brings product designers, researchers, and developers together for one day of practical sessions. Online registration closes November 12. Attendees who register by November 5 receive a digital workbook before the event. Seating for the afternoon usability lab is limited and requires a separate reservation.",
    visual:'poster',
    visualTitle:'DESIGN FORWARD 2026',
    visualData:['NOV 18|Riverside Convention Center|Bangkok','9:00|Opening keynote|Main Hall','11:00|Design Systems Workshop|Room B','14:00|Usability Lab|Studio 3','17:00|Networking Session|Sky Lounge'],
    questions:[
      {stem:'What must an attendee do to join the usability lab?',choices:['Register by November 5.','Make a separate reservation.','Bring a printed workbook.','Attend the keynote first.'],answer:'B',skills:['detail','paraphrase'],difficulty:2,explanation:'The lab has limited seating and requires a separate reservation.',explanationTh:'แม้ลงทะเบียนงานแล้ว แต่ usability lab ต้องจองแยกต่างหาก',evidence:'the afternoon usability lab is limited and requires a separate reservation.',ruleId:'p7.paraphrase'},
      {stem:'What benefit is offered to people who register by November 5?',choices:['A lower ticket price','A digital workbook','Free transportation','Reserved keynote seating'],answer:'B',skills:['detail'],difficulty:1,explanation:'Early registrants receive a digital workbook before the event.',explanationTh:'สิทธิ์ของคนที่สมัครภายในวันที่ 5 พ.ย. คือได้รับ digital workbook ก่อนวันงาน',evidence:'Attendees who register by November 5 receive a digital workbook before the event.',ruleId:'p7.detail'},
      {stem:'Where will the networking session be held?',choices:['Main Hall','Room B','Studio 3','Sky Lounge'],answer:'D',skills:['multi-text','detail'],difficulty:1,explanation:'The event poster lists the networking session at the Sky Lounge.',explanationTh:'ดูจากตารางบนโปสเตอร์ บรรทัด 17:00 Networking Session อยู่ที่ Sky Lounge',evidence:'17:00 — Networking Session — Sky Lounge',ruleId:'p7.multi-text'},
      {stem:'What is the main purpose of the document?',choices:['To advertise a professional conference.','To announce a company merger.','To hire usability researchers.','To request design proposals.'],answer:'A',skills:['purpose','main-idea'],difficulty:1,explanation:'The document promotes a one-day professional design conference and provides registration details.',explanationTh:'เอกสารทั้งชิ้นให้ข้อมูลกิจกรรม ตาราง และการสมัคร จึงมีจุดประสงค์เพื่อประชาสัมพันธ์งาน conference',evidence:'Design Forward 2026 brings product designers, researchers, and developers together',ruleId:'p7.purpose'},
    ],
  },
  {
    kind:'multi',
    title:'Courier Route + Delivery Note',
    body:"DELIVERY NOTE\nThe medical samples must reach Delta Laboratory no later than 2:30 P.M. After that delivery, return the signed receipt to Central Clinic. Do not stop at the warehouse unless the dispatcher sends a new message.",
    visual:'route',
    visualTitle:'DRIVER ROUTE — TUESDAY',
    visualData:['Central Clinic|12:40 P.M.','North Pharmacy|1:15 P.M.','Delta Laboratory|2:05 P.M.','Central Clinic|2:45 P.M.'],
    questions:[
      {stem:'Where should the driver go immediately after Delta Laboratory?',choices:['North Pharmacy','The warehouse','Central Clinic','The dispatcher’s office'],answer:'C',skills:['multi-text','detail'],difficulty:2,explanation:'The note says to return the signed receipt to Central Clinic after the laboratory delivery, and the route confirms Central Clinic as the next stop.',explanationTh:'ต้องใช้ทั้ง note และ route: หลัง Delta Laboratory ให้กลับ Central Clinic และเส้นทางก็แสดงจุดถัดไปเป็น Central Clinic',evidence:'After that delivery, return the signed receipt to Central Clinic.',ruleId:'p7.multi-text'},
      {stem:'What is the deadline for the medical samples?',choices:['1:15 P.M.','2:05 P.M.','2:30 P.M.','2:45 P.M.'],answer:'C',skills:['detail'],difficulty:1,explanation:'The samples must reach Delta Laboratory no later than 2:30 P.M.',explanationTh:'no later than = ไม่เกินเวลา ดังนั้น deadline คือ 2:30 P.M.',evidence:'must reach Delta Laboratory no later than 2:30 P.M.',ruleId:'p7.detail'},
      {stem:'What is suggested by the route schedule?',choices:['The driver is expected to meet the deadline.','The warehouse visit is required.','North Pharmacy closes at 1:15 P.M.','The driver starts at Delta Laboratory.'],answer:'A',skills:['inference','multi-text'],difficulty:3,explanation:'The route reaches Delta Laboratory at 2:05 P.M., 25 minutes before the 2:30 P.M. deadline.',explanationTh:'เส้นทางกำหนดถึง Delta 2:05 ซึ่งก่อน deadline 2:30 อยู่ 25 นาที จึงคาดว่าจะส่งทัน',evidence:'Delta Laboratory — 2:05 P.M.',ruleId:'p7.inference'},
      {stem:'Under what condition should the driver stop at the warehouse?',choices:['After North Pharmacy','If the dispatcher sends a new message','Whenever the samples are late','Before returning to Central Clinic'],answer:'B',skills:['detail','paraphrase'],difficulty:2,explanation:'The note says not to stop there unless the dispatcher sends a new message.',explanationTh:'unless = เว้นแต่ ดังนั้นจะไป warehouse ก็ต่อเมื่อ dispatcher ส่งข้อความใหม่',evidence:'Do not stop at the warehouse unless the dispatcher sends a new message.',ruleId:'p7.paraphrase'},
    ],
  },
  {
    kind:'multi',
    title:'Job Posting + Applicant E-mail + Interview Schedule',
    body:"JOB POSTING\nOperations Analyst — Meridian Foods\nRequirements: bachelor’s degree, at least two years of data-analysis experience, and advanced spreadsheet skills. Experience with inventory systems is preferred but not required.\n\nAPPLICANT E-MAIL\nFrom: Rina Shah\nI have three years of reporting and data-analysis experience and currently maintain inventory dashboards for a regional retailer. I am available for an interview after 1:00 P.M. on Thursday.",
    visual:'schedule',
    visualTitle:'THURSDAY INTERVIEW SLOTS',
    visualData:['12:30 P.M.|Carlos Mendes|Reserved','1:30 P.M.|Open|Available','2:30 P.M.|Lena Wu|Reserved','3:30 P.M.|Open|Available'],
    questions:[
      {stem:'Which preferred qualification does Ms. Shah appear to have?',choices:['Experience with inventory systems','A graduate degree','Food-production experience','Supervisory certification'],answer:'A',skills:['multi-text','inference'],difficulty:3,explanation:'The posting prefers inventory-system experience, and Ms. Shah says she maintains inventory dashboards.',explanationTh:'ต้องจับ paraphrase: inventory systems ในประกาศเชื่อมกับ inventory dashboards ในอีเมล จึงเป็นคุณสมบัติ preferred ที่เธอน่าจะมี',evidence:'I currently maintain inventory dashboards for a regional retailer.',ruleId:'p7.multi-text'},
      {stem:'Which interview time could Ms. Shah accept based on her e-mail?',choices:['12:30 P.M.','1:30 P.M.','2:30 P.M.','None of the available times'],answer:'B',skills:['multi-text','detail'],difficulty:2,explanation:'She is available after 1:00 P.M., and 1:30 P.M. is the first available slot.',explanationTh:'เธอว่างหลัง 1:00 P.M. และตารางมีช่องว่าง 1:30 กับ 3:30 โดยคำตอบแรกที่ตรงคือ 1:30',evidence:'I am available for an interview after 1:00 P.M. on Thursday.',ruleId:'p7.multi-text'},
      {stem:'How much data-analysis experience does the position require?',choices:['One year','Two years','Three years','Five years'],answer:'B',skills:['detail'],difficulty:1,explanation:'The posting requires at least two years of data-analysis experience.',explanationTh:'requirement ระบุ at least two years = อย่างน้อย 2 ปี',evidence:'at least two years of data-analysis experience',ruleId:'p7.detail'},
      {stem:'What can be inferred about Ms. Shah?',choices:['She meets the minimum experience requirement.','She cannot use spreadsheets.','She is available only in the morning.','She previously worked for Meridian Foods.'],answer:'A',skills:['inference','multi-text'],difficulty:2,explanation:'She reports three years of data-analysis experience, exceeding the two-year minimum.',explanationTh:'ประกาศต้องการอย่างน้อย 2 ปี แต่เธอมี 3 ปี จึงสรุปได้ว่าเธอผ่าน minimum experience',evidence:'I have three years of reporting and data-analysis experience',ruleId:'p7.inference'},
    ],
  },
  {
    kind:'multi',
    title:'Hotel Booking + Airport Shuttle',
    body:"BOOKING CONFIRMATION\nGuest: Oliver Chen\nCheck-in: May 12 after 3:00 P.M.\nCheck-out: May 15 before 11:00 A.M.\nRoom: Executive Queen\nBreakfast: Included\n\nSHUTTLE NOTE\nAirport pickups must be reserved at least 24 hours in advance. The shuttle leaves Terminal 1 every hour on the half hour and Terminal 2 every hour on the hour. Travel time to the hotel is approximately 35 minutes.",
    visual:'schedule',
    visualTitle:'AIRPORT SHUTTLE — AFTERNOON',
    visualData:['Terminal 1|2:30 P.M.|3:30 P.M. next','Terminal 2|3:00 P.M.|4:00 P.M. next','Terminal 1|3:30 P.M.|4:30 P.M. next','Terminal 2|4:00 P.M.|5:00 P.M. next'],
    questions:[
      {stem:'What meal is included in Mr. Chen’s booking?',choices:['Breakfast','Lunch','Dinner','No meals'],answer:'A',skills:['detail'],difficulty:1,explanation:'The booking confirmation states that breakfast is included.',explanationTh:'ตอบจาก Booking Confirmation โดยตรง: Breakfast: Included',evidence:'Breakfast: Included',ruleId:'p7.detail'},
      {stem:'If Mr. Chen reaches Terminal 2 at 3:10 P.M., what is the next listed shuttle he can take?',choices:['3:00 P.M.','3:30 P.M.','4:00 P.M.','4:30 P.M.'],answer:'C',skills:['multi-text','inference'],difficulty:3,explanation:'Terminal 2 shuttles leave on the hour; after 3:10 P.M., the next one is at 4:00 P.M.',explanationTh:'Terminal 2 ออกทุกต้นชั่วโมง เมื่อมาถึง 3:10 เที่ยว 3:00 ผ่านไปแล้ว เที่ยวถัดไปคือ 4:00',evidence:'Terminal 2 every hour on the hour.',ruleId:'p7.multi-text'},
      {stem:'What must Mr. Chen do to use the airport pickup service?',choices:['Reserve it at least a day in advance.','Pay for breakfast.','Check in before 3:00 P.M.','Stay at least four nights.'],answer:'A',skills:['detail','paraphrase'],difficulty:2,explanation:'Airport pickups require a reservation at least 24 hours before the trip.',explanationTh:'24 hours in advance = ล่วงหน้าอย่างน้อย 1 วัน',evidence:'Airport pickups must be reserved at least 24 hours in advance.',ruleId:'p7.paraphrase'},
      {stem:'Approximately how long does the shuttle trip take?',choices:['24 minutes','30 minutes','35 minutes','60 minutes'],answer:'C',skills:['detail'],difficulty:1,explanation:'The note gives an approximate travel time of 35 minutes.',explanationTh:'คำว่า approximately บอกเวลาโดยประมาณ 35 นาที',evidence:'Travel time to the hotel is approximately 35 minutes.',ruleId:'p7.detail'},
    ],
  },
  {
    kind:'notice',
    title:'Shared Equipment Booking Rules',
    body:"LAB EQUIPMENT NOTICE\nBeginning Monday, all shared devices must be reserved through the online calendar. Reservations may be made up to seven days in advance. If a user is more than 15 minutes late, the booking may be released to another employee. Equipment marked TRAINING REQUIRED may be used only by staff who have completed the safety module.",
    visual:'table',
    visualTitle:'TODAY — DEVICE STATUS',
    visualData:['3D Scanner|Available 1:00–3:00|Training required','Thermal Camera|Reserved until 2:30|No training flag','Laser Cutter|Maintenance|Training required','Color Meter|Available all afternoon|No training flag'],
    questions:[
      {stem:'How far in advance may employees reserve equipment?',choices:['15 minutes','One day','Seven days','One month'],answer:'C',skills:['detail'],difficulty:1,explanation:'The notice permits reservations up to seven days in advance.',explanationTh:'up to seven days in advance = จองล่วงหน้าได้สูงสุด 7 วัน',evidence:'Reservations may be made up to seven days in advance.',ruleId:'p7.detail'},
      {stem:'Which device could an employee use all afternoon without a training requirement?',choices:['3D Scanner','Thermal Camera','Laser Cutter','Color Meter'],answer:'D',skills:['multi-text','detail'],difficulty:2,explanation:'The Color Meter is available all afternoon and has no training flag.',explanationTh:'ต้องเช็กสองเงื่อนไขพร้อมกัน: available all afternoon + no training flag มีเพียง Color Meter',evidence:'Color Meter — Available all afternoon — No training flag',ruleId:'p7.multi-text'},
      {stem:'What may happen if an employee is more than 15 minutes late?',choices:['The reservation may be given to someone else.','The account will be closed.','Training must be repeated.','A maintenance fee will be charged.'],answer:'A',skills:['detail','paraphrase'],difficulty:2,explanation:'A late booking may be released to another employee.',explanationTh:'released to another employee คือสิทธิ์จองอาจถูกปล่อยให้คนอื่นใช้',evidence:'the booking may be released to another employee.',ruleId:'p7.paraphrase'},
      {stem:'Which statement is NOT mentioned in the notice?',choices:['Reservations use an online calendar.','Some devices require training.','Late users may lose their booking.','Employees must pay a reservation fee.'],answer:'D',skills:['detail'],difficulty:2,explanation:'The notice never mentions any reservation fee.',explanationTh:'คำถาม NOT ให้ตรวจทีละข้อ: online calendar, training และ late booking มีในข้อความ แต่ไม่มีเรื่องค่าธรรมเนียม',evidence:'LAB EQUIPMENT NOTICE',ruleId:'p7.detail'},
    ],
  },
]

export const extraPart7V5: Question[] = []
export const extraPassagesV5: Passage[] = []

seeds.forEach((seed, passageIndex) => {
  const passageId = 'p7-v5-' + String(passageIndex + 1).padStart(2, '0')
  const ids = seed.questions.map((_, qIndex) => passageId + '-q' + (qIndex + 1))
  extraPassagesV5.push({
    id:passageId,
    part:7,
    kind:seed.kind,
    title:seed.title,
    body:seed.body,
    questions:ids,
    sourceLabel:'Original TOEIC-style practice based on Chapter 28 document formats',
    visual:seed.visual,
    visualTitle:seed.visualTitle,
    visualData:seed.visualData,
  })
  seed.questions.forEach((q, qIndex) => {
    extraPart7V5.push({
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
      chapterIds:[28],
      targetSeconds:seed.kind === 'multi' ? 95 : q.difficulty >= 3 ? 85 : 70,
    })
  })
})
