'use strict';

const Config = {

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
    MAP_MARGIN_X: 8,
    MAP_MARGIN_Y: 8,
    BOUNDARY_SIZE: {x: 32, y: 32},
    WS_DOMAIN: 'http://localhost:3000',
    CRAFTING_ZONE_DIAMETER: 32,
    CRAFTING_ZONE_DROP_DIAMETER: 20,
    CRAFTING_MAX_RESOURCES: { "Triangle" : 3, "Square" : 2, "Pentagon" : 1 },
    CRAFTING_RESOURCES: { "Triangle" : 0, "Square" : 0, "Pentagon" : 0 },

    RESOURCE_AREA: 32,
    RESOURCE_FARM_AREA: 64
    
};

module.exports = Config;