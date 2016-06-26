'use strict';

const ConnManager = require("./conn_manager");
const MapManager = require("./map_manager");
const World = require("./world");
const PlayerManager = require("./player_manager");
const Vector2D = require("./utils/vector");
const Match = require("./match");

class Game {

    constructor(io) {

        this.io = io;

        this.world = new World();
        this.world.addCollisionCallback((c1, c2) => {
            let diffVec = c1.force.subVec(c2.force);

            c1.velocity = c1.velocity.multSkalar(-1);
            c1.force = c1.force.multSkalar(-1);

            c2.velocity = c2.velocity.multSkalar(-1);
            c2.force = c2.force.multSkalar(-1);

            // c1.force = c1.force.addVec(c2.velocity.multSkalar().multSkalar(0.1));
            // c2.force = c2.force.addVec(diffVec.multSkalar(-0.1));

            c1.collided = true;
            c2.collided = true;
        });
        this.playerManager = new PlayerManager(this.world);

        this.connectionManager = new ConnManager(io, this.playerManager);
        this.connectionManager.listen();

        this.mapManager = new MapManager(64, 64, 16);

        this.match = new Math(this.io);

        this.update = this.update.bind(this);

        this.prevTime = Date.now();
        this.update();
        
    }

    update() {
        const beforeTime = Date.now();
        const deltaTime = beforeTime - this.prevTime;

        for (let playerId of this.playerManager.players.keys()) {
            const player = this.playerManager.players.get(playerId);

            if (player.events.length > 0) {
                const currEvent = player.events.pop();
                for (let event of Object.keys(currEvent)) {
                    if (event === "join") {
                        player.socket.emit("map data", {
                            map: this.mapManager.map
                        });

                        this.io.emit("match data", {
                           match: this.match.getAsJson()
                        });
                    }

                    if (event === "input") {
                        if (currEvent["input"].isLeftButtonPressed) {
                            const mousePos = new Vector2D(currEvent["input"].mousePosition.x, currEvent["input"].mousePosition.y);
                            if(Math.abs(player.force.abs()) < 10)
                                player.force = player.force.addVec(mousePos.subVec(player.collisionObject.position).norm());
                            else
                                player.force = mousePos.subVec(player.collisionObject.position).norm().multSkalar(10);
                        } else {
                            player.force = player.force.addVec(player.force.multSkalar(-0.1));
                        }

                        if(Math.abs(player.force.x) < 0.001) player.force.x = 0;
                        if(Math.abs(player.force.y) < 0.001) player.force.y = 0;
                        
                    }
                }
            }

            player.update(deltaTime);

            player.socket.emit("player data", PlayerManager.getPlayerAsJson(player));

            let otherPlayers = [];
            for (let otherPlayer of this.playerManager.getOtherPlayers(player)) {
                otherPlayers.push(PlayerManager.getPlayerAsJson(otherPlayer));
            }
            player.socket.emit("other player data", { otherPlayers : otherPlayers });

        }

        this.world.update(deltaTime);

        this.match.update(deltaTime);

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