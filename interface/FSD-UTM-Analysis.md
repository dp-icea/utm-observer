# Feature-Sliced Design Analysis for UTM Application

## Overview

This document provides a comprehensive analysis of how to restructure the current UTM (Unmanned Traffic Management) application using Feature-Sliced Design (FSD) principles.

## What is Feature-Sliced Design?

Feature-Sliced Design is an architectural methodology for frontend applications that organizes code by business features rather than technical layers. It's designed to make large-scale applications more maintainable, scalable, and understandable.

### Core Principles

- **Feature-First Organization**: Group files by business features rather than technical types
- **Layered Architecture**: Hierarchical layer system with strict import rules
- **Scalability**: New features can be added without affecting existing ones
- **Maintainability**: Clear boundaries between features make code easier to understand and modify

### FSD Layers

- **App** - Application-level configuration, providers, routing
- **Pages** - Route components that compose features
- **Widgets** - Complex UI blocks that combine multiple features
- **Features** - Business logic units (user actions, use cases)
- **Entities** - Business entities and their logic
- **Shared** - Reusable code without business logic

### Import Rules

```
Pages → Features → Entities → Shared
  ↓       ↓         ↓         ↓
 Can import from lower layers only
```

## Current UTM Application Analysis

### Identified Entities

Based on the schema analysis, the main entities in this UTM system are:

#### Core Business Entities
- **Flight/Aircraft** - `RIDFlight`, `Flight`, `RIDAircraftState`, `RIDAircraftPosition`
- **Operational Intent** - `OperationalIntent`, `OperationalIntentReference`, `VehicleTelemetry`
- **Constraint** - `Constraint`, `ConstraintReference`, `ConstraintDetails`
- **GeoZone** - `GeoZone`, `Authority`
- **Subscription** - `Subscription`, `SubscriptionState`, `SubscriberToNotify`
- **Identification Service Area** - `IdentificationServiceArea`, `IdentificationServiceAreaDetails`
- **USS (UAS Service Supplier)** - Various USS-related entities

#### Supporting Entities
- **Volume4D** - 4D volumes (3D space + time)
- **Volume3D** - 3D geometric volumes
- **Polygon**, **Circle**, **Rectangle** - Geometric shapes
- **LatLngPoint** - Geographic coordinates

### Types vs Entities Distinction

#### Should Remain as Types (Pure Data Structures)
```typescript
// Primitive/Value Types
type Latitude = number;
type Longitude = number;
type Altitude = { value: number; reference: "W84"; units: "M" };
type Time = { value: string; format: "RFC3339" };

// Enums and constants
type UAType = "Aeroplane" | "Helicopter" | "Gyroplane" | ...;
type OperationalIntentState = "Accepted" | "Activated" | "Nonconforming" | "Deleted";

// API Response/Request Types
interface GetFlightsResponse { timestamp: Time; flights: RIDFlight[]; }
interface QueryOperationalIntentReferenceResponse { ... }

// Configuration/Metadata Types
interface Authority { name?: string; service?: string; contact_name?: string; }
interface RIDAuthData { format: number; data: string; }
```

#### Should Become Entities (Business Objects with Behavior)
```typescript
// Flight Entity
class Flight {
  // Business methods:
  // - isInEmergency()
  // - canEnterAirspace(constraint: Constraint)
  // - updateTelemetry(position: Position)
  // - validateFlightPath()
}

// OperationalIntent Entity
class OperationalIntent {
  // Business methods:
  // - conflictsWith(other: OperationalIntent)
  // - isActiveAt(time: Time)
  // - canBeModified()
  // - validateVolumes()
}

// Constraint Entity
class Constraint {
  // Business methods:
  // - appliesToFlight(flight: Flight)
  // - isActiveAt(time: Time)
  // - getRestrictedVolumes()
  // - allowsFlightType(type: UAType)
}
```

## Application Features

### Core Features Identified

1. **Real-Time Flight Tracking**
   - Live drone/aircraft monitoring with position updates
   - Flight status tracking (Ground, Airborne, Emergency, etc.)
   - Aircraft telemetry display (speed, altitude, vertical speed)
   - Operator location tracking

2. **Airspace Management**
   - Operational Intent Management
   - Constraint Management (create/manage airspace restrictions)
   - Identification Service Areas monitoring
   - Geographic zone visualization

3. **Interactive 3D Map Visualization**
   - Cesium-based 3D map with terrain
   - Real-time visualization of flights, constraints, and operational intents
   - Volume rendering (4D: 3D space + time)

4. **Time-Based Analysis**
   - Timeline Control for historical data navigation
   - Time Range Selection
   - Live Mode Toggle
   - Time-based filtering

5. **Provider/Client Management**
   - USS Provider Tracking
   - Client List Management
   - Provider-specific filtering and statistics

6. **Advanced Filtering System**
   - Operational Filters for different airspace elements
   - Flight Filtering
   - Manager Filtering
   - Multi-criteria filtering with real-time counts

7. **Notification System**
   - Real-time notifications for airspace changes
   - Constraint alerts and warnings
   - Flight plan updates and check-ins

8. **Constraint Creation**
   - Dynamic Constraint Creation
   - Predefined constraint templates
   - Geographic constraint definition with polygon boundaries

## Proposed FSD Structure

### Pages Structure

```
src/pages/
├── dashboard/
│   └── ui/DashboardPage.tsx          # Main UTM monitoring interface
├── flights/
│   ├── ui/FlightsPage.tsx            # Flight tracking and management
│   ├── ui/FlightDetailPage.tsx       # Individual flight details
│   └── ui/FlightPlanPage.tsx         # Flight plan submission
├── airspace/
│   ├── ui/AirspacePage.tsx           # Airspace management
│   ├── ui/ConstraintManagementPage.tsx
│   └── ui/OperationalIntentPage.tsx
├── providers/
│   ├── ui/ProvidersPage.tsx          # USS provider management
│   └── ui/ProviderDetailPage.tsx
├── notifications/
│   └── ui/NotificationsPage.tsx      # Notification center
├── reports/
│   ├── ui/ReportsPage.tsx            # Operational reports
│   └── ui/ReportDetailPage.tsx
├── auth/
│   ├── ui/LoginPage.tsx              # Authentication
│   └── ui/ProfilePage.tsx            # User profile
├── settings/
│   └── ui/SettingsPage.tsx           # System configuration
├── admin/
│   └── ui/AdminPage.tsx              # System administration
└── not-found/
    └── ui/NotFoundPage.tsx           # 404 error page
```

### Features Structure

```
src/features/
├── track-flights/                    # Real-time flight monitoring
│   ├── model/
│   ├── api/
│   └── ui/
├── manage-constraints/               # Airspace restriction management
│   ├── model/
│   ├── api/
│   └── ui/
├── filter-operations/                # Multi-criteria filtering
│   ├── model/
│   └── ui/
├── manage-providers/                 # USS provider management
│   ├── model/
│   ├── api/
│   └── ui/
├── timeline-navigation/              # Historical data analysis
│   ├── model/
│   └── ui/
└── receive-notifications/            # Event notification handling
    ├── model/
    ├── api/
    └── ui/
```

### Entities Structure

```
src/entities/
├── flight/
│   ├── model/flight.ts               # Flight business logic
│   ├── api/flightApi.ts              # Flight data access
│   ├── types/flight.ts               # Flight type definitions
│   └── ui/FlightCard.tsx             # Flight UI components
├── operational-intent/
│   ├── model/operationalIntent.ts
│   ├── api/operationalIntentApi.ts
│   ├── types/operationalIntent.ts
│   └── ui/OperationalIntentCard.tsx
├── constraint/
│   ├── model/constraint.ts
│   ├── api/constraintApi.ts
│   ├── types/constraint.ts
│   └── ui/ConstraintCard.tsx
├── geozone/
│   ├── model/geozone.ts
│   ├── types/geozone.ts
│   └── ui/GeozoneCard.tsx
├── subscription/
│   ├── model/subscription.ts
│   ├── api/subscriptionApi.ts
│   ├── types/subscription.ts
│   └── ui/SubscriptionCard.tsx
└── identification-service-area/
    ├── model/identificationServiceArea.ts
    ├── api/identificationServiceAreaApi.ts
    ├── types/identificationServiceArea.ts
    └── ui/IdentificationServiceAreaCard.tsx
```

### Widgets Structure

```
src/widgets/
├── map-viewer/                       # 3D map visualization
│   ├── ui/MapViewer.tsx
│   ├── lib/cesiumConfig.ts
│   └── model/mapState.ts
├── sidebar-panel/                    # Combined sidebar features
│   ├── ui/SidebarPanel.tsx
│   └── model/sidebarState.ts
└── timeline-bar/                     # Time navigation
    ├── ui/TimelineBar.tsx
    └── model/timelineState.ts
```

## Shared Folder Structure

```
src/shared/
├── ui/                               # Generic UI components
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   ├── Badge/
│   ├── Calendar/
│   ├── Slider/
│   ├── Checkbox/
│   └── ... (all reusable UI components)
├── api/                              # HTTP client and API utilities
│   ├── client.ts                     # Base axios instance
│   ├── types.ts                      # API request/response types
│   └── endpoints.ts                  # API endpoint constants
├── lib/                              # Pure utility functions
│   ├── utils.ts                      # General utilities
│   ├── formatters.ts                 # Date/time/number formatting
│   ├── validation.ts                 # Input validation helpers
│   ├── geometry.ts                   # Geographic calculations
│   └── time.ts                       # Time manipulation utilities
├── hooks/                            # Reusable React hooks
│   ├── use-toast.ts                  # Toast notifications
│   ├── use-mobile.tsx                # Mobile detection
│   ├── use-local-storage.ts          # Local storage management
│   └── use-debounce.ts               # Debouncing utility
├── types/                            # Shared TypeScript types
│   ├── common.ts                     # Basic types
│   ├── api.ts                        # API-related types
│   ├── ui.ts                         # UI component prop types
│   └── index.ts                      # Type exports
├── constants/                        # Application constants
│   ├── routes.ts                     # Route paths
│   ├── config.ts                     # App configuration
│   ├── utm.ts                        # UTM-specific constants
│   └── map.ts                        # Map/Cesium constants
├── assets/                           # Static assets
│   ├── icons/
│   │   └── icon-br-utm.svg
│   ├── images/
│   └── fonts/
└── config/                           # Configuration files
    ├── cesium.ts                     # Cesium configuration
    ├── theme.ts                      # UI theme configuration
    └── env.ts                        # Environment variables
```

### What Goes in Shared

#### ✅ Should be in Shared
- Generic UI components with no business logic
- Pure utility functions
- HTTP client configuration
- Reusable React hooks
- Common TypeScript types
- Application constants
- Static assets

#### ❌ Should NOT be in Shared
- Business Logic (flight validation, constraint rules)
- Domain-Specific Components (FlightCard, ConstraintPanel)
- Feature-Specific Hooks (useFlightTracking, useConstraintManagement)
- Entity-Specific Types (Flight, OperationalIntent, Constraint)

## Migration Strategy

### Current Structure → FSD Structure

**Move to shared:**
- `src/components/ui/*` → `src/shared/ui/`
- `src/lib/utils.ts` → `src/shared/lib/utils.ts`
- `src/utils/formatters.ts` → `src/shared/lib/formatters.ts`
- `src/hooks/use-toast.ts` → `src/shared/hooks/use-toast.ts`
- `src/hooks/use-mobile.tsx` → `src/shared/hooks/use-mobile.tsx`
- `src/services/api.ts` → `src/shared/api/client.ts`
- `src/schemas/common.ts` → `src/shared/types/common.ts`
- `src/assets/*` → `src/shared/assets/`

**Move to entities:**
- `src/schemas/flight.ts` → `src/entities/flight/types.ts`
- `src/schemas/constraint.ts` → `src/entities/constraint/types.ts`
- `src/schemas/operational-intent.ts` → `src/entities/operational-intent/types.ts`

**Move to features:**
- `src/services/constraintManagement.ts` → `src/features/manage-constraints/api/`
- `src/components/sidebar/DroneTracking.tsx` → `src/features/track-flights/ui/`
- `src/components/sidebar/ConstraintManagement.tsx` → `src/features/manage-constraints/ui/`

**Move to widgets:**
- `src/components/Map.tsx` → `src/widgets/map-viewer/ui/MapViewer.tsx`
- `src/components/TimelineBar.tsx` → `src/widgets/timeline-bar/ui/TimelineBar.tsx`
- `src/utils/interface-hook.ts` → `src/widgets/map-viewer/lib/`

## Benefits of FSD Structure

1. **Clear Separation of Concerns**: Each layer has a single responsibility
2. **No Circular Dependencies**: Strict import rules prevent this
3. **Centralized Logic**: All related code grouped by business domain
4. **Testable**: Business logic isolated in model files
5. **Scalable Team Ownership**: Each feature can be owned by different teams
6. **Maintainable**: Easy to find and modify related code
7. **Reusable**: Entities and shared code can be reused across features

## Conclusion

The current UTM application would benefit significantly from FSD restructuring. The single-page dashboard approach works for small applications, but as the system grows, the proposed FSD structure will provide better maintainability, scalability, and team collaboration capabilities.

The key is to start with the shared folder migration, then gradually extract entities and features from the current monolithic components, ensuring that business logic is properly separated from UI concerns.