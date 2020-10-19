/**
 * This class handles the keyboard events. It knows the last known state of its 
 * keys
 * 
 * Some parts of this class are pretty complex, but the class itself is fairly 
 * easy to use. You just instantiate one object in your game and us the method
 * `isKeyDown()` to check if a specific key is currently pressed down by the 
 * user.
 * 
 * @author BugSlayer
 */
class KeyListener
{
    
    // Array that holds the state of all keys
    private keyCodeStates : boolean[] = new Array<boolean>();
    private keyCodeTyped : boolean[] = new Array<boolean>();

    private prev: boolean[] = new Array<boolean>();

    /**
     * Constructs a new KeyListener.
     */
    constructor() {
        // Register the arrow methods as listeners to keyevents
        // There is a third event ('keypress'), but we do not need to use it
        window.addEventListener("keydown", (ev: KeyboardEvent) => {
            this.keyCodeStates[ev.keyCode] = true;
        });
        window.addEventListener("keyup", (ev: KeyboardEvent) => {
            //this.keyCodeStates[ev.keyCode] = false;
            this.keyCodeStates.splice(ev.keyCode, 1);
        });
    }

    /**
     * Set the state change flags for the coming frame.
     */
    public onFrameStart() {
        console.log(this.keyCodeStates);
        
        // Check which keys are released in the previous frame.
        this.keyCodeTyped = new Array<boolean>();
        this.keyCodeStates.forEach((val, key) => {
            if (this.prev[key]!=val && !this.keyCodeStates[key]) {
                this.keyCodeTyped[key] = true;
                this.prev[key] = val;
            }
        });
    }

    /**
     * Returns `true` if and only if the last known state of the keyboard
     * reflects that the specified key is currently pressed.
     * 
     * @param {number} keyCode the keyCode to check
     * @returns {boolean} `true` when the specified key is currently down
     */
    public isKeyDown(keyCode: number) : boolean
    {
        return this.keyCodeStates[keyCode] == true;
    }

    /**
     * Returns `true` if and only if the last known state of the keyboard
     * reflects that the specified key is released in somewhere during the
     * previous frame.
     * 
     * @param {number} keyCode the keyCode to check
     * @returns {boolean} `true` when the specified key is released in the
     * previous frame.
     */
    public isKeyTyped(keyCode: number) : boolean
    {
        return this.keyCodeTyped[keyCode] == true;
    }

}