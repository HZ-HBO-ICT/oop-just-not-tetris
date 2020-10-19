/**
 * Listens to mouse events within the game window and holds the current mouse
 * state like position, buttons and whether or not the mouse is within the
 * browser window.
 * 
 * @author BugSlayer
 */
class MouseListener
{

    private _inWindow : boolean = true;

    private _position : Vector = new Vector();

    private _buttonDown : number = 0;

    private _previousButtonDown : number;

    private _buttonClicked : boolean;

    /**
     * Construct an object of this class.
     */
    constructor() {
        // Add listeners to all relevant events.
        window.addEventListener("mousedown", (ev: MouseEvent) => {
            this._buttonDown = ev.buttons;
        });
        window.addEventListener("mouseup", (ev: MouseEvent) => {
            this._buttonDown = 0;
        });
        window.addEventListener("mousemove", (ev: MouseEvent) => {
            this._position = new Vector(ev.clientX, ev.clientY);
        });
        document.addEventListener("mouseenter", (ev: MouseEvent) => {
            this._inWindow = true;
        });
        document.addEventListener("mouseleave", (ev: MouseEvent) => {
            this._inWindow = false;
        });
    }


    /**
     * Set the state change flags for the coming frame.
     */
    public onFrameStart() {
        // Set the buttonClicked property.
        this._buttonClicked = this._previousButtonDown != this._buttonDown 
            && this._buttonDown == Input.MOUSE_NOTHING;
        this._previousButtonDown = this._buttonDown;
    }

    /**
     * `True` if the mouse is currently in the document window.
     */
    public get inWindow() : boolean {
        return this._inWindow;   
    }

    /**
     * Holds the current mouse position.
     */
    public get position(): Vector {
        return this._position;
    }

    /**
     * `True` if one of the mouse buttons is down at the moment.
     */
    public get buttonDown(): number {
        return this._buttonDown;
    }

    /**
     * Returns `true` if sometime during the previous frame the buttonDown
     * value changed to `Input.MOUSE_NOTHING`. This means that the mouse button
     * was released. This flag will only be true during one frame and will not
     * be set until the buttonDown value changes again from some other value to
     * `Input.MOUSE_NOTHING`.
     */
    public get buttonClicked(): boolean {
        return this._buttonClicked;
    }    
}