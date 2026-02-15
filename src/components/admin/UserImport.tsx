import { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface UserImportProps {
    onClose: () => void;
    onImport: (users: any[]) => void;
}

export function UserImport({ onClose, onImport }: UserImportProps) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv') {
                setError('Please upload a valid CSV file.');
                return;
            }
            setFile(selectedFile);
            setError(null);
            parseCSV(selectedFile);
        }
    };

    const parseCSV = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());

            const users = lines.slice(1).filter(line => line.trim()).map(line => {
                const values = line.split(',').map(v => v.trim());
                const user: any = {};
                headers.forEach((header, index) => {
                    user[header] = values[index];
                });
                return user;
            });

            setPreview(users.slice(0, 5)); // Preview first 5
        };
        reader.readAsText(file);
    };

    const handleImport = () => {
        onImport(preview); // In real app, pass all parsed users
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg mx-4">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Import Users from CSV</CardTitle>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!file ? (
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1">CSV files only (max 5MB)</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".csv"
                                onChange={handleFileChange}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-primary-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                </div>
                                <button onClick={() => { setFile(null); setPreview([]); }} className="text-gray-400 hover:text-red-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {preview.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Preview ({preview.length} users)</p>
                                    <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr>
                                                    {Object.keys(preview[0]).map(key => (
                                                        <th key={key} className="px-2 py-1 border-b">{key}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {preview.map((user, i) => (
                                                    <tr key={i}>
                                                        {Object.values(user).map((val: any, j) => (
                                                            <td key={j} className="px-2 py-1 border-b border-gray-200">{val}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleImport} disabled={!file || !!error}>
                            Import Users
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
