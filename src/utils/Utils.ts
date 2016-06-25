import Vector2D from "./Vector2D";
import Camera from "./Camera";

class Utils
{
    public static setSpriteViewportPos(sprite : PIXI.Sprite, mapPosition : Vector2D)
    {
        var newPosition = Camera.getViewPortCoordinates(mapPosition);
        sprite.position.x = newPosition.x;
        sprite.position.y = newPosition.y;
    }
}

export default Utils;