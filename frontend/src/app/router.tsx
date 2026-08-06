import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import TimelineViewer from './pages/TimelineViewer';
import TimelineEditor from './pages/TimelineEditor';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'timeline/:public_id?', element: <TimelineViewer /> },
      { path: 'editor/:id?', element: <TimelineEditor /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
