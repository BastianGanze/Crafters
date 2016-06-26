'use strict';

const Vector2D = require("./utils/vector");
const Config = require('./config');

class ConnManager {

    constructor(io, playerManger, match) {
        this.io = io;

        this.playerManager = playerManger;
        this.match = match;

        this.clients = [];
        this.events = new Map();
    }
    
    listen() {

        this.io.on("connection", (socket) => {

            socket.on("join", (data) => {
                console.info(`Player ${data.name} connected!`);

                socket.playerId = this.playerManager.createPlayer(data.name, socket, 16, this.match).id;
                this.playerManager.players.get(socket.playerId).events.push({
                    join: true
                });
            });

            socket.on("player input", (data) => {
                let player = this.playerManager.players.get(socket.playerId);

                if(player) player.events.push(data);
            });

            socket.on("leave", () => {
                var player = this.playerManager.players.get(socket.playerId);
                if(player) this.playerManager.removePlayer(player);
            });

            socket.on("disconnect", () =>{
                var player = this.playerManager.players.get(socket.playerId);
                if(player) this.playerManager.removePlayer(player);
            });
            
        });



    }

}

module.exports = ConnManager;