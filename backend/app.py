from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from routes.fetch import router as FetchRouter
from routes.constraint_management import router as ConstraintManagementRouter

from schemas.response import Response


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
)


@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    # await call_next(request)
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(FetchRouter, tags=[
                   "Fetch"], prefix="/fetch")
app.include_router(ConstraintManagementRouter, tags=[
                   "Constraint Management"], prefix="/constraint_management")
