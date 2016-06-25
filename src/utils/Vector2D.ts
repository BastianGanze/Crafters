import {Logger} from "../utils/Logger";

var log = Logger("Vector2D");

export default class Vector2D
{
    public x : number;
    public y : number;

    constructor(x : number, y : number)
    {
        this.x = x;
        this.y = y;
    }

    public static addVec(v1: Vector2D, v2 : Vector2D)
    {
        return new Vector2D(v1.x + v2.x, v1.y + v2.y);
    }

    public static subVec(v1: Vector2D, v2 : Vector2D)
    {
        return new Vector2D(v1.x - v2.x, v1.y - v2.y);
    }

    public add(v : Vector2D) {
        this.x += v.x;
        this.y += v.y;
    }

    public sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    public len() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
}