import os

from typing import Optional
from pydantic_settings import BaseSettings
from motor.motor_asyncio import AsyncIOMotorClient


class Settings(BaseSettings):
    BRUTM_KEY: Optional[str] = None
    BRUTM_BASE_URL: Optional[str] = None

    class Config:
        env_file = f".env.{os.getenv('ENV', 'dev')}"
        from_attributes = True
