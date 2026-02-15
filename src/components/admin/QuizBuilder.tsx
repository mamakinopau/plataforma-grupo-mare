import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Question, QuizConfig } from '../../types';

interface QuizBuilderProps {
    config?: QuizConfig;
    onChange: (config: QuizConfig) => void;
}

export function QuizBuilder({ config, onChange }: QuizBuilderProps) {
    const [localConfig, setLocalConfig] = useState<QuizConfig>(config || {
        passingScore: 70,
        questions: [],
        randomizeQuestions: false
    });

    const updateConfig = (newConfig: QuizConfig) => {
        setLocalConfig(newConfig);
        onChange(newConfig);
    };

    const addQuestion = () => {
        const newQuestion: Question = {
            id: `q-${Date.now()}`,
            text: '',
            type: 'multiple_choice',
            options: ['', '', '', ''],
            correctAnswer: 0,
            points: 10
        };
        updateConfig({
            ...localConfig,
            questions: [...localConfig.questions, newQuestion]
        });
    };

    const updateQuestion = (index: number, updates: Partial<Question>) => {
        const newQuestions = [...localConfig.questions];
        newQuestions[index] = { ...newQuestions[index], ...updates };
        updateConfig({ ...localConfig, questions: newQuestions });
    };

    const removeQuestion = (index: number) => {
        const newQuestions = localConfig.questions.filter((_, i) => i !== index);
        updateConfig({ ...localConfig, questions: newQuestions });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Passing Score (%)</label>
                    <input
                        type="number"
                        value={localConfig.passingScore}
                        onChange={(e) => updateConfig({ ...localConfig, passingScore: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Time Limit (min)</label>
                    <input
                        type="number"
                        value={localConfig.timeLimitMinutes || ''}
                        placeholder="Optional"
                        onChange={(e) => updateConfig({ ...localConfig, timeLimitMinutes: e.target.value ? Number(e.target.value) : undefined })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Max Attempts</label>
                    <input
                        type="number"
                        value={localConfig.maxAttempts || ''}
                        placeholder="Unlimited"
                        onChange={(e) => updateConfig({ ...localConfig, maxAttempts: e.target.value ? Number(e.target.value) : undefined })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {localConfig.questions.map((question, index) => (
                    <Card key={question.id} className="relative">
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-2">
                                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Question Text</label>
                                            <input
                                                type="text"
                                                value={question.text}
                                                onChange={(e) => updateQuestion(index, { text: e.target.value })}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                                placeholder="Enter your question here..."
                                            />
                                        </div>
                                        <div className="w-40">
                                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Type</label>
                                            <select
                                                value={question.type}
                                                onChange={(e) => updateQuestion(index, { type: e.target.value as any })}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                            >
                                                <option value="multiple_choice">Multiple Choice</option>
                                                <option value="true_false">True / False</option>
                                                <option value="short_answer">Short Answer</option>
                                            </select>
                                        </div>
                                        <div className="w-24">
                                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Points</label>
                                            <input
                                                type="number"
                                                value={question.points}
                                                onChange={(e) => updateQuestion(index, { points: Number(e.target.value) })}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                            />
                                        </div>
                                    </div>

                                    {question.type === 'multiple_choice' && (
                                        <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                                            <label className="block text-xs font-medium text-gray-500 uppercase">Options</label>
                                            {question.options?.map((option, optIndex) => (
                                                <div key={optIndex} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={`correct-${question.id}`}
                                                        checked={question.correctAnswer === optIndex}
                                                        onChange={() => updateQuestion(index, { correctAnswer: optIndex })}
                                                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => {
                                                            const newOptions = [...(question.options || [])];
                                                            newOptions[optIndex] = e.target.value;
                                                            updateQuestion(index, { options: newOptions });
                                                        }}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                                        placeholder={`Option ${optIndex + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {question.type === 'true_false' && (
                                        <div className="flex gap-4 pl-4 border-l-2 border-gray-100">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`tf-${question.id}`}
                                                    checked={question.correctAnswer === true}
                                                    onChange={() => updateQuestion(index, { correctAnswer: true })}
                                                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                                                />
                                                <span className="text-sm text-gray-900">True</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`tf-${question.id}`}
                                                    checked={question.correctAnswer === false}
                                                    onChange={() => updateQuestion(index, { correctAnswer: false })}
                                                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                                                />
                                                <span className="text-sm text-gray-900">False</span>
                                            </label>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Explanation (Optional Feedback)</label>
                                        <input
                                            type="text"
                                            value={question.explanation || ''}
                                            onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                            placeholder="Explain why the answer is correct..."
                                        />
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeQuestion(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <Button variant="outline" className="w-full border-dashed" onClick={addQuestion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                </Button>
            </div>
        </div>
    );
}
