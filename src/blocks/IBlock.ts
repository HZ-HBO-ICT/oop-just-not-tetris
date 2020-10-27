class IBlock extends Block {
    
    private _up_down: boolean[][] =  [[true], 
                                [true],
                                [true],
                                [true]];

    private _left_right: boolean[][] =  [[true, true, true, true]];

    public get initialSquares(): boolean[][] {
        return this._up_down;
    }

    public prepareRotate(): boolean[][] {
        switch(this.nextOrientation()) {
            case Orientation.UP:
            case Orientation.DOWN:
                return this._up_down;
            case Orientation.LEFT:
            case Orientation.RIGHT:
                return this._left_right;
        }
    }
}