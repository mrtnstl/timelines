import { useEffect, useState } from 'react';
import { Outlet, NavLink } from 'react-router';

export default function RootLayout() {
  const [backendHealth, setBackendHealth] = useState();
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/health`)
      .then((data) => data.json())
      .then((res) => setBackendHealth(res.message))
      .catch(console.log);
  }, []);
  return (
    <div className="w-screen h-screen bg-mauve-800 text-mauve-300">
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/editor">Editor</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/nonexistent">NF</NavLink>
        <a
          className={backendHealth === 'ok' ? 'text-green-300' : 'text-red-400'}
        >
          {backendHealth}
        </a>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
