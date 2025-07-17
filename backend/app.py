from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from routes.fetch import router as FetchRouter


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
    try:
        return await call_next(request)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "message": "Internal Server Error",
                "data": str(e)},
        )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Operator router
app.include_router(FetchRouter, tags=[
                   "Fetch"], prefix="/fetch")
