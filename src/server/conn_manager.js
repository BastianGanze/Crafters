'use strict';

const Vector2D = require("./utils/vector");

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

                socket.playerId = this.playerManager.createPlayer(data.name, socket, new Vector2D(0, 0), 32).id;
                this.playerManager.players.get(socket.playerId).events.push({
                    join: true
                });
            });

            socket.on("player input", (data) => {
                this.playerManager.players.get(socket.playerId).events.push(data);
            });

            socket.on("leave", () => {
                this.playerManager.removePlayer(this.playerManager.players.get(socket.playerId));
            });
            
        });

    }

}

module.exports = ConnManager;