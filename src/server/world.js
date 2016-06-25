"use strict";

class PlayerCollider {

    constructor(id, position, radius)
    {
        this.id = id;
        this.type = "CIRCLE";
        this.position = position;
        this.velocity = {x:0,y:0};
        this.radius = radius;
    }

    toJSON()
    {
        return JSON.stringify({"position":this.position, "radius":this.radius, "velocity":this.velocity});
    }
}

class World {
    
    constructor()
    {
        this.colliderIds = 0;
        this.collisionObjects = {};
        this.collisionCallbacks = [];
    }

    getUniqueId()
    {
        this.colliderIds++;
        return this.colliderIds;
    }
    
    createPlayerCollider(position, radius)
    {
        return new PlayerCollider(this.getUniqueId(), position, radius);
    }
    
    addToCollision(collisionObject)
    {
        this.collisionObjects[collisionObject.id] = collisionObject;
    }
    
    removeFromCollision(collisionObject)
    {
        delete this.collisionObjects[collisionObject.id];
    }
    
    updatePhysicStep(delta)
    {
        //TODO: Update physic for each object and do collision
    }
    
    collisionHappened(collider_1, collider_2, relativeVelocity)
    {
        for(var i=0; i < this.collisionCallbacks; i++)
        {
            this.collisionCallbacks[i](collider_1, collider_2, relativeVelocity);         
        }
    }
    
    update(delta)
    {
        this.updatePhysicStep(delta);    
    }
    
    addCollisionCallback(callback)
    {
        this.collisionCallbacks.push(callback);
    }
}