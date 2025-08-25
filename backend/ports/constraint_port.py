# Ports - interfaces for external data sources
from abc import ABC, abstractmethod

from domain.external.dss.constraints import ChangeConstraintReferenceResponse


class ConstraintManagementPort(ABC):
    """Port for managing constraints"""

    @abstractmethod
    async def create_constraint(self, constraint_data: dict) -> None:
        pass

    @abstractmethod
    async def delete_constraint(
        self, constraint_id: str, ovn: str
    ) -> ChangeConstraintReferenceResponse:
        pass
