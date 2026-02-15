import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { useDataStore } from './store/useDataStore';

import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { CourseEditor } from './pages/admin/CourseEditor';
import { Profile } from './pages/Profile';
import { Leaderboard } from './pages/Leaderboard';
import { UserManagement } from './pages/admin/UserManagement';
import { Announcements } from './pages/admin/Announcements';
import { TenantManagement } from './pages/admin/TenantManagement';
import { Help } from './pages/Help';
import { Settings } from './pages/Settings';
import { Reports } from './pages/Reports';
import { BrandingProvider } from './components/layout/BrandingProvider';



import { UserRole } from './types';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const initializeData = useDataStore((state) => state.initialize);

    useEffect(() => {
        if (isAuthenticated) {
            initializeData();
        }
    }, [isAuthenticated, initializeData]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}

function RoleBasedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: UserRole[] }) {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

function App() {
    const { checkSession, isLoading } = useAuthStore();

    useEffect(() => {
        checkSession();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <BrandingProvider>
                            <Layout />
                        </BrandingProvider>
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="courses/:courseId" element={<CourseDetail />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="leaderboard" element={<Leaderboard />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="help" element={<Help />} />



                    {/* Admin Routes */}
                    <Route path="admin/users" element={
                        <RoleBasedRoute allowedRoles={['admin', 'manager']}>
                            <UserManagement />
                        </RoleBasedRoute>
                    } />
                    <Route path="admin/announcements" element={
                        <RoleBasedRoute allowedRoles={['admin', 'manager']}>
                            <Announcements />
                        </RoleBasedRoute>
                    } />
                    <Route path="admin/tenants" element={
                        <RoleBasedRoute allowedRoles={['admin']}>
                            <TenantManagement />
                        </RoleBasedRoute>
                    } />
                    <Route path="admin/courses/new" element={
                        <RoleBasedRoute allowedRoles={['admin', 'manager']}>
                            <CourseEditor />
                        </RoleBasedRoute>
                    } />
                    <Route path="admin/courses/:courseId/edit" element={
                        <RoleBasedRoute allowedRoles={['admin', 'manager']}>
                            <CourseEditor />
                        </RoleBasedRoute>
                    } />

                    <Route path="*" element={<div className="p-8">Page not found</div>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
