import GameRenderer from "./utils/Renderer";
import AssetLoader from "./utils/AssetLoader";
import CommunicationManager from "./communication/CommunicationManager";
import {Logger} from "./utils/Logger";
import {Input} from "./utils/Input";
import Player from "./player/Player";
import Camera from "./utils/Camera";
import Map from "./map/Map";
import PlayerManager from "./player/PlayerManager";
import Vector2D from "./utils/Vector2D";

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

        // this.map = new Map(this.gameRenderer, null);

        this.communicationManager = new CommunicationManager();

        this.playerManager = new PlayerManager(this.communicationManager, this.gameRenderer);

        this.communicationManager.on('player data', function(data)
        {
            Camera.setCameraPosition(new Vector2D(data.physProps.position.x, data.physProps.position.y));
        });
        
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