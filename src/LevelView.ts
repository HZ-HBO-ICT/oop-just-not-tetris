/// <reference path="framework/View.ts"/>

class LevelView extends View {
    private playingField: PlayingField;

    private background: HTMLImageElement;
    private backgroundSize: Vector = new Vector(446, 700);
    private backgroundPosition: Vector;

    private availableBlocks: string[] = ["I", "L", "R", "S", "T"];

    private delay: number = 500;

    private lastMoveDown: number = performance.now();
    private lastMove: number = performance.now();

    public init(game: Game) {
        super.init(game);
        this.background = game.repo.getImage("background");
        this.playingField = new PlayingField(new Vector(7, 14), this.generateBlocks(10));
    }

    public listen(input: Input) {
        super.listen(input);

        const timeSinceLastMove = performance.now() - this.lastMove;
        if (timeSinceLastMove > 200) {
            if (input.keyboard.isKeyDown(Input.KEY_LEFT)) {
                this.playingField.moveLeft();
                this.lastMove = performance.now();
            }
            if (input.keyboard.isKeyDown(Input.KEY_RIGHT)) {
                this.playingField.moveRight();
                this.lastMove = performance.now();
            }
            if (input.keyboard.isKeyDown(Input.KEY_UP)) {
                this.playingField.rotate();
                this.lastMove = performance.now();
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
        
        this.drawPlayingBackground(ctx);
        this.playingField.draw(ctx);
    }

    public move(canvas: HTMLCanvasElement) {
        super.move(canvas);        
        if (performance.now() - this.lastMoveDown > this.delay) {
            this.lastMoveDown = performance.now();
            this.playingField.moveDown();
        }
    }

    private drawPlayingBackground(ctx: CanvasRenderingContext2D) {
        this.background.width = this.backgroundSize.x;
        this.background.height = this.backgroundSize.y;
        this.backgroundPosition = new Vector(this.center.x, this.background.height / 2 + 30)

        const backgroundTopLeft: Vector = new Vector(
            this.backgroundPosition.x - this.backgroundSize.x / 2,
            this.backgroundPosition.y - this.backgroundSize.y / 2);

        // Update the playing field object with information about its loction on the screen
        this.playingField.topLeft = new Vector(
            12 + backgroundTopLeft.x,
            68 + backgroundTopLeft.y);

        this.drawImage(ctx, this.background, this.backgroundPosition.x, this.backgroundPosition.y);
    }

    private generateBlocks(amount: number): Block[] {
        const blocks: Block[] = [];
        for(let i = 0; i < amount; i++) {
            blocks.push(this.getRandomBlock());
        }
        return blocks;
    }

    private getRandomBlock(): Block {
        const randomBlock: string = this.availableBlocks[Game.randomInteger(0, this.availableBlocks.length - 1)];
        switch (randomBlock) {
            case "I" :
                return new IBlock(this.game.repo.getImage(randomBlock));
            case "L" :
                return new LBlock(this.game.repo.getImage(randomBlock));               
            case "R" :
                return new RBlock(this.game.repo.getImage(randomBlock));               
            case "S" :
                return new SBlock(this.game.repo.getImage(randomBlock));               
            case "T" :
                return new TBlock(this.game.repo.getImage(randomBlock));         
            default:
                return null;      
        }
    }
}