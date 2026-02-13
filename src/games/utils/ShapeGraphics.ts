import Phaser from 'phaser';

export class ShapeGraphics {
    static createShapeTexture(scene: Phaser.Scene, key: string, type: 'TRIANGLE' | 'CROSS' | 'STAR' | 'DIAMOND', size: number, color: number) {
        if (scene.textures.exists(key)) return;

        const graphics = scene.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(color, 1);

        // Draw centered at size/2, size/2
        const c = size / 2;
        const r = size * 0.45;

        graphics.beginPath();

        if (type === 'TRIANGLE') {
            // Equilateral triangle
            graphics.moveTo(c, c - r);
            graphics.lineTo(c + r * 0.866, c + r * 0.5);
            graphics.lineTo(c - r * 0.866, c + r * 0.5);
        } else if (type === 'CROSS') {
            const w = r * 0.4;
            graphics.fillRect(c - w, c - r, w * 2, r * 2);
            graphics.fillRect(c - r, c - w, r * 2, w * 2);
        } else if (type === 'STAR') {
            const points = 5;
            const step = Math.PI / points;
            let angle = -Math.PI / 2;
            const innerR = r * 0.4;

            for (let i = 0; i < points * 2; i++) {
                const radius = i % 2 === 0 ? r : innerR;
                const x = c + Math.cos(angle) * radius;
                const y = c + Math.sin(angle) * radius;
                if (i === 0) graphics.moveTo(x, y);
                else graphics.lineTo(x, y);
                angle += step;
            }
        } else if (type === 'DIAMOND') {
            graphics.moveTo(c, c - r);
            graphics.lineTo(c + r, c);
            graphics.lineTo(c, c + r);
            graphics.lineTo(c - r, c);
        }

        graphics.closePath();
        graphics.fillPath();

        graphics.generateTexture(key, size, size);
    }
}
