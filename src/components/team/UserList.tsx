import { useState } from 'react';
import { MoreVertical, Mail, Ban, Trash2, Edit, Award, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useDataStore } from '../../store/useDataStore';

import { User } from '../../types';

interface UserListProps {
    users: User[];
    onUserClick: (userId: string) => void;
}

export function UserList({ users, onUserClick }: UserListProps) {
    const { tenants, progress, courses } = useDataStore();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const toggleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(u => u.id));
        }
    };

    const toggleSelectUser = (id: string) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'super_admin': return 'bg-purple-100 text-purple-800';
            case 'admin': return 'bg-blue-100 text-blue-800';
            case 'manager': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</Badge>;
            case 'inactive':
                return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Inactive</Badge>;
            case 'pending':
                return <Badge variant="warning" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {selectedUsers.length > 0 && (
                <div className="bg-primary-50 p-4 flex items-center justify-between border-b border-primary-100">
                    <span className="text-sm font-medium text-primary-900">
                        {selectedUsers.length} users selected
                    </span>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300">
                            <Award className="w-4 h-4 mr-2" />
                            Assign Training
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300">
                            <Ban className="w-4 h-4 mr-2" />
                            Deactivate
                        </Button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 w-4">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    checked={users.length > 0 && selectedUsers.length === users.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-3 font-medium text-gray-500">User</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Role</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Restaurant</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Progress</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => {
                            const userProgress = progress.filter(p => p.userId === user.id);
                            const assignedCourses = courses.filter(c =>
                                c.targetRoles.includes(user.role as any) || c.isMandatory
                            ).length;
                            const completedCount = userProgress.filter(p => p.status === 'completed').length;
                            const progressPercentage = assignedCourses > 0 ? Math.round((completedCount / assignedCourses) * 100) : 0;

                            return (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => toggleSelectUser(user.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onUserClick(user.id)}>
                                            <img
                                                src={user.avatarUrl}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {tenants.find(t => t.id === user.tenantId)?.name || 'Restaurante'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full max-w-[140px]">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-600">{completedCount}/{assignedCourses}</span>
                                                <span className="font-medium text-gray-900">
                                                    {progressPercentage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-primary-600 h-1.5 rounded-full"
                                                    style={{ width: `${progressPercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(user.isActive ? 'active' : 'inactive')}
                                        <p className="text-xs text-gray-400 mt-1">Joined {new Date(user.joinedAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{users.length}</span> of <span className="font-medium">{users.length}</span> results
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            </div>
        </div>
    );
}
