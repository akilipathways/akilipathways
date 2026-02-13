import Phaser from 'phaser';

export class SpatialAbilityScene extends Phaser.Scene {
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private timerText!: Phaser.GameObjects.Text;
    private timeLeft: number = 60;

    constructor() {
        super({ key: 'SpatialAbility' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#FFF7ED');

        this.add.text(20, 20, 'Spatial Ability: Mental Rotation', {
            fontSize: '24px',
            color: '#EA580C',
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

        this.showQuestion();

        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    showQuestion() {
        // Clear screen logic would go here

        // Question: "Which shape matches the target?"
        this.add.text(400, 150, 'Which option is a rotation of the target?', {
            fontSize: '24px',
            color: '#1E293B'
        }).setOrigin(0.5);

        // Target Shape (L-shape represented by simple graphics)
        // Let's draw an L shape
        const targetContainer = this.add.container(400, 250);
        this.drawLShape(targetContainer, 0xF97316);

        // Options
        const options = [
            { id: 1, correct: false, rotation: 0, mirror: true },
            { id: 2, correct: true, rotation: 90, mirror: false },
            { id: 3, correct: false, rotation: 180, mirror: true },
            { id: 4, correct: false, rotation: 270, mirror: true }
        ];

        options.forEach((opt, index) => {
            const x = 200 + index * 140;
            const y = 450;

            const bg = this.add.rectangle(x, y, 120, 120, 0xFFFFFF)
                .setStrokeStyle(2, 0xCBD5E1)
                .setInteractive({ useHandCursor: true });

            const optContainer = this.add.container(x, y);
            this.drawLShape(optContainer, 0x3B82F6);

            // Apply transformation
            optContainer.setAngle(opt.rotation);
            if (opt.mirror) {
                optContainer.setScale(-1, 1); // Flip horizontal
            }

            bg.on('pointerdown', () => this.handleAnswer(opt.correct));
            bg.on('pointerover', () => bg.setStrokeStyle(4, 0xEA580C));
            bg.on('pointerout', () => bg.setStrokeStyle(2, 0xCBD5E1));
        });
    }

    drawLShape(container: Phaser.GameObjects.Container, color: number) {
        // Draw 3 blocks vertical, 1 block horizontal
        // [ ]
        // [ ]
        // [ ][ ]
        const size = 30;
        const b1 = this.add.rectangle(0, -size, size, size, color).setStrokeStyle(1, 0xFFFFFF);
        const b2 = this.add.rectangle(0, 0, size, size, color).setStrokeStyle(1, 0xFFFFFF);
        const b3 = this.add.rectangle(0, size, size, size, color).setStrokeStyle(1, 0xFFFFFF);
        const b4 = this.add.rectangle(size, size, size, size, color).setStrokeStyle(1, 0xFFFFFF); // The foot

        container.add([b1, b2, b3, b4]);
    }

    handleAnswer(isCorrect: boolean) {
        if (isCorrect) {
            this.score += 20;
            this.scoreText.setText(`Score: ${this.score}`);
            this.cameras.main.flash(500, 0, 255, 0);
            this.add.text(400, 350, 'MATCH!', { fontSize: '48px', color: '#16A34A', fontStyle: 'bold' }).setOrigin(0.5);
        } else {
            this.cameras.main.shake(200, 0.01);
            this.add.text(400, 350, 'NO MATCH', { fontSize: '48px', color: '#DC2626', fontStyle: 'bold' }).setOrigin(0.5);
        }
        this.time.delayedCall(1000, () => this.endGame());
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
            onGameEnd({ score: this.score, maxScore: 20 });
        }
    }
}
