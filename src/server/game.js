'use strict';

const ConnManager = require("./conn_manager");
const MapManager = require("./map_manager");
const World = require("./world");
const PlayerManager = require("./player_manager");
const Vector2D = require("./utils/vector");
const Match = require("./match");
const Matter = require('../../libs/matter');

class Game {

    constructor(io) {

        this.io = io;

        this.world = new World();
        this.world.addCollisionCallback(this.handleCollision.bind(this));
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
                            if(!player.isStunned) {
                                const mousePos = new Vector2D(currEvent["input"].mousePosition.x, currEvent["input"].mousePosition.y);
                                if (Math.abs(player.force.abs()) < 10)
                                    player.force = player.force.addVec(mousePos.subVec(player.collisionObject.position).norm());
                                else
                                    player.force = mousePos.subVec(player.collisionObject.position).norm().multSkalar(10);
                            }
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
    
    handleCollision(collisionObect)
    {
        let bodyA = collisionObect.bodyA,
            bodyB = collisionObect.bodyB;

         if(bodyA.collisionFilter.group == 2 && bodyB.collisionFilter.group == 2)
         {
            this.handlePlayerCollision(bodyA, bodyB, collisionObect);    
         }
    }
    
    handlePlayerCollision(bodyA, bodyB, collisionObject)
    {
        let relativeVelocityA, relativeVelocityB, playerAId, playerBId, playerA, playerB;
        
            playerAId = this.world.getPlayerIdForCollisionObject(bodyA.id), 
            playerBId = this.world.getPlayerIdForCollisionObject(bodyB.id);
        
        playerA = this.playerManager.getPlayer(playerAId);
        playerB = this.playerManager.getPlayer(playerBId);
        
        relativeVelocityA = Matter.Vector.sub(bodyA.velocity, bodyB.velocity);
        relativeVelocityB = Matter.Vector.sub(bodyA.velocity, bodyB.velocity);

        console.log("A"+Matter.Vector.magnitude(relativeVelocityA));
        console.log("B"+Matter.Vector.magnitude(relativeVelocityB));

        if(Matter.Vector.magnitude(relativeVelocityA) > 5)
        {
            playerB.isStunned = true;
        }

        if(Matter.Vector.magnitude(relativeVelocityB) > 5)
        {
            playerA.isStunned = true;
        }
    }

}

module.exports = Game;