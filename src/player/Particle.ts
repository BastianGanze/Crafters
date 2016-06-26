import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import PI_2 = PIXI.PI_2;
import Vector2D from "../utils/Vector2D";
import Utils from "../utils/Utils";

export default class Particle{

    private particleSprite : PIXI.Sprite;
    private baseTexture : PIXI.BaseTexture;

    private pos : Vector2D;
    private offset : Vector2D


    private move : Vector2D;

    private liveTime : number;
    private maxLiveTime : number;

    private toDelete : boolean;

    private renderer : GameRenderer;
    
    private emittingRadius : number;

    private color;

    constructor(renderer: GameRenderer, pos : Vector2D, color : number | boolean, baseTexture : PIXI.BaseTexture, maxTime : number, emittingRadius : number){
        this.emittingRadius = emittingRadius;
        this.maxLiveTime = maxTime;
        this.baseTexture = baseTexture;
        this.particleSprite = new PIXI.Sprite(new PIXI.Texture(this.baseTexture));
        this.offset = new Vector2D(this.particleSprite.width / 2, this.particleSprite.height / 2);
        this.renderer = renderer;
        if(typeof color == "number"){
            this.color = color;
            this.particleSprite.tint = this.color;//'#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
        }
        if(typeof color == "boolean"){
            this.color = color;
            console.log(this.color);
            if(this.color){
                //this.particleSprite.tint = Math.random() * 0xffffff;
                var r = Math.random() * 0xff0000;
                var g = Math.random() * 0x00ff00;
                var b = Math.random() * 0x0000ff;
                this.particleSprite.tint = r + g + b;
            }

        }
        
        var r = Math.random() * 10;
        
        this.pos = new Vector2D(pos.x - this.offset.x, pos.y - this.offset.y);;

        this.liveTime = 0;

        Utils.setSpriteViewportPos(this.particleSprite, this.pos);
        
        renderer.addToMainContainer(this.particleSprite);

        this.move = new Vector2D(0,0);
        this.move.x =  this.emittingRadius * Math.cos(Math.PI * 2 * r);
        this.move.y =  this.emittingRadius * Math.sin(Math.PI * 2 * r);

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

        if(!this || !this.pos || !this.pos.add) debugger;

        this.pos = new Vector2D(this.pos.x + this.move.x, this.pos.y + this.move.y);
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