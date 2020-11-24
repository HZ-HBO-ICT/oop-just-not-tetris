/**
 * The square class represents one of the four squares that a Tetris block consists of. This is an item that can be drawn on the screen
 */
class Square extends GameItem {

    /**
     * Main constructor for a square
     * @param image The image of the square
     */
    public constructor(image: HTMLImageElement) {
        super(image, null, null, 0, 0);
    }

    /**
     * @override
     */
    public draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
    }

    /**
     * Update the position of the image of the tetris block to draw it on the correct location on the playing field
     * 
     * @param newTopLeft The new top-left position as a Vector
     */
    public updatePosition(newTopLeft: Vector) {        
        this._position = new Vector(newTopLeft.x + this._image.width / 2, newTopLeft.y + this._image.height / 2);        
    }
}