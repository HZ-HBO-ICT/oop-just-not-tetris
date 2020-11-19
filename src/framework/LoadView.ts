/// <reference path="View.ts"/>
/**
 * A view to show when all the resources are loaded. The view waits until all
 * resources are loaded and until a minimum frame time has passed.
 */
class LoadView extends View {

    /**
     * The minimum frameTime that this view should be visible until the next
     * view should be shown.
     */
    public static readonly MINIMUM_FRAME_TIME = 1000;

    private nextView: string;

    /**
     * Constructs a new LoadView
     * 
     * @param {string} nextView name of the next view to be shown. 
     */
    public constructor(nextView: string) {
        super();
        this.nextView = nextView;
    }


    /**
     * @override
     */
    public listen(input: Input) {
        super.listen(input);
    }


    /**
     * @override
     */
    public adjust(game: Game) {
        // See if the repo is fully loaded to progress to the start screen
        // Minimum time of approx 2 seconds
        if (!game.repo.isLoading() && 
                game.timing.viewTime > LoadView.MINIMUM_FRAME_TIME) {
            game.switchViewTo(this.nextView);
        }        
    }


    /**
     * @override
     */
    public draw(ctx: CanvasRenderingContext2D) {
        this.writeTextToCanvas(ctx, "Loading...", 80, this.center.x, this.center.y, 'center', 'black');
    }

}