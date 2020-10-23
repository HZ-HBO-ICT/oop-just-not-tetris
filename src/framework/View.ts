/**
 * Base class for all game screens. Whatever a game renders on the screen, 
 * should be handled by a subclass of this View. A Game is constructed such
 * that each different screen can be handled by a dedicated View subclass.
 * 
 * A View contains the basic methods of the game cycle, like listen(), move(),
 * adjust() and draw(). Whenever the view is active, the Game calles these 
 * methods in the correct order at each animationFrame.
 * 
 * @author BugSlayer 
 */
abstract class View {

    /**
     * Holds the game, so attributes like repo and scores can be accessed. 
     */
    protected game: Game;


    /**
     * X and Y dimensions of the center of the view during the last move()
     * phase of the game cycle.
     */
    protected center: Vector = new Vector();


    /**
     * X and Y dimensions of the size of the view during the last move()
     * phase of the game cycle. X is corresponding to the width of the view and
     * Y to the height.
     */
    protected size: Vector = new Vector();


    /**
     * @internal flag to determine if the debug key combination (ctrl+alt+D) is 
     * pressed during the previous interval. This determines whether the debug
     * flag is toggled.
     */
    private isDebugKeysDown: boolean = false;


    /**
     * Let the view initialize itself within the game. This method is called
     * once before the first game cycle. When overriding this method, 
     * subclasses must call this method with ```super.init(game)``` before 
     * any other statements.
     * 
     * @param {Game} game the current Game
     */
    public init(game: Game) {
        this.game = game;
    }


    /**
     * Let the view listen to the users input. When overriding this method, 
     * subclasses must call this method with ```super.listen(input)``` before any
     * other statements in order to make things like debug info and framecounting
     * work.
     * 
     * @param {Input} input the input to listen to
     */
    public listen(input: Input) {
        // Toggle the debug flag when ctrl+alt+D is pressed
        if (input.keyboard.isKeyDown(Input.KEY_CTRL)
            && input.keyboard.isKeyDown(Input.KEY_ALT)
            && input.keyboard.isKeyDown(Input.KEY_D)
        ){
            if (!this.isDebugKeysDown) {
                // Flip the debug flag
                this.game.session.debug = !this.game.session.debug;
                // Remember that this event is triggered, so next time the flag
                // will be flipped is after ctrl+D is released.
                this.isDebugKeysDown = true;
                console.log("Debug is set to " + this.game.session.debug);
            }
        } else {
            this.isDebugKeysDown = false;
        }
    }


    /**
     * Let the view move its GameItems about the canvas. This method should
     * only change the GameItems state to a new position. The draw() method
     * should be used to let each GameItem draw itself. When overriding this 
     * method, subclasses must call this method with ```super.move(canvas)``` 
     * before any other statements in order to make things like finding the 
     * center of the view and debug info work.
     * 
     * @param canvas the canvas to move about
     */
    public move(canvas: HTMLCanvasElement) {
        this.size = new Vector(canvas.width, canvas.height);
        this.center = this.size.scale(0.5);
    }


    /**
     * Let the game adjust its own state. This method can be used to let the
     * game load a new View, for instance after game over. 
     * 
     * @param {Game} game the game object, to load a new View to
     */
    public adjust(game: Game) {}


    /**
     * Prepare the canvas for drawing a new frame. It basically clears the 
     * canvas. Implementing subclasses should not ovverride this method.
     * 
     * @param {CanvasRenderingContext2D} ctx the context to draw on
     */
    public prepareDraw(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, this.size.x, this.size.y);
    }

    /**
     * Let the View draw itself on the specified CanvasRenderingContext2D. This
     * should result in a new visible frame for the user. When overriding this 
     * method, subclasses must call this method with ```super.draw(ctx)``` 
     * before any other statements in order to make things like debug info work.
     *  
     * @param {CanvasRenderingContext2D} ctx the context to draw on
     */
    public draw(ctx: CanvasRenderingContext2D) {
    }


    /**
     * Let the view draw debug info on the specified CanvasRenderingContext2D. 
     * When overriding this method, subclasses must call this method with 
     * ```super.drawDebug(ctx)``` before any other statements in order to make 
     * things like debug info work.
     * 
     * @param {CanvasRenderingContext2D} ctx the context to draw on
     */
    public drawDebug(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.size.x-123, this.size.y-17)
        ctx.fillStyle = 'white';
        // Write fps info
        const text = `${this.game.timing.fps.toFixed(1)}fps`;
        ctx.font = `12px courier`;
        ctx.textAlign = 'left';
        ctx.fillText(text, 0, 0);
        // Write cpu load indicator
        let x = this.size.x-120;
        let y = this.size.y-15;
        ctx.fillRect(0, 3, 102, 10);
        let green = 255 - Math.round(255 * this.game.timing.load);
        let red = 255 - green;
        ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
        ctx.fillRect(1, 4, 100*this.game.timing.load, 8);
        ctx.restore();
    }


    //---------------- Generic canvas helper methods --------------------------

    /**
     * Writes text to the canvas.
     * 
     * @param {CanvasRenderingContext2D} ctx - The context to draw on
     * @param {string} text - Text to write
     * @param {number} fontSize - Font size in pixels
     * @param {number} xCoordinate - Horizontal coordinate in pixels
     * @param {number} yCoordinate - Vertical coordinate in pixels
     * @param {string} alignment - Where to align the text
     * @param {string} color - The color of the text
     */
    protected writeTextToCanvas(
        ctx: CanvasRenderingContext2D,
        text: string,
        fontSize: number = 20,
        xCoordinate: number,
        yCoordinate: number,
        alignment: CanvasTextAlign = "center",
        color: string = "white"
    ) {
        //TODO Figure out a way to make font configurable by the implementing game 
        ctx.font = `${fontSize}px Minecraft`;
        ctx.fillStyle = color;
        ctx.textAlign = alignment;
        ctx.fillText(text, xCoordinate, yCoordinate);
    }


    /**
     * Draws an image.
     * 
     * @param {CanvasRenderingContext2D} ctx - the context to draw on 
     * @param {HTMLImageElement} image - the image to draw 
     * @param {number} xCoordinate - Horizontal coordinate of the image center 
     *                                  in pixels
     * @param {number} yCoordinate - Vertical coordinate of the image center
     *                                  in pixels
     * @param {number} angle - the rotation angle, default 0 
     */
    protected drawImage(
        ctx: CanvasRenderingContext2D, 
        image:HTMLImageElement, 
        xCoordinate:number, 
        yCoordinate:number, 
        angle:number = 0
    ) {
        ctx.save();
        ctx.translate(xCoordinate, yCoordinate);
        ctx.rotate(angle);
        ctx.drawImage(image, -image.width / 2,  -image.height / 2, image.width, image.height);
        ctx.restore();
    }

}