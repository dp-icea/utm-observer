# Constraint management routes with hexagonal architecture
from http import HTTPStatus
from typing import List, Any
from fastapi import APIRouter, Body, Depends

from application.constraint_use_case import ConstraintManagementUseCase
from adapters.constraint_management_adapter import ConstraintManagementAdapter
from adapters.dss_adapter import DSSAdapter
from domain.base import LatLngPoint
from schemas.api import ApiResponse, ApiException

router = APIRouter()


def get_constraint_management_use_case() -> ConstraintManagementUseCase:
    """Dependency injection for constraint management use case"""
    constraint_adapter = ConstraintManagementAdapter()

    return ConstraintManagementUseCase(
        constraint_management_port=constraint_adapter,
    )


@router.post(
    "/create",
    response_description="Create a new airspace constraint",
    response_model=ApiResponse,
    status_code=HTTPStatus.OK.value,
)
async def create_constraint(
    constraint_data: Any = Body(),
    use_case: ConstraintManagementUseCase = Depends(
        get_constraint_management_use_case
    ),
):
    """Create a new constraint (no-fly zone, restriction) in the airspace"""
    result = await use_case.create_constraint(constraint_data)

    return ApiResponse(
        message="Constraint created successfully",
        data=result,
    )


@router.delete(
    "/delete-in-area",
    response_description="Delete constraints in a specified area",
    response_model=ApiResponse,
    status_code=HTTPStatus.OK.value,
)
async def delete_constraints_in_area(
    coordinates: List[LatLngPoint] = Body(),
    use_case: ConstraintManagementUseCase = Depends(
        get_constraint_management_use_case
    ),
):
    """Delete all constraints within the specified geographical area"""

    raise ApiException(
        status_code=HTTPStatus.NOT_IMPLEMENTED.value,
        message="Delete constraints in area not implemented",
    )
