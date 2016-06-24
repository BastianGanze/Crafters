import GameRenderer from "./utils/Renderer";
import AssetLoader from "./utils/AssetLoader";
import CommunicationManager from "./utils/CommunicationManager";
import {Logger} from "./utils/Logger";
import {Input} from "./utils/Input";
import Player from "./player/Player";


var log = Logger("Game");

export default class Game
{
    private gameRenderer : GameRenderer;
    private inputManager : Input.PlayerInput;
    private player : Player;
    private communicationManager : CommunicationManager;

    constructor()
    {
        this.gameRenderer = new GameRenderer();

        this.inputManager = new Input.PlayerInput();
        
        this.player = new Player(this.gameRenderer);

        this.communicationManager = new CommunicationManager();
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