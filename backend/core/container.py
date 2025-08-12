from dependency_injector import containers, providers

# Domain
from domain.services.world_state_domain_service import WorldStateDomainService

# Application
from application.commands.world_state_commands import (
    CreateWorldStateSnapshotHandler,
    CreateReservationHandler,
    CancelReservationHandler
)
from application.queries.world_state_queries import (
    GetWorldStateHandler,
    GetWorldStateHistoryHandler,
    GetReservationHandler,
    GetActiveReservationsHandler
)

# Infrastructure
from infrastructure.repositories.memory_world_state_repository import (
    InMemoryWorldStateRepository,
    InMemoryReservationRepository
)
from infrastructure.external.dss_service_adapter import DSSServiceAdapter
from infrastructure.external.uss_service_adapter import USSServiceAdapter
from infrastructure.external.flight_service_adapter import FlightServiceAdapter
from infrastructure.external.notification_service_adapter import (
    LoggingNotificationService,
    WebSocketNotificationService
)


class Container(containers.DeclarativeContainer):
    """Dependency injection container"""
    
    # Configuration
    config = providers.Configuration()
    
    # Repositories
    world_state_repository = providers.Singleton(InMemoryWorldStateRepository)
    reservation_repository = providers.Singleton(InMemoryReservationRepository)
    
    # External Services
    dss_service = providers.Singleton(DSSServiceAdapter)
    uss_service = providers.Singleton(USSServiceAdapter)
    flight_service = providers.Singleton(FlightServiceAdapter)
    notification_service = providers.Singleton(LoggingNotificationService)
    
    # Domain Services
    world_state_domain_service = providers.Factory(
        WorldStateDomainService,
        world_state_repo=world_state_repository,
        reservation_repo=reservation_repository,
        dss_service=dss_service,
        uss_service=uss_service,
        flight_service=flight_service,
    )
    
    # Command Handlers
    create_world_state_snapshot_handler = providers.Factory(
        CreateWorldStateSnapshotHandler,
        world_state_service=world_state_domain_service,
    )
    
    create_reservation_handler = providers.Factory(
        CreateReservationHandler,
        world_state_service=world_state_domain_service,
        reservation_repo=reservation_repository,
        notification_service=notification_service,
    )
    
    cancel_reservation_handler = providers.Factory(
        CancelReservationHandler,
        reservation_repo=reservation_repository,
    )
    
    # Query Handlers
    get_world_state_handler = providers.Factory(
        GetWorldStateHandler,
        world_state_repo=world_state_repository,
    )
    
    get_world_state_history_handler = providers.Factory(
        GetWorldStateHistoryHandler,
        world_state_repo=world_state_repository,
    )
    
    get_reservation_handler = providers.Factory(
        GetReservationHandler,
        reservation_repo=reservation_repository,
    )
    
    get_active_reservations_handler = providers.Factory(
        GetActiveReservationsHandler,
        reservation_repo=reservation_repository,
    )