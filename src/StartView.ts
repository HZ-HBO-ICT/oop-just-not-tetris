/// <reference path="framework/View.ts"/>

class StartView extends View {

    private shouldGoToNextView: boolean = false;

    private buttonImage: HTMLImageElement;

    /**
     * Let the view initialize itself within the game. This method is called
     * once before the first game cycle.
     * 
     * @param {HTMLCanvasElement} canvas
     * @param {ResourceRepository} repo
     */
    public init(game: Game) 
    {
        super.init(game);
        this.buttonImage = game.repo.getImage("buttonBlue");
    }

    public listen(input: Input) {
        super.listen(input);

        // See if user wants to go to the next screen
        if (input.keyboard.isKeyDown(Input.KEY_S)) {
            this.shouldGoToNextView = true;
        }
    }

    public adjust(game: Game) {
        if (this.shouldGoToNextView) {
            game.switchViewTo('level');
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.writeTextToCanvas(ctx, "Just not Tetris", 140, this.center.x, 150);

        this.writeTextToCanvas(ctx, "HIT 'S' TO START", 40, this.center.x, this.center.y - 135);

        this.drawImage(ctx, this.buttonImage, this.center.x, this.center.y + 220);
        this.writeTextToCanvas(ctx, "Play", 20, this.center.x, this.center.y + 229, 'center', 'black');
    }

}
