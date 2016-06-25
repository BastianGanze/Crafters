import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import PI_2 = PIXI.PI_2;
import Vector2D from "../utils/Vector2D";
import Utils from "../utils/Utils";

export default class Particle{

    private particleSprite : PIXI.Sprite;

    private pos : Vector2D;

    private move : Vector2D;

    private liveTime : number;
    private maxLiveTime : number = 800;

    private toDelete : boolean;

    private renderer : GameRenderer;

    constructor(renderer: GameRenderer, pos : Vector2D){
        var element : HTMLImageElement = <HTMLImageElement> AssetLoader.getContent("particle");
        this.particleSprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(element)));
        this.renderer = renderer;
        var r = Math.random() * 10;

        this.pos = pos;

        this.liveTime =0;

        Utils.setSpriteViewportPos(this.particleSprite, this.pos);
        
        renderer.addToMainContainer(this.particleSprite);
        
        this.move.x =  Math.cos(Math.PI * 2 * r);
        this.move.y =  Math.sin(Math.PI * 2 * r);

        this.toDelete = false;

        r = Math.random() * 10;
        this.maxLiveTime *= r;
        this.maxLiveTime /= 50;
    }

    public update(delta: number) : void
    {
        this.liveTime += 16;
        if(this.liveTime > this.maxLiveTime){
            this.toDelete = true;
        }

        this.pos.add(this.move);

        Utils.setSpriteViewportPos(this.particleSprite, this.pos);

        this.particleSprite.alpha *= (15/16);

    }
    
    public checkAlive() : boolean{
        return !this.toDelete;
    }
    public destroy()
    {
        this.renderer.removeFromMainContainer(this.particleSprite);
    }

}