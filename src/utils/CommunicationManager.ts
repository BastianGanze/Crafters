/// <reference path="../../libssrc/socket.io-client.d.ts"/>
import {Logger} from "../utils/Logger";
import {Config} from "../config";

var log = Logger("CommunicationManager");

class CommunicationManager {

    protected socket : SocketIOClient.Socket;

    constructor() {
        this.socket = io.connect(Config.WS_DOMAIN);
        this.socket.on('connect', function (data) {
            log.info("Connected to Socket");
        });
    }

}

export default CommunicationManager;