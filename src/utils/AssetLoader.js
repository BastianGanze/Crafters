"use strict";
/// <reference path="../../libssrc/createjs-lib.d.ts" />
/// <reference path="../../libssrc/preloadjs.d.ts" />
/// <reference path="../../libssrc/soundjs.d.ts" />
var Logger_1 = require("../utils/Logger");
var assets = [
    { src: "assets/img/test.png", id: "TestImage" },
    { src: "assets/audio/test.wav", id: "TestSound" },
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
        log.error(event.text);
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
//# sourceMappingURL=AssetLoader.js.map