import { useRef } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Download, Share2 } from 'lucide-react';
import { Certificate } from '../../types';

interface CertificateViewProps {
    certificate: Certificate;
}

export function CertificateView({ certificate }: CertificateViewProps) {
    const certificateRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        // In a real app, we would use html2canvas or similar to generate a PDF
        window.print();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-end space-x-4 print:hidden">
                <Button variant="outline" onClick={() => { }}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                </Button>
                <Button onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                </Button>
            </div>

            <Card className="print:shadow-none print:border-none">
                <CardContent className="p-0">
                    <div
                        ref={certificateRef}
                        className="relative w-full aspect-[1.414/1] bg-white text-center p-12 flex flex-col items-center justify-center border-8 border-double border-primary-900 m-0 print:w-screen print:h-screen print:border-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle at center, #f8fafc 0%, #e2e8f0 100%)'
                        }}
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-primary-600" />
                        <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-primary-600" />
                        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-primary-600" />
                        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-primary-600" />

                        {/* Logo */}
                        <img src="/logo.png" alt="Grupo Mare" className="h-24 mb-8 object-contain" />

                        <h1 className="text-5xl font-serif text-primary-900 mb-4 tracking-wide uppercase">Certificate of Completion</h1>

                        <p className="text-xl text-gray-600 mb-8 italic">This certifies that</p>

                        <h2 className="text-4xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-2 px-12 min-w-[400px]">
                            User Name
                        </h2>

                        <p className="text-xl text-gray-600 mt-8 mb-4 italic">has successfully completed the course</p>

                        <h3 className="text-3xl font-bold text-primary-700 mb-12">
                            {certificate.courseTitle}
                        </h3>

                        <div className="flex justify-between w-full max-w-2xl mt-12 px-12">
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-900">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
                                <div className="w-32 h-px bg-gray-400 mt-2 mb-1 mx-auto" />
                                <p className="text-sm text-gray-500 uppercase tracking-wider">Date</p>
                            </div>

                            <div className="text-center">
                                <div className="w-24 h-24 border-4 border-primary-200 rounded-full flex items-center justify-center mb-2 mx-auto">
                                    <span className="text-xl font-bold text-primary-700">{certificate.score}%</span>
                                </div>
                                <p className="text-sm text-gray-500 uppercase tracking-wider">Final Score</p>
                            </div>

                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-900 font-serif italic">Grupo Mare</p>
                                <div className="w-32 h-px bg-gray-400 mt-2 mb-1 mx-auto" />
                                <p className="text-sm text-gray-500 uppercase tracking-wider">Authorized Signature</p>
                            </div>
                        </div>

                        <div className="absolute bottom-4 text-xs text-gray-400 font-mono">
                            Certificate ID: {certificate.validationCode}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
