# Features

> Detailed feature breakdown of the Eventix frontend — every page, interaction, and user flow documented.

---

## Table of Contents

- [Home Page](#home-page)
- [Events Page](#events-page)
- [Event Detail Page](#event-detail-page)
- [Booking Flow](#booking-flow)
- [My Bookings](#my-bookings)
- [Authentication](#authentication)
- [Admin Panel](#admin-panel)
- [Theme & Responsiveness](#theme--responsiveness)

---

## Home Page

**Route:** `/`

The landing page for Eventix — designed to inspire and convert visitors.

| Section | Description |
|---------|-------------|
| **Hero** | Full-width hero with tagline "Create Unstoppable Moments" and two CTAs |
| **Featured Events Carousel** | Auto-rotating carousel of published events with status badges |
| **CTA Section** | "Ready to join the inner circle?" with register and browse buttons |
| **Footer** | Navigation links, social links (LinkedIn, Portfolio) |

**Key Interactions:**
- "Explore All Events" → navigates to `/events`
- "Join Eventix" → navigates to `/register`
- Event cards in carousel → navigates to `/events/:id`

---

## Events Page

**Route:** `/events`

Browse all published and coming soon events with search, sort, and pagination.

| Feature | Description |
|---------|-------------|
| **Search** | Real-time search across event name and description (max 200 chars) |
| **Sort** | Sort by creation date, name, or remaining spots (asc/desc) |
| **Pagination** | Page-based navigation with configurable items per page |
| **Event Cards** | Rich cards showing name, description, capacity, spots remaining, status |
| **Status Badges** | Color-coded badges: published (green), coming soon (blue), etc. |
| **Lazy Loading** | Event cards use lazy loading for better performance |

**Query Parameters:**
```
/events?page=1&limit=10&search=concert&sort_by=created_at&order=desc
```

---

## Event Detail Page

**Route:** `/events/:id`

Full event information with booking capability.

| Section | Description |
|---------|-------------|
| **Event Info** | Name, description, status, creation date |
| **Availability** | Capacity, booked count, remaining spots (visual bar) |
| **Booking Form** | Ticket count selector (1–6 per booking) with "Book Now" button |
| **Status Handling** | Different views for published (bookable), coming soon (preview), sold out |

**State Handling:**
| Event Status | User Sees |
|-------------|-----------|
| Published + spots | Book Now button + ticket selector |
| Published + sold out | "Sold Out" badge, booking disabled |
| Coming Soon | "Coming Soon" badge, no booking |
| Draft/Cancelled | 404 (public users) |

---

## Booking Flow

**Trigger:** Click "Book Now" on an event detail page.

```
1. Select ticket count (1–6, default 1)
2. Click "Book Now"
3. API: POST /events/:id/bookings { ticket_count }
4. On success (201):
   → Show success toast "Booking confirmed! 🎉"
   → Refresh event data (updated spots)
5. On error:
   → 409 "Event sold out" → error toast
   → 409 "Not enough spots" → error toast with remaining
   → 409 "Ticket limit exceeded" → error toast with limit info
   → 401 → redirect to login
```

**Constraints:**
- Per-booking limit: up to 6 tickets per request (configurable per event)
- Per-user limit: up to 15 total tickets per event (configurable per event)
- Event must be in `published` status

---

## My Bookings

**Route:** `/bookings` (protected — login required)

View and manage all personal bookings.

| Feature | Description |
|---------|-------------|
| **Booking List** | All bookings with event name, ticket count, status, date |
| **Status Display** | Confirmed (green) / Cancelled (gray) |
| **Cancel Booking** | Cancel button with confirmation dialog |
| **Pagination** | Page-based navigation for paginated results |
| **Empty State** | Friendly message when no bookings exist |

**Cancel Flow:**
```
1. Click "Cancel" on a confirmed booking
2. Confirmation dialog: "Are you sure?"
3. API: PATCH /bookings/:id { status: "cancelled" }
4. On success:
   → Update booking status in list
   → Show success toast
   → Spots returned to event
```

---

## Authentication

### Login

**Route:** `/login`

| Field | Validation |
|-------|-----------|
| Email | Required, valid email format |
| Password | Required |

On successful login:
- Tokens stored in localStorage
- User redirected to home page
- Header updates to show user name + logout button

### Register

**Route:** `/register`

| Field | Validation |
|-------|-----------|
| Name | Required |
| Email | Required, valid email format |
| Password | Required, min 8 characters |

On successful registration:
- User automatically logged in (tokens stored)
- Redirected to home page

### Session Persistence

- On page reload: tokens are read from localStorage
- If access token is expired: automatic silent refresh via `/auth/refresh`
- If refresh fails: user is logged out, tokens cleared

### Protected Routes

Pages that require authentication (`/bookings`, `/admin/*`) are wrapped with `ProtectedRoute`:
- If user is loading → show loading state
- If not authenticated → redirect to login
- If authenticated → render page content

---

## Admin Panel

**Route:** `/admin/*` (protected — admin role required)

### Admin Dashboard (`/admin`)

Overview page with quick stats and navigation to management pages.

### Event Management (`/admin/events`)

| Action | Description |
|--------|-------------|
| **List all events** | All events with all statuses (draft, coming_soon, published, cancelled, completed) |
| **Create event** | Form: name, description, capacity, status |
| **Edit event** | Inline editing of event fields |
| **Change status** | Update event status (e.g., draft → published) |

### User Management (`/admin/users`)

| Feature | Description |
|---------|-------------|
| **User list** | View all registered users |
| **User details** | Email, name, role, registration date |

### Admin Access

- Admin layout with sidebar navigation
- Only accessible to users with `role: 'admin'` in JWT
- Regular users see a forbidden/redirect response

---

## Theme & Responsiveness

### Dark / Light Mode

| Feature | Implementation |
|---------|----------------|
| **Toggle** | ThemeToggle component in the header |
| **Persistence** | Theme preference saved in localStorage |
| **System Default** | Respects OS/browser color scheme preference |
| **Implementation** | `next-themes` ThemeProvider + CSS variables |

### Responsive Design

| Breakpoint | Layout |
|-----------|--------|
| Mobile (< 640px) | Single column, hamburger menu, stacked cards |
| Tablet (640–1024px) | Two-column grid, collapsible sidebar |
| Desktop (> 1024px) | Full layout, multi-column grid, sidebar |

### Accessibility

| Feature | Implementation |
|---------|----------------|
| **Keyboard Navigation** | Tab-based focus management |
| **ARIA Labels** | All interactive elements labeled |
| **Color Contrast** | Meets WCAG standards in both themes |
| **Focus Indicators** | Visible focus rings on interactive elements |

---

<p align="center">
  <a href="https://www.linkedin.com/in/hb134/">LinkedIn</a> •
  <a href="https://harshbaldaniya.com">Portfolio</a>
</p>
