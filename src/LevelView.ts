/// <reference path="framework/View.ts"/>

/**
 * The view of the Just Not Tetris level
 */
class LevelView extends View {
  private _playingField: PlayingField;

  private _background: HTMLImageElement;
  private _backgroundSize: Vector = new Vector(446, 700);
  private _backgroundPosition: Vector;

  private _availableBlocks: string[] = ["I", "L", "R", "S", "T"];

  private _delay: number = 500;

  private _lastMoveDown: number = performance.now();
  private _lastMove: number = performance.now();

  /**
   * Initialize the level
   * @param game The game being played
   */
  public init(game: Game) {
    super.init(game);
    this._background = game.repo.getImage("background");
    this._playingField = new PlayingField(
      new Vector(7, 14),
      this.generateBlocks(10)
    );
  }

  /**
   * Listen for keyboard presses
   *
   * @param input The available input
   */
  public listen(input: Input) {
    super.listen(input);

    const timeSinceLastMove = performance.now() - this._lastMove;
    if (timeSinceLastMove > 200) {
      if (input.keyboard.isKeyDown(Input.KEY_LEFT)) {
        this._playingField.moveLeft();
        this._lastMove = performance.now();
      }
      if (input.keyboard.isKeyDown(Input.KEY_RIGHT)) {
        this._playingField.moveRight();
        this._lastMove = performance.now();
      }
    }
  }

  /**
   * Draw the level view
   * @param ctx The context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);

    this.drawPlayingBackground(ctx);
    this._playingField.draw(ctx);
  }

  /**
   * Move the block on the canvas
   * @param canvas The canvas
   */
  public move(canvas: HTMLCanvasElement) {
    super.move(canvas);
    if (performance.now() - this._lastMoveDown > this._delay) {
      this._lastMoveDown = performance.now();
      this._playingField.moveDown();
    }
  }

  /**
   * Draw the Tetris playground in the middle of the screen
   * 
   * @param ctx The context to draw on
   */
  private drawPlayingBackground(ctx: CanvasRenderingContext2D) {
    this._background.width = this._backgroundSize.x;
    this._background.height = this._backgroundSize.y;
    this._backgroundPosition = new Vector(
      this.center.x,
      this._background.height / 2 + 30
    );

    const backgroundTopLeft: Vector = new Vector(
      this._backgroundPosition.x - this._backgroundSize.x / 2,
      this._backgroundPosition.y - this._backgroundSize.y / 2
    );

    // Update the playing field object with information about its location on the screen
    // The offset in pixels are the distances from the top left of the image to the actual playing field in the image
    this._playingField.topLeft = new Vector(
      12 + backgroundTopLeft.x,
      68 + backgroundTopLeft.y
    );

    this.drawImage(
      ctx,
      this._background,
      this._backgroundPosition.x,
      this._backgroundPosition.y
    );
  }

  /**
   * Generate a number of random blocks to play with
   * @param amount The amount of blocks to generate
   */
  private generateBlocks(amount: number): Block[] {
    const blocks: Block[] = [];
    for (let i = 0; i < amount; i++) {
      blocks.push(this.createRandomBlock());
    }
    return blocks;
  }

  /**
   * Create a random block
   */
  private createRandomBlock(): Block {
    const randomBlock: string = this._availableBlocks[
      Game.randomInteger(0, this._availableBlocks.length - 1)
    ];
    switch (randomBlock) {
      case "I":
        return new IBlock(this.game.repo.getImage(randomBlock));
      case "L":
        return new LBlock(this.game.repo.getImage(randomBlock));
      case "R":
        return new RBlock(this.game.repo.getImage(randomBlock));
      case "S":
        return new SBlock(this.game.repo.getImage(randomBlock));
      case "T":
        return new TBlock(this.game.repo.getImage(randomBlock));
      default:
        return null;
    }
  }
}
