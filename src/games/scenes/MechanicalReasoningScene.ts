import Phaser from 'phaser';
import { GearGraphics } from '@/games/utils/GearGraphics';

export class MechanicalReasoningScene extends Phaser.Scene {
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private gears: Phaser.GameObjects.Sprite[] = [];

    constructor() {
        super({ key: 'MechanicalReasoning' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#F1F5F9');

        this.add.text(20, 20, 'Mechanical Reasoning: Gear Logic', {
            fontSize: '24px',
            color: '#2C5AA0',
            fontStyle: 'bold'
        });

        this.scoreText = this.add.text(20, 60, 'Score: 0', {
            fontSize: '20px',
            color: '#1E293B'
        });

        // Generate textures
        GearGraphics.createGearTexture(this, 'gear-small', 60, 12, 0x94A3B8);
        GearGraphics.createGearTexture(this, 'gear-medium', 80, 16, 0x64748B);
        GearGraphics.createGearTexture(this, 'gear-target', 60, 12, 0xF59E0B);

        this.showQuestion();
    }

    showQuestion() {
        // Clear previous
        this.gears.forEach(g => g.destroy());
        this.gears = [];

        // Simple 3-Gear Train
        // Gear 1 (Driver) -> Gear 2 -> Gear 3 (Target)

        // Gear 1
        const g1 = this.add.sprite(200, 300, 'gear-small');
        this.add.text(190, 290, 'A', { color: '#000', fontStyle: 'bold' }).setOrigin(0.5); // Center on gear, maybe better visibility

        // Gear 2 (Meshed with 1)
        // Distance = r1 + r2 + toothDepth * 2 (approx)
        // 60 + 80 + 20 = 160
        const g2 = this.add.sprite(200 + 150, 300, 'gear-medium');

        // Gear 3 (Meshed with 2)
        // 80 + 60 + 20 = 160
        const g3 = this.add.sprite(200 + 150 + 150, 300, 'gear-target');
        this.add.text(200 + 150 + 150, 300, '?', { color: '#000', fontSize: '24px', fontStyle: 'bold' }).setOrigin(0.5);

        this.gears.push(g1, g2, g3);

        // Animate Driver Gear (Clockwise)
        this.tweens.add({
            targets: g1,
            angle: 360,
            duration: 4000,
            repeat: -1,
            ease: 'Linear'
        });

        // Animate Middle Gear (Counter-Clockwise)
        // Ratio 12 teeth / 16 teeth = 0.75
        // Duration should be longer for bigger gear to match linear speed?
        // angular velocity w = v / r
        // w1 * r1 = w2 * r2
        // 360/4000 * 60 = w2 * 80
        // w2 = (360/4000) * (60/80) = 0.09 * 0.75 = 0.0675 deg/ms
        // Duration for 360 = 360 / 0.0675 = 5333 ms
        this.tweens.add({
            targets: g2,
            angle: -360,
            duration: 5333,
            repeat: -1,
            ease: 'Linear'
        });

        // Target Gear (Static for now, user must guess)

        this.add.text(400, 150, 'If Gear A turns Clockwise,\nwhich way will the Orange Gear turn?', {
            fontSize: '24px',
            color: '#0F172A',
            align: 'center'
        }).setOrigin(0.5);

        // Options
        const btnCW = this.add.rectangle(300, 500, 150, 60, 0x2C5AA0).setInteractive({ useHandCursor: true });
        this.add.text(300, 500, 'Clockwise', { fontSize: '20px', color: '#FFF' }).setOrigin(0.5);

        const btnCCW = this.add.rectangle(500, 500, 150, 60, 0x2C5AA0).setInteractive({ useHandCursor: true });
        this.add.text(500, 500, 'Counter-CW', { fontSize: '20px', color: '#FFF' }).setOrigin(0.5);

        // Logic: A(CW) -> B(CCW) -> C(CW)
        // Correct: Clockwise

        btnCW.on('pointerdown', () => this.handleAnswer(true, g3));
        btnCCW.on('pointerdown', () => this.handleAnswer(false, g3));
    }

    handleAnswer(isClockwise: boolean, targetGear: Phaser.GameObjects.Sprite) {
        const isCorrect = isClockwise === true;

        if (isCorrect) {
            this.score += 20;
            this.scoreText.setText(`Score: ${this.score}`);
            this.add.text(400, 400, 'CORRECT!', { color: '#16A34A', fontSize: '32px' }).setOrigin(0.5);

            // Animate result
            this.tweens.add({
                targets: targetGear,
                angle: 360,
                duration: 4000,
                repeat: -1,
                ease: 'Linear'
            });

            // End after success
            this.time.delayedCall(2000, () => this.endGame());

        } else {
            this.cameras.main.shake(100, 0.01);
            this.add.text(400, 400, 'WRONG', { color: '#DC2626', fontSize: '32px' }).setOrigin(0.5);
            this.time.delayedCall(1000, () => this.endGame());
        }
    }

    endGame() {
        const onGameEnd = this.registry.get('onGameEnd');
        if (onGameEnd) {
            onGameEnd({ score: this.score, maxScore: 20 });
        }
    }
}
