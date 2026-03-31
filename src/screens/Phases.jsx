import { useState } from "react"
import { useApp, ScreenWrapper } from "../App"

/* ═══════════════════════════════════════════════════
   PHASES SCREEN
   Layout (from wireframe):
   ┌─ Header ────────────────────────────────────────┐
   │  title · subtitle                                │
   ├─ CycleTrack ────────────────────────────────────┤
   │  proportional bar · labels                       │
   ├─ PhaseCard × 4 ─────────────────────────────────┤
   │  icon · name · days · badge                      │
   │  description                                     │
   │  eat chips · avoid chips                         │
   │  calorie range                                   │
   └─────────────────────────────────────────────────┘
═══════════════════════════════════════════════════ */

const PHASE_ORDER = ["follicular", "ovulation", "luteal", "menstrual"]

/* ── Proportional days in a 28-day cycle ── */
const PHASE_FLEX = { follicular: 13, ovulation: 3, luteal: 11, menstrual: 5 }

/* ═══════════════════════════════════════════════════
   CYCLE TRACK BAR
═══════════════════════════════════════════════════ */
function CycleTrack({ phases, currentKey, onSelect }) {
  const { tokens } = useApp()
  return (
    <div className="fade-up" style={{
      margin: "14px 16px 0",
      background: tokens.creamSoft,
      border: `1px solid ${tokens.borderLt}`,
      borderRadius: 22,
      padding: "16px 16px 12px",
    }}>
      {/* Bar */}
      <div style={{
        display: "flex",
        borderRadius: 8,
        overflow: "hidden",
        height: 10,
        marginBottom: 10,
        gap: 2,
      }}>
        {PHASE_ORDER.map(key => (
          <div
            key={key}
            onClick={() => onSelect(key)}
            style={{
              flex: PHASE_FLEX[key],
              background: phases[key].color,
              cursor: "pointer",
              opacity: currentKey === key ? 1 : .55,
              transition: "opacity .2s",
              borderRadius: key === "follicular" ? "6px 0 0 6px"
                          : key === "menstrual"  ? "0 6px 6px 0"
                          : 0,
            }}
          />
        ))}
      </div>

      {/* Labels */}
      <div style={{ display: "flex", gap: 2 }}>
        {PHASE_ORDER.map(key => {
          const p = phases[key]
          const active = currentKey === key
          return (
            <div
              key={key}
              onClick={() => onSelect(key)}
              style={{
                flex: PHASE_FLEX[key],
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <div style={{
                fontSize: 9,
                fontWeight: active ? 500 : 400,
                color: active ? tokens.cocoa : tokens.stone,
                lineHeight: 1.4,
                transition: "color .2s",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {key === "ovulation" ? "Ovu" : p.label}
              </div>
              <div style={{
                fontSize: 8,
                color: active ? tokens.stone : tokens.stoneLt,
                transition: "color .2s",
              }}>
                {PHASE_FLEX[key]} วัน
              </div>
            </div>
          )
        })}
      </div>

      {/* Current phase summary line */}
      <div style={{
        marginTop: 10,
        paddingTop: 10,
        borderTop: `1px solid ${tokens.borderLt}`,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: phases[currentKey].color,
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 11, color: tokens.stone }}>
          คุณอยู่ในเฟส
        </span>
        <span style={{ fontSize: 12, fontWeight: 500, color: tokens.cocoa }}>
          {phases[currentKey].emoji} {phases[currentKey].label}
        </span>
        <span style={{
          marginLeft: "auto",
          fontSize: 10,
          color: tokens.stone,
        }}>
          {phases[currentKey].calRange} kcal
        </span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CHIP
═══════════════════════════════════════════════════ */
function Chip({ label, variant = "go" }) {
  const { tokens } = useApp()
  const styles = {
    go:  { bg: tokens.sageLt,  color: tokens.sageDk },
    no:  { bg: tokens.roseLt,  color: "#8B4050" },
  }
  const s = styles[variant]
  return (
    <span style={{
      fontSize: 11,
      padding: "4px 10px",
      borderRadius: 999,
      background: s.bg,
      color: s.color,
      fontWeight: 400,
      flexShrink: 0,
    }}>
      {label}
    </span>
  )
}

/* ═══════════════════════════════════════════════════
   HORMONE INSIGHT STRIP (inside card)
═══════════════════════════════════════════════════ */
const HORMONE_LEVELS = {
  follicular: [
    { name: "Estrogen",      pct: 45, color: "#D4537E" },
    { name: "Progesterone",  pct: 10, color: "#9FE1CB" },
    { name: "Cortisol",      pct: 35, color: "#EF9F27" },
    { name: "Insulin sens.", pct: 80, color: "#378ADD" },
  ],
  ovulation: [
    { name: "Estrogen",      pct: 95, color: "#D4537E" },
    { name: "Progesterone",  pct: 15, color: "#9FE1CB" },
    { name: "Cortisol",      pct: 40, color: "#EF9F27" },
    { name: "Insulin sens.", pct: 85, color: "#378ADD" },
  ],
  luteal: [
    { name: "Estrogen",      pct: 55, color: "#D4537E" },
    { name: "Progesterone",  pct: 85, color: "#9FE1CB" },
    { name: "Cortisol",      pct: 65, color: "#EF9F27" },
    { name: "Insulin sens.", pct: 45, color: "#378ADD" },
  ],
  menstrual: [
    { name: "Estrogen",      pct: 15, color: "#D4537E" },
    { name: "Progesterone",  pct: 10, color: "#9FE1CB" },
    { name: "Cortisol",      pct: 50, color: "#EF9F27" },
    { name: "Insulin sens.", pct: 60, color: "#378ADD" },
  ],
}

function HormoneBars({ phaseKey }) {
  const { tokens } = useApp()
  const bars = HORMONE_LEVELS[phaseKey] ?? []
  return (
    <div style={{
      marginTop: 10,
      padding: "10px 12px",
      background: tokens.cream,
      borderRadius: 12,
      display: "flex",
      flexDirection: "column",
      gap: 7,
    }}>
      {bars.map(b => (
        <div key={b.name}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: 10, marginBottom: 4,
          }}>
            <span style={{ color: tokens.cocoaMid }}>{b.name}</span>
            <span style={{ color: b.color, fontWeight: 500 }}>
              {b.pct < 30 ? "ต่ำ" : b.pct < 60 ? "ปกติ" : b.pct < 80 ? "สูง" : "สูงมาก"}
            </span>
          </div>
          <div style={{
            height: 4, background: tokens.border,
            borderRadius: 2, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: `${b.pct}%`,
              background: b.color,
              borderRadius: 2,
              transition: "width .6s ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   EXERCISE TIPS (collapsed section inside card)
═══════════════════════════════════════════════════ */
const EXERCISE_TIPS = {
  follicular: "HIIT · Weight training · ออกกำลังกายหนักได้เต็มที่ กล้ามเนื้อสร้างได้เร็วที่สุด",
  ovulation:  "Strength training · CrossFit · ช่วง peak พลังงาน ทำ personal best ได้",
  luteal:     "Yoga · Pilates · เดินเร็ว · ลดความหนักลง ร่างกายฟื้นตัวช้ากว่าปกติ",
  menstrual:  "เดินเบาๆ · Stretching · นอนพักให้เพียงพอ หลีกเลี่ยง high-impact",
}

/* ═══════════════════════════════════════════════════
   PHASE CARD
═══════════════════════════════════════════════════ */
function PhaseCard({ phase, isCurrent, isExpanded, onToggle }) {
  const { tokens } = useApp()

  return (
    <div
      className="fade-up"
      style={{
        background: tokens.creamSoft,
        border: `${isCurrent ? 2 : 1}px solid ${isCurrent ? tokens.lavender : tokens.borderLt}`,
        borderRadius: 22,
        padding: "15px 16px",
        cursor: "pointer",
        transition: "border-color .2s, box-shadow .2s",
        boxShadow: isExpanded ? `0 4px 20px rgba(61,46,42,.06)` : "none",
      }}
      onClick={onToggle}
    >
      {/* ── Card header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        {/* Phase icon */}
        <div style={{
          width: 44, height: 44,
          borderRadius: 14,
          background: phase.colorLt,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 21, flexShrink: 0,
        }}>
          {phase.emoji}
        </div>

        {/* Name + days */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: tokens.cocoa }}>
              {phase.label}
            </span>
            {isCurrent && (
              <span style={{
                fontSize: 10, fontWeight: 500,
                color: tokens.lavenderDk,
                background: tokens.lavenderLt,
                padding: "2px 8px",
                borderRadius: 999,
              }}>
                คุณอยู่ที่นี่
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: tokens.stone, marginTop: 2 }}>
            {phase.days}{phase.sub ? ` · ${phase.sub}` : ""}
          </div>
        </div>

        {/* Badge */}
        <span style={{
          fontSize: 10, fontWeight: 500,
          padding: "4px 10px",
          borderRadius: 999,
          background: phase.colorLt,
          color: phase.textClr,
          flexShrink: 0,
        }}>
          {phase.badge}
        </span>

        {/* Expand chevron */}
        <div style={{
          fontSize: 12,
          color: tokens.stone,
          transition: "transform .25s",
          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          flexShrink: 0,
          marginLeft: 4,
          userSelect: "none",
        }}>
          ▾
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ fontSize: 12, color: tokens.cocoaMid, lineHeight: 1.65, marginBottom: 10 }}>
        {phase.desc}
      </div>

      {/* ── Food chips ── */}
      <div style={{ marginBottom: 6 }}>
        <div style={{
          fontSize: 10, color: tokens.stone,
          letterSpacing: ".04em", marginBottom: 6,
        }}>
          กินได้ดี
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {phase.eat.map(f => <Chip key={f} label={f} variant="go" />)}
        </div>
      </div>
      <div>
        <div style={{
          fontSize: 10, color: tokens.stone,
          letterSpacing: ".04em", marginBottom: 6,
        }}>
          ควรเลี่ยง
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {phase.avoid.map(f => <Chip key={f} label={f} variant="no" />)}
        </div>
      </div>

      {/* ── Expanded section ── */}
      {isExpanded && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            marginTop: 14,
            borderTop: `1px solid ${tokens.borderLt}`,
            paddingTop: 14,
            animation: "fadeUp .3s ease both",
          }}
        >
          {/* Hormone bars */}
          <div style={{
            fontSize: 11, fontWeight: 500,
            color: tokens.cocoa, marginBottom: 6,
          }}>
            ระดับฮอร์โมน
          </div>
          <HormoneBars phaseKey={phase.key} />

          {/* Calorie range */}
          <div style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 12px",
            background: tokens.cream,
            borderRadius: 12,
          }}>
            <span style={{ fontSize: 12, color: tokens.stone }}>แคลอรี่แนะนำ</span>
            <span style={{
              fontSize: 13, fontWeight: 500,
              color: tokens.cocoa,
            }}>
              {phase.calRange} kcal
            </span>
          </div>

          {/* Exercise tips */}
          <div style={{
            marginTop: 8,
            padding: "10px 12px",
            background: phase.colorLt,
            borderRadius: 12,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 500,
              color: phase.textClr,
              letterSpacing: ".04em",
              marginBottom: 4,
              textTransform: "uppercase",
            }}>
              การออกกำลังกาย
            </div>
            <div style={{ fontSize: 12, color: phase.textClr, lineHeight: 1.6 }}>
              {EXERCISE_TIPS[phase.key]}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SCREEN HEADER
═══════════════════════════════════════════════════ */
function PhasesHeader() {
  const { tokens } = useApp()
  return (
    <div className="fade-up" style={{
      background: tokens.creamSoft,
      padding: "16px 20px 14px",
      borderBottom: `1px solid ${tokens.borderLt}`,
      flexShrink: 0,
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 22, color: tokens.cocoa, marginBottom: 3,
      }}>
        รอบฮอร์โมน
      </div>
      <div style={{ fontSize: 12, color: tokens.stone }}>
        กดแต่ละเฟสเพื่อดูรายละเอียดและคำแนะนำ
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   PHASES SCREEN — main export
═══════════════════════════════════════════════════ */
export default function Phases() {
  const { user, PHASES, tokens } = useApp()

  /* which card is expanded — allow only one at a time */
  const [expanded, setExpanded] = useState(user.currentPhase)

  /* active phase in cycle bar (can differ from user's current) */
  const [activeBar, setActiveBar] = useState(user.currentPhase)

  function handleBarSelect(key) {
    setActiveBar(key)
    setExpanded(key)
    /* scroll to the card — basic approach */
    setTimeout(() => {
      const el = document.getElementById(`phase-card-${key}`)
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, 50)
  }

  function handleCardToggle(key) {
    setExpanded(prev => prev === key ? null : key)
  }

  return (
    <ScreenWrapper>
      <PhasesHeader />

      <div className="scroll-body" style={{ flex: 1, paddingBottom: 90 }}>

        {/* Cycle proportional bar */}
        <CycleTrack
          phases={PHASES}
          currentKey={activeBar}
          onSelect={handleBarSelect}
        />

        {/* Phase cards */}
        <div style={{ padding: "10px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {PHASE_ORDER.map(key => (
            <div key={key} id={`phase-card-${key}`}>
              <PhaseCard
                phase={PHASES[key]}
                isCurrent={key === user.currentPhase}
                isExpanded={expanded === key}
                onToggle={() => handleCardToggle(key)}
              />
            </div>
          ))}
        </div>

        {/* Bottom tip */}
        <div style={{
          margin: "12px 16px 0",
          padding: "12px 14px",
          background: tokens.goldLt,
          borderRadius: 14,
          border: `1px solid rgba(196,168,130,.3)`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#7A5030", marginBottom: 4 }}>
            💡 เคล็ดลับ
          </div>
          <div style={{ fontSize: 12, color: "#7A5030", lineHeight: 1.65 }}>
            ติดตามรอบเดือนให้ตรง เพื่อให้ App แนะนำอาหารที่เหมาะกับเฟสของคุณได้แม่นยำที่สุด
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>
    </ScreenWrapper>
  )
}