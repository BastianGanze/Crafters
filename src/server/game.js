'use strict';

const ConnManager = require("./conn_manager");
const MapManager = require("./map_manager");

class Game {

    constructor(io) {   

        this.connectionManager = new ConnManager(io, this);
        this.connectionManager.listen();

        this.mapManager = new MapManager(64, 64, 16);

        this.update = this.update.bind(this);

        this.prevTime = Date.now();
        this.update();
    }

    update() {
        const beforeTime = Date.now();
        const deltaTime = beforeTime - this.prevTime;
        
        //console.log(`delta: ${deltaTime}`);

        const currClients = this.connectionManager.clients;
        const currEvents = this.connectionManager.events;
        for (let i = 0; i < currClients.length; i++) {
            let currClient = currClients[i];
            currClient.emit("keep alive", "ping");

            let currEvent = currEvents.get(currClient).pop();
        }

        const afterTime = Date.now();
        let frameTime = afterTime - beforeTime;
        this.prevTime = beforeTime;
        if (frameTime > 16) {
            this.update();
        } else {
            setTimeout(this.update, 16 - frameTime);
        }
    }

}

module.exports = Game;