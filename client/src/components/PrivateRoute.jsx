import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  // Skip redirection if we're trying to access profile
  if (location.pathname === '/profile') {
    return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
  }

  // Default redirection logic for other routes
  if (!currentUser) return <Navigate to="/sign-in" />;
  
  if (currentUser.isAdmin) {
    return location.pathname.startsWith('/admin') ? <Outlet /> : <Navigate to="/admin" />;
  } else if (currentUser.isAgent) {
    return location.pathname.startsWith('/agent-dashboard') ? <Outlet /> : <Navigate to="/agent-dashboard" />;
  }

  return <Outlet />;
}