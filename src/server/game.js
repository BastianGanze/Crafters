'use strict';

const ConnManager = require("./conn_manager");
const MapManager = require("./map_manager");
const World = require("./world");
const PlayerManager = require("./player_manager");

class Game {

    constructor(io) {

        this.world = new World();
        this.playerManager = new PlayerManager(this.world);

        this.connectionManager = new ConnManager(io, this.playerManager);
        this.connectionManager.listen();

        this.mapManager = new MapManager(64, 64, 16);

        this.update = this.update.bind(this);

        this.prevTime = Date.now();
        this.update();
        
    }

    update() {
        const beforeTime = Date.now();
        const deltaTime = beforeTime - this.prevTime;

        this.world.update(deltaTime);

        for (let playerId of this.playerManager.players.keys()) {
            const player = this.playerManager.players.get(playerId);

            if (player.events.length > 0) {
                const currEvent = player.events.pop();
                for (let event of Object.keys(currEvent)) {
                    switch (event) {
                        case 'join':
                            player.socket.emit("map data", {
                                map: this.mapManager.map
                            });
                            break;
                    }
                }
            }

            player.socket.emit("player data", PlayerManager.getPlayerAsJson(player));

            let otherPlayers = [];
            for (let otherPlayer of this.playerManager.getOtherPlayers(player)) {
                otherPlayers.push(PlayerManager.getPlayerAsJson(otherPlayer));
            }
            player.socket.emit("other player data", { otherPlayers : otherPlayers });

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