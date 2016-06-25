import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import ParticleEmitter from "./ParticleEmitter";
import Vector2D from "../utils/Vector2D";
export default class Player{


    private id : string;
    private pos : Vector2D;
    private particleEmitter : ParticleEmitter;
    private gameRenderer : GameRenderer;
    private color;
    private team : string;
    
    constructor(renderer: GameRenderer, id : string, team : string, color : number){

        this.team = team;
        this.color = color;
        this.pos = new Vector2D(0, 0);
        this.gameRenderer = renderer;
        
        this.id = id;

        this.particleEmitter = new ParticleEmitter(renderer, new Vector2D(0,0), this.color);
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
    
    public getTeam() : string
    {
        return this.team;
    }
}