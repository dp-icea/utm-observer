from http import HTTPStatus
from uuid import uuid4, UUID
from typing import List
from fastapi import APIRouter, Body, HTTPException

from schemas.common.geo import Volume4D
from schemas.response import Response, ResponseError

router = APIRouter()


@router.post(
    "/",
    response_description="Query constraints and operational \
    intents existingi in an area",
    response_model=Response,
    status_code=HTTPStatus.OK.value,
)
async def query_volumes(
    area_of_interest: Volume4D = Body(...),
):
    print(area_of_interest)

    return Response(
        status=HTTPStatus.OK,
        data={},
    )
