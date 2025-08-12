from typing import List
from datetime import datetime

from ..entities.world_state import WorldStateSnapshot, ReservationRequest
from ..ports.repositories import WorldStateRepository, ReservationRepository
from ..ports.external_services import DSSService, USSService, FlightTrackingService
from schemas.common.geo import Volume4D
from schemas.flights import QueryFlightsRequest


class WorldStateDomainService:
    """Domain service for world state business logic"""
    
    def __init__(
        self,
        world_state_repo: WorldStateRepository,
        reservation_repo: ReservationRepository,
        dss_service: DSSService,
        uss_service: USSService,
        flight_service: FlightTrackingService,
    ):
        self._world_state_repo = world_state_repo
        self._reservation_repo = reservation_repo
        self._dss_service = dss_service
        self._uss_service = uss_service
        self._flight_service = flight_service
    
    async def create_world_state_snapshot(self, area: Volume4D) -> WorldStateSnapshot:
        """Create a comprehensive world state snapshot for an area"""
        
        # Query constraints from DSS
        constraint_refs = await self._dss_service.query_constraints(area)
        constraints = []
        for ref in constraint_refs.constraint_references:
            if ref.uss_base_url and ref.id:
                try:
                    constraint = await self._uss_service.get_constraint_details(
                        ref.uss_base_url, ref.id
                    )
                    constraints.append(constraint)
                except Exception as e:
                    # Log error but continue processing
                    print(f"Failed to get constraint details for {ref.id}: {e}")
        
        # Query operational intents from DSS
        intent_refs = await self._dss_service.query_operational_intents(area)
        operational_intents = []
        for ref in intent_refs.operational_intent_references:
            if ref.uss_base_url and ref.id:
                try:
                    intent = await self._uss_service.get_operational_intent_details(
                        ref.uss_base_url, ref.id
                    )
                    operational_intents.append(intent)
                except Exception as e:
                    print(f"Failed to get operational intent details for {ref.id}: {e}")
        
        # Query identification service areas
        isa_response = await self._dss_service.query_identification_service_areas(area)
        identification_service_areas = []
        for isa in isa_response.service_areas:
            if isa.uss_base_url and isa.id:
                try:
                    isa_full = await self._uss_service.get_identification_service_area_details(
                        isa.uss_base_url, isa.id
                    )
                    identification_service_areas.append(isa_full)
                except Exception as e:
                    print(f"Failed to get ISA details for {isa.id}: {e}")
        
        # Query flights
        flight_request = self._volume_to_flight_request(area)
        flight_response = await self._flight_service.query_flights(flight_request)
        
        # Create snapshot
        snapshot = WorldStateSnapshot(
            area_of_interest=area,
            timestamp=datetime.utcnow(),
            operational_intents=operational_intents,
            constraints=constraints,
            identification_service_areas=identification_service_areas,
            flights=flight_response.flights,
        )
        
        # Save snapshot
        await self._world_state_repo.save_snapshot(snapshot)
        
        return snapshot
    
    async def validate_reservation_request(
        self, 
        reservation: ReservationRequest
    ) -> tuple[bool, List[str]]:
        """Validate a reservation request against current world state"""
        
        if not reservation.is_valid():
            return False, ["Invalid reservation request"]
        
        # Get current world state for the area
        snapshot = await self._world_state_repo.get_latest_snapshot(reservation.area)
        
        if not snapshot:
            # Create new snapshot if none exists
            snapshot = await self.create_world_state_snapshot(reservation.area)
        
        # Check for conflicts
        conflicts = snapshot.get_conflicts(reservation.area)
        
        # Check against existing reservations
        existing_reservations = await self._reservation_repo.get_active_reservations(
            reservation.area
        )
        
        for existing in existing_reservations:
            if self._reservations_conflict(reservation, existing):
                conflicts.append(f"reservation_{existing.id}")
        
        return len(conflicts) == 0, conflicts
    
    def _volume_to_flight_request(self, volume: Volume4D) -> QueryFlightsRequest:
        """Convert Volume4D to QueryFlightsRequest"""
        # Extract bounding box from volume
        # This is a simplified implementation
        if hasattr(volume.volume, 'outline_polygon') and volume.volume.outline_polygon:
            vertices = volume.volume.outline_polygon.vertices
            if vertices:
                lats = [v.lat for v in vertices]
                lngs = [v.lng for v in vertices]
                return QueryFlightsRequest(
                    north=max(lats),
                    south=min(lats),
                    east=max(lngs),
                    west=min(lngs)
                )
        
        # Fallback to default area
        return QueryFlightsRequest(north=0, south=0, east=0, west=0)
    
    def _reservations_conflict(
        self, 
        reservation1: ReservationRequest, 
        reservation2: ReservationRequest
    ) -> bool:
        """Check if two reservations conflict"""
        # Simplified conflict detection - would need proper 4D volume intersection
        return True  # Placeholder implementation