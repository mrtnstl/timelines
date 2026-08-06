export type UserRole = 'owner' | 'editor' | 'viewer';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthSession {
  user: AuthUser | null;
  accessToken: string | null;
  accessTokenExpiresAt: number | null;
  isAuthenticated: boolean;
}

export interface AccessTokenRefresh {
  accessToken: string | null;
  accessTokenExpiresAt: number | null;
  isAuthenticated: boolean;
}
