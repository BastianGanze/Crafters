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
//# sourceMappingURL=start.js.map