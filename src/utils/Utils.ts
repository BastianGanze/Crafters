import Vector2D from "./Vector2D";
import Camera from "./Camera";

class Utils
{
    public static setSpriteViewportPos(sprite : PIXI.Sprite, mapPosition : Vector2D)
    {
        var newPosition = Camera.getViewPortCoordinates(mapPosition);
        sprite.position.x = Math.round(newPosition.x);
        sprite.position.y = Math.round(newPosition.y);
    }

    public static colorMakeBrighter(color : number, percent : number) : number{
    var hex = color.toString(16), missingZeroes = 0, i;

    missingZeroes = 6 - hex.length;

    for(i = 0; i < missingZeroes; i++)
    {
        hex = "0"+hex;
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return parseInt(((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
        ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
        ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1), 16);
    }

}

export default Utils;