import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute component:
 * Guarantees that only authenticated users with a valid token & user record
 * can access protected views (e.g. /userDashboard, /vendor, /SuperAdmin).
 * Redirects unauthenticated guests to /login while preserving their intended destination.
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();

  const token = localStorage.getItem('token') || localStorage.getItem('jos_pulse_token');
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();

  // 1. If not logged in, redirect to /login with state notice and intended path
  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: 'Please log in to access this page.',
        }}
      />
    );
  }

  // 2. If specific roles are required (e.g. vendor or admin)
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If unauthorized for this specific dashboard, redirect to general userDashboard
    return <Navigate to="/userDashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
