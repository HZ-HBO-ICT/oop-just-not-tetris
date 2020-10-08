/**
 * This class handles all the timing events by computing timing information
 * like frame counters and elapsed times.
 */
class Timing {

    /**
     * The total number of frames/game cycles in this game.
     */
    public gameFrames: number = 0;

    /**
     * The total number of frames / game cycles in this view
     */
    public viewFrames: number = 0;

    /**
     * @internal attribute that holds the start time of the game, used to 
     * compute the gameTime.
     */
    private gameStart: number = performance.now();

    /**
     * The total time in milliseconds that is elapsed since the start of the
     * game.
     */
    public gameTime: number = 0;

    /**
     * @internal attribute that holds the start time of the current view, used
     * to compute the frameTime
     */
    private viewStart: number;

    /**
     * The total time in milliseconds that is elapsed since the start of the
     * view.
     */
    public viewTime: number = 0;

    /**
     * @internal attribute that holds the start time of the current frame, used 
     * to compute the frameTime
     */
    private frameStart: number;


    private frameEnd: number;

    /**
     * The total time in milliseconds that is elapsed since the previous frame
     * / game cycle.
     */
    public frameTime: number = 0;

    /**
     * The total time in milliseconds that is elapsed since the previous frame
     * / game cycle ended and the next frame is started. This is the time the
     * browser effectively does nothing and is a measure of how much computing 
     * time is left for each frame.
     */
    public frameIdleTime: number = 0;

    //TODO: Typedoc here
    public fps: number = 60;
    
    public load: number = 0;

    public get frameComputeTime(): number {
        return this.frameTime - this.frameIdleTime;
    }

    /**
     * Sets the timings after a change of view.
     */
    public onViewSwitched() {
        this.viewFrames = 0;
        this.viewStart = performance.now();
    }

    /**
     * Sets the timings at the start of a new frame.
     */
    public onFrameStart() {
        // Increase the framecounters
        this.gameFrames++;
        this.viewFrames++;

        // Compute the times
        const now = performance.now();
        this.frameIdleTime = now - this.frameEnd;
        this.gameTime = now - this.gameStart;
        this.viewTime = now - this.viewStart;
        this.frameTime = now - this.frameStart;
        this.frameStart = now;
        // Compute frame rate and load
        this.fps = Math.round(1000 / this.frameTime);
        this.load = this.frameComputeTime / this.frameTime;
    }

    /**
     * Sets the timings at the end of each frame
     */
    public onFrameEnd() {
        this.frameEnd = performance.now();
    }
}