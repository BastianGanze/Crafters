import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import ParticleEmitter from "./ParticleEmitter";
export default class Player{

    private playerSprite : PIXI.Sprite;
    private id : string;
    private particleEmitter : ParticleEmitter;
    private gameRenderer : GameRenderer;
    

    constructor(renderer: GameRenderer, id : string){
        var element : HTMLImageElement = <HTMLImageElement> AssetLoader.getContent("TestPlayer");
        
        this.gameRenderer = renderer;
        
        this.id = id;
        this.playerSprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(element)));
        this.particleEmitter = new ParticleEmitter(renderer, 0,0);
        //renderer.addToMainContainer(this.playerSprite);
    }
    
    public update(delta : number) : void
    {
        this.particleEmitter.update(this.gameRenderer, this.playerSprite.position.x, this.playerSprite.position.x, delta);
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