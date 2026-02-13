import { ReactNode } from 'react';
import { Navigation } from '@/components/common/Navigation';

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-background-light flex flex-col">
            <Navigation />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-primary-blue text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>© 2026 Dymz Ltd. All Rights Reserved.</p>
                    <p className="text-sm mt-2">Akili Pathways™ is a registered trademark.</p>
                </div>
            </footer>
        </div>
    );
}
