/* ═══════════════════════════════════════════════════
   dailyLogs.js  (Sprint 2 — Mood & Symptoms)
   Pure functions สำหรับบันทึกอารมณ์ อาการ และความอยากอาหารรายวัน

   รูปแบบข้อมูล (เก็บที่ STORAGE_KEYS.dailyLogs):
   {
     "2026-11-07": {
       date: "2026-11-07",
       mood: "irritable" | null,
       symptoms: { craving_sweet: 2, fatigue: 1 },   // id → ระดับ 1–3
       note: "",
       updatedAt: ISO string,
       legacyTags?: ["anxious"],                    // จากหน้า Mood เดิมที่ไม่มีในชุดใหม่
     }
   }
   - วันละ 1 บันทึก แก้ไขทับได้ทั้งวัน → บันทึกเร็ว ไม่ต้องคิดว่าบันทึกไปแล้วหรือยัง
   - ไม่เก็บเฟสไว้ในบันทึก เฟสคำนวณย้อนหลังจาก periodLogs ได้เสมอ
     (ของเดิมเก็บเฟสตอนบันทึก ซึ่งผิดถ้าแก้วันประจำเดือนทีหลัง)
═══════════════════════════════════════════════════ */

import { todayKey } from "../cycle/cycleCalculations.js"

export const MOODS = [
  { id:"great",     emoji:"😄", label:"ดีมาก",      labelEn:"Great"     },
  { id:"good",      emoji:"🙂", label:"ดี",         labelEn:"Good"      },
  { id:"ok",        emoji:"😐", label:"ปกติ",       labelEn:"Okay"      },
  { id:"low",       emoji:"😞", label:"ไม่ค่อยดี",   labelEn:"Low"       },
  { id:"sensitive", emoji:"🥺", label:"อ่อนไหว",    labelEn:"Sensitive" },
  { id:"irritable", emoji:"😠", label:"หงุดหงิด",   labelEn:"Irritable" },
]

/* group ใช้จัดกลุ่มบนหน้าจอ และให้ recommendationRules รู้ว่าอะไรเป็นความอยากอาหาร */
export const SYMPTOMS = [
  { id:"craving_sweet", emoji:"🍫", label:"อยากของหวาน", labelEn:"Sweet craving", group:"craving" },
  { id:"craving_fatty", emoji:"🍟", label:"อยากของมัน",  labelEn:"Salty/fatty craving", group:"craving" },
  { id:"bloating",      emoji:"🫧", label:"ท้องอืด",     labelEn:"Bloating",  group:"body" },
  { id:"cramps",        emoji:"🌡️", label:"ปวดท้อง",     labelEn:"Cramps",    group:"body" },
  { id:"fatigue",       emoji:"😴", label:"อ่อนเพลีย",   labelEn:"Fatigue",   group:"body" },
  { id:"headache",      emoji:"🤕", label:"ปวดหัว",      labelEn:"Headache",  group:"body" },
]

export const SEVERITY = [
  { level:1, label:"เล็กน้อย", labelEn:"Mild"     },
  { level:2, label:"ปานกลาง", labelEn:"Moderate" },
  { level:3, label:"มาก",     labelEn:"Strong"   },
]

const MOOD_IDS    = new Set(MOODS.map(m => m.id))
const SYMPTOM_IDS = new Set(SYMPTOMS.map(s => s.id))
const MAX_NOTE    = 280

/* ── Read ── */

export function getDailyLog(logs, date = todayKey()) {
  return logs?.[date] ?? null
}

/** ทุกบันทึก เรียงใหม่ → เก่า (ใช้กับหน้าประวัติและ insights) */
export function listDailyLogs(logs) {
  return Object.values(logs ?? {}).sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function isEmptyLog(log) {
  return !log || (!log.mood && Object.keys(log.symptoms ?? {}).length === 0 && !log.note?.trim())
}

/* ── Validate ── */

export function validateDailyLog(log, today = todayKey()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(log?.date ?? "")) return "วันที่ไม่ถูกต้อง"
  if (log.date > today) return "ยังบันทึกวันในอนาคตไม่ได้"
  if (log.mood != null && !MOOD_IDS.has(log.mood)) return "อารมณ์ไม่ถูกต้อง"
  for (const [id, lv] of Object.entries(log.symptoms ?? {})) {
    if (!SYMPTOM_IDS.has(id)) return "อาการไม่ถูกต้อง"
    if (![1, 2, 3].includes(lv)) return "ระดับอาการต้องเป็น 1–3"
  }
  if ((log.note ?? "").length > MAX_NOTE) return `บันทึกยาวได้ไม่เกิน ${MAX_NOTE} ตัวอักษร`
  return null
}

/* ── Write (pure: รับ logs เดิม → คืน { ok, logs, error }) ── */

/**
 * แก้ไขบันทึกของวันนั้น (สร้างใหม่ถ้ายังไม่มี)
 * changes: { mood?, symptoms?, note? } — symptoms แทนที่ทั้งชุด
 * ถ้าแก้แล้วว่างเปล่า จะลบบันทึกวันนั้นออก
 */
export function upsertDailyLog(logs, date, changes, today = todayKey()) {
  const prev = logs?.[date] ?? { date, mood: null, symptoms: {}, note: "" }
  const next = {
    ...prev,
    ...changes,
    date,
    symptoms: { ...(changes.symptoms ?? prev.symptoms ?? {}) },
    note: (changes.note ?? prev.note ?? "").slice(0, MAX_NOTE + 1),
  }
  const error = validateDailyLog(next, today)
  if (error) return { ok: false, logs, error }

  const out = { ...(logs ?? {}) }
  if (isEmptyLog(next) && !next.legacyTags?.length) {
    delete out[date]
    return { ok: true, logs: out, entry: null, error: null }
  }
  next.updatedAt = new Date().toISOString()
  out[date] = next
  return { ok: true, logs: out, entry: next, error: null }
}

/** แตะอารมณ์เดิมซ้ำ = ยกเลิก */
export function toggleMood(logs, date, moodId, today = todayKey()) {
  const current = logs?.[date]?.mood ?? null
  return upsertDailyLog(logs, date, { mood: current === moodId ? null : moodId }, today)
}

/**
 * แตะอาการวนระดับ: ไม่มี → 1 → 2 → 3 → ไม่มี
 * ให้บันทึกได้ด้วยการแตะอย่างเดียว ไม่ต้องเปิดหน้าเลือกระดับ
 */
export function cycleSymptom(logs, date, symptomId, today = todayKey()) {
  const symptoms = { ...(logs?.[date]?.symptoms ?? {}) }
  const lv = symptoms[symptomId] ?? 0
  if (lv >= 3) delete symptoms[symptomId]
  else symptoms[symptomId] = lv + 1
  return upsertDailyLog(logs, date, { symptoms }, today)
}

export function deleteDailyLog(logs, date) {
  if (!logs?.[date]) return { ok: false, logs, error: "ไม่พบบันทึกวันนี้" }
  const out = { ...logs }
  delete out[date]
  return { ok: true, logs: out, error: null }
}

/* ═══════════════════════════════════════════════════
   MIGRATION จาก he_moodlogs (หน้า Mood เดิม)
   เดิม: [{ mood, energy, symptoms:[], note, dateKey, time, phase }] ใหม่ → เก่า
   วันเดียวกันอาจมีหลายรายการ → รวมเป็นรายการเดียว (อารมณ์ใช้อันล่าสุด อาการรวมกัน)
═══════════════════════════════════════════════════ */

const LEGACY_MOOD = { great:"great", good:"good", neutral:"ok", tired:"ok", bad:"low" }
const LEGACY_SYMPTOM = {
  bloating:"bloating", cramps:"cramps", headache:"headache",
  cravings:"craving_sweet", sleepy:"fatigue",
}

export function migrateMoodLogs(oldLogs = [], existing = {}) {
  const out = { ...existing }
  // เก่า → ใหม่ เพื่อให้รายการล่าสุดของวันเป็นตัวตัดสินอารมณ์
  const ordered = [...oldLogs].filter(l => l?.dateKey).reverse()

  for (const old of ordered) {
    if (existing[old.dateKey]) continue // มีบันทึกแบบใหม่แล้ว ไม่ทับ
    const day = out[old.dateKey] ?? { date: old.dateKey, mood: null, symptoms: {}, note: "" }

    if (LEGACY_MOOD[old.mood]) day.mood = LEGACY_MOOD[old.mood]

    const legacy = new Set(day.legacyTags ?? [])
    for (const s of old.symptoms ?? []) {
      const id = LEGACY_SYMPTOM[s]
      if (id) day.symptoms[id] = Math.max(day.symptoms[id] ?? 0, 1)
      else legacy.add(s)
    }
    if (old.mood === "tired" || old.energy === "low") {
      day.symptoms.fatigue = Math.max(day.symptoms.fatigue ?? 0, 1)
    }
    if (legacy.size) day.legacyTags = [...legacy]

    if (old.note?.trim()) {
      day.note = [day.note, old.note.trim()].filter(Boolean).join(" · ").slice(0, MAX_NOTE)
    }
    day.updatedAt = day.updatedAt ?? new Date().toISOString()
    out[old.dateKey] = day
  }
  return out
}