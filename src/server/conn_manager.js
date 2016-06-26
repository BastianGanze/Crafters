'use strict';

const Vector2D = require("./utils/vector");
const Config = require('./config');

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

                socket.playerId = this.playerManager.createPlayer(data.name, socket, new Vector2D(Config.MAP_MARGIN+Config.TILE_SIZE_X, Config.MAP_MARGIN+Config.TILE_SIZE_Y), 16).id;
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