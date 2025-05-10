import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

export default function PrivateAgentRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  // For view-only access, we allow anyone to view the content
  // No role checking required for viewing
  
  useEffect(() => {
    // If an agent or admin logs in, directly navigate them to the dashboard
    if (currentUser && (currentUser.isAgent || currentUser.isAdmin)) {
      // Only redirect if we're not already on the dashboard
      // This prevents infinite redirection loops
      if (!window.location.pathname.includes('/agent')) {
        navigate('/agent');
      }
    }
  }, [currentUser, navigate]);

  // Always allow access for view-only mode, no redirection to sign-in
  return <Outlet />;
}