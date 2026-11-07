/* ═══════════════════════════════════════════════════
   storage.js
   ที่เดียวที่รู้ว่าข้อมูลเก็บไว้ที่ไหน (ตอนนี้คือ localStorage)
   ถ้าวันหนึ่งย้ายไปฐานข้อมูลจริง แก้ไฟล์นี้ไฟล์เดียว

   ข้อมูลรอบเดือนแบ่งเป็น 2 ส่วน:
   - periodLogs    [{ id, startDate, endDate|null, createdAt, updatedAt }]
   - cycleSettings { cycleLength|null, periodLength|null }  ← ผู้ใช้กรอกเอง ไม่บังคับ
   - dailyLogs     { "YYYY-MM-DD": { mood, symptoms, note } }  ← Sprint 2
                   ฟังก์ชันจัดการอยู่ที่ src/features/wellness/dailyLogs.js

   ฟังก์ชันจัดการ periodLogs เป็น pure function:
   รับ list เดิม → คืน { ok, logs, error } ไม่แตะ localStorage เอง
   ใช้คู่กับ useLocalStorage(STORAGE_KEYS.periodLogs, []) ใน component
═══════════════════════════════════════════════════ */

import { todayKey, daysBetween, sortPeriodLogs } from "../features/cycle/cycleCalculations.js"

/* ── Keys ── */
export const STORAGE_KEYS = {
  // เดิม
  user:          "he_user",
  weightHistory: "he_weightHistory",
  foodLog:       "he_foodLog",
  cartItems:     "he_cartItems",
  diary:         "he_diary",
  moodLogs:      "he_moodlogs",   // ← เดิมไม่ถูกลบตอน reset
  lang:          "he_lang",
  // ใหม่ (Sprint 1)
  periodLogs:    "he_periodLogs",
  cycleSettings: "he_cycleSettings",
  // ใหม่ (Sprint 2)
  dailyLogs:     "he_dailyLogs",
}

/** ข้อมูลที่ถือเป็นข้อมูลสุขภาพ — ลบได้แยกจากการตั้งค่าอื่น */
export const HEALTH_DATA_KEYS = [
  STORAGE_KEYS.periodLogs,
  STORAGE_KEYS.cycleSettings,
  STORAGE_KEYS.moodLogs,
  STORAGE_KEYS.dailyLogs,
  STORAGE_KEYS.weightHistory,
]

/** key เก่าที่เลิกใช้แล้ว ลบทิ้งตอน reset ด้วย */
const LEGACY_KEYS = ["he_cycles"]

export const DEFAULT_CYCLE_SETTINGS = { cycleLength: null, periodLength: null }

/* ── Safe read / write (private mode, storage เต็ม, JSON เสีย) ── */
export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function removeKeys(keys) {
  keys.forEach(k => {
    try { window.localStorage.removeItem(k) } catch {}
  })
}

/** ลบเฉพาะข้อมูลสุขภาพ (รอบเดือน อารมณ์ น้ำหนัก) — โปรไฟล์และภาษายังอยู่ */
export function clearHealthData() {
  removeKeys(HEALTH_DATA_KEYS)
}

/** ลบทุกอย่างของ HormoneEats → กลับไปเริ่มต้นใหม่ */
export function clearAppStorage() {
  removeKeys([...Object.values(STORAGE_KEYS), ...LEGACY_KEYS])
}

/* ═══════════════════════════════════════════════════
   PERIOD LOGS — pure operations + validation
═══════════════════════════════════════════════════ */

const MAX_PERIOD_DAYS = 15
const ASSUMED_OPEN_PERIOD = 5   // ใช้เช็กการทับซ้อนเมื่อยังไม่ได้กรอกวันสุดท้าย
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function isValidDateKey(key) {
  if (!DATE_RE.test(key)) return false
  const [y, m, d] = key.split("-").map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
}

/** ช่วงวันที่ของ log ใช้เช็กทับซ้อน */
function rangeOf(log) {
  if (log.endDate) return [log.startDate, log.endDate]
  const [y, m, d] = log.startDate.split("-").map(Number)
  const end = new Date(y, m - 1, d + ASSUMED_OPEN_PERIOD - 1)
  const key = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`
  return [log.startDate, key]
}

/**
 * ตรวจข้อมูลก่อนบันทึก — คืนข้อความ error ภาษาไทยให้ UI แสดงได้ทันที
 * หรือ null ถ้าผ่าน
 */
export function validatePeriodLog(entry, existingLogs = [], today = todayKey()) {
  const { startDate, endDate = null, id } = entry

  if (!startDate || !isValidDateKey(startDate)) return "กรุณาเลือกวันแรกของประจำเดือน"
  if (startDate > today) return "ยังบันทึกวันในอนาคตไม่ได้"

  if (endDate !== null) {
    if (!isValidDateKey(endDate)) return "วันสุดท้ายไม่ถูกต้อง"
    if (endDate < startDate) return "วันสุดท้ายต้องไม่ก่อนวันแรก"
    if (endDate > today) return "ยังบันทึกวันสุดท้ายในอนาคตไม่ได้ ไว้บันทึกเมื่อประจำเดือนหมดแล้ว"
    if (daysBetween(startDate, endDate) + 1 > MAX_PERIOD_DAYS) {
      return `ประจำเดือนยาวเกิน ${MAX_PERIOD_DAYS} วัน ลองตรวจสอบวันที่อีกครั้ง`
    }
  }

  const [s, e] = rangeOf({ startDate, endDate })
  const clash = existingLogs.find(l => {
    if (l.id === id) return false
    const [ls, le] = rangeOf(l)
    return s <= le && ls <= e
  })
  if (clash) return "ช่วงวันที่นี้ทับกับรอบที่บันทึกไว้แล้ว ลองแก้ไขรอบเดิมแทน"

  return null
}

/** เพิ่มรอบใหม่ */
export function addPeriodLog(logs, { startDate, endDate = null }, today = todayKey()) {
  const error = validatePeriodLog({ startDate, endDate }, logs, today)
  if (error) return { ok: false, logs, error }
  const now = new Date().toISOString()
  const entry = { id: newId(), startDate, endDate, createdAt: now, updatedAt: now }
  return { ok: true, logs: sortPeriodLogs([...logs, entry]), entry, error: null }
}

/** แก้ไขรอบเดิม (เช่น กรอกวันสุดท้าย หรือแก้วันที่ผิด) */
export function updatePeriodLog(logs, id, changes, today = todayKey()) {
  const current = logs.find(l => l.id === id)
  if (!current) return { ok: false, logs, error: "ไม่พบรายการนี้" }
  const next = { ...current, ...changes, id }
  const error = validatePeriodLog(next, logs, today)
  if (error) return { ok: false, logs, error }
  next.updatedAt = new Date().toISOString()
  return {
    ok: true,
    logs: sortPeriodLogs(logs.map(l => (l.id === id ? next : l))),
    entry: next,
    error: null,
  }
}

/** ลบรอบ */
export function deletePeriodLog(logs, id) {
  if (!logs.some(l => l.id === id)) return { ok: false, logs, error: "ไม่พบรายการนี้" }
  return { ok: true, logs: logs.filter(l => l.id !== id), error: null }
}

/** รอบที่ยังไม่ได้กรอกวันสุดท้าย (ใช้แสดงปุ่ม "ประจำเดือนหมดแล้ว") */
export function getOpenPeriod(logs) {
  return sortPeriodLogs(logs).find(l => !l.endDate) ?? null
}

/* ═══════════════════════════════════════════════════
   CYCLE SETTINGS
═══════════════════════════════════════════════════ */

/**
 * ทำความสะอาดค่าที่ผู้ใช้กรอก — ช่องว่าง/ค่าเพี้ยน → null (ให้ระบบใช้ประวัติหรือค่าเริ่มต้นแทน)
 */
export function normalizeCycleSettings(input = {}) {
  const toRange = (v, min, max) => {
    const n = Number(v)
    return Number.isInteger(n) && n >= min && n <= max ? n : null
  }
  return {
    cycleLength:  toRange(input.cycleLength, 15, 90),
    periodLength: toRange(input.periodLength, 1, MAX_PERIOD_DAYS),
  }
}

/**
 * ย้ายค่าเดิมจาก user (เวอร์ชันก่อน) มาเป็น cycleSettings ครั้งเดียว
 * ไม่ย้าย cycleDay / currentPhase เพราะเป็นค่าตายตัวที่ไม่ได้มาจากวันที่จริง
 * และไม่สร้าง periodLog ปลอมให้ ผู้ใช้ต้องบันทึกเอง
 */
export function migrateLegacyCycleSettings(user) {
  if (readJSON(STORAGE_KEYS.cycleSettings, null) !== null) return
  const settings = normalizeCycleSettings({ cycleLength: user?.cycleLength })
  writeJSON(STORAGE_KEYS.cycleSettings, settings)
}