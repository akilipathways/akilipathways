import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-4xl font-display font-bold mb-4 text-primary-blue">
                Your Complete Journey from Grade 6 to Grade 10
            </h2>
            <p className="text-xl mb-8 max-w-2xl text-slate-600">
                Akili Pathways is the official digital rehearsal for the KNEC psychometric assessment and Ministry selection wizard.
            </p>
            <div className="flex gap-4">
                <Button variant="default" size="lg" onClick={() => navigate('/login')}>
                    Sign In
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="border-primary-blue text-primary-blue hover:bg-blue-50"
                    onClick={() => navigate('/signup')}
                >
                    Create Account
                </Button>
            </div>
        </div>
    );
}
