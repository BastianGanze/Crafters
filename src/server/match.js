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

    static resourceTypes() {
        return {
            Triangle : "Triangle",
            Square   : "Square",
            Pentagon : "Pentagon"
        };
    }

    static getResourceType(i) {
        switch (i) {
            case 0:
                return Resource.resourceTypes().Triangle;
                break;
            case 1:
                return Resource.resourceTypes().Square;
                break;
            case 2:
                return Resource.resourceTypes.Pentagon;
                break;

            default:
                return Resource.resourceTypes().Triangle;
        }
    }
}

class Team{

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
        this.teamSpawnPoints = [new Vector2D(100,100), new Vector2D(400,400)]; //TODO: Spawnpoints more intelligent
        this.resourceSpawnPoints = [new Vector2D(250, 250), new Vector2D(250, 100), new Vector2D(250, 400)];
        this.resources = [];

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
        }

        for (let i = 0; i < this.resourceSpawnPoints.length; i++) {
                this.resources.push(new Resource(this.resourceSpawnPoints[i].addScalar(Math.floor(Math.random() * 20)),
                    Resource.getResourceType(i), 10));
        }

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

    update(delta)
    {

    }
}

module.exports = Match;