'use strict';

class ConnManager {

    constructor(io, playerManger) {
        this.io = io;

        this.playerManager = playerManger;

        this.clients = [];
        this.events = new Map();
    }
    
    listen() {

        this.io.on("connection", (socket) => {

            socket.on("join", (data) => {
                console.info(`Player ${data.name} connected!`);

                let joinId = this.playerManager.createPlayer(data.name, socket, { x: 0, y: 0}, 32).id;
                this.playerManager.players.get(joinId).events.push({
                    join: true
                });

                // this.clients.push(socket);
                // this.events.set(socket, [{
                //     join: data.name
                // }]);
            });

            socket.on("leave", () => {
                for (let i = 0; i < this.clients.length; i++) {
                    if (socket === this.clients[i]) {
                        this.clients.splice(i, 1);
                        this.events.delete(socket);
                        return;
                    }
                }
            });

            socket.on("mouse event", (data) => {
                this.events.get(socket).push({ mouse: data });
            });

            socket.on("keep alive", (data) => {
               //console.log(data);
            });

        });

    }

}

module.exports = ConnManager;