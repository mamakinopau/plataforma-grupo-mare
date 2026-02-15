import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
};

const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
};

export function Toast({ id, type, message, duration = 3000, onClose }: ToastProps) {
    const Icon = icons[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, id, onClose]);

    return (
        <div
            className={cn(
                'flex items-center p-4 mb-3 rounded-lg border shadow-sm min-w-[300px] animate-in slide-in-from-right-full',
                styles[type]
            )}
            role="alert"
        >
            <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <div className="text-sm font-medium flex-1">{message}</div>
            <button
                onClick={() => onClose(id)}
                className="ml-3 inline-flex flex-shrink-0 justify-center items-center h-5 w-5 rounded-md hover:bg-black/5 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
