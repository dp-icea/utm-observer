# backend-ec/routes/fetch.py

from http import HTTPStatus
from typing import List
from fastapi import APIRouter, Body
from pydantic import HttpUrl
from datetime import datetime
from pprint import pprint

from schemas.common.geo import Volume3D, Volume4D
from schemas.common.base import Time
from schemas.common.enums import TimeFormat
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
from services.dss.remoteid import DSSRemoteIDService
from services.uss.remoteid import USSRemoteIDService
from schemas.uss.common import OperationalIntent
from schemas.fetch import QueryVolumesResponse, QueryVolumesResponseData

from mock.flight_data import generate_flight_mock_data

router = APIRouter()


async def get_operational_intents_volume(
        operational_intent_references: List[OperationalIntentReference]
) -> List[OperationalIntent]:
    """
    Extracts the volumes from a list of operational intent references.
    """
    operational_intents: List[OperationalIntent] = []

    for operational_intent_reference in operational_intent_references:
        try:
            if not operational_intent_reference.uss_base_url:
                continue

            uss_operational_intents_service = USSOperationalIntentsService(
                base_url=HttpUrl(operational_intent_reference.uss_base_url),
            )

            if not operational_intent_reference.id:
                print(
                    f"Operational intent reference \
                    {operational_intent_reference.id} has no ID.")
                continue

            operational_intent_response = \
                await uss_operational_intents_service\
                .get_operational_intent_details(
                    operational_intent_reference.id
                )

            operational_intents.append(
                operational_intent_response.operational_intent)

        except Exception:
            print(
                f"Error fetching operational intent details: \
                {operational_intent_reference.id}")
            continue

    return operational_intents


async def get_constraints_volume(
        constraint_references: List[ConstraintReference]
) -> List[Constraint]:
    """
    Extracts the volumes from a list of constraint references.
    """
    constraints: List[Constraint] = []

    for constraint_reference in constraint_references:
        try:
            if not constraint_reference.uss_base_url:
                continue

            uss_constraints_service = USSConstraintsService(
                base_url=HttpUrl(constraint_reference.uss_base_url),
            )

            if not constraint_reference.id:
                print(
                    f"Constraint reference {constraint_reference.id} \
                    has no ID.")
                continue

            constraint_response = await uss_constraints_service\
                .get_constraint_details(constraint_reference.id)

            constraints.append(constraint_response.constraint)

        except Exception:
            print(f"Error fetching constraint details: \
            {constraint_reference.id}")
            continue

    return constraints


async def get_identification_service_areas_volume(
    service_areas: List[IdentificationServiceArea]
) -> List[IdentificationServiceAreaFull]:
    """
    Extracts the identification service areas from a list of service areas.
    """
    identification_service_areas: List[IdentificationServiceAreaFull] = []

    for service_area in service_areas:
        try:
            if not service_area.uss_base_url:
                continue

            uss_remoteid_service = USSRemoteIDService(
                base_url=HttpUrl(service_area.uss_base_url),
            )

            if not service_area.id:
                print(f"Service area {service_area.id} has no ID.")
                continue

            service_area_response = await uss_remoteid_service\
                .get_identification_service_area_details(service_area.id)

            identification_service_area = IdentificationServiceAreaFull(
                reference=service_area,
                details=IdentificationServiceAreaDetails(
                    volumes=[service_area_response.extents]
                ),
            )

            identification_service_areas.append(identification_service_area)

        except Exception as e:
            print(e)
            print(f"Error fetching service area details: {service_area.id}")
            continue

    return identification_service_areas


@router.post(
    "/",
    response_description="Query constraints and operational \
    intents existing in an area",
    response_model=Response,
    status_code=HTTPStatus.OK.value,
)
async def query_volumes(
    area_of_interest: Volume4D = Body(),
):
    dss_constraints_service = DSSConstraintsService()
    query_constraints = await dss_constraints_service\
        .query_constraint_references(
            QueryConstraintReferenceParameters.model_validate(
                {
                    "area_of_interest": area_of_interest,
                }
            )
        )

    constraints = await get_constraints_volume(
        query_constraints.constraint_references
    )

    dss_operational_intents_service = DSSOperationalIntentsService()
    query_operational_intents = await dss_operational_intents_service\
        .query_operational_intent_references(
            QueryOperationalIntentReferenceParameters.model_validate(
                {
                    "area_of_interest": area_of_interest,
                }
            )
        )

    operational_intents = await get_operational_intents_volume(
        query_operational_intents.operational_intent_references
    )

    identification_service_areas = []

    if "outline_polygon" in area_of_interest.volume.model_dump(mode="json"):
        dss_remoteid_service = DSSRemoteIDService()
        query_identification_service_areas = await dss_remoteid_service\
            .search_identification_service_areas(
                area=",".join(
                    [f"{vertice.lat},{vertice.lng}" for vertice in area_of_interest.volume.outline_polygon.vertices]),
                earliest_time=area_of_interest.time_start.value.isoformat(
                    'T').replace("+00:00", "") + 'Z',
                latest_time=area_of_interest.time_end.value.isoformat(
                    'T').replace("+00:00", "") + 'Z',
            )

        print("===== Querying identification service areas: =====")
        pprint(query_identification_service_areas)
        print("===================================================")

        identification_service_areas = await get_identification_service_areas_volume(
            query_identification_service_areas.service_areas
        )

    response_data = QueryVolumesResponseData(
        operational_intents=operational_intents,
        constraints=constraints,
        identification_service_areas=identification_service_areas,
    )

    print(response_data.model_dump(mode="json"))

    return QueryVolumesResponse(
        message="Query requested successfully",
        data=response_data,
    )


@router.post(
    "/flights",
    response_description="Query live flights",
    response_model=Response,
    status_code=HTTPStatus.OK.value,
)
async def query_flights(
        area: QueryFlightsRequest
):
    # flights_service = FlightsService()

    # res = await flights_service.query_flights(area)
    res = QueryFlightsResponse(
        flights=generate_flight_mock_data(),
        partial=False,
        errors=[],
        timestamp=Time(
            value=datetime.now(),
            format=TimeFormat.RFC3339,
        )
    )

    return Response(
        message="Live flight data requested",
        data=res,
    )
