import type { Passage, Question, SkillId } from './types'

const c = (a:string,b:string,c:string,d:string) => [
  {id:'A',text:a},{id:'B',text:b},{id:'C',text:c},{id:'D',text:d},
]

type SeedQuestion = {
  choices:[string,string,string,string]
  answer:string
  skills:SkillId[]
  difficulty:1|2|3|4|5
  explanation:string
  explanationTh:string
  translationTh?:string
  choiceTranslationsTh?:Record<string,string>
  whyOthers?:Record<string,string>
  ruleId:string
  chapterIds:number[]
}
type Seed = { kind:Passage['kind']; title:string; body:string; questions:SeedQuestion[] }

const seeds:Seed[] = [
  {
    kind:'email',
    title:'Member Card Update',
    body:"To: Harbor Museum Members\nFrom: Membership Office\nSubject: Digital Member Cards\n\nBeginning in January, members who renew online will receive a digital membership card. The card can be stored in a mobile wallet and used [1] _____ at the museum entrance.\n\nMembers who prefer a physical card may [2] _____ one at the information desk. Printed cards will not be mailed automatically. [3] _____, members who need a replacement card can still request one by post for a small fee.\n\n[4] _____",
    questions:[
      {choices:['convenient','conveniently','convenience','conveniences'],answer:'B',skills:['part-of-speech'],difficulty:2,explanation:'The blank modifies the verb “used,” so an adverb is required.',explanationTh:'ช่องว่างขยายกริยา used ว่า “ใช้งานได้อย่างไร” จึงต้องเป็น adverb: conveniently',translationTh:'บัตรสามารถเก็บไว้ในกระเป๋าเงินดิจิทัลและใช้ที่ทางเข้าพิพิธภัณฑ์ได้อย่างสะดวก',choiceTranslationsTh:{A:'สะดวก (Adj.)',B:'อย่างสะดวก (Adv.)',C:'ความสะดวก (N.)',D:'สิ่งอำนวยความสะดวกหลายอย่าง (N. plural)'},ruleId:'p6.word-form',chapterIds:[5,6,27]},
      {choices:['request','require','restore','recruit'],answer:'A',skills:['vocabulary','collocation'],difficulty:3,explanation:'“Request a card” means ask to receive one. The other verbs do not fit the object naturally.',explanationTh:'หลัง may ต้องเป็น V1 และทุกตัวเลือกเป็น verb จึงต้องดูความหมาย: request a card = ขอรับบัตร',translationTh:'สมาชิกที่ต้องการบัตรจริงสามารถขอรับบัตรหนึ่งใบได้ที่โต๊ะข้อมูล',choiceTranslationsTh:{A:'ขอ/ร้องขอ',B:'ต้องการ/กำหนดให้ต้องมี',C:'ฟื้นฟู/กู้คืน',D:'รับสมัคร'},whyOthers:{B:'Require means need, not ask to receive a card.',C:'Restore means return something to an earlier condition.',D:'Recruit means find people to join an organization.'},ruleId:'p6.fixed-phrase',chapterIds:[21,27]},
      {choices:['However','For example','Therefore','Otherwise'],answer:'A',skills:['context','conjunction'],difficulty:3,explanation:'The previous sentence says cards will not be mailed automatically, but the next sentence gives an exception, so “However” fits.',explanationTh:'ประโยคก่อนบอกว่าจะไม่ส่งบัตรอัตโนมัติ แต่ประโยคถัดไปบอกข้อยกเว้น จึงต้องใช้ However = อย่างไรก็ตาม',translationTh:'อย่างไรก็ตาม สมาชิกที่ต้องการบัตรทดแทนยังสามารถขอให้ส่งทางไปรษณีย์ได้โดยมีค่าธรรมเนียมเล็กน้อย',choiceTranslationsTh:{A:'อย่างไรก็ตาม',B:'ตัวอย่างเช่น',C:'ดังนั้น',D:'มิฉะนั้น'},ruleId:'p6.connector-context',chapterIds:[17,27]},
      {choices:['The digital card will display the same benefits as the current plastic card.','The museum café will introduce a new lunch menu in February.','Several paintings are being moved to another gallery this week.','Visitors may borrow umbrellas from the security desk.'],answer:'A',skills:['sentence-placement','context'],difficulty:4,explanation:'Only the first sentence continues the topic of digital membership cards and reassures members that benefits remain unchanged.',explanationTh:'ต้องเติมทั้งประโยคที่ต่อหัวข้อ “digital membership card” โดยตรง ตัวเลือก A เชื่อมเรื่องบัตรและสิทธิประโยชน์ ส่วนข้ออื่นเปลี่ยนหัวข้อ',ruleId:'p6.sentence-placement',chapterIds:[27]},
    ],
  },
  {
    kind:'advertisement',
    title:'Weekend Writing Workshop',
    body:"RIVER HOUSE ARTS CENTER\nTravel Writing: Turning Notes into Stories\nSaturday, March 14 · 9:30 A.M.–4:00 P.M.\n\nThis one-day workshop is intended for writers who want to make their travel pieces more [1] _____. Participants will examine published examples and practice selecting details that create a strong sense of place.\n\nPlease bring a short draft or a page of notes from a recent trip. The instructor will [2] _____ individual feedback during the afternoon session.\n\nLunch is not included; [3] _____, several cafés are located within a five-minute walk of the center.\n\n[4] _____",
    questions:[
      {choices:['engage','engaging','engaged','engagement'],answer:'B',skills:['part-of-speech'],difficulty:3,explanation:'After “make + object + adjective,” the adjective “engaging” describes the travel pieces.',explanationTh:'โครงสร้าง make + object + adjective: make their travel pieces more engaging จึงต้องเป็น Adj.',translationTh:'เวิร์กช็อปนี้เหมาะสำหรับนักเขียนที่ต้องการทำให้งานเขียนท่องเที่ยวของตนน่าสนใจยิ่งขึ้น',choiceTranslationsTh:{A:'ดึงดูด (V.)',B:'น่าสนใจ/ชวนติดตาม (Adj.)',C:'มีส่วนร่วม/ถูกทำให้สนใจ (Adj.)',D:'การมีส่วนร่วม (N.)'},ruleId:'p6.word-form',chapterIds:[3,6,27]},
      {choices:['provide','supply','present','serve'],answer:'A',skills:['vocabulary','collocation'],difficulty:3,explanation:'“Provide feedback” is the natural collocation for giving comments or advice.',explanationTh:'ทุกตัวเลือกเป็น verb แต่ collocation ที่ใช้จริงคือ provide feedback = ให้ข้อเสนอแนะ',translationTh:'ผู้สอนจะให้ข้อเสนอแนะรายบุคคลในช่วงบ่าย',choiceTranslationsTh:{A:'ให้/จัดให้',B:'จัดหา/ส่งของให้',C:'นำเสนอ',D:'ให้บริการ/เสิร์ฟ'},ruleId:'p6.fixed-phrase',chapterIds:[21,27]},
      {choices:['however','therefore','likewise','instead'],answer:'A',skills:['context','conjunction'],difficulty:3,explanation:'Lunch is not provided, but nearby cafés offer an alternative; “however” expresses this contrast.',explanationTh:'ไม่ได้รวมอาหารกลางวัน แต่มีร้านกาแฟใกล้ ๆ เป็นทางเลือก จึงเป็นความขัดแย้ง ใช้ however',translationTh:'ไม่รวมอาหารกลางวัน อย่างไรก็ตาม มีร้านกาแฟหลายแห่งอยู่ห่างจากศูนย์ไม่เกินห้านาที',choiceTranslationsTh:{A:'อย่างไรก็ตาม',B:'ดังนั้น',C:'เช่นเดียวกัน',D:'แทนที่จะเป็นเช่นนั้น'},ruleId:'p6.connector-context',chapterIds:[17,27]},
      {choices:['Enrollment is limited to fourteen participants.','The center’s gallery is closed on Mondays.','A local train station was renovated last year.','The instructor recently bought a new camera.'],answer:'A',skills:['sentence-placement','context'],difficulty:4,explanation:'A workshop advertisement naturally ends with a practical registration limitation; the other sentences are unrelated.',explanationTh:'ตอนท้ายโฆษณาคอร์สควรต่อด้วยข้อมูลการสมัคร ข้อ A บอกจำนวนที่รับซึ่งเชื่อมกับผู้สมัครโดยตรง',ruleId:'p6.sentence-placement',chapterIds:[27]},
    ],
  },
  {
    kind:'email',
    title:'Conference Dietary Requests',
    body:"To: Registered Speakers\nFrom: Greenfield Research Forum\nSubject: Friday Reception\n\nThank you for confirming your attendance at Friday evening’s reception. The catering team can [1] _____ most dietary requests if we receive them by Tuesday.\n\nPlease reply with any food allergies or restrictions. Requests submitted after Tuesday may be more difficult to [2] _____.\n\n[3] _____, a list of ingredients for each buffet item will be available at the reception desk.\n\n[4] _____",
    questions:[
      {choices:['accommodate','accumulate','accompany','accomplish'],answer:'A',skills:['vocabulary','collocation'],difficulty:4,explanation:'“Accommodate a request” means make arrangements to meet it.',explanationTh:'คำที่ใช้คู่กับ request คือ accommodate a request = จัดการ/ปรับให้รองรับคำขอ',translationTh:'ทีมจัดเลี้ยงสามารถรองรับข้อกำหนดด้านอาหารส่วนใหญ่ได้ หากเราได้รับแจ้งภายในวันอังคาร',choiceTranslationsTh:{A:'รองรับ/จัดให้ตามคำขอ',B:'สะสม',C:'ไปด้วย/ประกอบ',D:'ทำให้สำเร็จ'},ruleId:'p6.fixed-phrase',chapterIds:[21,27]},
      {choices:['fulfill','conclude','occupy','deliver'],answer:'A',skills:['vocabulary'],difficulty:4,explanation:'“Fulfill a request” means satisfy or carry it out.',explanationTh:'fulfill a request = ทำตาม/ตอบสนองคำขอ เป็น collocation ที่ตรงบริบท',translationTh:'คำขอที่ส่งหลังวันอังคารอาจทำตามได้ยากขึ้น',choiceTranslationsTh:{A:'ตอบสนอง/ทำตาม',B:'สรุป/ยุติ',C:'ครอบครอง/ใช้พื้นที่',D:'ส่งมอบ'},ruleId:'p6.fixed-phrase',chapterIds:[21,27]},
      {choices:['In addition','Nevertheless','As a result','Otherwise'],answer:'A',skills:['context','conjunction'],difficulty:3,explanation:'The ingredient list is additional helpful information, so “In addition” fits.',explanationTh:'ประโยคนี้เพิ่มข้อมูลช่วยเหลืออีกอย่าง ไม่ได้ขัดแย้งหรือเป็นผลลัพธ์ จึงใช้ In addition',translationTh:'นอกจากนี้ จะมีรายการส่วนผสมของอาหารบุฟเฟต์แต่ละรายการที่โต๊ะต้อนรับ',choiceTranslationsTh:{A:'นอกจากนี้',B:'อย่างไรก็ตาม/ถึงกระนั้น',C:'ผลก็คือ',D:'มิฉะนั้น'},ruleId:'p6.connector-context',chapterIds:[17,27]},
      {choices:['We appreciate your help in making the reception comfortable for everyone.','The keynote speaker published a book five years ago.','The forum website uses a blue and white logo.','Parking permits are printed by a separate department.'],answer:'A',skills:['sentence-placement','context'],difficulty:3,explanation:'The first sentence appropriately closes a message about dietary needs and attendee comfort.',explanationTh:'อีเมลพูดเรื่องจัดอาหารให้เหมาะกับทุกคน ข้อ A จึงเป็นประโยคปิดที่ต่อใจความได้ทั้งหัวข้อและน้ำเสียง',ruleId:'p6.sentence-placement',chapterIds:[27]},
    ],
  },
  {
    kind:'article',
    title:'Hotel Rooftop Garden',
    body:"The Brighton Hotel has opened a rooftop garden that supplies herbs to its two restaurants. The project began last spring as part of a broader sustainability [1] _____.\n\nKitchen staff worked with a local gardening group to select plants that could tolerate strong sun and wind. [2] _____, the garden now produces basil, mint, rosemary, and several varieties of lettuce.\n\nThe hotel expects the garden to reduce the distance some ingredients travel before reaching the kitchen. It will also be used for short educational tours for guests.\n\n[3] _____\n\nThe hotel plans to [4] _____ the program next year if the first season is successful.",
    questions:[
      {choices:['initiative','permission','estimate','occupation'],answer:'A',skills:['vocabulary'],difficulty:4,explanation:'A sustainability “initiative” is a planned effort or program to improve environmental practices.',explanationTh:'sustainability initiative เป็นวลีที่ใช้กับ “โครงการ/ความริเริ่มด้านความยั่งยืน”',translationTh:'โครงการนี้เริ่มเมื่อฤดูใบไม้ผลิที่แล้ว โดยเป็นส่วนหนึ่งของความริเริ่มด้านความยั่งยืนที่กว้างขึ้น',choiceTranslationsTh:{A:'โครงการ/ความริเริ่ม',B:'การอนุญาต',C:'การประมาณการ',D:'อาชีพ/การครอบครอง'},ruleId:'p6.fixed-phrase',chapterIds:[21,27]},
      {choices:['As a result','In contrast','Even so','For instance'],answer:'A',skills:['context','conjunction'],difficulty:3,explanation:'The successful plant selection led to the current harvest, so “As a result” shows cause and effect.',explanationTh:'การเลือกพืชให้เหมาะกับสภาพนำไปสู่ผลผลิตในปัจจุบัน จึงใช้ As a result = ผลก็คือ',translationTh:'ผลก็คือ ปัจจุบันสวนปลูกโหระพา สะระแหน่ โรสแมรี่ และผักกาดหลายชนิด',choiceTranslationsTh:{A:'ผลก็คือ',B:'ในทางตรงกันข้าม',C:'ถึงกระนั้น',D:'ตัวอย่างเช่น'},ruleId:'p6.connector-context',chapterIds:[17,27]},
      {choices:['Guests can sign up for the tours at the concierge desk.','The hotel replaced the lobby carpet in January.','Several restaurants in the city close on Tuesdays.','The gardening group sells tools online.'],answer:'A',skills:['sentence-placement','context'],difficulty:4,explanation:'The previous sentence introduces educational tours, and the first choice explains how guests can join them.',explanationTh:'ประโยคก่อนหน้าพูดถึง tour แล้ว ดังนั้นประโยคที่หายไปควรต่อวิธีเข้าร่วม tour โดยตรง',ruleId:'p6.sentence-placement',chapterIds:[27]},
      {choices:['expand','extend','enlarge','spread'],answer:'A',skills:['vocabulary','collocation'],difficulty:4,explanation:'“Expand a program” means increase its scope or size and is the natural business collocation.',explanationTh:'expand a program = ขยายขอบเขตโครงการ เป็น collocation ที่ตรงที่สุด',translationTh:'โรงแรมวางแผนจะขยายโครงการในปีหน้าหากฤดูกาลแรกประสบความสำเร็จ',choiceTranslationsTh:{A:'ขยายโครงการ/ขอบเขต',B:'ยืดเวลา/ต่อความยาว',C:'ทำให้วัตถุใหญ่ขึ้น',D:'กระจาย'},ruleId:'p6.fixed-phrase',chapterIds:[21,27]},
    ],
  },
  {
    kind:'notice',
    title:'Author Talk Seating',
    body:"CITY CENTRAL LIBRARY\nAUTHOR TALK — MAY 8\n\nAdmission to the evening talk is free, but seating is [1] _____. Doors will open at 6:15 P.M., forty-five minutes before the program begins.\n\nSeats will be offered on a first-come, first-served [2] _____. Visitors who require accessible seating should contact the library by May 5.\n\n[3] _____\n\nBecause the event is expected to be popular, guests are [4] _____ to arrive early.",
    questions:[
      {choices:['limited','limiting','limit','limitation'],answer:'A',skills:['part-of-speech'],difficulty:2,explanation:'After the linking verb “is,” the adjective “limited” describes seating availability.',explanationTh:'หลัง is ต้องการคำที่บอกสภาพของ seating จึงใช้ Adj. limited = มีจำนวนจำกัด',translationTh:'เข้าร่วมงานช่วงเย็นได้ฟรี แต่ที่นั่งมีจำนวนจำกัด',choiceTranslationsTh:{A:'มีจำนวนจำกัด (Adj.)',B:'กำลังจำกัด (V-ing)',C:'จำกัด (V./N.)',D:'ข้อจำกัด (N.)'},ruleId:'p6.word-form',chapterIds:[3,27]},
      {choices:['basis','base','foundation','ground'],answer:'A',skills:['collocation','vocabulary'],difficulty:3,explanation:'“On a first-come, first-served basis” is the fixed expression.',explanationTh:'เป็นวลีตายตัว on a first-come, first-served basis = ตามลำดับก่อนหลัง',translationTh:'ที่นั่งจะจัดให้ตามลำดับผู้ที่มาก่อน',choiceTranslationsTh:{A:'หลักเกณฑ์/รูปแบบ (ในวลี on a ... basis)',B:'ฐาน',C:'รากฐาน',D:'พื้น/เหตุผล'},ruleId:'p6.fixed-phrase',chapterIds:[21,27]},
      {choices:['A recording of the talk will be posted online the following week.','The library purchased new shelves for the second floor.','The author’s train arrives at noon on Thursday.','Children’s books can be returned at any branch.'],answer:'A',skills:['sentence-placement','context'],difficulty:4,explanation:'The recording information is relevant to people who may not obtain a seat and follows the event-access details naturally.',explanationTh:'เนื้อหาก่อนหน้าพูดเรื่องที่นั่งจำกัด ประโยค A จึงให้ทางเลือกสำหรับผู้ที่อาจไม่ได้เข้าร่วมและยังคงอยู่ในหัวข้องาน',ruleId:'p6.sentence-placement',chapterIds:[27]},
      {choices:['encouraged','encouraging','encouragement','encourage'],answer:'A',skills:['passive','part-of-speech'],difficulty:3,explanation:'“Guests are encouraged to arrive early” is a passive structure: be + V3 + to-infinitive.',explanationTh:'เห็น are หน้า blank และตามด้วย to arrive → โครงสร้าง passive “are encouraged to + V1”',translationTh:'เนื่องจากคาดว่างานจะมีผู้สนใจมาก ผู้เข้าร่วมจึงได้รับการแนะนำให้มาถึงก่อนเวลา',choiceTranslationsTh:{A:'ได้รับการแนะนำ/ส่งเสริม (V3)',B:'ที่ชวนให้เกิดกำลังใจ (Adj./V-ing)',C:'การให้กำลังใจ (N.)',D:'แนะนำ/ส่งเสริม (V1)'},ruleId:'p6.passive-tense',chapterIds:[4,27]},
    ],
  },
  {
    kind:'article',
    title:'City Bicycle Trial',
    body:"The city transportation office has started a three-month trial of shared electric bicycles near two commuter rail stations. Riders can unlock a bicycle through a mobile app and return it to any station within the trial area.\n\nThe program is intended to make the final part of a commute more [1] _____ for people who live or work beyond walking distance of a station.\n\nUsage data will be reviewed weekly. [2] _____, officials will survey riders about cost, availability, and ease of use.\n\n[3] _____\n\nIf demand remains strong, the city may [4] _____ the service to four additional stations next year.",
    questions:[
      {choices:['convenient','conveniently','convenience','convene'],answer:'A',skills:['part-of-speech'],difficulty:3,explanation:'After “make + object + adjective,” “convenient” describes the final part of the commute.',explanationTh:'โครงสร้าง make + object + adjective → more convenient ต้องเป็น Adj.',translationTh:'โครงการมีเป้าหมายทำให้ช่วงสุดท้ายของการเดินทางสะดวกขึ้นสำหรับผู้ที่อยู่ไกลจากสถานีเกินกว่าจะเดินได้',choiceTranslationsTh:{A:'สะดวก (Adj.)',B:'อย่างสะดวก (Adv.)',C:'ความสะดวก (N.)',D:'เรียกประชุม (V.)'},ruleId:'p6.word-form',chapterIds:[3,6,27]},
      {choices:['In addition','On the contrary','Nevertheless','Instead'],answer:'A',skills:['context','conjunction'],difficulty:3,explanation:'The surveys are an additional source of information alongside usage data.',explanationTh:'นอกจากดู usage data แล้ว ยังสำรวจผู้ใช้เพิ่ม จึงใช้ In addition',translationTh:'นอกจากนี้ เจ้าหน้าที่จะสำรวจผู้ใช้เกี่ยวกับราคา ความพร้อมใช้งาน และความสะดวกในการใช้',choiceTranslationsTh:{A:'นอกจากนี้',B:'ตรงกันข้าม',C:'ถึงกระนั้น',D:'แทนที่จะเป็นเช่นนั้น'},ruleId:'p6.connector-context',chapterIds:[17,27]},
      {choices:['The results will help officials decide whether the trial should continue.','The rail stations were built more than twenty years ago.','Some commuters prefer to read during train journeys.','The app is available in three font sizes.'],answer:'A',skills:['sentence-placement','context'],difficulty:4,explanation:'The previous sentences discuss collecting data; the first choice explains how the results will be used.',explanationTh:'ก่อนช่องพูดถึงการเก็บข้อมูลและทำ survey ข้อ A เชื่อมต่อโดยบอกว่าจะเอาผลไปใช้ตัดสินใจอย่างไร',ruleId:'p6.sentence-placement',chapterIds:[27]},
      {choices:['extend','expand','stretch','lengthen'],answer:'B',skills:['vocabulary','collocation'],difficulty:4,explanation:'“Expand the service to additional stations” is the natural phrase for increasing geographic coverage.',explanationTh:'เมื่อขยาย “บริการ” ไปยังสถานีเพิ่ม ใช้ expand the service to ... เป็นธรรมชาติที่สุด',translationTh:'หากความต้องการยังสูง เมืองอาจขยายบริการไปยังสถานีเพิ่มเติมอีกสี่แห่งในปีหน้า',choiceTranslationsTh:{A:'ขยายเวลา/ยืดไปถึง',B:'ขยายขอบเขต/พื้นที่บริการ',C:'ยืดวัตถุ',D:'ทำให้ยาวขึ้น'},ruleId:'p6.fixed-phrase',chapterIds:[21,27]},
    ],
  },
  {
    kind:'message',
    title:'Volunteer Briefing',
    body:"VOLUNTEER MESSAGE\n\nThank you for helping with Saturday’s outdoor music festival. Please report to the volunteer tent by 8:15 A.M. so that team assignments can be [1] _____ before the gates open.\n\nVolunteers working near the stages should wear the ear protection provided at check-in. Water stations are located throughout the site and can be used [2] _____.\n\nIf heavy rain is expected, organizers may [3] _____ some activities to the covered pavilion.\n\n[4] _____",
    questions:[
      {choices:['confirm','confirmed','confirming','confirmation'],answer:'B',skills:['passive','verb-tense'],difficulty:3,explanation:'After “can be,” passive voice requires the past participle “confirmed.”',explanationTh:'เห็น can be → ถ้าประธาน assignments เป็นสิ่งที่ “ถูกยืนยัน” ต้องใช้ passive: can be + V3 = confirmed',translationTh:'กรุณามาถึงเต็นท์อาสาสมัครภายใน 8:15 เพื่อให้สามารถยืนยันการแบ่งทีมได้ก่อนเปิดประตู',choiceTranslationsTh:{A:'ยืนยัน (V1)',B:'ถูกยืนยัน (V3)',C:'กำลังยืนยัน (V-ing)',D:'การยืนยัน (N.)'},ruleId:'p6.passive-tense',chapterIds:[4,27]},
      {choices:['freely','free','freedom','freeing'],answer:'A',skills:['part-of-speech'],difficulty:2,explanation:'The blank modifies “can be used,” so the adverb “freely” is required.',explanationTh:'ช่องว่างขยายกริยา can be used ว่าใช้ได้อย่างไร จึงเป็น Adv. freely',translationTh:'มีจุดบริการน้ำทั่วพื้นที่และสามารถใช้ได้อย่างอิสระ',choiceTranslationsTh:{A:'อย่างอิสระ (Adv.)',B:'ฟรี/อิสระ (Adj.)',C:'อิสรภาพ (N.)',D:'การปลดปล่อย (V-ing)'},ruleId:'p6.word-form',chapterIds:[5,27]},
      {choices:['relocate','replace','remove','reverse'],answer:'A',skills:['vocabulary','collocation'],difficulty:4,explanation:'“Relocate activities to the pavilion” means move them to a different place.',explanationTh:'relocate ... to ... = ย้ายกิจกรรมไปยังสถานที่อื่น ตรงบริบทฝนตก',translationTh:'หากคาดว่าจะมีฝนตกหนัก ผู้จัดอาจย้ายกิจกรรมบางส่วนไปยังศาลาที่มีหลังคา',choiceTranslationsTh:{A:'ย้ายสถานที่',B:'แทนที่',C:'นำออก',D:'ย้อนกลับ'},ruleId:'p6.fixed-phrase',chapterIds:[21,27]},
      {choices:['Any schedule changes will be announced by text message and at the volunteer tent.','The festival poster was designed by a local student.','Tickets for next year will go on sale in December.','A restaurant across the street serves breakfast until 11:00.'],answer:'A',skills:['sentence-placement','context'],difficulty:4,explanation:'After mentioning possible rain-related changes, the message naturally explains how volunteers will be notified.',explanationTh:'ก่อนช่องพูดถึงการเปลี่ยนกิจกรรมเพราะฝน ข้อ A จึงต่อด้วย “จะแจ้งการเปลี่ยนตารางอย่างไร” ได้เป็นเหตุเป็นผล',ruleId:'p6.sentence-placement',chapterIds:[27]},
    ],
  },
  {
    kind:'email',
    title:'Appointment Reminder Preferences',
    body:"To: Clients\nFrom: Westbridge Dental Center\nSubject: Reminder Preferences\n\nWe are updating our appointment-reminder system. Beginning next month, clients may choose to receive reminders by text message, e-mail, or both.\n\nTo change your current preference, please log in to the client portal and [1] _____ the “Notification Settings” menu. Changes made before 5:00 P.M. will usually take [2] _____ the following business day.\n\n[3] _____\n\nClients who do not update their settings will [4] _____ to receive reminders by their current method.",
    questions:[
      {choices:['select','collect','elect','detect'],answer:'A',skills:['vocabulary','collocation'],difficulty:3,explanation:'In a software interface, users “select” a menu or option.',explanationTh:'บริบทเป็นหน้า portal จึงใช้ select the menu = เลือกเมนู',translationTh:'ให้เข้าสู่ระบบพอร์ทัลลูกค้าและเลือกเมนู “Notification Settings”',choiceTranslationsTh:{A:'เลือก',B:'รวบรวม',C:'เลือกตั้ง',D:'ตรวจพบ'},ruleId:'p6.fixed-phrase',chapterIds:[21,27]},
      {choices:['effect','affect','effective','effectively'],answer:'A',skills:['collocation','vocabulary'],difficulty:4,explanation:'The fixed phrase is “take effect,” meaning become active or start to apply.',explanationTh:'วลีตายตัว take effect = เริ่มมีผล/เริ่มใช้งาน',translationTh:'การเปลี่ยนแปลงที่ทำก่อน 17:00 น. โดยปกติจะเริ่มมีผลในวันทำการถัดไป',choiceTranslationsTh:{A:'ผล (ในวลี take effect)',B:'ส่งผลกระทบ (V.)',C:'มีประสิทธิผล (Adj.)',D:'อย่างมีประสิทธิผล (Adv.)'},ruleId:'p6.fixed-phrase',chapterIds:[21,27]},
      {choices:['Reminder messages do not contain detailed treatment information.','The center’s waiting room has twelve chairs.','A new dentist joined the clinic last year.','Parking is available behind the grocery store.'],answer:'A',skills:['sentence-placement','context'],difficulty:4,explanation:'The email is about reminder channels, so a privacy-related detail about reminder content fits the topic.',explanationTh:'ข้อความทั้งฉบับพูดเรื่อง reminder ข้อ A ยังอยู่ในหัวข้อเดียวกันและให้รายละเอียดสำคัญเกี่ยวกับข้อความเตือน',ruleId:'p6.sentence-placement',chapterIds:[27]},
      {choices:['continue','continues','continued','continuing'],answer:'A',skills:['verb-tense'],difficulty:3,explanation:'After “will,” the base verb is required: “will continue.”',explanationTh:'เห็น will อยู่หน้า blank → หลัง modal ต้องเป็น V1 จึงใช้ continue',translationTh:'ลูกค้าที่ไม่แก้การตั้งค่าจะยังคงได้รับข้อความเตือนด้วยวิธีเดิม',choiceTranslationsTh:{A:'ดำเนินต่อ/ยังคง',B:'ยังคง (V-s)',C:'ดำเนินต่อแล้ว (V2/V3)',D:'กำลังดำเนินต่อ (V-ing)'},ruleId:'p6.verb-form',chapterIds:[11,27]},
    ],
  },
]

export const extraPart6V6:Question[]=[]
export const extraPassagesV6:Passage[]=[]

seeds.forEach((seed,pIndex)=>{
  const passageId='p6-v6-'+String(pIndex+1).padStart(2,'0')
  const ids=seed.questions.map((_,qIndex)=>passageId+'-q'+(qIndex+1))
  extraPassagesV6.push({
    id:passageId,part:6,kind:seed.kind,title:seed.title,body:seed.body,questions:ids,
    sourceLabel:'Original TOEIC-style practice modeled on official ETS Part 6 task structure; not official ETS questions.',
  })
  seed.questions.forEach((q,qIndex)=>{
    extraPart6V6.push({
      id:ids[qIndex],part:6,passageId,stem:'['+(qIndex+1)+'] _____',choices:c(...q.choices),answer:q.answer,
      skills:q.skills,difficulty:q.difficulty,explanation:q.explanation,explanationTh:q.explanationTh,
      translationTh:q.translationTh,choiceTranslationsTh:q.choiceTranslationsTh,whyOthers:q.whyOthers,
      ruleId:q.ruleId,chapterIds:q.chapterIds,targetSeconds:q.skills.includes('sentence-placement')?60:45,
    })
  })
})
