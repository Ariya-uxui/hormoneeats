// รัน: node --test src/features/nutrition/foodFacts.test.js
import { test } from "node:test"
import assert from "node:assert/strict"
import { getNutrientFacts, getPrimaryFact, getTreatNote, getCoverage } from "./foodFacts.js"

test("โปรตีน 30 g = 60% Thai RDI → โปรตีนสูง", () => {
  const facts = getNutrientFacts({ protein: 30, fiber: 0 })
  assert.equal(facts.length, 1)
  assert.equal(facts[0].label, "โปรตีนสูง")
  assert.equal(facts[0].pctRdi, 60)
})

test("ขอบเกณฑ์: 10 g = 20% → สูง, 5 g = 10% → มี, 4 g → ไม่มีป้าย", () => {
  assert.equal(getNutrientFacts({ protein: 10 })[0].level, "high")
  assert.equal(getNutrientFacts({ protein: 5 })[0].level, "source")
  assert.deepEqual(getNutrientFacts({ protein: 4 }), [])
})

test("ใยอาหาร 5 g = 20% → ใยอาหารสูง", () => {
  assert.equal(getNutrientFacts({ fiber: 5 })[0].label, "ใยอาหารสูง")
})

test("ธาตุเหล็กแสดงเฉพาะเมื่อมีตัวเลข", () => {
  assert.equal(getNutrientFacts({ protein: 1 }).some(f => f.key === "iron"), false)
  assert.equal(getNutrientFacts({ iron: 3 })[0].label, "ธาตุเหล็กสูง") // 20%
})

test("เรียงจาก % มาก → น้อย และ primary เลือกระดับสูงก่อน", () => {
  const food = { protein: 6, fiber: 6 }  // 12% กับ 24%
  assert.deepEqual(getNutrientFacts(food).map(f => f.key), ["fiber", "protein"])
  assert.equal(getPrimaryFact(food).key, "fiber")
  assert.equal(getPrimaryFact({ protein: 1 }), null)
})

test("ขนมได้ข้อความขนาดพอดี ไม่ใช่ป้ายเตือน", () => {
  assert.equal(getTreatNote({ cat: "thaibake", cal: 180 }).label, "ของว่าง · 180 kcal ต่อหน่วย")
  assert.equal(getTreatNote({ cat: "protein", cal: 200 }), null)
})

test("coverage", () => {
  const c = getCoverage([
    { protein: 30, effort: "ready", diet: { vegetarian: false }, source: { ref: "thai-fct" } },
    { protein: 2, fiber: 6, effort: "bogus", source: { ref: "estimate" } },
  ])
  assert.equal(c.total, 2)
  assert.equal(c.withEffort, 1)
  assert.equal(c.verified, 1)
  assert.equal(c.highProtein, 1)
  assert.equal(c.highFiber, 1)
})