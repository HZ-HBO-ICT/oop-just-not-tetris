/// <reference path="framework/GameItem.ts"/>

abstract class Block extends GameItem {

    private playingFieldPosition: Vector;
    private playingFieldSize: Vector;

    constructor(image: HTMLImageElement) {
        super(image, null, new Vector(0, -44), 0, 0);
    }

    public abstract get blockHeight(): number;

    public abstract get blockWidth(): number;

    public moveLeft() {
        const leftSidePlayingField = this.playingFieldPosition.x - this.playingFieldSize.x / 2;
        const leftSideBlock = this.position.x - (this.blockWidth / 2) * 44;

        if (leftSideBlock - 44 >= leftSidePlayingField) {
            this._position = new Vector(this._position.x - 44, this._position.y)
        }
    }

    public moveRight() {
        const rightSidePlayingField = this.playingFieldPosition.x + this.playingFieldSize.x / 2;
        const rightSideBlock = this.position.x + (this.blockWidth / 2) * 44;

        console.log(rightSidePlayingField, rightSideBlock);

        if (rightSideBlock + 44 <= rightSidePlayingField) {
            this._position = new Vector(this._position.x + 44, this._position.y)
        }
    }

    public updatePlayingField(playingFieldPosition: Vector, playingFieldSize: Vector) {
        this.playingFieldPosition = playingFieldPosition;
        this.playingFieldSize = playingFieldSize;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if (this.position === null) {
            const leftSide = this.playingFieldPosition.x - this.playingFieldSize.x / 2;
            let initialXPosition = leftSide + 3 * 44;
            if (this.blockWidth % 2 !== 0) {
                initialXPosition += 22;
            }

            const bottom = this.playingFieldPosition.y + this.playingFieldSize.y / 2;
            let initialYPosition = bottom - 13 * 44;
            if (this.blockHeight % 2 !== 0) {
                initialYPosition += 22;
            }

            this._position = new Vector(initialXPosition, initialYPosition);
        }
        super.draw(ctx);
    }
}
