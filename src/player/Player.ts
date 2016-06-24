import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";

export default class Player{

    private playerSprite : PIXI.Sprite;

    constructor(renderer: GameRenderer){
        var element : HTMLImageElement = <HTMLImageElement> AssetLoader.getContent("TestImage");

        this.playerSprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(element)));

        renderer.addToMainContainer(this.playerSprite);
    }

    setPosition(x: number, y: number) : void
    {
        this.playerSprite.position.x = x;
        this.playerSprite.position.y = y;
    }
}