import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PathwayCode, TrackCode } from '@/types';

// Steps
import { PathwaySelectionStep } from '@/components/selection/PathwaySelectionStep';
import { TrackSelectionStep } from '@/components/selection/TrackSelectionStep';
import { CombinationSelectionStep } from '@/components/selection/CombinationSelectionStep';
import { SchoolSelectionStep } from '@/components/selection/SchoolSelectionStep';
import { ReviewStep } from '@/components/selection/ReviewStep';

export function SchoolSelectionWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selections, setSelections] = useState({
        pathway: null as PathwayCode | null,
        track: null as TrackCode | null,
        combinations: [] as any[],
        schools: [] as any[],
    });

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handlePathwaySelect = (pathway: PathwayCode) => {
        setSelections(prev => ({ ...prev, pathway }));
        nextStep();
    };

    const handleTrackSelect = (track: TrackCode) => {
        setSelections(prev => ({ ...prev, track }));
        nextStep();
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <PathwaySelectionStep onSelect={handlePathwaySelect} selected={selections.pathway} />;
            case 2:
                return <TrackSelectionStep onSelect={handleTrackSelect} selected={selections.track} pathway={selections.pathway} />;
            case 3:
                return <CombinationSelectionStep />;
            case 4:
                return <SchoolSelectionStep />;
            case 5:
                return <ReviewStep />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">School Selection Wizard</h1>
                <p className="text-slate-600">Step {currentStep} of 5</p>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-4">
                    <div
                        className="bg-primary-blue h-full rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / 5) * 100}%` }}
                    />
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    {renderStep()}
                </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                >
                    Back
                </Button>
                {currentStep > 2 && ( // Logic for next button visibility differs per step
                    <Button onClick={nextStep} disabled={currentStep === 5}>
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}
