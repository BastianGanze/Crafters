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
    return GameRenderer;
}());
exports.__esModule = true;
exports["default"] = GameRenderer;
//# sourceMappingURL=Renderer.js.map