import Phaser from 'phaser';

export class NumericalReasoningScene extends Phaser.Scene {
    private score: number = 0;
    private timerText!: Phaser.GameObjects.Text;
    private timeLeft: number = 30;

    constructor() {
        super({ key: 'NumericalReasoning' });
    }

    preload() {
        // Load assets here (images, sounds)
    }

    create() {
        // Background
        this.cameras.main.setBackgroundColor('#F0F9FF');

        // UI Elements
        this.add.text(20, 20, 'Numerical Reasoning', {
            fontSize: '24px',
            color: '#2C5AA0',
            fontStyle: 'bold'
        });

        this.timerText = this.add.text(700, 20, `Time: ${this.timeLeft}`, {
            fontSize: '24px',
            color: '#D97706'
        });

        // Start Question Flow
        this.showQuestion();

        // Timer Loop
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        this.timeLeft--;
        if (this.timerText) {
            this.timerText.setText(`Time: ${this.timeLeft}`);
        }
        if (this.timeLeft <= 0) {
            this.handleTimeout();
        }
    }

    showQuestion() {
        // Sample Question: Number Pattern
        // 2, 4, 8, 16, ?

        this.add.text(400, 200, 'Complete the pattern:\n2, 4, 8, 16, __', {
            fontSize: '32px',
            color: '#1E293B',
            align: 'center'
        }).setOrigin(0.5);

        // Options
        const options = [
            { text: '24', correct: false },
            { text: '32', correct: true },
            { text: '30', correct: false },
            { text: '64', correct: false }
        ];

        options.forEach((opt, index) => {
            this.add.rectangle(200 + (index * 140), 400, 120, 60, 0x2C5AA0)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.handleAnswer(opt.correct));

            this.add.text(200 + (index * 140), 400, opt.text, {
                fontSize: '24px',
                color: '#FFFFFF'
            }).setOrigin(0.5);
        });
    }

    handleAnswer(isCorrect: boolean) {
        if (isCorrect) {
            this.score += 10;
            this.cameras.main.flash(500, 0, 255, 0);
        } else {
            this.cameras.main.shake(200, 0.01);
        }
        // Demo: End game after 1 answer for quick testing, or maybe 5?
        // Let's just end it here for now to prove connection
        this.endGame();
    }

    handleTimeout() {
        this.endGame();
    }

    endGame() {
        const onGameEnd = this.registry.get('onGameEnd');
        if (onGameEnd) {
            onGameEnd({ score: this.score, maxScore: 100 }); // Assuming 10 questions * 10 points
        }
    }
}
