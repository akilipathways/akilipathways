import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { assessmentService } from '@/services/assessmentService';

// Holland Code (RIASEC) Questions
const questions = [
    // Realistic (Doers)
    { id: 1, type: 'REALISTIC', text: "I like to work with cars, machines, or tools." },
    { id: 2, type: 'REALISTIC', text: "I enjoy building things with my hands." },
    { id: 3, type: 'REALISTIC', text: "I like to take care of animals or work outdoors." },

    // Investigative (Thinkers)
    { id: 4, type: 'INVESTIGATIVE', text: "I like to do experiments and solve science problems." },
    { id: 5, type: 'INVESTIGATIVE', text: "I enjoy analyzing data and figuring out how things work." },
    { id: 6, type: 'INVESTIGATIVE', text: "I like to read about science and technology." },

    // Artistic (Creators)
    { id: 7, type: 'ARTISTIC', text: "I enjoy sketching, painting, or playing music." },
    { id: 8, type: 'ARTISTIC', text: "I like to write stories, poems, or plays." },
    { id: 9, type: 'ARTISTIC', text: "I prefer work that allows me to be creative and original." },

    // Social (Helpers)
    { id: 10, type: 'SOCIAL', text: "I like to teach or help others learn." },
    { id: 11, type: 'SOCIAL', text: "I enjoy volunteer work and community service." },
    { id: 12, type: 'SOCIAL', text: "I am good at listening and helping friends with their problems." },

    // Enterprising (Persuaders)
    { id: 13, type: 'ENTERPRISING', text: "I like to lead groups and persuade others." },
    { id: 14, type: 'ENTERPRISING', text: "I enjoy selling things or promoting ideas." },
    { id: 15, type: 'ENTERPRISING', text: "I would like to start my own business someday." },

    // Conventional (Organizers)
    { id: 16, type: 'CONVENTIONAL', text: "I like to keep things neat and organized." },
    { id: 17, type: 'CONVENTIONAL', text: "I enjoy working with numbers and spreadsheets." },
    { id: 18, type: 'CONVENTIONAL', text: "I like to follow clear rules and instructions." }
];

export function InterestInventoryAssessment() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // Score: 1-5 (Strongly Disagree to Strongly Agree)
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Initialize session on mount
    useState(() => {
        const init = async () => {
            if (user) {
                const id = await assessmentService.startSession(user.id, 'INT_INV');
                setSessionId(id);
            }
        };
        init();
    });





    const handleOptionSelect = async (score: number) => {
        const updatedAnswers = { ...answers, [questions[currentQuestionIndex].id]: score };
        setAnswers(updatedAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Finished
            setSubmitting(true);

            // Calculate total raw score (just sum of all responses for now as a placeholder for "completion")
            // In reality, we'd save the granularity.
            const totalScore = Object.values(updatedAnswers).reduce((a, b) => a + b, 0);
            const maxScore = questions.length * 5;

            if (sessionId && user) {
                await assessmentService.completeSession(
                    sessionId,
                    user.id,
                    'INT_INV',
                    totalScore,
                    maxScore
                );
            }
            navigate('/assessment');
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    if (submitting) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue mr-4"></div>
                Save results...
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold text-slate-900">Interest Inventory</h1>
                    <span className="text-sm font-medium text-slate-500">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-primary-blue h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <Card className="min-h-[400px] flex flex-col">
                <CardHeader>
                    <CardTitle className="text-2xl font-medium leading-relaxed text-center py-8">
                        "{currentQuestion.text}"
                    </CardTitle>
                    <CardDescription className="text-center">
                        Select the option that best describes you.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center space-y-3 px-8 pb-12">
                    <Button
                        variant="outline"
                        className="h-14 text-lg border-2 hover:bg-green-50 hover:border-green-500 hover:text-green-700 justify-start px-6"
                        onClick={() => handleOptionSelect(5)}
                    >
                        🤩 Strongly Like
                    </Button>
                    <Button
                        variant="outline"
                        className="h-14 text-lg border-2 hover:bg-lime-50 hover:border-lime-500 hover:text-lime-700 justify-start px-6"
                        onClick={() => handleOptionSelect(4)}
                    >
                        🙂 Like
                    </Button>
                    <Button
                        variant="outline"
                        className="h-14 text-lg border-2 hover:bg-slate-50 hover:border-slate-400 justify-start px-6"
                        onClick={() => handleOptionSelect(3)}
                    >
                        😐 Neutral
                    </Button>
                    <Button
                        variant="outline"
                        className="h-14 text-lg border-2 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-700 justify-start px-6"
                        onClick={() => handleOptionSelect(2)}
                    >
                        🙁 Dislike
                    </Button>
                    <Button
                        variant="outline"
                        className="h-14 text-lg border-2 hover:bg-red-50 hover:border-red-500 hover:text-red-700 justify-start px-6"
                        onClick={() => handleOptionSelect(1)}
                    >
                        😡 Strongly Dislike
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
