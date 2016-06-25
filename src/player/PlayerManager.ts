/// <reference path="../../libssrc/socket.io-client.d.ts"/>
import {Logger} from "../utils/Logger";
import {Config} from "../config";
import Player from "../player/Player";
import CommunicationManager from "../communication/CommunicationManager";
import GameRenderer from "../utils/Renderer";
import {Input} from "../utils/Input";
import Vector2D from "../utils/Vector2D";

var log = Logger("CommunicationManager");

class PlayerManager {

    protected mainPlayer : Player;
    protected mainPlayerInput : Input.PlayerInput;
    protected otherPlayers : {};
    protected communicationManager : CommunicationManager;
    protected gameRenderer : GameRenderer;
     protected bla :number;
    constructor(communicationManager : CommunicationManager, gameRenderer: GameRenderer) {
        this.otherPlayers = {};
        this.communicationManager = communicationManager;
        this.gameRenderer = gameRenderer;
        this.mainPlayerInput = new Input.PlayerInput();
        this.bla = 0;

        this.communicationManager.on('player data', function(data)
        {
            if(!this.mainPlayer)   
            {
                this.mainPlayer = new Player(gameRenderer, data.id);
                this.mainPlayer.setPosition(new Vector2D(data.physProps.position.x, data.physProps.position.y));
            }
            else
            {
                this.mainPlayer.setPosition(new Vector2D(data.physProps.position.x, data.physProps.position.y));
            }
        }.bind(this));

        this.communicationManager.on('other player data', function(data)
        {
            var player, i, id;

            for(id in this.otherPlayers)
            {
                this.otherPlayers[id].playerUpdated = false;
            }
            
            for(i = 0; i < data.otherPlayers.length; i++)
            {
                player = data.otherPlayers[i];

                if(player.id)
                {
                    if(!this.otherPlayers[player.id])
                    {
                        this.otherPlayers[player.id] = new Player(gameRenderer, player.id);
                    }
                    
                    this.otherPlayers[player.id].setPosition(new Vector2D(player.physProps.position.x, player.physProps.position.y));
                    this.otherPlayers[player.id].playerUpdated = true;
                }

            }

            for(id in this.otherPlayers)
            {
                if(!this.otherPlayers[id].playerUpdated)
                {
                    this.otherPlayers[id].destroy();
                    delete this.otherPlayers[id];
                }
            }
            
        }.bind(this));
    }
    
    public update(delta)
    {

        this.communicationManager.sendEvent('player input', {
            "input" : {
                "mousePosition": {"x": this.mainPlayerInput.getMouseX(), "y": this.mainPlayerInput.getMouseY()},
                "isLeftButtonPressed": this.mainPlayerInput.isMouseButtonPressed(Input.MouseButtons.LEFT),
                "isRightButtonPressed": this.mainPlayerInput.isMouseButtonPressed(Input.MouseButtons.RIGHT)
            }
        });

        if(this.mainPlayer){
            this.mainPlayer.update(delta);
        }
        for(var id in this.otherPlayers){
            this.otherPlayers[id].update(delta);
        }
         
    }
    

}

export default PlayerManager;