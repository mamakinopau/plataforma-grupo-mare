import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { QuizConfig, Question } from '../../types';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuizPlayerProps {
    config: QuizConfig;
    onComplete: (score: number, passed: boolean) => void;
}

export function QuizPlayer({ config, onComplete }: QuizPlayerProps) {
    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(config.timeLimitMinutes ? config.timeLimitMinutes * 60 : null);

    useEffect(() => {
        if (started && timeLeft !== null && !submitted) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev !== null && prev <= 1) {
                        clearInterval(timer);
                        handleSubmit();
                        return 0;
                    }
                    return prev !== null ? prev - 1 : null;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [started, timeLeft, submitted]);

    const handleStart = () => {
        setStarted(true);
    };

    const handleAnswer = (questionId: string, answer: any) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const calculateScore = () => {
        let totalPoints = 0;
        let earnedPoints = 0;

        config.questions.forEach((q) => {
            totalPoints += q.points;
            const userAnswer = answers[q.id];

            if (q.type === 'multiple_choice' || q.type === 'true_false') {
                if (userAnswer === q.correctAnswer) {
                    earnedPoints += q.points;
                }
            } else if (q.type === 'short_answer') {
                if (userAnswer?.toString().toLowerCase().trim() === q.correctAnswer.toString().toLowerCase().trim()) {
                    earnedPoints += q.points;
                }
            }
        });

        return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    };

    const handleSubmit = () => {
        const finalScore = calculateScore();
        setScore(finalScore);
        setSubmitted(true);
        onComplete(finalScore, finalScore >= config.passingScore);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!started) {
        return (
            <Card className="max-w-2xl mx-auto text-center">
                <CardHeader>
                    <CardTitle className="text-2xl">Ready to start?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Questions</p>
                            <p className="text-xl font-bold text-gray-900">{config.questions.length}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Passing Score</p>
                            <p className="text-xl font-bold text-gray-900">{config.passingScore}%</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Time Limit</p>
                            <p className="text-xl font-bold text-gray-900">
                                {config.timeLimitMinutes ? `${config.timeLimitMinutes} min` : 'None'}
                            </p>
                        </div>
                    </div>
                    <Button size="lg" onClick={handleStart} className="w-full md:w-auto">
                        Start Quiz
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (submitted) {
        const passed = score >= config.passingScore;
        return (
            <Card className="max-w-2xl mx-auto text-center">
                <CardContent className="pt-8 space-y-6">
                    <div className={cn("w-20 h-20 mx-auto rounded-full flex items-center justify-center", passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
                        {passed ? <CheckCircle className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{passed ? 'Congratulations!' : 'Keep Trying'}</h2>
                        <p className="text-gray-500 mt-2">You scored {score}%</p>
                        <p className="text-sm text-gray-400 mt-1">Passing score: {config.passingScore}%</p>
                    </div>

                    <div className="text-left space-y-4 mt-8">
                        <h3 className="font-semibold text-gray-900">Review Answers</h3>
                        {config.questions.map((q, i) => {
                            const isCorrect = answers[q.id] === q.correctAnswer;
                            return (
                                <div key={q.id} className={cn("p-4 rounded-lg border", isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
                                    <div className="flex items-start gap-3">
                                        {isCorrect ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                                        <div>
                                            <p className="font-medium text-gray-900">{i + 1}. {q.text}</p>
                                            {!isCorrect && (
                                                <div className="mt-2 text-sm">
                                                    <p className="text-red-600">Your answer: {q.type === 'multiple_choice' ? q.options?.[answers[q.id]] : String(answers[q.id])}</p>
                                                    <p className="text-green-600">Correct answer: {q.type === 'multiple_choice' ? q.options?.[q.correctAnswer as number] : String(q.correctAnswer)}</p>
                                                    {q.explanation && <p className="text-gray-600 mt-1 italic">{q.explanation}</p>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Button onClick={() => {
                        setStarted(false);
                        setSubmitted(false);
                        setScore(0);
                        setAnswers({});
                        setCurrentQuestionIndex(0);
                        setTimeLeft(config.timeLimitMinutes ? config.timeLimitMinutes * 60 : null);
                    }}>
                        Retry Quiz
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const question = config.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === config.questions.length - 1;

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-500">
                        Question {currentQuestionIndex + 1} of {config.questions.length}
                    </span>
                </div>
                {timeLeft !== null && (
                    <div className={cn("flex items-center space-x-2 font-mono font-medium", timeLeft < 60 ? "text-red-600" : "text-gray-700")}>
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                )}
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
                <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-6">{question.text}</h3>

                    <div className="space-y-3">
                        {question.type === 'multiple_choice' && question.options?.map((option, index) => (
                            <label
                                key={index}
                                className={cn(
                                    "flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50",
                                    answers[question.id] === index ? "border-primary-500 ring-1 ring-primary-500 bg-primary-50" : "border-gray-200"
                                )}
                            >
                                <input
                                    type="radio"
                                    name={question.id}
                                    checked={answers[question.id] === index}
                                    onChange={() => handleAnswer(question.id, index)}
                                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                />
                                <span className="ml-3 text-gray-900">{option}</span>
                            </label>
                        ))}

                        {question.type === 'true_false' && (
                            <div className="flex gap-4">
                                {[true, false].map((val) => (
                                    <label
                                        key={String(val)}
                                        className={cn(
                                            "flex-1 flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50",
                                            answers[question.id] === val ? "border-primary-500 ring-1 ring-primary-500 bg-primary-50" : "border-gray-200"
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name={question.id}
                                            checked={answers[question.id] === val}
                                            onChange={() => handleAnswer(question.id, val)}
                                            className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                        />
                                        <span className="ml-3 text-gray-900 font-medium">{val ? 'True' : 'False'}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {question.type === 'short_answer' && (
                            <input
                                type="text"
                                value={answers[question.id] || ''}
                                onChange={(e) => handleAnswer(question.id, e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3 border"
                                placeholder="Type your answer here..."
                            />
                        )}
                    </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                    <Button
                        variant="ghost"
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </Button>
                    {isLastQuestion ? (
                        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                            Submit Quiz
                        </Button>
                    ) : (
                        <Button onClick={() => setCurrentQuestionIndex(prev => Math.min(config.questions.length - 1, prev + 1))}>
                            Next Question
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
