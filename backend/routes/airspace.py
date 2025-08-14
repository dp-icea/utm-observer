# New airspace routes with better naming and hexagonal architecture
from http import HTTPStatus
from fastapi import APIRouter, Body, Depends

from application.airspace_use_case import AirspaceQueryUseCase
from adapters.dss_adapter import DSSAdapter
from adapters.uss_adapter import USSAdapter
from adapters.flights_adapter import FlightsAdapter
from domain.base import Volume4D
from schemas.api import ApiResponse
from schemas.requests.flights import QueryFlightsRequest

router = APIRouter()


def get_airspace_query_use_case() -> AirspaceQueryUseCase:
    """Dependency injection for airspace query use case"""
    dss_adapter = DSSAdapter()
    uss_adapter = USSAdapter()
    flights_adapter = FlightsAdapter()

    return AirspaceQueryUseCase(
        airspace_data_port=dss_adapter,
        volume_details_port=uss_adapter,
        flight_data_port=flights_adapter,
    )


@router.post(
    "/allocations",
    response_description="Get complete airspace allocations for an area",
    response_model=ApiResponse,
    status_code=HTTPStatus.OK.value,
)
async def get_airspace_snapshot(
    area_of_interest: Volume4D = Body(),
    use_case: AirspaceQueryUseCase = Depends(get_airspace_query_use_case),
):
    """
    Get a complete snapshot of the allocations in the airspace including:
    - Constraints (no-fly zones, restrictions)
    - Operational intents (planned flights)
    - Identification service areas (remote ID coverage)
    """
    snapshot = await use_case.get_airspace_allocations(area_of_interest)

    return ApiResponse(
        message=(
            "Airspace snapshot retrieved with"
            f" {snapshot.total_volumes} volumes"
        ),
        data=snapshot,
    )


@router.post(
    "/flights",
    response_description="Get active flights in an area",
    response_model=ApiResponse,
    status_code=HTTPStatus.OK.value,
)
async def get_active_flights(
    area: QueryFlightsRequest = Body(),
    use_case: AirspaceQueryUseCase = Depends(get_airspace_query_use_case),
):
    """
    Get live flight data for drones
    currently active in the specified area
    """
    flights_response = await use_case.get_active_flights(area)

    return ApiResponse(
        message="Active flight data retrieved",
        data=flights_response,
    )
