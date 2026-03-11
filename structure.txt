# Metron - Platform

src/
│
├── app/ # App core setup
│ ├── store.ts # Redux store
│ ├── rootReducer.ts
│ ├── providers.tsx # Redux + Persist + Router wrapper
│ ├── router.tsx # Central routing
│ └── hooks.ts # typed redux hooks
│
├── features/ # Business modules (feature-based)
│ ├── auth/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── validation/
│ │ ├── authSlice.ts
│ │ └── auth.api.ts
│ │
│ ├── dashboard/
│ │ ├── pages/
│ │ ├── components/
│ │ └── dashboardSlice.ts
│ │
│ ├── vehicles/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── vehiclesSlice.ts
│ │ └── vehicles.api.ts
│ │
│ ├── tracking/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── map/
│ │ ├── trackingSlice.ts
│ │ └── useTrackingSocket.ts
│ │
│ └── analytics/
│ ├── pages/
│ ├── components/
│ └── analyticsSlice.ts
│
├── services/ # API layer
│ ├── api.ts # Axios base config
│ ├── interceptors.ts
│ └── endpoints.ts
│
├── mqtt/ # Real-time layer
│ ├── mqttClient.ts
│ ├── mqttMiddleware.ts # Redux integration
│ └── topics.ts
│
├── shared/ # Reusable global UI
│ ├── components/
│ │ ├── ui/ # Pure UI (Button, Card)
│ │ ├── form/ # Input, Select, DatePicker
│ │ └── layout/ # Header, Sidebar
│ │
│ ├── hooks/
│ ├── utils/
│ ├── constants/
│ └── types/
│
├── layouts/ # Page layouts
│ ├── DashboardLayout.tsx
│ └── AuthLayout.tsx
│
├── routes/
│ ├── ProtectedRoute.tsx
│ └── PublicRoute.tsx
│
├── styles/ # Tailwind & global styles
│ ├── index.css # Tailwind imports
│ ├── variables.css
│ └── animations.css
│
├── assets/
│ ├── images/
│ └── styles/
│
├── config/
│ └── env.ts
│
└── main.tsx
