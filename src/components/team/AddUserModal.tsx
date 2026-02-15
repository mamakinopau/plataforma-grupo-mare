import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { useDataStore } from '../../store/useDataStore';
import { UserRole } from '../../types';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
    const { t } = useTranslation();
    const { tenants, addUser } = useDataStore();

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('employee');
    const [tenantId, setTenantId] = useState('');
    const [position, setPosition] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !tenantId) {
            alert('Por favor preencha todos os campos obrigatórios.');
            return;
        }

        addUser({
            id: Math.random().toString(36).substr(2, 9),
            name: `${firstName} ${lastName}`,
            email,
            role,
            tenantId,
            position,
            isActive: true,
            joinedAt: new Date().toISOString().split('T')[0],
            onboardingCompleted: false,
            preferences: {
                emailNotifications: true,
                pushNotifications: false,
                marketingEmails: false
            }
        });

        alert('Usuário criado com sucesso!');
        onClose();

        // Reset form
        setFirstName('');
        setLastName('');
        setEmail('');
        setTenantId('');
        setPosition('');
    };

    const restaurantOptions = tenants.map(t => ({
        value: t.id,
        label: t.name
    }));

    const roleOptions = [
        { value: 'employee', label: 'Empregado' },
        { value: 'manager', label: 'Gerente' },
        { value: 'admin', label: 'Administrador' }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('team.actions.addUser')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Primeiro Nome"
                        placeholder="Ex: João"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <Input
                        label="Apelido"
                        placeholder="Ex: Silva"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <Input
                    label="Email"
                    type="email"
                    placeholder="joao.silva@grupomare.pt"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Nível de Acesso"
                        options={roleOptions}
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                    />
                    <Select
                        label="Restaurante"
                        options={restaurantOptions}
                        value={tenantId}
                        onChange={(e) => setTenantId(e.target.value)}
                    />
                </div>

                <Input
                    label="Cargo / Posição"
                    placeholder="Ex: Empregado de Mesa"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                />

                <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                        Enviar email de boas-vindas
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                        Atribuir formação obrigatória automaticamente
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Criar Usuário</Button>
                </div>
            </form>
        </Modal>
    );
}
