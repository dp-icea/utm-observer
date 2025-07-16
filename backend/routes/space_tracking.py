from http import HTTPStatus
from uuid import uuid4, UUID
from typing import Any, List
from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel, Field
from pprint import pprint

from schemas.common.geo import Volume4D
from schemas.dss.constraints import QueryConstraintReferenceParameters
from schemas.response import Response, ResponseError
from services.dss.constraints import DSSConstraintsService

router = APIRouter()


@router.post(
    "/",
    response_description="Query constraints and operational \
    intents existingi in an area",
    response_model=Response,
    status_code=HTTPStatus.OK.value,
)
async def query_volumes(
    area_of_interest: Volume4D = Body(),
):
    pprint(area_of_interest.model_dump(mode="json"))

    dss_constraints_service = DSSConstraintsService()

    payload = QueryConstraintReferenceParameters.model_validate({
        "area_of_interest": area_of_interest,
    })
    const_refs = await dss_constraints_service.query_constraint_references(payload)

    print(const_refs.model_dump(mode="json"))

    return Response(
        status=HTTPStatus.OK,
        data={},
    )
