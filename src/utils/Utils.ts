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
}

export default Utils;