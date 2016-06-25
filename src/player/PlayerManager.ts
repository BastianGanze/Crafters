/// <reference path="../../libssrc/socket.io-client.d.ts"/>
import {Logger} from "../utils/Logger";
import {Config} from "../config";
import Player from "../player/Player";
import CommunicationManager from "../communication/CommunicationManager";
import GameRenderer from "../utils/Renderer";
import {Input} from "../utils/Input";

var log = Logger("CommunicationManager");

class PlayerManager {

    protected mainPlayer : Player;
    protected mainPlayerInput : Input.PlayerInput;
    protected otherPlayers : {};
    protected communicationManager : CommunicationManager;
    protected gameRenderer : GameRenderer;
    
    constructor(communicationManager : CommunicationManager, gameRenderer: GameRenderer) {
        this.otherPlayers = {};
        this.communicationManager = communicationManager;
        this.gameRenderer = gameRenderer;
        this.mainPlayerInput = new Input.PlayerInput();
        
        this.communicationManager.on('player data', function(data)
        {
            if(!this.mainPlayer)   
            {
                this.mainPlayer = new Player(gameRenderer, data.id);
                this.mainPlayer.setPosition(data.physProps.position.x, data.physProps.position.y);
            }
            else
            {
                this.mainPlayer.setPosition(data.physProps.position.x, data.physProps.position.y);
            }
        });
        this.communicationManager.on('other player data', function(data)
        {

        });
    }
    
    public update(delta)
    {
        this.communicationManager.sendEvent('player input', {
            "mousePosition": {"x": this.mainPlayerInput.getMouseX(), "y": this.mainPlayerInput.getMouseY()}, 
            "isLeftButtonPressed": this.mainPlayerInput.isMouseButtonPressed(Input.MouseButtons.LEFT),
            "isRightButtonPressed": this.mainPlayerInput.isMouseButtonPressed(Input.MouseButtons.RIGHT)
        });
    }
    

}

export default PlayerManager;