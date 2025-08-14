
from http import HTTPStatus
from fastapi import APIRouter

from schemas.api.common import ApiResponse

router = APIRouter()


@router.get(
    "/",
    response_model=ApiResponse,
    status_code=HTTPStatus.OK.value,
)
async def health_check():
    return ApiResponse(
        message="OK",
    )
