# 🎫 Eventix Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
</p>

<p align="center">
  Modern event booking frontend built with <strong>Next.js 16 App Router</strong> — featuring real-time availability, dark/light theming, protected routes, and a fully responsive design.
</p>

---

## 🌐 Live Demo

🔗 **[https://eventixbooking.vercel.app](https://eventixbooking.vercel.app)**

---

## 📖 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Architecture](#-architecture)
- [Deployment](#-deployment)
- [Documentation Index](#-documentation-index)

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | Accessible UI component library |
| **SWR** | Data fetching with caching |
| **Sonner** | Toast notification system |
| **Lucide React** | Icon library |
| **next-themes** | Dark/light mode theming |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏠 **Home Page** | Hero section, featured events carousel, call-to-action |
| 🎪 **Event Browsing** | Search, sort, paginate events with status badges |
| 📋 **Event Detail** | Full info, availability bar, book tickets |
| 🎟 **Booking System** | Ticket selection (1–6), confirmation, error handling |
| 📑 **My Bookings** | View all bookings, cancel with confirmation |
| 🔐 **Authentication** | Login, register, JWT refresh, session persistence |
| 👑 **Admin Panel** | Event CRUD, user management, audit logs |
| 🌗 **Dark/Light Theme** | System-aware toggle with smooth transitions |
| 📱 **Responsive Design** | Mobile, tablet, and desktop layouts |
| ⚡ **Performance** | Lazy loading, SWR caching, optimized images |

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | ≥ 18 |
| Backend API | Running on `http://localhost:3000` (see [backend README](../backend/README.md)) |

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

A `.env.local` file is already included with the default API URL:

```env
# ─── Backend API URL ──────────────────────────────────
#  Local development: http://localhost:3000
#  Production: Your deployed backend URL (e.g., https://your-api.onrender.com)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> If the file doesn't exist, create it: `cp` is not needed — just create `.env.local` with the line above. Defaults to `http://localhost:3000` if omitted.

### 3. Start the Backend

The frontend requires the backend API to be running:

```bash
cd ../backend
npm run dev    # Starts on http://localhost:3000
```

### 4. Start the Frontend

```bash
npm run dev    # Starts on http://localhost:3002
```

### 5. Open in Browser

Navigate to [http://localhost:3002](http://localhost:3002)

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@eventix.com` | `Admin@123` |
| User | `user@eventix.com` | `User@123` |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3002) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🏗 Architecture

### High-Level Overview

```
Next.js App Router (Pages & Layouts)
  │
  ├── Components (UI primitives + feature components)
  ├── Contexts (AuthProvider — global auth state)
  ├── Lib (API client, SWR cache, auth storage)
  └── Types (TypeScript API type definitions)
```

### Key Patterns

| Pattern | Implementation |
|---------|----------------|
| **Data Fetching** | SWR (stale-while-revalidate) with custom API client |
| **Auth State** | React Context with JWT tokens in localStorage |
| **Silent Refresh** | Auto-refresh access token on 401, retry original request |
| **Route Protection** | `ProtectedRoute` component wraps authenticated pages |
| **Theming** | CSS variables + `next-themes` for dark/light mode |

### Folder Structure

```
frontend/
├── app/                    # Pages (App Router)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── events/             # Event pages
│   ├── bookings/           # Bookings page
│   ├── admin/              # Admin panel
│   ├── login/              # Auth pages
│   └── register/
│
├── components/             # Reusable components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── event-card.tsx
│   ├── events-carousel.tsx
│   ├── protected-route.tsx
│   ├── theme-toggle.tsx
│   └── ui/                 # shadcn/ui primitives
│
├── contexts/
│   └── auth-context.tsx    # Auth state & methods
│
├── lib/
│   ├── api.ts              # API client (fetch + auth)
│   ├── api-cache.ts        # SWR caching
│   ├── auth-storage.ts     # Token management
│   └── utils.ts
│
├── types/
│   └── api.ts              # API type definitions
│
└── public/                 # Static assets
```

**📄 Deep Dive:** [docs/architecture.md](docs/architecture.md) — component hierarchy, data flow, auth flow, styling system

---

## ☁️ Deployment

### Production (Vercel)

The frontend is deployed on **Vercel** at [https://eventixbooking.vercel.app](https://eventixbooking.vercel.app).

| Setting | Value |
|---------|-------|
| **Framework** | Next.js (auto-detected) |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Environment Variable** | `NEXT_PUBLIC_API_URL` → Backend API URL on Render |

**Deploy your own:**

1. Push to a GitHub repository
2. Import into [Vercel](https://vercel.com/new)
3. Set `NEXT_PUBLIC_API_URL` in Vercel environment settings
4. Deploy — Vercel handles builds, CDN, and SSL automatically

---

## 📚 Documentation Index

| Document | Description |
|----------|-------------|
| [**Architecture**](docs/architecture.md) | App Router, component hierarchy, data flow, auth flow |
| [**Features**](docs/features.md) | Feature-by-feature breakdown |
| [**Backend README**](../backend/README.md) | Backend API documentation |

---

<p align="center">
  Made with ❤️ by <strong>Harsh Baldaniya</strong>
</p>

<p align="center">
  <a href="https://www.linkedin.com/in/hb134/">LinkedIn</a> •
  <a href="https://harshbaldaniya.com">Portfolio</a>
</p>
