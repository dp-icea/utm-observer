from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

# Legacy routes (keeping for backward compatibility)
from routes.fetch import router as FetchRouter
from routes.constraint_management import router as ConstraintManagementRouter
from routes.health import router as HealthRouter

# New hexagonal architecture routes
from presentation.api.world_state import router as WorldStateRouter
from presentation.api.flights import router as FlightsRouter

from schemas.response import Response
from core.container import Container


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event for the FastAPI application.
    """
    # Initialize dependency injection container
    container = Container()
    app.container = container
    yield

app = FastAPI(
    title="UTM Observer API",
    description="BR-UTM Observer Backend Service for managing ecosystem \
interaction",
    version="2.0.0",
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
            content=Response(
                message="Internal Server Error",
                data=str(e),
            ).model_dump(mode="json")
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

# New hexagonal architecture routes
app.include_router(
    WorldStateRouter,
    tags=["World State"],
    prefix="/world-state",
)
app.include_router(
    FlightsRouter,
    tags=["Flights"],
    prefix="/flights",
)

# Legacy routes (keeping for backward compatibility)
app.include_router(
    FetchRouter,
    tags=["Fetch (Legacy)"],
    prefix="/fetch",
)
app.include_router(
    ConstraintManagementRouter,
    tags=["Constraint Management (Legacy)"],
    prefix="/constraint_management",
)
app.include_router(
    HealthRouter,
    tags=["Health (Legacy)"],
    prefix="/healthy",
)
