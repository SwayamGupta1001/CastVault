<div align="center">

# 🏎️ CastVault

### *The Ultimate Scale Model Collector's Showroom, Vault & Valuation Platform*

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Oxlint](https://img.shields.io/badge/Linter-Oxlint_0_Errors-brightgreen?style=for-the-badge)](https://oxc.rs)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

<p align="center">
  <b>Built for diecast & resin enthusiasts</b>—from <b>1:64</b> pocket castings to <b>1:18</b> hand-assembled resin masterworks.
</p>

[Explore Features](#-key-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Architecture](#-project-architecture) • [Creator](#-meet-the-creator)

---

</div>

## 🌟 Overview

**CastVault** is a modern, offline-first digital showroom and portfolio valuation manager engineered specifically for scale model car collectors. Unlike generic inventory apps or spreadsheets, CastVault is crafted around the culture, aesthetics, and nuances of the hobby: carded blister condition, casting tiers, limited-edition serials, and real-time financial ROI tracking.

Whether you collect **Hot Wheels mainline pegs**, **Mini GT & Inno64 JDM premiums**, or **AutoArt & BBR 1:18 display centerpieces**, CastVault gives you a high-fidelity visual vault at your fingertips.

---

## ⚡ Key Features

### 🎴 3D Interactive Showroom & Vault
* **Physics-Based 3D Tilt**: Hover and pointer-tracked 3D card perspective transforms with dynamic ambient glare that accentuates casting paint and wheels.
* **Multi-Scale Filtering**: Seamlessly toggle between `1:64`, `1:43`, `1:24`, `1:18`, and `1:12` scales.
* **Instant Filtering & Search**: Instantaneous client-side filtering across vehicle make, model, custom manufacturer, serial number, and collector notes.
* **Dual View Modes**: Switch between high-visual 3D Cover Art Cards and dense, sortable List View.

### 📈 Financial Valuation & Portfolio Analytics Engine
* **P&L and Value Delta**: Track total acquisition cost versus current estimated collector value with automated ROI percentage indicators.
* **Scale Distribution Breakdown**: Visual bar and pie charts illustrating investment and model allocation across scales.
* **Brand Ranking**: Automatic ranking of your most-collected brands and manufacturers.
* **Condition Analysis**: Breakdown by packaging state (*Mint in Box*, *Blister Carded*, *Loose / Mint*, *Code 3 Custom*, etc.).

### 💱 Global Multi-Currency Support
* Seamless valuation display with one-click toggles across **USD ($)**, **INR (₹)**, **EUR (€)**, **GBP (£)**, **JPY (¥)**, **CAD ($)**, **AUD ($)**, and **AED (د.إ)**.
* Stored persistently in local preferences for consistent valuation metrics.

### 🏭 Authoritative Directory of Top 25 Manufacturers
* Comprehensive encyclopedia of the world's most revered model makers (Hot Wheels, Mini GT, Inno64, AutoArt, BBR, Spark, Tarmac Works, Kaido House, Schuco, and more).
* Filter by tiers: **Budget Peg**, **Mid Collector**, **Premium Resin**, and **Ultra-Detailed Diecast**.
* Detailed founding heritage, country flags, specialty scales, and direct brand links.

### 🔍 QuickPeek Drawer & Side-by-Side Model Comparison
* Slide-out drawer with high-resolution photo gallery, model specifications, condition badges, release years, and purchase logs.
* Direct model-to-model comparison mode for checking casting variations, wheels, and livery differences.

### ✍️ Real-Time Signature Animation & Synced Startup Loader
* Custom vector-traced signature engine rendering the creator's autograph in real time with an animated glowing pen spark tip.
* Seamless startup loading screen that synchronizes precisely with the signature cycle to introduce the showroom before revealing the vault.

### 📱 Offline-First PWA & Native Haptic Feedback
* **100% Offline Capability**: Runs locally with `localStorage` and zero reliance on external cloud databases.
* **Client-Side Image Compression**: Automatic canvas-based image downsampling and optimization on upload to prevent memory bloat.
* **PWA Installable**: Can be installed to home screens on iOS, Android, and Desktop with offline icon caching.
* **Haptic Engine**: Tactile vibration feedback for actions, button taps, and model saves on supported mobile devices.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Core Framework** | [React 19](https://react.dev/) + [TypeScript 6](https://www.typescriptlang.org/) |
| **Bundler & Tooling** | [Vite 8](https://vitejs.dev/) with Fast Refresh |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism UI |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) + [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Linter & Code Quality** | [Oxlint](https://oxc.rs/) (0 errors, 0 warnings across all files) |
| **Storage Engine** | Offline `localStorage` with client-side canvas image downscaling |

---

## 📁 Project Architecture

```
CastVault/
├── public/                 # Static web assets & PWA manifest
├── src/
│   ├── assets/             # Brand art and signature assets
│   ├── components/         # Reusable UI widgets & modals
│   │   ├── AddModelModal.tsx       # Model creation & photo uploader
│   │   ├── AppDownloadModal.tsx    # Unified iOS/Android PWA download guide
│   │   ├── Card3D.tsx              # Interactive 3D tilt card component
│   │   ├── ClearDataModal.tsx      # Safe collection wipe & reset modal
│   │   ├── CompareModal.tsx        # Side-by-side comparison modal
│   │   ├── Navbar.tsx              # Header with instant search bar
│   │   ├── QuickPeekDrawer.tsx     # Spec sheet and photo inspection drawer
│   │   ├── SignatureAnimation.tsx  # Canvas real-time writing engine
│   │   ├── StartupLoader.tsx       # Intro loader synchronized with signature
│   │   └── StatStrip.tsx           # Quick metric bar
│   ├── data/               # Static datasets (Top 25 manufacturers, sample vault)
│   ├── types/              # Central TypeScript definitions
│   ├── utils/              # Helper utilities
│   │   ├── currency.ts             # Multi-currency formatting & rates
│   │   ├── haptics.ts              # Mobile vibration haptics
│   │   ├── imageCompressor.ts      # Client-side canvas image compression
│   │   └── storage.ts              # LocalStorage repository & state
│   ├── views/              # Main application views
│   │   ├── AboutView.tsx           # Founder story, links, and signature
│   │   ├── BrandsView.tsx          # 25 Diecast manufacturers encyclopedia
│   │   ├── GarageView.tsx          # Main collection showroom
│   │   ├── SettingsView.tsx        # Preferences, currency, and vault options
│   │   └── StatsView.tsx           # Financial P&L and portfolio charts
│   ├── App.tsx             # Root application orchestrator
│   └── main.tsx            # React DOM entry point
├── .gitignore              # Configured ignore rules for clean commits
├── package.json            # Project manifest & scripts
├── tsconfig.json           # Strict TypeScript configuration
└── vite.config.ts          # Vite build pipeline
```

---

## 🚀 Quick Start

### Prerequisites
* [Node.js](https://nodejs.org/) (version `18.0.0` or higher recommended)
* `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SwayamGupta1001/CastVault.git
   cd CastVault
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 📜 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts Vite dev server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles TypeScript (`tsc -b`) and generates optimized production bundle in `dist/`. |
| `npm run lint` | Runs `oxlint` to enforce code quality and React 19 rules of hooks. |
| `npm run preview` | Locally serves the production build from `dist/` for verification. |

---

## 👨‍💻 Meet the Creator

<div align="center">

### **Swayam Gupta**
*Founder & Lead Developer*

Passionate diecast collector focusing on **1:64 JDM classics** and **1:18 resin supercars**. Architected and developed CastVault as a dedicated home for scale model collectors worldwide.

[![GitHub](https://img.shields.io/badge/GitHub-SwayamGupta1001-181717?style=flat-square&logo=github)](https://github.com/SwayamGupta1001/CastVault)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com)
[![Instagram](https://img.shields.io/badge/Instagram-Follow-E4405F?style=flat-square&logo=instagram)](https://www.instagram.com)

</div>

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to explore, customize, and build upon it.

<div align="center">
  <sub>Engineered with precision for scale model enthusiasts worldwide • CastVault</sub>
</div>
