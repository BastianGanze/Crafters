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

    protected triangle : Resource;
    protected sqare : Resource;
    protected rectangle : Resource;
    
    constructor(communicationManager : CommunicationManager, gameRenderer: GameRenderer)
    {
        this.communicationManager = communicationManager;
        this.gameRenderer = gameRenderer;
        this.communicationManager.on('match data', function(data){
            console.log(data);
         })
    }

    /*
    public update(delta)
    {
        this.communicationManager.on('resources changed')
    }*/


}

export default ResourceManager;
