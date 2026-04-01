import { useApp, ScreenWrapper } from "../App.jsx"
 
/* ═══════════════════════════════════════════════════
   HOME SCREEN
   Layout (from wireframe):
   ┌─ TopBar ────────────────────────────────────────┐
   │  greeting · name · avatar                        │
   ├─ PhaseBanner ───────────────────────────────────┤
   │  eyebrow · phase name · desc · chip              │
   ├─ StatsStrip ────────────────────────────────────┤
   │  [calorie] [weight] [score]                      │
   ├─ InsightBand ───────────────────────────────────┤
   │  · insight text                                  │
   ├─ FoodRail ──────────────────────────────────────┤
   │  horizontal scroll food tiles                    │
   ├─ LogList ───────────────────────────────────────┤
   │  today's food entries                            │
   └─────────────────────────────────────────────────┘
═══════════════════════════════════════════════════ */
 
/* ── Greeting helper ── */
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "สวัสดีตอนเช้า 🌸"
  if (h < 17) return "สวัสดีตอนบ่าย ☀️"
  return "สวัสดีตอนเย็น 🌙"
}
 
/* ── Suggested foods per phase ── */
const PHASE_FOODS = {
  follicular: [
    { emoji: "🥦", name: "บรอกโคลี",  cal: 55  },
    { emoji: "🐟", name: "ปลาทูน่า",   cal: 145 },
    { emoji: "🥚", name: "ไข่ต้ม ×2",  cal: 140 },
    { emoji: "🫘", name: "ถั่วเลนทิล",  cal: 116 },
    { emoji: "🌿", name: "ผักโขม",     cal: 23  },
    { emoji: "🌾", name: "ควินัว",     cal: 222 },
  ],
  ovulation: [
    { emoji: "🥦", name: "บรอกโคลี",    cal: 55  },
    { emoji: "🐟", name: "ปลาแซลมอน",   cal: 208 },
    { emoji: "🥚", name: "ไข่ต้ม ×2",   cal: 140 },
    { emoji: "🥑", name: "อะโวคาโด",    cal: 120 },
    { emoji: "🫐", name: "บลูเบอรี่",   cal: 57  },
    { emoji: "🌿", name: "ผักโขม",      cal: 23  },
  ],
  luteal: [
    { emoji: "🍠", name: "มันเทศ",      cal: 130 },
    { emoji: "🍌", name: "กล้วยหอม",    cal: 90  },
    { emoji: "🫘", name: "ถั่วดำ",       cal: 114 },
    { emoji: "🐟", name: "ปลาทอด",      cal: 250 },
    { emoji: "🥬", name: "ผักคะน้า",    cal: 33  },
    { emoji: "🍫", name: "ดาร์กช็อก",   cal: 80  },
  ],
  menstrual: [
    { emoji: "🥩", name: "เนื้อแดง",     cal: 215 },
    { emoji: "🌿", name: "ผักโขม",       cal: 23  },
    { emoji: "🫚", name: "ขิงต้มน้ำผึ้ง", cal: 45  },
    { emoji: "🫘", name: "ถั่วเขียว",    cal: 100 },
    { emoji: "🥚", name: "ไข่ต้ม ×2",    cal: 140 },
    { emoji: "🍖", name: "ตับไก่",        cal: 167 },
  ],
}
 
 
/* ── 7-Day Meal Plan per hormone type ── */
const MEAL_PLANS_HOME = {
  estrogen_dominant: [
    { day:"จันทร์",  b:"โอ๊ตมีล + เมล็ดแฟลกซ์ + เบอรี่",      l:"ปลาแซลมอนอบ + ข้าวกล้อง + บรอกโคลี",  d:"ต้มยำเต้าหู้ + ผักโขมผัด" },
    { day:"อังคาร",  b:"ไข่ต้ม 2 ฟอง + ขนมปังไรย์",            l:"สลัดผักโขม + วอลนัท",                   d:"ไก่อบสมุนไพร + มันเทศ" },
    { day:"พุธ",     b:"สมูทตี้ผักโขม + กล้วย",                 l:"ควินัวโบล์ + ผักรวม + เต้าหู้",         d:"แกงส้มผักรวม + ข้าวกล้อง" },
    { day:"พฤหัส",  b:"กรีกโยเกิร์ต + เมล็ดแฟลกซ์",            l:"ปลาทูน่า + สลัดผัก",                    d:"ผัดผักคะน้า + เนื้อแดง" },
    { day:"ศุกร์",   b:"ข้าวโอ๊ต + บลูเบอรี่ + อัลมอนด์",       l:"ซุปผักรวม + ข้าวกล้อง",                 d:"ปลาแซลมอนย่าง + บรอกโคลี" },
    { day:"เสาร์",  b:"แพนเค้กกล้วยไข่ + เบอรี่รวม",            l:"บิบิมบับ",                               d:"ต้มข่าไก่ + ข้าวกล้อง" },
    { day:"อาทิตย์",b:"อะโวคาโดโทสต์ + ไข่ลวก",                l:"ส้มตำ + ไก่ย่าง",                       d:"มิโซะซุป + ปลาแซลมอน" },
  ],
  progesterone_low: [
    { day:"จันทร์",  b:"กล้วยหอม + เนยอัลมอนด์ + ชาคาโมมายล์", l:"ไก่อบ + มันเทศ + ผักโขม",              d:"ต้มยำกุ้ง + ข้าวกล้อง" },
    { day:"อังคาร",  b:"โอ๊ตมีล + กล้วย + ดาร์กช็อก",            l:"ถั่วดำ + ข้าวกล้อง + ผักสด",           d:"แกงเขียวหวาน + ข้าวกล้อง" },
    { day:"พุธ",     b:"ไข่ต้ม + ขนมปังโฮลวีท + ชาขิง",          l:"ปลาทอด + ผัดผักรวม",                   d:"ซุนดูบูจิเก + ข้าว" },
    { day:"พฤหัส",  b:"กรีกโยเกิร์ต + กล้วย + วอลนัท",           l:"สลัดอะโวคาโด + ปลาทูน่า",              d:"ผัดกะเพราไก่ + ข้าวกล้อง" },
    { day:"ศุกร์",   b:"สมูทตี้กล้วย + นมโอ๊ต",                  l:"ข้าวหน้าปลาแซลมอน + สลัด",             d:"ต้มข่าไก่ + ข้าวกล้อง" },
    { day:"เสาร์",  b:"ข้าวโอ๊ต + เมล็ดแฟลกซ์",                  l:"ซัมเกทัง",                              d:"ผักโขมผัดกระเทียม + ไข่" },
    { day:"อาทิตย์",b:"แพนเค้กกล้วยไข่ + ดาร์กช็อก",             l:"ก๋วยเตี๋ยวน้ำใส + ผักโขม",             d:"ปลาแซลมอนย่าง + มันเทศ" },
  ],
  cortisol_high: [
    { day:"จันทร์",  b:"ชาขมิ้น + โอ๊ตมีล + วอลนัท",             l:"สลัดผักโขม + อะโวคาโด + แซลมอน",      d:"ซุปผักรวม + ข้าวกล้อง" },
    { day:"อังคาร",  b:"สมูทตี้อะโวคาโด + ชา Ashwagandha",        l:"ไก่อบสมุนไพร + บรอกโคลีนึ่ง",        d:"มิโซะซุป + เต้าหู้เย็น" },
    { day:"พุธ",     b:"ไข่ต้ม + ขนมปังไรย์ + ชา Chamomile",      l:"ควินัวโบล์ + ถั่วดำ",                  d:"ต้มยำเต้าหู้" },
    { day:"พฤหัส",  b:"กรีกโยเกิร์ต + บลูเบอรี่ + วอลนัท",       l:"ปลาแซลมอนอบ + มันเทศ",                d:"ผัดผักคะน้า + ไก่" },
    { day:"ศุกร์",   b:"โอ๊ตมีล + กล้วย + ชาขิง",                 l:"ส้มตำ (ไม่เผ็ดมาก) + ข้าวกล้อง",      d:"แกงจืดเต้าหู้ + ข้าวกล้อง" },
    { day:"เสาร์",  b:"อะโวคาโดโทสต์ + ชา Ashwagandha",           l:"ชาบู-ชาบู ผักเยอะ",                   d:"ต้มข่าไก่" },
    { day:"อาทิตย์",b:"สมูทตี้มะม่วง + ขมิ้น",                    l:"ข้าวกล้อง + ไก่ย่าง + ผักโขม",        d:"ซุปผักรวม + ขนมปังโฮลวีท" },
  ],
  balanced: [
    { day:"จันทร์",  b:"โอ๊ตมีล + เบอรี่ + เมล็ดแฟลกซ์",         l:"ปลาแซลมอน + ข้าวกล้อง + ผัก",        d:"ต้มยำกุ้ง + ข้าวกล้อง" },
    { day:"อังคาร",  b:"ไข่ต้ม + ขนมปังโฮลวีท + อะโวคาโด",       l:"บิบิมบับ + เต้าหู้",                   d:"ไก่อบสมุนไพร + มันเทศ" },
    { day:"พุธ",     b:"กรีกโยเกิร์ต + กล้วย + วอลนัท",           l:"สลัดผักโขม + ปลาทูน่า",               d:"แกงเขียวหวาน + ข้าวกล้อง" },
    { day:"พฤหัส",  b:"สมูทตี้เบอรี่ + นมอัลมอนด์",               l:"ซูชิ (8 ชิ้น) + มิโซะซุป",            d:"ผัดผักรวม + ไก่" },
    { day:"ศุกร์",   b:"ข้าวโอ๊ต + บลูเบอรี่ + อัลมอนด์",         l:"ก๋วยเตี๋ยวน้ำใส + ผักโขม",            d:"ปลาแซลมอนย่าง + บรอกโคลี" },
    { day:"เสาร์",  b:"แพนเค้กกล้วยไข่ + สตรอว์เบอรี่",           l:"ส้มตำ + ไก่ย่าง + ข้าวกล้อง",        d:"ชาบู-ชาบู ผักเยอะ" },
    { day:"อาทิตย์",b:"อะโวคาโดโทสต์ + ไข่ลวก",                  l:"ควินัวโบล์ + ถั่วดำ",                  d:"ต้มข่าไก่ + ข้าวกล้อง" },
  ],
}
 
function getTodayMeal(hormoneType) {
  const plan = MEAL_PLANS_HOME[hormoneType] ?? MEAL_PLANS_HOME.balanced
  const dayOfWeek = new Date().getDay() // 0=อาทิตย์
  const idx = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  return plan[idx]
}
 
/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════ */
 
/* TopBar */
function TopBar({ user }) {
  const { tokens } = useApp()
  return (
    <div className="fade-up" style={{
      background: tokens.creamSoft,
      padding: "14px 20px 12px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      borderBottom: `1px solid ${tokens.borderLt}`,
      flexShrink: 0,
    }}>
      <div>
        <div style={{ fontSize: 11, color: tokens.stone, letterSpacing: ".03em", marginBottom: 3 }}>
          {getGreeting()}
        </div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 20, color: tokens.cocoa,
        }}>
          {user.name}
        </div>
      </div>
      {/* Avatar */}
      <div style={{
        width: 42, height: 42, borderRadius: "50%",
        background: tokens.lavenderLt,
        border: `2.5px solid ${tokens.rose}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 19,
      }}>
        🌸
      </div>
    </div>
  )
}
 
/* PhaseBanner */
function PhaseBanner({ phase, cycleDay, onPress }) {
  const { tokens } = useApp()
  return (
    <div
      className="fade-up"
      onClick={onPress}
      style={{
        margin: "14px 16px 0",
        borderRadius: 22,
        padding: "18px 20px 16px",
        background: phase.color,
        color: "white",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform .15s",
      }}
      onMouseDown={e => e.currentTarget.style.transform = "scale(.99)"}
      onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
    >
      {/* Decorative circles */}
      <div style={{
        position: "absolute", top: -60, right: -40,
        width: 160, height: 160, borderRadius: "50%",
        background: "rgba(255,255,255,.09)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -30, left: 10,
        width: 90, height: 90, borderRadius: "50%",
        background: "rgba(255,255,255,.07)",
        pointerEvents: "none",
      }} />
      <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", opacity: .8, marginBottom: 4 }}>
        เฟสของคุณวันนี้
      </div>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 24, marginBottom: 5,
      }}>
        {phase.emoji} {phase.label}
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.6, opacity: .85, marginBottom: 12 }}>
        {phase.desc.split(" ").slice(0, 8).join(" ")}…
      </div>
      <span style={{
        display: "inline-block",
        background: "rgba(255,255,255,.2)",
        borderRadius: 999,
        padding: "4px 12px",
        fontSize: 11, fontWeight: 500,
        backdropFilter: "blur(4px)",
      }}>
        วันที่ {cycleDay} ของรอบ →
      </span>
    </div>
  )
}
 
/* StatsStrip */
function StatsStrip({ totalCal, targetCal, weight }) {
  const { tokens } = useApp()
 
  const dayScore = Math.min(100, Math.max(0,
    Math.round(100 - Math.abs(totalCal - targetCal) / targetCal * 60)
  ))
 
  const stats = [
    { value: totalCal.toLocaleString(), label: "kcal วันนี้" },
    { value: weight.toFixed(1), label: "น้ำหนัก (กก.)", unit: "" },
    { value: dayScore, label: "คะแนนวัน", accent: tokens.sageDk },
  ]
 
  return (
    <div className="fade-up" style={{
      display: "grid", gridTemplateColumns: "repeat(3,1fr)",
      gap: 8, padding: "10px 16px 0",
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          background: tokens.creamSoft,
          border: `1px solid ${tokens.borderLt}`,
          borderRadius: 16,
          padding: "11px 10px",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: 19, fontWeight: 500,
            color: s.accent ?? tokens.cocoa,
            lineHeight: 1.1,
          }}>
            {s.value}
            {s.unit !== undefined && <span style={{ fontSize: 11, color: tokens.stone }}>{s.unit}</span>}
          </div>
          <div style={{ fontSize: 10, color: tokens.stone, marginTop: 3 }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}
 
/* InsightBand */
function InsightBand({ phase }) {
  const { tokens } = useApp()
 
  const insights = {
    ovulation: "กินโปรตีนสูง + ผักใบเขียว ช่วยขับ Estrogen ส่วนเกิน แขนจะดูกระชับใน 1 สัปดาห์",
    follicular: "ช่วงนี้ร่างกายไวต่อ Insulin มาก หลีกเลี่ยงน้ำตาลเพื่อ maximize การลดไขมัน",
    luteal: "อยากหวานคือสัญญาณ Progesterone สูง ลองกล้วยหรือดาร์กช็อกแทนขนมหวาน",
    menstrual: "เพิ่มธาตุเหล็กจากผักโขมและตับ เพื่อชดเชยที่ร่างกายสูญเสียไป",
  }
 
  return (
    <div className="fade-up" style={{
      margin: "10px 16px 0",
      background: tokens.lavenderLt,
      border: `1px solid rgba(187,168,196,.3)`,
      borderRadius: 16,
      padding: "12px 14px",
      display: "flex", gap: 10, alignItems: "flex-start",
    }}>
      <div style={{
        width: 7, height: 7, borderRadius: "50%",
        background: tokens.lavenderDk,
        flexShrink: 0, marginTop: 5,
      }} />
      <div style={{ fontSize: 12, color: tokens.lavenderDk, lineHeight: 1.65 }}>
        {insights[phase.key]}
      </div>
    </div>
  )
}
 
/* SectionRow */
function SectionRow({ title, action, onAction }) {
  const { tokens } = useApp()
  return (
    <div className="fade-up" style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "13px 16px 7px",
    }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: tokens.cocoa }}>{title}</span>
      {action && (
        <span
          onClick={onAction}
          style={{ fontSize: 12, color: tokens.sage, cursor: "pointer" }}
        >
          {action}
        </span>
      )}
    </div>
  )
}
 
/* FoodRail */
function FoodRail({ foods, pickedNames, onPick }) {
  const { tokens } = useApp()
  return (
    <div className="fade-up" style={{
      display: "flex", gap: 8,
      padding: "0 16px 4px",
      overflowX: "auto",
      msOverflowStyle: "none", scrollbarWidth: "none",
    }}>
      {foods.map(f => {
        const picked = pickedNames.includes(f.name)
        return (
          <div
            key={f.name}
            onClick={() => onPick(f)}
            style={{
              flexShrink: 0, minWidth: 82,
              background: picked ? tokens.sageLt : tokens.creamSoft,
              border: `1px solid ${picked ? tokens.sage : tokens.border}`,
              borderRadius: 16,
              padding: "10px 10px 8px",
              cursor: "pointer",
              textAlign: "center",
              transition: "all .18s",
              transform: "scale(1)",
            }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(.95)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <div style={{ fontSize: 24, marginBottom: 5 }}>{f.emoji}</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: tokens.cocoa }}>{f.name}</div>
            <div style={{ fontSize: 10, color: tokens.sage, marginTop: 2 }}>{f.cal} kcal</div>
          </div>
        )
      })}
    </div>
  )
}
 
/* FoodLogList */
function FoodLogList({ log }) {
  const { tokens } = useApp()
  return (
    <div className="fade-up" style={{
      padding: "0 16px",
      display: "flex", flexDirection: "column", gap: 7,
    }}>
      {log.map(item => (
        <div key={item.id} style={{
          background: tokens.creamSoft,
          border: `1px solid ${tokens.borderLt}`,
          borderRadius: 16,
          padding: "11px 13px",
          display: "flex", alignItems: "center", gap: 11,
        }}>
          <div style={{
            width: 36, height: 36,
            background: tokens.cream,
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, flexShrink: 0,
          }}>
            {item.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: tokens.cocoa }}>{item.name}</div>
            <div style={{ fontSize: 10, color: tokens.stone, marginTop: 2 }}>
              {item.time}{item.meal ? ` · ${item.meal}` : ""}
            </div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: tokens.sageDk, flexShrink: 0 }}>
            {item.cal} kcal
          </div>
        </div>
      ))}
    </div>
  )
}
 
/* AddFoodButton */
function AddFoodButton({ onPress }) {
  const { tokens } = useApp()
  return (
    <span
      onClick={onPress}
      style={{
        fontSize: 11, cursor: "pointer",
        background: tokens.creamSoft,
        padding: "5px 11px",
        borderRadius: 999,
        border: `1px solid ${tokens.border}`,
        color: tokens.cocoa,
      }}
    >
      + เพิ่ม
    </span>
  )
}
 
 
/* MoodBanner */
function MoodBanner({ onPress, tokens }) {
  let todayMood = null
  try {
    const logs = JSON.parse(localStorage.getItem("he_moodlogs") ?? "[]")
    const today = new Date()
    const tk = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`
    todayMood = logs.find(l => l.dateKey === tk)
  } catch {}
 
  const MOODS = [
    { id:"great", emoji:"🤩" }, { id:"good", emoji:"😊" },
    { id:"neutral", emoji:"😐" }, { id:"tired", emoji:"😔" },
    { id:"bad", emoji:"😞" },
  ]
  const moodEmoji = MOODS.find(m => m.id === todayMood?.mood)?.emoji
 
  return (
    <div onClick={onPress} className="fade-up" style={{
      margin:"10px 16px 0",
      background: todayMood ? tokens.sageLt : tokens.lavenderLt,
      border:`1px solid ${todayMood ? "rgba(126,148,132,.3)" : "rgba(187,168,196,.3)"}`,
      borderRadius:16, padding:"12px 14px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      cursor:"pointer", transition:"all .15s",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:22 }}>{moodEmoji ?? "😊"}</span>
        <div>
          <div style={{ fontSize:13, fontWeight:500,
            color: todayMood ? tokens.sageDk : tokens.lavenderDk }}>
            {todayMood ? "บันทึกอารมณ์แล้ว ✓" : "บันทึกอารมณ์วันนี้"}
          </div>
          <div style={{ fontSize:10, color:tokens.stone, marginTop:2 }}>
            {todayMood ? "กดเพื่อดูประวัติ" : "Mood & Energy Tracker →"}
          </div>
        </div>
      </div>
      <span style={{ fontSize:16, color:tokens.stone }}>›</span>
    </div>
  )
}
 
/* TodayMealCard */
function TodayMealCard({ hormoneType, tokens }) {
  const meal = getTodayMeal(hormoneType)
  if (!meal) return null
 
  const days = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัส","ศุกร์","เสาร์"]
  const today = days[new Date().getDay()]
 
  return (
    <div className="fade-up" style={{
      margin:"10px 16px 0",
      background:tokens.creamSoft,
      border:`1px solid ${tokens.borderLt}`,
      borderRadius:20, padding:"14px 16px",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:10 }}>
        <div style={{ fontSize:13, fontWeight:500, color:tokens.cocoa }}>
          📅 แผนอาหารวัน{today}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {[
          { icon:"🌅", label:"เช้า",       val:meal.b },
          { icon:"☀️", label:"กลางวัน",   val:meal.l },
          { icon:"🌙", label:"เย็น",       val:meal.d },
        ].map(m => (
          <div key={m.label} style={{
            display:"flex", gap:10, alignItems:"flex-start",
            padding:"9px 12px",
            background:tokens.cream,
            borderRadius:12,
          }}>
            <span style={{ fontSize:16, flexShrink:0 }}>{m.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:500, color:tokens.stone,
                letterSpacing:".04em", textTransform:"uppercase", marginBottom:3 }}>
                {m.label}
              </div>
              <div style={{ fontSize:12, color:tokens.cocoaMid, lineHeight:1.45 }}>
                {m.val}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   HOME SCREEN — main export
═══════════════════════════════════════════════════ */
export default function Home() {
  const {
    user, totalCal, todayEntries,
    currentPhase, navTo, toggleCartItem, cartItems, tokens,
  } = useApp()
 
  const suggestedFoods = PHASE_FOODS[user.currentPhase] ?? PHASE_FOODS.ovulation
  const pickedNames = cartItems.map(f => f.name)
 
  function handlePickFood(food) {
    toggleCartItem(food)
  }
 
  return (
    <ScreenWrapper>
      {/* ── Header ── */}
      <TopBar user={user} />
 
      {/* ── Scrollable body ── */}
      <div className="scroll-body" style={{ flex: 1, paddingBottom: 90 }}>
 
        {/* Phase Banner */}
        <PhaseBanner
          phase={currentPhase}
          cycleDay={user.cycleDay}
          onPress={() => navTo("phases")}
        />
 
        {/* Stats */}
        <StatsStrip
          totalCal={totalCal}
          targetCal={user.targetCal}
          weight={user.weight}
        />
 
        {/* Insight */}
        <InsightBand phase={currentPhase} />
 
        {/* Mood Banner */}
        <MoodBanner onPress={() => navTo("mood")} tokens={tokens} />
 
        {/* Today Meal Plan */}
        <TodayMealCard hormoneType={user.hormoneType ?? "balanced"} tokens={tokens} />
 
        {/* Food suggestions */}
        <SectionRow
          title="แนะนำวันนี้"
          action="ดูทั้งหมด ›"
          onAction={() => navTo("tracker")}
        />
        <FoodRail
          foods={suggestedFoods}
          pickedNames={pickedNames}
          onPick={handlePickFood}
        />
 
        {/* Food log */}
        <SectionRow
          title="บันทึกวันนี้"
          action={<AddFoodButton onPress={() => navTo("tracker")} />}
        />
        <FoodLogList log={todayEntries ?? []} />
 
        {/* Bottom padding */}
        <div style={{ height: 16 }} />
      </div>
    </ScreenWrapper>
  )
}