import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";

export default class MapHandler{

    private tyleSprite : PIXI.Sprite;

    constructor(texture: PIXI.Texture, positionX: number, positionY: number)
    {
        this.tyleSprite = new PIXI.Sprite(texture);
        this.tyleSprite.position.x = positionX;
        this.tyleSprite.position.y = positionY;
    }

    public setNewTexture(texture: PIXI.Texture) : void
    {
        this.tyleSprite.texture = texture;
    }

    public getSprite() : PIXI.Sprite
    {
        return this.tyleSprite;
    }
}