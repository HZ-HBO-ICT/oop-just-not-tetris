/// <reference path="framework/View.ts"/>

class StartView extends View {

    private shouldGoToNextView: boolean = false;

    private buttonImage: HTMLImageElement;
    private buttonPosition: Vector = new Vector();

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
        this.shouldGoToNextView = false;
        this.buttonImage = game.repo.getImage("PNG.UI.buttonBlue");
    }

    public listen(input: Input) {
        super.listen(input);

        // See if user wants to go to the next screen
        if (input.keyboard.isKeyDown(Input.KEY_S) || (input.mouse.buttonClicked
            && this.checkInButton(input.mouse.position))) {
            this.shouldGoToNextView = true;
        }
    }

    private checkInButton(position: Vector): boolean {
        const x1 = this.buttonPosition.x - this.buttonImage.width/2;
        const x2 = x1 + this.buttonImage.width;
        const y1 = this.buttonPosition.y - this.buttonImage.height/2;
        const y2 = y1 + this.buttonImage.height;
        return position.x >= x1 && position.x<=x2 &&
        position.y >= y1 && position.y <= y2;
    }

    public adjust(game: Game) {
        this.buttonPosition = this.center.add(new Vector(0, 229));
        if (this.shouldGoToNextView) {
            game.switchViewTo('start');
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.writeTextToCanvas(ctx, "Hello World!", 140, this.center.x, 150);

        this.writeTextToCanvas(ctx, "PRESS PLAY OR HIT 'S' TO START", 40, this.center.x, this.center.y - 135);

        this.drawImage(ctx, this.buttonImage, this.buttonPosition.x, this.buttonPosition.y);
        this.writeTextToCanvas(ctx, "Play", 20, this.buttonPosition.x, this.buttonPosition.y + 9, 'center', 'black');
    }

}
