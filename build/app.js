class Game {
    constructor(canvasId) {
        this.input = new Input();
        this.session = { debug: false };
        this.timing = new Timing();
        this.animate = () => {
            this.timing.onFrameStart();
            this.input.onFrameStart();
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
class MyGame extends Game {
    initResources() {
        return new ResourceConfig([
            "PNG/UI/buttonBlue.png",
        ], "./assets/images/SpaceShooterRedux");
    }
    initGame() {
        this.session.player = "Player one";
        this.session.score = 0;
        this.session.level = 1;
        this.session.lives = 3;
        this.session.highscores = [
            {
                playerName: 'Loek',
                score: 40000
            },
            {
                playerName: 'Daan',
                score: 34000
            },
            {
                playerName: 'Rimmert',
                score: 200
            }
        ];
    }
    initViews() {
        return {
            'start': new StartView(),
        };
    }
}
let game = null;
window.addEventListener('load', function () {
    game = new MyGame(document.getElementById('canvas'));
});
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
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        ctx.restore();
    }
}
class StartView extends View {
    constructor() {
        super(...arguments);
        this.shouldGoToNextView = false;
        this.buttonPosition = new Vector();
    }
    init(game) {
        super.init(game);
        this.shouldGoToNextView = false;
        this.buttonImage = game.repo.getImage("PNG.UI.buttonBlue");
    }
    listen(input) {
        super.listen(input);
        if (input.keyboard.isKeyDown(Input.KEY_S) || (input.mouse.buttonClicked
            && this.checkInButton(input.mouse.position))) {
            this.shouldGoToNextView = true;
        }
    }
    checkInButton(position) {
        const x1 = this.buttonPosition.x - this.buttonImage.width / 2;
        const x2 = x1 + this.buttonImage.width;
        const y1 = this.buttonPosition.y - this.buttonImage.height / 2;
        const y2 = y1 + this.buttonImage.height;
        return position.x >= x1 && position.x <= x2 &&
            position.y >= y1 && position.y <= y2;
    }
    adjust(game) {
        this.buttonPosition = this.center.add(new Vector(0, 229));
        if (this.shouldGoToNextView) {
            game.switchViewTo('start');
        }
    }
    draw(ctx) {
        this.writeTextToCanvas(ctx, "Hello World!", 140, this.center.x, 150);
        this.writeTextToCanvas(ctx, "PRESS PLAY OR HIT 'S' TO START", 40, this.center.x, this.center.y - 135);
        this.drawImage(ctx, this.buttonImage, this.buttonPosition.x, this.buttonPosition.y);
        this.writeTextToCanvas(ctx, "Play", 20, this.buttonPosition.x, this.buttonPosition.y + 9, 'center', 'black');
    }
}
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
    collidesWith(item) {
        const distance = this.position.subtract(item.position).size;
        const collision_distance = this.collisionRadius + item.collisionRadius;
        return distance <= collision_distance;
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
    onFrameStart() {
        this.mouse.onFrameStart();
        this.keyboard.onFrameStart();
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
        this.keyCodeStates = new Array();
        this.keyCodeTyped = new Array();
        this.prev = new Array();
        window.addEventListener("keydown", (ev) => {
            this.keyCodeStates[ev.keyCode] = true;
        });
        window.addEventListener("keyup", (ev) => {
            this.keyCodeStates[ev.keyCode] = false;
        });
    }
    onFrameStart() {
        console.log(this.keyCodeStates);
        this.keyCodeTyped = new Array();
        this.keyCodeStates.forEach((val, key) => {
            if (this.prev[key] != val && !this.keyCodeStates[key]) {
                this.keyCodeTyped[key] = true;
                this.prev[key] = val;
            }
        });
    }
    isKeyDown(keyCode) {
        return this.keyCodeStates[keyCode] == true;
    }
    isKeyTyped(keyCode) {
        return this.keyCodeTyped[keyCode] == true;
    }
}
class MouseListener {
    constructor() {
        this._inWindow = true;
        this._position = new Vector();
        this._buttonDown = 0;
        window.addEventListener("mousedown", (ev) => {
            this._buttonDown = ev.buttons;
        });
        window.addEventListener("mouseup", (ev) => {
            this._buttonDown = 0;
        });
        window.addEventListener("mousemove", (ev) => {
            this._position = new Vector(ev.clientX, ev.clientY);
        });
        document.addEventListener("mouseenter", (ev) => {
            this._inWindow = true;
        });
        document.addEventListener("mouseleave", (ev) => {
            this._inWindow = false;
        });
    }
    onFrameStart() {
        this._buttonClicked = this._previousButtonDown != this._buttonDown
            && this._buttonDown == Input.MOUSE_NOTHING;
        this._previousButtonDown = this._buttonDown;
    }
    get inWindow() {
        return this._inWindow;
    }
    get position() {
        return this._position;
    }
    get buttonDown() {
        return this._buttonDown;
    }
    get buttonClicked() {
        return this._buttonClicked;
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