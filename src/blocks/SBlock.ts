class SBlock extends Block {
    
    private _up = [[false, true, true], 
                   [true, true, false]];
    private _down = [[true, true, false], 
                     [false, true, true]];
    private _left = [[false, true], 
                     [true, true],
                     [true, false]];
    private _right = [[true, false], 
                     [true, true],
                     [false, true]];

    public get initialSquares(): boolean[][] {
        return this._up;
    }

    public prepareRotate(): boolean[][] {
        switch(this.nextOrientation()) {
            case Orientation.UP:
                return this._up;
            case Orientation.DOWN:
                return this._down;
            case Orientation.LEFT:
                return this._left;
            case Orientation.RIGHT:
                return this._right;
        };
    }
}