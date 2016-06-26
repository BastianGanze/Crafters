(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/// <reference path="../../libssrc/socket.io-client.d.ts"/>
var Logger_1 = require("../utils/Logger");
var config_1 = require("../config");
var log = Logger_1.Logger("CommunicationManager");
var CommunicationManager = (function () {
    function CommunicationManager() {
        this.socket = io.connect(config_1.Config.WS_DOMAIN);
        this.socket.on('connect', function (data) {
            log.info("Connected to Socket");
        });
        // TODO: this needs to be wired to a button or something
        var randNames = ["Peter", "Günter", "Inge", "Petra", "Annelise", "Gerd"];
        this.socket.emit("join", {
            name: randNames[Math.floor(Math.random() * randNames.length)]
        });
        this.eventListener = {};
        this.listen();
    }
    CommunicationManager.prototype.on = function (event, callback) {
        if (!this.eventListener[event])
            this.eventListener[event] = [];
        this.eventListener[event].push(callback);
    };
    CommunicationManager.prototype.executeEvent = function (event, data) {
        var callbacks = this.eventListener[event], i;
        if (callbacks) {
            for (i = 0; i < callbacks.length; i++) {
                callbacks[i](data);
            }
        }
    };
    CommunicationManager.prototype.listen = function () {
        this.socket.on("player data", function (data) {
            this.executeEvent("player data", data);
        }.bind(this));
        this.socket.on("other player data", function (data) {
            this.executeEvent("other player data", data);
        }.bind(this));
        this.socket.on("map data", function (data) {
            this.executeEvent("map data", data);
        }.bind(this));
        this.socket.on("match data", function (data) {
            this.executeEvent("match data", data);
        }.bind(this));
        this.socket.on("game won", function (data) {
            this.executeEvent("game won", data);
        }.bind(this));
        this.socket.on("game won", function (data) {
            this.executeEvent("game won", data);
        }.bind(this));
        this.socket.on("resource pickup", function (data) {
            this.executeEvent("resource pickup", data);
        }.bind(this));
        this.socket.on("resources changed", function (data) {
            this.executeEvent("resources changed", data);
        }.bind(this));
    };
    CommunicationManager.prototype.sendEvent = function (event, data) {
        this.socket.emit(event, data);
    };
    return CommunicationManager;
}());
exports.__esModule = true;
exports["default"] = CommunicationManager;

},{"../config":2,"../utils/Logger":18}],2:[function(require,module,exports){
"use strict";
(function (LogLevel) {
    LogLevel[LogLevel["ALL"] = -2147483648] = "ALL";
    LogLevel[LogLevel["TRACE"] = 1000] = "TRACE";
    LogLevel[LogLevel["DEBUG"] = 2000] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 3000] = "INFO";
    LogLevel[LogLevel["WARN"] = 4000] = "WARN";
    LogLevel[LogLevel["ERROR"] = 5000] = "ERROR";
    LogLevel[LogLevel["FATAL"] = 6000] = "FATAL";
    LogLevel[LogLevel["OFF"] = 2147483647] = "OFF";
})(exports.LogLevel || (exports.LogLevel = {}));
var LogLevel = exports.LogLevel;
var Config = (function () {
    function Config() {
    }
    Config.APPLICATION_NAME = "";
    Config.DEBUG = true;
    Config.LOG_LEVEL = LogLevel.DEBUG;
    Config.LOG_TO_SERVER = false;
    Config.LOG_TO_CONSOLE = true;
    Config.STAGE_WIDTH = 1280;
    Config.STAGE_HEIGHT = 720;
    Config.BG_COLOR = 0x6495ED;
    Config.MAP_SIZE_X = 64;
    Config.MAP_SIZE_Y = 64;
    Config.TILE_SIZE_X = 32;
    Config.TILE_SIZE_Y = 32;
    // public static WS_DOMAIN: string = 'http://localhost:3000';
    Config.COLOR_FRIEND = 0x00008b; //0x0000ff;
    Config.COLOR_FOE = 0x8b0000; //0xff0000;
    Config.COLOR_ME = 0x008b00; //0x00ff00;
    Config.WS_DOMAIN = 'http://gamejam.grimmbart.org:61692';
    return Config;
}());
exports.Config = Config;

},{}],3:[function(require,module,exports){
"use strict";
var Renderer_1 = require("./utils/Renderer");
var CommunicationManager_1 = require("./communication/CommunicationManager");
var Logger_1 = require("./utils/Logger");
var Input_1 = require("./utils/Input");
var Camera_1 = require("./utils/Camera");
var Map_1 = require("./map/Map");
var PlayerManager_1 = require("./player/PlayerManager");
var Vector2D_1 = require("./utils/Vector2D");
var MatchManager_1 = require("./match/MatchManager");
var ResourceManager_1 = require("./resources/ResourceManager");
var log = Logger_1.Logger("Game");
var Game = (function () {
    function Game() {
        this.gameRenderer = new Renderer_1["default"]();
        this.inputManager = new Input_1.Input.PlayerInput();
        this.map = new Map_1["default"](this.gameRenderer, null);
        this.communicationManager = new CommunicationManager_1["default"]();
        this.matchManager = new MatchManager_1["default"](this.communicationManager, this.gameRenderer);
        this.playerManager = new PlayerManager_1["default"](this.communicationManager, this.gameRenderer, this.matchManager);
        this.recourceManager = new ResourceManager_1["default"](this.communicationManager, this.gameRenderer);
        this.communicationManager.on('player data', function (data) {
            Camera_1["default"].setCameraPosition(new Vector2D_1["default"](data.physProps.position.x, data.physProps.position.y));
        }.bind(this));
        this.communicationManager.on('map data', function (data) {
            this.map.updateMap(data.map);
        }.bind(this));
    }
    Game.prototype.update = function (delta) {
        this.playerManager.update(delta);
        this.recourceManager.update(delta);
        this.matchManager.update(delta);
        this.map.update();
    };
    Game.prototype.render = function () {
        this.gameRenderer.render();
    };
    return Game;
}());
exports.__esModule = true;
exports["default"] = Game;

},{"./communication/CommunicationManager":1,"./map/Map":4,"./match/MatchManager":7,"./player/PlayerManager":11,"./resources/ResourceManager":13,"./utils/Camera":16,"./utils/Input":17,"./utils/Logger":18,"./utils/Renderer":19,"./utils/Vector2D":21}],4:[function(require,module,exports){
"use strict";
var AssetLoader_1 = require("../utils/AssetLoader");
var Tyle_1 = require("./Tyle");
var config_1 = require("../config");
var Vector2D_1 = require("../utils/Vector2D");
var Map = (function () {
    function Map(renderer, map) {
        var element = AssetLoader_1["default"].getContent("tileset");
        //load base Sprites
        this.baseTexture = new PIXI.BaseTexture(element);
        this.gameRenderer = renderer;
        //create tylemap
        this.tyleMap = [];
        for (var i = 0; i < config_1.Config.MAP_SIZE_X; i++) {
            this.tyleMap[i] = [];
            for (var j = 0; j < config_1.Config.MAP_SIZE_Y; j++) {
                this.tyleMap[i][j] = new Tyle_1["default"](this.baseTexture, new Vector2D_1["default"](i * config_1.Config.TILE_SIZE_X, j * config_1.Config.TILE_SIZE_X));
                this.tyleMap[i][j].setId(0);
                renderer.addToMainContainer(this.tyleMap[i][j].getSprite());
            }
        }
    }
    Map.prototype.update = function () {
        for (var i = 0; i < config_1.Config.MAP_SIZE_X; i++) {
            for (var j = 0; j < config_1.Config.MAP_SIZE_Y; j++) {
                this.tyleMap[i][j].update();
            }
        }
    };
    Map.prototype.updateMap = function (map) {
        for (var i = 0; i < config_1.Config.MAP_SIZE_X; i++) {
            for (var j = 0; j < config_1.Config.MAP_SIZE_Y; j++) {
                this.tyleMap[i][j].setId(map[i][j]);
            }
        }
    };
    return Map;
}());
exports.__esModule = true;
exports["default"] = Map;

},{"../config":2,"../utils/AssetLoader":15,"../utils/Vector2D":21,"./Tyle":5}],5:[function(require,module,exports){
"use strict";
var Utils_1 = require("../utils/Utils");
var config_1 = require("../config");
var MapHandler = (function () {
    function MapHandler(baseTexture, position) {
        this.pos = position;
        this.tyleSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, config_1.Config.TILE_SIZE_X, config_1.Config.TILE_SIZE_Y)));
        Utils_1["default"].setSpriteViewportPos(this.tyleSprite, this.pos);
    }
    MapHandler.prototype.update = function () {
        Utils_1["default"].setSpriteViewportPos(this.tyleSprite, this.pos);
    };
    MapHandler.prototype.setId = function (id) {
        var randY = Math.round(Math.random() * 4);
        this.tyleSprite.texture.frame = new PIXI.Rectangle(id * config_1.Config.TILE_SIZE_X, randY * config_1.Config.TILE_SIZE_Y, config_1.Config.TILE_SIZE_X, config_1.Config.TILE_SIZE_Y);
    };
    MapHandler.prototype.getSprite = function () {
        return this.tyleSprite;
    };
    return MapHandler;
}());
exports.__esModule = true;
exports["default"] = MapHandler;

},{"../config":2,"../utils/Utils":20}],6:[function(require,module,exports){
"use strict";
var Utils_1 = require("../utils/Utils");
var CraftingArea = (function () {
    function CraftingArea(baseTexture, renderer, position, color) {
        this.pos = position;
        this.gameRenderer = renderer;
        this.sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture));
        this.gameRenderer.addToMainContainer(this.sprite);
        this.sprite.tint = color;
        this.sprite.anchor = new PIXI.Point(0.5, 0.5);
        Utils_1["default"].setSpriteViewportPos(this.sprite, this.pos);
    }
    CraftingArea.prototype.setColor = function (color) {
        this.sprite.tint = color;
    };
    CraftingArea.prototype.update = function (delta) {
        this.sprite.rotation += 20 * delta / 1000;
        if (this.sprite.rotation > 360)
            this.sprite.rotation = this.sprite.rotation - 360;
        Utils_1["default"].setSpriteViewportPos(this.sprite, this.pos);
    };
    return CraftingArea;
}());
exports.__esModule = true;
exports["default"] = CraftingArea;

},{"../utils/Utils":20}],7:[function(require,module,exports){
"use strict";
var Vector2D_1 = require("../utils/Vector2D");
var CraftingArea_1 = require("./CraftingArea");
var AssetLoader_1 = require("../utils/AssetLoader");
var config_1 = require("../config");
var TeamScore = (function () {
    function TeamScore(gameRenderer, neededResources, position) {
        this.gameRenderer = gameRenderer;
        this.position = position;
        var keys = Object.keys(neededResources);
        this.resourceCountTexts = {};
        this.neededResources = neededResources;
        for (var i = 0; i < keys.length; i++) {
            this.resourceCountTexts[keys[i]] = new PIXI.Text(keys[i] + ": " + 0 + " / " + neededResources[keys[i]]);
            this.resourceCountTexts[keys[i]].position = new PIXI.Point(this.position.x + i * 200, this.position.y);
            this.gameRenderer.addToMainContainer(this.resourceCountTexts[keys[i]]);
        }
    }
    TeamScore.prototype.updateResource = function (resource, count) {
        var resourceText = this.resourceCountTexts[resource];
        if (resourceText)
            resourceText.text = resource + ": " + count + " / " + this.neededResources[resource];
    };
    return TeamScore;
}());
var MatchManager = (function () {
    function MatchManager(communicationManager, gameRenderer) {
        this.communicationManager = communicationManager;
        this.gameRenderer = gameRenderer;
        this.craftingAreas = {};
        this.mainPlayerTeam = null;
        this.craftingAreaTexture = new PIXI.BaseTexture(AssetLoader_1["default"].getContent("CraftingArea"));
        this.teamScoreDisplay = {};
        var teamPosScore = [new Vector2D_1["default"](0, 20), new Vector2D_1["default"](config_1.Config.STAGE_WIDTH - 630, config_1.Config.STAGE_HEIGHT - 50)];
        this.communicationManager.on('match data', function (data) {
            var i, teamData;
            if (data && data.match && data.match.teamData) {
                for (i = 0; i < data.match.teamData.length; i++) {
                    teamData = data.match.teamData[i];
                    if (!this.craftingAreas[i]) {
                        this.craftingAreas[i] = new CraftingArea_1["default"](this.craftingAreaTexture, this.gameRenderer, new Vector2D_1["default"](teamData.craftingZone.position.x, teamData.craftingZone.position.y), config_1.Config.COLOR_NEUTRAL);
                    }
                    this.teamScoreDisplay[i] = new TeamScore(this.gameRenderer, data.match.neededResources, teamPosScore[i]);
                }
            }
            if (this.mainPlayerTeam) {
                this.colorTeams();
            }
        }.bind(this));
        this.communicationManager.on('game won', function (data) {
        }.bind(this));
        this.communicationManager.on('resources changed', function (data) {
            for (var i = 0; i < data.teamResources.length; i++) {
                for (var resource in data.teamResources[i].resourceStash) {
                    this.teamScoreDisplay[i].updateResource(resource, data.teamResources[i].resourceStash[resource]);
                }
            }
        }.bind(this));
    }
    MatchManager.prototype.setMainPlayerTeam = function (team) {
        this.mainPlayerTeam = team;
        this.colorTeams();
    };
    MatchManager.prototype.colorTeams = function () {
        var keys = Object.keys(this.craftingAreas), i;
        for (i = 0; i < keys.length; i++) {
            if (i == this.mainPlayerTeam) {
                this.craftingAreas[keys[i]].setColor(config_1.Config.COLOR_FRIEND);
            }
            else {
                this.craftingAreas[keys[i]].setColor(config_1.Config.COLOR_FOE);
            }
        }
    };
    MatchManager.prototype.update = function (delta) {
        var keys = Object.keys(this.craftingAreas), i;
        for (i = 0; i < keys.length; i++) {
            this.craftingAreas[keys[i]].update(delta);
        }
    };
    return MatchManager;
}());
exports.__esModule = true;
exports["default"] = MatchManager;

},{"../config":2,"../utils/AssetLoader":15,"../utils/Vector2D":21,"./CraftingArea":6}],8:[function(require,module,exports){
"use strict";
var Vector2D_1 = require("../utils/Vector2D");
var Utils_1 = require("../utils/Utils");
var Particle = (function () {
    function Particle(renderer, pos, color, baseTexture, maxTime, emittingRadius) {
        this.emittingRadius = emittingRadius;
        this.maxLiveTime = maxTime;
        this.baseTexture = baseTexture;
        this.particleSprite = new PIXI.Sprite(new PIXI.Texture(this.baseTexture));
        this.offset = new Vector2D_1["default"](this.particleSprite.width / 2, this.particleSprite.height / 2);
        this.renderer = renderer;
        if (typeof color == "number") {
            this.color = color;
            this.particleSprite.tint = this.color; //'#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
        }
        if (typeof color == "boolean") {
            this.color = color;
            if (this.color) {
                //this.particleSprite.tint = Math.random() * 0xffffff;
                var r = Math.random() * 0xff0000;
                var g = Math.random() * 0x00ff00;
                var b = Math.random() * 0x0000ff;
                this.particleSprite.tint = r + g + b;
            }
        }
        var r = Math.random() * 10;
        this.pos = new Vector2D_1["default"](pos.x - this.offset.x, pos.y - this.offset.y);
        this.liveTime = 0;
        Utils_1["default"].setSpriteViewportPos(this.particleSprite, this.pos);
        renderer.addToMainContainer(this.particleSprite);
        this.move = new Vector2D_1["default"](0, 0);
        this.move.x = this.emittingRadius * Math.cos(Math.PI * 2 * r);
        this.move.y = this.emittingRadius * Math.sin(Math.PI * 2 * r);
        this.toDelete = false;
        r = Math.random() * 10;
        this.maxLiveTime *= r;
        this.maxLiveTime /= 50;
    }
    Particle.prototype.setSprite = function (baseTex) {
        this.particleSprite.texture = new PIXI.Texture(baseTex);
    };
    Particle.prototype.update = function (delta) {
        this.liveTime += 16;
        if (this.liveTime > this.maxLiveTime) {
            this.toDelete = true;
        }
        if (!this || !this.pos || !this.pos.add)
            debugger;
        this.pos = new Vector2D_1["default"](this.pos.x + this.move.x, this.pos.y + this.move.y);
        Utils_1["default"].setSpriteViewportPos(this.particleSprite, this.pos);
        this.particleSprite.alpha *= (15 / 16);
    };
    Particle.prototype.checkAlive = function () {
        return !this.toDelete;
    };
    Particle.prototype.destroy = function () {
        this.renderer.removeFromMainContainer(this.particleSprite);
    };
    return Particle;
}());
exports.__esModule = true;
exports["default"] = Particle;

},{"../utils/Utils":20,"../utils/Vector2D":21}],9:[function(require,module,exports){
"use strict";
var Particle_1 = require("./Particle");
var AssetLoader_1 = require("../utils/AssetLoader");
var ParticleEmitter = (function () {
    function ParticleEmitter(renderer, pos, color, texturePath, maxTime, emitingRadius, particleCount) {
        this.pos = pos;
        this.emittingRadius = emitingRadius;
        var element = AssetLoader_1["default"].getContent(texturePath);
        this.baseTexture = new PIXI.BaseTexture(element);
        this.particles = [];
        this.color = color;
        this.renderer = renderer;
        this.maxTime = maxTime;
        if (particleCount)
            this.particleCount = particleCount;
        else
            this.particleCount = 50;
        for (var i = 0; i < this.particleCount; i++) {
            this.particles[i] = new Particle_1["default"](renderer, pos, this.color, this.baseTexture, this.maxTime, this.emittingRadius);
        }
    }
    ParticleEmitter.prototype.setSprite = function (sprite) {
        var element = AssetLoader_1["default"].getContent(sprite);
        this.baseTexture = new PIXI.BaseTexture(element);
        for (var i = 0; i < this.particleCount; i++) {
            this.particles[i].setSprite(this.baseTexture);
        }
    };
    ParticleEmitter.prototype.setColor = function (color) {
        this.color = color;
    };
    ParticleEmitter.prototype.update = function (pos, delta) {
        for (var i = 0; i < this.particleCount; i++) {
            if (!this.particles[i].checkAlive()) {
                this.particles[i].destroy();
                this.particles[i] = new Particle_1["default"](this.renderer, pos, this.color, this.baseTexture, this.maxTime, this.emittingRadius);
            }
            else
                this.particles[i].update(delta);
        }
    };
    ParticleEmitter.prototype.getPosition = function () {
        return this.pos;
    };
    ParticleEmitter.prototype.destroy = function () {
        for (var i = 0; i < this.particleCount; i++) {
            this.particles[i].destroy();
        }
    };
    return ParticleEmitter;
}());
exports.__esModule = true;
exports["default"] = ParticleEmitter;

},{"../utils/AssetLoader":15,"./Particle":8}],10:[function(require,module,exports){
"use strict";
var ParticleEmitter_1 = require("./ParticleEmitter");
var Vector2D_1 = require("../utils/Vector2D");
var Utils_1 = require("../utils/Utils");
var Player = (function () {
    function Player(renderer, id, team, color) {
        this.item = "none";
        this.team = team;
        this.color = color;
        this.pos = new Vector2D_1["default"](0, 0);
        this.gameRenderer = renderer;
        this.id = id;
        this.particleEmitter = new ParticleEmitter_1["default"](renderer, new Vector2D_1["default"](0, 0), this.color, this.item, 800, 3);
    }
    Player.prototype.setItem = function (item) {
        this.item = item;
        this.particleEmitter.setSprite(this.item);
    };
    Player.prototype.update = function (delta) {
        this.particleEmitter.update(this.pos, delta);
        this.updateColorAccordingToStatus(delta);
    };
    Player.prototype.updateColorAccordingToStatus = function (delta) {
        if (this.isStunned) {
            this.particleEmitter.setColor(Utils_1["default"].colorMakeBrighter(this.color, Math.round(Math.random() * 50) + 50));
        }
        else {
            this.particleEmitter.setColor(this.color);
        }
    };
    Player.prototype.getId = function () {
        return this.id;
    };
    Player.prototype.setPosition = function (pos) {
        this.pos = pos;
    };
    Player.prototype.setIsStunned = function (isStunned) {
        this.isStunned = isStunned;
    };
    Player.prototype.destroy = function () {
        this.particleEmitter.destroy();
    };
    Player.prototype.getTeam = function () {
        return this.team;
    };
    return Player;
}());
exports.__esModule = true;
exports["default"] = Player;

},{"../utils/Utils":20,"../utils/Vector2D":21,"./ParticleEmitter":9}],11:[function(require,module,exports){
"use strict";
/// <reference path="../../libssrc/socket.io-client.d.ts"/>
var Logger_1 = require("../utils/Logger");
var config_1 = require("../config");
var Player_1 = require("../player/Player");
var Camera_1 = require("../utils/Camera");
var Input_1 = require("../utils/Input");
var Vector2D_1 = require("../utils/Vector2D");
var log = Logger_1.Logger("CommunicationManager");
var PlayerManager = (function () {
    function PlayerManager(communicationManager, gameRenderer, matchManager) {
        this.otherPlayers = {};
        this.communicationManager = communicationManager;
        this.gameRenderer = gameRenderer;
        this.matchManager = matchManager;
        this.mainPlayerInput = new Input_1.Input.PlayerInput();
        this.bla = 0;
        this.communicationManager.on('player data', function (data) {
            if (!this.mainPlayer) {
                this.mainPlayer = new Player_1["default"](gameRenderer, data.id, data.team, config_1.Config.COLOR_ME);
                this.matchManager.setMainPlayerTeam(data.team.id);
            }
            this.mainPlayer.setPosition(new Vector2D_1["default"](data.physProps.position.x, data.physProps.position.y));
            this.mainPlayer.setIsStunned(data.isStunned);
        }.bind(this));
        this.communicationManager.on('other player data', function (data) {
            var player, i, id;
            for (id in this.otherPlayers) {
                this.otherPlayers[id].playerUpdated = false;
            }
            for (i = 0; i < data.otherPlayers.length; i++) {
                player = data.otherPlayers[i];
                if (player.id) {
                    if (!this.otherPlayers[player.id]) {
                        if (player.team === this.mainPlayer.getTeam())
                            this.otherPlayers[player.id] = new Player_1["default"](gameRenderer, player.id, player.team, config_1.Config.COLOR_FRIEND);
                        else
                            this.otherPlayers[player.id] = new Player_1["default"](gameRenderer, player.id, player.team, config_1.Config.COLOR_FOE);
                    }
                    this.otherPlayers[player.id].setPosition(new Vector2D_1["default"](player.physProps.position.x, player.physProps.position.y));
                    this.otherPlayers[player.id].playerUpdated = true;
                }
            }
            for (id in this.otherPlayers) {
                if (!this.otherPlayers[id].playerUpdated) {
                    this.otherPlayers[id].destroy();
                    delete this.otherPlayers[id];
                }
            }
        }.bind(this));
        this.communicationManager.on("resource pickup", function (data) {
            if (data.player === this.mainPlayer.getId())
                this.mainPlayer.setItem(data.resource);
            else {
                for (var i in this.otherPlayers) {
                    if (data.player === this.otherPlayers[i].getId())
                        this.otherPlayers[i](data.otherPlayers[i].resources);
                }
            }
        }.bind(this));
    }
    PlayerManager.prototype.update = function (delta) {
        this.communicationManager.sendEvent('player input', {
            "input": {
                "mousePosition": {
                    "x": Camera_1["default"].getCameraPosition().x + this.mainPlayerInput.getMouseX() - config_1.Config.STAGE_WIDTH / 2,
                    "y": Camera_1["default"].getCameraPosition().y + this.mainPlayerInput.getMouseY() - config_1.Config.STAGE_HEIGHT / 2
                },
                "isLeftButtonPressed": this.mainPlayerInput.isMouseButtonPressed(Input_1.Input.MouseButtons.LEFT),
                "isRightButtonPressed": this.mainPlayerInput.isMouseButtonPressed(Input_1.Input.MouseButtons.RIGHT)
            }
        });
        if (this.mainPlayer) {
            this.mainPlayer.update(delta);
        }
        for (var id in this.otherPlayers) {
            this.otherPlayers[id].update(delta);
        }
    };
    return PlayerManager;
}());
exports.__esModule = true;
exports["default"] = PlayerManager;

},{"../config":2,"../player/Player":10,"../utils/Camera":16,"../utils/Input":17,"../utils/Logger":18,"../utils/Vector2D":21}],12:[function(require,module,exports){
"use strict";
var AssetLoader_1 = require("../utils/AssetLoader");
var Vector2D_1 = require("../utils/Vector2D");
var Utils_1 = require("../utils/Utils");
var ParticleEmitter_1 = require("../player/ParticleEmitter");
var Recource = (function () {
    function Recource(renderer, pos, type) {
        var element = AssetLoader_1["default"].getContent(type);
        this.baseTexture = new PIXI.BaseTexture(element);
        this.recourceSprite = new PIXI.Sprite(new PIXI.Texture(this.baseTexture));
        this.offset = new Vector2D_1["default"](this.recourceSprite.width / 2, this.recourceSprite.height / 2);
        this.pos = pos;
        this.recourceSprite.tint = 0x8b1c62;
        Utils_1["default"].setSpriteViewportPos(this.recourceSprite, new Vector2D_1["default"](this.pos.x - this.offset.x, this.pos.y - this.offset.y));
        this.gameRenderer = renderer;
        this.particleEmitter = new ParticleEmitter_1["default"](this.gameRenderer, this.pos, true, type, 800, 5, 20);
        this.gameRenderer.addToMainContainer(this.recourceSprite);
    }
    Recource.prototype.destroy = function () {
        this.particleEmitter.destroy();
    };
    Recource.prototype.update = function (delta) {
        Utils_1["default"].setSpriteViewportPos(this.recourceSprite, new Vector2D_1["default"](this.pos.x - this.offset.x, this.pos.y - this.offset.y));
        this.gameRenderer.removeFromMainContainer(this.recourceSprite);
        this.particleEmitter.update(this.particleEmitter.getPosition(), delta);
        this.gameRenderer.addToMainContainer(this.recourceSprite);
    };
    Recource.prototype.getPosition = function () {
        return this.pos;
    };
    return Recource;
}());
exports.__esModule = true;
exports["default"] = Recource;

},{"../player/ParticleEmitter":9,"../utils/AssetLoader":15,"../utils/Utils":20,"../utils/Vector2D":21}],13:[function(require,module,exports){
"use strict";
var Logger_1 = require("../utils/Logger");
var Resource_1 = require("./Resource");
var log = Logger_1.Logger("CommunicationManager");
var ResourceManager = (function () {
    function ResourceManager(communicationManager, gameRenderer) {
        this.communicationManager = communicationManager;
        this.gameRenderer = gameRenderer;
        this.communicationManager.on('match data', function (data) {
            if (!this.resources) {
                this.resources = [];
                for (var i in data.match.resources) {
                    this.resources[i] = new Resource_1["default"](this.gameRenderer, data.match.resources[i].position, data.match.resources[i].type);
                }
            }
        }.bind(this));
        this.communicationManager.on('resources changed', function (data) {
            for (var i in this.resources) {
                this.resources[i].destroy();
            }
            for (var i in data.resources) {
                this.resources[i] = new Resource_1["default"](this.gameRenderer, data.resources[i].position, data.resources[i].type);
            }
        }.bind(this));
    }
    ResourceManager.prototype.update = function (delta) {
        for (var i in this.resources) {
            this.resources[i].update(delta);
        }
    };
    return ResourceManager;
}());
exports.__esModule = true;
exports["default"] = ResourceManager;

},{"../utils/Logger":18,"./Resource":12}],14:[function(require,module,exports){
"use strict";
/// <reference path="../libssrc/jquery-2.1.4.d.ts" />
var game_1 = require("./game");
var AssetLoader_1 = require("./utils/AssetLoader");
$(document).ready(function (event) {
    AssetLoader_1["default"].onContentLoaded(function () {
        var game = new game_1["default"](), lastTime = 0, delta;
        function mainLoop(time) {
            window.requestAnimationFrame(mainLoop);
            delta = time - lastTime;
            game.update(delta);
            game.render();
            lastTime = time;
        }
        window.requestAnimationFrame(mainLoop);
    });
});

},{"./game":3,"./utils/AssetLoader":15}],15:[function(require,module,exports){
"use strict";
/// <reference path="../../libssrc/createjs-lib.d.ts" />
/// <reference path="../../libssrc/preloadjs.d.ts" />
/// <reference path="../../libssrc/soundjs.d.ts" />
var Logger_1 = require("../utils/Logger");
var assets = [
    { src: "assets/img/test.png", id: "TestImage" },
    { src: "assets/img/particle.png", id: "none" },
    { src: "assets/img/triangle.png", id: "Triangle" },
    { src: "assets/img/pentagon.png", id: "Pentagon" },
    { src: "assets/img/square.png", id: "Square" },
    { src: "assets/audio/test.wav", id: "TestSound" },
    { src: "assets/img/testPlayer.png", id: "TestPlayer" },
    { src: "assets/img/tileset.png", id: "tileset" },
    { src: "assets/img/craftingarea.png", id: "CraftingArea" },
], log = Logger_1.Logger("AssetLoader");
var AssetLoader = (function () {
    function AssetLoader(manifest) {
        log.trace("Initializing");
        this.assetManifest = manifest;
        this.assetQueue = new createjs.LoadQueue(true);
        this.loadedCallbacks = [];
        this.loadContent();
    }
    AssetLoader.prototype.loadContent = function () {
        log.trace("Loading content.");
        createjs.Sound.alternateExtensions = ["mp3"];
        this.assetQueue.installPlugin(function () { return createjs.Sound; });
        this.assetQueue.on("complete", this.loadComplete.bind(this));
        this.assetQueue.on("error", this.loadError);
        this.assetQueue.loadManifest(assets);
    };
    AssetLoader.prototype.loadError = function (event) {
        log.error("There was an error while loading assets:");
        log.error(event);
    };
    AssetLoader.prototype.loadComplete = function (event) {
        log.trace("Completed Loading assets.");
        this.executeCallbacks();
    };
    AssetLoader.prototype.getContent = function (id) {
        log.trace("Getting content with id\"" + id + "\"");
        return this.assetQueue.getResult(id);
    };
    AssetLoader.prototype.executeCallbacks = function () {
        log.trace("Executing onLoad callbacks.");
        for (var i = 0; i < this.loadedCallbacks.length; i++) {
            this.loadedCallbacks[i]();
        }
    };
    AssetLoader.prototype.onContentLoaded = function (callback) {
        log.trace("Registering onLoad callback.");
        if (this.assetQueue.loaded)
            callback();
        else
            this.loadedCallbacks.push(callback);
    };
    return AssetLoader;
}());
exports.__esModule = true;
exports["default"] = new AssetLoader(assets);

},{"../utils/Logger":18}],16:[function(require,module,exports){
"use strict";
var config_1 = require("../config");
var Vector2D_1 = require("./Vector2D");
var Camera = (function () {
    function Camera() {
        this.position = new Vector2D_1["default"](0, 0);
    }
    Camera.prototype.setCameraPosition = function (pos) {
        this.position = pos;
    };
    Camera.prototype.getCameraPosition = function () {
        return this.position;
    };
    Camera.prototype.getViewPortCoordinates = function (mapCoordinates) {
        var newPosition = Vector2D_1["default"].subVec(mapCoordinates, this.position);
        newPosition.add(new Vector2D_1["default"](config_1.Config.STAGE_WIDTH / 2, config_1.Config.STAGE_HEIGHT / 2));
        return newPosition;
    };
    return Camera;
}());
exports.__esModule = true;
exports["default"] = new Camera();

},{"../config":2,"./Vector2D":21}],17:[function(require,module,exports){
"use strict";
var Input;
(function (Input) {
    //Define all buttons/actions which are possible here
    (function (Buttons) {
        Buttons[Buttons["JUMP"] = 0] = "JUMP";
        Buttons[Buttons["LEFT"] = 1] = "LEFT";
        Buttons[Buttons["RIGHT"] = 2] = "RIGHT";
        Buttons[Buttons["UP"] = 3] = "UP";
        Buttons[Buttons["DOWN"] = 4] = "DOWN";
    })(Input.Buttons || (Input.Buttons = {}));
    var Buttons = Input.Buttons;
    (function (MouseButtons) {
        MouseButtons[MouseButtons["LEFT"] = 1] = "LEFT";
        MouseButtons[MouseButtons["RIGHT"] = 3] = "RIGHT";
        MouseButtons[MouseButtons["MIDDLE"] = 2] = "MIDDLE";
    })(Input.MouseButtons || (Input.MouseButtons = {}));
    var MouseButtons = Input.MouseButtons;
    //Define additional input, which is not mapped to the keyboard here
    (function (CustomInput) {
        CustomInput[CustomInput["X_AXIS"] = 0] = "X_AXIS";
        CustomInput[CustomInput["Y_AXIS"] = 1] = "Y_AXIS";
        CustomInput[CustomInput["LEFT_CLICK"] = 2] = "LEFT_CLICK";
        CustomInput[CustomInput["RIGHT_CLICK"] = 3] = "RIGHT_CLICK";
        CustomInput[CustomInput["MIDDLE_CLICK"] = 4] = "MIDDLE_CLICK";
    })(Input.CustomInput || (Input.CustomInput = {}));
    var CustomInput = Input.CustomInput;
    //Actual player input. Use this to create key bindings for multiple players.
    var PlayerInput = (function () {
        function PlayerInput() {
            var $document = $(document);
            $document.keydown(this.onKeyDown.bind(this));
            $document.keyup(this.onKeyUp.bind(this));
            $document.mousedown(this.onMouseDown.bind(this));
            $document.mouseup(this.onMouseUp.bind(this));
            this.keyBindings = {};
            this.keyPressedMap = {};
            this.mouseKeyPressedMap = {};
            this.customBindings = {};
            //mouse movement
            $(document).on('mousemove', function (e) {
                this.mouseX = e.pageX;
                this.mouseY = e.pageY;
            }.bind(this));
            //Setting some standard callback functions for x and y axis
            this.xAxisCallback = function () {
                if (this.isButtonPressed(Buttons.LEFT))
                    return -1;
                if (this.isButtonPressed(Buttons.RIGHT))
                    return 1;
                return 0;
            }.bind(this);
            this.yAxisCallback = function () {
                if (this.isButtonPressed(Buttons.UP))
                    return -1;
                if (this.isButtonPressed(Buttons.DOWN))
                    return 1;
                return 0;
            }.bind(this);
        }
        PlayerInput.prototype.setKeyboardBinding = function (button, key) {
            this.keyBindings[button] = key;
            this.keyPressedMap[key] = 0;
        };
        PlayerInput.prototype.setCustomBinding = function (inputName, currentValueFunction) {
            this.customBindings[inputName] = currentValueFunction;
        };
        PlayerInput.prototype.setXAxisCallback = function (callback) {
            this.xAxisCallback = callback;
        };
        PlayerInput.prototype.setYAxisCallback = function (callback) {
            this.yAxisCallback = callback;
        };
        PlayerInput.prototype.getXAxis = function () {
            return this.xAxisCallback();
        };
        PlayerInput.prototype.getYAxis = function () {
            return this.yAxisCallback();
        };
        PlayerInput.prototype.getMouseX = function () {
            return this.mouseX;
        };
        PlayerInput.prototype.getMouseY = function () {
            return this.mouseY;
        };
        /**
         * Will return true if Button is being pressed at the time of this function call.
         * @param button
         * @returns {boolean}
         */
        PlayerInput.prototype.isButtonPressed = function (button) {
            return this.keyPressedMap[this.keyBindings[button]] === 1;
        };
        PlayerInput.prototype.isMouseButtonPressed = function (button) {
            return this.mouseKeyPressedMap[button] === 1;
        };
        PlayerInput.prototype.getCustomInputValue = function (inputName) {
            return this.customBindings[inputName]();
        };
        PlayerInput.prototype.onKeyDown = function (e) {
            var keyCode = e.which;
            this.keyPressedMap[keyCode] = 1;
        };
        PlayerInput.prototype.onKeyUp = function (e) {
            var keyCode = e.which;
            this.keyPressedMap[keyCode] = 0;
        };
        PlayerInput.prototype.onMouseDown = function (e) {
            var keyCode = e.which;
            this.mouseKeyPressedMap[keyCode] = 1;
        };
        PlayerInput.prototype.onMouseUp = function (e) {
            var keyCode = e.which;
            this.mouseKeyPressedMap[keyCode] = 0;
        };
        return PlayerInput;
    }());
    Input.PlayerInput = PlayerInput;
    (function (KeyCodes) {
        KeyCodes[KeyCodes["BACKSPACE"] = 8] = "BACKSPACE";
        KeyCodes[KeyCodes["TAB"] = 9] = "TAB";
        KeyCodes[KeyCodes["ENTER"] = 13] = "ENTER";
        KeyCodes[KeyCodes["SHIFT"] = 16] = "SHIFT";
        KeyCodes[KeyCodes["CTRL"] = 17] = "CTRL";
        KeyCodes[KeyCodes["ALT"] = 18] = "ALT";
        KeyCodes[KeyCodes["PAUSE"] = 19] = "PAUSE";
        KeyCodes[KeyCodes["CAPS_LOCK"] = 20] = "CAPS_LOCK";
        KeyCodes[KeyCodes["ESCAPE"] = 27] = "ESCAPE";
        KeyCodes[KeyCodes["SPACE"] = 32] = "SPACE";
        KeyCodes[KeyCodes["PAGE_UP"] = 33] = "PAGE_UP";
        KeyCodes[KeyCodes["PAGE_DOWN"] = 34] = "PAGE_DOWN";
        KeyCodes[KeyCodes["END"] = 35] = "END";
        KeyCodes[KeyCodes["HOME"] = 36] = "HOME";
        KeyCodes[KeyCodes["LEFT_ARROW"] = 37] = "LEFT_ARROW";
        KeyCodes[KeyCodes["UP_ARROW"] = 38] = "UP_ARROW";
        KeyCodes[KeyCodes["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
        KeyCodes[KeyCodes["DOWN_ARROW"] = 40] = "DOWN_ARROW";
        KeyCodes[KeyCodes["INSERT"] = 45] = "INSERT";
        KeyCodes[KeyCodes["DELETE"] = 46] = "DELETE";
        KeyCodes[KeyCodes["KEY_0"] = 48] = "KEY_0";
        KeyCodes[KeyCodes["KEY_1"] = 49] = "KEY_1";
        KeyCodes[KeyCodes["KEY_2"] = 50] = "KEY_2";
        KeyCodes[KeyCodes["KEY_3"] = 51] = "KEY_3";
        KeyCodes[KeyCodes["KEY_4"] = 52] = "KEY_4";
        KeyCodes[KeyCodes["KEY_5"] = 53] = "KEY_5";
        KeyCodes[KeyCodes["KEY_6"] = 54] = "KEY_6";
        KeyCodes[KeyCodes["KEY_7"] = 55] = "KEY_7";
        KeyCodes[KeyCodes["KEY_8"] = 56] = "KEY_8";
        KeyCodes[KeyCodes["KEY_9"] = 57] = "KEY_9";
        KeyCodes[KeyCodes["A"] = 65] = "A";
        KeyCodes[KeyCodes["B"] = 66] = "B";
        KeyCodes[KeyCodes["C"] = 67] = "C";
        KeyCodes[KeyCodes["D"] = 68] = "D";
        KeyCodes[KeyCodes["E"] = 69] = "E";
        KeyCodes[KeyCodes["F"] = 70] = "F";
        KeyCodes[KeyCodes["G"] = 71] = "G";
        KeyCodes[KeyCodes["H"] = 72] = "H";
        KeyCodes[KeyCodes["I"] = 73] = "I";
        KeyCodes[KeyCodes["J"] = 74] = "J";
        KeyCodes[KeyCodes["K"] = 75] = "K";
        KeyCodes[KeyCodes["L"] = 76] = "L";
        KeyCodes[KeyCodes["M"] = 77] = "M";
        KeyCodes[KeyCodes["N"] = 78] = "N";
        KeyCodes[KeyCodes["O"] = 79] = "O";
        KeyCodes[KeyCodes["P"] = 80] = "P";
        KeyCodes[KeyCodes["Q"] = 81] = "Q";
        KeyCodes[KeyCodes["R"] = 82] = "R";
        KeyCodes[KeyCodes["S"] = 83] = "S";
        KeyCodes[KeyCodes["T"] = 84] = "T";
        KeyCodes[KeyCodes["U"] = 85] = "U";
        KeyCodes[KeyCodes["V"] = 86] = "V";
        KeyCodes[KeyCodes["W"] = 87] = "W";
        KeyCodes[KeyCodes["X"] = 88] = "X";
        KeyCodes[KeyCodes["Y"] = 89] = "Y";
        KeyCodes[KeyCodes["Z"] = 90] = "Z";
        KeyCodes[KeyCodes["LEFT_META"] = 91] = "LEFT_META";
        KeyCodes[KeyCodes["RIGHT_META"] = 92] = "RIGHT_META";
        KeyCodes[KeyCodes["SELECT"] = 93] = "SELECT";
        KeyCodes[KeyCodes["NUMPAD_0"] = 96] = "NUMPAD_0";
        KeyCodes[KeyCodes["NUMPAD_1"] = 97] = "NUMPAD_1";
        KeyCodes[KeyCodes["NUMPAD_2"] = 98] = "NUMPAD_2";
        KeyCodes[KeyCodes["NUMPAD_3"] = 99] = "NUMPAD_3";
        KeyCodes[KeyCodes["NUMPAD_4"] = 100] = "NUMPAD_4";
        KeyCodes[KeyCodes["NUMPAD_5"] = 101] = "NUMPAD_5";
        KeyCodes[KeyCodes["NUMPAD_6"] = 102] = "NUMPAD_6";
        KeyCodes[KeyCodes["NUMPAD_7"] = 103] = "NUMPAD_7";
        KeyCodes[KeyCodes["NUMPAD_8"] = 104] = "NUMPAD_8";
        KeyCodes[KeyCodes["NUMPAD_9"] = 105] = "NUMPAD_9";
        KeyCodes[KeyCodes["MULTIPLY"] = 106] = "MULTIPLY";
        KeyCodes[KeyCodes["ADD"] = 107] = "ADD";
        KeyCodes[KeyCodes["SUBTRACT"] = 109] = "SUBTRACT";
        KeyCodes[KeyCodes["DECIMAL"] = 110] = "DECIMAL";
        KeyCodes[KeyCodes["DIVIDE"] = 111] = "DIVIDE";
        KeyCodes[KeyCodes["F1"] = 112] = "F1";
        KeyCodes[KeyCodes["F2"] = 113] = "F2";
        KeyCodes[KeyCodes["F3"] = 114] = "F3";
        KeyCodes[KeyCodes["F4"] = 115] = "F4";
        KeyCodes[KeyCodes["F5"] = 116] = "F5";
        KeyCodes[KeyCodes["F6"] = 117] = "F6";
        KeyCodes[KeyCodes["F7"] = 118] = "F7";
        KeyCodes[KeyCodes["F8"] = 119] = "F8";
        KeyCodes[KeyCodes["F9"] = 120] = "F9";
        KeyCodes[KeyCodes["F10"] = 121] = "F10";
        KeyCodes[KeyCodes["F11"] = 122] = "F11";
        KeyCodes[KeyCodes["F12"] = 123] = "F12";
        KeyCodes[KeyCodes["NUM_LOCK"] = 144] = "NUM_LOCK";
        KeyCodes[KeyCodes["SCROLL_LOCK"] = 145] = "SCROLL_LOCK";
        KeyCodes[KeyCodes["SEMICOLON"] = 186] = "SEMICOLON";
        KeyCodes[KeyCodes["EQUALS"] = 187] = "EQUALS";
        KeyCodes[KeyCodes["COMMA"] = 188] = "COMMA";
        KeyCodes[KeyCodes["DASH"] = 189] = "DASH";
        KeyCodes[KeyCodes["PERIOD"] = 190] = "PERIOD";
        KeyCodes[KeyCodes["FORWARD_SLASH"] = 191] = "FORWARD_SLASH";
        KeyCodes[KeyCodes["GRAVE_ACCENT"] = 192] = "GRAVE_ACCENT";
        KeyCodes[KeyCodes["OPEN_BRACKET"] = 219] = "OPEN_BRACKET";
        KeyCodes[KeyCodes["BACK_SLASH"] = 220] = "BACK_SLASH";
        KeyCodes[KeyCodes["CLOSE_BRACKET"] = 221] = "CLOSE_BRACKET";
        KeyCodes[KeyCodes["SINGLE_QUOTE"] = 222] = "SINGLE_QUOTE";
    })(Input.KeyCodes || (Input.KeyCodes = {}));
    var KeyCodes = Input.KeyCodes;
})(Input = exports.Input || (exports.Input = {}));

},{}],18:[function(require,module,exports){
/// <reference path="../../libssrc/jsnlog.d.ts"/>
"use strict";
var config_1 = require("../config");
function Logger(loggerName) {
    var consoleAppender = JL.createConsoleAppender("ConsoleAppender");
    var serverAppender = JL.createAjaxAppender("ConsoleAppender");
    var appenders = [];
    if (config_1.Config.LOG_TO_CONSOLE)
        appenders.push(consoleAppender);
    if (config_1.Config.LOG_TO_SERVER)
        appenders.push(serverAppender);
    var logger = JL(loggerName).setOptions({ "appenders": appenders, level: config_1.Config.LOG_LEVEL });
    return logger;
}
exports.Logger = Logger;
exports.Log = Logger(config_1.Config.APPLICATION_NAME);

},{"../config":2}],19:[function(require,module,exports){
"use strict";
/// <reference path="../../libssrc/pixi.js.d.ts" />
var Logger_1 = require("../utils/Logger");
var config_1 = require("../config");
var log = Logger_1.Logger("GameRenderer");
var GameRenderer = (function () {
    function GameRenderer() {
        log.trace("Initializing Gamer Renderer.");
        this.gameRenderer = PIXI.autoDetectRenderer(config_1.Config.STAGE_WIDTH, config_1.Config.STAGE_HEIGHT);
        this.gameRenderer.backgroundColor = config_1.Config.BG_COLOR;
        document.body.appendChild(this.gameRenderer.view);
        this.mainContainer = new PIXI.Container();
    }
    GameRenderer.prototype.addToMainContainer = function (sprite) {
        log.trace("Adding something to main container.");
        this.mainContainer.addChild(sprite);
    };
    GameRenderer.prototype.removeFromMainContainer = function (sprite) {
        log.trace("Removing something from main container.");
        this.mainContainer.removeChild(sprite);
    };
    GameRenderer.prototype.render = function () {
        this.gameRenderer.render(this.mainContainer);
    };
    return GameRenderer;
}());
exports.__esModule = true;
exports["default"] = GameRenderer;

},{"../config":2,"../utils/Logger":18}],20:[function(require,module,exports){
"use strict";
var Camera_1 = require("./Camera");
var Utils = (function () {
    function Utils() {
    }
    Utils.setSpriteViewportPos = function (sprite, mapPosition) {
        var newPosition = Camera_1["default"].getViewPortCoordinates(mapPosition);
        sprite.position.x = Math.round(newPosition.x);
        sprite.position.y = Math.round(newPosition.y);
    };
    Utils.colorMakeBrighter = function (color, percent) {
        var hex = color.toString(16), missingZeroes = 0, i;
        missingZeroes = 6 - hex.length;
        for (i = 0; i < missingZeroes; i++) {
            hex = "0" + hex;
        }
        var r = parseInt(hex.substr(0, 2), 16), g = parseInt(hex.substr(2, 2), 16), b = parseInt(hex.substr(4, 2), 16);
        return parseInt(((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
            ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
            ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1), 16);
    };
    return Utils;
}());
exports.__esModule = true;
exports["default"] = Utils;

},{"./Camera":16}],21:[function(require,module,exports){
"use strict";
var Logger_1 = require("../utils/Logger");
var log = Logger_1.Logger("Vector2D");
var Vector2D = (function () {
    function Vector2D(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2D.addVec = function (v1, v2) {
        return new Vector2D(v1.x + v2.x, v1.y + v2.y);
    };
    Vector2D.subVec = function (v1, v2) {
        return new Vector2D(v1.x - v2.x, v1.y - v2.y);
    };
    Vector2D.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
    };
    Vector2D.prototype.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
    };
    Vector2D.prototype.len = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    return Vector2D;
}());
exports.__esModule = true;
exports["default"] = Vector2D;

},{"../utils/Logger":18}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tbXVuaWNhdGlvbi9Db21tdW5pY2F0aW9uTWFuYWdlci50cyIsInNyYy9jb25maWcudHMiLCJzcmMvZ2FtZS50cyIsInNyYy9tYXAvTWFwLnRzIiwic3JjL21hcC9UeWxlLnRzIiwic3JjL21hdGNoL0NyYWZ0aW5nQXJlYS50cyIsInNyYy9tYXRjaC9NYXRjaE1hbmFnZXIudHMiLCJzcmMvcGxheWVyL1BhcnRpY2xlLnRzIiwic3JjL3BsYXllci9QYXJ0aWNsZUVtaXR0ZXIudHMiLCJzcmMvcGxheWVyL1BsYXllci50cyIsInNyYy9wbGF5ZXIvUGxheWVyTWFuYWdlci50cyIsInNyYy9yZXNvdXJjZXMvUmVzb3VyY2UudHMiLCJzcmMvcmVzb3VyY2VzL1Jlc291cmNlTWFuYWdlci50cyIsInNyYy9zdGFydC50cyIsInNyYy91dGlscy9Bc3NldExvYWRlci50cyIsInNyYy91dGlscy9DYW1lcmEudHMiLCJzcmMvdXRpbHMvSW5wdXQudHMiLCJzcmMvdXRpbHMvTG9nZ2VyLnRzIiwic3JjL3V0aWxzL1JlbmRlcmVyLnRzIiwic3JjL3V0aWxzL1V0aWxzLnRzIiwic3JjL3V0aWxzL1ZlY3RvcjJELnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLDJEQUEyRDtBQUMzRCx1QkFBcUIsaUJBQWlCLENBQUMsQ0FBQTtBQUN2Qyx1QkFBcUIsV0FBVyxDQUFDLENBQUE7QUFFakMsSUFBSSxHQUFHLEdBQUcsZUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFekM7SUFLSTtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQVUsSUFBSTtZQUNwQyxHQUFHLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFFSCx3REFBd0Q7UUFDeEQsSUFBSSxTQUFTLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNyQixJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNoRSxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUV4QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVNLGlDQUFFLEdBQVQsVUFBVSxLQUFjLEVBQUUsUUFBd0I7UUFFOUMsRUFBRSxDQUFBLENBQUMsQ0FBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDL0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVTLDJDQUFZLEdBQXRCLFVBQXVCLEtBQUssRUFBRSxJQUFJO1FBRTlCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQzVDLEVBQUUsQ0FBQSxDQUFDLFNBQVMsQ0FBQyxDQUNiLENBQUM7WUFDRyxHQUFHLENBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUNwQyxDQUFDO2dCQUNHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QixDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCxxQ0FBTSxHQUFOO1FBRUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFVBQVUsSUFBSTtZQUN4QyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFZCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLElBQUk7WUFDOUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFZCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxJQUFJO1lBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVkLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLElBQUk7WUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsSUFBSTtZQUNyQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFZCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxJQUFJO1lBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUMs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QUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFDbEMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFDbEMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUV2QyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQy9FLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ25FLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVMLFlBQUM7QUFBRCxDQTVCQSxBQTRCQyxJQUFBO0FBRUQ7cUJBQWUsS0FBSyxDQUFDOzs7O0FDakNyQix1QkFBcUIsaUJBQWlCLENBQUMsQ0FBQTtBQUV2QyxJQUFJLEdBQUcsR0FBRyxlQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFN0I7SUFLSSxrQkFBWSxDQUFVLEVBQUUsQ0FBVTtRQUU5QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVhLGVBQU0sR0FBcEIsVUFBcUIsRUFBWSxFQUFFLEVBQWE7UUFFNUMsTUFBTSxDQUFDLElBQUksUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRWEsZUFBTSxHQUFwQixVQUFxQixFQUFZLEVBQUUsRUFBYTtRQUU1QyxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFTSxzQkFBRyxHQUFWLFVBQVcsQ0FBWTtRQUNuQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVNLHNCQUFHLEdBQVYsVUFBVyxDQUFDO1FBQ1IsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFTSxzQkFBRyxHQUFWO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFDTCxlQUFDO0FBQUQsQ0FsQ0EsQUFrQ0MsSUFBQTtBQWxDRDs2QkFrQ0MsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbGlic3NyYy9zb2NrZXQuaW8tY2xpZW50LmQudHNcIi8+XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSBcIi4uL3V0aWxzL0xvZ2dlclwiO1xuaW1wb3J0IHtDb25maWd9IGZyb20gXCIuLi9jb25maWdcIjtcblxudmFyIGxvZyA9IExvZ2dlcihcIkNvbW11bmljYXRpb25NYW5hZ2VyXCIpO1xuXG5jbGFzcyBDb21tdW5pY2F0aW9uTWFuYWdlciB7XG5cbiAgICBwcm90ZWN0ZWQgc29ja2V0IDogU29ja2V0SU9DbGllbnQuU29ja2V0O1xuICAgIHByb3RlY3RlZCBldmVudExpc3RlbmVyIDoge307XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBpby5jb25uZWN0KENvbmZpZy5XU19ET01BSU4pO1xuICAgICAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdCcsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBsb2cuaW5mbyhcIkNvbm5lY3RlZCB0byBTb2NrZXRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRPRE86IHRoaXMgbmVlZHMgdG8gYmUgd2lyZWQgdG8gYSBidXR0b24gb3Igc29tZXRoaW5nXG4gICAgICAgIHZhciByYW5kTmFtZXMgPSBbXCJQZXRlclwiLCBcIkfDvG50ZXJcIiwgXCJJbmdlXCIsIFwiUGV0cmFcIiwgXCJBbm5lbGlzZVwiLCBcIkdlcmRcIl07XG4gICAgICAgIHRoaXMuc29ja2V0LmVtaXQoXCJqb2luXCIsIHtcbiAgICAgICAgICAgIG5hbWU6IHJhbmROYW1lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5kTmFtZXMubGVuZ3RoKV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyID0ge307XG5cbiAgICAgICAgdGhpcy5saXN0ZW4oKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb24oZXZlbnQgOiBzdHJpbmcsIGNhbGxiYWNrIDogKGFueSkgPT4gdm9pZClcbiAgICB7XG4gICAgICAgIGlmKCEgdGhpcy5ldmVudExpc3RlbmVyW2V2ZW50XSkgdGhpcy5ldmVudExpc3RlbmVyW2V2ZW50XSA9IFtdO1xuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJbZXZlbnRdLnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBleGVjdXRlRXZlbnQoZXZlbnQsIGRhdGEpXG4gICAge1xuICAgICAgICB2YXIgY2FsbGJhY2tzID0gdGhpcy5ldmVudExpc3RlbmVyW2V2ZW50XSxpO1xuICAgICAgICBpZihjYWxsYmFja3MpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja3NbaV0oZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsaXN0ZW4oKSB7XG5cbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJwbGF5ZXIgZGF0YVwiLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlRXZlbnQoXCJwbGF5ZXIgZGF0YVwiLCBkYXRhKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLnNvY2tldC5vbihcIm90aGVyIHBsYXllciBkYXRhXCIsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVFdmVudChcIm90aGVyIHBsYXllciBkYXRhXCIsIGRhdGEpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwibWFwIGRhdGFcIiwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUV2ZW50KFwibWFwIGRhdGFcIiwgZGF0YSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJtYXRjaCBkYXRhXCIsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVFdmVudChcIm1hdGNoIGRhdGFcIiwgZGF0YSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJnYW1lIHdvblwiLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlRXZlbnQoXCJnYW1lIHdvblwiLCBkYXRhKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLnNvY2tldC5vbihcImdhbWUgd29uXCIsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVFdmVudChcImdhbWUgd29uXCIsIGRhdGEpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwicmVzb3VyY2UgcGlja3VwXCIsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVFdmVudChcInJlc291cmNlIHBpY2t1cFwiLCBkYXRhKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLnNvY2tldC5vbihcInJlc291cmNlcyBjaGFuZ2VkXCIsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVFdmVudChcInJlc291cmNlcyBjaGFuZ2VkXCIsIGRhdGEpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZW5kRXZlbnQoZXZlbnQgOiBzdHJpbmcsIGRhdGEgOiBhbnkpXG4gICAge1xuICAgICAgICB0aGlzLnNvY2tldC5lbWl0KGV2ZW50LCBkYXRhKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tbXVuaWNhdGlvbk1hbmFnZXI7IiwiZXhwb3J0IGVudW0gTG9nTGV2ZWx7XG4gICAgQUxMID0gLTIxNDc0ODM2NDgsXG4gICAgVFJBQ0UgPSAxMDAwLFxuICAgIERFQlVHID0gMjAwMCxcbiAgICBJTkZPID0gMzAwMCxcbiAgICBXQVJOID0gNDAwMCxcbiAgICBFUlJPUiA9IDUwMDAsXG4gICAgRkFUQUwgPSA2MDAwLFxuICAgIE9GRiA9IDIxNDc0ODM2NDdcbn1cblxuZXhwb3J0IGNsYXNzIENvbmZpZ3tcbiAgICBwdWJsaWMgc3RhdGljIEFQUExJQ0FUSU9OX05BTUU6IHN0cmluZyA9IFwiXCI7XG4gICAgcHVibGljIHN0YXRpYyBERUJVRyA6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHB1YmxpYyBzdGF0aWMgTE9HX0xFVkVMIDogTG9nTGV2ZWwgPSBMb2dMZXZlbC5ERUJVRztcbiAgICBwdWJsaWMgc3RhdGljIExPR19UT19TRVJWRVI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgc3RhdGljIExPR19UT19DT05TT0xFOiBib29sZWFuID0gdHJ1ZTtcbiAgICBwdWJsaWMgc3RhdGljIFNUQUdFX1dJRFRIOiBudW1iZXIgPSAxMjgwO1xuICAgIHB1YmxpYyBzdGF0aWMgU1RBR0VfSEVJR0hUOiBudW1iZXIgPSA3MjA7XG4gICAgcHVibGljIHN0YXRpYyBCR19DT0xPUjogbnVtYmVyID0gMHg2NDk1RUQ7XG4gICAgcHVibGljIHN0YXRpYyBNQVBfU0laRV9YOiBudW1iZXIgPSA2NDtcbiAgICBwdWJsaWMgc3RhdGljIE1BUF9TSVpFX1k6IG51bWJlciA9IDY0O1xuICAgIHB1YmxpYyBzdGF0aWMgVElMRV9TSVpFX1g6IG51bWJlciA9IDMyO1xuICAgIHB1YmxpYyBzdGF0aWMgVElMRV9TSVpFX1k6IG51bWJlciA9IDMyO1xuICAgLy8gcHVibGljIHN0YXRpYyBXU19ET01BSU46IHN0cmluZyA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnO1xuICAgIHB1YmxpYyBzdGF0aWMgQ09MT1JfRlJJRU5EIDogbnVtYmVyID0gMHgwMDAwOGI7Ly8weDAwMDBmZjtcbiAgICBwdWJsaWMgc3RhdGljIENPTE9SX0ZPRSA6IG51bWJlciA9IDB4OGIwMDAwOy8vMHhmZjAwMDA7XG4gICAgcHVibGljIHN0YXRpYyBDT0xPUl9NRSA6IG51bWJlciA9IDB4MDA4YjAwLy8weDAwZmYwMDtcbiAgICBwdWJsaWMgc3RhdGljIFdTX0RPTUFJTjogc3RyaW5nID0gJ2h0dHA6Ly9nYW1lamFtLmdyaW1tYmFydC5vcmc6NjE2OTInO1xuXG5cbn0iLCJpbXBvcnQgR2FtZVJlbmRlcmVyIGZyb20gXCIuL3V0aWxzL1JlbmRlcmVyXCI7XG5pbXBvcnQgQXNzZXRMb2FkZXIgZnJvbSBcIi4vdXRpbHMvQXNzZXRMb2FkZXJcIjtcbmltcG9ydCBDb21tdW5pY2F0aW9uTWFuYWdlciBmcm9tIFwiLi9jb21tdW5pY2F0aW9uL0NvbW11bmljYXRpb25NYW5hZ2VyXCI7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSBcIi4vdXRpbHMvTG9nZ2VyXCI7XG5pbXBvcnQge0lucHV0fSBmcm9tIFwiLi91dGlscy9JbnB1dFwiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXIvUGxheWVyXCI7XG5pbXBvcnQgQ2FtZXJhIGZyb20gXCIuL3V0aWxzL0NhbWVyYVwiO1xuaW1wb3J0IE1hcCBmcm9tIFwiLi9tYXAvTWFwXCI7XG5pbXBvcnQgUGxheWVyTWFuYWdlciBmcm9tIFwiLi9wbGF5ZXIvUGxheWVyTWFuYWdlclwiO1xuaW1wb3J0IFZlY3RvcjJEIGZyb20gXCIuL3V0aWxzL1ZlY3RvcjJEXCI7XG5pbXBvcnQgTWF0Y2hNYW5hZ2VyIGZyb20gXCIuL21hdGNoL01hdGNoTWFuYWdlclwiO1xuaW1wb3J0IFJlY291cmNlTWFuYWdlciBmcm9tIFwiLi9yZXNvdXJjZXMvUmVzb3VyY2VNYW5hZ2VyXCJcblxudmFyIGxvZyA9IExvZ2dlcihcIkdhbWVcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVcbntcbiAgICBwcml2YXRlIGdhbWVSZW5kZXJlciA6IEdhbWVSZW5kZXJlcjtcbiAgICBwcml2YXRlIGlucHV0TWFuYWdlciA6IElucHV0LlBsYXllcklucHV0O1xuICAgIHByaXZhdGUgcGxheWVyIDogUGxheWVyO1xuICAgIHByaXZhdGUgbWFwIDogTWFwO1xuICAgIHByaXZhdGUgY29tbXVuaWNhdGlvbk1hbmFnZXIgOiBDb21tdW5pY2F0aW9uTWFuYWdlcjtcbiAgICBwcml2YXRlIG1hdGNoTWFuYWdlciA6IE1hdGNoTWFuYWdlcjtcbiAgICBwcml2YXRlIHBsYXllck1hbmFnZXIgOiBQbGF5ZXJNYW5hZ2VyO1xuICAgIHByaXZhdGUgcmVjb3VyY2VNYW5hZ2VyIDogUmVjb3VyY2VNYW5hZ2VyO1xuXG4gICAgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgdGhpcy5nYW1lUmVuZGVyZXIgPSBuZXcgR2FtZVJlbmRlcmVyKCk7XG5cbiAgICAgICAgdGhpcy5pbnB1dE1hbmFnZXIgPSBuZXcgSW5wdXQuUGxheWVySW5wdXQoKTtcblxuICAgICAgICB0aGlzLm1hcCA9IG5ldyBNYXAodGhpcy5nYW1lUmVuZGVyZXIsIG51bGwpO1xuXG4gICAgICAgIHRoaXMuY29tbXVuaWNhdGlvbk1hbmFnZXIgPSBuZXcgQ29tbXVuaWNhdGlvbk1hbmFnZXIoKTtcblxuICAgICAgICB0aGlzLm1hdGNoTWFuYWdlciA9IG5ldyBNYXRjaE1hbmFnZXIodGhpcy5jb21tdW5pY2F0aW9uTWFuYWdlciwgdGhpcy5nYW1lUmVuZGVyZXIpO1xuXG4gICAgICAgIHRoaXMucGxheWVyTWFuYWdlciA9IG5ldyBQbGF5ZXJNYW5hZ2VyKHRoaXMuY29tbXVuaWNhdGlvbk1hbmFnZXIsIHRoaXMuZ2FtZVJlbmRlcmVyLCB0aGlzLm1hdGNoTWFuYWdlcik7XG5cbiAgICAgICAgdGhpcy5yZWNvdXJjZU1hbmFnZXIgPSBuZXcgUmVjb3VyY2VNYW5hZ2VyKHRoaXMuY29tbXVuaWNhdGlvbk1hbmFnZXIsIHRoaXMuZ2FtZVJlbmRlcmVyKTtcblxuICAgICAgICB0aGlzLmNvbW11bmljYXRpb25NYW5hZ2VyLm9uKCdwbGF5ZXIgZGF0YScsIGZ1bmN0aW9uKGRhdGEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbWVyYS5zZXRDYW1lcmFQb3NpdGlvbihuZXcgVmVjdG9yMkQoZGF0YS5waHlzUHJvcHMucG9zaXRpb24ueCwgZGF0YS5waHlzUHJvcHMucG9zaXRpb24ueSkpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuY29tbXVuaWNhdGlvbk1hbmFnZXIub24oJ21hcCBkYXRhJywgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICB0aGlzLm1hcC51cGRhdGVNYXAoZGF0YS5tYXApO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICBcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKGRlbHRhIDogbnVtYmVyKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMucGxheWVyTWFuYWdlci51cGRhdGUoZGVsdGEpO1xuICAgICAgICB0aGlzLnJlY291cmNlTWFuYWdlci51cGRhdGUoZGVsdGEpO1xuICAgICAgICB0aGlzLm1hdGNoTWFuYWdlci51cGRhdGUoZGVsdGEpO1xuICAgICAgICB0aGlzLm1hcC51cGRhdGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlci5yZW5kZXIoKTtcbiAgICB9XG59IiwiaW1wb3J0IEFzc2V0TG9hZGVyIGZyb20gXCIuLi91dGlscy9Bc3NldExvYWRlclwiO1xuaW1wb3J0IEdhbWVSZW5kZXJlciBmcm9tIFwiLi4vdXRpbHMvUmVuZGVyZXJcIjtcbmltcG9ydCBUeWxlIGZyb20gXCIuL1R5bGVcIjtcbmltcG9ydCB7Q29uZmlnfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgVmVjdG9yMkQgZnJvbSBcIi4uL3V0aWxzL1ZlY3RvcjJEXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcHtcblxuICAgIHByaXZhdGUgYmFzZVRleHR1cmUgOiBQSVhJLkJhc2VUZXh0dXJlO1xuICAgIHByaXZhdGUgdHlsZU1hcCA6IFR5bGVbXVtdO1xuICAgIHByaXZhdGUgY2VudGVyWCA6IG51bWJlcjtcbiAgICBwcml2YXRlIGNlbnRlclkgOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBnYW1lUmVuZGVyZXIgOiBHYW1lUmVuZGVyZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihyZW5kZXJlcjogR2FtZVJlbmRlcmVyLCBtYXA6IG51bWJlcltdKXtcbiAgICAgICAgdmFyIGVsZW1lbnQgOiBIVE1MSW1hZ2VFbGVtZW50ID0gPEhUTUxJbWFnZUVsZW1lbnQ+IEFzc2V0TG9hZGVyLmdldENvbnRlbnQoXCJ0aWxlc2V0XCIpO1xuXG4gICAgICAgIC8vbG9hZCBiYXNlIFNwcml0ZXNcbiAgICAgICAgdGhpcy5iYXNlVGV4dHVyZSA9IG5ldyBQSVhJLkJhc2VUZXh0dXJlKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlciA9IHJlbmRlcmVyO1xuXG4gICAgICAgIC8vY3JlYXRlIHR5bGVtYXBcbiAgICAgICAgdGhpcy50eWxlTWFwID0gW107XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBDb25maWcuTUFQX1NJWkVfWDsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMudHlsZU1hcFtpXSA9IFtdO1xuICAgICAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IENvbmZpZy5NQVBfU0laRV9ZOyBqKyspe1xuICAgICAgICAgICAgICAgIHRoaXMudHlsZU1hcFtpXVtqXSA9IG5ldyBUeWxlKHRoaXMuYmFzZVRleHR1cmUsIG5ldyBWZWN0b3IyRChpICogQ29uZmlnLlRJTEVfU0laRV9YLCBqICogQ29uZmlnLlRJTEVfU0laRV9YKSk7XG4gICAgICAgICAgICAgICAgdGhpcy50eWxlTWFwW2ldW2pdLnNldElkKDApO1xuICAgICAgICAgICAgICAgIHJlbmRlcmVyLmFkZFRvTWFpbkNvbnRhaW5lcih0aGlzLnR5bGVNYXBbaV1bal0uZ2V0U3ByaXRlKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyB1cGRhdGUoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBDb25maWcuTUFQX1NJWkVfWDsgaSsrKXtcbiAgICAgICAgICAgIGZvcih2YXIgaiA9IDA7IGogPCBDb25maWcuTUFQX1NJWkVfWTsgaisrKXtcbiAgICAgICAgICAgICAgICB0aGlzLnR5bGVNYXBbaV1bal0udXBkYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlTWFwKG1hcDogbnVtYmVyW10pIDogdm9pZFxuICAgIHtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IENvbmZpZy5NQVBfU0laRV9YOyBpKyspe1xuICAgICAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IENvbmZpZy5NQVBfU0laRV9ZOyBqKyspe1xuXG4gICAgICAgICAgICAgICAgdGhpcy50eWxlTWFwW2ldW2pdLnNldElkKG1hcFtpXVtqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgQXNzZXRMb2FkZXIgZnJvbSBcIi4uL3V0aWxzL0Fzc2V0TG9hZGVyXCI7XG5pbXBvcnQgR2FtZVJlbmRlcmVyIGZyb20gXCIuLi91dGlscy9SZW5kZXJlclwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9VdGlsc1wiO1xuaW1wb3J0IFZlY3RvcjJEIGZyb20gXCIuLi91dGlscy9WZWN0b3IyRFwiO1xuaW1wb3J0IHtDb25maWd9IGZyb20gXCIuLi9jb25maWdcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwSGFuZGxlcntcblxuICAgIHByaXZhdGUgdHlsZVNwcml0ZSA6IFBJWEkuU3ByaXRlO1xuICAgIHByaXZhdGUgcG9zIDogVmVjdG9yMkQ7XG5cbiAgICBjb25zdHJ1Y3RvcihiYXNlVGV4dHVyZTogUElYSS5CYXNlVGV4dHVyZSwgcG9zaXRpb246IFZlY3RvcjJEKVxuICAgIHtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3NpdGlvbjtcbiAgICAgICAgdGhpcy50eWxlU3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKG5ldyBQSVhJLlRleHR1cmUoYmFzZVRleHR1cmUsIG5ldyBQSVhJLlJlY3RhbmdsZSgwLDAsQ29uZmlnLlRJTEVfU0laRV9YLENvbmZpZy5USUxFX1NJWkVfWSkpKTtcbiAgICAgICAgVXRpbHMuc2V0U3ByaXRlVmlld3BvcnRQb3ModGhpcy50eWxlU3ByaXRlLCB0aGlzLnBvcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZSgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgVXRpbHMuc2V0U3ByaXRlVmlld3BvcnRQb3ModGhpcy50eWxlU3ByaXRlLCB0aGlzLnBvcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldElkKGlkIDogbnVtYmVyKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHZhciByYW5kWSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDQpO1xuICAgICAgICB0aGlzLnR5bGVTcHJpdGUudGV4dHVyZS5mcmFtZSA9IG5ldyBQSVhJLlJlY3RhbmdsZShpZCAqIENvbmZpZy5USUxFX1NJWkVfWCwgcmFuZFkgKiBDb25maWcuVElMRV9TSVpFX1ksIENvbmZpZy5USUxFX1NJWkVfWCxDb25maWcuVElMRV9TSVpFX1kpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTcHJpdGUoKSA6IFBJWEkuU3ByaXRlXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy50eWxlU3ByaXRlO1xuICAgIH1cbn0iLCJpbXBvcnQgQXNzZXRMb2FkZXIgZnJvbSBcIi4uL3V0aWxzL0Fzc2V0TG9hZGVyXCI7XG5pbXBvcnQgR2FtZVJlbmRlcmVyIGZyb20gXCIuLi91dGlscy9SZW5kZXJlclwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9VdGlsc1wiO1xuaW1wb3J0IFZlY3RvcjJEIGZyb20gXCIuLi91dGlscy9WZWN0b3IyRFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmFmdGluZ0FyZWF7XG5cbiAgICBwcml2YXRlIHNwcml0ZSA6IFBJWEkuU3ByaXRlO1xuICAgIHByaXZhdGUgcG9zIDogVmVjdG9yMkQ7XG4gICAgcHJvdGVjdGVkIGdhbWVSZW5kZXJlciA6IEdhbWVSZW5kZXJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGJhc2VUZXh0dXJlIDogUElYSS5CYXNlVGV4dHVyZSwgcmVuZGVyZXI6IEdhbWVSZW5kZXJlciwgcG9zaXRpb246IFZlY3RvcjJELCBjb2xvcjogbnVtYmVyKVxuICAgIHtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3NpdGlvbjtcbiAgICAgICAgdGhpcy5nYW1lUmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUobmV3IFBJWEkuVGV4dHVyZShiYXNlVGV4dHVyZSkpO1xuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlci5hZGRUb01haW5Db250YWluZXIodGhpcy5zcHJpdGUpO1xuICAgICAgICB0aGlzLnNwcml0ZS50aW50ID0gY29sb3I7XG4gICAgICAgIHRoaXMuc3ByaXRlLmFuY2hvciA9IG5ldyBQSVhJLlBvaW50KDAuNSAsIDAuNSk7XG4gICAgICAgIFV0aWxzLnNldFNwcml0ZVZpZXdwb3J0UG9zKHRoaXMuc3ByaXRlLCB0aGlzLnBvcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldENvbG9yKGNvbG9yIDogbnVtYmVyKVxuICAgIHtcbiAgICAgICAgdGhpcy5zcHJpdGUudGludCA9IGNvbG9yO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGUoZGVsdGEgOiBudW1iZXIpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5zcHJpdGUucm90YXRpb24gKz0gMjAgKiBkZWx0YS8xMDAwO1xuICAgICAgICBpZih0aGlzLnNwcml0ZS5yb3RhdGlvbiA+IDM2MCkgdGhpcy5zcHJpdGUucm90YXRpb24gPSB0aGlzLnNwcml0ZS5yb3RhdGlvbiAtIDM2MDtcbiAgICAgICAgVXRpbHMuc2V0U3ByaXRlVmlld3BvcnRQb3ModGhpcy5zcHJpdGUsIHRoaXMucG9zKTtcbiAgICB9XG59IiwiaW1wb3J0IENvbW11bmljYXRpb25NYW5hZ2VyIGZyb20gXCIuLi9jb21tdW5pY2F0aW9uL0NvbW11bmljYXRpb25NYW5hZ2VyXCI7XG5pbXBvcnQgR2FtZVJlbmRlcmVyIGZyb20gXCIuLi91dGlscy9SZW5kZXJlclwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9VdGlsc1wiO1xuaW1wb3J0IFZlY3RvcjJEIGZyb20gXCIuLi91dGlscy9WZWN0b3IyRFwiO1xuaW1wb3J0IENyYWZ0aW5nQXJlYSBmcm9tIFwiLi9DcmFmdGluZ0FyZWFcIjtcbmltcG9ydCBBc3NldExvYWRlciBmcm9tIFwiLi4vdXRpbHMvQXNzZXRMb2FkZXJcIjtcbmltcG9ydCB7Q29uZmlnfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5cbmNsYXNzIFRlYW1TY29yZVxue1xuICAgIHByb3RlY3RlZCByZXNvdXJjZUNvdW50VGV4dHMgOiB7fTtcbiAgICBwcm90ZWN0ZWQgcHJvZ3Jlc3NCYXIgOiBQSVhJLlRleHQ7XG4gICAgcHJvdGVjdGVkIGdhbWVSZW5kZXJlciA6IEdhbWVSZW5kZXJlcjtcbiAgICBwcm90ZWN0ZWQgbmVlZGVkUmVzb3VyY2VzIDoge307XG4gICAgcHJvdGVjdGVkIHBvc2l0aW9uIDogVmVjdG9yMkQ7XG5cbiAgICBjb25zdHJ1Y3RvcihnYW1lUmVuZGVyZXIgOiBHYW1lUmVuZGVyZXIsIG5lZWRlZFJlc291cmNlcyA6IHt9LCBwb3NpdGlvbiA6IFZlY3RvcjJEKVxuICAgIHtcbiAgICAgICAgdGhpcy5nYW1lUmVuZGVyZXIgPSBnYW1lUmVuZGVyZXI7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhuZWVkZWRSZXNvdXJjZXMpO1xuICAgICAgICB0aGlzLnJlc291cmNlQ291bnRUZXh0cyA9IHt9O1xuICAgICAgICB0aGlzLm5lZWRlZFJlc291cmNlcyA9IG5lZWRlZFJlc291cmNlcztcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VDb3VudFRleHRzW2tleXNbaV1dID0gbmV3IFBJWEkuVGV4dChrZXlzW2ldK1wiOiBcIiswK1wiIC8gXCIrbmVlZGVkUmVzb3VyY2VzW2tleXNbaV1dKTtcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VDb3VudFRleHRzW2tleXNbaV1dLnBvc2l0aW9uID0gbmV3IFBJWEkuUG9pbnQodGhpcy5wb3NpdGlvbi54ICsgaSoyMDAsIHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgICAgICB0aGlzLmdhbWVSZW5kZXJlci5hZGRUb01haW5Db250YWluZXIodGhpcy5yZXNvdXJjZUNvdW50VGV4dHNba2V5c1tpXV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZVJlc291cmNlKHJlc291cmNlIDogc3RyaW5nLCBjb3VudCA6IG51bWJlcilcbiAgICB7XG4gICAgICAgIHZhciByZXNvdXJjZVRleHQgPSB0aGlzLnJlc291cmNlQ291bnRUZXh0c1tyZXNvdXJjZV07XG5cbiAgICAgICAgaWYocmVzb3VyY2VUZXh0KSByZXNvdXJjZVRleHQudGV4dCA9IHJlc291cmNlK1wiOiBcIitjb3VudCtcIiAvIFwiK3RoaXMubmVlZGVkUmVzb3VyY2VzW3Jlc291cmNlXTtcbiAgICB9XG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXRjaE1hbmFnZXJ7XG5cbiAgICBwcm90ZWN0ZWQgY3JhZnRpbmdBcmVhcyA6IHt9O1xuICAgIHByb3RlY3RlZCBjb21tdW5pY2F0aW9uTWFuYWdlciA6IENvbW11bmljYXRpb25NYW5hZ2VyO1xuICAgIHByb3RlY3RlZCBnYW1lUmVuZGVyZXIgOiBHYW1lUmVuZGVyZXI7XG4gICAgcHJvdGVjdGVkIGNyYWZ0aW5nQXJlYVRleHR1cmUgOiBQSVhJLkJhc2VUZXh0dXJlO1xuICAgIHByb3RlY3RlZCBtYWluUGxheWVyVGVhbSA6IG51bWJlcjtcbiAgICBwcm90ZWN0ZWQgdGVhbVNjb3JlRGlzcGxheSA6IHt9O1xuXG4gICAgY29uc3RydWN0b3IoY29tbXVuaWNhdGlvbk1hbmFnZXIgOiBDb21tdW5pY2F0aW9uTWFuYWdlciwgZ2FtZVJlbmRlcmVyIDogR2FtZVJlbmRlcmVyKVxuICAgIHtcbiAgICAgICAgdGhpcy5jb21tdW5pY2F0aW9uTWFuYWdlciA9IGNvbW11bmljYXRpb25NYW5hZ2VyO1xuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlciA9IGdhbWVSZW5kZXJlcjtcbiAgICAgICAgdGhpcy5jcmFmdGluZ0FyZWFzID0ge307XG4gICAgICAgIHRoaXMubWFpblBsYXllclRlYW0gPSBudWxsO1xuICAgICAgICB0aGlzLmNyYWZ0aW5nQXJlYVRleHR1cmUgPSBuZXcgUElYSS5CYXNlVGV4dHVyZSg8SFRNTEltYWdlRWxlbWVudD4gQXNzZXRMb2FkZXIuZ2V0Q29udGVudChcIkNyYWZ0aW5nQXJlYVwiKSk7XG4gICAgICAgIHRoaXMudGVhbVNjb3JlRGlzcGxheSA9IHt9O1xuICAgICAgICB2YXIgdGVhbVBvc1Njb3JlID0gW25ldyBWZWN0b3IyRCgwLCAyMCksIG5ldyBWZWN0b3IyRChDb25maWcuU1RBR0VfV0lEVEggLSA2MzAsIENvbmZpZy5TVEFHRV9IRUlHSFQgLSA1MCldO1xuICAgICAgICB0aGlzLmNvbW11bmljYXRpb25NYW5hZ2VyLm9uKCdtYXRjaCBkYXRhJywgZnVuY3Rpb24oZGF0YSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGksIHRlYW1EYXRhO1xuICAgICAgICAgICAgaWYoZGF0YSAmJiBkYXRhLm1hdGNoICYmIGRhdGEubWF0Y2gudGVhbURhdGEpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgZGF0YS5tYXRjaC50ZWFtRGF0YS5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRlYW1EYXRhID0gZGF0YS5tYXRjaC50ZWFtRGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuY3JhZnRpbmdBcmVhc1tpXSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmFmdGluZ0FyZWFzW2ldID0gbmV3IENyYWZ0aW5nQXJlYShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyYWZ0aW5nQXJlYVRleHR1cmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lUmVuZGVyZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjJEKHRlYW1EYXRhLmNyYWZ0aW5nWm9uZS5wb3NpdGlvbi54LCB0ZWFtRGF0YS5jcmFmdGluZ1pvbmUucG9zaXRpb24ueSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlnLkNPTE9SX05FVVRSQUxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRlYW1TY29yZURpc3BsYXlbaV0gPSBuZXcgVGVhbVNjb3JlKHRoaXMuZ2FtZVJlbmRlcmVyLCBkYXRhLm1hdGNoLm5lZWRlZFJlc291cmNlcywgdGVhbVBvc1Njb3JlW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICBpZih0aGlzLm1haW5QbGF5ZXJUZWFtKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sb3JUZWFtcygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5jb21tdW5pY2F0aW9uTWFuYWdlci5vbignZ2FtZSB3b24nLCBmdW5jdGlvbihkYXRhKVxuICAgICAgICB7XG4gICAgICAgICAgICBcblxuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuY29tbXVuaWNhdGlvbk1hbmFnZXIub24oJ3Jlc291cmNlcyBjaGFuZ2VkJywgZnVuY3Rpb24oZGF0YSlcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEudGVhbVJlc291cmNlcy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIHJlc291cmNlIGluIGRhdGEudGVhbVJlc291cmNlc1tpXS5yZXNvdXJjZVN0YXNoKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZWFtU2NvcmVEaXNwbGF5W2ldLnVwZGF0ZVJlc291cmNlKHJlc291cmNlLCBkYXRhLnRlYW1SZXNvdXJjZXNbaV0ucmVzb3VyY2VTdGFzaFtyZXNvdXJjZV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TWFpblBsYXllclRlYW0odGVhbSA6IG51bWJlcilcbiAgICB7XG4gICAgICAgIHRoaXMubWFpblBsYXllclRlYW0gPSB0ZWFtO1xuICAgICAgICB0aGlzLmNvbG9yVGVhbXMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29sb3JUZWFtcygpXG4gICAge1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY3JhZnRpbmdBcmVhcyksIGk7XG4gICAgICAgIGZvcihpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKGkgPT0gdGhpcy5tYWluUGxheWVyVGVhbSlcbiAgICAgICAgICAgIHsgICB0aGlzLmNyYWZ0aW5nQXJlYXNba2V5c1tpXV0uc2V0Q29sb3IoQ29uZmlnLkNPTE9SX0ZSSUVORCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyYWZ0aW5nQXJlYXNba2V5c1tpXV0uc2V0Q29sb3IoQ29uZmlnLkNPTE9SX0ZPRSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKGRlbHRhKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGhpcy5jcmFmdGluZ0FyZWFzKSwgaTtcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5jcmFmdGluZ0FyZWFzW2tleXNbaV1dLnVwZGF0ZShkZWx0YSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IEFzc2V0TG9hZGVyIGZyb20gXCIuLi91dGlscy9Bc3NldExvYWRlclwiO1xuaW1wb3J0IEdhbWVSZW5kZXJlciBmcm9tIFwiLi4vdXRpbHMvUmVuZGVyZXJcIjtcbmltcG9ydCBQSV8yID0gUElYSS5QSV8yO1xuaW1wb3J0IFZlY3RvcjJEIGZyb20gXCIuLi91dGlscy9WZWN0b3IyRFwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9VdGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZXtcblxuICAgIHByaXZhdGUgcGFydGljbGVTcHJpdGUgOiBQSVhJLlNwcml0ZTtcbiAgICBwcml2YXRlIGJhc2VUZXh0dXJlIDogUElYSS5CYXNlVGV4dHVyZTtcblxuICAgIHByaXZhdGUgcG9zIDogVmVjdG9yMkQ7XG4gICAgcHJpdmF0ZSBvZmZzZXQgOiBWZWN0b3IyRFxuXG5cbiAgICBwcml2YXRlIG1vdmUgOiBWZWN0b3IyRDtcblxuICAgIHByaXZhdGUgbGl2ZVRpbWUgOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBtYXhMaXZlVGltZSA6IG51bWJlcjtcblxuICAgIHByaXZhdGUgdG9EZWxldGUgOiBib29sZWFuO1xuXG4gICAgcHJpdmF0ZSByZW5kZXJlciA6IEdhbWVSZW5kZXJlcjtcbiAgICBcbiAgICBwcml2YXRlIGVtaXR0aW5nUmFkaXVzIDogbnVtYmVyO1xuXG4gICAgcHJpdmF0ZSBjb2xvcjtcblxuICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVyOiBHYW1lUmVuZGVyZXIsIHBvcyA6IFZlY3RvcjJELCBjb2xvciA6IG51bWJlciB8IGJvb2xlYW4sIGJhc2VUZXh0dXJlIDogUElYSS5CYXNlVGV4dHVyZSwgbWF4VGltZSA6IG51bWJlciwgZW1pdHRpbmdSYWRpdXMgOiBudW1iZXIpe1xuICAgICAgICB0aGlzLmVtaXR0aW5nUmFkaXVzID0gZW1pdHRpbmdSYWRpdXM7XG4gICAgICAgIHRoaXMubWF4TGl2ZVRpbWUgPSBtYXhUaW1lO1xuICAgICAgICB0aGlzLmJhc2VUZXh0dXJlID0gYmFzZVRleHR1cmU7XG4gICAgICAgIHRoaXMucGFydGljbGVTcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUobmV3IFBJWEkuVGV4dHVyZSh0aGlzLmJhc2VUZXh0dXJlKSk7XG4gICAgICAgIHRoaXMub2Zmc2V0ID0gbmV3IFZlY3RvcjJEKHRoaXMucGFydGljbGVTcHJpdGUud2lkdGggLyAyLCB0aGlzLnBhcnRpY2xlU3ByaXRlLmhlaWdodCAvIDIpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG4gICAgICAgIGlmKHR5cGVvZiBjb2xvciA9PSBcIm51bWJlclwiKXtcbiAgICAgICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTcHJpdGUudGludCA9IHRoaXMuY29sb3I7Ly8nIycrKDB4MTAwMDAwMCsoTWF0aC5yYW5kb20oKSkqMHhmZmZmZmYpLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSw2KTtcbiAgICAgICAgfVxuICAgICAgICBpZih0eXBlb2YgY29sb3IgPT0gXCJib29sZWFuXCIpe1xuICAgICAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICAgICAgaWYodGhpcy5jb2xvcil7XG4gICAgICAgICAgICAgICAgLy90aGlzLnBhcnRpY2xlU3ByaXRlLnRpbnQgPSBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG4gICAgICAgICAgICAgICAgdmFyIHIgPSBNYXRoLnJhbmRvbSgpICogMHhmZjAwMDA7XG4gICAgICAgICAgICAgICAgdmFyIGcgPSBNYXRoLnJhbmRvbSgpICogMHgwMGZmMDA7XG4gICAgICAgICAgICAgICAgdmFyIGIgPSBNYXRoLnJhbmRvbSgpICogMHgwMDAwZmY7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNwcml0ZS50aW50ID0gciArIGcgKyBiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDEwO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5wb3MgPSBuZXcgVmVjdG9yMkQocG9zLnggLSB0aGlzLm9mZnNldC54LCBwb3MueSAtIHRoaXMub2Zmc2V0LnkpO1xuXG4gICAgICAgIHRoaXMubGl2ZVRpbWUgPSAwO1xuXG4gICAgICAgIFV0aWxzLnNldFNwcml0ZVZpZXdwb3J0UG9zKHRoaXMucGFydGljbGVTcHJpdGUsIHRoaXMucG9zKTtcbiAgICAgICAgXG4gICAgICAgIHJlbmRlcmVyLmFkZFRvTWFpbkNvbnRhaW5lcih0aGlzLnBhcnRpY2xlU3ByaXRlKTtcblxuICAgICAgICB0aGlzLm1vdmUgPSBuZXcgVmVjdG9yMkQoMCwwKTtcbiAgICAgICAgdGhpcy5tb3ZlLnggPSAgdGhpcy5lbWl0dGluZ1JhZGl1cyAqIE1hdGguY29zKE1hdGguUEkgKiAyICogcik7XG4gICAgICAgIHRoaXMubW92ZS55ID0gIHRoaXMuZW1pdHRpbmdSYWRpdXMgKiBNYXRoLnNpbihNYXRoLlBJICogMiAqIHIpO1xuXG4gICAgICAgIHRoaXMudG9EZWxldGUgPSBmYWxzZTtcblxuICAgICAgICByID0gTWF0aC5yYW5kb20oKSAqIDEwO1xuICAgICAgICB0aGlzLm1heExpdmVUaW1lICo9IHI7XG4gICAgICAgIHRoaXMubWF4TGl2ZVRpbWUgLz0gNTA7XG4gICAgfVxuXG4gICAgcHVibGljIHNldFNwcml0ZShiYXNlVGV4IDogUElYSS5CYXNlVGV4dHVyZSl7XG4gICAgICAgIHRoaXMucGFydGljbGVTcHJpdGUudGV4dHVyZSA9IG5ldyBQSVhJLlRleHR1cmUoYmFzZVRleCk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZShkZWx0YTogbnVtYmVyKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMubGl2ZVRpbWUgKz0gMTY7XG4gICAgICAgIGlmKHRoaXMubGl2ZVRpbWUgPiB0aGlzLm1heExpdmVUaW1lKXtcbiAgICAgICAgICAgIHRoaXMudG9EZWxldGUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIXRoaXMgfHwgIXRoaXMucG9zIHx8ICF0aGlzLnBvcy5hZGQpIGRlYnVnZ2VyO1xuXG4gICAgICAgIHRoaXMucG9zID0gbmV3IFZlY3RvcjJEKHRoaXMucG9zLnggKyB0aGlzLm1vdmUueCwgdGhpcy5wb3MueSArIHRoaXMubW92ZS55KTtcbiAgICAgICAgVXRpbHMuc2V0U3ByaXRlVmlld3BvcnRQb3ModGhpcy5wYXJ0aWNsZVNwcml0ZSwgdGhpcy5wb3MpO1xuXG4gICAgICAgIHRoaXMucGFydGljbGVTcHJpdGUuYWxwaGEgKj0gKDE1LzE2KTtcblxuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgY2hlY2tBbGl2ZSgpIDogYm9vbGVhbntcbiAgICAgICAgcmV0dXJuICF0aGlzLnRvRGVsZXRlO1xuICAgIH1cbiAgICBwdWJsaWMgZGVzdHJveSgpXG4gICAge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUZyb21NYWluQ29udGFpbmVyKHRoaXMucGFydGljbGVTcHJpdGUpO1xuICAgIH1cblxufSIsImltcG9ydCBQYXJ0aWNsZSBmcm9tIFwiLi9QYXJ0aWNsZVwiO1xuaW1wb3J0IEFzc2V0TG9hZGVyIGZyb20gXCIuLi91dGlscy9Bc3NldExvYWRlclwiO1xuaW1wb3J0IEdhbWVSZW5kZXJlciBmcm9tIFwiLi4vdXRpbHMvUmVuZGVyZXJcIjtcbmltcG9ydCBWZWN0b3IyRCBmcm9tIFwiLi4vdXRpbHMvVmVjdG9yMkRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFydGljbGVFbWl0dGVye1xuXG4gICAgcHJpdmF0ZSBiYXNlVGV4dHVyZSA6IFBJWEkuQmFzZVRleHR1cmU7XG4gICAgcHJpdmF0ZSBwYXJ0aWNsZXMgOiBQYXJ0aWNsZVtdO1xuICAgIHByaXZhdGUgcmVuZGVyZXIgOiBHYW1lUmVuZGVyZXI7XG4gICAgcHJpdmF0ZSBwYXJ0aWNsZUNvdW50IDogbnVtYmVyO1xuICAgIHByaXZhdGUgY29sb3IgOiBudW1iZXIgfCBib29sZWFuO1xuICAgIHByaXZhdGUgbWF4VGltZSA6IG51bWJlcjtcbiAgICBwcml2YXRlIGVtaXR0aW5nUmFkaXVzIDogbnVtYmVyO1xuICAgIHByaXZhdGUgcG9zIDogVmVjdG9yMkQ7XG5cbiAgICBjb25zdHJ1Y3RvcihyZW5kZXJlcjogR2FtZVJlbmRlcmVyLCBwb3MgOiBWZWN0b3IyRCwgY29sb3IgOiBudW1iZXIgfCBib29sZWFuLCB0ZXh0dXJlUGF0aCA6IHN0cmluZywgbWF4VGltZSA6IG51bWJlciwgZW1pdGluZ1JhZGl1cyA6IG51bWJlciwgcGFydGljbGVDb3VudD8gOiBudW1iZXIpXG4gICAge1xuICAgICAgICB0aGlzLnBvcyA9IHBvcztcbiAgICAgICAgdGhpcy5lbWl0dGluZ1JhZGl1cyA9IGVtaXRpbmdSYWRpdXM7XG4gICAgICAgIHZhciBlbGVtZW50IDogSFRNTEltYWdlRWxlbWVudCA9IDxIVE1MSW1hZ2VFbGVtZW50PiBBc3NldExvYWRlci5nZXRDb250ZW50KHRleHR1cmVQYXRoKTtcbiAgICAgICAgdGhpcy5iYXNlVGV4dHVyZSA9IG5ldyBQSVhJLkJhc2VUZXh0dXJlKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IFtdO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgICAgICAgdGhpcy5tYXhUaW1lID0gbWF4VGltZTtcbiAgICAgICAgaWYocGFydGljbGVDb3VudCkgdGhpcy5wYXJ0aWNsZUNvdW50ID0gcGFydGljbGVDb3VudDsgZWxzZSB0aGlzLnBhcnRpY2xlQ291bnQgPSA1MDtcblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJ0aWNsZUNvdW50OyBpICsrKXtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2ldID0gbmV3IFBhcnRpY2xlKHJlbmRlcmVyLCBwb3MsIHRoaXMuY29sb3IsIHRoaXMuYmFzZVRleHR1cmUsIHRoaXMubWF4VGltZSwgdGhpcy5lbWl0dGluZ1JhZGl1cyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNldFNwcml0ZShzcHJpdGUgOiBzdHJpbmcpe1xuICAgICAgICB2YXIgZWxlbWVudCA6IEhUTUxJbWFnZUVsZW1lbnQgPSA8SFRNTEltYWdlRWxlbWVudD4gQXNzZXRMb2FkZXIuZ2V0Q29udGVudChzcHJpdGUpO1xuICAgICAgICB0aGlzLmJhc2VUZXh0dXJlID0gbmV3IFBJWEkuQmFzZVRleHR1cmUoZWxlbWVudCk7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcnRpY2xlQ291bnQ7IGkgKyspe1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXNbaV0uc2V0U3ByaXRlKHRoaXMuYmFzZVRleHR1cmUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNldENvbG9yKGNvbG9yIDogbnVtYmVyKVxuICAgIHtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGUocG9zIDogVmVjdG9yMkQsIGRlbHRhIDogbnVtYmVyKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIFxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJ0aWNsZUNvdW50OyBpKyspe1xuICAgICAgICAgICAgaWYoIXRoaXMucGFydGljbGVzW2ldLmNoZWNrQWxpdmUoKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXNbaV0uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2ldID0gbmV3IFBhcnRpY2xlKHRoaXMucmVuZGVyZXIsIHBvcywgdGhpcy5jb2xvciwgdGhpcy5iYXNlVGV4dHVyZSwgdGhpcy5tYXhUaW1lLCB0aGlzLmVtaXR0aW5nUmFkaXVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlc1tpXS51cGRhdGUoZGVsdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXRQb3NpdGlvbigpIDogVmVjdG9yMkRcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVzdHJveSgpXG4gICAge1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJ0aWNsZUNvdW50OyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2ldLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCBBc3NldExvYWRlciBmcm9tIFwiLi4vdXRpbHMvQXNzZXRMb2FkZXJcIjtcbmltcG9ydCBHYW1lUmVuZGVyZXIgZnJvbSBcIi4uL3V0aWxzL1JlbmRlcmVyXCI7XG5pbXBvcnQgUGFydGljbGVFbWl0dGVyIGZyb20gXCIuL1BhcnRpY2xlRW1pdHRlclwiO1xuaW1wb3J0IFZlY3RvcjJEIGZyb20gXCIuLi91dGlscy9WZWN0b3IyRFwiO1xuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlscy9VdGlsc1wiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVye1xuXG5cbiAgICBwcml2YXRlIGlkIDogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9zIDogVmVjdG9yMkQ7XG4gICAgcHJpdmF0ZSBwYXJ0aWNsZUVtaXR0ZXIgOiBQYXJ0aWNsZUVtaXR0ZXI7XG4gICAgcHJpdmF0ZSBnYW1lUmVuZGVyZXIgOiBHYW1lUmVuZGVyZXI7XG4gICAgcHJpdmF0ZSBjb2xvcjtcbiAgICBwcml2YXRlIGlzU3R1bm5lZCA6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSB0ZWFtIDogc3RyaW5nO1xuICAgIHByaXZhdGUgaXRlbSA6IHN0cmluZztcblxuICAgIHB1YmxpYyBzZXRJdGVtKGl0ZW0gOiBzdHJpbmcpe1xuICAgICAgICB0aGlzLml0ZW0gPSBpdGVtO1xuICAgICAgICB0aGlzLnBhcnRpY2xlRW1pdHRlci5zZXRTcHJpdGUodGhpcy5pdGVtKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3RydWN0b3IocmVuZGVyZXI6IEdhbWVSZW5kZXJlciwgaWQgOiBzdHJpbmcsIHRlYW0gOiBzdHJpbmcsIGNvbG9yIDogbnVtYmVyIHwgYm9vbGVhbil7XG5cbiAgICAgICAgdGhpcy5pdGVtID0gXCJub25lXCI7XG4gICAgICAgIHRoaXMudGVhbSA9IHRlYW07XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5wb3MgPSBuZXcgVmVjdG9yMkQoMCwgMCk7XG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyID0gcmVuZGVyZXI7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAgICAgdGhpcy5wYXJ0aWNsZUVtaXR0ZXIgPSBuZXcgUGFydGljbGVFbWl0dGVyKHJlbmRlcmVyLCBuZXcgVmVjdG9yMkQoMCAsMCksIHRoaXMuY29sb3IsIHRoaXMuaXRlbSwgODAwLCAzKTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHVwZGF0ZShkZWx0YSA6IG51bWJlcikgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLnBhcnRpY2xlRW1pdHRlci51cGRhdGUodGhpcy5wb3MsIGRlbHRhKTtcbiAgICAgICAgdGhpcy51cGRhdGVDb2xvckFjY29yZGluZ1RvU3RhdHVzKGRlbHRhKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlQ29sb3JBY2NvcmRpbmdUb1N0YXR1cyhkZWx0YSlcbiAgICB7XG4gICAgICAgIGlmKHRoaXMuaXNTdHVubmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlRW1pdHRlci5zZXRDb2xvcihVdGlscy5jb2xvck1ha2VCcmlnaHRlcih0aGlzLmNvbG9yLCBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqNTApKzUwKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlRW1pdHRlci5zZXRDb2xvcih0aGlzLmNvbG9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRJZCgpIDogc3RyaW5nXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5pZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0UG9zaXRpb24ocG9zIDogVmVjdG9yMkQpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzZXRJc1N0dW5uZWQoaXNTdHVubmVkIDogYm9vbGVhbilcbiAgICB7XG4gICAgICAgIHRoaXMuaXNTdHVubmVkID0gaXNTdHVubmVkO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgZGVzdHJveSgpXG4gICAge1xuICAgICAgICB0aGlzLnBhcnRpY2xlRW1pdHRlci5kZXN0cm95KCk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXRUZWFtKCkgOiBzdHJpbmdcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlYW07XG4gICAgfVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9saWJzc3JjL3NvY2tldC5pby1jbGllbnQuZC50c1wiLz5cbmltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiLi4vdXRpbHMvTG9nZ2VyXCI7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vcGxheWVyL1BsYXllclwiO1xuaW1wb3J0IENvbW11bmljYXRpb25NYW5hZ2VyIGZyb20gXCIuLi9jb21tdW5pY2F0aW9uL0NvbW11bmljYXRpb25NYW5hZ2VyXCI7XG5pbXBvcnQgR2FtZVJlbmRlcmVyIGZyb20gXCIuLi91dGlscy9SZW5kZXJlclwiO1xuaW1wb3J0IENhbWVyYSBmcm9tIFwiLi4vdXRpbHMvQ2FtZXJhXCI7XG5pbXBvcnQge0lucHV0fSBmcm9tIFwiLi4vdXRpbHMvSW5wdXRcIjtcbmltcG9ydCBWZWN0b3IyRCBmcm9tIFwiLi4vdXRpbHMvVmVjdG9yMkRcIjtcbmltcG9ydCBNYXRjaE1hbmFnZXIgZnJvbSBcIi4uL21hdGNoL01hdGNoTWFuYWdlclwiO1xuXG52YXIgbG9nID0gTG9nZ2VyKFwiQ29tbXVuaWNhdGlvbk1hbmFnZXJcIik7XG5cbmNsYXNzIFBsYXllck1hbmFnZXIge1xuXG4gICAgcHJvdGVjdGVkIG1haW5QbGF5ZXIgOiBQbGF5ZXI7XG4gICAgcHJvdGVjdGVkIG1haW5QbGF5ZXJJbnB1dCA6IElucHV0LlBsYXllcklucHV0O1xuICAgIHByb3RlY3RlZCBvdGhlclBsYXllcnMgOiB7fTtcbiAgICBwcm90ZWN0ZWQgY29tbXVuaWNhdGlvbk1hbmFnZXIgOiBDb21tdW5pY2F0aW9uTWFuYWdlcjtcbiAgICBwcm90ZWN0ZWQgbWF0Y2hNYW5hZ2VyIDogTWF0Y2hNYW5hZ2VyO1xuICAgIHByb3RlY3RlZCBnYW1lUmVuZGVyZXIgOiBHYW1lUmVuZGVyZXI7XG4gICAgIHByb3RlY3RlZCBibGEgOm51bWJlcjtcbiAgICBjb25zdHJ1Y3Rvcihjb21tdW5pY2F0aW9uTWFuYWdlciA6IENvbW11bmljYXRpb25NYW5hZ2VyLCBnYW1lUmVuZGVyZXI6IEdhbWVSZW5kZXJlciwgbWF0Y2hNYW5hZ2VyIDogTWF0Y2hNYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMub3RoZXJQbGF5ZXJzID0ge307XG4gICAgICAgIHRoaXMuY29tbXVuaWNhdGlvbk1hbmFnZXIgPSBjb21tdW5pY2F0aW9uTWFuYWdlcjtcbiAgICAgICAgdGhpcy5nYW1lUmVuZGVyZXIgPSBnYW1lUmVuZGVyZXI7XG4gICAgICAgIHRoaXMubWF0Y2hNYW5hZ2VyID0gbWF0Y2hNYW5hZ2VyO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5tYWluUGxheWVySW5wdXQgPSBuZXcgSW5wdXQuUGxheWVySW5wdXQoKTtcbiAgICAgICAgdGhpcy5ibGEgPSAwO1xuXG4gICAgICAgIHRoaXMuY29tbXVuaWNhdGlvbk1hbmFnZXIub24oJ3BsYXllciBkYXRhJywgZnVuY3Rpb24oZGF0YSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoIXRoaXMubWFpblBsYXllcikgICBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1haW5QbGF5ZXIgPSBuZXcgUGxheWVyKGdhbWVSZW5kZXJlciwgZGF0YS5pZCwgZGF0YS50ZWFtLCBDb25maWcuQ09MT1JfTUUpO1xuICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hNYW5hZ2VyLnNldE1haW5QbGF5ZXJUZWFtKGRhdGEudGVhbS5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm1haW5QbGF5ZXIuc2V0UG9zaXRpb24obmV3IFZlY3RvcjJEKGRhdGEucGh5c1Byb3BzLnBvc2l0aW9uLngsIGRhdGEucGh5c1Byb3BzLnBvc2l0aW9uLnkpKTtcbiAgICAgICAgICAgIHRoaXMubWFpblBsYXllci5zZXRJc1N0dW5uZWQoZGF0YS5pc1N0dW5uZWQpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG5cbiAgICAgICAgdGhpcy5jb21tdW5pY2F0aW9uTWFuYWdlci5vbignb3RoZXIgcGxheWVyIGRhdGEnLCBmdW5jdGlvbihkYXRhKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgcGxheWVyLCBpLCBpZDtcblxuICAgICAgICAgICAgZm9yKGlkIGluIHRoaXMub3RoZXJQbGF5ZXJzKVxuICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5vdGhlclBsYXllcnNbaWRdLnBsYXllclVwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgZGF0YS5vdGhlclBsYXllcnMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGxheWVyID0gZGF0YS5vdGhlclBsYXllcnNbaV07XG5cbiAgICAgICAgICAgICAgICBpZihwbGF5ZXIuaWQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5vdGhlclBsYXllcnNbcGxheWVyLmlkXSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYocGxheWVyLnRlYW0gPT09IHRoaXMubWFpblBsYXllci5nZXRUZWFtKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlclBsYXllcnNbcGxheWVyLmlkXSA9IG5ldyBQbGF5ZXIoZ2FtZVJlbmRlcmVyLCBwbGF5ZXIuaWQsIHBsYXllci50ZWFtLCBDb25maWcuQ09MT1JfRlJJRU5EKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm90aGVyUGxheWVyc1twbGF5ZXIuaWRdID0gbmV3IFBsYXllcihnYW1lUmVuZGVyZXIsIHBsYXllci5pZCwgcGxheWVyLnRlYW0sIENvbmZpZy5DT0xPUl9GT0UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm90aGVyUGxheWVyc1twbGF5ZXIuaWRdLnNldFBvc2l0aW9uKG5ldyBWZWN0b3IyRChwbGF5ZXIucGh5c1Byb3BzLnBvc2l0aW9uLngsIHBsYXllci5waHlzUHJvcHMucG9zaXRpb24ueSkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm90aGVyUGxheWVyc1twbGF5ZXIuaWRdLnBsYXllclVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IoaWQgaW4gdGhpcy5vdGhlclBsYXllcnMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYoIXRoaXMub3RoZXJQbGF5ZXJzW2lkXS5wbGF5ZXJVcGRhdGVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlclBsYXllcnNbaWRdLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMub3RoZXJQbGF5ZXJzW2lkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLmNvbW11bmljYXRpb25NYW5hZ2VyLm9uKFwicmVzb3VyY2UgcGlja3VwXCIsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZihkYXRhLnBsYXllciA9PT0gdGhpcy5tYWluUGxheWVyLmdldElkKCkpXG4gICAgICAgICAgICAgICAgdGhpcy5tYWluUGxheWVyLnNldEl0ZW0oZGF0YS5yZXNvdXJjZSk7XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaSBpbiB0aGlzLm90aGVyUGxheWVycylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEucGxheWVyID09PSB0aGlzLm90aGVyUGxheWVyc1tpXS5nZXRJZCgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlclBsYXllcnNbaV0oZGF0YS5vdGhlclBsYXllcnNbaV0ucmVzb3VyY2VzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHVwZGF0ZShkZWx0YSlcbiAgICB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNvbW11bmljYXRpb25NYW5hZ2VyLnNlbmRFdmVudCgncGxheWVyIGlucHV0Jywge1xuICAgICAgICAgICAgXCJpbnB1dFwiIDoge1xuICAgICAgICAgICAgICAgIFwibW91c2VQb3NpdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwieFwiOiBDYW1lcmEuZ2V0Q2FtZXJhUG9zaXRpb24oKS54ICsgdGhpcy5tYWluUGxheWVySW5wdXQuZ2V0TW91c2VYKCkgLSBDb25maWcuU1RBR0VfV0lEVEgvMixcbiAgICAgICAgICAgICAgICAgICAgXCJ5XCI6IENhbWVyYS5nZXRDYW1lcmFQb3NpdGlvbigpLnkgKyB0aGlzLm1haW5QbGF5ZXJJbnB1dC5nZXRNb3VzZVkoKSAtIENvbmZpZy5TVEFHRV9IRUlHSFQvMlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJpc0xlZnRCdXR0b25QcmVzc2VkXCI6IHRoaXMubWFpblBsYXllcklucHV0LmlzTW91c2VCdXR0b25QcmVzc2VkKElucHV0Lk1vdXNlQnV0dG9ucy5MRUZUKSxcbiAgICAgICAgICAgICAgICBcImlzUmlnaHRCdXR0b25QcmVzc2VkXCI6IHRoaXMubWFpblBsYXllcklucHV0LmlzTW91c2VCdXR0b25QcmVzc2VkKElucHV0Lk1vdXNlQnV0dG9ucy5SSUdIVClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYodGhpcy5tYWluUGxheWVyKXtcbiAgICAgICAgICAgIHRoaXMubWFpblBsYXllci51cGRhdGUoZGVsdGEpO1xuICAgICAgICB9XG4gICAgICAgIGZvcih2YXIgaWQgaW4gdGhpcy5vdGhlclBsYXllcnMpe1xuICAgICAgICAgICAgdGhpcy5vdGhlclBsYXllcnNbaWRdLnVwZGF0ZShkZWx0YSk7XG4gICAgICAgIH1cbiAgICAgICAgIFxuICAgIH1cbiAgICBcblxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXJNYW5hZ2VyOyIsImltcG9ydCBBc3NldExvYWRlciBmcm9tIFwiLi4vdXRpbHMvQXNzZXRMb2FkZXJcIjtcbmltcG9ydCBHYW1lUmVuZGVyZXIgZnJvbSBcIi4uL3V0aWxzL1JlbmRlcmVyXCI7XG5pbXBvcnQgUElfMiA9IFBJWEkuUElfMjtcbmltcG9ydCBWZWN0b3IyRCBmcm9tIFwiLi4vdXRpbHMvVmVjdG9yMkRcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvVXRpbHNcIjtcbmltcG9ydCBQYXJ0aWNsZUVtaXR0ZXIgZnJvbSBcIi4uL3BsYXllci9QYXJ0aWNsZUVtaXR0ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjb3VyY2V7XG5cbiAgICBwcml2YXRlIHJlY291cmNlU3ByaXRlIDogUElYSS5TcHJpdGU7XG4gICAgcHJpdmF0ZSBiYXNlVGV4dHVyZSA6IFBJWEkuQmFzZVRleHR1cmU7XG4gICAgcHJpdmF0ZSBvZmZzZXQgOiBWZWN0b3IyRDtcblxuICAgIHByaXZhdGUgcGFydGljbGVFbWl0dGVyIDogUGFydGljbGVFbWl0dGVyO1xuICAgIHByaXZhdGUgcG9zIDogVmVjdG9yMkQ7XG4gICAgcHJpdmF0ZSBnYW1lUmVuZGVyZXIgOiBHYW1lUmVuZGVyZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihyZW5kZXJlcjogR2FtZVJlbmRlcmVyLCBwb3MgOiBWZWN0b3IyRCwgdHlwZSA6IHN0cmluZyl7XG4gICAgICAgIHZhciBlbGVtZW50IDogSFRNTEltYWdlRWxlbWVudCA9IDxIVE1MSW1hZ2VFbGVtZW50PiBBc3NldExvYWRlci5nZXRDb250ZW50KHR5cGUpO1xuICAgICAgICB0aGlzLmJhc2VUZXh0dXJlID0gbmV3IFBJWEkuQmFzZVRleHR1cmUoZWxlbWVudCk7XG4gICAgICAgIHRoaXMucmVjb3VyY2VTcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUobmV3IFBJWEkuVGV4dHVyZSh0aGlzLmJhc2VUZXh0dXJlKSk7XG4gICAgICAgIHRoaXMub2Zmc2V0ID0gbmV3IFZlY3RvcjJEKHRoaXMucmVjb3VyY2VTcHJpdGUud2lkdGggLyAyICwgdGhpcy5yZWNvdXJjZVNwcml0ZS5oZWlnaHQgLyAyICk7XG4gICAgICAgIHRoaXMucG9zID0gcG9zO1xuICAgICAgICB0aGlzLnJlY291cmNlU3ByaXRlLnRpbnQgPSAweDhiMWM2MjtcblxuICAgICAgICBVdGlscy5zZXRTcHJpdGVWaWV3cG9ydFBvcyh0aGlzLnJlY291cmNlU3ByaXRlLCBuZXcgVmVjdG9yMkQodGhpcy5wb3MueCAtIHRoaXMub2Zmc2V0LngsIHRoaXMucG9zLnkgLSB0aGlzLm9mZnNldC55KSk7XG5cblxuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlciA9IHJlbmRlcmVyO1xuXG4gICAgICAgIHRoaXMucGFydGljbGVFbWl0dGVyID0gbmV3IFBhcnRpY2xlRW1pdHRlcih0aGlzLmdhbWVSZW5kZXJlciwgdGhpcy5wb3MsIHRydWUsIHR5cGUsIDgwMCwgNSwgMjApO1xuXG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyLmFkZFRvTWFpbkNvbnRhaW5lcih0aGlzLnJlY291cmNlU3ByaXRlKTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIGRlc3Ryb3koKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMucGFydGljbGVFbWl0dGVyLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHVwZGF0ZShkZWx0YSA6IG51bWJlcil7XG4gICAgICAgIFV0aWxzLnNldFNwcml0ZVZpZXdwb3J0UG9zKHRoaXMucmVjb3VyY2VTcHJpdGUsIG5ldyBWZWN0b3IyRCh0aGlzLnBvcy54IC0gdGhpcy5vZmZzZXQueCwgdGhpcy5wb3MueSAtIHRoaXMub2Zmc2V0LnkpKTtcbiAgICAgICAgdGhpcy5nYW1lUmVuZGVyZXIucmVtb3ZlRnJvbU1haW5Db250YWluZXIodGhpcy5yZWNvdXJjZVNwcml0ZSk7XG4gICAgICAgIHRoaXMucGFydGljbGVFbWl0dGVyLnVwZGF0ZSh0aGlzLnBhcnRpY2xlRW1pdHRlci5nZXRQb3NpdGlvbigpLCBkZWx0YSk7XG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyLmFkZFRvTWFpbkNvbnRhaW5lcih0aGlzLnJlY291cmNlU3ByaXRlKTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIGdldFBvc2l0aW9uKCkgOiBWZWN0b3IyRFxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zO1xuICAgIH1cblxufSIsImltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiLi4vdXRpbHMvTG9nZ2VyXCI7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vcGxheWVyL1BsYXllclwiO1xuaW1wb3J0IENvbW11bmljYXRpb25NYW5hZ2VyIGZyb20gXCIuLi9jb21tdW5pY2F0aW9uL0NvbW11bmljYXRpb25NYW5hZ2VyXCI7XG5pbXBvcnQgR2FtZVJlbmRlcmVyIGZyb20gXCIuLi91dGlscy9SZW5kZXJlclwiO1xuaW1wb3J0IENhbWVyYSBmcm9tIFwiLi4vdXRpbHMvQ2FtZXJhXCI7XG5pbXBvcnQge0lucHV0fSBmcm9tIFwiLi4vdXRpbHMvSW5wdXRcIjtcbmltcG9ydCBWZWN0b3IyRCBmcm9tIFwiLi4vdXRpbHMvVmVjdG9yMkRcIjtcbmltcG9ydCBSZXNvdXJjZSBmcm9tIFwiLi9SZXNvdXJjZVwiO1xuXG52YXIgbG9nID0gTG9nZ2VyKFwiQ29tbXVuaWNhdGlvbk1hbmFnZXJcIik7XG5cbmNsYXNzIFJlc291cmNlTWFuYWdlciB7XG5cbiAgICBwcm90ZWN0ZWQgY29tbXVuaWNhdGlvbk1hbmFnZXIgOiBDb21tdW5pY2F0aW9uTWFuYWdlcjtcbiAgICBwcm90ZWN0ZWQgZ2FtZVJlbmRlcmVyIDogR2FtZVJlbmRlcmVyO1xuXG4gICAgcHJvdGVjdGVkIHJlc291cmNlcyA6IFJlc291cmNlW107XG5cbiAgICBcbiAgICBjb25zdHJ1Y3Rvcihjb21tdW5pY2F0aW9uTWFuYWdlciA6IENvbW11bmljYXRpb25NYW5hZ2VyLCBnYW1lUmVuZGVyZXI6IEdhbWVSZW5kZXJlcilcbiAgICB7XG4gICAgICAgIHRoaXMuY29tbXVuaWNhdGlvbk1hbmFnZXIgPSBjb21tdW5pY2F0aW9uTWFuYWdlcjtcbiAgICAgICAgdGhpcy5nYW1lUmVuZGVyZXIgPSBnYW1lUmVuZGVyZXI7XG4gICAgICAgIHRoaXMuY29tbXVuaWNhdGlvbk1hbmFnZXIub24oJ21hdGNoIGRhdGEnLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLnJlc291cmNlcykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBkYXRhLm1hdGNoLnJlc291cmNlcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlc1tpXSA9IG5ldyBSZXNvdXJjZSh0aGlzLmdhbWVSZW5kZXJlciwgZGF0YS5tYXRjaC5yZXNvdXJjZXNbaV0ucG9zaXRpb24sIGRhdGEubWF0Y2gucmVzb3VyY2VzW2ldLnR5cGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLmNvbW11bmljYXRpb25NYW5hZ2VyLm9uKCdyZXNvdXJjZXMgY2hhbmdlZCcsIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgZm9yKHZhciBpIGluIHRoaXMucmVzb3VyY2VzKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzW2ldLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKHZhciBpIGluIGRhdGEucmVzb3VyY2VzKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzW2ldID0gbmV3IFJlc291cmNlKHRoaXMuZ2FtZVJlbmRlcmVyLCBkYXRhLnJlc291cmNlc1tpXS5wb3NpdGlvbiwgZGF0YS5yZXNvdXJjZXNbaV0udHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgXG4gICAgcHVibGljIHVwZGF0ZShkZWx0YSlcbiAgICB7XG4gICAgICAgIGZvcih2YXIgaSBpbiB0aGlzLnJlc291cmNlcylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXNbaV0udXBkYXRlKGRlbHRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc291cmNlTWFuYWdlcjtcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9saWJzc3JjL2pxdWVyeS0yLjEuNC5kLnRzXCIgLz5cbmltcG9ydCBHYW1lIGZyb20gXCIuL2dhbWVcIjtcbmltcG9ydCBBc3NldExvYWRlciBmcm9tIFwiLi91dGlscy9Bc3NldExvYWRlclwiO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbihldmVudCkge1xuICAgIEFzc2V0TG9hZGVyLm9uQ29udGVudExvYWRlZChmdW5jdGlvbigpXG4gICAge1xuICAgICAgICB2YXIgZ2FtZSA6IEdhbWUgPSBuZXcgR2FtZSgpLFxuICAgICAgICAgICAgbGFzdFRpbWUgOiBudW1iZXIgPSAwLFxuICAgICAgICAgICAgZGVsdGEgOiBudW1iZXI7XG5cbiAgICAgICAgZnVuY3Rpb24gbWFpbkxvb3AodGltZSA6IG51bWJlcikge1xuXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBtYWluTG9vcCApO1xuICAgICAgICAgICAgZGVsdGEgPSB0aW1lIC0gbGFzdFRpbWU7XG4gICAgICAgICAgICBnYW1lLnVwZGF0ZShkZWx0YSk7XG4gICAgICAgICAgICBnYW1lLnJlbmRlcigpO1xuICAgICAgICAgICAgbGFzdFRpbWUgPSB0aW1lO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIG1haW5Mb29wICk7XG4gICAgfSk7XG59KTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbGlic3NyYy9jcmVhdGVqcy1saWIuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbGlic3NyYy9wcmVsb2FkanMuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbGlic3NyYy9zb3VuZGpzLmQudHNcIiAvPlxuaW1wb3J0IHtMb2dnZXJ9IGZyb20gXCIuLi91dGlscy9Mb2dnZXJcIjtcblxudmFyIGFzc2V0cyA6IGFueSA9IFtcbiAgICAgICAge3NyYzpcImFzc2V0cy9pbWcvdGVzdC5wbmdcIiwgaWQ6XCJUZXN0SW1hZ2VcIn0sXG4gICAgICAgIHtzcmM6XCJhc3NldHMvaW1nL3BhcnRpY2xlLnBuZ1wiLCBpZDpcIm5vbmVcIn0sXG4gICAgICAgIHtzcmM6XCJhc3NldHMvaW1nL3RyaWFuZ2xlLnBuZ1wiLCBpZDpcIlRyaWFuZ2xlXCJ9LFxuICAgICAgICB7c3JjOlwiYXNzZXRzL2ltZy9wZW50YWdvbi5wbmdcIiwgaWQ6XCJQZW50YWdvblwifSxcbiAgICAgICAge3NyYzpcImFzc2V0cy9pbWcvc3F1YXJlLnBuZ1wiLCBpZDpcIlNxdWFyZVwifSxcbiAgICAgICAge3NyYzpcImFzc2V0cy9hdWRpby90ZXN0LndhdlwiLCBpZDpcIlRlc3RTb3VuZFwifSxcbiAgICAgICAge3NyYzpcImFzc2V0cy9pbWcvdGVzdFBsYXllci5wbmdcIiwgaWQ6XCJUZXN0UGxheWVyXCJ9LFxuICAgICAgICB7c3JjOlwiYXNzZXRzL2ltZy90aWxlc2V0LnBuZ1wiLCBpZDpcInRpbGVzZXRcIn0sXG4gICAgICAgIHtzcmM6XCJhc3NldHMvaW1nL2NyYWZ0aW5nYXJlYS5wbmdcIiwgaWQ6XCJDcmFmdGluZ0FyZWFcIn0sXG4gICAgXSwgbG9nID0gTG9nZ2VyKFwiQXNzZXRMb2FkZXJcIik7XG5cbmNsYXNzIEFzc2V0TG9hZGVyXG57XG4gICAgcHJpdmF0ZSBhc3NldE1hbmlmZXN0IDogYW55O1xuICAgIHByaXZhdGUgYXNzZXRRdWV1ZSA6IGNyZWF0ZWpzLkxvYWRRdWV1ZTtcbiAgICBwcml2YXRlIGxvYWRlZENhbGxiYWNrcyA6IEFycmF5PCgpID0+IHZvaWQ+O1xuXG4gICAgY29uc3RydWN0b3IobWFuaWZlc3QgOiBhbnkpXG4gICAge1xuICAgICAgICBsb2cudHJhY2UoXCJJbml0aWFsaXppbmdcIik7XG4gICAgICAgIHRoaXMuYXNzZXRNYW5pZmVzdCA9IG1hbmlmZXN0O1xuICAgICAgICB0aGlzLmFzc2V0UXVldWUgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlKHRydWUpO1xuICAgICAgICB0aGlzLmxvYWRlZENhbGxiYWNrcyA9IFtdO1xuICAgICAgICB0aGlzLmxvYWRDb250ZW50KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkQ29udGVudCgpIHtcbiAgICAgICAgbG9nLnRyYWNlKFwiTG9hZGluZyBjb250ZW50LlwiKTtcbiAgICAgICAgY3JlYXRlanMuU291bmQuYWx0ZXJuYXRlRXh0ZW5zaW9ucyA9IFtcIm1wM1wiXTtcbiAgICAgICAgdGhpcy5hc3NldFF1ZXVlLmluc3RhbGxQbHVnaW4oKCkgPT4ge3JldHVybiBjcmVhdGVqcy5Tb3VuZH0pO1xuICAgICAgICB0aGlzLmFzc2V0UXVldWUub24oXCJjb21wbGV0ZVwiLCB0aGlzLmxvYWRDb21wbGV0ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5hc3NldFF1ZXVlLm9uKFwiZXJyb3JcIiwgdGhpcy5sb2FkRXJyb3IpO1xuICAgICAgICB0aGlzLmFzc2V0UXVldWUubG9hZE1hbmlmZXN0KGFzc2V0cyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkRXJyb3IoZXZlbnQgOiBhbnkpIHtcbiAgICAgICAgbG9nLmVycm9yKFwiVGhlcmUgd2FzIGFuIGVycm9yIHdoaWxlIGxvYWRpbmcgYXNzZXRzOlwiKTtcbiAgICAgICAgbG9nLmVycm9yKGV2ZW50KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRDb21wbGV0ZShldmVudCA6IGFueSkge1xuICAgICAgICBsb2cudHJhY2UoXCJDb21wbGV0ZWQgTG9hZGluZyBhc3NldHMuXCIpO1xuICAgICAgICB0aGlzLmV4ZWN1dGVDYWxsYmFja3MoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q29udGVudChpZCA6IHN0cmluZylcbiAgICB7XG4gICAgICAgIGxvZy50cmFjZShcIkdldHRpbmcgY29udGVudCB3aXRoIGlkXFxcIlwiK2lkK1wiXFxcIlwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXRRdWV1ZS5nZXRSZXN1bHQoaWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXhlY3V0ZUNhbGxiYWNrcygpe1xuICAgICAgICBsb2cudHJhY2UoXCJFeGVjdXRpbmcgb25Mb2FkIGNhbGxiYWNrcy5cIik7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxvYWRlZENhbGxiYWNrcy5sZW5ndGg7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5sb2FkZWRDYWxsYmFja3NbaV0oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvbkNvbnRlbnRMb2FkZWQoY2FsbGJhY2sgOiAoKSA9PiB2b2lkKVxuICAgIHtcbiAgICAgICAgbG9nLnRyYWNlKFwiUmVnaXN0ZXJpbmcgb25Mb2FkIGNhbGxiYWNrLlwiKTtcbiAgICAgICAgaWYodGhpcy5hc3NldFF1ZXVlLmxvYWRlZCkgY2FsbGJhY2soKTtcbiAgICAgICAgZWxzZSB0aGlzLmxvYWRlZENhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBBc3NldExvYWRlcihhc3NldHMpOyIsImltcG9ydCB7Q29uZmlnfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgVmVjdG9yMkQgZnJvbSBcIi4vVmVjdG9yMkRcIjtcblxuY2xhc3MgQ2FtZXJhXG57XG4gICAgcHJpdmF0ZSBwb3NpdGlvbiA6IFZlY3RvcjJEO1xuXG4gICAgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IyRCgwLDApO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDYW1lcmFQb3NpdGlvbihwb3MgOiBWZWN0b3IyRClcbiAgICB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NcbiAgICB9XG4gICAgXG4gICAgcHVibGljIGdldENhbWVyYVBvc2l0aW9uKCkgOiBWZWN0b3IyRFxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb247XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXRWaWV3UG9ydENvb3JkaW5hdGVzKG1hcENvb3JkaW5hdGVzIDogVmVjdG9yMkQpXG4gICAge1xuICAgICAgICB2YXIgbmV3UG9zaXRpb24gPSBWZWN0b3IyRC5zdWJWZWMobWFwQ29vcmRpbmF0ZXMsIHRoaXMucG9zaXRpb24pO1xuXG4gICAgICAgIG5ld1Bvc2l0aW9uLmFkZChuZXcgVmVjdG9yMkQoQ29uZmlnLlNUQUdFX1dJRFRILzIsIENvbmZpZy5TVEFHRV9IRUlHSFQvMikpO1xuXG4gICAgICAgIHJldHVybiBuZXdQb3NpdGlvbjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDYW1lcmEoKTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbGlic3NyYy9qcXVlcnktMi4xLjQuZC50c1wiIC8+XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSBcIi4uL3V0aWxzL0xvZ2dlclwiO1xuXG5leHBvcnQgbW9kdWxlIElucHV0XG57XG4gICAgLy9EZWZpbmUgYWxsIGJ1dHRvbnMvYWN0aW9ucyB3aGljaCBhcmUgcG9zc2libGUgaGVyZVxuICAgIGV4cG9ydCBlbnVtIEJ1dHRvbnN7XG4gICAgICAgIEpVTVAsXG4gICAgICAgIExFRlQsXG4gICAgICAgIFJJR0hULFxuICAgICAgICBVUCxcbiAgICAgICAgRE9XTlxuICAgIH1cblxuICAgIGV4cG9ydCBlbnVtIE1vdXNlQnV0dG9uc3tcbiAgICAgICAgTEVGVCA9IDEsXG4gICAgICAgIFJJR0hUID0gMyxcbiAgICAgICAgTUlERExFID0gMlxuICAgIH1cblxuXG4gICAgLy9EZWZpbmUgYWRkaXRpb25hbCBpbnB1dCwgd2hpY2ggaXMgbm90IG1hcHBlZCB0byB0aGUga2V5Ym9hcmQgaGVyZVxuICAgIGV4cG9ydCBlbnVtIEN1c3RvbUlucHV0e1xuICAgICAgICBYX0FYSVMsXG4gICAgICAgIFlfQVhJUyxcbiAgICAgICAgTEVGVF9DTElDSyxcbiAgICAgICAgUklHSFRfQ0xJQ0ssXG4gICAgICAgIE1JRERMRV9DTElDS1xuICAgIH1cblxuICAgIC8vQWN0dWFsIHBsYXllciBpbnB1dC4gVXNlIHRoaXMgdG8gY3JlYXRlIGtleSBiaW5kaW5ncyBmb3IgbXVsdGlwbGUgcGxheWVycy5cbiAgICBleHBvcnQgY2xhc3MgUGxheWVySW5wdXRcbiAgICB7XG4gICAgICAgIHByb3RlY3RlZCBrZXlCaW5kaW5ncyA6IHtbaWQ6IG51bWJlcl0gOiBudW1iZXI7fVxuICAgICAgICBwcm90ZWN0ZWQga2V5UHJlc3NlZE1hcCA6IHtbaWQ6IG51bWJlcl0gOiBudW1iZXI7fVxuICAgICAgICBwcm90ZWN0ZWQgbW91c2VLZXlQcmVzc2VkTWFwIDoge1tpZDogbnVtYmVyXSA6IG51bWJlcjt9XG4gICAgICAgIHByb3RlY3RlZCBjdXN0b21CaW5kaW5ncyA6IHtbaWQ6IG51bWJlcl0gOiAoKSA9PiBudW1iZXI7fVxuICAgICAgICBwcm90ZWN0ZWQgeEF4aXNDYWxsYmFjayA6ICgpID0+IG51bWJlcjtcbiAgICAgICAgcHJvdGVjdGVkIHlBeGlzQ2FsbGJhY2sgOiAoKSA9PiBudW1iZXI7XG4gICAgICAgIHByb3RlY3RlZCBtb3VzZVggOiBudW1iZXI7XG4gICAgICAgIHByb3RlY3RlZCBtb3VzZVkgOiBudW1iZXI7XG5cbiAgICAgICAgY29uc3RydWN0b3IoKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgJGRvY3VtZW50IDogSlF1ZXJ5ID0gJChkb2N1bWVudCk7XG4gICAgICAgICAgICAkZG9jdW1lbnQua2V5ZG93bih0aGlzLm9uS2V5RG93bi5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICRkb2N1bWVudC5rZXl1cCh0aGlzLm9uS2V5VXAuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkZG9jdW1lbnQubW91c2Vkb3duKHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkZG9jdW1lbnQubW91c2V1cCh0aGlzLm9uTW91c2VVcC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMua2V5QmluZGluZ3MgPSB7fTtcbiAgICAgICAgICAgIHRoaXMua2V5UHJlc3NlZE1hcCA9IHt9O1xuICAgICAgICAgICAgdGhpcy5tb3VzZUtleVByZXNzZWRNYXAgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tQmluZGluZ3MgPSB7fTtcblxuICAgICAgICAgICAgLy9tb3VzZSBtb3ZlbWVudFxuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ21vdXNlbW92ZScsZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZVggPSBlLnBhZ2VYO1xuICAgICAgICAgICAgICAgIHRoaXMubW91c2VZID0gZS5wYWdlWTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIC8vU2V0dGluZyBzb21lIHN0YW5kYXJkIGNhbGxiYWNrIGZ1bmN0aW9ucyBmb3IgeCBhbmQgeSBheGlzXG4gICAgICAgICAgICB0aGlzLnhBeGlzQ2FsbGJhY2sgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuaXNCdXR0b25QcmVzc2VkKEJ1dHRvbnMuTEVGVCkpIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzQnV0dG9uUHJlc3NlZChCdXR0b25zLlJJR0hUKSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnlBeGlzQ2FsbGJhY2sgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuaXNCdXR0b25QcmVzc2VkKEJ1dHRvbnMuVVApKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5pc0J1dHRvblByZXNzZWQoQnV0dG9ucy5ET1dOKSkgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0S2V5Ym9hcmRCaW5kaW5nKGJ1dHRvbiA6IEJ1dHRvbnMsIGtleSA6IG51bWJlcilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5rZXlCaW5kaW5nc1tidXR0b25dID0ga2V5O1xuICAgICAgICAgICAgdGhpcy5rZXlQcmVzc2VkTWFwW2tleV0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldEN1c3RvbUJpbmRpbmcoaW5wdXROYW1lIDogQ3VzdG9tSW5wdXQsIGN1cnJlbnRWYWx1ZUZ1bmN0aW9uIDogKCkgPT4gbnVtYmVyIClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5jdXN0b21CaW5kaW5nc1tpbnB1dE5hbWVdID0gY3VycmVudFZhbHVlRnVuY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0WEF4aXNDYWxsYmFjayhjYWxsYmFjayA6ICgpID0+IG51bWJlcilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy54QXhpc0NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgc2V0WUF4aXNDYWxsYmFjayhjYWxsYmFjayA6ICgpID0+IG51bWJlcilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy55QXhpc0NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0WEF4aXMoKSA6IG51bWJlclxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54QXhpc0NhbGxiYWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0WUF4aXMoKSA6IG51bWJlclxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy55QXhpc0NhbGxiYWNrKCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHB1YmxpYyBnZXRNb3VzZVgoKSA6IG51bWJlclxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tb3VzZVg7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0TW91c2VZKCkgOiBudW1iZXJcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubW91c2VZO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdpbGwgcmV0dXJuIHRydWUgaWYgQnV0dG9uIGlzIGJlaW5nIHByZXNzZWQgYXQgdGhlIHRpbWUgb2YgdGhpcyBmdW5jdGlvbiBjYWxsLlxuICAgICAgICAgKiBAcGFyYW0gYnV0dG9uXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGlzQnV0dG9uUHJlc3NlZChidXR0b24gOiBCdXR0b25zKSA6IGJvb2xlYW5cbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMua2V5UHJlc3NlZE1hcFt0aGlzLmtleUJpbmRpbmdzW2J1dHRvbl1dID09PSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGlzTW91c2VCdXR0b25QcmVzc2VkKGJ1dHRvbiA6IE1vdXNlQnV0dG9ucykgOiBib29sZWFuXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vdXNlS2V5UHJlc3NlZE1hcFtidXR0b25dID09PSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldEN1c3RvbUlucHV0VmFsdWUoaW5wdXROYW1lIDogQ3VzdG9tSW5wdXQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1c3RvbUJpbmRpbmdzW2lucHV0TmFtZV0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBvbktleURvd24oZSA6IGFueSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGtleUNvZGUgPSBlLndoaWNoO1xuICAgICAgICAgICAgdGhpcy5rZXlQcmVzc2VkTWFwW2tleUNvZGVdID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBvbktleVVwKGUgOiBhbnkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBrZXlDb2RlID0gZS53aGljaDtcbiAgICAgICAgICAgIHRoaXMua2V5UHJlc3NlZE1hcFtrZXlDb2RlXSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgb25Nb3VzZURvd24oZSA6IGFueSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGtleUNvZGUgPSBlLndoaWNoO1xuICAgICAgICAgICAgdGhpcy5tb3VzZUtleVByZXNzZWRNYXBba2V5Q29kZV0gPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIG9uTW91c2VVcChlIDogYW55KVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIga2V5Q29kZSA9IGUud2hpY2g7XG4gICAgICAgICAgICB0aGlzLm1vdXNlS2V5UHJlc3NlZE1hcFtrZXlDb2RlXSA9IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgZW51bSBLZXlDb2Rlc3tcbiAgICAgICAgQkFDS1NQQUNFPSA4LFxuICAgICAgICBUQUI9IDksXG4gICAgICAgIEVOVEVSPSAxMyxcbiAgICAgICAgU0hJRlQ9IDE2LFxuICAgICAgICBDVFJMPSAxNyxcbiAgICAgICAgQUxUPSAxOCxcbiAgICAgICAgUEFVU0U9IDE5LFxuICAgICAgICBDQVBTX0xPQ0s9IDIwLFxuICAgICAgICBFU0NBUEU9IDI3LFxuICAgICAgICBTUEFDRT0gMzIsXG4gICAgICAgIFBBR0VfVVA9IDMzLFxuICAgICAgICBQQUdFX0RPV049IDM0LFxuICAgICAgICBFTkQ9IDM1LFxuICAgICAgICBIT01FPSAzNixcbiAgICAgICAgTEVGVF9BUlJPVz0gMzcsXG4gICAgICAgIFVQX0FSUk9XPSAzOCxcbiAgICAgICAgUklHSFRfQVJST1c9IDM5LFxuICAgICAgICBET1dOX0FSUk9XPSA0MCxcbiAgICAgICAgSU5TRVJUPSA0NSxcbiAgICAgICAgREVMRVRFPSA0NixcbiAgICAgICAgS0VZXzA9IDQ4LFxuICAgICAgICBLRVlfMT0gNDksXG4gICAgICAgIEtFWV8yPSA1MCxcbiAgICAgICAgS0VZXzM9IDUxLFxuICAgICAgICBLRVlfND0gNTIsXG4gICAgICAgIEtFWV81PSA1MyxcbiAgICAgICAgS0VZXzY9IDU0LFxuICAgICAgICBLRVlfNz0gNTUsXG4gICAgICAgIEtFWV84PSA1NixcbiAgICAgICAgS0VZXzk9IDU3LFxuICAgICAgICBBPSA2NSxcbiAgICAgICAgQj0gNjYsXG4gICAgICAgIEM9IDY3LFxuICAgICAgICBEPSA2OCxcbiAgICAgICAgRT0gNjksXG4gICAgICAgIEY9IDcwLFxuICAgICAgICBHPSA3MSxcbiAgICAgICAgSD0gNzIsXG4gICAgICAgIEk9IDczLFxuICAgICAgICBKPSA3NCxcbiAgICAgICAgSz0gNzUsXG4gICAgICAgIEw9IDc2LFxuICAgICAgICBNPSA3NyxcbiAgICAgICAgTj0gNzgsXG4gICAgICAgIE89IDc5LFxuICAgICAgICBQPSA4MCxcbiAgICAgICAgUT0gODEsXG4gICAgICAgIFI9IDgyLFxuICAgICAgICBTPSA4MyxcbiAgICAgICAgVD0gODQsXG4gICAgICAgIFU9IDg1LFxuICAgICAgICBWPSA4NixcbiAgICAgICAgVz0gODcsXG4gICAgICAgIFg9IDg4LFxuICAgICAgICBZPSA4OSxcbiAgICAgICAgWj0gOTAsXG4gICAgICAgIExFRlRfTUVUQT0gOTEsXG4gICAgICAgIFJJR0hUX01FVEE9IDkyLFxuICAgICAgICBTRUxFQ1Q9IDkzLFxuICAgICAgICBOVU1QQURfMD0gOTYsXG4gICAgICAgIE5VTVBBRF8xPSA5NyxcbiAgICAgICAgTlVNUEFEXzI9IDk4LFxuICAgICAgICBOVU1QQURfMz0gOTksXG4gICAgICAgIE5VTVBBRF80PSAxMDAsXG4gICAgICAgIE5VTVBBRF81PSAxMDEsXG4gICAgICAgIE5VTVBBRF82PSAxMDIsXG4gICAgICAgIE5VTVBBRF83PSAxMDMsXG4gICAgICAgIE5VTVBBRF84PSAxMDQsXG4gICAgICAgIE5VTVBBRF85PSAxMDUsXG4gICAgICAgIE1VTFRJUExZPSAxMDYsXG4gICAgICAgIEFERD0gMTA3LFxuICAgICAgICBTVUJUUkFDVD0gMTA5LFxuICAgICAgICBERUNJTUFMPSAxMTAsXG4gICAgICAgIERJVklERT0gMTExLFxuICAgICAgICBGMT0gMTEyLFxuICAgICAgICBGMj0gMTEzLFxuICAgICAgICBGMz0gMTE0LFxuICAgICAgICBGND0gMTE1LFxuICAgICAgICBGNT0gMTE2LFxuICAgICAgICBGNj0gMTE3LFxuICAgICAgICBGNz0gMTE4LFxuICAgICAgICBGOD0gMTE5LFxuICAgICAgICBGOT0gMTIwLFxuICAgICAgICBGMTA9IDEyMSxcbiAgICAgICAgRjExPSAxMjIsXG4gICAgICAgIEYxMj0gMTIzLFxuICAgICAgICBOVU1fTE9DSz0gMTQ0LFxuICAgICAgICBTQ1JPTExfTE9DSz0gMTQ1LFxuICAgICAgICBTRU1JQ09MT049IDE4NixcbiAgICAgICAgRVFVQUxTPSAxODcsXG4gICAgICAgIENPTU1BPSAxODgsXG4gICAgICAgIERBU0g9IDE4OSxcbiAgICAgICAgUEVSSU9EPSAxOTAsXG4gICAgICAgIEZPUldBUkRfU0xBU0g9IDE5MSxcbiAgICAgICAgR1JBVkVfQUNDRU5UPSAxOTIsXG4gICAgICAgIE9QRU5fQlJBQ0tFVD0gMjE5LFxuICAgICAgICBCQUNLX1NMQVNIPSAyMjAsXG4gICAgICAgIENMT1NFX0JSQUNLRVQ9IDIyMSxcbiAgICAgICAgU0lOR0xFX1FVT1RFPSAyMjJcbiAgICB9XG5cblxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9saWJzc3JjL2pzbmxvZy5kLnRzXCIvPlxuXG5pbXBvcnQgSlNOTG9nQ29uc29sZUFwcGVuZGVyID0gSlNOTG9nLkpTTkxvZ0NvbnNvbGVBcHBlbmRlcjtcbmltcG9ydCBKU05Mb2dMb2dnZXIgPSBKU05Mb2cuSlNOTG9nTG9nZ2VyO1xuaW1wb3J0IEpTTkxvZ0FwcGVuZGVyID0gSlNOTG9nLkpTTkxvZ0FwcGVuZGVyO1xuaW1wb3J0IHtDb25maWd9IGZyb20gXCIuLi9jb25maWdcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIExvZ2dlcihsb2dnZXJOYW1lIDogc3RyaW5nKSA6IEpTTkxvZ0xvZ2dlclxue1xuICAgIHZhciBjb25zb2xlQXBwZW5kZXIgOiBKU05Mb2dDb25zb2xlQXBwZW5kZXIgPSBKTC5jcmVhdGVDb25zb2xlQXBwZW5kZXIoXCJDb25zb2xlQXBwZW5kZXJcIik7XG4gICAgdmFyIHNlcnZlckFwcGVuZGVyIDogSlNOTG9nQ29uc29sZUFwcGVuZGVyID0gSkwuY3JlYXRlQWpheEFwcGVuZGVyKFwiQ29uc29sZUFwcGVuZGVyXCIpO1xuICAgIHZhciBhcHBlbmRlcnMgOiBKU05Mb2dBcHBlbmRlcltdID0gW107XG4gICAgaWYoQ29uZmlnLkxPR19UT19DT05TT0xFKSBhcHBlbmRlcnMucHVzaChjb25zb2xlQXBwZW5kZXIpO1xuICAgIGlmKENvbmZpZy5MT0dfVE9fU0VSVkVSKSBhcHBlbmRlcnMucHVzaChzZXJ2ZXJBcHBlbmRlcik7XG4gICAgdmFyIGxvZ2dlciA6IEpTTkxvZ0xvZ2dlciA9IEpMKGxvZ2dlck5hbWUpLnNldE9wdGlvbnMoe1wiYXBwZW5kZXJzXCI6IGFwcGVuZGVycywgbGV2ZWw6IENvbmZpZy5MT0dfTEVWRUx9KTtcblxuICAgIHJldHVybiBsb2dnZXI7XG59XG5cbmV4cG9ydCB2YXIgTG9nIDogSlNOTG9nTG9nZ2VyID0gTG9nZ2VyKENvbmZpZy5BUFBMSUNBVElPTl9OQU1FKTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbGlic3NyYy9waXhpLmpzLmQudHNcIiAvPlxuaW1wb3J0IHtMb2dnZXJ9IGZyb20gXCIuLi91dGlscy9Mb2dnZXJcIjtcbmltcG9ydCB7Q29uZmlnfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5cbnZhciBsb2cgPSBMb2dnZXIoXCJHYW1lUmVuZGVyZXJcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVSZW5kZXJlclxue1xuICAgIHByaXZhdGUgZ2FtZVJlbmRlcmVyIDogUElYSS5TeXN0ZW1SZW5kZXJlcjtcbiAgICBwcml2YXRlIG1haW5Db250YWluZXIgOiBQSVhJLkNvbnRhaW5lcjtcblxuICAgIGNvbnN0cnVjdG9yKClcbiAgICB7XG4gICAgICAgIGxvZy50cmFjZShcIkluaXRpYWxpemluZyBHYW1lciBSZW5kZXJlci5cIik7XG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyID0gUElYSS5hdXRvRGV0ZWN0UmVuZGVyZXIoQ29uZmlnLlNUQUdFX1dJRFRILCBDb25maWcuU1RBR0VfSEVJR0hUKTtcbiAgICAgICAgdGhpcy5nYW1lUmVuZGVyZXIuYmFja2dyb3VuZENvbG9yID0gQ29uZmlnLkJHX0NPTE9SO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZ2FtZVJlbmRlcmVyLnZpZXcpO1xuICAgICAgICB0aGlzLm1haW5Db250YWluZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkVG9NYWluQ29udGFpbmVyKHNwcml0ZSA6IFBJWEkuU3ByaXRlfFBJWEkuQ29udGFpbmVyKVxuICAgIHtcbiAgICAgICAgbG9nLnRyYWNlKFwiQWRkaW5nIHNvbWV0aGluZyB0byBtYWluIGNvbnRhaW5lci5cIik7XG4gICAgICAgIHRoaXMubWFpbkNvbnRhaW5lci5hZGRDaGlsZChzcHJpdGUpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmVGcm9tTWFpbkNvbnRhaW5lcihzcHJpdGUgOiBQSVhJLlNwcml0ZXxQSVhJLkNvbnRhaW5lcilcbiAgICB7XG4gICAgICAgIGxvZy50cmFjZShcIlJlbW92aW5nIHNvbWV0aGluZyBmcm9tIG1haW4gY29udGFpbmVyLlwiKTtcbiAgICAgICAgdGhpcy5tYWluQ29udGFpbmVyLnJlbW92ZUNoaWxkKHNwcml0ZSk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyByZW5kZXIoKVxuICAgIHtcbiAgICAgICAgdGhpcy5nYW1lUmVuZGVyZXIucmVuZGVyKHRoaXMubWFpbkNvbnRhaW5lcik7XG4gICAgfVxuICAgIFxufSIsImltcG9ydCBWZWN0b3IyRCBmcm9tIFwiLi9WZWN0b3IyRFwiO1xuaW1wb3J0IENhbWVyYSBmcm9tIFwiLi9DYW1lcmFcIjtcblxuY2xhc3MgVXRpbHNcbntcbiAgICBwdWJsaWMgc3RhdGljIHNldFNwcml0ZVZpZXdwb3J0UG9zKHNwcml0ZSA6IFBJWEkuU3ByaXRlLCBtYXBQb3NpdGlvbiA6IFZlY3RvcjJEKVxuICAgIHtcbiAgICAgICAgdmFyIG5ld1Bvc2l0aW9uID0gQ2FtZXJhLmdldFZpZXdQb3J0Q29vcmRpbmF0ZXMobWFwUG9zaXRpb24pO1xuICAgICAgICBzcHJpdGUucG9zaXRpb24ueCA9IE1hdGgucm91bmQobmV3UG9zaXRpb24ueCk7XG4gICAgICAgIHNwcml0ZS5wb3NpdGlvbi55ID0gTWF0aC5yb3VuZChuZXdQb3NpdGlvbi55KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGNvbG9yTWFrZUJyaWdodGVyKGNvbG9yIDogbnVtYmVyLCBwZXJjZW50IDogbnVtYmVyKSA6IG51bWJlcntcbiAgICB2YXIgaGV4ID0gY29sb3IudG9TdHJpbmcoMTYpLCBtaXNzaW5nWmVyb2VzID0gMCwgaTtcblxuICAgIG1pc3NpbmdaZXJvZXMgPSA2IC0gaGV4Lmxlbmd0aDtcblxuICAgIGZvcihpID0gMDsgaSA8IG1pc3NpbmdaZXJvZXM7IGkrKylcbiAgICB7XG4gICAgICAgIGhleCA9IFwiMFwiK2hleDtcbiAgICB9XG5cbiAgICB2YXIgciA9IHBhcnNlSW50KGhleC5zdWJzdHIoMCwgMiksIDE2KSxcbiAgICAgICAgZyA9IHBhcnNlSW50KGhleC5zdWJzdHIoMiwgMiksIDE2KSxcbiAgICAgICAgYiA9IHBhcnNlSW50KGhleC5zdWJzdHIoNCwgMiksIDE2KTtcblxuICAgIHJldHVybiBwYXJzZUludCgoKDB8KDE8PDgpICsgciArICgyNTYgLSByKSAqIHBlcmNlbnQgLyAxMDApLnRvU3RyaW5nKDE2KSkuc3Vic3RyKDEpICtcbiAgICAgICAgKCgwfCgxPDw4KSArIGcgKyAoMjU2IC0gZykgKiBwZXJjZW50IC8gMTAwKS50b1N0cmluZygxNikpLnN1YnN0cigxKSArXG4gICAgICAgICgoMHwoMTw8OCkgKyBiICsgKDI1NiAtIGIpICogcGVyY2VudCAvIDEwMCkudG9TdHJpbmcoMTYpKS5zdWJzdHIoMSksIDE2KTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVXRpbHM7IiwiaW1wb3J0IHtMb2dnZXJ9IGZyb20gXCIuLi91dGlscy9Mb2dnZXJcIjtcblxudmFyIGxvZyA9IExvZ2dlcihcIlZlY3RvcjJEXCIpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWZWN0b3IyRFxue1xuICAgIHB1YmxpYyB4IDogbnVtYmVyO1xuICAgIHB1YmxpYyB5IDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoeCA6IG51bWJlciwgeSA6IG51bWJlcilcbiAgICB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBhZGRWZWModjE6IFZlY3RvcjJELCB2MiA6IFZlY3RvcjJEKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyRCh2MS54ICsgdjIueCwgdjEueSArIHYyLnkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgc3ViVmVjKHYxOiBWZWN0b3IyRCwgdjIgOiBWZWN0b3IyRClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMkQodjEueCAtIHYyLngsIHYxLnkgLSB2Mi55KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkKHYgOiBWZWN0b3IyRCkge1xuICAgICAgICB0aGlzLnggKz0gdi54O1xuICAgICAgICB0aGlzLnkgKz0gdi55O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdWIodikge1xuICAgICAgICB0aGlzLnggLT0gdi54O1xuICAgICAgICB0aGlzLnkgLT0gdi55O1xuICAgIH1cblxuICAgIHB1YmxpYyBsZW4oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54KnRoaXMueCArIHRoaXMueSp0aGlzLnkpO1xuICAgIH1cbn0iXX0=
