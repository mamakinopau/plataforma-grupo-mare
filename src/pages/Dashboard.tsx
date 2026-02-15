import { useAuthStore } from '../store/useAuthStore';
import { EmployeeDashboard } from '../components/dashboard/EmployeeDashboard';
import { ManagerDashboard } from '../components/dashboard/ManagerDashboard';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';

export function Dashboard() {
    const { user } = useAuthStore();

    if (!user) return <div>Please log in</div>;

    // Render dashboard based on user role
    switch (user.role) {
        case 'admin':
            return <AdminDashboard />;
        case 'manager':
            return <ManagerDashboard />;
        case 'employee':
        default:
            return <EmployeeDashboard />;
    }
}
