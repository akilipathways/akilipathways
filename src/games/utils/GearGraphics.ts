import Phaser from 'phaser';

export class GearGraphics {
    static createGearTexture(scene: Phaser.Scene, key: string, radius: number, teeth: number, color: number) {
        if (scene.textures.exists(key)) return;

        const graphics = scene.make.graphics({ x: 0, y: 0 });

        const outerRadius = radius;
        const innerRadius = radius * 0.85;
        const holeRadius = radius * 0.2;
        const toothDepth = 10;

        graphics.fillStyle(color, 1);
        graphics.lineStyle(2, 0x000000, 1);

        // Draw gear body
        graphics.beginPath();

        const step = (Math.PI * 2) / teeth;
        const halfStep = step / 2;

        for (let i = 0; i < teeth; i++) {
            const angle = i * step;

            // Tooth start
            const x1 = Math.cos(angle - halfStep * 0.5) * innerRadius;
            const y1 = Math.sin(angle - halfStep * 0.5) * innerRadius;

            // Tooth peak 1
            const x2 = Math.cos(angle - halfStep * 0.2) * outerRadius;
            const y2 = Math.sin(angle - halfStep * 0.2) * outerRadius;

            // Tooth peak 2
            const x3 = Math.cos(angle + halfStep * 0.2) * outerRadius;
            const y3 = Math.sin(angle + halfStep * 0.2) * outerRadius;

            // Tooth end
            const x4 = Math.cos(angle + halfStep * 0.5) * innerRadius;
            const y4 = Math.sin(angle + halfStep * 0.5) * innerRadius;

            if (i === 0) {
                graphics.moveTo(x1 + radius + toothDepth, y1 + radius + toothDepth);
            }

            // Draw tooth
            graphics.lineTo(x2 + radius + toothDepth, y2 + radius + toothDepth);
            graphics.lineTo(x3 + radius + toothDepth, y3 + radius + toothDepth);
            graphics.lineTo(x4 + radius + toothDepth, y4 + radius + toothDepth);

            // Draw arc to next tooth
            const nextAngle = (i + 1) * step;
            const nextX = Math.cos(nextAngle - halfStep * 0.5) * innerRadius;
            const nextY = Math.sin(nextAngle - halfStep * 0.5) * innerRadius;
            // Simplified straight line for now between teeth
            graphics.lineTo(nextX + radius + toothDepth, nextY + radius + toothDepth);
        }

        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();

        // Center hole
        graphics.fillStyle(0x333333, 1);
        graphics.fillCircle(radius + toothDepth, radius + toothDepth, holeRadius);

        // Spokes (optional visual detail)
        graphics.lineStyle(4, 0x000000, 0.3);
        graphics.strokeCircle(radius + toothDepth, radius + toothDepth, innerRadius * 0.6);

        graphics.generateTexture(key, (radius + toothDepth) * 2, (radius + toothDepth) * 2);
    }
}
