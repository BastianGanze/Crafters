'use strict';

const ConnManager = require("./conn_manager");
const MapManager = require("./map_manager");
const World = require("./world");
const PlayerManager = require("./player_manager");
const Vector2D = require("./utils/vector");
const Match = require("./match");
const Matter = require('../../libs/matter');
const Config = require('./config');

class Game {

    constructor(io) {

        this.io = io;

        this.match = new Match(this.io);

        this.world = new World();
        this.world.addCollisionCallback(this.handleCollision.bind(this));
        this.playerManager = new PlayerManager(this.world);

        this.connectionManager = new ConnManager(io, this.playerManager, this.match);
        this.connectionManager.listen();

        this.mapManager = new MapManager(Config.TILE_SIZE_X, Config.TILE_SIZE_Y, Config.MAP_SIZE_X);

        this.match = new Match(this.io);
        
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
                        if (currEvent["input"].isLeftButtonPressed && !player.isStunned) {
                            const mousePos = new Vector2D(currEvent["input"].mousePosition.x, currEvent["input"].mousePosition.y);
                            if (Math.abs(player.force.abs()) < 10)
                                player.force = player.force.addVec(mousePos.subVec(player.collisionObject.position).norm());
                            else
                                player.force = mousePos.subVec(player.collisionObject.position).norm().multSkalar(10);
                        } else {
                            player.force = player.force.addVec(player.force.multSkalar(-0.1));
                        }

                        if(currEvent["input"].isRightButtonPressed) {
                            if (!player.isStunned && !(player.inventory.length > 0)) {
                                const mousePos = new Vector2D(currEvent["input"].mousePosition.x, currEvent["input"].mousePosition.y);
                                this.match.checkMouseHit(mousePos, player);
                            }
                        }

                        if(Math.abs(player.force.x) < 0.001) player.force.x = 0;
                        if(Math.abs(player.force.y) < 0.001) player.force.y = 0;
                        
                    }
                }
            }

            // drop resource when close to base
            if (player.inventory.length > 0) {
                let crafting = player.team.craftingZone;
                let playerPos = new Vector2D(player.collisionObject.position.x, player.collisionObject.position.y);

                if (playerPos.subVec(crafting.position).abs() < crafting.dropZone) {
                    this.match.dropResource(player);
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
        let relativeVelocity, relativeVelocityB, playerAId, playerBId, playerA, playerB, forceToA, forceToB;
        
        playerAId = this.world.getPlayerIdForCollisionObject(bodyA.id);
        playerBId = this.world.getPlayerIdForCollisionObject(bodyB.id);
        
        playerA = this.playerManager.getPlayer(playerAId);
        playerB = this.playerManager.getPlayer(playerBId);
        
        relativeVelocity = Matter.Vector.add(bodyA.velocity, bodyB.velocity);

        forceToA = Matter.Vector.sub(bodyA.velocity, relativeVelocity);
        forceToB = Matter.Vector.sub(bodyB.velocity, relativeVelocity);

        if(Matter.Vector.magnitude(forceToA) > 5)
        {
            playerA.isStunned = true;
            
            this.match.createResource(playerA.inventory.pop(), new Vector2D(playerA.collisionObject.position.x, playerA.collisionObject.position.y));
            
            console.log("Player A stunned!");
        }

        if(Matter.Vector.magnitude(forceToB) > 5)
        {
            playerB.isStunned = true;

            this.match.createResource(playerB.inventory.pop(), new Vector2D(playerB.collisionObject.position.x, playerB.collisionObject.position.y));

            console.log("Player B stunned!");
        }

    }

}

module.exports = Game;