import {Config} from "../config";
import Vector2D from "./Vector2D";

class Camera
{
    private position : Vector2D;

    constructor()
    {
        this.position = new Vector2D(0,0);
    }

    public setCameraPosition(pos : Vector2D)
    {
        this.position = pos
    }
    
    public getCameraPosition() : Vector2D
    {
        return this.position;
    }
    
    public getViewPortCoordinates(mapCoordinates : Vector2D)
    {
        var newPosition = Vector2D.subVec(mapCoordinates, this.position);

        newPosition.add(new Vector2D(Config.STAGE_WIDTH/2, Config.STAGE_HEIGHT/2));

        return newPosition;
    }
}

export default new Camera();