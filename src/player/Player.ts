import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import ParticleEmitter from "./ParticleEmitter";
import Vector2D from "../utils/Vector2D";
import Utils from "../utils/Utils";
export default class Player{


    private id : string;
    private pos : Vector2D;
    private particleEmitter : ParticleEmitter;
    private gameRenderer : GameRenderer;
    private color;
    private isStunned : boolean;
    private team : string;
    
    constructor(renderer: GameRenderer, id : string, team : string, color : number | boolean){

        this.team = team;
        this.color = color;
        this.pos = new Vector2D(0, 0);
        this.gameRenderer = renderer;
        
        this.id = id;

        this.particleEmitter = new ParticleEmitter(renderer, new Vector2D(0 ,0), this.color, "particle", 800, 3);
    }
    
    public update(delta : number) : void
    {
        this.particleEmitter.update(this.pos, delta);
        this.updateColorAccordingToStatus(delta);
    }

    public updateColorAccordingToStatus(delta)
    {
        if(this.isStunned)
        {
            this.particleEmitter.setColor(Utils.colorMakeBrighter(this.color, Math.round(Math.random()*50)+50));
        }
        else
        {
            this.particleEmitter.setColor(this.color);
        }
    }

    public getId() : string
    {
        return this.id;
    }

    public setPosition(pos : Vector2D) : void
    {
        this.pos = pos;
    }
    
    public setIsStunned(isStunned : boolean)
    {
        this.isStunned = isStunned;
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