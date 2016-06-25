import Particle from "./Particle";
import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";

export default class ParticleEmitter{

    private particles : Particle[];

    constructor(renderer: GameRenderer, _X : number, _Y : number)
    {
        this.particles = [];
        for(var i = 0; i < 1000; i ++){
            this.particles[i] = new Particle(renderer, _X, _Y);
        }
    }

    public update(renderer: GameRenderer, _X : number, _Y : number, delta : number) : void
    {
        for(var i = 0; i < 1000; i ++){
            if(!this.particles[i].checkAlive()){
                renderer.removeFromMainContainer(this.particles[i].getSprite())
                this.particles[i] = new Particle(renderer, _X, _Y);
            }
            else
                this.particles[i].update(delta);
        }
    }

}