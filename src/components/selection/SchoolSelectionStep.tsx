import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock school data
const schools = [
    { id: '1', name: 'Nairobi School', category: 'National', cluster: 'C1', type: 'Boys' },
    { id: '2', name: 'Kenya High', category: 'National', cluster: 'C1', type: 'Girls' },
    { id: '3', name: 'Pangani Girls', category: 'National', cluster: 'C2', type: 'Girls' },
    { id: '4', name: 'Dagoretti High', category: 'Extra County', cluster: 'C3', type: 'Boys' },
    { id: '5', name: 'Buruburu Girls', category: 'County', cluster: 'C4', type: 'Girls' },
];

export function SchoolSelectionStep() {
    const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
    const MAX_SCHOOLS = 12;

    const toggleSchool = (id: string) => {
        if (selectedSchools.includes(id)) {
            setSelectedSchools(prev => prev.filter(s => s !== id));
        } else {
            if (selectedSchools.length < MAX_SCHOOLS) {
                setSelectedSchools(prev => [...prev, id]);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Select Your Schools</h2>
                <p className="text-slate-500">
                    You must select 12 schools in total according to Ministry guidelines.
                    <br />
                    <span className="font-semibold text-primary-blue">{selectedSchools.length} / {MAX_SCHOOLS} selected</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold mb-3">Available Schools</h3>
                    <div className="space-y-2 h-[400px] overflow-y-auto pr-2">
                        {schools.map((school) => (
                            <div
                                key={school.id}
                                className={cn(
                                    "p-3 border rounded-lg flex justify-between items-center bg-white hover:bg-slate-50 transition-colors",
                                    selectedSchools.includes(school.id) ? "opacity-50" : ""
                                )}
                            >
                                <div>
                                    <h4 className="font-medium">{school.name}</h4>
                                    <div className="flex gap-2 text-xs mt-1">
                                        <Badge variant="outline">{school.category}</Badge>
                                        <Badge variant="secondary">{school.type}</Badge>
                                        <span className="text-slate-500">{school.cluster}</span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => toggleSchool(school.id)}
                                    disabled={selectedSchools.includes(school.id)}
                                >
                                    <Plus className="w-4 h-4 text-primary-blue" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Your Selection</h3>
                    {selectedSchools.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">No schools selected yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {selectedSchools.map((id, index) => {
                                const school = schools.find(s => s.id === id);
                                return (
                                    <div key={id} className="p-3 bg-white border rounded-lg flex justify-between items-center shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {index + 1}
                                            </span>
                                            <span className="font-medium">{school?.name}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => toggleSchool(id)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
