import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';

interface TourStep {
    target: string;
    title: string;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right';
}

export function OnboardingTour() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Only show on dashboard for now
    const shouldShow = location.pathname === '/' && user && !localStorage.getItem('onboarding_completed');

    useEffect(() => {
        if (shouldShow) {
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [shouldShow]);

    const steps: TourStep[] = [
        {
            target: 'body', // Center of screen
            title: t('dashboard.welcome', { name: user?.name }),
            content: "Welcome to your new training platform! Let's take a quick tour to get you started.",
            position: 'bottom'
        },
        {
            target: 'nav a[href="/courses"]',
            title: t('courses.title'),
            content: "Here you can find all available training modules assigned to you.",
            position: 'right'
        },
        {
            target: 'nav a[href="/leaderboard"]',
            title: t('leaderboard.title'),
            content: "Check your ranking and compete with your colleagues.",
            position: 'right'
        },
        {
            target: 'nav a[href="/profile"]',
            title: t('settings.profile.title'),
            content: "View your certificates and progress history here.",
            position: 'right'
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem('onboarding_completed', 'true');
    };

    if (!isVisible) return null;

    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                        <button onClick={handleComplete} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {step.content}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            {steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-primary-600' : 'w-1.5 bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="flex gap-3">
                            {currentStep > 0 && (
                                <Button variant="ghost" onClick={handlePrev} size="sm">
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    {t('common.back')}
                                </Button>
                            )}
                            <Button onClick={handleNext} size="sm">
                                {currentStep === steps.length - 1 ? "Get Started" : t('common.next')}
                                {currentStep !== steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
