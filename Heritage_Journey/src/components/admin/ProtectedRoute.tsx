
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireEditor?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireEditor = false 
}: ProtectedRouteProps) => {
  const { user, profile, loading, isAdmin, isEditor } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  if (requireEditor && !isEditor) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
