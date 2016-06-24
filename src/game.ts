import GameRenderer from "./utils/Renderer";
import AssetLoader from "./utils/AssetLoader";
import {Logger} from "./utils/Logger";
import {Input} from "./utils/Input";
import Player from "./player/Player";

var log = Logger("Game");

export default class Game
{
    private gameRenderer : GameRenderer;
    private player : Player;

    constructor()
    {
        this.gameRenderer = new GameRenderer();
        this.player = new Player(this.gameRenderer);
    }

    public update(delta : number) : void
    {

    }

    public render() : void
    {
        this.gameRenderer.render();
    }
}