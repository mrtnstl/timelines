import { Outlet, Link } from 'react-router';

export default function RootLayout() {
  return (
    <div className="w-screen h-screen bg-mauve-800 text-mauve-300">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/editor">Editor</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/nonexistent">NF</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
