import { useState } from "react"
import { useApp, ScreenWrapper } from "../App.jsx"
import { clearAppStorage } from "../hooks/useLocalStorage.js"

function calcTDEE(weight, height, age, gender, activity) {
  const bmr = gender === "หญิง"
    ? 655 + 9.563 * weight + 1.85 * height - 4.676 * age
    : 66  + 13.75 * weight + 5.003 * height - 6.775 * age
  const f = { 1:1.2, 2:1.375, 3:1.55, 4:1.725, 5:1.9 }
  return Math.round(bmr * (f[+activity] ?? 1.375))
}
function calcBMI(weight, height) {
  return parseFloat((weight / ((height / 100) ** 2)).toFixed(1))
}
function calcTargetCal(tdee, goal) {
  if (goal === "lose_fast") return Math.max(1200, tdee - 500)
  if (goal === "lose_slow") return Math.max(1200, tdee - 250)
  if (goal === "maintain")  return tdee
  if (goal === "gain")      return tdee + 300
  return Math.max(1200, tdee - 300)
}
function bmiCat(bmi) {
  if (bmi < 18.5) return { label:"น้อยกว่าเกณฑ์", color:"#9EB0C4" }
  if (bmi < 25)   return { label:"ปกติ",           color:"#A8C4A0" }
  if (bmi < 30)   return { label:"น้ำหนักเกิน",    color:"#C4A882" }
  return             { label:"อ้วน",               color:"#D4B8C0" }
}
const ACTIVITY_OPTS = [
  { val:"1", label:"นั่งทำงาน ไม่ค่อยขยับ"         },
  { val:"2", label:"ออกกำลังกาย 1–3×/สัปดาห์"      },
  { val:"3", label:"ออกกำลังกาย 3–5×/สัปดาห์"      },
  { val:"4", label:"ออกกำลังกายหนัก 6–7×/สัปดาห์" },
  { val:"5", label:"นักกีฬา / งานหนักมาก"           },
]
const GOAL_OPTS = [
  { val:"lose_fast", label:"ลดเร็ว (−500 kcal/วัน)"          },
  { val:"lose_slow", label:"ลดช้าๆ ยั่งยืน (−250 kcal/วัน)"  },
  { val:"maintain",  label:"รักษาน้ำหนัก"                    },
  { val:"gain",      label:"เพิ่มกล้ามเนื้อ (+300 kcal/วัน)"  },
]
const PHASE_OPTS = [
  { val:"follicular", label:"🌱 Follicular (วัน 1–13)" },
  { val:"ovulation",  label:"✨ Ovulation (วัน 14–16)" },
  { val:"luteal",     label:"🍂 Luteal (วัน 17–28)"    },
  { val:"menstrual",  label:"🌙 Menstrual (วัน 1–5)"   },
]

function InfoRow({ label, value, accent, isLast, tokens }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"12px 16px", borderBottom:isLast?"none":`1px solid ${tokens.borderLt}` }}>
      <span style={{ fontSize:13, color:tokens.cocoa }}>{label}</span>
      <span style={{ fontSize:13, fontWeight:500, color:accent??tokens.lavenderDk }}>{value}</span>
    </div>
  )
}
function Card({ children, tokens }) {
  return (
    <div style={{ background:tokens.creamSoft, border:`1px solid ${tokens.borderLt}`,
      borderRadius:20, overflow:"hidden", marginBottom:10 }}>
      {children}
    </div>
  )
}
function SecLabel({ text, tokens }) {
  return (
    <div style={{ fontSize:10, fontWeight:500, letterSpacing:".08em",
      textTransform:"uppercase", color:tokens.stone,
      marginBottom:10, marginTop:6,
      paddingBottom:6, borderBottom:`1px solid ${tokens.borderLt}` }}>
      {text}
    </div>
  )
}
function BMIScale({ bmi, tokens }) {
  const zones = [
    { range:[14,18.5],color:"#9EB0C4" },{ range:[18.5,25],color:"#A8C4A0" },
    { range:[25,30],  color:"#C4A882" },{ range:[30,40],  color:"#D4B8C0" },
  ]
  const clamp=Math.min(38,Math.max(15,bmi)), pct=((clamp-14)/26)*100, cat=bmiCat(bmi)
  return (
    <div style={{ background:tokens.creamSoft, border:`1px solid ${tokens.borderLt}`,
      borderRadius:20, padding:"14px 16px", marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:10 }}>
        <span style={{ fontSize:13, fontWeight:500, color:tokens.cocoa }}>BMI</span>
        <span style={{ fontSize:13, fontWeight:500, padding:"3px 10px",
          borderRadius:999, background:cat.color+"35", color:tokens.cocoaMid }}>
          {bmi} · {cat.label}
        </span>
      </div>
      <div style={{ position:"relative", height:10, display:"flex", gap:2 }}>
        {zones.map((z,i)=>(
          <div key={i} style={{ flex:z.range[1]-z.range[0], background:z.color, opacity:.65,
            borderRadius:i===0?"5px 0 0 5px":i===3?"0 5px 5px 0":0 }}/>
        ))}
        <div style={{ position:"absolute", left:`${pct}%`, top:"50%",
          transform:"translate(-50%,-50%)", width:16, height:16, borderRadius:"50%",
          background:tokens.cocoa, border:`2px solid ${tokens.creamSoft}`, zIndex:1 }}/>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between",
        marginTop:5, fontSize:8, color:tokens.stone }}>
        <span>14</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
      </div>
    </div>
  )
}
function GoalProgress({ weight, goalWeight, tokens }) {
  const start=55.2, diff=start-(+goalWeight), done=start-(+weight)
  const pct=diff>0?Math.min(100,Math.max(0,Math.round(done/diff*100))):100
  return (
    <div style={{ background:tokens.creamSoft, border:`1px solid ${tokens.borderLt}`,
      borderRadius:20, padding:"14px 16px", marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:8 }}>
        <span style={{ fontSize:13, fontWeight:500, color:tokens.cocoa }}>ความคืบหน้า</span>
        <span style={{ fontSize:13, fontWeight:500, color:tokens.sageDk }}>{pct}%</span>
      </div>
      <div style={{ height:8, background:tokens.border, borderRadius:4,
        overflow:"hidden", marginBottom:8 }}>
        <div style={{ height:"100%", width:`${pct}%`, background:tokens.sage, borderRadius:4 }}/>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between",
        fontSize:11, color:tokens.stone }}>
        <span>เริ่ม {start.toFixed(1)} กก.</span>
        <span style={{ color:tokens.sageDk }}>ลดไปแล้ว {Math.max(0,done).toFixed(1)} กก.</span>
        <span>เป้า {(+goalWeight).toFixed(1)} กก.</span>
      </div>
    </div>
  )
}
function ResetConfirm({ onConfirm, onClose, tokens }) {
  return (
    <div onClick={onClose} style={{ position:"absolute", inset:0, zIndex:500,
      background:"rgba(61,46,42,.5)", display:"flex", alignItems:"center",
      justifyContent:"center", padding:"0 24px" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:tokens.creamSoft,
        borderRadius:22, padding:"24px 20px", width:"100%" }}>
        <div style={{ fontSize:28, textAlign:"center", marginBottom:12 }}>⚠️</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18,
          color:tokens.cocoa, textAlign:"center", marginBottom:8 }}>รีเซ็ตข้อมูลทั้งหมด?</div>
        <div style={{ fontSize:13, color:tokens.stone, textAlign:"center",
          lineHeight:1.6, marginBottom:20 }}>ข้อมูลทุกอย่างจะถูกลบ ไม่สามารถกู้คืนได้</div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:"12px",
            background:"transparent", color:tokens.stone, border:`1px solid ${tokens.border}`,
            borderRadius:14, fontSize:14, fontWeight:500,
            fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>ยกเลิก</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"12px",
            background:"#8B4050", color:"white", border:"none", borderRadius:14,
            fontSize:14, fontWeight:500, fontFamily:"'DM Sans',sans-serif",
            cursor:"pointer" }}>รีเซ็ต</button>
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const { user, setUser, currentPhase, tokens, showToast } = useApp()
  const [editMode,  setEditMode ] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [form,      setForm     ] = useState({})

  function startEdit() {
    setForm({
      name:         user.name          ?? "คุณสาว",
      gender:       user.gender        ?? "หญิง",
      age:          String(user.age    ?? 30),
      height:       String(user.height ?? 160),
      weight:       String(user.weight ?? 55),
      goalWeight:   String(user.goalWeight  ?? 52),
      activity:     String(user.activity    ?? 2),
      goal:         user.goal          ?? "lose_slow",
      currentPhase: user.currentPhase  ?? "ovulation",
      cycleDay:     String(user.cycleDay    ?? 14),
      cycleLength:  String(user.cycleLength ?? 28),
    })
    setEditMode(true)
  }

  const pBMI    = editMode ? calcBMI(+form.weight,+form.height) : (user.bmi ?? calcBMI(user.weight,user.height))
  const pTDEE   = editMode ? calcTDEE(+form.weight,+form.height,+form.age,form.gender,+form.activity) : (user.tdee??1740)
  const pTarget = editMode ? calcTargetCal(pTDEE,form.goal) : (user.targetCal??1440)

  function set(k,v) { setForm(f=>({...f,[k]:v})) }

  function handleSave() {
    setUser({
      ...user,
      name:form.name.trim()||user.name, gender:form.gender,
      age:+form.age, height:+form.height, weight:+form.weight,
      goalWeight:+form.goalWeight, activity:+form.activity,
      goal:form.goal, currentPhase:form.currentPhase,
      cycleDay:+form.cycleDay, cycleLength:+form.cycleLength,
      bmi:pBMI, tdee:pTDEE, targetCal:pTarget,
    })
    setEditMode(false)
    showToast("บันทึกโปรไฟล์แล้ว ✓")
  }

  const inp = { width:"100%", padding:"11px 13px",
    border:`1px solid ${tokens.border}`, borderRadius:12,
    fontSize:14, fontFamily:"'DM Sans',sans-serif",
    color:tokens.cocoa, background:tokens.cream, outline:"none" }
  const lbl = { fontSize:11, fontWeight:500, color:tokens.stone,
    letterSpacing:".04em", textTransform:"uppercase", display:"block", marginBottom:6 }
  const row = { marginBottom:14 }

  const goalOpt = GOAL_OPTS.find(o=>o.val===(user.goal??"lose_slow"))??GOAL_OPTS[1]
  const actOpt  = ACTIVITY_OPTS.find(o=>o.val===String(user.activity??2))??ACTIVITY_OPTS[1]

  return (
    <ScreenWrapper>
      {/* ── TOP HEADER (always fixed) ── */}
      <div style={{ background:tokens.creamSoft, borderBottom:`1px solid ${tokens.borderLt}`,
        flexShrink:0, zIndex:10 }}>

        {/* Avatar row */}
        <div style={{ padding:"16px 16px 12px", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:52, height:52, borderRadius:"50%",
            background:tokens.lavenderLt, border:`2.5px solid ${tokens.rose}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24, flexShrink:0 }}>🌸</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:"'Playfair Display',serif",
              fontSize:19, color:tokens.cocoa, marginBottom:2 }}>
              {editMode ? (form.name||"คุณสาว") : user.name}
            </div>
            <div style={{ fontSize:11, color:tokens.stone }}>
              {currentPhase.emoji} {currentPhase.label} · วันที่ {user.cycleDay}
            </div>
          </div>
          {!editMode
            ? <button onClick={startEdit} style={{
                background:tokens.lavenderLt, border:`1px solid ${tokens.lavender}`,
                borderRadius:12, padding:"8px 16px", fontSize:13, fontWeight:500,
                color:tokens.lavenderDk, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", flexShrink:0 }}>
                ✏️ แก้ไข
              </button>
            : <button onClick={()=>setEditMode(false)} style={{
                background:"transparent", border:`1px solid ${tokens.border}`,
                borderRadius:12, padding:"8px 14px", fontSize:13, color:tokens.stone,
                cursor:"pointer", fontFamily:"'DM Sans',sans-serif", flexShrink:0 }}>
                ยกเลิก
              </button>
          }
        </div>

        {/* ════ 💾 SAVE BUTTON — visible whenever editMode ════ */}
        {editMode && (
          <div style={{ padding:"0 16px 12px" }}>
            <button onClick={handleSave} style={{
              width:"100%", padding:"14px",
              background:"#3D2E2A", color:"#FAF8F5",
              border:"none", borderRadius:16,
              fontSize:16, fontWeight:600,
              fontFamily:"'DM Sans',sans-serif",
              cursor:"pointer", letterSpacing:".01em",
              boxShadow:"0 4px 16px rgba(61,46,42,.25)",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}
              onMouseDown={e=>e.currentTarget.style.transform="scale(.98)"}
              onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
              onTouchStart={e=>e.currentTarget.style.transform="scale(.98)"}
              onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}
            >
              💾  บันทึกโปรไฟล์
            </button>
          </div>
        )}

        {/* Live preview strip */}
        {editMode && (
          <div style={{ display:"flex", background:tokens.lavenderLt,
            borderTop:`1px solid rgba(187,168,196,.2)`, padding:"8px 0" }}>
            {[
              { l:"BMI",      v:pBMI,                            c:bmiCat(pBMI).color  },
              { l:"TDEE",     v:pTDEE.toLocaleString()+" kcal",  c:tokens.lavenderDk   },
              { l:"เป้า/วัน",v:pTarget.toLocaleString()+" kcal", c:tokens.sageDk       },
            ].map((s,i)=>(
              <div key={s.l} style={{ flex:1, textAlign:"center",
                borderLeft:i>0?"1px solid rgba(187,168,196,.3)":"none" }}>
                <div style={{ fontSize:13, fontWeight:500, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:9, color:tokens.lavenderDk, marginTop:1 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Badges (view mode) */}
        {!editMode && (
          <div style={{ display:"flex", gap:6, padding:"0 16px 14px", flexWrap:"wrap" }}>
            {[
              { t:`BMI ${user.bmi??pBMI}`,                                bg:tokens.lavenderLt, c:tokens.lavenderDk },
              { t:`TDEE ${(user.tdee??1740).toLocaleString()} kcal`,      bg:tokens.sageLt,     c:tokens.sageDk     },
              { t:`เป้า ${(user.targetCal??1440).toLocaleString()} kcal`, bg:tokens.goldLt,     c:"#7A5030"         },
            ].map((b,i)=>(
              <span key={i} style={{ fontSize:11, fontWeight:500, padding:"4px 12px",
                borderRadius:999, background:b.bg, color:b.c }}>{b.t}</span>
            ))}
          </div>
        )}
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="scroll-body" style={{ flex:1, padding:"14px 16px", paddingBottom:90 }}>

        {editMode ? (
          /* ──── EDIT FORM ──── */
          <div>
            <SecLabel text="ข้อมูลพื้นฐาน" tokens={tokens}/>
            <div style={row}>
              <label style={lbl}>ชื่อ</label>
              <input style={inp} value={form.name} onChange={e=>set("name",e.target.value)}
                onFocus={e=>e.target.style.borderColor=tokens.lavender}
                onBlur={e=>e.target.style.borderColor=tokens.border}/>
            </div>
            <div style={{...row,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <label style={lbl}>เพศ</label>
                <select style={{...inp,cursor:"pointer"}} value={form.gender} onChange={e=>set("gender",e.target.value)}>
                  <option>หญิง</option><option>ชาย</option>
                </select>
              </div>
              <div>
                <label style={lbl}>อายุ (ปี)</label>
                <input style={inp} type="number" min="10" max="100" value={form.age}
                  onChange={e=>set("age",e.target.value)}
                  onFocus={e=>e.target.style.borderColor=tokens.lavender}
                  onBlur={e=>e.target.style.borderColor=tokens.border}/>
              </div>
            </div>
            <div style={{...row,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <label style={lbl}>ส่วนสูง (ซม.)</label>
                <input style={inp} type="number" min="100" max="250" value={form.height}
                  onChange={e=>set("height",e.target.value)}
                  onFocus={e=>e.target.style.borderColor=tokens.lavender}
                  onBlur={e=>e.target.style.borderColor=tokens.border}/>
              </div>
              <div>
                <label style={lbl}>น้ำหนัก (กก.)</label>
                <input style={inp} type="number" min="20" max="300" step="0.1" value={form.weight}
                  onChange={e=>set("weight",e.target.value)}
                  onFocus={e=>e.target.style.borderColor=tokens.lavender}
                  onBlur={e=>e.target.style.borderColor=tokens.border}/>
              </div>
            </div>

            <SecLabel text="เป้าหมาย" tokens={tokens}/>
            <div style={row}>
              <label style={lbl}>น้ำหนักเป้าหมาย (กก.)</label>
              <input style={inp} type="number" min="20" max="300" step="0.1" value={form.goalWeight}
                onChange={e=>set("goalWeight",e.target.value)}
                onFocus={e=>e.target.style.borderColor=tokens.sage}
                onBlur={e=>e.target.style.borderColor=tokens.border}/>
            </div>
            <div style={row}>
              <label style={lbl}>เป้าหมายการกิน</label>
              <select style={{...inp,cursor:"pointer"}} value={form.goal} onChange={e=>set("goal",e.target.value)}>
                {GOAL_OPTS.map(o=><option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
            </div>
            <div style={row}>
              <label style={lbl}>ระดับการออกกำลังกาย</label>
              <select style={{...inp,cursor:"pointer"}} value={form.activity} onChange={e=>set("activity",e.target.value)}>
                {ACTIVITY_OPTS.map(o=><option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
            </div>

            <SecLabel text="รอบฮอร์โมน" tokens={tokens}/>
            <div style={row}>
              <label style={lbl}>เฟสปัจจุบัน</label>
              <select style={{...inp,cursor:"pointer"}} value={form.currentPhase} onChange={e=>set("currentPhase",e.target.value)}>
                {PHASE_OPTS.map(o=><option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
            </div>
            <div style={{...row,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <label style={lbl}>วันที่ในรอบ</label>
                <input style={inp} type="number" min="1" max="40" value={form.cycleDay}
                  onChange={e=>set("cycleDay",e.target.value)}
                  onFocus={e=>e.target.style.borderColor=tokens.lavender}
                  onBlur={e=>e.target.style.borderColor=tokens.border}/>
              </div>
              <div>
                <label style={lbl}>ความยาวรอบ (วัน)</label>
                <input style={inp} type="number" min="21" max="40" value={form.cycleLength}
                  onChange={e=>set("cycleLength",e.target.value)}
                  onFocus={e=>e.target.style.borderColor=tokens.lavender}
                  onBlur={e=>e.target.style.borderColor=tokens.border}/>
              </div>
            </div>

            {/* Save at bottom of form too */}
            <button onClick={handleSave} style={{
              width:"100%", padding:"14px", marginTop:8,
              background:"#3D2E2A", color:"#FAF8F5",
              border:"none", borderRadius:16, fontSize:15, fontWeight:600,
              fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
            }}>
              💾 บันทึกโปรไฟล์
            </button>
          </div>

        ) : (
          /* ──── VIEW MODE ──── */
          <div>
            <GoalProgress weight={user.weight} goalWeight={user.goalWeight} tokens={tokens}/>
            <BMIScale bmi={user.bmi??calcBMI(user.weight,user.height)} tokens={tokens}/>

            <SecLabel text="ข้อมูลส่วนตัว" tokens={tokens}/>
            <Card tokens={tokens}>
              <InfoRow label="น้ำหนักปัจจุบัน" value={`${(+user.weight).toFixed(1)} กก.`} tokens={tokens}/>
              <InfoRow label="น้ำหนักเป้าหมาย" value={`${(+user.goalWeight).toFixed(1)} กก.`} tokens={tokens}/>
              <InfoRow label="ส่วนสูง" value={`${user.height} ซม.`} tokens={tokens}/>
              <InfoRow label="อายุ" value={`${user.age} ปี`} tokens={tokens}/>
              <InfoRow label="เฟสปัจจุบัน" value={`${currentPhase.emoji} ${currentPhase.label}`} tokens={tokens} isLast/>
            </Card>

            <SecLabel text="เป้าโภชนาการ/วัน" tokens={tokens}/>
            <Card tokens={tokens}>
              <InfoRow label="แคลอรี่เป้าหมาย" value={`${(user.targetCal??1440).toLocaleString()} kcal`} accent={tokens.sageDk} tokens={tokens}/>
              <InfoRow label="TDEE" value={`${(user.tdee??1740).toLocaleString()} kcal`} tokens={tokens}/>
              <InfoRow label="เป้าการกิน" value={goalOpt.label} tokens={tokens}/>
              <InfoRow label="ออกกำลังกาย" value={actOpt.label} tokens={tokens} isLast/>
            </Card>

            <div style={{ background:tokens.roseLt, border:`1px solid ${tokens.rose}`,
              borderRadius:20, padding:"14px 16px", marginTop:4 }}>
              <div style={{ fontSize:12, fontWeight:500, color:"#8B4050", marginBottom:6 }}>Danger Zone</div>
              <div style={{ fontSize:12, color:"#8B4050", lineHeight:1.55, marginBottom:12 }}>
                รีเซ็ตจะลบข้อมูลทุกอย่าง ไม่สามารถกู้คืนได้
              </div>
              <button onClick={()=>setShowReset(true)} style={{
                width:"100%", padding:"11px", background:"transparent", color:"#8B4050",
                border:`1.5px solid ${tokens.rose}`, borderRadius:14, fontSize:13,
                fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>
                รีเซ็ตข้อมูลทั้งหมด
              </button>
            </div>
          </div>
        )}
      </div>

      {showReset && (
        <ResetConfirm
          onConfirm={()=>{ clearAppStorage(); window.location.reload() }}
          onClose={()=>setShowReset(false)}
          tokens={tokens}
        />
      )}
    </ScreenWrapper>
  )
}