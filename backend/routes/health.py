
from http import HTTPStatus
from fastapi import APIRouter
from schemas.response import Response

router = APIRouter()


@router.get(
    "/",
    response_model=Response,
    status_code=HTTPStatus.OK.value,
)
async def health_check():
    return Response(
        message="OK",
    )
