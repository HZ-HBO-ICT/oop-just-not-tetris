class LBlock extends Block {
    
    private _up = [[true, false], 
                  [true, false],
                  [true, true]];
    private _down = [[true, true], 
                     [true, false],
                     [true, false]];
    private _left = [[true, true, true], 
                     [false, false, true]];
    private _right = [[true, true, true], 
                     [true, false, false]];

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
        }
    }
}