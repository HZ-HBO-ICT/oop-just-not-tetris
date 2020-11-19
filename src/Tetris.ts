/// <reference path="framework/Game.ts"/>

/**
 * This is the game main class.
 *
 * Note: below the class definition you will find the main code that launches
 * the game.
 */
class Tetris extends Game {

    protected initResources(): any {
        //TODO add more resources as needed
        return new ResourceConfig(
            [
                "background.png",
                "I.png",
                "L.png",
                "R.png",
                "S.png",
                "T.png",
            ],
            "./assets/images/tetris"
        );
    }

    protected initGame() {

    }

    protected initViews(): { [key: string]: View } {
        return {
            'start': new StartView(),
            'level': new LevelView()
        };
    }

}

// DO NOT CHANGE THE CODE BELOW!
// Declare the game object as global variable for debugging purposes
let game = null;

// Add EventListener to load the game whenever the browser is ready
window.addEventListener('load', function () {
    game = new Tetris(<HTMLCanvasElement>document.getElementById('canvas'));
});
