"use strict";

class Player{

    constructor(id, name, collisionObject)
    {
        this.id = id;
        this.name = name;
        this.collisionObject = collisionObject;
    }
}

class PlayerManager{

    constructor(world)
    {
        this.players = new Map();
        this.world = world;
        this.playerCount = 0;
    }

    getPlayerAsJson(player)
    {
        if(player.collisionObject && typeof player.collisionObject.toJSON == "function")
        {
            return JSON.stringify({"id":player.id, "name":player.name, "physProps":player.collisionObject.toJSON()});
        }
        else
        {
            console.log("Could not get collision information from player, collisionObject was of Type \""+typeof player.collisionObject+"\"");
            return null;
        }
    }

    getUniqueId()
    {
        this.playerCount++;
        return this.playerCount;
    }

    createPlayer(name)
    {
        var uId = this.getUniqueId();
        this.players.set(uId, new Player(uId, name));
    }

}