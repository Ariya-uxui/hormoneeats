import { useState, useEffect, useRef, useCallback } from "react"
import { useApp, ScreenWrapper } from "../App.jsx"
import { CUISINES, CATEGORIES, searchFoods } from "../data/foodDatabase.js"
import { getNutrientFacts, getTreatNote, EFFORT } from "../features/nutrition/foodFacts.js"
 
/* ═══════════════════════════════════════════════════
   TRACKER SCREEN — 100+ foods, 4 cuisines
   ┌─ Header ────────────────────────────────────────┐
   ├─ CalorieRing + MacroBars ───────────────────────┤
   ├─ CartSummary ───────────────────────────────────┤
   ├─ SearchBar ─────────────────────────────────────┤
   ├─ CuisineFilter (ไทย/ญี่ปุ่น/เกาหลี/ตะวันตก) ──┤
   ├─ CategoryFilter ────────────────────────────────┤
   ├─ FoodGrid ──────────────────────────────────────┤
   └─────────────────────────────────────────────────┘
═══════════════════════════════════════════════════ */
 
/* ── Calorie Ring (Canvas) ── */
function CalorieRing({ current, target, tokens }) {
  const canvasRef = useRef(null)
  const pct       = Math.min(1, current / target)
  const ringColor = pct > 1 ? tokens.rose : pct > .85 ? tokens.gold : tokens.sage
 
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr  = window.devicePixelRatio || 1
    const size = 92
    canvas.width  = size * dpr
    canvas.height = size * dpr
    canvas.style.width  = size + "px"
    canvas.style.height = size + "px"
    const ctx = canvas.getContext("2d")
    ctx.scale(dpr, dpr)
    const cx = 46, cy = 46, r = 34, lw = 7
    ctx.clearRect(0, 0, size, size)
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = tokens.border; ctx.lineWidth = lw; ctx.stroke()
    if (pct > 0) {
      ctx.beginPath()
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct)
      ctx.strokeStyle = ringColor; ctx.lineWidth = lw
      ctx.lineCap = "round"; ctx.stroke()
    }
  }, [current, target, tokens, ringColor])
 
  return (
    <div style={{ position:"relative", width:92, height:92, flexShrink:0 }}>
      <canvas ref={canvasRef} />
      <div style={{ position:"absolute", inset:0,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize:20, fontWeight:500, color:tokens.cocoa, lineHeight:1 }}>
          {Math.round(current).toLocaleString()}
        </div>
        <div style={{ fontSize:9, color:tokens.stone, marginTop:2 }}>kcal</div>
      </div>
    </div>
  )
}
 
/* ── Macro Bars ── */
function MacroBars({ protein, carb, fat, tokens }) {
  const { t } = useApp()
  const bars = [
    { label:t("tracker.protein"), val:protein, target:95,  color:tokens.sage  },
    { label:t("tracker.carb"),    val:carb,    target:160, color:tokens.gold  },
    { label:t("tracker.fat"),     val:fat,     target:50,  color:tokens.rose  },
  ]
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:9 }}>
      {bars.map(b => {
        const pct = Math.min(100, Math.round(b.val / b.target * 100))
        return (
          <div key={b.label}>
            <div style={{ display:"flex", justifyContent:"space-between",
              fontSize:11, marginBottom:4 }}>
              <span style={{ color:tokens.cocoaMid }}>{b.label}</span>
              <span style={{ fontWeight:500, color:tokens.cocoa }}>
                {Math.round(b.val)} / {b.target}g
              </span>
            </div>
            <div style={{ height:4, background:tokens.border, borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`,
                background:b.color, borderRadius:2, transition:"width .5s ease" }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
 
/* ── Today's Food Log (from diary) ── */
function TodayLog({ entries, onDelete, totalCal, targetCal, tokens }) {
  const { t, lang } = useApp()
  if (entries.length === 0) return null
 
  const remaining = targetCal - totalCal
  const pct = Math.min(100, Math.round(totalCal / targetCal * 100))
  const barColor = pct > 100 ? tokens.rose : pct > 85 ? tokens.gold : tokens.sage
 
  /* group by meal */
  const byMeal = {}
  entries.forEach(e => {
    const k = e.meal || (lang==="en" ? "Other" : "อื่นๆ")
    if (!byMeal[k]) byMeal[k] = []
    byMeal[k].push(e)
  })
 
  return (
    <div className="fade-up" style={{
      margin:"10px 16px 0",
      background:tokens.creamSoft,
      border:`1px solid ${tokens.borderLt}`,
      borderRadius:18, padding:"12px 14px",
    }}>
      {/* header */}
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:8 }}>
        <span style={{ fontSize:13, fontWeight:500, color:tokens.cocoa }}>
          {t("tracker.title")} ({entries.length})
        </span>
        <span style={{ fontSize:12, fontWeight:500,
          color: remaining >= 0 ? tokens.sageDk : "#8B4050" }}>
          {remaining >= 0
            ? `${t("tracker.remaining")} ${remaining.toLocaleString()} kcal`
            : `เกิน ${Math.abs(remaining).toLocaleString()} kcal`}
        </span>
      </div>
 
      {/* progress bar */}
      <div style={{ height:4, background:tokens.border, borderRadius:2,
        overflow:"hidden", marginBottom:10 }}>
        <div style={{ height:"100%", width:`${pct}%`,
          background:barColor, borderRadius:2, transition:"width .4s ease" }}/>
      </div>
 
      {/* entries grouped by meal */}
      {Object.entries(byMeal).map(([meal, items]) => (
        <div key={meal} style={{ marginBottom:8 }}>
          <div style={{ fontSize:10, fontWeight:500, color:tokens.stone,
            letterSpacing:".05em", textTransform:"uppercase", marginBottom:5 }}>
            {meal} · {items.reduce((s,i)=>s+i.cal,0)} kcal
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {items.map(item => (
              <div key={item.id} style={{
                display:"flex", alignItems:"center", gap:8,
                background:tokens.cream, borderRadius:10,
                padding:"7px 10px",
              }}>
                <span style={{ fontSize:16 }}>{item.emoji}</span>
                <span style={{ flex:1, fontSize:12, color:tokens.cocoa,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {item.name}
                </span>
                <span style={{ fontSize:12, fontWeight:500, color:tokens.sageDk,
                  flexShrink:0 }}>
                  {item.cal} kcal
                </span>
                <button onClick={()=>onDelete(item.dateKey, item.id)}
                  style={{ background:"none", border:"none", cursor:"pointer",
                    fontSize:12, color:tokens.stoneLt, padding:"2px 4px",
                    flexShrink:0, transition:"color .15s" }}
                  onMouseOver={e=>e.currentTarget.style.color="#8B4050"}
                  onMouseOut={e=>e.currentTarget.style.color=tokens.stoneLt}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
 
/* ── Food Card ──
   ป้ายบนการ์ดเป็นข้อเท็จจริงที่คำนวณจากตัวเลข (foodFacts.js) ไม่ใช่ข้อความเรื่องฮอร์โมน
   ขนมแสดงแคลอรี่ต่อหน่วยแบบกลาง ๆ ไม่มีป้ายเตือน ── */
const CUISINE_FLAG = { thai:"🇹🇭", japanese:"🇯🇵", korean:"🇰🇷", western:"🌍", other:"🌐" }

function FoodCard({ food, isAdded, onToggle, tokens }) {
  const { t, lang } = useApp()
  const facts  = getNutrientFacts(food).filter(f => f.level === "high").slice(0, 2)
  const treat  = facts.length === 0 ? getTreatNote(food) : null
  const effort = EFFORT[food.effort]

  return (
    <div onClick={() => onToggle(food)}
      style={{
        background: isAdded ? tokens.sageLt : tokens.creamSoft,
        border: `1px solid ${isAdded ? tokens.sage : tokens.borderLt}`,
        borderRadius:16, padding:"12px",
        cursor:"pointer", transition:"all .18s",
        display:"flex", flexDirection:"column",
        position:"relative", overflow:"hidden",
      }}
      onMouseDown={e=>e.currentTarget.style.transform="scale(.97)"}
      onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
      onTouchStart={e=>e.currentTarget.style.transform="scale(.97)"}
      onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}
    >
      {/* Top row: effort + cuisine flag */}
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:5, minHeight:16 }}>
        {effort ? (
          <span style={{ fontSize:9, fontWeight:500, padding:"2px 7px",
            borderRadius:999, background:tokens.creamDeep, color:tokens.cocoaMid }}>
            {effort.emoji} {lang==="en" ? effort.labelEn : effort.label}
          </span>
        ) : <span />}
        <span style={{ fontSize:12 }}>{CUISINE_FLAG[food.cuisine] ?? ""}</span>
      </div>

      <div style={{ fontSize:22, marginBottom:5 }}>{food.emoji}</div>
      <div style={{ fontSize:12, fontWeight:500, color:tokens.cocoa,
        marginBottom:2, lineHeight:1.3 }}>
        {food.name}
      </div>
      <div style={{ fontSize:10, color:tokens.stone, marginBottom:4 }}>
        {food.nameEn}
      </div>
      <div style={{ fontSize:12, fontWeight:500, color:tokens.sageDk }}>
        {food.cal} kcal
      </div>
      <div style={{ fontSize:10, color:tokens.stone, marginTop:2 }}>
        P {food.protein}g · C {food.carb}g · F {food.fat}g
      </div>

      {/* Nutrition facts (≥20% Thai RDI) */}
      {facts.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6 }}>
          {facts.map(f => (
            <span key={f.key} style={{
              fontSize:10, color:tokens.sageDk, background:tokens.sageLt,
              borderRadius:6, padding:"3px 6px", lineHeight:1.3,
            }}>
              {lang==="en" ? f.labelEn : f.label} · {f.amount} {f.unit}
            </span>
          ))}
        </div>
      )}

      {/* Treat: neutral portion info, no warning */}
      {treat && (
        <div style={{ marginTop:6, fontSize:10, color:tokens.cocoaMid,
          background:tokens.creamDeep, borderRadius:6, padding:"3px 6px", lineHeight:1.4 }}>
          {lang==="en" ? treat.labelEn : treat.label}
        </div>
      )}

      {/* Add button — ดันลงล่างสุดให้การ์ดสูงเท่ากัน และเว้นระยะจากป้าย */}
      <div style={{ marginTop:"auto", paddingTop:8 }}>
      <button style={{
        width:"100%", padding:"6px",
        border:`1px solid ${isAdded ? tokens.sage : tokens.border}`,
        borderRadius:8,
        background: isAdded ? tokens.sage : "transparent",
        color: isAdded ? "white" : tokens.sageDk,
        fontSize:11, fontWeight:500,
        fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
        transition:"all .15s",
      }}>
        {isAdded ? "✓ " + t("common.add") : "+ " + t("common.add")}
      </button>
      </div>
    </div>
  )
}

/* ── Quick filters — ใช้ field ใหม่ใน foodDatabase.js ──
   มังสวิรัติ: นับเฉพาะ diet.vegetarian === true (ไม่แน่ใจ = ไม่แสดง) */
const QUICK_FILTERS = [
  { id:"ready",      emoji:"🛒", label:"ซื้อได้เลย",  labelEn:"Ready to buy", test:f => f.effort === "ready" },
  { id:"vegetarian", emoji:"🌱", label:"มังสวิรัติ",  labelEn:"Vegetarian",   test:f => f.diet?.vegetarian === true },
  { id:"noPork",     emoji:"🚫", label:"ไม่มีหมู",    labelEn:"No pork",      test:f => f.diet?.noPork === true },
  { id:"protein",    emoji:"💪", label:"โปรตีนสูง",   labelEn:"High protein", test:f => getNutrientFacts(f).some(x => x.key==="protein" && x.level==="high") },
  { id:"fiber",      emoji:"🌾", label:"ใยอาหารสูง",  labelEn:"High fiber",   test:f => getNutrientFacts(f).some(x => x.key==="fiber" && x.level==="high") },
]

/* ── Filter Chip ── */
function FilterChip({ label, emoji, active, onClick, tokens }) {
  return (
    <div onClick={onClick} style={{
      flexShrink:0, display:"flex", alignItems:"center", gap:4,
      padding:"6px 12px",
      border:`1px solid ${active ? tokens.cocoa : tokens.border}`,
      borderRadius:999,
      background: active ? tokens.cocoa : tokens.creamSoft,
      color: active ? tokens.cream : tokens.stone,
      fontSize:12, fontWeight:500, cursor:"pointer",
      transition:"all .15s", whiteSpace:"nowrap",
    }}>
      {emoji && <span style={{ fontSize:13 }}>{emoji}</span>}
      {label}
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   TRACKER — main export
═══════════════════════════════════════════════════ */
export default function Tracker() {
  const {
    user, cartItems, toggleCartItem,
    todayEntries, totalCal, totalProtein, totalCarb, totalFat,
    deleteDiaryEntry,
    tokens, t, lang,
  } = useApp()
 
  const [search,   setSearch  ] = useState("")
  const [cuisine,  setCuisine ] = useState("all")
  const [category, setCategory] = useState("all")
  const [quick,    setQuick   ] = useState([])   // id ของ QUICK_FILTERS ที่เลือก (AND กัน)

  function toggleQuick(id) {
    setQuick(q => q.includes(id) ? q.filter(x => x !== id) : [...q, id])
  }
 
  const handleSearch = useCallback(v => setSearch(v), [])
 
  /* Filter foods */
  const activeQuick = QUICK_FILTERS.filter(q => quick.includes(q.id))
  const filtered = searchFoods(search, cuisine, category)
    .filter(f => activeQuick.every(q => q.test(f)))
  const hasEstimates = filtered.some(f => !f.source || f.source.ref === "estimate")
 
  const cartNames = new Set(cartItems.map(f => f.name))
  const remaining = Math.max(0, user.targetCal - totalCal)
 
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
          คำนวณแคลอรี่
        </div>
        <div style={{ fontSize:12, color:tokens.stone }}>
          {t("tracker.target")} {user.targetCal?.toLocaleString() ?? 1440} kcal ·{" "}
          <span style={{ color: remaining > 0 ? tokens.sageDk : "#8B4050" }}>
            {remaining > 0
              ? `${t("tracker.remaining")} ${remaining.toLocaleString()} kcal`
              : `${lang==="en" ? "Over" : "เกิน"} ${Math.abs(remaining).toLocaleString()} kcal`}
          </span>
        </div>
      </div>
 
      <div className="scroll-body" style={{ flex:1, paddingBottom:90 }}>
 
        {/* Ring + Macros */}
        <div className="fade-up" style={{
          margin:"14px 16px 0",
          background:tokens.creamSoft,
          border:`1px solid ${tokens.borderLt}`,
          borderRadius:22, padding:"16px",
          display:"flex", alignItems:"center", gap:16,
        }}>
          <CalorieRing current={totalCal} target={user.targetCal ?? 1440} tokens={tokens} />
          <MacroBars protein={totalProtein} carb={totalCarb} fat={totalFat} tokens={tokens} />
        </div>
 
        {/* Today's log — synced with Calendar */}
        <TodayLog
          entries={todayEntries ?? []}
          onDelete={deleteDiaryEntry}
          totalCal={totalCal}
          targetCal={user.targetCal ?? 1440}
          tokens={tokens}
        />
 
        {/* Search */}
        <div className="fade-up" style={{ padding:"10px 16px 0" }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:12, top:"50%",
              transform:"translateY(-50%)", fontSize:13, pointerEvents:"none" }}>
              🔍
            </span>
            <input
              type="text" value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder={t("tracker.search")}
              style={{
                width:"100%", padding:"11px 36px",
                background:tokens.creamSoft, border:`1px solid ${tokens.border}`,
                borderRadius:14, fontSize:13,
                fontFamily:"'DM Sans',sans-serif", color:tokens.cocoa, outline:"none",
              }}
              onFocus={e => e.target.style.borderColor = tokens.lavender}
              onBlur={e  => e.target.style.borderColor = tokens.border}
            />
            {search && (
              <span onClick={() => setSearch("")}
                style={{ position:"absolute", right:12, top:"50%",
                  transform:"translateY(-50%)", fontSize:13,
                  cursor:"pointer", color:tokens.stone }}>✕</span>
            )}
          </div>
        </div>
 
        {/* Cuisine filter */}
        <div className="fade-up" style={{
          display:"flex", gap:7, padding:"8px 16px 0", overflowX:"auto",
          msOverflowStyle:"none", scrollbarWidth:"none",
        }}>
          {CUISINES.map(c => (
            <FilterChip key={c.id} label={c.label} emoji={c.emoji}
              active={cuisine === c.id}
              onClick={() => setCuisine(c.id)} tokens={tokens} />
          ))}
        </div>
 
        {/* Category filter */}
        <div className="fade-up" style={{
          display:"flex", gap:6, padding:"6px 16px 0", overflowX:"auto",
          msOverflowStyle:"none", scrollbarWidth:"none",
        }}>
          {CATEGORIES.map(c => (
            <FilterChip key={c.id} label={c.label}
              active={category === c.id}
              onClick={() => setCategory(c.id)} tokens={tokens} />
          ))}
        </div>
 
        {/* Quick filters */}
        <div style={{ display:"flex", gap:6, padding:"8px 16px 0", overflowX:"auto",
          msOverflowStyle:"none", scrollbarWidth:"none", alignItems:"center" }}>
          {QUICK_FILTERS.map(q => {
            const on = quick.includes(q.id)
            return (
              <button key={q.id} onClick={() => toggleQuick(q.id)} aria-pressed={on} style={{
                flexShrink:0, display:"flex", alignItems:"center", gap:4,
                padding:"6px 11px", borderRadius:999, whiteSpace:"nowrap",
                border:`1px solid ${on ? tokens.sage : tokens.border}`,
                background: on ? tokens.sageLt : tokens.creamSoft,
                color: on ? tokens.sageDk : tokens.stone,
                fontSize:12, fontWeight:500, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", transition:"all .15s",
              }}>
                <span style={{ fontSize:12 }}>{q.emoji}</span>
                {lang==="en" ? q.labelEn : q.label}
              </button>
            )
          })}
        </div>
        <div style={{ padding:"6px 16px 0", fontSize:11, color:tokens.stone }}>
          {filtered.length} {lang==="en" ? "items" : "รายการ"}
          {quick.includes("vegetarian") && (lang==="en"
            ? " · only dishes known to be meat-free (eggs/dairy allowed)"
            : " · เฉพาะเมนูที่แน่ใจว่าไม่มีเนื้อสัตว์ (กินไข่/นมได้)")}
        </div>

        {/* Food Grid */}
        {filtered.length === 0 ? (
          <div style={{ padding:"40px 16px", textAlign:"center",
            color:tokens.stone, fontSize:13 }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>
            {t("tracker.no_items")}
          </div>
        ) : (
          <div style={{
            display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:8, padding:"8px 16px 0",
          }}>
            {filtered.map(food => (
              <FoodCard
                key={food.id}
                food={food}
                isAdded={cartNames.has(food.name)}
                onToggle={toggleCartItem}
                tokens={tokens}
              />
            ))}
          </div>
        )}
 
        {/* ความโปร่งใสของข้อมูล */}
        {hasEstimates && (
          <div style={{ margin:"12px 16px 0", fontSize:10.5, color:tokens.stone, lineHeight:1.6 }}>
            {lang==="en"
              ? "ⓘ Nutrition values are estimates and haven't been checked against the Thai Food Composition Table yet. \"High\" labels mean at least 20% of the Thai RDI per serving."
              : "ⓘ ค่าโภชนาการเป็นค่าประมาณ ยังไม่ได้ตรวจกับตารางคุณค่าทางโภชนาการอาหารไทย ป้าย \"สูง\" หมายถึงได้อย่างน้อย 20% ของปริมาณที่ควรได้รับต่อวัน (Thai RDI) ต่อ 1 หน่วยบริโภค"}
          </div>
        )}

        <div style={{ height:16 }} />
      </div>
    </ScreenWrapper>
  )
}