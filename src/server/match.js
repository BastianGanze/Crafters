'use strict';

const ConnManager = require("./conn_manager");
const MapManager = require("./map_manager");
const World = require("./world");
const PlayerManager = require("./player_manager");
const Vector2D = require("./utils/vector");

class CraftingZone
{
    constructor(position, width, height)
    {
        this.position = position;
        this.size = new Vector2D(width, height);
    }
}

class Resource{

    /**
     *
     * @param position
     * @param type Type of resource as string
     * @param amount Amount until depleted
     */
    constructor(position, type, amount)
    {
        this.position = position;
        this.type = type;
        this.amount = amount;
    }
}

class Team{

    constructor(teamPosition) {
        this.position = teamPosition;
        this.resourceStash = {};
        this.craftingZone = new CraftingZone(teamPosition, 64, 64);
    }

}

class Match {

    constructor() {
        this.isRunning = false;
        this.winnerTeam = null;
        this.teamCount = 2;
        this.neededResources = {};
        this.teams = [];
        this.teamSpawnPoints = [new Vector2D(100,100), new Vector2D(400,400)]; //TODO: Spawnpoints more intelligent
    }
    
    setupMatch()
    {
        for(let i = 0; i < this.teamCount; i++)
        {
            this.teams.push(new Team(this.teamSpawnPoints[i]));
        }
        this.neededResources = {"a":3,"b":2,"c":1};
        for(let i=0; i < this.teams.length; i++)
        {
            this.teams[i].resourceStash = {};
            for(let resource in this.neededResources)
            {
                this.teams[i].resourceStash[resource] = 0;
            }
        }
    }

    getCraftingZoneOfTeam(teamNumber)
    {
        var team = this.teams[teamNumber]
        if(team) return team.craftingZone; else {
            console.log("Error! There was no team with the team-number\""+teamNumber+"\"");
            return null;
        }
    }
    
    update(delta)
    {

    }
}

module.exports = Match;