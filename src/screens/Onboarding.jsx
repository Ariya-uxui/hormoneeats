import { useState } from "react"
import { useApp } from "../App"

/* ═══════════════════════════════════════════════════
   ONBOARDING SCREEN
   3 slides:
   Slide 1 — Hero intro (กินตามฮอร์โมน)
   Slide 2 — Phase cycle overview
   Slide 3 — Personalized profile intro
═══════════════════════════════════════════════════ */

const SLIDES = [
  {
    emoji:    "🌿",
    ringBg:   "#EDE8F5",
    title:    ["กินตาม", "ฮอร์โมน"],
    titleAccent: 1,
    desc:     "ร่างกายคุณมีจังหวะของมันเอง เรียนรู้กินให้สอดคล้อง เพื่อน้ำหนักสมดุลและสุขภาพดีจากข้างใน",
  },
  {
    emoji:    "🌸",
    ringBg:   "#F5EAF0",
    title:    ["4 เฟส", "ฮอร์โมน"],
    titleAccent: 0,
    desc:     "Follicular · Ovulation · Luteal · Menstrual แต่ละเฟสต้องการอาหารต่างกัน App จะแนะนำตามรอบของคุณ",
    phases: [
      { emoji:"🌱", label:"Follicular", color:"#A8C4A0" },
      { emoji:"✨", label:"Ovulation",  color:"#C4899A" },
      { emoji:"🍂", label:"Luteal",     color:"#C4A882" },
      { emoji:"🌙", label:"Menstrual",  color:"#9EB0C4" },
    ],
  },
  {
    emoji:    "✨",
    ringBg:   "#EAF0EA",
    title:    ["ปรับตาม", "รูปร่างคุณ"],
    titleAccent: 1,
    desc:     "คำนวณจาก BMI, TDEE และเฟสฮอร์โมน แผนอาหารไทยที่เหมาะกับชีวิตจริง ไม่ต้องพึ่งอาหารเสริม",
    stats: [
      { val:"1,440", lbl:"kcal เป้าหมาย" },
      { val:"168",   lbl:"ซม. ส่วนสูง"   },
      { val:"BMI",   lbl:"19.1 · ปกติ"   },
    ],
  },
]

/* ═══════════════════════════════════════════════════
   FLOATING RING ART
═══════════════════════════════════════════════════ */
function FloatingRing({ emoji, bg }) {
  return (
    <div style={{
      width: 210, height: 210,
      borderRadius: "50%",
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
      animation: "floatY 4s ease-in-out infinite",
    }}>
      {/* Outer rings */}
      <div style={{
        position:"absolute", inset:-18, borderRadius:"50%",
        border:"1.5px dashed #D4B8C0",
        animation:"spinCW 16s linear infinite",
        pointerEvents:"none",
      }} />
      <div style={{
        position:"absolute", inset:-34, borderRadius:"50%",
        border:"1px dashed #E4E0DA",
        animation:"spinCCW 24s linear infinite",
        pointerEvents:"none",
      }} />
      <span style={{ fontSize: 88, filter:"drop-shadow(0 6px 18px rgba(187,168,196,.3))" }}>
        {emoji}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SLIDE CONTENT
═══════════════════════════════════════════════════ */
function SlideContent({ slide, tokens }) {
  return (
    <div style={{
      display:"flex", flexDirection:"column",
      alignItems:"center", gap:24,
      flex:1, paddingTop:12,
    }}>
      <FloatingRing emoji={slide.emoji} bg={slide.ringBg} />

      {/* Title */}
      <h1 style={{
        fontFamily:"'Playfair Display', serif",
        fontSize: 34, color:tokens.cocoa,
        lineHeight:1.2, textAlign:"center",
        margin:0,
      }}>
        {slide.title.map((titlePart, i) => (
   <span key={i} style={{
  color: i === slide.titleAccent ? tokens.lavenderDk : tokens.cocoa,
  fontStyle: i === slide.titleAccent ? "italic" : "normal",
}}>
  {titlePart}{i < slide.title.length - 1 ? "\n" : ""}
</span>
        ))}
      </h1>

      {/* Description */}
      <p style={{
        fontSize:14, color:tokens.stone,
        lineHeight:1.85, textAlign:"center",
        maxWidth:280, margin:0,
      }}>
        {slide.desc}
      </p>

      {/* Slide 2 — phase pills */}
      {slide.phases && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
          {slide.phases.map(p => (
            <div key={p.label} style={{
              display:"flex", alignItems:"center", gap:5,
              padding:"6px 14px",
              background: p.color + "30",
              border:`1px solid ${p.color}60`,
              borderRadius:999,
              fontSize:12, fontWeight:500,
              color: tokens.cocoaMid,
            }}>
              <span style={{ fontSize:14 }}>{p.emoji}</span>
              {p.label}
            </div>
          ))}
        </div>
      )}

      {/* Slide 3 — stat pills */}
      {slide.stats && (
        <div style={{ display:"flex", gap:8 }}>
          {slide.stats.map(s => (
            <div key={s.lbl} style={{
              flex:1,
              background:tokens.creamSoft,
              border:`1px solid ${tokens.borderLt}`,
              borderRadius:16, padding:"10px 8px",
              textAlign:"center",
            }}>
              <div style={{ fontSize:16, fontWeight:500, color:tokens.cocoa }}>{s.val}</div>
              <div style={{ fontSize:10, color:tokens.stone, marginTop:3 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   ONBOARDING SCREEN — main export
═══════════════════════════════════════════════════ */
export default function Onboarding({ onStart }) {
  const { tokens } = useApp()
  const [current, setCurrent] = useState(0)
  const isLast = current === SLIDES.length - 1

  function handleNext() {
    if (isLast) onStart()
    else setCurrent(c => c + 1)
  }

  function handleSkip() {
    onStart()
  }

  const slide = SLIDES[current]

  return (
    <div style={{
      position:"absolute", inset:0,
      background:tokens.creamSoft,
      display:"flex", flexDirection:"column",
      padding:"52px 30px 44px",
      overflow:"hidden",
    }}>
      {/* Skip */}
      {!isLast && (
        <div style={{
          position:"absolute", top:60, right:24,
          fontSize:13, color:tokens.stone,
          cursor:"pointer", zIndex:10,
        }}
          onClick={handleSkip}
        >
          ข้าม
        </div>
      )}

      {/* Slide */}
      <SlideContent key={current} slide={slide} tokens={tokens} />

      {/* Footer */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {/* Dots */}
        <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:8 }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                height:6,
                width: i === current ? 26 : 6,
                borderRadius:999,
                background: i === current ? tokens.lavenderDk : tokens.border,
                transition:"all .3s",
                cursor:"pointer",
              }}
            />
          ))}
        </div>

        {/* Primary CTA */}
        <button
          onClick={handleNext}
          style={{
            width:"100%", padding:"15px 24px",
            background:tokens.cocoa, color:tokens.cream,
            border:"none", borderRadius:16,
            fontSize:15, fontWeight:500,
            fontFamily:"'DM Sans',sans-serif",
            cursor:"pointer",
            transition:"opacity .2s, transform .15s",
            letterSpacing:".01em",
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(.98)"}
          onMouseUp={e   => e.currentTarget.style.transform = "scale(1)"}
        >
          {isLast ? "เริ่มใช้งานเลย →" : "ถัดไป →"}
        </button>

        {/* Secondary */}
        {current === 0 && (
          <button
            onClick={handleSkip}
            style={{
              width:"100%", padding:"14px 24px",
              background:"transparent", color:tokens.stone,
              border:`1.5px solid ${tokens.border}`,
              borderRadius:16,
              fontSize:14, fontWeight:400,
              fontFamily:"'DM Sans',sans-serif",
              cursor:"pointer",
              transition:"border-color .2s",
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = tokens.lavender}
            onMouseOut={e  => e.currentTarget.style.borderColor = tokens.border}
          >
            ฉันมีบัญชีอยู่แล้ว
          </button>
        )}
      </div>
    </div>
  )
}