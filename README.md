# The Curator | Smart Calendar 🕊️

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**The Curator** is a high-end, editorial-inspired calendar application designed for those who treat their schedule like a curated collection of moments. Beyond basic scheduling, it emphasizes reflection, editorial intelligence, and aesthetic excellence. It is fully **PWA-enabled**, meaning it can be installed on your desktop or mobile device and used entirely **offline**.

<div align="center">
  <img width="1200" height="auto" alt="Project Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## ✨ Key Features

- **📱 Web App (PWA)**: Installable on iOS, Android, and Desktop. Works offline with "Offline-First" architecture.
- **💾 Local Persistence**: All your notes and profile settings are saved locally in your browser—no backend required.
- **🏛️ High-End Aesthetic**: A premium "editorial" interface featuring modern typography (Newsreader & Inter) and dynamic color-splash backdrops that shift with the months.
- **📅 Multi-Perspective Navigation**:
  - **Monthly View**: Detailed day-to-day curation with hero imagery.
  - **Yearly Archive**: A bird's-eye view of your entire year's activity.
  - **Pinned Collection**: A dedicated space for your most significant entries.
- **✍️ Intelligent Entry System**: Categorize your life into *Editorial*, *Reflection*, or *Memo* entries with support for custom labels and multi-day ranges.
- **🔄 Smart Recurrence**: Effortlessly schedule weekly or monthly recurring events.
- **🔍 Full-Archive Search**: A lightning-fast, fullscreen search overlay to rediscover moments across years.
- **📸 Export to PNG**: Generate beautiful, high-quality images of your monthly calendar for sharing or archival purposes.
- **🔔 Proactive Reminders**: Built-in notification polling to keep track of upcoming events.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Exporting**: [modern-screenshot](https://github.com/weidongnian/modern-screenshot)

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest stable version recommended)
- pnpm / npm / yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/smart-calendar.git
   cd smart-calendar
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file (see `.env.example`) and add your required keys:
   ```env
   VITE_APP_NAME="The Curator"
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   pnpm build
   ```

## 🌐 Deployment

This project is optimized for modern static hosting.

### Deploy to Vercel
1. Install [Vercel CLI](https://vercel.com/download): `pnpm i -g vercel`
2. Run `vercel` in the root directory.
3. The `vercel.json` will automatically handle Single Page App (SPA) routing.

### Deploy to Netlify
1. Drag and drop the `dist/` folder into [Netlify Drop](https://app.netlify.com/drop).
2. Or use the Netlify CLI: `pnpm i -g netlify-cli && netlify deploy --prod`.

## 🏗️ Project Structure

The project follows a modular, clean-code architecture to ensure maintainability:

```text
src/
├── components/
│   └── Calendar/
│       ├── layout/    # Header, Sidebar, Nav components
│       ├── calendar/  # Grid, Cell, Hero primitives
│       ├── views/     # Monthly, Yearly, Pinned view logic
│       ├── notes/     # Note cards and lists
│       └── modals/    # Search, Profile, and Entry modals
├── hooks/
│   └── useCalendar.ts # Centralized business logic & state
├── constants.ts       # Themes, holiday data, and initial state
└── utils.ts           # Calendar arithmetic and styling helpers
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ from SuperPlugs
</p>
