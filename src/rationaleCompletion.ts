import type { Passage, Question } from './types'

/**
 * Complete individual A-D explanations for historical banks.
 *
 * Editorial transparency: older items that have not received a handwritten
 * Thai four-choice rationale are labelled "contextualized", NOT "reviewed".
 * The completed reasons rely on the actual choices, the correct explanation,
 * the sentence or document, and, when available, source evidence.
 *
 * This is deliberately different from a one-sentence "does not fit" fallback.
 */
const connectors: Record<string, [string,string,string]> = {
  'although':['conjunction','แม้ว่า (ขัดแย้ง)','Although + S + V'],
  'even though':['conjunction','แม้ว่า (ขัดแย้ง)','Even though + S + V'],
  'though':['conjunction','แม้ว่า (ขัดแย้ง)','Though + S + V'],
  'despite':['preposition','แม้จะมี/แม้ว่า','Despite + N. / V-ing'],
  'in spite of':['preposition','แม้จะมี/แม้ว่า','In spite of + N. / V-ing'],
  'because':['conjunction','เพราะว่า (เหตุผล)','Because + S + V'],
  'because of':['preposition','เนื่องจาก','Because of + N. / V-ing'],
  'due to':['preposition','เนื่องจาก','Due to + N.'],
  'owing to':['preposition','เนื่องจาก','Owing to + N.'],
  'unless':['conjunction','เว้นแต่ (เงื่อนไขยกเว้น)','Unless + S + V'],
  'if':['conjunction','ถ้า (เงื่อนไข)','If + S + V'],
  'provided that':['conjunction','โดยมีเงื่อนไขว่า','Provided that + S + V'],
  'as long as':['conjunction','ตราบเท่าที่/หาก','As long as + S + V'],
  'while':['conjunction','ระหว่างที่/ในขณะที่','While + S + V'],
  'whereas':['conjunction','ในขณะที่ (เปรียบต่าง)','Whereas + S + V'],
  'until':['conjunction/preposition','จนกว่า/จนถึง','Until + clause / time'],
  'since':['conjunction/preposition','ตั้งแต่/เพราะว่า','Since + clause / date'],
  'during':['preposition','ระหว่างช่วงเวลา','During + period/event (noun)'],
  'throughout':['preposition','ตลอดช่วงเวลา','Throughout + period (noun)'],
  'among':['preposition','ท่ามกลางกลุ่ม','Among + group'],
  'between':['preposition','ระหว่างสิ่งที่แยกได้','Between + two or more distinct endpoints'],
  'by':['preposition','ภายในไม่เกินกำหนด/โดย','By + deadline / agent'],
  'within':['preposition','ภายในช่วงเวลาหรือขอบเขต','Within + duration/range'],
  'before':['conjunction/preposition','ก่อน','Before + clause / N. / V-ing'],
  'after':['conjunction/preposition','หลัง','After + clause / N. / V-ing'],
  'therefore':['sentence connector','ดังนั้น (ผลจากเหตุ)','Therefore, result'],
  'consequently':['sentence connector','ด้วยเหตุนี้ (ผล)','Consequently, result'],
  'as a result':['sentence connector','ดังนั้น/ผลที่ตามมา','As a result, consequence'],
  'however':['sentence connector','อย่างไรก็ตาม (ขัดแย้ง)','However, contrast'],
  'nevertheless':['sentence connector','อย่างไรก็ตาม (ขัดแย้ง)','Nevertheless, contrast'],
  'otherwise':['sentence connector','มิฉะนั้น (ผลของการไม่ทำ)','Otherwise, alternative consequence'],
  'meanwhile':['sentence connector','ขณะเดียวกัน (เวลา)','Meanwhile, simultaneous event'],
  'similarly':['sentence connector','เช่นเดียวกัน (สอดคล้อง)','Similarly, parallel point'],
  'likewise':['sentence connector','เช่นเดียวกัน','Likewise, parallel point'],
  'in addition':['sentence connector','นอกจากนี้ (ข้อมูลเพิ่ม)','In addition, another point'],
  'furthermore':['sentence connector','นอกจากนี้ (เพิ่มข้อสนับสนุน)','Furthermore, additional support'],
  'moreover':['sentence connector','ยิ่งไปกว่านั้น','Moreover, additional point'],
  'for example':['sentence connector','ตัวอย่างเช่น','For example, illustration'],
  'for instance':['sentence connector','ตัวอย่างเช่น','For instance, illustration'],
  'instead':['sentence connector','แทนที่จะเป็นอย่างนั้น','Instead, replacement/alternative'],
  'rather than':['comparison connector','แทนที่จะ','Rather than + N. / V-ing'],
  'so that':['conjunction','เพื่อให้ (จุดประสงค์)','So that + S + modal + V'],
  'in order to':['infinitive phrase','เพื่อที่จะ','In order to + V1'],
  'so as to':['infinitive phrase','เพื่อที่จะ','So as to + V1'],
  'regardless of':['preposition','โดยไม่คำนึงถึง','Regardless of + N. / whether-clause'],
  'according to':['preposition','ตามที่/ตามข้อมูลของ','According to + N.'],
  'in accordance with':['preposition phrase','ตามข้อกำหนด/สอดคล้องกับ','In accordance with + rule'],
  'apart from':['preposition','นอกเหนือจาก/ยกเว้น','Apart from + N.'],
  'rather':['adverb','ค่อนข้าง/กลับกัน','Rather + Adj./Adv.'],
  'as':['comparison connector','เท่ากัน/ในฐานะ','As + Adj. + as / as a role'],
  'than':['comparison connector','กว่า','Comparative + than'],
  'like':['preposition','เหมือน/คล้าย','Like + N.'],
  'from':['preposition','จาก','From + origin / different from'],
  'to':['preposition/infinitive','ถึง/เพื่อ','To + place / infinitive V1'],
  'for':['preposition','สำหรับ/เป็นเวลา','For + beneficiary/duration/N.'],
  'with':['preposition','ด้วย/กับ','With + N.'],
  'at':['preposition','ที่ (จุด)','At + point/place/time'],
  'on':['preposition','บน/ในวันที่','On + day/surface'],
  'in':['preposition','ใน/ภายใน','In + period/place'],
  'of':['preposition','ของ','Of + N.'],
}

const specialWords:Record<string,string> = {
  'subject':'อยู่ภายใต้/อาจถูกเปลี่ยน (subject to)',
  'estate':'อสังหาริมทรัพย์/มรดก', 'esteem':'ความเคารพ/ยกย่อง',
  'receipt':'ใบเสร็จรับเงิน','received':'ได้รับแล้ว/รูป V3',
  'review':'ตรวจทาน','revise':'แก้ไข','revision':'การแก้ไข',
  'conduct':'ดำเนินการ','construct':'ก่อสร้าง','contact':'ติดต่อ','contain':'บรรจุ',
  'transportation':'การขนส่ง/รถรับส่ง','transporting':'กำลังขนส่ง/การขนส่ง',
  'approval':'การอนุมัติ','approve':'อนุมัติ','approved':'ได้รับอนุมัติแล้ว',
  'prompt':'รวดเร็ว/ทันที (Adj.)','promptly':'อย่างรวดเร็ว (Adv.)','promptness':'ความรวดเร็ว (N.)',
  'efficient':'มีประสิทธิภาพ (Adj.)','efficiently':'อย่างมีประสิทธิภาพ (Adv.)',
  'efficiency':'ประสิทธิภาพ (N.)','effective':'ได้ผล (Adj.)','effectively':'อย่างได้ผล (Adv.)',
  'relevant':'เกี่ยวข้อง (Adj.)','relevance':'ความเกี่ยวข้อง (N.)','relevantly':'อย่างเกี่ยวข้อง (Adv.)',
  'available':'ใช้ได้/มีอยู่ (Adj.)','availability':'ความพร้อมให้ใช้ (N.)',
  'satisfaction':'ความพึงพอใจ (N.)','satisfied':'พึงพอใจ (Adj.)',
  'satisfactory':'น่าพอใจ (Adj.)','satisfactorily':'อย่างน่าพอใจ (Adv.)',
  'considerably':'มากอย่างเห็นได้ชัด (Adv.)','considerable':'มากอย่างมีนัยสำคัญ (Adj.)',
  'noticeably':'อย่างสังเกตได้ (Adv.)','noticeable':'เห็นได้ชัด (Adj.)',
  'significant':'สำคัญ/มาก (Adj.)','significantly':'อย่างมีนัยสำคัญ (Adv.)',
  'reliable':'เชื่อถือได้ (Adj.)','reliably':'อย่างเชื่อถือได้ (Adv.)',
  'careful':'ระมัดระวัง (Adj.)','carefully':'อย่างระมัดระวัง (Adv.)','carefulness':'ความระมัดระวัง (N.)',
  'care':'ความระมัดระวัง/ดูแล (N./V.)',
  'professional':'มืออาชีพ (Adj.)','professionally':'อย่างเป็นมืออาชีพ (Adv.)',
  'profession':'อาชีพ (N.)','professionalism':'ความเป็นมืออาชีพ (N.)',
  'clear':'ชัดเจน (Adj.)','clearly':'อย่างชัดเจน (Adv.)','clarity':'ความชัดเจน (N.)',
  'accurate':'แม่นยำ (Adj.)','accurately':'อย่างแม่นยำ (Adv.)','accuracy':'ความแม่นยำ (N.)',
  'comprehensive':'ครอบคลุม (Adj.)','comprehensively':'อย่างครอบคลุม (Adv.)',
  'successful':'ประสบความสำเร็จ (Adj.)','successfully':'อย่างสำเร็จ (Adv.)','success':'ความสำเร็จ (N.)',
  'flexible':'ยืดหยุ่นได้ (Adj.)','flexibly':'อย่างยืดหยุ่น (Adv.)','flexibility':'ความยืดหยุ่น (N.)',
  'temporary':'ชั่วคราว (Adj.)','temporarily':'เป็นการชั่วคราว (Adv.)',
  'convenient':'สะดวก (Adj.)','conveniently':'อย่างสะดวก (Adv.)','convenience':'ความสะดวก (N.)',
  'request':'ร้องขอ','require':'กำหนดให้มี/จำเป็นต้องมี','restore':'ฟื้นฟู','recruit':'รับสมัคร',
  'substantiate':'ยืนยันโดยใช้หลักฐาน','submit':'ส่งเอกสาร','substitute':'ใช้แทน','stimulate':'กระตุ้น',
  'reimburse':'คืนเงินให้ผู้สำรองจ่าย','reconcile':'กระทบยอดบัญชี','waive':'ยกเว้นค่าธรรมเนียม',
  'postpone':'เลื่อนออกไป','delay':'ทำให้ล่าช้า','advance':'เลื่อนเร็วขึ้น','cancel':'ยกเลิก',
  'familiarize':'ทำให้คุ้นเคย','themselves':'ตัวเอง (พหูพจน์)','theirs':'ของพวกเขา (ใช้เดี่ยว)',
  'their':'ของพวกเขา (ขยายนาม)','they':'พวกเขา (ประธาน)',
  'its':'ของมัน/ของบริษัท (ขยายนาม)',"it's":'it is หรือ it has (ไม่ใช่คำแสดงเจ้าของ)',
  'whose':'ผู้ซึ่ง...ของเขา','who':'ผู้ซึ่ง (คน)','whom':'ผู้ซึ่งเป็นกรรม',
  'which':'ซึ่ง (สิ่งของ)','where':'ที่ซึ่ง (สถานที่)','what':'สิ่งที่',
  'inconvenience':'ความไม่สะดวก','inconsistency':'ความไม่สอดคล้อง',
  'inexperience':'การขาดประสบการณ์','independence':'ความเป็นอิสระ',
  'launch':'เริ่มเปิดตัว/เริ่มโครงการ','land':'ลงจอด','lend':'ให้ยืม','leave':'จากไป/ทิ้งไว้',
  'recall':'เรียกคืนสินค้า/นึกได้','retreat':'ถอย/ล่าถอย','return':'คืน/กลับ','recover':'กู้คืน',
  'streamline':'ทำกระบวนการให้คล่องตัว','stream':'ลำธาร/สตรีมข้อมูล',
  'instead':'แทนที่จะทำเช่นนั้น','regardless':'โดยไม่คำนึงถึง',
  'more':'มากกว่า','most':'มากที่สุด','less':'น้อยกว่า','least':'น้อยที่สุด',
}

const englishStop = new Set(('the a an and or of in on at to for with by from not be is are was were has have had will would can could should must this that those these it they them their its our your as than all only what who when where why how which any after before under into over but that about very our several two three will may been being'.split(' ')))
const shrink=(s:string,max=190)=>s.replace(/\s+/g,' ').trim().slice(0,max).trim()
const highlight=(s:string)=>'“'+shrink(s,120)+'”'
const wordOf=(s:string)=>s.toLowerCase().trim().replace(/[“”"'.,!?]+/g,'')
const fragment = (s:string, max=95) => highlight(shrink(s,max))
const tokens=(s:string)=>s.toLowerCase().match(/[a-z0-9]+(?:-[a-z0-9]+)?/g)?.filter(w=>w.length>2 && !englishStop.has(w))??[]
const unique=<T,>(xs:T[])=>Array.from(new Set(xs))
const itemSentence=(q:Question,p?:Passage)=>{
  if(q.part===5) return q.stem
  const mark=q.stem.match(/\[(\d+)\]/)?.[0]
  const paras=p?.body.split(/\n+/).filter(Boolean)??[]
  if(mark){
    const i=paras.findIndex(x=>x.includes(mark))
    if(i>=0) return [paras[i-1],paras[i],paras[i+1]].filter(Boolean).join(' ').slice(0,490)
  }
  return p?.body.slice(0,350)??q.stem
}
function evidenceFromPassage(q:Question,p?:Passage){
  if(q.evidence) return shrink(q.evidence,180)
  if(!p) return ''
  const correct=q.choices.find(c=>c.id===q.answer)?.text??''
  const terms=unique([...tokens(correct),...tokens(q.explanation).slice(0,9)])
  const sentences=p.body.split(/(?<=[.!?])\s+|\n+/).map(v=>v.trim()).filter(v=>v.length>=18)
  let best='',bestScore=-1
  for(const s of sentences){
    const present=new Set(tokens(s))
    const score=terms.filter(term=>present.has(term)).length
    if(score>bestScore){best=s;bestScore=score}
  }
  return bestScore>=2?shrink(best,180):''
}
function partOfSpeech(text:string):string {
  const w=wordOf(text)
  if(!w) return 'รูปคำว่าง'
  if(w.includes(' ')) return /\b(has|have|had|been|be|was|were|will|is|are)\b/.test(w)?'verb phrase (วลีแสดง tense/voice)':'phrase (วลีหลายคำ)'
  if(['is','has','does','was'].includes(w)) return 'finite verb/auxiliary (รูปเอกพจน์)'
  if(['are','have','do','were'].includes(w)) return 'finite verb/auxiliary (รูปพหูพจน์)'
  if(['be','been','being'].includes(w)) return 'รูปของ be ('+w+')'
  if(w.endsWith('ly')&&!['friendly','timely','costly','lively','early','daily','weekly','monthly'].includes(w)) return 'Adverb (กริยาวิเศษณ์)'
  if(/(tion|sion|ment|ness|ity|ance|ence|ship|ism|th|age)$/.test(w)) return 'Noun (คำนาม)'
  if(/(ous|ful|less|ive|able|ible|al|ic|ent|ant|ary|ory|able)$/.test(w)) return 'Adjective (คำคุณศัพท์)'
  if(/ing$/.test(w)) return 'V-ing (กริยารูป -ing / gerund)'
  if(/ed$/.test(w)) return 'V2/V3 หรือ Adjective (รูป -ed)'
  if(/s$/.test(w)) return 'รูปเติม -s (อาจเป็น V-s หรือ N. พหูพจน์)'
  return 'รูปคำ '+highlight(text)
}
function tenseForm(text:string):string {
  const w=wordOf(text)
  if(/^(?:has|have)\s+(?:been\s+)?\w+(?:ed|en|wn|nt|ne|ght|pt|de|t)\b/.test(w)) return 'Present Perfect (has/have + V3)'
  if(/^had\s+(?:been\s+)?\w+(?:ed|en|wn|nt|ne|ght|pt|de|t)\b/.test(w)) return 'Past Perfect (had + V3)'
  if(/^had\b/.test(w)) return 'Past Perfect (had + V3) หรือรูป had ที่ต้องตรวจ V3'
  if(/^has\b|^have\b/.test(w)) return 'Present Perfect (has/have + V3) หรือกริยาช่วยตามประธาน'
  if(/^will be \w+ing\b/.test(w)) return 'Future Continuous (will be + V-ing)'
  if(/^will\b/.test(w)) return 'Future (will + V1)'
  if(/^(?:was|were)\s+\w+ing\b/.test(w)) return 'Past Continuous (was/were + V-ing)'
  if(/^(?:is|are)\s+\w+ing\b/.test(w)) return 'Present Continuous (is/are + V-ing)'
  if(/^(?:was|were)\s+\w+(?:ed|en)\b/.test(w)) return 'Past Simple Passive (was/were + V3)'
  if(/^(?:is|are)\s+\w+(?:ed|en)\b/.test(w)) return 'Present Simple Passive (is/are + V3)'
  if(/^(?:be|been)\s+\w+(?:ed|en)\b/.test(w)) return 'Passive (be/been + V3)'
  if(/^(?:is|are|was|were|has|have|had|does|do|did|be|been|being)$/.test(w)) return partOfSpeech(w)
  if(/ing$/.test(w)) return 'V-ing (ไม่ใช่ finite verb หากไม่มี auxiliary)'
  if(/ed$/.test(w)) return 'V2/V3 (ต้องตรวจ tense และ voice)'
  if(/s$/.test(w)&&!/(ss|ous|ness)$/.test(w)) return 'Present Simple V-s หรือ noun พหูพจน์'
  return 'V1/base หรือคำรูป '+highlight(text)
}
function subjectSignal(stem:string){
  const left=stem.split('_____')[0].trim().replace(/^.+[.!?]\s+(?=[A-Z])/,'')
  const near=left.match(/\b(?:neither|either)\b.*\b(?:nor|or)\s+([^,]+)$/i)
  if(near) return 'neither/either … nor/or ต้องพิจารณาประธานใกล้กริยาที่สุด '+highlight(near[1])
  const each=left.match(/\b(?:each|every|one of|the number of|a list of|the quality of)\b[^,]*/i)
  if(each) return 'ประธานแกน '+highlight(each[0])+' ไม่ใช่คำนามที่ติดกับช่องว่างเสมอ'
  return 'ตรวจประธานแท้ก่อนช่อง '+fragment(left.slice(-95))
}
function timeSignal(stem:string) {
  const m=stem.match(/\b(?:this is the first time|it is the first time|since\b[^,.]*|by the time\b[^,.]*|before\b[^,.]*|at this time next week|every (?:week|month|quarter|year)|tomorrow|yesterday|last (?:year|week|month|night)|already|yet|currently|while\b[^,.]*)/i)
  return m?highlight(m[0]):fragment(stem.split('_____')[0].slice(-95))
}
function meaningFor(q:Question,choiceId:string,word:string){
  const exact=q.choiceTranslationsTh?.[choiceId]
  if(exact) return exact
  return specialWords[wordOf(word)]??connectors[wordOf(word)]?.[1]??''
}
function contextRole(q:Question, sentence:string):string {
  const before=sentence.split('_____')[0]??''
  const after=sentence.split('_____')[1]??''
  const rule=(q.ruleId??'').toLowerCase()
  if(/adjective-before-noun/.test(rule)) return 'Adjective หน้าคำนาม '+fragment(after.trim().split(/\s+/).slice(0,4).join(' '))
  if(/adverb|modifier/.test(rule)) return 'Adverb ขยายกริยา/คุณศัพท์รอบช่อง '+fragment(before.trim().split(/\s+/).slice(-4).join(' '))
  if(/noun-position/.test(rule)) return 'Noun เป็นประธาน กรรม หรือหัววลีนามใกล้ '+fragment(before.trim().split(/\s+/).slice(-4).join(' '))
  if(/object-complement|be-complement/.test(rule)) return 'Adjective เป็น complement บอกสภาพกรรมหรือประธาน'
  if(/gerund|after-preposition/.test(rule)) return 'V-ing หลัง preposition ในวลี '+fragment(before.trim().split(/\s+/).slice(-5).join(' '))
  if(/(?:part-of-speech|word-form)/.test(rule)||q.skills.includes('part-of-speech')){
    const correct=wordOf(q.choices.find(c=>c.id===q.answer)?.text??'')
    const kind=partOfSpeech(correct)
    return kind+' ตามโครงสร้างใกล้ช่อง '+fragment((before.split(/\s+/).slice(-4).join(' ')+' _____ '+after.split(/\s+/).slice(0,4).join(' ')),95)
  }
  return ''
}
function evidenceTh(q:Question,p?:Passage){
  const evidence=evidenceFromPassage(q,p)
  const original=q.explanationTh??q.explanation
  return [evidence?'หลักฐานในเอกสาร: '+highlight(evidence):'',
    original?'คำอธิบายประจำข้อ: '+shrink(original,245):''].filter(Boolean).join(' · ')
}
function evidenceForAlternative(choice:string,p?:Passage){
  if(!p) return ''
  const words=unique(tokens(choice))
  if(words.length<2)return ''
  const sentences=p.body.split(/(?<=[.!?])\s+|\n+/).map(x=>x.trim()).filter(x=>x.length>25)
  let best='',highest=0
  for(const line of sentences){
    const ts=new Set(tokens(line))
    const overlap=words.filter(w=>ts.has(w)).length+
      words.filter(w=>/\d/.test(w)&&ts.has(w)).length
    if(overlap>highest){highest=overlap;best=line}
  }
  return highest>=2?shrink(best,160):''
}
function questionAsksUnsupported(stem:string){
  const up=stem.toUpperCase()
  return ['EXCEPT','NOT INDICATED','NOT MENTIONED','NOT TRUE','NOT STATED','NOT CORRECT','NOT SUPPORTED','NOT ONE OF','NOT INCLUDED','NOT LISTED','NOT SHOWN','NOT PROVIDED'].some(phrase=>up.includes(phrase))
}
function explainCorrect(q:Question,text:string,sentence:string,p?:Passage){
  const w=wordOf(text),th=meaningFor(q,q.answer,text),rule=(q.ruleId??'').toLowerCase()
  const meaning=th?' ความหมาย: '+th+'.':''
  if(q.part===7) return questionAsksUnsupported(q.stem)
    ? 'เลือก '+highlight(text)+' เพราะโจทย์ให้หาตัวเลือกที่ไม่มีข้อมูลรองรับหรือขัดกับเอกสาร ไม่ใช่สิ่งที่มีหลักฐานยืนยัน. '+evidenceTh(q,p)
    : 'เลือก '+highlight(text)+' เพราะข้อมูลในเอกสารสนับสนุนคำตอบตามรูปแบบคำถาม. '+evidenceTh(q,p)
  if(q.skills.includes('sentence-placement') || (q.part===6&&text.split(/\s+/).length>=6)){
    return 'ประโยค '+highlight(text)+' ต่อเรื่องจากข้อความก่อนช่องและพาไปยังประโยคหลังช่องได้ โดยไม่เปลี่ยนตัวบุคคล ลำดับเวลา หรือสิ่งที่สรรพนามอ้างถึง. บริบท: '+fragment(sentence,190)+' · '+evidenceTh(q,p)
  }
  if(q.skills.includes('conjunction')||q.skills.includes('context')||q.skills.includes('preposition')){
    const meta=connectors[w]
    return 'ตอบ '+highlight(text)+ (meta?' = '+meta[1]+'; ใช้รูป '+meta[2]+'.':' เพราะสัมพันธ์กับความหมายของข้อความก่อน–หลังช่อง.')+
      ' ตรวจบริบท '+fragment(sentence,165)+'. '+evidenceTh(q,p)
  }
  if(q.skills.includes('verb-tense')||q.skills.includes('passive')||q.skills.includes('subject-verb')){
    return 'ตอบ '+highlight(text)+' ซึ่งเป็น '+tenseForm(text)+'. คำบอกใบ้ '+(q.skills.includes('subject-verb')?subjectSignal(sentence):timeSignal(sentence))+
      ' ต้องตรวจ tense, ประธานและผู้รับการกระทำให้ตรงกัน. '+evidenceTh(q,p)
  }
  if(q.skills.includes('part-of-speech')||/wordform/.test(rule)){
    return 'ตอบ '+highlight(text)+' เป็น '+partOfSpeech(text)+'; ช่องทำหน้าที่ '+contextRole(q,sentence)+'.'+meaning+' '+evidenceTh(q,p)
  }
  return 'ตอบ '+highlight(text)+'.'+meaning+' พิจารณาวลีรอบช่อง '+fragment(sentence,160)+' · '+evidenceTh(q,p)
}
function explainWrong(q:Question,id:string,text:string,sentence:string,p?:Passage){
  const chosen=wordOf(text)
  const right=q.choices.find(c=>c.id===q.answer)?.text??''
  const source=q.whyOthersTh?.[id]
  if(source) return source
  const en=q.whyOthers?.[id]
  const note=en?' เหตุผลเฉพาะตัวเลือกที่มีในคลังเดิม: '+shrink(en,230)+'.':''
  const meaning=meaningFor(q,id,text)
  const gloss=meaning?' ความหมาย/หน้าที่: '+meaning+'.':''
  const rule=(q.ruleId??'').toLowerCase()
  if(q.part===7){
    const isNot=questionAsksUnsupported(q.stem)
    const detail=evidenceTh(q,p)
    const match=evidenceForAlternative(text,p)
    const proof=match?' ส่วนของเอกสารที่ต้องเทียบกับตัวเลือกนี้คือ '+highlight(match)+'.':''
    const focus=/\b(?:purpose|primarily|mainly|main idea)\b/i.test(q.stem)
      ? 'คำถามถามวัตถุประสงค์หลัก ไม่ใช่รายละเอียดที่อาจปรากฏเพียงช่วงหนึ่ง.'
      : /\b(?:infer|imply|suggest|most likely)\b/i.test(q.stem)
      ? 'การอนุมานต้องมีข้อความรองรับ ไม่ใช่เลือกสิ่งที่เพียงอาจเกิดขึ้นได้.'
      : 'ให้เทียบคน การกระทำ เวลา จำนวน และเงื่อนไขที่ถามโดยตรง.'
    return isNot
      ? 'ตัวเลือก '+highlight(text)+' ไม่ใช่ข้อความผิดหรือไม่มีระบุที่โจทย์ NOT/EXCEPT ให้หา; ต้องตรวจว่าข้อความนี้มีหลักฐานรองรับอย่างไร.'+
        proof+' คำตอบที่เป็นข้อยกเว้นคือ '+highlight(right)+'. '+detail+note
      : 'ตัวเลือก '+highlight(text)+' กล่าวถึงรายละเอียดอีกทางหนึ่ง ไม่ใช่ '+highlight(right)+' ที่ตอบโจทย์ '+highlight(q.stem)+'. '+
        focus+proof+' เทียบคำอธิบายคำตอบจริง: '+detail+note
  }
  if(q.skills.includes('sentence-placement')||(q.part===6 && text.split(/\s+/).length>=6)){
    const ptext=fragment(sentence,170)
    const tokensInOption=new Set(tokens(text))
    const relevant=tokens(sentence).filter(t=>tokensInOption.has(t))
    return 'ประโยค '+highlight(text)+' ไม่เชื่อมเนื้อหาสองด้านได้เท่า '+highlight(right)+
      (relevant.length?' แม้มีคำร่วม '+relevant.slice(0,3).join(', ')+' แต่ยังต้องตรวจสรรพนาม ผู้กระทำ และลำดับเหตุการณ์.':' เพราะเปลี่ยนหัวข้อ/เหตุการณ์หรือไม่ช่วยให้ข้อความถัดไปต่อเนื่อง.')+
      ' ข้อความรอบช่อง: '+ptext+'. '+evidenceTh(q,p)+note
  }
  if(q.skills.includes('conjunction') || q.skills.includes('context') || (/connector|comparison\.pattern/.test(rule)&&connectors[chosen])){
    const chosenInfo=connectors[chosen]
    const rightInfo=connectors[wordOf(right)]
    if(chosenInfo){
      return 'ตัวเลือก '+highlight(text)+' = '+chosenInfo[1]+' ใช้โครงสร้าง '+chosenInfo[2]+
        '; ส่วนที่ประโยคนี้ต้องสื่อคือ '+(rightInfo?rightInfo[1]+' ด้วย '+rightInfo[2]:'ความสัมพันธ์ตามเฉลย ' +highlight(right))+
        '. ลองอ่านเชื่อม '+fragment(sentence,165)+'.'+gloss+note
    }
    return 'ตัวเลือก '+highlight(text)+' เปลี่ยนตรรกะของข้อความหรือใช้โครงสร้างหลังคำเชื่อมไม่ตรงกับ '+
      highlight(right)+'. บริบทที่ต้องอ่าน: '+fragment(sentence,155)+'. '+evidenceTh(q,p)+note
  }
  if(q.skills.includes('part-of-speech') || /wordform|word-form/.test(rule)){
    const wrongPos=partOfSpeech(text),rightPos=partOfSpeech(right)
    const expected=contextRole(q,sentence)
    return 'ตัวเลือก '+highlight(text)+' เป็น '+wrongPos+'; แต่หน้าที่ช่องนี้คือ '+expected+
      '. คำตอบ '+highlight(right)+' มีรูป '+rightPos+' ที่นำไปใช้ตรงตำแหน่งดังกล่าว. '+gloss+note
  }
  if(q.skills.includes('subject-verb')){
    return 'ตัวเลือก '+highlight(text)+' เป็น '+tenseForm(text)+' แต่ต้องผันให้สอดคล้องกับ '+
      subjectSignal(sentence)+'; คำตอบที่เข้ากับประธานและ tense คือ '+highlight(right)+'.'+gloss+note
  }
  if(q.skills.includes('verb-tense')||q.skills.includes('passive')||/tense|gerund|subjunctive/.test(rule)){
    let why=''
    const lower=sentence.toLowerCase()
    if(/\b(?:this is the first time|it is the first time)\b/.test(lower)){
      why='รูป It/This is the first time ใช้ Present Perfect has/have + V3 เพื่อพูดถึงประสบการณ์นับถึงปัจจุบัน; Past Perfect จะใช้กับจุดอ้างอิงที่เป็นอดีต (It was the first time).'
    } else if(/\bsince\b/.test(lower)) why='since บอกจุดเริ่มในอดีตต่อเนื่องถึงปัจจุบัน จึงควรใช้ Present Perfect ถ้าไม่มีจุดอ้างอิงอดีตอีกชั้น.'
    else if(/\bby the time\b/.test(lower)) why='By the time เชื่อมเหตุการณ์สองจุดในอดีต โดยการกระทำที่เสร็จก่อนใช้ Past Perfect เมื่อบริบทเน้นลำดับก่อนหลัง.'
    else if(/\b(?:while|when)\b/.test(lower)) why='ตรวจว่ากิจกรรมกำลังดำเนินอยู่ขณะมีเหตุการณ์อื่นเกิดขึ้นหรือเกิดก่อน เพื่อเลือกระหว่าง Continuous และ Perfect.'
    else if(/\b(?:tomorrow|next week|next month)\b/.test(lower)) why='คำบอกอนาคตต้องเลือก future form ให้เหมาะกับลักษณะเหตุการณ์ ไม่ย้อนเป็นอดีต.'
    else if(/\b(?:yesterday|last week|last year)\b/.test(lower)) why='คำบอกอดีตที่จบแล้วใช้ past form แทนรูปที่เน้นเชื่อมมาถึงปัจจุบัน.'
    else if(/\b(?:every week|every month|every year|every quarter)\b/.test(lower)) why='คำบอกความถี่สม่ำเสมอหมายถึง routine จึงต้องพิจารณา Simple Present.'
    else if(q.skills.includes('passive')) why='ผู้ถูกกระทำเป็นประธาน ต้องมี be + V3 ให้ตรงกับ modal/tense ของประโยค ไม่ใช่ใช้กริยา active แทน.'
    else if(/gerund|after-preposition/.test(rule)) why='เมื่อ to/for/after/before เป็น preposition แล้วต้องใช้ V-ing เป็นส่วนเติมเต็ม ไม่ใช่ V1 หรือ finite verb.'
    else why='ต้องเทียบเวลา ประธาน และชนิดของกริยาที่ช่องว่างทำหน้าที่กับเหตุการณ์จริงในประโยค.'
    return 'ตัวเลือก '+highlight(text)+' เป็น '+tenseForm(text)+' ต่างจาก '+highlight(right)+' ('+tenseForm(right)+'). '+
      why+' สัญญาณ: '+timeSignal(sentence)+'.'+gloss+note
  }
  if(q.skills.includes('pronoun')||q.skills.includes('relative-clause')){
    return 'ตัวเลือก '+highlight(text)+gloss+' ต้องตรวจว่าช่องนี้เป็นประธาน กรรม คำแสดงความเป็นเจ้าของ หรือ reflexive และคำนามที่ถูกอ้างถึงคืออะไร. '+
      'คำตอบ '+highlight(right)+' จึงเข้ากับโครงสร้าง '+fragment(sentence,125)+'. '+evidenceTh(q,p)+note
  }
  if(q.skills.includes('comparison')){
    return 'ตัวเลือก '+highlight(text)+gloss+' ไม่ใช่รูปที่ปิดโครงสร้างเปรียบเทียบใน '+fragment(sentence,125)+
      ' ได้ตรงกับ '+highlight(right)+'. ต้องแยก more/-er + than จาก as + Adj./Adv. + as และ superlative. '+evidenceTh(q,p)+note
  }
  if(q.skills.includes('vocabulary')||q.skills.includes('collocation')){
    return 'ตัวเลือก '+highlight(text)+gloss+' ใช้แทน '+highlight(right)+' ในวลี '+fragment(sentence,145)+
      ' ไม่ได้โดยไม่เปลี่ยนความหมายหรือคำที่ใช้คู่กัน; ให้เทียบคำนาม/กริยาข้างเคียงและความตั้งใจของข้อความ: '+
      shrink(q.explanationTh??q.explanation,185)+'.'+note
  }
  return 'ตัวเลือก '+highlight(text)+gloss+' ต้องเทียบกับ '+highlight(right)+' โดยอาศัยเนื้อหาจริง '+fragment(sentence,145)+
    ' และเหตุผลของข้อ: '+shrink(q.explanationTh??q.explanation,180)+'.'+note
}

export function completeRationales(q:Question,passages:Record<string,Passage>={}):Question {
  if(q.choices.length!==4||!q.answer||!q.choices.some(c=>c.id===q.answer)) return q
  const fullyAuthored = q.choices.every(c=>Boolean(q.coaching?.choiceReasons[c.id] || q.whyOthersTh?.[c.id]))
  if(fullyAuthored) return {...q,rationaleSource:'authored'}
  const p=q.passageId?passages[q.passageId]:undefined
  const sentence=itemSentence(q,p)
  const explanations:Record<string,string>={...q.whyOthersTh}
  for(const c of q.choices){
    if(q.coaching?.choiceReasons[c.id])continue
    if(explanations[c.id])continue
    explanations[c.id]=c.id===q.answer
      ? explainCorrect(q,c.text,sentence,p)
      : explainWrong(q,c.id,c.text,sentence,p)
  }
  return {...q,whyOthersTh:explanations,rationaleSource:'contextualized'}
}
