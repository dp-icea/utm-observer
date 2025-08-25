# Application layer - use cases that orchestrate domain logic
from typing import List
from datetime import datetime
import logging

from domain.airspace import AirspaceAllocations
from ports.airspace_port import (
    AirspaceDetailsDataPort,
    AirspaceReferencesDataPort,
)
from ports.flights_port import FlightDataPort
from domain.base import Volume4D
from domain.flights import Flight
from schemas.requests.flights import QueryFlightsRequest
from domain.external.uss.common import OperationalIntent, Constraint
from domain.external.dss.remoteid import (
    IdentificationServiceAreaFull,
)


class AirspaceQueryUseCase:
    """Use case for querying airspace information"""

    def __init__(
        self,
        airspace_references_port: AirspaceReferencesDataPort,
        airspace_details_port: AirspaceDetailsDataPort,
        flight_port: FlightDataPort,
    ):
        self.airspace_reference_port = airspace_references_port
        self.airspace_details_port = airspace_details_port
        self.flight_port = flight_port

    async def get_airspace_allocations(
        self, area_of_interest: Volume4D
    ) -> AirspaceAllocations:
        """Get complete airspace snapshot for given area"""

        # Fetch references from DSS
        constraint_refs = (
            await self.airspace_reference_port.get_constraint_references(
                area_of_interest
            )
        )
        logging.info("Fetched constraint references: %s", constraint_refs)

        operational_intent_refs = await self.airspace_reference_port.get_operational_intent_references(
            area_of_interest
        )
        logging.info("Fetched operational intent references: %s", operational_intent_refs)

        isa_refs = await self.airspace_reference_port.get_identification_service_areas(
            area_of_interest
        )
        logging.info("Fetched ISA references: %s", isa_refs)

        # Fetch detailed information from USS
        constraints = await self._get_constraint_details(constraint_refs)
        operational_intents = await self._get_operational_intent_details(
            operational_intent_refs
        )
        identification_service_areas = await self._get_isa_details(isa_refs)

        return AirspaceAllocations(
            timestamp=datetime.now(),
            area_of_interest=area_of_interest,
            constraints=constraints,
            operational_intents=operational_intents,
            identification_service_areas=identification_service_areas,
        )

    async def get_active_flights(
        self, area: QueryFlightsRequest
    ) -> List[Flight]:
        """Get active flights in a given area"""

        return await self.flight_port.get_active_flights(area)

    async def _get_constraint_details(self, references) -> List[Constraint]:
        """Fetch constraint details with error handling"""
        constraints = []
        for ref in references:
            try:
                if ref.uss_base_url and ref.id:
                    constraint = await self.airspace_details_port.get_constraint_details(
                        ref
                    )
                    constraints.append(constraint)
            except Exception as e:
                logging.error(f"Fetching constraint {ref.id}: {e}")
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
                    oi = await self.airspace_details_port.get_operational_intent_details(
                        ref
                    )
                    operational_intents.append(oi)
            except Exception as e:
                logging.error(
                    f"Error fetching operational intent {ref.id}: {e}"
                )
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
                    isa = await self.airspace_details_port.get_identification_service_area_details(
                        ref
                    )
                    isas.append(isa)
            except Exception as e:
                logging.error(f"Error fetching ISA {ref.id}: {e}")
                continue
        return isas
