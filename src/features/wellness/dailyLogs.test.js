// รัน: node --test src/features/wellness/dailyLogs.test.js
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  upsertDailyLog, toggleMood, cycleSymptom, deleteDailyLog,
  getDailyLog, listDailyLogs, migrateMoodLogs,
} from "./dailyLogs.js"

const TODAY = "2026-11-07"

test("บันทึกอารมณ์ครั้งแรกสร้างบันทึกของวันนั้น", () => {
  const r = toggleMood({}, TODAY, "irritable", TODAY)
  assert.ok(r.ok)
  assert.equal(getDailyLog(r.logs, TODAY).mood, "irritable")
})

test("แตะอารมณ์เดิมซ้ำ = ยกเลิก และบันทึกว่างถูกลบ", () => {
  let { logs } = toggleMood({}, TODAY, "good", TODAY)
  logs = toggleMood(logs, TODAY, "good", TODAY).logs
  assert.equal(getDailyLog(logs, TODAY), null)
})

test("แตะอาการวนระดับ 1 → 2 → 3 → ไม่มี", () => {
  let logs = {}
  const levels = []
  for (let i = 0; i < 4; i++) {
    logs = cycleSymptom(logs, TODAY, "craving_sweet", TODAY).logs
    levels.push(getDailyLog(logs, TODAY)?.symptoms.craving_sweet ?? 0)
  }
  assert.deepEqual(levels, [1, 2, 3, 0])
})

test("อารมณ์กับอาการอยู่บันทึกเดียวกัน", () => {
  let { logs } = toggleMood({}, TODAY, "sensitive", TODAY)
  logs = cycleSymptom(logs, TODAY, "fatigue", TODAY).logs
  const log = getDailyLog(logs, TODAY)
  assert.equal(log.mood, "sensitive")
  assert.deepEqual(log.symptoms, { fatigue: 1 })
})

test("validation", () => {
  assert.match(toggleMood({}, "2026-11-08", "good", TODAY).error, /อนาคต/)
  assert.match(toggleMood({}, TODAY, "angry", TODAY).error, /อารมณ์/)
  assert.match(upsertDailyLog({}, TODAY, { symptoms: { fatigue: 5 } }, TODAY).error, /1–3/)
  assert.match(upsertDailyLog({}, TODAY, { symptoms: { acne: 1 } }, TODAY).error, /อาการ/)
  assert.match(upsertDailyLog({}, TODAY, { note: "x".repeat(300) }, TODAY).error, /280/)
})

test("แก้ย้อนหลังได้ และ list เรียงใหม่ → เก่า", () => {
  let { logs } = toggleMood({}, "2026-11-01", "ok", TODAY)
  logs = toggleMood(logs, TODAY, "great", TODAY).logs
  assert.deepEqual(listDailyLogs(logs).map(l => l.date), [TODAY, "2026-11-01"])
  assert.equal(deleteDailyLog(logs, "2026-11-01").logs["2026-11-01"], undefined)
})

test("migrate จาก he_moodlogs เดิม", () => {
  const old = [ // ใหม่ → เก่า ตามรูปแบบเดิม
    { dateKey: TODAY, mood: "bad", energy: "medium", symptoms: ["cravings", "anxious"], note: "งานเยอะ" },
    { dateKey: TODAY, mood: "good", energy: "low", symptoms: ["cramps"], note: "" },
    { dateKey: "2026-11-05", mood: "tired", energy: "high", symptoms: ["sleepy", "happy"], note: "" },
  ]
  const out = migrateMoodLogs(old)
  assert.equal(out[TODAY].mood, "low") // อันล่าสุดของวัน
  assert.deepEqual(out[TODAY].symptoms, { cramps: 1, fatigue: 1, craving_sweet: 1 })
  assert.deepEqual(out[TODAY].legacyTags, ["anxious"])
  assert.equal(out[TODAY].note, "งานเยอะ")
  assert.equal(out["2026-11-05"].mood, "ok")
  assert.deepEqual(out["2026-11-05"].symptoms, { fatigue: 1 })
})

test("migrate ไม่ทับบันทึกแบบใหม่ที่มีอยู่แล้ว", () => {
  const existing = { [TODAY]: { date: TODAY, mood: "great", symptoms: {}, note: "" } }
  const out = migrateMoodLogs([{ dateKey: TODAY, mood: "bad", symptoms: [] }], existing)
  assert.equal(out[TODAY].mood, "great")
})