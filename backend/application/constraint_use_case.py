# Application layer - use cases that orchestrate domain logic
from typing import List

from domain.base import LatLngPoint
from ports.constraint_port import ConstraintManagementPort


class ConstraintManagementUseCase:
    """Use case for managing constraints"""

    def __init__(
        self,
        constraint_management_port: ConstraintManagementPort,
    ):
        self.constraint_management_port = constraint_management_port

    async def create_constraint(self, constraint_data: dict):
        """Create a new constraint"""
        return await self.constraint_management_port.create_constraint(
            constraint_data
        )

    async def delete_constraints_in_area(self, coordinates: List[LatLngPoint]):
        """Delete all constraints in a given area"""
        pass
