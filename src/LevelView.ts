/// <reference path="framework/View.ts"/>

class LevelView extends View {

    private background: HTMLImageElement;
    private backgroundSize: Vector = new Vector(446, 700);
    private backgroundPosition: Vector;

    private playingField: Block[][] = [];

    private playingFieldSize: Vector = new Vector(308, 618);
    private playingFieldPosition: Vector;

    private availableBlocks: string[] = ["I", "L", "R", "S", "T"];

    private delay: number = 250;

    private movingBlock: Block;
    private blocksInPlay: Block[] = [];

    private lastMoveDown: number = performance.now();
    private lastMove: number = performance.now();

    public init(game: Game) {
        super.init(game);
        this.background = game.repo.getImage("background");

        this.createNewMovingBlock(game);
    }

    public listen(input: Input) {
        super.listen(input);

        const timeSinceLastMove = performance.now() - this.lastMove;
        if (timeSinceLastMove > 200) {
            if (input.keyboard.isKeyDown(Input.KEY_LEFT)) {
                this.movingBlock.moveLeft();
                this.lastMove = performance.now();
            }
            if (input.keyboard.isKeyDown(Input.KEY_RIGHT)) {
                this.movingBlock.moveRight();
                this.lastMove = performance.now();
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
        this.drawPlayingField(ctx);
        this.blocksInPlay.forEach(block => {
            block.draw(ctx)
        });
        this.movingBlock.updatePlayingField(this.playingFieldPosition, this.playingFieldSize)
        this.movingBlock.draw(ctx);
    }

    public move(canvas: HTMLCanvasElement) {
        super.move(canvas);
        if (this.movingBlock.position !== null && performance.now() - this.lastMoveDown > this.delay) {
            this.lastMoveDown = performance.now();
            this.movingBlock.move(canvas);

            const bottomField = this.playingFieldPosition.y + this.playingFieldSize.y / 2;
            const bottomBlock = this.movingBlock.position.y + (this.movingBlock.blockHeight / 2) * 44;
            if (bottomField === bottomBlock) {
                this.blocksInPlay.push(this.movingBlock);
                this.createNewMovingBlock(this.game);
            }
        }
    }

    private drawPlayingField(ctx: CanvasRenderingContext2D) {
        this.background.width = this.backgroundSize.x;
        this.background.height = this.backgroundSize.y;
        this.backgroundPosition = new Vector(this.center.x, this.background.height / 2 + 30)

        const backgroundTopLeft: Vector = new Vector(
            this.backgroundPosition.x - this.backgroundSize.x / 2,
            this.backgroundPosition.y - this.backgroundSize.y / 2);

        this.playingFieldPosition = new Vector(
            12 + backgroundTopLeft.x + this.playingFieldSize.x / 2,
            68 + backgroundTopLeft.y + this.playingFieldSize.y / 2);

        this.drawImage(ctx, this.background, this.backgroundPosition.x, this.backgroundPosition.y);
    }

    private getRandomBlock(): string {
        return this.availableBlocks[Game.randomInteger(0, this.availableBlocks.length - 1)];
    }

    private createNewMovingBlock(game: Game) {
        const randomBlock: string = this.getRandomBlock();
        switch (randomBlock) {
            case "I" :
                this.movingBlock = new IBlock(game.repo.getImage(randomBlock));
                break;
            case "L" :
                this.movingBlock = new LBlock(game.repo.getImage(randomBlock));
                break;
            case "R" :
                this.movingBlock = new RBlock(game.repo.getImage(randomBlock));
                break;
            case "S" :
                this.movingBlock = new SBlock(game.repo.getImage(randomBlock));
                break;
            case "T" :
                this.movingBlock = new TBlock(game.repo.getImage(randomBlock));
                break;
        }
    }
}