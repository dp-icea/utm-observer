from abc import ABC, abstractmethod
from typing import TypeVar, Generic


# Base types for CQRS pattern
class Command:
    """Base class for commands (write operations)"""
    pass


class Query:
    """Base class for queries (read operations)"""
    pass


TCommand = TypeVar('TCommand', bound=Command)
TQuery = TypeVar('TQuery', bound=Query)
TResult = TypeVar('TResult')


class CommandHandler(ABC, Generic[TCommand, TResult]):
    """Base class for command handlers"""
    
    @abstractmethod
    async def handle(self, command: TCommand) -> TResult:
        pass


class QueryHandler(ABC, Generic[TQuery, TResult]):
    """Base class for query handlers"""
    
    @abstractmethod
    async def handle(self, query: TQuery) -> TResult:
        pass