import React from 'react';
import {
  Navigate,
  Outlet,
  createBrowserRouter,
} from 'react-router-dom';
import App from '@/App';
import access from '@/access';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import BasicLayout from '@/layouts/BasicLayout';
import Admin from '@/pages/Admin';
import Exception403 from '@/pages/exception/403';
import Exception404 from '@/pages/exception/404';
import Login from '@/pages/user/login';
import Welcome from '@/pages/Welcome';

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  if (!access({ currentUser }).canAdmin) {
    return <Exception403 />;
  }
  return children;
}

function RootLayout() {
  return (
    <App>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </App>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'user/login',
        element: <Login />,
      },
      {
        element: <BasicLayout />,
        children: [
          { index: true, element: <Navigate to="/welcome" replace /> },
          { path: 'welcome', element: <Welcome /> },
          {
            path: 'admin',
            element: (
              <RequireAdmin>
                <Navigate to="/admin/sub-page" replace />
              </RequireAdmin>
            ),
          },
          {
            path: 'admin/sub-page',
            element: (
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            ),
          },
          { path: '*', element: <Exception404 /> },
        ],
      },
    ],
  },
]);
