import { useState } from "react"
import { useApp, ScreenWrapper } from "../App.jsx"
 
/* ═══════════════════════════════════════════════════
   MOOD & ENERGY TRACKER
   บันทึกอารมณ์ + พลังงานรายวัน
   เชื่อมโยงกับเฟสฮอร์โมน
═══════════════════════════════════════════════════ */
 
const MOODS = [
  { id:"great",   emoji:"🤩", label:"ยอดเยี่ยม",  color:"#A8C4A0", score:5 },
  { id:"good",    emoji:"😊", label:"ดี",          color:"#BBA8C4", score:4 },
  { id:"neutral", emoji:"😐", label:"ปกติ",        color:"#C4A882", score:3 },
  { id:"tired",   emoji:"😔", label:"อ่อนเพลีย",  color:"#9EB0C4", score:2 },
  { id:"bad",     emoji:"😞", label:"แย่",         color:"#D4B8C0", score:1 },
]
 
const ENERGY_LEVELS = [
  { id:"high",   emoji:"⚡", label:"พลังงานสูง",  color:"#A8C4A0" },
  { id:"medium", emoji:"🔋", label:"ปานกลาง",     color:"#C4A882" },
  { id:"low",    emoji:"🪫", label:"พลังงานต่ำ",  color:"#9EB0C4" },
]
 
const SYMPTOMS = [
  { id:"bloating",   emoji:"🫀", label:"ท้องอืด"      },
  { id:"cramps",     emoji:"😣", label:"ปวดท้อง"      },
  { id:"headache",   emoji:"🤕", label:"ปวดหัว"       },
  { id:"cravings",   emoji:"🍫", label:"อยากของหวาน"  },
  { id:"anxious",    emoji:"😰", label:"วิตกกังวล"    },
  { id:"focused",    emoji:"🎯", label:"โฟกัสดี"      },
  { id:"motivated",  emoji:"💪", label:"มีแรงบันดาล"  },
  { id:"sleepy",     emoji:"😴", label:"ง่วงนอน"      },
  { id:"happy",      emoji:"✨", label:"มีความสุข"    },
  { id:"irritable",  emoji:"😤", label:"หงุดหงิด"     },
]
 
/* ── helpers ── */
function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
}
function formatDateThai(dateKey) {
  const [y,m,d] = dateKey.split("-").map(Number)
  const mo = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.",
               "ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."]
  return `${d} ${mo[m-1]}`
}
 
/* ── Mood insight per phase ── */
const PHASE_MOOD_TIPS = {
  follicular: { tip:"เฟสนี้ Estrogen สูงขึ้น พลังงานและอารมณ์มักดีขึ้นตามธรรมชาติ 🌱", color:"#A8C4A0" },
  ovulation:  { tip:"ช่วง Ovulation พลังงานและ confidence สูงสุด เหมาะทำสิ่งสำคัญ ✨", color:"#C4899A" },
  luteal:     { tip:"Progesterone สูง อาจรู้สึกหงุดหงิดหรืออยากของหวาน เป็นเรื่องปกติ 🍂", color:"#C4A882" },
  menstrual:  { tip:"ร่างกายกำลังพักฟื้น พักผ่อนให้เพียงพอและกินอาหารบำรุงธาตุเหล็ก 🌙", color:"#9EB0C4" },
}
 
/* ═══════════════════════════════════════════════════
   LOG ENTRY FORM
═══════════════════════════════════════════════════ */
function LogForm({ onSave, tokens, currentPhase }) {
  const { t } = useApp()
  const [mood,     setMood    ] = useState(null)
  const [energy,   setEnergy  ] = useState(null)
  const [symptoms, setSymptoms] = useState([])
  const [note,     setNote    ] = useState("")
 
  function toggleSymptom(id) {
    setSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }
 
  function handleSave() {
    if (!mood || !energy) return
    onSave({ mood, energy, symptoms, note, dateKey: todayKey(),
      time: new Date().toLocaleTimeString("th-TH", { hour:"2-digit", minute:"2-digit" }),
      phase: currentPhase.key,
    })
    setMood(null); setEnergy(null); setSymptoms([]); setNote("")
  }
 
  const phaseTip = PHASE_MOOD_TIPS[currentPhase.key]
 
  return (
    <div className="fade-up" style={{
      margin:"12px 16px 0",
      background:tokens.creamSoft,
      border:`1px solid ${tokens.borderLt}`,
      borderRadius:20, padding:"16px",
    }}>
      {/* Phase tip */}
      <div style={{
        background: phaseTip.color+"20",
        border:`1px solid ${phaseTip.color}40`,
        borderRadius:12, padding:"10px 12px",
        fontSize:12, color:tokens.cocoaMid,
        lineHeight:1.55, marginBottom:14,
      }}>
        {phaseTip.tip}
      </div>
 
      {/* Mood picker */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:11, fontWeight:500, color:tokens.stone,
          letterSpacing:".06em", textTransform:"uppercase", marginBottom:8 }}>
          {t("mood.mood_label")}
        </div>
        <div style={{ display:"flex", gap:6, justifyContent:"space-between" }}>
          {MOODS.map(m => (
            <div key={m.id} onClick={() => setMood(m.id)} style={{
              flex:1, display:"flex", flexDirection:"column",
              alignItems:"center", gap:4,
              padding:"10px 4px",
              border:`2px solid ${mood===m.id ? m.color : tokens.borderLt}`,
              borderRadius:14,
              background: mood===m.id ? m.color+"25" : tokens.cream,
              cursor:"pointer", transition:"all .15s",
            }}>
              <span style={{ fontSize:22 }}>{m.emoji}</span>
              <span style={{ fontSize:9, color: mood===m.id ? tokens.cocoa : tokens.stone,
                fontWeight: mood===m.id ? 500 : 400, textAlign:"center" }}>
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
 
      {/* Energy picker */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:11, fontWeight:500, color:tokens.stone,
          letterSpacing:".06em", textTransform:"uppercase", marginBottom:8 }}>
          ระดับพลังงาน
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {ENERGY_LEVELS.map(e => (
            <div key={e.id} onClick={() => setEnergy(e.id)} style={{
              flex:1, display:"flex", alignItems:"center",
              justifyContent:"center", gap:6, padding:"10px 8px",
              border:`2px solid ${energy===e.id ? e.color : tokens.borderLt}`,
              borderRadius:12,
              background: energy===e.id ? e.color+"25" : tokens.cream,
              cursor:"pointer", transition:"all .15s",
              fontSize:12, fontWeight: energy===e.id ? 500 : 400,
              color: energy===e.id ? tokens.cocoa : tokens.stone,
            }}>
              <span style={{ fontSize:16 }}>{e.emoji}</span>
              {e.label}
            </div>
          ))}
        </div>
      </div>
 
      {/* Symptoms */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:11, fontWeight:500, color:tokens.stone,
          letterSpacing:".06em", textTransform:"uppercase", marginBottom:8 }}>
          อาการ / ความรู้สึก (เลือกได้หลายอย่าง)
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {SYMPTOMS.map(s => {
            const active = symptoms.includes(s.id)
            return (
              <div key={s.id} onClick={() => toggleSymptom(s.id)} style={{
                display:"flex", alignItems:"center", gap:4,
                padding:"5px 10px",
                border:`1px solid ${active ? tokens.lavender : tokens.border}`,
                borderRadius:999, cursor:"pointer",
                background: active ? tokens.lavenderLt : tokens.cream,
                fontSize:11, fontWeight: active ? 500 : 400,
                color: active ? tokens.lavenderDk : tokens.stone,
                transition:"all .15s",
              }}>
                <span style={{ fontSize:12 }}>{s.emoji}</span>
                {s.label}
              </div>
            )
          })}
        </div>
      </div>
 
      {/* Note */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:11, fontWeight:500, color:tokens.stone,
          letterSpacing:".06em", textTransform:"uppercase", marginBottom:8 }}>
          {t("mood.note")}
        </div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="รู้สึกยังไงบ้างวันนี้..."
          rows={2}
          style={{
            width:"100%", padding:"10px 12px",
            border:`1px solid ${tokens.border}`, borderRadius:12,
            fontSize:13, fontFamily:"'DM Sans',sans-serif",
            color:tokens.cocoa, background:tokens.cream,
            outline:"none", resize:"none", lineHeight:1.5,
          }}
          onFocus={e => e.target.style.borderColor = tokens.lavender}
          onBlur={e  => e.target.style.borderColor = tokens.border}
        />
      </div>
 
      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!mood || !energy}
        style={{
          width:"100%", padding:"13px",
          background: mood && energy ? tokens.cocoa : tokens.border,
          color: mood && energy ? tokens.cream : tokens.stone,
          border:"none", borderRadius:14,
          fontSize:14, fontWeight:500,
          fontFamily:"'DM Sans',sans-serif",
          cursor: mood && energy ? "pointer" : "default",
          transition:"all .2s",
        }}
      >
        {t("mood.save")}
      </button>
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   HISTORY CARD
═══════════════════════════════════════════════════ */
function HistoryCard({ entry, tokens }) {
  const mood   = MOODS.find(m => m.id === entry.mood)
  const energy = ENERGY_LEVELS.find(e => e.id === entry.energy)
 
  return (
    <div style={{
      background:tokens.creamSoft,
      border:`1px solid ${tokens.borderLt}`,
      borderRadius:16, padding:"12px 14px",
      marginBottom:8,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:24 }}>{mood?.emoji}</span>
          <div>
            <div style={{ fontSize:13, fontWeight:500, color:tokens.cocoa }}>
              {mood?.label}
            </div>
            <div style={{ fontSize:10, color:tokens.stone }}>
              {formatDateThai(entry.dateKey)} · {entry.time}
            </div>
          </div>
        </div>
        <div style={{
          display:"flex", alignItems:"center", gap:4,
          padding:"4px 10px", borderRadius:999,
          background: energy ? energy.color+"20" : tokens.borderLt,
          fontSize:11, color:tokens.cocoaMid,
        }}>
          {energy?.emoji} {energy?.label}
        </div>
      </div>
 
      {entry.symptoms?.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:6 }}>
          {entry.symptoms.map(sid => {
            const s = SYMPTOMS.find(x => x.id === sid)
            return s ? (
              <span key={sid} style={{
                fontSize:10, padding:"2px 8px",
                background:tokens.lavenderLt, color:tokens.lavenderDk,
                borderRadius:999,
              }}>
                {s.emoji} {s.label}
              </span>
            ) : null
          })}
        </div>
      )}
 
      {entry.note && (
        <div style={{ fontSize:12, color:tokens.stone,
          fontStyle:"italic", lineHeight:1.5 }}>
          "{entry.note}"
        </div>
      )}
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   MOOD CHART (last 7 days)
═══════════════════════════════════════════════════ */
function MoodChart({ logs, tokens }) {
  const { t } = useApp()
  if (logs.length === 0) return null
 
  const last7 = [...logs].slice(0, 7).reverse()
  const maxScore = 5
 
  return (
    <div className="fade-up" style={{
      margin:"12px 16px 0",
      background:tokens.creamSoft,
      border:`1px solid ${tokens.borderLt}`,
      borderRadius:20, padding:"14px 16px",
    }}>
      <div style={{ fontSize:13, fontWeight:500, color:tokens.cocoa, marginBottom:12 }}>
        {t("mood.chart_title")}
      </div>
      <div style={{ display:"flex", alignItems:"flex-end",
        gap:6, height:60, marginBottom:8 }}>
        {last7.map((log, i) => {
          const mood  = MOODS.find(m => m.id === log.mood)
          const score = mood?.score ?? 3
          const h     = (score / maxScore) * 100
          return (
            <div key={i} style={{ flex:1, display:"flex",
              flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{
                width:"100%", height:`${h}%`,
                background: mood?.color ?? tokens.border,
                borderRadius:"4px 4px 0 0",
                minHeight:6, transition:"height .5s ease",
              }}/>
              <span style={{ fontSize:14 }}>{mood?.emoji ?? "·"}</span>
              <span style={{ fontSize:8, color:tokens.stone }}>
                {formatDateThai(log.dateKey).split(" ")[0]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   MOOD TRACKER — main export
═══════════════════════════════════════════════════ */
export default function MoodTracker() {
  const { tokens, currentPhase, user, t, lang } = useApp()
  const [logs,    setLogs   ] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("he_moodlogs") ?? "[]")
    } catch { return [] }
  })
  const [tab, setTab] = useState("log") // "log" | "history"
 
  function handleSave(entry) {
    const updated = [entry, ...logs]
    setLogs(updated)
    try { localStorage.setItem("he_moodlogs", JSON.stringify(updated)) } catch {}
  }
 
  const todayLog = logs.find(l => l.dateKey === todayKey())
 
  return (
    <ScreenWrapper>
      {/* Header */}
      <div className="fade-up" style={{
        background:tokens.creamSoft,
        padding:"16px 20px 14px",
        borderBottom:`1px solid ${tokens.borderLt}`,
        flexShrink:0,
      }}>
        <div style={{ fontFamily:"'Playfair Display',serif",
          fontSize:22, color:tokens.cocoa, marginBottom:2 }}>
          {t("mood.title")}
        </div>
        <div style={{ fontSize:12, color:tokens.stone }}>
          {currentPhase.emoji} {currentPhase.label} · วันที่ {user.cycleDay}
        </div>
      </div>
 
      {/* Tab switcher */}
      <div style={{ display:"flex", padding:"10px 16px 0",
        gap:8, flexShrink:0 }}>
        {[
          { id:"log",     label: t("mood.tab_log") },
          { id:"history", label: t("mood.tab_history") },
        ].map(tab => (
          <button key={tab.id} onClick={() => setTab(tab.id)} style={{
            flex:1, padding:"8px",
            border:`1px solid ${tokens.border}`,
            borderRadius:10,
            background: tab===tab.id ? tokens.cocoa : tokens.cream,
            color: tab===tab.id ? tokens.cream : tokens.stone,
            fontSize:13, fontWeight:500, cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif",
          }}>{tab.label}</button>
        ))}
      </div>
 
      <div className="scroll-body" style={{ flex:1, paddingBottom:90 }}>
 
        {tab === "log" ? (
          <>
            {/* Today summary if already logged */}
            {todayLog && (
              <div className="fade-up" style={{
                margin:"12px 16px 0",
                background:tokens.sageLt,
                border:`1px solid rgba(126,148,132,.3)`,
                borderRadius:16, padding:"12px 14px",
              }}>
                <div style={{ fontSize:12, fontWeight:500, color:tokens.sageDk }}>
                  {t("mood.already_logged")}
                </div>
                <div style={{ fontSize:13, color:tokens.cocoaMid, marginTop:4 }}>
                  {MOODS.find(m=>m.id===todayLog.mood)?.emoji}{" "}
                  {MOODS.find(m=>m.id===todayLog.mood)?.label} ·{" "}
                  {ENERGY_LEVELS.find(e=>e.id===todayLog.energy)?.label}
                </div>
              </div>
            )}
            <LogForm onSave={handleSave} tokens={tokens} currentPhase={currentPhase} />
          </>
        ) : (
          <>
            <MoodChart logs={logs} tokens={tokens} />
            <div style={{ padding:"10px 16px 0" }}>
              {logs.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 0",
                  color:tokens.stone, fontSize:13 }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>😊</div>
                  {t("mood.no_history")}
                </div>
              ) : (
                logs.map((log, i) => (
                  <HistoryCard key={i} entry={log} tokens={tokens} />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </ScreenWrapper>
  )
}