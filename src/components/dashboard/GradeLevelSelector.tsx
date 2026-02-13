import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GradeLevelSelectorProps {
    currentGrade: number;
    onSelect: (grade: number) => void;
}

export function GradeLevelSelector({ currentGrade, onSelect }: GradeLevelSelectorProps) {
    const grades = [6, 7, 8, 9];

    return (
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg w-fit">
            {grades.map((grade) => (
                <Button
                    key={grade}
                    variant={currentGrade === grade ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onSelect(grade)}
                    className={cn(
                        "w-20 font-semibold transition-all",
                        currentGrade === grade ? "shadow-sm" : "hover:bg-white/50"
                    )}
                >
                    Grade {grade}
                </Button>
            ))}
        </div>
    );
}
