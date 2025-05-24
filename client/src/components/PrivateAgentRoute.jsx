import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PrivateAgentRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  // Define agent-specific route prefixes
  const agentRoutePrefixes = ['/agent-dashboard', '/agent/appointments'];
  const isAgentRoute = agentRoutePrefixes.some(prefix => location.pathname.startsWith(prefix));

  // Public routes that don't require agent privileges
  if (!isAgentRoute) {
    return <Outlet />;
  }

  // Authentication check - if not logged in, redirect to sign-in
  if (!currentUser) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If user is admin, redirect them to admin dashboard
  if (currentUser.isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  // If not an agent (and not admin since we already checked), redirect to home
  if (!currentUser.isAgent) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // User is an agent and trying to access agent routes - allow access
  return <Outlet />;
}