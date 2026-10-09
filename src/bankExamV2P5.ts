import type { Question } from './types'

// Original TOEIC-style business questions. Editorial Thai rationales are specific to each choice.
// The difficulty flag is an internal practice estimate, NOT an ETS score or licensed exam item.
export const advancedPart5: Question[] = [
  {
    "id": "exam2-p5-001",
    "part": 5,
    "stem": "The purchasing team will _____ the bids based on price, delivery time, and warranty coverage.",
    "choices": [
      {
        "id": "A",
        "text": "estimate"
      },
      {
        "id": "B",
        "text": "evaluate"
      },
      {
        "id": "C",
        "text": "enclose"
      },
      {
        "id": "D",
        "text": "enroll"
      }
    ],
    "answer": "B",
    "skills": [
      "vocabulary"
    ],
    "ruleId": "exam2.vocabulary.1",
    "difficulty": 4,
    "explanation": "evaluate bids = ประเมินข้อเสนอราคาโดยเทียบเกณฑ์ต่าง ๆ ทั้งราคา เวลา และการรับประกัน",
    "explanationTh": "evaluate bids = ประเมินข้อเสนอราคาโดยเทียบเกณฑ์ต่าง ๆ ทั้งราคา เวลา และการรับประกัน",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The purchasing team = ประธาน; will evaluate = กริยา; the bids = กรรม; ช่องว่างเป็น V1 หลังกริยาช่วย will",
        "จุดบอกใบ้ “based on price, delivery time, and warranty coverage” → evaluate bids = ประเมินข้อเสนอราคาโดยเทียบเกณฑ์ต่าง ๆ ทั้งราคา เวลา และการรับประกัน",
        "คำตอบ D. evaluate; จำรูปแบบ evaluate bids/proposals = ประเมินข้อเสนอ"
      ],
      "memory": "evaluate bids/proposals = ประเมินข้อเสนอ",
      "choiceReasons": {
        "A": "estimate = ประมาณตัวเลข/ค่าใช้จ่าย ไม่ครอบคลุมการตัดสินจากหลายเกณฑ์",
        "B": "evaluate = ประเมินข้อเสนอโดยใช้เกณฑ์ราคาและเงื่อนไขหลายด้าน",
        "C": "enclose = แนบเอกสาร/ปิดล้อม ไม่ใช่การวิเคราะห์ข้อเสนอ",
        "D": "enroll = ลงทะเบียนคนเข้าร่วม ไม่ใช้กับ bids"
      },
      "breakdown": {
        "subject": "The purchasing team",
        "verb": "will evaluate",
        "object": "the bids",
        "blankRole": "V1 หลังกริยาช่วย will",
        "signal": "based on price, delivery time, and warranty coverage",
        "pattern": "evaluate bids/proposals = ประเมินข้อเสนอ"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-002",
    "part": 5,
    "stem": "The project's completion date is _____ upon receiving the necessary permits.",
    "choices": [
      {
        "id": "A",
        "text": "compatible"
      },
      {
        "id": "B",
        "text": "contingent"
      },
      {
        "id": "C",
        "text": "consecutive"
      },
      {
        "id": "D",
        "text": "comprehensive"
      }
    ],
    "answer": "B",
    "skills": [
      "collocation"
    ],
    "ruleId": "exam2.collocation.2",
    "difficulty": 5,
    "explanation": "be contingent upon + N./V-ing = ขึ้นอยู่กับการได้รับใบอนุญาตก่อน จึงระบุวันเสร็จโครงการได้",
    "explanationTh": "be contingent upon + N./V-ing = ขึ้นอยู่กับการได้รับใบอนุญาตก่อน จึงระบุวันเสร็จโครงการได้",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The project's completion date = ประธาน; is contingent = กริยา; upon receiving the necessary permits = กรรม; ช่องว่างเป็น Adj. complement หลัง is",
        "จุดบอกใบ้ “upon receiving” → be contingent upon + N./V-ing = ขึ้นอยู่กับการได้รับใบอนุญาตก่อน จึงระบุวันเสร็จโครงการได้",
        "คำตอบ B. contingent; จำรูปแบบ be contingent on/upon + N. = ขึ้นอยู่กับ"
      ],
      "memory": "be contingent on/upon + N. = ขึ้นอยู่กับ",
      "choiceReasons": {
        "A": "compatible = เข้ากันได้ มักใช้ compatible with ไม่ใช่ compatible upon",
        "B": "contingent = ขึ้นอยู่กับเงื่อนไข เข้าคู่กับ upon",
        "C": "consecutive = ติดต่อกัน ใช้ขยายจำนวนวัน/เหตุการณ์ ไม่ใช่เงื่อนไข",
        "D": "comprehensive = ครอบคลุม ใช้บอกความครบถ้วนของเนื้อหา ไม่ใช่เงื่อนไข"
      },
      "breakdown": {
        "subject": "The project's completion date",
        "verb": "is contingent",
        "object": "upon receiving the necessary permits",
        "blankRole": "Adj. complement หลัง is",
        "signal": "upon receiving",
        "pattern": "be contingent on/upon + N. = ขึ้นอยู่กับ"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-003",
    "part": 5,
    "stem": "The revised procedure aims to _____ delays caused by incomplete documentation.",
    "choices": [
      {
        "id": "A",
        "text": "relocate"
      },
      {
        "id": "B",
        "text": "reimburse"
      },
      {
        "id": "C",
        "text": "minimize"
      },
      {
        "id": "D",
        "text": "reconsider"
      }
    ],
    "answer": "C",
    "skills": [
      "vocabulary"
    ],
    "ruleId": "exam2.vocabulary.3",
    "difficulty": 4,
    "explanation": "aims to + V1; minimize delays = ทำให้ความล่าช้าน้อยที่สุด โดย caused by ... เป็นส่วนขยาย delays",
    "explanationTh": "aims to + V1; minimize delays = ทำให้ความล่าช้าน้อยที่สุด โดย caused by ... เป็นส่วนขยาย delays",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The revised procedure = ประธาน; aims to minimize = กริยา; delays = กรรม; ช่องว่างเป็น V1 หลัง to เพื่อบอกเป้าหมาย",
        "จุดบอกใบ้ “caused by incomplete documentation” → aims to + V1; minimize delays = ทำให้ความล่าช้าน้อยที่สุด โดย caused by ... เป็นส่วนขยาย delays",
        "คำตอบ D. minimize; จำรูปแบบ minimize delays/disruption/risk"
      ],
      "memory": "minimize delays/disruption/risk",
      "choiceReasons": {
        "A": "relocate = ย้ายสถานที่/ตำแหน่ง ไม่ใช้ลดความล่าช้า",
        "B": "reimburse = ชดใช้เงิน/คืนค่าใช้จ่าย ไม่รับ delays เป็นกรรม",
        "C": "minimize = ลดให้เหลือน้อยที่สุด เข้าคู่กับ delays",
        "D": "reconsider = ทบทวนการตัดสินใจ ไม่ได้ลด delays โดยตรง"
      },
      "breakdown": {
        "subject": "The revised procedure",
        "verb": "aims to minimize",
        "object": "delays",
        "blankRole": "V1 หลัง to เพื่อบอกเป้าหมาย",
        "signal": "caused by incomplete documentation",
        "pattern": "minimize delays/disruption/risk"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-004",
    "part": 5,
    "stem": "The director asked that the revised cost estimates _____ before the next board meeting.",
    "choices": [
      {
        "id": "A",
        "text": "be submitted"
      },
      {
        "id": "B",
        "text": "are submitted"
      },
      {
        "id": "C",
        "text": "were submitting"
      },
      {
        "id": "D",
        "text": "will submit"
      }
    ],
    "answer": "A",
    "skills": [
      "verb-tense"
    ],
    "ruleId": "exam2.verb-tense.4",
    "difficulty": 5,
    "explanation": "asked that + S + V1 เป็น mandative subjunctive; cost estimates ถูกส่งจึงต้องใช้ be + V3 = be submitted",
    "explanationTh": "asked that + S + V1 เป็น mandative subjunctive; cost estimates ถูกส่งจึงต้องใช้ be + V3 = be submitted",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: the revised cost estimates = ประธาน; be submitted = กริยา; ช่องว่างเป็น V1 be + V3 (subjunctive passive)",
        "จุดบอกใบ้ “asked that ... before the next board meeting” → asked that + S + V1 เป็น mandative subjunctive; cost estimates ถูกส่งจึงต้องใช้ be + V3 = be submitted",
        "คำตอบ A. be submitted; จำรูปแบบ ask/request that + S + (be) + V3"
      ],
      "memory": "ask/request that + S + (be) + V3",
      "choiceReasons": {
        "A": "be submitted = V1 be + V3 ใน subjunctive passive ถูกต้อง",
        "B": "are submitted = present passive แต่ไม่ใช่รูป mandative subjunctive ที่คำสั่งแบบทางการนี้ต้องการ",
        "C": "were submitting = past continuous active ทำให้ estimates ดูเป็นผู้ส่งเอง",
        "D": "will submit = future active ทำให้ estimates เป็นผู้ดำเนินการส่งและไม่ใช่โครงสร้าง subjunctive"
      },
      "breakdown": {
        "subject": "the revised cost estimates",
        "verb": "be submitted",
        "blankRole": "V1 be + V3 (subjunctive passive)",
        "signal": "asked that ... before the next board meeting",
        "pattern": "ask/request that + S + (be) + V3"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      11,
      19
    ]
  },
  {
    "id": "exam2-p5-005",
    "part": 5,
    "stem": "Not until the inspection was completed _____ the maintenance team restart the equipment.",
    "choices": [
      {
        "id": "A",
        "text": "has"
      },
      {
        "id": "B",
        "text": "was"
      },
      {
        "id": "C",
        "text": "did"
      },
      {
        "id": "D",
        "text": "does"
      }
    ],
    "answer": "C",
    "skills": [
      "verb-tense"
    ],
    "ruleId": "exam2.verb-tense.5",
    "difficulty": 5,
    "explanation": "Not until ต้นประโยคทำให้ประโยคหลักเกิด inversion: did + maintenance team (S) + restart (V1) โดยเหตุการณ์เป็นอดีต",
    "explanationTh": "Not until ต้นประโยคทำให้ประโยคหลักเกิด inversion: did + maintenance team (S) + restart (V1) โดยเหตุการณ์เป็นอดีต",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: the maintenance team = ประธาน; did ... restart = กริยา; the equipment = กรรม; ช่องว่างเป็น auxiliary inversion",
        "จุดบอกใบ้ “Not until the inspection was completed” → Not until ต้นประโยคทำให้ประโยคหลักเกิด inversion: did + maintenance team (S) + restart (V1) โดยเหตุการณ์เป็นอดีต",
        "คำตอบ D. did; จำรูปแบบ Not until + clause + did + S + V1"
      ],
      "memory": "Not until + clause + did + S + V1",
      "choiceReasons": {
        "A": "has เป็น present perfect auxiliary ไม่ใช้กับ restart ที่เป็น V1 ในตำแหน่งนี้",
        "B": "was เป็น be ไม่สร้างรูป inversion กับ restart แบบ active ได้",
        "C": "did เป็น auxiliary อดีตที่ย้ายหน้าประธานได้ และตามด้วย restart V1",
        "D": "does เป็นปัจจุบัน แต่ was completed ระบุเหตุการณ์ในอดีต"
      },
      "breakdown": {
        "subject": "the maintenance team",
        "verb": "did ... restart",
        "object": "the equipment",
        "blankRole": "auxiliary inversion",
        "signal": "Not until the inspection was completed",
        "pattern": "Not until + clause + did + S + V1"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      11,
      19
    ]
  },
  {
    "id": "exam2-p5-006",
    "part": 5,
    "stem": "The company has agreed to _____ employees for travel expenses incurred during the conference.",
    "choices": [
      {
        "id": "A",
        "text": "restore"
      },
      {
        "id": "B",
        "text": "reimburse"
      },
      {
        "id": "C",
        "text": "reconcile"
      },
      {
        "id": "D",
        "text": "renew"
      }
    ],
    "answer": "B",
    "skills": [
      "vocabulary"
    ],
    "ruleId": "exam2.vocabulary.6",
    "difficulty": 4,
    "explanation": "reimburse somebody for expenses = ชดใช้/คืนเงินที่ลูกจ่ายไปก่อน ในประโยค employees เป็นผู้รับเงินคืน",
    "explanationTh": "reimburse somebody for expenses = ชดใช้/คืนเงินที่ลูกจ่ายไปก่อน ในประโยค employees เป็นผู้รับเงินคืน",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The company = ประธาน; has agreed to reimburse = กริยา; employees = กรรม; ช่องว่างเป็น กริยา V1 ที่รับผู้ถูกคืนเงินเป็นกรรม",
        "จุดบอกใบ้ “for travel expenses” → reimburse somebody for expenses = ชดใช้/คืนเงินที่ลูกจ่ายไปก่อน ในประโยค employees เป็นผู้รับเงินคืน",
        "คำตอบ B. reimburse; จำรูปแบบ reimburse someone for an expense"
      ],
      "memory": "reimburse someone for an expense",
      "choiceReasons": {
        "A": "restore = ฟื้นฟูสภาพให้กลับเดิม ไม่หมายถึงคืนเงินค่าเดินทาง",
        "B": "reimburse = คืนเงินให้ employees สำหรับ expenses",
        "C": "reconcile = กระทบยอดบัญชี/ทำให้ข้อมูลตรงกัน ไม่ใช่ชดใช้พนักงาน",
        "D": "renew = ต่ออายุ/ทำใหม่ เช่น contract ไม่ใช่คืนเงิน"
      },
      "breakdown": {
        "subject": "The company",
        "verb": "has agreed to reimburse",
        "object": "employees",
        "blankRole": "กริยา V1 ที่รับผู้ถูกคืนเงินเป็นกรรม",
        "signal": "for travel expenses",
        "pattern": "reimburse someone for an expense"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-007",
    "part": 5,
    "stem": "The manufacturer has increased production capacity _____ the growing demand for replacement parts.",
    "choices": [
      {
        "id": "A",
        "text": "instead of"
      },
      {
        "id": "B",
        "text": "regardless of"
      },
      {
        "id": "C",
        "text": "in response to"
      },
      {
        "id": "D",
        "text": "according as"
      }
    ],
    "answer": "C",
    "skills": [
      "collocation"
    ],
    "ruleId": "exam2.collocation.7",
    "difficulty": 4,
    "explanation": "in response to + N. = เพื่อตอบสนองต่อความต้องการที่เพิ่มขึ้น เชื่อมเหตุและการปรับกำลังผลิต",
    "explanationTh": "in response to + N. = เพื่อตอบสนองต่อความต้องการที่เพิ่มขึ้น เชื่อมเหตุและการปรับกำลังผลิต",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The manufacturer = ประธาน; has increased = กริยา; production capacity = กรรม; ช่องว่างเป็น วลีบอกเหตุผลของการเพิ่มกำลังผลิต",
        "จุดบอกใบ้ “the growing demand” → in response to + N. = เพื่อตอบสนองต่อความต้องการที่เพิ่มขึ้น เชื่อมเหตุและการปรับกำลังผลิต",
        "คำตอบ C. in response to; จำรูปแบบ in response to + N. = เพื่อตอบสนองต่อ"
      ],
      "memory": "in response to + N. = เพื่อตอบสนองต่อ",
      "choiceReasons": {
        "A": "instead of = แทนที่จะ แต่การเพิ่มกำลังผลิตไม่ได้แทน demand",
        "B": "regardless of = โดยไม่คำนึงถึง จะขัดความสัมพันธ์ที่ demand เป็นเหตุ",
        "C": "in response to = ตอบสนองต่อ demand เป็นเหตุผลที่ต้องเพิ่มกำลังผลิต",
        "D": "according as เป็นคำเชื่อมแบบเก่าและต้องตามด้วย clause ไม่ใช่ noun phrase นี้"
      },
      "breakdown": {
        "subject": "The manufacturer",
        "verb": "has increased",
        "object": "production capacity",
        "blankRole": "วลีบอกเหตุผลของการเพิ่มกำลังผลิต",
        "signal": "the growing demand",
        "pattern": "in response to + N. = เพื่อตอบสนองต่อ"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-008",
    "part": 5,
    "stem": "The training materials are intended for employees _____ responsibilities include handling confidential data.",
    "choices": [
      {
        "id": "A",
        "text": "who"
      },
      {
        "id": "B",
        "text": "whose"
      },
      {
        "id": "C",
        "text": "which"
      },
      {
        "id": "D",
        "text": "whom"
      }
    ],
    "answer": "B",
    "skills": [
      "relative-clause"
    ],
    "ruleId": "exam2.relative-clause.8",
    "difficulty": 4,
    "explanation": "employees เป็นคนและช่องว่างต้องแสดงความเป็นเจ้าของ responsibilities จึงใช้ whose + noun",
    "explanationTh": "employees เป็นคนและช่องว่างต้องแสดงความเป็นเจ้าของ responsibilities จึงใช้ whose + noun",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The training materials = ประธาน; are intended = กริยา; for employees = กรรม; ช่องว่างเป็น relative possessive determiner",
        "จุดบอกใบ้ “employees ... responsibilities” → employees เป็นคนและช่องว่างต้องแสดงความเป็นเจ้าของ responsibilities จึงใช้ whose + noun",
        "คำตอบ D. whose; จำรูปแบบ person + whose + noun + verb"
      ],
      "memory": "person + whose + noun + verb",
      "choiceReasons": {
        "A": "who เป็นประธานแทนคน แต่ตรงนี้ต้องบอกว่า responsibilities เป็นของพนักงาน",
        "B": "whose = ของผู้ซึ่ง ใช้ก่อน responsibilities ที่เป็น N. ได้",
        "C": "which ปกติอ้างสิ่งของ ไม่ได้แทน possessive ของ employees",
        "D": "whom ใช้เป็นกรรมแทนคน ไม่ใช้แสดงความเป็นเจ้าของก่อน N."
      },
      "breakdown": {
        "subject": "The training materials",
        "verb": "are intended",
        "object": "for employees",
        "blankRole": "relative possessive determiner",
        "signal": "employees ... responsibilities",
        "pattern": "person + whose + noun + verb"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      12,
      17
    ]
  },
  {
    "id": "exam2-p5-009",
    "part": 5,
    "stem": "The annual report, together with the financial statements, _____ available on the investor portal.",
    "choices": [
      {
        "id": "A",
        "text": "is"
      },
      {
        "id": "B",
        "text": "are"
      },
      {
        "id": "C",
        "text": "have"
      },
      {
        "id": "D",
        "text": "were"
      }
    ],
    "answer": "A",
    "skills": [
      "subject-verb"
    ],
    "ruleId": "exam2.subject-verb.9",
    "difficulty": 4,
    "explanation": "annual report เป็นประธานหลักเอกพจน์; together with ... เป็นส่วนแทรก จึงใช้ is + available (Adj.)",
    "explanationTh": "annual report เป็นประธานหลักเอกพจน์; together with ... เป็นส่วนแทรก จึงใช้ is + available (Adj.)",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The annual report = ประธาน; is = กริยา; available = กรรม; ช่องว่างเป็น finite linking verb เอกพจน์",
        "จุดบอกใบ้ “together with the financial statements” → annual report เป็นประธานหลักเอกพจน์; together with ... เป็นส่วนแทรก จึงใช้ is + available (Adj.)",
        "คำตอบ A. is; จำรูปแบบ A, together with B, → ผันกริยาตาม A"
      ],
      "memory": "A, together with B, → ผันกริยาตาม A",
      "choiceReasons": {
        "A": "is เป็น be เอกพจน์ ตรง report และเชื่อม available",
        "B": "are เป็น be พหูพจน์ แต่ financial statements ไม่ใช่ประธานหลัก",
        "C": "have เป็น auxiliary/verb ไม่เชื่อม available โดยตรง",
        "D": "were เป็น past plural ไม่ตรง report และไม่มีบริบทอดีต"
      },
      "breakdown": {
        "subject": "The annual report",
        "verb": "is",
        "object": "available",
        "blankRole": "finite linking verb เอกพจน์",
        "signal": "together with the financial statements",
        "pattern": "A, together with B, → ผันกริยาตาม A"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      12,
      17
    ]
  },
  {
    "id": "exam2-p5-010",
    "part": 5,
    "stem": "Once the new policy takes effect, all requests must be submitted _____ the employee portal.",
    "choices": [
      {
        "id": "A",
        "text": "among"
      },
      {
        "id": "B",
        "text": "beyond"
      },
      {
        "id": "C",
        "text": "between"
      },
      {
        "id": "D",
        "text": "through"
      }
    ],
    "answer": "D",
    "skills": [
      "preposition"
    ],
    "ruleId": "exam2.preposition.10",
    "difficulty": 4,
    "explanation": "submit through a portal = ส่งผ่านระบบพอร์ทัลที่เป็นช่องทางรับคำร้อง ไม่ได้บอกกลุ่มหรือพื้นที่",
    "explanationTh": "submit through a portal = ส่งผ่านระบบพอร์ทัลที่เป็นช่องทางรับคำร้อง ไม่ได้บอกกลุ่มหรือพื้นที่",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: all requests = ประธาน; must be submitted = กริยา; ช่องว่างเป็น preposition แสดงช่องทาง",
        "จุดบอกใบ้ “the employee portal” → submit through a portal = ส่งผ่านระบบพอร์ทัลที่เป็นช่องทางรับคำร้อง ไม่ได้บอกกลุ่มหรือพื้นที่",
        "คำตอบ D. through; จำรูปแบบ submit through/via a portal"
      ],
      "memory": "submit through/via a portal",
      "choiceReasons": {
        "A": "among = ท่ามกลางหลายสิ่ง ใช้ไม่เข้ากับช่องทางส่งคำร้อง",
        "B": "beyond = เลยพ้น/เกินกว่า ไม่บอกช่องทางส่ง",
        "C": "between = ระหว่างสองสิ่ง ต้องมีคู่เทียบ ไม่ใช่สื่อส่งผ่านระบบ",
        "D": "through = ผ่านช่องทาง/ระบบ เช่น through the portal"
      },
      "breakdown": {
        "subject": "all requests",
        "verb": "must be submitted",
        "blankRole": "preposition แสดงช่องทาง",
        "signal": "the employee portal",
        "pattern": "submit through/via a portal"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      12,
      17
    ]
  },
  {
    "id": "exam2-p5-011",
    "part": 5,
    "stem": "The company will _____ implementation of the proposed changes until the legal department has completed its review.",
    "choices": [
      {
        "id": "A",
        "text": "interrupt"
      },
      {
        "id": "B",
        "text": "defer"
      },
      {
        "id": "C",
        "text": "depart"
      },
      {
        "id": "D",
        "text": "depend"
      }
    ],
    "answer": "B",
    "skills": [
      "vocabulary"
    ],
    "ruleId": "exam2.vocabulary.11",
    "difficulty": 4,
    "explanation": "defer implementation until + time/event = เลื่อนการเริ่มใช้การเปลี่ยนแปลงไปจนกว่าฝ่ายกฎหมายตรวจเสร็จ",
    "explanationTh": "defer implementation until + time/event = เลื่อนการเริ่มใช้การเปลี่ยนแปลงไปจนกว่าฝ่ายกฎหมายตรวจเสร็จ",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The company = ประธาน; will defer = กริยา; implementation = กรรม; ช่องว่างเป็น V1 หลังกริยาช่วย will",
        "จุดบอกใบ้ “until the legal department has completed its review” → defer implementation until + time/event = เลื่อนการเริ่มใช้การเปลี่ยนแปลงไปจนกว่าฝ่ายกฎหมายตรวจเสร็จ",
        "คำตอบ B. defer; จำรูปแบบ defer/postpone implementation until + clause"
      ],
      "memory": "defer/postpone implementation until + clause",
      "choiceReasons": {
        "A": "interrupt = ขัดจังหวะสิ่งที่กำลังดำเนิน ไม่ใช่เลื่อนการเริ่มดำเนิน",
        "B": "defer = เลื่อนออกไป ใช้กับ implementation และ until ได้",
        "C": "depart = ออกเดินทาง/แตกต่าง ไม่รับ implementation เป็นกรรม",
        "D": "depend ต้องตาม on/upon และไม่รับ implementation เป็นกรรมตรง ๆ"
      },
      "breakdown": {
        "subject": "The company",
        "verb": "will defer",
        "object": "implementation",
        "blankRole": "V1 หลังกริยาช่วย will",
        "signal": "until the legal department has completed its review",
        "pattern": "defer/postpone implementation until + clause"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-012",
    "part": 5,
    "stem": "The guidelines apply to all contractors, _____ of whether they work on-site or remotely.",
    "choices": [
      {
        "id": "A",
        "text": "in regard"
      },
      {
        "id": "B",
        "text": "in spite"
      },
      {
        "id": "C",
        "text": "regardless"
      },
      {
        "id": "D",
        "text": "in accordance"
      }
    ],
    "answer": "C",
    "skills": [
      "collocation"
    ],
    "ruleId": "exam2.collocation.12",
    "difficulty": 5,
    "explanation": "regardless of whether + clause = ไม่ว่าทำงาน ณ สถานที่หรือจากที่อื่น กฎใช้กับทุกคน",
    "explanationTh": "regardless of whether + clause = ไม่ว่าทำงาน ณ สถานที่หรือจากที่อื่น กฎใช้กับทุกคน",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The guidelines = ประธาน; apply to = กริยา; all contractors = กรรม; ช่องว่างเป็น ส่วนต้นของ regardless of whether",
        "จุดบอกใบ้ “whether they work on-site or remotely” → regardless of whether + clause = ไม่ว่าทำงาน ณ สถานที่หรือจากที่อื่น กฎใช้กับทุกคน",
        "คำตอบ C. regardless; จำรูปแบบ regardless of whether + S + V"
      ],
      "memory": "regardless of whether + S + V",
      "choiceReasons": {
        "A": "in regard ต้องใช้ in regard to + N. ไม่ใช่ in regard of",
        "B": "in spite ต้องใช้ in spite of + N.; แต่ in spite of whether ไม่เหมาะกับใจความครอบคลุม",
        "C": "regardless of whether = ไม่ว่าจะ...หรือไม่ ตรงกับ all contractors",
        "D": "in accordance ต้องใช้ in accordance with ไม่ใช่ of whether"
      },
      "breakdown": {
        "subject": "The guidelines",
        "verb": "apply to",
        "object": "all contractors",
        "blankRole": "ส่วนต้นของ regardless of whether",
        "signal": "whether they work on-site or remotely",
        "pattern": "regardless of whether + S + V"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-013",
    "part": 5,
    "stem": "The figures in the quarterly report were _____ lower than initially projected.",
    "choices": [
      {
        "id": "A",
        "text": "significance"
      },
      {
        "id": "B",
        "text": "significant"
      },
      {
        "id": "C",
        "text": "signify"
      },
      {
        "id": "D",
        "text": "significantly"
      }
    ],
    "answer": "D",
    "skills": [
      "part-of-speech"
    ],
    "ruleId": "exam2.part-of-speech.13",
    "difficulty": 4,
    "explanation": "lower เป็น comparative adjective, ช่องหน้าคำนี้ต้องเป็น Adv. บอกระดับความต่าง: significantly lower = ต่ำกว่าอย่างมีนัยสำคัญ",
    "explanationTh": "lower เป็น comparative adjective, ช่องหน้าคำนี้ต้องเป็น Adv. บอกระดับความต่าง: significantly lower = ต่ำกว่าอย่างมีนัยสำคัญ",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The figures = ประธาน; were = กริยา; ช่องว่างเป็น degree adverb ขยาย comparative lower",
        "จุดบอกใบ้ “lower than initially projected” → lower เป็น comparative adjective, ช่องหน้าคำนี้ต้องเป็น Adv. บอกระดับความต่าง: significantly lower = ต่ำกว่าอย่างมีนัยสำคัญ",
        "คำตอบ D. significantly; จำรูปแบบ significantly/considerably + comparative + than"
      ],
      "memory": "significantly/considerably + comparative + than",
      "choiceReasons": {
        "A": "significance เป็น N. ความสำคัญ ไม่สามารถขยาย lower",
        "B": "significant เป็น Adj. ขยายนามได้ แต่ lower ในที่นี้เป็น comparative Adj. ที่ต้องการ Adv.",
        "C": "signify เป็น V. หมายถึงสื่อความหมาย ไม่ขยาย comparative",
        "D": "significantly เป็น Adv. ขยาย lower ว่าต่างกันมาก"
      },
      "breakdown": {
        "subject": "The figures",
        "verb": "were",
        "blankRole": "degree adverb ขยาย comparative lower",
        "signal": "lower than initially projected",
        "pattern": "significantly/considerably + comparative + than"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      3,
      6
    ]
  },
  {
    "id": "exam2-p5-014",
    "part": 5,
    "stem": "Should any discrepancies arise during the audit, please _____ them to the finance department immediately.",
    "choices": [
      {
        "id": "A",
        "text": "report"
      },
      {
        "id": "B",
        "text": "reported"
      },
      {
        "id": "C",
        "text": "reporting"
      },
      {
        "id": "D",
        "text": "reports"
      }
    ],
    "answer": "A",
    "skills": [
      "verb-tense"
    ],
    "ruleId": "exam2.verb-tense.14",
    "difficulty": 5,
    "explanation": "Should any discrepancies arise = If any discrepancies arise (conditional inversion); ส่วนหลังเป็น imperative please + V1 = report",
    "explanationTh": "Should any discrepancies arise = If any discrepancies arise (conditional inversion); ส่วนหลังเป็น imperative please + V1 = report",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: (you) = ประธาน; report = กริยา; them = กรรม; ช่องว่างเป็น V1 ในประโยคคำสั่ง",
        "จุดบอกใบ้ “Should any discrepancies arise” → Should any discrepancies arise = If any discrepancies arise (conditional inversion); ส่วนหลังเป็น imperative please + V1 = report",
        "คำตอบ A. report; จำรูปแบบ Should + S + V1, please + V1"
      ],
      "memory": "Should + S + V1, please + V1",
      "choiceReasons": {
        "A": "report เป็น V1 ในคำสั่ง Please report ...",
        "B": "reported เป็น V2/V3 ไม่ใช้เป็นกริยาคำสั่ง",
        "C": "reporting เป็น V-ing ไม่มี auxiliary สำหรับ imperative",
        "D": "reports เป็น V-s เอกพจน์ ไม่ใช้หลัง please ในคำสั่ง"
      },
      "breakdown": {
        "subject": "(you)",
        "verb": "report",
        "object": "them",
        "blankRole": "V1 ในประโยคคำสั่ง",
        "signal": "Should any discrepancies arise",
        "pattern": "Should + S + V1, please + V1"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      11,
      19
    ]
  },
  {
    "id": "exam2-p5-015",
    "part": 5,
    "stem": "The panel will consider only applications _____ before the registration deadline.",
    "choices": [
      {
        "id": "A",
        "text": "submit"
      },
      {
        "id": "B",
        "text": "submitting"
      },
      {
        "id": "C",
        "text": "submission"
      },
      {
        "id": "D",
        "text": "submitted"
      }
    ],
    "answer": "D",
    "skills": [
      "relative-clause"
    ],
    "ruleId": "exam2.relative-clause.15",
    "difficulty": 4,
    "explanation": "applications เป็น N. ที่ถูกยื่น; submitted เป็น V3 ขยายแบบ reduced passive relative clause = applications that were submitted",
    "explanationTh": "applications เป็น N. ที่ถูกยื่น; submitted เป็น V3 ขยายแบบ reduced passive relative clause = applications that were submitted",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The panel = ประธาน; will consider = กริยา; only applications = กรรม; ช่องว่างเป็น reduced passive relative modifier",
        "จุดบอกใบ้ “applications ... before the deadline” → applications เป็น N. ที่ถูกยื่น; submitted เป็น V3 ขยายแบบ reduced passive relative clause = applications that were submitted",
        "คำตอบ D. submitted; จำรูปแบบ N. + V3 = N. that was/were + V3"
      ],
      "memory": "N. + V3 = N. that was/were + V3",
      "choiceReasons": {
        "A": "submit เป็น V1 ไม่ขยาย applications แบบ passive ได้",
        "B": "submitting เป็น V-ing ทำให้ applications ดูเป็นผู้ลงมือยื่นเอง",
        "C": "submission เป็น N. ต้องมีโครงสร้างอื่น ไม่ใช่ส่วนขยายหลัง applications ตรง ๆ",
        "D": "submitted เป็น V3 ขยาย applications ที่ถูกยื่นก่อนกำหนด"
      },
      "breakdown": {
        "subject": "The panel",
        "verb": "will consider",
        "object": "only applications",
        "blankRole": "reduced passive relative modifier",
        "signal": "applications ... before the deadline",
        "pattern": "N. + V3 = N. that was/were + V3"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      12,
      17
    ]
  },
  {
    "id": "exam2-p5-016",
    "part": 5,
    "stem": "The supplier's failure to meet the deadline was _____ to a shortage of specialized components.",
    "choices": [
      {
        "id": "A",
        "text": "because"
      },
      {
        "id": "B",
        "text": "despite"
      },
      {
        "id": "C",
        "text": "attributed"
      },
      {
        "id": "D",
        "text": "attributing"
      }
    ],
    "answer": "C",
    "skills": [
      "collocation"
    ],
    "ruleId": "exam2.collocation.16",
    "difficulty": 4,
    "explanation": "was attributed to = ถูกอธิบายว่ามีสาเหตุจาก/ถูกระบุว่าเกิดจาก; shortage เป็นสาเหตุของการส่งล่าช้า",
    "explanationTh": "was attributed to = ถูกอธิบายว่ามีสาเหตุจาก/ถูกระบุว่าเกิดจาก; shortage เป็นสาเหตุของการส่งล่าช้า",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The supplier's failure = ประธาน; was attributed = กริยา; to a shortage = กรรม; ช่องว่างเป็น V3 ใน passive collocation",
        "จุดบอกใบ้ “to a shortage of specialized components” → was attributed to = ถูกอธิบายว่ามีสาเหตุจาก/ถูกระบุว่าเกิดจาก; shortage เป็นสาเหตุของการส่งล่าช้า",
        "คำตอบ C. attributed; จำรูปแบบ be attributed to + a cause"
      ],
      "memory": "be attributed to + a cause",
      "choiceReasons": {
        "A": "because ต้องใช้ because of + N. ไม่ใช้ was because to",
        "B": "despite เป็น preposition ใช้ตามด้วย N. ไม่ประกอบ was despite to",
        "C": "attributed เป็น V3 และเข้าคู่ was attributed to + cause",
        "D": "attributing เป็น V-ing ไม่ใช้หลัง was ... to เมื่อหมายถึงถูกระบุสาเหตุ"
      },
      "breakdown": {
        "subject": "The supplier's failure",
        "verb": "was attributed",
        "object": "to a shortage",
        "blankRole": "V3 ใน passive collocation",
        "signal": "to a shortage of specialized components",
        "pattern": "be attributed to + a cause"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-017",
    "part": 5,
    "stem": "The consultant advised the management team _____ the terms of the agreement before signing it.",
    "choices": [
      {
        "id": "A",
        "text": "review"
      },
      {
        "id": "B",
        "text": "to review"
      },
      {
        "id": "C",
        "text": "reviewing"
      },
      {
        "id": "D",
        "text": "reviewed"
      }
    ],
    "answer": "B",
    "skills": [
      "verb-tense"
    ],
    "ruleId": "exam2.verb-tense.17",
    "difficulty": 4,
    "explanation": "advise + somebody (the management team) + to + V1 = แนะนำให้ทีมผู้บริหารทบทวนเงื่อนไขก่อนเซ็น",
    "explanationTh": "advise + somebody (the management team) + to + V1 = แนะนำให้ทีมผู้บริหารทบทวนเงื่อนไขก่อนเซ็น",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The consultant = ประธาน; advised = กริยา; the management team = กรรม; ช่องว่างเป็น to-infinitive หลัง advise + person",
        "จุดบอกใบ้ “before signing it” → advise + somebody (the management team) + to + V1 = แนะนำให้ทีมผู้บริหารทบทวนเงื่อนไขก่อนเซ็น",
        "คำตอบ B. to review; จำรูปแบบ advise/ask/encourage someone to + V1"
      ],
      "memory": "advise/ask/encourage someone to + V1",
      "choiceReasons": {
        "A": "review เป็น V1 แต่ต้องมี to หลัง advise + someone",
        "B": "to review เป็น infinitive ที่ advise + object ต้องการ",
        "C": "reviewing เป็น V-ing ไม่ใช่โครงสร้าง advise someone reviewing",
        "D": "reviewed เป็น V2/V3 ไม่ทำหน้าที่ infinitive complement"
      },
      "breakdown": {
        "subject": "The consultant",
        "verb": "advised",
        "object": "the management team",
        "blankRole": "to-infinitive หลัง advise + person",
        "signal": "before signing it",
        "pattern": "advise/ask/encourage someone to + V1"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      11,
      19
    ]
  },
  {
    "id": "exam2-p5-018",
    "part": 5,
    "stem": "The exhibition hall must remain closed _____ the ventilation system has been fully tested.",
    "choices": [
      {
        "id": "A",
        "text": "during"
      },
      {
        "id": "B",
        "text": "despite"
      },
      {
        "id": "C",
        "text": "because of"
      },
      {
        "id": "D",
        "text": "until"
      }
    ],
    "answer": "D",
    "skills": [
      "conjunction"
    ],
    "ruleId": "exam2.conjunction.18",
    "difficulty": 4,
    "explanation": "the ventilation system (S) + has been fully tested (V passive) เป็น clause; until ระบุว่า hall ปิดอยู่จนกว่าจะตรวจเสร็จ",
    "explanationTh": "the ventilation system (S) + has been fully tested (V passive) เป็น clause; until ระบุว่า hall ปิดอยู่จนกว่าจะตรวจเสร็จ",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The exhibition hall = ประธาน; must remain = กริยา; closed = กรรม; ช่องว่างเป็น conjunction + clause",
        "จุดบอกใบ้ “the ventilation system has been fully tested” → the ventilation system (S) + has been fully tested (V passive) เป็น clause; until ระบุว่า hall ปิดอยู่จนกว่าจะตรวจเสร็จ",
        "คำตอบ D. until; จำรูปแบบ remain + state + until + S + V"
      ],
      "memory": "remain + state + until + S + V",
      "choiceReasons": {
        "A": "during เป็น preposition ต้องรับ N. ไม่ใช่ clause",
        "B": "despite เป็น preposition รับ N./V-ing และสื่อขัดแย้ง",
        "C": "because of เป็น preposition รับ N. ไม่ใช่ clause",
        "D": "until + S + V = จนกว่าเงื่อนไขการตรวจจะสำเร็จ"
      },
      "breakdown": {
        "subject": "The exhibition hall",
        "verb": "must remain",
        "object": "closed",
        "blankRole": "conjunction + clause",
        "signal": "the ventilation system has been fully tested",
        "pattern": "remain + state + until + S + V"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      12,
      17
    ]
  },
  {
    "id": "exam2-p5-019",
    "part": 5,
    "stem": "Although the two proposals appear similar, they differ considerably _____ their long-term operating costs.",
    "choices": [
      {
        "id": "A",
        "text": "in"
      },
      {
        "id": "B",
        "text": "at"
      },
      {
        "id": "C",
        "text": "to"
      },
      {
        "id": "D",
        "text": "on"
      }
    ],
    "answer": "A",
    "skills": [
      "collocation"
    ],
    "ruleId": "exam2.collocation.19",
    "difficulty": 5,
    "explanation": "differ in + aspect = แตกต่างกันในด้านใดด้านหนึ่ง; their operating costs คือประเด็นที่แตกต่าง",
    "explanationTh": "differ in + aspect = แตกต่างกันในด้านใดด้านหนึ่ง; their operating costs คือประเด็นที่แตกต่าง",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: they = ประธาน; differ = กริยา; ช่องว่างเป็น preposition คู่ differ เมื่อบอกด้านที่ต่าง",
        "จุดบอกใบ้ “their long-term operating costs” → differ in + aspect = แตกต่างกันในด้านใดด้านหนึ่ง; their operating costs คือประเด็นที่แตกต่าง",
        "คำตอบ A. in; จำรูปแบบ differ in size/price/cost vs differ from + thing"
      ],
      "memory": "differ in size/price/cost vs differ from + thing",
      "choiceReasons": {
        "A": "in เป็นบุพบทที่ใช้กับด้านที่ต่างกัน: differ in costs",
        "B": "at มักบอกตำแหน่ง/เวลา ไม่ใช่ด้านที่แตกต่าง",
        "C": "to ไม่ใช้เป็นคำคู่ differ เมื่อระบุประเด็นแตกต่าง",
        "D": "on ใช้ differ on an issue = มีความเห็นต่างเรื่องประเด็นได้ แต่ที่นี่เปรียบคุณสมบัติด้านต้นทุน จึงใช้ in"
      },
      "breakdown": {
        "subject": "they",
        "verb": "differ",
        "blankRole": "preposition คู่ differ เมื่อบอกด้านที่ต่าง",
        "signal": "their long-term operating costs",
        "pattern": "differ in size/price/cost vs differ from + thing"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-020",
    "part": 5,
    "stem": "For security reasons, visitors are not permitted to enter the laboratory _____ accompanied by a staff member.",
    "choices": [
      {
        "id": "A",
        "text": "however"
      },
      {
        "id": "B",
        "text": "therefore"
      },
      {
        "id": "C",
        "text": "despite"
      },
      {
        "id": "D",
        "text": "unless"
      }
    ],
    "answer": "D",
    "skills": [
      "conjunction"
    ],
    "ruleId": "exam2.conjunction.20",
    "difficulty": 5,
    "explanation": "unless accompanied = unless they are accompanied (reduced condition); เข้าห้องไม่ได้ ยกเว้นมีพนักงานพาเข้า",
    "explanationTh": "unless accompanied = unless they are accompanied (reduced condition); เข้าห้องไม่ได้ ยกเว้นมีพนักงานพาเข้า",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: visitors = ประธาน; are not permitted = กริยา; to enter the laboratory = กรรม; ช่องว่างเป็น conditional conjunction + reduced passive clause",
        "จุดบอกใบ้ “accompanied by a staff member” → unless accompanied = unless they are accompanied (reduced condition); เข้าห้องไม่ได้ ยกเว้นมีพนักงานพาเข้า",
        "คำตอบ D. unless; จำรูปแบบ unless + V3 (reduced from unless S be V3)"
      ],
      "memory": "unless + V3 (reduced from unless S be V3)",
      "choiceReasons": {
        "A": "however เป็น conjunctive adverb = อย่างไรก็ตาม ไม่เปิด reduced condition แบบนี้",
        "B": "therefore เป็น conjunctive adverb = ดังนั้น ไม่ใช่เงื่อนไขยกเว้น",
        "C": "despite เป็น preposition และตามด้วย N./V-ing ไม่ใช่ V3 passive ที่ลดรูปแบบนี้",
        "D": "unless ใช้บอกข้อยกเว้น และตามด้วย past participle phrase ที่ลดจาก clause passive ได้"
      },
      "breakdown": {
        "subject": "visitors",
        "verb": "are not permitted",
        "object": "to enter the laboratory",
        "blankRole": "conditional conjunction + reduced passive clause",
        "signal": "accompanied by a staff member",
        "pattern": "unless + V3 (reduced from unless S be V3)"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      12,
      17
    ]
  },
  {
    "id": "exam2-p5-021",
    "part": 5,
    "stem": "The auditor requested clarification of the expenses _____ under miscellaneous costs.",
    "choices": [
      {
        "id": "A",
        "text": "listing"
      },
      {
        "id": "B",
        "text": "listed"
      },
      {
        "id": "C",
        "text": "lists"
      },
      {
        "id": "D",
        "text": "list"
      }
    ],
    "answer": "B",
    "skills": [
      "relative-clause"
    ],
    "ruleId": "exam2.relative-clause.21",
    "difficulty": 4,
    "explanation": "expenses ถูกระบุไว้ในหมวด miscellaneous costs จึงใช้ listed (V3) ใน reduced passive relative clause",
    "explanationTh": "expenses ถูกระบุไว้ในหมวด miscellaneous costs จึงใช้ listed (V3) ใน reduced passive relative clause",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The auditor = ประธาน; requested = กริยา; clarification of the expenses = กรรม; ช่องว่างเป็น reduced passive relative modifier",
        "จุดบอกใบ้ “under miscellaneous costs” → expenses ถูกระบุไว้ในหมวด miscellaneous costs จึงใช้ listed (V3) ใน reduced passive relative clause",
        "คำตอบ B. listed; จำรูปแบบ expenses listed = expenses that were listed"
      ],
      "memory": "expenses listed = expenses that were listed",
      "choiceReasons": {
        "A": "listing เป็น V-ing ที่ทำให้ expenses เป็นผู้ระบุรายการ ไม่ใช่สิ่งที่ถูกระบุ",
        "B": "listed เป็น V3 = expenses that were listed",
        "C": "lists เป็น V-s ที่ไม่มีตัวเชื่อมและประธานของกริยาใหม่",
        "D": "list เป็น V1 ไม่อยู่ตำแหน่งขยายนาม expenses"
      },
      "breakdown": {
        "subject": "The auditor",
        "verb": "requested",
        "object": "clarification of the expenses",
        "blankRole": "reduced passive relative modifier",
        "signal": "under miscellaneous costs",
        "pattern": "expenses listed = expenses that were listed"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      12,
      17
    ]
  },
  {
    "id": "exam2-p5-022",
    "part": 5,
    "stem": "The new system will allow clients to track the _____ of their service requests in real time.",
    "choices": [
      {
        "id": "A",
        "text": "proceeds"
      },
      {
        "id": "B",
        "text": "progressive"
      },
      {
        "id": "C",
        "text": "progress"
      },
      {
        "id": "D",
        "text": "procedures"
      }
    ],
    "answer": "C",
    "skills": [
      "vocabulary"
    ],
    "ruleId": "exam2.vocabulary.22",
    "difficulty": 4,
    "explanation": "track the progress of requests = ติดตามความคืบหน้าว่าคำร้องแต่ละรายการอยู่ขั้นไหน",
    "explanationTh": "track the progress of requests = ติดตามความคืบหน้าว่าคำร้องแต่ละรายการอยู่ขั้นไหน",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The new system = ประธาน; will allow = กริยา; clients to track the progress = กรรม; ช่องว่างเป็น N. หัวของ noun phrase หลัง the",
        "จุดบอกใบ้ “in real time” → track the progress of requests = ติดตามความคืบหน้าว่าคำร้องแต่ละรายการอยู่ขั้นไหน",
        "คำตอบ C. progress; จำรูปแบบ track the progress/status of + N."
      ],
      "memory": "track the progress/status of + N.",
      "choiceReasons": {
        "A": "proceeds = รายได้/เงินที่ได้จากการขาย ไม่ได้หมายถึงสถานะดำเนินงาน",
        "B": "progressive = Adj. ก้าวหน้า ไม่เป็น N. ที่ต้องการหลัง the",
        "C": "progress = N. ความคืบหน้า ใช้ track the progress of ...",
        "D": "procedures = N. ขั้นตอนการทำงาน ไม่ใช่ความคืบหน้าของคำร้องแต่ละรายการ"
      },
      "breakdown": {
        "subject": "The new system",
        "verb": "will allow",
        "object": "clients to track the progress",
        "blankRole": "N. หัวของ noun phrase หลัง the",
        "signal": "in real time",
        "pattern": "track the progress/status of + N."
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-023",
    "part": 5,
    "stem": "The finance department expects the revised figures to be available _____ the end of the week.",
    "choices": [
      {
        "id": "A",
        "text": "during"
      },
      {
        "id": "B",
        "text": "among"
      },
      {
        "id": "C",
        "text": "within"
      },
      {
        "id": "D",
        "text": "by"
      }
    ],
    "answer": "D",
    "skills": [
      "preposition"
    ],
    "ruleId": "exam2.preposition.23",
    "difficulty": 4,
    "explanation": "by the end of the week = ไม่เกินสิ้นสัปดาห์ เป็น deadline; available คือสถานะที่จะเกิดก่อนเวลานั้น",
    "explanationTh": "by the end of the week = ไม่เกินสิ้นสัปดาห์ เป็น deadline; available คือสถานะที่จะเกิดก่อนเวลานั้น",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: the revised figures = ประธาน; to be = กริยา; available = กรรม; ช่องว่างเป็น preposition ระบุ deadline",
        "จุดบอกใบ้ “the end of the week” → by the end of the week = ไม่เกินสิ้นสัปดาห์ เป็น deadline; available คือสถานะที่จะเกิดก่อนเวลานั้น",
        "คำตอบ D. by; จำรูปแบบ by + exact deadline; within + duration"
      ],
      "memory": "by + exact deadline; within + duration",
      "choiceReasons": {
        "A": "during = ระหว่างช่วงเวลา ไม่ใช้กับ the end เพื่อหมายถึง deadline",
        "B": "among = ท่ามกลางหลายสิ่ง ไม่ใช้กับเวลา",
        "C": "within + time period ใช้ได้ เช่น within a week แต่ within the end of the week ไม่ใช่รูปบอก deadline นี้",
        "D": "by + endpoint = อย่างช้าที่สุด ณ สิ้นสัปดาห์"
      },
      "breakdown": {
        "subject": "the revised figures",
        "verb": "to be",
        "object": "available",
        "blankRole": "preposition ระบุ deadline",
        "signal": "the end of the week",
        "pattern": "by + exact deadline; within + duration"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      12,
      17
    ]
  },
  {
    "id": "exam2-p5-024",
    "part": 5,
    "stem": "The contract stipulates that payment is due _____ receipt of the final invoice.",
    "choices": [
      {
        "id": "A",
        "text": "upon"
      },
      {
        "id": "B",
        "text": "under"
      },
      {
        "id": "C",
        "text": "over"
      },
      {
        "id": "D",
        "text": "across"
      }
    ],
    "answer": "A",
    "skills": [
      "collocation"
    ],
    "ruleId": "exam2.collocation.24",
    "difficulty": 4,
    "explanation": "upon receipt of the final invoice = ทันทีเมื่อได้รับใบแจ้งหนี้ฉบับสุดท้าย; receipt เป็น N. การได้รับ",
    "explanationTh": "upon receipt of the final invoice = ทันทีเมื่อได้รับใบแจ้งหนี้ฉบับสุดท้าย; receipt เป็น N. การได้รับ",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: payment = ประธาน; is = กริยา; due = กรรม; ช่องว่างเป็น preposition ระบุจุดเริ่มชำระ",
        "จุดบอกใบ้ “receipt of the final invoice” → upon receipt of the final invoice = ทันทีเมื่อได้รับใบแจ้งหนี้ฉบับสุดท้าย; receipt เป็น N. การได้รับ",
        "คำตอบ A. upon; จำรูปแบบ upon receipt/approval/completion of + N."
      ],
      "memory": "upon receipt/approval/completion of + N.",
      "choiceReasons": {
        "A": "upon receipt of = เมื่อได้รับทันที เป็นวลีธุรกิจที่ถูกต้อง",
        "B": "under receipt of ไม่เป็นสำนวนกำหนดกำหนดชำระเงิน",
        "C": "over receipt of ไม่เชื่อมเงื่อนไขเวลารับใบแจ้งหนี้",
        "D": "across receipt of ไม่ใช้ระบุเวลาชำระหลังรับเอกสาร"
      },
      "breakdown": {
        "subject": "payment",
        "verb": "is",
        "object": "due",
        "blankRole": "preposition ระบุจุดเริ่มชำระ",
        "signal": "receipt of the final invoice",
        "pattern": "upon receipt/approval/completion of + N."
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-025",
    "part": 5,
    "stem": "The client asked the vendor to _____ a single point of contact for questions about the installation.",
    "choices": [
      {
        "id": "A",
        "text": "dismiss"
      },
      {
        "id": "B",
        "text": "delegate"
      },
      {
        "id": "C",
        "text": "distribute"
      },
      {
        "id": "D",
        "text": "designate"
      }
    ],
    "answer": "D",
    "skills": [
      "vocabulary"
    ],
    "ruleId": "exam2.vocabulary.25",
    "difficulty": 5,
    "explanation": "designate a point of contact = ระบุ/แต่งตั้งบุคคลหนึ่งคนให้เป็นผู้ประสานงานหลัก",
    "explanationTh": "designate a point of contact = ระบุ/แต่งตั้งบุคคลหนึ่งคนให้เป็นผู้ประสานงานหลัก",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The client = ประธาน; asked the vendor to designate = กริยา; a single point of contact = กรรม; ช่องว่างเป็น V1 ที่รับ object บุคคล/บทบาท",
        "จุดบอกใบ้ “for questions about the installation” → designate a point of contact = ระบุ/แต่งตั้งบุคคลหนึ่งคนให้เป็นผู้ประสานงานหลัก",
        "คำตอบ D. designate; จำรูปแบบ designate a person/contact"
      ],
      "memory": "designate a person/contact",
      "choiceReasons": {
        "A": "dismiss = ปลด/ไม่พิจารณา ไม่ได้แต่งตั้ง",
        "B": "delegate = มอบหมายงานหรืออำนาจได้ แต่ delegate a point of contact ไม่ใช่รูปคู่คำนี้",
        "C": "distribute = แจกจ่าย ไม่ใช่ระบุตัวบุคคล",
        "D": "designate = แต่งตั้ง/กำหนดตำแหน่งผู้ประสานงานหนึ่งคน"
      },
      "breakdown": {
        "subject": "The client",
        "verb": "asked the vendor to designate",
        "object": "a single point of contact",
        "blankRole": "V1 ที่รับ object บุคคล/บทบาท",
        "signal": "for questions about the installation",
        "pattern": "designate a person/contact"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-026",
    "part": 5,
    "stem": "The event organizer will _____ the registration fee for participants whose flights were canceled.",
    "choices": [
      {
        "id": "A",
        "text": "waive"
      },
      {
        "id": "B",
        "text": "weigh"
      },
      {
        "id": "C",
        "text": "waver"
      },
      {
        "id": "D",
        "text": "widen"
      }
    ],
    "answer": "A",
    "skills": [
      "vocabulary"
    ],
    "ruleId": "exam2.vocabulary.26",
    "difficulty": 4,
    "explanation": "waive a fee = ยกเว้น/ไม่เก็บค่าธรรมเนียม; participants ถูกยกเว้นเพราะเที่ยวบินถูกยกเลิก",
    "explanationTh": "waive a fee = ยกเว้น/ไม่เก็บค่าธรรมเนียม; participants ถูกยกเว้นเพราะเที่ยวบินถูกยกเลิก",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The event organizer = ประธาน; will waive = กริยา; the registration fee = กรรม; ช่องว่างเป็น V1 หลังกริยาช่วย will",
        "จุดบอกใบ้ “whose flights were canceled” → waive a fee = ยกเว้น/ไม่เก็บค่าธรรมเนียม; participants ถูกยกเว้นเพราะเที่ยวบินถูกยกเลิก",
        "คำตอบ A. waive; จำรูปแบบ waive a fee/requirement"
      ],
      "memory": "waive a fee/requirement",
      "choiceReasons": {
        "A": "waive = ยกเว้นค่าธรรมเนียมตามนโยบาย",
        "B": "weigh = ชั่งน้ำหนัก/พิจารณา ไม่ใช้กับ fee ในความหมายยกเว้น",
        "C": "waver = ลังเล/แกว่ง ไม่เป็นสำนวนกับ registration fee",
        "D": "widen = ทำให้กว้างขึ้น ไม่เกี่ยวการยกเว้นค่าธรรมเนียม"
      },
      "breakdown": {
        "subject": "The event organizer",
        "verb": "will waive",
        "object": "the registration fee",
        "blankRole": "V1 หลังกริยาช่วย will",
        "signal": "whose flights were canceled",
        "pattern": "waive a fee/requirement"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-027",
    "part": 5,
    "stem": "The supplier agreed to replace the items at no additional cost, _____ the defects were reported within seven days.",
    "choices": [
      {
        "id": "A",
        "text": "despite"
      },
      {
        "id": "B",
        "text": "unless"
      },
      {
        "id": "C",
        "text": "provided that"
      },
      {
        "id": "D",
        "text": "meanwhile"
      }
    ],
    "answer": "C",
    "skills": [
      "conjunction"
    ],
    "ruleId": "exam2.conjunction.27",
    "difficulty": 5,
    "explanation": "provided that + S + V เป็นเงื่อนไขในการได้รับการเปลี่ยนสินค้าฟรี; ต้องแจ้งภายในเจ็ดวัน",
    "explanationTh": "provided that + S + V เป็นเงื่อนไขในการได้รับการเปลี่ยนสินค้าฟรี; ต้องแจ้งภายในเจ็ดวัน",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The supplier = ประธาน; agreed to replace = กริยา; the items = กรรม; ช่องว่างเป็น conditional conjunction",
        "จุดบอกใบ้ “the defects were reported within seven days” → provided that + S + V เป็นเงื่อนไขในการได้รับการเปลี่ยนสินค้าฟรี; ต้องแจ้งภายในเจ็ดวัน",
        "คำตอบ C. provided that; จำรูปแบบ provided that/as long as + clause"
      ],
      "memory": "provided that/as long as + clause",
      "choiceReasons": {
        "A": "despite ต้องตามด้วย N./V-ing ไม่ใช่ clause เต็ม",
        "B": "unless = เว้นแต่ว่า จะกลับเงื่อนไขเป็นไม่แจ้งข้อบกพร่อง ซึ่งผิดความหมาย",
        "C": "provided that = หากมีเงื่อนไขว่าต้องรายงาน defect ภายในกำหนด",
        "D": "meanwhile เป็น Adv. บอกระหว่างนั้น ไม่ใช้เชื่อมเงื่อนไข S+V ตรง ๆ"
      },
      "breakdown": {
        "subject": "The supplier",
        "verb": "agreed to replace",
        "object": "the items",
        "blankRole": "conditional conjunction",
        "signal": "the defects were reported within seven days",
        "pattern": "provided that/as long as + clause"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      12,
      17
    ]
  },
  {
    "id": "exam2-p5-028",
    "part": 5,
    "stem": "The company announced that the implementation date would be moved _____ to allow more time for staff training.",
    "choices": [
      {
        "id": "A",
        "text": "previous"
      },
      {
        "id": "B",
        "text": "following"
      },
      {
        "id": "C",
        "text": "ahead"
      },
      {
        "id": "D",
        "text": "back"
      }
    ],
    "answer": "D",
    "skills": [
      "vocabulary"
    ],
    "ruleId": "exam2.vocabulary.28",
    "difficulty": 4,
    "explanation": "move a date back = เลื่อนกำหนดไปให้ช้าลง ต่างจาก move forward ที่บางบริบทแปลเลื่อนให้เร็วขึ้น",
    "explanationTh": "move a date back = เลื่อนกำหนดไปให้ช้าลง ต่างจาก move forward ที่บางบริบทแปลเลื่อนให้เร็วขึ้น",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: the implementation date = ประธาน; would be moved = กริยา; ช่องว่างเป็น particle หลัง passive phrasal verb",
        "จุดบอกใบ้ “to allow more time” → move a date back = เลื่อนกำหนดไปให้ช้าลง ต่างจาก move forward ที่บางบริบทแปลเลื่อนให้เร็วขึ้น",
        "คำตอบ D. back; จำรูปแบบ move back/postpone a date"
      ],
      "memory": "move back/postpone a date",
      "choiceReasons": {
        "A": "previous เป็น Adj. ก่อนหน้า ไม่เป็นคำวิเศษณ์ที่คู่ moved ได้",
        "B": "following เป็น Adj./Prep. ต้องมีโครงสร้างหรือคำนามรองรับ",
        "C": "ahead = เลื่อนกำหนดให้เร็วขึ้น (move ahead), ขัดกับเหตุผลที่ต้องการเวลาเพิ่มเติม; move back จึงเหมาะกว่า",
        "D": "back เป็นอนุภาคใน move back = เลื่อนวันออกไป"
      },
      "breakdown": {
        "subject": "the implementation date",
        "verb": "would be moved",
        "blankRole": "particle หลัง passive phrasal verb",
        "signal": "to allow more time",
        "pattern": "move back/postpone a date"
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      21,
      26
    ]
  },
  {
    "id": "exam2-p5-029",
    "part": 5,
    "stem": "The committee members have expressed _____ about the accuracy of the preliminary figures.",
    "choices": [
      {
        "id": "A",
        "text": "concerns"
      },
      {
        "id": "B",
        "text": "concerning"
      },
      {
        "id": "C",
        "text": "concerned"
      },
      {
        "id": "D",
        "text": "concernedly"
      }
    ],
    "answer": "A",
    "skills": [
      "collocation"
    ],
    "ruleId": "exam2.collocation.29",
    "difficulty": 4,
    "explanation": "express concerns about + N. = แสดงความกังวลเกี่ยวกับความถูกต้องของตัวเลขเบื้องต้น",
    "explanationTh": "express concerns about + N. = แสดงความกังวลเกี่ยวกับความถูกต้องของตัวเลขเบื้องต้น",
    "coaching": {
      "focus": [],
      "steps": [
        "แยกหน้าที่: The committee members = ประธาน; have expressed = กริยา; concerns = กรรม; ช่องว่างเป็น N. กรรมของ expressed",
        "จุดบอกใบ้ “about the accuracy” → express concerns about + N. = แสดงความกังวลเกี่ยวกับความถูกต้องของตัวเลขเบื้องต้น",
        "คำตอบ A. concerns; จำรูปแบบ express concerns about + N."
      ],
      "memory": "express concerns about + N.",
      "choiceReasons": {
        "A": "concerns เป็น N. พหูพจน์ รับเป็นกรรมของ expressed และเข้าคู่ about",
        "B": "concerning เป็น Prep./V-ing ไม่เป็นกรรมคำนามแบบนี้",
        "C": "concerned เป็น Adj./V3 ไม่ใช่ N. ที่ต้องการหลัง express",
        "D": "concernedly เป็น Adv. ไม่เป็นกรรมของ express"
      },
      "breakdown": {
        "subject": "The committee members",
        "verb": "have expressed",
        "object": "concerns",
        "blankRole": "N. กรรมของ expressed",
        "signal": "about the accuracy",
        "pattern": "express concerns about + N."
      }
    },
    "targetSeconds": 40,
    "chapterIds": [
      21,
      26
    ]
  }
]
