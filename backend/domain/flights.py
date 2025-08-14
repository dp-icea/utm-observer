from typing import Optional

from domain.external.dss.remoteid import IdentificationServiceArea
from domain.external.uss.remoteid import RIDFlight, RIDFlightDetails


class Flight(RIDFlight):
    identification_service_area: IdentificationServiceArea
    details: Optional[RIDFlightDetails]
