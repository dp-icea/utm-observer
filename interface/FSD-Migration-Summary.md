# FSD Migration Summary

## ✅ Completed Migration Steps

### 1. Folder Structure Creation
- ✅ Created complete FSD folder structure:
  - `src/app/` - Application layer (providers, routing)
  - `src/pages/` - Page components
  - `src/widgets/` - Complex UI blocks
  - `src/features/` - Business logic features
  - `src/entities/` - Business entities
  - `src/shared/` - Reusable code

### 2. Shared Layer Migration
- ✅ Moved all UI components from `src/components/ui/` → `src/shared/ui/`
- ✅ Moved utilities: `src/lib/utils.ts` → `src/shared/lib/utils.ts`
- ✅ Moved formatters: `src/utils/formatters.ts` → `src/shared/lib/formatters.ts`
- ✅ Moved hooks: `src/hooks/use-*.ts` → `src/shared/hooks/`
- ✅ Moved assets: `src/assets/` → `src/shared/assets/`
- ✅ Created shared API client: `src/shared/api/client.ts`
- ✅ Created shared types: `src/shared/types/`
- ✅ Created shared constants: `src/shared/constants/routes.ts`
- ✅ Created shared config: `src/shared/config/env.ts`

### 3. Entities Layer Migration
- ✅ Migrated entity types:
  - `src/entities/flight/types.ts`
  - `src/entities/constraint/types.ts`
  - `src/entities/operational-intent/types.ts`
  - `src/entities/geozone/types.ts`
  - `src/entities/subscription/types.ts`
  - `src/entities/identification-service-area/types.ts`

### 4. Features Layer Creation
- ✅ Created feature components:
  - `src/features/track-flights/ui/FlightTrackingPanel.tsx`
  - `src/features/manage-constraints/ui/ConstraintManagementPanel.tsx`
  - `src/features/filter-operations/ui/OperationalFiltersPanel.tsx`

### 5. Widgets Layer Migration
- ✅ Migrated widgets:
  - `src/widgets/map-viewer/ui/MapViewer.tsx`
  - `src/widgets/sidebar-panel/ui/SidebarPanel.tsx`
  - `src/widgets/timeline-bar/ui/TimelineBar.tsx`

### 6. Pages Layer Migration
- ✅ Created pages:
  - `src/pages/dashboard/ui/DashboardPage.tsx`
  - `src/pages/not-found/ui/NotFoundPage.tsx`

### 7. App Layer Creation
- ✅ Created app layer:
  - `src/app/providers/index.tsx`
  - `src/app/routing/index.tsx`
- ✅ Updated main `App.tsx` to use new structure

## 🔄 Remaining Migration Tasks

### 1. Update Import Paths
Many files still use the old `@/` import paths. These need to be updated:

**Current imports that need updating:**
```typescript
// Old paths (need to update)
import { Button } from "@/components/ui/button";
import { useMap } from "@/contexts/MapContext";
import { constraintManagementService } from "@/services/constraintManagement";

// New paths (should be)
import { Button } from "../../../shared/ui/button";
import { useMap } from "../../../contexts/MapContext";
import { constraintManagementService } from "../../../services/constraintManagement";
```

### 2. Move Remaining Services
- `src/services/` → Move to appropriate entities or features
- `src/services/api.ts` → Already moved to `src/shared/api/client.ts`
- `src/services/constraintManagement.ts` → Move to `src/features/manage-constraints/api/`

### 3. Move Remaining Components
- `src/components/Header.tsx` → Move to `src/widgets/` or `src/shared/ui/`
- `src/components/Login.tsx` → Move to `src/features/auth/ui/` or `src/pages/auth/ui/`
- `src/components/sidebar/ClientList.tsx` → Move to `src/features/manage-providers/ui/`
- `src/components/sidebar/NotificationPanel.tsx` → Move to `src/features/receive-notifications/ui/`

### 4. Move Context
- `src/contexts/MapContext.tsx` → Consider moving to `src/shared/contexts/` or keeping as is

### 5. Move Remaining Utils
- `src/utils/interface-hook.ts` → Move to `src/widgets/map-viewer/lib/`
- `src/utils/viewer-controller.ts` → Move to `src/widgets/map-viewer/lib/`
- `src/volume.ts` → Move to appropriate entity or shared

### 6. Update Vite Config (Optional)
Consider adding more specific path aliases for the new structure:
```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
    "@shared": path.resolve(__dirname, "./src/shared"),
    "@entities": path.resolve(__dirname, "./src/entities"),
    "@features": path.resolve(__dirname, "./src/features"),
    "@widgets": path.resolve(__dirname, "./src/widgets"),
    "@pages": path.resolve(__dirname, "./src/pages"),
    "@app": path.resolve(__dirname, "./src/app"),
  },
}
```

## 📁 Current FSD Structure

```
src/
├── app/                          # Application layer
│   ├── providers/
│   │   └── index.tsx            # App providers (QueryClient, Router, etc.)
│   └── routing/
│       └── index.tsx            # App routing configuration
├── pages/                        # Page components
│   ├── dashboard/ui/
│   │   └── DashboardPage.tsx    # Main dashboard page
│   └── not-found/ui/
│       └── NotFoundPage.tsx     # 404 page
├── widgets/                      # Complex UI blocks
│   ├── map-viewer/ui/
│   │   └── MapViewer.tsx        # 3D Cesium map widget
│   ├── sidebar-panel/ui/
│   │   └── SidebarPanel.tsx     # Main sidebar widget
│   └── timeline-bar/ui/
│       └── TimelineBar.tsx      # Timeline navigation widget
├── features/                     # Business logic features
│   ├── track-flights/ui/
│   │   └── FlightTrackingPanel.tsx
│   ├── manage-constraints/ui/
│   │   └── ConstraintManagementPanel.tsx
│   └── filter-operations/ui/
│       └── OperationalFiltersPanel.tsx
├── entities/                     # Business entities
│   ├── flight/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── constraint/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── operational-intent/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── geozone/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── subscription/
│   │   ├── types.ts
│   │   └── index.ts
│   └── identification-service-area/
│       ├── types.ts
│       └── index.ts
└── shared/                       # Reusable code
    ├── ui/                      # Generic UI components (moved from components/ui)
    ├── api/
    │   └── client.ts            # HTTP client
    ├── lib/
    │   ├── utils.ts             # General utilities
    │   └── formatters.ts        # Formatting functions
    ├── hooks/
    │   ├── use-toast.ts
    │   ├── use-mobile.tsx
    │   └── index.ts
    ├── types/
    │   ├── common.ts            # Common type definitions
    │   ├── dss.ts               # DSS-related types
    │   └── index.ts
    ├── constants/
    │   └── routes.ts            # Route constants
    ├── config/
    │   └── env.ts               # Environment configuration
    └── assets/                  # Static assets
        └── icon-br-utm.svg
```

## 🎯 Benefits Achieved

1. **Clear Separation of Concerns**: Each layer has a specific responsibility
2. **No Circular Dependencies**: Strict import rules prevent circular dependencies
3. **Scalable Architecture**: New features can be added without affecting existing ones
4. **Better Code Organization**: Related code is grouped by business domain
5. **Reusable Components**: Shared layer provides reusable utilities and UI components
6. **Type Safety**: Proper entity type definitions with clear boundaries

## 🚀 Next Steps

1. **Complete Import Path Updates**: Update all remaining `@/` imports to use relative paths
2. **Move Remaining Files**: Complete the migration of services, components, and utilities
3. **Add Entity Business Logic**: Add model files to entities with business logic methods
4. **Add Feature APIs**: Create API files in features for data fetching
5. **Add Tests**: Create tests following the FSD structure
6. **Documentation**: Update README with new architecture guidelines

## 🔧 Development Guidelines

### Import Rules (FSD Hierarchy)
```
App → Pages → Widgets → Features → Entities → Shared
```

- **Pages** can import from: Widgets, Features, Entities, Shared
- **Widgets** can import from: Features, Entities, Shared
- **Features** can import from: Entities, Shared
- **Entities** can import from: Shared only
- **Shared** cannot import from any other layer

### File Naming Conventions
- **Components**: PascalCase (e.g., `FlightTrackingPanel.tsx`)
- **Types**: camelCase files, PascalCase exports (e.g., `types.ts` exports `FlightDetail`)
- **Utilities**: camelCase (e.g., `formatters.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `ROUTES`)

This migration provides a solid foundation for scaling the UTM application while maintaining clean architecture principles.