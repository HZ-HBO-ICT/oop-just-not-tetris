/**
 * Configuration of the resources used in the game.
 */
class ResourceConfig {

    /**
     * Prefix is a string that must preceed each resource URL in order to get
     * the required resource. This is useful when all your resources are located
     * in a central location. Default is set to empty string (""). 
     */
    public readonly prefix: string;

    /**
     * List of all the image urls that need to be loaded.
     */
    public readonly images: string[];

    public constructor(images: string[], prefix="") {
        this.images = images;
        this.prefix = prefix;
    }

}