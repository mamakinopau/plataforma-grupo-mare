import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ChevronDown, ChevronUp, Search, Book, MessageCircle, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Help() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { t } = useTranslation();

    const FAQS = [
        {
            question: t('help.faqs.q1'),
            answer: t('help.faqs.a1')
        },
        {
            question: t('help.faqs.q2'),
            answer: t('help.faqs.a2')
        },
        {
            question: t('help.faqs.q3'),
            answer: t('help.faqs.a3')
        },
        {
            question: t('help.faqs.q4'),
            answer: t('help.faqs.a4')
        },
        {
            question: t('help.faqs.q5'),
            answer: t('help.faqs.a5')
        }
    ];

    const filteredFaqs = FAQS.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">{t('help.title')}</h1>
                <p className="text-gray-500">{t('help.subtitle')}</p>

                <div className="relative max-w-xl mx-auto mt-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={t('help.searchPlaceholder')}
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center space-y-3">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                            <Book className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{t('help.cards.guides.title')}</h3>
                        <p className="text-sm text-gray-500">{t('help.cards.guides.desc')}</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center space-y-3">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{t('help.cards.docs.title')}</h3>
                        <p className="text-sm text-gray-500">{t('help.cards.docs.desc')}</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center space-y-3">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{t('help.cards.support.title')}</h3>
                        <p className="text-sm text-gray-500">{t('help.cards.support.desc')}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>{t('help.faqTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div key={index} className="py-4">
                                <button
                                    className="flex items-center justify-between w-full text-left focus:outline-none"
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                >
                                    <span className="font-medium text-gray-900">{faq.question}</span>
                                    {openIndex === index ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                                {openIndex === index && (
                                    <p className="mt-2 text-gray-600 text-sm leading-relaxed animate-fadeIn">
                                        {faq.answer}
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-gray-500">
                            {t('help.noResults')} "{searchTerm}"
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
