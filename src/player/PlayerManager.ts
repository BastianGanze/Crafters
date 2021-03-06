/// <reference path="../../libssrc/socket.io-client.d.ts"/>
import {Logger} from "../utils/Logger";
import {Config} from "../config";
import Player from "../player/Player";
import CommunicationManager from "../communication/CommunicationManager";
import GameRenderer from "../utils/Renderer";
import Camera from "../utils/Camera";
import {Input} from "../utils/Input";
import Vector2D from "../utils/Vector2D";
import MatchManager from "../match/MatchManager";

var log = Logger("CommunicationManager");

class PlayerManager {

    protected mainPlayer : Player;
    protected mainPlayerInput : Input.PlayerInput;
    protected otherPlayers : {};
    protected communicationManager : CommunicationManager;
    protected matchManager : MatchManager;
    protected gameRenderer : GameRenderer;
     protected bla :number;
    constructor(communicationManager : CommunicationManager, gameRenderer: GameRenderer, matchManager : MatchManager) {
        this.otherPlayers = {};
        this.communicationManager = communicationManager;
        this.gameRenderer = gameRenderer;
        this.matchManager = matchManager;
        
        this.mainPlayerInput = new Input.PlayerInput();
        this.bla = 0;

        this.communicationManager.on('player data', function(data)
        {
            if(!this.mainPlayer)   
            {
                this.mainPlayer = new Player(gameRenderer, data.id, data.team, Config.COLOR_ME);
                this.matchManager.setMainPlayerTeam(data.team.id);
            }
            this.mainPlayer.setPosition(new Vector2D(data.physProps.position.x, data.physProps.position.y));
            this.mainPlayer.setIsStunned(data.isStunned);
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
                        if(player.team === this.mainPlayer.getTeam())
                            this.otherPlayers[player.id] = new Player(gameRenderer, player.id, player.team, Config.COLOR_FRIEND);
                        else
                            this.otherPlayers[player.id] = new Player(gameRenderer, player.id, player.team, Config.COLOR_FOE);
                    }
                    
                    this.otherPlayers[player.id].setPosition(new Vector2D(player.physProps.position.x, player.physProps.position.y));
                    this.otherPlayers[player.id].setIsStunned(player.isStunned);
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

        this.communicationManager.on("resource pickup", function (data) {

            for(var i in data.players)
            {
                var id = data.players[i].id,
                    resType = data.players[i].resType;

                if(this.mainPlayer.getId() == id)
                {
                    this.mainPlayer.setPlayerShapeToResourceShape(resType);
                }
                else
                {
                    if(this.otherPlayers[id])
                    {
                        this.otherPlayers[id].setPlayerShapeToResourceShape(resType);
                    }
                    else
                    {
                        log.error('There was no other player with the id "'+id+'"');
                    }
                }

            }
        }.bind(this));
    }
    
    public update(delta)
    {
        this.communicationManager.sendEvent('player input', {
            "input" : {
                "mousePosition": {
                    "x": Camera.getCameraPosition().x + this.mainPlayerInput.getMouseX() - Config.STAGE_WIDTH/2,
                    "y": Camera.getCameraPosition().y + this.mainPlayerInput.getMouseY() - Config.STAGE_HEIGHT/2
                },
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