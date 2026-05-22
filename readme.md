# HormoneEats 🌿
 
A bilingual (TH/EN) nutrition PWA that helps women eat in sync with their menstrual cycle — built with React + Vite, designed in Figma.
 
**Live demo:** https://hormoneeats.vercel.app  
**Figma file:** [View design file](#)  
**Repo:** https://github.com/Ariya-uxui/hormoneeats
 
---
 
## Why I built this
 
Most nutrition apps treat every day the same. But hormones shift dramatically across a 28-day cycle — affecting metabolism, hunger, energy, and cravings. I wanted to build something that reflects that reality.
 
The challenge wasn't just the UI. It was designing a system that could surface the right information at the right phase, without overwhelming the user.
 
---
 
## Design → Implementation decisions
 
### 1. Phase-aware architecture
Each of the 4 hormone phases (Follicular, Ovulation, Luteal, Menstrual) has its own color token, calorie range, food recommendations, and avoid list — all defined in a single `PHASES` object in `App.jsx`.
 
**Why:** Keeping phase data co-located with design tokens meant the UI could stay in sync with content without a CMS. Any phase update touches one place.
 
### 2. Single source of truth for food diary
Both the Tracker screen and the Food Calendar read/write to the same `diary` state — keyed by date (`YYYY-MM-DD`). Cart items sync to diary on toggle.
 
**Why:** Early versions had separate state for tracker and calendar, which caused inconsistencies when the same meal appeared in both views. Merging them eliminated the sync problem entirely.
 
### 3. Routing without React Router
Navigation is managed with a single `screen` state string rather than React Router. `quiz` and `onboarding` are treated as separate states, not routes — so `BottomNav` never renders during those flows.
 
**Why:** For a self-contained mobile PWA with a fixed screen structure, a router added complexity without benefit. The tradeoff is no deep linking — an acceptable limitation for this use case.
 
**Bug I fixed:** An earlier version used `setTimeout(() => setScreen("onboarding"), 50)` after quiz completion, creating a race condition where `BottomNav` would flash during the transition. Removing the timeout and calling `setScreen` directly resolved it.
 
### 4. Bilingual support (TH/EN)
All UI strings are pulled through a `getT(lang)` helper from `translations.js`. Language preference persists in `localStorage`.
 
**Why:** The primary users are Thai women, but I wanted the app to be usable by anyone. Centralizing strings also made it easy to audit missing translations.
 
### 5. PWA setup
Includes `manifest.json`, service worker, and iOS-compatible icons — installable on home screen with offline capability for core features.
 
---
 
## Tech stack
 
| Layer | Choice | Reason |
|---|---|---|
| Framework | React + Vite | Fast HMR, familiar ecosystem |
| Styling | Inline styles + design tokens | No build step for styles, tokens stay in JS |
| State | useState + useLocalStorage hook | No server needed, data persists across sessions |
| i18n | Custom `getT()` helper | Lightweight, no library overhead |
| Deploy | Vercel | Zero-config, auto-deploy on push |
| Design | Figma | Full component specs before implementation |
 
---
 
## Design tokens
 
All colors, spacing references, and phase theming come from a `tokens` object — the single source for both Figma variables and React inline styles.
 
```js
tokens.lavender     // primary accent
tokens.cream        // base background
tokens.follicular   // phase color — Follicular
tokens.ovulation    // phase color — Ovulation
tokens.luteal       // phase color — Luteal
tokens.menstrual    // phase color — Menstrual
```
 
---
 
## Screens
 
| Screen | Description |
|---|---|
| HormoneQuiz | Onboarding quiz that determines hormone type |
| Home | Phase summary, daily cal target, quick actions |
| Tracker | Food selection synced to diary |
| Food Calendar | Daily diary view across dates |
| Mood Tracker | Daily mood logging tied to cycle phase |
| Weight | Weight history chart |
| Profile | User settings, phase override |
 
---
 
## Local setup
 
```bash
git clone https://github.com/Ariya-uxui/hormoneeats
cd hormoneeats
npm install
npm run dev
```
 
Runs on `http://localhost:5173`
 
---
 
## What I'd improve next
 
- **TypeScript** — prop types are currently implicit; migrating would catch bugs earlier
- **Real cycle tracking API** — connect to Apple Health or Google Fit for actual cycle data instead of manual input
- **Accessibility audit** — keyboard navigation and ARIA labels need a full pass
- **Testing** — add Vitest unit tests for `toggleCartItem` and diary sync logic
---
 
*Designed and built by Ariya Teeradakorn*  
[Portfolio](https://ariyaproject.netlify.app) · [LinkedIn](https://linkedin.com/in/ariya-teeradakorn-24b73a264/)