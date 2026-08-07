import { useState } from 'react';
import { useAuth } from '../hooks/use-auth';

export function AuthStatus() {
  const { user, isAuthenticated } = useAuth();
  const [counter, setCounter] = useState(0);
  if (!isAuthenticated || !user) {
    return (
      <div>
        <p>Signed out</p>
        <button
          onClick={() => {
            setCounter(counter + 1);
          }}
        >
          Sign In {counter}
        </button>
      </div>
    );
  }

  return <p>Signed in as {user.email}</p>;
}
