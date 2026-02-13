import Phaser from 'phaser';
import { CubeGraphics } from '@/games/utils/CubeGraphics';

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

        // Generate Textures
        CubeGraphics.createCubeTexture(this, 'cube-orange', 50, 0xF97316);
        CubeGraphics.createCubeTexture(this, 'cube-blue', 50, 0x3B82F6);

        this.showQuestion();

        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    showQuestion() {
        // Question: "Which shape matches the target?"
        this.add.text(400, 150, 'Which option is a rotation of the target?', {
            fontSize: '24px',
            color: '#1E293B'
        }).setOrigin(0.5);

        // Target Shape (3D L-shape)
        const targetContainer = this.add.container(400, 280);
        this.drawLShape(targetContainer, 'cube-orange');

        // Options
        const options = [
            { id: 1, correct: false, rotation: 0, mirror: true },
            { id: 2, correct: true, rotation: 0, mirror: false, angleOffset: 90 }, // Visual rotation
            { id: 3, correct: false, rotation: 0, mirror: true, angleOffset: 180 },
            { id: 4, correct: false, rotation: 0, mirror: true, angleOffset: -90 }
        ];

        // We can't easily "rotate" the 3D sprite composite 90 degrees around Z axis to look like 3D rotation without redrawing from new perspective.
        // For this demo polish, we'll just rotate the generic container in 2D, which looks like "spinning on the table".
        // It's acceptable for "Spatial Ability" to test 2D rotation of 3D objects.

        options.forEach((opt, index) => {
            const x = 200 + index * 140;
            const y = 500;

            const bg = this.add.rectangle(x, y, 120, 120, 0xFFFFFF)
                .setStrokeStyle(2, 0xCBD5E1)
                .setInteractive({ useHandCursor: true });

            const optContainer = this.add.container(x, y);
            this.drawLShape(optContainer, 'cube-blue');

            // Apply transformation
            // For correct one, we just rotate it 90 degrees?
            // "Rotation of the target" means it matches 2D rotation.

            if (opt.mirror) {
                // Mirroring makes it impossible to match by rotation usually
                optContainer.setScale(-0.8, 0.8); // Scale down a bit to fit
            } else {
                optContainer.setScale(0.8);
            }

            if (opt.angleOffset) {
                optContainer.setAngle(opt.angleOffset);
            }
            // Add some base rotation variance?
            // optContainer.angle += opt.rotation;

            bg.on('pointerdown', () => this.handleAnswer(opt.correct));
            bg.on('pointerover', () => bg.setStrokeStyle(4, 0xEA580C));
            bg.on('pointerout', () => bg.setStrokeStyle(2, 0xCBD5E1));
        });
    }

    drawLShape(container: Phaser.GameObjects.Container, texture: string) {
        // Draw 3 blocks vertical, 1 block horizontal attached to bottom
        // Stack from bottom up to handle Z-order
        const size = 50;
        const stepY = size * 0.6; // Isometric spacing roughly

        // Foot (Right)
        const b4 = this.add.sprite(size * 0.8, size * 0.5, texture);

        // Bottom Vertical
        const b1 = this.add.sprite(0, size * 0.5, texture);

        // Middle Vertical
        const b2 = this.add.sprite(0, size * 0.5 - stepY, texture);

        // Top Vertical
        const b3 = this.add.sprite(0, size * 0.5 - stepY * 2, texture);

        // Sorting: back-most first?
        // With z-index in container?
        // b4 is 'in front' or 'beside' b1?
        // In isometric, lower on screen is usually 'front'.
        // b1 and b4 are at same Y.
        // Let's add them in visual order back-to-front.

        container.add([b3, b2, b1, b4]);
    }

    handleAnswer(isCorrect: boolean) {
        if (isCorrect) {
            this.score += 20;
            this.scoreText.setText(`Score: ${this.score}`);
            this.cameras.main.flash(500, 0, 255, 0);
            this.add.text(400, 350, 'MATCH!', { fontSize: '48px', color: '#16A34A', fontStyle: 'bold' }).setOrigin(0.5);
            this.endGame();
        } else {
            this.cameras.main.shake(200, 0.01);
            this.add.text(400, 350, 'NO MATCH', { fontSize: '48px', color: '#DC2626', fontStyle: 'bold' }).setOrigin(0.5);
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
            onGameEnd({ score: this.score, maxScore: 20 });
        }
    }
}
