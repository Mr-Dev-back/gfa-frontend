# GFA Logistics - Truck Flow Management System

## Overview
A comprehensive truck flow management system for logistics operations. This frontend application provides real-time monitoring and management of truck arrivals, queue handling, loading operations, weighing, and historical tracking.

## Current State
Frontend-only implementation with mock data for UI demonstration purposes. No backend integration yet.

## Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── Charts.tsx          # Recharts visualizations
│   │   └── KPICube.tsx         # KPI display cards
│   ├── layout/
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   └── Topbar.tsx          # Header with user info
│   └── ui/
│       ├── badge.tsx           # Badge component
│       ├── button.tsx          # Button component
│       ├── card.tsx            # Card component
│       ├── input.tsx           # Input component
│       ├── modal.tsx           # Modal and ConfirmModal
│       ├── table.tsx           # Table components
│       └── toast.tsx           # Toast notification system
├── layouts/
│   └── MainLayout.tsx          # Protected layout wrapper
├── lib/
│   └── utils.ts                # Utility functions (cn)
├── pages/
│   ├── Admin.tsx               # User management
│   ├── Dashboard.tsx           # Supervisor dashboard
│   ├── Entry.tsx               # Truck entry registration
│   ├── History.tsx             # Truck journey tracking
│   ├── Login.tsx               # Authentication screen
│   ├── PublicTV.tsx            # Public display for drivers
│   ├── Queue.tsx               # Real-time queue management
│   ├── Shipping.tsx            # Expedition park operations
│   └── Weighing.tsx            # Weighbridge operations
├── stores/
│   ├── useAuthStore.ts         # Authentication state
│   ├── useDataStore.ts         # Dashboard metrics
│   └── useTruckStore.ts        # Shared truck state management
├── App.tsx                     # Route configuration
├── index.css                   # Global styles and theme
└── main.tsx                    # App entry point
```

## User Roles

| Role | Access |
|------|--------|
| SUPERVISOR | Dashboard, Entry, Queue, Shipping, Weighing, History, TV |
| CONTROL_AGENT | Entry, Queue |
| PARK_AGENT | Queue, Shipping |
| WEIGHING_AGENT | Weighing |
| ADMIN | All screens including Administration |
| PUBLIC_TV | TV display only |

## Screens

1. **Login** - Role-based demo login
2. **Dashboard** - KPIs, charts, activity feed
3. **Entry** - Truck registration form
4. **Queue** - Real-time queue with priority management
5. **Shipping** - Truck calling and loading operations
6. **Weighing** - Weight readings and validation
7. **History** - Truck journey timeline and traceability
8. **Admin** - User and role management
9. **Public TV** - Large display for driver notifications

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- React Router DOM
- Zustand (state management)
- Recharts (charts)
- Lucide React (icons)

## Running the App

```bash
npm run dev
```

The app runs on port 5000.

## Truck Workflow

The system uses a shared Zustand store (`useTruckStore`) to manage truck state across all screens:

1. **WAITING** - Truck registered at entry, waiting in queue
2. **CALLED** - Truck called to loading zone (visible on TV/Queue)
3. **LOADING** - Loading in progress at shipping park
4. **WEIGHING_ENTRY** - Truck at weighbridge for entry weight
5. **WEIGHING_EXIT** - Entry weight recorded, awaiting exit weight
6. **COMPLETED** - Both weights recorded, truck finished

All screens (Dashboard, Queue, Shipping, Weighing, PublicTV) share this state and update in real-time.

## Recent Changes

- 2025-12-12: Implemented shared truck store for cross-screen state management
- 2025-12-12: Fixed Shipping workflow (separate call/loading steps)
- 2025-12-12: All screens now use shared store for real-time updates
- 2024-01-15: Initial frontend implementation with all UI screens
- Added mock data for demonstration
- Implemented toast notification system
- Created all role-specific screens

## Next Steps (Backend Integration)

- JWT authentication with real API
- WebSocket integration for real-time updates
- API connections for all CRUD operations
- Database integration for persistent data
