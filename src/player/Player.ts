import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import ParticleEmitter from "./ParticleEmitter";
export default class Player{

    private playerSprite : PIXI.Sprite;
    private id : string;
    private particleEmitter : ParticleEmitter;
    

    constructor(renderer: GameRenderer, id : string){
        var element : HTMLImageElement = <HTMLImageElement> AssetLoader.getContent("TestPlayer");

        this.id = id;
        this.playerSprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(element)));
        this.particleEmitter = new ParticleEmitter(renderer, 0,0);
        //renderer.addToMainContainer(this.playerSprite);
    }
    
    public update(renderer: GameRenderer, x: number, y: number, delta : number) : void
    {
        this.playerSprite.position.x = x;
        this.playerSprite.position.y = y;
        
        this.particleEmitter.update(renderer, x, y, delta);
    }

    public getId() : string
    {
        return this.id;
    }

    public setPosition(x: number, y: number) : void
    {
        this.playerSprite.position.x = x;
        this.playerSprite.position.y = y;
    }
}