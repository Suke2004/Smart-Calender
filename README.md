# The Curator | Smart Calendar & Academic Ledger

**The Curator** is a professional, high-end editorial calendar and intelligent attendance tracking suite designed specifically for power-users and university students (B.Tech). Built with a cinematic visual identity, it blends productivity with mindful reflection and predictive analytics.

---

## 🌟 Key Features

### 🏛️ The Curator (Calendar Module)
- **Editorial Experience**: A beautifully responsive monthly/yearly grid inspired by premium print magazines.
- **Smart Notes**: Categorize thoughts as *Editorial* (Standard), *Reflection* (Deep), or *Memo* (Fast).
- **Recurrence Logic**: Support for weekly and monthly recurring reminders.
- **Search & Filter**: Global search overlay to find any past memory or scheduled event instantly.

### 🎓 The Academy (Academic Ledger)
- **Intelligent Attendance**: Not just a logger—it's an "Oracle" dashboard that predicts your path.
- **Predictive Math**: Human-readable insights like *"You can safely skip 3 classes"* or *"Must attend next 5 classes to recover."*
- **The Timetable Engine**: Context-aware scheduling. See only what's scheduled for *today* to minimize clutter.
- **Deep Dive Analytics**: Interactive area charts (Recharts) visualizing your attendance trajectory over 30 days.
- **The Time Machine**: An interactive mini-calendar for rapid historical back-logging and status toggling.

### 🧩 Global Features
- **Cinematic Onboarding**: Multi-step setup with integrated camera support for personal profile photos.
- **Dual-Module Dock**: A floating OSX-style dock for seamless navigation between the Calendar and the Ledger.
- **Offline-First (PWA)**: Fully installable Progressive Web App. All your data lives in local storage—zero cloud latency, zero privacy concerns.

---

## 🛠️ Technology Stack
- **Frontend**: React 19 + TypeScript
- **State Management**: Custom Hooks (`useCalendar`, `useAcademy`) with Local Storage persistence.
- **Animations**: Framer Motion (Motion 12)
- **Data Viz**: Recharts
- **Icons**: Lucide React
- **Date Handling**: Date-fns
- **Styling**: Tailwind CSS 4

---

## 🚀 Getting Started

### Local Development
```bash
# Install dependencies
pnpm install

# Run dev server
pnpm run dev
```

### Installation (PWA)
1. Open the hosted URL in Chrome/Safari/Brave.
2. Click the **"Install"** or **"Add to Home Screen"** icon in the address bar.
3. Access "The Curator" as a native app on your desktop or mobile device.

### Hosting
The project is pre-configured for **Vercel** with a `vercel.json` SPA rewriter. Simply connect your GitHub repository to Vercel and it will deploy automatically.

---

## 🧘‍♀️ Mindful Design
Every pixel of The Curator is designed to feel calm and organized. From the glassmorphic modals to the subtle color-splash backgrounds that shift based on the month, it is an interface that respects your focus.

---

*Curate your life. Master your schedule.*
<div align="center">
  Built with love from SuperPlugs
</div>