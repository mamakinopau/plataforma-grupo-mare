import { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Trash2, Plus, X } from 'lucide-react';
import { Category } from '../../types';

export function CategoryManagement() {
    const { categories, addCategory, deleteCategory } = useDataStore();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = () => {
        if (!newCategoryName.trim()) return;

        const id = newCategoryName.toLowerCase().trim().replace(/\s+/g, '_');
        if (categories.find(c => c.id === id)) {
            alert('Esta categoria já existe.');
            return;
        }

        const newCat: Category = {
            id,
            name: newCategoryName.trim()
        };

        addCategory(newCat);
        setNewCategoryName('');
        setIsAdding(false);
    };

    return (
        <Card className="border-primary-100 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-lg font-bold">Gestão de Categorias</CardTitle>
                {!isAdding && (
                    <Button size="sm" onClick={() => setIsAdding(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Categoria
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {isAdding && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-dashed border-primary-200">
                        <input
                            type="text"
                            autoFocus
                            placeholder="Nome da categoria..."
                            className="flex-1 bg-white border rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <Button size="sm" onClick={handleAdd}>Confirmar</Button>
                        <Button size="sm" variant="ghost" className="text-gray-400" onClick={() => setIsAdding(false)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-3 bg-white border rounded-lg group hover:border-primary-300 transition-colors shadow-sm">
                            <span className="font-medium text-gray-700">{category.name}</span>
                            <button
                                onClick={() => deleteCategory(category.id)}
                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                title="Eliminar categoria"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
