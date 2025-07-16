import httpx
import jwt
from typing import Any
from http import HTTPStatus
from fastapi import HTTPException
from datetime import datetime
from threading import Lock
from config.config import Settings
from schemas.common.enums import Authority
from schemas.response import ResponseError


class AuthAsyncClient(httpx.AsyncClient):
    """
    Custom HTTP client for authentication.
    """

    def __init__(self, aud: str, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self._aud = aud

    async def request(self, method: str, url: httpx.URL | str, **kwargs: Any) -> httpx.Response:
        scope = kwargs.pop("scope", None)

        if scope is None:
            raise ValueError(
                "Authority must be provided in the request for authentication.")

        try:
            res = await super().request(
                method,
                url,
                auth=ServiceTokenMiddleware(
                    aud=self._aud,
                    scope=scope
                ),
                **kwargs
            )

            return res
        except ConnectionRefusedError as e:
            raise HTTPException(
                status_code=HTTPStatus.SERVICE_UNAVAILABLE.value,
                detail=ResponseError(
                    message="Connection refused. The service might be down.",
                    data=str(e),
                ).model_dump(mode="json"),
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR.value,
                detail=ResponseError(
                    message="Request error occurred.",
                    data=str(e),
                ).model_dump(mode="json"),
            )


class ServiceTokenMiddleware(httpx.Auth):
    def __init__(self, aud: str, scope: Authority) -> None:
        self._aud = aud
        self._scope = scope

    def sync_auth_flow(self, request: httpx.Request):
        raise RuntimeError(
            "This middleware is designed for asynchronous use only. Use async_auth_flow instead.")

    async def async_auth_flow(self, request: httpx.Request):
        auth = AuthService.get_instance()
        token = await auth.get_token(aud=self._aud, scope=self._scope)
        request.headers["Authorization"] = f"Bearer {token}"
        response = yield request
        if response.status_code in (HTTPStatus.UNAUTHORIZED, HTTPStatus.FORBIDDEN):
            await auth.refresh_token(aud=self._aud, scope=self._scope)
            token = auth.get_token(aud=self._aud, scope=self._scope)
            request.headers["Authorization"] = f"Bearer {token}"
            yield request


class AuthService:
    _instance = None
    _lock = Lock()

    def __init__(self):
        settings = Settings()

        self._tokens = {}
        self._base_url = settings.BRUTM_BASE_URL
        self._auth_key = settings.BRUTM_KEY

        if not self._base_url or not self._auth_key:
            raise ValueError(
                "AUTH_URL and AUTH_KEY must be set in the environment variables.")

        self._client = httpx.AsyncClient(base_url=self._base_url)

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    async def get_token(self, aud: str, scope: Authority = Authority.CONSTRAINT_PROCESSING) -> str:
        if aud not in self._tokens or scope not in self._tokens[aud] or not self._is_token_valid(self._tokens[aud][scope]):
            await self.refresh_token(aud=aud, scope=scope)

        return self._tokens[aud][scope]

    async def refresh_token(self, aud: str, scope: Authority = Authority.CONSTRAINT_PROCESSING):
        params = {
            "intended_audience": aud,
            "scope": scope.value,
            "apikey": self._auth_key,
        }

        response = await self._client.get(
            "/token",
            params=params,
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=ResponseError(
                    message="Error getting DSS token.",
                    data=response.json() if response.content else None,
                ).model_dump(mode="json"),
            )

        if aud not in self._tokens:
            self._tokens[aud] = {}

        self._tokens[aud][scope] = response.json().get("access_token")

    def _is_token_valid(self, token: str) -> bool:
        payload = jwt.decode(token, options={"verify_signature": False})
        exp = payload.get("exp", None)
        if exp is None:
            return False
        exp = datetime.fromtimestamp(exp)
        now = datetime.now()

        if exp >= now:
            return True

        return False
