// รัน: node --test src/features/cycle/cycleCalculations.test.js
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  daysBetween, addDays, formatThaiDate, getCycleLengths, getCycleStats,
  getPeriodLength, predictNextPeriod, estimateOvulation, getPhase, getCycleSnapshot,
} from "./cycleCalculations.js"

test("ตัวอย่างในแผน: เริ่ม 2 พ.ย. 69, รอบ 31 วัน", () => {
  const stats = { cycleLength: 31, sampleSize: 3, spread: 2 }
  const next = predictNextPeriod("2026-11-02", stats)
  assert.equal(next.date, "2026-12-03")
  assert.equal(formatThaiDate(next.date), "3 ธ.ค. 2569")
  assert.equal(estimateOvulation(next.date).date, "2026-11-19")
})

test("daysBetween / addDays ข้ามเดือนและปี", () => {
  assert.equal(daysBetween("2026-12-30", "2027-01-02"), 3)
  assert.equal(addDays("2026-02-27", 2), "2026-03-01")
})

test("ความยาวรอบคำนวณจากประวัติ และตัดค่าผิดปกติ", () => {
  const logs = [
    { startDate: "2026-11-02" },
    { startDate: "2026-10-02" }, // 31
    { startDate: "2026-09-01" }, // 31
    { startDate: "2026-08-01" }, // 31
    { startDate: "2026-07-30" }, // 2 → ตัดทิ้ง
  ]
  assert.deepEqual(getCycleLengths(logs), [31, 31, 31])
  const s = getCycleStats(logs)
  assert.equal(s.cycleLength, 31)
  assert.equal(s.source, "history")
  assert.equal(s.irregular, false)
})

test("ไม่มีประวัติ → ใช้ค่าที่ผู้ใช้ตั้ง แล้วค่อย 28", () => {
  assert.equal(getCycleStats([{ startDate: "2026-11-02" }], { cycleLength: 33 }).cycleLength, 33)
  assert.equal(getCycleStats([]).source, "default")
})

test("รอบไม่สม่ำเสมอถูก flag", () => {
  const logs = [{ startDate: "2026-11-01" }, { startDate: "2026-09-26" }, { startDate: "2026-08-30" }]
  assert.equal(getCycleStats(logs).irregular, true) // 36 กับ 27
})

test("ระยะเวลามีประจำเดือนนับรวมวันแรกและวันสุดท้าย", () => {
  assert.equal(getPeriodLength([{ startDate: "2026-11-02", endDate: "2026-11-05" }]), 4)
})

test("เฟสเลื่อนตามความยาวรอบ ไม่ยึด 28 วัน", () => {
  // รอบ 28: ไข่ตกวัน 14
  assert.equal(getPhase(14, 28, 5), "ovulation")
  assert.equal(getPhase(20, 28, 5), "luteal")
  // รอบ 35: ไข่ตกวัน 21 → วัน 14 ยังเป็น follicular
  assert.equal(getPhase(14, 35, 5), "follicular")
  assert.equal(getPhase(21, 35, 5), "ovulation")
  assert.equal(getPhase(3, 35, 5), "menstrual")
  assert.equal(getPhase(36, 35, 5), "late")
})

test("snapshot: ไม่มีข้อมูล → null", () => {
  assert.equal(getCycleSnapshot([], {}, "2026-11-07"), null)
})

test("snapshot วันที่ 7 พ.ย. 69", () => {
  const logs = [
    { startDate: "2026-11-02", endDate: "2026-11-05" },
    { startDate: "2026-10-02", endDate: "2026-10-05" },
  ]
  const s = getCycleSnapshot(logs, {}, "2026-11-07")
  assert.equal(s.cycleDay, 6)
  assert.equal(s.cycleLength, 31)
  assert.equal(s.phase, "follicular")
  assert.equal(s.isOnPeriod, false)
  assert.equal(s.nextPeriod.date, "2026-12-03")
  assert.equal(s.daysUntilNextPeriod, 26)
  assert.equal(s.confidence.sampleSize, 1)
})