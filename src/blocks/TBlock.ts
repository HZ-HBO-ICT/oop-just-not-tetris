class TBlock extends Block {

    private _up =  [[false, true, false], 
                    [true, true, true]];
    private _down =  [[true, true, true], 
                      [false, true, false]];
    private _left =  [[false, true], 
                      [true, true],
                      [false, true]];
    private _right =  [[true, false], 
                       [true, true],
                       [true, false]];

    public get initialSquares(): boolean[][] {
        return [[false, true, false], 
                [true, true, true]];
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