import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for combinations
const combinations = [
    { id: 'BIO_CHEM_PHY', name: 'PCB', subjects: ['Biology', 'Chemistry', 'Physics'], difficulty: 'High' },
    { id: 'BIO_CHEM_GEO', name: 'BCG', subjects: ['Biology', 'Chemistry', 'Geography'], difficulty: 'Medium' },
    { id: 'PHY_CHEM_COMP', name: 'PCC', subjects: ['Physics', 'Chemistry', 'Computer Studies'], difficulty: 'High' },
];

export function CombinationSelectionStep() {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Choose Subject Combination</h2>
                <p className="text-slate-500">Based on your track, select your preferred subjects.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {combinations.map((combo) => (
                    <div
                        key={combo.id}
                        className={cn(
                            "cursor-pointer rounded-lg border-2 transition-all p-4 hover:shadow-md relative",
                            selectedId === combo.id ? "border-primary-blue bg-blue-50/50" : "border-slate-200"
                        )}
                        onClick={() => setSelectedId(combo.id)}
                    >
                        {selectedId === combo.id && (
                            <div className="absolute top-2 right-2 bg-primary-blue text-white rounded-full p-1">
                                <Check className="w-4 h-4" />
                            </div>
                        )}
                        <h3 className="font-bold text-lg mb-1">{combo.name}</h3>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {combo.subjects.map(sub => (
                                <span key={sub} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{sub}</span>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500">Difficulty: {combo.difficulty}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
