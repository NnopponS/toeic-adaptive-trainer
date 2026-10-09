import type { Passage, Question } from './types'
// Four original workplace documents with four contextual blanks each, all with authored Thai distractor reasoning.
export const advancedPart6Passages: Passage[] = [
  {
    "id": "exam2-p6-01",
    "part": 6,
    "kind": "email",
    "title": "Supplier Inspection — Temporary Acceptance Hold",
    "body": "To: Warehouse Supervisors\nFrom: Mara Chen, Supplier Quality\nSubject: Temporary hold on incoming components\n\nDuring Tuesday's inspection, our quality team identified dimensional variations in a batch of plastic housings. The supplier has agreed to recheck the production settings and send us an updated tolerance sheet. Until that document is [1] _____, affected items must remain in the clearly labeled holding area, even if they appear undamaged.\n\nThe supplier expects to send a replacement shipment on Friday. [2] _____, receiving staff should not change the status of existing items to \"accepted\" until the measurements have been independently verified. We need to retain a complete record of what was inspected and when.\n\nPlease [3] _____ a separate log of any batches delivered while the review is underway. Record the supplier's batch number, the delivery date, and the name of the employee who received the package.\n\n[4] _____ Once the quality team has reviewed those records, I will issue a written notice identifying which batches may be released for assembly.",
    "questions": [
      "exam2-p6-01-q1",
      "exam2-p6-01-q2",
      "exam2-p6-01-q3",
      "exam2-p6-01-q4"
    ],
    "examStyle": true,
    "sourceLabel": "Original TOEIC-style practice authored for this trainer; not official ETS material."
  },
  {
    "id": "exam2-p6-02",
    "part": 6,
    "kind": "notice",
    "title": "Client Workshop — Updated Registration Procedure",
    "body": "CLIENT EDUCATION DEPARTMENT\nNOTICE: NOVEMBER SOFTWARE WORKSHOP\n\nThe workshop originally scheduled for November 6 will now take place on November 13 because the instructor will be attending an industry conference. All confirmed participants will retain their seats, and no additional registration fee will be charged.\n\nParticipants who have already paid for optional training materials should keep their receipts. These charges will be [1] _____ to their accounts if the materials are no longer needed. Requests must be submitted through the registration portal by November 4 so that the accounting team can process them in time.\n\nThe online portal will close temporarily for maintenance on November 3. [2] _____, attendees who need to update dietary requirements after that date may send the information directly to the event coordinator by e-mail.\n\n[3] _____\n\nPlease note that the workshop has been moved to the South Conference Center, which is a short walk from the original venue. A location map will be sent with the final confirmation e-mail. [4] _____ Please allow enough time to reach the new location before the 9:00 A.M. opening session.",
    "questions": [
      "exam2-p6-02-q1",
      "exam2-p6-02-q2",
      "exam2-p6-02-q3",
      "exam2-p6-02-q4"
    ],
    "examStyle": true,
    "sourceLabel": "Original TOEIC-style practice authored for this trainer; not official ETS material."
  },
  {
    "id": "exam2-p6-03",
    "part": 6,
    "kind": "email",
    "title": "Facilities Handover — Revised Move-in Dates",
    "body": "To: Department Heads\nFrom: Facilities Management\nSubject: East Wing Relocation Update\n\nThe installation of the new network equipment in the east wing has taken longer than expected because several cable routes require approval from the building owner. Although most offices are furnished, employees may not move into the area until the connectivity tests have been completed.\n\nTo avoid unnecessary disruption, the relocation schedule has been [1] _____ by three working days. Departments originally assigned to move on Monday should continue using their current workspaces through Wednesday. The revised seating list will be published once the final tests are complete.\n\n[2] _____ Department heads should therefore keep a record of any equipment that must remain connected during the transition. The IT support team will use this information when planning the sequence of shutdowns.\n\nPlease do not disconnect desktop computers before the revised move-in date. Doing so could result in a loss of access to shared applications. Access to the new offices is also restricted during testing. [3] _____, staff who need to visit the new offices for measurements may request temporary access from Facilities.\n\nAny requests for specialized equipment must be submitted [4] _____ Friday at 3:00 P.M. to ensure delivery before the move.",
    "questions": [
      "exam2-p6-03-q1",
      "exam2-p6-03-q2",
      "exam2-p6-03-q3",
      "exam2-p6-03-q4"
    ],
    "examStyle": true,
    "sourceLabel": "Original TOEIC-style practice authored for this trainer; not official ETS material."
  },
  {
    "id": "exam2-p6-04",
    "part": 6,
    "kind": "article",
    "title": "Service Credit Policy — Updated Billing Notice",
    "body": "CUSTOMER ACCOUNT NOTICE\nChange to Service Credit Requests\n\nBeginning December 1, customers experiencing an interruption of more than four consecutive hours may apply for a credit toward their next monthly statement. The amount will be calculated according to the duration of the disruption and the subscription plan in effect on the day of the incident.\n\nA service credit is not issued [1] _____; customers must submit a request through the account portal within ten business days. Supporting documentation is not normally required because our system records the start and end times of outages.\n\nRequests submitted outside the ten-day period will still be reviewed. [2] _____, credits cannot be guaranteed when the system records needed to verify an incident are no longer available.\n\n[3] _____ The adjustment will appear as a separate line on the following statement rather than as a transfer to the customer's bank account. Customers who have already canceled their subscriptions should contact Billing for instructions on any remaining credit.\n\nTo help our team [4] _____ requests promptly, please provide the account number and approximate time of the interruption when completing the form.",
    "questions": [
      "exam2-p6-04-q1",
      "exam2-p6-04-q2",
      "exam2-p6-04-q3",
      "exam2-p6-04-q4"
    ],
    "examStyle": true,
    "sourceLabel": "Original TOEIC-style practice authored for this trainer; not official ETS material."
  }
]
export const advancedPart6: Question[] = [
  {
    "id": "exam2-p6-01-q1",
    "part": 6,
    "passageId": "exam2-p6-01",
    "stem": "[1] _____",
    "choices": [
      {
        "id": "A",
        "text": "circulated"
      },
      {
        "id": "B",
        "text": "circulating"
      },
      {
        "id": "C",
        "text": "circulation"
      },
      {
        "id": "D",
        "text": "circulate"
      }
    ],
    "answer": "A",
    "skills": [
      "passive"
    ],
    "ruleId": "exam2.p6.passive",
    "difficulty": 4,
    "explanation": "Until ... is circulated เป็น passive: tolerance sheet เป็นสิ่งที่ถูกแจกจ่าย/ส่งเวียน ไม่ได้แจกจ่ายเอง จึงต้อง is + V3 circulated",
    "explanationTh": "Until ... is circulated เป็น passive: tolerance sheet เป็นสิ่งที่ถูกแจกจ่าย/ส่งเวียน ไม่ได้แจกจ่ายเอง จึงต้อง is + V3 circulated",
    "whyOthersTh": {
      "A": "circulated เป็น V3 ตามหลัง is = เมื่อเอกสารถูกส่งเวียนแล้ว",
      "B": "circulating เป็น V-ing จะหมายถึงเอกสารกำลังหมุนเวียน แต่ until sheet is circulating ไม่สื่อการออกเอกสารที่เสร็จสมบูรณ์ในขั้นตอนนี้",
      "C": "circulation เป็น N. การหมุนเวียน ไม่ทำหน้าที่ passive verb หลัง is ได้",
      "D": "circulate เป็น V1 ไม่เป็น V3 หลัง passive is"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "sheet เป็น S ของ clause; is เป็น auxiliary",
        "Until sheet is + V3 แสดงว่าเอกสารได้รับการส่งเวียนก่อนปล่อยสินค้า",
        "เลือก circulated เพราะเป็น past participle ของ circulate"
      ],
      "memory": "be + V3 = passive; circulate a document = ส่งเวียนเอกสาร",
      "choiceReasons": {
        "A": "circulated เป็น V3 ตามหลัง is = เมื่อเอกสารถูกส่งเวียนแล้ว",
        "B": "circulating เป็น V-ing จะหมายถึงเอกสารกำลังหมุนเวียน แต่ until sheet is circulating ไม่สื่อการออกเอกสารที่เสร็จสมบูรณ์ในขั้นตอนนี้",
        "C": "circulation เป็น N. การหมุนเวียน ไม่ทำหน้าที่ passive verb หลัง is ได้",
        "D": "circulate เป็น V1 ไม่เป็น V3 หลัง passive is"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-01-q2",
    "part": 6,
    "passageId": "exam2-p6-01",
    "stem": "[2] _____",
    "choices": [
      {
        "id": "A",
        "text": "Therefore"
      },
      {
        "id": "B",
        "text": "Nevertheless"
      },
      {
        "id": "C",
        "text": "For instance"
      },
      {
        "id": "D",
        "text": "Likewise"
      }
    ],
    "answer": "B",
    "skills": [
      "context"
    ],
    "ruleId": "exam2.p6.context",
    "difficulty": 5,
    "explanation": "มีข่าวดีว่าสินค้าทดแทนจะส่งวันศุกร์ แต่ของล็อตเดิมยังต้องกักไว้จนตรวจเสร็จ จึงใช้ Nevertheless เชื่อมข้อยกเว้น/ความขัดแย้ง",
    "explanationTh": "มีข่าวดีว่าสินค้าทดแทนจะส่งวันศุกร์ แต่ของล็อตเดิมยังต้องกักไว้จนตรวจเสร็จ จึงใช้ Nevertheless เชื่อมข้อยกเว้น/ความขัดแย้ง",
    "whyOthersTh": {
      "A": "Therefore = ดังนั้น แสดงผลตามเหตุ แต่การส่งล็อตใหม่ไม่ได้ทำให้รับล็อตเก่าได้",
      "B": "Nevertheless = อย่างไรก็ตาม แสดงว่าถึงมี shipment ใหม่ก็ยังต้องกักของเดิม",
      "C": "For instance = ตัวอย่างเช่น แต่ประโยคถัดไปไม่ได้ยกตัวอย่าง shipment",
      "D": "Likewise = ในทำนองเดียวกัน แต่เป็นข้อจำกัดที่ต่างจากข่าวดีในประโยคก่อน"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "อ่านประโยคก่อน: replacement shipment on Friday",
        "ประโยคหลัง: existing items must NOT be accepted until verified",
        "เป็นการหักความคาดหวัง จึงใช้ Nevertheless"
      ],
      "memory": "Nevertheless / However + contrast; Therefore + result",
      "choiceReasons": {
        "A": "Therefore = ดังนั้น แสดงผลตามเหตุ แต่การส่งล็อตใหม่ไม่ได้ทำให้รับล็อตเก่าได้",
        "B": "Nevertheless = อย่างไรก็ตาม แสดงว่าถึงมี shipment ใหม่ก็ยังต้องกักของเดิม",
        "C": "For instance = ตัวอย่างเช่น แต่ประโยคถัดไปไม่ได้ยกตัวอย่าง shipment",
        "D": "Likewise = ในทำนองเดียวกัน แต่เป็นข้อจำกัดที่ต่างจากข่าวดีในประโยคก่อน"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-01-q3",
    "part": 6,
    "passageId": "exam2-p6-01",
    "stem": "[3] _____",
    "choices": [
      {
        "id": "A",
        "text": "suspend"
      },
      {
        "id": "B",
        "text": "maintain"
      },
      {
        "id": "C",
        "text": "identify"
      },
      {
        "id": "D",
        "text": "revise"
      }
    ],
    "answer": "B",
    "skills": [
      "vocabulary"
    ],
    "ruleId": "exam2.p6.vocabulary",
    "difficulty": 4,
    "explanation": "maintain a log = จัดทำและเก็บบันทึกต่อเนื่อง โดยประโยคถัดไปสั่งให้บันทึก batch number, date และ receiver",
    "explanationTh": "maintain a log = จัดทำและเก็บบันทึกต่อเนื่อง โดยประโยคถัดไปสั่งให้บันทึก batch number, date และ receiver",
    "whyOthersTh": {
      "A": "suspend = ระงับ/หยุด log ซึ่งตรงข้ามกับคำสั่งให้เก็บหลักฐาน",
      "B": "maintain a log = เก็บรักษาและอัปเดตบันทึกต่อเนื่อง",
      "C": "identify = ระบุตัวตน แต่ identify a log ไม่ใช่คำสั่งให้จดข้อมูลใน log",
      "D": "revise = แก้ไขบันทึกเดิม แต่ต้องการบันทึกแยกใหม่และเพิ่มรายการเมื่อของเข้า"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "Please + V1 และ a separate log เป็นกรรม",
        "Record ... ในประโยคถัดไปยืนยันว่าต้องจดข้อมูลทุกครั้ง",
        "maintain a log = ทำ/อัปเดตบันทึกอย่างต่อเนื่อง"
      ],
      "memory": "maintain a log/record; record the date and batch number",
      "choiceReasons": {
        "A": "suspend = ระงับ/หยุด log ซึ่งตรงข้ามกับคำสั่งให้เก็บหลักฐาน",
        "B": "maintain a log = เก็บรักษาและอัปเดตบันทึกต่อเนื่อง",
        "C": "identify = ระบุตัวตน แต่ identify a log ไม่ใช่คำสั่งให้จดข้อมูลใน log",
        "D": "revise = แก้ไขบันทึกเดิม แต่ต้องการบันทึกแยกใหม่และเพิ่มรายการเมื่อของเข้า"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-01-q4",
    "part": 6,
    "passageId": "exam2-p6-01",
    "stem": "[4] _____",
    "choices": [
      {
        "id": "A",
        "text": "Employees may remove the labels once they have counted the packages."
      },
      {
        "id": "B",
        "text": "The supplier will revise the price list at the end of the year."
      },
      {
        "id": "C",
        "text": "The cafeteria will be closed during the inspection."
      },
      {
        "id": "D",
        "text": "If a delivery arrives after business hours, send the log to Quality before noon the next day."
      }
    ],
    "answer": "D",
    "skills": [
      "sentence-placement"
    ],
    "ruleId": "exam2.p6.sentence-placement",
    "difficulty": 5,
    "explanation": "ประโยคเติมระบุกรณีส่งของหลังเวลาทำการและกำหนดการส่ง log จึงเชื่อมคำสั่ง maintain a log กับ Once the quality team has reviewed those records ที่อ้างถึงบันทึกเหล่านั้น",
    "explanationTh": "ประโยคเติมระบุกรณีส่งของหลังเวลาทำการและกำหนดการส่ง log จึงเชื่อมคำสั่ง maintain a log กับ Once the quality team has reviewed those records ที่อ้างถึงบันทึกเหล่านั้น",
    "whyOthersTh": {
      "A": "พูดถึงเอาป้ายออกหลังนับสินค้า ซึ่งขัดกับ hold จนตรวจสอบ",
      "B": "เปลี่ยนหัวข้อเป็นราคาสินค้า ไม่ต่อเรื่อง log และ quality review",
      "C": "เปลี่ยนหัวข้อไปโรงอาหาร ไม่เกี่ยวขั้นตอนรับสินค้า",
      "D": "กำหนดเงื่อนไขส่ง log ทำให้ประโยคถัดไป those records มีสิ่งที่อ้างถึงอย่างชัดเจน"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "ก่อนช่องเป็นขั้นตอนบันทึกรายละเอียด batch",
        "หลังช่องใช้ those records หมายถึงบันทึกที่จะส่งให้ Quality ตรวจ",
        "ตัวเลือก D เชื่อม log → Quality review โดยตรง"
      ],
      "memory": "Sentence insertion: เช็ก reference word เช่น those records ก่อนเลือก",
      "choiceReasons": {
        "A": "พูดถึงเอาป้ายออกหลังนับสินค้า ซึ่งขัดกับ hold จนตรวจสอบ",
        "B": "เปลี่ยนหัวข้อเป็นราคาสินค้า ไม่ต่อเรื่อง log และ quality review",
        "C": "เปลี่ยนหัวข้อไปโรงอาหาร ไม่เกี่ยวขั้นตอนรับสินค้า",
        "D": "กำหนดเงื่อนไขส่ง log ทำให้ประโยคถัดไป those records มีสิ่งที่อ้างถึงอย่างชัดเจน"
      }
    },
    "targetSeconds": 65,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-02-q1",
    "part": 6,
    "passageId": "exam2-p6-02",
    "stem": "[1] _____",
    "choices": [
      {
        "id": "A",
        "text": "recovered"
      },
      {
        "id": "B",
        "text": "referred"
      },
      {
        "id": "C",
        "text": "refunded"
      },
      {
        "id": "D",
        "text": "reflected"
      }
    ],
    "answer": "C",
    "skills": [
      "vocabulary"
    ],
    "ruleId": "exam2.p6.vocabulary",
    "difficulty": 4,
    "explanation": "ผู้เข้าร่วมจ่ายค่าสื่อไปแล้วและอาจไม่ต้องการสื่อ จึงต้องได้รับเงินคืน: charges will be refunded to their accounts (Passive)",
    "explanationTh": "ผู้เข้าร่วมจ่ายค่าสื่อไปแล้วและอาจไม่ต้องการสื่อ จึงต้องได้รับเงินคืน: charges will be refunded to their accounts (Passive)",
    "whyOthersTh": {
      "A": "recovered = กู้คืน/ได้รับกลับมา มักใช้กับข้อมูลหรือค่าใช้จ่ายที่ผู้ประกอบการเรียกคืน ไม่ใช่คืนให้ผู้ซื้อในบริบทนี้",
      "B": "referred = ส่งต่อให้อีกฝ่าย เช่น referred to an expert ไม่ใช่คืนเงิน",
      "C": "refunded = คืนเงินให้บัญชีผู้จ่าย ตรงกับ paid และ no longer needed",
      "D": "reflected = แสดงผล/สะท้อนในบัญชีได้ในบางบริบท แต่ไม่สื่อว่าได้เงินคืน"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "charges เป็นประธานที่ถูกกระทำและ will be + V3 เป็น passive",
        "paid กับ no longer needed ชี้เรื่องคืนเงินค่าสื่อ",
        "refund charges to an account คือคืนค่าใช้จ่ายเข้าบัญชี"
      ],
      "memory": "refund a fee / charges to an account = คืนเงิน",
      "choiceReasons": {
        "A": "recovered = กู้คืน/ได้รับกลับมา มักใช้กับข้อมูลหรือค่าใช้จ่ายที่ผู้ประกอบการเรียกคืน ไม่ใช่คืนให้ผู้ซื้อในบริบทนี้",
        "B": "referred = ส่งต่อให้อีกฝ่าย เช่น referred to an expert ไม่ใช่คืนเงิน",
        "C": "refunded = คืนเงินให้บัญชีผู้จ่าย ตรงกับ paid และ no longer needed",
        "D": "reflected = แสดงผล/สะท้อนในบัญชีได้ในบางบริบท แต่ไม่สื่อว่าได้เงินคืน"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-02-q2",
    "part": 6,
    "passageId": "exam2-p6-02",
    "stem": "[2] _____",
    "choices": [
      {
        "id": "A",
        "text": "Consequently"
      },
      {
        "id": "B",
        "text": "However"
      },
      {
        "id": "C",
        "text": "Similarly"
      },
      {
        "id": "D",
        "text": "For example"
      }
    ],
    "answer": "B",
    "skills": [
      "context"
    ],
    "ruleId": "exam2.p6.context",
    "difficulty": 4,
    "explanation": "ประโยคแรกบอกว่า portal ปิดซ่อม แต่ประโยคหลังยังมีทางเลือกส่งอีเมลได้ จึงใช้ However เพื่อแสดง contrast",
    "explanationTh": "ประโยคแรกบอกว่า portal ปิดซ่อม แต่ประโยคหลังยังมีทางเลือกส่งอีเมลได้ จึงใช้ However เพื่อแสดง contrast",
    "whyOthersTh": {
      "A": "Consequently = เป็นผลให้ แต่ข้อความไม่ได้บอกว่าการปิด portal ทำให้ต้องส่งอีเมลโดยอัตโนมัติทุกคน",
      "B": "However = อย่างไรก็ตาม มีทางเลือกสำหรับผู้ที่ต้องแก้ข้อมูลหลังวันนั้น",
      "C": "Similarly = เช่นเดียวกัน ไม่ใช่ความสัมพันธ์แบบทางเลือกต่างช่องทาง",
      "D": "For example = ตัวอย่างเช่น แต่ไม่ใช่ตัวอย่างของการปิดซ่อม portal"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "อ่านก่อนช่อง: portal closes temporarily",
        "หลังช่อง: attendees may email coordinator instead",
        "มีข้อยกเว้น/ทางเลือก จึงใช้ However"
      ],
      "memory": "However = แสดงข้อยกเว้นหรือ contrast",
      "choiceReasons": {
        "A": "Consequently = เป็นผลให้ แต่ข้อความไม่ได้บอกว่าการปิด portal ทำให้ต้องส่งอีเมลโดยอัตโนมัติทุกคน",
        "B": "However = อย่างไรก็ตาม มีทางเลือกสำหรับผู้ที่ต้องแก้ข้อมูลหลังวันนั้น",
        "C": "Similarly = เช่นเดียวกัน ไม่ใช่ความสัมพันธ์แบบทางเลือกต่างช่องทาง",
        "D": "For example = ตัวอย่างเช่น แต่ไม่ใช่ตัวอย่างของการปิดซ่อม portal"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-02-q3",
    "part": 6,
    "passageId": "exam2-p6-02",
    "stem": "[3] _____",
    "choices": [
      {
        "id": "A",
        "text": "Attendees may change their meal preferences at any time without notifying staff."
      },
      {
        "id": "B",
        "text": "The coordinator will confirm these e-mailed dietary updates within two business days."
      },
      {
        "id": "C",
        "text": "The training videos were produced for last year's course."
      },
      {
        "id": "D",
        "text": "Parking fees are included in the registration price for every participant."
      }
    ],
    "answer": "B",
    "skills": [
      "sentence-placement"
    ],
    "ruleId": "exam2.p6.sentence-placement",
    "difficulty": 5,
    "explanation": "หลังช่องก่อนหน้าเป็นการส่ง dietary requirements ทางอีเมล ข้อ B ใช้ these e-mailed dietary updates อ้างกลับโดยตรง และยืนยันว่าผู้ประสานงานจะตอบกลับภายในสองวันทำการ",
    "explanationTh": "หลังช่องก่อนหน้าเป็นการส่ง dietary requirements ทางอีเมล ข้อ B ใช้ these e-mailed dietary updates อ้างกลับโดยตรง และยืนยันว่าผู้ประสานงานจะตอบกลับภายในสองวันทำการ",
    "whyOthersTh": {
      "A": "บอกเปลี่ยน meal preferences เมื่อไรก็ได้โดยไม่แจ้ง ขัดกับขั้นตอนแจ้ง dietary requirements",
      "B": "these e-mailed dietary updates เป็นการอ้างกลับถึงข้อมูลอาหารในประโยคก่อนโดยตรง และบอกขั้นตอนยืนยันจากเจ้าหน้าที่",
      "C": "พูดเรื่องวิดีโอของปีที่แล้ว ไม่เกี่ยวการเข้าร่วมงานครั้งนี้",
      "D": "อ้างว่าที่จอดรถฟรีทั้งที่เอกสารไม่ได้มีข้อมูลสนับสนุนเรื่องราคา"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "ก่อนช่องมีคำแนะนำให้ส่ง dietary requirements ผ่านอีเมล",
        "these e-mailed dietary updates ต้องอ้างถึงข้อมูลที่เพิ่งกล่าว",
        "B เชื่อมการแจ้งข้อมูลกับการยืนยันจาก coordinator"
      ],
      "memory": "เติมประโยค: these/those/this ต้องอ้างถึงเนื้อหาก่อนหน้า",
      "choiceReasons": {
        "A": "บอกเปลี่ยน meal preferences เมื่อไรก็ได้โดยไม่แจ้ง ขัดกับขั้นตอนแจ้ง dietary requirements",
        "B": "these e-mailed dietary updates เป็นการอ้างกลับถึงข้อมูลอาหารในประโยคก่อนโดยตรง และบอกขั้นตอนยืนยันจากเจ้าหน้าที่",
        "C": "พูดเรื่องวิดีโอของปีที่แล้ว ไม่เกี่ยวการเข้าร่วมงานครั้งนี้",
        "D": "อ้างว่าที่จอดรถฟรีทั้งที่เอกสารไม่ได้มีข้อมูลสนับสนุนเรื่องราคา"
      }
    },
    "targetSeconds": 65,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-02-q4",
    "part": 6,
    "passageId": "exam2-p6-02",
    "stem": "[4] _____",
    "choices": [
      {
        "id": "A",
        "text": "Therefore"
      },
      {
        "id": "B",
        "text": "Otherwise"
      },
      {
        "id": "C",
        "text": "Meanwhile"
      },
      {
        "id": "D",
        "text": "In addition"
      }
    ],
    "answer": "D",
    "skills": [
      "context"
    ],
    "ruleId": "exam2.p6.context",
    "difficulty": 4,
    "explanation": "ประโยคก่อนบอกว่าจะส่ง location map; ประโยคหลังเตือนให้เผื่อเวลาไปถึงสถานที่ใหม่ จึงเป็นการเพิ่มคำแนะนำใช้ In addition",
    "explanationTh": "ประโยคก่อนบอกว่าจะส่ง location map; ประโยคหลังเตือนให้เผื่อเวลาไปถึงสถานที่ใหม่ จึงเป็นการเพิ่มคำแนะนำใช้ In addition",
    "whyOthersTh": {
      "A": "Therefore = ดังนั้น อาจสื่อผลต่อเนื่องได้ แต่ข้อมูลใหม่เป็นข้อเตือนเพิ่มเติม ไม่ใช่ผลโดยตรงของการส่งแผนที่",
      "B": "Otherwise = มิฉะนั้น ต้องมีผลเสียตามเงื่อนไข แต่ประโยคนี้เป็นคำแนะนำเพิ่ม",
      "C": "Meanwhile = ขณะเดียวกัน มักเชื่อมเหตุการณ์พร้อมกัน ไม่เข้ากับประโยคคำเตือน",
      "D": "In addition = นอกจากนี้ นำคำแนะนำอีกเรื่องต่อจาก location map"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "ก่อนช่องแจ้งว่าจะส่ง location map",
        "หลังช่องเป็นคำแนะนำให้เผื่อเวลาไปถึง",
        "In addition = ข้อมูลเพิ่มเติมที่สอดคล้องกัน"
      ],
      "memory": "In addition = เพิ่มข้อมูล; Otherwise = มิฉะนั้น",
      "choiceReasons": {
        "A": "Therefore = ดังนั้น อาจสื่อผลต่อเนื่องได้ แต่ข้อมูลใหม่เป็นข้อเตือนเพิ่มเติม ไม่ใช่ผลโดยตรงของการส่งแผนที่",
        "B": "Otherwise = มิฉะนั้น ต้องมีผลเสียตามเงื่อนไข แต่ประโยคนี้เป็นคำแนะนำเพิ่ม",
        "C": "Meanwhile = ขณะเดียวกัน มักเชื่อมเหตุการณ์พร้อมกัน ไม่เข้ากับประโยคคำเตือน",
        "D": "In addition = นอกจากนี้ นำคำแนะนำอีกเรื่องต่อจาก location map"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-03-q1",
    "part": 6,
    "passageId": "exam2-p6-03",
    "stem": "[1] _____",
    "choices": [
      {
        "id": "A",
        "text": "advanced"
      },
      {
        "id": "B",
        "text": "postponed"
      },
      {
        "id": "C",
        "text": "prolonged"
      },
      {
        "id": "D",
        "text": "suspended"
      }
    ],
    "answer": "B",
    "skills": [
      "vocabulary"
    ],
    "ruleId": "exam2.p6.vocabulary",
    "difficulty": 4,
    "explanation": "ย้ายกำหนดการออกไปอีกสามวันทำการ ต้อง postpone a schedule/move = เลื่อนเวลาออกไป ไม่ใช่ระงับทั้งหมด",
    "explanationTh": "ย้ายกำหนดการออกไปอีกสามวันทำการ ต้อง postpone a schedule/move = เลื่อนเวลาออกไป ไม่ใช่ระงับทั้งหมด",
    "whyOthersTh": {
      "A": "advanced = เลื่อนให้เร็วขึ้น ขัดกับติดตั้งช้ากว่ากำหนด",
      "B": "postponed = เลื่อนเวลาออกไปอีกสามวัน เหมาะกับ relocation schedule",
      "C": "prolonged = ทำให้กระบวนการกินเวลานานขึ้น ไม่ระบุการเลื่อนวันที่ที่วางไว้เท่ากับ postponed",
      "D": "suspended = หยุด/ระงับชั่วคราว แต่เอกสารบอกวันย้ายใหม่"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "because network installation took longer → ต้องขยับวันย้าย",
        "by three working days บอกจำนวนวันที่กำหนดถูกเลื่อน",
        "postpone the relocation schedule = เลื่อนตาราง"
      ],
      "memory": "postpone a date/move; prolong a process; suspend operations",
      "choiceReasons": {
        "A": "advanced = เลื่อนให้เร็วขึ้น ขัดกับติดตั้งช้ากว่ากำหนด",
        "B": "postponed = เลื่อนเวลาออกไปอีกสามวัน เหมาะกับ relocation schedule",
        "C": "prolonged = ทำให้กระบวนการกินเวลานานขึ้น ไม่ระบุการเลื่อนวันที่ที่วางไว้เท่ากับ postponed",
        "D": "suspended = หยุด/ระงับชั่วคราว แต่เอกสารบอกวันย้ายใหม่"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-03-q2",
    "part": 6,
    "passageId": "exam2-p6-03",
    "stem": "[2] _____",
    "choices": [
      {
        "id": "A",
        "text": "Workstations assigned to the support team will be replaced next year."
      },
      {
        "id": "B",
        "text": "Employees will receive a complimentary meal on moving day."
      },
      {
        "id": "C",
        "text": "Some servers cannot be turned off until daily backups have finished."
      },
      {
        "id": "D",
        "text": "The parking garage has recently added new spaces."
      }
    ],
    "answer": "C",
    "skills": [
      "sentence-placement"
    ],
    "ruleId": "exam2.p6.sentence-placement",
    "difficulty": 5,
    "explanation": "ประโยคหลังบอก therefore keep a record of equipment that must remain connected; ก่อนหน้าจึงต้องพูดถึง servers ที่ห้ามปิดจน backup เสร็จ ซึ่งเป็นเหตุให้ทำรายการอุปกรณ์",
    "explanationTh": "ประโยคหลังบอก therefore keep a record of equipment that must remain connected; ก่อนหน้าจึงต้องพูดถึง servers ที่ห้ามปิดจน backup เสร็จ ซึ่งเป็นเหตุให้ทำรายการอุปกรณ์",
    "whyOthersTh": {
      "A": "เปลี่ยนเรื่องการจัดซื้อเวิร์กสเตชันปีหน้า ไม่เชื่อม therefore",
      "B": "เพิ่มสวัสดิการอาหาร ไม่เกี่ยวอุปกรณ์ที่ต้องต่อเนื่อง",
      "C": "servers cannot be turned off ก่อน backup → therefore ต้องทำรายการอุปกรณ์ห้ามปิด",
      "D": "ที่จอดรถไม่สัมพันธ์กับการปิดระบบหรือ continuity"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "หลังช่องใช้ therefore = เพราะฉะนั้น ต้องมีเหตุอยู่ด้านหน้า",
        "เหตุคือ server บางเครื่องปิดไม่ได้จน backup เสร็จ",
        "ข้อ C เชื่อมเหตุไปสู่ equipment that must remain connected"
      ],
      "memory": "Therefore ชี้ว่าประโยคก่อนต้องเป็นเหตุของคำแนะนำถัดไป",
      "choiceReasons": {
        "A": "เปลี่ยนเรื่องการจัดซื้อเวิร์กสเตชันปีหน้า ไม่เชื่อม therefore",
        "B": "เพิ่มสวัสดิการอาหาร ไม่เกี่ยวอุปกรณ์ที่ต้องต่อเนื่อง",
        "C": "servers cannot be turned off ก่อน backup → therefore ต้องทำรายการอุปกรณ์ห้ามปิด",
        "D": "ที่จอดรถไม่สัมพันธ์กับการปิดระบบหรือ continuity"
      }
    },
    "targetSeconds": 65,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-03-q3",
    "part": 6,
    "passageId": "exam2-p6-03",
    "stem": "[3] _____",
    "choices": [
      {
        "id": "A",
        "text": "However"
      },
      {
        "id": "B",
        "text": "Otherwise"
      },
      {
        "id": "C",
        "text": "Therefore"
      },
      {
        "id": "D",
        "text": "Similarly"
      }
    ],
    "answer": "A",
    "skills": [
      "context"
    ],
    "ruleId": "exam2.p6.context",
    "difficulty": 4,
    "explanation": "ห้ามพนักงานทั่วไปถอดสายคอมพิวเตอร์ แต่มีข้อยกเว้นสำหรับคนต้องเข้าพื้นที่ไปวัดขนาด ใช้ However แสดง contrast",
    "explanationTh": "ห้ามพนักงานทั่วไปถอดสายคอมพิวเตอร์ แต่มีข้อยกเว้นสำหรับคนต้องเข้าพื้นที่ไปวัดขนาด ใช้ However แสดง contrast",
    "whyOthersTh": {
      "A": "However = อย่างไรก็ตาม เปิดข้อยกเว้นการเข้าพื้นที่แบบขออนุญาต",
      "B": "Otherwise = มิฉะนั้น ต้องมีผลลัพธ์จากการไม่ทำตามเงื่อนไข ไม่ใช่ข้อยกเว้น",
      "C": "Therefore = ดังนั้น ไม่ใช่ผลของข้อห้ามเรื่องถอดสาย",
      "D": "Similarly = ทำนองเดียวกัน ไม่ใช่ข้อยกเว้นสำหรับการเข้าพื้นที่"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "ก่อนช่อง: do not disconnect desktop computers",
        "หลังช่อง: staff may request temporary access",
        "เป็นข้อยกเว้นจากข้อห้าม จึงใช้ However"
      ],
      "memory": "However = exception/contrast; Therefore = consequence",
      "choiceReasons": {
        "A": "However = อย่างไรก็ตาม เปิดข้อยกเว้นการเข้าพื้นที่แบบขออนุญาต",
        "B": "Otherwise = มิฉะนั้น ต้องมีผลลัพธ์จากการไม่ทำตามเงื่อนไข ไม่ใช่ข้อยกเว้น",
        "C": "Therefore = ดังนั้น ไม่ใช่ผลของข้อห้ามเรื่องถอดสาย",
        "D": "Similarly = ทำนองเดียวกัน ไม่ใช่ข้อยกเว้นสำหรับการเข้าพื้นที่"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-03-q4",
    "part": 6,
    "passageId": "exam2-p6-03",
    "stem": "[4] _____",
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
        "text": "between"
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
    "ruleId": "exam2.p6.preposition",
    "difficulty": 4,
    "explanation": "by Friday at 3:00 P.M. = ต้องยื่นให้เสร็จไม่เกินเวลานั้น เป็น deadline; ต้องแยก from during ที่หมายถึงระหว่างช่วง",
    "explanationTh": "by Friday at 3:00 P.M. = ต้องยื่นให้เสร็จไม่เกินเวลานั้น เป็น deadline; ต้องแยก from during ที่หมายถึงระหว่างช่วง",
    "whyOthersTh": {
      "A": "during + period/event ไม่ใช่ deadline ที่ระบุวันและเวลาแน่นอน",
      "B": "among = ท่ามกลางคนหรือสิ่งของหลายอย่าง ไม่ใช้กับเวลาส่ง",
      "C": "between ต้องมีสองจุดเวลา เช่น between 1 and 3 P.M.",
      "D": "by = ไม่เกินวันศุกร์เวลา 3 โมงเย็น"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "must be submitted บอก action ที่มีกำหนดส่ง",
        "Friday at 3:00 P.M. เป็น deadline",
        "by + deadline = อย่างช้าที่สุดไม่เกินเวลานี้"
      ],
      "memory": "by deadline vs during period vs within duration",
      "choiceReasons": {
        "A": "during + period/event ไม่ใช่ deadline ที่ระบุวันและเวลาแน่นอน",
        "B": "among = ท่ามกลางคนหรือสิ่งของหลายอย่าง ไม่ใช้กับเวลาส่ง",
        "C": "between ต้องมีสองจุดเวลา เช่น between 1 and 3 P.M.",
        "D": "by = ไม่เกินวันศุกร์เวลา 3 โมงเย็น"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-04-q1",
    "part": 6,
    "passageId": "exam2-p6-04",
    "stem": "[1] _____",
    "choices": [
      {
        "id": "A",
        "text": "automatically"
      },
      {
        "id": "B",
        "text": "automatic"
      },
      {
        "id": "C",
        "text": "automation"
      },
      {
        "id": "D",
        "text": "automate"
      }
    ],
    "answer": "A",
    "skills": [
      "part-of-speech"
    ],
    "ruleId": "exam2.p6.part-of-speech",
    "difficulty": 4,
    "explanation": "is not issued เป็น passive verb; ช่องว่างบอกวิธีออกเครดิตว่าไม่ได้ออกให้โดยอัตโนมัติ จึงใช้ automatically (Adv.)",
    "explanationTh": "is not issued เป็น passive verb; ช่องว่างบอกวิธีออกเครดิตว่าไม่ได้ออกให้โดยอัตโนมัติ จึงใช้ automatically (Adv.)",
    "whyOthersTh": {
      "A": "automatically เป็น Adv. = โดยอัตโนมัติ ใช้ขยาย is issued",
      "B": "automatic เป็น Adj. ต้องขยายคำนาม เช่น an automatic credit",
      "C": "automation เป็น N. การทำงานอัตโนมัติ ไม่ขยาย verb",
      "D": "automate เป็น V1 = ทำให้เป็นอัตโนมัติ แต่ไม่ใช้ขยาย issued"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "A service credit เป็นประธาน; is not issued เป็น passive verb",
        "ช่องว่างขยายการออกเครดิตไม่ใช่ขยายคำนาม credit",
        "automatically เป็น Adv. หลัง passive verb"
      ],
      "memory": "be + V3 + adverb / be + adverb + V3",
      "choiceReasons": {
        "A": "automatically เป็น Adv. = โดยอัตโนมัติ ใช้ขยาย is issued",
        "B": "automatic เป็น Adj. ต้องขยายคำนาม เช่น an automatic credit",
        "C": "automation เป็น N. การทำงานอัตโนมัติ ไม่ขยาย verb",
        "D": "automate เป็น V1 = ทำให้เป็นอัตโนมัติ แต่ไม่ใช้ขยาย issued"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-04-q2",
    "part": 6,
    "passageId": "exam2-p6-04",
    "stem": "[2] _____",
    "choices": [
      {
        "id": "A",
        "text": "Furthermore"
      },
      {
        "id": "B",
        "text": "For example"
      },
      {
        "id": "C",
        "text": "Nevertheless"
      },
      {
        "id": "D",
        "text": "As a result"
      }
    ],
    "answer": "C",
    "skills": [
      "context"
    ],
    "ruleId": "exam2.p6.context",
    "difficulty": 5,
    "explanation": "แม้คำขอที่ส่งช้าจะยังถูกพิจารณา แต่ไม่รับประกันเครดิตเมื่อไม่มี record แล้ว ใช้ Nevertheless แสดงข้อจำกัด/contrast",
    "explanationTh": "แม้คำขอที่ส่งช้าจะยังถูกพิจารณา แต่ไม่รับประกันเครดิตเมื่อไม่มี record แล้ว ใช้ Nevertheless แสดงข้อจำกัด/contrast",
    "whyOthersTh": {
      "A": "Furthermore = นอกจากนี้ ใช้เพิ่มข้อเท็จจริงทิศเดียว ไม่เน้นข้อจำกัดที่ตามมา",
      "B": "For example = ตัวอย่างเช่น แต่ข้อความถัดไปไม่ใช่ตัวอย่างของการพิจารณา",
      "C": "Nevertheless = อย่างไรก็ตาม สื่อข้อจำกัดว่า review ได้แต่ guarantee ไม่ได้",
      "D": "As a result = ผลคือ... แต่การตรวจคำขอไม่ได้ทำให้บันทึกหาย"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "Requests submitted outside ... will still be reviewed เป็นข้อผ่อนผัน",
        "credits cannot be guaranteed เมื่อ records unavailable เป็นข้อจำกัด",
        "Nevertheless เชื่อม concessive contrast"
      ],
      "memory": "Nevertheless = despite that / even so",
      "choiceReasons": {
        "A": "Furthermore = นอกจากนี้ ใช้เพิ่มข้อเท็จจริงทิศเดียว ไม่เน้นข้อจำกัดที่ตามมา",
        "B": "For example = ตัวอย่างเช่น แต่ข้อความถัดไปไม่ใช่ตัวอย่างของการพิจารณา",
        "C": "Nevertheless = อย่างไรก็ตาม สื่อข้อจำกัดว่า review ได้แต่ guarantee ไม่ได้",
        "D": "As a result = ผลคือ... แต่การตรวจคำขอไม่ได้ทำให้บันทึกหาย"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-04-q3",
    "part": 6,
    "passageId": "exam2-p6-04",
    "stem": "[3] _____",
    "choices": [
      {
        "id": "A",
        "text": "Applicants should keep copies of all documents for personal records."
      },
      {
        "id": "B",
        "text": "Approved requests will be applied to the next bill after verification."
      },
      {
        "id": "C",
        "text": "The new customer service center opens on Saturdays."
      },
      {
        "id": "D",
        "text": "Bank transfer fees vary depending on the customer's institution."
      }
    ],
    "answer": "B",
    "skills": [
      "sentence-placement"
    ],
    "ruleId": "exam2.p6.sentence-placement",
    "difficulty": 5,
    "explanation": "ประโยคถัดไปขึ้นต้น The adjustment will appear ... on the following statement; ต้องมีประโยคก่อนอธิบายว่า approved requests จะนำไปหักในบิลถัดไป จึงเชื่อม referent The adjustment ได้",
    "explanationTh": "ประโยคถัดไปขึ้นต้น The adjustment will appear ... on the following statement; ต้องมีประโยคก่อนอธิบายว่า approved requests จะนำไปหักในบิลถัดไป จึงเชื่อม referent The adjustment ได้",
    "whyOthersTh": {
      "A": "เก็บเอกสารเป็นข้อแนะนำทั่วไป แต่ไม่แนะนำ The adjustment ในประโยคถัดไป",
      "B": "Approved requests applied to next bill เป็นสะพานเชื่อมเครดิตและ The adjustment",
      "C": "เวลาเปิดศูนย์บริการไม่เกี่ยวการแสดงเครดิตใน statement",
      "D": "ค่าธรรมเนียมโอนเงินทำให้เข้าใจผิด เพราะข้อความบอกว่าจะไม่โอนเงินเข้าบัญชี"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "หลังช่อง The adjustment ต้องมีคำอ้างอิงไปยังเครดิตที่อนุมัติ",
        "ถัดมา rather than bank transfer ยืนยันว่าจะหักในบิล",
        "B เชื่อม approved credits → adjustment on next bill"
      ],
      "memory": "Sentence insertion: track definite reference (the adjustment)",
      "choiceReasons": {
        "A": "เก็บเอกสารเป็นข้อแนะนำทั่วไป แต่ไม่แนะนำ The adjustment ในประโยคถัดไป",
        "B": "Approved requests applied to next bill เป็นสะพานเชื่อมเครดิตและ The adjustment",
        "C": "เวลาเปิดศูนย์บริการไม่เกี่ยวการแสดงเครดิตใน statement",
        "D": "ค่าธรรมเนียมโอนเงินทำให้เข้าใจผิด เพราะข้อความบอกว่าจะไม่โอนเงินเข้าบัญชี"
      }
    },
    "targetSeconds": 65,
    "chapterIds": [
      17,
      21,
      27
    ]
  },
  {
    "id": "exam2-p6-04-q4",
    "part": 6,
    "passageId": "exam2-p6-04",
    "stem": "[4] _____",
    "choices": [
      {
        "id": "A",
        "text": "administer"
      },
      {
        "id": "B",
        "text": "approve"
      },
      {
        "id": "C",
        "text": "accommodate"
      },
      {
        "id": "D",
        "text": "process"
      }
    ],
    "answer": "D",
    "skills": [
      "vocabulary"
    ],
    "ruleId": "exam2.p6.vocabulary",
    "difficulty": 4,
    "explanation": "process requests promptly = ดำเนินการจัดการคำขออย่างรวดเร็ว; account number/time ช่วยให้เจ้าหน้าที่ตรวจและจัดการคำขอ",
    "explanationTh": "process requests promptly = ดำเนินการจัดการคำขออย่างรวดเร็ว; account number/time ช่วยให้เจ้าหน้าที่ตรวจและจัดการคำขอ",
    "whyOthersTh": {
      "A": "administer = บริหารจัดการโครงการหรือบริการกว้าง ๆ ไม่ใช่สำนวนที่ชัดที่สุดเมื่อพูดถึงคำร้องแต่ละรายการ",
      "B": "approve = อนุมัติ ซึ่งไม่สามารถรับรองว่าทุกคำขอจะได้รับการอนุมัติ เพียงต้องจัดการให้เร็ว",
      "C": "accommodate = อำนวยความสะดวก/รองรับคำขอ แต่ไม่เน้นขั้นตอนตรวจรายการ",
      "D": "process = ดำเนินการตามขั้นตอนของคำร้อง เช่น process a claim/application"
    },
    "coaching": {
      "focus": [],
      "steps": [
        "help + object (our team) + V1; requests เป็นกรรม",
        "ข้อมูลเลขบัญชีช่วยให้จัดการ request ไม่ได้แปลว่าจะอนุมัติทุกเรื่อง",
        "process requests = ดำเนินการตามขั้นตอน"
      ],
      "memory": "process requests/claims/applications; approve when eligible",
      "choiceReasons": {
        "A": "administer = บริหารจัดการโครงการหรือบริการกว้าง ๆ ไม่ใช่สำนวนที่ชัดที่สุดเมื่อพูดถึงคำร้องแต่ละรายการ",
        "B": "approve = อนุมัติ ซึ่งไม่สามารถรับรองว่าทุกคำขอจะได้รับการอนุมัติ เพียงต้องจัดการให้เร็ว",
        "C": "accommodate = อำนวยความสะดวก/รองรับคำขอ แต่ไม่เน้นขั้นตอนตรวจรายการ",
        "D": "process = ดำเนินการตามขั้นตอนของคำร้อง เช่น process a claim/application"
      }
    },
    "targetSeconds": 45,
    "chapterIds": [
      17,
      21,
      27
    ]
  }
]
