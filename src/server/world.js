"use strict";

const Vector2D = require("./utils/vector");
const Matter = require('../../libs/matter');
const Config = require('./config');

class World {
    
    constructor() {
        this.colliderIds = 0;
        this.collisionPlayerMap = new Map();
        this.collisionCallbacks = [];
        this.world = Matter.World.create({gravity:{scale: 0}});
        this.engine = Matter.Engine.create({world: this.world});
        Matter.Events.on(this.engine, 'collisionStart', this.handleCollisionPairs.bind(this))
        this.setupWorldBoundaries();
    }

    setupWorldBoundaries()
    {
        let mapSizeX = Config.MAP_SIZE_X*Config.TILE_SIZE_X,
            mapSizeY = Config.MAP_SIZE_Y*Config.TILE_SIZE_Y,
            boundaryX = Config.BOUNDARY_SIZE.x,
            boundaryY = Config.BOUNDARY_SIZE.y,
            marginX = Config.MAP_MARGIN_X * Config.TILE_SIZE_X,
            marginY = Config.MAP_MARGIN_Y * Config.TILE_SIZE_Y;

        Matter.World.addBody(this.world, Matter.Bodies.rectangle(marginX, mapSizeY/2, boundaryX, mapSizeY, {isStatic: true}));
        Matter.World.addBody(this.world, Matter.Bodies.rectangle(mapSizeX/2, marginX, mapSizeX, boundaryY, {isStatic: true}));
        Matter.World.addBody(this.world, Matter.Bodies.rectangle(mapSizeX-marginX, mapSizeY/2, boundaryX, mapSizeX, {isStatic: true}));
        Matter.World.addBody(this.world, Matter.Bodies.rectangle(mapSizeX/2,mapSizeY-marginY, mapSizeX, boundaryY, {isStatic: true}));
    }

    getUniqueId() {
        this.colliderIds++;
        return this.colliderIds;
    }
    
    createPlayerCollider(playerId, position, radius) {

        let playerColl = new Matter.Bodies.circle(position.x, position.y, radius, {density: 0.01, frictionAir: 0.5, restitution: 1, collisionFilter: {group: 2}});

        this.addToCollision(playerColl);
        
        this.collisionPlayerMap[playerColl.id] = playerId;
        
        return playerColl;
    }
    
    getPlayerIdForCollisionObject(collisionId)
    {
        return this.collisionPlayerMap[collisionId];
    }
    
    addToCollision(collisionObject) {
        Matter.World.addBody(this.world, collisionObject);
    }
    
    removeFromCollision(collisionObject) {
        Matter.Composite.remove(this.world, collisionObject);
    }

    handleCollisionPairs(e)
    {
        for(let i = 0; i < this.collisionCallbacks.length; i++)
        {
            for(let c = 0; c < e.pairs.length; c++)
            {
                this.collisionCallbacks[i](e.pairs[c]);
            }
        }
    }
    
    updatePhysicStep(delta) {

        Matter.Engine.update(this.engine, delta);




        // for (let colliderId of this.collisionObjects.keys()) {
        //     let collider = this.collisionObjects.get(colliderId);
        //
        //     for (let otherColliderId of this.collisionObjects.keys()) {
        //         if (otherColliderId === colliderId) { continue; }
        //
        //         let otherCollider = this.collisionObjects.get(otherColliderId);
        //
        //         let divX = collider.position.x - otherCollider.position.x;
        //         let divY = collider.position.y - otherCollider.position.y;
        //         let r = collider.radius + otherCollider.radius;
        //
        //         if ((divX * divX) + (divY * divY) < (r * r)) {
        //             this.collisionHappened(collider, otherCollider);
        //         } else {
        //             collider.oldPos = collider.position;
        //             otherCollider.oldPos = otherCollider.position;
        //         }
        //     }
        //
        //
        //     if (collider.stunned) {
        //         collider.stunnedTimer--;
        //
        //         if (collider.stunnedTimer < 0) {
        //             collider.stunned = false;
        //             collider.stunnedTimer = 10;
        //         }
        //
        //     } else if (!collider.collided) {
        //         collider.applyVelocity(delta);
        //     } else {
        //         collider.position = collider.oldPos;
        //         collider.collided = false;
        //     }
        //
        // }

    }

    update(delta) {
        this.updatePhysicStep(delta);
    }
    
    addCollisionCallback(callback) {
        this.collisionCallbacks.push(callback);
    }
}

module.exports = World;