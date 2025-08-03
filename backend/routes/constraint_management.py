from http import HTTPStatus
from typing import List, Any
from fastapi import APIRouter, Body
from pydantic import HttpUrl
from datetime import datetime, timedelta
from pprint import pprint

from schemas.common.geo import Altitude, LatLngPoint, Polygon, Volume3D, Volume4D
from schemas.common.base import Time
from schemas.common.enums import AltitudeReference, AltitudeUnits, TimeFormat
from schemas.dss.common import ConstraintReference, OperationalIntentReference
from schemas.dss.constraints import QueryConstraintReferenceParameters
from schemas.dss.operational_intents import QueryOperationalIntentReferenceParameters
from schemas.dss.remoteid import IdentificationServiceArea, IdentificationServiceAreaDetails, IdentificationServiceAreaFull
from schemas.flights import QueryFlightsRequest, QueryFlightsResponse
from schemas.response import Response
from schemas.uss.constraints import Constraint
from services.dss.constraints import DSSConstraintsService
from services.dss.operational_intents import DSSOperationalIntentsService
from services.uss.operational_intents import USSOperationalIntentsService
from services.uss.constraints import USSConstraintsService
from services.flights import FlightsService
from services.geoawareness import GeoawarenessService
from services.dss.remoteid import DSSRemoteIDService
from services.uss.remoteid import USSRemoteIDService
from schemas.uss.common import OperationalIntent
from schemas.fetch import QueryVolumesResponse, QueryVolumesResponseData

from mock.flight_data import generate_flight_mock_data

router = APIRouter()


@router.put(
    "/create_constraint",
    response_description="Create a new constraint",
    status_code=HTTPStatus.OK.value,
)
async def create_constraint(
    request_body: Any = Body(),
):
    """
    Endpoint to create a new constraint.
    The request body should contain the necessary data to create the constraint.
    """

    print("== Creating Constraint ==")
    pprint(request_body)
    print("=========================")

    geoawareness_service = GeoawarenessService()

    try:
        res = await geoawareness_service.create_constraint(request_body)
    except Exception as e:
        print(f"Error creating constraint: {e}")
        raise ValueError(
            f"Failed to create constraint: {e}"
        )

    print("== Constraint Created ==")
    pprint(res)
    print("=========================")

    return Response(
        message="Constraint created successfully",
        data=res,
    )


@router.delete(
    "/delete_constraint",
    response_description="Delete a constraint",
    response_model=Response,
    status_code=HTTPStatus.OK.value,
)
async def delete_constraint(
    coordinates: List[LatLngPoint] = Body(),
):

    print("== Querying Constraints ==")
    pprint(coordinates)
    print("=======================")

    dssConstraintService = DSSConstraintsService()

    query_constraint_reference_params = QueryConstraintReferenceParameters(
        area_of_interest=Volume4D(
            volume=Volume3D(
                outline_polygon=Polygon(
                    vertices=coordinates,
                ),
                altitude_lower=Altitude(
                    value=0,
                    reference=AltitudeReference.W84,
                    units=AltitudeUnits.M,
                ),
                altitude_upper=Altitude(
                    value=10000,
                    reference=AltitudeReference.W84,
                    units=AltitudeUnits.M,
                ),
            ),
            time_start=Time(
                value=datetime.now(),
                format=TimeFormat.RFC3339,
            ),
            time_end=Time(
                value=datetime.now() + timedelta(seconds=10),
                format=TimeFormat.RFC3339,
            ),
        )
    )

    query_constraint_reference = await dssConstraintService.query_constraint_references(
        query_constraint_reference_params
    )

    for constraint_reference in query_constraint_reference.constraint_references:
        print("Deleting constraint reference: ",
              constraint_reference.id)

        if not constraint_reference.ovn:
            print("Skipping deletion, OVN not provided for constraint reference.")
            continue

        if not constraint_reference.id:
            print("Skipping deletion, ID not provided for constraint reference.")
            continue

        try:
            await dssConstraintService.delete_constraint_reference(
                entity_id=constraint_reference.id,
                ovn=constraint_reference.ovn
            )
        except Exception as e:
            print(
                f"Error deleting constraint reference {constraint_reference.id}: {e}")
            continue

    return Response(
        message="Constraints deleted successfully",
        data=coordinates,
    )
