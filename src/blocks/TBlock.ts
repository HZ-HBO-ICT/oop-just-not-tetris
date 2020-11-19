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
    
    /**
     * @see Block.initialSquares
     */
    public get initialSquares(): boolean[][] {
        return this._up;
    }
}