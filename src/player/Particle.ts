import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import PI_2 = PIXI.PI_2;

export default class Particle{

    private particleSprite : PIXI.Sprite;

    private posX : number;
    private posY : number;

    private moveX : number;
    private moveY : number;

    private liveTime : number;
    private maxLiveTime : number = 800;

    private toDelete : boolean;

    private renderer : GameRenderer;

    constructor(renderer: GameRenderer, _X : number, _Y : number){
        var element : HTMLImageElement = <HTMLImageElement> AssetLoader.getContent("particle");
        this.particleSprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(element)));
        this.renderer = renderer;
        var r = Math.random() * 10;

        this.posX = _X;
        this.posY = _Y;

        this.liveTime =0;

        this.particleSprite.position.x = this.posX;
        this.particleSprite.position.y = this.posY;
        
        renderer.addToMainContainer(this.particleSprite);
        
        this.moveX =  Math.cos(Math.PI * 2 * r);
        this.moveY =  Math.sin(Math.PI * 2 * r);

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

        this.posX += this.moveX;
        this.posY += this.moveY;

        this.particleSprite.position.x = this.posX;
        this.particleSprite.position.y = this.posY;
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