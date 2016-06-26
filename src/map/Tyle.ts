import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import Utils from "../utils/Utils";
import Vector2D from "../utils/Vector2D";
import {Config} from "../config";

export default class MapHandler{

    private tyleSprite : PIXI.Sprite;
    private pos : Vector2D;

    constructor(baseTexture: PIXI.BaseTexture, position: Vector2D)
    {
        this.pos = position;
        this.tyleSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0,0,Config.TILE_SIZE_X,Config.TILE_SIZE_Y)));
        Utils.setSpriteViewportPos(this.tyleSprite, this.pos);
    }

    public update() : void
    {
        Utils.setSpriteViewportPos(this.tyleSprite, this.pos);
    }

    public setId(id : number) : void
    {
        var randY = Math.round(Math.random() * 4);
        this.tyleSprite.texture.frame = new PIXI.Rectangle(id * Config.TILE_SIZE_X, randY * Config.TILE_SIZE_Y, Config.TILE_SIZE_X,Config.TILE_SIZE_Y);
    }

    public getSprite() : PIXI.Sprite
    {
        return this.tyleSprite;
    }
}