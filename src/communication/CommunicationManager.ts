/// <reference path="../../libssrc/socket.io-client.d.ts"/>
import {Logger} from "../utils/Logger";
import {Config} from "../config";

var log = Logger("CommunicationManager");

class CommunicationManager {

    protected socket : SocketIOClient.Socket;
    protected eventListener : {};

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

        this.eventListener = {};

        this.listen();
    }

    public on(event : string, callback : (any) => void)
    {
        if(! this.eventListener[event]) this.eventListener[event] = [];
        this.eventListener[event].push(callback);
    }

    protected executeEvent(event, data)
    {
        var callbacks = this.eventListener[event],i;
        if(callbacks)
        {
            for(i = 0; i < callbacks.length; i++)
            {
                callbacks[i](data);
            }
        }
    }

    listen() {

        this.socket.on("player data", function (data) {
            this.executeEvent("player data", data);
        }.bind(this));

        this.socket.on("other player data", function (data) {
            this.executeEvent("other player data", data);
        }.bind(this));

        this.socket.on("map data", function (data) {
            this.executeEvent("map data", data);
        }.bind(this));

        this.socket.on("match data", function (data) {
            this.executeEvent("match data", data);
        }.bind(this));

        this.socket.on("game won", function (data) {
            this.executeEvent("game won", data);
        }.bind(this));

        this.socket.on("game won", function (data) {
            this.executeEvent("game won", data);
        }.bind(this));

        this.socket.on("resource pickup", function (data) {
            this.executeEvent("resource pickup", data);
        }.bind(this));

        this.socket.on("resources changed", function (data) {
            this.executeEvent("resources changed", data);
        }.bind(this));

        this.socket.on("team stash changed", function(data){
            this.executeEvent("team stash changed", data);
        }.bind(this));
    }

    public sendEvent(event : string, data : any)
    {
        this.socket.emit(event, data);
    }

}

export default CommunicationManager;