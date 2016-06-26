"use strict";

const Config = require("./config");

class Resource {

    constructor(id, position, type, amount)
    {
        this.id = id;
        this.position = position;
        this.type = type;
        this.amount = amount;
        this.area = Config.RESOURCE_AREA;
        this.farmRange = Config.RESOURCE_FARM_AREA;
    }

    static resourceTypes() {
        return {
            Triangle : "Triangle",
            Square   : "Square",
            Pentagon : "Pentagon"
        };
    }

    static getResourceType(i) {
        switch (i) {
            case 0:
                return Resource.resourceTypes().Triangle;
                break;
            case 1:
                return Resource.resourceTypes().Square;
                break;
            case 2:
                return Resource.resourceTypes().Pentagon;
                break;

            default:
                return Resource.resourceTypes().Triangle;
        }
    }
}

module.exports = Resource;