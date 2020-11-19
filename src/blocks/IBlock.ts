/**
 * Class representing the I shaped block
 */
class IBlock extends Block {
    
    // The squares taken by the block in the up or down orientation
    private _up_down: boolean[][] =  [[true], 
                                [true],
                                [true],
                                [true]];

    // The squares taken by the block in the left or right orientation
    private _left_right: boolean[][] =  [[true, true, true, true]];

    /**
     * @see Block.initialSquares
     */
    public get initialSquares(): boolean[][] {
        return this._up_down;
    }
}