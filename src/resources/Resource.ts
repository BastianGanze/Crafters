import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import PI_2 = PIXI.PI_2;
import Vector2D from "../utils/Vector2D";
import Utils from "../utils/Utils";
import ParticleEmitter from "../player/ParticleEmitter";

export default class Recource{

    private recourceSprite : PIXI.Sprite;
    private baseTexture : PIXI.BaseTexture;
    private offset : Vector2D;

    private particleEmitter : ParticleEmitter;
    private pos : Vector2D;
    private gameRenderer : GameRenderer;

    constructor(renderer: GameRenderer, pos : Vector2D, type : string){
        var element : HTMLImageElement = <HTMLImageElement> AssetLoader.getContent(type);
        this.baseTexture = new PIXI.BaseTexture(element);
        this.recourceSprite = new PIXI.Sprite(new PIXI.Texture(this.baseTexture));
        this.offset = new Vector2D(this.recourceSprite.width / 2 , this.recourceSprite.height / 2 );
        this.pos = pos;
        this.recourceSprite.tint = 0x8b1c62;

        Utils.setSpriteViewportPos(this.recourceSprite, new Vector2D(this.pos.x - this.offset.x, this.pos.y - this.offset.y));


        this.gameRenderer = renderer;

        this.particleEmitter = new ParticleEmitter(this.gameRenderer, this.pos, true, type, 800, 5, 20);

        this.gameRenderer.addToMainContainer(this.recourceSprite);
    }
    
    public destroy() : void
    {
        this.gameRenderer.removeFromMainContainer(this.recourceSprite);
        this.particleEmitter.destroy();
    }
    
    public update(delta : number){
        Utils.setSpriteViewportPos(this.recourceSprite, new Vector2D(this.pos.x - this.offset.x, this.pos.y - this.offset.y));
        this.particleEmitter.update(this.particleEmitter.getPosition(), delta);
    }
    
    public getPosition() : Vector2D
    {
        return this.pos;
    }

}