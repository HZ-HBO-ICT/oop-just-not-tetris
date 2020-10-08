/// <reference path="framework/Game.ts"/>

/**
 * This is the game main class.
 * 
 * Note: below the class definition you will find the main code that launches
 * the game.
 */
class MyGame extends Game {

    protected initResources(): any {
        //TODO add more resources as needed
        return new ResourceConfig(
            [
                "PNG/UI/buttonBlue.png",
            ],
            "./assets/images/SpaceShooterRedux"
        );
    }
    
    protected initGame() {
        //TODO configure the session as needed
        //These are all examples. Add properties if you like
        this.session.player = "Player one";
        this.session.score = 0;
        this.session.level = 1;
        this.session.lives = 3;
        this.session.highscores = [
                {
                    playerName: 'Loek',
                    score: 40000
                },
                {
                    playerName: 'Daan',
                    score: 34000
                },
                {
                    playerName: 'Rimmert',
                    score: 200
                }
            ];
    }

    protected initViews(): {[key: string]: View} {
        //TODO add more views as needed
        return {
            'start' : new StartView(),
        };
    }

}

// DO NOT CHANGE THE CODE BELOW!
// Declare the game object as global variable for debugging purposes
let game = null;

// Add EventListener to load the game whenever the browser is ready
window.addEventListener('load', function () {
    game = new MyGame(<HTMLCanvasElement>document.getElementById('canvas'));
});
