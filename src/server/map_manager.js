"use strict";

class MapManager {

    constructor(tileWidth, tileHeight, size) {
        this.width = tileWidth * size;
        this.height = tileHeight * size;
        this.size = size;

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.map = [];
        this.clearMap();
    }

    clearMap() {
        for (let y = 0; y < this.tileHeight; y++) {
            this.map[y] = [];
            for (let x = 0; x < this.tileWidth; x++) {
                this.map[y][x] = 0;
            }
        }
    }

    setTileAtPos(x, y, id) {
        this.map[y][x] = id;
    }

    loadMap(mapArray, tileWidth, tileHeight, size) {
        this.width = tileWidth * size;
        this.height = tileHeight * size;
        this.size = size;

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        assert(mapArray.length === this.tileHeight);
        assert(mapArray[0].length === this.tileWidth);

        this.map = mapArray;
    }

}

module.exports = MapManager;