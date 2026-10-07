import type { Passage, Question, SkillId } from './types'

// Original questions calibrated against the local course and reading samples.
function q(id: number, stem: string, options: string[], answer: number, skill: SkillId, ruleId: string,
  difficulty: 3 | 4 | 5, focus: string[], steps: [string, string, string], memory: string,
  reasons: [string, string, string, string], explanation: string): Question {
  const letters = ['A','B','C','D']
  return { id: `coach-p5-${id}`, part: 5, stem, choices: options.map((text,i) => ({ id: letters[i], text })),
    answer: letters[answer], skills: [skill], ruleId, difficulty, explanation, explanationTh: steps[2],
    targetSeconds: 30, coaching: { focus, steps, memory, choiceReasons: Object.fromEntries(letters.map((letter,i) => [letter,reasons[i]])) } }
}

export const coachingQuestions: Question[] = [
  q(1, 'The revised maintenance procedure has made the inspection process considerably _____ without compromising safety.',
    ['efficient','efficiency','efficiently','efficiencies'], 0, 'part-of-speech','wordform.object-complement',4,
    ['made','inspection process','considerably'],
    ['หา made + the inspection process + ช่องว่าง: process เป็นกรรมของ made', 'made + กรรม + Adj. บอกว่าทำให้กรรมมีสภาพอย่างไร; considerably เป็น Adv. ที่ขยาย Adj.', 'เลือก efficient: ทำให้กระบวนการตรวจมีประสิทธิภาพมากขึ้น ไม่ได้ขยายกริยา made'],
    'make + object + adjective · considerably + adjective',
    ['efficient เป็น Adj. บอกสภาพของ process หลังการปรับปรุง','efficiency เป็น N. แต่ช่องนี้ต้องบอกสภาพของกรรม ไม่ใช่สิ่งที่ถูกสร้าง','efficiently เป็น Adv. จะบอกวิธีทำ แต่ประโยคต้องการผลที่เกิดกับ process','efficiencies เป็น N. พหูพจน์ ใช้เติมส่วนบอกสภาพของ process ไม่ได้'],
    'Made + object + adjective describes the resulting state of the inspection process; considerably modifies efficient.'),
  q(2, 'Despite the tight deadline, the consultants submitted a _____ detailed assessment of the proposed acquisition.',
    ['remark','remarkable','remarkably','remarks'],2,'part-of-speech','wordform.adverb-modifier',3,
    ['detailed','assessment'],
    ['มองหลังช่องว่าง: detailed เป็น Adj. และ assessment เป็น N.', 'a + Adv. + Adj. + N. ช่องว่างขยาย detailed ไม่ได้ขยาย assessment โดยตรง', 'remarkably detailed = ละเอียดอย่างน่าทึ่ง จึงเลือก remarkably'],
    'อย่าตัดสินจาก a อย่างเดียว: a + Adv. + Adj. + N. ใช้ได้',
    ['remark เป็น N./V. แต่ไม่ขยาย Adj. detailed','remarkable เป็น Adj. ไม่ใช่คำขยายระดับของ detailed ในโครงสร้างนี้','remarkably เป็น Adv. ขยาย detailed ได้','remarks เป็น N. พหูพจน์ ไม่ขยาย detailed'],
    'Remarkably modifies the adjective detailed, not the noun assessment. The article does not have to be immediately followed by a noun.'),
  q(3, 'The purchasing department will not authorize payment without written _____ from the project supervisor.',
    ['approve','approved','approving','approval'],3,'part-of-speech','wordform.noun-position',3,
    ['without','written','from'],
    ['without เป็น Prep.; written เป็น Adj. ขยายคำที่จะเติม', 'หลัง without written ต้องเป็น N. ที่หมายถึงสิ่งที่ต้องได้รับก่อนจ่ายเงิน', 'approval = การอนุมัติ ทำให้ได้ without written approval from ...'],
    'preposition + adjective + noun · written approval',
    ['approve เป็น V1 ไม่ใช่คำนามหลัง written','approved เป็น V3/Adj. ยังขาดคำนามที่ written ขยาย','approving เป็น V-ing แต่ written approving ไม่ใช่วลีคำนามที่ใช้ในบริบทนี้','approval เป็น N. หมายถึงการอนุมัติเป็นลายลักษณ์อักษร'],
    'Without takes a noun phrase. Written modifies the noun approval, and from identifies the person granting it.'),
  q(4, 'Guests are advised to _____ leave the reception area so that other attendees can register without delay.',
    ['quiet','quietness','quietly','quieter'],2,'part-of-speech','wordform.adverb-modifier',3,
    ['leave','reception area'],
    ['หลังช่องว่างเป็น V1 leave; to เป็น infinitive marker ของ to leave', 'คำเติมแทรกก่อน leave เพื่อบอกวิธีออกจากบริเวณนั้น จึงขยาย V.', 'quietly = อย่างเงียบ ๆ เป็น Adv.; to quietly leave เป็น split infinitive ที่ใช้ได้'],
    'to + Adv. + V1 ใช้ได้ · ขยายการกระทำ → Adv.',
    ['quiet เป็น Adj. ไม่ขยาย V. leave ในตำแหน่งนี้','quietness เป็น N. ไม่ใช่คำบอกวิธีออกจากบริเวณ','quietly เป็น Adv. บอกวิธี leave โดยไม่รบกวนผู้ลงทะเบียนคนอื่น','quieter เป็น Adj. ขั้นกว่า ไม่ขยาย V. leave'],
    'Quietly modifies leave. To quietly leave is a grammatical split infinitive; an adjective or noun cannot modify the verb in this position.'),
  q(5, 'A list of the suppliers that meet our quality standards _____ attached to the procurement report.',
    ['are','is','have','were'],1,'subject-verb','agreement.head-noun',4,
    ['A list','of the suppliers','attached'],
    ['ประธานแท้คือ A list; of the suppliers และ that meet ... ขยาย list/suppliers', 'list เป็นเอกพจน์ และ attached ต้องใช้ be + V3 ในที่นี้', 'is attached = รายชื่อแนบอยู่กับรายงาน; ไม่ผันตาม suppliers ที่อยู่ใกล้ช่องว่าง'],
    'A list of + plural noun → ผันกริยาตาม list (เอกพจน์)',
    ['are ผันตามพหูพจน์ แต่ประธานแท้ list เป็นเอกพจน์','is ตรงกับ list และประกอบเป็น is attached','have ไม่มี been จึงไม่เป็น passive และไม่ตรงกับ list','were เป็นพหูพจน์ ไม่ตรงกับ list'],
    'The head subject is the singular noun list. Suppliers belongs to a modifying phrase, so the verb is is.'),
  q(6, 'Neither the regional manager nor the branch supervisors _____ authorized to revise the reimbursement policy.',
    ['is','has','are','was'],2,'subject-verb','agreement.neither-nor',4,
    ['Neither','nor','supervisors'],
    ['จับคู่ Neither ... nor ... แล้วดูประธานที่อยู่ใกล้กริยา', 'branch supervisors เป็นพหูพจน์ และ authorized ต้องมี be', 'ใช้ are authorized ไม่ใช่ is ตาม manager ที่อยู่ไกลกว่า'],
    'neither A nor B → กริยาสอดคล้องกับ B ที่อยู่ใกล้กว่า',
    ['is เป็นเอกพจน์ แต่ supervisors อยู่ใกล้กริยาและเป็นพหูพจน์','has ไม่เป็น be + authorized และยังเป็นเอกพจน์','are ตรงกับ supervisors และเป็น are authorized','was เป็นเอกพจน์ ไม่ตรงกับ supervisors'],
    'With neither ... nor, agreement follows the nearer subject, branch supervisors. Are authorized is the required passive form.'),
  q(7, 'By the time the new distribution center opens next April, the company _____ all of its regional delivery routes.',
    ['redesigned','has redesigned','will have redesigned','is redesigning'],2,'verb-tense','tense.future-perfect',4,
    ['By the time','opens','next April'],
    ['By the time ... next April กำหนดจุดอ้างอิงในอนาคต', 'การออกแบบ routes ใหม่จะเสร็จก่อนจุดอนาคตนั้น → future perfect', 'will have redesigned = จะออกแบบเสร็จแล้วก่อนศูนย์เปิด; opens ใน time clause ใช้ present แทนอนาคตได้'],
    'เสร็จก่อนจุดในอนาคต → will have + V3',
    ['redesigned เป็นอดีต แต่จุดอ้างอิง next April ยังอยู่ในอนาคต','has redesigned เชื่อมถึงปัจจุบัน ไม่ใช่เสร็จก่อนจุดอนาคต','will have redesigned แสดงความเสร็จสิ้นก่อนศูนย์เปิด','is redesigning บอกกำลังทำ ไม่แสดงว่าเสร็จก่อนศูนย์เปิด'],
    'Future perfect marks completion before a future reference point. Opens is present simple in a future time clause.'),
  q(8, 'When the auditors arrived yesterday, the accounting team _____ the supporting documents for more than two hours.',
    ['has reviewed','had been reviewing','will review','reviews'],1,'verb-tense','tense.past-perfect-continuous',4,
    ['arrived yesterday','for more than two hours'],
    ['arrived yesterday เป็นจุดในอดีต และ for ... two hours บอกระยะเวลาที่ทำมาก่อน', 'งานตรวจเริ่มก่อนผู้ตรวจมาถึง และเน้นระยะเวลาต่อเนื่องจนถึงจุดนั้น', 'had been reviewing เป็น past perfect continuous ที่ตรงกับทั้งลำดับและระยะเวลา'],
    'ทำต่อเนื่องมาก่อนจุดในอดีต → had been + V-ing',
    ['has reviewed อ้างอิงปัจจุบัน แต่ประโยคเล่าจุดในอดีต','had been reviewing แสดงการตรวจต่อเนื่องมาก่อน auditors มาถึง','will review เป็นอนาคต ขัดกับ yesterday','reviews เป็น present simple ไม่ตรงกับเหตุการณ์ในอดีต'],
    'Had been reviewing describes an activity continuing for a period before the auditors arrived yesterday.'),
  q(9, 'Any equipment _____ during the renovation must be reported to the facilities manager immediately.',
    ['damages','damaging','damaged','damage'],2,'passive','relative.reduced-passive',4,
    ['equipment','during the renovation','must be reported'],
    ['กริยาหลักของประโยคมีแล้วคือ must be reported', 'ช่องว่างขยาย equipment ที่ถูกทำให้เสียหาย ไม่ใช่ผู้ทำให้สิ่งอื่นเสียหาย', 'damaged = that is damaged เป็น reduced passive relative clause'],
    'N. + V3 = คำนามที่ถูกกระทำ (reduced passive clause)',
    ['damages เป็น finite verb ทำให้โครงสร้างชนกับ must be reported','damaging จะสื่อว่า equipment ทำให้สิ่งอื่นเสียหาย','damaged ขยาย equipment ที่ได้รับความเสียหาย','damage เป็น N./V1 ไม่ใช่ส่วนขยายแบบ passive ในตำแหน่งนี้'],
    'Damaged is a reduced passive relative clause modifying equipment. Must be reported already supplies the main verb.'),
  q(10, 'The revised expense guidelines must _____ to all employees before the next billing cycle begins.',
    ['communicate','be communicated','have communicating','being communicated'],1,'passive','passive.modal',3,
    ['guidelines','must','to all employees'],
    ['guidelines เป็นสิ่งที่ถูกแจ้งให้พนักงานทราบ', 'หลัง modal must ใช้ V1; เมื่อเป็น passive จึงเป็น must + be + V3', 'be communicated แปลว่าต้องถูกสื่อสารไปยังพนักงานก่อนรอบบิลใหม่'],
    'modal + be + V3 = passive หลัง modal',
    ['communicate เป็น active ทำให้ guidelines เป็นผู้สื่อสารเอง','be communicated เป็น passive และ be เป็น V1 หลัง must','have communicating ไม่ใช่รูป perfect หรือ passive ที่ถูกต้อง','being communicated ใช้ being หลัง must โดยตรงไม่ได้'],
    'The guidelines receive the action, so the modal passive is must be communicated.'),
  q(11, 'The research team is committed to _____ customer feedback into every stage of product development.',
    ['incorporate','incorporation','incorporated','incorporating'],3,'preposition','gerund.after-preposition',4,
    ['committed to','customer feedback'],
    ['to ใน be committed to เป็น Prep. ไม่ใช่ infinitive marker', 'หลัง Prep. ใช้ N./V-ing และคำนี้ต้องรับกรรม customer feedback', 'incorporating เป็น V-ing ที่รับกรรมได้ จึงได้ committed to incorporating feedback'],
    'be committed to / look forward to / object to + V-ing',
    ['incorporate เป็น V1 ใช้หลัง prepositional to ในวลีนี้ไม่ได้','incorporation เป็น N. ต้องเป็น incorporation of feedback ไม่ใช่รับกรรมตรง ๆ','incorporated เป็น V3 ไม่ใช่ noun/gerund ที่วลีนี้ต้องการ','incorporating เป็น gerund และรับกรรม customer feedback ได้'],
    'To is a preposition in committed to. Incorporating is a gerund that can take customer feedback as its object.'),
  q(12, 'Employees are eligible for reimbursement only _____ submitting itemized receipts through the online portal.',
    ['unless','upon','although','whereas'],1,'preposition','gerund.after-preposition',3,
    ['only','submitting'],
    ['หลังช่องว่างคือ submitting ... ไม่ใช่ S + finite V.', 'upon + V-ing หมายถึงเมื่อทำสิ่งนั้น เป็นเงื่อนไขเวลาที่ได้สิทธิ์', 'upon submitting = เมื่อส่งใบเสร็จแบบแยกรายการแล้วจึงมีสิทธิ์เบิก'],
    'upon + noun/V-ing = เมื่อ / ทันทีที่',
    ['unless ใช้บอกเงื่อนไขยกเว้น แต่ไม่ตรงกับความหมาย only ... submitting','upon เป็น Prep. ตามด้วย submitting ได้และตรงลำดับการเบิก','although แสดงความขัดแย้ง ไม่ใช่เงื่อนไขการได้รับสิทธิ์','whereas ใช้เทียบความต่างระหว่าง clause ไม่ใช่ V-ing phrase นี้'],
    'Upon submitting sets the event that makes employees eligible. Submitting is a gerund phrase, not a full clause.'),
  q(13, 'The warranty covers manufacturing defects _____ damage resulting from improper installation is excluded.',
    ['whereas','despite','therefore','because of'],0,'conjunction','connector.clause-vs-phrase',4,
    ['covers','damage','is excluded'],
    ['หลังช่องว่างเป็น clause: damage + is excluded', 'สองใจความต่างกัน: คุ้มครองข้อบกพร่องการผลิต แต่ไม่คุ้มครองความเสียหายติดตั้งผิด', 'whereas เชื่อมสอง clause ที่ขัดแย้งกันได้'],
    'whereas + S + V · despite / because of + noun phrase',
    ['whereas เชื่อม clause และแสดงความต่างระหว่าง covers กับ excluded','despite เป็น Prep. ไม่รับ damage ... is excluded ทั้ง clause','therefore เป็น conjunctive adverb และให้ผลลัพธ์ แต่ที่นี่เป็น contrast; ยังขาดการแบ่ง clause ที่เหมาะสม','because of เป็น Prep. และบอกเหตุผล ไม่รับ full clause นี้'],
    'Whereas introduces a contrasting clause. Despite and because of require noun phrases; therefore does not join these clauses in this structure.'),
  q(14, '_____ the initial proposal exceeded the approved budget, a revised version was requested by the finance committee.',
    ['Because of','Due to','Because','Despite'],2,'conjunction','connector.clause-vs-phrase',3,
    ['proposal','exceeded','was requested'],
    ['หลังช่องว่างมี S. the initial proposal + V. exceeded', 'ต้องเป็น conjunction ที่รับ full clause และบอกเหตุผล', 'Because เชื่อมเหตุผลว่างบเกิน จึงมีการขอฉบับปรับปรุง'],
    'because + S + V · because of / due to + noun phrase',
    ['Because of รับ noun phrase ไม่ใช่ proposal exceeded ...','Due to รับ noun phrase ไม่ใช่ full clause นี้','Because รับ S + V และตรงความสัมพันธ์เหตุผล','Despite รับ noun phrase และแสดงความขัดแย้ง ไม่ตรงทั้งรูปและความหมาย'],
    'Because takes the full clause the initial proposal exceeded ... and gives the reason for requesting a revision.'),
  q(15, 'The consultant _____ recommendations led to substantial cost savings has been invited to speak at the annual meeting.',
    ['who','whom','whose','which'],2,'relative-clause','relative.pronouns',4,
    ['consultant','recommendations','led'],
    ['หลังช่องว่างมี N. recommendations ตามด้วย V. led', 'recommendations เป็นประธานของ led อยู่แล้ว ช่องว่างต้องแสดงว่าเป็นคำแนะนำของ consultant', 'whose + recommendations = คำแนะนำของที่ปรึกษาคนนั้น'],
    'whose + noun = แสดงเจ้าของ ไม่จำกัดว่าต้องเป็นคนเสมอไป',
    ['who ใช้เป็น subject แต่ recommendations เป็น subject ของ led อยู่แล้ว','whom ใช้เป็น object แต่ช่องนี้ไม่ได้ขาดกรรม','whose แสดงเจ้าของของ recommendations','which ไม่แสดงเจ้าของและ consultant เป็นคน'],
    'Whose modifies recommendations to show possession. Recommendations is already the subject of led.'),
  q(16, 'The revised projections are more conservative than _____ presented at last month’s shareholders’ meeting.',
    ['that','those','them','their'],1,'pronoun','pronoun.comparison-substitute',4,
    ['projections','than','presented'],
    ['กำลังเปรียบเทียบ projections ชุดใหม่กับ projections ชุดก่อน', 'คำแทนต้องเป็นพหูพจน์ และมี presented ... ขยายต่อได้', 'those presented = the projections that were presented'],
    'เปรียบเทียบ N. เอกพจน์ → that; พหูพจน์ → those',
    ['that แทนเอกพจน์ แต่ projections เป็นพหูพจน์','those แทน projections พหูพจน์และมี reduced clause ขยายได้','them เป็น object pronoun แต่ใช้เป็นตัวแทนนามพร้อมส่วนขยาย presented แบบนี้ไม่ตรง','their เป็น possessive determiner ต้องมีคำนามตามหลัง'],
    'Those substitutes for the plural noun projections and is modified by presented at ... .'),
  q(17, 'The newly installed processing equipment operates far _____ than the machinery it replaced.',
    ['efficient','most efficiently','more efficiently','efficiency'],2,'comparison','comparison.adverb',4,
    ['operates','far','than'],
    ['than บอกการเปรียบเทียบสองชุด และ operates คือกริยาที่ถูกขยาย', 'ต้องเป็น comparative adverb; far เพิ่มระดับความต่างได้', 'more efficiently เป็น Adv. ขั้นกว่า แปลว่าทำงานมีประสิทธิภาพมากกว่า'],
    'V. + far/much + more + Adv. + than',
    ['efficient เป็น Adj. ไม่ขยาย operates และยังไม่เป็นขั้นกว่า','most efficiently เป็นขั้นสูงสุด ไม่ใช่เปรียบเทียบกับ machinery ด้วย than','more efficiently เป็น comparative adverb ขยาย operates','efficiency เป็น N. ไม่ขยายกริยาและไม่เป็นรูปเปรียบเทียบ'],
    'Operates needs an adverb and than requires a comparative. Far intensifies more efficiently.'),
  q(18, 'Of all the bids received, the one submitted by Hartwell Construction was _____ the most competitive.',
    ['far','by far','so far','as far'],1,'comparison','comparison.superlative-intensifier',4,
    ['Of all','the most competitive'],
    ['Of all และ the most competitive บอกขั้นสูงสุด', 'ช่องว่างเพิ่มน้ำหนักว่าต่างจากรายอื่นมาก ไม่ใช่บอกระยะทางหรือเวลาถึงตอนนี้', 'by far the most competitive = แข่งขันได้ดีที่สุดอย่างชัดเจน'],
    'by far + the + superlative · far + comparative',
    ['far อย่างเดียวใช้กับ comparative เช่น far better ไม่ใช่ far the most ในแบบนี้','by far เป็นวลีเพิ่มน้ำหนัก superlative ได้','so far หมายถึงจนถึงตอนนี้ ไม่ใช่วลีขยายระดับ most competitive ในตำแหน่งนี้','as far ต้องมีโครงสร้างต่อ เช่น as far as ไม่ใช่ขยาย the most'],
    'By far intensifies a superlative; far alone normally intensifies a comparative, while so far expresses time.'),
  q(19, 'The supplier has agreed to _____ the additional shipping costs incurred because of its packing error.',
    ['absorb','attract','occupy','retain'],0,'collocation','vocab.business-collocation',4,
    ['shipping costs','packing error'],
    ['หลัง agreed to ตัวเลือกเป็น V1 เหมือนกัน ไวยากรณ์ตัดไม่ได้', 'shipping costs เกิดจากความผิดผู้ขาย จึงต้องหมายถึงผู้ขายรับภาระค่าใช้จ่าย', 'absorb the costs = รับภาระค่าใช้จ่ายเอง'],
    'absorb/bear the costs = รับภาระค่าใช้จ่าย',
    ['absorb ใช้กับ costs หมายถึงรับภาระค่าใช้จ่ายแทนการส่งต่อให้ลูกค้า','attract หมายถึงดึงดูด เช่น attract customers ไม่ใช่รับภาระ costs','occupy หมายถึงใช้พื้นที่หรือครองตำแหน่ง ไม่ใช้กับค่าใช้จ่าย','retain หมายถึงเก็บรักษาหรือคงไว้ ไม่ใช่รับผิดชอบค่าใช้จ่ายจากความผิด'],
    'All choices are base verbs. Absorb costs means bear the expense rather than pass it on to the customer.'),
  q(20, 'The agreement will remain in _____ until either party provides thirty days’ written notice of termination.',
    ['power','force','strength','pressure'],1,'collocation','vocab.business-collocation',4,
    ['agreement','remain in','termination'],
    ['ทั้งสี่เป็น N. แต่บริบทเป็นการมีผลของสัญญาจนกว่าจะบอกเลิก', 'วลีมาตรฐานคือ remain in force ไม่ใช่แปลคำว่าแรงทีละคำ', 'in force = มีผลบังคับใช้อยู่'],
    'remain in force / come into effect = มีผลบังคับใช้',
    ['in power ใช้กับคนหรือรัฐบาลที่มีอำนาจ ไม่ใช่สถานะสัญญา','in force เป็นวลีที่หมายถึงสัญญายังมีผลบังคับ','strength หมายถึงความแข็งแรง แต่ in strength ไม่ใช่วลีสำหรับสัญญามีผล','pressure หมายถึงความกดดัน; ปกติ under pressure และไม่ตรงความหมาย'],
    'In force is the fixed phrase for an agreement that remains legally effective. In power refers to authority.'),
  q(21, 'To avoid disrupting production, maintenance work will be carried out at the earliest _____ opportunity.',
    ['convenient','convenience','conveniently','convene'],0,'part-of-speech','wordform.adjective-before-noun',3,
    ['earliest','opportunity'],
    ['หลังช่องว่างคือ N. opportunity', 'ต้องใช้ Adj. ขยาย opportunity; earliest เป็น superlative ขยายเวลา', 'convenient opportunity = โอกาสที่สะดวกเหมาะสม ไม่กระทบการผลิต'],
    'at the earliest convenient opportunity · Adj. + N.',
    ['convenient เป็น Adj. ขยาย opportunity','convenience เป็น N. ไม่ใช่รูปที่ใช้ในวลีนี้','conveniently เป็น Adv. ไม่ขยาย N. opportunity โดยตรง','convene เป็น V. หมายถึงเรียกประชุม ไม่ตรงตำแหน่ง'],
    'Convenient is an adjective modifying opportunity in the phrase at the earliest convenient opportunity.'),
  q(22, 'Applications received after the closing date will not be considered, _____ of the applicant’s qualifications.',
    ['regarding','regardless','regard','regarded'],1,'vocabulary','vocab.fixed-regardless-of',4,
    ['not be considered','of','qualifications'],
    ['หลังช่องว่างมี of ... qualifications อยู่แล้ว', 'ประโยคบอกว่าช้าแล้วไม่รับพิจารณา แม้คุณสมบัติจะดีอย่างไร', 'regardless of = ไม่คำนึงถึง / ไม่ว่าคุณสมบัติจะเป็นอย่างไร'],
    'regardless of + noun phrase = ไม่คำนึงถึง',
    ['regarding เป็น Prep. ความหมายเกี่ยวกับ และไม่ตามด้วย of ในวลีนี้','regardless จับคู่ of ได้และสื่อว่าเงื่อนไขวันปิดรับสำคัญกว่าคุณสมบัติ','regard เป็น N./V. ต้องใช้รูปอื่น เช่น with regard to เพื่อหมายถึงเกี่ยวกับ','regarded เป็น V3 ไม่ประกอบเป็นวลี regardless of'],
    'Regardless of means without taking qualifications into account. Regarding does not take of.'),
  q(23, 'Please notify the venue coordinator _____ advance if any participants require special dietary arrangements.',
    ['in','on','at','by'],0,'preposition','preposition.fixed-phrase',3,
    ['notify','advance'],
    ['notify ... advance หมายถึงให้แจ้งเรื่องอาหารล่วงหน้า', 'advance ในวลีนี้เป็น N. และใช้คู่กับ in', 'in advance = ล่วงหน้า ไม่ใช่กำหนด deadline แบบ by + เวลา'],
    'notify someone in advance · by + deadline',
    ['in advance เป็นวลีมาตรฐานที่หมายถึงล่วงหน้า','on advance ไม่ใช่วลีเวลาที่ใช้ในบริบทนี้','at advance ไม่ใช่วลีที่หมายถึงล่วงหน้า','by ต้องตามด้วยจุดกำหนดเวลา เช่น by Friday ไม่ใช่ advance'],
    'In advance is the fixed time expression meaning beforehand. By would require a deadline, such as by Friday.'),
  q(24, 'The annual report, along with the supporting schedules, _____ available on the investor relations website.',
    ['are','have been','were','is'],3,'subject-verb','agreement.head-noun',4,
    ['annual report','along with','available'],
    ['ประธานแท้คือ The annual report; along with ... เป็นส่วนแทรก', 'report เป็นเอกพจน์ และ available เป็น Adj. หลัง linking be', 'is available ตรงกับ report; schedules ไม่ได้ทำให้ประธานกลายเป็นพหูพจน์'],
    'A, along with B, → ผันตาม A; ต่างจาก A and B',
    ['are เป็นพหูพจน์ แต่ประธาน report เป็นเอกพจน์','have been เป็นพหูพจน์; หากใช้ perfect ต้องเป็น has been','were เป็นพหูพจน์ ไม่ตรง report','is เป็นเอกพจน์และเชื่อม available กับ annual report'],
    'Along with does not make the head subject plural. The singular report takes is available.'),
]

export const coachingPassages: Passage[] = [
  { id:'coach-p6-notice',part:6,kind:'notice',title:'Supplier Portal Migration',body:`NORTHSTAR PROCUREMENT
NOTICE TO APPROVED SUPPLIERS
Effective November 3

Our purchasing team is replacing the current supplier portal to reduce duplicate entries and improve payment tracking. Suppliers are asked to verify that their banking details are [1] _____ before the transfer begins.

The existing portal will remain accessible through November 2. [2] _____, no new invoices may be uploaded there after October 30. Any invoices submitted by that date will be transferred automatically; suppliers should not upload them a second time.

[3] _____

If you cannot sign in after the transfer, contact the support desk rather than create a new account. This will prevent your payment history from being [4] _____ across multiple profiles.`,questions:[101,102,103,104].map(n=>`coach-p6-${n}`) },
  { id:'coach-p6-email',part:6,kind:'email',title:'Revised Workshop Arrangements',body:`To: Department Coordinators
From: Maya Chen, Learning and Development
Subject: November 12 Workshop

Thank you for sending your staff nominations for the customer-service workshop. Because the number of participants has exceeded our original estimate, the session [1] _____ from Room 204 to the main auditorium.

The starting time remains 9:30 A.M. Please ask participants to arrive fifteen minutes early so that registration can be completed [2] _____ the opening presentation.

[3] _____

The training materials will be distributed electronically. Participants who prefer a printed copy should make their own arrangements, as the venue is unable to [4] _____ last-minute printing requests.`,questions:[105,106,107,108].map(n=>`coach-p6-${n}`) },
  { id:'coach-p7-order',part:7,kind:'multi',title:'Office Furniture Order · Three Documents',body:`DOCUMENT 1 — ORDER CONFIRMATION
Oakline Office Interiors
Order OI-2186 · Customer: Cedarbridge Consulting
Confirmed May 4

Six Alder task chairs have been reserved for delivery on May 14. The price is $180 per chair. Orders of at least six chairs qualify for free delivery. Optional assembly costs $12 per chair and must be requested at least three business days before delivery. An invoice will be issued after delivery; payment is due within fourteen calendar days of the invoice date.

DOCUMENT 2 — CUSTOMER EMAIL
To: orders@oakline.example
From: Lina Patel, Cedarbridge Consulting
Date: May 8
Subject: Order OI-2186

Our office renovation has fallen behind schedule, so please postpone delivery until May 21. We no longer need one of the chairs because an employee will continue working remotely. Please deliver the remaining five chairs fully assembled. I understand that reducing the quantity means our order no longer qualifies for free delivery; please add the standard $35 delivery charge. Please confirm the revised total before dispatch.

DOCUMENT 3 — SUPPLIER REPLY
To: Lina Patel
Date: May 9
Subject: Re: Order OI-2186

We have updated your order as requested. The assembly team is available on the revised date, and no rescheduling fee will apply. Your invoice will be dated May 21 and will show the updated quantity and additional services. Please refer to the attached estimate for the itemized charges.`,visual:'invoice',visualTitle:'Revised estimate · OI-2186',visualData:['Item|Quantity|Unit price|Amount','Alder task chair|5|$180|$900','Assembly|5|$12|$60','Delivery|1|$35|$35','TOTAL|||$995'],questions:[201,202,203,204,205].map(n=>`coach-p7-${n}`) },
]

const textCompletionSeeds = [
  q(101,'[1] Suppliers are asked to verify that their banking details are _____ before the transfer begins.', ['accuracy','accurately','accurate','accurateness'],2,'part-of-speech','p6.word-form',3,['details','are'],
    ['หา details + are + ช่องว่าง ในประโยคเรื่องตรวจข้อมูลธนาคาร','ช่องว่างบอกสภาพของ details หลัง linking be จึงต้องเป็น Adj.','accurate = ข้อมูลถูกต้อง; accurately จะขยายการกระทำ ไม่บอกสภาพของ details'],
    'S. + be + Adj. บอกสภาพ', ['accuracy เป็น N. แต่ตรงนี้ต้องบอกสภาพ','accurately เป็น Adv. ไม่ใช่ส่วนเติมเต็มบอกสภาพของ details','accurate เป็น Adj. บอกว่าข้อมูลถูกต้อง','accurateness เป็น N. ไม่ใช่ Adj.'], 'Accurate is an adjective describing the banking details after are.'),
  q(102,'[2] _____, no new invoices may be uploaded there after October 30.', ['Therefore','However','Similarly','For instance'],1,'context','p6.connector-context',4,['November 2','October 30'],
    ['อ่านประโยคก่อน: ยังเข้า portal ได้ถึง November 2','ประโยคนี้จำกัดว่าการส่ง invoice ใหม่หยุดก่อนหน้านั้นคือ October 30 จึงเป็นข้อจำกัดที่สวนความคาดหมาย','However แสดงว่าแม้เข้าได้ แต่ส่ง invoice ใหม่ไม่ได้หลังวันตัดรอบ'],
    'เข้าใช้งานได้ ≠ ส่งรายการใหม่ได้; อ่านข้อจำกัดหลัง However', ['Therefore บอกผลจากประโยคก่อน แต่การเปิดใช้งานถึง Nov 2 ไม่ใช่เหตุผลที่ส่งไม่ได้หลัง Oct 30','However เชื่อมข้อมูลว่ายังเข้าได้แต่มีข้อจำกัด','Similarly ต้องเพิ่มเรื่องที่เหมือนกัน แต่สองวันใช้ต่างหน้าที่','For instance ต้องยกตัวอย่าง แต่ประโยคนี้กำหนดข้อจำกัด'], 'However contrasts continued access with an earlier cutoff for submitting new invoices.'),
  q(103,'[3] _____', ['The old invoices will therefore need to be entered manually.','Only suppliers with unpaid invoices should verify their details.','The company plans to expand its warehouse next year.','A guide to accessing the replacement portal will be emailed on November 1.'],3,'sentence-placement','p6.sentence-placement',4,['transferred automatically','cannot sign in'],
    ['ก่อนช่องว่างพูดถึงการโอน invoice อัตโนมัติ; หลังช่องว่างพูดถึงปัญหาเข้า portal ใหม่','ประโยคที่เชื่อมได้ต้องช่วยให้เข้าระบบใหม่ และไม่ขัดกับการโอนข้อมูลอัตโนมัติ','คู่มือเข้า portal ใหม่จะส่ง Nov 1 จึงเชื่อมจากการย้ายข้อมูลไปสู่ขั้นตอนใช้งานได้'],
    'เติมประโยค: เช็กหัวข้อ + ข้อเท็จจริงก่อนหน้า + การเชื่อมไปประโยคหลัง', ['manual entry ขัดกับ transferred automatically และ should not upload ... a second time','Only suppliers with unpaid invoices ขัดกับการขอให้ suppliers ตรวจข้อมูลโดยทั่วไป','warehouse เป็นคนละหัวข้อกับ supplier portal','คู่มือระบบใหม่เชื่อมกับ sign in ที่ตามมาและอยู่ก่อนวันเปลี่ยนระบบ'], 'The access guide bridges the migration instructions and the following advice about sign-in problems.'),
  q(104,'[4] This will prevent your payment history from being _____ across multiple profiles.', ['fragmented','fragment','fragmenting','fragments'],0,'passive','p6.passive-tense',4,['from being','payment history'],
    ['payment history เป็นสิ่งที่ถูกแยกกระจายถ้าสร้างหลายบัญชี','prevent ... from + V-ing → from being + V3 เป็น passive gerund','fragmented ทำให้ได้ from being fragmented = ป้องกันประวัติถูกกระจายหลายโปรไฟล์'],
    'prevent something from being + V3', ['fragmented เป็น V3 หลัง being และสื่อว่าประวัติถูกแยก','fragment เป็น V1 ไม่ประกอบ passive หลัง being','fragmenting เป็น active participle และขาดสิ่งที่ history ทำให้กระจาย','fragments เป็น finite verb/N. พหูพจน์ ไม่ใช้หลัง being ในแบบนี้'], 'Being fragmented is a passive gerund after prevent ... from, with payment history receiving the action.'),
  q(105,'[1] Because the number of participants has exceeded our original estimate, the session _____ from Room 204 to the main auditorium.', ['has been moved','have been moved','moving','was moving'],0,'passive','p6.passive-tense',4,['has exceeded','from Room 204'],
    ['จำนวนผู้เข้าร่วมเกินแล้ว ผู้ส่งอีเมลกำลังแจ้งการเปลี่ยนห้องที่มีผลตอนนี้','session เป็นสิ่งที่ถูกย้าย และต้องมีกริยาที่สมบูรณ์ใน clause','has been moved เป็น present perfect passive แสดงการย้ายเสร็จแล้วและมีผลต่อการมาร่วมงาน'],
    'แจ้งสิ่งที่ถูกเปลี่ยนและมีผลตอนนี้ → has/have been + V3', ['has been moved มีทั้ง perfect และ passive','have been moved ไม่สอดคล้องกับ session ซึ่งเป็นเอกพจน์','moving ไม่มี auxiliary จึงเป็นกริยาหลักสมบูรณ์ไม่ได้','was moving บอกการกำลังเคลื่อนในอดีต ไม่ตรงการแจ้งห้องใหม่ปัจจุบัน'], 'The session has been moved is passive and reports a completed change relevant to the current arrangements.'),
  q(106,'[2] Please ask participants to arrive fifteen minutes early so that registration can be completed _____ the opening presentation.', ['while','before','unless','although'],1,'preposition','p6.preposition',3,['registration','opening presentation'],
    ['หลังช่องว่างเป็น noun phrase: the opening presentation','ต้องเสร็จลงทะเบียนก่อนการนำเสนอเริ่ม จึงใช้ preposition บอกลำดับเวลา','before + noun phrase ตรงทั้งรูปและความหมาย'],
    'before + N. / V-ing หรือ before + S + V ขึ้นกับสิ่งที่ตามมา', ['while ต้องมี clause หรือ reduced clause ไม่รับ noun phrase นี้โดยตรง','before เป็น Prep. ตามด้วย noun phrase ได้และบอกก่อนเริ่มนำเสนอ','unless บอกเงื่อนไขยกเว้นและไม่รับ noun phrase แบบนี้','although ใช้ contrast clause ไม่ใช่ noun phrase นี้'], 'Before takes the noun phrase the opening presentation and states when registration must be completed.'),
  q(107,'[3] _____', ['The auditorium was closed for repairs last week.','Late arrivals may postpone the opening presentation.','Signs in the lobby will direct attendees to the new location.','The workshop has been canceled because of low enrollment.'],2,'sentence-placement','p6.sentence-placement',4,['main auditorium','arrive fifteen minutes early'],
    ['อีเมลแจ้งเปลี่ยนห้องแต่เวลาเดิม และขอให้มาถึงก่อน','ประโยคที่เพิ่มควรช่วยผู้เข้าร่วมหาห้องใหม่ โดยไม่เปลี่ยนเงื่อนไขงาน','ป้ายใน lobby ชี้ทางไปสถานที่ใหม่ จึงต่อเรื่องการมาถึงและการเปลี่ยนห้องได้'],
    'ประโยคแทรกต้องมีหน้าที่ในเอกสาร เช่น ช่วยผู้รับทำตามคำแนะนำ', ['การปิดซ่อมสัปดาห์ก่อนเป็นข้อมูลย้อนอดีตที่ไม่ช่วยผู้รับไปห้องใหม่','postpone opening ขัดกับข้อความ starting time remains 9:30','ป้ายช่วยหาห้องใหม่และเชื่อมกับคำแนะนำการมาถึง','canceled และ low enrollment ขัดกับทั้งจำนวนที่เกินและคำแนะนำเข้าร่วม'], 'Lobby signs help attendees find the changed venue and continue the arrival instructions.'),
  q(108,'[4] Participants who prefer a printed copy should make their own arrangements, as the venue is unable to _____ last-minute printing requests.', ['accumulate','accommodate','accompany','acquire'],1,'collocation','p6.fixed-phrase',4,['unable to','printing requests'],
    ['unable to ตามด้วย V1 ซึ่งทุกตัวเลือกเป็น V1','ผู้เข้าร่วมต้องจัดพิมพ์เองเพราะสถานที่ไม่สามารถรองรับคำขอเร่งด่วนได้','accommodate requests = รองรับหรือจัดให้ตามคำขอ'],
    'accommodate a request / accommodate guests = รองรับ', ['accumulate คือสะสม ไม่ใช่รองรับคำขอ','accommodate คือจัดให้ตามคำขอ ตรงกับ printing requests','accompany คือไปด้วย/ประกอบ ไม่ใช่ทำตามคำขอ','acquire คือได้มาหรือซื้อ ไม่ใช่รองรับคำขอ'], 'Accommodate requests means make arrangements to meet them. The context concerns the venue’s inability to provide printing.'),
]

export const coachingPart6: Question[] = textCompletionSeeds.map(item => ({ ...item, id:item.id.replace('p5','p6'),part:6,passageId:Number(item.id.split('-').at(-1)) <= 104 ? 'coach-p6-notice' : 'coach-p6-email' }))

const orderSeeds = [
  q(201,'Why does Ms. Patel request a later delivery date?', ['The supplier has no chairs in stock.','Work on her office is taking longer than planned.','An employee will be away until May 21.','The assembly team cannot work on May 14.'],1,'detail','reading.evidence',3,['renovation has fallen behind schedule'],
    ['คำถามถามเหตุผลที่เปลี่ยนวันส่ง ไม่ใช่เหตุผลที่ลดจำนวน','Email ลูกค้าบอก renovation has fallen behind schedule = งานปรับปรุงล่าช้า','เลือกงานที่สำนักงานใช้เวลานานกว่าที่วางไว้ เป็น paraphrase ของเหตุผลใน email'],
    'แยกเหตุผลของแต่ละการเปลี่ยนแปลง: วันส่ง / จำนวน / บริการ', ['confirmation บอก reserved แล้ว ไม่ได้ขาดสต็อก','office renovation ล่าช้าเป็นเหตุผลที่เลื่อนวันส่ง','พนักงานทำงาน remote เป็นเหตุผลลดจำนวน ไม่ใช่เลื่อนวัน','ไม่มีข้อมูลว่า assembly team ว่างไม่ได้ใน May 14'], 'The customer explicitly says the renovation has fallen behind schedule.'),
  q(202,'What change causes a delivery fee to be added?', ['Requesting assembled chairs','Postponing delivery by one week','Reducing the order quantity','Paying after the delivery date'],2,'multi-text','reading.cross-reference',4,['at least six','remaining five'],
    ['Confirmation กำหนด free delivery สำหรับอย่างน้อย 6 ตัว','Email ลดเหลือ 5 ตัว จึงต่ำกว่าเงื่อนไขขั้นต่ำ','ค่าจัดส่งเกิดจากลดจำนวน ไม่ใช่ค่าประกอบหรือค่าเลื่อนวัน'],
    'เอกสาร 1 = กฎ · เอกสาร 2 = ข้อมูลใหม่ → ตรวจว่าเข้าเงื่อนไขไหม', ['assembly เป็นค่าบริการ $12 ต่อชิ้น แยกจาก delivery','Supplier บอกไม่มี rescheduling fee','ลดเหลือ 5 ทำให้ไม่ถึง at least six สำหรับ free delivery','เงื่อนไขเดิมจ่ายหลัง invoice อยู่แล้ว ไม่ใช่สาเหตุค่าจัดส่ง'], 'Five chairs no longer meet the original six-chair threshold for free delivery.'),
  q(203,'What is the revised total for Order OI-2186?', ['$900','$935','$960','$995'],3,'multi-text','reading.cross-reference',4,['five chairs','fully assembled','$35'],
    ['ลูกค้าขอ 5 ตัว ประกอบครบ และยอมรับค่าจัดส่ง $35','ราคาเก้าอี้ 5×180 = 900; ประกอบ 5×12 = 60; ส่ง 35','รวม 900 + 60 + 35 = $995 ตรงกับ estimate'],
    'รวมราคา base + บริการเพิ่มเติม + ค่าที่ไม่ผ่านเงื่อนไขฟรี', ['$900 รวมเฉพาะเก้าอี้ ขาด assembly และ delivery','$935 รวมเก้าอี้และ delivery แต่ขาด assembly $60','$960 รวมเก้าอี้และ assembly แต่ขาด delivery $35','$995 รวมทั้ง 3 รายการครบ'], 'The total is five chairs at $180 plus five assembly charges at $12 plus $35 delivery: $995.'),
  q(204,'By what date should Cedarbridge Consulting pay the invoice?', ['May 23','May 28','June 4','June 14'],2,'multi-text','reading.cross-reference',5,['fourteen calendar days','dated May 21'],
    ['Confirmation ระบุชำระภายใน 14 calendar days ของวันที่ invoice','Reply ยืนยัน invoice จะลงวันที่ May 21 ไม่ใช่วัน confirmation หรือวันส่งเดิม','May 21 + 14 วัน = June 4; ไม่ใช่ 14 business days'],
    'หาวันอ้างอิงใหม่จากเอกสารล่าสุด แล้วใช้กติกาจากเอกสารแรก', ['May 23 จะมาจาก May 9 + 14 แต่ May 9 เป็นวันที่ email ไม่ใช่ invoice','May 28 มาจากวันส่งเดิม May 14 + 14 ซึ่งถูกเปลี่ยนแล้ว','June 4 คือ 14 calendar days หลัง invoice May 21','June 14 ใช้ช่วงเวลาที่ไม่มีระบุในเงื่อนไข'], 'The invoice is dated May 21, and payment is due fourteen calendar days later, on June 4.'),
  q(205,'What is suggested about the assembly service?', ['It is included in the chair price.','It has been canceled for this order.','It will delay delivery until June.','It can be provided on the rescheduled delivery date.'],3,'inference','reading.evidence',4,['assembly team is available','revised date'],
    ['อ่าน supplier reply ที่ยืนยันคำขอใหม่ของลูกค้า','assembly team is available on the revised date สนับสนุนว่าจัดประกอบให้ตามวันใหม่ได้','เลือกให้บริการประกอบในวันส่งที่เลื่อน ไม่อนุมานเกินข้อมูลว่าฟรีหรือใช้เวลานานขึ้น'],
    'inference ที่ดีต้องมีประโยคสนับสนุน ไม่เติมข้อมูลเอง', ['confirmation คิดค่า assembly $12 ต่อชิ้น ไม่รวมในราคาตัวเก้าอี้','reply ยืนยัน available ไม่ได้ยกเลิก assembly','ไม่มีข้อมูลเลื่อนถึง June; revised date คือ May 21','ทีมพร้อมในวันใหม่ จึงให้บริการตามวันที่เลื่อนได้'], 'The supplier confirms the assembly team is available on the revised date.'),
]
export const coachingPart7: Question[] = orderSeeds.map((item,index) => ({ ...item,id:item.id.replace('p5','p7'),part:7,passageId:'coach-p7-order',targetSeconds:75,evidence:[
  'Our office renovation has fallen behind schedule', 'Orders of at least six chairs qualify for free delivery.',
  'Please deliver the remaining five chairs fully assembled.', 'Your invoice will be dated May 21', 'The assembly team is available on the revised date',
][index] }))
