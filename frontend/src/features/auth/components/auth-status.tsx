import { useAuth } from '../hooks/use-auth';

export function AuthStatus() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <p>Signed out</p>;
  }

  return <p>Signed in as {user.email}</p>;
}
