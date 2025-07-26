# backend-ec/routes/fetch.py

from http import HTTPStatus
from typing import List
from fastapi import APIRouter, Body
from pydantic import HttpUrl
from datetime import datetime

from schemas.common.geo import Volume4D
from schemas.common.base import Time
from schemas.common.enums import TimeFormat
from schemas.dss.common import ConstraintReference, OperationalIntentReference
from schemas.dss.constraints import QueryConstraintReferenceParameters
from schemas.dss.operational_intents import QueryOperationalIntentReferenceParameters
from schemas.flights import QueryFlightsRequest, QueryFlightsResponse
from schemas.response import Response
from schemas.uss.constraints import Constraint
from services.dss.constraints import DSSConstraintsService
from services.dss.operational_intents import DSSOperationalIntentsService
from services.uss.operational_intents import USSOperationalIntentsService
from services.uss.constraints import USSConstraintsService
from services.flights import FlightsService
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


    response_data = QueryVolumesResponseData(
        operational_intents=operational_intents,
        constraints=constraints
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
    flights_service = FlightsService()

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

