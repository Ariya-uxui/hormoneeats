import { useState, useMemo } from "react"
import { useApp, ScreenWrapper } from "../App.jsx"
import {
  getCycleLengths, sortPeriodLogs,
  todayKey, addDays, daysBetween, formatThaiDate, parseDateKey, toDateKey,
} from "../features/cycle/cycleCalculations.js"
import {
  addPeriodLog, updatePeriodLog, deletePeriodLog,
  getOpenPeriod, normalizeCycleSettings,
} from "../services/storage.js"

/* ═══════════════════════════════════════════════════
   CYCLE TRACKER SCREEN (Sprint 1)
   ┌─ Header ──────────────────────────────────────┐
   ├─ EmptyState  (ยังไม่เคยบันทึก)                  │
   │  หรือ StatusCard (เฟส · รอบถัดไป · ไข่ตก · ความแม่นยำ) │
   ├─ CycleCalendar  (บันทึกจริง + ช่วงคาดการณ์)       │
   ├─ PeriodForm     (เพิ่ม / แก้ไข / ลบ)             │
   ├─ CycleHistory                                  │
   └─ CycleSettings  (ใช้เมื่อยังมีประวัติไม่พอ)          │
   Logic ทั้งหมดอยู่ใน cycleCalculations.js + storage.js
═══════════════════════════════════════════════════ */

const THAI_MONTHS = [
  "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
  "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",
]
const DAYS_SHORT = ["อา","จ","อ","พ","พฤ","ศ","ส"]

const LATE_PHASE = { key:"late", label:"เลยกำหนด", emoji:"⏳" }

/* ── Shared styles ── */
function useStyles(tokens) {
  return {
    card: {
      margin:"14px 16px 0", background:tokens.creamSoft, borderRadius:20,
      border:`1px solid ${tokens.border}`, padding:"16px 18px",
    },
    title: { fontFamily:"'Playfair Display',serif", fontSize:17, color:tokens.cocoa, marginBottom:10 },
    label: { fontSize:11, color:tokens.stone, marginBottom:4, display:"block" },
    input: {
      width:"100%", padding:"10px 12px", borderRadius:12, border:`1px solid ${tokens.border}`,
      background:"white", fontSize:14, color:tokens.cocoa, fontFamily:"inherit",
    },
    btnPrimary: {
      padding:"11px 16px", borderRadius:999, border:"none", background:tokens.cocoa,
      color:tokens.cream, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit",
    },
    btnGhost: {
      padding:"10px 14px", borderRadius:999, border:`1px solid ${tokens.border}`,
      background:"transparent", color:tokens.cocoaMid, fontSize:13, cursor:"pointer", fontFamily:"inherit",
    },
    note: { fontSize:11, color:tokens.stone, lineHeight:1.6 },
  }
}

/* ═══════════════════════════════════════════════════
   EMPTY STATE
═══════════════════════════════════════════════════ */
function EmptyState({ onStart, tokens, s }) {
  return (
    <div className="fade-up" style={{ ...s.card, textAlign:"center", padding:"26px 22px" }}>
      <div style={{ fontSize:34, marginBottom:8 }}>🌙</div>
      <div style={s.title}>เริ่มบันทึกรอบเดือน</div>
      <p style={{ ...s.note, fontSize:12.5, color:tokens.cocoaMid, marginBottom:16 }}>
        บันทึกวันแรกของประจำเดือนครั้งล่าสุด แอปจะค่อย ๆ เรียนรู้ความยาวรอบจากข้อมูลของคุณเอง
        ถ้ายังไม่สะดวก ใช้บันทึกอาหารและอารมณ์ได้ตามปกติ
      </p>
      <button style={s.btnPrimary} onClick={onStart}>+ บันทึกวันแรกของประจำเดือน</button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   STATUS CARD
═══════════════════════════════════════════════════ */
function confidenceText(c) {
  if (c.source === "history") return `คำนวณจาก ${c.sampleSize} รอบที่คุณบันทึก`
  if (c.source === "setting") return "ใช้ความยาวรอบที่คุณตั้งไว้ · บันทึกครบ 2 รอบเพื่อให้แม่นขึ้น"
  return "ใช้ค่าเริ่มต้น 28 วัน · บันทึกครบ 2 รอบเพื่อให้แม่นขึ้น"
}

function StatusCard({ snap, openPeriod, onEndPeriod, PHASES, tokens, s }) {
  const phase = snap.phase === "late" ? LATE_PHASE : PHASES[snap.phase]
  const color = snap.phase === "late" ? tokens.stone : phase.color
  const { nextPeriod, ovulation, confidence } = snap
  const days = snap.daysUntilNextPeriod

  const nextLine =
    days > 0  ? `คาดว่าประจำเดือนจะมาในอีกประมาณ ${days} วัน` :
    days === 0 ? "คาดว่าประจำเดือนจะมาวันนี้" :
                 `เลยวันที่คาดไว้ ${-days} วัน — รอบเดือนคลาดเคลื่อนได้เป็นปกติ`

  const showOvulation = daysBetween(todayKey(), ovulation.fertileEnd) >= 0

  return (
    <div className="fade-up" style={{
      margin:"14px 16px 0", background:color, borderRadius:22, padding:"18px 20px 16px",
      color:"white", position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", top:-50, right:-40, width:150, height:150, borderRadius:"50%",
        background:"rgba(255,255,255,.08)", pointerEvents:"none" }} />

      <div style={{ fontSize:10, letterSpacing:".1em", textTransform:"uppercase", opacity:.85, marginBottom:4 }}>
        วันที่ {snap.cycleDay} ของรอบ · รอบเฉลี่ย {snap.cycleLength} วัน
      </div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:6 }}>
        {phase.emoji} {phase.label}
      </div>
      <div style={{ fontSize:12.5, lineHeight:1.55, marginBottom:12, opacity:.95 }}>{nextLine}</div>

      <div style={{ display:"flex", paddingTop:12, borderTop:"1px solid rgba(255,255,255,.25)" }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9.5, opacity:.8 }}>รอบถัดไป (ประมาณ)</div>
          <div style={{ fontSize:14, fontWeight:500, marginTop:2 }}>{formatThaiDate(nextPeriod.date)}</div>
          <div style={{ fontSize:9.5, opacity:.8, marginTop:2 }}>
            ช่วง {formatThaiDate(nextPeriod.earliest).replace(/ \d{4}$/, "")} – {formatThaiDate(nextPeriod.latest).replace(/ \d{4}$/, "")}
          </div>
        </div>
        {showOvulation && (
          <div style={{ flex:1, paddingLeft:14, borderLeft:"1px solid rgba(255,255,255,.25)" }}>
            <div style={{ fontSize:9.5, opacity:.8 }}>ไข่ตก (ประมาณ)</div>
            <div style={{ fontSize:14, fontWeight:500, marginTop:2 }}>{formatThaiDate(ovulation.date)}</div>
            <div style={{ fontSize:9.5, opacity:.8, marginTop:2 }}>
              ช่วงมีโอกาสตั้งครรภ์ {formatThaiDate(ovulation.fertileStart).replace(/ \d{4}$/, "")} – {formatThaiDate(ovulation.fertileEnd).replace(/ \d{4}$/, "")}
            </div>
          </div>
        )}
      </div>

      <div style={{ fontSize:10, marginTop:12, opacity:.9, lineHeight:1.55 }}>
        ⓘ {confidenceText(confidence)}
        {confidence.irregular && <><br/>รอบของคุณยาวไม่เท่ากันมาก ช่วงคาดการณ์จึงกว้างกว่าปกติ</>}
        <br/>การคาดการณ์จากปฏิทินไม่แม่นพอสำหรับใช้คุมกำเนิด
      </div>

      {openPeriod && (
        <button onClick={onEndPeriod} style={{
          marginTop:12, width:"100%", padding:"10px", borderRadius:999, border:"none",
          background:"rgba(255,255,255,.92)", color:tokens.cocoa, fontSize:13, fontWeight:500,
          cursor:"pointer", fontFamily:"inherit",
        }}>
          ประจำเดือนหมดแล้ววันนี้
        </button>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CALENDAR — บันทึกจริง (ทึบ) · คาดการณ์ (เส้นประ) · ไข่ตก (จุด)
═══════════════════════════════════════════════════ */
function buildDayMarks(logs, snap) {
  const today = todayKey()
  const logged = new Set()
  logs.forEach(l => {
    const end = l.endDate ?? (() => {
      const assumed = addDays(l.startDate, (snap?.periodLength ?? 5) - 1)
      return assumed < today ? assumed : today
    })()
    for (let k = l.startDate; k <= end; k = addDays(k, 1)) logged.add(k)
  })

  const predicted = new Set()
  const fertile = new Set()
  let ovulationDay = null
  if (snap) {
    for (let i = 0; i < snap.periodLength; i++) {
      const k = addDays(snap.nextPeriod.date, i)
      if (k > today) predicted.add(k)
    }
    for (let k = snap.ovulation.fertileStart; k <= snap.ovulation.fertileEnd; k = addDays(k, 1)) {
      if (k >= today) fertile.add(k)
    }
    if (snap.ovulation.date >= today) ovulationDay = snap.ovulation.date
  }
  return { logged, predicted, fertile, ovulationDay, today }
}

function CycleCalendar({ logs, snap, onPickDate, tokens, s }) {
  const now = new Date()
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const marks = useMemo(() => buildDayMarks(logs, snap), [logs, snap])

  const first = new Date(view.y, view.m, 1)
  const offset = first.getDay()
  const total = new Date(view.y, view.m + 1, 0).getDate()
  const cells = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]

  function shift(n) {
    const d = new Date(view.y, view.m + n, 1)
    setView({ y: d.getFullYear(), m: d.getMonth() })
  }

  const navBtn = { ...s.btnGhost, padding:"4px 12px", fontSize:15, lineHeight:1 }

  return (
    <div className="fade-up" style={s.card}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <button style={navBtn} onClick={() => shift(-1)} aria-label="เดือนก่อน">‹</button>
        <div style={{ ...s.title, marginBottom:0 }}>{THAI_MONTHS[view.m]} {view.y + 543}</div>
        <button style={navBtn} onClick={() => shift(1)} aria-label="เดือนถัดไป">›</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, textAlign:"center" }}>
        {DAYS_SHORT.map(d => (
          <div key={d} style={{ fontSize:10, color:tokens.stone, paddingBottom:4 }}>{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />
          const key = toDateKey(new Date(view.y, view.m, day))
          const isLogged    = marks.logged.has(key)
          const isPredicted = marks.predicted.has(key)
          const isFertile   = marks.fertile.has(key)
          const isOvulation = marks.ovulationDay === key
          const isToday     = marks.today === key
          const isFuture    = key > marks.today

          return (
            <button
              key={key}
              disabled={isFuture}
              onClick={() => onPickDate(key)}
              aria-label={`${day} ${THAI_MONTHS[view.m]}${isLogged ? " มีประจำเดือน" : ""}`}
              style={{
                position:"relative", height:38, borderRadius:12, fontFamily:"inherit", fontSize:13,
                cursor:isFuture ? "default" : "pointer",
                background: isLogged ? tokens.menstrual : isFertile ? tokens.ovulationLt : "transparent",
                color: isLogged ? "white" : isFuture ? tokens.stone : tokens.cocoa,
                border: isPredicted ? `1.5px dashed ${tokens.menstrual}`
                      : isToday     ? `1.5px solid ${tokens.cocoa}`
                      : "1.5px solid transparent",
                fontWeight: isToday ? 600 : 400,
              }}>
              {day}
              {isOvulation && (
                <span style={{ position:"absolute", bottom:4, left:"50%", transform:"translateX(-50%)",
                  width:5, height:5, borderRadius:"50%", background:tokens.ovulation }} />
              )}
            </button>
          )
        })}
      </div>

      <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 14px", marginTop:12, fontSize:10, color:tokens.stone }}>
        <Legend swatch={{ background:tokens.menstrual }} text="มีประจำเดือน" />
        <Legend swatch={{ border:`1.5px dashed ${tokens.menstrual}` }} text="คาดว่าจะมา" />
        <Legend swatch={{ background:tokens.ovulationLt }} text="ช่วงมีโอกาสตั้งครรภ์" />
        <Legend swatch={{ background:tokens.ovulation, borderRadius:"50%", width:6, height:6 }} text="ไข่ตก (ประมาณ)" />
      </div>
      <div style={{ ...s.note, marginTop:8 }}>แตะวันที่เพื่อบันทึกวันแรกของประจำเดือน</div>
    </div>
  )
}

function Legend({ swatch, text }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
      <span style={{ width:12, height:12, borderRadius:4, display:"inline-block", ...swatch }} />
      {text}
    </span>
  )
}

/* ═══════════════════════════════════════════════════
   PERIOD FORM — เพิ่ม / แก้ไข / ลบ
═══════════════════════════════════════════════════ */
function PeriodForm({ form, setForm, error, onSave, onCancel, onDelete, tokens, s }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const today = todayKey()
  const isEdit = form.mode === "edit"

  return (
    <div className="fade-up" style={{ ...s.card, borderColor:tokens.lavender }}>
      <div style={s.title}>{isEdit ? "แก้ไขรอบเดือน" : "บันทึกรอบเดือน"}</div>

      <label style={s.label} htmlFor="pf-start">วันแรกของประจำเดือน</label>
      <input id="pf-start" type="date" max={today} style={s.input}
        value={form.startDate}
        onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />

      <label style={{ ...s.label, marginTop:12 }} htmlFor="pf-end">วันสุดท้าย</label>
      <input id="pf-end" type="date" max={today} min={form.startDate || undefined}
        style={{ ...s.input, opacity: form.ongoing ? .45 : 1 }}
        disabled={form.ongoing}
        value={form.ongoing ? "" : form.endDate}
        onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />

      <label style={{ display:"flex", alignItems:"center", gap:8, marginTop:10, fontSize:12.5, color:tokens.cocoaMid, cursor:"pointer" }}>
        <input type="checkbox" checked={form.ongoing}
          onChange={e => setForm(f => ({ ...f, ongoing: e.target.checked }))} />
        ยังมีประจำเดือนอยู่ / ยังไม่แน่ใจ
      </label>

      {error && (
        <div role="alert" style={{ marginTop:10, fontSize:12, color:"#8B4050", background:tokens.roseLt,
          padding:"8px 12px", borderRadius:10 }}>
          {error}
        </div>
      )}

      <div style={{ display:"flex", gap:8, marginTop:14 }}>
        <button style={{ ...s.btnPrimary, flex:1 }} onClick={onSave}>บันทึก</button>
        <button style={s.btnGhost} onClick={onCancel}>ยกเลิก</button>
      </div>

      {isEdit && (
        <div style={{ marginTop:12, textAlign:"center" }}>
          {confirmDelete ? (
            <div style={{ fontSize:12, color:tokens.cocoaMid }}>
              ลบรอบนี้ถาวร?{" "}
              <button onClick={onDelete} style={{ ...s.btnGhost, padding:"4px 12px", color:"#8B4050", borderColor:"#D9B3BE" }}>ลบ</button>{" "}
              <button onClick={() => setConfirmDelete(false)} style={{ ...s.btnGhost, padding:"4px 12px" }}>ไม่ลบ</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)}
              style={{ border:"none", background:"none", color:tokens.stone, fontSize:12, textDecoration:"underline", cursor:"pointer", fontFamily:"inherit" }}>
              ลบรอบนี้
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   HISTORY
═══════════════════════════════════════════════════ */
function CycleHistory({ logs, onEdit, tokens, s }) {
  const sorted = sortPeriodLogs(logs)
  if (sorted.length === 0) return null

  return (
    <div className="fade-up" style={s.card}>
      <div style={s.title}>ประวัติรอบเดือน</div>
      {sorted.map((l, i) => {
        const prev = sorted[i + 1]
        const cycleLen = prev ? daysBetween(prev.startDate, l.startDate) : null
        const periodLen = l.endDate ? daysBetween(l.startDate, l.endDate) + 1 : null
        return (
          <button key={l.id} onClick={() => onEdit(l)} style={{
            width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"11px 0", border:"none", borderTop: i ? `1px solid ${tokens.borderLt}` : "none",
            background:"none", cursor:"pointer", fontFamily:"inherit", textAlign:"left",
          }}>
            <div>
              <div style={{ fontSize:13.5, color:tokens.cocoa }}>
                {formatThaiDate(l.startDate)}{l.endDate ? ` – ${formatThaiDate(l.endDate)}` : ""}
              </div>
              <div style={{ fontSize:11, color:tokens.stone, marginTop:2 }}>
                {periodLen ? `มีประจำเดือน ${periodLen} วัน` : "ยังไม่ได้บันทึกวันสุดท้าย"}
                {cycleLen ? ` · รอบยาว ${cycleLen} วัน` : ""}
              </div>
            </div>
            <span style={{ fontSize:12, color:tokens.lavenderDk }}>แก้ไข</span>
          </button>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SETTINGS — ใช้เป็นค่าตั้งต้นจนกว่าจะมีประวัติพอ
═══════════════════════════════════════════════════ */
function CycleSettings({ settings, onSave, hasHistory, tokens, s }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({
    cycleLength:  settings.cycleLength  ?? "",
    periodLength: settings.periodLength ?? "",
  })

  if (!open) {
    return (
      <div style={{ margin:"14px 16px 0", textAlign:"center" }}>
        <button style={s.btnGhost} onClick={() => setOpen(true)}>ตั้งค่าความยาวรอบ</button>
      </div>
    )
  }

  return (
    <div className="fade-up" style={s.card}>
      <div style={s.title}>ตั้งค่าความยาวรอบ</div>
      <p style={{ ...s.note, marginBottom:12 }}>
        {hasHistory
          ? "ตอนนี้แอปใช้ค่าเฉลี่ยจากประวัติของคุณแล้ว ค่าด้านล่างจะใช้เฉพาะเมื่อประวัติไม่พอ"
          : "ไม่บังคับ — ถ้าไม่รู้ ปล่อยว่างได้ แอปจะเรียนรู้เองเมื่อบันทึกครบ 2 รอบ"}
      </p>
      <div style={{ display:"flex", gap:10 }}>
        <div style={{ flex:1 }}>
          <label style={s.label} htmlFor="cs-cycle">รอบเดือนยาว (วัน)</label>
          <input id="cs-cycle" type="number" inputMode="numeric" min="15" max="90" placeholder="เช่น 30"
            style={s.input} value={draft.cycleLength}
            onChange={e => setDraft(d => ({ ...d, cycleLength: e.target.value }))} />
        </div>
        <div style={{ flex:1 }}>
          <label style={s.label} htmlFor="cs-period">มีประจำเดือน (วัน)</label>
          <input id="cs-period" type="number" inputMode="numeric" min="1" max="15" placeholder="เช่น 5"
            style={s.input} value={draft.periodLength}
            onChange={e => setDraft(d => ({ ...d, periodLength: e.target.value }))} />
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginTop:14 }}>
        <button style={{ ...s.btnPrimary, flex:1 }} onClick={() => { onSave(draft); setOpen(false) }}>บันทึก</button>
        <button style={s.btnGhost} onClick={() => setOpen(false)}>ปิด</button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SCREEN
═══════════════════════════════════════════════════ */
const EMPTY_FORM = { mode:"add", id:null, startDate:"", endDate:"", ongoing:true }

export default function CycleTracker() {
  // ข้อมูลรอบเดือนอยู่ที่ App.jsx (state เดียวทั้งแอป) — หน้านี้อ่าน/เขียนผ่าน context
  const {
    periodLogs: logs, setPeriodLogs: setLogs,
    cycleSettings: settings, setCycleSettings: setSettings,
    cycleSnapshot: snap, PHASES, tokens, showToast,
  } = useApp()
  const s = useStyles(tokens)

  const [form,  setForm ] = useState(null)   // null = ปิดฟอร์ม
  const [error, setError] = useState(null)

  // แสดงปุ่ม "หมดแล้ววันนี้" เฉพาะรอบล่าสุดที่ยังไม่ปิดและยังอยู่ในช่วงที่เป็นไปได้
  const latestOpen = getOpenPeriod(logs)
  const openPeriod = latestOpen
    && latestOpen.startDate === snap?.lastStart
    && daysBetween(latestOpen.startDate, todayKey()) < 15
    ? latestOpen : null
  const hasHistory = getCycleLengths(logs).length > 0

  /* ฟอร์มอยู่บนสุด — เลื่อนขึ้นให้เห็นเมื่อเปิดจากปฏิทินหรือประวัติ */
  function scrollToTop() {
    document.querySelector(".scroll-body")?.scrollTo({ top:0, behavior:"smooth" })
  }

  function openAdd(startDate = todayKey()) {
    setError(null)
    setForm({ ...EMPTY_FORM, startDate })
    scrollToTop()
  }

  function openEdit(log) {
    setError(null)
    setForm({ mode:"edit", id:log.id, startDate:log.startDate, endDate:log.endDate ?? "", ongoing:!log.endDate })
    scrollToTop()
  }

  function closeForm() { setForm(null); setError(null) }

  function handleSave() {
    const entry = { startDate: form.startDate, endDate: form.ongoing || !form.endDate ? null : form.endDate }
    const result = form.mode === "edit"
      ? updatePeriodLog(logs, form.id, entry)
      : addPeriodLog(logs, entry)
    if (!result.ok) { setError(result.error); return }
    setLogs(result.logs)
    closeForm()
    showToast(form.mode === "edit" ? "แก้ไขแล้ว ✓" : "บันทึกรอบเดือนแล้ว ✓")
  }

  function handleDelete() {
    const result = deletePeriodLog(logs, form.id)
    if (!result.ok) { setError(result.error); return }
    setLogs(result.logs)
    closeForm()
    showToast("ลบรอบแล้ว")
  }

  function handleEndPeriod() {
    const result = updatePeriodLog(logs, openPeriod.id, { endDate: todayKey() })
    if (!result.ok) { showToast(result.error); return }
    setLogs(result.logs)
    showToast("บันทึกวันสุดท้ายแล้ว ✓")
  }

  function handleSaveSettings(draft) {
    setSettings(normalizeCycleSettings(draft))
    showToast("บันทึกการตั้งค่าแล้ว ✓")
  }

  return (
    <ScreenWrapper>
      {/* Header */}
      <div className="fade-up" style={{
        background:tokens.creamSoft, padding:"16px 20px 14px",
        borderBottom:`1px solid ${tokens.borderLt}`, flexShrink:0,
        display:"flex", alignItems:"flex-end", justifyContent:"space-between",
      }}>
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:tokens.cocoa, marginBottom:2 }}>
            รอบเดือน
          </div>
          <div style={{ fontSize:12, color:tokens.stone }}>บันทึก ดูประวัติ และคาดการณ์รอบถัดไป</div>
        </div>
        {snap && !form && (
          <button style={{ ...s.btnPrimary, padding:"8px 14px", fontSize:12 }} onClick={() => openAdd()}>
            + บันทึก
          </button>
        )}
      </div>

      <div className="scroll-body" style={{ flex:1, paddingBottom:110 }}>
        {form && (
          <PeriodForm form={form} setForm={setForm} error={error}
            onSave={handleSave} onCancel={closeForm} onDelete={handleDelete}
            tokens={tokens} s={s} />
        )}

        {!snap && !form && <EmptyState onStart={() => openAdd()} tokens={tokens} s={s} />}

        {snap && (
          <StatusCard snap={snap} openPeriod={openPeriod} onEndPeriod={handleEndPeriod}
            PHASES={PHASES} tokens={tokens} s={s} />
        )}

        <CycleCalendar logs={logs} snap={snap} onPickDate={openAdd} tokens={tokens} s={s} />

        <CycleHistory logs={logs} onEdit={openEdit} tokens={tokens} s={s} />

        <CycleSettings settings={settings} onSave={handleSaveSettings}
          hasHistory={hasHistory} tokens={tokens} s={s} />
      </div>
    </ScreenWrapper>
  )
}