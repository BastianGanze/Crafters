"use strict";

const Vector2D = require("./utils/vector");

class PlayerCollider {

    constructor(id, playerId, position, radius) {
        this.id = id;
        this.playerId = playerId;
        this.type = "CIRCLE";
        this.position = position;
        this.velocity = new Vector2D(0, 0);
        this.radius = radius;
        this.speed = 300;
        this.collided = false;

        this.oldPos = new Vector2D(0, 0);
    }

    applyVelocity(delta) {
        let tmpFriction = this.velocity.multSkalar(this.speed);
        let tmpVel = tmpFriction.multSkalar(delta / 1000);
        this.position = this.position.addVec(tmpVel);
    }

    getJsonObject() {
        return {"position":this.position, "radius":this.radius, "velocity":this.velocity};
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

            for (let otherColliderId of this.collisionObjects.keys()) {
                if (otherColliderId === colliderId) { continue; }

                let otherCollider = this.collisionObjects.get(otherColliderId);

                let divX = collider.position.x - otherCollider.position.x;
                let divY = collider.position.y - otherCollider.position.y;
                let r = collider.radius + otherCollider.radius;

                if ((divX * divX) + (divY * divY) < (r * r)) {
                    this.collisionHappened(collider, otherCollider, collider.velocity);
                } else {
                    collider.oldPos = collider.position;
                    otherCollider.oldPos = otherCollider.position;
                }
            }

            if (!collider.collided) {
                collider.applyVelocity(delta);
            } else {
                collider.position = collider.oldPos;
                collider.collided = false;
            }

        }

    }
    
    collisionHappened(collider_1, collider_2, relativeVelocity) {
        for(let i = 0; i < this.collisionCallbacks.length; i++)
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