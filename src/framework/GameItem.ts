class GameItem {

    // TODO introduce a new GameItem (abstract) class, and rename this to MovingGameItem
    // All drawing should be done here, and anything that is shown on the screen should 
    // be gameitems.
    public static readonly OFFSCREEN_BEHAVIOUR_OVERFLOW = 0;
    public static readonly OFFSCREEN_BEHAVIOUR_BOUNCE = 2;
    public static readonly OFFSCREEN_BEHAVIOUR_DIE = 3;

    public static readonly STATE_ALIVE = 0;
    public static readonly STATE_DYING = 8;
    public static readonly STATE_DEAD = 9;

    protected _state: number;
    protected _image: HTMLImageElement;
    protected _position: Vector;
    protected _speed: Vector;
    protected _angularSpeed: number;
    protected _angle: number;
    protected _offscreenBehaviour: number;

    public constructor(image:HTMLImageElement, position: Vector, speed: Vector, 
        angle: number, angularSpeed: number, 
        offscreenBehaviour = GameItem.OFFSCREEN_BEHAVIOUR_OVERFLOW) {
        this._image = image;
        this._position = position;
        this._speed = speed;
        this._angle = angle;
        this._angularSpeed = angularSpeed;
        this._offscreenBehaviour = offscreenBehaviour;
    }

    public get collisionRadius() {
        return this._image.height / 2;
    }

    public get position() {
        return this._position;
    }

    public get speed() {
        return this._speed;
    }

    public move(canvas: HTMLCanvasElement) {
        this._position = new Vector(
            this._position.x + this._speed.x,
            this._position.y - this._speed.y
        )
        switch (this._offscreenBehaviour) {
            case GameItem.OFFSCREEN_BEHAVIOUR_OVERFLOW :
                this.adjustOverflow(canvas.width, canvas.height);
                break;
            case GameItem.OFFSCREEN_BEHAVIOUR_BOUNCE :
                break;
            case GameItem.OFFSCREEN_BEHAVIOUR_DIE :
                this.adjustDie(canvas.width, canvas.height);
                break;
        }
        this._angle += this._angularSpeed;
    }

    private adjustOverflow(maxX:number, maxY: number) {
        if (this._position.x > maxX) {
            this._position = new Vector(-this._image.width, this._position.y); 
        } else if (this._position.x < -this._image.width) {
            this._position = new Vector(maxX, this._position.y);
        }

        if (this._position.y > maxY + this._image.height / 2 ) {
            this._position = new Vector(this._position.x, -this._image.height / 2);
        } else if (this._position.y < -this._image.height / 2) {
            this._position = new Vector(this._position.x, maxY);
        }
    }

    private adjustDie(maxX:number, maxY: number) {
        if (this._position.x + this._image.width > maxX || this._position.x < 0 ||
            this._position.y + this._image.height / 2 > maxY ||
            this._position.y - this._image.height / 2 < 0) {
                this.die();
            }
    }

    public die() {
        this._state = GameItem.STATE_DEAD;
    }

    /**
     * isDead
     */
    public isDead() {
        return this._state == GameItem.STATE_DEAD;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this._position.x,this._position.y);
        ctx.rotate(this._angle);
        ctx.drawImage(this._image, -this._image.width / 2, -this._image.height / 2);
        ctx.restore();
    }

    public drawDebug(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = '#ffffb3';
        ctx.beginPath();
        this.drawCenterInfo(ctx);
        this.drawCollisionBounds(ctx);
        ctx.stroke();
        ctx.restore();
    }

    protected drawCenterInfo(ctx: CanvasRenderingContext2D) {
        // Draw center hairline
        ctx.moveTo(this._position.x-50,this._position.y);
        ctx.lineTo(this._position.x+50,this._position.y);
        ctx.moveTo(this._position.x,this._position.y-50);
        ctx.lineTo(this._position.x,this._position.y+50);
        // Write position info
        const text = `(${this._position.x.toPrecision(3)},${this._position.y.toPrecision(3)})`;
        ctx.font = `10px courier`;
        ctx.textAlign = 'left';
        ctx.fillText(text, this._position.x+10,this._position.y -10);
    }

    protected drawCollisionBounds(ctx: CanvasRenderingContext2D) {
        ctx.moveTo(this._position.x,this._position.y);
        ctx.arc(this._position.x,this._position.y, this._image.width / 2, 0, 2 * Math.PI, false);
    }
}