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
import MatchManager from "./match/MatchManager";

var log = Logger("Game");

export default class Game
{
    private gameRenderer : GameRenderer;
    private inputManager : Input.PlayerInput;
    private player : Player;
    private map : Map;
    private communicationManager : CommunicationManager;
    private matchManager : MatchManager;
    private playerManager : PlayerManager;

    constructor()
    {
        this.gameRenderer = new GameRenderer();

        this.inputManager = new Input.PlayerInput();

        this.map = new Map(this.gameRenderer, null);

        this.communicationManager = new CommunicationManager();

        this.matchManager = new MatchManager(this.communicationManager, this.gameRenderer);

        this.playerManager = new PlayerManager(this.communicationManager, this.gameRenderer, this.matchManager);

        this.communicationManager.on('player data', function(data)
        {
            Camera.setCameraPosition(new Vector2D(data.physProps.position.x, data.physProps.position.y));
        }.bind(this));

        this.communicationManager.on('map data', function(data){
            this.map.updateMap(data.map);
        }.bind(this));
        
    }

    public update(delta : number) : void
    {
        this.playerManager.update(delta);
        this.matchManager.update(delta);
        this.map.update();
    }

    public render() : void
    {
        this.gameRenderer.render();
    }
}