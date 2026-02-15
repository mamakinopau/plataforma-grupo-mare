import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { Save } from 'lucide-react';

interface CustomReportBuilderProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CustomReportBuilder({ isOpen, onClose }: CustomReportBuilderProps) {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('reports.builder.title')}>
            <div className="space-y-6">
                {step === 1 && (
                    <div className="space-y-4">
                        <Input label={t('reports.builder.reportName')} placeholder="e.g., Weekly Kitchen Compliance" />
                        <Select
                            label={t('reports.builder.type')}
                            options={[
                                { value: 'table', label: 'Table' },
                                { value: 'chart', label: 'Chart' },
                                { value: 'mixed', label: 'Mixed (Dashboard)' },
                            ]}
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{t('reports.builder.metrics')}</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Completion Rate', 'Avg Score', 'Time Spent', 'Certificates'].map(m => (
                                    <label key={m} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                        <input type="checkbox" className="rounded text-primary-600" />
                                        <span className="text-sm">{m}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">{t('reports.builder.schedule')}</h3>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded text-primary-600" />
                                <span className="text-sm">{t('reports.builder.enableSchedule')}</span>
                            </label>
                        </div>
                        <Select
                            label={t('reports.builder.frequency')}
                            options={[
                                { value: 'daily', label: 'Daily' },
                                { value: 'weekly', label: 'Weekly' },
                                { value: 'monthly', label: 'Monthly' },
                            ]}
                        />
                        <Input label={t('reports.builder.recipients')} placeholder="email@example.com" />
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
                    {step === 1 ? (
                        <Button onClick={() => setStep(2)}>{t('common.next')}</Button>
                    ) : (
                        <Button onClick={onClose} className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            {t('reports.builder.save')}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
