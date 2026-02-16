import { useState } from 'react';
import { UserPlus, Upload, Users, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { UserStats } from '../../components/team/UserStats';
import { UserFilters } from '../../components/team/UserFilters';
import { UserList } from '../../components/team/UserList';
import { UserModal } from '../../components/team/UserModal';
import { ImportUsersModal } from '../../components/team/ImportUsersModal';
import { UserProfile } from '../../components/team/UserProfile';
import { RolesManagement } from '../../components/team/RolesManagement';
import { useDataStore } from '../../store/useDataStore';
import { User } from '../../types';

export function UserManagement() {
    const { t } = useTranslation();
    const [view, setView] = useState<'list' | 'profile' | 'roles'>('list');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // Modal states
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const { users, deleteUser } = useDataStore();

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTenant, setSelectedTenant] = useState('all');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Filter logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTenant = selectedTenant === 'all' || user.tenantId === selectedTenant;
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        const matchesStatus = selectedStatus === 'all' ||
            (selectedStatus === 'active' ? user.isActive : !user.isActive);

        return matchesSearch && matchesTenant && matchesRole && matchesStatus;
    });

    const handleUserClick = (userId: string) => {
        setSelectedUserId(userId);
        setView('profile');
    };

    const handleBackToList = () => {
        setSelectedUserId(null);
        setView('list');
    };

    const handleAddUser = () => {
        setSelectedUserForEdit(null);
        setIsUserModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUserForEdit(user);
        setIsUserModalOpen(true);
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await deleteUser(userId);
        } catch (error) {
            alert('Erro ao apagar utilizador. Por favor tente novamente.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('team.title')}</h1>
                    <p className="text-gray-500">{t('team.subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    {view === 'list' && (
                        <>
                            <Button variant="outline" onClick={() => setView('roles')}>
                                <Shield className="w-4 h-4 mr-2" />
                                {t('team.actions.manageRoles')}
                            </Button>
                            <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
                                <Upload className="w-4 h-4 mr-2" />
                                {t('team.actions.importCsv')}
                            </Button>
                            <Button onClick={handleAddUser}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                {t('team.actions.addUser')}
                            </Button>
                        </>
                    )}
                    {view === 'roles' && (
                        <Button variant="outline" onClick={() => setView('list')}>
                            <Users className="w-4 h-4 mr-2" />
                            {t('team.actions.backToUsers')}
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            {view === 'list' && (
                <>
                    <UserStats />
                    <UserFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        selectedTenant={selectedTenant}
                        onTenantChange={setSelectedTenant}
                        selectedRole={selectedRole}
                        onRoleChange={setSelectedRole}
                        selectedStatus={selectedStatus}
                        onStatusChange={setSelectedStatus}
                    />
                    <UserList
                        users={filteredUsers}
                        onUserClick={handleUserClick}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                    />
                </>
            )}

            {view === 'profile' && selectedUserId && (
                <UserProfile userId={selectedUserId} onBack={handleBackToList} />
            )}

            {view === 'roles' && (
                <RolesManagement />
            )}

            {/* Modals */}
            <UserModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                user={selectedUserForEdit}
            />

            <ImportUsersModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
            />
        </div>
    );
}
