from http import HTTPStatus
from fastapi import APIRouter, Body, Depends

from core.container import Container
from infrastructure.external.flight_service_adapter import FlightServiceAdapter
from schemas.flights import QueryFlightsRequest, QueryFlightsResponse
from schemas.response import Response


router = APIRouter()
container = Container()


@router.post(
    "/query",
    response_description="Query live flights using new architecture",
    response_model=Response,
    status_code=HTTPStatus.OK.value,
)
async def query_flights(
    area: QueryFlightsRequest = Body(),
    flight_service: FlightServiceAdapter = Depends(container.flight_service),
):
    """Query live flights in a specified area"""
    
    flight_response = await flight_service.query_flights(area)
    
    return Response(
        message="Live flight data retrieved successfully",
        data=flight_response,
    )