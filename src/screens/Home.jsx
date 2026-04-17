import React from "react"
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
 
/* ── Greeting helper removed - using t() in TopBar ── */
 
/* ── Suggested foods per phase ── */
const PHASE_FOODS = {
  follicular: [
    { emoji: "🥦", name: "บรอกโคลี", nameEn: "Broccoli",  cal: 55  },
    { emoji: "🐟", name: "ปลาทูน่า", nameEn: "Tuna",   cal: 145 },
    { emoji: "🥚", name: "ไข่ต้ม ×2", nameEn: "Boiled Eggs ×2",  cal: 140 },
    { emoji: "🫘", name: "ถั่วเลนทิล", nameEn: "Lentils",  cal: 116 },
    { emoji: "🌿", name: "ผักโขม", nameEn: "Spinach",     cal: 23  },
    { emoji: "🌾", name: "ควินัว", nameEn: "Quinoa",     cal: 222 },
  ],
  ovulation: [
    { emoji: "🥦", name: "บรอกโคลี", nameEn: "Broccoli",    cal: 55  },
    { emoji: "🐟", name: "ปลาแซลมอน", nameEn: "Salmon",   cal: 208 },
    { emoji: "🥚", name: "ไข่ต้ม ×2", nameEn: "Boiled Eggs ×2",   cal: 140 },
    { emoji: "🥑", name: "อะโวคาโด", nameEn: "Avocado",    cal: 120 },
    { emoji: "🫐", name: "บลูเบอรี่", nameEn: "Blueberries",   cal: 57  },
    { emoji: "🌿", name: "ผักโขม", nameEn: "Spinach",      cal: 23  },
  ],
  luteal: [
    { emoji: "🍠", name: "มันเทศ", nameEn: "Sweet Potato",      cal: 130 },
    { emoji: "🍌", name: "กล้วยหอม", nameEn: "Banana",    cal: 90  },
    { emoji: "🫘", name: "ถั่วดำ", nameEn: "Black Beans",       cal: 114 },
    { emoji: "🐟", name: "ปลาทอด", nameEn: "Fried Fish",      cal: 250 },
    { emoji: "🥬", name: "ผักคะน้า", nameEn: "Kale",    cal: 33  },
    { emoji: "🍫", name: "ดาร์กช็อก", nameEn: "Dark Chocolate",   cal: 80  },
  ],
  menstrual: [
    { emoji: "🥩", name: "เนื้อแดง", nameEn: "Lean Beef",     cal: 215 },
    { emoji: "🌿", name: "ผักโขม", nameEn: "Spinach",       cal: 23  },
    { emoji: "🫚", name: "ขิงต้มน้ำผึ้ง", nameEn: "Ginger Honey Tea", cal: 45  },
    { emoji: "🫘", name: "ถั่วเขียว", nameEn: "Mung Beans",    cal: 100 },
    { emoji: "🥚", name: "ไข่ต้ม ×2", nameEn: "Boiled Eggs ×2",    cal: 140 },
    { emoji: "🍖", name: "ตับไก่", nameEn: "Chicken Liver",        cal: 167 },
  ],
}
 
 
/* ── 7-Day Meal Plan per hormone type ── */
const MEAL_PLANS_HOME = {
  estrogen_dominant: [
    { day:"จันทร์", dayEn:"Mon",  b:"โอ๊ตมีล + เมล็ดแฟลกซ์ + เบอรี่", bEn:"Oatmeal + Flaxseeds + Berries",      l:"ปลาแซลมอนอบ + ข้าวกล้อง + บรอกโคลี", lEn:"Baked Salmon + Brown Rice + Broccoli",  d:"ต้มยำเต้าหู้ + ผักโขมผัด", dEn:"Tofu Tom Yum + Stir-fried Spinach" },
    { day:"อังคาร", dayEn:"Tue",  b:"ไข่ต้ม 2 ฟอง + ขนมปังไรย์", bEn:"Boiled Eggs + Rye Bread",            l:"สลัดผักโขม + วอลนัท", lEn:"Spinach Salad + Walnuts",                   d:"ไก่อบสมุนไพร + มันเทศ", dEn:"Herb Roasted Chicken + Sweet Potato" },
    { day:"พุธ", dayEn:"Wed",     b:"สมูทตี้ผักโขม + กล้วย", bEn:"Spinach Smoothie + Banana",                 l:"ควินัวโบล์ + ผักรวม + เต้าหู้", lEn:"Quinoa Bowl + Mixed Veg + Tofu",         d:"แกงส้มผักรวม + ข้าวกล้อง", dEn:"Sour Curry + Brown Rice" },
    { day:"พฤหัส", dayEn:"Thu",  b:"กรีกโยเกิร์ต + เมล็ดแฟลกซ์", bEn:"Greek Yogurt + Flaxseeds",            l:"ปลาทูน่า + สลัดผัก", lEn:"Tuna + Green Salad",                    d:"ผัดผักคะน้า + เนื้อแดง", dEn:"Stir-fried Kale + Lean Beef" },
    { day:"ศุกร์", dayEn:"Fri",   b:"ข้าวโอ๊ต + บลูเบอรี่ + อัลมอนด์", bEn:"Oatmeal + Blueberries + Almonds",       l:"ซุปผักรวม + ข้าวกล้อง", lEn:"Mixed Veg Soup + Brown Rice",                 d:"ปลาแซลมอนย่าง + บรอกโคลี", dEn:"Grilled Salmon + Broccoli" },
    { day:"เสาร์", dayEn:"Sat",  b:"แพนเค้กกล้วยไข่ + เบอรี่รวม", bEn:"Banana Egg Pancake + Mixed Berries",            l:"บิบิมบับ", lEn:"Bibimbap",                               d:"ต้มข่าไก่ + ข้าวกล้อง", dEn:"Tom Kha Gai + Brown Rice" },
    { day:"อาทิตย์", dayEn:"Sun",b:"อะโวคาโดโทสต์ + ไข่ลวก", bEn:"Avocado Toast + Poached Egg",                l:"ส้มตำ + ไก่ย่าง", lEn:"Papaya Salad + Grilled Chicken",                       d:"มิโซะซุป + ปลาแซลมอน", dEn:"Miso Soup + Salmon" },
  ],
  progesterone_low: [
    { day:"จันทร์", dayEn:"Mon",  b:"กล้วยหอม + เนยอัลมอนด์ + ชาคาโมมายล์", bEn:"Banana + Almond Butter + Chamomile Tea", l:"ไก่อบ + มันเทศ + ผักโขม", lEn:"Roasted Chicken + Sweet Potato + Spinach",              d:"ต้มยำกุ้ง + ข้าวกล้อง", dEn:"Tom Yum Goong + Brown Rice" },
    { day:"อังคาร", dayEn:"Tue",  b:"โอ๊ตมีล + กล้วย + ดาร์กช็อก", bEn:"Oatmeal + Banana + Dark Chocolate",            l:"ถั่วดำ + ข้าวกล้อง + ผักสด", lEn:"Black Beans + Brown Rice + Fresh Veg",           d:"แกงเขียวหวาน + ข้าวกล้อง", dEn:"Green Curry + Brown Rice" },
    { day:"พุธ", dayEn:"Wed",     b:"ไข่ต้ม + ขนมปังโฮลวีท + ชาขิง", bEn:"Boiled Eggs + Whole Wheat Bread + Ginger Tea",          l:"ปลาทอด + ผัดผักรวม", lEn:"Fried Fish + Stir-fried Veg",                   d:"ซุนดูบูจิเก + ข้าว", dEn:"Sundubu Jjigae + Rice" },
    { day:"พฤหัส", dayEn:"Thu",  b:"กรีกโยเกิร์ต + กล้วย + วอลนัท", bEn:"Greek Yogurt + Banana + Walnuts",           l:"สลัดอะโวคาโด + ปลาทูน่า", lEn:"Avocado Salad + Tuna",              d:"ผัดกะเพราไก่ + ข้าวกล้อง", dEn:"Basil Chicken + Brown Rice" },
    { day:"ศุกร์", dayEn:"Fri",   b:"สมูทตี้กล้วย + นมโอ๊ต", bEn:"Banana Smoothie + Oat Milk",                  l:"ข้าวหน้าปลาแซลมอน + สลัด", lEn:"Salmon Rice Bowl + Salad",             d:"ต้มข่าไก่ + ข้าวกล้อง", dEn:"Tom Kha Gai + Brown Rice" },
    { day:"เสาร์", dayEn:"Sat",  b:"ข้าวโอ๊ต + เมล็ดแฟลกซ์", bEn:"Oatmeal + Flaxseeds",                  l:"ซัมเกทัง", lEn:"Samgyetang",                              d:"ผักโขมผัดกระเทียม + ไข่", dEn:"Garlic Spinach + Egg" },
    { day:"อาทิตย์", dayEn:"Sun",b:"แพนเค้กกล้วยไข่ + ดาร์กช็อก", bEn:"Banana Egg Pancake + Dark Chocolate",             l:"ก๋วยเตี๋ยวน้ำใส + ผักโขม", lEn:"Clear Noodle Soup + Spinach",             d:"ปลาแซลมอนย่าง + มันเทศ", dEn:"Grilled Salmon + Sweet Potato" },
  ],
  cortisol_high: [
    { day:"จันทร์", dayEn:"Mon",  b:"ชาขมิ้น + โอ๊ตมีล + วอลนัท", bEn:"Turmeric Tea + Oatmeal + Walnuts",             l:"สลัดผักโขม + อะโวคาโด + แซลมอน", lEn:"Spinach Salad + Avocado + Salmon",      d:"ซุปผักรวม + ข้าวกล้อง", dEn:"Mixed Veg Soup + Brown Rice" },
    { day:"อังคาร", dayEn:"Tue",  b:"สมูทตี้อะโวคาโด + ชา Ashwagandha", bEn:"Avocado Smoothie + Ashwagandha Tea",        l:"ไก่อบสมุนไพร + บรอกโคลีนึ่ง", lEn:"Herb Chicken + Steamed Broccoli",        d:"มิโซะซุป + เต้าหู้เย็น", dEn:"Miso Soup + Cold Tofu" },
    { day:"พุธ", dayEn:"Wed",     b:"ไข่ต้ม + ขนมปังไรย์ + ชา Chamomile", bEn:"Boiled Eggs + Rye Bread + Chamomile Tea",      l:"ควินัวโบล์ + ถั่วดำ", lEn:"Quinoa Bowl + Black Beans",                  d:"ต้มยำเต้าหู้", dEn:"Tofu Tom Yum" },
    { day:"พฤหัส", dayEn:"Thu",  b:"กรีกโยเกิร์ต + บลูเบอรี่ + วอลนัท", bEn:"Greek Yogurt + Blueberries + Walnuts",       l:"ปลาแซลมอนอบ + มันเทศ", lEn:"Baked Salmon + Sweet Potato",                d:"ผัดผักคะน้า + ไก่", dEn:"Stir-fried Kale + Chicken" },
    { day:"ศุกร์", dayEn:"Fri",   b:"โอ๊ตมีล + กล้วย + ชาขิง", bEn:"Oatmeal + Banana + Ginger Tea",                 l:"ส้มตำ (ไม่เผ็ดมาก) + ข้าวกล้อง", lEn:"Mild Papaya Salad + Brown Rice",      d:"แกงจืดเต้าหู้ + ข้าวกล้อง", dEn:"Clear Tofu Soup + Brown Rice" },
    { day:"เสาร์", dayEn:"Sat",  b:"อะโวคาโดโทสต์ + ชา Ashwagandha", bEn:"Avocado Toast + Ashwagandha Tea",           l:"ชาบู-ชาบู ผักเยอะ", lEn:"Shabu-Shabu with Lots of Veg",                   d:"ต้มข่าไก่", dEn:"Tom Kha Gai" },
    { day:"อาทิตย์", dayEn:"Sun",b:"สมูทตี้มะม่วง + ขมิ้น", bEn:"Mango Smoothie + Turmeric",                    l:"ข้าวกล้อง + ไก่ย่าง + ผักโขม", lEn:"Brown Rice + Grilled Chicken + Spinach",        d:"ซุปผักรวม + ขนมปังโฮลวีท", dEn:"Mixed Veg Soup + Whole Wheat Bread" },
  ],
  balanced: [
    { day:"จันทร์", dayEn:"Mon",  b:"โอ๊ตมีล + เบอรี่ + เมล็ดแฟลกซ์", bEn:"โอ๊ตมีล + เบอรี่ + เมล็ดแฟลกซ์",         l:"ปลาแซลมอน + ข้าวกล้อง + ผัก", lEn:"Salmon + Brown Rice + Veg",        d:"ต้มยำกุ้ง + ข้าวกล้อง", dEn:"Tom Yum Goong + Brown Rice" },
    { day:"อังคาร", dayEn:"Tue",  b:"ไข่ต้ม + ขนมปังโฮลวีท + อะโวคาโด", bEn:"Boiled Eggs + Whole Wheat Bread + Avocado",       l:"บิบิมบับ + เต้าหู้", lEn:"Bibimbap + Tofu",                   d:"ไก่อบสมุนไพร + มันเทศ", dEn:"Herb Roasted Chicken + Sweet Potato" },
    { day:"พุธ", dayEn:"Wed",     b:"กรีกโยเกิร์ต + กล้วย + วอลนัท", bEn:"Greek Yogurt + Banana + Walnuts",           l:"สลัดผักโขม + ปลาทูน่า", lEn:"Spinach Salad + Tuna",               d:"แกงเขียวหวาน + ข้าวกล้อง", dEn:"Green Curry + Brown Rice" },
    { day:"พฤหัส", dayEn:"Thu",  b:"สมูทตี้เบอรี่ + นมอัลมอนด์", bEn:"Berry Smoothie + Almond Milk",               l:"ซูชิ (8 ชิ้น) + มิโซะซุป", lEn:"Sushi (8 pcs) + Miso Soup",            d:"ผัดผักรวม + ไก่", dEn:"Stir-fried Mixed Veg + Chicken" },
    { day:"ศุกร์", dayEn:"Fri",   b:"ข้าวโอ๊ต + บลูเบอรี่ + อัลมอนด์", bEn:"Oatmeal + Blueberries + Almonds",         l:"ก๋วยเตี๋ยวน้ำใส + ผักโขม", lEn:"Clear Noodle Soup + Spinach",            d:"ปลาแซลมอนย่าง + บรอกโคลี", dEn:"Grilled Salmon + Broccoli" },
    { day:"เสาร์", dayEn:"Sat",  b:"แพนเค้กกล้วยไข่ + สตรอว์เบอรี่", bEn:"Banana Egg Pancake + Strawberries",           l:"ส้มตำ + ไก่ย่าง + ข้าวกล้อง", lEn:"Papaya Salad + Grilled Chicken + Brown Rice",        d:"ชาบู-ชาบู ผักเยอะ", dEn:"Shabu-Shabu with Lots of Veg" },
    { day:"อาทิตย์", dayEn:"Sun",b:"อะโวคาโดโทสต์ + ไข่ลวก", bEn:"Avocado Toast + Poached Egg",                  l:"ควินัวโบล์ + ถั่วดำ", lEn:"Quinoa Bowl + Black Beans",                  d:"ต้มข่าไก่ + ข้าวกล้อง", dEn:"Tom Kha Gai + Brown Rice" },
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
  const { tokens, lang, setLang, t } = useApp()
  const h = new Date().getHours()
  const greeting = h < 12 ? t("home.greeting_morning") : h < 17 ? t("home.greeting_afternoon") : t("home.greeting_evening")
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
          {greeting}
        </div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 20, color: tokens.cocoa,
        }}>
          {user.name}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {/* Lang toggle */}
        <div style={{ display:"flex", background:tokens.cream, border:`1px solid ${tokens.border}`, borderRadius:999, overflow:"hidden" }}>
          {["th","en"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding:"5px 11px",
              background: lang===l ? tokens.cocoa : "transparent",
              color:      lang===l ? tokens.cream  : tokens.stone,
              border:"none", cursor:"pointer",
              fontSize:11, fontWeight:500,
              fontFamily:"'DM Sans',sans-serif",
              transition:"all .2s",
            }}>
              {l==="th" ? "TH" : "EN"}
            </button>
          ))}
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
    </div>
  )
}
 
/* PhaseBanner */
function PhaseBanner({ phase, cycleDay, onPress }) {
  const { tokens, t } = useApp()
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
        {t("home.phase_today")}
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
        {t("home.cycle_day")} {cycleDay} {t("home.cycle_of")}
      </span>
    </div>
  )
}
 
/* StatsStrip */
function StatsStrip({ totalCal, targetCal, weight }) {
  const { tokens, t } = useApp()
 
  const dayScore = Math.min(100, Math.max(0,
    Math.round(100 - Math.abs(totalCal - targetCal) / targetCal * 60)
  ))
 
  const stats = [
    { value: totalCal.toLocaleString(), label: t("home.stats_cal") },
    { value: weight.toFixed(1), label: t("home.stats_weight"), unit: "" },
    { value: dayScore, label: t("home.stats_score"), accent: tokens.sageDk },
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
  const { tokens, lang } = useApp()
 
  const insights = {
    th: {
      ovulation: "กินโปรตีนสูง + ผักใบเขียว ช่วยขับ Estrogen ส่วนเกิน แขนจะดูกระชับใน 1 สัปดาห์",
      follicular: "ช่วงนี้ร่างกายไวต่อ Insulin มาก หลีกเลี่ยงน้ำตาลเพื่อ maximize การลดไขมัน",
      luteal: "อยากหวานคือสัญญาณ Progesterone สูง ลองกล้วยหรือดาร์กช็อกแทนขนมหวาน",
      menstrual: "เพิ่มธาตุเหล็กจากผักโขมและตับ เพื่อชดเชยที่ร่างกายสูญเสียไป",
    },
    en: {
      ovulation: "High protein + leafy greens help flush excess Estrogen — you'll feel leaner in 1 week.",
      follicular: "Your body is highly insulin-sensitive now. Cut sugar to maximize fat loss.",
      luteal: "Sweet cravings signal high Progesterone. Try banana or dark chocolate instead.",
      menstrual: "Boost iron from spinach and liver to replace what your body loses.",
    },
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
        {(insights[lang] ?? insights.th)[phase.key]}
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
  const { tokens, lang } = useApp()
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
            <div style={{ fontSize: 11, fontWeight: 500, color: tokens.cocoa }}>{lang==="en" ? (f.nameEn??f.name) : f.name}</div>
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
  const { tokens, t } = useApp()
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
      {t("home.add")}
    </span>
  )
}
 
 
/* MoodBanner */
function MoodBanner({ onPress }) {
  const { tokens, t } = useApp()
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
            {todayMood ? t("home.mood_logged") : t("home.mood_cta")}
          </div>
          <div style={{ fontSize:10, color:tokens.stone, marginTop:2 }}>
            {todayMood ? t("home.mood_tap") : t("home.mood_sub")}
          </div>
        </div>
      </div>
      <span style={{ fontSize:16, color:tokens.stone }}>›</span>
    </div>
  )
}
 
/* TodayMealCard */
function TodayMealCard({ hormoneType }) {
  const { tokens, t, lang } = useApp()
  const meal = getTodayMeal(hormoneType)
  if (!meal) return null
 
  const days_th = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัส","ศุกร์","เสาร์"]
  const days_en = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  const today = lang === "en" ? days_en[new Date().getDay()] : days_th[new Date().getDay()]
 
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
          {t("home.meal_plan")}{lang==="en" ? " " : ""}{today}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {[
          { icon:"🌅", label:t("home.breakfast"), val:lang==="en" ? (meal.bEn??meal.b) : meal.b },
          { icon:"☀️", label:t("home.lunch"),     val:lang==="en" ? (meal.lEn??meal.l) : meal.l },
          { icon:"🌙", label:t("home.dinner"),     val:lang==="en" ? (meal.dEn??meal.d) : meal.d },
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

/* PhaseDetailSheet */
function PhaseDetailSheet({ phase, onClose, onQuiz }) {
  const { tokens, lang, t } = useApp()

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 400,
        background: "rgba(61,46,42,.5)",
        display: "flex", alignItems: "flex-end",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%",
          background: tokens.creamSoft,
          borderRadius: "24px 24px 0 0",
          maxHeight: "78%",
          display: "flex", flexDirection: "column",
          animation: "slideUp .28s ease both",
          marginBottom: "82px",
        }}
      >
        {/* Handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: tokens.border,
          margin: "12px auto 0",
          flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{
          background: phase.color,
          borderRadius: "20px 20px 0 0",
          padding: "18px 20px 16px",
          margin: "10px 16px 0",
          color: "white",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          <div style={{
            position: "absolute", top: -40, right: -30,
            width: 110, height: 110, borderRadius: "50%",
            background: "rgba(255,255,255,.1)", pointerEvents: "none",
          }} />
          <div style={{ fontSize: 32, marginBottom: 6 }}>{phase.emoji}</div>
          <div style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 22, marginBottom: 4,
          }}>
            {phase.label}
          </div>
          <div style={{ fontSize: 11, opacity: .8 }}>
            {phase.days}{phase.sub ? ` · ${phase.sub}` : ""}
          </div>
        </div>

        {/* Body */}
        <div className="scroll-body" style={{ flex: 1, padding: "14px 16px 0" }}>
          {/* Description */}
          <div style={{
            fontSize: 13, color: tokens.cocoaMid,
            lineHeight: 1.7, marginBottom: 14,
          }}>
            {phase.desc}
          </div>

          {/* Eat */}
          <div style={{ marginBottom: 12 }}>
            <div style={{
              fontSize: 11, fontWeight: 500, color: tokens.sageDk,
              letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 8,
            }}>
              ✓ {lang === "en" ? "Eat More" : "กินเพิ่ม"}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {phase.eat.map(f => (
                <span key={f} style={{
                  fontSize: 12, padding: "5px 12px", borderRadius: 999,
                  background: tokens.sageLt, color: tokens.sageDk, fontWeight: 500,
                }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Avoid */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 11, fontWeight: 500, color: "#8B4050",
              letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 8,
            }}>
              ✕ {lang === "en" ? "Limit" : "เลี่ยง"}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {phase.avoid.map(f => (
                <span key={f} style={{
                  fontSize: 12, padding: "5px 12px", borderRadius: 999,
                  background: tokens.roseLt, color: "#8B4050", fontWeight: 500,
                }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Calorie range */}
          <div style={{
            background: tokens.lavenderLt,
            border: "1px solid rgba(187,168,196,.3)",
            borderRadius: 14, padding: "10px 14px",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 16,
          }}>
            <span style={{ fontSize: 12, color: tokens.lavenderDk }}>
              {lang === "en" ? "Recommended calories" : "แคลอรี่แนะนำ"}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: tokens.lavenderDk }}>
              {phase.calRange} kcal/day
            </span>
          </div>
        </div>

        {/* Footer — Quiz button */}
        <div style={{
          padding: "12px 16px 16px",
          borderTop: `1px solid ${tokens.borderLt}`,
          background: tokens.creamSoft,
          flexShrink: 0,
        }}>
          <button
            onClick={onQuiz}
            style={{
              width: "100%", padding: "14px",
              background: tokens.cocoa, color: tokens.cream,
              border: "none", borderRadius: 16,
              fontSize: 14, fontWeight: 600,
              fontFamily: "'DM Sans',sans-serif",
              cursor: "pointer",
            }}
            onMouseDown={e => e.currentTarget.style.opacity = ".8"}
            onMouseUp={e => e.currentTarget.style.opacity = "1"}
          >
            🌿 {lang === "en" ? "Retake Hormone Quiz" : "ทำ Hormone Quiz ใหม่"}
          </button>
          <div style={{
            textAlign: "center", fontSize: 11, color: tokens.stone, marginTop: 8,
          }}>
            {lang === "en"
              ? "Update your profile with a new quiz result"
              : "อัปเดตโปรไฟล์ฮอร์โมนของคุณ"}
          </div>
        </div>
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
    currentPhase, navTo, toggleCartItem, cartItems, t,
  } = useApp()

  // เพิ่ม state นี้
  const [showPhaseSheet, setShowPhaseSheet] = React.useState(false)

  const suggestedFoods = PHASE_FOODS[user.currentPhase] ?? PHASE_FOODS.ovulation
  const pickedNames = cartItems.map(f => f.name)

  function handlePickFood(food) {
    toggleCartItem(food)
  }

  return (
    <ScreenWrapper>
      <TopBar user={user} />

      <div className="scroll-body" style={{ flex: 1, paddingBottom: 90 }}>

        {/* Phase Banner — แก้ onPress */}
        <PhaseBanner
          phase={currentPhase}
          cycleDay={user.cycleDay}
          onPress={() => setShowPhaseSheet(true)}
        />

        <StatsStrip totalCal={totalCal} targetCal={user.targetCal} weight={user.weight} />
        <InsightBand phase={currentPhase} />
        <MoodBanner onPress={() => navTo("mood")} />
        <TodayMealCard hormoneType={user.hormoneType ?? "balanced"} />

        <SectionRow
          title={t("home.suggest_today")}
          action={t("home.see_all")}
          onAction={() => navTo("tracker")}
        />
        <FoodRail foods={suggestedFoods} pickedNames={pickedNames} onPick={handlePickFood} />

        <SectionRow
          title={t("home.log_today")}
          action={<AddFoodButton onPress={() => navTo("tracker")} />}
        />
        <FoodLogList log={todayEntries ?? []} />

        <div style={{ height: 16 }} />
      </div>

      {/* Phase Detail Sheet */}
      {showPhaseSheet && (
        <PhaseDetailSheet
          phase={currentPhase}
          onClose={() => setShowPhaseSheet(false)}
          onQuiz={() => {
            setShowPhaseSheet(false)
            navTo("quiz")
          }}
        />
      )}
    </ScreenWrapper>
  )
}