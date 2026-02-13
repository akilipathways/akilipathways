import Phaser from 'phaser';
import { ShapeGraphics } from '@/games/utils/ShapeGraphics';

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

        // Generate Textures
        ShapeGraphics.createShapeTexture(this, 'shape-circle-red', 'DIAMOND', 100, 0xEF4444); // Hack: Using Diamond for now as Circle replacement or add Circle to util?
        // Actually, let's just use Phaser's circle for Circle, but use textures for others.
        // Update: Added DIAMOND, CROSS, STAR to util.
        ShapeGraphics.createShapeTexture(this, 'shape-triangle-red', 'TRIANGLE', 100, 0xEF4444);
        ShapeGraphics.createShapeTexture(this, 'shape-triangle-blue', 'TRIANGLE', 100, 0x3B82F6);
        ShapeGraphics.createShapeTexture(this, 'shape-square-blue', 'CROSS', 100, 0x3B82F6); // Let's vary it
        ShapeGraphics.createShapeTexture(this, 'shape-star-green', 'STAR', 100, 0x22C55E);
        ShapeGraphics.createShapeTexture(this, 'shape-cross-blue', 'CROSS', 100, 0x3B82F6);
        ShapeGraphics.createShapeTexture(this, 'shape-diamond-red', 'DIAMOND', 100, 0xEF4444);

        // Matrix Area
        this.add.rectangle(250, 350, 400, 400, 0xE2E8F0).setStrokeStyle(2, 0x94A3B8);
        this.gridZone = this.add.container(250, 350);

        // Options Area
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
        this.gridZone.removeAll(true);
        this.optionsZone.removeAll(true);

        // Pattern: Row 1: Diamond Red -> Triangle Blue
        // Row 2: Triangle Red -> ? (Diamond Blue)
        // Rule: Shape alternates, Color alternates?
        // Let's do:
        // [ Diamond Red ] [ Triangle Blue ]
        // [ Triangle Red ] [ ? ]
        // Answer: Diamond Blue

        // Draw Matrix
        this.drawShape(this.gridZone, -100, -100, 'shape-diamond-red');
        this.drawShape(this.gridZone, 100, -100, 'shape-triangle-blue');
        this.drawShape(this.gridZone, -100, 100, 'shape-triangle-red'); // Need to gen this texture?
        // Oops, I didn't generate triangle-red above, I did diamond-red and triangle-red.
        // Wait, I did generate triangle-red.

        // Question Mark
        const questionBox = this.add.rectangle(100, 100, 150, 150, 0xFFFFFF).setStrokeStyle(2, 0x000000);
        const qText = this.add.text(100, 100, '?', { fontSize: '64px', color: '#000000' }).setOrigin(0.5);
        this.gridZone.add([questionBox, qText]);

        // Options
        // we need a Diamond Blue texture
        ShapeGraphics.createShapeTexture(this, 'shape-diamond-blue', 'DIAMOND', 80, 0x3B82F6);
        ShapeGraphics.createShapeTexture(this, 'shape-star-blue', 'STAR', 80, 0x3B82F6);

        const options = [
            { key: 'shape-star-green', correct: false },
            { key: 'shape-triangle-blue', correct: false },
            { key: 'shape-diamond-blue', correct: true },
            { key: 'shape-cross-blue', correct: false }
        ];

        options.forEach((opt, index) => {
            const x = 600 + (index % 2) * 160;
            const y = 300 + Math.floor(index / 2) * 160;

            const bg = this.add.rectangle(x, y, 140, 140, 0xFFFFFF)
                .setStrokeStyle(2, 0xCBD5E1)
                .setInteractive({ useHandCursor: true });

            this.createShapeSprite(x, y, opt.key);

            bg.on('pointerdown', () => this.handleAnswer(opt.correct));
            bg.on('pointerover', () => bg.setStrokeStyle(4, 0x2C5AA0));
            bg.on('pointerout', () => bg.setStrokeStyle(2, 0xCBD5E1));
        });
    }

    drawShape(container: Phaser.GameObjects.Container, x: number, y: number, key: string) {
        const bg = this.add.rectangle(x, y, 150, 150, 0xFFFFFF).setStrokeStyle(2, 0xCBD5E1);
        const shape = this.add.sprite(x, y, key);
        container.add([bg, shape]);
    }

    createShapeSprite(x: number, y: number, key: string) {
        return this.add.sprite(x, y, key);
    }

    handleAnswer(isCorrect: boolean) {
        if (isCorrect) {
            this.score += 20;
            this.cameras.main.flash(500, 0, 255, 0);
            this.scoreText.setText(`Score: ${this.score}`);
            this.add.text(400, 300, 'CORRECT!', { fontSize: '48px', color: '#16A34A', fontStyle: 'bold' }).setOrigin(0.5);
            this.endGame();
        } else {
            this.cameras.main.shake(200, 0.01);
            this.add.text(400, 300, 'TRY AGAIN', { fontSize: '48px', color: '#DC2626', fontStyle: 'bold' }).setOrigin(0.5);
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
