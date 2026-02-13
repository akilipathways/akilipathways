import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useAuth } from '@/context/AuthContext';
import { assessmentService } from '@/services/assessmentService';
import { useNavigate } from 'react-router-dom';

interface GameWrapperProps {
    config: Phaser.Types.Core.GameConfig;
    domainCode: string;
}

export const GameWrapper: React.FC<GameWrapperProps> = ({ config, domainCode }) => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const initSession = async () => {
            if (!user) return;

            const id = await assessmentService.startSession(user.id, domainCode);
            if (id) {
                setSessionId(id);
                setInitializing(false);
            } else {
                // If session init fails, maybe let them play but warn? Or block?
                // For now, let's proceed but log error
                console.error("Failed to start session");
                setInitializing(false);
            }
        };

        initSession();
    }, [user, domainCode]);

    useEffect(() => {
        if (initializing || !user || gameRef.current) return;

        // Create a unique parent ID
        const parentId = 'phaser-container';

        const handleGameEnd = async (data: { score: number, maxScore: number }) => {
            console.log("Game Over:", data);
            if (sessionId) {
                await assessmentService.completeSession(
                    sessionId,
                    user.id,
                    domainCode,
                    data.score,
                    data.maxScore
                );
            }
            // Navigate back to lobby after short delay
            setTimeout(() => {
                navigate('/assessment');
            }, 1000); // Wait 1s and go back
        };

        const bootConfig = {
            ...config,
            parent: parentId,
            callbacks: {
                ...config.callbacks,
                postBoot: (game: Phaser.Game) => {
                    // Expose session ID and callback
                    game.registry.set('sessionId', sessionId);
                    game.registry.set('onGameEnd', handleGameEnd);
                }
            }
        };

        gameRef.current = new Phaser.Game(bootConfig);

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [initializing, config, sessionId, user, navigate, domainCode]);

    if (initializing) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-slate-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mr-4"></div>
                Initializing Assessment...
            </div>
        );
    }

    return <div id="phaser-container" className="w-full h-full min-h-[600px] rounded-lg overflow-hidden shadow-lg" />;
};
