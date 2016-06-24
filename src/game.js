"use strict";
var Renderer_1 = require("./utils/Renderer");
var Logger_1 = require("./utils/Logger");
var log = Logger_1.Logger("Game");
var Game = (function () {
    function Game() {
        this.gameRenderer = new Renderer_1["default"]();
    }
    Game.prototype.update = function (delta) {
    };
    Game.prototype.render = function () {
    };
    return Game;
}());
exports.__esModule = true;
exports["default"] = Game;
//# sourceMappingURL=game.js.map