# Application layer - use cases that orchestrate domain logic
from typing import List
from datetime import datetime

from domain.entities import AirspaceSnapshot
from ports.airspace_repository import (
    AirspaceDataPort,
    VolumeDetailsPort,
    FlightDataPort,
    ConstraintManagementPort,
)
from domain.value_objects import Volume4D, LatLngPoint
from schemas.flights import QueryFlightsRequest
from schemas.external.uss.common import OperationalIntent, Constraint
from schemas.external.dss.remoteid import (
    IdentificationServiceAreaFull,
    IdentificationServiceAreaDetails,
)


class AirspaceQueryUseCase:
    """Use case for querying airspace information"""

    def __init__(
        self,
        airspace_data_port: AirspaceDataPort,
        volume_details_port: VolumeDetailsPort,
        flight_data_port: FlightDataPort,
    ):
        self.airspace_data_port = airspace_data_port
        self.volume_details_port = volume_details_port
        self.flight_data_port = flight_data_port

    async def get_airspace_snapshot(
        self, area_of_interest: Volume4D
    ) -> AirspaceSnapshot:
        """Get complete airspace snapshot for given area"""

        # Fetch references from DSS
        constraint_refs = (
            await self.airspace_data_port.get_constraint_references(
                area_of_interest
            )
        )

        operational_intent_refs = (
            await self.airspace_data_port.get_operational_intent_references(
                area_of_interest
            )
        )
        isa_refs = (
            await self.airspace_data_port.get_identification_service_areas(
                area_of_interest
            )
        )

        # Fetch detailed information from USS
        constraints = await self._get_constraint_details(constraint_refs)
        operational_intents = await self._get_operational_intent_details(
            operational_intent_refs
        )
        identification_service_areas = await self._get_isa_details(isa_refs)

        # Get active flights
        flight_query = QueryFlightsRequest(area=area_of_interest)
        active_flights = await self.flight_data_port.get_active_flights(
            flight_query
        )

        return AirspaceSnapshot(
            timestamp=datetime.now(),
            area_of_interest=area_of_interest,
            constraints=constraints,
            operational_intents=operational_intents,
            identification_service_areas=identification_service_areas,
            active_flights=active_flights,
        )

    async def _get_constraint_details(self, references) -> List[Constraint]:
        """Fetch constraint details with error handling"""
        constraints = []
        for ref in references:
            try:
                if ref.uss_base_url and ref.id:
                    constraint = (
                        await self.volume_details_port.get_constraint_details(
                            ref
                        )
                    )
                    constraints.append(constraint)
            except Exception as e:
                print(f"Error fetching constraint {ref.id}: {e}")
                continue
        return constraints

    async def _get_operational_intent_details(
        self, references
    ) -> List[OperationalIntent]:
        """Fetch operational intent details with error handling"""
        operational_intents = []
        for ref in references:
            try:
                if ref.uss_base_url and ref.id:
                    oi = await self.volume_details_port.get_operational_intent_details(
                        ref
                    )
                    operational_intents.append(oi)
            except Exception as e:
                print(f"Error fetching operational intent {ref.id}: {e}")
                continue
        return operational_intents

    async def _get_isa_details(
        self, references
    ) -> List[IdentificationServiceAreaFull]:
        """Fetch ISA details with error handling"""
        isas = []
        for ref in references:
            try:
                if ref.uss_base_url and ref.id:
                    isa_details = await self.volume_details_port.get_identification_service_area_details(
                        ref
                    )
                    isa_full = IdentificationServiceAreaFull(
                        reference=ref,
                        details=IdentificationServiceAreaDetails(
                            volumes=[isa_details.extents]
                        ),
                    )
                    isas.append(isa_full)
            except Exception as e:
                print(f"Error fetching ISA {ref.id}: {e}")
                continue
        return isas


class ConstraintManagementUseCase:
    """Use case for managing constraints"""

    def __init__(
        self,
        constraint_management_port: ConstraintManagementPort,
        airspace_data_port: AirspaceDataPort,
    ):
        self.constraint_management_port = constraint_management_port
        self.airspace_data_port = airspace_data_port

    async def create_constraint(self, constraint_data: dict):
        """Create a new constraint"""
        return await self.constraint_management_port.create_constraint(
            constraint_data
        )

    async def delete_constraints_in_area(self, coordinates: List[LatLngPoint]):
        """Delete all constraints in a given area"""
        # This would need the area conversion logic from your current implementation
        # Simplified for now
        pass
