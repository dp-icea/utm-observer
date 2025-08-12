# Backend Architecture - Hexagonal Architecture (Ports & Adapters)

## Overview

The backend has been refactored to use Hexagonal Architecture (also known as Ports & Adapters pattern) to improve maintainability, testability, and separation of concerns.

## Architecture Layers

### 1. Domain Layer (`domain/`)
The core business logic, independent of external concerns.

- **Entities** (`domain/entities/`): Core business objects
  - `WorldStateSnapshot`: Represents a snapshot of world state at a point in time
  - `ReservationRequest`: Represents area reservation requests

- **Ports** (`domain/ports/`): Interfaces for external dependencies
  - `repositories.py`: Data persistence interfaces
  - `external_services.py`: External service interfaces

- **Services** (`domain/services/`): Domain business logic
  - `WorldStateDomainService`: Core world state business operations

### 2. Application Layer (`application/`)
Orchestrates domain objects and coordinates application flow.

- **Commands** (`application/commands/`): Write operations (CQRS pattern)
  - `CreateWorldStateSnapshotCommand`
  - `CreateReservationCommand`
  - `CancelReservationCommand`

- **Queries** (`application/queries/`): Read operations (CQRS pattern)
  - `GetWorldStateQuery`
  - `GetWorldStateHistoryQuery`
  - `GetReservationQuery`

- **Handlers** (`application/handlers/`): Process commands and queries
  - Base interfaces for command and query handlers

### 3. Infrastructure Layer (`infrastructure/`)
Implements the ports defined in the domain layer.

- **Repositories** (`infrastructure/repositories/`): Data persistence implementations
  - `InMemoryWorldStateRepository`: In-memory storage for development
  - `InMemoryReservationRepository`: In-memory reservation storage

- **External Services** (`infrastructure/external/`): External service adapters
  - `DSSServiceAdapter`: DSS service integration
  - `USSServiceAdapter`: USS service integration
  - `FlightServiceAdapter`: Flight tracking service
  - `NotificationServiceAdapter`: Notification services

### 4. Presentation Layer (`presentation/`)
HTTP API endpoints and middleware.

- **API** (`presentation/api/`): REST endpoints
  - `world_state.py`: World state and reservation endpoints
  - `flights.py`: Flight query endpoints

### 5. Core (`core/`)
Application configuration and dependency injection.

- `container.py`: Dependency injection container using `dependency-injector`

## Key Benefits

### 1. **Separation of Concerns**
- Business logic is isolated in the domain layer
- External dependencies are abstracted through ports
- Each layer has a single responsibility

### 2. **Testability**
- Domain logic can be tested without external dependencies
- Easy to mock external services through ports
- Clear boundaries for unit and integration tests

### 3. **Flexibility**
- Easy to swap implementations (e.g., in-memory to database)
- External services can be replaced without changing business logic
- Support for different deployment configurations

### 4. **CQRS Pattern**
- Clear separation between read and write operations
- Optimized query handling
- Better scalability for read-heavy workloads

## API Endpoints

### New Architecture Endpoints

#### World State
- `POST /api/world-state/volumes` - Get current world state for an area
- `POST /api/world-state/volumes/history` - Get world state history
- `POST /api/world-state/reservations` - Create area reservation
- `GET /api/world-state/reservations/{id}` - Get reservation details
- `DELETE /api/world-state/reservations/{id}` - Cancel reservation
- `POST /api/world-state/reservations/active` - Get active reservations in area

#### Flights
- `POST /api/flights/query` - Query live flights (new architecture)

### Legacy Endpoints (Backward Compatibility)
- `POST /api/fetch/volumes` - Legacy world state query
- `POST /api/fetch/flights` - Legacy flight query

## Usage Examples

### Query World State
```python
# Using the new architecture
from application.commands.world_state_commands import CreateWorldStateSnapshotCommand
from application.queries.world_state_queries import GetWorldStateQuery

# Create snapshot
command = CreateWorldStateSnapshotCommand(area_of_interest=area)
snapshot = await create_snapshot_handler.handle(command)

# Query existing snapshot
query = GetWorldStateQuery(area_of_interest=area)
snapshot = await get_world_state_handler.handle(query)
```

### Create Reservation
```python
from application.commands.world_state_commands import CreateReservationCommand
from domain.entities.world_state import ReservationRequest

reservation = ReservationRequest(
    id=UUID(),
    area=area,
    requester_id="user123",
    priority=1
)

command = CreateReservationCommand(reservation=reservation)
success = await create_reservation_handler.handle(command)
```

## Migration Guide

### For Existing Code
1. **Legacy endpoints remain functional** - No breaking changes
2. **Gradual migration** - Move to new endpoints when ready
3. **Dependency injection** - Use container for new services

### For New Features
1. **Use new architecture** - Follow hexagonal pattern
2. **Define ports first** - Create interfaces before implementations
3. **Write tests** - Test domain logic independently

## Configuration

### Dependency Injection
The application uses `dependency-injector` for managing dependencies:

```python
from core.container import Container

container = Container()
handler = container.create_world_state_snapshot_handler()
```

### Environment Variables
Same as before - no changes to configuration requirements.

## Testing Strategy

### Unit Tests
- Test domain entities and services in isolation
- Mock external dependencies through ports
- Focus on business logic validation

### Integration Tests
- Test complete workflows through handlers
- Use real implementations for critical paths
- Validate external service integrations

### API Tests
- Test HTTP endpoints with various scenarios
- Validate request/response formats
- Test error handling and edge cases

## Future Enhancements

### Planned Improvements
1. **Database Integration** - Replace in-memory repositories
2. **Event Sourcing** - Track all world state changes
3. **WebSocket Support** - Real-time updates
4. **Caching Layer** - Redis integration for performance
5. **Monitoring** - Metrics and health checks
6. **Authentication** - JWT-based security

### Scalability Considerations
- **Read Replicas** - Separate read/write databases
- **Message Queues** - Async processing for heavy operations
- **Microservices** - Split into smaller services if needed
- **Load Balancing** - Horizontal scaling support