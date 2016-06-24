import GameRenderer from "./utils/Renderer";
import AssetLoader from "./utils/AssetLoader";
import {Logger} from "./utils/Logger";
import {Input} from "./utils/Input";
import Player from "./player/Player";


var log = Logger("Game");

export default class Game
{
    private gameRenderer : GameRenderer;
    private inputManager : Input.PlayerInput;
    private player : Player;

    constructor()
    {
        this.gameRenderer = new GameRenderer();

        this.inputManager = new Input.PlayerInput();
        
        this.player = new Player(this.gameRenderer);
    }

    public update(delta : number) : void
    {
        this.player.setPosition(this.inputManager.getMouseX(), this.inputManager.getMouseY());
    }

    public render() : void
    {
        this.gameRenderer.render();
    }
}