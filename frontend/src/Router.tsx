import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard.page';
import { AuthenticationForm } from './pages/Login.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthenticationForm />,
  },

  {
    path: '/dashboard',
    element: <Dashboard />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
