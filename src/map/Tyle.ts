import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";

export default class MapHandler{

    private tyleSprite : PIXI.Sprite;
    private x: number;
    private y: number;

    constructor(baseTexture: PIXI.BaseTexture, positionX: number, positionY: number)
    {
        this.x = positionX;
        this.y = positionY;
        this.tyleSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0,0,16,16)));
        this.tyleSprite.position.x = this.x;
        this.tyleSprite.position.y = this.y;
    }

    public setNewTexture(baseTexture: PIXI.BaseTexture) : void
    {
        this.tyleSprite.texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(0,0,16,16));
    }

    public getSprite() : PIXI.Sprite
    {
        return this.tyleSprite;
    }
}