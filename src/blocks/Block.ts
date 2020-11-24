/// <reference path="../framework/GameItem.ts"/>

/**
 * Abstract class representing a Tetris Block. Contains functionality that is applicable for every shape of Tetris block
 */
abstract class Block {

    // An array of Vectors representing the current positions of the block on the playing field
    private _currentPossitions: Vector[] = [];
    private _squares: Square[] = [];

    private _image: HTMLImageElement;

    /**
     * Main constructor
     * 
     * @param image The HTML image for the block
     */
    constructor(image: HTMLImageElement) {  
        this._image = image;
    }

    /**
     * Abstract method to be implemented by every shape of Tetris block. Returns the initial squares on the playing field that this block requires
     */
    public abstract get initialSquares(): boolean[][];

    /**
     * Get a new square to draw on the screen using the image for this block
     */
    public newSquare(): Square {
        return new Square(this._image);
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
