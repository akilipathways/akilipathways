import Phaser from 'phaser';

interface GameItem {
    id: number;
    text: string;
    isCorrect: boolean;
    sprite?: Phaser.GameObjects.Rectangle;
    textObj?: Phaser.GameObjects.Text;
}

export class CreativeThinkingScene extends Phaser.Scene {
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private timerText!: Phaser.GameObjects.Text;
    private timeLeft: number = 60;
    private items: GameItem[] = [];

    constructor() {
        super({ key: 'CreativeThinking' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#FDF4FF');

        this.add.text(20, 20, 'Creative Thinking: Category Rush', {
            fontSize: '24px',
            color: '#9333EA',
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

        this.startRound();

        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    startRound() {
        // Round 1: Things that produce LIGHT
        // In a real app, we'd have a database of rounds.

        this.add.text(400, 120, 'Select all items that produce LIGHT', {
            fontSize: '32px',
            color: '#1E293B',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Grid of 20 items (4x4 or 5x4)
        const wordList = [
            { text: 'SUN', correct: true },
            { text: 'APPLE', correct: false },
            { text: 'LAMP', correct: true },
            { text: 'BOOK', correct: false },
            { text: 'FIRE', correct: true },
            { text: 'WATER', correct: false },
            { text: 'CANDLE', correct: true },
            { text: 'CHAIR', correct: false },
            { text: 'TORCH', correct: true },
            { text: 'SHOE', correct: false },
            { text: 'STAR', correct: true },
            { text: 'TREE', correct: false },
            { text: 'PHONE', correct: true }, // Screen emits light
            { text: 'ROCK', correct: false },
            { text: 'BULB', correct: true },
            { text: 'SPOON', correct: false }
        ];

        // Shuffle
        Phaser.Utils.Array.Shuffle(wordList);

        wordList.forEach((item, index) => {
            const col = index % 4;
            const row = Math.floor(index / 4);

            const x = 200 + col * 140;
            const y = 200 + row * 80;

            const bg = this.add.rectangle(x, y, 120, 60, 0xFFFFFF)
                .setStrokeStyle(2, 0xCBD5E1)
                .setInteractive({ useHandCursor: true });

            const text = this.add.text(x, y, item.text, {
                fontSize: '18px',
                color: '#1E293B'
            }).setOrigin(0.5);

            const gameItem: GameItem = { id: index, text: item.text, isCorrect: item.correct, sprite: bg, textObj: text };
            this.items.push(gameItem);

            bg.on('pointerdown', () => {
                this.handleSelection(item.correct, bg);
                bg.disableInteractive(); // Once clicked, can't click again
            });
        });
    }

    handleSelection(isCorrect: boolean, bg: Phaser.GameObjects.Rectangle) {
        if (isCorrect) {
            this.score += 10;
            bg.setFillStyle(0xDCFCE7); // Green bg
            bg.setStrokeStyle(2, 0x16A34A);
            this.add.text(bg.x, bg.y, '✓', { color: '#16A34A', fontSize: '24px' }).setOrigin(0.5);
        } else {
            this.score -= 5;
            bg.setFillStyle(0xFEE2E2); // Red bg
            bg.setStrokeStyle(2, 0xDC2626);
            this.cameras.main.shake(100, 0.005);
        }
        this.scoreText.setText(`Score: ${this.score}`);
    }

    updateTimer() {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}`);
        if (this.timeLeft <= 0) {
            this.add.text(400, 300, 'TIME UP!', { fontSize: '64px', color: '#9333EA', fontStyle: 'bold', backgroundColor: '#FFFFFF' }).setOrigin(0.5);
            this.time.delayedCall(1000, () => this.endGame());
        }
    }

    endGame() {
        const onGameEnd = this.registry.get('onGameEnd');
        if (onGameEnd) {
            onGameEnd({ score: this.score, maxScore: 160 }); // 16 items * 10
        }
    }
}
