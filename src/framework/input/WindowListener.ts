/**
 * This class represents the main game window. Responsible to know its size. This is placed in a 
 * separate class because detecting window size can be tricky and browser dependent.
 * 
 * Some parts of this class are pretty complex, but the class itself is fairly easy to use.
 * 
 * @author BugSlayer
 */
class WindowListener
{
    size: Vector;

	/**
	 * Constructs a new WindowListener
	 */
    constructor()
    {
        this.listen(0);
    }

    /**
     * Listen to the window state.
     * 
     * @param interval the time interval between this call and the previous
     */
    public listen(interval: number) : void
    {
     	// Taken from some StackOverflow discussion 
		// http://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
        var w = 0;var h = 0;
		//IE
		if(!window.innerWidth){
		    if(!(document.documentElement.clientWidth == 0)){
		        //strict mode
		        w = document.documentElement.clientWidth;h = document.documentElement.clientHeight;
		    } else{
		        //quirks mode
		        w = document.body.clientWidth;
		        h = document.body.clientHeight;
		    }
		} else {
		    //w3c
		    w = window.innerWidth;h = window.innerHeight;
		}
		this.size = new Vector(w, h);
    }
}