import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import Utils from "../utils/Utils";
import Vector2D from "../utils/Vector2D";

export default class MapHandler{

    private tyleSprite : PIXI.Sprite;
    private pos : Vector2D;

    constructor(baseTexture: PIXI.BaseTexture, position: Vector2D, idX : number, idY : number)
    {
        this.pos = position;
        this.tyleSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(idX* 32,idY * 32,32,32)));
        Utils.setSpriteViewportPos(this.tyleSprite, this.pos);
    }

    public update() : void
    {
        Utils.setSpriteViewportPos(this.tyleSprite, this.pos);
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