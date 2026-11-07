// รัน: node --test src/services/storage.test.js
import { test, beforeEach } from "node:test"
import assert from "node:assert/strict"

/* localStorage จำลองสำหรับ Node */
const store = new Map()
globalThis.window = {
  localStorage: {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
  },
}

const {
  STORAGE_KEYS, readJSON, writeJSON, clearHealthData, clearAppStorage,
  validatePeriodLog, addPeriodLog, updatePeriodLog, deletePeriodLog, getOpenPeriod,
  normalizeCycleSettings, migrateLegacyCycleSettings,
} = await import("./storage.js")

const TODAY = "2026-11-07"
beforeEach(() => store.clear())

test("เพิ่มรอบ แล้วเรียงใหม่ → เก่า", () => {
  let r = addPeriodLog([], { startDate: "2026-10-02", endDate: "2026-10-05" }, TODAY)
  assert.ok(r.ok)
  r = addPeriodLog(r.logs, { startDate: "2026-11-02" }, TODAY)
  assert.ok(r.ok)
  assert.deepEqual(r.logs.map(l => l.startDate), ["2026-11-02", "2026-10-02"])
  assert.equal(getOpenPeriod(r.logs).startDate, "2026-11-02")
})

test("validation", () => {
  assert.match(validatePeriodLog({ startDate: "" }, [], TODAY), /วันแรก/)
  assert.match(validatePeriodLog({ startDate: "2026-02-30" }, [], TODAY), /วันแรก/)
  assert.match(validatePeriodLog({ startDate: "2026-11-08" }, [], TODAY), /อนาคต/)
  assert.match(validatePeriodLog({ startDate: "2026-11-05", endDate: "2026-11-03" }, [], TODAY), /ไม่ก่อน/)
  assert.match(validatePeriodLog({ startDate: "2026-10-01", endDate: "2026-10-20" }, [], TODAY), /เกิน/)
  assert.equal(validatePeriodLog({ startDate: "2026-11-02", endDate: "2026-11-05" }, [], TODAY), null)
})

test("กันบันทึกทับรอบเดิม — รวมรอบที่ยังไม่ปิด", () => {
  const { logs } = addPeriodLog([], { startDate: "2026-11-02" }, TODAY)
  assert.match(addPeriodLog(logs, { startDate: "2026-11-04" }, TODAY).error, /ทับ/)
  assert.ok(addPeriodLog(logs, { startDate: "2026-10-02", endDate: "2026-10-05" }, TODAY).ok)
})

test("แก้ไขรอบตัวเองไม่ถือว่าทับ", () => {
  const { logs, entry } = addPeriodLog([], { startDate: "2026-11-02" }, TODAY)
  const r = updatePeriodLog(logs, entry.id, { endDate: "2026-11-05" }, TODAY)
  assert.ok(r.ok)
  assert.equal(r.logs[0].endDate, "2026-11-05")
  assert.equal(getOpenPeriod(r.logs), null)
})

test("แก้ไขที่ไม่ผ่าน validation → logs เดิมไม่เปลี่ยน", () => {
  const { logs, entry } = addPeriodLog([], { startDate: "2026-11-02" }, TODAY)
  const r = updatePeriodLog(logs, entry.id, { endDate: "2026-11-01" }, TODAY)
  assert.equal(r.ok, false)
  assert.equal(r.logs, logs)
})

test("ลบรอบ", () => {
  const { logs, entry } = addPeriodLog([], { startDate: "2026-11-02" }, TODAY)
  assert.deepEqual(deletePeriodLog(logs, entry.id).logs, [])
  assert.equal(deletePeriodLog(logs, "nope").ok, false)
})

test("readJSON ทนต่อ JSON เสีย", () => {
  store.set("x", "{bad")
  assert.deepEqual(readJSON("x", []), [])
})

test("clearHealthData ลบเฉพาะข้อมูลสุขภาพ รวม moodlogs และ dailyLogs", () => {
  writeJSON(STORAGE_KEYS.periodLogs, [1])
  writeJSON(STORAGE_KEYS.moodLogs, [1])
  writeJSON(STORAGE_KEYS.dailyLogs, { "2026-11-07": {} })
  writeJSON(STORAGE_KEYS.user, { name: "a" })
  clearHealthData()
  assert.equal(store.has(STORAGE_KEYS.dailyLogs), false)
  assert.equal(store.has(STORAGE_KEYS.periodLogs), false)
  assert.equal(store.has(STORAGE_KEYS.moodLogs), false)
  assert.equal(store.has(STORAGE_KEYS.user), true)
})

test("clearAppStorage ลบทุก key รวม key เก่า", () => {
  writeJSON(STORAGE_KEYS.user, {})
  writeJSON("he_cycles", [])
  store.set(STORAGE_KEYS.lang, "th")
  clearAppStorage()
  assert.equal(store.size, 0)
})

test("normalizeCycleSettings", () => {
  assert.deepEqual(normalizeCycleSettings({ cycleLength: "31", periodLength: "" }),
    { cycleLength: 31, periodLength: null })
  assert.deepEqual(normalizeCycleSettings({ cycleLength: 5, periodLength: 4.5 }),
    { cycleLength: null, periodLength: null })
})

test("migrate ย้าย cycleLength เดิมครั้งเดียว ไม่ทับค่าที่มีอยู่", () => {
  migrateLegacyCycleSettings({ cycleLength: 30, cycleDay: 14 })
  assert.deepEqual(readJSON(STORAGE_KEYS.cycleSettings), { cycleLength: 30, periodLength: null })
  migrateLegacyCycleSettings({ cycleLength: 26 })
  assert.equal(readJSON(STORAGE_KEYS.cycleSettings).cycleLength, 30)
})