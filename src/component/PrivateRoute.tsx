import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const token = localStorage.getItem('token');
  // Optionally, add more checks (e.g., token expiry)
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
