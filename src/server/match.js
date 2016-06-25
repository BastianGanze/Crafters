'use strict';

const ConnManager = require("./conn_manager");
const MapManager = require("./map_manager");
const World = require("./world");
const PlayerManager = require("./player_manager");
const Vector2D = require("./utils/vector");

class Game {

    constructor(io) {
        this.team1Resources = {};
        this.team2Resources = {};
        this.neededResources = {};

        this.resourcesPos = [];
    }
    
    setupMatch()
    {
        this.neededResources = { "a" : 3,"b" : 2,"c" : 1 };
        this.team1Resources = {};
        this.team2Resources = {};
        for(var resource in this.neededResources)
        {
            this.team1Resources[resource] = 0;
            this.team2Resources[resource] = 0;
        }

        this.resourcesPos.push({ a : []});
        for (let a = 0; a < this.neededResources["a"]; a++) {
            this.resourcesPos.a.push(  )
        }
    }

}

module.exports = Game;