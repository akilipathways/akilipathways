import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Sample Situational Judgement Questions
const questions = [
    {
        id: 1,
        scenario: "You are working on a group project, but one member is not contributing their fair share of the work. The deadline is approaching. What is the BEST action to take?",
        options: [
            { id: 'A', text: 'Do their part yourself to ensure the project is finished on time.' },
            { id: 'B', text: 'Talk to the group member privately to understand why they are struggling.' },
            { id: 'C', text: 'Report the member to the teacher immediately.' },
            { id: 'D', text: 'Ignore it and hope they eventually contribute.' }
        ]
    },
    {
        id: 2,
        scenario: "You witness a close friend examining an answer key they found before a big test. They offer to share it with you.",
        options: [
            { id: 'A', text: 'Refuse to look and advise them to turn it in.' },
            { id: 'B', text: 'Look at the answers since everyone else might be cheating too.' },
            { id: 'C', text: 'Pretend you didn\'t see anything.' },
            { id: 'D', text: 'Tell them to keep it a secret.' }
        ]
    }
];

export function SituationalJudgementAssessment() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isComplete, setIsComplete] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionSelect = (optionId: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsComplete(true);
        }
    };

    if (isComplete) {
        return (
            <Card className="max-w-2xl mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Assessment Complete</CardTitle>
                    <CardDescription>Thank you for completing the Situational Judgement module.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-slate-600">Your responses have been recorded and will contribute to your Psychometric Profile.</p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={() => window.location.href = '/assessment'}>Return to Assessment Lobby</Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Situational Judgement</h1>
                <span className="text-sm font-medium text-slate-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-medium leading-relaxed">
                        {currentQuestion.scenario}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {currentQuestion.options.map((option) => (
                            <div
                                key={option.id}
                                className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${answers[currentQuestion.id] === option.id
                                    ? 'border-primary-blue bg-blue-50'
                                    : 'border-slate-100 hover:border-slate-200'
                                    }`}
                                onClick={() => handleOptionSelect(option.id)}
                            >
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${answers[currentQuestion.id] === option.id ? 'border-primary-blue' : 'border-slate-300'
                                    }`}>
                                    {answers[currentQuestion.id] === option.id && <div className="w-3 h-3 rounded-full bg-primary-blue" />}
                                </div>
                                <div className="flex-1">
                                    <span className="font-semibold mr-2">{option.id}.</span>
                                    {option.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button
                        onClick={handleNext}
                        disabled={!answers[currentQuestion.id]}
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
