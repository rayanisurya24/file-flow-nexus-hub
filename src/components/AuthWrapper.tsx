
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthWrapper = ({ children, requireAuth = false }: AuthWrapperProps) => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoaded) return;

    if (requireAuth && !user) {
      // If auth is required but user is not signed in, redirect to home
      navigate('/');
    } else if (!requireAuth && user && location.pathname === '/') {
      // If user is signed in and on home page, redirect to dashboard
      navigate('/dashboard');
    }
  }, [user, isLoaded, requireAuth, navigate, location.pathname]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default AuthWrapper;
