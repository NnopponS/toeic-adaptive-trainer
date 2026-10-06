import type { SkillId } from './types'

export type Language = 'th' | 'en'
export const LANG_STORAGE_KEY = 'toeic-coach-language'
export const L = (lang: Language, en: string, th: string) => lang === 'th' ? th : en

export const thaiSkillLabels: Record<SkillId, string> = {
  'part-of-speech': 'ชนิดของคำ',
  'verb-tense': 'กาลและรูปกริยา',
  'subject-verb': 'ประธาน–กริยาสอดคล้อง',
  passive: 'Passive Voice',
  preposition: 'คำบุพบท',
  conjunction: 'คำเชื่อม',
  'relative-clause': 'Relative Clause',
  pronoun: 'คำสรรพนาม',
  comparison: 'การเปรียบเทียบ',
  vocabulary: 'คำศัพท์',
  collocation: 'คำที่ใช้คู่กัน',
  context: 'บริบท',
  'sentence-placement': 'การวางประโยค',
  'main-idea': 'ใจความสำคัญ',
  detail: 'รายละเอียด',
  inference: 'การอนุมาน',
  purpose: 'จุดประสงค์',
  paraphrase: 'คำความหมายเดียวกัน',
  'multi-text': 'หลายบทความ',
}

export const thaiLessonMeta: Partial<Record<SkillId, {
  title: string
  shortTitle: string
  summary: string
  strategy: string[]
}>> = {
  'verb-tense': {
    title: 'Tense และคำบอกเวลา',
    shortTitle: 'Tense',
    summary: 'จับคำบอกเวลาและลำดับเหตุการณ์ก่อน แล้วค่อยเลือกรูปกริยา',
    strategy: ['วงคำบอกเวลาก่อน', 'แยก Present / Past / Future', 'เช็ก Simple / Continuous / Perfect', 'ค่อยเทียบตัวเลือก'],
  },
  'part-of-speech': {
    title: 'Word Form: Noun / Verb / Adjective / Adverb',
    shortTitle: 'ชนิดของคำ',
    summary: 'ดูตำแหน่งรอบช่องว่างเพื่อหาว่าต้องการคำชนิดไหนก่อนดูความหมาย',
    strategy: ['ดูคำหน้ากับคำหลังช่องว่าง', 'หลัง article มักต้องเป็น noun หรือ adjective+noun', 'หน้าคำนามมักเป็น adjective', 'ขยาย verb/adjective มักเป็น adverb'],
  },
  preposition: {
    title: 'Prepositions และวลีธุรกิจ',
    shortTitle: 'Prepositions',
    summary: 'จำคำบุพบทเป็นชุดกับคำรอบข้าง โดยเฉพาะเวลา สถานที่ และ fixed phrase',
    strategy: ['เช็กว่าเป็น fixed phrase หรือไม่', 'จำ verb + preposition เป็นก้อนเดียว', 'by ใช้กับ deadline', 'during ใช้กับช่วงเวลา/เหตุการณ์'],
  },
  conjunction: {
    title: 'คำเชื่อมและความสัมพันธ์ของประโยค',
    shortTitle: 'คำเชื่อม',
    summary: 'หาความสัมพันธ์ของสองใจความก่อน แล้วค่อยเลือกคำเชื่อม',
    strategy: ['เหตุผล → because/since', 'ขัดแย้ง → although/even though', 'เงื่อนไข → if/unless', 'จุดประสงค์ → so that/in order to'],
  },
  'subject-verb': {
    title: 'Subject–Verb Agreement',
    shortTitle: 'S–V Agreement',
    summary: 'หาประธานตัวจริงและอย่าหลงคำนามที่มาคั่นระหว่างประธานกับกริยา',
    strategy: ['หาประธานหลัก', 'ตัด prepositional phrase ออกในใจ', 'each/every/one/the number เป็นเอกพจน์', 'neither…nor ให้ดูประธานตัวใกล้กริยา'],
  },
  passive: {
    title: 'Passive Voice',
    shortTitle: 'Passive',
    summary: 'ถามก่อนว่าประธานเป็นผู้ทำหรือผู้ถูกกระทำ',
    strategy: ['ประธานถูกกระทำ → passive', 'Passive = be + V3', 'Modal passive = modal + be + V3', 'Perfect passive = has/have been + V3'],
  },
  'relative-clause': {
    title: 'Relative Clauses',
    shortTitle: 'Relative Clause',
    summary: 'เลือก relative word ให้ตรงทั้งคำนามข้างหน้าและหน้าที่ในอนุประโยค',
    strategy: ['คนที่เป็นประธาน → who', 'สิ่งของ → which', 'แสดงความเป็นเจ้าของ → whose', 'สถานที่ → where; หลัง preposition แบบเป็นทางการ → whom'],
  },
  pronoun: {
    title: 'รูปของ Pronouns',
    shortTitle: 'Pronouns',
    summary: 'เลือก subject, object, possessive หรือ reflexive จากหน้าที่ของช่องว่าง',
    strategy: ['หน้าคำนาม → my/your/their ฯลฯ', 'หลัง verb/preposition → object form', 'ประธานกับกรรมคนเดียวกัน → reflexive', 'แสดงความเป็นเจ้าของแบบไม่มี noun ตาม → mine/yours/theirs'],
  },
  comparison: {
    title: 'Comparisons',
    shortTitle: 'Comparisons',
    summary: 'ใช้คำสัญญาณ เช่น than, as…as และ of the three เพื่อเลือกรูปเปรียบเทียบ',
    strategy: ['than → comparative', 'as + adjective + as', 'กลุ่ม 3 ขึ้นไป → superlative', 'adjective ยาวมักใช้ more/most'],
  },
  collocation: {
    title: 'Business Collocations',
    shortTitle: 'Collocations',
    summary: 'จำคำศัพท์ธุรกิจเป็นวลี ไม่แปลทีละคำ',
    strategy: ['จำ verb+noun เป็นคู่', 'สังเกต adjective+preposition', 'ใช้บริบทธุรกิจช่วย', 'คำที่พลาดให้กลับมาทวนซ้ำ'],
  },
}

type ExampleTh = { clue: string; rule: string; explanation: string; trap: string }

export const thaiExamples: Record<string, ExampleTh> = {
  'tense-1': { clue:'คำสัญญาณคือ “since the beginning of this month”', rule:'since + จุดเริ่มต้น และเหตุการณ์ยังเกี่ยวข้องถึงปัจจุบัน → Present Perfect', explanation:'เหตุการณ์เริ่มในอดีตและช่วงเวลายังต่อเนื่องถึงปัจจุบัน จึงใช้ “has signed”', trap:'อย่าเห็นว่าเหตุการณ์เกิดในอดีตแล้วรีบเลือก Past Simple; คำว่า since เป็นตัวชี้สำคัญ' },
  'tense-2': { clue:'มีเหตุการณ์ในอดีต 2 เหตุการณ์ และการเตรียมห้องเกิดก่อน', rule:'เหตุการณ์อดีตที่เกิดก่อน → Past Perfect; เหตุการณ์ทีหลัง → Past Simple', explanation:'“had prepared” แสดงชัดว่าการเตรียมห้องเสร็จก่อน director arrived', trap:'Past Simple ฟังดูพอได้ แต่โจทย์ TOEIC มักทดสอบลำดับ “อดีตก่อนอดีต” โดยตรง' },
  'tense-3': { clue:'มี “next Monday” เป็นเวลาชัดเจนในอนาคต', rule:'เวลาที่ชี้ไปอนาคตอย่างชัดเจน โดยทั่วไปใช้ will + V1', explanation:'บริษัทกำลังบอกสิ่งที่จะทำในอนาคต จึงใช้ “will launch”', trap:'Present Simple ใช้กับตารางกำหนดการได้ แต่ประโยคนี้เป็นการประกาศการกระทำของบริษัท' },
  'tense-4': { clue:'มีเหตุการณ์หนึ่งกำลังเกิดอยู่ แล้วอีกเหตุการณ์เข้ามาแทรก', rule:'เหตุการณ์พื้นหลังที่กำลังดำเนิน → Past Continuous; เหตุการณ์ที่แทรก → Past Simple', explanation:'การโทรกำลังเกิดขึ้นตอนที่ไฟดับ จึงใช้ “was calling”', trap:'Past Perfect จะสื่อว่าการโทรเสร็จไปแล้วก่อนเกิดไฟดับ ซึ่งไม่ตรงบริบท' },
  'tense-5': { clue:'มี “yet” และมีผลกระทบถึงปัจจุบัน', rule:'yet มักใช้กับ Present Perfect; invoices เป็นผู้ถูกกระทำ จึงต้องเป็น Present Perfect Passive', explanation:'“have not been approved” แปลว่ายังไม่ได้รับการอนุมัติจนถึงตอนนี้', trap:'Past Simple เน้นเหตุการณ์ในอดีตที่จบแล้ว จึงไม่เข้ากับ yet ในบริบทนี้' },

  'pos-1': { clue:'ช่องว่างบอกลักษณะว่า completed อย่างไร', rule:'คำที่ขยาย verb ต้องเป็น adverb', explanation:'“successfully” เป็น adverb ที่ขยาย completed', trap:'“successful” เป็น adjective จึงขยาย verb ตรง ๆ ไม่ได้' },
  'pos-2': { clue:'หลัง improved ต้องมีสิ่งที่ถูกปรับปรุง', rule:'verb + object → object ต้องเป็น noun', explanation:'“productivity” เป็นคำนามและเป็นสิ่งที่นโยบายช่วยปรับปรุง', trap:'“productive” เป็น adjective และต้องมี noun ตามหลัง' },
  'pos-3': { clue:'ช่องว่างอยู่หน้าคำนาม response', rule:'หน้าคำนามมักต้องใช้ adjective', explanation:'“prompt” เป็น adjective ที่ขยาย response', trap:'“promptly” เป็น adverb จึงไม่ใช้ขยาย noun โดยตรง' },
  'pos-4': { clue:'คำว่า its เป็น possessive adjective และต้องมี noun ตาม', rule:'possessive adjective + noun', explanation:'“satisfaction” เป็นคำนามที่ตำแหน่งนี้ต้องการ', trap:'“satisfied” เป็น adjective และ “satisfactorily” เป็น adverb' },
  'pos-5': { clue:'ช่องว่างขยาย adjective “different”', rule:'adverb + adjective', explanation:'“surprisingly” เป็น adverb ที่ขยาย different', trap:'“surprising” เป็น adjective ซึ่งปกติไปขยาย noun' },

  'prep-1': { clue:'เป็นกำหนดเส้นตาย', rule:'by + เวลา = ไม่เกินเวลานั้น', explanation:'“by 5:00 P.M.” หมายถึงส่งก่อนหรือไม่เกินห้าโมง', trap:'during ใช้กับช่วงเวลา/เหตุการณ์ ไม่ใช่ deadline point' },
  'prep-2': { clue:'เป็น fixed phrase “responsible ___”', rule:'be responsible for + noun/gerund', explanation:'วลีมาตรฐานคือ “responsible for coordinating”', trap:'responsible to มักใช้บอกว่ารายงานต่อใคร ไม่ใช่สิ่งที่รับผิดชอบทำ' },
  'prep-3': { clue:'เป็น fixed phrase “apply ___”', rule:'apply to = มีผลกับ/เกี่ยวข้องกับ', explanation:'ขั้นตอนใหม่นี้มีผล “ต่อ” สำนักงานทั้งหมด จึงใช้ to', trap:'apply for = สมัคร/ขอสิ่งใดสิ่งหนึ่ง' },
  'prep-4': { clue:'เป็น fixed verb phrase', rule:'refer to + document/person/topic', explanation:'วลีธรรมชาติคือ “refer to the attached chart”', trap:'refer at ไม่ใช่รูปมาตรฐาน' },
  'prep-5': { clue:'national holiday เป็นช่วงเวลา/เหตุการณ์', rule:'during + ช่วงเวลา/เหตุการณ์', explanation:'ร้านปิด “ระหว่างช่วงวันหยุด” จึงใช้ during', trap:'by จะเปลี่ยนความหมายเป็นเส้นตาย' },

  'conj-1': { clue:'อนุประโยคหลังช่องว่างเป็นเงื่อนไขยกเว้น', rule:'unless = if not / ยกเว้นถ้า', explanation:'พิธีจะดำเนินต่อไป เว้นแต่ว่าอากาศจะไม่ปลอดภัย', trap:'although แสดงความขัดแย้ง ไม่ได้ให้เงื่อนไขที่ทำให้พิธีหยุด' },
  'conj-2': { clue:'ประโยคหลังอธิบายจุดประสงค์ของการมาเร็ว', rule:'so that + clause = เพื่อที่จะ', explanation:'Ms. Lee มาเร็วเพื่อจะได้ทดสอบโปรเจกเตอร์', trap:'despite เป็น preposition จึงต่อด้วย full clause แบบนี้ไม่ได้' },
  'conj-3': { clue:'ประโยคแรกอธิบายเหตุผลของการตัดสินใจ', rule:'since/because + clause = เพราะว่า', explanation:'เพราะงบจำกัด ทีมจึงซ่อมอุปกรณ์ที่เร่งด่วนที่สุดก่อน', trap:'despite ต้องตามด้วย noun/noun phrase ไม่ใช่ clause ตรง ๆ' },
  'conj-4': { clue:'การอนุมัติเกิดขึ้นแม้มีข้อกังวล', rule:'although/even though = ความขัดแย้งระหว่างสอง clause', explanation:'although เชื่อมสองข้อเท็จจริงที่สวนกันได้ถูกต้อง', trap:'because จะทำให้ความหมายกลายเป็น “อนุมัติเพราะมีข้อกังวล” ซึ่งไม่สมเหตุผล' },
  'conj-5': { clue:'clause หลังช่องว่างบอกจุดสิ้นสุดของช่วงเวลา', rule:'until + clause = ต่อเนื่องจนถึงเหตุการณ์นั้น', explanation:'สัญญายังมีผลจนกว่าทั้งสองฝ่ายจะตกลงยกเลิก', trap:'therefore เป็น conjunctive adverb และไม่เข้ากับโครงสร้างนี้' },

  'sva-1': { clue:'ประธานหลักคือ “Each”', rule:'each of + plural noun → ใช้กริยาเอกพจน์', explanation:'แม้ rooms เป็นพหูพจน์ แต่ตัวควบคุมกริยาคือ Each จึงใช้ “is”', trap:'อย่าหลงคำนามพหูพจน์ rooms ที่อยู่ใกล้กริยา' },
  'sva-2': { clue:'ประธานหลักคือ “results”', rule:'ประธานพหูพจน์ → กริยาพหูพจน์', explanation:'วลี “of the survey” เป็นส่วนขยาย ไม่ได้เปลี่ยนประธานหลัก results', trap:'survey อยู่ใกล้ช่องว่างแต่เป็นคำนามใน prepositional phrase' },
  'sva-3': { clue:'วลีประธานหลักคือ “The number”', rule:'the number of + plural noun → ใช้กริยาเอกพจน์', explanation:'The number เป็นเอกพจน์ จึงใช้ “has increased”', trap:'orders เป็นพหูพจน์แต่ไม่ใช่ head subject' },
  'sva-4': { clue:'neither…nor ให้ดูคำนามที่อยู่ใกล้กริยามากกว่า', rule:'neither A nor B → กริยามักสอดคล้องกับ B ที่อยู่ใกล้กว่า', explanation:'technicians เป็นพหูพจน์ จึงใช้ “are”', trap:'ถ้าไปยึด supervisor จะเลือก is ผิด' },
  'sva-5': { clue:'ประธานหลักคือ “One”', rule:'one of + plural noun → กริยาเอกพจน์', explanation:'ประโยคพูดถึง intern หนึ่งคน จึงใช้ “is”', trap:'interns เป็นพหูพจน์เพราะตามหลัง of เท่านั้น' },

  'pass-1': { clue:'applications เป็นผู้ถูก review', rule:'Present Simple Passive = am/is/are + V3', explanation:'ฝ่าย HR เป็นผู้ review applications ดังนั้นฝั่ง applications ต้องใช้ “are reviewed”', trap:'review แบบ active จะทำให้ applications กลายเป็นผู้ทำกริยา' },
  'pass-2': { clue:'มี modal “must” และ equipment เป็นผู้ถูก inspect', rule:'Modal Passive = modal + be + V3', explanation:'equipment ถูกตรวจ จึงเป็น “must be inspected”', trap:'must inspected ขาด be' },
  'pass-3': { clue:'มี “by the supplier” และโครงสร้าง Present Perfect', rule:'Present Perfect Passive = have/has been + V3', explanation:'supplier เป็นผู้ทำกับ units จึงใช้ “have been replaced”', trap:'have replaced จะทำให้ units เป็นผู้ลงมือ replace เอง' },
  'pass-4': { clue:'employees เป็นผู้ถูกย้าย', rule:'Future Passive = will be + V3', explanation:'บริษัทเป็นผู้ย้ายพนักงาน ดังนั้นพนักงาน “will be transferred”', trap:'will transfer จะสื่อว่าพนักงานเป็นผู้ย้ายบางสิ่ง' },
  'pass-5': { clue:'เหตุการณ์กำลังดำเนินอยู่ในอดีตและ computers เป็นผู้ถูกกระทำ', rule:'Past Continuous Passive = was/were being + V3', explanation:'การอัปเดตกำลังเกิดขึ้นตอนที่ไฟดับ จึงใช้ “were being updated”', trap:'Simple Past ไม่แสดงว่าการกระทำนั้นกำลังดำเนินอยู่' },

  'rel-1': { clue:'คำนามก่อนหน้าคือคน และช่องว่างเป็นประธานของ organized', rule:'คน + relative clause ที่ช่องว่างเป็นประธาน → who', explanation:'who แทน employee และเป็นผู้ทำ organized', trap:'whose ต้องมี noun ตามเพื่อแสดงความเป็นเจ้าของ' },
  'rel-2': { clue:'roof เป็นของ building', rule:'whose ใช้แสดงความเป็นเจ้าของได้ทั้งคนและสิ่งของ', explanation:'“whose roof” = หลังคาของอาคารนั้น', trap:'which roof ไม่สร้างความสัมพันธ์แบบเจ้าของได้' },
  'rel-3': { clue:'คำนามก่อนหน้าคือสิ่งของ และช่องว่างเป็นประธานของ opened', rule:'nonrestrictive clause ที่ขยายสิ่งของ → which', explanation:'which อ้างกลับไปที่ warehouse ได้ถูกต้อง', trap:'where ต้องตามด้วย clause ที่บอกสิ่งที่เกิดขึ้น ณ สถานที่นั้น' },
  'rel-4': { clue:'city เป็นสถานที่ที่ conference จัดขึ้น', rule:'place + clause ที่บอกกิจกรรมในสถานที่ → where', explanation:'where ในที่นี้เท่ากับ “in which”', trap:'ถ้าใช้ which ต้องมี preposition เป็น “in which”' },
  'rel-5': { clue:'relative word อยู่หลัง preposition “with”', rule:'คนที่เป็น object หลัง preposition แบบเป็นทางการ → whom', explanation:'whom เป็น object ของ with', trap:'who พบได้ในภาษาพูด แต่ TOEIC มักให้ whom หลัง preposition' },

  'pro-1': { clue:'หลังช่องว่างมีคำนาม “ID cards”', rule:'หน้าคำนาม → possessive adjective', explanation:'their ทำหน้าที่ขยาย ID cards', trap:'theirs เป็น possessive pronoun ที่ต้องยืนเดี่ยว ไม่มี noun ตาม' },
  'pro-2': { clue:'Managers เป็นทั้งผู้ทำและผู้รับการกระทำ', rule:'subject และ object คนเดียวกัน → reflexive pronoun', explanation:'รูปที่ถูกคือ managers familiarize themselves', trap:'them ปกติจะหมายถึงคนอื่น ไม่ใช่ managers เอง' },
  'pro-3': { clue:'ต้องแทนคำนามเอกพจน์ proposal โดยไม่กล่าวซ้ำ', rule:'that ใช้แทนคำนามเอกพจน์ในการเปรียบเทียบ', explanation:'that แทน “the proposal”', trap:'those ใช้แทนคำนามพหูพจน์' },
  'pro-4': { clue:'ต้องเลือกหนึ่งรายการจากของสองสิ่ง', rule:'one ใช้แทน singular count noun หนึ่งรายการในชุดที่รู้กันอยู่', explanation:'one = หนึ่งในสอง designs', trap:'ones เป็นพหูพจน์' },
  'pro-5': { clue:'everyone หมายถึงคนและเป็นประธานของ had helped', rule:'คนที่เป็นประธานใน relative clause → who', explanation:'who เชื่อม everyone เข้ากับการกระทำ had helped', trap:'whose ใช้แสดงความเป็นเจ้าของ ไม่ใช่ประธาน' },

  'cmp-1': { clue:'มีคำว่า “than”', rule:'than → comparative', explanation:'ขั้นกว่าของ high คือ “higher”', trap:'highly เป็น adverb ไม่ใช่ comparative adjective ที่ตำแหน่งนี้ต้องการ' },
  'cmp-2': { clue:'โครงสร้างเริ่มด้วย “as”', rule:'as + adjective + as', explanation:'รูปตายตัวคือ “as spacious as”', trap:'than ต้องใช้กับ comparative เช่น “more spacious than”' },
  'cmp-3': { clue:'เปรียบเทียบหนึ่งสิ่งกับกลุ่มสามสิ่ง', rule:'3 สิ่งขึ้นไป → superlative', explanation:'จึงต้องใช้ “the most practical”', trap:'more ใช้กับการเปรียบเทียบสองสิ่ง' },
  'cmp-4': { clue:'มีรูป “twice as + adjective + ___”', rule:'จำนวนเท่าใช้ twice/three times as + adjective + as', explanation:'รูปมาตรฐานคือ “twice as large as”', trap:'อย่าเปลี่ยนเป็น than ใน pattern นี้' },
  'cmp-5': { clue:'มี than และคำนี้ต้องขยาย verb runs', rule:'comparative adverb ที่ยาว → more + adverb', explanation:'“more smoothly” เป็น comparative adverb ที่ขยาย runs', trap:'smooth เป็น adjective ไม่ใช่ adverb' },

  'col-1': { clue:'เป็นวลี ___ a survey', rule:'conduct a survey = ดำเนินการสำรวจ', explanation:'conduct เป็น verb ที่ใช้คู่กับ survey ตามธรรมชาติ', trap:'construct แปลว่าสร้าง และไม่ใช่ collocation นี้' },
  'col-2': { clue:'เป็นวลี ___ of purchase', rule:'proof of purchase = หลักฐานการซื้อ', explanation:'ใบเสร็จเป็นหลักฐานว่ามีการซื้อเกิดขึ้น', trap:'approval of purchase หมายถึงการอนุมัติ ซึ่งคนละความหมาย' },
  'col-3': { clue:'เป็นวลีธุรกิจ ___ a product/program', rule:'launch = เปิดตัว/เริ่มใช้อย่างเป็นทางการ', explanation:'บริษัท launch สินค้า บริการ แคมเปญ และโปรแกรม', trap:'land อาจแปลว่าได้งาน/ได้ดีล แต่ไม่ใช้เปิดตัวโปรแกรม' },
  'col-4': { clue:'ความหมายคือเลื่อนการตัดสินใจไปภายหลัง', rule:'postpone a decision/meeting/event', explanation:'postpone แปลว่าเลื่อนออกไป', trap:'preserve แปลว่าเก็บรักษา ไม่ใช่เลื่อนเวลา' },
  'col-5': { clue:'เป็น fixed phrase ___ awareness', rule:'raise awareness; raise เป็น transitive verb และรับ object', explanation:'รูปที่ใช้เป็นธรรมชาติคือ “raise brand awareness”', trap:'rise เป็น intransitive verb จึงรับ awareness เป็น object ตรง ๆ ไม่ได้' },
}

export const thaiChapterTitles: Record<number, string> = {
  1:'คำนาม', 2:'Determiners', 3:'คำคุณศัพท์', 4:'แบบฝึก Determiners + Nouns',
  5:'คำกริยาวิเศษณ์', 6:'สรุป Noun / Adjective / Adverb', 7:'คำกริยา', 8:'คำสรรพนาม',
  9:'Relative Pronouns', 10:'Subject–Verb Agreement', 11:'Tense', 12:'Prepositions',
  13:'Phrasal Verbs / Verb + Preposition', 14:'Active–Passive Voice', 15:'Participles',
  16:'If-Clause', 17:'Gerund–Infinitive', 18:'Comparisons', 19:'Connectors', 20:'Question Tags',
  21:'คำศัพท์', 26:'Reading Part 5 — เติมคำในประโยค', 27:'Reading Part 6 — เติมข้อความ', 28:'Reading Part 7 — อ่านจับใจความ',
}

export const thaiChapterTips: Record<number, string[]> = {
  1:['Noun เป็นได้ทั้งประธาน กรรม และคำที่ตามหลัง preposition','จำ suffix คำนามที่พบบ่อย เช่น -tion, -ment, -ship, -ness, -ty','คำนามนับได้เอกพจน์ที่เป็นคนมักต้องมี determiner/article'],
  2:['a/an/one/every/each/another/this/that + คำนามนับได้เอกพจน์','much/little/an amount of + คำนามนับไม่ได้','many/a number of/several/numerous/few/these/those + คำนามพหูพจน์'],
  3:['Adjective อยู่หน้าคำนาม หลัง be และหลัง linking verb','linking verb ที่ควรจำ: look, feel, seem, remain, appear, become','suffix adjective ที่พบบ่อย: -al, -ble, -ous, -ful, -less, -ic, -ish, -tive'],
  4:['เห็นตัวเลือกเป็น word family ให้หาชนิดคำก่อนแปล','ใช้ determiner และตำแหน่งรอบช่องว่างช่วยตัดตัวเลือก'],
  5:['Adverb ขยาย verb, adjective และ adverb','คำลงท้าย -ly มักเป็น adverb แต่มีคำที่ไม่ลง -ly เช่น very, quite, too, fast','adverb ที่ขยาย adjective/adverb มักอยู่ด้านหน้า'],
  6:['Noun: subject/object/หลัง preposition','Adjective: หน้าคำนาม/หลัง be/หลัง linking verb','ใช้ determiner ช่วยแยก singular/plural/uncountable noun'],
  7:['จำ suffix ของ verb เช่น -ize, -en, -ify','เห็น word family ให้ตัดสินก่อนว่าตำแหน่งต้องการ finite verb หรือชนิดคำอื่น'],
  8:['จำ 5 ช่อง: subject, object, possessive adjective, possessive pronoun, reflexive','หน้าคำนามใช้ my/your/our/their/his/her/its','หลัง verb/preposition ที่ต้องการกรรมใช้ me/you/us/them/him/her/it'],
  9:['Relative clause ทำหน้าที่ขยายคำนาม','คน: who/whom; เจ้าของ: whose; สิ่งของ: which/that; สถานที่: where; เวลา: when','ถ้า Wh-word ตามหลังคำนามและเชื่อมประโยคขยาย ให้คิดเป็น “ที่/ซึ่ง”'],
  10:['หาประธานตัวจริงก่อนเลือก verb','มองข้ามคำนามใน prepositional phrase/relative clause','Present Simple: he/she/it ใช้ V-s; plural ใช้ V1'],
  11:['Simple: Past V2 / Present V1 / Future will+V1','Continuous: was/were + V-ing, am/is/are + V-ing, will be + V-ing','Perfect: had + V3, have/has + V3, will have + V3','ทำข้อสอบให้หาคำบอกเวลากับลำดับเหตุการณ์ก่อน'],
  12:['during + ช่วงเวลา/เหตุการณ์; by + deadline; within + ระยะเวลา','between มักใช้กับ 2 สิ่ง; among ใช้กับกลุ่ม','จำ preposition พร้อมคำที่ใช้คู่กัน ไม่จำแปลเดี่ยว ๆ'],
  13:['จำ verb + preposition เป็นก้อนเดียว','กลุ่มที่ต้องจำ เช่น engaged in, involved in, interested in, participate in, result in, succeed in','ตัวอย่างสำคัญ: rely on'],
  14:['Active = ประธานเป็นผู้ทำ; Passive = ประธานถูกกระทำ','โครงสร้างหลัก Passive = BE + V3','ตัดสิน active/passive ก่อน แล้วค่อยเลือก tense ของ BE'],
  15:['Participle ทำหน้าที่เหมือน adjective','-ing = สิ่งที่ทำให้เกิดความรู้สึก; -ed = ผู้ที่รู้สึก/ได้รับผล','จำเป็นคู่: interesting/interested, exciting/excited, boring/bored'],
  16:['Type 1: If + V1, will + V1','Type 2: If + V2, would + V1','Type 3: If + had + V3, would have + V3'],
  17:['Gerund = V-ing ที่ทำหน้าที่เหมือน noun','หลัง preposition ใช้ V-ing','จำกลุ่ม verb/phrase ที่ตามด้วย V-ing เช่น enjoy, mind, keep, cannot help, spend time'],
  18:['ขั้นกว่าใช้ -er หรือ more; ขั้นสูงสุดใช้ -est หรือ most','than → comparative; as...as → เท่ากัน','จำ irregular: good-better-best, bad-worse-worst, much-more-most, little-less-least'],
  19:['แยก connector เป็น conjunction, preposition, adverb และ FANBOYS','because + S+V แต่ because of + noun','FANBOYS = for, and, nor, but, or, yet, so'],
  20:['ประโยคบอกเล่าใช้ negative tag; ประโยคปฏิเสธใช้ positive tag','ใช้ auxiliary เดิมและเปลี่ยนประธานเป็น pronoun','บทนี้เน้น Listening Part 2 มากกว่า Reading'],
  21:['เวลาพลาดศัพท์ให้กลับมาทบทวนบทนี้','จำศัพท์พร้อม part of speech และ collocation','Part 7 ต้องจำ synonym/paraphrase ไม่ใช่แค่คำแปล'],
  26:['Part 5 ให้ดูโครงสร้าง grammar ก่อนเมื่อ choice เป็น word family','โจทย์ผสม word form, pronoun, preposition, tense/passive, adverb, vocab, connector','จำ both…and / either…or / neither…nor / not only…but also'],
  27:['Part 6 ออก vocabulary, word form, tense, connector และ sentence insertion','grammar blank แก้จากประโยคใกล้ช่องว่างก่อน; context blank ให้อ่านรอบข้าง','sentence insertion ต้องเชื่อมได้ทั้งประโยคก่อนและหลัง'],
  28:['Single passage: อ่านคำถาม → หา keyword/synonym → skim หา evidence → อ่านจุดนั้นละเอียด','Double/Triple: skim ทุกบท → หาความสัมพันธ์ → สรุปแต่ละบท → ค่อยตอบ','หา synonym ไม่ใช่ exact word เช่น charge=fee, reschedule=postpone, cancel=call off'],
}
