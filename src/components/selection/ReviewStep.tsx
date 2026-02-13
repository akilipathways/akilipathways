import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Download } from 'lucide-react';

export function ReviewStep() {
    return (
        <div className="space-y-6 text-center">
            <div className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-green-800">Selection Complete!</h2>
                <p className="text-green-700 max-w-md mx-auto mt-2">
                    You have successfully selected your Pathway, Track, Subject Combination, and 12 Schools.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="text-slate-500 text-sm">Pathway:</span>
                            <p className="font-semibold">STEM</p>
                        </div>
                        <div>
                            <span className="text-slate-500 text-sm">Track:</span>
                            <p className="font-semibold">Pure Sciences</p>
                        </div>
                        <div>
                            <span className="text-slate-500 text-sm">Combination:</span>
                            <p className="font-semibold">Physics, Chemistry, Biology</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-600">
                            Your selection has been saved to your profile. You can download the official Ministry of Education selection form below.
                        </p>
                        <Button className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download KNEIS Form
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
