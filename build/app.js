class View {
    constructor() {
        this.center = new Vector();
        this.size = new Vector();
        this.isDebugKeysDown = false;
    }
    init(game) {
        this.game = game;
    }
    listen(input) {
        if (input.keyboard.isKeyDown(Input.KEY_CTRL)
            && input.keyboard.isKeyDown(Input.KEY_ALT)
            && input.keyboard.isKeyDown(Input.KEY_D)) {
            if (!this.isDebugKeysDown) {
                this.game.session.debug = !this.game.session.debug;
                this.isDebugKeysDown = true;
                console.log("Debug is set to " + this.game.session.debug);
            }
        }
        else {
            this.isDebugKeysDown = false;
        }
    }
    move(canvas) {
        this.size = new Vector(canvas.width, canvas.height);
        this.center = this.size.scale(0.5);
    }
    adjust(game) { }
    prepareDraw(ctx) {
        ctx.clearRect(0, 0, this.size.x, this.size.y);
    }
    draw(ctx) {
    }
    drawDebug(ctx) {
        ctx.save();
        ctx.translate(this.size.x - 123, this.size.y - 17);
        ctx.fillStyle = 'white';
        const text = `${this.game.timing.fps.toFixed(1)}fps`;
        ctx.font = `12px courier`;
        ctx.textAlign = 'left';
        ctx.fillText(text, 0, 0);
        let x = this.size.x - 120;
        let y = this.size.y - 15;
        ctx.fillRect(0, 3, 102, 10);
        let green = 255 - Math.round(255 * this.game.timing.load);
        let red = 255 - green;
        ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
        ctx.fillRect(1, 4, 100 * this.game.timing.load, 8);
        ctx.restore();
    }
    writeTextToCanvas(ctx, text, fontSize = 20, xCoordinate, yCoordinate, alignment = "center", color = "white") {
        ctx.font = `${fontSize}px Minecraft`;
        ctx.fillStyle = color;
        ctx.textAlign = alignment;
        ctx.fillText(text, xCoordinate, yCoordinate);
    }
    drawImage(ctx, image, xCoordinate, yCoordinate, angle = 0) {
        ctx.save();
        ctx.translate(xCoordinate, yCoordinate);
        ctx.rotate(angle);
        ctx.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);
        ctx.restore();
    }
}
class LevelView extends View {
    constructor() {
        super(...arguments);
        this.backgroundSize = new Vector(446, 700);
        this.availableBlocks = ["I", "L", "R", "S", "T"];
        this.delay = 500;
        this.lastMoveDown = performance.now();
        this.lastMove = performance.now();
    }
    init(game) {
        super.init(game);
        this.background = game.repo.getImage("background");
        this.playingField = new PlayingField(new Vector(7, 14), this.generateBlocks(10));
    }
    listen(input) {
        super.listen(input);
        const timeSinceLastMove = performance.now() - this.lastMove;
        if (timeSinceLastMove > 200) {
            if (input.keyboard.isKeyDown(Input.KEY_LEFT)) {
                this.playingField.moveLeft();
                this.lastMove = performance.now();
            }
            if (input.keyboard.isKeyDown(Input.KEY_RIGHT)) {
                this.playingField.moveRight();
                this.lastMove = performance.now();
            }
        }
    }
    draw(ctx) {
        super.draw(ctx);
        this.drawPlayingBackground(ctx);
        this.playingField.draw(ctx);
    }
    move(canvas) {
        super.move(canvas);
        if (performance.now() - this.lastMoveDown > this.delay) {
            this.lastMoveDown = performance.now();
            this.playingField.moveDown();
        }
    }
    drawPlayingBackground(ctx) {
        this.background.width = this.backgroundSize.x;
        this.background.height = this.backgroundSize.y;
        this.backgroundPosition = new Vector(this.center.x, this.background.height / 2 + 30);
        const backgroundTopLeft = new Vector(this.backgroundPosition.x - this.backgroundSize.x / 2, this.backgroundPosition.y - this.backgroundSize.y / 2);
        this.playingField.topLeft = new Vector(12 + backgroundTopLeft.x, 68 + backgroundTopLeft.y);
        this.drawImage(ctx, this.background, this.backgroundPosition.x, this.backgroundPosition.y);
    }
    generateBlocks(amount) {
        const blocks = [];
        for (let i = 0; i < amount; i++) {
            blocks.push(this.getRandomBlock());
        }
        return blocks;
    }
    getRandomBlock() {
        const randomBlock = this.availableBlocks[Game.randomInteger(0, this.availableBlocks.length - 1)];
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
class PlayingField {
    constructor(playingFieldSize, blocks) {
        this._playingField = [];
        this._playingFIeldSizePixels = new Vector(308, 618);
        this._squareSize = 44;
        this._playingFieldSize = playingFieldSize;
        this._leftOverBlocks = blocks;
        for (let i = 0; i < this._playingFieldSize.y; i++) {
            this._playingField[i] = [];
        }
        this.newMovingBlock();
    }
    moveDown() {
        console.log("Moving block down on playing field");
        const currentPositions = this._movingBlock.currentPositions;
        const newPositions = currentPositions.map((currentPosition) => {
            return currentPosition.add(new Vector(0, 1));
        });
        const canMove = this.canMoveToNewPositions(newPositions, this._movingBlock);
        if (canMove) {
            currentPositions.forEach((currentPosition) => {
                this._playingField[currentPosition.y][currentPosition.x] = undefined;
            });
            newPositions.forEach((newPosition) => {
                this._playingField[newPosition.y][newPosition.x] = this._movingBlock;
            });
            this._movingBlock.currentPositions = newPositions;
        }
        else {
            this.newMovingBlock();
        }
        console.log(this._playingField);
    }
    moveLeft() {
        console.log("Moving block left on playing field");
        const currentPositions = this._movingBlock.currentPositions;
        const newPositions = currentPositions.map((currentPosition) => {
            return currentPosition.add(new Vector(-1, 0));
        });
        const canMove = this.canMoveToNewPositions(newPositions, this._movingBlock);
        if (canMove) {
            currentPositions.forEach((currentPosition) => {
                this._playingField[currentPosition.y][currentPosition.x] = undefined;
            });
            newPositions.forEach((newPosition) => {
                this._playingField[newPosition.y][newPosition.x] = this._movingBlock;
            });
            this._movingBlock.currentPositions = newPositions;
        }
    }
    moveRight() {
        console.log("Moving block right on playing field");
        const currentPositions = this._movingBlock.currentPositions;
        const newPositions = currentPositions.map((currentPosition) => {
            return currentPosition.add(new Vector(1, 0));
        });
        const canMove = this.canMoveToNewPositions(newPositions, this._movingBlock);
        if (canMove) {
            currentPositions.forEach((currentPosition) => {
                this._playingField[currentPosition.y][currentPosition.x] = undefined;
            });
            newPositions.forEach((newPosition) => {
                this._playingField[newPosition.y][newPosition.x] = this._movingBlock;
            });
            this._movingBlock.currentPositions = newPositions;
        }
    }
    rotate() {
        console.log("Rotating block on playing field");
    }
    draw(ctx) {
        const drawnBlocks = [];
        for (let i = 0; i < this._playingField.length; i++) {
            const row = this._playingField[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] != undefined) {
                    const block = row[j];
                    if (drawnBlocks.indexOf(block) == -1) {
                        const currentBlockPositions = block.currentPositions;
                        const leftMostX = currentBlockPositions.map((vector) => {
                            return vector.x;
                        }).reduce((smallest, current) => {
                            return (current < smallest ? current : smallest);
                        });
                        const leftMostY = currentBlockPositions.map((vector) => {
                            return vector.y;
                        }).reduce((smallest, current) => {
                            return (current < smallest ? current : smallest);
                        });
                        drawnBlocks.push(block);
                        const newTopLeft = new Vector(leftMostX * this._squareSize + this._topLeft.x, leftMostY * this._squareSize + this._topLeft.y);
                        block.updatePosition(newTopLeft);
                        block.draw(ctx);
                    }
                }
            }
        }
    }
    set topLeft(topLeft) {
        this._topLeft = topLeft;
    }
    get playingFieldSizePixels() {
        return this._playingFIeldSizePixels;
    }
    newMovingBlock() {
        console.log("Creating a new moving block");
        this._movingBlock = this._leftOverBlocks.pop();
        const requiredSquares = this._movingBlock.initialSquares;
        const playingFieldCenter = Math.floor(this._playingFieldSize.x / 2);
        const leftMostSquare = playingFieldCenter - Math.floor(requiredSquares[0].length / 2);
        for (let i = 0; i < requiredSquares.length; i++) {
            const row = requiredSquares[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j]) {
                    this._playingField[i][j + leftMostSquare] = this._movingBlock;
                    this._movingBlock.currentPositions.push(new Vector(j + leftMostSquare, i));
                }
            }
        }
    }
    canMoveToNewPositions(newPositions, block) {
        for (let i = 0; i < newPositions.length; i++) {
            const newPosition = newPositions[i];
            if (newPosition.y >= this._playingFieldSize.y) {
                return false;
            }
            if (newPosition.x < 0 || newPosition.x >= this._playingFieldSize.x) {
                return false;
            }
            const currentValue = this._playingField[newPosition.y][newPosition.x];
            if (currentValue != undefined &&
                currentValue != block) {
                return false;
            }
        }
        return true;
    }
}
class StartView extends View {
    constructor() {
        super(...arguments);
        this.shouldGoToNextView = false;
    }
    init(game) {
        super.init(game);
        this.buttonImage = game.repo.getImage("buttonBlue");
    }
    listen(input) {
        super.listen(input);
        if (input.keyboard.isKeyDown(Input.KEY_S)) {
            this.shouldGoToNextView = true;
        }
    }
    adjust(game) {
        if (this.shouldGoToNextView) {
            game.switchViewTo('level');
        }
    }
    draw(ctx) {
        this.writeTextToCanvas(ctx, "Just not Tetris", 140, this.center.x, 150);
        this.writeTextToCanvas(ctx, "HIT 'S' TO START", 40, this.center.x, this.center.y - 135);
        this.drawImage(ctx, this.buttonImage, this.center.x, this.center.y + 220);
        this.writeTextToCanvas(ctx, "Play", 20, this.center.x, this.center.y + 229, 'center', 'black');
    }
}
class Game {
    constructor(canvasId) {
        this.input = new Input();
        this.session = { debug: false };
        this.timing = new Timing();
        this.animate = () => {
            this.timing.onFrameStart();
            if (this.currentView != null) {
                this.currentView.listen(this.input);
                this.currentView.move(this.canvas);
                this.currentView.prepareDraw(this.ctx);
                this.currentView.draw(this.ctx);
                if (this.session.debug) {
                    this.currentView.drawDebug(this.ctx);
                }
                this.currentView.adjust(this);
            }
            this.timing.onFrameEnd();
            requestAnimationFrame(this.animate);
        };
        this.canvas = canvasId;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d');
        this.repo = new ResourceRepository(this.initResources());
        this.initGame();
        this.views = this.initViews();
        this.startAnimation();
        this.setCurrentView(new LoadView(Object.keys(this.views)[0]));
    }
    switchViewTo(viewName) {
        const newView = this.views[viewName];
        if (!newView) {
            throw new Error(`A view with the name ${viewName} does not exist.`);
        }
        this.setCurrentView(newView);
    }
    setCurrentView(view) {
        this.currentView = view;
        console.log("Setting view to " + view);
        this.currentView.init(this);
        this.timing.onViewSwitched();
    }
    startAnimation() {
        console.log('start animation');
        requestAnimationFrame(this.animate);
    }
    static randomInteger(min, max) {
        return Math.round(Game.randomNumber(min, max));
    }
    static randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }
}
class Tetris extends Game {
    initResources() {
        return new ResourceConfig([
            "buttonBlue.png",
            "background.png",
            "I.png",
            "L.png",
            "R.png",
            "S.png",
            "T.png",
        ], "./assets/images/tetris");
    }
    initGame() {
    }
    initViews() {
        return {
            'start': new StartView(),
            'level': new LevelView()
        };
    }
}
let game = null;
window.addEventListener('load', function () {
    game = new Tetris(document.getElementById('canvas'));
});
class GameItem {
    constructor(image, position, speed, angle, angularSpeed, offscreenBehaviour = GameItem.OFFSCREEN_BEHAVIOUR_OVERFLOW) {
        this._image = image;
        this._position = position;
        this._speed = speed;
        this._angle = angle;
        this._angularSpeed = angularSpeed;
        this._offscreenBehaviour = offscreenBehaviour;
    }
    get collisionRadius() {
        return this._image.height / 2;
    }
    get position() {
        return this._position;
    }
    get speed() {
        return this._speed;
    }
    move(canvas) {
        this._position = new Vector(this._position.x + this._speed.x, this._position.y - this._speed.y);
        switch (this._offscreenBehaviour) {
            case GameItem.OFFSCREEN_BEHAVIOUR_OVERFLOW:
                this.adjustOverflow(canvas.width, canvas.height);
                break;
            case GameItem.OFFSCREEN_BEHAVIOUR_BOUNCE:
                break;
            case GameItem.OFFSCREEN_BEHAVIOUR_DIE:
                this.adjustDie(canvas.width, canvas.height);
                break;
        }
        this._angle += this._angularSpeed;
    }
    adjustOverflow(maxX, maxY) {
        if (this._position.x > maxX) {
            this._position = new Vector(-this._image.width, this._position.y);
        }
        else if (this._position.x < -this._image.width) {
            this._position = new Vector(maxX, this._position.y);
        }
        if (this._position.y > maxY + this._image.height / 2) {
            this._position = new Vector(this._position.x, -this._image.height / 2);
        }
        else if (this._position.y < -this._image.height / 2) {
            this._position = new Vector(this._position.x, maxY);
        }
    }
    adjustDie(maxX, maxY) {
        if (this._position.x + this._image.width > maxX || this._position.x < 0 ||
            this._position.y + this._image.height / 2 > maxY ||
            this._position.y - this._image.height / 2 < 0) {
            this.die();
        }
    }
    die() {
        this._state = GameItem.STATE_DEAD;
    }
    isDead() {
        return this._state == GameItem.STATE_DEAD;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this._position.x, this._position.y);
        ctx.rotate(this._angle);
        ctx.drawImage(this._image, -this._image.width / 2, -this._image.height / 2);
        ctx.restore();
    }
    drawDebug(ctx) {
        ctx.save();
        ctx.strokeStyle = '#ffffb3';
        ctx.beginPath();
        this.drawCenterInfo(ctx);
        this.drawCollisionBounds(ctx);
        ctx.stroke();
        ctx.restore();
    }
    drawCenterInfo(ctx) {
        ctx.moveTo(this._position.x - 50, this._position.y);
        ctx.lineTo(this._position.x + 50, this._position.y);
        ctx.moveTo(this._position.x, this._position.y - 50);
        ctx.lineTo(this._position.x, this._position.y + 50);
        const text = `(${this._position.x.toPrecision(3)},${this._position.y.toPrecision(3)})`;
        ctx.font = `10px courier`;
        ctx.textAlign = 'left';
        ctx.fillText(text, this._position.x + 10, this._position.y - 10);
    }
    drawCollisionBounds(ctx) {
        ctx.moveTo(this._position.x, this._position.y);
        ctx.arc(this._position.x, this._position.y, this._image.width / 2, 0, 2 * Math.PI, false);
    }
}
GameItem.OFFSCREEN_BEHAVIOUR_OVERFLOW = 0;
GameItem.OFFSCREEN_BEHAVIOUR_BOUNCE = 2;
GameItem.OFFSCREEN_BEHAVIOUR_DIE = 3;
GameItem.STATE_ALIVE = 0;
GameItem.STATE_DYING = 8;
GameItem.STATE_DEAD = 9;
class Block extends GameItem {
    constructor(image) {
        super(image, null, null, 0, 0);
        this._currentPossitions = [];
        this._orientation = Orientation.UP;
    }
    get currentPositions() {
        return this._currentPossitions;
    }
    set currentPositions(newPositions) {
        this._currentPossitions = newPositions;
    }
    updatePosition(newTopLeft) {
        this._position = new Vector(newTopLeft.x + this._image.width / 2, newTopLeft.y + this._image.height / 2);
    }
    nextOrientation() {
        switch (this._orientation) {
            case Orientation.UP:
                return Orientation.RIGHT;
            case Orientation.RIGHT:
                return Orientation.DOWN;
            case Orientation.DOWN:
                return Orientation.LEFT;
            case Orientation.LEFT:
                return Orientation.UP;
        }
    }
}
class IBlock extends Block {
    constructor() {
        super(...arguments);
        this._up_down = [[true],
            [true],
            [true],
            [true]];
        this._left_right = [[true, true, true, true]];
    }
    get initialSquares() {
        return this._up_down;
    }
    prepareRotate() {
        switch (this.nextOrientation()) {
            case Orientation.UP:
            case Orientation.DOWN:
                return this._up_down;
            case Orientation.LEFT:
            case Orientation.RIGHT:
                return this._left_right;
        }
    }
}
class LBlock extends Block {
    constructor() {
        super(...arguments);
        this._up = [[true, false],
            [true, false],
            [true, true]];
        this._down = [[true, true],
            [true, false],
            [true, false]];
        this._left = [[true, true, true],
            [false, false, true]];
        this._right = [[true, true, true],
            [true, false, false]];
    }
    get initialSquares() {
        return this._up;
    }
    prepareRotate() {
        switch (this.nextOrientation()) {
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
var Orientation;
(function (Orientation) {
    Orientation[Orientation["UP"] = 0] = "UP";
    Orientation[Orientation["DOWN"] = 1] = "DOWN";
    Orientation[Orientation["LEFT"] = 2] = "LEFT";
    Orientation[Orientation["RIGHT"] = 3] = "RIGHT";
})(Orientation || (Orientation = {}));
class RBlock extends Block {
    get initialSquares() {
        return [[true, true],
            [true, true]];
    }
    prepareRotate() {
        return [[true, true],
            [true, true]];
    }
}
class SBlock extends Block {
    constructor() {
        super(...arguments);
        this._up = [[false, true, true],
            [true, true, false]];
        this._down = [[true, true, false],
            [false, true, true]];
        this._left = [[false, true],
            [true, true],
            [true, false]];
        this._right = [[true, false],
            [true, true],
            [false, true]];
    }
    get initialSquares() {
        return this._up;
    }
    prepareRotate() {
        switch (this.nextOrientation()) {
            case Orientation.UP:
                return this._up;
            case Orientation.DOWN:
                return this._down;
            case Orientation.LEFT:
                return this._left;
            case Orientation.RIGHT:
                return this._right;
        }
        ;
    }
}
class TBlock extends Block {
    constructor() {
        super(...arguments);
        this._up = [[false, true, false],
            [true, true, true]];
        this._down = [[true, true, true],
            [false, true, false]];
        this._left = [[false, true],
            [true, true],
            [false, true]];
        this._right = [[true, false],
            [true, true],
            [true, false]];
    }
    get initialSquares() {
        return [[false, true, false],
            [true, true, true]];
    }
    prepareRotate() {
        switch (this.nextOrientation()) {
            case Orientation.UP:
                return this._up;
            case Orientation.DOWN:
                return this._down;
            case Orientation.LEFT:
                return this._left;
            case Orientation.RIGHT:
                return this._right;
        }
        ;
    }
}
class LoadView extends View {
    constructor(nextView) {
        super();
        this.nextView = nextView;
    }
    listen(input) {
        super.listen(input);
    }
    adjust(game) {
        if (!game.repo.isLoading() &&
            game.timing.viewTime > LoadView.MINIMUM_FRAME_TIME) {
            game.switchViewTo(this.nextView);
        }
    }
    draw(ctx) {
        this.writeTextToCanvas(ctx, "Loading...", 80, this.center.x, this.center.y);
    }
}
LoadView.MINIMUM_FRAME_TIME = 1000;
class Input {
    constructor() {
        this.keyboard = new KeyListener();
        this.mouse = new MouseListener();
        this.window = new WindowListener();
    }
}
Input.MOUSE_NOTHING = 0;
Input.MOUSE_PRIMARY = 1;
Input.MOUSE_SECONDARY = 2;
Input.MOUSE_AUXILIARY = 4;
Input.MOUSE_FOURTH = 8;
Input.MOUSE_FIFTH = 16;
Input.KEY_ENTER = 13;
Input.KEY_SHIFT = 16;
Input.KEY_CTRL = 17;
Input.KEY_ALT = 18;
Input.KEY_ESC = 27;
Input.KEY_SPACE = 32;
Input.KEY_LEFT = 37;
Input.KEY_UP = 38;
Input.KEY_RIGHT = 39;
Input.KEY_DOWN = 40;
Input.KEY_DEL = 46;
Input.KEY_1 = 49;
Input.KEY_2 = 50;
Input.KEY_3 = 51;
Input.KEY_4 = 52;
Input.KEY_5 = 53;
Input.KEY_6 = 54;
Input.KEY_7 = 55;
Input.KEY_8 = 56;
Input.KEY_9 = 57;
Input.KEY_0 = 58;
Input.KEY_A = 65;
Input.KEY_B = 66;
Input.KEY_C = 67;
Input.KEY_D = 68;
Input.KEY_E = 69;
Input.KEY_F = 70;
Input.KEY_G = 71;
Input.KEY_H = 72;
Input.KEY_I = 73;
Input.KEY_J = 74;
Input.KEY_K = 75;
Input.KEY_L = 76;
Input.KEY_M = 77;
Input.KEY_N = 78;
Input.KEY_O = 79;
Input.KEY_P = 80;
Input.KEY_Q = 81;
Input.KEY_R = 82;
Input.KEY_S = 83;
Input.KEY_T = 84;
Input.KEY_U = 85;
Input.KEY_V = 86;
Input.KEY_W = 87;
Input.KEY_X = 88;
Input.KEY_Y = 89;
Input.KEY_Z = 90;
class KeyListener {
    constructor() {
        this.keyDown = (ev) => {
            this.keyCodeStates[ev.keyCode] = true;
        };
        this.keyUp = (ev) => {
            this.keyCodeStates[ev.keyCode] = false;
        };
        this.keyCodeStates = new Array();
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("keyup", this.keyUp);
    }
    isKeyDown(keyCode) {
        return this.keyCodeStates[keyCode] == true;
    }
}
class MouseListener {
    constructor() {
        this.mouseDown = (ev) => {
            this.buttonDown = ev.buttons;
        };
        this.mouseUp = (ev) => {
            this.buttonDown = 0;
        };
        this.mouseMove = (ev) => {
            this.position = new Vector(ev.clientX, ev.clientY);
        };
        this.mouseEnter = (ev) => {
            this.inWindow = true;
        };
        this.mouseLeave = (ev) => {
            this.inWindow = false;
        };
        this.position = new Vector();
        this.inWindow = true;
        window.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);
        window.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("mouseenter", this.mouseEnter);
        document.addEventListener("mouseleave", this.mouseLeave);
    }
}
class WindowListener {
    constructor() {
        this.listen(0);
    }
    listen(interval) {
        var w = 0;
        var h = 0;
        if (!window.innerWidth) {
            if (!(document.documentElement.clientWidth == 0)) {
                w = document.documentElement.clientWidth;
                h = document.documentElement.clientHeight;
            }
            else {
                w = document.body.clientWidth;
                h = document.body.clientHeight;
            }
        }
        else {
            w = window.innerWidth;
            h = window.innerHeight;
        }
        this.size = new Vector(w, h);
    }
}
class ResourceConfig {
    constructor(images, prefix = "") {
        this.images = images;
        this.prefix = prefix;
    }
}
class ResourceRepository {
    constructor(config) {
        this.images = {};
        this.loadingAssets = new Array();
        this.prefix = config.prefix;
        config.images.forEach((name) => {
            this.startLoadingImage(name);
        });
    }
    isLoading() {
        return this.loadingAssets.length > 0;
    }
    getImage(key) {
        return this.images[key];
    }
    startLoadingImage(name) {
        let imageElement = new Image();
        imageElement.addEventListener("load", (event) => {
            const key = this.generateKeyFromSrc(imageElement.src);
            this.images[key] = imageElement;
            this.loadingAssets.splice(this.loadingAssets.indexOf(key), 1);
        });
        const src = this.generateURL(name);
        this.loadingAssets.push(this.generateKeyFromSrc(src));
        imageElement.src = src;
    }
    generateKeyFromSrc(src) {
        const start = this.prefix.substring(1);
        const index = src.indexOf(start) + start.length + 1;
        const key = src.substr(index, src.length - index - 4).split("/").join(".");
        return key;
    }
    generateURL(name) {
        return this.prefix + "/" + name;
    }
}
class Timing {
    constructor() {
        this.gameFrames = 0;
        this.viewFrames = 0;
        this.gameStart = performance.now();
        this.gameTime = 0;
        this.viewTime = 0;
        this.frameTime = 0;
        this.frameIdleTime = 0;
        this.fps = 60;
        this.load = 0;
    }
    get frameComputeTime() {
        return this.frameTime - this.frameIdleTime;
    }
    onViewSwitched() {
        this.viewFrames = 0;
        this.viewStart = performance.now();
    }
    onFrameStart() {
        this.gameFrames++;
        this.viewFrames++;
        const now = performance.now();
        this.frameIdleTime = now - this.frameEnd;
        this.gameTime = now - this.gameStart;
        this.viewTime = now - this.viewStart;
        this.frameTime = now - this.frameStart;
        this.frameStart = now;
        this.fps = Math.round(1000 / this.frameTime);
        this.load = this.frameComputeTime / this.frameTime;
    }
    onFrameEnd() {
        this.frameEnd = performance.now();
    }
}
class Vector {
    constructor(x = 0, y = 0) {
        this._size = null;
        this._angle = null;
        this.x = x;
        this.y = y;
    }
    static fromSizeAndAngle(size, angle) {
        let x = size * Math.sin(angle);
        let y = size * Math.cos(angle);
        return new Vector(x, y);
    }
    get size() {
        if (!this._size) {
            this._size = Math.sqrt(Math.pow(this.x, 2) +
                Math.pow(this.y, 2));
        }
        return this._size;
    }
    get angle() {
        if (!this._angle) {
            this._angle = Math.atan(this.y / this.x);
        }
        return this._angle;
    }
    add(input) {
        return new Vector(this.x + input.x, this.y + input.y);
    }
    subtract(input) {
        return new Vector(this.x - input.x, this.y - input.y);
    }
    scale(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    normalize() {
        return Vector.fromSizeAndAngle(1, this.angle);
    }
    mirror_X() {
        return new Vector(this.x, this.y * -1);
    }
    mirror_Y() {
        return new Vector(this.x * -1, this.y);
    }
    distance(input) {
        return this.subtract(input).size;
    }
}
//# sourceMappingURL=app.js.map