import AssetLoader from "../utils/AssetLoader";
import GameRenderer from "../utils/Renderer";
import ParticleEmitter from "./ParticleEmitter";
export default class Player{

    private playerSprite : PIXI.Sprite;
    private particleEmitter : ParticleEmitter;
    

    constructor(renderer: GameRenderer){
        var element : HTMLImageElement = <HTMLImageElement> AssetLoader.getContent("TestImage");

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

    setPosition(x: number, y: number) : void
    {
        this.playerSprite.position.x = x;
        this.playerSprite.position.y = y;
    }
}