import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useState } from 'react';

interface ImportUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ImportUsersModal({ isOpen, onClose }: ImportUsersModalProps) {
    const [step, setStep] = useState<'upload' | 'preview'>('upload');

    const handleUpload = () => {
        // Mock upload delay
        setTimeout(() => setStep('preview'), 1000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Import Users (CSV)" maxWidth="2xl">
            {step === 'upload' ? (
                <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleUpload}>
                        <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Click to upload or drag and drop</h3>
                        <p className="text-sm text-gray-500 mt-1">CSV files only (max 5MB)</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-blue-900">Need a template?</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Download our CSV template to ensure your data is formatted correctly.
                                <a href="#" className="underline ml-1 font-medium hover:text-blue-800">Download Template</a>
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">Preview (3 Users found)</h3>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center text-green-600 gap-1"><CheckCircle className="w-4 h-4" /> 2 Valid</span>
                            <span className="flex items-center text-red-600 gap-1"><AlertCircle className="w-4 h-4" /> 1 Error</span>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-2 font-medium text-gray-500">Status</th>
                                    <th className="px-4 py-2 font-medium text-gray-500">Name</th>
                                    <th className="px-4 py-2 font-medium text-gray-500">Email</th>
                                    <th className="px-4 py-2 font-medium text-gray-500">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr className="bg-white">
                                    <td className="px-4 py-2"><CheckCircle className="w-4 h-4 text-green-500" /></td>
                                    <td className="px-4 py-2">John Doe</td>
                                    <td className="px-4 py-2">john@example.com</td>
                                    <td className="px-4 py-2">Employee</td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="px-4 py-2"><CheckCircle className="w-4 h-4 text-green-500" /></td>
                                    <td className="px-4 py-2">Jane Smith</td>
                                    <td className="px-4 py-2">jane@example.com</td>
                                    <td className="px-4 py-2">Manager</td>
                                </tr>
                                <tr className="bg-red-50">
                                    <td className="px-4 py-2"><AlertCircle className="w-4 h-4 text-red-500" /></td>
                                    <td className="px-4 py-2">Bob</td>
                                    <td className="px-4 py-2 text-red-600">invalid-email</td>
                                    <td className="px-4 py-2">Employee</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">Rows with errors will be skipped.</p>
                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setStep('upload')}>Back</Button>
                            <Button onClick={onClose}>Import 2 Users</Button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}
