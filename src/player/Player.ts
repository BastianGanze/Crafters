import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import ParticleEmitter from "./ParticleEmitter";
import Vector2D from "../utils/Vector2D";
import Utils from "../utils/Utils";

import {Logger} from "../utils/Logger";

var log = Logger("Player");

export default class Player{


    private id : string;
    private pos : Vector2D;
    private particleEmitter : ParticleEmitter;
    private gameRenderer : GameRenderer;
    private color;
    private isStunned : boolean;
    private team : string;
    private item : string;
    private playerResourceTextures : { [key:string]:PIXI.BaseTexture; };

    public setPlayerShapeToResourceShape(item : string){
        this.item = item;
        var texture : PIXI.BaseTexture = this.getParticleForm(item);
        if(texture) this.particleEmitter.setParticleBaseTexture(texture);
    }
    
    constructor(renderer: GameRenderer, id : string, team : string, color : number | boolean){

        this.item = "none";
        this.team = team;
        this.color = color;
        this.pos = new Vector2D(0, 0);
        this.gameRenderer = renderer;
        this.playerResourceTextures = {};
        this.id = id;
        this.particleEmitter = new ParticleEmitter(renderer, new Vector2D(0 ,0), this.color, this.item, 800, 3);
        this.loadResourceTextures();
    }

    protected getParticleForm(name : string) : PIXI.BaseTexture
    {
        return this.playerResourceTextures[name];
    }

    protected loadResourceTextures()
    {
        var particleNames = ["Triangle", "Square", "Pentagon"],
            element : HTMLImageElement;
        for(var i = 0; i < particleNames.length; i++)
        {
            element = <HTMLImageElement> AssetLoader.getContent(particleNames[i]);
            if(element)
            {
                this.playerResourceTextures[particleNames[i]] = new PIXI.BaseTexture(element);
            }
            else
            {
                log.error('Could not find picture for "'+element+'" particle.');
            }
            element = <HTMLImageElement> AssetLoader.getContent('none');
            this.playerResourceTextures["none"] = new PIXI.BaseTexture(element);
        }
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