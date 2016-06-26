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
    Config.COLOR_NEUTRAL = 0xFFFFFF; //0x00ff00;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tbXVuaWNhdGlvbi9Db21tdW5pY2F0aW9uTWFuYWdlci50cyIsInNyYy9jb25maWcudHMiLCJzcmMvZ2FtZS50cyIsInNyYy9tYXAvTWFwLnRzIiwic3JjL21hcC9UeWxlLnRzIiwic3JjL21hdGNoL0NyYWZ0aW5nQXJlYS50cyIsInNyYy9tYXRjaC9NYXRjaE1hbmFnZXIudHMiLCJzcmMvcGxheWVyL1BhcnRpY2xlLnRzIiwic3JjL3BsYXllci9QYXJ0aWNsZUVtaXR0ZXIudHMiLCJzcmMvcGxheWVyL1BsYXllci50cyIsInNyYy9wbGF5ZXIvUGxheWVyTWFuYWdlci50cyIsInNyYy9yZXNvdXJjZXMvUmVzb3VyY2UudHMiLCJzcmMvcmVzb3VyY2VzL1Jlc291cmNlTWFuYWdlci50cyIsInNyYy9zdGFydC50cyIsInNyYy91dGlscy9Bc3NldExvYWRlci50cyIsInNyYy91dGlscy9DYW1lcmEudHMiLCJzcmMvdXRpbHMvSW5wdXQudHMiLCJzcmMvdXRpbHMvTG9nZ2VyLnRzIiwic3JjL3V0aWxzL1JlbmRlcmVyLnRzIiwic3JjL3V0aWxzL1V0aWxzLnRzIiwic3JjL3V0aWxzL1ZlY3RvcjJELnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLDJEQUEyRDtBQUMzRCx1QkFBcUIsaUJBQWlCLENBQUMsQ0FBQTtBQUN2Qyx1QkFBcUIsV0FBVyxDQUFDLENBQUE7QUFFakMsSUFBSSxHQUFHLEdBQUcsZUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFekM7SUFLSTtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQVUsSUFBSTtZQUNwQyxHQUFHLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFFSCx3REFBd0Q7UUFDeEQsSUFBSSxTQUFTLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNyQixJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNoRSxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUV4QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVNLGlDQUFFLEdBQVQsVUFBVSxLQUFjLEVBQUUsUUFBd0I7UUFFOUMsRUFBRSxDQUFBLENBQUMsQ0FBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDL0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVTLDJDQUFZLEdBQXRCLFVBQXVCLEtBQUssRUFBRSxJQUFJO1FBRTlCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQzVDLEVBQUUsQ0FBQSxDQUFDLFNBQVMsQ0FBQyxDQUNiLENBQUM7WUFDRyxHQUFHLENBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUNwQyxDQUFDO2dCQUNHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QixDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCxxQ0FBTSxHQUFOO1FBRUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFVBQVUsSUFBSTtZQUN4QyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFZCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLElBQUk7WUFDOUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFZCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxJQUFJO1lBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVkLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLElBQUk7WUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsSUFBSTtZQUNyQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFZCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxJQUFJO1lBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUMs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bENBLEFBa0NDLElBQUE7QUFsQ0Q7NkJBa0NDLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2xpYnNzcmMvc29ja2V0LmlvLWNsaWVudC5kLnRzXCIvPlxuaW1wb3J0IHtMb2dnZXJ9IGZyb20gXCIuLi91dGlscy9Mb2dnZXJcIjtcbmltcG9ydCB7Q29uZmlnfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5cbnZhciBsb2cgPSBMb2dnZXIoXCJDb21tdW5pY2F0aW9uTWFuYWdlclwiKTtcblxuY2xhc3MgQ29tbXVuaWNhdGlvbk1hbmFnZXIge1xuXG4gICAgcHJvdGVjdGVkIHNvY2tldCA6IFNvY2tldElPQ2xpZW50LlNvY2tldDtcbiAgICBwcm90ZWN0ZWQgZXZlbnRMaXN0ZW5lciA6IHt9O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gaW8uY29ubmVjdChDb25maWcuV1NfRE9NQUlOKTtcbiAgICAgICAgdGhpcy5zb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgbG9nLmluZm8oXCJDb25uZWN0ZWQgdG8gU29ja2V0XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUT0RPOiB0aGlzIG5lZWRzIHRvIGJlIHdpcmVkIHRvIGEgYnV0dG9uIG9yIHNvbWV0aGluZ1xuICAgICAgICB2YXIgcmFuZE5hbWVzID0gW1wiUGV0ZXJcIiwgXCJHw7xudGVyXCIsIFwiSW5nZVwiLCBcIlBldHJhXCIsIFwiQW5uZWxpc2VcIiwgXCJHZXJkXCJdO1xuICAgICAgICB0aGlzLnNvY2tldC5lbWl0KFwiam9pblwiLCB7XG4gICAgICAgICAgICBuYW1lOiByYW5kTmFtZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZE5hbWVzLmxlbmd0aCldXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lciA9IHt9O1xuXG4gICAgICAgIHRoaXMubGlzdGVuKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uKGV2ZW50IDogc3RyaW5nLCBjYWxsYmFjayA6IChhbnkpID0+IHZvaWQpXG4gICAge1xuICAgICAgICBpZighIHRoaXMuZXZlbnRMaXN0ZW5lcltldmVudF0pIHRoaXMuZXZlbnRMaXN0ZW5lcltldmVudF0gPSBbXTtcbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyW2V2ZW50XS5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZXhlY3V0ZUV2ZW50KGV2ZW50LCBkYXRhKVxuICAgIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuZXZlbnRMaXN0ZW5lcltldmVudF0saTtcbiAgICAgICAgaWYoY2FsbGJhY2tzKVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzW2ldKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGlzdGVuKCkge1xuXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwicGxheWVyIGRhdGFcIiwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUV2ZW50KFwicGxheWVyIGRhdGFcIiwgZGF0YSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJvdGhlciBwbGF5ZXIgZGF0YVwiLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlRXZlbnQoXCJvdGhlciBwbGF5ZXIgZGF0YVwiLCBkYXRhKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLnNvY2tldC5vbihcIm1hcCBkYXRhXCIsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVFdmVudChcIm1hcCBkYXRhXCIsIGRhdGEpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwibWF0Y2ggZGF0YVwiLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlRXZlbnQoXCJtYXRjaCBkYXRhXCIsIGRhdGEpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwiZ2FtZSB3b25cIiwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUV2ZW50KFwiZ2FtZSB3b25cIiwgZGF0YSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJnYW1lIHdvblwiLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlRXZlbnQoXCJnYW1lIHdvblwiLCBkYXRhKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLnNvY2tldC5vbihcInJlc291cmNlIHBpY2t1cFwiLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlRXZlbnQoXCJyZXNvdXJjZSBwaWNrdXBcIiwgZGF0YSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJyZXNvdXJjZXMgY2hhbmdlZFwiLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlRXZlbnQoXCJyZXNvdXJjZXMgY2hhbmdlZFwiLCBkYXRhKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VuZEV2ZW50KGV2ZW50IDogc3RyaW5nLCBkYXRhIDogYW55KVxuICAgIHtcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdChldmVudCwgZGF0YSk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbW11bmljYXRpb25NYW5hZ2VyOyIsImV4cG9ydCBlbnVtIExvZ0xldmVse1xuICAgIEFMTCA9IC0yMTQ3NDgzNjQ4LFxuICAgIFRSQUNFID0gMTAwMCxcbiAgICBERUJVRyA9IDIwMDAsXG4gICAgSU5GTyA9IDMwMDAsXG4gICAgV0FSTiA9IDQwMDAsXG4gICAgRVJST1IgPSA1MDAwLFxuICAgIEZBVEFMID0gNjAwMCxcbiAgICBPRkYgPSAyMTQ3NDgzNjQ3XG59XG5cbmV4cG9ydCBjbGFzcyBDb25maWd7XG4gICAgcHVibGljIHN0YXRpYyBBUFBMSUNBVElPTl9OQU1FOiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBzdGF0aWMgREVCVUcgOiBib29sZWFuID0gdHJ1ZTtcbiAgICBwdWJsaWMgc3RhdGljIExPR19MRVZFTCA6IExvZ0xldmVsID0gTG9nTGV2ZWwuREVCVUc7XG4gICAgcHVibGljIHN0YXRpYyBMT0dfVE9fU0VSVkVSOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIHN0YXRpYyBMT0dfVE9fQ09OU09MRTogYm9vbGVhbiA9IHRydWU7XG4gICAgcHVibGljIHN0YXRpYyBTVEFHRV9XSURUSDogbnVtYmVyID0gMTI4MDtcbiAgICBwdWJsaWMgc3RhdGljIFNUQUdFX0hFSUdIVDogbnVtYmVyID0gNzIwO1xuICAgIHB1YmxpYyBzdGF0aWMgQkdfQ09MT1I6IG51bWJlciA9IDB4NjQ5NUVEO1xuICAgIHB1YmxpYyBzdGF0aWMgTUFQX1NJWkVfWDogbnVtYmVyID0gNjQ7XG4gICAgcHVibGljIHN0YXRpYyBNQVBfU0laRV9ZOiBudW1iZXIgPSA2NDtcbiAgICBwdWJsaWMgc3RhdGljIFRJTEVfU0laRV9YOiBudW1iZXIgPSAzMjtcbiAgICBwdWJsaWMgc3RhdGljIFRJTEVfU0laRV9ZOiBudW1iZXIgPSAzMjtcbiAgIC8vIHB1YmxpYyBzdGF0aWMgV1NfRE9NQUlOOiBzdHJpbmcgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAwJztcbiAgICBwdWJsaWMgc3RhdGljIENPTE9SX0ZSSUVORCA6IG51bWJlciA9IDB4MDAwMDhiOy8vMHgwMDAwZmY7XG4gICAgcHVibGljIHN0YXRpYyBDT0xPUl9GT0UgOiBudW1iZXIgPSAweDhiMDAwMDsvLzB4ZmYwMDAwO1xuICAgIHB1YmxpYyBzdGF0aWMgQ09MT1JfTUUgOiBudW1iZXIgPSAweDAwOGIwMC8vMHgwMGZmMDA7XG4gICAgcHVibGljIHN0YXRpYyBDT0xPUl9ORVVUUkFMIDogbnVtYmVyID0gMHhGRkZGRkYvLzB4MDBmZjAwO1xuICAgIHB1YmxpYyBzdGF0aWMgV1NfRE9NQUlOOiBzdHJpbmcgPSAnaHR0cDovL2dhbWVqYW0uZ3JpbW1iYXJ0Lm9yZzo2MTY5Mic7XG5cblxufSIsImltcG9ydCBHYW1lUmVuZGVyZXIgZnJvbSBcIi4vdXRpbHMvUmVuZGVyZXJcIjtcbmltcG9ydCBBc3NldExvYWRlciBmcm9tIFwiLi91dGlscy9Bc3NldExvYWRlclwiO1xuaW1wb3J0IENvbW11bmljYXRpb25NYW5hZ2VyIGZyb20gXCIuL2NvbW11bmljYXRpb24vQ29tbXVuaWNhdGlvbk1hbmFnZXJcIjtcbmltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiLi91dGlscy9Mb2dnZXJcIjtcbmltcG9ydCB7SW5wdXR9IGZyb20gXCIuL3V0aWxzL0lucHV0XCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllci9QbGF5ZXJcIjtcbmltcG9ydCBDYW1lcmEgZnJvbSBcIi4vdXRpbHMvQ2FtZXJhXCI7XG5pbXBvcnQgTWFwIGZyb20gXCIuL21hcC9NYXBcIjtcbmltcG9ydCBQbGF5ZXJNYW5hZ2VyIGZyb20gXCIuL3BsYXllci9QbGF5ZXJNYW5hZ2VyXCI7XG5pbXBvcnQgVmVjdG9yMkQgZnJvbSBcIi4vdXRpbHMvVmVjdG9yMkRcIjtcbmltcG9ydCBNYXRjaE1hbmFnZXIgZnJvbSBcIi4vbWF0Y2gvTWF0Y2hNYW5hZ2VyXCI7XG5pbXBvcnQgUmVjb3VyY2VNYW5hZ2VyIGZyb20gXCIuL3Jlc291cmNlcy9SZXNvdXJjZU1hbmFnZXJcIlxuXG52YXIgbG9nID0gTG9nZ2VyKFwiR2FtZVwiKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZVxue1xuICAgIHByaXZhdGUgZ2FtZVJlbmRlcmVyIDogR2FtZVJlbmRlcmVyO1xuICAgIHByaXZhdGUgaW5wdXRNYW5hZ2VyIDogSW5wdXQuUGxheWVySW5wdXQ7XG4gICAgcHJpdmF0ZSBwbGF5ZXIgOiBQbGF5ZXI7XG4gICAgcHJpdmF0ZSBtYXAgOiBNYXA7XG4gICAgcHJpdmF0ZSBjb21tdW5pY2F0aW9uTWFuYWdlciA6IENvbW11bmljYXRpb25NYW5hZ2VyO1xuICAgIHByaXZhdGUgbWF0Y2hNYW5hZ2VyIDogTWF0Y2hNYW5hZ2VyO1xuICAgIHByaXZhdGUgcGxheWVyTWFuYWdlciA6IFBsYXllck1hbmFnZXI7XG4gICAgcHJpdmF0ZSByZWNvdXJjZU1hbmFnZXIgOiBSZWNvdXJjZU1hbmFnZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpXG4gICAge1xuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlciA9IG5ldyBHYW1lUmVuZGVyZXIoKTtcblxuICAgICAgICB0aGlzLmlucHV0TWFuYWdlciA9IG5ldyBJbnB1dC5QbGF5ZXJJbnB1dCgpO1xuXG4gICAgICAgIHRoaXMubWFwID0gbmV3IE1hcCh0aGlzLmdhbWVSZW5kZXJlciwgbnVsbCk7XG5cbiAgICAgICAgdGhpcy5jb21tdW5pY2F0aW9uTWFuYWdlciA9IG5ldyBDb21tdW5pY2F0aW9uTWFuYWdlcigpO1xuXG4gICAgICAgIHRoaXMubWF0Y2hNYW5hZ2VyID0gbmV3IE1hdGNoTWFuYWdlcih0aGlzLmNvbW11bmljYXRpb25NYW5hZ2VyLCB0aGlzLmdhbWVSZW5kZXJlcik7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJNYW5hZ2VyID0gbmV3IFBsYXllck1hbmFnZXIodGhpcy5jb21tdW5pY2F0aW9uTWFuYWdlciwgdGhpcy5nYW1lUmVuZGVyZXIsIHRoaXMubWF0Y2hNYW5hZ2VyKTtcblxuICAgICAgICB0aGlzLnJlY291cmNlTWFuYWdlciA9IG5ldyBSZWNvdXJjZU1hbmFnZXIodGhpcy5jb21tdW5pY2F0aW9uTWFuYWdlciwgdGhpcy5nYW1lUmVuZGVyZXIpO1xuXG4gICAgICAgIHRoaXMuY29tbXVuaWNhdGlvbk1hbmFnZXIub24oJ3BsYXllciBkYXRhJywgZnVuY3Rpb24oZGF0YSlcbiAgICAgICAge1xuICAgICAgICAgICAgQ2FtZXJhLnNldENhbWVyYVBvc2l0aW9uKG5ldyBWZWN0b3IyRChkYXRhLnBoeXNQcm9wcy5wb3NpdGlvbi54LCBkYXRhLnBoeXNQcm9wcy5wb3NpdGlvbi55KSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5jb21tdW5pY2F0aW9uTWFuYWdlci5vbignbWFwIGRhdGEnLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHRoaXMubWFwLnVwZGF0ZU1hcChkYXRhLm1hcCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGUoZGVsdGEgOiBudW1iZXIpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJNYW5hZ2VyLnVwZGF0ZShkZWx0YSk7XG4gICAgICAgIHRoaXMucmVjb3VyY2VNYW5hZ2VyLnVwZGF0ZShkZWx0YSk7XG4gICAgICAgIHRoaXMubWF0Y2hNYW5hZ2VyLnVwZGF0ZShkZWx0YSk7XG4gICAgICAgIHRoaXMubWFwLnVwZGF0ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyLnJlbmRlcigpO1xuICAgIH1cbn0iLCJpbXBvcnQgQXNzZXRMb2FkZXIgZnJvbSBcIi4uL3V0aWxzL0Fzc2V0TG9hZGVyXCI7XG5pbXBvcnQgR2FtZVJlbmRlcmVyIGZyb20gXCIuLi91dGlscy9SZW5kZXJlclwiO1xuaW1wb3J0IFR5bGUgZnJvbSBcIi4vVHlsZVwiO1xuaW1wb3J0IHtDb25maWd9IGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCBWZWN0b3IyRCBmcm9tIFwiLi4vdXRpbHMvVmVjdG9yMkRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwe1xuXG4gICAgcHJpdmF0ZSBiYXNlVGV4dHVyZSA6IFBJWEkuQmFzZVRleHR1cmU7XG4gICAgcHJpdmF0ZSB0eWxlTWFwIDogVHlsZVtdW107XG4gICAgcHJpdmF0ZSBjZW50ZXJYIDogbnVtYmVyO1xuICAgIHByaXZhdGUgY2VudGVyWSA6IG51bWJlcjtcbiAgICBwcml2YXRlIGdhbWVSZW5kZXJlciA6IEdhbWVSZW5kZXJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVyOiBHYW1lUmVuZGVyZXIsIG1hcDogbnVtYmVyW10pe1xuICAgICAgICB2YXIgZWxlbWVudCA6IEhUTUxJbWFnZUVsZW1lbnQgPSA8SFRNTEltYWdlRWxlbWVudD4gQXNzZXRMb2FkZXIuZ2V0Q29udGVudChcInRpbGVzZXRcIik7XG5cbiAgICAgICAgLy9sb2FkIGJhc2UgU3ByaXRlc1xuICAgICAgICB0aGlzLmJhc2VUZXh0dXJlID0gbmV3IFBJWEkuQmFzZVRleHR1cmUoZWxlbWVudCk7XG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyID0gcmVuZGVyZXI7XG5cbiAgICAgICAgLy9jcmVhdGUgdHlsZW1hcFxuICAgICAgICB0aGlzLnR5bGVNYXAgPSBbXTtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IENvbmZpZy5NQVBfU0laRV9YOyBpKyspe1xuICAgICAgICAgICAgdGhpcy50eWxlTWFwW2ldID0gW107XG4gICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgQ29uZmlnLk1BUF9TSVpFX1k7IGorKyl7XG4gICAgICAgICAgICAgICAgdGhpcy50eWxlTWFwW2ldW2pdID0gbmV3IFR5bGUodGhpcy5iYXNlVGV4dHVyZSwgbmV3IFZlY3RvcjJEKGkgKiBDb25maWcuVElMRV9TSVpFX1gsIGogKiBDb25maWcuVElMRV9TSVpFX1gpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnR5bGVNYXBbaV1bal0uc2V0SWQoMCk7XG4gICAgICAgICAgICAgICAgcmVuZGVyZXIuYWRkVG9NYWluQ29udGFpbmVyKHRoaXMudHlsZU1hcFtpXVtqXS5nZXRTcHJpdGUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHVibGljIHVwZGF0ZSgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IENvbmZpZy5NQVBfU0laRV9YOyBpKyspe1xuICAgICAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IENvbmZpZy5NQVBfU0laRV9ZOyBqKyspe1xuICAgICAgICAgICAgICAgIHRoaXMudHlsZU1hcFtpXVtqXS51cGRhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVNYXAobWFwOiBudW1iZXJbXSkgOiB2b2lkXG4gICAge1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgQ29uZmlnLk1BUF9TSVpFX1g7IGkrKyl7XG4gICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgQ29uZmlnLk1BUF9TSVpFX1k7IGorKyl7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnR5bGVNYXBbaV1bal0uc2V0SWQobWFwW2ldW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCBBc3NldExvYWRlciBmcm9tIFwiLi4vdXRpbHMvQXNzZXRMb2FkZXJcIjtcbmltcG9ydCBHYW1lUmVuZGVyZXIgZnJvbSBcIi4uL3V0aWxzL1JlbmRlcmVyXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL1V0aWxzXCI7XG5pbXBvcnQgVmVjdG9yMkQgZnJvbSBcIi4uL3V0aWxzL1ZlY3RvcjJEXCI7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBIYW5kbGVye1xuXG4gICAgcHJpdmF0ZSB0eWxlU3ByaXRlIDogUElYSS5TcHJpdGU7XG4gICAgcHJpdmF0ZSBwb3MgOiBWZWN0b3IyRDtcblxuICAgIGNvbnN0cnVjdG9yKGJhc2VUZXh0dXJlOiBQSVhJLkJhc2VUZXh0dXJlLCBwb3NpdGlvbjogVmVjdG9yMkQpXG4gICAge1xuICAgICAgICB0aGlzLnBvcyA9IHBvc2l0aW9uO1xuICAgICAgICB0aGlzLnR5bGVTcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUobmV3IFBJWEkuVGV4dHVyZShiYXNlVGV4dHVyZSwgbmV3IFBJWEkuUmVjdGFuZ2xlKDAsMCxDb25maWcuVElMRV9TSVpFX1gsQ29uZmlnLlRJTEVfU0laRV9ZKSkpO1xuICAgICAgICBVdGlscy5zZXRTcHJpdGVWaWV3cG9ydFBvcyh0aGlzLnR5bGVTcHJpdGUsIHRoaXMucG9zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKCkgOiB2b2lkXG4gICAge1xuICAgICAgICBVdGlscy5zZXRTcHJpdGVWaWV3cG9ydFBvcyh0aGlzLnR5bGVTcHJpdGUsIHRoaXMucG9zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0SWQoaWQgOiBudW1iZXIpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdmFyIHJhbmRZID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogNCk7XG4gICAgICAgIHRoaXMudHlsZVNwcml0ZS50ZXh0dXJlLmZyYW1lID0gbmV3IFBJWEkuUmVjdGFuZ2xlKGlkICogQ29uZmlnLlRJTEVfU0laRV9YLCByYW5kWSAqIENvbmZpZy5USUxFX1NJWkVfWSwgQ29uZmlnLlRJTEVfU0laRV9YLENvbmZpZy5USUxFX1NJWkVfWSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFNwcml0ZSgpIDogUElYSS5TcHJpdGVcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnR5bGVTcHJpdGU7XG4gICAgfVxufSIsImltcG9ydCBBc3NldExvYWRlciBmcm9tIFwiLi4vdXRpbHMvQXNzZXRMb2FkZXJcIjtcbmltcG9ydCBHYW1lUmVuZGVyZXIgZnJvbSBcIi4uL3V0aWxzL1JlbmRlcmVyXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL1V0aWxzXCI7XG5pbXBvcnQgVmVjdG9yMkQgZnJvbSBcIi4uL3V0aWxzL1ZlY3RvcjJEXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyYWZ0aW5nQXJlYXtcblxuICAgIHByaXZhdGUgc3ByaXRlIDogUElYSS5TcHJpdGU7XG4gICAgcHJpdmF0ZSBwb3MgOiBWZWN0b3IyRDtcbiAgICBwcm90ZWN0ZWQgZ2FtZVJlbmRlcmVyIDogR2FtZVJlbmRlcmVyO1xuXG4gICAgY29uc3RydWN0b3IoYmFzZVRleHR1cmUgOiBQSVhJLkJhc2VUZXh0dXJlLCByZW5kZXJlcjogR2FtZVJlbmRlcmVyLCBwb3NpdGlvbjogVmVjdG9yMkQsIGNvbG9yOiBudW1iZXIpXG4gICAge1xuICAgICAgICB0aGlzLnBvcyA9IHBvc2l0aW9uO1xuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgICAgICB0aGlzLnNwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZShuZXcgUElYSS5UZXh0dXJlKGJhc2VUZXh0dXJlKSk7XG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyLmFkZFRvTWFpbkNvbnRhaW5lcih0aGlzLnNwcml0ZSk7XG4gICAgICAgIHRoaXMuc3ByaXRlLnRpbnQgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5zcHJpdGUuYW5jaG9yID0gbmV3IFBJWEkuUG9pbnQoMC41ICwgMC41KTtcbiAgICAgICAgVXRpbHMuc2V0U3ByaXRlVmlld3BvcnRQb3ModGhpcy5zcHJpdGUsIHRoaXMucG9zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q29sb3IoY29sb3IgOiBudW1iZXIpXG4gICAge1xuICAgICAgICB0aGlzLnNwcml0ZS50aW50ID0gY29sb3I7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZShkZWx0YSA6IG51bWJlcikgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLnNwcml0ZS5yb3RhdGlvbiArPSAyMCAqIGRlbHRhLzEwMDA7XG4gICAgICAgIGlmKHRoaXMuc3ByaXRlLnJvdGF0aW9uID4gMzYwKSB0aGlzLnNwcml0ZS5yb3RhdGlvbiA9IHRoaXMuc3ByaXRlLnJvdGF0aW9uIC0gMzYwO1xuICAgICAgICBVdGlscy5zZXRTcHJpdGVWaWV3cG9ydFBvcyh0aGlzLnNwcml0ZSwgdGhpcy5wb3MpO1xuICAgIH1cbn0iLCJpbXBvcnQgQ29tbXVuaWNhdGlvbk1hbmFnZXIgZnJvbSBcIi4uL2NvbW11bmljYXRpb24vQ29tbXVuaWNhdGlvbk1hbmFnZXJcIjtcbmltcG9ydCBHYW1lUmVuZGVyZXIgZnJvbSBcIi4uL3V0aWxzL1JlbmRlcmVyXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL1V0aWxzXCI7XG5pbXBvcnQgVmVjdG9yMkQgZnJvbSBcIi4uL3V0aWxzL1ZlY3RvcjJEXCI7XG5pbXBvcnQgQ3JhZnRpbmdBcmVhIGZyb20gXCIuL0NyYWZ0aW5nQXJlYVwiO1xuaW1wb3J0IEFzc2V0TG9hZGVyIGZyb20gXCIuLi91dGlscy9Bc3NldExvYWRlclwiO1xuaW1wb3J0IHtDb25maWd9IGZyb20gXCIuLi9jb25maWdcIjtcblxuY2xhc3MgVGVhbVNjb3JlXG57XG4gICAgcHJvdGVjdGVkIHJlc291cmNlQ291bnRUZXh0cyA6IHt9O1xuICAgIHByb3RlY3RlZCBwcm9ncmVzc0JhciA6IFBJWEkuVGV4dDtcbiAgICBwcm90ZWN0ZWQgZ2FtZVJlbmRlcmVyIDogR2FtZVJlbmRlcmVyO1xuICAgIHByb3RlY3RlZCBuZWVkZWRSZXNvdXJjZXMgOiB7fTtcbiAgICBwcm90ZWN0ZWQgcG9zaXRpb24gOiBWZWN0b3IyRDtcblxuICAgIGNvbnN0cnVjdG9yKGdhbWVSZW5kZXJlciA6IEdhbWVSZW5kZXJlciwgbmVlZGVkUmVzb3VyY2VzIDoge30sIHBvc2l0aW9uIDogVmVjdG9yMkQpXG4gICAge1xuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlciA9IGdhbWVSZW5kZXJlcjtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG5lZWRlZFJlc291cmNlcyk7XG4gICAgICAgIHRoaXMucmVzb3VyY2VDb3VudFRleHRzID0ge307XG4gICAgICAgIHRoaXMubmVlZGVkUmVzb3VyY2VzID0gbmVlZGVkUmVzb3VyY2VzO1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNvdW50VGV4dHNba2V5c1tpXV0gPSBuZXcgUElYSS5UZXh0KGtleXNbaV0rXCI6IFwiKzArXCIgLyBcIituZWVkZWRSZXNvdXJjZXNba2V5c1tpXV0pO1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNvdW50VGV4dHNba2V5c1tpXV0ucG9zaXRpb24gPSBuZXcgUElYSS5Qb2ludCh0aGlzLnBvc2l0aW9uLnggKyBpKjIwMCwgdGhpcy5wb3NpdGlvbi55KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyLmFkZFRvTWFpbkNvbnRhaW5lcih0aGlzLnJlc291cmNlQ291bnRUZXh0c1trZXlzW2ldXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlUmVzb3VyY2UocmVzb3VyY2UgOiBzdHJpbmcsIGNvdW50IDogbnVtYmVyKVxuICAgIHtcbiAgICAgICAgdmFyIHJlc291cmNlVGV4dCA9IHRoaXMucmVzb3VyY2VDb3VudFRleHRzW3Jlc291cmNlXTtcblxuICAgICAgICBpZihyZXNvdXJjZVRleHQpIHJlc291cmNlVGV4dC50ZXh0ID0gcmVzb3VyY2UrXCI6IFwiK2NvdW50K1wiIC8gXCIrdGhpcy5uZWVkZWRSZXNvdXJjZXNbcmVzb3VyY2VdO1xuICAgIH1cblxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdGNoTWFuYWdlcntcblxuICAgIHByb3RlY3RlZCBjcmFmdGluZ0FyZWFzIDoge307XG4gICAgcHJvdGVjdGVkIGNvbW11bmljYXRpb25NYW5hZ2VyIDogQ29tbXVuaWNhdGlvbk1hbmFnZXI7XG4gICAgcHJvdGVjdGVkIGdhbWVSZW5kZXJlciA6IEdhbWVSZW5kZXJlcjtcbiAgICBwcm90ZWN0ZWQgY3JhZnRpbmdBcmVhVGV4dHVyZSA6IFBJWEkuQmFzZVRleHR1cmU7XG4gICAgcHJvdGVjdGVkIG1haW5QbGF5ZXJUZWFtIDogbnVtYmVyO1xuICAgIHByb3RlY3RlZCB0ZWFtU2NvcmVEaXNwbGF5IDoge307XG5cbiAgICBjb25zdHJ1Y3Rvcihjb21tdW5pY2F0aW9uTWFuYWdlciA6IENvbW11bmljYXRpb25NYW5hZ2VyLCBnYW1lUmVuZGVyZXIgOiBHYW1lUmVuZGVyZXIpXG4gICAge1xuICAgICAgICB0aGlzLmNvbW11bmljYXRpb25NYW5hZ2VyID0gY29tbXVuaWNhdGlvbk1hbmFnZXI7XG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyID0gZ2FtZVJlbmRlcmVyO1xuICAgICAgICB0aGlzLmNyYWZ0aW5nQXJlYXMgPSB7fTtcbiAgICAgICAgdGhpcy5tYWluUGxheWVyVGVhbSA9IG51bGw7XG4gICAgICAgIHRoaXMuY3JhZnRpbmdBcmVhVGV4dHVyZSA9IG5ldyBQSVhJLkJhc2VUZXh0dXJlKDxIVE1MSW1hZ2VFbGVtZW50PiBBc3NldExvYWRlci5nZXRDb250ZW50KFwiQ3JhZnRpbmdBcmVhXCIpKTtcbiAgICAgICAgdGhpcy50ZWFtU2NvcmVEaXNwbGF5ID0ge307XG4gICAgICAgIHZhciB0ZWFtUG9zU2NvcmUgPSBbbmV3IFZlY3RvcjJEKDAsIDIwKSwgbmV3IFZlY3RvcjJEKENvbmZpZy5TVEFHRV9XSURUSCAtIDYzMCwgQ29uZmlnLlNUQUdFX0hFSUdIVCAtIDUwKV07XG4gICAgICAgIHRoaXMuY29tbXVuaWNhdGlvbk1hbmFnZXIub24oJ21hdGNoIGRhdGEnLCBmdW5jdGlvbihkYXRhKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgaSwgdGVhbURhdGE7XG4gICAgICAgICAgICBpZihkYXRhICYmIGRhdGEubWF0Y2ggJiYgZGF0YS5tYXRjaC50ZWFtRGF0YSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBkYXRhLm1hdGNoLnRlYW1EYXRhLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGVhbURhdGEgPSBkYXRhLm1hdGNoLnRlYW1EYXRhW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5jcmFmdGluZ0FyZWFzW2ldKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyYWZ0aW5nQXJlYXNbaV0gPSBuZXcgQ3JhZnRpbmdBcmVhKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JhZnRpbmdBcmVhVGV4dHVyZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVSZW5kZXJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMkQodGVhbURhdGEuY3JhZnRpbmdab25lLnBvc2l0aW9uLngsIHRlYW1EYXRhLmNyYWZ0aW5nWm9uZS5wb3NpdGlvbi55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb25maWcuQ09MT1JfTkVVVFJBTFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVhbVNjb3JlRGlzcGxheVtpXSA9IG5ldyBUZWFtU2NvcmUodGhpcy5nYW1lUmVuZGVyZXIsIGRhdGEubWF0Y2gubmVlZGVkUmVzb3VyY2VzLCB0ZWFtUG9zU2NvcmVbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5tYWluUGxheWVyVGVhbSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yVGVhbXMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuY29tbXVuaWNhdGlvbk1hbmFnZXIub24oJ2dhbWUgd29uJywgZnVuY3Rpb24oZGF0YSlcbiAgICAgICAge1xuICAgICAgICAgICAgXG5cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLmNvbW11bmljYXRpb25NYW5hZ2VyLm9uKCdyZXNvdXJjZXMgY2hhbmdlZCcsIGZ1bmN0aW9uKGRhdGEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhLnRlYW1SZXNvdXJjZXMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZm9yKHZhciByZXNvdXJjZSBpbiBkYXRhLnRlYW1SZXNvdXJjZXNbaV0ucmVzb3VyY2VTdGFzaClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVhbVNjb3JlRGlzcGxheVtpXS51cGRhdGVSZXNvdXJjZShyZXNvdXJjZSwgZGF0YS50ZWFtUmVzb3VyY2VzW2ldLnJlc291cmNlU3Rhc2hbcmVzb3VyY2VdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldE1haW5QbGF5ZXJUZWFtKHRlYW0gOiBudW1iZXIpXG4gICAge1xuICAgICAgICB0aGlzLm1haW5QbGF5ZXJUZWFtID0gdGVhbTtcbiAgICAgICAgdGhpcy5jb2xvclRlYW1zKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbG9yVGVhbXMoKVxuICAgIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmNyYWZ0aW5nQXJlYXMpLCBpO1xuICAgICAgICBmb3IoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZihpID09IHRoaXMubWFpblBsYXllclRlYW0pXG4gICAgICAgICAgICB7ICAgdGhpcy5jcmFmdGluZ0FyZWFzW2tleXNbaV1dLnNldENvbG9yKENvbmZpZy5DT0xPUl9GUklFTkQpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmFmdGluZ0FyZWFzW2tleXNbaV1dLnNldENvbG9yKENvbmZpZy5DT0xPUl9GT0UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZShkZWx0YSkgOiB2b2lkXG4gICAge1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY3JhZnRpbmdBcmVhcyksIGk7XG4gICAgICAgIGZvcihpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuY3JhZnRpbmdBcmVhc1trZXlzW2ldXS51cGRhdGUoZGVsdGEpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBBc3NldExvYWRlciBmcm9tIFwiLi4vdXRpbHMvQXNzZXRMb2FkZXJcIjtcbmltcG9ydCBHYW1lUmVuZGVyZXIgZnJvbSBcIi4uL3V0aWxzL1JlbmRlcmVyXCI7XG5pbXBvcnQgUElfMiA9IFBJWEkuUElfMjtcbmltcG9ydCBWZWN0b3IyRCBmcm9tIFwiLi4vdXRpbHMvVmVjdG9yMkRcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvVXRpbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFydGljbGV7XG5cbiAgICBwcml2YXRlIHBhcnRpY2xlU3ByaXRlIDogUElYSS5TcHJpdGU7XG4gICAgcHJpdmF0ZSBiYXNlVGV4dHVyZSA6IFBJWEkuQmFzZVRleHR1cmU7XG5cbiAgICBwcml2YXRlIHBvcyA6IFZlY3RvcjJEO1xuICAgIHByaXZhdGUgb2Zmc2V0IDogVmVjdG9yMkRcblxuXG4gICAgcHJpdmF0ZSBtb3ZlIDogVmVjdG9yMkQ7XG5cbiAgICBwcml2YXRlIGxpdmVUaW1lIDogbnVtYmVyO1xuICAgIHByaXZhdGUgbWF4TGl2ZVRpbWUgOiBudW1iZXI7XG5cbiAgICBwcml2YXRlIHRvRGVsZXRlIDogYm9vbGVhbjtcblxuICAgIHByaXZhdGUgcmVuZGVyZXIgOiBHYW1lUmVuZGVyZXI7XG4gICAgXG4gICAgcHJpdmF0ZSBlbWl0dGluZ1JhZGl1cyA6IG51bWJlcjtcblxuICAgIHByaXZhdGUgY29sb3I7XG5cbiAgICBjb25zdHJ1Y3RvcihyZW5kZXJlcjogR2FtZVJlbmRlcmVyLCBwb3MgOiBWZWN0b3IyRCwgY29sb3IgOiBudW1iZXIgfCBib29sZWFuLCBiYXNlVGV4dHVyZSA6IFBJWEkuQmFzZVRleHR1cmUsIG1heFRpbWUgOiBudW1iZXIsIGVtaXR0aW5nUmFkaXVzIDogbnVtYmVyKXtcbiAgICAgICAgdGhpcy5lbWl0dGluZ1JhZGl1cyA9IGVtaXR0aW5nUmFkaXVzO1xuICAgICAgICB0aGlzLm1heExpdmVUaW1lID0gbWF4VGltZTtcbiAgICAgICAgdGhpcy5iYXNlVGV4dHVyZSA9IGJhc2VUZXh0dXJlO1xuICAgICAgICB0aGlzLnBhcnRpY2xlU3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKG5ldyBQSVhJLlRleHR1cmUodGhpcy5iYXNlVGV4dHVyZSkpO1xuICAgICAgICB0aGlzLm9mZnNldCA9IG5ldyBWZWN0b3IyRCh0aGlzLnBhcnRpY2xlU3ByaXRlLndpZHRoIC8gMiwgdGhpcy5wYXJ0aWNsZVNwcml0ZS5oZWlnaHQgLyAyKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgICAgICBpZih0eXBlb2YgY29sb3IgPT0gXCJudW1iZXJcIil7XG4gICAgICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU3ByaXRlLnRpbnQgPSB0aGlzLmNvbG9yOy8vJyMnKygweDEwMDAwMDArKE1hdGgucmFuZG9tKCkpKjB4ZmZmZmZmKS50b1N0cmluZygxNikuc3Vic3RyKDEsNik7XG4gICAgICAgIH1cbiAgICAgICAgaWYodHlwZW9mIGNvbG9yID09IFwiYm9vbGVhblwiKXtcbiAgICAgICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgICAgIGlmKHRoaXMuY29sb3Ipe1xuICAgICAgICAgICAgICAgIC8vdGhpcy5wYXJ0aWNsZVNwcml0ZS50aW50ID0gTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuICAgICAgICAgICAgICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDB4ZmYwMDAwO1xuICAgICAgICAgICAgICAgIHZhciBnID0gTWF0aC5yYW5kb20oKSAqIDB4MDBmZjAwO1xuICAgICAgICAgICAgICAgIHZhciBiID0gTWF0aC5yYW5kb20oKSAqIDB4MDAwMGZmO1xuICAgICAgICAgICAgICAgIHRoaXMucGFydGljbGVTcHJpdGUudGludCA9IHIgKyBnICsgYjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkgKiAxMDtcbiAgICAgICAgXG4gICAgICAgIHRoaXMucG9zID0gbmV3IFZlY3RvcjJEKHBvcy54IC0gdGhpcy5vZmZzZXQueCwgcG9zLnkgLSB0aGlzLm9mZnNldC55KTtcblxuICAgICAgICB0aGlzLmxpdmVUaW1lID0gMDtcblxuICAgICAgICBVdGlscy5zZXRTcHJpdGVWaWV3cG9ydFBvcyh0aGlzLnBhcnRpY2xlU3ByaXRlLCB0aGlzLnBvcyk7XG4gICAgICAgIFxuICAgICAgICByZW5kZXJlci5hZGRUb01haW5Db250YWluZXIodGhpcy5wYXJ0aWNsZVNwcml0ZSk7XG5cbiAgICAgICAgdGhpcy5tb3ZlID0gbmV3IFZlY3RvcjJEKDAsMCk7XG4gICAgICAgIHRoaXMubW92ZS54ID0gIHRoaXMuZW1pdHRpbmdSYWRpdXMgKiBNYXRoLmNvcyhNYXRoLlBJICogMiAqIHIpO1xuICAgICAgICB0aGlzLm1vdmUueSA9ICB0aGlzLmVtaXR0aW5nUmFkaXVzICogTWF0aC5zaW4oTWF0aC5QSSAqIDIgKiByKTtcblxuICAgICAgICB0aGlzLnRvRGVsZXRlID0gZmFsc2U7XG5cbiAgICAgICAgciA9IE1hdGgucmFuZG9tKCkgKiAxMDtcbiAgICAgICAgdGhpcy5tYXhMaXZlVGltZSAqPSByO1xuICAgICAgICB0aGlzLm1heExpdmVUaW1lIC89IDUwO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRTcHJpdGUoYmFzZVRleCA6IFBJWEkuQmFzZVRleHR1cmUpe1xuICAgICAgICB0aGlzLnBhcnRpY2xlU3ByaXRlLnRleHR1cmUgPSBuZXcgUElYSS5UZXh0dXJlKGJhc2VUZXgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGUoZGVsdGE6IG51bWJlcikgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmxpdmVUaW1lICs9IDE2O1xuICAgICAgICBpZih0aGlzLmxpdmVUaW1lID4gdGhpcy5tYXhMaXZlVGltZSl7XG4gICAgICAgICAgICB0aGlzLnRvRGVsZXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCF0aGlzIHx8ICF0aGlzLnBvcyB8fCAhdGhpcy5wb3MuYWRkKSBkZWJ1Z2dlcjtcblxuICAgICAgICB0aGlzLnBvcyA9IG5ldyBWZWN0b3IyRCh0aGlzLnBvcy54ICsgdGhpcy5tb3ZlLngsIHRoaXMucG9zLnkgKyB0aGlzLm1vdmUueSk7XG4gICAgICAgIFV0aWxzLnNldFNwcml0ZVZpZXdwb3J0UG9zKHRoaXMucGFydGljbGVTcHJpdGUsIHRoaXMucG9zKTtcblxuICAgICAgICB0aGlzLnBhcnRpY2xlU3ByaXRlLmFscGhhICo9ICgxNS8xNik7XG5cbiAgICB9XG4gICAgXG4gICAgcHVibGljIGNoZWNrQWxpdmUoKSA6IGJvb2xlYW57XG4gICAgICAgIHJldHVybiAhdGhpcy50b0RlbGV0ZTtcbiAgICB9XG4gICAgcHVibGljIGRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVGcm9tTWFpbkNvbnRhaW5lcih0aGlzLnBhcnRpY2xlU3ByaXRlKTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgUGFydGljbGUgZnJvbSBcIi4vUGFydGljbGVcIjtcbmltcG9ydCBBc3NldExvYWRlciBmcm9tIFwiLi4vdXRpbHMvQXNzZXRMb2FkZXJcIjtcbmltcG9ydCBHYW1lUmVuZGVyZXIgZnJvbSBcIi4uL3V0aWxzL1JlbmRlcmVyXCI7XG5pbXBvcnQgVmVjdG9yMkQgZnJvbSBcIi4uL3V0aWxzL1ZlY3RvcjJEXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnRpY2xlRW1pdHRlcntcblxuICAgIHByaXZhdGUgYmFzZVRleHR1cmUgOiBQSVhJLkJhc2VUZXh0dXJlO1xuICAgIHByaXZhdGUgcGFydGljbGVzIDogUGFydGljbGVbXTtcbiAgICBwcml2YXRlIHJlbmRlcmVyIDogR2FtZVJlbmRlcmVyO1xuICAgIHByaXZhdGUgcGFydGljbGVDb3VudCA6IG51bWJlcjtcbiAgICBwcml2YXRlIGNvbG9yIDogbnVtYmVyIHwgYm9vbGVhbjtcbiAgICBwcml2YXRlIG1heFRpbWUgOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBlbWl0dGluZ1JhZGl1cyA6IG51bWJlcjtcbiAgICBwcml2YXRlIHBvcyA6IFZlY3RvcjJEO1xuXG4gICAgY29uc3RydWN0b3IocmVuZGVyZXI6IEdhbWVSZW5kZXJlciwgcG9zIDogVmVjdG9yMkQsIGNvbG9yIDogbnVtYmVyIHwgYm9vbGVhbiwgdGV4dHVyZVBhdGggOiBzdHJpbmcsIG1heFRpbWUgOiBudW1iZXIsIGVtaXRpbmdSYWRpdXMgOiBudW1iZXIsIHBhcnRpY2xlQ291bnQ/IDogbnVtYmVyKVxuICAgIHtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgICAgIHRoaXMuZW1pdHRpbmdSYWRpdXMgPSBlbWl0aW5nUmFkaXVzO1xuICAgICAgICB2YXIgZWxlbWVudCA6IEhUTUxJbWFnZUVsZW1lbnQgPSA8SFRNTEltYWdlRWxlbWVudD4gQXNzZXRMb2FkZXIuZ2V0Q29udGVudCh0ZXh0dXJlUGF0aCk7XG4gICAgICAgIHRoaXMuYmFzZVRleHR1cmUgPSBuZXcgUElYSS5CYXNlVGV4dHVyZShlbGVtZW50KTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG4gICAgICAgIHRoaXMubWF4VGltZSA9IG1heFRpbWU7XG4gICAgICAgIGlmKHBhcnRpY2xlQ291bnQpIHRoaXMucGFydGljbGVDb3VudCA9IHBhcnRpY2xlQ291bnQ7IGVsc2UgdGhpcy5wYXJ0aWNsZUNvdW50ID0gNTA7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMucGFydGljbGVDb3VudDsgaSArKyl7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlc1tpXSA9IG5ldyBQYXJ0aWNsZShyZW5kZXJlciwgcG9zLCB0aGlzLmNvbG9yLCB0aGlzLmJhc2VUZXh0dXJlLCB0aGlzLm1heFRpbWUsIHRoaXMuZW1pdHRpbmdSYWRpdXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzZXRTcHJpdGUoc3ByaXRlIDogc3RyaW5nKXtcbiAgICAgICAgdmFyIGVsZW1lbnQgOiBIVE1MSW1hZ2VFbGVtZW50ID0gPEhUTUxJbWFnZUVsZW1lbnQ+IEFzc2V0TG9hZGVyLmdldENvbnRlbnQoc3ByaXRlKTtcbiAgICAgICAgdGhpcy5iYXNlVGV4dHVyZSA9IG5ldyBQSVhJLkJhc2VUZXh0dXJlKGVsZW1lbnQpO1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJ0aWNsZUNvdW50OyBpICsrKXtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2ldLnNldFNwcml0ZSh0aGlzLmJhc2VUZXh0dXJlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDb2xvcihjb2xvciA6IG51bWJlcilcbiAgICB7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKHBvcyA6IFZlY3RvcjJELCBkZWx0YSA6IG51bWJlcikgOiB2b2lkXG4gICAge1xuICAgICAgICBcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMucGFydGljbGVDb3VudDsgaSsrKXtcbiAgICAgICAgICAgIGlmKCF0aGlzLnBhcnRpY2xlc1tpXS5jaGVja0FsaXZlKCkpe1xuICAgICAgICAgICAgICAgIHRoaXMucGFydGljbGVzW2ldLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlc1tpXSA9IG5ldyBQYXJ0aWNsZSh0aGlzLnJlbmRlcmVyLCBwb3MsIHRoaXMuY29sb3IsIHRoaXMuYmFzZVRleHR1cmUsIHRoaXMubWF4VGltZSwgdGhpcy5lbWl0dGluZ1JhZGl1cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXNbaV0udXBkYXRlKGRlbHRhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgZ2V0UG9zaXRpb24oKSA6IFZlY3RvcjJEXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3M7XG4gICAgfVxuXG4gICAgcHVibGljIGRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMucGFydGljbGVDb3VudDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlc1tpXS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgQXNzZXRMb2FkZXIgZnJvbSBcIi4uL3V0aWxzL0Fzc2V0TG9hZGVyXCI7XG5pbXBvcnQgR2FtZVJlbmRlcmVyIGZyb20gXCIuLi91dGlscy9SZW5kZXJlclwiO1xuaW1wb3J0IFBhcnRpY2xlRW1pdHRlciBmcm9tIFwiLi9QYXJ0aWNsZUVtaXR0ZXJcIjtcbmltcG9ydCBWZWN0b3IyRCBmcm9tIFwiLi4vdXRpbHMvVmVjdG9yMkRcIjtcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHMvVXRpbHNcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllcntcblxuXG4gICAgcHJpdmF0ZSBpZCA6IHN0cmluZztcbiAgICBwcml2YXRlIHBvcyA6IFZlY3RvcjJEO1xuICAgIHByaXZhdGUgcGFydGljbGVFbWl0dGVyIDogUGFydGljbGVFbWl0dGVyO1xuICAgIHByaXZhdGUgZ2FtZVJlbmRlcmVyIDogR2FtZVJlbmRlcmVyO1xuICAgIHByaXZhdGUgY29sb3I7XG4gICAgcHJpdmF0ZSBpc1N0dW5uZWQgOiBib29sZWFuO1xuICAgIHByaXZhdGUgdGVhbSA6IHN0cmluZztcbiAgICBwcml2YXRlIGl0ZW0gOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgc2V0SXRlbShpdGVtIDogc3RyaW5nKXtcbiAgICAgICAgdGhpcy5pdGVtID0gaXRlbTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZUVtaXR0ZXIuc2V0U3ByaXRlKHRoaXMuaXRlbSk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVyOiBHYW1lUmVuZGVyZXIsIGlkIDogc3RyaW5nLCB0ZWFtIDogc3RyaW5nLCBjb2xvciA6IG51bWJlciB8IGJvb2xlYW4pe1xuXG4gICAgICAgIHRoaXMuaXRlbSA9IFwibm9uZVwiO1xuICAgICAgICB0aGlzLnRlYW0gPSB0ZWFtO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMucG9zID0gbmV3IFZlY3RvcjJEKDAsIDApO1xuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgICAgIHRoaXMucGFydGljbGVFbWl0dGVyID0gbmV3IFBhcnRpY2xlRW1pdHRlcihyZW5kZXJlciwgbmV3IFZlY3RvcjJEKDAgLDApLCB0aGlzLmNvbG9yLCB0aGlzLml0ZW0sIDgwMCwgMyk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyB1cGRhdGUoZGVsdGEgOiBudW1iZXIpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZUVtaXR0ZXIudXBkYXRlKHRoaXMucG9zLCBkZWx0YSk7XG4gICAgICAgIHRoaXMudXBkYXRlQ29sb3JBY2NvcmRpbmdUb1N0YXR1cyhkZWx0YSk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZUNvbG9yQWNjb3JkaW5nVG9TdGF0dXMoZGVsdGEpXG4gICAge1xuICAgICAgICBpZih0aGlzLmlzU3R1bm5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZUVtaXR0ZXIuc2V0Q29sb3IoVXRpbHMuY29sb3JNYWtlQnJpZ2h0ZXIodGhpcy5jb2xvciwgTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKjUwKSs1MCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZUVtaXR0ZXIuc2V0Q29sb3IodGhpcy5jb2xvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SWQoKSA6IHN0cmluZ1xuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQ7XG4gICAgfVxuXG4gICAgcHVibGljIHNldFBvc2l0aW9uKHBvcyA6IFZlY3RvcjJEKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMucG9zID0gcG9zO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc2V0SXNTdHVubmVkKGlzU3R1bm5lZCA6IGJvb2xlYW4pXG4gICAge1xuICAgICAgICB0aGlzLmlzU3R1bm5lZCA9IGlzU3R1bm5lZDtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIGRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZUVtaXR0ZXIuZGVzdHJveSgpO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgZ2V0VGVhbSgpIDogc3RyaW5nXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy50ZWFtO1xuICAgIH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbGlic3NyYy9zb2NrZXQuaW8tY2xpZW50LmQudHNcIi8+XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSBcIi4uL3V0aWxzL0xvZ2dlclwiO1xuaW1wb3J0IHtDb25maWd9IGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL3BsYXllci9QbGF5ZXJcIjtcbmltcG9ydCBDb21tdW5pY2F0aW9uTWFuYWdlciBmcm9tIFwiLi4vY29tbXVuaWNhdGlvbi9Db21tdW5pY2F0aW9uTWFuYWdlclwiO1xuaW1wb3J0IEdhbWVSZW5kZXJlciBmcm9tIFwiLi4vdXRpbHMvUmVuZGVyZXJcIjtcbmltcG9ydCBDYW1lcmEgZnJvbSBcIi4uL3V0aWxzL0NhbWVyYVwiO1xuaW1wb3J0IHtJbnB1dH0gZnJvbSBcIi4uL3V0aWxzL0lucHV0XCI7XG5pbXBvcnQgVmVjdG9yMkQgZnJvbSBcIi4uL3V0aWxzL1ZlY3RvcjJEXCI7XG5pbXBvcnQgTWF0Y2hNYW5hZ2VyIGZyb20gXCIuLi9tYXRjaC9NYXRjaE1hbmFnZXJcIjtcblxudmFyIGxvZyA9IExvZ2dlcihcIkNvbW11bmljYXRpb25NYW5hZ2VyXCIpO1xuXG5jbGFzcyBQbGF5ZXJNYW5hZ2VyIHtcblxuICAgIHByb3RlY3RlZCBtYWluUGxheWVyIDogUGxheWVyO1xuICAgIHByb3RlY3RlZCBtYWluUGxheWVySW5wdXQgOiBJbnB1dC5QbGF5ZXJJbnB1dDtcbiAgICBwcm90ZWN0ZWQgb3RoZXJQbGF5ZXJzIDoge307XG4gICAgcHJvdGVjdGVkIGNvbW11bmljYXRpb25NYW5hZ2VyIDogQ29tbXVuaWNhdGlvbk1hbmFnZXI7XG4gICAgcHJvdGVjdGVkIG1hdGNoTWFuYWdlciA6IE1hdGNoTWFuYWdlcjtcbiAgICBwcm90ZWN0ZWQgZ2FtZVJlbmRlcmVyIDogR2FtZVJlbmRlcmVyO1xuICAgICBwcm90ZWN0ZWQgYmxhIDpudW1iZXI7XG4gICAgY29uc3RydWN0b3IoY29tbXVuaWNhdGlvbk1hbmFnZXIgOiBDb21tdW5pY2F0aW9uTWFuYWdlciwgZ2FtZVJlbmRlcmVyOiBHYW1lUmVuZGVyZXIsIG1hdGNoTWFuYWdlciA6IE1hdGNoTWFuYWdlcikge1xuICAgICAgICB0aGlzLm90aGVyUGxheWVycyA9IHt9O1xuICAgICAgICB0aGlzLmNvbW11bmljYXRpb25NYW5hZ2VyID0gY29tbXVuaWNhdGlvbk1hbmFnZXI7XG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyID0gZ2FtZVJlbmRlcmVyO1xuICAgICAgICB0aGlzLm1hdGNoTWFuYWdlciA9IG1hdGNoTWFuYWdlcjtcbiAgICAgICAgXG4gICAgICAgIHRoaXMubWFpblBsYXllcklucHV0ID0gbmV3IElucHV0LlBsYXllcklucHV0KCk7XG4gICAgICAgIHRoaXMuYmxhID0gMDtcblxuICAgICAgICB0aGlzLmNvbW11bmljYXRpb25NYW5hZ2VyLm9uKCdwbGF5ZXIgZGF0YScsIGZ1bmN0aW9uKGRhdGEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1haW5QbGF5ZXIpICAgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYWluUGxheWVyID0gbmV3IFBsYXllcihnYW1lUmVuZGVyZXIsIGRhdGEuaWQsIGRhdGEudGVhbSwgQ29uZmlnLkNPTE9SX01FKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hdGNoTWFuYWdlci5zZXRNYWluUGxheWVyVGVhbShkYXRhLnRlYW0uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tYWluUGxheWVyLnNldFBvc2l0aW9uKG5ldyBWZWN0b3IyRChkYXRhLnBoeXNQcm9wcy5wb3NpdGlvbi54LCBkYXRhLnBoeXNQcm9wcy5wb3NpdGlvbi55KSk7XG4gICAgICAgICAgICB0aGlzLm1haW5QbGF5ZXIuc2V0SXNTdHVubmVkKGRhdGEuaXNTdHVubmVkKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuXG4gICAgICAgIHRoaXMuY29tbXVuaWNhdGlvbk1hbmFnZXIub24oJ290aGVyIHBsYXllciBkYXRhJywgZnVuY3Rpb24oZGF0YSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHBsYXllciwgaSwgaWQ7XG5cbiAgICAgICAgICAgIGZvcihpZCBpbiB0aGlzLm90aGVyUGxheWVycylcbiAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgIHRoaXMub3RoZXJQbGF5ZXJzW2lkXS5wbGF5ZXJVcGRhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IGRhdGEub3RoZXJQbGF5ZXJzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBsYXllciA9IGRhdGEub3RoZXJQbGF5ZXJzW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYocGxheWVyLmlkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMub3RoZXJQbGF5ZXJzW3BsYXllci5pZF0pXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBsYXllci50ZWFtID09PSB0aGlzLm1haW5QbGF5ZXIuZ2V0VGVhbSgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3RoZXJQbGF5ZXJzW3BsYXllci5pZF0gPSBuZXcgUGxheWVyKGdhbWVSZW5kZXJlciwgcGxheWVyLmlkLCBwbGF5ZXIudGVhbSwgQ29uZmlnLkNPTE9SX0ZSSUVORCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlclBsYXllcnNbcGxheWVyLmlkXSA9IG5ldyBQbGF5ZXIoZ2FtZVJlbmRlcmVyLCBwbGF5ZXIuaWQsIHBsYXllci50ZWFtLCBDb25maWcuQ09MT1JfRk9FKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlclBsYXllcnNbcGxheWVyLmlkXS5zZXRQb3NpdGlvbihuZXcgVmVjdG9yMkQocGxheWVyLnBoeXNQcm9wcy5wb3NpdGlvbi54LCBwbGF5ZXIucGh5c1Byb3BzLnBvc2l0aW9uLnkpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdGhlclBsYXllcnNbcGxheWVyLmlkXS5wbGF5ZXJVcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKGlkIGluIHRoaXMub3RoZXJQbGF5ZXJzKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmKCF0aGlzLm90aGVyUGxheWVyc1tpZF0ucGxheWVyVXBkYXRlZClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3RoZXJQbGF5ZXJzW2lkXS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLm90aGVyUGxheWVyc1tpZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5jb21tdW5pY2F0aW9uTWFuYWdlci5vbihcInJlc291cmNlIHBpY2t1cFwiLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgaWYoZGF0YS5wbGF5ZXIgPT09IHRoaXMubWFpblBsYXllci5nZXRJZCgpKVxuICAgICAgICAgICAgICAgIHRoaXMubWFpblBsYXllci5zZXRJdGVtKGRhdGEucmVzb3VyY2UpO1xuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgaW4gdGhpcy5vdGhlclBsYXllcnMpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZihkYXRhLnBsYXllciA9PT0gdGhpcy5vdGhlclBsYXllcnNbaV0uZ2V0SWQoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3RoZXJQbGF5ZXJzW2ldKGRhdGEub3RoZXJQbGF5ZXJzW2ldLnJlc291cmNlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyB1cGRhdGUoZGVsdGEpXG4gICAge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jb21tdW5pY2F0aW9uTWFuYWdlci5zZW5kRXZlbnQoJ3BsYXllciBpbnB1dCcsIHtcbiAgICAgICAgICAgIFwiaW5wdXRcIiA6IHtcbiAgICAgICAgICAgICAgICBcIm1vdXNlUG9zaXRpb25cIjoge1xuICAgICAgICAgICAgICAgICAgICBcInhcIjogQ2FtZXJhLmdldENhbWVyYVBvc2l0aW9uKCkueCArIHRoaXMubWFpblBsYXllcklucHV0LmdldE1vdXNlWCgpIC0gQ29uZmlnLlNUQUdFX1dJRFRILzIsXG4gICAgICAgICAgICAgICAgICAgIFwieVwiOiBDYW1lcmEuZ2V0Q2FtZXJhUG9zaXRpb24oKS55ICsgdGhpcy5tYWluUGxheWVySW5wdXQuZ2V0TW91c2VZKCkgLSBDb25maWcuU1RBR0VfSEVJR0hULzJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiaXNMZWZ0QnV0dG9uUHJlc3NlZFwiOiB0aGlzLm1haW5QbGF5ZXJJbnB1dC5pc01vdXNlQnV0dG9uUHJlc3NlZChJbnB1dC5Nb3VzZUJ1dHRvbnMuTEVGVCksXG4gICAgICAgICAgICAgICAgXCJpc1JpZ2h0QnV0dG9uUHJlc3NlZFwiOiB0aGlzLm1haW5QbGF5ZXJJbnB1dC5pc01vdXNlQnV0dG9uUHJlc3NlZChJbnB1dC5Nb3VzZUJ1dHRvbnMuUklHSFQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmKHRoaXMubWFpblBsYXllcil7XG4gICAgICAgICAgICB0aGlzLm1haW5QbGF5ZXIudXBkYXRlKGRlbHRhKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IodmFyIGlkIGluIHRoaXMub3RoZXJQbGF5ZXJzKXtcbiAgICAgICAgICAgIHRoaXMub3RoZXJQbGF5ZXJzW2lkXS51cGRhdGUoZGVsdGEpO1xuICAgICAgICB9XG4gICAgICAgICBcbiAgICB9XG4gICAgXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyTWFuYWdlcjsiLCJpbXBvcnQgQXNzZXRMb2FkZXIgZnJvbSBcIi4uL3V0aWxzL0Fzc2V0TG9hZGVyXCI7XG5pbXBvcnQgR2FtZVJlbmRlcmVyIGZyb20gXCIuLi91dGlscy9SZW5kZXJlclwiO1xuaW1wb3J0IFBJXzIgPSBQSVhJLlBJXzI7XG5pbXBvcnQgVmVjdG9yMkQgZnJvbSBcIi4uL3V0aWxzL1ZlY3RvcjJEXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4uL3V0aWxzL1V0aWxzXCI7XG5pbXBvcnQgUGFydGljbGVFbWl0dGVyIGZyb20gXCIuLi9wbGF5ZXIvUGFydGljbGVFbWl0dGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY291cmNle1xuXG4gICAgcHJpdmF0ZSByZWNvdXJjZVNwcml0ZSA6IFBJWEkuU3ByaXRlO1xuICAgIHByaXZhdGUgYmFzZVRleHR1cmUgOiBQSVhJLkJhc2VUZXh0dXJlO1xuICAgIHByaXZhdGUgb2Zmc2V0IDogVmVjdG9yMkQ7XG5cbiAgICBwcml2YXRlIHBhcnRpY2xlRW1pdHRlciA6IFBhcnRpY2xlRW1pdHRlcjtcbiAgICBwcml2YXRlIHBvcyA6IFZlY3RvcjJEO1xuICAgIHByaXZhdGUgZ2FtZVJlbmRlcmVyIDogR2FtZVJlbmRlcmVyO1xuXG4gICAgY29uc3RydWN0b3IocmVuZGVyZXI6IEdhbWVSZW5kZXJlciwgcG9zIDogVmVjdG9yMkQsIHR5cGUgOiBzdHJpbmcpe1xuICAgICAgICB2YXIgZWxlbWVudCA6IEhUTUxJbWFnZUVsZW1lbnQgPSA8SFRNTEltYWdlRWxlbWVudD4gQXNzZXRMb2FkZXIuZ2V0Q29udGVudCh0eXBlKTtcbiAgICAgICAgdGhpcy5iYXNlVGV4dHVyZSA9IG5ldyBQSVhJLkJhc2VUZXh0dXJlKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLnJlY291cmNlU3ByaXRlID0gbmV3IFBJWEkuU3ByaXRlKG5ldyBQSVhJLlRleHR1cmUodGhpcy5iYXNlVGV4dHVyZSkpO1xuICAgICAgICB0aGlzLm9mZnNldCA9IG5ldyBWZWN0b3IyRCh0aGlzLnJlY291cmNlU3ByaXRlLndpZHRoIC8gMiAsIHRoaXMucmVjb3VyY2VTcHJpdGUuaGVpZ2h0IC8gMiApO1xuICAgICAgICB0aGlzLnBvcyA9IHBvcztcbiAgICAgICAgdGhpcy5yZWNvdXJjZVNwcml0ZS50aW50ID0gMHg4YjFjNjI7XG5cbiAgICAgICAgVXRpbHMuc2V0U3ByaXRlVmlld3BvcnRQb3ModGhpcy5yZWNvdXJjZVNwcml0ZSwgbmV3IFZlY3RvcjJEKHRoaXMucG9zLnggLSB0aGlzLm9mZnNldC54LCB0aGlzLnBvcy55IC0gdGhpcy5vZmZzZXQueSkpO1xuXG5cbiAgICAgICAgdGhpcy5nYW1lUmVuZGVyZXIgPSByZW5kZXJlcjtcblxuICAgICAgICB0aGlzLnBhcnRpY2xlRW1pdHRlciA9IG5ldyBQYXJ0aWNsZUVtaXR0ZXIodGhpcy5nYW1lUmVuZGVyZXIsIHRoaXMucG9zLCB0cnVlLCB0eXBlLCA4MDAsIDUsIDIwKTtcblxuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlci5hZGRUb01haW5Db250YWluZXIodGhpcy5yZWNvdXJjZVNwcml0ZSk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBkZXN0cm95KCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLnBhcnRpY2xlRW1pdHRlci5kZXN0cm95KCk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyB1cGRhdGUoZGVsdGEgOiBudW1iZXIpe1xuICAgICAgICBVdGlscy5zZXRTcHJpdGVWaWV3cG9ydFBvcyh0aGlzLnJlY291cmNlU3ByaXRlLCBuZXcgVmVjdG9yMkQodGhpcy5wb3MueCAtIHRoaXMub2Zmc2V0LngsIHRoaXMucG9zLnkgLSB0aGlzLm9mZnNldC55KSk7XG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyLnJlbW92ZUZyb21NYWluQ29udGFpbmVyKHRoaXMucmVjb3VyY2VTcHJpdGUpO1xuICAgICAgICB0aGlzLnBhcnRpY2xlRW1pdHRlci51cGRhdGUodGhpcy5wYXJ0aWNsZUVtaXR0ZXIuZ2V0UG9zaXRpb24oKSwgZGVsdGEpO1xuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlci5hZGRUb01haW5Db250YWluZXIodGhpcy5yZWNvdXJjZVNwcml0ZSk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXRQb3NpdGlvbigpIDogVmVjdG9yMkRcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcztcbiAgICB9XG5cbn0iLCJpbXBvcnQge0xvZ2dlcn0gZnJvbSBcIi4uL3V0aWxzL0xvZ2dlclwiO1xuaW1wb3J0IHtDb25maWd9IGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL3BsYXllci9QbGF5ZXJcIjtcbmltcG9ydCBDb21tdW5pY2F0aW9uTWFuYWdlciBmcm9tIFwiLi4vY29tbXVuaWNhdGlvbi9Db21tdW5pY2F0aW9uTWFuYWdlclwiO1xuaW1wb3J0IEdhbWVSZW5kZXJlciBmcm9tIFwiLi4vdXRpbHMvUmVuZGVyZXJcIjtcbmltcG9ydCBDYW1lcmEgZnJvbSBcIi4uL3V0aWxzL0NhbWVyYVwiO1xuaW1wb3J0IHtJbnB1dH0gZnJvbSBcIi4uL3V0aWxzL0lucHV0XCI7XG5pbXBvcnQgVmVjdG9yMkQgZnJvbSBcIi4uL3V0aWxzL1ZlY3RvcjJEXCI7XG5pbXBvcnQgUmVzb3VyY2UgZnJvbSBcIi4vUmVzb3VyY2VcIjtcblxudmFyIGxvZyA9IExvZ2dlcihcIkNvbW11bmljYXRpb25NYW5hZ2VyXCIpO1xuXG5jbGFzcyBSZXNvdXJjZU1hbmFnZXIge1xuXG4gICAgcHJvdGVjdGVkIGNvbW11bmljYXRpb25NYW5hZ2VyIDogQ29tbXVuaWNhdGlvbk1hbmFnZXI7XG4gICAgcHJvdGVjdGVkIGdhbWVSZW5kZXJlciA6IEdhbWVSZW5kZXJlcjtcblxuICAgIHByb3RlY3RlZCByZXNvdXJjZXMgOiBSZXNvdXJjZVtdO1xuXG4gICAgXG4gICAgY29uc3RydWN0b3IoY29tbXVuaWNhdGlvbk1hbmFnZXIgOiBDb21tdW5pY2F0aW9uTWFuYWdlciwgZ2FtZVJlbmRlcmVyOiBHYW1lUmVuZGVyZXIpXG4gICAge1xuICAgICAgICB0aGlzLmNvbW11bmljYXRpb25NYW5hZ2VyID0gY29tbXVuaWNhdGlvbk1hbmFnZXI7XG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyID0gZ2FtZVJlbmRlcmVyO1xuICAgICAgICB0aGlzLmNvbW11bmljYXRpb25NYW5hZ2VyLm9uKCdtYXRjaCBkYXRhJywgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBpZighdGhpcy5yZXNvdXJjZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gZGF0YS5tYXRjaC5yZXNvdXJjZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXNbaV0gPSBuZXcgUmVzb3VyY2UodGhpcy5nYW1lUmVuZGVyZXIsIGRhdGEubWF0Y2gucmVzb3VyY2VzW2ldLnBvc2l0aW9uLCBkYXRhLm1hdGNoLnJlc291cmNlc1tpXS50eXBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5jb21tdW5pY2F0aW9uTWFuYWdlci5vbigncmVzb3VyY2VzIGNoYW5nZWQnLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGZvcih2YXIgaSBpbiB0aGlzLnJlc291cmNlcylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlc1tpXS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSBpbiBkYXRhLnJlc291cmNlcylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlc1tpXSA9IG5ldyBSZXNvdXJjZSh0aGlzLmdhbWVSZW5kZXJlciwgZGF0YS5yZXNvdXJjZXNbaV0ucG9zaXRpb24sIGRhdGEucmVzb3VyY2VzW2ldLnR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIFxuICAgIHB1YmxpYyB1cGRhdGUoZGVsdGEpXG4gICAge1xuICAgICAgICBmb3IodmFyIGkgaW4gdGhpcy5yZXNvdXJjZXMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzW2ldLnVwZGF0ZShkZWx0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXNvdXJjZU1hbmFnZXI7XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbGlic3NyYy9qcXVlcnktMi4xLjQuZC50c1wiIC8+XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9nYW1lXCI7XG5pbXBvcnQgQXNzZXRMb2FkZXIgZnJvbSBcIi4vdXRpbHMvQXNzZXRMb2FkZXJcIjtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBBc3NldExvYWRlci5vbkNvbnRlbnRMb2FkZWQoZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdmFyIGdhbWUgOiBHYW1lID0gbmV3IEdhbWUoKSxcbiAgICAgICAgICAgIGxhc3RUaW1lIDogbnVtYmVyID0gMCxcbiAgICAgICAgICAgIGRlbHRhIDogbnVtYmVyO1xuXG4gICAgICAgIGZ1bmN0aW9uIG1haW5Mb29wKHRpbWUgOiBudW1iZXIpIHtcblxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSggbWFpbkxvb3AgKTtcbiAgICAgICAgICAgIGRlbHRhID0gdGltZSAtIGxhc3RUaW1lO1xuICAgICAgICAgICAgZ2FtZS51cGRhdGUoZGVsdGEpO1xuICAgICAgICAgICAgZ2FtZS5yZW5kZXIoKTtcbiAgICAgICAgICAgIGxhc3RUaW1lID0gdGltZTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBtYWluTG9vcCApO1xuICAgIH0pO1xufSk7IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2xpYnNzcmMvY3JlYXRlanMtbGliLmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2xpYnNzcmMvcHJlbG9hZGpzLmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2xpYnNzcmMvc291bmRqcy5kLnRzXCIgLz5cbmltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiLi4vdXRpbHMvTG9nZ2VyXCI7XG5cbnZhciBhc3NldHMgOiBhbnkgPSBbXG4gICAgICAgIHtzcmM6XCJhc3NldHMvaW1nL3Rlc3QucG5nXCIsIGlkOlwiVGVzdEltYWdlXCJ9LFxuICAgICAgICB7c3JjOlwiYXNzZXRzL2ltZy9wYXJ0aWNsZS5wbmdcIiwgaWQ6XCJub25lXCJ9LFxuICAgICAgICB7c3JjOlwiYXNzZXRzL2ltZy90cmlhbmdsZS5wbmdcIiwgaWQ6XCJUcmlhbmdsZVwifSxcbiAgICAgICAge3NyYzpcImFzc2V0cy9pbWcvcGVudGFnb24ucG5nXCIsIGlkOlwiUGVudGFnb25cIn0sXG4gICAgICAgIHtzcmM6XCJhc3NldHMvaW1nL3NxdWFyZS5wbmdcIiwgaWQ6XCJTcXVhcmVcIn0sXG4gICAgICAgIHtzcmM6XCJhc3NldHMvYXVkaW8vdGVzdC53YXZcIiwgaWQ6XCJUZXN0U291bmRcIn0sXG4gICAgICAgIHtzcmM6XCJhc3NldHMvaW1nL3Rlc3RQbGF5ZXIucG5nXCIsIGlkOlwiVGVzdFBsYXllclwifSxcbiAgICAgICAge3NyYzpcImFzc2V0cy9pbWcvdGlsZXNldC5wbmdcIiwgaWQ6XCJ0aWxlc2V0XCJ9LFxuICAgICAgICB7c3JjOlwiYXNzZXRzL2ltZy9jcmFmdGluZ2FyZWEucG5nXCIsIGlkOlwiQ3JhZnRpbmdBcmVhXCJ9LFxuICAgIF0sIGxvZyA9IExvZ2dlcihcIkFzc2V0TG9hZGVyXCIpO1xuXG5jbGFzcyBBc3NldExvYWRlclxue1xuICAgIHByaXZhdGUgYXNzZXRNYW5pZmVzdCA6IGFueTtcbiAgICBwcml2YXRlIGFzc2V0UXVldWUgOiBjcmVhdGVqcy5Mb2FkUXVldWU7XG4gICAgcHJpdmF0ZSBsb2FkZWRDYWxsYmFja3MgOiBBcnJheTwoKSA9PiB2b2lkPjtcblxuICAgIGNvbnN0cnVjdG9yKG1hbmlmZXN0IDogYW55KVxuICAgIHtcbiAgICAgICAgbG9nLnRyYWNlKFwiSW5pdGlhbGl6aW5nXCIpO1xuICAgICAgICB0aGlzLmFzc2V0TWFuaWZlc3QgPSBtYW5pZmVzdDtcbiAgICAgICAgdGhpcy5hc3NldFF1ZXVlID0gbmV3IGNyZWF0ZWpzLkxvYWRRdWV1ZSh0cnVlKTtcbiAgICAgICAgdGhpcy5sb2FkZWRDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5sb2FkQ29udGVudCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZENvbnRlbnQoKSB7XG4gICAgICAgIGxvZy50cmFjZShcIkxvYWRpbmcgY29udGVudC5cIik7XG4gICAgICAgIGNyZWF0ZWpzLlNvdW5kLmFsdGVybmF0ZUV4dGVuc2lvbnMgPSBbXCJtcDNcIl07XG4gICAgICAgIHRoaXMuYXNzZXRRdWV1ZS5pbnN0YWxsUGx1Z2luKCgpID0+IHtyZXR1cm4gY3JlYXRlanMuU291bmR9KTtcbiAgICAgICAgdGhpcy5hc3NldFF1ZXVlLm9uKFwiY29tcGxldGVcIiwgdGhpcy5sb2FkQ29tcGxldGUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuYXNzZXRRdWV1ZS5vbihcImVycm9yXCIsIHRoaXMubG9hZEVycm9yKTtcbiAgICAgICAgdGhpcy5hc3NldFF1ZXVlLmxvYWRNYW5pZmVzdChhc3NldHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZEVycm9yKGV2ZW50IDogYW55KSB7XG4gICAgICAgIGxvZy5lcnJvcihcIlRoZXJlIHdhcyBhbiBlcnJvciB3aGlsZSBsb2FkaW5nIGFzc2V0czpcIik7XG4gICAgICAgIGxvZy5lcnJvcihldmVudCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkQ29tcGxldGUoZXZlbnQgOiBhbnkpIHtcbiAgICAgICAgbG9nLnRyYWNlKFwiQ29tcGxldGVkIExvYWRpbmcgYXNzZXRzLlwiKTtcbiAgICAgICAgdGhpcy5leGVjdXRlQ2FsbGJhY2tzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENvbnRlbnQoaWQgOiBzdHJpbmcpXG4gICAge1xuICAgICAgICBsb2cudHJhY2UoXCJHZXR0aW5nIGNvbnRlbnQgd2l0aCBpZFxcXCJcIitpZCtcIlxcXCJcIik7XG4gICAgICAgIHJldHVybiB0aGlzLmFzc2V0UXVldWUuZ2V0UmVzdWx0KGlkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGV4ZWN1dGVDYWxsYmFja3MoKXtcbiAgICAgICAgbG9nLnRyYWNlKFwiRXhlY3V0aW5nIG9uTG9hZCBjYWxsYmFja3MuXCIpO1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sb2FkZWRDYWxsYmFja3MubGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVkQ2FsbGJhY2tzW2ldKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgb25Db250ZW50TG9hZGVkKGNhbGxiYWNrIDogKCkgPT4gdm9pZClcbiAgICB7XG4gICAgICAgIGxvZy50cmFjZShcIlJlZ2lzdGVyaW5nIG9uTG9hZCBjYWxsYmFjay5cIik7XG4gICAgICAgIGlmKHRoaXMuYXNzZXRRdWV1ZS5sb2FkZWQpIGNhbGxiYWNrKCk7XG4gICAgICAgIGVsc2UgdGhpcy5sb2FkZWRDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQXNzZXRMb2FkZXIoYXNzZXRzKTsiLCJpbXBvcnQge0NvbmZpZ30gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IFZlY3RvcjJEIGZyb20gXCIuL1ZlY3RvcjJEXCI7XG5cbmNsYXNzIENhbWVyYVxue1xuICAgIHByaXZhdGUgcG9zaXRpb24gOiBWZWN0b3IyRDtcblxuICAgIGNvbnN0cnVjdG9yKClcbiAgICB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yMkQoMCwwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q2FtZXJhUG9zaXRpb24ocG9zIDogVmVjdG9yMkQpXG4gICAge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zXG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXRDYW1lcmFQb3NpdGlvbigpIDogVmVjdG9yMkRcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgZ2V0Vmlld1BvcnRDb29yZGluYXRlcyhtYXBDb29yZGluYXRlcyA6IFZlY3RvcjJEKVxuICAgIHtcbiAgICAgICAgdmFyIG5ld1Bvc2l0aW9uID0gVmVjdG9yMkQuc3ViVmVjKG1hcENvb3JkaW5hdGVzLCB0aGlzLnBvc2l0aW9uKTtcblxuICAgICAgICBuZXdQb3NpdGlvbi5hZGQobmV3IFZlY3RvcjJEKENvbmZpZy5TVEFHRV9XSURUSC8yLCBDb25maWcuU1RBR0VfSEVJR0hULzIpKTtcblxuICAgICAgICByZXR1cm4gbmV3UG9zaXRpb247XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ2FtZXJhKCk7IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2xpYnNzcmMvanF1ZXJ5LTIuMS40LmQudHNcIiAvPlxuaW1wb3J0IHtMb2dnZXJ9IGZyb20gXCIuLi91dGlscy9Mb2dnZXJcIjtcblxuZXhwb3J0IG1vZHVsZSBJbnB1dFxue1xuICAgIC8vRGVmaW5lIGFsbCBidXR0b25zL2FjdGlvbnMgd2hpY2ggYXJlIHBvc3NpYmxlIGhlcmVcbiAgICBleHBvcnQgZW51bSBCdXR0b25ze1xuICAgICAgICBKVU1QLFxuICAgICAgICBMRUZULFxuICAgICAgICBSSUdIVCxcbiAgICAgICAgVVAsXG4gICAgICAgIERPV05cbiAgICB9XG5cbiAgICBleHBvcnQgZW51bSBNb3VzZUJ1dHRvbnN7XG4gICAgICAgIExFRlQgPSAxLFxuICAgICAgICBSSUdIVCA9IDMsXG4gICAgICAgIE1JRERMRSA9IDJcbiAgICB9XG5cblxuICAgIC8vRGVmaW5lIGFkZGl0aW9uYWwgaW5wdXQsIHdoaWNoIGlzIG5vdCBtYXBwZWQgdG8gdGhlIGtleWJvYXJkIGhlcmVcbiAgICBleHBvcnQgZW51bSBDdXN0b21JbnB1dHtcbiAgICAgICAgWF9BWElTLFxuICAgICAgICBZX0FYSVMsXG4gICAgICAgIExFRlRfQ0xJQ0ssXG4gICAgICAgIFJJR0hUX0NMSUNLLFxuICAgICAgICBNSURETEVfQ0xJQ0tcbiAgICB9XG5cbiAgICAvL0FjdHVhbCBwbGF5ZXIgaW5wdXQuIFVzZSB0aGlzIHRvIGNyZWF0ZSBrZXkgYmluZGluZ3MgZm9yIG11bHRpcGxlIHBsYXllcnMuXG4gICAgZXhwb3J0IGNsYXNzIFBsYXllcklucHV0XG4gICAge1xuICAgICAgICBwcm90ZWN0ZWQga2V5QmluZGluZ3MgOiB7W2lkOiBudW1iZXJdIDogbnVtYmVyO31cbiAgICAgICAgcHJvdGVjdGVkIGtleVByZXNzZWRNYXAgOiB7W2lkOiBudW1iZXJdIDogbnVtYmVyO31cbiAgICAgICAgcHJvdGVjdGVkIG1vdXNlS2V5UHJlc3NlZE1hcCA6IHtbaWQ6IG51bWJlcl0gOiBudW1iZXI7fVxuICAgICAgICBwcm90ZWN0ZWQgY3VzdG9tQmluZGluZ3MgOiB7W2lkOiBudW1iZXJdIDogKCkgPT4gbnVtYmVyO31cbiAgICAgICAgcHJvdGVjdGVkIHhBeGlzQ2FsbGJhY2sgOiAoKSA9PiBudW1iZXI7XG4gICAgICAgIHByb3RlY3RlZCB5QXhpc0NhbGxiYWNrIDogKCkgPT4gbnVtYmVyO1xuICAgICAgICBwcm90ZWN0ZWQgbW91c2VYIDogbnVtYmVyO1xuICAgICAgICBwcm90ZWN0ZWQgbW91c2VZIDogbnVtYmVyO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyICRkb2N1bWVudCA6IEpRdWVyeSA9ICQoZG9jdW1lbnQpO1xuICAgICAgICAgICAgJGRvY3VtZW50LmtleWRvd24odGhpcy5vbktleURvd24uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkZG9jdW1lbnQua2V5dXAodGhpcy5vbktleVVwLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJGRvY3VtZW50Lm1vdXNlZG93bih0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJGRvY3VtZW50Lm1vdXNldXAodGhpcy5vbk1vdXNlVXAuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmtleUJpbmRpbmdzID0ge307XG4gICAgICAgICAgICB0aGlzLmtleVByZXNzZWRNYXAgPSB7fTtcbiAgICAgICAgICAgIHRoaXMubW91c2VLZXlQcmVzc2VkTWFwID0ge307XG4gICAgICAgICAgICB0aGlzLmN1c3RvbUJpbmRpbmdzID0ge307XG5cbiAgICAgICAgICAgIC8vbW91c2UgbW92ZW1lbnRcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZW1vdmUnLGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIHRoaXMubW91c2VYID0gZS5wYWdlWDtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlWSA9IGUucGFnZVk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICAvL1NldHRpbmcgc29tZSBzdGFuZGFyZCBjYWxsYmFjayBmdW5jdGlvbnMgZm9yIHggYW5kIHkgYXhpc1xuICAgICAgICAgICAgdGhpcy54QXhpc0NhbGxiYWNrID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzQnV0dG9uUHJlc3NlZChCdXR0b25zLkxFRlQpKSByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5pc0J1dHRvblByZXNzZWQoQnV0dG9ucy5SSUdIVCkpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy55QXhpc0NhbGxiYWNrID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzQnV0dG9uUHJlc3NlZChCdXR0b25zLlVQKSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuaXNCdXR0b25QcmVzc2VkKEJ1dHRvbnMuRE9XTikpIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldEtleWJvYXJkQmluZGluZyhidXR0b24gOiBCdXR0b25zLCBrZXkgOiBudW1iZXIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMua2V5QmluZGluZ3NbYnV0dG9uXSA9IGtleTtcbiAgICAgICAgICAgIHRoaXMua2V5UHJlc3NlZE1hcFtrZXldID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBzZXRDdXN0b21CaW5kaW5nKGlucHV0TmFtZSA6IEN1c3RvbUlucHV0LCBjdXJyZW50VmFsdWVGdW5jdGlvbiA6ICgpID0+IG51bWJlciApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tQmluZGluZ3NbaW5wdXROYW1lXSA9IGN1cnJlbnRWYWx1ZUZ1bmN0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldFhBeGlzQ2FsbGJhY2soY2FsbGJhY2sgOiAoKSA9PiBudW1iZXIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMueEF4aXNDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHNldFlBeGlzQ2FsbGJhY2soY2FsbGJhY2sgOiAoKSA9PiBudW1iZXIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMueUF4aXNDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldFhBeGlzKCkgOiBudW1iZXJcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMueEF4aXNDYWxsYmFjaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldFlBeGlzKCkgOiBudW1iZXJcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMueUF4aXNDYWxsYmFjaygpO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgZ2V0TW91c2VYKCkgOiBudW1iZXJcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubW91c2VYO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldE1vdXNlWSgpIDogbnVtYmVyXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vdXNlWTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaWxsIHJldHVybiB0cnVlIGlmIEJ1dHRvbiBpcyBiZWluZyBwcmVzc2VkIGF0IHRoZSB0aW1lIG9mIHRoaXMgZnVuY3Rpb24gY2FsbC5cbiAgICAgICAgICogQHBhcmFtIGJ1dHRvblxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBpc0J1dHRvblByZXNzZWQoYnV0dG9uIDogQnV0dG9ucykgOiBib29sZWFuXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmtleVByZXNzZWRNYXBbdGhpcy5rZXlCaW5kaW5nc1tidXR0b25dXSA9PT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBpc01vdXNlQnV0dG9uUHJlc3NlZChidXR0b24gOiBNb3VzZUJ1dHRvbnMpIDogYm9vbGVhblxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tb3VzZUtleVByZXNzZWRNYXBbYnV0dG9uXSA9PT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRDdXN0b21JbnB1dFZhbHVlKGlucHV0TmFtZSA6IEN1c3RvbUlucHV0KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXN0b21CaW5kaW5nc1tpbnB1dE5hbWVdKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgb25LZXlEb3duKGUgOiBhbnkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBrZXlDb2RlID0gZS53aGljaDtcbiAgICAgICAgICAgIHRoaXMua2V5UHJlc3NlZE1hcFtrZXlDb2RlXSA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgb25LZXlVcChlIDogYW55KVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIga2V5Q29kZSA9IGUud2hpY2g7XG4gICAgICAgICAgICB0aGlzLmtleVByZXNzZWRNYXBba2V5Q29kZV0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIG9uTW91c2VEb3duKGUgOiBhbnkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBrZXlDb2RlID0gZS53aGljaDtcbiAgICAgICAgICAgIHRoaXMubW91c2VLZXlQcmVzc2VkTWFwW2tleUNvZGVdID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RlY3RlZCBvbk1vdXNlVXAoZSA6IGFueSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGtleUNvZGUgPSBlLndoaWNoO1xuICAgICAgICAgICAgdGhpcy5tb3VzZUtleVByZXNzZWRNYXBba2V5Q29kZV0gPSAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGVudW0gS2V5Q29kZXN7XG4gICAgICAgIEJBQ0tTUEFDRT0gOCxcbiAgICAgICAgVEFCPSA5LFxuICAgICAgICBFTlRFUj0gMTMsXG4gICAgICAgIFNISUZUPSAxNixcbiAgICAgICAgQ1RSTD0gMTcsXG4gICAgICAgIEFMVD0gMTgsXG4gICAgICAgIFBBVVNFPSAxOSxcbiAgICAgICAgQ0FQU19MT0NLPSAyMCxcbiAgICAgICAgRVNDQVBFPSAyNyxcbiAgICAgICAgU1BBQ0U9IDMyLFxuICAgICAgICBQQUdFX1VQPSAzMyxcbiAgICAgICAgUEFHRV9ET1dOPSAzNCxcbiAgICAgICAgRU5EPSAzNSxcbiAgICAgICAgSE9NRT0gMzYsXG4gICAgICAgIExFRlRfQVJST1c9IDM3LFxuICAgICAgICBVUF9BUlJPVz0gMzgsXG4gICAgICAgIFJJR0hUX0FSUk9XPSAzOSxcbiAgICAgICAgRE9XTl9BUlJPVz0gNDAsXG4gICAgICAgIElOU0VSVD0gNDUsXG4gICAgICAgIERFTEVURT0gNDYsXG4gICAgICAgIEtFWV8wPSA0OCxcbiAgICAgICAgS0VZXzE9IDQ5LFxuICAgICAgICBLRVlfMj0gNTAsXG4gICAgICAgIEtFWV8zPSA1MSxcbiAgICAgICAgS0VZXzQ9IDUyLFxuICAgICAgICBLRVlfNT0gNTMsXG4gICAgICAgIEtFWV82PSA1NCxcbiAgICAgICAgS0VZXzc9IDU1LFxuICAgICAgICBLRVlfOD0gNTYsXG4gICAgICAgIEtFWV85PSA1NyxcbiAgICAgICAgQT0gNjUsXG4gICAgICAgIEI9IDY2LFxuICAgICAgICBDPSA2NyxcbiAgICAgICAgRD0gNjgsXG4gICAgICAgIEU9IDY5LFxuICAgICAgICBGPSA3MCxcbiAgICAgICAgRz0gNzEsXG4gICAgICAgIEg9IDcyLFxuICAgICAgICBJPSA3MyxcbiAgICAgICAgSj0gNzQsXG4gICAgICAgIEs9IDc1LFxuICAgICAgICBMPSA3NixcbiAgICAgICAgTT0gNzcsXG4gICAgICAgIE49IDc4LFxuICAgICAgICBPPSA3OSxcbiAgICAgICAgUD0gODAsXG4gICAgICAgIFE9IDgxLFxuICAgICAgICBSPSA4MixcbiAgICAgICAgUz0gODMsXG4gICAgICAgIFQ9IDg0LFxuICAgICAgICBVPSA4NSxcbiAgICAgICAgVj0gODYsXG4gICAgICAgIFc9IDg3LFxuICAgICAgICBYPSA4OCxcbiAgICAgICAgWT0gODksXG4gICAgICAgIFo9IDkwLFxuICAgICAgICBMRUZUX01FVEE9IDkxLFxuICAgICAgICBSSUdIVF9NRVRBPSA5MixcbiAgICAgICAgU0VMRUNUPSA5MyxcbiAgICAgICAgTlVNUEFEXzA9IDk2LFxuICAgICAgICBOVU1QQURfMT0gOTcsXG4gICAgICAgIE5VTVBBRF8yPSA5OCxcbiAgICAgICAgTlVNUEFEXzM9IDk5LFxuICAgICAgICBOVU1QQURfND0gMTAwLFxuICAgICAgICBOVU1QQURfNT0gMTAxLFxuICAgICAgICBOVU1QQURfNj0gMTAyLFxuICAgICAgICBOVU1QQURfNz0gMTAzLFxuICAgICAgICBOVU1QQURfOD0gMTA0LFxuICAgICAgICBOVU1QQURfOT0gMTA1LFxuICAgICAgICBNVUxUSVBMWT0gMTA2LFxuICAgICAgICBBREQ9IDEwNyxcbiAgICAgICAgU1VCVFJBQ1Q9IDEwOSxcbiAgICAgICAgREVDSU1BTD0gMTEwLFxuICAgICAgICBESVZJREU9IDExMSxcbiAgICAgICAgRjE9IDExMixcbiAgICAgICAgRjI9IDExMyxcbiAgICAgICAgRjM9IDExNCxcbiAgICAgICAgRjQ9IDExNSxcbiAgICAgICAgRjU9IDExNixcbiAgICAgICAgRjY9IDExNyxcbiAgICAgICAgRjc9IDExOCxcbiAgICAgICAgRjg9IDExOSxcbiAgICAgICAgRjk9IDEyMCxcbiAgICAgICAgRjEwPSAxMjEsXG4gICAgICAgIEYxMT0gMTIyLFxuICAgICAgICBGMTI9IDEyMyxcbiAgICAgICAgTlVNX0xPQ0s9IDE0NCxcbiAgICAgICAgU0NST0xMX0xPQ0s9IDE0NSxcbiAgICAgICAgU0VNSUNPTE9OPSAxODYsXG4gICAgICAgIEVRVUFMUz0gMTg3LFxuICAgICAgICBDT01NQT0gMTg4LFxuICAgICAgICBEQVNIPSAxODksXG4gICAgICAgIFBFUklPRD0gMTkwLFxuICAgICAgICBGT1JXQVJEX1NMQVNIPSAxOTEsXG4gICAgICAgIEdSQVZFX0FDQ0VOVD0gMTkyLFxuICAgICAgICBPUEVOX0JSQUNLRVQ9IDIxOSxcbiAgICAgICAgQkFDS19TTEFTSD0gMjIwLFxuICAgICAgICBDTE9TRV9CUkFDS0VUPSAyMjEsXG4gICAgICAgIFNJTkdMRV9RVU9URT0gMjIyXG4gICAgfVxuXG5cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vbGlic3NyYy9qc25sb2cuZC50c1wiLz5cblxuaW1wb3J0IEpTTkxvZ0NvbnNvbGVBcHBlbmRlciA9IEpTTkxvZy5KU05Mb2dDb25zb2xlQXBwZW5kZXI7XG5pbXBvcnQgSlNOTG9nTG9nZ2VyID0gSlNOTG9nLkpTTkxvZ0xvZ2dlcjtcbmltcG9ydCBKU05Mb2dBcHBlbmRlciA9IEpTTkxvZy5KU05Mb2dBcHBlbmRlcjtcbmltcG9ydCB7Q29uZmlnfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBMb2dnZXIobG9nZ2VyTmFtZSA6IHN0cmluZykgOiBKU05Mb2dMb2dnZXJcbntcbiAgICB2YXIgY29uc29sZUFwcGVuZGVyIDogSlNOTG9nQ29uc29sZUFwcGVuZGVyID0gSkwuY3JlYXRlQ29uc29sZUFwcGVuZGVyKFwiQ29uc29sZUFwcGVuZGVyXCIpO1xuICAgIHZhciBzZXJ2ZXJBcHBlbmRlciA6IEpTTkxvZ0NvbnNvbGVBcHBlbmRlciA9IEpMLmNyZWF0ZUFqYXhBcHBlbmRlcihcIkNvbnNvbGVBcHBlbmRlclwiKTtcbiAgICB2YXIgYXBwZW5kZXJzIDogSlNOTG9nQXBwZW5kZXJbXSA9IFtdO1xuICAgIGlmKENvbmZpZy5MT0dfVE9fQ09OU09MRSkgYXBwZW5kZXJzLnB1c2goY29uc29sZUFwcGVuZGVyKTtcbiAgICBpZihDb25maWcuTE9HX1RPX1NFUlZFUikgYXBwZW5kZXJzLnB1c2goc2VydmVyQXBwZW5kZXIpO1xuICAgIHZhciBsb2dnZXIgOiBKU05Mb2dMb2dnZXIgPSBKTChsb2dnZXJOYW1lKS5zZXRPcHRpb25zKHtcImFwcGVuZGVyc1wiOiBhcHBlbmRlcnMsIGxldmVsOiBDb25maWcuTE9HX0xFVkVMfSk7XG5cbiAgICByZXR1cm4gbG9nZ2VyO1xufVxuXG5leHBvcnQgdmFyIExvZyA6IEpTTkxvZ0xvZ2dlciA9IExvZ2dlcihDb25maWcuQVBQTElDQVRJT05fTkFNRSk7IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2xpYnNzcmMvcGl4aS5qcy5kLnRzXCIgLz5cbmltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiLi4vdXRpbHMvTG9nZ2VyXCI7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuXG52YXIgbG9nID0gTG9nZ2VyKFwiR2FtZVJlbmRlcmVyXCIpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lUmVuZGVyZXJcbntcbiAgICBwcml2YXRlIGdhbWVSZW5kZXJlciA6IFBJWEkuU3lzdGVtUmVuZGVyZXI7XG4gICAgcHJpdmF0ZSBtYWluQ29udGFpbmVyIDogUElYSS5Db250YWluZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpXG4gICAge1xuICAgICAgICBsb2cudHJhY2UoXCJJbml0aWFsaXppbmcgR2FtZXIgUmVuZGVyZXIuXCIpO1xuICAgICAgICB0aGlzLmdhbWVSZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKENvbmZpZy5TVEFHRV9XSURUSCwgQ29uZmlnLlNUQUdFX0hFSUdIVCk7XG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyLmJhY2tncm91bmRDb2xvciA9IENvbmZpZy5CR19DT0xPUjtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmdhbWVSZW5kZXJlci52aWV3KTtcbiAgICAgICAgdGhpcy5tYWluQ29udGFpbmVyID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFRvTWFpbkNvbnRhaW5lcihzcHJpdGUgOiBQSVhJLlNwcml0ZXxQSVhJLkNvbnRhaW5lcilcbiAgICB7XG4gICAgICAgIGxvZy50cmFjZShcIkFkZGluZyBzb21ldGhpbmcgdG8gbWFpbiBjb250YWluZXIuXCIpO1xuICAgICAgICB0aGlzLm1haW5Db250YWluZXIuYWRkQ2hpbGQoc3ByaXRlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlRnJvbU1haW5Db250YWluZXIoc3ByaXRlIDogUElYSS5TcHJpdGV8UElYSS5Db250YWluZXIpXG4gICAge1xuICAgICAgICBsb2cudHJhY2UoXCJSZW1vdmluZyBzb21ldGhpbmcgZnJvbSBtYWluIGNvbnRhaW5lci5cIik7XG4gICAgICAgIHRoaXMubWFpbkNvbnRhaW5lci5yZW1vdmVDaGlsZChzcHJpdGUpO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgcmVuZGVyKClcbiAgICB7XG4gICAgICAgIHRoaXMuZ2FtZVJlbmRlcmVyLnJlbmRlcih0aGlzLm1haW5Db250YWluZXIpO1xuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgVmVjdG9yMkQgZnJvbSBcIi4vVmVjdG9yMkRcIjtcbmltcG9ydCBDYW1lcmEgZnJvbSBcIi4vQ2FtZXJhXCI7XG5cbmNsYXNzIFV0aWxzXG57XG4gICAgcHVibGljIHN0YXRpYyBzZXRTcHJpdGVWaWV3cG9ydFBvcyhzcHJpdGUgOiBQSVhJLlNwcml0ZSwgbWFwUG9zaXRpb24gOiBWZWN0b3IyRClcbiAgICB7XG4gICAgICAgIHZhciBuZXdQb3NpdGlvbiA9IENhbWVyYS5nZXRWaWV3UG9ydENvb3JkaW5hdGVzKG1hcFBvc2l0aW9uKTtcbiAgICAgICAgc3ByaXRlLnBvc2l0aW9uLnggPSBNYXRoLnJvdW5kKG5ld1Bvc2l0aW9uLngpO1xuICAgICAgICBzcHJpdGUucG9zaXRpb24ueSA9IE1hdGgucm91bmQobmV3UG9zaXRpb24ueSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjb2xvck1ha2VCcmlnaHRlcihjb2xvciA6IG51bWJlciwgcGVyY2VudCA6IG51bWJlcikgOiBudW1iZXJ7XG4gICAgdmFyIGhleCA9IGNvbG9yLnRvU3RyaW5nKDE2KSwgbWlzc2luZ1plcm9lcyA9IDAsIGk7XG5cbiAgICBtaXNzaW5nWmVyb2VzID0gNiAtIGhleC5sZW5ndGg7XG5cbiAgICBmb3IoaSA9IDA7IGkgPCBtaXNzaW5nWmVyb2VzOyBpKyspXG4gICAge1xuICAgICAgICBoZXggPSBcIjBcIitoZXg7XG4gICAgfVxuXG4gICAgdmFyIHIgPSBwYXJzZUludChoZXguc3Vic3RyKDAsIDIpLCAxNiksXG4gICAgICAgIGcgPSBwYXJzZUludChoZXguc3Vic3RyKDIsIDIpLCAxNiksXG4gICAgICAgIGIgPSBwYXJzZUludChoZXguc3Vic3RyKDQsIDIpLCAxNik7XG5cbiAgICByZXR1cm4gcGFyc2VJbnQoKCgwfCgxPDw4KSArIHIgKyAoMjU2IC0gcikgKiBwZXJjZW50IC8gMTAwKS50b1N0cmluZygxNikpLnN1YnN0cigxKSArXG4gICAgICAgICgoMHwoMTw8OCkgKyBnICsgKDI1NiAtIGcpICogcGVyY2VudCAvIDEwMCkudG9TdHJpbmcoMTYpKS5zdWJzdHIoMSkgK1xuICAgICAgICAoKDB8KDE8PDgpICsgYiArICgyNTYgLSBiKSAqIHBlcmNlbnQgLyAxMDApLnRvU3RyaW5nKDE2KSkuc3Vic3RyKDEpLCAxNik7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFV0aWxzOyIsImltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiLi4vdXRpbHMvTG9nZ2VyXCI7XG5cbnZhciBsb2cgPSBMb2dnZXIoXCJWZWN0b3IyRFwiKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVjdG9yMkRcbntcbiAgICBwdWJsaWMgeCA6IG51bWJlcjtcbiAgICBwdWJsaWMgeSA6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHggOiBudW1iZXIsIHkgOiBudW1iZXIpXG4gICAge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgYWRkVmVjKHYxOiBWZWN0b3IyRCwgdjIgOiBWZWN0b3IyRClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMkQodjEueCArIHYyLngsIHYxLnkgKyB2Mi55KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHN1YlZlYyh2MTogVmVjdG9yMkQsIHYyIDogVmVjdG9yMkQpXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjJEKHYxLnggLSB2Mi54LCB2MS55IC0gdjIueSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZCh2IDogVmVjdG9yMkQpIHtcbiAgICAgICAgdGhpcy54ICs9IHYueDtcbiAgICAgICAgdGhpcy55ICs9IHYueTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3ViKHYpIHtcbiAgICAgICAgdGhpcy54IC09IHYueDtcbiAgICAgICAgdGhpcy55IC09IHYueTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbGVuKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCp0aGlzLnggKyB0aGlzLnkqdGhpcy55KTtcbiAgICB9XG59Il19
