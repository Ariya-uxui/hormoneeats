/* ═══════════════════════════════════════════════════
   FOOD DATABASE — 4 cuisines, hormone-aware
   ไทย · ญี่ปุ่น · เกาหลี · ตะวันตก
   Each item: { id, emoji, name, nameEn, cal, protein, carb, fat, fiber,
                cat, cuisine, hormoneTag, hormoneNote, phase[] }
   hormoneTag: "boost" | "good" | "neutral" | "avoid"
   phase[]:    which phases this food is especially good for
═══════════════════════════════════════════════════ */

export const CUISINES = [
  { id: "all",     label: "ทั้งหมด",   emoji: "🌏" },
  { id: "thai",    label: "ไทย",       emoji: "🇹🇭" },
  { id: "japanese",label: "ญี่ปุ่น",  emoji: "🇯🇵" },
  { id: "korean",  label: "เกาหลี",    emoji: "🇰🇷" },
  { id: "western", label: "ตะวันตก",  emoji: "🌍" },
]

export const CATEGORIES = [
  { id: "all",       label: "ทั้งหมด"      },
  { id: "rice",      label: "ข้าว/เส้น"   },
  { id: "protein",   label: "โปรตีน"      },
  { id: "soup",      label: "ซุป/แกง"     },
  { id: "salad",     label: "สลัด/ผัก"    },
  { id: "snack",     label: "ของว่าง"     },
  { id: "fruit",     label: "ผลไม้"       },
  { id: "coffee",    label: "☕ กาแฟ"     },
  { id: "tea",       label: "🍵 ชา"       },
  { id: "milk",      label: "🥛 นม/โยเกิร์ต"},
  { id: "smoothie",  label: "🥤 สมูทตี้"  },
  { id: "coldpress", label: "🌿 สกัดเย็น" },
  { id: "drink",     label: "เครื่องดื่มอื่น"},
]

export const HORMONE_TAGS = {
  boost:   { label: "ช่วยฮอร์โมน",   bg: "#EDE8F5", color: "#3C3489" },
  good:    { label: "ดีต่อฮอร์โมน",  bg: "#EAF0EA", color: "#4A6454" },
  neutral: { label: "ปกติ",          bg: "#F0EDE8", color: "#9A9490" },
  avoid:   { label: "ควรเลี่ยง",     bg: "#F5EEF1", color: "#8B4050" },
}

export const FOOD_DB = [

  /* ══════════════════════════════
     🇹🇭 THAI
  ══════════════════════════════ */

  // rice / noodles
  { id:101, emoji:"🍚", name:"ข้าวสวย 1 ทัพพี",     nameEn:"White Rice",        cal:180, protein:4,  carb:39, fat:0,  fiber:0, cat:"rice",    cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:102, emoji:"🌾", name:"ข้าวกล้อง 1 ทัพพี",   nameEn:"Brown Rice",        cal:165, protein:4,  carb:36, fat:1,  fiber:2, cat:"rice",    cuisine:"thai",    hormoneTag:"good",    hormoneNote:"ไฟเบอร์ช่วย detox Estrogen",   phase:["follicular","ovulation"] },
  { id:103, emoji:"🍜", name:"ก๋วยเตี๋ยวน้ำใส",      nameEn:"Clear Noodle Soup", cal:210, protein:12, carb:36, fat:3,  fiber:1, cat:"rice",    cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:104, emoji:"🍝", name:"ผัดไทย",               nameEn:"Pad Thai",          cal:400, protein:15, carb:52, fat:14, fiber:2, cat:"rice",    cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:105, emoji:"🍛", name:"ข้าวผัดกระเพรา",       nameEn:"Basil Fried Rice",  cal:420, protein:18, carb:54, fat:14, fiber:1, cat:"rice",    cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:106, emoji:"🍲", name:"ข้าวมันไก่",            nameEn:"Khao Man Gai",      cal:480, protein:28, carb:52, fat:14, fiber:0, cat:"rice",    cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                             phase:[] },

  // protein
  { id:111, emoji:"🍗", name:"ไก่ย่าง (อก)",          nameEn:"Grilled Chicken",   cal:200, protein:30, carb:2,  fat:8,  fiber:0, cat:"protein", cuisine:"thai",    hormoneTag:"good",    hormoneNote:"โปรตีนสูง ช่วยสร้างกล้ามเนื้อ", phase:["ovulation","follicular"] },
  { id:112, emoji:"🐟", name:"ปลาทอด",                nameEn:"Fried Fish",        cal:250, protein:28, carb:8,  fat:12, fiber:0, cat:"protein", cuisine:"thai",    hormoneTag:"good",    hormoneNote:"Omega-3 สมดุลฮอร์โมน",          phase:["ovulation","luteal"] },
  { id:113, emoji:"🦐", name:"กุ้งผัดพริก",            nameEn:"Stir-fry Shrimp",   cal:185, protein:22, carb:6,  fat:8,  fiber:1, cat:"protein", cuisine:"thai",    hormoneTag:"good",    hormoneNote:"โปรตีนต่ำแคล",                 phase:["ovulation"] },
  { id:114, emoji:"🥚", name:"ไข่ต้ม 2 ฟอง",          nameEn:"Boiled Eggs",       cal:140, protein:12, carb:1,  fat:10, fiber:0, cat:"protein", cuisine:"thai",    hormoneTag:"good",    hormoneNote:"Choline บำรุงฮอร์โมน",          phase:["follicular","ovulation"] },
  { id:115, emoji:"🍖", name:"หมูสะเต๊ะ",             nameEn:"Pork Satay",        cal:280, protein:20, carb:12, fat:16, fiber:0, cat:"protein", cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                             phase:[] },

  // soup / curry
  { id:121, emoji:"🫕", name:"ต้มยำกุ้ง",              nameEn:"Tom Yum Goong",     cal:160, protein:20, carb:8,  fat:6,  fiber:2, cat:"soup",    cuisine:"thai",    hormoneTag:"boost",   hormoneNote:"ขิง+ตะไคร้ต้านอักเสบ ลด Cortisol", phase:["luteal","menstrual"] },
  { id:122, emoji:"🍲", name:"แกงเขียวหวานไก่",        nameEn:"Green Curry",       cal:280, protein:22, carb:12, fat:16, fiber:2, cat:"soup",    cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:123, emoji:"🥘", name:"ต้มข่าไก่",              nameEn:"Tom Kha Gai",       cal:220, protein:18, carb:6,  fat:14, fiber:1, cat:"soup",    cuisine:"thai",    hormoneTag:"boost",   hormoneNote:"ข่าลดอักเสบ สมดุล Progesterone", phase:["luteal"] },
  { id:124, emoji:"🫕", name:"แกงส้มผักรวม",           nameEn:"Sour Curry",        cal:120, protein:8,  carb:14, fat:4,  fiber:3, cat:"soup",    cuisine:"thai",    hormoneTag:"good",    hormoneNote:"ผักสูง ไฟเบอร์ช่วย detox",      phase:["follicular"] },

  // salad / veggies
  { id:131, emoji:"🥗", name:"ส้มตำไทย",              nameEn:"Green Papaya Salad",cal:120, protein:4,  carb:18, fat:3,  fiber:4, cat:"salad",   cuisine:"thai",    hormoneTag:"good",    hormoneNote:"มะละกอดิบช่วยย่อย สมดุล Estrogen", phase:["ovulation","follicular"] },
  { id:132, emoji:"🥬", name:"ผัดผักบุ้งไฟแดง",       nameEn:"Stir-fry Morning Glory",cal:85, protein:4, carb:8, fat:4,  fiber:3, cat:"salad",   cuisine:"thai",    hormoneTag:"good",    hormoneNote:"ธาตุเหล็กสูง",                  phase:["menstrual"] },
  { id:133, emoji:"🌿", name:"ยำวุ้นเส้น",             nameEn:"Glass Noodle Salad",cal:180, protein:12, carb:22, fat:5,  fiber:2, cat:"salad",   cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                             phase:[] },

  // snack
  { id:141, emoji:"🍢", name:"ไข่พะโล้",               nameEn:"Braised Egg",       cal:140, protein:10, carb:8,  fat:7,  fiber:0, cat:"snack",   cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:142, emoji:"🫘", name:"ถั่วเขียวต้ม",            nameEn:"Mung Bean",         cal:100, protein:7,  carb:18, fat:1,  fiber:5, cat:"snack",   cuisine:"thai",    hormoneTag:"boost",   hormoneNote:"Phytoestrogen สมดุล Estrogen",  phase:["follicular","luteal"] },
  { id:143, emoji:"🍌", name:"กล้วยบวชชี",             nameEn:"Banana in Coconut", cal:220, protein:2,  carb:42, fat:6,  fiber:2, cat:"snack",   cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                             phase:[] },

  // fruit
  { id:151, emoji:"🍌", name:"กล้วยหอม",               nameEn:"Banana",            cal:90,  protein:1,  carb:23, fat:0,  fiber:3, cat:"fruit",   cuisine:"thai",    hormoneTag:"good",    hormoneNote:"แมกนีเซียมลด PMS",              phase:["luteal"] },
  { id:152, emoji:"🍍", name:"สับปะรด",                nameEn:"Pineapple",         cal:82,  protein:1,  carb:22, fat:0,  fiber:2, cat:"fruit",   cuisine:"thai",    hormoneTag:"good",    hormoneNote:"Bromelain ลดอักเสบ",            phase:["menstrual"] },
  { id:153, emoji:"🥭", name:"มะม่วงสุก",              nameEn:"Mango",             cal:107, protein:1,  carb:28, fat:0,  fiber:2, cat:"fruit",   cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:154, emoji:"🍈", name:"ฝรั่ง",                  nameEn:"Guava",             cal:68,  protein:3,  carb:14, fat:1,  fiber:5, cat:"fruit",   cuisine:"thai",    hormoneTag:"boost",   hormoneNote:"วิตามิน C สูง บำรุง Adrenal",  phase:["follicular","ovulation"] },
  { id:155, emoji:"🍉", name:"แตงโม",                  nameEn:"Watermelon",        cal:50,  protein:1,  carb:12, fat:0,  fiber:1, cat:"fruit",   cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:156, emoji:"🥥", name:"มะพร้าวอ่อน",            nameEn:"Young Coconut",     cal:45,  protein:2,  carb:9,  fat:0,  fiber:0, cat:"drink",   cuisine:"thai",    hormoneTag:"good",    hormoneNote:"อิเล็กโทรไลต์ลด Cortisol",     phase:["luteal","menstrual"] },

  /* ══════════════════════════════
     🇯🇵 JAPANESE
  ══════════════════════════════ */

  // rice / noodles
  { id:201, emoji:"🍱", name:"ข้าวญี่ปุ่น (Gohan)",   nameEn:"Japanese Rice",     cal:168, protein:3,  carb:37, fat:0,  fiber:0, cat:"rice",    cuisine:"japanese", hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:202, emoji:"🍜", name:"ราเมน (ซุปใส)",         nameEn:"Ramen Clear Soup",  cal:380, protein:18, carb:52, fat:10, fiber:2, cat:"rice",    cuisine:"japanese", hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:203, emoji:"🍝", name:"อุด้ง",                  nameEn:"Udon",              cal:280, protein:10, carb:58, fat:1,  fiber:2, cat:"rice",    cuisine:"japanese", hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:204, emoji:"🍣", name:"ซูชิ (8 ชิ้น)",         nameEn:"Sushi",             cal:320, protein:18, carb:48, fat:6,  fiber:1, cat:"rice",    cuisine:"japanese", hormoneTag:"good",    hormoneNote:"ปลาดิบ Omega-3 สูง",           phase:["ovulation","follicular"] },
  { id:205, emoji:"🌯", name:"ข้าวห่อสาหร่าย (Onigiri)",nameEn:"Onigiri",         cal:180, protein:4,  carb:36, fat:1,  fiber:1, cat:"rice",    cuisine:"japanese", hormoneTag:"neutral", hormoneNote:"",                             phase:[] },

  // protein
  { id:211, emoji:"🐟", name:"ซาชิมิ (Sashimi)",      nameEn:"Sashimi",           cal:130, protein:24, carb:0,  fat:4,  fiber:0, cat:"protein", cuisine:"japanese", hormoneTag:"boost",   hormoneNote:"EPA/DHA สูงมาก สมดุลฮอร์โมนทุกเฟส", phase:["ovulation","follicular","luteal"] },
  { id:212, emoji:"🍗", name:"ไก่ย่างเทริยากิ",        nameEn:"Teriyaki Chicken",  cal:250, protein:28, carb:14, fat:8,  fiber:0, cat:"protein", cuisine:"japanese", hormoneTag:"good",    hormoneNote:"โปรตีนคุณภาพสูง",              phase:["ovulation"] },
  { id:213, emoji:"🥚", name:"ไข่ดาวญี่ปุ่น (Tamago)", nameEn:"Japanese Egg",      cal:90,  protein:6,  carb:1,  fat:7,  fiber:0, cat:"protein", cuisine:"japanese", hormoneTag:"good",    hormoneNote:"Choline บำรุง Liver detox",     phase:["follicular"] },
  { id:214, emoji:"🫘", name:"เต้าหู้เย็น (Hiyayakko)",nameEn:"Cold Tofu",         cal:75,  protein:8,  carb:2,  fat:4,  fiber:0, cat:"protein", cuisine:"japanese", hormoneTag:"boost",   hormoneNote:"Isoflavone สมดุล Estrogen",     phase:["follicular","luteal"] },
  { id:215, emoji:"🐟", name:"ปลาแซลมอนย่าง",         nameEn:"Grilled Salmon",    cal:280, protein:32, carb:0,  fat:16, fiber:0, cat:"protein", cuisine:"japanese", hormoneTag:"boost",   hormoneNote:"Omega-3 สูงสุด ลด Inflammation", phase:["ovulation","luteal","menstrual"] },
  { id:216, emoji:"🦑", name:"ปลาหมึกย่าง",            nameEn:"Grilled Squid",     cal:140, protein:22, carb:3,  fat:4,  fiber:0, cat:"protein", cuisine:"japanese", hormoneTag:"good",    hormoneNote:"สังกะสีสูง สนับสนุน Progesterone", phase:["luteal"] },

  // soup
  { id:221, emoji:"🍵", name:"มิโซะซุป",               nameEn:"Miso Soup",         cal:45,  protein:3,  carb:5,  fat:1,  fiber:1, cat:"soup",    cuisine:"japanese", hormoneTag:"boost",   hormoneNote:"Fermented Soy สมดุล Gut-Hormone axis", phase:["follicular","luteal"] },
  { id:222, emoji:"🫕", name:"ชาบู-ชาบู",              nameEn:"Shabu-shabu",       cal:320, protein:28, carb:8,  fat:16, fiber:2, cat:"soup",    cuisine:"japanese", hormoneTag:"good",    hormoneNote:"โปรตีนสูง ผักหลากหลาย",        phase:["follicular","ovulation"] },

  // salad / veg
  { id:231, emoji:"🥬", name:"สลัดสาหร่าย (Wakame)",   nameEn:"Wakame Salad",      cal:45,  protein:3,  carb:6,  fat:1,  fiber:4, cat:"salad",   cuisine:"japanese", hormoneTag:"boost",   hormoneNote:"Iodine บำรุง Thyroid ควบคุม metabolism", phase:["follicular","ovulation"] },
  { id:232, emoji:"🫚", name:"เอดามาเมะ",              nameEn:"Edamame",           cal:120, protein:11, carb:10, fat:5,  fiber:5, cat:"salad",   cuisine:"japanese", hormoneTag:"boost",   hormoneNote:"Phytoestrogen + Folate",        phase:["follicular","luteal"] },
  { id:233, emoji:"🥕", name:"คินปิระ (ผัดผักญี่ปุ่น)",nameEn:"Kinpira Gobo",      cal:110, protein:3,  carb:18, fat:3,  fiber:4, cat:"salad",   cuisine:"japanese", hormoneTag:"good",    hormoneNote:"ไฟเบอร์สูง detox",              phase:["follicular"] },

  // snack / drink
  { id:241, emoji:"🍵", name:"ชาเขียวมัทฉะ",           nameEn:"Matcha",            cal:5,   protein:0,  carb:1,  fat:0,  fiber:0, cat:"drink",   cuisine:"japanese", hormoneTag:"boost",   hormoneNote:"L-theanine ลด Cortisol",        phase:["luteal","menstrual"] },
  { id:242, emoji:"🍶", name:"ซุปมิโซะ (เข้มข้น)",     nameEn:"Miso Paste",        cal:30,  protein:2,  carb:4,  fat:1,  fiber:0, cat:"snack",   cuisine:"japanese", hormoneTag:"boost",   hormoneNote:"Probiotic ช่วย Gut-hormone",    phase:["luteal"] },
  { id:243, emoji:"🍡", name:"ดาง้วน (Daifuku)",        nameEn:"Daifuku",           cal:130, protein:2,  carb:28, fat:1,  fiber:1, cat:"snack",   cuisine:"japanese", hormoneTag:"neutral", hormoneNote:"",                             phase:[] },

  /* ══════════════════════════════
     🇰🇷 KOREAN
  ══════════════════════════════ */

  // rice / noodles
  { id:301, emoji:"🍚", name:"ข้าวเกาหลี + ผัก",      nameEn:"Bibimbap",          cal:480, protein:18, carb:72, fat:12, fiber:5, cat:"rice",    cuisine:"korean",  hormoneTag:"good",    hormoneNote:"ผักหลากชนิด ไฟเบอร์สูง detox", phase:["follicular","ovulation"] },
  { id:302, emoji:"🍜", name:"บะหมี่เย็น (Naengmyeon)",nameEn:"Cold Noodles",      cal:320, protein:10, carb:62, fat:3,  fiber:2, cat:"rice",    cuisine:"korean",  hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:303, emoji:"🍚", name:"คิมบับ (4 ชิ้น)",        nameEn:"Kimbap",            cal:280, protein:8,  carb:48, fat:6,  fiber:2, cat:"rice",    cuisine:"korean",  hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:304, emoji:"🍝", name:"จาจังมยอน",              nameEn:"Jajangmyeon",       cal:560, protein:20, carb:86, fat:14, fiber:3, cat:"rice",    cuisine:"korean",  hormoneTag:"neutral", hormoneNote:"",                             phase:[] },

  // protein
  { id:311, emoji:"🥩", name:"ซัมกยอปซัล (หมูสามชั้นย่าง)",nameEn:"Samgyeopsal",  cal:420, protein:22, carb:2,  fat:36, fiber:0, cat:"protein", cuisine:"korean",  hormoneTag:"neutral", hormoneNote:"ไขมันสูง กินน้อยลงช่วง Luteal", phase:[] },
  { id:312, emoji:"🐄", name:"ไก่ทอดเกาหลี (KFC)",     nameEn:"Korean Fried Chick",cal:380, protein:28, carb:22, fat:20, fiber:1, cat:"protein", cuisine:"korean",  hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:313, emoji:"🥚", name:"ไข่ตุ๋นเกาหลี (Gyeran Jjim)",nameEn:"Steamed Egg",  cal:80,  protein:7,  carb:1,  fat:5,  fiber:0, cat:"protein", cuisine:"korean",  hormoneTag:"good",    hormoneNote:"Choline บำรุงฮอร์โมน",         phase:["follicular"] },
  { id:314, emoji:"🐟", name:"ปลาทูน่าสเต็กเกาหลี",    nameEn:"Tuna Steak",        cal:220, protein:34, carb:0,  fat:9,  fiber:0, cat:"protein", cuisine:"korean",  hormoneTag:"boost",   hormoneNote:"EPA/DHA สูง ต้านอักเสบ",        phase:["ovulation","menstrual"] },

  // soup
  { id:321, emoji:"🍲", name:"ซุนดูบูจิเก (เต้าหู้อ่อน)",nameEn:"Sundubu Jjigae",  cal:200, protein:14, carb:8,  fat:10, fiber:2, cat:"soup",    cuisine:"korean",  hormoneTag:"boost",   hormoneNote:"เต้าหู้อ่อน Isoflavone สมดุล Estrogen", phase:["follicular","luteal"] },
  { id:322, emoji:"🫕", name:"ซัมเกทัง (ไก่ตุ๋นโสม)",  nameEn:"Samgyetang",        cal:380, protein:35, carb:22, fat:14, fiber:1, cat:"soup",    cuisine:"korean",  hormoneTag:"boost",   hormoneNote:"โสมช่วยสมดุล Cortisol",         phase:["menstrual","luteal"] },
  { id:323, emoji:"🥘", name:"ดวนจังจิเก (ซุปเต้าเจี้ยว)",nameEn:"Doenjang Jjigae", cal:160, protein:10, carb:10, fat:7,  fiber:3, cat:"soup",    cuisine:"korean",  hormoneTag:"boost",   hormoneNote:"Fermented bean paste Probiotic", phase:["follicular","luteal"] },
  { id:324, emoji:"🍲", name:"คิมจิจิเก",               nameEn:"Kimchi Jjigae",     cal:180, protein:12, carb:10, fat:8,  fiber:3, cat:"soup",    cuisine:"korean",  hormoneTag:"boost",   hormoneNote:"Probiotic จาก Kimchi Fermented", phase:["luteal","menstrual"] },

  // salad / kimchi
  { id:331, emoji:"🥬", name:"คิมจิ",                   nameEn:"Kimchi",            cal:25,  protein:2,  carb:4,  fat:0,  fiber:2, cat:"salad",   cuisine:"korean",  hormoneTag:"boost",   hormoneNote:"Probiotic ดีที่สุดสำหรับ Gut-Hormone", phase:["follicular","luteal","menstrual"] },
  { id:332, emoji:"🥗", name:"นามุล (ผักลวก)",          nameEn:"Namul",             cal:60,  protein:3,  carb:8,  fat:2,  fiber:3, cat:"salad",   cuisine:"korean",  hormoneTag:"good",    hormoneNote:"ผักหลากชนิด วิตามินแร่ธาตุสูง", phase:["follicular","ovulation"] },
  { id:333, emoji:"🥦", name:"บรอกโคลีผัดน้ำมันงา",    nameEn:"Sesame Broccoli",   cal:80,  protein:4,  carb:8,  fat:4,  fiber:3, cat:"salad",   cuisine:"korean",  hormoneTag:"boost",   hormoneNote:"DIM จาก Broccoli ช่วย Estrogen metabolism", phase:["ovulation","follicular"] },

  // snack / drink
  { id:341, emoji:"🍫", name:"ช็อกโกแลตฮอตเกาหลี",    nameEn:"Korean Hot Choco",  cal:180, protein:4,  carb:28, fat:6,  fiber:1, cat:"drink",   cuisine:"korean",  hormoneTag:"neutral", hormoneNote:"",                             phase:[] },
  { id:342, emoji:"🧋", name:"ชานมเกาหลี (Boba)",      nameEn:"Korean Milk Tea",   cal:280, protein:4,  carb:54, fat:6,  fiber:0, cat:"drink",   cuisine:"korean",  hormoneTag:"avoid",   hormoneNote:"น้ำตาลสูง spike Insulin",       phase:[] },
  { id:343, emoji:"🌾", name:"ขนมข้าวพอง (Tteok)",     nameEn:"Rice Cake",         cal:100, protein:2,  carb:22, fat:0,  fiber:0, cat:"snack",   cuisine:"korean",  hormoneTag:"neutral", hormoneNote:"",                             phase:[] },

  /* ══════════════════════════════
     🌍 WESTERN
  ══════════════════════════════ */

  // rice / bread
  { id:401, emoji:"🥙", name:"ชิคเก้นแร็พโฮลวีท",     nameEn:"Chicken Wrap WW",   cal:380, protein:28, carb:38, fat:12, fiber:4, cat:"rice",    cuisine:"western", hormoneTag:"good",    hormoneNote:"Whole wheat ไฟเบอร์ช่วย detox", phase:["follicular","ovulation"] },
  { id:402, emoji:"🥗", name:"ควินัวโบล์",             nameEn:"Quinoa Bowl",       cal:380, protein:14, carb:52, fat:12, fiber:6, cat:"rice",    cuisine:"western", hormoneTag:"boost",   hormoneNote:"Complete protein + Mg + Fe",    phase:["menstrual","follicular"] },
  { id:403, emoji:"🍞", name:"ขนมปังโฮลวีท 2 แผ่น",   nameEn:"Whole Wheat Bread", cal:160, protein:6,  carb:30, fat:2,  fiber:4, cat:"rice",    cuisine:"western", hormoneTag:"good",    hormoneNote:"ไฟเบอร์ช่วย detox Estrogen",   phase:["follicular"] },
  { id:404, emoji:"🥣", name:"โอ๊ตมีล + เบอรี่",       nameEn:"Oatmeal + Berries", cal:280, protein:8,  carb:48, fat:5,  fiber:7, cat:"rice",    cuisine:"western", hormoneTag:"boost",   hormoneNote:"Beta-glucan สมดุล Blood Sugar + Estrogen", phase:["follicular","luteal"] },

  // protein
  { id:411, emoji:"🥩", name:"สเต็กเนื้อไม่ติดมัน",   nameEn:"Lean Beef Steak",   cal:280, protein:36, carb:0,  fat:14, fiber:0, cat:"protein", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Fe + Zinc สร้าง Testosterone & Progesterone", phase:["menstrual","follicular"] },
  { id:412, emoji:"🍗", name:"ไก่อบสมุนไพร",           nameEn:"Herb Baked Chicken",cal:220, protein:34, carb:2,  fat:8,  fiber:0, cat:"protein", cuisine:"western", hormoneTag:"good",    hormoneNote:"โปรตีนสูง ไขมันต่ำ",           phase:["ovulation"] },
  { id:413, emoji:"🐟", name:"แซลมอนอบมะนาว",          nameEn:"Lemon Baked Salmon",cal:290, protein:34, carb:2,  fat:16, fiber:0, cat:"protein", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Omega-3 สูงสุด ลด Inflammation ทุกเฟส", phase:["ovulation","luteal","menstrual"] },
  { id:414, emoji:"🫘", name:"ถั่วดำ",                  nameEn:"Black Beans",       cal:114, protein:8,  carb:20, fat:0,  fiber:8, cat:"protein", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Mg สูง ลด PMS + Fiber detox",   phase:["luteal","menstrual"] },
  { id:415, emoji:"🥚", name:"ไข่เจียวผักโขม",          nameEn:"Spinach Omelette",  cal:180, protein:14, carb:4,  fat:12, fiber:2, cat:"protein", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Fe + Choline + Folate",         phase:["menstrual","follicular"] },
  { id:416, emoji:"🧀", name:"กรีกโยเกิร์ต (ไม่หวาน)", nameEn:"Greek Yogurt",      cal:100, protein:17, carb:6,  fat:1,  fiber:0, cat:"protein", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Probiotic + Ca สมดุล Hormone",  phase:["follicular","luteal"] },

  // soup / salad
  { id:421, emoji:"🥗", name:"สลัดผักโขม + วอลนัท",   nameEn:"Spinach Walnut Salad",cal:220,protein:8,  carb:12, fat:16, fiber:5, cat:"salad",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"Omega-3 จาก Walnut + Iron จาก Spinach", phase:["menstrual","follicular"] },
  { id:422, emoji:"🥗", name:"สลัดอะโวคาโด",           nameEn:"Avocado Salad",     cal:250, protein:4,  carb:14, fat:20, fiber:7, cat:"salad",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"Healthy fat สร้าง Steroid hormones", phase:["ovulation","follicular"] },
  { id:423, emoji:"🍲", name:"ซุปผักรวม",              nameEn:"Vegetable Soup",    cal:120, protein:5,  carb:18, fat:3,  fiber:5, cat:"soup",    cuisine:"western", hormoneTag:"good",    hormoneNote:"ผักหลากชนิด วิตามินรวม",        phase:["menstrual"] },
  { id:424, emoji:"🥦", name:"บรอกโคลีนึ่ง",           nameEn:"Steamed Broccoli",  cal:55,  protein:4,  carb:11, fat:1,  fiber:4, cat:"salad",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"DIM สูงสุด ช่วย Estrogen detox",phase:["ovulation","follicular"] },

  // snack / drink
  { id:431, emoji:"🫐", name:"บลูเบอรี่ 1 ถ้วย",       nameEn:"Blueberries",       cal:84,  protein:1,  carb:21, fat:0,  fiber:4, cat:"fruit",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"Antioxidant ปกป้อง Hormone receptor", phase:["ovulation","follicular"] },
  { id:432, emoji:"🍓", name:"สตรอว์เบอรี่",           nameEn:"Strawberries",      cal:50,  protein:1,  carb:12, fat:0,  fiber:3, cat:"fruit",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"วิตามิน C ช่วย Cortisol balance", phase:["luteal","menstrual"] },
  { id:433, emoji:"🌰", name:"วอลนัท 30g",              nameEn:"Walnuts",           cal:185, protein:4,  carb:4,  fat:18, fiber:2, cat:"snack",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"Omega-3 + Phytosterol สมดุลฮอร์โมน", phase:["luteal","ovulation"] },
  { id:434, emoji:"🌰", name:"อัลมอนด์ 30g",            nameEn:"Almonds",           cal:165, protein:6,  carb:6,  fat:14, fiber:3, cat:"snack",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"Vit E + Mg บำรุง Reproductive hormones", phase:["follicular","luteal"] },
  { id:435, emoji:"🍫", name:"ดาร์กช็อกโกแลต 30g",     nameEn:"Dark Chocolate 70%",cal:170, protein:2,  carb:18, fat:11, fiber:3, cat:"snack",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"Mg + Flavonoid ลด PMS + Cortisol", phase:["luteal","menstrual"] },
  { id:436, emoji:"☕", name:"กาแฟดำ (ไม่หวาน)",       nameEn:"Black Coffee",      cal:5,   protein:0,  carb:0,  fat:0,  fiber:0, cat:"drink",   cuisine:"western", hormoneTag:"neutral", hormoneNote:"คาเฟอีนควรจำกัด <200mg/วัน",    phase:[] },
  { id:437, emoji:"🍵", name:"ชาสมุนไพร (Chamomile)",  nameEn:"Chamomile Tea",     cal:2,   protein:0,  carb:0,  fat:0,  fiber:0, cat:"drink",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"Apigenin ลด Anxiety + Cortisol", phase:["luteal","menstrual"] },
  { id:438, emoji:"🥛", name:"นมอัลมอนด์ (ไม่หวาน)",  nameEn:"Almond Milk",       cal:30,  protein:1,  carb:1,  fat:3,  fiber:1, cat:"drink",   cuisine:"western", hormoneTag:"good",    hormoneNote:"ทางเลือกแทนนมวัว ไม่เพิ่ม Estrogen", phase:["ovulation","follicular"] },
  { id:439, emoji:"🌱", name:"เมล็ดแฟลกซ์ 1 ช้อนโต๊ะ",nameEn:"Flaxseed",          cal:55,  protein:2,  carb:3,  fat:4,  fiber:3, cat:"snack",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"Lignans ดีที่สุดสำหรับ Estrogen balance", phase:["ovulation","follicular","luteal"] },
  { id:440, emoji:"🥑", name:"อะโวคาโด ½ ลูก",         nameEn:"Avocado",           cal:120, protein:1,  carb:6,  fat:11, fiber:5, cat:"snack",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"Monounsaturated fat สร้าง Steroid hormone", phase:["ovulation","follicular"] },
]

/* ── Helper functions ── */
export function getFoodsByPhase(phaseKey) {
  return FOOD_DB.filter(f =>
    f.phase.includes(phaseKey) || f.hormoneTag === "boost"
  )
}

export function searchFoods(query, cuisine = "all", category = "all") {
  return FOOD_DB.filter(f => {
    const matchQ  = !query || f.name.includes(query) || f.nameEn.toLowerCase().includes(query.toLowerCase())
    const matchCu = cuisine  === "all" || f.cuisine  === cuisine
    const matchCa = category === "all" || f.cat      === category
    return matchQ && matchCu && matchCa
  })
}

export function getTopFoodsForPhase(phaseKey, limit = 6) {
  return FOOD_DB
    .filter(f => f.hormoneTag === "boost" && f.phase.includes(phaseKey))
    .slice(0, limit)
}

/* ════════════════════════════════════════════════════
   ☕ DRINKS — กาแฟ / ชา / นม / สมูทตี้ / สกัดเย็น
════════════════════════════════════════════════════ */
export const DRINKS_DB = [

  /* ── ☕ กาแฟ ── */
  { id:501, emoji:"☕", name:"กาแฟดำ (Americano)",         nameEn:"Black Americano",    cal:5,   protein:0, carb:0,  fat:0,  fiber:0, cat:"coffee",   cuisine:"western", hormoneTag:"neutral", hormoneNote:"คาเฟอีน 80mg จำกัด <200mg/วัน ช่วง Luteal", phase:[] },
  { id:502, emoji:"☕", name:"ลาเต้ (นมธรรมดา)",           nameEn:"Latte",              cal:150, protein:8, carb:14, fat:6,  fiber:0, cat:"coffee",   cuisine:"western", hormoneTag:"neutral", hormoneNote:"นมวัวอาจกระตุ้น Estrogen เล็กน้อย",          phase:[] },
  { id:503, emoji:"☕", name:"ลาเต้ (นมโอ๊ต)",             nameEn:"Oat Milk Latte",     cal:130, protein:3, carb:20, fat:4,  fiber:1, cat:"coffee",   cuisine:"western", hormoneTag:"good",    hormoneNote:"Beta-glucan จากโอ๊ตช่วยสมดุล Blood Sugar",   phase:["follicular"] },
  { id:504, emoji:"☕", name:"ลาเต้ (นมอัลมอนด์)",         nameEn:"Almond Milk Latte",  cal:80,  protein:2, carb:8,  fat:4,  fiber:1, cat:"coffee",   cuisine:"western", hormoneTag:"good",    hormoneNote:"แคลอรี่ต่ำ ไม่กระตุ้น Estrogen",            phase:["ovulation","follicular"] },
  { id:505, emoji:"☕", name:"คาปูชิโน่",                  nameEn:"Cappuccino",         cal:90,  protein:5, carb:8,  fat:4,  fiber:0, cat:"coffee",   cuisine:"western", hormoneTag:"neutral", hormoneNote:"",                                            phase:[] },
  { id:506, emoji:"🧋", name:"กาแฟเย็นใส่นม",              nameEn:"Iced Coffee Milk",   cal:180, protein:4, carb:30, fat:4,  fiber:0, cat:"coffee",   cuisine:"western", hormoneTag:"neutral", hormoneNote:"ระวังน้ำตาล spike Insulin",                  phase:[] },
  { id:507, emoji:"☕", name:"มัทฉะลาเต้",                 nameEn:"Matcha Latte",       cal:120, protein:4, carb:16, fat:4,  fiber:0, cat:"coffee",   cuisine:"japanese",hormoneTag:"boost",   hormoneNote:"L-theanine + EGCG ลด Cortisol สมดุลฮอร์โมน", phase:["luteal","menstrual"] },
  { id:508, emoji:"☕", name:"Cold Brew กาแฟ",              nameEn:"Cold Brew",          cal:10,  protein:0, carb:1,  fat:0,  fiber:0, cat:"coffee",   cuisine:"western", hormoneTag:"neutral", hormoneNote:"คาเฟอีน 150mg ไม่ควรดื่มช่วง Luteal",        phase:[] },

  /* ── 🍵 ชา ── */
  { id:511, emoji:"🍵", name:"ชาเขียวญี่ปุ่น",              nameEn:"Green Tea",          cal:2,   protein:0, carb:0,  fat:0,  fiber:0, cat:"tea",      cuisine:"japanese",hormoneTag:"boost",   hormoneNote:"EGCG ช่วย Estrogen metabolism + ลด Cortisol", phase:["ovulation","follicular","luteal"] },
  { id:512, emoji:"🍵", name:"ชาดำ (Black Tea)",             nameEn:"Black Tea",          cal:2,   protein:0, carb:0,  fat:0,  fiber:0, cat:"tea",      cuisine:"western", hormoneTag:"neutral", hormoneNote:"คาเฟอีน 50mg",                               phase:[] },
  { id:513, emoji:"🌸", name:"ชาคาโมมายล์",                 nameEn:"Chamomile Tea",      cal:2,   protein:0, carb:0,  fat:0,  fiber:0, cat:"tea",      cuisine:"western", hormoneTag:"boost",   hormoneNote:"Apigenin ลด Anxiety ช่วย Progesterone",       phase:["luteal","menstrual"] },
  { id:514, emoji:"🌿", name:"ชาสะระแหน่",                  nameEn:"Peppermint Tea",     cal:2,   protein:0, carb:0,  fat:0,  fiber:0, cat:"tea",      cuisine:"western", hormoneTag:"boost",   hormoneNote:"ลด Androgen เหมาะ PCOS ช่วง Follicular",     phase:["follicular","ovulation"] },
  { id:515, emoji:"🫚", name:"ชาขิง",                       nameEn:"Ginger Tea",         cal:10,  protein:0, carb:2,  fat:0,  fiber:0, cat:"tea",      cuisine:"thai",    hormoneTag:"boost",   hormoneNote:"Gingerol ลดปวดประจำเดือน + ต้านอักเสบ",      phase:["menstrual","luteal"] },
  { id:516, emoji:"🌼", name:"ชาดอกคำฝอย (Hibiscus)",       nameEn:"Hibiscus Tea",       cal:5,   protein:0, carb:1,  fat:0,  fiber:0, cat:"tea",      cuisine:"western", hormoneTag:"boost",   hormoneNote:"ลด Cortisol + ความดัน ดีช่วง Luteal",        phase:["luteal","menstrual"] },
  { id:517, emoji:"🌿", name:"ชาชบา (Rosehip)",              nameEn:"Rosehip Tea",        cal:5,   protein:0, carb:1,  fat:0,  fiber:0, cat:"tea",      cuisine:"western", hormoneTag:"boost",   hormoneNote:"วิตามิน C สูง บำรุง Adrenal Hormone",        phase:["follicular","ovulation"] },
  { id:518, emoji:"🟡", name:"ชาขมิ้น (Golden Milk)",       nameEn:"Turmeric Latte",     cal:80,  protein:2, carb:10, fat:3,  fiber:0, cat:"tea",      cuisine:"western", hormoneTag:"boost",   hormoneNote:"Curcumin ต้านอักเสบ ลด PMS อย่างมีประสิทธิภาพ", phase:["luteal","menstrual"] },
  { id:519, emoji:"🍵", name:"ชาอู่หลง",                    nameEn:"Oolong Tea",         cal:2,   protein:0, carb:0,  fat:0,  fiber:0, cat:"tea",      cuisine:"japanese",hormoneTag:"good",    hormoneNote:"Antioxidant ระดับกลาง ช่วย Metabolism",       phase:["follicular"] },
  { id:520, emoji:"🌿", name:"ชา Ashwagandha",               nameEn:"Ashwagandha Tea",    cal:5,   protein:0, carb:1,  fat:0,  fiber:0, cat:"tea",      cuisine:"western", hormoneTag:"boost",   hormoneNote:"Adaptogen ลด Cortisol สูงสุด รักษา Thyroid",  phase:["luteal","menstrual"] },

  /* ── 🥛 นม ── */
  { id:521, emoji:"🥛", name:"นมวัว (ไม่หวาน)",             nameEn:"Whole Milk",         cal:150, protein:8, carb:12, fat:8,  fiber:0, cat:"milk",     cuisine:"western", hormoneTag:"neutral", hormoneNote:"IGF-1 อาจกระตุ้น Estrogen กินพอดี",          phase:[] },
  { id:522, emoji:"🥛", name:"นมพร่องมันเนย",               nameEn:"Low-fat Milk",       cal:100, protein:8, carb:12, fat:3,  fiber:0, cat:"milk",     cuisine:"western", hormoneTag:"neutral", hormoneNote:"",                                            phase:[] },
  { id:523, emoji:"🌾", name:"นมโอ๊ต (ไม่หวาน)",            nameEn:"Oat Milk",           cal:120, protein:3, carb:20, fat:3,  fiber:2, cat:"milk",     cuisine:"western", hormoneTag:"good",    hormoneNote:"Beta-glucan ช่วยสมดุล Blood Sugar + Estrogen",phase:["follicular","luteal"] },
  { id:524, emoji:"🌰", name:"นมอัลมอนด์ (ไม่หวาน)",        nameEn:"Almond Milk",        cal:30,  protein:1, carb:1,  fat:3,  fiber:1, cat:"milk",     cuisine:"western", hormoneTag:"good",    hormoneNote:"วิตามิน E + Mg บำรุง Reproductive hormones", phase:["ovulation","follicular"] },
  { id:525, emoji:"🫘", name:"นมถั่วเหลือง (ไม่หวาน)",      nameEn:"Soy Milk",           cal:80,  protein:7, carb:4,  fat:4,  fiber:1, cat:"milk",     cuisine:"japanese",hormoneTag:"boost",   hormoneNote:"Isoflavone สมดุล Estrogen โดยเฉพาะช่วง Luteal",phase:["follicular","luteal"] },
  { id:526, emoji:"🥥", name:"นมมะพร้าว",                   nameEn:"Coconut Milk",       cal:180, protein:2, carb:3,  fat:18, fiber:0, cat:"milk",     cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"ไขมันดี MCT แต่แคลอรี่สูง",                  phase:[] },
  { id:527, emoji:"🌱", name:"นมเม็ดมะม่วงหิมพานต์",        nameEn:"Cashew Milk",        cal:25,  protein:1, carb:1,  fat:2,  fiber:0, cat:"milk",     cuisine:"western", hormoneTag:"good",    hormoneNote:"แคลอรี่ต่ำ Mg ช่วย PMS",                     phase:["luteal"] },
  { id:528, emoji:"🧀", name:"โยเกิร์ตกรีก (ไม่หวาน)",      nameEn:"Greek Yogurt Plain", cal:100, protein:17,carb:6,  fat:1,  fiber:0, cat:"milk",     cuisine:"western", hormoneTag:"boost",   hormoneNote:"Probiotic + Ca สมดุล Gut-Hormone axis",       phase:["follicular","luteal"] },

  /* ── 🥤 สมูทตี้ ── */
  { id:531, emoji:"🥤", name:"สมูทตี้ผักโขม + กล้วย",       nameEn:"Spinach Banana Smoothie",cal:180,protein:4, carb:38, fat:2, fiber:4, cat:"smoothie", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Fe + Mg + K สมดุลฮอร์โมนช่วง Menstrual",     phase:["menstrual","follicular"] },
  { id:532, emoji:"🥤", name:"สมูทตี้เบอรี่รวม",             nameEn:"Mixed Berry Smoothie",cal:160,protein:3, carb:34, fat:2, fiber:6, cat:"smoothie", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Antioxidant สูง ปกป้อง Hormone receptor",    phase:["ovulation","follicular"] },
  { id:533, emoji:"🥤", name:"สมูทตี้อะโวคาโด + นมอัลมอนด์",nameEn:"Avocado Almond Smoothie",cal:280,protein:4,carb:18,fat:22,fiber:7, cat:"smoothie", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Healthy fat สร้าง Steroid hormones",          phase:["ovulation","follicular"] },
  { id:534, emoji:"🥤", name:"สมูทตี้มะม่วง + ขมิ้น",       nameEn:"Mango Turmeric Smoothie",cal:190,protein:3,carb:42, fat:1, fiber:3, cat:"smoothie", cuisine:"thai",    hormoneTag:"boost",   hormoneNote:"Curcumin ต้านอักเสบ + วิตามิน C",            phase:["luteal","menstrual"] },
  { id:535, emoji:"🥤", name:"สมูทตี้โปรตีน (Whey)",          nameEn:"Protein Smoothie",   cal:200, protein:25,carb:20, fat:3, fiber:2, cat:"smoothie", cuisine:"western", hormoneTag:"good",    hormoneNote:"โปรตีนสูง รักษากล้ามเนื้อช่วง Ovulation",   phase:["ovulation","follicular"] },
  { id:536, emoji:"🥤", name:"สมูทตี้ขิง + แอปเปิล",         nameEn:"Ginger Apple Smoothie",cal:140,protein:1, carb:34, fat:0, fiber:3, cat:"smoothie", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Gingerol ลดอักเสบ + ลด Cortisol",            phase:["menstrual","luteal"] },
  { id:537, emoji:"🥤", name:"สมูทตี้บีทรูท + เบอรี่",       nameEn:"Beetroot Berry Smoothie",cal:150,protein:3,carb:32, fat:1, fiber:4, cat:"smoothie", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Nitrate เพิ่มพลังงาน + Iron ช่วง Menstrual", phase:["menstrual","follicular"] },

  /* ── 🌿 น้ำผักผลไม้สกัดเย็น (Cold Press) ── */
  { id:541, emoji:"🥬", name:"น้ำสกัดเย็นผักโขม + แอปเปิล", nameEn:"Green Cold Press",   cal:80,  protein:2, carb:18, fat:0, fiber:1, cat:"coldpress", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Chlorophyll + Fe detox Estrogen ส่วนเกิน",   phase:["ovulation","follicular"] },
  { id:542, emoji:"🧡", name:"น้ำสกัดเย็นแครอท + ขิง",      nameEn:"Carrot Ginger Press",cal:90,  protein:2, carb:20, fat:0, fiber:1, cat:"coldpress", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Beta-carotene บำรุง Thyroid + Reproductive",  phase:["follicular","ovulation"] },
  { id:543, emoji:"🍋", name:"น้ำสกัดเย็นมะนาว + ขมิ้น",    nameEn:"Lemon Turmeric Press",cal:40, protein:0, carb:9,  fat:0, fiber:0, cat:"coldpress", cuisine:"thai",    hormoneTag:"boost",   hormoneNote:"วิตามิน C + Curcumin detox Liver-Hormone",   phase:["luteal","menstrual"] },
  { id:544, emoji:"🍎", name:"น้ำสกัดเย็นบีทรูท + แอปเปิล", nameEn:"Beet Apple Press",   cal:100, protein:2, carb:22, fat:0, fiber:1, cat:"coldpress", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Nitrate + Iron เพิ่มพลังงาน ช่วง Menstrual", phase:["menstrual","follicular"] },
  { id:545, emoji:"🥒", name:"น้ำสกัดเย็นแตงกวา + สะระแหน่", nameEn:"Cucumber Mint Press",cal:30,  protein:1, carb:6,  fat:0, fiber:0, cat:"coldpress", cuisine:"western", hormoneTag:"good",    hormoneNote:"Hydration ลด Bloating ช่วง Luteal",           phase:["luteal"] },
  { id:546, emoji:"🍍", name:"น้ำสกัดเย็นสับปะรด + ขิง",    nameEn:"Pineapple Ginger Press",cal:110,protein:1,carb:26, fat:0, fiber:1, cat:"coldpress", cuisine:"thai",    hormoneTag:"boost",   hormoneNote:"Bromelain ลดอักเสบ + ลดปวดประจำเดือน",       phase:["menstrual"] },
  { id:547, emoji:"🍇", name:"น้ำสกัดเย็นองุ่นดำ + Acai",   nameEn:"Purple Antioxidant Press",cal:120,protein:1,carb:28,fat:0, fiber:2, cat:"coldpress", cuisine:"western", hormoneTag:"boost",   hormoneNote:"Resveratrol + Anthocyanin ปกป้อง Ovary",      phase:["ovulation","follicular"] },
  { id:548, emoji:"🌿", name:"น้ำสกัดเย็น Celery ล้วน",     nameEn:"Pure Celery Juice",  cal:42,  protein:2, carb:8,  fat:0, fiber:2, cat:"coldpress", cuisine:"western", hormoneTag:"boost",   hormoneNote:"ล้าง Estrogen ส่วนเกิน + ลด Inflammation",   phase:["ovulation","follicular"] },
]

/* ── Merge drinks into FOOD_DB ── */
FOOD_DB.push(...DRINKS_DB)

/* ════════════════════════════════════════════════════
   🍰 SNACK & BAKERY — ขนมปัง / คลีน / คีโต / ไทย
════════════════════════════════════════════════════ */
export const SNACK_DB = [

  /* ── 🍞 ขนมปัง / Bakery ── */
  { id:601, emoji:"🍞", name:"ขนมปังโฮลวีท 1 แผ่น",      nameEn:"Whole Wheat Bread",     cal:80,  protein:4,  carb:14, fat:1,  fiber:2, cat:"bakery",  cuisine:"western", hormoneTag:"good",    hormoneNote:"ไฟเบอร์สูง ช่วย detox Estrogen",              phase:["follicular"] },
  { id:602, emoji:"🥖", name:"ขนมปังไรย์ 1 แผ่น",         nameEn:"Rye Bread",             cal:83,  protein:3,  carb:15, fat:1,  fiber:2, cat:"bakery",  cuisine:"western", hormoneTag:"good",    hormoneNote:"GI ต่ำ ไม่ spike Insulin",                    phase:["follicular","luteal"] },
  { id:603, emoji:"🥐", name:"ครัวซองต์",                  nameEn:"Croissant",             cal:272, protein:5,  carb:31, fat:14, fiber:1, cat:"bakery",  cuisine:"western", hormoneTag:"avoid",   hormoneNote:"ไขมัน Trans สูง กระทบ Hormone ผลิต",          phase:[] },
  { id:604, emoji:"🧁", name:"มัฟฟินบลูเบอรี่",            nameEn:"Blueberry Muffin",      cal:340, protein:5,  carb:52, fat:13, fiber:2, cat:"bakery",  cuisine:"western", hormoneTag:"neutral", hormoneNote:"น้ำตาลสูง กินพอประมาณ",                      phase:[] },
  { id:605, emoji:"🍞", name:"ขนมปังธัญพืช 1 แผ่น",       nameEn:"Multigrain Bread",      cal:90,  protein:4,  carb:16, fat:2,  fiber:3, cat:"bakery",  cuisine:"western", hormoneTag:"good",    hormoneNote:"Zinc + Mg จากเมล็ดธัญพืช บำรุงฮอร์โมน",      phase:["follicular","ovulation"] },
  { id:606, emoji:"🥨", name:"ขนมปังปิ้ง + อะโวคาโด",     nameEn:"Avocado Toast",         cal:210, protein:5,  carb:20, fat:13, fiber:5, cat:"bakery",  cuisine:"western", hormoneTag:"boost",   hormoneNote:"Healthy fat + ไฟเบอร์ สร้าง Steroid hormone", phase:["ovulation","follicular"] },
  { id:607, emoji:"🥞", name:"แพนเค้กกล้วยไข่ (2 ชิ้น)",  nameEn:"Banana Egg Pancake",    cal:160, protein:8,  carb:22, fat:5,  fiber:2, cat:"bakery",  cuisine:"western", hormoneTag:"good",    hormoneNote:"ไม่มีน้ำตาล ทำจากกล้วย + ไข่ล้วน",          phase:["follicular","luteal"] },
  { id:608, emoji:"🧇", name:"วาฟเฟิลโอ๊ต",               nameEn:"Oat Waffle",            cal:180, protein:6,  carb:28, fat:5,  fiber:3, cat:"bakery",  cuisine:"western", hormoneTag:"good",    hormoneNote:"Beta-glucan ช่วย Estrogen balance",           phase:["follicular"] },

  /* ── 🥗 ขนมคลีน / Healthy Snack ── */
  { id:611, emoji:"🍫", name:"โปรตีนบาร์ (ช็อกโกแลต)",    nameEn:"Protein Bar Choco",     cal:200, protein:20, carb:22, fat:6,  fiber:3, cat:"clean",   cuisine:"western", hormoneTag:"good",    hormoneNote:"โปรตีนสูง รักษากล้ามเนื้อช่วง Ovulation",   phase:["ovulation","follicular"] },
  { id:612, emoji:"🌾", name:"กราโนล่าบาร์ (ไม่หวาน)",    nameEn:"Granola Bar No Sugar",  cal:150, protein:4,  carb:22, fat:6,  fiber:3, cat:"clean",   cuisine:"western", hormoneTag:"good",    hormoneNote:"ไฟเบอร์ + Mg ลด PMS",                        phase:["luteal"] },
  { id:613, emoji:"🫘", name:"ถั่วรวม (Mixed Nuts) 30g",   nameEn:"Mixed Nuts",            cal:170, protein:5,  carb:6,  fat:15, fiber:2, cat:"clean",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"Omega-3 + Vit E + Mg บำรุงฮอร์โมนรวม",       phase:["ovulation","luteal","follicular"] },
  { id:614, emoji:"🧀", name:"ชีสสติ๊ก (Low-fat)",         nameEn:"Low-fat Cheese Stick",  cal:70,  protein:6,  carb:1,  fat:4,  fiber:0, cat:"clean",   cuisine:"western", hormoneTag:"neutral", hormoneNote:"Ca บำรุง Bone + ลด PMS",                     phase:["luteal"] },
  { id:615, emoji:"🥕", name:"แครอทจิ้มฮิวมัส",            nameEn:"Carrot + Hummus",       cal:100, protein:4,  carb:14, fat:4,  fiber:4, cat:"clean",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"Beta-carotene + Chickpea Phytoestrogen",      phase:["follicular","ovulation"] },
  { id:616, emoji:"🍎", name:"แอปเปิล + เนยอัลมอนด์",     nameEn:"Apple + Almond Butter", cal:190, protein:4,  carb:28, fat:9,  fiber:5, cat:"clean",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"Quercetin ต้านอักเสบ + Healthy fat",         phase:["follicular","luteal"] },
  { id:617, emoji:"🫙", name:"ข้าวโอ๊ตบอล (Energy Ball)",  nameEn:"Oat Energy Ball",       cal:120, protein:3,  carb:18, fat:5,  fiber:2, cat:"clean",   cuisine:"western", hormoneTag:"good",    hormoneNote:"ไม่มีน้ำตาล ให้พลังงาน Sustained",          phase:["follicular","ovulation"] },
  { id:618, emoji:"🥒", name:"แตงกวา + กรีกโยเกิร์ต dip", nameEn:"Cucumber Yogurt Dip",   cal:80,  protein:6,  carb:8,  fat:2,  fiber:1, cat:"clean",   cuisine:"western", hormoneTag:"boost",   hormoneNote:"Probiotic + Hydration ลด Bloating",          phase:["luteal"] },
  { id:619, emoji:"🌱", name:"ซีเรียลโปรตีนสูง (ไม่หวาน)", nameEn:"High-Protein Cereal",   cal:130, protein:10, carb:18, fat:3,  fiber:4, cat:"clean",   cuisine:"western", hormoneTag:"good",    hormoneNote:"โปรตีน + ไฟเบอร์ ไม่ spike Insulin",        phase:["follicular"] },

  /* ── 🥑 ขนมคีโต / Low-carb ── */
  { id:621, emoji:"🥑", name:"คีโตบราวนี่ (อัลมอนด์แป้ง)", nameEn:"Keto Brownie",          cal:180, protein:5,  carb:6,  fat:16, fiber:3, cat:"keto",    cuisine:"western", hormoneTag:"boost",   hormoneNote:"ดาร์กช็อก + Almond flour Mg สูง ลด PMS",    phase:["luteal","menstrual"] },
  { id:622, emoji:"🧁", name:"คีโตมัฟฟิน (ชีส + เบคอน)",   nameEn:"Keto Cheese Muffin",    cal:220, protein:12, carb:3,  fat:18, fiber:1, cat:"keto",    cuisine:"western", hormoneTag:"neutral", hormoneNote:"โปรตีนสูง คาร์บต่ำ",                         phase:[] },
  { id:623, emoji:"🍪", name:"คีโตคุกกี้ (เนยถั่ว)",        nameEn:"Keto Peanut Butter Cookie",cal:160,protein:6, carb:4,  fat:14, fiber:2, cat:"keto",    cuisine:"western", hormoneTag:"good",    hormoneNote:"Healthy fat + ไม่มีน้ำตาล",                 phase:["follicular","ovulation"] },
  { id:624, emoji:"🥓", name:"คีโตแร็พ (ใบกะหล่ำ)",         nameEn:"Keto Lettuce Wrap",     cal:150, protein:14, carb:4,  fat:9,  fiber:2, cat:"keto",    cuisine:"western", hormoneTag:"good",    hormoneNote:"โปรตีนสูง ไฟเบอร์จากผัก",                   phase:["ovulation","follicular"] },
  { id:625, emoji:"🧀", name:"คีโตชีสแครกเกอร์",            nameEn:"Keto Cheese Cracker",   cal:130, protein:8,  carb:2,  fat:10, fiber:0, cat:"keto",    cuisine:"western", hormoneTag:"neutral", hormoneNote:"Ca บำรุง Bone + ไม่ spike Insulin",          phase:[] },
  { id:626, emoji:"🥚", name:"ไข่ลวกกับเนยอัลมอนด์",       nameEn:"Egg + Almond Butter",   cal:200, protein:10, carb:4,  fat:16, fiber:2, cat:"keto",    cuisine:"western", hormoneTag:"boost",   hormoneNote:"Choline + Healthy fat สร้าง Steroid hormone",phase:["follicular","ovulation"] },
  { id:627, emoji:"🫐", name:"คีโตชีสเค้ก (ไม่มีน้ำตาล)",  nameEn:"No-sugar Keto Cheesecake",cal:190,protein:7,  carb:5,  fat:16, fiber:0, cat:"keto",    cuisine:"western", hormoneTag:"neutral", hormoneNote:"",                                            phase:[] },

  /* ── 🍮 ขนมไทยดั้งเดิม ── */
  { id:631, emoji:"🍮", name:"ขนมถ้วยฟู",                   nameEn:"Thai Steamed Cake",     cal:120, protein:3,  carb:22, fat:3,  fiber:0, cat:"thaibake", cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                                            phase:[] },
  { id:632, emoji:"🥥", name:"วุ้นกะทิ",                    nameEn:"Coconut Jelly",         cal:100, protein:1,  carb:16, fat:4,  fiber:0, cat:"thaibake", cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                                            phase:[] },
  { id:633, emoji:"🌾", name:"ข้าวเหนียวมะม่วง (ครึ่งจาน)", nameEn:"Mango Sticky Rice Half",cal:180, protein:3,  carb:36, fat:4,  fiber:1, cat:"thaibake", cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"มะม่วงวิตามิน C สูง",                        phase:[] },
  { id:634, emoji:"🍡", name:"ขนมต้ม (ถั่วดำ)",             nameEn:"Khanom Tom",            cal:130, protein:3,  carb:22, fat:4,  fiber:2, cat:"thaibake", cuisine:"thai",    hormoneTag:"good",    hormoneNote:"ถั่วดำ Phytoestrogen + Mg",                   phase:["follicular","luteal"] },
  { id:635, emoji:"🟡", name:"ทองหยิบ / ทองหยอด",           nameEn:"Thai Gold Dessert",     cal:180, protein:3,  carb:38, fat:3,  fiber:0, cat:"thaibake", cuisine:"thai",    hormoneTag:"avoid",   hormoneNote:"น้ำตาลสูงมาก spike Insulin",                 phase:[] },
  { id:636, emoji:"🍚", name:"ขนมเปียกปูน",                  nameEn:"Thai Steamed Pudding",  cal:110, protein:1,  carb:22, fat:2,  fiber:0, cat:"thaibake", cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                                            phase:[] },
  { id:637, emoji:"🥥", name:"สังขยาฟักทอง",                nameEn:"Pumpkin Custard",       cal:140, protein:5,  carb:18, fat:6,  fiber:1, cat:"thaibake", cuisine:"thai",    hormoneTag:"good",    hormoneNote:"Beta-carotene + Ca บำรุงฮอร์โมน",             phase:["follicular"] },
  { id:638, emoji:"🌿", name:"ขนมชั้นใบเตย",                nameEn:"Pandan Layer Cake",     cal:100, protein:1,  carb:22, fat:1,  fiber:0, cat:"thaibake", cuisine:"thai",    hormoneTag:"neutral", hormoneNote:"",                                            phase:[] },
  { id:639, emoji:"🫘", name:"ถั่วกวน (ถั่วเขียว)",          nameEn:"Mung Bean Sweet",       cal:130, protein:4,  carb:26, fat:1,  fiber:3, cat:"thaibake", cuisine:"thai",    hormoneTag:"good",    hormoneNote:"Phytoestrogen จากถั่วเขียว สมดุล Estrogen",   phase:["follicular","luteal"] },
  { id:640, emoji:"🍌", name:"กล้วยบวชชี",                  nameEn:"Banana in Coconut Milk",cal:220, protein:2,  carb:42, fat:6,  fiber:2, cat:"thaibake", cuisine:"thai",    hormoneTag:"good",    hormoneNote:"แมกนีเซียมจากกล้วย ลด PMS",                  phase:["luteal"] },
]

/* ── Merge snacks into FOOD_DB ── */
FOOD_DB.push(...SNACK_DB)

/* ── Update CATEGORIES with bakery categories ── */
CATEGORIES.push(
  { id: "bakery",   label: "🍞 ขนมปัง"     },
  { id: "clean",    label: "🥗 ขนมคลีน"    },
  { id: "keto",     label: "🥑 คีโต"        },
  { id: "thaibake", label: "🍮 ขนมไทย"     }
)