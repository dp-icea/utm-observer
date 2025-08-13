# UTM Observer Backend Architecture

## Hexagonal Architecture Overview

This backend follows hexagonal architecture (ports and adapters) to keep the core business logic separate from external dependencies.

### Structure

```
backend/
├── domain/           # Core business entities and value objects
├── ports/           # Interfaces for external services
├── adapters/        # Complete infrastructure implementations
├── application/     # Use cases and business logic
├── infrastructure/  # Shared utilities (auth, cache, etc.)
├── routes/         # FastAPI HTTP handlers
└── schemas/        # Data models and validation
    ├── api/        # FastAPI request/response models
    ├── external/   # External system contracts (DSS, USS)
    └── shared/     # Compatibility layer and shared utilities
```

### Key Components

#### Domain Layer
- `entities.py`: Core business objects like `AirspaceSnapshot` and `AirspaceVolume`

#### Ports (Interfaces)
- `AirspaceDataPort`: Interface for fetching airspace references from DSS
- `VolumeDetailsPort`: Interface for fetching detailed volume info from USS
- `FlightDataPort`: Interface for live flight data
- `ConstraintManagementPort`: Interface for constraint operations

#### Adapters (Complete Infrastructure Implementations)
- `DSSAdapter`: Direct DSS API integration with authentication and caching
- `USSAdapter`: Factory pattern for dynamic USS providers with direct API calls
- `FlightsAdapter`: Complete flight data retrieval including ISA querying
- `ConstraintManagementAdapter`: Direct constraint management with DSS integration

#### Application Layer
- `AirspaceQueryUseCase`: Orchestrates fetching complete airspace snapshots
- `ConstraintManagementUseCase`: Handles constraint operations

### API Endpoints

#### Airspace Routes (`/api/airspace/`)
- `POST /snapshot` - Get complete airspace snapshot (replaces `/volumes`)
- `POST /flights` - Get active flights in area

#### Constraint Routes (`/api/constraints/`)
- `POST /create` - Create new constraint
- `DELETE /delete-in-area` - Delete constraints in area

### Benefits

1. **Separation of Concerns**: Business logic is isolated from external APIs
2. **Testability**: Easy to mock external dependencies
3. **Flexibility**: Can swap implementations without changing business logic
4. **Maintainability**: Clear boundaries between layers
5. **Error Handling**: Centralized error handling with fallback caching

### Caching Strategy

- Simple in-memory cache for DSS responses (handles API failures)
- Configurable TTL for different data types
- Automatic cache expiration and cleanup

### Schema Organization

#### Domain Layer (`domain/`)
- `value_objects.py`: Core domain primitives (Volume4D, LatLngPoint, Time, etc.)
- `entities.py`: Business entities (AirspaceSnapshot, AirspaceVolume)

#### API Layer (`schemas/api/`)
- `requests/`: HTTP request models for FastAPI endpoints
- `responses/`: HTTP response models for FastAPI endpoints  
- `common.py`: Shared API schemas (ApiResponse, ApiError)

#### External Systems (`schemas/external/`)
- `dss/`: Discovery and Synchronization Service schemas
- `uss/`: UAS Service Supplier schemas

#### Shared Schemas (`schemas/shared/`)
- Compatibility layer and shared utilities
- Gradually being replaced by domain value objects

### Migration from Old Structure

#### API Changes
- `/fetch/volumes` → `/airspace/snapshot` (better naming)
- `/constraint_management/*` → `/constraints/*` (cleaner structure)

#### Schema Changes
- Geographic primitives moved from `schemas/common/geo.py` to `domain/value_objects.py`
- External API schemas moved to `schemas/external/dss/` and `schemas/external/uss/`
- New API layer schemas in `schemas/api/` for clean request/response handling

#### Benefits of New Structure
- **Domain Independence**: Core business logic doesn't depend on external schemas
- **Clear Boundaries**: API, domain, and external concerns are separated
- **Better Testing**: Domain entities can be tested in isolation
- **Easier Maintenance**: Changes to external APIs don't break domain logic