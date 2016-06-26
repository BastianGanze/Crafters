import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import PI_2 = PIXI.PI_2;
import Vector2D from "../utils/Vector2D";
import Utils from "../utils/Utils";
import ParticleEmitter from "../player/ParticleEmitter";

export default class Recource{
    
    private particleEmitter : ParticleEmitter;
    private pos : Vector2D;
    private gameRenderer : GameRenderer;
    constructor(renderer: GameRenderer, pos : Vector2D, type : string){
        this.gameRenderer = renderer;
        this.pos = pos;
        this.particleEmitter = new ParticleEmitter(this.gameRenderer, this.pos, true, type, 800, 5);
    }
    
    public destrox() : void
    {
        this.particleEmitter.destroy();
    }
    
    public update(delta : number){
        this.particleEmitter.update(this.particleEmitter.getPosition(), delta);
    }
    
    public getPosition() : Vector2D
    {
        return this.pos;
    }

}