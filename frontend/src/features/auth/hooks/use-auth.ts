import { useEffect, useState } from 'react';

import { getAuthSession, refreshAccessToken } from '../api/auth-api';
import type { AuthSession } from '../types/auth';

export function useAuth() {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    accessToken: null,
    accessTokenExpiresAt: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    void getAuthSession().then(setSession);
  }, []);

  useEffect(() => {
    if (!session.accessTokenExpiresAt) {
      return;
    }

    const refreshBufferMs = 30_000;
    const msUntilRefresh =
      session.accessTokenExpiresAt - Date.now() - refreshBufferMs;

    const runRefresh = () => {
      void refreshAccessToken().then((refreshState) => {
        setSession((previousSession) => ({
          ...previousSession,
          ...refreshState,
          user: refreshState.isAuthenticated ? previousSession.user : null,
        }));
      });
    };

    if (msUntilRefresh <= 0) {
      runRefresh();
      return;
    }

    const timerId = window.setTimeout(runRefresh, msUntilRefresh);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [session.accessTokenExpiresAt]);

  return session;
}
