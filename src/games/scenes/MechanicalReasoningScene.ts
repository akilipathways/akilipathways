import Phaser from 'phaser';

export class MechanicalReasoningScene extends Phaser.Scene {
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private gears: Phaser.GameObjects.Arc[] = [];
    private arrows: Phaser.GameObjects.Text[] = [];

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

        this.showQuestion();
    }

    showQuestion() {
        // Clear previous
        this.gears.forEach(g => g.destroy());
        this.arrows.forEach(a => a.destroy());
        this.gears = [];
        this.arrows = [];

        // Simple 3-Gear Train
        // Gear 1 (Driver) -> Gear 2 -> Gear 3 (Target)

        // Gear 1
        const g1 = this.createGear(200, 300, 60, 0x334155);
        this.add.text(190, 290, 'A', { color: '#FFF' });

        // Gear 2
        const g2 = this.createGear(340, 300, 80, 0x475569);

        // Gear 3
        const g3 = this.createGear(500, 300, 60, 0xD97706); // Target color
        this.add.text(490, 290, '?', { color: '#FFF', fontSize: '24px' });

        this.gears.push(g1, g2, g3);

        // Animate Driver Gear (Clockwise)
        this.tweens.add({
            targets: g1,
            angle: 360,
            duration: 2000,
            repeat: -1
        });

        // Animate Middle Gear (Counter-Clockwise)
        this.tweens.add({
            targets: g2,
            angle: -360,
            duration: 2000 * (80 / 60), // Slower because bigger
            repeat: -1
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

    createGear(x: number, y: number, radius: number, color: number) {
        // Draw a circle with "teeth" (rectangles)
        const container = this.add.container(x, y);
        const circle = this.add.circle(0, 0, radius, color);
        container.add(circle);

        // Add visual indicator of rotation (a line)
        const line = this.add.rectangle(0, 0, radius * 1.5, 5, 0xFFFFFF);
        container.add(line);

        // Add cross
        const line2 = this.add.rectangle(0, 0, 5, radius * 1.5, 0xFFFFFF);
        container.add(line2);

        // We return the container as the "gear"
        // But containers don't have 'angle' tweening the way we expect sometimes in simple setup? 
        // Actually Scene.add.container returns a GO that can be rotated.

        // Wait, 'Arc' type in my Class property description might be wrong if I use Container. 
        // Let's just return the Container and cast or change type content.

        return container as unknown as Phaser.GameObjects.Arc;
    }

    handleAnswer(isClockwise: boolean, targetGear: any) {
        // For this specific setup (1-2-3), Connection is Odd (1-3), so direction matches?
        // 1(CW) -> 2(CCW) -> 3(CW)
        // So Correct is Clockwise.

        const isCorrect = isClockwise === true;

        if (isCorrect) {
            this.score += 20;
            this.scoreText.setText(`Score: ${this.score}`);
            this.add.text(400, 400, 'CORRECT!', { color: '#16A34A', fontSize: '32px' }).setOrigin(0.5);

            // Animate result
            this.tweens.add({
                targets: targetGear,
                angle: 360,
                duration: 2000,
                repeat: -1
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
            onGameEnd({ score: this.score, maxScore: 20 }); // Single question demo
        }
    }
}
