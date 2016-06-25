import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";

export default class Player{

    private playerSprite : PIXI.Sprite;
    private id : string;

    constructor(renderer: GameRenderer, id : string){
        var element : HTMLImageElement = <HTMLImageElement> AssetLoader.getContent("TestPlayer");

        this.id = id;
        this.playerSprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(element)));

        renderer.addToMainContainer(this.playerSprite);
    }

    public getId() : string
    {
        return this.id;
    }

    public setPosition(x: number, y: number) : void
    {
        this.playerSprite.position.x = x;
        this.playerSprite.position.y = y;
    }
}