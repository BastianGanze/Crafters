import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import Utils from "../utils/Utils";
import Vector2D from "../utils/Vector2D";

export default class CraftingArea{

    private sprite : PIXI.Sprite;
    private pos : Vector2D;
    protected gameRenderer : GameRenderer;

    constructor(baseTexture : PIXI.BaseTexture, renderer: GameRenderer, position: Vector2D, color: number)
    {
        this.pos = position;
        this.gameRenderer = renderer;
        this.sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture));
        this.gameRenderer.addToMainContainer(this.sprite);
        this.sprite.tint = color;
        this.sprite.anchor = new PIXI.Point(0.5 , 0.5);
        Utils.setSpriteViewportPos(this.sprite, this.pos);
    }

    public setColor(color : number)
    {
        this.sprite.tint = color;
    }

    public update(delta : number) : void
    {
        this.sprite.rotation += 20 * delta/1000;
        if(this.sprite.rotation > 360) this.sprite.rotation = this.sprite.rotation - 360;
        Utils.setSpriteViewportPos(this.sprite, this.pos);
    }
}