"use strict";

const Vector2D = require("./utils/vector");
const Matter = require('../../libs/matter');

class World {
    
    constructor() {
        this.colliderIds = 0;
        this.collisionObjects = new Map();
        this.collisionCallbacks = [];
        this.world = Matter.World.create({gravity:{scale: 0}});
        this.engine = Matter.Engine.create({world: this.world});
    }

    getUniqueId() {
        this.colliderIds++;
        return this.colliderIds;
    }
    
    createPlayerCollider(playerId, position, radius) {

        let playerColl = new Matter.Bodies.circle(position.x, position.y, radius, {density: 0.01, frictionAir: 0.5, restitution: 1});

        this.addToCollision(playerColl);
        return playerColl;
    }
    
    addToCollision(collisionObject) {
        Matter.World.addBody(this.world, collisionObject);
    }
    
    removeFromCollision(collisionObject) {
        this.collisionObjects.delete(collisionObject.id);
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

module.exports = PlayerCollider;
module.exports = World;