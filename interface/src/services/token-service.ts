import axios from "axios";

interface TokenResponse {
  access_token: string;
}

interface DecodedToken {
  exp: number; // Expiration time in seconds since epoch
  aud: string; // Audience of the token
  scope: string; // Scope of the token
  iss: string; // Issuer of the token
  sub: string; // Subject of the token
}

/**
 * A singleton service to manage API tokens.
 * It caches JWTs and fetches new ones when they expire.
 */
class TokenService {
  private tokenCache: Map<string, { token: string; expiresAt: number }> =
    new Map();
  private tokenApiUrl =
    `${import.meta.env.VITE_BRUTM_BASE_URL}/token` ||
    "http://api.dev.br-utm.org/token";
  private apiKey = process.env.VITE_BRUTM_API_KEY || "brutm";

  /**
   * Decodes a JWT token to extract its payload without verifying the signature.
   * @param token The JWT token.
   * @returns The decoded payload or null if decoding fails.
   */
  private decodeToken(token: string): DecodedToken | null {
    try {
      const payloadBase64 = token.split(".")[1];
      if (!payloadBase64) return null;
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson) as DecodedToken;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  }

  /**
   * Fetches a new token from the authentication endpoint.
   * @param audience The intended audience for the token.
   * @param scope The requested scope for the token.
   * @returns A promise that resolves to the new token string.
   */
  private async fetchNewToken(
    audience: string,
    scope: string,
  ): Promise<string> {
    try {
      console.log(this.apiKey);
      const response = await axios.get<TokenResponse>(this.tokenApiUrl, {
        params: {
          intended_audience: audience,
          scope: scope,
          apikey: this.apiKey,
        },
      });

      const { access_token } = response.data;
      const decoded = this.decodeToken(access_token);

      if (decoded && decoded.exp) {
        const key = `${audience}:${scope}`;
        // Store the token and its expiration time (in milliseconds)
        this.tokenCache.set(key, {
          token: access_token,
          expiresAt: decoded.exp * 1000,
        });
      }

      return access_token;
    } catch (error) {
      console.error("Failed to fetch new token:", error);
      throw new Error("Could not fetch a new token.");
    }
  }

  /**
   * Retrieves a token for a given audience and scope.
   * It uses a cached token if available and valid, otherwise fetches a new one.
   * @param audience The intended audience (e.g., 'core-service' or a USS domain).
   * @param scope The operation scope (e.g., 'utm.strategic_coordination').
   * @param forceRefresh If true, a new token will be fetched even if a valid one exists in the cache.
   * @returns A promise that resolves to a valid token.
   */
  public async getToken(
    audience: string,
    scope: string,
    forceRefresh: boolean = false,
  ): Promise<string> {
    const key = `${audience}:${scope}`;
    const cachedEntry = this.tokenCache.get(key);

    // Check if a valid, non-expired token is already in the cache
    if (cachedEntry && !forceRefresh && cachedEntry.expiresAt > Date.now()) {
      return cachedEntry.token;
    }

    // If no valid cached token exists, fetch a new one
    return this.fetchNewToken(audience, scope);
  }
}

// Export a singleton instance of the service
export const tokenService = new TokenService();
