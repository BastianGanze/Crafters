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

        // TODO: this needs to be wired to a button or something
        var randNames = ["Peter", "Günter", "Inge", "Petra", "Annelise", "Gerd"];
        this.socket.emit("join", {
            name: randNames[Math.floor(Math.random() * randNames.length)]
        });

        this.listen();
    }

    listen() {

        this.socket.on("player data", function (data) {
            
        });

        this.socket.on("map data", function (data) {
            log.info(data.map);
        })

    }

}

export default CommunicationManager;