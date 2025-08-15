import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; 

export default function AdminRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth(); 

  useEffect(() => {
    const adminEndpoints = ['/admin', '/cms', '/edit-mode', '/admin-panel'];
    const currentPath = location.pathname;

    const isAdminEndpoint = adminEndpoints.some(endpoint =>
      currentPath.endsWith(endpoint) || currentPath.includes(endpoint)
    );

    if (isAdminEndpoint && !isAuthenticated) {
      navigate('/admin-login');
    }
  }, [location.pathname, navigate, isAuthenticated]); 

  return null;
}
