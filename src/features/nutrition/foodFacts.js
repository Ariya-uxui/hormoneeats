/* ═══════════════════════════════════════════════════
   foodFacts.js
   ป้ายกำกับอาหารแบบ "ข้อเท็จจริงทางโภชนาการ" แทน hormoneTag เดิม
   หลักการ:
   - ป้ายต้องคำนวณได้จากตัวเลขในข้อมูล ไม่ใช่ข้อความโฆษณา
   - ป้ายใช้เกณฑ์เดียวกับการกล่าวอ้างบนฉลากอาหารไทย
       "สูง"  = อย่างน้อย 20% ของ Thai RDI ต่อ 1 หน่วยบริโภค
       "มี"   = อย่างน้อย 10% ของ Thai RDI ต่อ 1 หน่วยบริโภค
   - ไม่มีป้ายเตือนสีแดงสำหรับขนม — แสดงขนาดพอดีแทน

   ⚠ ค่า Thai RDI ด้านล่างอ้างอิงประกาศกระทรวงสาธารณสุข (ฉบับที่ 182) พ.ศ. 2541
     เรื่อง ฉลากโภชนาการ — ให้ตรวจทานกับฉบับที่ 445 (พ.ศ. 2566) ก่อนใช้จริง
═══════════════════════════════════════════════════ */

export const THAI_RDI = {
  protein: 50,   // g
  fiber:   25,   // g
  iron:    15,   // mg
}

export const CLAIM_THRESHOLD = { high: 0.20, source: 0.10 }

/* ═══════════════════════════════════════════════════
   SCHEMA — field ใหม่ที่จะเพิ่มใน FOOD_DB (ไม่บังคับ ใส่ทีละรายการได้)

   effort:  "ready" | "quick" | "cook"
   diet:    { vegetarian?: boolean, noPork?: boolean, dairyFree?: boolean }
            ไม่ใส่ halal เพราะต้องยืนยันจากใบรับรองร้าน ไม่ใช่จากสูตรอาหาร
   iron:    number (mg ต่อ 1 หน่วยบริโภค) — ใส่เฉพาะเมื่อมีแหล่งอ้างอิง
   source:  { ref: SOURCE_ID, note?: string }
            ข้อมูลที่ยังไม่ได้ตรวจ ให้ใช้ ref: "estimate"
═══════════════════════════════════════════════════ */

export const EFFORT = {
  ready: { label:"ซื้อได้เลย", labelEn:"Ready to buy",   emoji:"🛒" },
  quick: { label:"ทำ ≤10 นาที", labelEn:"≤10 min",        emoji:"⏱️" },
  cook:  { label:"ต้องทำอาหาร", labelEn:"Needs cooking", emoji:"🍳" },
}

export const DIET_FLAGS = {
  vegetarian: { label:"มังสวิรัติ", labelEn:"Vegetarian" },
  noPork:     { label:"ไม่มีหมู",   labelEn:"No pork"    },
  dairyFree:  { label:"ไม่มีนม",    labelEn:"Dairy-free" },
}

export const SOURCES = {
  "thai-fct": {
    label: "ตารางแสดงคุณค่าทางโภชนาการของอาหารไทย (กรมอนามัย)",
    labelEn: "Thai Food Composition Table, Department of Health",
  },
  "inmu": {
    label: "ฐานข้อมูลสถาบันโภชนาการ มหาวิทยาลัยมหิดล (INMUCAL)",
    labelEn: "INMUCAL, Institute of Nutrition, Mahidol University",
  },
  "usda": {
    label: "USDA FoodData Central",
    labelEn: "USDA FoodData Central",
  },
  "label": {
    label: "ฉลากโภชนาการบนบรรจุภัณฑ์",
    labelEn: "Product nutrition label",
  },
  "estimate": {
    label: "ค่าประมาณ ยังไม่ได้ตรวจกับแหล่งอ้างอิง",
    labelEn: "Estimate, not yet verified",
  },
}

/* หมวดที่ถือเป็นของหวาน/ของว่างหวาน — ใช้แสดงขนาดพอดีแทนป้ายเตือน */
export const SWEET_CATEGORIES = new Set(["thaibake", "bakery", "keto", "smoothie", "milk", "drink", "coffee", "tea"])

/* ═══════════════════════════════════════════════════
   NUTRIENT FACTS
═══════════════════════════════════════════════════ */

const NUTRIENT_LABELS = {
  protein: { unit:"g",  high:["โปรตีนสูง","High protein"],     source:["มีโปรตีน","Source of protein"] },
  fiber:   { unit:"g",  high:["ใยอาหารสูง","High fiber"],      source:["มีใยอาหาร","Source of fiber"] },
  iron:    { unit:"mg", high:["ธาตุเหล็กสูง","High iron"],    source:["มีธาตุเหล็ก","Source of iron"] },
}

/**
 * ป้ายข้อเท็จจริงของอาหาร 1 รายการ เรียงจาก % Thai RDI มาก → น้อย
 * คืน [] ถ้าไม่ถึงเกณฑ์ใดเลย (อาหารส่วนใหญ่จะไม่มีป้าย และนั่นเป็นเรื่องปกติ)
 */
export function getNutrientFacts(food) {
  const facts = []
  for (const [key, meta] of Object.entries(NUTRIENT_LABELS)) {
    const amount = food?.[key]
    if (typeof amount !== "number" || amount <= 0) continue
    const pct = amount / THAI_RDI[key]
    const level =
      pct >= CLAIM_THRESHOLD.high   ? "high" :
      pct >= CLAIM_THRESHOLD.source ? "source" : null
    if (!level) continue
    const [label, labelEn] = meta[level]
    facts.push({
      key, level, label, labelEn,
      amount, unit: meta.unit,
      pctRdi: Math.round(pct * 100),
    })
  }
  return facts.sort((a, b) => b.pctRdi - a.pctRdi)
}

/** ป้ายหลัก 1 อัน สำหรับการ์ดที่มีพื้นที่น้อย — เลือกระดับ "สูง" ก่อน */
export function getPrimaryFact(food) {
  const facts = getNutrientFacts(food)
  return facts.find(f => f.level === "high") ?? facts[0] ?? null
}

/** ข้อความสั้นสำหรับขนม เช่น "ของหวาน · 180 kcal ต่อชิ้น" ไม่ตัดสินว่าดีหรือไม่ดี */
export function getTreatNote(food) {
  if (!SWEET_CATEGORIES.has(food?.cat)) return null
  return {
    label:   `ของว่าง · ${food.cal} kcal ต่อหน่วย`,
    labelEn: `Treat · ${food.cal} kcal per serving`,
  }
}

/* ═══════════════════════════════════════════════════
   DATA COVERAGE — ใช้ตอนพัฒนา ดูว่าข้อมูลส่วนไหนยังขาด
═══════════════════════════════════════════════════ */

export function getCoverage(foods) {
  const total = foods.length
  const count = pred => foods.filter(pred).length
  return {
    total,
    withEffort:   count(f => f.effort in EFFORT),
    withDiet:     count(f => f.diet && typeof f.diet === "object"),
    withIron:     count(f => typeof f.iron === "number"),
    verified:     count(f => f.source?.ref && f.source.ref !== "estimate"),
    highProtein:  count(f => getNutrientFacts(f).some(x => x.key === "protein" && x.level === "high")),
    highFiber:    count(f => getNutrientFacts(f).some(x => x.key === "fiber" && x.level === "high")),
    highIron:     count(f => getNutrientFacts(f).some(x => x.key === "iron" && x.level === "high")),
    vegetarian:   count(f => f.diet?.vegetarian === true),
    ready:        count(f => f.effort === "ready"),
  }
}