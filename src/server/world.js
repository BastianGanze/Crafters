"use strict";

const Vector2D = require("./utils/vector");

class PlayerCollider {

    constructor(id, playerId, position, radius) {
        this.id = id;
        this.playerId = playerId;
        this.type = "CIRCLE";
        this.position = position;
        this.velocity = new Vector2D();
        this.radius = radius;
    }

    applyVelocity(delta) {
        let tmp = this.position.addVec(this.velocity);
        this.position = tmp.multSkalar(delta / 1000);
    }

    toJSON() {
        return JSON.stringify({"position":this.position, "radius":this.radius, "velocity":this.velocity});
    }
}

class World {
    
    constructor() {
        this.colliderIds = 0;
        this.collisionObjects = new Map();
        this.collisionCallbacks = [];
    }

    getUniqueId() {
        this.colliderIds++;
        return this.colliderIds;
    }
    
    createPlayerCollider(playerId, position, radius) {
        let playerColl = new PlayerCollider(this.getUniqueId(), playerId, position, radius);
        this.addToCollision(playerColl);
        return playerColl;
    }
    
    addToCollision(collisionObject) {
        this.collisionObjects.set(collisionObject.id, collisionObject);
    }
    
    removeFromCollision(collisionObject) {
        this.collisionObjects.delete(collisionObject.id);
    }
    
    updatePhysicStep(delta) {

        for (let colliderId of this.collisionObjects.keys()) {
            let collider = this.collisionObjects.get(colliderId);
            collider.velocity = new Vector2D(1, 0);

            collider.applyVelocity(delta);
        }

    }
    
    collisionHappened(collider_1, collider_2, relativeVelocity) {
        for(var i=0; i < this.collisionCallbacks; i++)
        {
            this.collisionCallbacks[i](collider_1, collider_2, relativeVelocity);
        }
    }
    
    update(delta) {
        this.updatePhysicStep(delta);
    }
    
    addCollisionCallback(callback) {
        this.collisionCallbacks.push(callback);
    }
}

module.exports = PlayerCollider;
module.exports = World;