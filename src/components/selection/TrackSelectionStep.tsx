import { PathwayCode, TrackCode } from '@/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TrackSelectionStepProps {
    onSelect: (track: TrackCode) => void;
    selected: TrackCode | null;
    pathway: PathwayCode | null;
}

const tracks: Record<PathwayCode, { code: TrackCode; name: string; description: string }[]> = {
    STEM: [
        { code: 'PURE_SCI', name: 'Pure Sciences', description: 'Biology, Chemistry, Physics' },
        { code: 'APP_SCI', name: 'Applied Sciences', description: 'Agriculture, Computer, Home Sci' },
        { code: 'TECH', name: 'Technical Studies', description: 'Building, Electrical, Power Mech' }
    ],
    SOSC: [
        { code: 'LANG_LIT', name: 'Languages & Lit', description: 'English, Lit, Kiswahili, Foreign' },
        { code: 'HUM_BUS', name: 'Humanities & Business', description: 'History, Geog, CRE, Business' }
    ],
    ARTS: [
        { code: 'ARTS_T', name: 'Creative Arts', description: 'Music, Fine Art, Theatre' },
        { code: 'SPORTS', name: 'Sports Science', description: 'Physical Education, Sports Mgmt' }
    ]
};

export function TrackSelectionStep({ onSelect, selected, pathway }: TrackSelectionStepProps) {
    if (!pathway) return <div>Please select a pathway first.</div>;

    const currentTracks = tracks[pathway];

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Select a Track</h2>
                <p className="text-slate-500">Choose a specialized track within {pathway}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTracks.map((track) => (
                    <div
                        key={track.code}
                        className={cn(
                            "cursor-pointer rounded-lg border-2 transition-all p-4 hover:shadow-md relative",
                            selected === track.code ? "border-primary-blue bg-blue-50/50" : "border-slate-200"
                        )}
                        onClick={() => onSelect(track.code)}
                    >
                        {selected === track.code && (
                            <div className="absolute top-2 right-2 bg-primary-blue text-white rounded-full p-1">
                                <Check className="w-4 h-4" />
                            </div>
                        )}
                        <h3 className="font-bold text-lg mb-1">{track.name}</h3>
                        <p className="text-sm text-slate-500">{track.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
