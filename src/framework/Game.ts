/**
 * Base class of a game. Each game should have an implementation of this class
 * and implement its abstract methods:
 * ``` 
 *  protected initGame(): void
 *  protected initResources(): ResourceConfig
 * ```
 * @author Bugslayer
 */
abstract class Game {

    /**
     * Holds the canvas HTML element where this game should draw on. This 
     * variable knows the screen size.
     */
    public readonly canvas: HTMLCanvasElement;
    
    
    /**
     * @internal attribute that holds the RenderContext to draw on. This will
     * be used in the `draw()` method.
     */
    private readonly ctx: CanvasRenderingContext2D;


    /**
     * Holds the input handler that listens to all the user inputs like mouse
     * and keyboard.
     */
    public readonly input: Input = new Input();
    

    /**
     * Holds the resource repository that holds all the resources that can be
     * used in the game. This repository is configured with the 
     * `ResourceConfig` object that is returned by the `initResources()`
     * method.
     */
    public readonly repo: ResourceRepository;


    /**
     * Holds an object containing all the game info that should be passed to
     * the different views. It can and should be used to hold the player info
     * like score and health, but might also be used for highscores, etc.
     * 
     * Implementing classes can configure this object as needed. You can add
     * and manipulate attributes. ie:
     * ```
     * this.session.score = 0;
     * this.session.highscores = [
     *     { name: 'Joe', score: 4000 },
     *     { ... }
     * ];
     * ```
     */
    public readonly session: any = { debug: false };


    /**
     * Holds the timing info like frame counters and elapsed times.
     */
    public readonly timing: Timing = new Timing();


    /**
     * @internal Holds the views as key-value pairs
     */
    private views: {[key: string]: View};


    /**
     * @internal Holds the current animated view.
     */
    private currentView : View;


    /**
     * Construct a new Game.
     * 
     * @param {HTMLCanvasElement} canvasId 
     */
    public constructor(canvasId: HTMLCanvasElement) {
        // Construct all of the canvas
        this.canvas = canvasId;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Set the context of the canvas
        this.ctx = this.canvas.getContext('2d');
        // Create the image repository
        this.repo = new ResourceRepository(this.initResources());
        // Let the implementing class initialize itself
        this.initGame();

        this.views = this.initViews();
        // Start the main animation loop
        this.startAnimation();
        // Set the LoadView view as the current view
        this.setCurrentView(new LoadView(Object.keys(this.views)[0]));
    }


    /**
     * Return the resource configuration for this game. Resources are objects 
     * like images and sounds that are loaded once into memory and should be
     * used throughout the entire game. The process of loading is complex,
     * mostly it is handled ansynchonously by the browser. This complexity is
     * handled entirely by the game.
     * 
     * @returns {ResourceConfig} the resource configuration that must be used
     * to initialize the resource repository. 
     */
    protected abstract initResources(): ResourceConfig;


    /**
     * Return a dictionary (key-value pairs) of all the views of the game. The
     * key is a unique name for the related view and is used by the 
     * setCurrentView() method to find the view to be rendered next. An 
     * implementation of this method would typically be like:
     * 
     * ```
     *     protected getViews(): {[key: string]: View} {
     *        return {
     *            'foo' : new FooView(),
     *            'bar' : new BarView(),
     *        };
     *    }
     *```
     * NOTE: the first view in this list will be the key that will be returned
     * by Object.keys(views)[0]; That is the first view in the list ('foo' in 
     * the example above).
     */
    protected abstract initViews(): {[key: string]: View};


    /**
     * Initializes the game. This method is called when a new Game is 
     * instantiated. Subclasses must implement this method and use it to
     * initialize their game session.
     */
    protected abstract initGame(): void;


    /**
     * Sets the specified view as the new view to animate and show. This view 
     * will be animated on the next animationFrames until another view is set.
     * 
     * If the specified view name does not exist, an Error will be thrown.
     * 
     * @param {string} viewName the name of the new view to show
     */
    public switchViewTo(viewName: string) {
        const newView = this.views[viewName];
        if (!newView) {
            throw new Error(`A view with the name ${viewName} does not exist.`);
        }
        this.setCurrentView(newView);
    }


    /**
     * @internal Sets the currentView to the specified view. This view will be 
     * animated on the next animationFrames until another view is set.
     * 
     * @param view the view to show
     */
    private setCurrentView(view: View) {
        this.currentView = view;
        console.log("Setting view to " + view)
        this.currentView.init(this);
        this.timing.onViewSwitched();
    }


    /**
     * @internal Start the animation loop
     */
    private startAnimation() {
        console.log('start animation');
        requestAnimationFrame(this.animate);
    }


    /**
     * @internal Arrow function because it needs to be called from within
     * RequestAnimationFrame.
     * 
     * This needs to be an arrow function because it needs to be called from
     * the global scope and uses `this`.
     */
    animate = () => {
        this.timing.onFrameStart();
        if (this.currentView != null) {

            this.currentView.listen(this.input);

            this.currentView.move(this.canvas);

            this.currentView.prepareDraw(this.ctx);
            this.currentView.draw(this.ctx);
            if(this.session.debug) {
                this.currentView.drawDebug(this.ctx);
            }
            
            this.currentView.adjust(this);
        }
        this.timing.onFrameEnd();
        requestAnimationFrame(this.animate);
    }

    /**
    * Generates a random integer number between min and max
    * 
    * @param {number} min - minimal time
    * @param {number} max - maximal time
    */
    public static randomInteger(min: number, max: number): number {
        return Math.round(Game.randomNumber(min, max));
    }


    /**
    * Generates a random number between min and max
    * 
    * @param {number} min - minimal time
    * @param {number} max - maximal time
    */
    public static randomNumber(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

}

