import Phaser from 'phaser';

interface WordObject {
    text: Phaser.GameObjects.Text;
    isSynonym: boolean;
    velocity: number;
}

export class VerbalReasoningScene extends Phaser.Scene {
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private timerText!: Phaser.GameObjects.Text;
    private timeLeft: number = 60;
    private targetWordText!: Phaser.GameObjects.Text;
    private fallingWords: WordObject[] = [];
    private spawnTimer!: Phaser.Time.TimerEvent;

    private currentTargetIndex: number = 0;
    private targets = [
        { word: 'HAPPY', synonyms: ['JOYFUL', 'GLAD', 'CONTENT', 'ELATED'], antonyms: ['SAD', 'ANGRY', 'GLUM', 'UPSET'] },
        { word: 'FAST', synonyms: ['QUICK', 'RAPID', 'SWIFT', 'SPEEDY'], antonyms: ['SLOW', 'SLUGGISH', 'LEISURELY', 'LATE'] },
        { word: 'SMART', synonyms: ['CLEVER', 'BRIGHT', 'INTELLIGENT', 'SHARP'], antonyms: ['DULL', 'STUPID', 'SLOW', 'FOOLISH'] },
        { word: 'LARGE', synonyms: ['BIG', 'HUGE', 'MASSIVE', 'GIANT'], antonyms: ['SMALL', 'TINY', 'LITTLE', 'MINI'] },
        { word: 'BRAVE', synonyms: ['BOLD', 'HEROIC', 'COURAGEOUS', 'FEARLESS'], antonyms: ['SCARED', 'COWARDLY', 'TIMID', 'WEAK'] }
    ];

    constructor() {
        super({ key: 'VerbalReasoning' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#F0F9FF');

        // UI Headers
        this.add.text(20, 20, 'Verbal Reasoning: Synonym Sniper', {
            fontSize: '24px',
            color: '#2C5AA0',
            fontStyle: 'bold'
        });

        this.scoreText = this.add.text(20, 60, 'Score: 0', {
            fontSize: '20px',
            color: '#1E293B'
        });

        this.timerText = this.add.text(700, 20, `Time: ${this.timeLeft}`, {
            fontSize: '24px',
            color: '#D97706'
        });

        // Instructions
        this.add.text(400, 100, 'Click falling words that are SYNONYMS of the target!', {
            fontSize: '18px',
            color: '#64748B'
        }).setOrigin(0.5);

        // Target Word Display (Bottom Center)
        this.add.rectangle(400, 550, 300, 60, 0x2C5AA0).setStrokeStyle(4, 0x1E293B);
        this.targetWordText = this.add.text(400, 550, '', {
            fontSize: '32px',
            color: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.setNewTarget();

        // Game Loop Timers
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        this.spawnTimer = this.time.addEvent({
            delay: 1500,
            callback: this.spawnWord,
            callbackScope: this,
            loop: true
        });
    }

    update(_time: number, delta: number) {
        // Update falling words positions
        for (let i = this.fallingWords.length - 1; i >= 0; i--) {
            const wordObj = this.fallingWords[i];
            wordObj.text.y += wordObj.velocity * (delta / 16);

            // Check if missed (hit bottom)
            if (wordObj.text.y > 600) {
                if (wordObj.isSynonym) {
                    // Penalty for missing a correct word
                    this.cameras.main.shake(100, 0.005);
                    this.score = Math.max(0, this.score - 5);
                    this.scoreText.setText(`Score: ${this.score}`);
                }
                wordObj.text.destroy();
                this.fallingWords.splice(i, 1);
            }
        }
    }

    setNewTarget() {
        // Change target every 15 seconds or randomly? 
        // For now, let's just stick to one for a bit, then switch?
        // Actually, let's randomly pick one at start of round, or cycle through.
        const target = this.targets[this.currentTargetIndex];
        this.targetWordText.setText(target.word);
    }

    spawnWord() {
        if (this.timeLeft <= 0) return;

        const target = this.targets[this.currentTargetIndex];
        const isSynonym = Math.random() > 0.5;
        let wordText = '';

        if (isSynonym) {
            wordText = Phaser.Utils.Array.GetRandom(target.synonyms);
        } else {
            wordText = Phaser.Utils.Array.GetRandom(target.antonyms);
        }

        const x = Phaser.Math.Between(50, 750);
        const velocity = Phaser.Math.Between(2, 4);

        const textObj = this.add.text(x, -50, wordText, {
            fontSize: '20px',
            color: '#0F172A',
            backgroundColor: '#E2E8F0',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true });

        // Circular body for physics-like interaction area? Rectangle is fine.

        textObj.on('pointerdown', () => {
            if (isSynonym) {
                this.score += 10;
                this.scoreText.setText(`Score: ${this.score}`);
                // Visual feedback
                this.add.text(textObj.x, textObj.y, '+10', { color: '#16A34A', fontSize: '24px' }).setOrigin(0.5);

                // Maybe switch target after 3 correct hits?
                if (this.score % 30 === 0) {
                    this.currentTargetIndex = (this.currentTargetIndex + 1) % this.targets.length;
                    this.setNewTarget();
                    // Flash new target
                    this.cameras.main.flash(200, 44, 90, 160);
                }

            } else {
                this.score = Math.max(0, this.score - 5);
                this.scoreText.setText(`Score: ${this.score}`);
                this.cameras.main.shake(100, 0.01);
                this.add.text(textObj.x, textObj.y, '-5', { color: '#DC2626', fontSize: '24px' }).setOrigin(0.5);
            }

            textObj.destroy();
            // Remove from array
            this.fallingWords = this.fallingWords.filter(w => w.text !== textObj);
        });

        this.fallingWords.push({ text: textObj, isSynonym, velocity });
    }

    updateTimer() {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}`);
        if (this.timeLeft <= 0) {
            this.spawnTimer.remove();
            this.fallingWords.forEach(w => w.text.destroy());
            this.fallingWords = [];
            this.endGame();
        }
    }

    endGame() {
        this.physics.pause();
        const onGameEnd = this.registry.get('onGameEnd');
        if (onGameEnd) {
            onGameEnd({ score: this.score, maxScore: 100 });
        }
    }
}
