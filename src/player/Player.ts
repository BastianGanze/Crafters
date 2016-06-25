import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import ParticleEmitter from "./ParticleEmitter";
import Vector2D from "../utils/Vector2D";
export default class Player{


    private id : string;
    private pos : Vector2D;
    private particleEmitter : ParticleEmitter;
    private gameRenderer : GameRenderer;
    

    constructor(renderer: GameRenderer, id : string){

        this.pos = new Vector2D(0, 0);
        this.gameRenderer = renderer;
        
        this.id = id;

        this.particleEmitter = new ParticleEmitter(renderer, new Vector2D(0,0));
        //renderer.addToMainContainer(this.playerSprite);
    }
    
    public update(delta : number) : void
    {
        this.particleEmitter.update(this.pos, delta);
    }

    public getId() : string
    {
        return this.id;
    }

    public setPosition(pos : Vector2D) : void
    {
        this.pos = pos;
    }
    
    public destroy()
    {
        this.particleEmitter.destroy();
    }
}