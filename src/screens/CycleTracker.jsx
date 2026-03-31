
import { useState, useMemo } from "react"
import { useApp, ScreenWrapper } from "../App.jsx"

/* ═══════════════════════════════════════════════════
   CYCLE TRACKER SCREEN
   Layout:
   ┌─ Header ────────────────────────────────────────┐
   ├─ CurrentPhaseCard ──────────────────────────────┤
   │  phase · day count · countdown                  │
   ├─ MiniCalendar ──────────────────────────────────┤
   │  กดวันแรกของประจำเดือน                           │
   ├─ CycleHistory ──────────────────────────────────┤
   │  รอบที่ผ่านมา + ความยาวรอบ                       │
   ├─ PhaseTimeline ─────────────────────────────────┤
   │  วิซวลแสดง 4 เฟสของรอบนี้                        │
   └─────────────────────────────────────────────────┘
═══════════════════════════════════════════════════ */

/* ── Phase calculation from cycle day ── */
export function calcPhase(cycleDay, cycleLength = 28) {
  const d = ((cycleDay - 1) % cycleLength) + 1
  if (d <= 5)  return { key: "menstrual",   day: d,     daysLeft: 5  - d + 1 }
  if (d <= 13) return { key: "follicular",  day: d - 5, daysLeft: 13 - d + 1 }
  if (d <= 16) return { key: "ovulation",   day: d - 13,daysLeft: 16 - d + 1 }
  return              { key: "luteal",      day: d - 16,daysLeft: cycleLength - d + 1 }
}

/* ── Days since a date ── */
function daysSince(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  d.setHours(0,0,0,0); now.setHours(0,0,0,0)
  return Math.floor((now - d) / 86400000)
}

/* ── Format date to Thai ── */
function toThaiDate(dateStr) {
  const d = new Date(dateStr)
  const mo = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.",
              "ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."]
  return `${d.getDate()} ${mo[d.getMonth()]} ${d.getFullYear() + 543 - 2500 + 68}`
}

/* ── Calendar helpers ── */
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay()
}

const THAI_MONTHS = [
  "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
  "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",
]
const DAYS_SHORT = ["อา","จ","อ","พ","พฤ","ศ","ส"]

/* ═══════════════════════════════════════════════════
   CURRENT PHASE CARD
═══════════════════════════════════════════════════ */
function CurrentPhaseCard({ cycleDay, lastPeriodDate, cycleLength, PHASES, tokens }) {
  const phase = calcPhase(cycleDay, cycleLength)
  const p     = PHASES[phase.key]

  const nextPeriodDays = cycleLength - cycleDay + 1
  const ovulationDay   = Math.round(cycleLength / 2) - 2
  const daysToOvul     = ovulationDay - cycleDay

  return (
    <div className="fade-up" style={{
      margin: "14px 16px 0",
      background: p.color,
      borderRadius: 22,
      padding: "18px 20px 16px",
      color: "white",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position:"absolute", top:-50, right:-40, width:150, height:150, borderRadius:"50%", background:"rgba(255,255,255,.08)", pointerEvents:"none" }} />

      <div style={{ fontSize:10, letterSpacing:".1em", textTransform:"uppercase", opacity:.8, marginBottom:4 }}>
        เฟสปัจจุบัน
      </div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:5 }}>
        {p.emoji} {p.label}
      </div>
      <div style={{ fontSize:12, opacity:.85, lineHeight:1.55, marginBottom:12 }}>
        วันที่ {cycleDay} ของรอบ · อีก {phase.daysLeft} วันเปลี่ยนเฟส
      </div>

      {/* Stats row */}
      <div style={{
        display:"flex", gap:0,
        paddingTop:12,
        borderTop:"1px solid rgba(255,255,255,.2)",
      }}>
        <div style={{ flex:1, textAlign:"center" }}>
          <div style={{ fontSize:20, fontWeight:500 }}>{phase.daysLeft}</div>
          <div style={{ fontSize:9, opacity:.75, marginTop:2 }}>วันในเฟสนี้</div>
        </div>
        <div style={{ flex:1, textAlign:"center", borderLeft:"1px solid rgba(255,255,255,.2)" }}>
          <div style={{ fontSize:20, fontWeight:500 }}>{Math.max(0, daysToOvul)}</div>
          <div style={{ fontSize:9, opacity:.75, marginTop:2 }}>วันถึง Ovulation</div>
        </div>
        <div style={{ flex:1, textAlign:"center", borderLeft:"1px solid rgba(255,255,255,.2)" }}>
          <div style={{ fontSize:20, fontWeight:500 }}>{nextPeriodDays}</div>
          <div style={{ fontSize:9, opacity:.75, marginTop:2 }}>วันถึงรอบหน้า</div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   PHASE TIMELINE BAR
═══════════════════════════════════════════════════ */
function PhaseTimeline({ cycleDay, cycleLength, PHASES, tokens }) {
  const phases = [
    { key:"menstrual",  flex:5  },
    { key:"follicular", flex:8  },
    { key:"ovulation",  flex:3  },
    { key:"luteal",     flex:cycleLength - 16 },
  ]
  /* position of current day marker */
  const markerPct = ((cycleDay - 1) / cycleLength) * 100

  return (
    <div className="fade-up" style={{
      margin:"10px 16px 0",
      background:tokens.creamSoft,
      border:`1px solid ${tokens.borderLt}`,
      borderRadius:22,
      padding:"14px 16px",
    }}>
      <div style={{ fontSize:12, fontWeight:500, color:tokens.cocoa, marginBottom:10 }}>
        Timeline รอบนี้
      </div>

      {/* Bar */}
      <div style={{ position:"relative", marginBottom:8 }}>
        <div style={{ display:"flex", height:12, borderRadius:6, overflow:"hidden", gap:2 }}>
          {phases.map(ph => (
            <div key={ph.key} style={{
              flex: ph.flex,
              background: PHASES[ph.key].color,
              opacity: .75,
            }} />
          ))}
        </div>
        {/* Day marker */}
        <div style={{
          position:"absolute",
          left:`${markerPct}%`,
          top:-3,
          transform:"translateX(-50%)",
          width:4, height:18,
          background:tokens.cocoa,
          borderRadius:2,
          boxShadow:`0 0 0 2px ${tokens.creamSoft}`,
        }} />
      </div>

      {/* Phase labels */}
      <div style={{ display:"flex", gap:2 }}>
        {phases.map(ph => (
          <div key={ph.key} style={{
            flex: ph.flex,
            textAlign:"center",
            fontSize:8,
            color:tokens.stone,
            lineHeight:1.3,
          }}>
            {PHASES[ph.key].emoji}
          </div>
        ))}
      </div>

      {/* Day numbers */}
      <div style={{
        display:"flex", justifyContent:"space-between",
        fontSize:8, color:tokens.stone, marginTop:4,
      }}>
        <span>วัน 1</span>
        <span>วัน {Math.round(cycleLength/4)}</span>
        <span>วัน {Math.round(cycleLength/2)}</span>
        <span>วัน {cycleLength}</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MINI CALENDAR
═══════════════════════════════════════════════════ */
function MiniCalendar({ selectedDate, onSelect, cycleStartDate, cycleLength, tokens }) {
  const today = new Date()
  const [viewYear,  setViewYear ] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const daysInMonth  = getDaysInMonth(viewYear, viewMonth)
  const firstDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth)
  const cells = Array(firstDayOfWeek).fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  /* Determine phase color for each day */
  function getDayStyle(day) {
    if (!day) return {}
    const date = new Date(viewYear, viewMonth, day)
    date.setHours(0,0,0,0)
    const todayDate = new Date(); todayDate.setHours(0,0,0,0)
    const selDate   = selectedDate ? new Date(selectedDate) : null
    if (selDate) selDate.setHours(0,0,0,0)

    const isToday    = date.getTime() === todayDate.getTime()
    const isSelected = selDate && date.getTime() === selDate.getTime()
    const isFuture   = date > todayDate

    let phaseBg = "transparent"
    if (cycleStartDate && !isFuture) {
      const start = new Date(cycleStartDate); start.setHours(0,0,0,0)
      const diff  = Math.floor((date - start) / 86400000)
      if (diff >= 0) {
        const cd = (diff % cycleLength) + 1
        const ph = calcPhase(cd, cycleLength)
        const PHASE_COLORS = {
          menstrual:"#9EB0C4", follicular:"#A8C4A0",
          ovulation:"#C4899A", luteal:"#C4A882",
        }
        phaseBg = PHASE_COLORS[ph.key] + "35"
      }
    }

    return { isToday, isSelected, phaseBg, isFuture }
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    const todayM = today.getMonth(); const todayY = today.getFullYear()
    if (viewYear > todayY || (viewYear === todayY && viewMonth >= todayM)) return
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="fade-up" style={{
      margin:"10px 16px 0",
      background:tokens.creamSoft,
      border:`1px solid ${tokens.borderLt}`,
      borderRadius:22,
      padding:"14px 16px",
    }}>
      <div style={{ fontSize:12, fontWeight:500, color:tokens.cocoa, marginBottom:2 }}>
        บันทึกวันแรกของรอบ
      </div>
      <div style={{ fontSize:11, color:tokens.stone, marginBottom:12 }}>
        กดวันที่ประจำเดือนมาวันแรก
      </div>

      {/* Month nav */}
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        marginBottom:10,
      }}>
        <button onClick={prevMonth} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:tokens.stone, padding:"4px 8px" }}>‹</button>
        <span style={{ fontSize:13, fontWeight:500, color:tokens.cocoa }}>
          {THAI_MONTHS[viewMonth]} {viewYear + 543}
        </span>
        <button onClick={nextMonth} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:tokens.stone, padding:"4px 8px" }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:4 }}>
        {DAYS_SHORT.map(d => (
          <div key={d} style={{ textAlign:"center", fontSize:9, color:tokens.stone, padding:"2px 0" }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const { isToday, isSelected, phaseBg, isFuture } = getDayStyle(day)
          return (
            <div
              key={day}
              onClick={() => !isFuture && onSelect(`${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`)}
              style={{
                aspectRatio:"1",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11,
                borderRadius:8,
                cursor: isFuture ? "default" : "pointer",
                fontWeight: isToday ? 500 : 400,
                background: isSelected ? tokens.ovulation
                          : phaseBg,
                color: isSelected ? "white"
                     : isFuture   ? tokens.stoneLt
                     : isToday    ? tokens.cocoa
                     : tokens.cocoaMid,
                border: isToday && !isSelected ? `1.5px solid ${tokens.stone}` : "none",
                transition:"background .15s",
                opacity: isFuture ? .4 : 1,
              }}
            >
              {day}
            </div>
          )
        })}
      </div>

      {/* Selected date display */}
      {selectedDate && (
        <div style={{
          marginTop:12, padding:"9px 12px",
          background:tokens.ovulationLt,
          borderRadius:10,
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <span style={{ fontSize:12, color:"#8B4050" }}>
            📅 วันแรกที่เลือก
          </span>
          <span style={{ fontSize:12, fontWeight:500, color:"#8B4050" }}>
            {toThaiDate(selectedDate)}
          </span>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CYCLE HISTORY LIST
═══════════════════════════════════════════════════ */
function CycleHistory({ cycles, tokens }) {
  if (cycles.length === 0) return null

  const avgLength = cycles.length > 1
    ? Math.round(cycles.slice(0,-1).reduce((s,c) => s + c.length, 0) / (cycles.length - 1))
    : null

  return (
    <div className="fade-up" style={{
      margin:"10px 16px 0",
      background:tokens.creamSoft,
      border:`1px solid ${tokens.borderLt}`,
      borderRadius:22,
      padding:"14px 16px",
    }}>
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        marginBottom:10,
      }}>
        <span style={{ fontSize:12, fontWeight:500, color:tokens.cocoa }}>ประวัติรอบ</span>
        {avgLength && (
          <span style={{
            fontSize:11, fontWeight:500,
            padding:"3px 10px",
            background:tokens.sageLt,
            color:tokens.sageDk,
            borderRadius:999,
          }}>
            เฉลี่ย {avgLength} วัน/รอบ
          </span>
        )}
      </div>

      {cycles.map((c, i) => (
        <div key={i} style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"9px 0",
          borderBottom: i < cycles.length - 1 ? `1px solid ${tokens.borderLt}` : "none",
        }}>
          <div>
            <div style={{ fontSize:12, fontWeight:500, color:tokens.cocoa }}>
              รอบที่ {cycles.length - i}
            </div>
            <div style={{ fontSize:10, color:tokens.stone, marginTop:2 }}>
              เริ่ม {toThaiDate(c.startDate)}
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            {c.length && (
              <div style={{
                fontSize:13, fontWeight:500,
                color: c.length >= 21 && c.length <= 35 ? tokens.sageDk : "#8B4050",
              }}>
                {c.length} วัน
              </div>
            )}
            <div style={{ fontSize:10, color:tokens.stone, marginTop:2 }}>
              {c.length >= 21 && c.length <= 35 ? "ปกติ" : "ผิดปกติ"}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   LOG BUTTON
═══════════════════════════════════════════════════ */
function LogButton({ selectedDate, onLog, tokens }) {
  if (!selectedDate) return null
  return (
    <div style={{ padding:"10px 16px 0" }}>
      <button
        onClick={onLog}
        style={{
          width:"100%", padding:"14px",
          background:tokens.cocoa, color:tokens.cream,
          border:"none", borderRadius:16,
          fontSize:14, fontWeight:500,
          fontFamily:"'DM Sans',sans-serif",
          cursor:"pointer",
          transition:"opacity .2s",
        }}
        onMouseDown={e => e.currentTarget.style.opacity=".8"}
        onMouseUp={e   => e.currentTarget.style.opacity="1"}
      >
        บันทึกวันแรกของรอบ →
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CYCLE TRACKER — main export
═══════════════════════════════════════════════════ */
export default function CycleTracker() {
  const { user, setUser, PHASES, tokens, showToast } = useApp()

  const [selectedDate, setSelectedDate] = useState("")
  const [cycles,       setCycles      ] = useState(() => {
    /* seed with one past cycle for demo */
    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() - (user.cycleDay - 1))
    return [{
      startDate: start.toISOString().split("T")[0],
      length:    null,
    }]
  })

  const currentCycle   = cycles[0]
  const currentCycleDay = useMemo(() => {
    if (!currentCycle) return 1
    return Math.min(user.cycleLength ?? 28, daysSince(currentCycle.startDate) + 1)
  }, [currentCycle, user.cycleLength])

  const cycleLength = user.cycleLength ?? 28

  function handleLogCycle() {
    if (!selectedDate) return
    const newCycleDay = 1

    /* close out previous cycle */
    const prev = cycles[0]
    let updatedCycles = [...cycles]
    if (prev && !prev.length) {
      const prevStart = new Date(prev.startDate)
      const newStart  = new Date(selectedDate)
      const len = Math.floor((newStart - prevStart) / 86400000)
      if (len > 0 && len <= 60) {
        updatedCycles[0] = { ...prev, length: len }
      }
    }

    updatedCycles = [{ startDate: selectedDate, length: null }, ...updatedCycles]
    setCycles(updatedCycles)

    /* update global user phase */
    const newPhase = calcPhase(newCycleDay, cycleLength)
    setUser(u => ({
      ...u,
      cycleDay:     newCycleDay,
      currentPhase: newPhase.key,
    }))

    setSelectedDate("")
    showToast("บันทึกรอบเดือนแล้ว ✓")
  }

  return (
    <ScreenWrapper>
      {/* Header */}
      <div className="fade-up" style={{
        background:tokens.creamSoft,
        padding:"16px 20px 14px",
        borderBottom:`1px solid ${tokens.borderLt}`,
        flexShrink:0,
      }}>
        <div style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:22, color:tokens.cocoa, marginBottom:2,
        }}>
          รอบเดือน
        </div>
        <div style={{ fontSize:12, color:tokens.stone }}>
          ติดตามรอบและคำนวณเฟสฮอร์โมนอัตโนมัติ
        </div>
      </div>

      <div className="scroll-body" style={{ flex:1, paddingBottom:90 }}>
        <CurrentPhaseCard
          cycleDay={currentCycleDay}
          lastPeriodDate={currentCycle?.startDate}
          cycleLength={cycleLength}
          PHASES={PHASES}
          tokens={tokens}
        />

        <PhaseTimeline
          cycleDay={currentCycleDay}
          cycleLength={cycleLength}
          PHASES={PHASES}
          tokens={tokens}
        />

        <MiniCalendar
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
          cycleStartDate={currentCycle?.startDate}
          cycleLength={cycleLength}
          tokens={tokens}
        />

        <LogButton
          selectedDate={selectedDate}
          onLog={handleLogCycle}
          tokens={tokens}
        />

        <CycleHistory cycles={cycles} tokens={tokens} />

        {/* Cycle length adjuster */}
        <div className="fade-up" style={{
          margin:"10px 16px 0",
          background:tokens.creamSoft,
          border:`1px solid ${tokens.borderLt}`,
          borderRadius:22, padding:"14px 16px",
        }}>
          <div style={{ fontSize:12, fontWeight:500, color:tokens.cocoa, marginBottom:10 }}>
            ความยาวรอบเฉลี่ย
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <input
              type="range" min={21} max={40} step={1}
              value={cycleLength}
              onChange={e => setUser(u => ({ ...u, cycleLength: Number(e.target.value) }))}
              style={{ flex:1 }}
            />
            <span style={{
              fontSize:16, fontWeight:500, color:tokens.cocoa,
              minWidth:48, textAlign:"center",
            }}>
              {cycleLength} วัน
            </span>
          </div>
          <div style={{ fontSize:11, color:tokens.stone, marginTop:6 }}>
            รอบปกติ 21–35 วัน · เฉลี่ยทั่วไป 28 วัน
          </div>
        </div>

        <div style={{ height:16 }} />
      </div>
    </ScreenWrapper>
  )
}