import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import Tyle from "./Tyle";
import {Config} from "../config";
import Vector2D from "../utils/Vector2D";

export default class Map{

    private baseTexture : PIXI.BaseTexture;
    private tyleMap : Tyle[][];
    private centerX : number;
    private centerY : number;
    private gameRenderer : GameRenderer;

    constructor(renderer: GameRenderer, map: number[]){
        var element : HTMLImageElement = <HTMLImageElement> AssetLoader.getContent("tileset");

        //load base Sprites
        this.baseTexture = new PIXI.BaseTexture(element);
        this.gameRenderer = renderer;

        //create tylemap
        this.tyleMap = [];
        for(var i = 0; i < Config.MAP_SIZE_X; i++){
            this.tyleMap[i] = [];
            for(var j = 0; j < Config.MAP_SIZE_Y; j++){
                this.tyleMap[i][j] = new Tyle(this.baseTexture, new Vector2D(i * Config.TILE_SIZE_X, j * Config.TILE_SIZE_X));
                this.tyleMap[i][j].setId(0);
                renderer.addToMainContainer(this.tyleMap[i][j].getSprite());
            }
        }
    }
    
    public update() : void
    {
        for(var i = 0; i < Config.MAP_SIZE_X; i++){
            for(var j = 0; j < Config.MAP_SIZE_Y; j++){
                this.tyleMap[i][j].update();
            }
        }
    }

    public updateMap(map: number[]) : void
    {
        for(var i = 0; i < Config.MAP_SIZE_X; i++){
            for(var j = 0; j < Config.MAP_SIZE_Y; j++){

                this.tyleMap[i][j].setId(map[i][j]);
            }
        }
    }

}