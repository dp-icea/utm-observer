from domain.ports.external_services import FlightTrackingService
from services.flights import FlightsService
from schemas.flights import QueryFlightsRequest, QueryFlightsResponse


class FlightServiceAdapter(FlightTrackingService):
    """Adapter for flight tracking service"""
    
    def __init__(self):
        self._flights_service = FlightsService()
    
    async def query_flights(self, request: QueryFlightsRequest) -> QueryFlightsResponse:
        return await self._flights_service.query_flights(request)