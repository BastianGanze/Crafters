import Particle from "./Particle";
import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import Vector2D from "../utils/Vector2D";

export default class ParticleEmitter{

    private baseTexture : PIXI.BaseTexture;
    private particles : Particle[];
    private renderer : GameRenderer;
    private particleCount : number = 50;
    private color : number | boolean;
    private maxTime : number;
    private emittingRadius : number;
    private pos : Vector2D;

    constructor(renderer: GameRenderer, pos : Vector2D, color : number | boolean, texturePath : string, maxTime : number, emitingRadius : number)
    {
        this.pos = pos;
        this.emittingRadius = emitingRadius;
        var element : HTMLImageElement = <HTMLImageElement> AssetLoader.getContent(texturePath);
        this.baseTexture = new PIXI.BaseTexture(element);
        this.particles = [];
        this.color = color;
        this.renderer = renderer;
        this.maxTime = maxTime;
        for(var i = 0; i < this.particleCount; i ++){
            this.particles[i] = new Particle(renderer, pos, this.color, this.baseTexture, this.maxTime, this.emittingRadius);
        }
    }
    
    public setSprite(sprite : string){
        var element : HTMLImageElement = <HTMLImageElement> AssetLoader.getContent(sprite);
        this.baseTexture = new PIXI.BaseTexture(element);
        for(var i = 0; i < this.particleCount; i ++){
            this.particles[i].setSprite(this.baseTexture);
        }
    }

    public setColor(color : number)
    {
        this.color = color;
    }

    public update(pos : Vector2D, delta : number) : void
    {
        
        for(var i = 0; i < this.particleCount; i++){
            if(!this.particles[i].checkAlive()){
                this.particles[i].destroy();
                this.particles[i] = new Particle(this.renderer, pos, this.color, this.baseTexture, this.maxTime, this.emittingRadius);
            }
            else
                this.particles[i].update(delta);
        }
    }
    
    public getPosition() : Vector2D
    {
        return this.pos;
    }

    public destroy()
    {
        for(var i = 0; i < this.particleCount; i++)
        {
            this.particles[i].destroy();
        }
    }

}