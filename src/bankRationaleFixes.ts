import type { Question } from './types'

// Reviewed sentence-level explanations for legacy questions that had vague auto-generated distractor feedback.
// A fix must describe the exact syntax and meaning of EVERY candidate, rather than reusing a rule summary.
export const rationaleFixes: Record<string, Pick<Question,'coaching'|'explanationTh'|'translationTh'>> = {
  'v3-p5-009': {
    explanationTh: 'This is the first time = นี่เป็นครั้งแรกจนถึงปัจจุบัน; ในอนุประโยค the company เป็นประธานเอกพจน์ จึงใช้ has hosted (has + V3) เพื่อเล่าประสบการณ์ที่เกิดขึ้นจนถึงตอนนี้ ไม่ใช่เหตุการณ์ประจำหรือเหตุการณ์ที่เกิดก่อนอดีตอีกจุดหนึ่ง',
    translationTh: 'นี่เป็นครั้งแรกที่บริษัทได้จัดงานแสดงสินค้าในรูปแบบออนไลน์ทั้งหมด',
    coaching: {
      focus: ['This is the first time','the company','a fully virtual trade show'],
      steps: [
        'แยกประโยค: This (S) + is (V linking) + the first time; ส่วนที่ขยาย first time คือ the company (S) + _____ (V) + a fully virtual trade show (กรรม)',
        'This is the first time กล่าวถึงประสบการณ์ครั้งแรกจนถึง “ตอนนี้” จึงใช้ Present Perfect: has/have + V3; the company เป็นเอกพจน์ ต้องเลือก has',
        'host เป็นกริยาแปลว่า “จัดงาน/เป็นเจ้าภาพ”; has hosted จึงหมายถึง “ได้จัดงานมาแล้วเป็นครั้งแรก” ไม่ใช่ hosts แบบทำเป็นประจำ'
      ],
      memory: 'This is the first time + S + has/have + V3 (จนถึงปัจจุบัน) | That was the first time + S + had + V3 (มองย้อนจากอดีต)',
      breakdown: { subject:'the company', verb:'has hosted', object:'a fully virtual trade show', blankRole:'กริยาหลักของอนุประโยค', signal:'This is the first time', pattern:'has + V3 (Present Perfect)' },
      choiceReasons: {
        A:'hosts = Present Simple (V-s), ใช้กับกิจวัตรหรือข้อเท็จจริง เช่น The company hosts this event annually; แต่ “This is the first time” เน้นประสบการณ์จนถึงปัจจุบัน ไม่ใช่งานที่ทำประจำ',
        B:'hosted = Past Simple (V2), ใช้บอกเหตุการณ์ในอดีตที่จบไป เช่น The company hosted an event last year; ประโยคนี้ใช้ is the first time ซึ่งเชื่อมประสบการณ์จนถึงตอนนี้ จึงเหมาะกับ has hosted มากกว่า',
        C:'has hosted = has + V3 (Present Perfect), the company เป็น S เอกพจน์; host = จัดงาน, hosted = V3; โครงสร้าง This is the first time + S + has/have + V3 ถูกทั้งรูปและความหมาย',
        D:'had hosted = Past Perfect (had + V3), ใช้เมื่อมองย้อนจากจุดอ้างอิงในอดีต เช่น That was the first time the company had hosted ...; แต่ที่นี่ is บอกปัจจุบัน จึงไม่ใช้ had hosted'
      }
    }
  },
  'p5-v4-09-07': {
    explanationTh:'The invoices (S พหูพจน์) have not ... yet บอกว่ายังไม่เกิดการอนุมัติจนถึงปัจจุบัน และ invoices เป็นสิ่งที่ถูกอนุมัติ ไม่ได้อนุมัติคนอื่นเอง จึงใช้ Present Perfect Passive: have + not + been + V3 = have not been approved',
    translationTh:'ใบแจ้งหนี้เหล่านั้นยังไม่ได้รับการอนุมัติ',
    coaching: {
      focus:['The invoices','have not','yet'],
      steps:[
        'The invoices เป็นประธานพหูพจน์; have เป็นกริยาช่วยและ yet บอกว่ายังไม่เกิดขึ้นจนถึงเวลานี้',
        'ผู้อนุมัติคือคน/ผู้มีอำนาจ แต่ invoices เป็นผู้รับการกระทำ → ต้องเป็น Passive; Present Perfect Passive = have/has + been + V3',
        'ในประโยคมี have not อยู่แล้ว จึงเหลือเพียง been + approved (V3) เติมช่องว่างให้เป็น have not been approved'
      ],
      memory:'have/has + (not) + been + V3 = Present Perfect Passive | yet มักใช้กับประโยคปฏิเสธ/คำถาม',
      breakdown: { subject:'The invoices', verb:'have not been approved', blankRole:'ส่วนของ Passive Verb Phrase', signal:'have not ... yet',pattern:'have not + been + V3' },
      choiceReasons:{
        A:'approve เป็น V1; have not ตามด้วย V3 (been) ไม่ใช่ V1 โดด ๆ และ invoices ต้องเป็นสิ่งที่ถูกอนุมัติ ไม่ใช่ผู้อนุมัติ',
        B:'been approved = been + V3 เติมหลัง have not ได้พอดี: have not been approved = ยังไม่ได้รับการอนุมัติ',
        C:'approving เป็น V-ing; ถ้าเป็น Progressive ต้องมี be + V-ing แต่ที่นี่ต้องการ Perfect Passive สำหรับใบแจ้งหนี้ที่เป็นผู้ถูกกระทำ',
        D:'been approve ผิดตรง approve: หลัง been ใน Passive ต้องเป็น Past Participle (V3) คือ approved ไม่ใช่ approve (V1)'
      }
    }
  }
}
