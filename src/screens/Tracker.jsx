import { useState, useEffect, useRef, useCallback } from "react"
import { useApp, ScreenWrapper } from "../App.jsx"
import { FOOD_DB, CUISINES, CATEGORIES, HORMONE_TAGS, searchFoods } from "../data/foodDatabase.js"

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
  const bars = [
    { label:"โปรตีน", val:protein, target:95,  color:tokens.sage  },
    { label:"คาร์บ",  val:carb,    target:160, color:tokens.gold  },
    { label:"ไขมัน",  val:fat,     target:50,  color:tokens.rose  },
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
  if (entries.length === 0) return null

  const remaining = targetCal - totalCal
  const pct = Math.min(100, Math.round(totalCal / targetCal * 100))
  const barColor = pct > 100 ? tokens.rose : pct > 85 ? tokens.gold : tokens.sage

  /* group by meal */
  const byMeal = {}
  entries.forEach(e => {
    const k = e.meal || "อื่นๆ"
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
          บันทึกวันนี้ ({entries.length} รายการ)
        </span>
        <span style={{ fontSize:12, fontWeight:500,
          color: remaining >= 0 ? tokens.sageDk : "#8B4050" }}>
          {remaining >= 0
            ? `เหลือ ${remaining.toLocaleString()} kcal`
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

/* ── Food Card ── */
function FoodCard({ food, isAdded, currentPhaseKey, onToggle, tokens }) {
  const tag        = HORMONE_TAGS[food.hormoneTag] ?? HORMONE_TAGS.neutral
  const isPhaseHit = food.phase?.includes(currentPhaseKey)
  const cuisineFlag = { thai:"🇹🇭", japanese:"🇯🇵", korean:"🇰🇷", western:"🌍" }

  return (
    <div onClick={() => onToggle(food)}
      style={{
        background: isAdded ? tokens.sageLt : tokens.creamSoft,
        border: `1px solid ${isAdded
          ? tokens.sage
          : isPhaseHit ? tokens.lavender
          : tokens.borderLt}`,
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
      {/* Phase highlight badge */}
      {isPhaseHit && !isAdded && (
        <div style={{
          position:"absolute", top:6, right:6,
          width:8, height:8, borderRadius:"50%",
          background:tokens.lavender,
        }} />
      )}

      {/* Top row: hormone tag + cuisine flag */}
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:5 }}>
        <span style={{
          fontSize:9, fontWeight:500, padding:"2px 7px",
          borderRadius:999, background:tag.bg, color:tag.color,
        }}>
          {tag.label}
        </span>
        <span style={{ fontSize:12 }}>{cuisineFlag[food.cuisine] ?? ""}</span>
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

      {/* Hormone note */}
      {food.hormoneNote && (
        <div style={{
          marginTop:6, fontSize:10, color:tag.color,
          background:tag.bg, borderRadius:6, padding:"3px 6px",
          lineHeight:1.4,
        }}>
          {food.hormoneNote}
        </div>
      )}

      {/* Add button */}
      <button style={{
        marginTop:8, width:"100%", padding:"6px",
        border:`1px solid ${isAdded ? tokens.sage : tokens.border}`,
        borderRadius:8,
        background: isAdded ? tokens.sage : "transparent",
        color: isAdded ? "white" : tokens.sageDk,
        fontSize:11, fontWeight:500,
        fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
        transition:"all .15s",
      }}>
        {isAdded ? "✓ เพิ่มแล้ว" : "+ เพิ่ม"}
      </button>
    </div>
  )
}

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
    tokens, currentPhase,
  } = useApp()

  const [search,   setSearch  ] = useState("")
  const [cuisine,  setCuisine ] = useState("all")
  const [category, setCategory] = useState("all")
  const [showPhaseOnly, setShowPhaseOnly] = useState(false)

  const handleSearch = useCallback(v => setSearch(v), [])

  /* Filter foods */
  const filtered = searchFoods(search, cuisine, category).filter(f => {
    if (!showPhaseOnly) return true
    return f.phase?.includes(user.currentPhase) || f.hormoneTag === "boost"
  })

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
          เป้าหมาย {user.targetCal?.toLocaleString() ?? 1440} kcal ·{" "}
          <span style={{ color: remaining > 0 ? tokens.sageDk : "#8B4050" }}>
            {remaining > 0
              ? `เหลือ ${remaining.toLocaleString()} kcal`
              : `เกิน ${Math.abs(remaining).toLocaleString()} kcal`}
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
              placeholder="ค้นหาอาหาร ไทย / Japanese / Korean..."
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

        {/* Phase filter toggle */}
        <div style={{ padding:"8px 16px 0", display:"flex", gap:8, alignItems:"center" }}>
          <div onClick={() => setShowPhaseOnly(v => !v)} style={{
            display:"flex", alignItems:"center", gap:6, cursor:"pointer",
            padding:"6px 12px",
            background: showPhaseOnly ? currentPhase.colorLt : tokens.creamSoft,
            border: `1px solid ${showPhaseOnly ? currentPhase.color : tokens.border}`,
            borderRadius:999, transition:"all .2s",
          }}>
            <div style={{
              width:14, height:14, borderRadius:3,
              border: `1.5px solid ${showPhaseOnly ? currentPhase.color : tokens.stone}`,
              background: showPhaseOnly ? currentPhase.color : "transparent",
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all .2s", flexShrink:0,
            }}>
              {showPhaseOnly && <span style={{ fontSize:9, color:"white", lineHeight:1 }}>✓</span>}
            </div>
            <span style={{
              fontSize:12, fontWeight:500,
              color: showPhaseOnly ? currentPhase.textClr : tokens.stone,
            }}>
              {currentPhase.emoji} แสดงเฉพาะเมนูเฟส {currentPhase.label}
            </span>
          </div>
          <span style={{ fontSize:11, color:tokens.stone }}>
            {filtered.length} รายการ
          </span>
        </div>

        {/* Food Grid */}
        {filtered.length === 0 ? (
          <div style={{ padding:"40px 16px", textAlign:"center",
            color:tokens.stone, fontSize:13 }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>
            ไม่พบอาหารที่ค้นหา
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
                currentPhaseKey={user.currentPhase}
                onToggle={toggleCartItem}
                tokens={tokens}
              />
            ))}
          </div>
        )}

        <div style={{ height:16 }} />
      </div>
    </ScreenWrapper>
  )
}