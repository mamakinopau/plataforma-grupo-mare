import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Plus, Download, FileText, Trash2, Search, X, Upload } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useDataStore } from '../store/useDataStore';
import { Input } from '../components/ui/Input';

interface StudyMaterial {
    id: string;
    title: string;
    description: string;
    file_url: string;
    file_type: string;
    category: string;
    created_at: string;
    tenant_id?: string | null;
}

export function Library() {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const { tenants } = useDataStore();
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Upload Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadCategory, setUploadCategory] = useState('Geral');
    const [uploadTargetTenant, setUploadTargetTenant] = useState<string>('global'); // 'global' or tenant_id

    // Filter variables
    const filteredMaterials = materials.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const { data, error } = await supabase
                .from('study_materials')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMaterials(data || []);
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, fileUrl: string) => {
        if (!confirm('Tem a certeza que deseja apagar este documento?')) return;

        try {
            // 1. Delete from Storage
            const filePath = fileUrl.split('/').pop();
            if (filePath) {
                const { error: storageError } = await supabase.storage
                    .from('study-materials')
                    .remove([filePath]);

                if (storageError) console.error('Storage delete error:', storageError);
            }

            // 2. Delete from DB
            const { error } = await supabase
                .from('study_materials')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMaterials(materials.filter(m => m.id !== id));
        } catch (error: any) {
            console.error('Error deleting material:', error);
            alert('Erro ao apagar documento.');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setUploadFile(file);
            setUploadTitle(file.name.split('.')[0]); // Default title from filename
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile) return;

        setIsUploading(true);
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        try {
            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('study-materials')
                .upload(fileName, uploadFile);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('study-materials')
                .getPublicUrl(fileName);

            // 3. Determine Tenant ID
            let finalTenantId: string | null = null;

            if (user?.role === 'super_admin') {
                // Super Admin can choose
                finalTenantId = uploadTargetTenant === 'global' ? null : uploadTargetTenant;
            } else {
                // Others use their assigned tenant
                // We need to fetch it to be sure, OR rely on what we know. 
                // Best practice: fetch profile again to be unnecessary strict, OR assume user.tenantId is up to date (it should be)
                finalTenantId = user?.tenantId || null;

                // Safety check: if standard user has no tenant, they shouldn't be here basically
                if (!finalTenantId && user?.role !== 'super_admin') {
                    throw new Error('Erro: Utilizador sem restaurante associado.');
                }
            }

            // 4. Insert into DB
            const { data, error: dbError } = await supabase
                .from('study_materials')
                .insert({
                    title: uploadTitle,
                    description: '',
                    file_url: publicUrl,
                    file_type: fileExt || 'unknown',
                    category: uploadCategory,
                    tenant_id: finalTenantId
                })
                .select()
                .single();

            if (dbError) throw dbError;

            setMaterials([data, ...materials]);
            alert('Documento carregado com sucesso!');
            setIsUploadModalOpen(false);
            setUploadFile(null);
            setUploadTitle('');
        } catch (error: any) {
            console.error('Upload flow error:', error);
            const msg = error.message || 'Erro desconhecido';
            alert(`Erro ao fazer upload: ${msg}`);
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) return <div className="p-8">A carregar biblioteca...</div>;

    const isAdmin = ['super_admin', 'admin', 'manager'].includes(user?.role || '');
    const isSuperAdmin = user?.role === 'super_admin';

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Biblioteca</h1>
                    <p className="text-gray-500">Documentos e materiais de estudo.</p>
                </div>

                {isAdmin && (
                    <Button onClick={() => setIsUploadModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Documento
                    </Button>
                )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Pesquisar documentos..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMaterials.map((material) => (
                    <div key={material.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between group">
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex gap-2">
                                    {/* Badge for Global/Specific */}
                                    {material.tenant_id ? (
                                        <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full" title="Restaurante Específico">
                                            Restaurante
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-600 rounded-full" title="Visível para todos">
                                            Global
                                        </span>
                                    )}

                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(material.id, material.file_url)}
                                            className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Apagar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1 truncate" title={material.title}>
                                {material.title}
                            </h3>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-gray-500">{material.category}</span>
                            </div>
                        </div>

                        <a
                            href={material.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download / Visualizar
                        </a>
                    </div>
                ))}
            </div>

            {filteredMaterials.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    Nenhum documento encontrado.
                </div>
            )}

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Adicionar Documento</h3>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUploadSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ficheiro
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleFileSelect}
                                        required
                                    />
                                    {uploadFile ? (
                                        <div className="flex items-center justify-center text-primary-600">
                                            <FileText className="w-6 h-6 mr-2" />
                                            <span className="text-sm font-medium truncate max-w-[200px]">{uploadFile.name}</span>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">
                                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <span className="text-sm">Clique ou arraste um ficheiro</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título
                                </label>
                                <Input
                                    value={uploadTitle}
                                    onChange={(e) => setUploadTitle(e.target.value)}
                                    placeholder="Ex: Manual de Procedimentos"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoria
                                </label>
                                <select
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    value={uploadCategory}
                                    onChange={(e) => setUploadCategory(e.target.value)}
                                >
                                    <option value="Geral">Geral</option>
                                    <option value="Procedimentos">Procedimentos</option>
                                    <option value="Menus">Menus e Fichas Técnicas</option>
                                    <option value="Onboarding">Onboarding</option>
                                    <option value="HACCP">HACCP</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>

                            {/* Target Audience Selector (Super Admin Only) */}
                            {isSuperAdmin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Destinatário (Restaurante)
                                    </label>
                                    <select
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-indigo-50 border-indigo-200 text-indigo-900"
                                        value={uploadTargetTenant}
                                        onChange={(e) => setUploadTargetTenant(e.target.value)}
                                    >
                                        <option value="global" className="font-bold">🌍 Todos (Documento Global)</option>
                                        <optgroup label="Restaurantes Específicos">
                                            {tenants.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {uploadTargetTenant === 'global'
                                            ? 'Este documento será visível para TODOS os utilizadores de TODOS os restaurantes.'
                                            : 'Este documento será visível APENAS para os utilizadores deste restaurante.'}
                                    </p>
                                </div>
                            )}

                            <div className="pt-2">
                                <Button type="submit" className="w-full" disabled={isUploading || !uploadFile}>
                                    {isUploading ? 'A carregar...' : 'Adicionar Documento'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
