import { useState, useMemo } from "react"
import { useApp, ScreenWrapper } from "../App.jsx"
import {
  MOODS, SYMPTOMS, SEVERITY,
  getDailyLog, listDailyLogs, toggleMood, cycleSymptom, upsertDailyLog, deleteDailyLog,
} from "../features/wellness/dailyLogs.js"
import {
  getCycleSnapshot, todayKey, addDays, formatThaiDate,
} from "../features/cycle/cycleCalculations.js"

/* ═══════════════════════════════════════════════════
   MOOD & SYMPTOM CHECK-IN (Sprint 2)
   เป้าหมาย: บันทึกได้ใน 10–15 วินาที
   - แตะอารมณ์ 1 ครั้ง → บันทึกทันที (ไม่มีปุ่ม Save)
   - แตะอาการซ้ำเพื่อเพิ่มระดับ: ไม่มี → เล็กน้อย → ปานกลาง → มาก → ไม่มี
   - เลื่อนดู/แก้วันก่อนหน้าได้ ไม่มีวันในอนาคต
   - ไม่มีข้อความทำนายอารมณ์จากเฟส — แสดงเฟสเป็นบริบท (ประมาณ) เท่านั้น
   ┌─ Header + DayPicker ─────────────────────────┐
   ├─ CycleContext (ถ้ามีบันทึกประจำเดือน)          │
   ├─ MoodPicker                                  │
   ├─ SymptomPicker (ความอยากอาหาร · ร่างกาย)       │
   ├─ NoteField                                   │
   └─ History (14 วันล่าสุด)                         │
═══════════════════════════════════════════════════ */

const MOOD_BY_ID    = Object.fromEntries(MOODS.map(m => [m.id, m]))
const SYMPTOM_BY_ID = Object.fromEntries(SYMPTOMS.map(s => [s.id, s]))
const LEGACY_LABELS = {
  anxious:"วิตกกังวล", focused:"โฟกัสดี", motivated:"มีแรงบันดาลใจ", happy:"มีความสุข", irritable:"หงุดหงิด",
}

function useStyles(tokens) {
  return {
    card: {
      margin:"12px 16px 0", background:tokens.creamSoft, borderRadius:20,
      border:`1px solid ${tokens.borderLt}`, padding:"14px 16px",
    },
    title: { fontSize:13, fontWeight:500, color:tokens.cocoa, marginBottom:10 },
    hint:  { fontSize:11, color:tokens.stone, lineHeight:1.5 },
  }
}

function dayLabel(date, today, lang) {
  if (date === today) return lang === "en" ? "Today" : "วันนี้"
  if (date === addDays(today, -1)) return lang === "en" ? "Yesterday" : "เมื่อวาน"
  return formatThaiDate(date)
}

/* ── Day picker ── */
function DayPicker({ date, today, onChange, tokens, lang }) {
  const btn = (disabled) => ({
    width:32, height:32, borderRadius:10, border:`1px solid ${tokens.border}`,
    background:"transparent", color: disabled ? tokens.stoneLt : tokens.cocoaMid,
    fontSize:16, cursor: disabled ? "default" : "pointer", fontFamily:"inherit",
  })
  const atToday = date >= today
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <button style={btn(false)} aria-label="วันก่อนหน้า" onClick={() => onChange(addDays(date, -1))}>‹</button>
      <div style={{ minWidth:84, textAlign:"center", fontSize:13, fontWeight:500, color:tokens.cocoa }}>
        {dayLabel(date, today, lang)}
      </div>
      <button style={btn(atToday)} aria-label="วันถัดไป" disabled={atToday}
        onClick={() => !atToday && onChange(addDays(date, 1))}>›</button>
    </div>
  )
}

/* ── Mood picker ── */
function MoodPicker({ value, onPick, tokens, s, lang }) {
  return (
    <div className="fade-up" style={s.card}>
      <div style={s.title}>{lang === "en" ? "How are you feeling?" : "วันนี้รู้สึกยังไงบ้าง?"}</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
        {MOODS.map(m => {
          const on = value === m.id
          return (
            <button key={m.id} onClick={() => onPick(m.id)} aria-pressed={on} style={{
              padding:"10px 4px", borderRadius:14, cursor:"pointer", fontFamily:"inherit",
              border:`1.5px solid ${on ? tokens.lavenderDk : tokens.border}`,
              background: on ? tokens.lavenderLt : "white",
              display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              transition:"all .15s",
            }}>
              <span style={{ fontSize:24 }}>{m.emoji}</span>
              <span style={{ fontSize:11.5, color: on ? tokens.lavenderDk : tokens.cocoaMid, fontWeight: on ? 600 : 400 }}>
                {lang === "en" ? m.labelEn : m.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Severity dots ── */
function Dots({ level, tokens }) {
  return (
    <span style={{ display:"inline-flex", gap:2 }} aria-hidden="true">
      {[1, 2, 3].map(i => (
        <span key={i} style={{ width:5, height:5, borderRadius:"50%",
          background: i <= level ? tokens.lavenderDk : tokens.border }} />
      ))}
    </span>
  )
}

/* ── Symptom picker ── */
function SymptomPicker({ symptoms, onTap, tokens, s, lang }) {
  const groups = [
    { id:"craving", title: lang === "en" ? "Food cravings" : "ความอยากอาหาร" },
    { id:"body",    title: lang === "en" ? "Body" : "ร่างกาย" },
  ]
  return (
    <div className="fade-up" style={s.card}>
      <div style={{ ...s.title, marginBottom:4 }}>{lang === "en" ? "Symptoms & cravings" : "อาการและความอยากอาหาร"}</div>
      <div style={{ ...s.hint, marginBottom:10 }}>
        {lang === "en" ? "Tap again to increase level · 4th tap clears" : "แตะซ้ำเพื่อเพิ่มระดับ · แตะครั้งที่ 4 เพื่อล้าง"}
      </div>
      {groups.map(g => (
        <div key={g.id} style={{ marginBottom:10 }}>
          <div style={{ fontSize:10.5, color:tokens.stone, marginBottom:6, letterSpacing:".04em" }}>{g.title}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {SYMPTOMS.filter(x => x.group === g.id).map(x => {
              const lv = symptoms[x.id] ?? 0
              const sev = SEVERITY.find(v => v.level === lv)
              return (
                <button key={x.id} onClick={() => onTap(x.id)}
                  aria-label={`${x.label}${sev ? ` ระดับ${sev.label}` : ""}`}
                  style={{
                    display:"flex", alignItems:"center", gap:6, padding:"8px 12px",
                    borderRadius:999, cursor:"pointer", fontFamily:"inherit", fontSize:12.5,
                    border:`1.5px solid ${lv ? tokens.lavenderDk : tokens.border}`,
                    background: lv ? tokens.lavenderLt : "white",
                    color: lv ? tokens.lavenderDk : tokens.cocoaMid,
                    transition:"all .15s",
                  }}>
                  <span>{x.emoji}</span>
                  <span>{lang === "en" ? x.labelEn : x.label}</span>
                  {lv > 0 && <Dots level={lv} tokens={tokens} />}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Note ── */
function NoteField({ value, onSave, tokens, s, lang }) {
  const [open,  setOpen ] = useState(Boolean(value))
  const [draft, setDraft] = useState(value ?? "")

  if (!open) {
    return (
      <div style={{ margin:"10px 16px 0" }}>
        <button onClick={() => setOpen(true)} style={{
          border:"none", background:"none", color:tokens.lavenderDk, fontSize:12.5,
          cursor:"pointer", fontFamily:"inherit", padding:0,
        }}>
          + {lang === "en" ? "Add a note" : "เพิ่มโน้ต (ไม่บังคับ)"}
        </button>
      </div>
    )
  }
  return (
    <div className="fade-up" style={s.card}>
      <label htmlFor="mood-note" style={{ ...s.title, display:"block" }}>{lang === "en" ? "Note" : "โน้ต"}</label>
      <textarea id="mood-note" rows={2} maxLength={280} value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => draft !== (value ?? "") && onSave(draft)}
        placeholder={lang === "en" ? "Anything worth remembering today?" : "มีอะไรอยากจดไว้ไหม เช่น นอนน้อย งานเยอะ"}
        style={{
          width:"100%", padding:"10px 12px", borderRadius:12, border:`1px solid ${tokens.border}`,
          fontSize:13, fontFamily:"inherit", color:tokens.cocoa, resize:"none", background:"white",
        }} />
      <div style={{ ...s.hint, textAlign:"right", marginTop:4 }}>{draft.length}/280</div>
    </div>
  )
}

/* ── History ── */
function History({ logs, periodLogs, cycleSettings, selected, onPick, PHASES, tokens, s, lang }) {
  const items = listDailyLogs(logs).slice(0, 14)
  if (items.length === 0) return null
  return (
    <div className="fade-up" style={s.card}>
      <div style={s.title}>{lang === "en" ? "Recent days" : "ย้อนหลัง"}</div>
      {items.map((log, i) => {
        const snap = getCycleSnapshot(periodLogs, cycleSettings, log.date)
        const phase = snap && snap.phase !== "late" ? PHASES[snap.phase] : null
        const mood = MOOD_BY_ID[log.mood]
        const syms = Object.entries(log.symptoms ?? {})
        return (
          <button key={log.date} onClick={() => onPick(log.date)} style={{
            width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 0",
            border:"none", borderTop: i ? `1px solid ${tokens.borderLt}` : "none",
            background: log.date === selected ? tokens.lavenderLt : "none",
            borderRadius: log.date === selected ? 10 : 0,
            cursor:"pointer", fontFamily:"inherit", textAlign:"left",
          }}>
            <span style={{ fontSize:22, width:30, textAlign:"center" }}>{mood?.emoji ?? "·"}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12.5, color:tokens.cocoa }}>
                {formatThaiDate(log.date)}
                {snap && (
                  <span style={{ color:tokens.stone, fontSize:11 }}>
                    {" "}· {lang === "en" ? "Day" : "วันที่"} {snap.cycleDay}{phase ? ` · ${phase.label}` : ""}
                  </span>
                )}
              </div>
              <div style={{ fontSize:11, color:tokens.stone, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {syms.length
                  ? syms.map(([id, lv]) => `${SYMPTOM_BY_ID[id]?.emoji ?? ""}${"•".repeat(lv)}`).join("  ")
                  : (mood ? (lang === "en" ? mood.labelEn : mood.label) : "")}
              </div>
            </div>
            <span style={{ fontSize:12, color:tokens.lavenderDk }}>{lang === "en" ? "Edit" : "แก้ไข"}</span>
          </button>
        )
      })}
      <div style={{ ...s.hint, marginTop:8 }}>
        {lang === "en"
          ? "Cycle day and phase are estimates from your logged periods."
          : "วันของรอบและเฟสเป็นค่าประมาณจากวันประจำเดือนที่บันทึก"}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SCREEN
═══════════════════════════════════════════════════ */
export default function MoodTracker() {
  const {
    dailyLogs, setDailyLogs, periodLogs, cycleSettings, cycleSnapshot,
    PHASES, tokens, showToast, lang,
  } = useApp()
  const s = useStyles(tokens)
  const today = todayKey()

  const [date, setDate] = useState(today)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const log = getDailyLog(dailyLogs, date)
  const symptoms = log?.symptoms ?? {}

  // บริบทรอบเดือนของวันที่เลือก (ถ้ามีบันทึกประจำเดือน)
  const snap = useMemo(
    () => date === today ? cycleSnapshot : getCycleSnapshot(periodLogs, cycleSettings, date),
    [date, today, cycleSnapshot, periodLogs, cycleSettings],
  )
  const phase = snap && snap.phase !== "late" ? PHASES[snap.phase] : null

  function apply(result) {
    if (!result.ok) { showToast(result.error); return }
    setDailyLogs(result.logs)
  }

  function pickDate(d) {
    setDate(d)
    setConfirmDelete(false)
    document.querySelector(".scroll-body")?.scrollTo({ top:0, behavior:"smooth" })
  }

  function handleDelete() {
    apply(deleteDailyLog(dailyLogs, date))
    setConfirmDelete(false)
    showToast(lang === "en" ? "Deleted" : "ลบบันทึกแล้ว")
  }

  return (
    <ScreenWrapper>
      {/* Header */}
      <div className="fade-up" style={{
        background:tokens.creamSoft, padding:"16px 20px 12px",
        borderBottom:`1px solid ${tokens.borderLt}`, flexShrink:0,
        display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:10,
      }}>
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:tokens.cocoa, marginBottom:2 }}>
            {lang === "en" ? "Check-in" : "บันทึกวันนี้"}
          </div>
          <div style={{ fontSize:11.5, color: log ? tokens.sageDk : tokens.stone }}>
            {log
              ? (lang === "en" ? "✓ Saved automatically" : "✓ บันทึกอัตโนมัติแล้ว")
              : (lang === "en" ? "Tap to log — saves instantly" : "แตะเพื่อบันทึก ไม่ต้องกดเซฟ")}
          </div>
        </div>
        <DayPicker date={date} today={today} onChange={pickDate} tokens={tokens} lang={lang} />
      </div>

      <div className="scroll-body" style={{ flex:1, paddingBottom:110 }}>
        {snap && (
          <div style={{ margin:"12px 16px 0", fontSize:11.5, color:tokens.stone }}>
            {phase?.emoji ?? "⏳"} {lang === "en" ? "Cycle day" : "วันที่"} {snap.cycleDay}
            {lang === "en" ? "" : " ของรอบ"} · {phase ? phase.label : (lang === "en" ? "Past expected date" : "เลยวันที่คาดไว้")}
            {" "}({lang === "en" ? "estimate" : "ประมาณ"})
          </div>
        )}

        <MoodPicker value={log?.mood ?? null} tokens={tokens} s={s} lang={lang}
          onPick={id => apply(toggleMood(dailyLogs, date, id))} />

        <SymptomPicker symptoms={symptoms} tokens={tokens} s={s} lang={lang}
          onTap={id => apply(cycleSymptom(dailyLogs, date, id))} />

        {log?.legacyTags?.length > 0 && (
          <div style={{ margin:"8px 16px 0", ...s.hint }}>
            {lang === "en" ? "From your earlier log: " : "จากบันทึกแบบเดิม: "}
            {log.legacyTags.map(t => LEGACY_LABELS[t] ?? t).join(", ")}
          </div>
        )}

        {/* key = date → ฟิลด์โน้ตรีเซ็ตเมื่อเปลี่ยนวัน */}
        <NoteField key={date} value={log?.note ?? ""} tokens={tokens} s={s} lang={lang}
          onSave={note => apply(upsertDailyLog(dailyLogs, date, { note }))} />

        {log && (
          <div style={{ margin:"10px 16px 0", textAlign:"right" }}>
            {confirmDelete ? (
              <span style={{ fontSize:12, color:tokens.cocoaMid }}>
                {lang === "en" ? "Delete this day's log? " : "ลบบันทึกของวันนี้? "}
                <button onClick={handleDelete} style={{ border:"none", background:"none", color:"#8B4050",
                  fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                  {lang === "en" ? "Delete" : "ลบ"}
                </button>
                <button onClick={() => setConfirmDelete(false)} style={{ border:"none", background:"none",
                  color:tokens.stone, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
                  {lang === "en" ? "Cancel" : "ยกเลิก"}
                </button>
              </span>
            ) : (
              <button onClick={() => setConfirmDelete(true)} style={{ border:"none", background:"none",
                color:tokens.stone, fontSize:12, textDecoration:"underline", cursor:"pointer", fontFamily:"inherit" }}>
                {lang === "en" ? "Delete this day" : "ลบบันทึกวันนี้"}
              </button>
            )}
          </div>
        )}

        <History logs={dailyLogs} periodLogs={periodLogs} cycleSettings={cycleSettings}
          selected={date} onPick={pickDate} PHASES={PHASES} tokens={tokens} s={s} lang={lang} />
      </div>
    </ScreenWrapper>
  )
}