import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import Tyle from "./Tyle";

export default class Map{

    private baseTexture : PIXI.BaseTexture;
    private tyleMap : Tyle[][];
    private centerX : number;
    private centerY : number;

    constructor(renderer: GameRenderer, map: number[]){
        var element : HTMLImageElement = <HTMLImageElement> AssetLoader.getContent("TestImage");

        //load base Sprites
        this.baseTexture = new PIXI.BaseTexture(element);

        //compute center


        //create tylemap
        this.tyleMap = [];
        for(var i = 0; i < 64; i++){
            this.tyleMap[i] = [];
            for(var j = 0; j < 64; j++){
                this.tyleMap[i][j] = new Tyle(new PIXI.Texture(this.baseTexture), i * 16, j * 16);
                renderer.addToMainContainer(this.tyleMap[i][j].getSprite());
            }
        }
    }

    public updateMap(renderer: GameRenderer, map: number[]) : void
    {
        for(var i = 0; i < 64; i++){
            for(var j = 0; j < 64; j++){
                renderer.removeFromMainContainer(this.tyleMap[i][j].getSprite());
                this.tyleMap[i][j].setNewTexture(new PIXI.Texture(this.baseTexture));
                renderer.addToMainContainer(this.tyleMap[i][j].getSprite());
            }
        }
    }

}