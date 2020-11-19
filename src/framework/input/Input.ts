/**
 * Responsible for listening to all game inputs like mouse and keyboard. This 
 * includes the game browser window.
 * 
 * To use the inputs, you can directly adress the `.keyboard`, `.mouse` and 
 * `.window` attributes.
 * 
 * @see KeyListener for how to use the `.keyboard`
 * @see MouseListener for how to use the `.mouse`
 * @see WindowListener for houw to use the `.window`
 * 
 * @author BugSlayer
 */
class Input {

    public static readonly MOUSE_NOTHING   =  0; // No button or un-initialized 
    public static readonly MOUSE_PRIMARY   =  1; // Primary button (usually the left button)
    public static readonly MOUSE_SECONDARY =  2; // Secondary button (usually the right button)
    public static readonly MOUSE_AUXILIARY =  4; // Auxiliary button (usually the mouse wheel button or middle button)
    public static readonly MOUSE_FOURTH    =  8; // 4th button (typically the "Browser Back" button)
    public static readonly MOUSE_FIFTH     = 16; // 5th button (typically the "Browser Forward" button)

    // Some convenient key codes already defined here. If you need a specific
    // keycode, see:https://keycode.info/
    public static readonly KEY_ENTER = 13;
    public static readonly KEY_SHIFT = 16;
    public static readonly KEY_CTRL  = 17;
    public static readonly KEY_ALT   = 18;
    public static readonly KEY_ESC   = 27;
    public static readonly KEY_SPACE = 32;
    public static readonly KEY_LEFT  = 37;
    public static readonly KEY_UP    = 38;
    public static readonly KEY_RIGHT = 39;
    public static readonly KEY_DOWN  = 40;
    public static readonly KEY_DEL   = 46;

    public static readonly KEY_1     = 49;
    public static readonly KEY_2     = 50;
    public static readonly KEY_3     = 51;
    public static readonly KEY_4     = 52;
    public static readonly KEY_5     = 53;
    public static readonly KEY_6     = 54;
    public static readonly KEY_7     = 55;
    public static readonly KEY_8     = 56;
    public static readonly KEY_9     = 57;
    public static readonly KEY_0     = 58;

    public static readonly KEY_A     = 65;
    public static readonly KEY_B     = 66;
    public static readonly KEY_C     = 67;
    public static readonly KEY_D     = 68;
    public static readonly KEY_E     = 69;
    public static readonly KEY_F     = 70;
    public static readonly KEY_G     = 71;
    public static readonly KEY_H     = 72;
    public static readonly KEY_I     = 73;
    public static readonly KEY_J     = 74;
    public static readonly KEY_K     = 75;
    public static readonly KEY_L     = 76;
    public static readonly KEY_M     = 77;
    public static readonly KEY_N     = 78;
    public static readonly KEY_O     = 79;
    public static readonly KEY_P     = 80;
    public static readonly KEY_Q     = 81;
    public static readonly KEY_R     = 82;
    public static readonly KEY_S     = 83;
    public static readonly KEY_T     = 84;
    public static readonly KEY_U     = 85;
    public static readonly KEY_V     = 86;
    public static readonly KEY_W     = 87;
    public static readonly KEY_X     = 88;
    public static readonly KEY_Y     = 89;
    public static readonly KEY_Z     = 90;
    
    /**
     * Holds the current keyboard state. It knows which keys are down at each
     * moment.
     */
    public readonly keyboard : KeyListener = new KeyListener();
} 