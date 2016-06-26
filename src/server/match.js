'use strict';

const ConnManager = require("./conn_manager");
const MapManager = require("./map_manager");
const World = require("./world");
const PlayerManager = require("./player_manager");
const Vector2D = require("./utils/vector");
const Resource = require("./resource");

class CraftingZone {
    constructor(id, position, width, height)
    {
        this.id = id;
        this.position = position;
        this.size = new Vector2D(width, height);
    }
}

class Team {

    constructor(teamPosition) {
        this.position = teamPosition;
        this.resourceStash = {};
        this.craftingZone = new CraftingZone(teamPosition, 64, 64);
    }

    getAsJson() {
        return { "position" : this.position, "resourceStash" : this.resourceStash };
    }

}

class Match {

    constructor(io) {
        this.io = io;

        this.isRunning = false;
        this.winnerTeam = null;
        this.teamCount = 2;
        this.neededResources = {};
        this.teams = [];
        this.teamSpawnPoints = [new Vector2D(4, 32), new Vector2D(60, 32)]; //TODO: Spawnpoints more intelligent
        this.resourceSpawnPoints = [new Vector2D(0, 0), new Vector2D(32, 32), new Vector2D(32, 54)];
        this.resources = [];
        this.resourceCount = 0;

        this.craftingZoneCount = 0;
        this.craftingZones = [];

        this.setupMatch();
    }

    setupMatch()
    {
        for(let i = 0; i < this.teamCount; i++)
        {
            this.teams.push(new Team(this.teamSpawnPoints[i]));
        }
        this.neededResources = { "Triangle" : 3, "Square" : 2, "Pentagon" : 1 };
        for(let i=0; i < this.teams.length; i++)
        {
            this.teams[i].resourceStash = {};
            for(let resource in this.neededResources)
            {
                this.teams[i].resourceStash[resource] = 0;
            }

            // initialize crafting Zones
            this.craftingZoneCount++;
            this.craftingZones.push(new CraftingZone(this.craftingZoneCount, this.teamSpawnPoints[i], ))
        }

        for (let i = 0; i < this.resourceSpawnPoints.length; i++) {
                this.resources.push(new Resource(this.getResourceId(), 
                    this.resourceSpawnPoints[i].addScalar(Math.floor(Math.random() * 5)), Resource.getResourceType(i), 10));
        }

    }

    getResourceId() {
        this.resourceCount++;
        return this.resourceCount;
    }

    getCraftingZoneOfTeam(teamNumber)
    {
        var team = this.teams[teamNumber];
        if(team) return team.craftingZone; else {
            console.log("Error! There was no team with the team-number\""+teamNumber+"\"");
            return null;
        }
    }

    getAsJson() {
        let allTeams = [];
        for(let i = 0; i < this.teams.length; i++) {
            allTeams.push(this.teams[i]);
        }

        return { "resources" : this.resources, "teamSpawns" : this.teamSpawnPoints, "teamData" : allTeams };
    }

    changeResource(resource, team, amount) {

        resource.amount -= amount;
        team.resourceStash[resource.type] += amount;

        let teamData = [];
        for (let i = 0; i < this.teams.length; i++) {
            teamData.push(this.teams[i].getAsJson());
        }

        this.io.emit("resources changed", {
            resources : this.resources,
            teamRedources : teamData
        });

    }

    checkMouseHit(mousePos, player) {

        const playerPos = new Vector2D(player.collisionObject.position.x, player.collisionObject.position.y).divSkalar(32);

        for (let i = 0; i < this.resources.length; i++) {
            let res = this.resources[i];

            if (playerPos.subVec(res.position).abs() < res.farmRange && mousePos.subVec(res.position).abs() < res.area) {

                player.inventory.push(res.type);
                this.changeResource(res, player.team, 1);

            }
        }

        for (let i = 0; i < this.)

    }

    update(delta) {
        
    }
}

module.exports = Match;