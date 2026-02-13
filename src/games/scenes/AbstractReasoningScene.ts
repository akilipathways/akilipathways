import Phaser from 'phaser';

export class AbstractReasoningScene extends Phaser.Scene {
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private timerText!: Phaser.GameObjects.Text;
    private timeLeft: number = 90;

    private gridZone!: Phaser.GameObjects.Container;
    private optionsZone!: Phaser.GameObjects.Container;

    constructor() {
        super({ key: 'AbstractReasoning' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#F8FAFC');

        // Header
        this.add.text(20, 20, 'Abstract Reasoning: Pattern Matrix', {
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

        // Main Matrix Area (Left)
        this.add.rectangle(250, 350, 400, 400, 0xE2E8F0).setStrokeStyle(2, 0x94A3B8);
        this.gridZone = this.add.container(250, 350);

        // Options Area (Right)
        this.add.text(600, 200, 'Select the missing piece:', {
            fontSize: '18px',
            color: '#64748B'
        });
        this.optionsZone = this.add.container(650, 350);

        this.generateLevel();

        // Timer
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    generateLevel() {
        // Clear previous
        this.gridZone.removeAll(true);
        this.optionsZone.removeAll(true);

        // For this demo, let's just draw a preset 2x2 matrix
        // [ Circle Red ] [ Circle Blue ]
        // [ Square Red ] [ ? ]
        // Answer: Square Blue

        // Draw Matrix Background Grid
        // Top Left
        this.drawShape(this.gridZone, -100, -100, 'CIRCLE', 0xEF4444);
        // Top Right
        this.drawShape(this.gridZone, 100, -100, 'CIRCLE', 0x3B82F6);
        // Bottom Left
        this.drawShape(this.gridZone, -100, 100, 'SQUARE', 0xEF4444);
        // Bottom Right (Question Mark)
        const questionBox = this.add.rectangle(100, 100, 150, 150, 0xFFFFFF).setStrokeStyle(2, 0x000000);
        const qText = this.add.text(100, 100, '?', { fontSize: '64px', color: '#000000' }).setOrigin(0.5);
        this.gridZone.add([questionBox, qText]);

        // Generate Options
        const options = [
            { type: 'SQUARE', color: 0x22C55E, correct: false }, // Green Square
            { type: 'CIRCLE', color: 0x3B82F6, correct: false }, // Blue Circle
            { type: 'SQUARE', color: 0x3B82F6, correct: true },  // Blue Square (Correct)
            { type: 'TRIANGLE', color: 0xEF4444, correct: false } // Red Triangle
        ];

        options.forEach((opt, index) => {
            const x = 600 + (index % 2) * 160;
            const y = 300 + Math.floor(index / 2) * 160;

            const bg = this.add.rectangle(x, y, 140, 140, 0xFFFFFF)
                .setStrokeStyle(2, 0xCBD5E1)
                .setInteractive({ useHandCursor: true });

            this.createShapeSprite(x, y, opt.type, opt.color);

            bg.on('pointerdown', () => this.handleAnswer(opt.correct));
            // Hover effect
            bg.on('pointerover', () => bg.setStrokeStyle(4, 0x2C5AA0));
            bg.on('pointerout', () => bg.setStrokeStyle(2, 0xCBD5E1));
        });
    }

    drawShape(container: Phaser.GameObjects.Container, x: number, y: number, type: string, color: number) {
        const bg = this.add.rectangle(x, y, 150, 150, 0xFFFFFF).setStrokeStyle(2, 0xCBD5E1);
        let shape: Phaser.GameObjects.Shape;

        if (type === 'CIRCLE') {
            shape = this.add.circle(x, y, 50, color);
        } else if (type === 'SQUARE') {
            shape = this.add.rectangle(x, y, 100, 100, color);
        } else {
            shape = this.add.triangle(x, y, 0, -50, 50, 50, -50, 50, color);
        }

        container.add([bg, shape]);
    }

    createShapeSprite(x: number, y: number, type: string, color: number) {
        if (type === 'CIRCLE') {
            return this.add.circle(x, y, 40, color);
        } else if (type === 'SQUARE') {
            return this.add.rectangle(x, y, 80, 80, color);
        } else {
            return this.add.triangle(x, y, 0, -40, 40, 40, -40, 40, color);
        }
    }

    handleAnswer(isCorrect: boolean) {
        if (isCorrect) {
            this.score += 20;
            this.cameras.main.flash(500, 0, 255, 0);
            this.scoreText.setText(`Score: ${this.score}`);
            this.add.text(400, 300, 'CORRECT!', { fontSize: '48px', color: '#16A34A', fontStyle: 'bold' }).setOrigin(0.5);

            // Advance level?
            // For demo end here
            this.endGame();
        } else {
            this.cameras.main.shake(200, 0.01);
            this.add.text(400, 300, 'TRY AGAIN', { fontSize: '48px', color: '#DC2626', fontStyle: 'bold' }).setOrigin(0.5);
            // End game on wrong answer too for demo? Or just penalize?
            // Let's end for throughput
            this.time.delayedCall(1000, () => this.endGame());
        }
    }

    updateTimer() {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}`);
        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    endGame() {
        const onGameEnd = this.registry.get('onGameEnd');
        if (onGameEnd) {
            onGameEnd({ score: this.score, maxScore: 100 });
        }
    }
}
