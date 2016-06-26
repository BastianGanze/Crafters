import Particle from "./Particle";
import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import Vector2D from "../utils/Vector2D";

export default class ParticleEmitter{

    private particles : Particle[];
    private renderer : GameRenderer;
    private particleCount : number = 50;
    private color : number;

    constructor(renderer: GameRenderer, pos : Vector2D, color : number)
    {
        this.particles = [];
        this.color = color;
        this.renderer = renderer;
        for(var i = 0; i < this.particleCount; i ++){
            this.particles[i] = new Particle(renderer, pos, this.color);
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
                this.particles[i] = new Particle(this.renderer, pos, this.color);
            }
            else
                this.particles[i].update(delta);
        }
    }

    public destroy()
    {
        for(var i = 0; i < this.particleCount; i++)
        {
            this.particles[i].destroy();
        }
    }

}