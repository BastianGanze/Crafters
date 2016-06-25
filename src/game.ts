import GameRenderer from "./utils/Renderer";
import AssetLoader from "./utils/AssetLoader";
import CommunicationManager from "./communication/CommunicationManager";
import {Logger} from "./utils/Logger";
import {Input} from "./utils/Input";
import Player from "./player/Player";
import Map from "./map/Map";
import PlayerManager from "./player/PlayerManager";

var log = Logger("Game");

export default class Game
{
    private gameRenderer : GameRenderer;
    private inputManager : Input.PlayerInput;
    private player : Player;
    private map : Map;
    private communicationManager : CommunicationManager;
    private playerManager : PlayerManager;

    constructor()
    {
        this.gameRenderer = new GameRenderer();

        this.inputManager = new Input.PlayerInput();

        this.map = new Map(this.gameRenderer, null);

        this.communicationManager = new CommunicationManager();

        this.playerManager = new PlayerManager(this.communicationManager, this.gameRenderer);

        this.communicationManager = new CommunicationManager()
        
    }

    public update(delta : number) : void
    {
        this.playerManager.update(delta);
    }

    public render() : void
    {
        this.gameRenderer.render();
    }
}