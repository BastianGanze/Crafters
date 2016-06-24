'use strict';

const ConnManager = require("./conn_manager");

class Game {

    constructor(io) {

        this.connectionManager = new ConnManager(io);
        this.connectionManager.listen();

        this.update = this.update.bind(this);

        this.prevTime = Date.now();
        this.update();
    }

    update() {
        const beforeTime = Date.now();
        const deltaTime = beforeTime - this.prevTime;

        console.log(`delta: ${deltaTime}`);
        const currClients = this.connectionManager.clients;
        for (let i = 0; i < currClients.length; i++) {
            currClients[i].emit("keep alive", "ping");
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