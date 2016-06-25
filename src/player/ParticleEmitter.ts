import Particle from "./Particle";
import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";

export default class ParticleEmitter{

    private particles : Particle[];
    private renderer : GameRenderer;
    private particleCount : number = 50;

    constructor(renderer: GameRenderer, _X : number, _Y : number)
    {
        this.particles = [];
        this.renderer = renderer;
        for(var i = 0; i < this.particleCount; i ++){
            this.particles[i] = new Particle(renderer, _X, _Y);
        }
    }

    public update(_X : number, _Y : number, delta : number) : void
    {
        for(var i = 0; i < this.particleCount; i++){
            if(!this.particles[i].checkAlive()){
                this.particles[i].destroy();
                this.particles[i] = new Particle(this.renderer, _X, _Y);
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