import { useState } from "react"
import { useApp, ScreenWrapper } from "../App.jsx"
import { FOOD_DB, CUISINES, searchFoods } from "../data/foodDatabase.js"
 
/* ═══════════════════════════════════════════════════
   FOOD CALENDAR — reads/writes diary from AppContext
   (diary is persisted via localStorage in App.jsx)
═══════════════════════════════════════════════════ */
 
const THAI_MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const THAI_MONTHS_FULL = [
  "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน",
  "พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม",
  "กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",
]
const THAI_MONTHS_SHORT = [
  "ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.",
  "ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค.",
]
const DAY_LABELS = ["อา","จ","อ","พ","พฤ","ศ","ส"]
const MEAL_SLOTS_TH = ["เช้า","กลางวัน","บ่าย","เย็น","ก่อนนอน"]
const MEAL_SLOTS_EN = ["Morning","Lunch","Afternoon","Dinner","Bedtime"]
 
/* ใช้ FOOD_DB จาก foodDatabase.js — เหมือนหน้าแคลอรี่ */
 
/* ── helpers ── */
function toDateKey(year, month, day) {
  return `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`
}
function todayKey() {
  const d = new Date()
  return toDateKey(d.getFullYear(), d.getMonth(), d.getDate())
}
function formatDateThai(dateKey) {
  const [y,m,d] = dateKey.split("-").map(Number)
  return `${d} ${THAI_MONTHS_SHORT[m-1]} ${y+543-2500+68}`
}
function getDaysInMonth(year, month) { return new Date(year, month+1, 0).getDate() }
function getFirstDayOfWeek(year, month) { return new Date(year, month, 1).getDay() }
 
function calBarColor(cal, target) {
  if (!cal) return "transparent"
  const p = cal / target
  if (p <= 0.6)  return "#A8C4A0"
  if (p <= 0.95) return "#C4899A"
  if (p <= 1.1)  return "#C4A882"
  return "#D4B8C0"
}
 
/* ═══════════════════════════════════════════════════
   ADD FOOD MODAL — ใช้ FOOD_DB 147 รายการ เหมือนหน้าแคลอรี่
═══════════════════════════════════════════════════ */
function AddFoodModal({ dateKey, onAdd, onClose, tokens }) {
  const { lang, t } = useApp()
  const MEAL_SLOTS = lang==="en" ? MEAL_SLOTS_EN : MEAL_SLOTS_TH
  const [meal,    setMeal   ] = useState(MEAL_SLOTS_TH[0])
  const [search,  setSearch ] = useState("")
  const [cuisine, setCuisine] = useState("all")
  const [tab,     setTab    ] = useState("db")
  const [custom,  setCustom ] = useState({ name:"", cal:"", emoji:"🍽️" })
 
  /* filter from full DB */
  const filtered = FOOD_DB.filter(f => {
    const matchQ  = !search  || f.name.includes(search) || (f.nameEn||"").toLowerCase().includes(search.toLowerCase())
    const matchCu = cuisine === "all" || f.cuisine === cuisine
    return matchQ && matchCu
  })
 
  function buildEntry(food) {
    const now = new Date()
    return {
      id:      Date.now() + Math.random(),
      dateKey,
      emoji:   food.emoji,
      name:    food.name,
      cal:     food.cal,
      protein: food.protein ?? 0,
      carb:    food.carb    ?? 0,
      fat:     food.fat     ?? 0,
      meal,
      time:    `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`,
    }
  }
 
  function handleAdd(food) { onAdd(buildEntry(food)) }
 
  function handleCustomAdd() {
    const cal = parseInt(custom.cal)
    if (!custom.name.trim() || isNaN(cal) || cal <= 0) return
    onAdd(buildEntry({ emoji:custom.emoji, name:custom.name.trim(), cal, protein:0, carb:0, fat:0 }))
    setCustom({ name:"", cal:"", emoji:"🍽️" })
  }
 
  const cuisineFlag = { thai:"🇹🇭", japanese:"🇯🇵", korean:"🇰🇷", western:"🌍" }
 
  return (
    <div onClick={onClose} style={{
      position:"absolute",inset:0,zIndex:400,
      background:"rgba(61,46,42,.45)",
      display:"flex",alignItems:"flex-end",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",background:tokens.creamSoft,
        borderRadius:"24px 24px 0 0",maxHeight:"80%",
        display:"flex",flexDirection:"column",
        animation:"slideUp .25s ease both",
        marginBottom:"82px",
      }}>
        {/* header */}
        <div style={{
          padding:"14px 20px 12px",
          display:"flex",justifyContent:"space-between",alignItems:"center",
          borderBottom:`1px solid ${tokens.borderLt}`,flexShrink:0,
        }}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:tokens.cocoa}}>
            {t("calendar.add_food")}
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",
            fontSize:18,color:tokens.stone,padding:"4px 8px"}}>✕</button>
        </div>
 
        {/* meal picker */}
        <div style={{display:"flex",gap:6,padding:"8px 16px",overflowX:"auto",flexShrink:0,
          msOverflowStyle:"none",scrollbarWidth:"none"}}>
          {MEAL_SLOTS.map(s=>(
            <button key={tab.id} onClick={()=>setTab(tab.id)} style={{
               flexShrink:0,padding:"5px 12px",
              border:`1px solid ${meal===s?tokens.ovulation:tokens.border}`,borderRadius:999,
              fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
              background:meal===s?tokens.ovulationLt:tokens.cream,
              color:meal===s?"#8B4050":tokens.stone,
            }}>{s}</button>
          ))}
        </div>
 
        {/* tab switcher */}
        <div style={{display:"flex",padding:"0 16px 8px",flexShrink:0,gap:8}}>
          {[{id:"db",label:`🍽️ ${t("calendar.food_list")}`},{id:"custom",label:`✏️ ${t("calendar.custom")}`}].map(tab=>(
            <button key={tab.id} onClick={()=>setTab(tab.id)} style={{
              flex:1,padding:"7px",
              border:`1px solid ${tokens.border}`,
              borderRadius:10,
              background:tab===tab.id?tokens.cocoa:tokens.cream,
              color:tab===tab.id?tokens.cream:tokens.stone,           
              fontSize:12,fontWeight:500,cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",
            }}>{tab.label}</button>
          ))}
        </div>
 
        {/* content */}
        <div style={{flex:1,overflow:"auto",padding:"0 16px 80px"}}>
          {tab==="db" ? (
            <>
              {/* search */}
              <div style={{position:"relative",marginBottom:8}}>
                <span style={{position:"absolute",left:10,top:"50%",
                  transform:"translateY(-50%)",fontSize:12,pointerEvents:"none"}}>🔍</span>
                <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder={lang==="en" ? "Search... Thai / Japanese / Korean" : "ค้นหา... ไทย / Japanese / Korean"}
                  style={{width:"100%",padding:"9px 10px 9px 30px",
                    border:`1px solid ${tokens.border}`,borderRadius:12,
                    fontSize:13,fontFamily:"'DM Sans',sans-serif",
                    color:tokens.cocoa,background:tokens.cream,outline:"none"}}
                  onFocus={e=>e.target.style.borderColor=tokens.lavender}
                  onBlur={e=>e.target.style.borderColor=tokens.border}/>
                {search&&<span onClick={()=>setSearch("")} style={{
                  position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
                  fontSize:12,cursor:"pointer",color:tokens.stone}}>✕</span>}
              </div>
 
              {/* cuisine filter */}
              <div style={{display:"flex",gap:5,marginBottom:10,overflowX:"auto",
                msOverflowStyle:"none",scrollbarWidth:"none"}}>
                {CUISINES.map(cu=>(
                  <button key={cu.id} onClick={()=>setCuisine(cu.id)} style={{
                    flexShrink:0,padding:"4px 10px",
                    border:`1px solid ${cuisine===cu.id?tokens.cocoa:tokens.border}`,
                    borderRadius:999,fontSize:11,fontWeight:500,cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif",
                    background:cuisine===cu.id?tokens.cocoa:tokens.cream,
                    color:cuisine===cu.id?tokens.cream:tokens.stone,
                  }}>{cu.emoji} {lang==="en" ? (cu.labelEn??cu.label) : cu.label}</button>
                ))}
              </div>
 
              {/* result count */}
              <div style={{fontSize:10,color:tokens.stone,marginBottom:6}}>
                {filtered.length} รายการ
              </div>
 
              {/* food list */}
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {filtered.map(f=>(
                  <div key={f.id} onClick={()=>handleAdd(f)} style={{
                    display:"flex",alignItems:"center",gap:10,
                    padding:"9px 12px",background:tokens.cream,
                    border:`1px solid ${tokens.borderLt}`,borderRadius:12,cursor:"pointer",
                    transition:"border-color .15s",
                  }}
                    onMouseOver={e=>e.currentTarget.style.borderColor=tokens.sage}
                    onMouseOut={e=>e.currentTarget.style.borderColor=tokens.borderLt}>
                    <span style={{fontSize:18,width:26,textAlign:"center",flexShrink:0}}>{f.emoji}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:500,color:tokens.cocoa,
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {f.name}
                      </div>
                      <div style={{fontSize:10,color:tokens.stone}}>
                        {cuisineFlag[f.cuisine]??""} · P {f.protein}g C {f.carb}g F {f.fat}g
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:12,fontWeight:500,color:tokens.sageDk}}>{f.cal}</div>
                      <div style={{fontSize:9,color:tokens.stone}}>kcal</div>
                    </div>
                    <span style={{fontSize:11,padding:"3px 8px",borderRadius:999,
                      background:tokens.sageLt,color:tokens.sageDk,flexShrink:0}}>+ เพิ่ม</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"flex",gap:8}}>
                <input type="text" value={custom.emoji}
                  onChange={e=>setCustom(c=>({...c,emoji:e.target.value}))}
                  style={{width:48,padding:"9px 6px",textAlign:"center",
                    border:`1px solid ${tokens.border}`,borderRadius:12,
                    fontSize:18,fontFamily:"'DM Sans',sans-serif",
                    color:tokens.cocoa,background:tokens.cream,outline:"none"}}/>
                <input type="text" value={custom.name}
                  onChange={e=>setCustom(c=>({...c,name:e.target.value}))}
                  placeholder={t("calendar.food_name")}
                  style={{flex:1,padding:"9px 14px",
                    border:`1px solid ${tokens.border}`,borderRadius:12,
                    fontSize:13,fontFamily:"'DM Sans',sans-serif",
                    color:tokens.cocoa,background:tokens.cream,outline:"none"}}/>
              </div>
              <input type="number" value={custom.cal}
                onChange={e=>setCustom(c=>({...c,cal:e.target.value}))}
                placeholder={t("calendar.cal_unit")}
                style={{padding:"9px 14px",border:`1px solid ${tokens.border}`,borderRadius:12,
                  fontSize:13,fontFamily:"'DM Sans',sans-serif",
                  color:tokens.cocoa,background:tokens.cream,outline:"none"}}/>
            </div>
          )}
        </div>
 
        {tab==="custom" && (
          <div style={{
            padding:"10px 16px 16px",
            borderTop:`1px solid ${tokens.borderLt}`,
            background:tokens.creamSoft,
            flexShrink:0,
          }}>
            <button onClick={handleCustomAdd}
              disabled={!custom.name.trim()||!custom.cal}
              style={{
                width:"100%", padding:"13px",
                background:custom.name.trim()&&custom.cal?tokens.cocoa:tokens.border,
                color:custom.name.trim()&&custom.cal?tokens.cream:tokens.stone,
                border:"none",borderRadius:14,fontSize:14,fontWeight:500,
                fontFamily:"'DM Sans',sans-serif",
                cursor:custom.name.trim()&&custom.cal?"pointer":"default",
              }}>
              {t("calendar.add_btn")}
            </button>
          </div>
        )}
 
      </div>
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   CALENDAR GRID
═══════════════════════════════════════════════════ */
function CalendarGrid({ year, month, selectedKey, diary, targetCal, tokens, onSelectDay }) {
  const daysInMonth    = getDaysInMonth(year, month)
  const firstDayOfWeek = getFirstDayOfWeek(year, month)
  const today          = todayKey()
  const cells = Array(firstDayOfWeek).fill(null)
    .concat(Array.from({length:daysInMonth},(_,i)=>i+1))
 
  return (
    <div style={{padding:"0 16px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:4}}>
        {DAY_LABELS.map(d=>(
          <div key={d} style={{textAlign:"center",fontSize:10,color:tokens.stone,
            padding:"4px 0",fontWeight:500}}>{d}</div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
        {cells.map((day,i)=>{
          if(!day) return <div key={`e-${i}`}/>
          const dk       = toDateKey(year,month,day)
          const entries  = diary[dk]??[]
          const cal      = entries.reduce((s,f)=>s+f.cal,0)
          const isToday  = dk===today
          const isSel    = dk===selectedKey
          const isFuture = new Date(dk) > new Date(today)
          const barColor = calBarColor(cal,targetCal)
          return(
            <div key={day} onClick={()=>onSelectDay(dk)} style={{
              borderRadius:10,
              border:`${isSel?2:1}px solid ${isSel?tokens.ovulation:tokens.borderLt}`,
              background:isSel?tokens.ovulationLt:tokens.creamSoft,
              padding:"5px 3px 4px",cursor:"pointer",
              transition:"all .15s",minHeight:44,
              display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              opacity:isFuture?.45:1,
            }}>
              <span style={{fontSize:12,fontWeight:isToday?600:400,lineHeight:1,
                color:isSel?"#8B4050":isToday?tokens.cocoa:tokens.cocoaMid}}>
                {day}
              </span>
              {cal>0&&(
                <div style={{width:"80%",height:3,background:tokens.border,
                  borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",
                    width:`${Math.min(100,Math.round(cal/targetCal*100))}%`,
                    background:barColor,borderRadius:2}}/>
                </div>
              )}
              {cal>0&&(
                <span style={{fontSize:8,fontWeight:500,lineHeight:1,
                  color:barColor==="transparent"?tokens.stoneLt:barColor}}>
                  {cal>=1000?`${(cal/1000).toFixed(1)}k`:cal}
                </span>
              )}
              {isToday&&(
                <div style={{width:4,height:4,borderRadius:"50%",background:tokens.ovulation}}/>
              )}
            </div>
          )
        })}
      </div>
      {/* legend */}
      <div style={{display:"flex",gap:10,marginTop:8,fontSize:9,color:tokens.stone,flexWrap:"wrap"}}>
        {[
          {color:"#A8C4A0",label:"น้อยกว่าเป้า"},
          {color:"#C4899A",label:"ตรงเป้า"},
          {color:"#C4A882",label:"ใกล้เต็ม"},
          {color:"#D4B8C0",label:"เกินเป้า"},
        ].map(l=>(
          <div key={l.label} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:8,height:8,borderRadius:2,background:l.color}}/>
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   DAY SUMMARY
═══════════════════════════════════════════════════ */
function DaySummary({ dateKey, entries, targetCal, tokens }) {
  const { t, lang } = useApp()
  const totalCal = entries.reduce((s,f)=>s+f.cal,0)
  const totalP   = entries.reduce((s,f)=>s+(f.protein??0),0)
  const totalC   = entries.reduce((s,f)=>s+(f.carb??0),0)
  const totalF   = entries.reduce((s,f)=>s+(f.fat??0),0)
  const pct      = Math.min(100,Math.round(totalCal/targetCal*100))
  const remaining= targetCal-totalCal
 
  return(
    <div className="fade-up" style={{margin:"10px 16px 0",background:tokens.creamSoft,
      border:`1px solid ${tokens.borderLt}`,borderRadius:20,padding:"14px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",
        alignItems:"flex-start",marginBottom:10}}>
        <div>
          <div style={{fontSize:13,fontWeight:500,color:tokens.cocoa}}>
            {formatDateThai(dateKey)}
          </div>
          <div style={{fontSize:11,color:tokens.stone,marginTop:2}}>
            {entries.length>0?`${entries.length} ${lang==="en"?"items":"รายการ"}`:t("calendar.no_entries")}
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:22,fontWeight:500,color:tokens.cocoa}}>
            {totalCal.toLocaleString()}
          </div>
          <div style={{fontSize:10,color:tokens.stone}}>
            / {targetCal.toLocaleString()} kcal
          </div>
        </div>
      </div>
      <div style={{height:6,background:tokens.border,borderRadius:3,overflow:"hidden",marginBottom:8}}>
        <div style={{height:"100%",width:`${pct}%`,
          background:calBarColor(totalCal,targetCal),borderRadius:3,transition:"width .5s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:10}}>
        <span style={{color:tokens.stone}}>{pct}% ของเป้าหมาย</span>
        <span style={{fontWeight:500,color:remaining>=0?tokens.sageDk:"#8B4050"}}>
          {remaining>=0 ? `${lang==="en"?"Left":"เหลือ"} ${remaining.toLocaleString()} kcal` : `${lang==="en"?"Over":"เกิน"} ${Math.abs(remaining).toLocaleString()} kcal`}
        </span>
      </div>
      {(totalP>0||totalC>0||totalF>0)&&(
        <div style={{display:"flex",background:tokens.cream,borderRadius:10,overflow:"hidden"}}>
          {[
            {label:"โปรตีน",val:totalP,color:tokens.sage},
            {label:"คาร์บ",  val:totalC,color:tokens.gold},
            {label:"ไขมัน",  val:totalF,color:tokens.rose},
          ].map((m,i)=>(
            <div key={m.label} style={{flex:1,padding:"8px 6px",textAlign:"center",
              borderLeft:i>0?`1px solid ${tokens.borderLt}`:"none"}}>
              <div style={{fontSize:13,fontWeight:500,color:m.color}}>{m.val}g</div>
              <div style={{fontSize:9,color:tokens.stone,marginTop:2}}>{m.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   FOOD ENTRY LIST
═══════════════════════════════════════════════════ */
function FoodEntryList({ dateKey, entries, onDelete, tokens }) {const { t } = useApp()
  if(entries.length===0){
    return(
      <div style={{padding:"24px 16px",textAlign:"center",color:tokens.stone,fontSize:13}}>
        <div style={{fontSize:28,marginBottom:8}}>🍽️</div>
        {t("calendar.no_entries")}
      </div>
    )
  }
  const byMeal = {}
  entries.forEach(e=>{
    const k = e.meal||(typeof lang!=="undefined"&&lang==="en"?"Other":"อื่นๆ")
    if(!byMeal[k]) byMeal[k]=[]
    byMeal[k].push(e)
  })
  return(
    <div style={{padding:"0 16px"}}>
      {Object.entries(byMeal).map(([mealName,items])=>(
        <div key={mealName} style={{marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:500,letterSpacing:".06em",
            textTransform:"uppercase",color:tokens.stone,marginBottom:6,marginTop:10}}>
            {mealName} · {items.reduce((s,i)=>s+i.cal,0)} kcal
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {items.map(item=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,
                background:tokens.creamSoft,border:`1px solid ${tokens.borderLt}`,
                borderRadius:12,padding:"9px 12px"}}>
                <span style={{fontSize:20,width:32,height:32,background:tokens.cream,
                  borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",
                  flexShrink:0}}>
                  {item.emoji}
                </span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500,color:tokens.cocoa,
                    whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                    {item.name}
                  </div>
                  <div style={{fontSize:10,color:tokens.stone,marginTop:2}}>
                    {item.time}{item.meal?` · ${item.meal}`:""}
                    {item.protein>0?` · P ${item.protein}g`:""}
                  </div>
                </div>
                <div style={{fontSize:13,fontWeight:500,color:tokens.sageDk,flexShrink:0}}>
                  {item.cal} kcal
                </div>
                <button onClick={()=>onDelete(dateKey,item.id)} style={{
                  background:"none",border:"none",cursor:"pointer",
                  fontSize:14,color:tokens.stoneLt,padding:"4px",flexShrink:0,
                  transition:"color .15s"}}
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
 
/* ═══════════════════════════════════════════════════
   MONTHLY SUMMARY
═══════════════════════════════════════════════════ */
function MonthlySummary({ year, month, diary, targetCal, tokens }) {
  const { lang } = useApp()
  const days    = getDaysInMonth(year,month)
  const allCals = Array.from({length:days},(_,i)=>{
    const dk = toDateKey(year,month,i+1)
    return (diary[dk]??[]).reduce((s,f)=>s+f.cal,0)
  }).filter(c=>c>0)
  if(allCals.length===0) return null
  const avgCal       = Math.round(allCals.reduce((a,b)=>a+b,0)/allCals.length)
  const daysOnTarget = allCals.filter(c=>c>=targetCal*.8&&c<=targetCal*1.1).length
  return(
    <div className="fade-up" style={{margin:"10px 16px 0",background:tokens.lavenderLt,
      border:"0.5px solid rgba(187,168,196,.3)",borderRadius:16,padding:"12px 14px",
      display:"flex",gap:0}}>
      {[
        {val:allCals.length,            label:"วันที่บันทึก",   color:tokens.lavenderDk},
        {val:avgCal.toLocaleString(),   label:"kcal เฉลี่ย/วัน",color:tokens.lavenderDk},
        {val:daysOnTarget,              label:"วันตรงเป้า",     color:tokens.sageDk    },
      ].map((s,i)=>(
        <div key={s.label} style={{flex:1,textAlign:"center",
          borderLeft:i>0?"1px solid rgba(187,168,196,.3)":"none"}}>
          <div style={{fontSize:18,fontWeight:500,color:s.color}}>{s.val}</div>
          <div style={{fontSize:9,color:tokens.lavenderDk,marginTop:3,lineHeight:1.3}}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}
 
/* ═══════════════════════════════════════════════════
   FOOD CALENDAR — main export
═══════════════════════════════════════════════════ */
export default function Foodcalendar() {
  /* ── Pull diary + helpers from context (localStorage-backed) ── */
  const { user, diary, addDiaryEntry, deleteDiaryEntry, tokens, t, lang } = useApp()
 
  const today = new Date()
  const [viewYear,    setViewYear   ] = useState(today.getFullYear())
  const [viewMonth,   setViewMonth  ] = useState(today.getMonth())
  const [selectedKey, setSelectedKey] = useState(todayKey())
  const [showModal,   setShowModal  ] = useState(false)
 
  const selectedEntries = diary[selectedKey] ?? []
 
  function prevMonth() {
    if(viewMonth===0){setViewMonth(11);setViewYear(y=>y-1)}
    else setViewMonth(m=>m-1)
  }
  function nextMonth() {
    const t=new Date()
    if(viewYear>t.getFullYear()||(viewYear===t.getFullYear()&&viewMonth>=t.getMonth())) return
    if(viewMonth===11){setViewMonth(0);setViewYear(y=>y+1)}
    else setViewMonth(m=>m+1)
  }
 
  function handleAdd(entry) {
    addDiaryEntry(entry)   /* ← writes to context → localStorage */
    setShowModal(false)
  }
 
  return(
    <ScreenWrapper>
      {/* Header */}
      <div className="fade-up" style={{background:tokens.creamSoft,
        padding:"16px 20px 14px",borderBottom:`1px solid ${tokens.borderLt}`,flexShrink:0}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:tokens.cocoa,marginBottom:2}}>
          ปฏิทินอาหาร
        </div>
        <div style={{fontSize:12,color:tokens.stone}}>{lang==="en" ? "Daily food log · calories per day" : "บันทึกอาหารรายวัน · แคลอรี่ต่อวัน"}</div>
      </div>
 
      <div className="scroll-body" style={{flex:1,paddingBottom:160}}>
 
        {/* Month navigator */}
        <div className="fade-up" style={{display:"flex",justifyContent:"space-between",
          alignItems:"center",padding:"14px 20px 10px"}}>
          <button onClick={prevMonth} style={{background:"none",
            border:`1px solid ${tokens.border}`,borderRadius:10,
            padding:"6px 12px",fontSize:16,color:tokens.stone,cursor:"pointer"}}>‹</button>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:tokens.cocoa}}>
              {lang==="en" ? THAI_MONTHS_EN[viewMonth] : THAI_MONTHS_FULL[viewMonth]}
            </div>
            <div style={{fontSize:11,color:tokens.stone,marginTop:2}}>{viewYear+543}</div>
          </div>
          <button onClick={nextMonth} style={{background:"none",
            border:`1px solid ${tokens.border}`,borderRadius:10,
            padding:"6px 12px",fontSize:16,cursor:"pointer",
            color:(viewYear===today.getFullYear()&&viewMonth>=today.getMonth())
              ?tokens.stoneLt:tokens.stone}}>›</button>
        </div>
 
        {/* Grid */}
        <div className="fade-up">
          <CalendarGrid year={viewYear} month={viewMonth}
            selectedKey={selectedKey} diary={diary}
            targetCal={user.targetCal} tokens={tokens}
            onSelectDay={setSelectedKey}/>
        </div>
 
        <MonthlySummary year={viewYear} month={viewMonth}
          diary={diary} targetCal={user.targetCal} tokens={tokens}/>
 
        <DaySummary dateKey={selectedKey} entries={selectedEntries}
          targetCal={user.targetCal} tokens={tokens}/>
 
        {/* Add button */}
        <div style={{padding:"10px 16px 0"}}>
          <button onClick={()=>setShowModal(true)} style={{
            width:"100%",padding:"13px",
            background:tokens.cocoa,color:tokens.cream,
            border:"none",borderRadius:16,fontSize:14,fontWeight:500,
            fontFamily:"'DM Sans',sans-serif",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          }}
            onMouseDown={e=>e.currentTarget.style.opacity=".8"}
            onMouseUp={e=>e.currentTarget.style.opacity="1"}>
            <span style={{fontSize:16}}>+</span>
            {t("calendar.add_food")} {formatDateThai(selectedKey)}
          </button>
        </div>
 
        <div style={{marginTop:4}}>
          <FoodEntryList dateKey={selectedKey} entries={selectedEntries}
            onDelete={deleteDiaryEntry} tokens={tokens}/>
        </div>
 
        <div style={{height:16}}/>
      </div>
 
      {showModal&&(
        <AddFoodModal dateKey={selectedKey}
          onAdd={handleAdd} onClose={()=>setShowModal(false)} tokens={tokens}/>
      )}
    </ScreenWrapper>
  )
}