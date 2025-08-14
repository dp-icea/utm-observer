from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from routes.airspace import router as AirspaceRouter
from routes.constraints import router as ConstraintsRouter
from routes.health import router as HealthRouter
from schemas.api.common import ApiResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event for the FastAPI application.
    """
    yield


app = FastAPI(
    title="UTM Observer API",
    description="BR-UTM Observer Backend Service for managing for ecosystem interaction",
    version="1.0.0",
    lifespan=lifespan,
    root_path="/api",
)


@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content=ApiResponse(
                message=str(e)
            ).model_dump(mode="json"),
        )


origins = [
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(AirspaceRouter, tags=["Airspace"], prefix="/airspace")
app.include_router(
    ConstraintsRouter, tags=["Constraints"], prefix="/constraints"
)
app.include_router(HealthRouter, tags=["Health"], prefix="/healthy")
