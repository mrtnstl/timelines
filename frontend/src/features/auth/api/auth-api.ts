import type { AccessTokenRefresh, AuthSession } from '../types/auth';

export function getAuthSession(): Promise<AuthSession> {
  return Promise.resolve({
    user: null,
    accessToken: null,
    accessTokenExpiresAt: null,
    isAuthenticated: false,
  });
}

export function refreshAccessToken(): Promise<AccessTokenRefresh> {
  // The refresh token is HttpOnly and never exposed to JavaScript.
  // This call should hit an endpoint that reads the cookie and returns
  // a new short-lived access token payload.
  return Promise.resolve({
    accessToken: null,
    accessTokenExpiresAt: null,
    isAuthenticated: false,
  });
}
