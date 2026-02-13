import Phaser from 'phaser';

export class CubeGraphics {
    static createCubeTexture(scene: Phaser.Scene, key: string, size: number, color: number) {
        if (scene.textures.exists(key)) return;

        const graphics = scene.make.graphics({ x: 0, y: 0 });

        // Isometric Cube Drawing
        // Top Face (Lighter)
        // Left Face (Normal)
        // Right Face (Darker)

        const c = size / 2;
        const scale = 0.8; // fit within size
        const w = (size / 2) * scale;
        const h = (size / 4) * scale; // isometric squash

        // We draw relative to center `c, c`
        // But graphics drawing starts at 0,0 usually unless we shift. 
        // Let's calculate points.

        // Top Face (Rhombus)
        // Top point
        const tX = c;
        const tY = c - w;
        // Right point
        const rX = c + w;
        const rY = c - h;
        // Bottom point (center of Y-shape)
        const bX = c;
        const bY = c;
        // Left point
        const lX = c - w;
        const lY = c - h;

        // Bottom Drop (Height of cube)
        const drop = w;

        // Colors
        const baseColor = Phaser.Display.Color.IntegerToColor(color);
        const topColor = baseColor.clone().lighten(20).color;
        const leftColor = color;
        const rightColor = baseColor.clone().darken(20).color;

        // Draw Top
        graphics.fillStyle(topColor, 1);
        graphics.beginPath();
        graphics.moveTo(tX, tY);
        graphics.lineTo(rX, rY);
        graphics.lineTo(bX, bY);
        graphics.lineTo(lX, lY);
        graphics.closePath();
        graphics.fillPath();

        // Draw Left Face
        graphics.fillStyle(leftColor, 1);
        graphics.beginPath();
        graphics.moveTo(lX, lY);
        graphics.lineTo(bX, bY);
        graphics.lineTo(bX, bY + drop);
        graphics.lineTo(lX, lY + drop);
        graphics.closePath();
        graphics.fillPath();

        // Draw Right Face
        graphics.fillStyle(rightColor, 1);
        graphics.beginPath();
        graphics.moveTo(bX, bY);
        graphics.lineTo(rX, rY);
        graphics.lineTo(rX, rY + drop);
        graphics.lineTo(bX, bY + drop);
        graphics.closePath();
        graphics.fillPath();

        // Outline
        graphics.lineStyle(2, 0x000000, 1);
        // Outer border
        graphics.beginPath();
        graphics.moveTo(tX, tY);
        graphics.lineTo(rX, rY);
        graphics.lineTo(rX, rY + drop);
        graphics.lineTo(bX, bY + drop);
        graphics.lineTo(lX, lY + drop);
        graphics.lineTo(lX, lY);
        graphics.closePath();
        graphics.strokePath();

        // Inner Y
        graphics.beginPath();
        graphics.moveTo(bX, bY);
        graphics.lineTo(bX, bY + drop);
        graphics.moveTo(bX, bY);
        graphics.lineTo(lX, lY);
        graphics.moveTo(bX, bY);
        graphics.lineTo(rX, rY);
        graphics.strokePath();

        graphics.generateTexture(key, size, size + drop);
        // Note: height might be more than size, but 'size' param usually defines bounding box.
        // My calculation tY = c - w = size/2 - size*0.4 = size*0.1
        // drop ends at bY + drop = size/2 + size*0.4 = size*0.9
        // So fits in size.
    }
}
