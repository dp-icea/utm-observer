# Backend Refactoring Context - Hexagonal Architecture Implementation

## Project Overview
This document captures the context of refactoring a real-time world state tracker backend from a simple FastAPI structure to a Hexagonal Architecture (Ports & Adapters) pattern.

## Original Architecture
The project started with:
- **Frontend**: React + TypeScript + Cesium for 3D world visualization
- **Backend**: FastAPI with basic routing structure
- **Purpose**: Real-time tracking of airspace reservations and UTM (Unmanned Traffic Management) data

### Original Backend Structure
```
backend/
├── routes/           # API endpoints
├── services/         # External service clients (DSS, USS, Flights)
├── schemas/          # Pydantic models
├── config/           # Configuration
└── app.py           # FastAPI application
```

## Refactoring Goals
1. **Better Architecture**: Implement Hexagonal Architecture for maintainability
2. **Separation of Concerns**: Isolate business logic from external dependencies
3. **Testability**: Enable easy unit testing with mocked dependencies
4. **Scalability**: Prepare for future enhancements (WebSockets, databases, microservices)
5. **CQRS Pattern**: Separate read and write operations

## New Architecture Implementation

### 1. Domain Layer (`domain/`)
**Core business logic, independent of external frameworks**

#### Entities (`domain/entities/`)
- `WorldStateSnapshot`: Represents a complete snapshot of world state at a point in time
  - Contains operational intents, constraints, identification service areas, and flights
  - Business methods: `is_area_reserved()`, `get_conflicts()`
- `ReservationRequest`: Represents area reservation requests with validation

#### Ports (`domain/ports/`)
- `repositories.py`: Interfaces for data persistence
  - `WorldStateRepository`: Save/retrieve world state snapshots
  - `ReservationRepository`: Manage area reservations
- `external_services.py`: Interfaces for external service interactions
  - `DSSService`: Discovery and Synchronization Service
  - `USSService`: UAS Service Supplier interactions
  - `FlightTrackingService`: Live flight data
  - `NotificationService`: Real-time notifications

#### Services (`domain/services/`)
- `WorldStateDomainService`: Core business logic orchestration
  - Creates comprehensive world state snapshots
  - Validates reservation requests against current state
  - Handles conflict detection

### 2. Application Layer (`application/`)
**Use cases and application flow coordination**

#### Commands (`application/commands/`) - Write Operations
- `CreateWorldStateSnapshotCommand`: Generate new world state snapshot
- `CreateReservationCommand`: Create area reservation
- `CancelReservationCommand`: Cancel existing reservation

#### Queries (`application/queries/`) - Read Operations
- `GetWorldStateQuery`: Retrieve current world state
- `GetWorldStateHistoryQuery`: Get historical snapshots
- `GetReservationQuery`: Get specific reservation details
- `GetActiveReservationsQuery`: Get active reservations in area

#### Handlers (`application/handlers/`)
- Base interfaces for CQRS pattern implementation
- Command and query handler abstractions

### 3. Infrastructure Layer (`infrastructure/`)
**External adapters implementing domain ports**

#### Repositories (`infrastructure/repositories/`)
- `InMemoryWorldStateRepository`: Development/testing implementation
- `InMemoryReservationRepository`: In-memory reservation storage
- Ready for database implementations (PostgreSQL, MongoDB, etc.)

#### External Services (`infrastructure/external/`)
- `DSSServiceAdapter`: Wraps existing DSS service clients
- `USSServiceAdapter`: Wraps existing USS service clients
- `FlightServiceAdapter`: Wraps existing flight tracking service
- `NotificationServiceAdapter`: Logging and WebSocket notification implementations

### 4. Presentation Layer (`presentation/`)
**HTTP API endpoints and middleware**

#### API (`presentation/api/`)
- `world_state.py`: New world state and reservation endpoints
- `flights.py`: New flight query endpoints
- Clean separation from business logic
- Proper HTTP status codes and error handling

### 5. Core (`core/`)
**Application configuration and dependency injection**

- `container.py`: Dependency injection using `dependency-injector`
- Manages all service dependencies and their lifecycles
- Enables easy testing with mock implementations

## API Endpoints

### New Architecture Endpoints
```
POST /api/world-state/volumes              # Get current world state
POST /api/world-state/volumes/history      # Get world state history
POST /api/world-state/reservations         # Create area reservation
GET  /api/world-state/reservations/{id}    # Get reservation details
DELETE /api/world-state/reservations/{id}  # Cancel reservation
POST /api/world-state/reservations/active  # Get active reservations
POST /api/flights/query                    # Query live flights
```

### Legacy Endpoints (Backward Compatible)
```
POST /api/fetch/volumes                    # Legacy world state query
POST /api/fetch/flights                    # Legacy flight query
POST /api/constraint_management/*          # Constraint management
GET  /api/healthy/*                        # Health checks
```

## Key Implementation Details

### Dependency Injection
```python
from core.container import Container

container = Container()
handler = container.create_world_state_snapshot_handler()
result = await handler.handle(command)
```

### CQRS Pattern Usage
```python
# Command (Write)
command = CreateReservationCommand(reservation=reservation_request)
success = await create_reservation_handler.handle(command)

# Query (Read)
query = GetWorldStateQuery(area_of_interest=area)
snapshot = await get_world_state_handler.handle(query)
```

### Business Logic Example
```python
# Domain service orchestrates complex operations
snapshot = await world_state_service.create_world_state_snapshot(area)

# Domain entity contains business rules
conflicts = snapshot.get_conflicts(proposed_area)
is_reserved = snapshot.is_area_reserved(area)
```

## Migration Strategy

### Phase 1: ✅ Completed
- [x] Implement hexagonal architecture structure
- [x] Create domain entities and ports
- [x] Implement application layer with CQRS
- [x] Create infrastructure adapters
- [x] Add new API endpoints
- [x] Maintain backward compatibility

### Phase 2: In Progress
- [ ] Test the new architecture
- [ ] Update frontend to use new endpoints
- [ ] Add comprehensive error handling
- [ ] Implement proper logging

### Phase 3: Future
- [ ] Replace in-memory repositories with database
- [ ] Add WebSocket support for real-time updates
- [ ] Implement event sourcing
- [ ] Add caching layer (Redis)
- [ ] Add monitoring and metrics

## Benefits Achieved

### 1. **Maintainability**
- Clear separation of concerns
- Business logic isolated from external dependencies
- Easy to understand and modify

### 2. **Testability**
- Domain logic can be tested in isolation
- Easy to mock external dependencies
- Clear boundaries for different test types

### 3. **Flexibility**
- Easy to swap implementations (in-memory → database)
- External services can be replaced without changing business logic
- Support for different deployment configurations

### 4. **Scalability**
- CQRS enables read/write optimization
- Clear boundaries for microservice extraction
- Event-driven architecture ready

## Current Status

### Working Components
- ✅ Domain layer with business entities
- ✅ Application layer with CQRS handlers
- ✅ Infrastructure adapters for existing services
- ✅ New API endpoints
- ✅ Dependency injection container
- ✅ Backward compatibility maintained

### Next Steps
1. **Testing**: Verify new architecture works with existing data
2. **Frontend Integration**: Update React app to use new endpoints
3. **Database Migration**: Replace in-memory storage
4. **Real-time Features**: Add WebSocket support

## Files Modified/Created

### New Architecture Files
- `domain/` - Complete domain layer implementation
- `application/` - CQRS command/query handlers
- `infrastructure/` - External service adapters
- `presentation/` - New API endpoints
- `core/container.py` - Dependency injection
- `tests/` - Architecture tests
- `ARCHITECTURE.md` - Detailed documentation
- `startup.py` - Verification script

### Modified Files
- `app.py` - Updated to include new routes and DI container
- `requirements.txt` - Added dependency-injector

### Preserved Files
- All existing `routes/`, `services/`, `schemas/` - Maintained for compatibility
- Configuration and environment files unchanged

## Technical Decisions

### Why Hexagonal Architecture?
- **Domain-Driven Design**: Business logic is the center of the application
- **Testability**: Easy to test business logic without external dependencies
- **Flexibility**: Easy to change external integrations
- **Industry Standard**: Well-established pattern for complex applications

### Why CQRS?
- **Performance**: Optimize reads and writes separately
- **Scalability**: Different scaling strategies for queries vs commands
- **Clarity**: Clear separation of read and write operations
- **Future-Ready**: Enables event sourcing and advanced patterns

### Why Dependency Injection?
- **Loose Coupling**: Components don't depend on concrete implementations
- **Testing**: Easy to inject mocks and test doubles
- **Configuration**: Centralized dependency management
- **Flexibility**: Easy to change implementations

This refactoring provides a solid foundation for the world state tracker system while maintaining all existing functionality and preparing for future enhancements.