# 🌿 HormoneEats

> กินตามฮอร์โมน ลดน้ำหนักยั่งยืน สุขภาพดีจากข้างใน

React + Vite mobile app ที่ช่วยผู้ใช้กินอาหารให้สอดคล้องกับรอบฮอร์โมน 4 เฟส เพื่อลดน้ำหนักแบบยั่งยืนและสมดุลฮอร์โมน

---

## 🚀 เริ่มต้นใช้งาน

```bash
# 1. Clone หรือ copy โปรเจกต์
cd hormoneeats

# 2. ติดตั้ง dependencies
npm install

# 3. รัน dev server
npm run dev
# → เปิด http://localhost:3000

# 4. Build สำหรับ production
npm run build

# 5. Preview build
npm run preview
```

**Node.js version:** 18+ แนะนำ

---

## 📁 โครงสร้างไฟล์

```
hormoneeats/
├── index.html                 ← HTML entry point
├── vite.config.js             ← Vite config
├── package.json               ← Dependencies
└── src/
    ├── main.jsx               ← React root mount
    ├── App.jsx                ← Root component, Context, tokens, navigation
    └── screens/
        ├── Onboarding.jsx     ← 3-slide intro
        ├── Home.jsx           ← Dashboard หลัก
        ├── Phases.jsx         ← รอบฮอร์โมน 4 เฟส
        ├── Tracker.jsx        ← คำนวณแคลอรี่ + food grid
        ├── Weight.jsx         ← ติดตามน้ำหนัก + chart
        └── Profile.jsx        ← โปรไฟล์ + settings
```

---

## 🎨 Design System — Palette D

### Color Tokens

| Token          | Hex       | Usage                     |
|----------------|-----------|---------------------------|
| `cream`        | `#F0EDE6` | Page background           |
| `creamSoft`    | `#FAF8F5` | Card / surface background |
| `lavender`     | `#BBA8C4` | Primary accent            |
| `lavenderDk`   | `#7A6890` | Primary text on lavender  |
| `sage`         | `#7E9484` | Secondary / success       |
| `sageDk`       | `#4A6454` | Secondary text on sage    |
| `cocoa`        | `#3D2E2A` | Primary text / CTA bg     |
| `stone`        | `#9A9490` | Muted text                |
| `border`       | `#E4E0DA` | Default border            |
| `rose`         | `#D4B8C0` | Accent / warning          |
| `gold`         | `#C4A882` | Warm accent               |

### Phase Colors

| Phase        | Emoji | Color     | Light BG  |
|--------------|-------|-----------|-----------|
| Follicular   | 🌱   | `#A8C4A0` | `#EEF5EC` |
| Ovulation    | ✨   | `#C4899A` | `#F5EAF0` |
| Luteal       | 🍂   | `#C4A882` | `#F5EDE0` |
| Menstrual    | 🌙   | `#9EB0C4` | `#EAF0F5` |

### Typography

| Role    | Font                | Size | Weight |
|---------|---------------------|------|--------|
| Display | Playfair Display    | 22–56px | 400–500 |
| Heading | DM Sans             | 14–20px | 500    |
| Body    | DM Sans             | 12–14px | 400    |
| Caption | DM Sans             | 9–11px  | 400    |

### Border Radius

```
xs: 6px   sm: 10px   md: 16px
lg: 22px  xl: 28px   full: 999px
```

---

## 🧩 Component Architecture

### AppContext (App.jsx)
Global state ทั้งหมดอยู่ใน `AppContext`:

```js
const ctx = {
  user,           // { name, age, height, weight, goalWeight, targetCal, tdee, bmi, currentPhase, cycleDay }
  setUser,
  weightHistory,  // [{ date, value, change }]
  logWeight,      // (value: number) => void
  foodLog,        // [{ id, emoji, name, time, meal, cal }]
  cartItems,      // food items added in Tracker
  toggleCartItem, // (food) => void
  totalCal,       // computed: foodLog + cart
  totalProtein,   // computed
  totalCarb,      // computed
  totalFat,       // computed
  navTo,          // (screenId: string) => void
  showToast,      // (message: string) => void
  currentPhase,   // PHASES[user.currentPhase] object
  PHASES,         // full phase config map
  tokens,         // design tokens object
}
```

### PHASES config (App.jsx)
```js
PHASES.ovulation = {
  key, label, emoji, days, sub,
  color, colorLt, textClr, badge,
  desc, eat[], avoid[],
  calRange,
}
```

### FOOD_DB (Tracker.jsx)
```js
{
  id, emoji, name,
  cal, protein, carb, fat,
  cat,          // "rice" | "curry" | "snack" | "fruit"
  hormoneTag,   // "good" | "neutral" | "avoid"
}
```

---

## 📱 Screens

### Onboarding
- 3 slides: Intro → Phase overview → Personalized stats
- Swipeable dots pagination
- "ข้าม" skip button
- Float + spin ring animation (CSS keyframes)

### Home
- Greeting เปลี่ยนตามเวลาจริง
- Phase banner → กดเพื่อไป Phases screen
- Stats: calorie วันนี้ / น้ำหนัก / day score
- Insight band: เปลี่ยน tip ตาม phase
- Food rail: suggested foods ตาม phase กดเพิ่ม/ลบได้
- Food log: รายการมื้ออาหารวันนี้

### Phases
- Proportional cycle bar (13:3:11:5)
- 4 phase cards — expand/collapse ทีละ 1
- Expanded section: hormone level bars + calorie range + exercise tips
- กดที่ cycle bar scroll to card ได้

### Tracker (Food Calculator)
- Calorie ring (Canvas, DPR-aware)
- Macro bars P/C/F real-time
- Remaining kcal display
- Cart summary: chips ของที่เพิ่มแล้ว
- Search + clear button
- 5-category filter
- Food grid 2-col + hormone tag badge
- 26 Thai food items

### Weight
- Hero: น้ำหนักปัจจุบัน Playfair Display 56px
- Lost badge + goal stats row
- SVG Bezier line chart (last 6 entries)
- Weekly progress + monthly projection
- Log input with validation (Enter key support)
- History list: 6 รายการล่าสุด

### Profile
- Avatar + name + phase pill
- BMI scale bar with marker
- Goal progress bar (% toward target)
- Hormone mini-summary ตาม phase
- Sections: ข้อมูลส่วนตัว / เป้าหมาย / โภชนาการ / settings

---

## 🔧 การปรับแต่ง

### เปลี่ยนข้อมูลผู้ใช้
แก้ `INITIAL_USER` ใน `App.jsx`:
```js
const INITIAL_USER = {
  name:         "ชื่อผู้ใช้",
  weight:       54.0,
  goalWeight:   52.0,
  targetCal:    1440,
  currentPhase: "ovulation",  // follicular | ovulation | luteal | menstrual
  cycleDay:     14,
  // ...
}
```

### เพิ่มอาหารใหม่
เพิ่มใน `FOOD_DB` ใน `Tracker.jsx`:
```js
{
  id: 27,
  emoji: "🥗",
  name: "ชื่ออาหาร",
  cal: 200, protein: 15, carb: 20, fat: 8,
  cat: "curry",       // rice | curry | snack | fruit
  hormoneTag: "good", // good | neutral | avoid
}
```

### เปลี่ยน Palette
แก้ `tokens` object ใน `App.jsx` ได้เลย ทุก component ดึงจาก context

---

## 🌿 Design Philosophy

> "Soft Organic Luxury" — ไม่หวานเกิน ไม่แข็งเกิน
> ความรู้สึก "ดูแลตัวเองอย่างมีคลาส" ตรงกับ Identity ของ HormoneEats

- ไม่ใช้ gradient สำเร็จรูป
- ไม่ใช้ shadow จัด
- Playfair Display สำหรับ hero text เท่านั้น
- DM Sans สำหรับ UI ทุกส่วน
- สี cocoa `#3D2E2A` แทน black ให้ความรู้สึกนุ่มกว่า
- Animation: float + spin เฉพาะ onboarding ring
- Transition: fadeUp stagger สำหรับ screen enter

---

## 📋 Roadmap

- [ ] รอบเดือน tracker (บันทึกวันแรก → คำนวณเฟสอัตโนมัติ)
- [ ] Push notification มื้ออาหาร
- [ ] Barcode scanner อาหารสำเร็จรูป
- [ ] AI meal plan generator (Anthropic API)
- [ ] Export PDF รายงานสุขภาพรายเดือน
- [ ] Dark mode

---

*HormoneEats v1.0 · Palette D · Built with React + Vite*