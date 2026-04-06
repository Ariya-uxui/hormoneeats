import { useState, useMemo } from "react"
import { useApp, ScreenWrapper } from "../App"
 
/* ═══════════════════════════════════════════════════
   WEIGHT SCREEN
   Layout (from wireframe):
   ┌─ Header ────────────────────────────────────────┐
   │  title · goal                                    │
   ├─ HeroBlock ─────────────────────────────────────┤
   │  current weight (large) · goal · remain · weeks  │
   ├─ ChartBlock ────────────────────────────────────┤
   │  SVG line chart · goal line                      │
   ├─ LogBlock ──────────────────────────────────────┤
   │  input + button · history list                   │
   └─────────────────────────────────────────────────┘
═══════════════════════════════════════════════════ */
 
/* ═══════════════════════════════════════════════════
   HERO BLOCK — big weight display
═══════════════════════════════════════════════════ */
function WeightHero({ weight, goalWeight }) {
  const { tokens, t, lang } = useApp()
  const remaining = Math.max(0, weight - goalWeight)
  const weeksLeft  = remaining > 0 ? Math.ceil(remaining / 0.3) : 0
  const lostTotal  = parseFloat((55.2 - weight).toFixed(1))
 
  const cols = [
    { val: goalWeight.toFixed(1), lbl: t("weight.goal") },
    { val: remaining.toFixed(1),  lbl: lang==="en" ? "Remaining (kg)" : "เหลืออีก (กก.)" },
    { val: weeksLeft || "—",      lbl: lang==="en" ? "Est. weeks" : "สัปดาห์โดยประมาณ" },
  ]
 
  return (
    <div style={{
      margin: "14px 16px 0",
      background: tokens.sageDk,
      borderRadius: 22,
      padding: "22px 20px 18px",
      color: "white",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative circles */}
      <div style={{ position:"absolute", top:-55, right:-55, width:170, height:170, borderRadius:"50%", background:"rgba(255,255,255,.08)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-35, left:-20, width:110, height:110, borderRadius:"50%", background:"rgba(255,255,255,.05)", pointerEvents:"none" }} />
 
      <div style={{ fontSize:10, letterSpacing:".1em", textTransform:"uppercase", opacity:.7, marginBottom:4, position:"relative" }}>
        {t("weight.current")}
      </div>
      <div style={{
        fontFamily:"'Playfair Display', serif",
        fontSize: 56, fontWeight:400, lineHeight:1,
        marginBottom:3, position:"relative",
      }}>
        {weight.toFixed(1)}
      </div>
      <div style={{ fontSize:14, opacity:.75 }}>กิโลกรัม</div>
 
      {/* Lost badge */}
      {lostTotal > 0 && (
        <div style={{
          display:"inline-flex", alignItems:"center", gap:4,
          marginTop:10,
          background:"rgba(255,255,255,.18)",
          borderRadius:999,
          padding:"4px 12px",
          fontSize:11, fontWeight:500,
        }}>
          lang==="en" ? `↓ Lost ${lostTotal.toFixed(1)} kg` : `↓ ลดไปแล้ว ${lostTotal.toFixed(1)} กก.`
        </div>
      )}
 
      {/* Stats row */}
      <div style={{
        display:"flex", marginTop:16,
        paddingTop:14,
        borderTop:"1px solid rgba(255,255,255,.18)",
      }}>
        {cols.map((c, i) => (
          <div key={i} style={{
            flex:1, textAlign:"center",
            borderLeft: i > 0 ? "1px solid rgba(255,255,255,.15)" : "none",
          }}>
            <div style={{ fontSize:20, fontWeight:500 }}>{c.val}</div>
            <div style={{ fontSize:10, opacity:.7, marginTop:3, lineHeight:1.4 }}>{c.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   SVG LINE CHART
═══════════════════════════════════════════════════ */
function WeightChart({ history, goalWeight }) {
  const { tokens } = useApp()
 
  /* Build chart points from last 6 entries */
  const points = useMemo(() => {
    const entries = [...history].reverse().slice(-6)
    if (entries.length < 2) return null
 
    const values = entries.map(e => e.value)
    const minV = Math.min(...values, goalWeight) - 0.5
    const maxV = Math.max(...values) + 0.5
    const W = 300, H = 100
    const pad = { l: 8, r: 8, t: 8, b: 22 }
    const innerW = W - pad.l - pad.r
    const innerH = H - pad.t - pad.b
 
    const toX = i  => pad.l + (i / (entries.length - 1)) * innerW
    const toY = v  => pad.t + innerH - ((v - minV) / (maxV - minV)) * innerH
    const goalY   = toY(goalWeight)
 
    const pts = entries.map((e, i) => ({ x: toX(i), y: toY(e.value), entry: e }))
    const pathD = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `C${pts[i-1].x+20},${pts[i-1].y} ${p.x-20},${p.y} ${p.x},${p.y}`)).join(" ")
    const areaD = pathD + ` L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`
 
    return { pts, pathD, areaD, goalY, W, H }
  }, [history, goalWeight])
 
  if (!points) return null
  const { pts, pathD, areaD, goalY, W, H } = points
 
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width:"100%", display:"block", overflow:"visible" }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={tokens.sage} stopOpacity=".25"/>
          <stop offset="100%" stopColor={tokens.sage} stopOpacity="0"/>
        </linearGradient>
      </defs>
 
      {/* Grid lines */}
      {[25, 50, 75].map(y => (
        <line key={y} x1="8" y1={y} x2={W-8} y2={y}
          stroke={tokens.border} strokeWidth=".8"/>
      ))}
 
      {/* Goal line */}
      <line x1="8" y1={goalY} x2={W-8} y2={goalY}
        stroke={tokens.gold} strokeWidth="1.2" strokeDasharray="5 4"/>
      <text x="10" y={goalY - 3}
        fontSize="8" fill={tokens.gold} fontFamily="DM Sans">
        {lang==="en" ? "Goal" : "เป้า"} {goalWeight}
      </text>
 
      {/* Area fill */}
      <path d={areaD} fill="url(#wGrad)"/>
 
      {/* Line */}
      <path d={pathD} fill="none"
        stroke={tokens.sage} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
 
      {/* Dots */}
      {pts.map((p, i) => (
        <g key={i}>
          {i === pts.length - 1
            ? <circle cx={p.x} cy={p.y} r="5" fill="white" stroke={tokens.sage} strokeWidth="2.5"/>
            : <circle cx={p.x} cy={p.y} r="3.5" fill={tokens.sage}/>
          }
          {/* Label for first and last */}
          {(i === 0 || i === pts.length - 1) && (
            <text
              x={p.x} y={i === pts.length - 1 ? p.y - 9 : p.y - 9}
              fontSize="8" fill={tokens.sageDk}
              textAnchor={i === pts.length - 1 ? "end" : "start"}
              fontFamily="DM Sans"
            >
              {p.entry.value.toFixed(1)}
            </text>
          )}
          {/* X-axis label */}
          <text
            x={p.x} y={H - 3}
            fontSize="8" fill={tokens.stone}
            textAnchor="middle" fontFamily="DM Sans"
          >
            {p.entry.date.split(" ").slice(0,2).join(" ")}
          </text>
        </g>
      ))}
    </svg>
  )
}
 
/* ═══════════════════════════════════════════════════
   CHART BLOCK
═══════════════════════════════════════════════════ */
function ChartBlock({ history, goalWeight }) {
  const { tokens, lang } = useApp()
  return (
    <div className="fade-up" style={{
      margin: "10px 16px 0",
      background: tokens.creamSoft,
      border: `1px solid ${tokens.borderLt}`,
      borderRadius: 22, padding: 16,
    }}>
      <div style={{ fontSize:13, fontWeight:500, color:tokens.cocoa, marginBottom:14 }}>
        {lang==="en" ? "Weight Chart" : "กราฟน้ำหนัก"}
      </div>
      <WeightChart history={history} goalWeight={goalWeight} />
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   WEEKLY PROGRESS PILL
═══════════════════════════════════════════════════ */
function WeeklyProgress({ history }) {
  const { tokens, lang, t } = useApp()
 
  /* Compare latest vs 7 entries ago */
  const latest = history[0]?.value
  const week   = history.slice(0, Math.min(history.length, 5))
  const oldest = week[week.length - 1]?.value
  if (!latest || !oldest || latest === oldest) return null
 
  const diff = parseFloat((oldest - latest).toFixed(1))
  const isGood = diff >= 0
 
  return (
    <div style={{
      margin: "10px 16px 0",
      display: "flex", gap: 8,
    }}>
      <div style={{
        flex:1, padding:"10px 14px",
        background: isGood ? tokens.sageLt : tokens.roseLt,
        borderRadius:14,
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <span style={{ fontSize:12, color: isGood ? tokens.sageDk : "#8B4050" }}>
          lang==="en" ? `vs last ${week.length} entries` : `เทียบกับ ${week.length} รายการก่อน`
        </span>
        <span style={{
          fontSize:14, fontWeight:500,
          color: isGood ? tokens.sageDk : "#8B4050",
        }}>
          {isGood ? "↓ " : "↑ "}{Math.abs(diff).toFixed(1)} {t("common.kg")}
        </span>
      </div>
      <div style={{
        padding:"10px 14px",
        background: tokens.goldLt,
        borderRadius:14,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        minWidth:72,
      }}>
        <div style={{ fontSize:14, fontWeight:500, color:"#7A5030" }}>
          {(diff / (week.length) * 4).toFixed(1)}
        </div>
        <div style={{ fontSize:9, color:"#7A5030", marginTop:2, textAlign:"center", lineHeight:1.3 }}>
          {lang==="en" ? "kg/mo" : "กก./เดือน"}
        </div>
      </div>
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   LOG INPUT BLOCK
═══════════════════════════════════════════════════ */
function LogBlock({ history, onLog }) {
  const { tokens, t, lang } = useApp()
  const [inputVal, setInputVal] = useState("")
  const [error, setError]       = useState("")
 
  function handleLog() {
    const v = parseFloat(inputVal)
    if (isNaN(v) || v < 20 || v > 300) {
     setError(lang==="en" ? "Please enter a valid weight (20–300 kg)" : "กรุณากรอกน้ำหนักที่ถูกต้อง (20–300 กก.)")
      return
    }
    setError("")
    setInputVal("")
    onLog(v)
  }
 
  return (
    <div className="fade-up" style={{
      margin: "10px 16px 0",
      background: tokens.creamSoft,
      border: `1px solid ${tokens.borderLt}`,
      borderRadius: 22, padding: 16,
    }}>
      <div style={{ fontSize:13, fontWeight:500, color:tokens.cocoa, marginBottom:10 }}>
        {t("weight.log")}
      </div>
 
      {/* Input row */}
      <div style={{ display:"flex", gap:8, marginBottom: error ? 6 : 10 }}>
        <input
          type="number"
          step="0.1"
          min="20"
          max="300"
          value={inputVal}
          onChange={e => { setInputVal(e.target.value); setError("") }}
          onKeyDown={e => e.key === "Enter" && handleLog()}
          placeholder="54.0"
          style={{
            flex:1, padding:"11px 14px",
            border:`1px solid ${error ? "#E24B4A" : tokens.border}`,
            borderRadius:14,
            fontSize:15, fontFamily:"'DM Sans',sans-serif",
            color:tokens.cocoa, background:tokens.cream,
            outline:"none", transition:"border-color .2s",
          }}
          onFocus={e => e.target.style.borderColor = tokens.sage}
          onBlur={e  => e.target.style.borderColor = error ? "#E24B4A" : tokens.border}
        />
        <button
          onClick={handleLog}
          style={{
            background:tokens.sage, color:"white", border:"none",
            borderRadius:14, padding:"11px 18px",
            fontSize:13, fontWeight:500,
            fontFamily:"'DM Sans',sans-serif",
            cursor:"pointer", whiteSpace:"nowrap",
            transition:"opacity .2s",
          }}
          onMouseDown={e => e.currentTarget.style.opacity = ".8"}
          onMouseUp={e   => e.currentTarget.style.opacity = "1"}
        >
          {t("common.save")}
        </button>
      </div>
 
      {/* Error */}
      {error && (
        <div style={{ fontSize:11, color:"#E24B4A", marginBottom:8 }}>{error}</div>
      )}
 
      {/* History */}
      <div style={{ display:"flex", flexDirection:"column" }}>
        {history.slice(0, 6).map((h, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"center",
            justifyContent:"space-between",
            padding:"9px 0",
            borderBottom: i < Math.min(history.length, 6) - 1
              ? `1px solid ${tokens.borderLt}` : "none",
          }}>
            <span style={{ fontSize:12, color:tokens.stone }}>{h.date}</span>
            <span style={{ fontSize:14, fontWeight:500, color:tokens.cocoa }}>
              {h.value.toFixed(1)} {t("common.kg")}
            </span>
            {h.change === null
              ? <span style={{ fontSize:11, fontWeight:500, padding:"3px 9px", borderRadius:999, background:tokens.cream, color:tokens.stone }}>{lang==="en" ? "Start" : "เริ่มต้น"}</span>
              : <span style={{
                  fontSize:11, fontWeight:500,
                  padding:"3px 9px", borderRadius:999,
                  background: h.change <= 0 ? tokens.sageLt : tokens.roseLt,
                  color:      h.change <= 0 ? tokens.sageDk  : "#8B4050",
                }}>
                  {h.change > 0 ? "+" : ""}{h.change.toFixed(1)}
                </span>
            }
          </div>
        ))}
      </div>
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   WEIGHT SCREEN — main export
═══════════════════════════════════════════════════ */
export default function Weight() {
  const { user, weightHistory, logWeight, tokens, t, lang } = useApp()
 
  return (
    <ScreenWrapper>
      {/* Header */}
      <div className="fade-up" style={{
        background: tokens.creamSoft,
        padding: "16px 20px 14px",
        borderBottom: `1px solid ${tokens.borderLt}`,
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily:"'Playfair Display', serif",
          fontSize:22, color:tokens.cocoa, marginBottom:2,
        }}>
          {t("weight.title")}
        </div>
        <div style={{ fontSize:12, color:tokens.stone }}>
          {t("weight.goal")} {user.goalWeight.toFixed(0)} {t("common.kg")}
          · {lang==="en" ? "Ideal rate 0.3–0.5 kg/week" : "อัตราที่เหมาะ 0.3–0.5 กก./สัปดาห์"}
        </div>
      </div>
 
      <div className="scroll-body" style={{ flex:1, paddingBottom:90 }}>
        <WeightHero weight={user.weight} goalWeight={user.goalWeight} />
        <WeeklyProgress history={weightHistory} />
        <ChartBlock history={weightHistory} goalWeight={user.goalWeight} />
        <LogBlock history={weightHistory} onLog={logWeight} />
        <div style={{ height:16 }} />
      </div>
    </ScreenWrapper>
  )
}