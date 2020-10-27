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

    public moveDown() {
        console.log("Moving block down on playing field");
        const currentPositions: Vector[] = this._movingBlock.currentPositions;

        const newPositions = currentPositions.map((currentPosition) => {
            return currentPosition.add(new Vector(0,1));
        });

        const canMove = this.canMoveToNewPositions(newPositions, this._movingBlock);

        if(canMove) {
            currentPositions.forEach((currentPosition) => {
                this._playingField[currentPosition.y][currentPosition.x] = undefined;
            });
            newPositions.forEach((newPosition) => {
                this._playingField[newPosition.y][newPosition.x] = this._movingBlock;
            });
            this._movingBlock.currentPositions = newPositions;
        } else {
            this.newMovingBlock();
        }

        console.log(this._playingField);
    }

    public moveLeft() {
        console.log("Moving block left on playing field");

        const currentPositions: Vector[] = this._movingBlock.currentPositions;
        const newPositions = currentPositions.map((currentPosition) => {
            return currentPosition.add(new Vector(-1,0));
        });

        const canMove = this.canMoveToNewPositions(newPositions, this._movingBlock);

        if(canMove) {
            currentPositions.forEach((currentPosition) => {
                this._playingField[currentPosition.y][currentPosition.x] = undefined;
            });
            newPositions.forEach((newPosition) => {
                this._playingField[newPosition.y][newPosition.x] = this._movingBlock;
            });
            this._movingBlock.currentPositions = newPositions;
        }
    }

    public moveRight() {
        console.log("Moving block right on playing field");

        const currentPositions: Vector[] = this._movingBlock.currentPositions;
        const newPositions = currentPositions.map((currentPosition) => {
            return currentPosition.add(new Vector(1,0));
        });

        const canMove = this.canMoveToNewPositions(newPositions, this._movingBlock);

        if(canMove) {
            currentPositions.forEach((currentPosition) => {
                this._playingField[currentPosition.y][currentPosition.x] = undefined;
            });
            newPositions.forEach((newPosition) => {
                this._playingField[newPosition.y][newPosition.x] = this._movingBlock;
            });
            this._movingBlock.currentPositions = newPositions;
        }
    }

    public rotate() {
        console.log("Rotating block on playing field");


    }

    public draw(ctx: CanvasRenderingContext2D) {
        const drawnBlocks: Block[] = [];
        for(let i = 0; i < this._playingField.length; i++) {
            const row = this._playingField[i];
            for(let j = 0; j < row.length; j++) {
                if(row[j] != undefined) {
                    const block = row[j];
                    if(drawnBlocks.indexOf(block) == -1) {
                        const currentBlockPositions = block.currentPositions;

                        const leftMostX = currentBlockPositions.map((vector) => {
                            return vector.x;
                        }).reduce((smallest, current) => {
                            return (current < smallest ? current : smallest);
                        });
                        const leftMostY = currentBlockPositions.map((vector) => {
                            return vector.y;
                        }).reduce((smallest, current) => {
                            return (current < smallest ? current : smallest);
                        });


                        drawnBlocks.push(block);
                        const newTopLeft = new Vector(leftMostX * this._squareSize + this._topLeft.x, 
                            leftMostY * this._squareSize + this._topLeft.y);
                        block.updatePosition(newTopLeft);
                        block.draw(ctx);
                    }
                }
            }
        }        
    }

    public set topLeft(topLeft: Vector) {
        this._topLeft = topLeft;
    }

    public get playingFieldSizePixels(): Vector {
        return this._playingFIeldSizePixels;
    }

    private newMovingBlock() {
        console.log("Creating a new moving block");
        this._movingBlock = this._leftOverBlocks.pop();
        const requiredSquares  = this._movingBlock.initialSquares;
        const playingFieldCenter = Math.floor(this._playingFieldSize.x / 2);
        const leftMostSquare = playingFieldCenter - Math.floor(requiredSquares[0].length / 2);
        for(let i = 0; i < requiredSquares.length; i++) {
            const row = requiredSquares[i];
            for(let j = 0; j < row.length; j++) {
                if(row[j]) {
                    this._playingField[i][j + leftMostSquare] = this._movingBlock;
                    this._movingBlock.currentPositions.push(new Vector(j + leftMostSquare, i));
                }
            }
        }
    }

    private canMoveToNewPositions(newPositions: Vector[], block: Block):boolean {
        for (let i = 0; i < newPositions.length; i++) {
            const newPosition = newPositions[i];

            // Bottom or side of playing field
            if(newPosition.y >= this._playingFieldSize.y) {
                return false;
            }
            if(newPosition.x < 0 || newPosition.x >= this._playingFieldSize.x) {
                return false;
            }

            // Collision with another block
            const currentValue = this._playingField[newPosition.y][newPosition.x];
            if(currentValue != undefined &&
                currentValue != block) {
                return false;
            }
        }
        return true;
    }
}