import { Shield, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function RolesManagement() {
    const roles = [
        {
            name: 'Admin',
            description: 'Full access to all features and settings',
            users: 3,
            permissions: {
                viewCourses: true,
                createCourses: true,
                manageUsers: true,
                viewReports: true,
                manageCompany: true
            }
        },
        {
            name: 'Manager',
            description: 'Can manage team members and view reports',
            users: 12,
            permissions: {
                viewCourses: true,
                createCourses: false,
                manageUsers: true,
                viewReports: true,
                manageCompany: false
            }
        },
        {
            name: 'Employee',
            description: 'Standard access to training and profile',
            users: 1230,
            permissions: {
                viewCourses: true,
                createCourses: false,
                manageUsers: false,
                viewReports: false,
                manageCompany: false
            }
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Roles & Permissions</h2>
                    <p className="text-sm text-gray-500">Manage access levels for your team members.</p>
                </div>
                <Button>Create Custom Role</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((role) => (
                    <div key={role.name} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary-50 rounded-lg">
                                <Shield className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{role.name}</h3>
                                <p className="text-xs text-gray-500">{role.users} users</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-6 min-h-[40px]">{role.description}</p>

                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Permissions</h4>
                            <div className="space-y-2">
                                {Object.entries(role.permissions).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        {value ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <X className="w-4 h-4 text-gray-300" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button variant="outline" className="w-full mt-6">Edit Role</Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
