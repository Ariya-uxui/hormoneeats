/* ═══════════════════════════════════════════════════
   TRANSLATIONS — TH / EN
═══════════════════════════════════════════════════ */

export const TRANSLATIONS = {
  th: {
    nav: { home:"หน้าหลัก", calendar:"ปฏิทิน", tracker:"แคลอรี่", mood:"อารมณ์", weight:"น้ำหนัก", profile:"โปรไฟล์" },
    common: { save:"บันทึก", cancel:"ยกเลิก", edit:"แก้ไข", delete:"ลบ", add:"เพิ่ม", close:"ปิด", next:"ถัดไป →", skip:"ข้าม", search:"ค้นหา...", kcal:"kcal", kg:"กก.", cm:"ซม." },
    onboarding: {
      slide1_title:["กินตาม","ฮอร์โมน"], slide1_desc:"ร่างกายคุณมีจังหวะของมันเอง เรียนรู้กินให้สอดคล้อง เพื่อน้ำหนักสมดุลและสุขภาพดีจากข้างใน",
      slide2_title:["4 เฟส","ฮอร์โมน"],  slide2_desc:"Follicular · Ovulation · Luteal · Menstrual แต่ละเฟสต้องการอาหารต่างกัน App จะแนะนำตามรอบของคุณ",
      slide3_title:["ปรับตาม","รูปร่างคุณ"], slide3_desc:"คำนวณจาก BMI, TDEE และเฟสฮอร์โมน แผนอาหารไทยที่เหมาะกับชีวิตจริง ไม่ต้องพึ่งอาหารเสริม",
      start:"เริ่มใช้งานเลย →", have_account:"ฉันมีบัญชีอยู่แล้ว",
      stat_target:"kcal เป้าหมาย", stat_height:"ซม. ส่วนสูง",
    },
    home: {
      greeting_morning:"สวัสดีตอนเช้า 🌸", greeting_afternoon:"สวัสดีตอนบ่าย ☀️", greeting_evening:"สวัสดีตอนเย็น 🌙",
      phase_today:"เฟสของคุณวันนี้", cycle_day:"วันที่", cycle_of:"ของรอบ →",
      stats_cal:"kcal วันนี้", stats_weight:"น้ำหนัก (กก.)", stats_score:"คะแนนวัน",
      suggest_today:"แนะนำวันนี้", see_all:"ดูทั้งหมด ›", log_today:"บันทึกวันนี้", add:"+ เพิ่ม",
      mood_logged:"บันทึกอารมณ์แล้ว ✓", mood_tap:"กดเพื่อดูประวัติ", mood_cta:"บันทึกอารมณ์วันนี้", mood_sub:"Mood & Energy Tracker →",
      meal_plan:"📅 แผนอาหารวัน", breakfast:"เช้า", lunch:"กลางวัน", dinner:"เย็น",
    },
    tracker: {
      title:"แคลอรี่วันนี้", target:"เป้าหมาย", remaining:"เหลือ",
      protein:"โปรตีน", carb:"คาร์บ", fat:"ไขมัน",
      add_food:"เพิ่มอาหาร", search:"ค้นหาอาหาร...", no_items:"ยังไม่มีรายการ",
    },
    calendar: {
      title:"ปฏิทินอาหาร", add_food:"เพิ่มอาหาร",
      meal_morning:"เช้า", meal_noon:"กลางวัน", meal_afternoon:"บ่าย", meal_evening:"เย็น", meal_night:"ก่อนนอน",
      food_list:"รายการอาหาร", custom:"กำหนดเอง",
      food_name:"ชื่ออาหาร...", cal_unit:"แคลอรี่ (kcal)", add_btn:"💾 เพิ่มอาหาร",
      no_entries:"ยังไม่มีรายการ",
    },
    mood: {
      title:"Mood & Energy", tab_log:"😊 บันทึกวันนี้", tab_history:"📊 ประวัติ",
      mood_label:"อารมณ์วันนี้", energy_label:"ระดับพลังงาน",
      symptoms:"อาการ / ความรู้สึก (เลือกได้หลายอย่าง)",
      note:"บันทึกเพิ่มเติม", note_placeholder:"รู้สึกยังไงบ้างวันนี้...",
      save:"💾 บันทึกอารมณ์วันนี้", already_logged:"✓ บันทึกวันนี้แล้ว",
      chart_title:"แนวโน้มอารมณ์ 7 วัน", no_history:"ยังไม่มีประวัติ เริ่มบันทึกวันนี้เลย!",
    },
    weight: { title:"น้ำหนัก", current:"น้ำหนักปัจจุบัน", goal:"เป้าหมาย", bmi:"BMI", log:"บันทึกน้ำหนัก", history:"ประวัติ" },
    profile: {
      title:"โปรไฟล์", edit:"✏️ แก้ไข", save:"💾 บันทึกโปรไฟล์",
      name:"ชื่อ", gender:"เพศ", age:"อายุ (ปี)", height:"ส่วนสูง (ซม.)", weight:"น้ำหนัก (กก.)",
      goal_weight:"น้ำหนักเป้าหมาย (กก.)", activity:"ระดับการออกกำลังกาย", eating_goal:"เป้าหมายการกิน",
      phase:"เฟสปัจจุบัน", cycle_day:"วันที่ในรอบ", cycle_length:"ความยาวรอบ (วัน)",
      reset:"รีเซ็ตข้อมูลทั้งหมด", reset_warn:"ข้อมูลทุกอย่างจะถูกลบ ไม่สามารถกู้คืนได้",
      female:"หญิง", male:"ชาย",
    },
    quiz: {
      title:"Hormone Balance Quiz", subtitle:"ตอบ 6 คำถาม เพื่อค้นหาประเภทฮอร์โมนของคุณ",
      question_of:"คำถาม", start:"เริ่มทำ Quiz →", next:"ถัดไป →", see_result:"ดูผลลัพธ์ →",
      result_label:"ประเภทฮอร์โมนของคุณ", hormone_level:"ระดับฮอร์โมนของคุณ",
      focus:"✓ โฟกัส", avoid:"✕ เลี่ยง", top_foods:"อาหารแนะนำสำหรับคุณ",
      meal_plan:"📅 แผนอาหาร 7 วัน", start_app:"เริ่มใช้ HormoneEats →",
      saved:"ผลจะถูกบันทึกไว้ในโปรไฟล์ของคุณ",
    },
  },

  en: {
    nav: { home:"Home", calendar:"Calendar", tracker:"Calories", mood:"Mood", weight:"Weight", profile:"Profile" },
    common: { save:"Save", cancel:"Cancel", edit:"Edit", delete:"Delete", add:"Add", close:"Close", next:"Next →", skip:"Skip", search:"Search...", kcal:"kcal", kg:"kg", cm:"cm" },
    onboarding: {
      slide1_title:["Eat with your","Hormones"], slide1_desc:"Your body has its own rhythm. Learn to eat in sync — for sustainable weight balance and health from within.",
      slide2_title:["4 Hormone","Phases"], slide2_desc:"Follicular · Ovulation · Luteal · Menstrual — each phase needs different nutrition. The app guides you.",
      slide3_title:["Personalized","Just for You"], slide3_desc:"Calculated from your BMI, TDEE, and hormone phase. Real food plans — no supplements needed.",
      start:"Get Started →", have_account:"I already have an account",
      stat_target:"kcal target", stat_height:"cm height",
    },
    home: {
      greeting_morning:"Good morning 🌸", greeting_afternoon:"Good afternoon ☀️", greeting_evening:"Good evening 🌙",
      phase_today:"Your phase today", cycle_day:"Day", cycle_of:"of cycle →",
      stats_cal:"kcal today", stats_weight:"Weight (kg)", stats_score:"Day score",
      suggest_today:"Suggested today", see_all:"See all ›", log_today:"Today's log", add:"+ Add",
      mood_logged:"Mood logged ✓", mood_tap:"Tap to view history", mood_cta:"Log today's mood", mood_sub:"Mood & Energy Tracker →",
      meal_plan:"📅 Meal plan —", breakfast:"Breakfast", lunch:"Lunch", dinner:"Dinner",
    },
    tracker: {
      title:"Today's Calories", target:"Target", remaining:"Remaining",
      protein:"Protein", carb:"Carbs", fat:"Fat",
      add_food:"Add Food", search:"Search food...", no_items:"No items yet",
    },
    calendar: {
      title:"Food Calendar", add_food:"Add Food",
      meal_morning:"Morning", meal_noon:"Lunch", meal_afternoon:"Afternoon", meal_evening:"Dinner", meal_night:"Bedtime",
      food_list:"Food List", custom:"Custom",
      food_name:"Food name...", cal_unit:"Calories (kcal)", add_btn:"💾 Add Food",
      no_entries:"No entries yet",
    },
    mood: {
      title:"Mood & Energy", tab_log:"😊 Log Today", tab_history:"📊 History",
      mood_label:"Today's mood", energy_label:"Energy level",
      symptoms:"Symptoms / Feelings (select all that apply)",
      note:"Additional notes", note_placeholder:"How are you feeling today...",
      save:"💾 Save Today's Mood", already_logged:"✓ Already logged today",
      chart_title:"7-day mood trend", no_history:"No history yet. Start logging today!",
    },
    weight: { title:"Weight", current:"Current weight", goal:"Goal", bmi:"BMI", log:"Log weight", history:"History" },
    profile: {
      title:"Profile", edit:"✏️ Edit", save:"💾 Save Profile",
      name:"Name", gender:"Gender", age:"Age (years)", height:"Height (cm)", weight:"Weight (kg)",
      goal_weight:"Goal weight (kg)", activity:"Activity level", eating_goal:"Eating goal",
      phase:"Current phase", cycle_day:"Cycle day", cycle_length:"Cycle length (days)",
      reset:"Reset all data", reset_warn:"All data will be deleted and cannot be recovered.",
      female:"Female", male:"Male",
    },
    quiz: {
      title:"Hormone Balance Quiz", subtitle:"Answer 6 questions to discover your hormone type",
      question_of:"Question", start:"Start Quiz →", next:"Next →", see_result:"See Results →",
      result_label:"Your hormone type", hormone_level:"Your hormone levels",
      focus:"✓ Focus on", avoid:"✕ Avoid", top_foods:"Recommended foods for you",
      meal_plan:"📅 7-Day Meal Plan", start_app:"Start HormoneEats →",
      saved:"Results will be saved to your profile",
    },
  },
}

export function getT(lang) {
  const dict = TRANSLATIONS[lang] ?? TRANSLATIONS.th
  return function t(key) {
    const parts = key.split(".")
    let val = dict
    for (const p of parts) {
      val = val?.[p]
      if (val === undefined) return key
    }
    return val
  }
}