import {Logger} from "../utils/Logger";
import {Config} from "../config";
import Player from "../player/Player";
import CommunicationManager from "../communication/CommunicationManager";
import GameRenderer from "../utils/Renderer";
import Camera from "../utils/Camera";
import {Input} from "../utils/Input";
import Vector2D from "../utils/Vector2D";
import Resource from "./Resource";

var log = Logger("CommunicationManager");

class ResourceManager {

    protected communicationManager : CommunicationManager;
    protected gameRenderer : GameRenderer;

    protected resources : Resource[];


    
    constructor(communicationManager : CommunicationManager, gameRenderer: GameRenderer)
    {
        this.communicationManager = communicationManager;
        this.gameRenderer = gameRenderer;
        this.resources = [];
        this.communicationManager.on('match data', function(data){
            for(var i in data.match.resources)
            {
                console.log(data.match.resources[i].type);
               this.resources[i] = new Resource(this.gameRenderer, data.match.resources[i].position, data.match.resources[i].type);
            }
            
         }.bind(this));
    }

    
    public update(delta)
    {
        for(var i in this.resources)
        {
            this.resources[i].update(delta);
        }
        this.communicationManager.on('resources changed', function(data){
            for(var i in this.resources)
            {
                this.resources[i].destrox();
            }
            for(var i in data.match.resources)
            {
                this.resources[i] = new Resource(this.gameRenderer, data.match.resources[i].position, data.match.resources[i].type);
            }
        }.bind(this));
    }


}

export default ResourceManager;
