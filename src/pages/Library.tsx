import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Plus, Download, FileText, Trash2, Search } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Input } from '../components/ui/Input';

interface StudyMaterial {
    id: string;
    title: string;
    description: string;
    file_url: string;
    file_type: string;
    category: string;
    created_at: string;
}

export function Library() {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploading, setIsUploading] = useState(false);

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
            const filePath = fileUrl.split('/').pop(); // Simple extraction, might need adjustment based on URL structure
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
        } catch (error) {
            console.error('Error deleting material:', error);
            alert('Erro ao apagar documento.');
        }
    };

    // Temporary basic upload for MVP
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('study-materials')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('study-materials')
                .getPublicUrl(filePath);

            // 3. Fetch current user profile to ensure we have the correct tenant_id for RLS
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) throw new Error('User not found');

            const { data: profile } = await supabase
                .from('profiles')
                .select('tenant_id')
                .eq('id', authUser.id)
                .single();

            if (!profile?.tenant_id) throw new Error('Tenant ID not found for user');

            // 4. Insert into DB
            const { data, error: dbError } = await supabase
                .from('study_materials')
                .insert({
                    title: file.name, // Default title
                    description: '',
                    file_url: publicUrl,
                    file_type: fileExt || 'unknown',
                    category: 'Geral', // Default category
                    tenant_id: profile.tenant_id // Use fresh tenant_id from DB
                })
                .select()
                .single();

            if (dbError) throw dbError;

            setMaterials([data, ...materials]);
            alert('Documento carregado com sucesso!');
        } catch (error: any) {
            console.error('Upload error:', error);
            alert(`Erro ao carregar ficheiro: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) return <div className="p-8">A carregar biblioteca...</div>;

    const isAdmin = ['super_admin', 'admin', 'manager'].includes(user?.role || '');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Biblioteca</h1>
                    <p className="text-gray-500">Documentos e materiais de estudo.</p>
                </div>

                {isAdmin && (
                    <div className="flex items-center gap-2">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                                accept=".pdf,.doc,.docx,.txt"
                            />
                            <div className={`flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                                <Plus className="w-4 h-4 mr-2" />
                                {isUploading ? 'A carregar...' : 'Adicionar Documento'}
                            </div>
                        </label>
                    </div>
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
                    <div key={material.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDelete(material.id, material.file_url)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1 truncate" title={material.title}>
                                {material.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">{material.category}</p>
                        </div>

                        <a
                            href={material.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
        </div>
    );
}
