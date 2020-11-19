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

    /**
     * @see Block.initialSquares
     */
    public get initialSquares(): boolean[][] {
        return this._up;
    }
}