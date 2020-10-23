/**
 * Listens to mouse events within the game window and holds the current mouse
 * state like position, buttons and whether or not the mouse is within the
 * browser window.
 * 
 * @author BugSlayer
 */
class MouseListener
{

    /**
     * True if the mouse is currently in the document window.
     */
    inWindow : boolean;


    /**
     * Holds the current mouse position.
     */
    position : Vector;


    /**
     * True if one of the mouse buttons is down at the moment.
     */
    buttonDown : number;

    /**
     * Construct an object of this class.
     */
    constructor() {
        this.position = new Vector();
        this.inWindow = true;
        window.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);
        window.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("mouseenter", this.mouseEnter);
        document.addEventListener("mouseleave", this.mouseLeave);
    }


    /**
     * @internal Arrow method that catches mouseDown events
     * WARNING: DO NOT USE OR REMOVE THIS METHOD
     */
    mouseDown = (ev: MouseEvent) => {
        this.buttonDown = ev.buttons;
    }


    /**
     * @internal Arrow method that catches mouseUp events
     * WARNING: DO NOT USE OR REMOVE THIS METHOD
     */
    mouseUp = (ev: MouseEvent) => {
        this.buttonDown = 0;
    }


    /**
     * @internal Arrow method that catches mouseMove events
     * WARNING: DO NOT USE OR REMOVE THIS METHOD
     */
    mouseMove = (ev: MouseEvent) => {
       	this.position = new Vector(ev.clientX, ev.clientY);
    }


    /**
     * @internal Arrow method that catches mouseEnter events
     * WARNING: DO NOT USE OR REMOVE THIS METHOD
     */
    mouseEnter = (ev: MouseEvent) => {
        this.inWindow = true;
    }

    
    /**
     * @internal Arrow method that catches mouseLeave events
     * WARNING: DO NOT USE OR REMOVE THIS METHOD
     */
    mouseLeave = (ev: MouseEvent) => {
        this.inWindow = false;
    }

}