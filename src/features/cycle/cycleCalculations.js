/* ═══════════════════════════════════════════════════
   cycleCalculations.js
   Pure functions สำหรับคำนวณรอบเดือน — ไม่แตะ UI / localStorage
   ทุกวันที่ใช้รูปแบบ "YYYY-MM-DD" (เวลาท้องถิ่น) เพื่อเลี่ยงบั๊ก timezone
   ของ toISOString() ที่ทำให้วันที่เลื่อนไป 1 วันในไทยก่อน 7 โมงเช้า

   periodLog: { id, startDate: "YYYY-MM-DD", endDate: "YYYY-MM-DD" | null }
   settings:  { cycleLength?: number, periodLength?: number }  ← ค่าที่ผู้ใช้กรอกเอง
═══════════════════════════════════════════════════ */

export const DEFAULT_CYCLE_LENGTH  = 28
export const DEFAULT_PERIOD_LENGTH = 5
export const LUTEAL_LENGTH         = 14   // สูตรประมาณ: ไข่ตก ≈ 14 วันก่อนรอบถัดไป
const MIN_VALID_CYCLE = 15                // นอกช่วงนี้ถือว่าน่าจะบันทึกผิดหรือขาดไป
const MAX_VALID_CYCLE = 90
const RECENT_CYCLES   = 6                 // ใช้เฉลี่ยจากรอบล่าสุดเท่านี้
const IRREGULAR_SPREAD = 8                // ส่วนต่างรอบยาวสุด–สั้นสุด ≥ นี้ → แจ้งว่าคาดการณ์ไม่แม่น
const MS_PER_DAY = 86400000

/* ── Date helpers (local time) ── */
export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function parseDateKey(key) {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function todayKey() {
  return toDateKey(new Date())
}

export function addDays(key, n) {
  const d = parseDateKey(key)
  d.setDate(d.getDate() + n)
  return toDateKey(d)
}

/** จำนวนวันจาก a ถึง b (b − a) */
export function daysBetween(a, b) {
  // ใช้ UTC ของวันที่ท้องถิ่น เพื่อไม่ให้ daylight saving ทำให้คลาด
  const [ay, am, ad] = a.split("-").map(Number)
  const [by, bm, bd] = b.split("-").map(Number)
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / MS_PER_DAY)
}

/** วันที่แบบไทย เช่น "3 ธ.ค. 2569" */
const TH_MONTHS = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."]
export function formatThaiDate(key) {
  const [y, m, d] = key.split("-").map(Number)
  return `${d} ${TH_MONTHS[m - 1]} ${y + 543}`
}

/* ── Period logs ── */

/** เรียงจากใหม่ → เก่า และตัดรายการที่ไม่มี startDate */
export function sortPeriodLogs(logs = []) {
  return logs
    .filter(l => l && l.startDate)
    .slice()
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1))
}

/** ความยาวแต่ละรอบ (วันเริ่มรอบ → วันเริ่มรอบถัดไป) เรียงใหม่ → เก่า */
export function getCycleLengths(logs) {
  const sorted = sortPeriodLogs(logs)
  const lengths = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const len = daysBetween(sorted[i + 1].startDate, sorted[i].startDate)
    if (len >= MIN_VALID_CYCLE && len <= MAX_VALID_CYCLE) lengths.push(len)
  }
  return lengths
}

/** ระยะเวลามีประจำเดือนแต่ละครั้ง (นับวันเริ่มและวันสุดท้าย) */
export function getPeriodLengths(logs) {
  return sortPeriodLogs(logs)
    .filter(l => l.endDate && l.endDate >= l.startDate)
    .map(l => daysBetween(l.startDate, l.endDate) + 1)
    .filter(n => n >= 1 && n <= 15)
}

function average(nums) {
  return Math.round(nums.reduce((s, n) => s + n, 0) / nums.length)
}

/**
 * ความยาวรอบที่ใช้คำนวณ
 * ลำดับความสำคัญ: ประวัติจริง → ค่าที่ผู้ใช้ตั้ง → 28 วัน
 * source บอก UI ว่าตัวเลขมาจากไหน (แสดงให้ผู้ใช้เห็นได้)
 */
export function getCycleStats(logs, settings = {}) {
  const recent = getCycleLengths(logs).slice(0, RECENT_CYCLES)
  if (recent.length > 0) {
    const spread = Math.max(...recent) - Math.min(...recent)
    return {
      cycleLength: average(recent),
      source: "history",
      sampleSize: recent.length,
      spread,
      irregular: recent.length >= 2 && spread >= IRREGULAR_SPREAD,
    }
  }
  return {
    cycleLength: settings.cycleLength || DEFAULT_CYCLE_LENGTH,
    source: settings.cycleLength ? "setting" : "default",
    sampleSize: 0,
    spread: null,
    irregular: false,
  }
}

export function getPeriodLength(logs, settings = {}) {
  const recent = getPeriodLengths(logs).slice(0, RECENT_CYCLES)
  if (recent.length > 0) return average(recent)
  return settings.periodLength || DEFAULT_PERIOD_LENGTH
}

/* ── Predictions ── */

/**
 * ช่วงความคลาดเคลื่อน ± วัน
 * ข้อมูลน้อยหรือรอบไม่สม่ำเสมอ → ช่วงกว้างขึ้น
 */
function uncertaintyDays(stats) {
  if (stats.sampleSize === 0) return 4
  if (stats.sampleSize < 3)   return 3
  return Math.max(2, Math.ceil(stats.spread / 2))
}

/** วันมีประจำเดือนรอบถัดไป + ช่วงที่อาจคลาดเคลื่อน */
export function predictNextPeriod(lastStart, stats) {
  const date = addDays(lastStart, stats.cycleLength)
  const u = uncertaintyDays(stats)
  return { date, earliest: addDays(date, -u), latest: addDays(date, u) }
}

/**
 * วันไข่ตกโดยประมาณ = 14 วันก่อนรอบถัดไป
 * fertileWindow = 5 วันก่อนไข่ตก ถึง 1 วันหลัง (ช่วงที่มีโอกาสตั้งครรภ์สูง)
 * ⚠ เป็นการประมาณจากปฏิทินเท่านั้น ห้ามใช้เป็นวิธีคุมกำเนิด
 */
export function estimateOvulation(nextPeriodDate) {
  const date = addDays(nextPeriodDate, -LUTEAL_LENGTH)
  return {
    date,
    fertileStart: addDays(date, -5),
    fertileEnd:   addDays(date, 1),
  }
}

/* ── Phase ── */

/** วันที่เท่าไรของรอบ (วันเริ่มประจำเดือน = วันที่ 1) */
export function getCycleDay(lastStart, today = todayKey()) {
  return daysBetween(lastStart, today) + 1
}

/**
 * เฟสจากวันของรอบ — ปรับตามความยาวรอบจริง ไม่ยึด 28 วัน
 *   menstrual  : วัน 1 → periodLength
 *   follicular : หลังประจำเดือน → ก่อนช่วงไข่ตก
 *   ovulation  : ไข่ตก ±1 วัน
 *   luteal     : หลังช่วงไข่ตก → สิ้นรอบ
 *   late       : เลยวันที่คาดว่าจะมาแล้ว
 */
export function getPhase(cycleDay, cycleLength, periodLength = DEFAULT_PERIOD_LENGTH) {
  if (cycleDay < 1) return null
  if (cycleDay > cycleLength) return "late"
  const ovulationDay = Math.max(periodLength + 2, cycleLength - LUTEAL_LENGTH)
  if (cycleDay <= periodLength)     return "menstrual"
  if (cycleDay < ovulationDay - 1)  return "follicular"
  if (cycleDay <= ovulationDay + 1) return "ovulation"
  return "luteal"
}

/* ── One-stop snapshot สำหรับ UI ── */

/**
 * สรุปสถานะรอบเดือน ณ วันที่ today
 * คืน null ถ้ายังไม่เคยบันทึกประจำเดือน → UI แสดงโหมด Food & Mood ปกติ
 */
export function getCycleSnapshot(logs, settings = {}, today = todayKey()) {
  const sorted = sortPeriodLogs(logs).filter(l => l.startDate <= today)
  if (sorted.length === 0) return null

  const last         = sorted[0]
  const stats        = getCycleStats(sorted, settings)
  const periodLength = getPeriodLength(sorted, settings)
  const cycleDay     = getCycleDay(last.startDate, today)
  const nextPeriod   = predictNextPeriod(last.startDate, stats)
  const ovulation    = estimateOvulation(nextPeriod.date)
  const isOnPeriod   = last.endDate
    ? today <= last.endDate
    : cycleDay <= periodLength

  return {
    lastStart: last.startDate,
    cycleDay,
    cycleLength: stats.cycleLength,
    periodLength,
    phase: isOnPeriod ? "menstrual" : getPhase(cycleDay, stats.cycleLength, periodLength),
    isOnPeriod,
    daysUntilNextPeriod: daysBetween(today, nextPeriod.date),
    nextPeriod,
    ovulation,
    confidence: {
      source: stats.source,         // "history" | "setting" | "default"
      sampleSize: stats.sampleSize,
      irregular: stats.irregular,
    },
  }
}
