import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If not loading and no user, redirect to login
        if (!loading && !user) {
            navigate('/login', { state: { from: window.location.pathname } });
        }

        // If user exists but wrong role, redirect to dashboard
        if (!loading && user && allowedRoles && profile) {
            if (!allowedRoles.includes(profile.role)) {
                navigate('/dashboard');
            }
        }
    }, [user, profile, loading, allowedRoles, navigate]);

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-blue mx-auto mb-4" />
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Only render children if user is authenticated and has correct role
    return user ? <>{children}</> : null;
}
