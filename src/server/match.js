'use strict';

const ConnManager = require("./conn_manager");
const MapManager = require("./map_manager");
const World = require("./world");
const PlayerManager = require("./player_manager");
const Vector2D = require("./utils/vector");
const Resource = require("./resource");
const Config = require("./config");

class CraftingZone {
    constructor(id, position, diameter)
    {
        this.id = id;
        this.diameter = diameter;
        this.position = position;
        this.dropZone = Config.CRAFTING_ZONE_DROP_DIAMETER;
        this.progress = 0;
        this.spendResources = Config.CRAFTING_RESOURCES;
    }
}

class Team {

    constructor(teamPosition, id) {
        this.id = id;
        this.position = teamPosition;
        this.resourceStash = {};
        this.craftingZone = null;
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
        this.neededResources = Config.CRAFTING_MAX_RESOURCES;
        this.teams = [];
        this.teamSpawnPoints = [new Vector2D(Config.MAP_MARGIN_X+5, Config.MAP_MARGIN_Y+5), new Vector2D(Config.MAP_SIZE_X-Config.MAP_MARGIN_X-5, Config.MAP_SIZE_Y-Config.MAP_MARGIN_Y-5)]; //TODO: Spawnpoints more intelligent
        this.resourceSpawnPoints = [new Vector2D(Config.TILE_SIZE_X*9, Config.TILE_SIZE_Y*9), new Vector2D(Config.TILE_SIZE_X*32, Config.TILE_SIZE_Y*32), new Vector2D(Config.TILE_SIZE_X*32, Config.TILE_SIZE_X*54)];
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
            this.teams.push(new Team(this.teamSpawnPoints[i], i));
        }

        for(let i=0; i < this.teams.length; i++)
        {
            this.teams[i].resourceStash = {};
            for(let resource in this.neededResources)
            {
                this.teams[i].resourceStash[resource] = 0;
            }

            // initialize crafting Zones
            this.craftingZoneCount++;
            let currCZ = new CraftingZone(this.craftingZoneCount, this.teamSpawnPoints[i], Config.CRAFTING_ZONE_WIDTH, Config.CRAFTING_ZONE_DIAMETER);
            this.craftingZones.push(currCZ);

            this.teams[i].craftingZone = currCZ;
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
    
    dropResource(player) {
        player.team.resourceStash[player.inventory] += 1;

        let teamData = [];
        for (let i = 0; i < this.teams.length; i++) {
            teamData.push(this.teams[i].getAsJson());
        }

        this.io.emit("resources changed", {
            resources : this.resources,
            teamRedources : teamData
        });

        player.inventory = [];
    }
    
    craft(team) {

        console.log("craft");

        let spendSum = 0;
        let neededSum = 0;

        for (let res of Object.keys(team.resourceStash)) {

            while (team.resourceStash[res] > 0) {
                team.resourceStash[res]--;
                team.craftingZone.spendResources[res]++;

                spendSum += team.craftingZone.spendResources[res];
                neededSum += this.neededResources[res];
            }

        }

        team.craftingZone.progress = spendSum / neededSum;
        if (team.craftingZone.progress >= 1) {
            console.log(`Team ${team.id} has won the GAME!`);
        }

    }

    checkMouseHit(mousePos, player) {

        const playerPos = new Vector2D(player.collisionObject.position.x, player.collisionObject.position.y).divSkalar(32);

        for (let i = 0; i < this.resources.length; i++) {
            let res = this.resources[i];

            if (playerPos.subVec(res.position).abs() < res.farmRange && mousePos.subVec(res.position).abs() < res.area) {

                console.log("get resource");
                player.inventory.push(res.type);
                res.amount -= 1;

            }
        }

        for (let i = 0; i < this.craftingZones.length; i++) {
            let crafting = this.craftingZones[i];

            if (playerPos.subVec(crafting.position).abs() < crafting.diameter && mousePos.subVec(crafting.position).abs() < crafting.diameter) {

                this.craft(player.team);
            }
        }

    }

    update(delta) {
        
    }
}

module.exports = Match;