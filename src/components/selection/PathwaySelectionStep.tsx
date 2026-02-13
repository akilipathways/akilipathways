import { PathwayCode } from '@/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PathwaySelectionStepProps {
    onSelect: (pathway: PathwayCode) => void;
    selected: PathwayCode | null;
}

const pathways: { code: PathwayCode; name: string; description: string; color: string }[] = [
    {
        code: 'STEM',
        name: 'STEM',
        description: 'Science, Technology, Engineering & Mathematics',
        color: 'bg-primary-blue'
    },
    {
        code: 'SOSC',
        name: 'Social Sciences',
        description: 'Humanities, Business, Languages & Literature',
        color: 'bg-secondary-teal'
    },
    {
        code: 'ARTS',
        name: 'Arts & Sports',
        description: 'Creative Arts, Performing Arts, Sports Science',
        color: 'bg-accent-orange'
    },
];

export function PathwaySelectionStep({ onSelect, selected }: PathwaySelectionStepProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Choose Your Pathway</h2>
                <p className="text-slate-500">Select one of the three main pathways to proceed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pathways.map((pathway) => (
                    <div
                        key={pathway.code}
                        className={cn(
                            "cursor-pointer rounded-lg border-2 transition-all p-4 hover:shadow-md relative",
                            selected === pathway.code ? "border-primary-blue bg-blue-50/50" : "border-slate-200"
                        )}
                        onClick={() => onSelect(pathway.code)}
                    >
                        {selected === pathway.code && (
                            <div className="absolute top-2 right-2 bg-primary-blue text-white rounded-full p-1">
                                <Check className="w-4 h-4" />
                            </div>
                        )}
                        <div className={cn("w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-white font-bold", pathway.color)}>
                            {pathway.code[0]}
                        </div>
                        <h3 className="font-bold text-lg mb-1">{pathway.name}</h3>
                        <p className="text-sm text-slate-500">{pathway.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
