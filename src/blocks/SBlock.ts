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

    /**
     * @see Block.initialSquares
     */
    public get initialSquares(): boolean[][] {
        return this._up;
    }
}