import { useState } from "react"
import { useApp } from "../App.jsx"
 
/* ═══════════════════════════════════════════════════
   HORMONE BALANCE QUIZ
   6 คำถาม → คะแนน → Hormone Type → แผนอาหาร 7 วัน
   
   Hormone Types:
   A = Estrogen Dominant   (คะแนน Estrogen สูง)
   B = Progesterone Low    (คะแนน Progesterone ต่ำ)
   C = Cortisol High       (ความเครียดสูง)
   D = Balanced            (สมดุล)
═══════════════════════════════════════════════════ */
 
 
/* ── Quiz Questions (EN) ── */
const QUESTIONS_EN = [
  {
    id: 1, emoji: "🩸", topic: "Cycle / PMS",
    question: "How do you feel before and during your period?",
    options: [
      { text: "Water retention, mood swings, breast tenderness",  scores: { estrogen: 3, progesterone: 0, cortisol: 1 } },
      { text: "Anxiety, insomnia, frequent headaches",            scores: { estrogen: 0, progesterone: 3, cortisol: 2 } },
      { text: "High stress, severe cramps, fatigue",              scores: { estrogen: 1, progesterone: 1, cortisol: 3 } },
      { text: "Mild symptoms, regular cycle, feel good overall",  scores: { estrogen: 0, progesterone: 0, cortisol: 0 } },
    ],
  },
  {
    id: 2, emoji: "🍽️", topic: "Eating Habits",
    question: "What do you crave most before your period?",
    options: [
      { text: "Sweets, chocolate, sugary snacks",                scores: { estrogen: 1, progesterone: 2, cortisol: 1 } },
      { text: "Salty, fried, or fast food",                      scores: { estrogen: 2, progesterone: 0, cortisol: 2 } },
      { text: "Everything — unusually hungry all the time",      scores: { estrogen: 1, progesterone: 3, cortisol: 1 } },
      { text: "No special cravings, eating normally",            scores: { estrogen: 0, progesterone: 0, cortisol: 0 } },
    ],
  },
  {
    id: 3, emoji: "💪", topic: "Energy / Exercise",
    question: "How would you describe your energy and motivation to exercise?",
    options: [
      { text: "Constantly fatigued, rarely exercise",            scores: { estrogen: 1, progesterone: 2, cortisol: 2 } },
      { text: "Energy fluctuates — up and down unpredictably",   scores: { estrogen: 2, progesterone: 1, cortisol: 2 } },
      { text: "Easily tired even after enough sleep",            scores: { estrogen: 1, progesterone: 1, cortisol: 3 } },
      { text: "Good energy, exercise regularly",                 scores: { estrogen: 0, progesterone: 0, cortisol: 0 } },
    ],
  },
  {
    id: 4, emoji: "😴", topic: "Sleep / Stress",
    question: "Do you have trouble sleeping or managing stress?",
    options: [
      { text: "Hard to fall asleep, wake up at night, overthinking", scores: { estrogen: 1, progesterone: 2, cortisol: 3 } },
      { text: "Sleep but wake up unrefreshed and tired",             scores: { estrogen: 1, progesterone: 1, cortisol: 2 } },
      { text: "High work stress, often feel burned out",             scores: { estrogen: 0, progesterone: 1, cortisol: 3 } },
      { text: "Sleep well, stress is manageable",                    scores: { estrogen: 0, progesterone: 0, cortisol: 0 } },
    ],
  },
  {
    id: 5, emoji: "⚖️", topic: "Weight / Body",
    question: "How has your weight or body shape been changing?",
    options: [
      { text: "Gaining around hips, thighs, and lower belly",    scores: { estrogen: 3, progesterone: 0, cortisol: 1 } },
      { text: "Bloating and sudden water weight gain",           scores: { estrogen: 1, progesterone: 2, cortisol: 1 } },
      { text: "Fat accumulating around the belly area",          scores: { estrogen: 1, progesterone: 1, cortisol: 3 } },
      { text: "Weight is fairly stable, no major issues",        scores: { estrogen: 0, progesterone: 0, cortisol: 0 } },
    ],
  },
  {
    id: 6, emoji: "🌿", topic: "Overall Health",
    question: "Which symptoms do you experience most often?",
    options: [
      { text: "Oily skin, hormonal acne, some hair loss",        scores: { estrogen: 3, progesterone: 1, cortisol: 1 } },
      { text: "Heart palpitations, cold hands, easily anxious",  scores: { estrogen: 0, progesterone: 2, cortisol: 3 } },
      { text: "Brain fog, poor memory, difficulty focusing",     scores: { estrogen: 2, progesterone: 2, cortisol: 2 } },
      { text: "Generally healthy, no obvious symptoms",          scores: { estrogen: 0, progesterone: 0, cortisol: 0 } },
    ],
  },
]
 
/* ── Quiz Questions ── */
const QUESTIONS = [
  {
    id: 1,
    emoji: "🩸",
    topic: "รอบเดือน / PMS",
    question: "อาการก่อนและระหว่างมีประจำเดือนเป็นอย่างไร?",
    options: [
      { text: "บวมน้ำ อารมณ์แปรปรวน เจ็บหน้าอกมาก",  scores: { estrogen: 3, progesterone: 0, cortisol: 1 } },
      { text: "วิตกกังวล นอนไม่หลับ ปวดหัวบ่อย",       scores: { estrogen: 0, progesterone: 3, cortisol: 2 } },
      { text: "เครียดมาก ปวดประจำเดือนรุนแรง อ่อนเพลีย",scores: { estrogen: 1, progesterone: 1, cortisol: 3 } },
      { text: "อาการน้อย รอบสม่ำเสมอ รู้สึกดีโดยรวม",  scores: { estrogen: 0, progesterone: 0, cortisol: 0 } },
    ],
  },
  {
    id: 2,
    emoji: "🍽️",
    topic: "พฤติกรรมการกิน",
    question: "คุณอยากกินอะไรมากที่สุดในช่วงก่อนมีประจำเดือน?",
    options: [
      { text: "ของหวาน ช็อกโกแลต ขนมหวานต่างๆ",        scores: { estrogen: 1, progesterone: 2, cortisol: 1 } },
      { text: "ของเค็ม ของทอด Fast food",               scores: { estrogen: 2, progesterone: 0, cortisol: 2 } },
      { text: "อาหารทุกอย่าง หิวง่ายมากกว่าปกติ",       scores: { estrogen: 1, progesterone: 3, cortisol: 1 } },
      { text: "ไม่ค่อยอยากกินอะไรพิเศษ ปกติดี",        scores: { estrogen: 0, progesterone: 0, cortisol: 0 } },
    ],
  },
  {
    id: 3,
    emoji: "💪",
    topic: "พลังงาน / การออกกำลังกาย",
    question: "ระดับพลังงานและกำลังใจออกกำลังกายเป็นอย่างไร?",
    options: [
      { text: "อ่อนเพลียตลอด ออกกำลังกายได้น้อย",       scores: { estrogen: 1, progesterone: 2, cortisol: 2 } },
      { text: "พลังงานขึ้นๆ ลงๆ ไม่สม่ำเสมอ",           scores: { estrogen: 2, progesterone: 1, cortisol: 2 } },
      { text: "เหนื่อยง่ายผิดปกติ แม้นอนพอ",            scores: { estrogen: 1, progesterone: 1, cortisol: 3 } },
      { text: "พลังงานดี ออกกำลังกายสม่ำเสมอ",          scores: { estrogen: 0, progesterone: 0, cortisol: 0 } },
    ],
  },
  {
    id: 4,
    emoji: "😴",
    topic: "การนอนหลับ / ความเครียด",
    question: "คุณมีปัญหาเรื่องการนอนหลับหรือความเครียดไหม?",
    options: [
      { text: "นอนหลับยาก ตื่นกลางดึก คิดมากก่อนนอน",  scores: { estrogen: 1, progesterone: 2, cortisol: 3 } },
      { text: "นอนหลับ แต่ตื่นมาไม่สดชื่น เหนื่อย",    scores: { estrogen: 1, progesterone: 1, cortisol: 2 } },
      { text: "เครียดงานมาก รู้สึก Burnout บ่อย",       scores: { estrogen: 0, progesterone: 1, cortisol: 3 } },
      { text: "นอนหลับดี ความเครียดพอจัดการได้",        scores: { estrogen: 0, progesterone: 0, cortisol: 0 } },
    ],
  },
  {
    id: 5,
    emoji: "⚖️",
    topic: "น้ำหนัก / รูปร่าง",
    question: "น้ำหนักและรูปร่างมีการเปลี่ยนแปลงอย่างไร?",
    options: [
      { text: "น้ำหนักขึ้นบริเวณสะโพก ต้นขา หน้าท้องล่าง", scores: { estrogen: 3, progesterone: 0, cortisol: 1 } },
      { text: "ท้องอืด บวมน้ำ น้ำหนักขึ้นแบบฉับพลัน",   scores: { estrogen: 1, progesterone: 2, cortisol: 1 } },
      { text: "ไขมันสะสมบริเวณท้องโดยเฉพาะ",            scores: { estrogen: 1, progesterone: 1, cortisol: 3 } },
      { text: "น้ำหนักค่อนข้างคงที่ ไม่มีปัญหาพิเศษ",   scores: { estrogen: 0, progesterone: 0, cortisol: 0 } },
    ],
  },
  {
    id: 6,
    emoji: "🌿",
    topic: "สุขภาพโดยรวม",
    question: "อาการที่รู้สึกบ่อยที่สุดในชีวิตประจำวัน?",
    options: [
      { text: "ผิวมัน สิวฮอร์โมน ผมร่วงบ้าง",          scores: { estrogen: 3, progesterone: 1, cortisol: 1 } },
      { text: "หัวใจสั่น มือเย็น วิตกกังวลง่าย",        scores: { estrogen: 0, progesterone: 2, cortisol: 3 } },
      { text: "ความจำแย่ลง หมอกในสมอง สมาธิสั้น",      scores: { estrogen: 2, progesterone: 2, cortisol: 2 } },
      { text: "สุขภาพดีโดยรวม ไม่มีอาการชัดเจน",       scores: { estrogen: 0, progesterone: 0, cortisol: 0 } },
    ],
  },
]
 
/* ── Hormone Type Results ── */
const HORMONE_TYPES = {
  estrogen_dominant: {
    type:    "Estrogen Dominant",
    emoji:   "🌸",
    color:   "#C4899A",
    colorLt: "#F5EAF0",
    textClr: "#8B4050",
    title:   "Estrogen สูงเกินสมดุล",
    desc:    "ร่างกายมี Estrogen มากเกินไปเมื่อเทียบกับ Progesterone ส่งผลให้มี PMS รุนแรง บวมน้ำ และน้ำหนักขึ้นบริเวณสะโพก",
    focus:   ["ลด Estrogen ส่วนเกิน", "เพิ่มไฟเบอร์", "ลดไขมันสัตว์"],
    avoid:   ["แอลกอฮอล์", "ถั่วเหลืองมาก", "พลาสติก BPA"],
    eat:     ["บรอกโคลี", "เมล็ดแฟลกซ์", "ผักใบเขียว", "ปลาแซลมอน", "ข้าวกล้อง"],
    phase:   "follicular",
  },
  progesterone_low: {
    type:    "Progesterone ต่ำ",
    emoji:   "🌙",
    color:   "#9EB0C4",
    colorLt: "#EAF0F5",
    textClr: "#3A5070",
    title:   "Progesterone ต่ำกว่าเกณฑ์",
    desc:    "Progesterone ต่ำทำให้นอนไม่หลับ วิตกกังวล หิวบ่อย และมีอาการ PMS รุนแรงช่วงก่อนมีประจำเดือน",
    focus:   ["เพิ่ม Progesterone", "ลดความเครียด", "เพิ่มแมกนีเซียม"],
    avoid:   ["คาเฟอีนมาก", "น้ำตาล", "แอลกอฮอล์"],
    eat:     ["มันเทศ", "กล้วย", "ถั่วดำ", "ดาร์กช็อก", "ชาคาโมมายล์"],
    phase:   "luteal",
  },
  cortisol_high: {
    type:    "Cortisol สูง",
    emoji:   "⚡",
    color:   "#C4A882",
    colorLt: "#F5EDE0",
    textClr: "#7A4A28",
    title:   "Cortisol (ฮอร์โมนเครียด) สูง",
    desc:    "ความเครียดเรื้อรังทำให้ Cortisol สูง ส่งผลกระทบต่อฮอร์โมนทุกตัว ไขมันสะสมบริเวณท้อง นอนไม่หลับ และ Burnout",
    focus:   ["ลด Cortisol", "ฟื้นฟู Adrenal", "จัดการความเครียด"],
    avoid:   ["คาเฟอีน", "น้ำตาล", "ออกกำลังกายหนักเกินไป"],
    eat:     ["ชาขมิ้น", "อะโวคาโด", "วอลนัท", "ผักโขม", "ชา Ashwagandha"],
    phase:   "menstrual",
  },
  balanced: {
    type:    "Balanced",
    emoji:   "✨",
    color:   "#A8C4A0",
    colorLt: "#EEF5EC",
    textClr: "#4A6454",
    title:   "ฮอร์โมนสมดุลดี",
    desc:    "ยอดเยี่ยม! ฮอร์โมนของคุณอยู่ในระดับที่ดี รักษาความสมดุลนี้ไว้ด้วยการกินอาหารหลากหลายและดูแลตัวเองสม่ำเสมอ",
    focus:   ["รักษาความสมดุล", "กินหลากหลาย", "ดูแลสุขภาพลำไส้"],
    avoid:   ["อาหารแปรรูป", "น้ำตาลสูง", "ความเครียดสะสม"],
    eat:     ["ผักหลากสี", "โปรตีนคุณภาพ", "ไขมันดี", "ธัญพืช", "โปรไบโอติก"],
    phase:   "ovulation",
  },
}
 
/* ── 7-day meal plan per type ── */
const MEAL_PLANS = {
  estrogen_dominant: [
    { day:"จันทร์",  breakfast:"โอ๊ตมีล + เมล็ดแฟลกซ์ + เบอรี่",      lunch:"ปลาแซลมอนอบ + ข้าวกล้อง + บรอกโคลี",   dinner:"ต้มยำเต้าหู้ + ผักโขมผัด" },
    { day:"อังคาร",  breakfast:"ไข่ต้ม 2 ฟอง + ขนมปังไรย์",            lunch:"สลัดผักโขม + วอลนัท + น้ำสลัดมะนาว",    dinner:"ไก่อบสมุนไพร + มันเทศ" },
    { day:"พุธ",     breakfast:"สมูทตี้ผักโขม + กล้วย + นมอัลมอนด์",    lunch:"ควินัวโบล์ + ผักรวม + เต้าหู้",          dinner:"แกงส้มผักรวม + ข้าวกล้อง" },
    { day:"พฤหัส",  breakfast:"กรีกโยเกิร์ต + เมล็ดแฟลกซ์ + สตรอว์เบอรี่",lunch:"ปลาทูน่า + สลัดผัก + ขนมปังโฮลวีท",   dinner:"ผัดผักคะน้า + เนื้อแดงไม่ติดมัน" },
    { day:"ศุกร์",   breakfast:"ข้าวโอ๊ต + บลูเบอรี่ + อัลมอนด์",       lunch:"ซุปผักรวม + ข้าวกล้อง",                 dinner:"ปลาแซลมอนย่าง + บรอกโคลีนึ่ง" },
    { day:"เสาร์",  breakfast:"แพนเค้กกล้วยไข่ + เบอรี่รวม",            lunch:"บิบิมบับ (ข้าว + ผักหลายชนิด)",         dinner:"ต้มข่าไก่ + ข้าวกล้อง" },
    { day:"อาทิตย์",breakfast:"อะโวคาโดโทสต์ + ไข่ลวก",                lunch:"ส้มตำ + ไก่ย่าง",                       dinner:"มิโซะซุป + ปลาแซลมอน + เอดามาเมะ" },
  ],
  progesterone_low: [
    { day:"จันทร์",  breakfast:"กล้วยหอม + เนยอัลมอนด์ + ชาคาโมมายล์",  lunch:"ไก่อบ + มันเทศ + ผักโขม",              dinner:"ต้มยำกุ้ง + ข้าวกล้อง" },
    { day:"อังคาร",  breakfast:"โอ๊ตมีล + กล้วย + ดาร์กช็อก",            lunch:"ถั่วดำ + ข้าวกล้อง + ผักสด",            dinner:"แกงเขียวหวาน (เบา) + ข้าวกล้อง" },
    { day:"พุธ",     breakfast:"ไข่ต้ม + ขนมปังโฮลวีท + ชาขิง",          lunch:"ปลาทอด + ผัดผักรวม",                   dinner:"ซุนดูบูจิเก + ข้าว" },
    { day:"พฤหัส",  breakfast:"กรีกโยเกิร์ต + กล้วย + วอลนัท",           lunch:"สลัดอะโวคาโด + ปลาทูน่า",              dinner:"ผัดกะเพราไก่ (เบา) + ข้าวกล้อง" },
    { day:"ศุกร์",   breakfast:"สมูทตี้กล้วย + นมโอ๊ต + อัลมอนด์",       lunch:"ข้าวหน้าปลาแซลมอน + สลัด",             dinner:"ต้มข่าไก่ + ข้าวกล้อง" },
    { day:"เสาร์",  breakfast:"ข้าวโอ๊ต + เมล็ดแฟลกซ์ + สตรอว์เบอรี่",   lunch:"ซัมเกทัง (ไก่ตุ๋นโสม)",               dinner:"ผักโขมผัดกระเทียม + ไข่ดาว" },
    { day:"อาทิตย์",breakfast:"แพนเค้กกล้วยไข่ + ดาร์กช็อก",             lunch:"ก๋วยเตี๋ยวน้ำใส + ผักโขม",             dinner:"ปลาแซลมอนย่าง + มันเทศ" },
  ],
  cortisol_high: [
    { day:"จันทร์",  breakfast:"ชาขมิ้น + โอ๊ตมีล + วอลนัท",             lunch:"สลัดผักโขม + อะโวคาโด + แซลมอน",       dinner:"ซุปผักรวม + ข้าวกล้อง" },
    { day:"อังคาร",  breakfast:"สมูทตี้อะโวคาโด + ชา Ashwagandha",        lunch:"ไก่อบสมุนไพร + บรอกโคลีนึ่ง",         dinner:"มิโซะซุป + เต้าหู้เย็น" },
    { day:"พุธ",     breakfast:"ไข่ต้ม + ขนมปังไรย์ + ชา Chamomile",      lunch:"ควินัวโบล์ + ถั่วดำ + ผักรวม",          dinner:"ต้มยำเต้าหู้ (เบา)" },
    { day:"พฤหัส",  breakfast:"กรีกโยเกิร์ต + บลูเบอรี่ + วอลนัท",       lunch:"ปลาแซลมอนอบ + มันเทศ",                dinner:"ผัดผักคะน้า + ไก่" },
    { day:"ศุกร์",   breakfast:"โอ๊ตมีล + กล้วย + ชาขิง",                 lunch:"ส้มตำ (ไม่เผ็ดมาก) + ข้าวกล้อง",       dinner:"แกงจืดเต้าหู้ + ข้าวกล้อง" },
    { day:"เสาร์",  breakfast:"อะโวคาโดโทสต์ + ชา Ashwagandha",          lunch:"ชาบู-ชาบู ผักเยอะ",                   dinner:"ต้มข่าไก่ (เบา)" },
    { day:"อาทิตย์",breakfast:"สมูทตี้มะม่วง + ขมิ้น + นมอัลมอนด์",      lunch:"ข้าวกล้อง + ไก่ย่าง + ผักโขม",        dinner:"ซุปผักรวม + ขนมปังโฮลวีท" },
  ],
  balanced: [
    { day:"จันทร์",  breakfast:"โอ๊ตมีล + เบอรี่ + เมล็ดแฟลกซ์",         lunch:"ปลาแซลมอน + ข้าวกล้อง + ผัก",         dinner:"ต้มยำกุ้ง + ข้าวกล้อง" },
    { day:"อังคาร",  breakfast:"ไข่ต้ม + ขนมปังโฮลวีท + อะโวคาโด",       lunch:"บิบิมบับ + เต้าหู้",                   dinner:"ไก่อบสมุนไพร + มันเทศ" },
    { day:"พุธ",     breakfast:"กรีกโยเกิร์ต + กล้วย + วอลนัท",           lunch:"สลัดผักโขม + ปลาทูน่า",               dinner:"แกงเขียวหวาน (เบา) + ข้าวกล้อง" },
    { day:"พฤหัส",  breakfast:"สมูทตี้เบอรี่ + นมอัลมอนด์",               lunch:"ซูชิ (8 ชิ้น) + มิโซะซุป",             dinner:"ผัดผักรวม + ไก่" },
    { day:"ศุกร์",   breakfast:"ข้าวโอ๊ต + บลูเบอรี่ + อัลมอนด์",         lunch:"ก๋วยเตี๋ยวน้ำใส + ผักโขม",            dinner:"ปลาแซลมอนย่าง + บรอกโคลี" },
    { day:"เสาร์",  breakfast:"แพนเค้กกล้วยไข่ + สตรอว์เบอรี่",           lunch:"ส้มตำ + ไก่ย่าง + ข้าวกล้อง",         dinner:"ชาบู-ชาบู ผักเยอะ" },
    { day:"อาทิตย์",breakfast:"อะโวคาโดโทสต์ + ไข่ลวก",                  lunch:"ควินัวโบล์ + ถั่วดำ",                  dinner:"ต้มข่าไก่ + ข้าวกล้อง" },
  ],
}
 
/* ═══════════════════════════════════════════════════
   SCORE → HORMONE TYPE
═══════════════════════════════════════════════════ */
function calcHormoneType(scores) {
  const total = scores.estrogen + scores.progesterone + scores.cortisol
  if (total <= 3) return "balanced"
  if (scores.estrogen >= scores.progesterone && scores.estrogen >= scores.cortisol) return "estrogen_dominant"
  if (scores.progesterone >= scores.estrogen && scores.progesterone >= scores.cortisol) return "progesterone_low"
  return "cortisol_high"
}
 
/* ═══════════════════════════════════════════════════
   PROGRESS BAR
═══════════════════════════════════════════════════ */
function ProgressBar({ current, total, color }) {
  return (
    <div style={{ height:3, background:"rgba(255,255,255,.3)", borderRadius:2, overflow:"hidden" }}>
      <div style={{
        height:"100%",
        width:`${(current/total)*100}%`,
        background:"white",
        borderRadius:2,
        transition:"width .4s ease",
      }}/>
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   QUESTION CARD
═══════════════════════════════════════════════════ */
function QuestionCard({ q, qIndex, total, selected, onSelect, tokens }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
      {/* Q counter */}
      <div style={{ fontSize:11, color:tokens.stone, marginBottom:4, letterSpacing:".06em" }}>
        คำถาม {qIndex + 1} / {total}
      </div>
 
      {/* Topic badge */}
      <div style={{
        display:"inline-flex", alignItems:"center", gap:6,
        background:tokens.lavenderLt, borderRadius:999,
        padding:"4px 10px", marginBottom:8, alignSelf:"flex-start",
        fontSize:11, fontWeight:500, color:tokens.lavenderDk,
      }}>
        {q.emoji} {q.topic}
      </div>
 
      {/* Question */}
      <div style={{
        fontFamily:"'Playfair Display',serif",
        fontSize:16, color:tokens.cocoa, lineHeight:1.4, marginBottom:12,
      }}>
        {q.question}
      </div>
 
      {/* Options */}
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {q.options.map((opt, i) => {
          const isSelected = selected === i
          return (
            <div
              key={i}
              onClick={() => onSelect(i)}
              style={{
                padding:"10px 14px",
                border:`2px solid ${isSelected ? tokens.lavender : tokens.border}`,
                borderRadius:14,
                background: isSelected ? tokens.lavenderLt : tokens.creamSoft,
                cursor:"pointer",
                display:"flex", alignItems:"center", gap:12,
                transition:"all .18s",
              }}
              onMouseDown={e=>e.currentTarget.style.transform="scale(.99)"}
              onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
            >
              <div style={{
                width:22, height:22, borderRadius:"50%",
                border:`2px solid ${isSelected ? tokens.lavenderDk : tokens.stoneLt}`,
                background: isSelected ? tokens.lavenderDk : "transparent",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0, transition:"all .18s",
              }}>
                {isSelected && <span style={{ color:"white", fontSize:11, fontWeight:700 }}>✓</span>}
              </div>
              <span style={{
                fontSize:13, lineHeight:1.5,
                color: isSelected ? tokens.lavenderDk : tokens.cocoaMid,
                fontWeight: isSelected ? 500 : 400,
              }}>
                {opt.text}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   RESULT SCREEN
═══════════════════════════════════════════════════ */
function ResultScreen({ hormoneType, scores, onFinish, tokens, lang }) {
  const [showPlan, setShowPlan] = useState(false)
  const result   = HORMONE_TYPES[hormoneType]
  const plan     = MEAL_PLANS[hormoneType]
  const total    = scores.estrogen + scores.progesterone + scores.cortisol
  const maxScore = QUESTIONS.length * 3
 
  const bars = [
    { label:"Estrogen",     val:scores.estrogen,     max:maxScore/2, color:"#C4899A" },
    { label:"Progesterone", val:scores.progesterone, max:maxScore/2, color:"#9EB0C4" },
    { label:"Cortisol",     val:scores.cortisol,     max:maxScore/2, color:"#C4A882" },
  ]
 
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div className="scroll-body" style={{ flex:1, padding:"20px 20px 100px" }}>
 
        {/* Result hero */}
        <div style={{
          background: result.color,
          borderRadius:24, padding:"24px 20px 20px",
          color:"white", textAlign:"center", marginBottom:16,
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:140, height:140,
            borderRadius:"50%", background:"rgba(255,255,255,.1)", pointerEvents:"none" }}/>
          <div style={{ fontSize:52, marginBottom:10 }}>{result.emoji}</div>
          <div style={{ fontSize:12, opacity:.8, letterSpacing:".1em",
            textTransform:"uppercase", marginBottom:6 }}>ประเภทฮอร์โมนของคุณ</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, marginBottom:8 }}>
            {result.title}
          </div>
          <div style={{ fontSize:13, opacity:.85, lineHeight:1.65 }}>
            {result.desc}
          </div>
        </div>
 
        {/* Hormone bars */}
        <div style={{
          background:tokens.creamSoft, border:`1px solid ${tokens.borderLt}`,
          borderRadius:20, padding:"14px 16px", marginBottom:12,
        }}>
          <div style={{ fontSize:12, fontWeight:500, color:tokens.cocoa, marginBottom:12 }}>
            ระดับฮอร์โมนของคุณ
          </div>
          {bars.map(b => (
            <div key={b.label} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                fontSize:11, marginBottom:5 }}>
                <span style={{ color:tokens.cocoaMid }}>{b.label}</span>
                <span style={{ fontWeight:500, color:b.color }}>
                  {b.val === 0 ? "สมดุล" : b.val <= 4 ? "ปานกลาง" : "สูง"}
                </span>
              </div>
              <div style={{ height:6, background:tokens.border, borderRadius:3, overflow:"hidden" }}>
                <div style={{
                  height:"100%",
                  width:`${Math.min(100, (b.val/b.max)*100)}%`,
                  background:b.color, borderRadius:3, transition:"width .6s ease",
                }}/>
              </div>
            </div>
          ))}
        </div>
 
        {/* Focus + Avoid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
          <div style={{ background:tokens.sageLt, border:`1px solid rgba(126,148,132,.3)`,
            borderRadius:16, padding:"12px" }}>
            <div style={{ fontSize:11, fontWeight:500, color:tokens.sageDk,
              marginBottom:8, letterSpacing:".04em" }}>✓ โฟกัส</div>
            {result.focus.map(f => (
              <div key={f} style={{ fontSize:11, color:tokens.sageDk,
                marginBottom:4, lineHeight:1.4 }}>· {f}</div>
            ))}
          </div>
          <div style={{ background:tokens.roseLt, border:`1px solid rgba(212,184,192,.3)`,
            borderRadius:16, padding:"12px" }}>
            <div style={{ fontSize:11, fontWeight:500, color:"#8B4050",
              marginBottom:8, letterSpacing:".04em" }}>✕ เลี่ยง</div>
            {result.avoid.map(f => (
              <div key={f} style={{ fontSize:11, color:"#8B4050",
                marginBottom:4, lineHeight:1.4 }}>· {f}</div>
            ))}
          </div>
        </div>
 
        {/* Top foods */}
        <div style={{ background:tokens.creamSoft, border:`1px solid ${tokens.borderLt}`,
          borderRadius:20, padding:"14px 16px", marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:500, color:tokens.cocoa, marginBottom:10 }}>
            อาหารแนะนำสำหรับคุณ
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {result.eat.map(f => (
              <span key={f} style={{ fontSize:12, padding:"5px 12px",
                borderRadius:999, background:result.colorLt, color:result.textClr,
                fontWeight:500 }}>{f}</span>
            ))}
          </div>
        </div>
 
        {/* 7-day plan toggle */}
        <div style={{ background:tokens.lavenderLt, border:`1px solid rgba(187,168,196,.3)`,
          borderRadius:20, overflow:"hidden", marginBottom:16 }}>
          <div
            onClick={() => setShowPlan(v=>!v)}
            style={{ padding:"14px 16px", display:"flex", justifyContent:"space-between",
              alignItems:"center", cursor:"pointer" }}>
            <span style={{ fontSize:13, fontWeight:500, color:tokens.lavenderDk }}>
              📅 แผนอาหาร 7 วัน
            </span>
            <span style={{ fontSize:13, color:tokens.lavenderDk,
              transform:showPlan?"rotate(180deg)":"rotate(0deg)",
              transition:"transform .25s" }}>▾</span>
          </div>
          {showPlan && (
            <div style={{ borderTop:`1px solid rgba(187,168,196,.3)` }}>
              {plan.map((p, i) => (
                <div key={p.day} style={{
                  padding:"12px 16px",
                  borderBottom: i < plan.length-1 ? `1px solid rgba(187,168,196,.2)` : "none",
                }}>
                  <div style={{ fontSize:11, fontWeight:600, color:tokens.lavenderDk,
                    marginBottom:6 }}>{p.day}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                    {[
                      { label:"🌅 เช้า",  val:p.breakfast },
                      { label:"☀️ กลางวัน", val:p.lunch    },
                      { label:"🌙 เย็น",  val:p.dinner    },
                    ].map(m => (
                      <div key={m.label} style={{ fontSize:11, color:tokens.cocoaMid }}>
                        <span style={{ fontWeight:500, color:tokens.stone }}>{m.label}: </span>
                        {m.val}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
 
      </div>
 
      {/* CTA */}
      <div style={{ padding:"12px 20px 20px", background:tokens.creamSoft,
        borderTop:`1px solid ${tokens.borderLt}`, flexShrink:0 }}>
        <button onClick={() => onFinish(result.phase)} style={{
          width:"100%", padding:"15px",
          background:tokens.cocoa, color:tokens.cream,
          border:"none", borderRadius:16,
          fontSize:15, fontWeight:600,
          fontFamily:"'DM Sans',sans-serif",
          cursor:"pointer",
        }}
          onMouseDown={e=>e.currentTarget.style.opacity=".8"}
          onMouseUp={e=>e.currentTarget.style.opacity="1"}
        >
          {lang==="en" ? "Start HormoneEats →" : "เริ่มใช้ HormoneEats →"}
        </button>
        <div style={{ textAlign:"center", fontSize:11, color:tokens.stone, marginTop:8 }}>
          {lang==="en" ? "Results saved to your profile" : "ผลจะถูกบันทึกไว้ในโปรไฟล์ของคุณ"}
        </div>
      </div>
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   HORMONE QUIZ — main export
═══════════════════════════════════════════════════ */
export default function HormoneQuiz({ onComplete }) {
  const { tokens } = useApp()
  const [lang, setLang] = useState("th")
 
  const [step,     setStep    ] = useState("intro") // intro | quiz | result
  const [qIndex,   setQIndex  ] = useState(0)
  const [answers,  setAnswers ] = useState({})       // { qId: optionIndex }
  const [scores,   setScores  ] = useState({ estrogen:0, progesterone:0, cortisol:0 })
  const [hormoneType, setHormoneType] = useState(null)
 
  const activeQs = lang==="en" ? QUESTIONS_EN : QUESTIONS
  const currentQ = activeQs[qIndex]
  const selected = answers[currentQ?.id]
 
  function handleSelect(optionIndex) {
    setAnswers(a => ({ ...a, [currentQ.id]: optionIndex }))
  }
 
  function handleNext() {
    /* save scores */
    const opt = currentQ.options[selected]
    const newScores = {
      estrogen:     scores.estrogen     + (opt.scores.estrogen     ?? 0),
      progesterone: scores.progesterone + (opt.scores.progesterone ?? 0),
      cortisol:     scores.cortisol     + (opt.scores.cortisol     ?? 0),
    }
    setScores(newScores)
 
    if (qIndex < activeQs.length - 1) {
      setQIndex(i => i + 1)
    } else {
      /* calculate result */
      const type = calcHormoneType(newScores)
      setHormoneType(type)
      setStep("result")
    }
  }
 
  function handleFinish(phase) {
    onComplete({ hormoneType, scores, recommendedPhase: phase })
  }
 
  /* ── BG color per step ── */
  const bgColor = step === "intro" ? tokens.lavenderLt
    : step === "quiz" ? tokens.creamSoft
    : tokens.cream
 
  return (
    <div style={{
      position:"absolute", inset:0,
      background: bgColor,
      display:"flex", flexDirection:"column",
      transition:"background .4s",
    }}>
 
      {/* ── INTRO ── */}
      {step === "intro" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          padding:"40px 28px", textAlign:"center" }}>
          {/* Lang toggle */}
          <div style={{ display:"flex", gap:0, background:tokens.cream, border:`1px solid ${tokens.border}`, borderRadius:999, overflow:"hidden", marginBottom:20 }}>
            {["th","en"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding:"6px 16px",
                background: lang===l ? tokens.cocoa : "transparent",
                color:      lang===l ? tokens.cream  : tokens.stone,
                border:"none", cursor:"pointer",
                fontSize:12, fontWeight:500,
                fontFamily:"'DM Sans',sans-serif",
                transition:"all .2s",
              }}>
                {l==="th" ? "🇹🇭 TH" : "🇬🇧 EN"}
              </button>
            ))}
          </div>
          <div style={{ fontSize:64, marginBottom:20 }}>🌿</div>
          <div style={{ fontFamily:"'Playfair Display',serif",
            fontSize:28, color:tokens.cocoa, marginBottom:12, lineHeight:1.3 }}>
            Hormone Balance Quiz
          </div>
          <div style={{ fontSize:14, color:tokens.stone, lineHeight:1.75,
            marginBottom:32, maxWidth:280 }}>
            {lang==="en"
              ? `Answer ${QUESTIONS_EN.length} questions to discover your hormone type and get a personalized 7-day meal plan.`
              : `ตอบ ${QUESTIONS.length} คำถาม เพื่อค้นหาประเภทฮอร์โมนของคุณ และรับแผนอาหาร 7 วันที่เหมาะกับร่างกาย`
            }
          </div>
 
          {/* Principles preview */}
          <div style={{ width:"100%", background:tokens.creamSoft,
            border:`1px solid ${tokens.borderLt}`, borderRadius:20,
            padding:"14px 16px", marginBottom:28, textAlign:"left" }}>
            <div style={{ fontSize:11, fontWeight:500, color:tokens.stone,
              letterSpacing:".06em", marginBottom:10 }}>
              {lang==="en" ? "Hormone Balance Diet Principles" : "หลักการ Hormone Balance Diet"}
            </div>
            {(lang==="en" ? [
              { icon:"🥩", text:"Adequate protein → builds hormones, stabilizes blood sugar" },
              { icon:"🥦", text:"High fiber → supports gut health, flushes excess hormones" },
              { icon:"🥑", text:"Healthy fats → support sex hormone production" },
              { icon:"🚫", text:"Avoid sugar → reduces insulin resistance" },
              { icon:"🌱", text:"Gut health → balanced gut = balanced hormones" },
            ] : [
              { icon:"🥩", text:"โปรตีนเพียงพอ → สร้างฮอร์โมน, รักษาน้ำตาลในเลือด" },
              { icon:"🥦", text:"ไฟเบอร์สูง → ช่วยลำไส้, ลดฮอร์โมนส่วนเกิน" },
              { icon:"🥑", text:"ไขมันดี → สนับสนุนการผลิตฮอร์โมนเพศ" },
              { icon:"🚫", text:"หลีกเลี่ยงน้ำตาล → ลดดื้อ Insulin" },
              { icon:"🌱", text:"ดูแลลำไส้ → ลำไส้ดี = ฮอร์โมนสมดุล" },
            ]).map(p => (
              <div key={p.text} style={{ display:"flex", gap:8, marginBottom:6,
                alignItems:"flex-start" }}>
                <span style={{ fontSize:14, flexShrink:0 }}>{p.icon}</span>
                <span style={{ fontSize:11, color:tokens.cocoaMid, lineHeight:1.5 }}>{p.text}</span>
              </div>
            ))}
          </div>
 
          <button onClick={() => setStep("quiz")} style={{
            width:"100%", padding:"15px",
            background:tokens.cocoa, color:tokens.cream,
            border:"none", borderRadius:16,
            fontSize:15, fontWeight:600,
            fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
          }}
            onMouseDown={e=>e.currentTarget.style.opacity=".8"}
            onMouseUp={e=>e.currentTarget.style.opacity="1"}
          >
            {lang==="en" ? "Start Quiz →" : "เริ่มทำ Quiz →"}
          </button>
        </div>
      )}
 
      {/* ── QUIZ ── */}
      {step === "quiz" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Header */}
          <div style={{
            background: tokens.lavenderDk,
            padding:"16px 20px 14px", flexShrink:0,
          }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:12, color:"rgba(255,255,255,.8)" }}>
                {qIndex + 1} / {QUESTIONS.length}
              </span>
              <span style={{ fontSize:11, color:"rgba(255,255,255,.7)",
                letterSpacing:".06em" }}>
                HORMONE QUIZ
              </span>
            </div>
            <ProgressBar current={qIndex+1} total={QUESTIONS.length} />
          </div>
 
          {/* Question */}
          <div className="scroll-body" style={{ flex:1, padding:"16px" }}>
            <QuestionCard
              q={currentQ}
              qIndex={qIndex}
              total={QUESTIONS.length}
              selected={selected}
              onSelect={handleSelect}
              tokens={tokens}
            />
          </div>
 
          {/* Next button */}
          <div style={{ padding:"10px 16px 16px",
            background:tokens.creamSoft,
            borderTop:`1px solid ${tokens.borderLt}`, flexShrink:0 }}>
            <button
              onClick={handleNext}
              disabled={selected === undefined}
              style={{
                width:"100%", padding:"14px",
                background: selected !== undefined ? tokens.cocoa : tokens.border,
                color: selected !== undefined ? tokens.cream : tokens.stone,
                border:"none", borderRadius:16,
                fontSize:15, fontWeight:600,
                fontFamily:"'DM Sans',sans-serif",
                cursor: selected !== undefined ? "pointer" : "default",
                transition:"all .2s",
              }}
              onMouseDown={e=>selected!==undefined&&(e.currentTarget.style.opacity=".8")}
              onMouseUp={e=>e.currentTarget.style.opacity="1"}
            >
              {lang==="en" ? (qIndex < activeQs.length-1 ? "Next →" : "See Results →") : (qIndex < activeQs.length-1 ? "ถัดไป →" : "ดูผลลัพธ์ →")}
            </button>
          </div>
        </div>
      )}
 
      {/* ── RESULT ── */}
      {step === "result" && hormoneType && (
        <ResultScreen
          hormoneType={hormoneType}
          scores={scores}
          onFinish={handleFinish}
          tokens={tokens}
          lang={lang}
        />
      )}
 
    </div>
  )
}