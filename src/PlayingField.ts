/**
 * The playing field, responsible for managing the location and colisions of the Tetris blocks
 */
class PlayingField {

    private _topLeft: Vector;
    private _playingField: Block[][] = [];
    private _playingFieldSize: Vector;
    private _playingFIeldSizePixels: Vector = new Vector(308, 618);
    private _squareSize: number = 44;
    private _movingBlock: Block;
    private _leftOverBlocks: Block[];

    constructor(playingFieldSize: Vector, blocks: Block[]) {        
        this._playingFieldSize = playingFieldSize;
        this._leftOverBlocks = blocks;

        // Fill the empty playing field
        for(let i = 0; i < this._playingFieldSize.y; i++) {
            this._playingField[i] = [];
        }

        // Give the moving block its initial position
        this.newMovingBlock();
    }

    /**
     * Move the one moving block down on the playing field
     */
    public moveDown() {
        console.log("Moving block down on playing field");
                
        // Try to move the block. When not possible, the block has landed and a new moving block will be added to the field
        if(!this.move(new Vector(0,1))) {
            this.newMovingBlock();
        } 

        console.log(this._playingField);
    }

    /**
     * Move the one moving block left on the playing field
     */
    public moveLeft() {
        console.log("Moving block left on playing field");

        this.move(new Vector(-1,0));
    }

    /**
     * Move the one moving block right on the playing field
     */
    public moveRight() {
        console.log("Moving block right on playing field");

        this.move(new Vector(1,0));
    }

    /**
     * Move the block in the provided direction.
     * 
     * @param translation The vector to add to the current position. Example (new Vector(0,1)) would move the block down
     */
    private move(translation: Vector): boolean {
        // Get the current positions (indexes) from the moving block
        const currentPositions: Vector[] = this._movingBlock.currentPositions;
        // Create the new positions (indexes) by moving every index according to the provided translation
        const newPositions = currentPositions.map((currentPosition) => {
            return currentPosition.add(translation);
        });

        // Check for collisions
        const canMove = this.canMoveToNewPositions(newPositions);

        // If there are no collisions, remove the block from the playing field using the current positions
        // And replace it on its new positions.
        if(canMove) {
            currentPositions.forEach((currentPosition) => {
                this._playingField[currentPosition.y][currentPosition.x] = undefined;
            });
            newPositions.forEach((newPosition) => {
                this._playingField[newPosition.y][newPosition.x] = this._movingBlock;
            });
            this._movingBlock.currentPositions = newPositions;
        }

        // Return if the block has moved
        return canMove;
    }

    /**
     * Draw the blocks on the playing field
     * For every block on the field draw it once. Calculate its position in pixels from the index it is on in the playing field
     * 
     * @param ctx The context to draw on
     */
    public draw(ctx: CanvasRenderingContext2D) {
        for(let rowIndex = 0; rowIndex < this._playingField.length; rowIndex++) {
            const row = this._playingField[rowIndex];
            for(let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                if(row[columnIndex] != undefined) {
                    const block = row[columnIndex];
                    const square = block.newSquare();

                    const newTopLeft = new Vector(columnIndex * this._squareSize + this._topLeft.x, 
                        rowIndex * this._squareSize + this._topLeft.y);
                    square.updatePosition(newTopLeft);
                    
                    square.draw(ctx);
                }
            }
        }
    }

    /**
     * Set the top-left (in pixels) Of the playing field
     * 
     * @param topLeft The top-left position in pixles
     */
    public set topLeft(topLeft: Vector) {
        this._topLeft = topLeft;
    }

    /**
     * Get the size of the playing field in pixels
     */
    public get playingFieldSizePixels(): Vector {
        return this._playingFIeldSizePixels;
    }

    /**
     * Get a new moving block for the playing field
     */
    private newMovingBlock() {
        console.log("Creating a new moving block");
        // Pop a block from the leftover blocks
        this._movingBlock = this._leftOverBlocks.pop();

        // Place it on the playing field at the top
        const requiredSquares  = this._movingBlock.initialSquares;
        const playingFieldCenter = Math.floor(this._playingFieldSize.x / 2);
        const leftMostSquare = playingFieldCenter - Math.floor(requiredSquares[0].length / 2);
        for(let rowIndex = 0; rowIndex < requiredSquares.length; rowIndex++) {
            const row = requiredSquares[rowIndex];
            for(let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                if(row[columnIndex]) {
                    this._playingField[rowIndex][columnIndex + leftMostSquare] = this._movingBlock;
                    this._movingBlock.currentPositions.push(new Vector(columnIndex + leftMostSquare, rowIndex));                
                }
            }
        }
    }

    /**
     * Check if the provided positions are free (no other blocks, not outside the field)
     * 
     * @param newPositions The positions the block wants to move to
     */
    private canMoveToNewPositions(newPositions: Vector[]):boolean {
        for (let i = 0; i < newPositions.length; i++) {
            const newPosition = newPositions[i];

            // Bottom or side of playing field
            if(newPosition.y >= this._playingFieldSize.y) {
                return false;
            }
            if(newPosition.x < 0 || newPosition.x >= this._playingFieldSize.x) {
                return false;
            }

            // Collision with another block, but not the moving block
            const currentValue = this._playingField[newPosition.y][newPosition.x];
            if(currentValue != undefined &&
                currentValue != this._movingBlock) {
                return false;
            }
        }
        return true;
    }
}