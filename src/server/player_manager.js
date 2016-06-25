"use strict";

class Player {

    constructor(id, socket, name, team, collisionObject)
    {
        this.id = id;
        this.name = name;
        this.team = team;
        this.collisionObject = collisionObject;
        this.socket = socket;
        this.events = [];
    }
}

class PlayerManager {

    constructor(world)
    {
        this.players = new Map();
        this.world = world;
        this.playerCount = 0;

        this.redTeamCount = 0;
        this.blueTeamCount = 0;
    }

    static getPlayerAsJson(player)
    {
        if(player.collisionObject && typeof player.collisionObject.getJsonObject == "function") {
            return {"id":player.id, "name":player.name, "team":player.team, "physProps":player.collisionObject.getJsonObject()};
        }
        else {
            console.log("Could not get collision information from player, collisionObject was of Type \""+typeof player.collisionObject+"\"");
            return null;
        }
    }

    getOtherPlayers(player)
    {
        let players = [];
        for(let id of this.players.keys())
        {
            if(id !== player.id)
            {
                players.push(this.players.get(id));
            }
        }

        return players;
    }

    getUniqueId()
    {
        this.playerCount++;
        return this.playerCount;
    }

    createPlayer(name, socket, position, radius)
    {
        let team = "";
        if (this.redTeamCount > this.blueTeamCount) {
            this.blueTeamCount++;
            team = "blue";
        } else {
            this.redTeamCount++;
            team = "red";
        }

        var uId = this.getUniqueId();
        let playerCollider = this.world.createPlayerCollider(uId, position, radius);
        let player = new Player(uId, socket, name, team, playerCollider);

        this.players.set(uId, player);

        return player;
    }

    removePlayer(player)
    {
        return this.players.delete[player.id];
    }

}

module.exports = Player;
module.exports = PlayerManager;