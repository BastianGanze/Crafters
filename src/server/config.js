'use strict';

let Config = {

    APPLICATION_NAME: "",
    DEBUG: true,
    LOG_TO_SERVER: false,
    LOG_TO_CONSOLE: true,
    STAGE_WIDTH: 1280,
    STAGE_HEIGHT: 720,
    BG_COLOR: 0x6495ED,
    MAP_SIZE_X: 64,
    MAP_SIZE_Y: 64,
    TILE_SIZE_X: 32,
    TILE_SIZE_Y: 32,
    MAP_MARGIN: 32*8,
    BOUNDARY_SIZE: {x: 32, y: 32},
    WS_DOMAIN: 'http://localhost:3000'

}

module.exports = Config;