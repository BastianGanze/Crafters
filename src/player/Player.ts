import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import ParticleEmitter from "./ParticleEmitter";
export default class Player{


    private id : string;
    private posX : number
    private posY : number;
    private particleEmitter : ParticleEmitter;
    private gameRenderer : GameRenderer;
    

    constructor(renderer: GameRenderer, id : string){

        this.posX = 0;
        this.posY = 0;
        
        this.gameRenderer = renderer;
        
        this.id = id;

        this.particleEmitter = new ParticleEmitter(renderer, 0,0);
        //renderer.addToMainContainer(this.playerSprite);
    }
    
    public update(delta : number) : void
    {
        this.particleEmitter.update(this.posX, this.posY, delta);
    }

    public getId() : string
    {
        return this.id;
    }

    public setPosition(x: number, y: number) : void
    {
        this.posX = x;
        this.posY = y;
    }
    
    public destroy()
    {
        this.particleEmitter.destroy();
    }
}