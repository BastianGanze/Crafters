/// <reference path="../../libssrc/socket.io-client.d.ts"/>
import {Logger} from "../utils/Logger";
import {Config} from "../config";
import Player from "../player/Player";
import CommunicationManager from "../communication/CommunicationManager";

var log = Logger("CommunicationManager");

class PlayerManager {

    protected mainPlayer : Player;
    protected otherPlayers : {};
    protected communicationManager;
    
    constructor(communicationManager : CommunicationManager) {
        this.otherPlayers = {};
        this.communicationManager = communicationManager;
        this.communicationManager.on('player data', function(data)
        {

        });
        this.communicationManager.on('other player data', function(data)
        {

        });
    }

}

export default PlayerManager;