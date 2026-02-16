import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { useDataStore } from '../../store/useDataStore';
import { User, UserRole } from '../../types';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: User | null;
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
    const { t } = useTranslation();
    const { tenants, addUser, updateUser } = useDataStore();

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('employee');
    const [tenantId, setTenantId] = useState('');
    const [position, setPosition] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    // Populate form when user prop changes
    useEffect(() => {
        if (user) {
            const [first, ...last] = user.name.split(' ');
            setFirstName(first);
            setLastName(last.join(' '));
            setEmail(user.email);
            setRole(user.role as UserRole);
            setTenantId(user.tenantId || '');
            setPosition(user.position || '');
        } else {
            // Reset for add mode
            setFirstName('');
            setLastName('');
            setEmail('');
            setRole('employee');
            setTenantId('');
            setPosition('');
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName) { alert('Por favor preencha o Primeiro Nome.'); return; }
        if (!lastName) { alert('Por favor preencha o Apelido.'); return; }
        if (!email) { alert('Por favor preencha o Email.'); return; }
        if (!tenantId) { alert('Por favor selecione um Restaurante.'); return; }

        setIsLoading(true);

        try {
            if (user) {
                // Update existing user
                await updateUser(user.id, {
                    name: `${firstName} ${lastName}`,
                    email, // Note: changing email usually requires auth verification, but we'll try updating profile
                    role,
                    tenantId,
                    position
                });
                alert('Utilizador atualizado com sucesso!');
            } else {
                // Add new user
                await addUser({
                    id: '', // Server assigned
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
                alert('Utilizador criado com sucesso! A password temporária é: TempPassword123!');
            }
            onClose();
        } catch (error) {
            alert(`Erro ao ${user ? 'atualizar' : 'criar'} utilizador: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const restaurantOptions = [
        { value: '', label: 'Selecione um restaurante...' },
        ...tenants.map(t => ({
            value: t.id,
            label: t.name
        }))
    ];

    const roleOptions = [
        { value: 'employee', label: 'Empregado' },
        { value: 'manager', label: 'Gerente' },
        { value: 'admin', label: 'Administrador' }
    ];

    const title = user ? t('team.actions.editUser', 'Editar Utilizador') : t('team.actions.addUser');
    const submitText = isLoading ? 'A processar...' : (user ? 'Guardar Alterações' : 'Criar Utilizador');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
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
                    disabled={!!user} // Disable email edit for now to avoid auth complexity
                />
                {user && <p className="text-xs text-gray-400 -mt-3">O email não pode ser alterado aqui.</p>}

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

                {!user && (
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
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Cancelar</Button>
                    <Button type="submit" disabled={isLoading}>{submitText}</Button>
                </div>
            </form>
        </Modal>
    );
}
