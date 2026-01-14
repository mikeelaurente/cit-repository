import React from 'react';
import { Navigate } from 'react-router-dom';
import V9Gradient from './assets/images/V9.svg';
import { useAuth } from './AuthContext';

const AuthenticatedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 z-[60] min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-white" aria-hidden />
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: `url(${V9Gradient})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          aria-hidden
        />
        <div className="relative z-10 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="relative">
              <svg
                className="animate-spin h-12 w-12 text-purple-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-xl"></div>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent block">
                Loading...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const inAdmin = window.location.pathname.startsWith('/admin');
  if (inAdmin) {
    console.log('user', user);
    // Check if user is admin or staff, otherwise redirect to student dashboard
    if (user && (user.user.role === 'admin' || user.user.role === 'staff')) {
      return children;
    } else if (user) {
      return <Navigate to="/student/dashboard" replace />;
    } else {
      return <Navigate to="/admin/login" replace />;
    }
  } else {
    // if role is admin or staff, redirect to admin dashboard
    if (user && (user.user.role === 'admin' || user.user.role === 'staff')) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return user ? children : <Navigate to="/" replace />;
};

export default AuthenticatedRoute;
