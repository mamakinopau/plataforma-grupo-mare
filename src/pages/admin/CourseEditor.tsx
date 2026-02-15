import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/useDataStore';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { QuizBuilder } from '../../components/admin/QuizBuilder';
import { ChevronLeft, Plus, Save, GripVertical, Trash2, Settings, FileText } from 'lucide-react';


import { Course, Lesson, Section, QuizConfig } from '../../types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QUILL_MODULES = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
    ],
};


export function CourseEditor() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { getCourseById, addCourse, updateCourse, categories } = useDataStore();
    const [activeTab, setActiveTab] = useState<'settings' | 'curriculum'>('curriculum');

    const isNew = !courseId;
    const existingCourse = courseId ? getCourseById(courseId) : undefined;

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [duration, setDuration] = useState(0);
    const [sections, setSections] = useState<Section[]>([]);


    // Quiz Editing State
    const [editingQuizLesson, setEditingQuizLesson] = useState<{ sectionIndex: number, lessonIndex: number } | null>(null);

    // Initialize state when course loads
    useEffect(() => {
        if (existingCourse) {
            setTitle(existingCourse.title);
            setDescription(existingCourse.description);
            setCategory(existingCourse.category);
            setDuration(existingCourse.durationMinutes);
            setSections(existingCourse.sections);
            setThumbnailUrl(existingCourse.thumbnailUrl);
        }
    }, [existingCourse]);


    if (!isNew && !existingCourse) return <div>Course not found</div>;

    const handleSave = () => {
        const courseData: Course = {
            ...existingCourse, // Base on existing values
            id: isNew ? `c-${Date.now()}` : courseId!,
            title,
            description,
            category: category as any,
            durationMinutes: duration,
            isMandatory: existingCourse?.isMandatory || false,
            targetRoles: existingCourse?.targetRoles || ['employee'],
            status: existingCourse?.status || 'published',
            sections,
            thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=1000',
            createdAt: existingCourse?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };


        if (isNew) {
            addCourse(courseData);
        } else {
            updateCourse(courseId!, courseData);
        }
        navigate('/courses');
    };

    const addSection = () => {
        const newSection: Section = {
            id: `s-${Date.now()}`,
            title: 'New Section',
            lessons: []
        };
        setSections([...sections, newSection]);
    };

    const addLesson = (sectionId: string) => {
        const newLesson: Lesson = {
            id: `l-${Date.now()}`,
            title: 'New Lesson',
            type: 'text',
            content: '',
            durationMinutes: 10,
            isMandatory: true,
            isPreview: false
        };

        setSections(sections.map(s => {
            if (s.id === sectionId) {
                return { ...s, lessons: [...s.lessons, newLesson] };
            }
            return s;
        }));
    };

    const updateLesson = (sectionIndex: number, lessonIndex: number, updates: Partial<Lesson>) => {
        const newSections = [...sections];
        newSections[sectionIndex].lessons[lessonIndex] = {
            ...newSections[sectionIndex].lessons[lessonIndex],
            ...updates
        };
        setSections(newSections);
    };

    const handleQuizConfigUpdate = (config: QuizConfig) => {
        if (editingQuizLesson) {
            updateLesson(editingQuizLesson.sectionIndex, editingQuizLesson.lessonIndex, { quizConfig: config });
        }
    };

    const [uploading, setUploading] = useState<string | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState(existingCourse?.thumbnailUrl || '');

    const handleFileUpload = async (file: File, type: 'thumbnail' | 'lesson', sIndex?: number, lIndex?: number) => {
        const formData = new FormData();
        formData.append('file', file);
        setUploading(type === 'thumbnail' ? 'thumbnail' : `lesson-${sIndex}-${lIndex}`);

        try {
            const response = await fetch('http://localhost:3001/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.url) {
                if (type === 'thumbnail') {
                    setThumbnailUrl(data.url);
                } else if (sIndex !== undefined && lIndex !== undefined) {
                    updateLesson(sIndex, lIndex, { content: data.url });
                }
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Falha no upload. Verifique se o backend está rodando em http://localhost:3001');
        } finally {
            setUploading(null);
        }
    };


    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" onClick={() => navigate('/courses')}>
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isNew ? 'Create New Course' : `Edit: ${title}`}
                    </h1>
                </div>
                <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    {isNew ? 'Create Course' : 'Save Changes'}
                </Button>
            </div>

            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'settings' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    Settings
                </button>
                <button
                    onClick={() => setActiveTab('curriculum')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'curriculum' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    Curriculum
                </button>
            </div>

            {activeTab === 'curriculum' && (
                <div className="space-y-6">
                    {sections.map((section, sIndex) => (
                        <Card key={section.id} className="border-l-4 border-l-primary-500">
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <div className="flex items-center space-x-2">
                                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                                    <input
                                        value={section.title}
                                        onChange={(e) => {
                                            const newSections = [...sections];
                                            newSections[sIndex].title = e.target.value;
                                            setSections(newSections);
                                        }}
                                        className="font-semibold text-lg bg-transparent border-none focus:ring-0 p-0"
                                    />
                                </div>
                                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => {
                                    setSections(sections.filter((_, i) => i !== sIndex));
                                }}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                {section.lessons.map((lesson, lIndex) => (
                                    <div key={lesson.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 group space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3 flex-1">
                                                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                                                <input
                                                    value={lesson.title}
                                                    onChange={(e) => updateLesson(sIndex, lIndex, { title: e.target.value })}
                                                    className="font-medium text-sm text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-full"
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm" className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                                                    const newSections = [...sections];
                                                    newSections[sIndex].lessons = newSections[sIndex].lessons.filter((_, i) => i !== lIndex);
                                                    setSections(newSections);
                                                }}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="col-span-1">
                                                <label className="block text-[10px] font-uppercase font-bold text-gray-400 mb-1">TYPE</label>
                                                <select
                                                    value={lesson.type}
                                                    onChange={(e) => updateLesson(sIndex, lIndex, { type: e.target.value as any })}
                                                    className="w-full text-xs px-2 py-1.5 bg-white border rounded text-gray-600 uppercase cursor-pointer"
                                                >
                                                    <option value="text">📄 Text</option>
                                                    <option value="video">🎥 Video</option>
                                                    <option value="quiz">❓ Quiz</option>
                                                    <option value="pdf">📕 PDF</option>
                                                </select>
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-[10px] font-uppercase font-bold text-gray-400 mb-1">DURATION (MIN)</label>
                                                <input
                                                    type="number"
                                                    value={lesson.durationMinutes}
                                                    onChange={(e) => updateLesson(sIndex, lIndex, { durationMinutes: Number(e.target.value) })}
                                                    className="w-full text-xs px-2 py-1.5 bg-white border rounded text-gray-600"
                                                />
                                            </div>
                                            <div className="col-span-1 flex items-end">
                                                {lesson.type === 'quiz' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full text-xs h-[30px]"
                                                        onClick={() => setEditingQuizLesson({ sectionIndex: sIndex, lessonIndex: lIndex })}
                                                    >
                                                        <Settings className="w-3 h-3 mr-2" />
                                                        Configure Quiz
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-2">
                                            {lesson.type === 'text' && (
                                                <div className="bg-white rounded-md overflow-hidden">
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={lesson.content}
                                                        onChange={(content) => updateLesson(sIndex, lIndex, { content })}
                                                        modules={QUILL_MODULES}
                                                        placeholder="Escreva o conteúdo da aula aqui..."
                                                        className="h-64 mb-12"
                                                    />
                                                </div>
                                            )}

                                            {(lesson.type === 'video' || lesson.type === 'pdf') && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={lesson.content}
                                                            onChange={(e) => updateLesson(sIndex, lIndex, { content: e.target.value })}
                                                            placeholder={`Enter ${lesson.type} URL or upload...`}
                                                            className="flex-1 text-sm p-2 bg-white border rounded-md"
                                                        />
                                                        <input
                                                            type="file"
                                                            id={`upload-${sIndex}-${lIndex}`}
                                                            className="hidden"
                                                            accept={lesson.type === 'video' ? 'video/*' : 'application/pdf'}
                                                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'lesson', sIndex, lIndex)}
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={uploading === `lesson-${sIndex}-${lIndex}`}
                                                            onClick={() => document.getElementById(`upload-${sIndex}-${lIndex}`)?.click()}
                                                        >
                                                            {uploading === `lesson-${sIndex}-${lIndex}` ? '...' : 'Upload'}
                                                        </Button>
                                                    </div>
                                                    {lesson.content && (
                                                        <div className="flex items-center gap-2 p-2 bg-white border rounded text-xs text-gray-500">
                                                            {lesson.type === 'pdf' ? <FileText className="w-3 h-3 text-red-500" /> : <Settings className="w-3 h-3 text-blue-500" />}
                                                            <span className="truncate flex-1">{lesson.content}</span>
                                                            <a href={lesson.content} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Ver</a>
                                                        </div>
                                                    )}


                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => addLesson(section.id)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Lesson
                                </Button>
                            </CardContent>
                        </Card>
                    ))}


                    <Button variant="outline" className="w-full py-8 border-dashed" onClick={addSection}>
                        <Plus className="w-6 h-6 mr-2" />
                        Add Section
                    </Button>
                </div>
            )}

            {activeTab === 'settings' && (
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Course Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Duration (min)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Course Thumbnail</label>
                            <div className="mt-1 flex items-center space-x-4">
                                <div className="w-24 h-24 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                    {thumbnailUrl ? (
                                        <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                    ) : (
                                        <Plus className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>

                                <input
                                    type="file"
                                    id="thumbnail-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleFileUpload(file, 'thumbnail');
                                        }
                                    }}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={uploading === 'thumbnail'}
                                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                                >
                                    {uploading === 'thumbnail' ? 'Uploading...' : 'Upload Cover Image'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quiz Builder Modal */}
            <Modal
                isOpen={!!editingQuizLesson}
                onClose={() => setEditingQuizLesson(null)}
                title="Configure Quiz"
                className="max-w-4xl"
            >
                {editingQuizLesson && (
                    <QuizBuilder
                        config={sections[editingQuizLesson.sectionIndex].lessons[editingQuizLesson.lessonIndex].quizConfig}
                        onChange={handleQuizConfigUpdate}
                    />
                )}
                <div className="mt-6 flex justify-end">
                    <Button onClick={() => setEditingQuizLesson(null)}>
                        Done
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
