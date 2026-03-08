# Architecture

> Frontend architecture documentation for Eventix — Next.js 16 App Router, component hierarchy, data fetching, authentication flow, and styling system.

---

## Table of Contents

- [High-Level Overview](#high-level-overview)
- [App Router Structure](#app-router-structure)
- [Component Hierarchy](#component-hierarchy)
- [Data Fetching Strategy](#data-fetching-strategy)
- [Authentication Flow](#authentication-flow)
- [Styling System](#styling-system)
- [Folder Structure](#folder-structure)

---

## High-Level Overview

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER                          │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│              NEXT.JS APP ROUTER                     │
│  Layouts → Pages → Components                       │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
   ┌───────────┐ ┌──────────┐ ┌──────────┐
   │  Contexts  │ │   SWR    │ │   API    │
   │  (Auth)    │ │ (Cache)  │ │ (Fetch)  │
   └───────────┘ └──────────┘ └──────────┘
                       │
                       ▼
              ┌────────────────┐
              │  Backend API   │
              │  (Express)     │
              └────────────────┘
```

---

## App Router Structure

Next.js 16 App Router with file-based routing:

```
app/
├── layout.tsx              # Root layout (Providers, Header, Footer)
├── page.tsx                # Home page (Hero, Featured Events, CTA)
├── globals.css             # Global styles + Tailwind config
│
├── login/
│   └── page.tsx            # Login page
├── register/
│   └── page.tsx            # Registration page
├── about/
│   └── page.tsx            # About page
│
├── events/
│   ├── page.tsx            # Events listing (search, sort, paginate)
│   └── [id]/
│       └── page.tsx        # Event detail + booking
│
├── bookings/
│   └── page.tsx            # My bookings (protected)
│
└── admin/
    ├── layout.tsx          # Admin layout (sidebar, protected)
    ├── page.tsx            # Admin dashboard
    ├── events/
    │   └── page.tsx        # Event management (CRUD)
    └── users/
        └── page.tsx        # User management
```

---

## Component Hierarchy

```
Providers (ThemeProvider + AuthProvider)
  └── LayoutWrapper
        ├── Header
        │     ├── Nav Links
        │     ├── ThemeToggle (dark/light)
        │     └── Auth Buttons (Login/Logout)
        │
        ├── Page Content
        │     ├── EventCard / LazyEventCard
        │     ├── EventsCarousel
        │     ├── EventStatusBadge
        │     ├── AvailabilitySlots
        │     └── UI Primitives (shadcn/ui)
        │           ├── Button, Card, Badge
        │           ├── Input, Select, Dialog
        │           ├── Skeleton, Separator
        │           └── Sonner (toast notifications)
        │
        ├── Footer
        └── GoToTop
```

### Component Categories

| Category | Components | Purpose |
|----------|-----------|---------|
| **Layout** | Header, Footer, LayoutWrapper, GoToTop | Page structure and navigation |
| **Events** | EventCard, LazyEventCard, EventsCarousel, EventStatusBadge, AvailabilitySlots | Event display and interaction |
| **Auth** | ProtectedRoute | Route protection for authenticated pages |
| **Theme** | ThemeToggle, Providers | Dark/light mode switching |
| **UI Primitives** | Button, Card, Badge, Input, Select, Dialog, Skeleton, Separator, etc. | shadcn/ui components |

---

## Data Fetching Strategy

### API Client (`lib/api.ts`)

Custom fetch wrapper with built-in:
- **Auto-auth:** Attaches `Authorization: Bearer <token>` to every request
- **Token refresh:** On `401`, automatically refreshes tokens and retries the request
- **Error handling:** Returns typed `ApiResponse<T>` union (success or error)

```
Request Flow:
  api('/events')
    → Attach Bearer token from localStorage
    → fetch(API_BASE + path)
    → If 401: refreshTokens() → retry with new token
    → Return typed ApiResponse<T>
```

### SWR Caching (`lib/api-cache.ts`)

SWR (stale-while-revalidate) for data fetching with caching:
- **Automatic revalidation** on window focus and interval
- **Cache key** based on URL + query parameters
- **Optimistic updates** for booking cancellation

### State Management

| Type | Mechanism | Scope |
|------|-----------|-------|
| **Auth State** | React Context (`AuthProvider`) | Global — user, token, auth methods |
| **Server Data** | SWR cache | Per-component — events, bookings |
| **UI State** | React `useState` | Local — modals, forms, loading |

---

## Authentication Flow

### Login / Register

```
User submits credentials
  → api('/auth/login', { email, password })
  → On success:
      ├── Store access_token + refresh_token (localStorage)
      ├── Store user object (localStorage)
      ├── Extract role from JWT payload
      └── Update AuthContext → re-render UI
  → On failure:
      └── Show error toast (Sonner)
```

### Silent Token Refresh

```
On app load (useEffect):
  → Check localStorage for tokens
  → If tokens exist:
      ├── Call /auth/refresh with refresh_token
      ├── On success: update stored tokens + user
      └── On failure: clear tokens → redirect to login
```

### Protected Routes

```tsx
<ProtectedRoute>
  <BookingsPage />     // Only renders if authenticated
</ProtectedRoute>
```

The `ProtectedRoute` component:
1. Checks `isAuthenticated` from `AuthContext`
2. If not authenticated → shows loading or redirects
3. If authenticated → renders children

### Auto-Retry on 401

```
api('/bookings')
  → Server returns 401 (token expired)
  → Auto-call /auth/refresh
  → If refresh succeeds → retry original request with new token
  → If refresh fails → clear tokens → user logged out
```

---

## Styling System

### Tailwind CSS v4

- Utility-first CSS framework
- Dark/light mode via `next-themes` (`ThemeProvider`)
- CSS variables for consistent theming
- No custom CSS files per component — all Tailwind utilities

### shadcn/ui

Pre-built, customizable UI components:
- Installed via `shadcn` CLI
- Components live in `components/ui/`
- Styled with Tailwind CSS + CSS variables
- Accessible (ARIA-compliant)

### Theming

```
ThemeProvider (next-themes)
  → Reads system preference or localStorage
  → Applies 'light' or 'dark' class to <html>
  → CSS variables change based on class
  → ThemeToggle button switches themes
```

---

## Folder Structure

```
frontend/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (providers, header, footer)
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles + Tailwind
│   ├── login/page.tsx          # Login
│   ├── register/page.tsx       # Register
│   ├── about/page.tsx          # About
│   ├── events/
│   │   ├── page.tsx            # Events listing
│   │   └── [id]/page.tsx       # Event detail + booking
│   ├── bookings/page.tsx       # My bookings
│   └── admin/
│       ├── layout.tsx          # Admin layout
│       ├── page.tsx            # Admin dashboard
│       ├── events/page.tsx     # Event management
│       └── users/page.tsx      # User management
│
├── components/                 # Reusable components
│   ├── header.tsx              # Site header + navigation
│   ├── footer.tsx              # Site footer
│   ├── event-card.tsx          # Event display card
│   ├── lazy-event-card.tsx     # Lazy-loaded event card
│   ├── events-carousel.tsx     # Featured events carousel
│   ├── event-status-badge.tsx  # Status badge (published, etc.)
│   ├── availability-slots.tsx  # Spot availability display
│   ├── protected-route.tsx     # Auth-protected wrapper
│   ├── theme-toggle.tsx        # Dark/light mode toggle
│   ├── go-to-top.tsx           # Scroll-to-top button
│   ├── layout-wrapper.tsx      # Page layout wrapper
│   ├── providers.tsx           # Context providers
│   └── ui/                     # shadcn/ui primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── dialog.tsx
│       ├── skeleton.tsx
│       └── ...
│
├── contexts/
│   └── auth-context.tsx        # Authentication state & methods
│
├── lib/
│   ├── api.ts                  # API client (fetch + auth + refresh)
│   ├── api-cache.ts            # SWR caching utilities
│   ├── auth-storage.ts         # Token/user localStorage management
│   └── utils.ts                # General utilities
│
├── types/
│   └── api.ts                  # TypeScript API type definitions
│
├── public/                     # Static assets
└── next.config.ts              # Next.js configuration
```

---

<p align="center">
  <a href="https://www.linkedin.com/in/hb134/">LinkedIn</a> •
  <a href="https://harshbaldaniya.com">Portfolio</a>
</p>
