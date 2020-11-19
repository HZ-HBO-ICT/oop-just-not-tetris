/// <reference path="../framework/GameItem.ts"/>

/**
 * Abstract class representing a Tetris Block. Contains functionality that is applicable for every shape of Tetris block
 */
abstract class Block extends GameItem {

    // An array of Vectors representing the current positions of the block on the playing field
    private _currentPossitions: Vector[] = [];

    /**
     * Main constructor
     * 
     * @param image The HTML image for the block
     */
    constructor(image: HTMLImageElement) {
        super(image, null, null, 0, 0);
    }

    /**
     * Abstract method to be implemented by every shape of Tetris block. Returns the initial squares on the playing field that this block requires
     */
    public abstract get initialSquares(): boolean[][];
    
    /**
     * Update the position of the image of the tetris block to draw it on the correct location on the playing field
     * 
     * @param newTopLeft The new top-left position as a Vector
     */
    public updatePosition(newTopLeft: Vector) {        
        this._position = new Vector(newTopLeft.x + this._image.width / 2, newTopLeft.y + this._image.height / 2);        
    }

    /**
     * Getter for the current positions
     */
    public get currentPositions(): Vector[] {
        return this._currentPossitions;
    }

    /**
     * Setter for the current positions
     */
    public set currentPositions(newPositions: Vector[]) {
        this._currentPossitions = newPositions;
    }


}
