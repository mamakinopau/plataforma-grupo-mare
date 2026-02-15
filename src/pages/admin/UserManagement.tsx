import { useState } from 'react';
import { UserPlus, Upload, Users, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { UserStats } from '../../components/team/UserStats';
import { UserFilters } from '../../components/team/UserFilters';
import { UserList } from '../../components/team/UserList';
import { AddUserModal } from '../../components/team/AddUserModal';
import { ImportUsersModal } from '../../components/team/ImportUsersModal';
import { UserProfile } from '../../components/team/UserProfile';
import { RolesManagement } from '../../components/team/RolesManagement';

export function UserManagement() {
    const { t } = useTranslation();
    const [view, setView] = useState<'list' | 'profile' | 'roles'>('list');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const handleUserClick = (userId: string) => {
        setSelectedUserId(userId);
        setView('profile');
    };

    const handleBackToList = () => {
        setSelectedUserId(null);
        setView('list');
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
                            <Button onClick={() => setIsAddModalOpen(true)}>
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
                    <UserFilters />
                    <UserList onUserClick={handleUserClick} />
                </>
            )}

            {view === 'profile' && selectedUserId && (
                <UserProfile userId={selectedUserId} onBack={handleBackToList} />
            )}

            {view === 'roles' && (
                <RolesManagement />
            )}

            {/* Modals */}
            <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <ImportUsersModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
        </div>
    );
}
