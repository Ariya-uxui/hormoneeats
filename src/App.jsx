import { useState, useEffect, useRef, createContext, useContext } from "react"
import { useLocalStorage, STORAGE_KEYS } from "./hooks/useLocalStorage.js"
import Onboarding   from "./screens/Onboarding.jsx"
import Home         from "./screens/Home.jsx"
import Phases       from "./screens/Phases.jsx"
import Tracker      from "./screens/Tracker.jsx"
import Weight       from "./screens/Weight.jsx"
import Profile      from "./screens/Profile.jsx"
import Foodcalendar  from "./screens/Foodcalendar.jsx"
import HormoneQuiz   from "./screens/HormoneQuiz.jsx"
import MoodTracker   from "./screens/MoodTracker.jsx"

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS — Palette D
═══════════════════════════════════════════════════ */
export const tokens = {
  cream:"#F0EDE6",        creamSoft:"#FAF8F5",    creamDeep:"#E8E4DC",
  lavender:"#BBA8C4",     lavenderLt:"#EDE8F5",   lavenderDk:"#7A6890",
  sage:"#7E9484",         sageLt:"#EAF0EA",       sageDk:"#4A6454",
  cocoa:"#3D2E2A",        cocoaMid:"#5A4A46",
  stone:"#9A9490",        stoneLt:"#C8C4C0",
  border:"#E4E0DA",       borderLt:"#F0EDE8",
  rose:"#D4B8C0",         roseLt:"#F5EEF1",
  gold:"#C4A882",         goldLt:"#F5EDE0",
  follicular:"#A8C4A0",   follicularLt:"#EEF5EC",
  ovulation:"#C4899A",    ovulationLt:"#F5EAF0",
  luteal:"#C4A882",       lutealLt:"#F5EDE0",
  menstrual:"#9EB0C4",    menstrualLt:"#EAF0F5",
}

export const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

/* ═══════════════════════════════════════════════════
   DEFAULT VALUES — used only on first launch
═══════════════════════════════════════════════════ */
const DEFAULT_USER = {
  name:"คุณสาว", gender:"หญิง", age:33,
  height:168, weight:54.0, goalWeight:52.0,
  targetCal:1440, tdee:1740, bmi:19.1,
  currentPhase:"ovulation", cycleDay:14, cycleLength:28,
}

const DEFAULT_WEIGHT_HISTORY = [
  { date:"27 มี.ค. 68", value:54.0, change:-0.3 },
  { date:"19 มี.ค. 68", value:54.3, change:-0.4 },
  { date:"12 มี.ค. 68", value:54.7, change:-0.2 },
  { date:"5 มี.ค. 68",  value:54.9, change:-0.3 },
  { date:"27 ก.พ. 68",  value:55.2, change: null },
]

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
}

const DEFAULT_DIARY = {
  [todayKey()]: [
    { id:1, dateKey:todayKey(), emoji:"🥚", name:"ไข่ต้ม + ผักโขมผัด",   cal:320, protein:22, carb:4,  fat:10, meal:"เช้า",    time:"07:15" },
    { id:2, dateKey:todayKey(), emoji:"☕", name:"กาแฟดำ ไม่หวาน",        cal:5,   protein:0,  carb:0,  fat:0,  meal:"เช้า",    time:"08:30" },
    { id:3, dateKey:todayKey(), emoji:"🐟", name:"ต้มยำกุ้ง + ข้าวกล้อง", cal:495, protein:28, carb:48, fat:8,  meal:"กลางวัน",time:"12:00" },
  ],
}

/* ── NAV ── */
export const NAV_ITEMS = [
  { id:"home",     label:"หน้าหลัก", emoji:"🏠" },
  { id:"calendar", label:"ปฏิทิน",   emoji:"📅" },
  { id:"tracker",  label:"แคลอรี่",  emoji:"🥗" },
  { id:"mood",     label:"อารมณ์",   emoji:"😊" },
  { id:"weight",   label:"น้ำหนัก",  emoji:"📊" },
  { id:"profile",  label:"โปรไฟล์",  emoji:"👤" },
]

/* ── PHASES ── */
export const PHASES = {
  follicular:{
    key:"follicular",label:"Follicular",emoji:"🌱",days:"วัน 1–13",sub:"หลังประจำเดือน",
    color:tokens.follicular,colorLt:tokens.follicularLt,textClr:tokens.sageDk,badge:"พลังสูง",
    desc:"Estrogen ค่อยๆ สูงขึ้น ร่างกายไวต่อ Insulin เผาผลาญดี ออกกำลังกายหนักได้ดีที่สุด",
    eat:["ปลาทูน่า","ไข่","ควินัว","ถั่วเลนทิล","ผักใบเขียว","บรอกโคลี"],
    avoid:["น้ำตาลทราย","แป้งขาว","แอลกอฮอล์"],calRange:"1,400–1,500",
  },
  ovulation:{
    key:"ovulation",label:"Ovulation",emoji:"✨",days:"วัน 14–16",sub:"",
    color:tokens.ovulation,colorLt:tokens.ovulationLt,textClr:"#8B4050",badge:"เผาผลาญสูง",
    desc:"Estrogen สูงสุด + LH surge ร่างกายเผาผลาญดีที่สุดในรอบ พลังงานสูง เหมาะลดน้ำหนักมากที่สุด",
    eat:["อกไก่","บรอกโคลี","อะโวคาโด","เมล็ดแฟลกซ์","เบอรี่"],
    avoid:["ของทอด","นมวัวมาก","น้ำตาลสูง"],calRange:"1,400–1,450",
  },
  luteal:{
    key:"luteal",label:"Luteal",emoji:"🍂",days:"วัน 17–28",sub:"ก่อนประจำเดือน",
    color:tokens.luteal,colorLt:tokens.lutealLt,textClr:"#7A4A28",badge:"ระวังหวาน",
    desc:"Progesterone สูง หิวบ่อย อยากของหวาน น้ำหนักอาจขึ้น 1–2 กก. ชั่วคราวจากน้ำในร่างกาย",
    eat:["มันเทศ","กล้วย","ถั่วดำ","ดาร์กช็อก","ปลา"],
    avoid:["เกลือสูง","คาเฟอีนมาก","แอลกอฮอล์"],calRange:"1,500–1,550",
  },
  menstrual:{
    key:"menstrual",label:"Menstrual",emoji:"🌙",days:"วัน 1–5",sub:"ช่วงประจำเดือน",
    color:tokens.menstrual,colorLt:tokens.menstrualLt,textClr:"#3A5070",badge:"พักฟื้นฟู",
    desc:"ฮอร์โมนทุกตัวอยู่ระดับต่ำ ร่างกายต้องการพักและสารอาหารคุณภาพสูง โดยเฉพาะธาตุเหล็ก",
    eat:["เนื้อแดงไม่ติดมัน","ผักโขม","ขิง","ตับ","ถั่วเขียว"],
    avoid:["ของเย็นจัด","คาเฟอีน","อาหารดิบ"],calRange:"1,450–1,500",
  },
}

/* ── Global CSS ── */
const GLOBAL_CSS=`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  html,body,#root{height:100%;overflow:hidden}
  body{font-family:'DM Sans',sans-serif;background:#E8E4DC;display:flex;align-items:center;justify-content:center}
  .scroll-body{overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;-ms-overflow-style:none;scrollbar-width:none}
  .scroll-body::-webkit-scrollbar{display:none}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp .38s ease both}
  .fade-up:nth-child(1){animation-delay:.04s}.fade-up:nth-child(2){animation-delay:.09s}
  .fade-up:nth-child(3){animation-delay:.14s}.fade-up:nth-child(4){animation-delay:.18s}
  .fade-up:nth-child(5){animation-delay:.22s}.fade-up:nth-child(6){animation-delay:.26s}
  .fade-up:nth-child(7){animation-delay:.30s}.fade-up:nth-child(8){animation-delay:.34s}
  @keyframes slideIn{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}
  .screen-enter{animation:slideIn .28s ease both}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
  @keyframes spinCW{to{transform:rotate(360deg)}}
  @keyframes spinCCW{to{transform:rotate(-360deg)}}
  @keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes spin{to{transform:rotate(360deg)}}
`
function injectGlobalCSS(){
  if(document.getElementById("he-global"))return
  const el=document.createElement("style")
  el.id="he-global";el.textContent=GLOBAL_CSS
  document.head.appendChild(el)
}

/* ── Phone shell ── */
function PhoneShell({children}){
  const[time,setTime]=useState("")
  useEffect(()=>{
    const tick=()=>{
      const d=new Date()
      setTime(`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`)
    }
    tick()
    const id=setInterval(tick,30000)
    return()=>clearInterval(id)
  },[])
  return(
    <div style={{width:390,height:844,background:tokens.creamSoft,borderRadius:52,overflow:"hidden",
      boxShadow:`0 0 0 2px ${tokens.cocoa},0 48px 120px rgba(61,46,42,.28),0 8px 24px rgba(61,46,42,.12)`,
      display:"flex",flexDirection:"column",position:"relative"}}>
      <div style={{height:52,background:tokens.creamSoft,display:"flex",alignItems:"flex-end",
        justifyContent:"space-between",padding:"0 28px 8px",fontSize:12,fontWeight:500,
        color:tokens.cocoa,position:"relative",zIndex:50,flexShrink:0}}>
        <span style={{position:"relative",zIndex:1}}>{time}</span>
        <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",
          width:120,height:32,background:tokens.cocoa,borderRadius:"0 0 22px 22px"}}/>
        <span style={{position:"relative",zIndex:1,fontSize:11,letterSpacing:".04em"}}>●●● 100%</span>
      </div>
      <div style={{flex:1,position:"relative",overflow:"hidden"}}>{children}</div>
    </div>
  )
}

/* ── Bottom nav ── */
function BottomNav({current,onChange}){
  return(
    <nav style={{position:"absolute",bottom:0,left:0,right:0,height:82,
      background:"rgba(250,248,245,.97)",borderTop:`1px solid ${tokens.border}`,
      display:"flex",alignItems:"flex-start",paddingTop:8,zIndex:200,backdropFilter:"blur(16px)"}}>
      {NAV_ITEMS.map(item=>{
        const active=current===item.id
        return(
          <button key={item.id} onClick={()=>onChange(item.id)} style={{flex:1,display:"flex",
            flexDirection:"column",alignItems:"center",gap:3,padding:"4px 0",
            border:"none",background:"transparent",cursor:"pointer",transition:"transform .15s"}}
            onMouseDown={e=>e.currentTarget.style.transform="scale(.9)"}
            onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
            onTouchStart={e=>e.currentTarget.style.transform="scale(.9)"}
            onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>
            <div style={{width:32,height:32,borderRadius:10,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:17,
              background:active?tokens.lavenderLt:"transparent",transition:"background .2s"}}>
              {item.emoji}
            </div>
            <span style={{fontSize:9.5,fontWeight:500,
              color:active?tokens.lavenderDk:tokens.stone,
              letterSpacing:".01em",transition:"color .2s"}}>
              {item.label}
            </span>
            <div style={{width:4,height:4,borderRadius:"50%",
              background:active?tokens.lavenderDk:"transparent",transition:"background .2s"}}/>
          </button>
        )
      })}
    </nav>
  )
}

/* ── Toast ── */
function Toast({message,visible}){
  return(
    <div style={{position:"absolute",bottom:100,left:"50%",
      transform:`translateX(-50%) translateY(${visible?0:10}px)`,
      background:tokens.cocoa,color:tokens.cream,padding:"10px 20px",borderRadius:999,
      fontSize:13,fontWeight:500,whiteSpace:"nowrap",opacity:visible?1:0,
      pointerEvents:"none",transition:"opacity .25s,transform .25s",zIndex:300}}>
      {message}
    </div>
  )
}

/* ── Screen wrapper ── */
export function ScreenWrapper({children,style={}}){
  return(
    <div className="screen-enter" style={{position:"absolute",inset:0,
      display:"flex",flexDirection:"column",background:tokens.cream,...style}}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   APP ROOT — all state persisted via useLocalStorage
═══════════════════════════════════════════════════ */
export default function App(){
  injectGlobalCSS()

  /* ── Navigation (session only — intentional) ── */
  const [screen, setScreen] = useState("quiz")

  /* ── Persistent state ── */
  const [user,          setUser         ] = useLocalStorage(STORAGE_KEYS.user,          DEFAULT_USER)
  const [weightHistory, setWeightHistory] = useLocalStorage(STORAGE_KEYS.weightHistory, DEFAULT_WEIGHT_HISTORY)
  const [foodLog,       setFoodLog      ] = useLocalStorage(STORAGE_KEYS.foodLog,       [])
  const [cartItems,     setCartItems    ] = useLocalStorage(STORAGE_KEYS.cartItems,     [])
  const [diary,         setDiary        ] = useLocalStorage(STORAGE_KEYS.diary,         DEFAULT_DIARY)

  /* ── Toast ── */
  const [toast,    setToast   ] = useState({ msg:"", visible:false })
  const toastTimer              = useRef(null)

  function showToast(msg){
    clearTimeout(toastTimer.current)
    setToast({ msg, visible:true })
    toastTimer.current = setTimeout(()=>setToast(t=>({...t,visible:false})), 2200)
  }

  function navTo(id){ if(id!==screen) setScreen(id) }

  /* ── Quiz complete → save hormone type → onboarding ── */
  function handleQuizComplete({ hormoneType, recommendedPhase }) {
    setUser(u => ({
      ...u,
      hormoneType,
      currentPhase: recommendedPhase ?? u.currentPhase,
    }))
    setScreen("onboarding")
  }

  /* ── Log weight ── */
  function logWeight(value){
    const prev   = weightHistory[0]?.value ?? user.weight
    const change = parseFloat((value-prev).toFixed(1))
    const now    = new Date()
    const mo     = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."]
    const dateStr= `${now.getDate()} ${mo[now.getMonth()]} 68`
    setWeightHistory(h=>[{ date:dateStr, value, change }, ...h])
    setUser(u=>({ ...u, weight:value }))
    showToast(`บันทึกน้ำหนัก ${value.toFixed(1)} กก. แล้ว ✓`)
  }

  /* ════════════════════════════════════════════════
     SINGLE SOURCE OF TRUTH: diary
     ทั้ง Tracker และ Calendar เขียน/อ่าน diary เดียวกัน
     cartItems ยังคงอยู่สำหรับ UI "เลือกอาหาร" ใน Tracker
     แต่เมื่อ toggle → sync ลง diary[today] ทันที
  ════════════════════════════════════════════════ */

  /* ── Toggle cart + sync to diary[today] ── */
  function toggleCartItem(food){
    const tk  = todayKey()
    const now = new Date()
    const hh  = String(now.getHours()).padStart(2,"0")
    const mm  = String(now.getMinutes()).padStart(2,"0")

    setCartItems(prev=>{
      const exists = prev.find(f=>f.name===food.name)
      if(exists){
        /* remove from cart AND diary */
        setDiary(d=>({
          ...d,
          [tk]: (d[tk]??[]).filter(e=>e.name!==food.name || e.source!=="tracker"),
        }))
        showToast("ลบออกแล้ว")
        return prev.filter(f=>f.name!==food.name)
      }
      /* add to cart AND diary */
      const entry = {
        id:       Date.now() + Math.random(),
        dateKey:  tk,
        source:   "tracker",          /* tag เพื่อแยกจาก Calendar entries */
        emoji:    food.emoji ?? "🍽️",
        name:     food.name,
        cal:      food.cal,
        protein:  food.protein ?? 0,
        carb:     food.carb    ?? 0,
        fat:      food.fat     ?? 0,
        fiber:    food.fiber   ?? 0,
        meal:     "แคลอรี่",
        time:     `${hh}:${mm}`,
      }
      setDiary(d=>({
        ...d,
        [tk]: [...(d[tk]??[]), entry],
      }))
      showToast(`เพิ่ม ${food.name} แล้ว ✓`)
      return [...prev, food]
    })
  }

  /* ── Diary entries (Calendar) ── */
  function addDiaryEntry(entry){
    setDiary(prev=>({
      ...prev,
      [entry.dateKey]: [...(prev[entry.dateKey]??[]), entry],
    }))
    showToast(`เพิ่ม ${entry.name} แล้ว ✓`)
  }
  function deleteDiaryEntry(dateKey, id){
    const tk = todayKey()
    setDiary(prev=>({
      ...prev,
      [dateKey]: (prev[dateKey]??[]).filter(e=>e.id!==id),
    }))
    /* if deleted from today & was from tracker, remove from cartItems too */
    setCartItems(prev=>{
      const todayDiary = diary[tk] ?? []
      const removedEntry = todayDiary.find(e=>e.id===id)
      if(removedEntry?.source==="tracker")
        return prev.filter(f=>f.name!==removedEntry.name)
      return prev
    })
    showToast("ลบรายการแล้ว")
  }

  /* ── Computed totals — อ่านจาก diary[today] อย่างเดียว ── */
  const todayEntries = diary[todayKey()] ?? []
  const totalCal     = todayEntries.reduce((s,f)=>s+f.cal,             0)
  const totalProtein = todayEntries.reduce((s,f)=>s+(f.protein??0),    0)
  const totalCarb    = todayEntries.reduce((s,f)=>s+(f.carb??0),       0)
  const totalFat     = todayEntries.reduce((s,f)=>s+(f.fat??0),        0)

  /* ── Context ── */
  const ctx = {
    user, setUser,
    weightHistory, logWeight,
    foodLog, setFoodLog,
    cartItems, toggleCartItem,
    diary, setDiary, addDiaryEntry, deleteDiaryEntry,
    todayEntries,
    totalCal, totalProtein, totalCarb, totalFat,
    navTo, showToast,
    currentPhase: PHASES[user.currentPhase] ?? PHASES.ovulation,
    PHASES, tokens,
  }

  const screens = {
    home:     <Home />,
    calendar: <Foodcalendar />,
    tracker:  <Tracker />,
    mood:     <MoodTracker />,
    weight:   <Weight />,
    profile:  <Profile />,
  }

  return(
    <AppContext.Provider value={ctx}>
      <PhoneShell>
        {screen==="quiz"
          ? <HormoneQuiz onComplete={handleQuizComplete} />
          : screen==="onboarding"
          ? <Onboarding onStart={()=>navTo("home")} />
          : (
            <>
              {screens[screen]??<Home/>}
              <BottomNav current={screen} onChange={navTo}/>
              <Toast message={toast.msg} visible={toast.visible}/>
            </>
          )
        }
      </PhoneShell>
    </AppContext.Provider>
  )
}
