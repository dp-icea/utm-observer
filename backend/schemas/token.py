# schemas/token.py

from pydantic import BaseModel


class TokenResponse(BaseModel):
    """
    Represents the structure of the access token response.
    """
    access_token: str


class DecodedTokenPayload(BaseModel):
    """
    Represents the decoded payload of the JWT.
    """
    aud: str
    exp: int
    iss: str
    scope: str
    sub: str
