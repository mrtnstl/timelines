import { useEffect, useState } from 'react';
import { Outlet, NavLink } from 'react-router';
import { MdMenu, MdPublic, MdPublicOff } from 'react-icons/md';

export default function RootLayout() {
  const [backendHealth, setBackendHealth] = useState();
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/health`)
      .then((data) => data.json())
      .then((res) => setBackendHealth(res.message))
      .catch(console.log);
  }, []);
  return (
    <div className="flex flex-col w-screen h-screen bg-gray-950 text-gray-500">
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/editor/create">Editor</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/nonexistent">NF</NavLink>
        <a>
          {backendHealth === 'ok' ? (
            <MdPublic className="text-green-400" />
          ) : (
            <MdPublicOff className="text-red-400" />
          )}
        </a>
        <button>
          <MdMenu />
        </button>
      </nav>
      <main className="flex-1 bg-slate-950">
        <Outlet />
      </main>
      <footer className=" w-screen h-11 bg-emerald-950 text-gray-500">
        hello, world!
      </footer>
    </div>
  );
}
