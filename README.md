# 🍚 Dorm Recipe Exchange (Mobile Web App)

> A mobile-first peer-to-peer culinary platform designed for university students operating under dorm appliance restrictions and micro-budgets (THB 40–1000).

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?style=flat&logo=vercel)](https://vercel.com)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Tooling-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)

---

## 📱 Interactive Figma UI Showcase (13 Prototype Screens)

| Login Screen | Create Account | OTP Verification |
|---|---|---|
| ![Login Screen](screenshots/login.png) | ![Create Account](screenshots/create%20account.png) | ![OTP Verification](screenshots/OTP%20VERIFICATION.png) |

| Home Feed | Filter Sheet (THB 40-1000) | Recipe Detail |
|---|---|---|
| ![Home Feed](screenshots/home%20screen.png) | ![Filter Sheet](screenshots/filter%20reciepes.png) | ![Recipe Detail](screenshots/recipe.png) |

| Share a Recipe | Edit Recipe | My Recipes & Undo Toast |
|---|---|---|
| ![Share Recipe](screenshots/share%20a%20reciepe.png) | ![Edit Recipe](screenshots/edit%20reciepes.png) | ![My Recipes](screenshots/my%20reciepes.png) |

| Saved Recipes Grid | Leaderboard Podium | User Profile Customization |
|---|---|---|
| ![Saved Recipes](screenshots/SAVED%20RECIPES.png) | ![Leaderboard](screenshots/leaderboard.png) | ![Profile](screenshots/profile.png) |

| Edit Profile Modal |
|---|
| ![Edit Profile Modal](screenshots/profile_edit.png) |

---

## ✨ Key Features & Unique Selling Propositions (USP)

1. **Dorm Appliance Filtering Engine**: Filter recipes specifically for **Rice Cooker**, **Microwave**, **Induction Plate**, **Stovetop**, or **No Cook**.
2. **Granular Local Micro-Budgeting**: Filter recipes within your exact budget ceiling (THB 40 to THB 1000).
3. **Campus Verified Email Badging**: Automatic verification for institutional domains (`.edu`), displaying a Gold Verified Badge.
4. **Touch Gestures & 5s Undo Toast**: Swipe-left card reveal with Edit & Delete drawers, backed by a 5-second circular SVG countdown undo toast.
5. **Multi-Recipe Weighted Ranking Engine**: Gamified campus leaderboard ranking student chefs fairly across multiple recipes.
6. **User Profile Customization**: Customize your Display Name, Profile Avatar Picture, and Student Bio with the interactive Edit Profile modal.
7. **Zero Public Email Privacy Architecture**: Client payloads and database views isolate private email addresses from public API endpoints.

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework**: React 19 SPA
* **Build Tooling**: Vite (Fast HMR & Production Bundler)
* **Styling Engine**: Tailwind CSS v4 + Warm Memphis-Lite Custom Token Utilities
* **Deployment Network**: Vercel Edge Network (Global CDN)
* **Database Schema (Backend Blueprint)**: Supabase PostgreSQL + Row-Level Security (RLS) policies

---

## 🚀 Quick Start (Local Development)

```bash
# Install dependencies
pnpm install

# Start Vite local development server
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

---

## 🌐 Deploy to Vercel (Instant 1-Click Deployment)

You can host this application live on Vercel for free in under 2 minutes:

1. Push this repository to **GitHub**.
2. Go to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository. Vercel will automatically detect Vite and deploy your app to a live URL (e.g. `dorm-recipe-exchange.vercel.app`).

Alternatively, deploy directly from your terminal using Vercel CLI:
```bash
npx vercel
```

---

## 🔒 Security & Privacy Policy

* **RFC 9116 Disclosure**: `/.well-known/security.txt`
* **Web Crawler Policy**: `/robots.txt`
* **OWASP Top 10 Aligned**: Zero public email exposure, client-side sanitization, strict touch target boundaries (WCAG 2.5.5).

---

*Developed for Mobile Application Development Group Course Project.*
