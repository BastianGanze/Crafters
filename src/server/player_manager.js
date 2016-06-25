"use strict";

class Player{

    constructor(id, name, team, collisionObject)
    {
        this.id = id;
        this.name = name;
        this.team = team;
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
            return JSON.stringify({"id":player.id, "name":player.name, "team":player.team, "physProps":player.collisionObject.toJSON()});
        }
        else
        {
            console.log("Could not get collision information from player, collisionObject was of Type \""+typeof player.collisionObject+"\"");
            return null;
        }
    }

    getOtherPlayers(player)
    {
        var players = [];
        for(var id in this.players)
        {
            if(id !== player.id)
            {
                players.push(this.players[id]);
            }
        }

        return players;
    }

    getUniqueId()
    {
        this.playerCount++;
        return this.playerCount;
    }

    createPlayer(name, team, position, radius)
    {
        var uId = this.getUniqueId(),
            playerCollider = this.world.createPlayerCollider(position, radius),
            player = new Player(uId, name, team, playerCollider);

        this.players.set(uId, player);

        return player;
    }

}