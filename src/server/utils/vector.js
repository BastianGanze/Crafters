"use strict";

class Vector2D {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static zero() {
        return new Vector2D(0, 0);
    }

    addVec(v) {
        const x = this.x + v.x;
        const y = this.y + v.y;
        return new Vector2D(x, y);
    }

    addScalar(s) {
        const x = this.x + s;
        const y = this.y + s;
        return new Vector2D(x, y);
    }

    subVec(v) {
        const x = this.x - v.x;
        const y = this.y - v.y;
        return new Vector2D(x, y);
    }

    subSkalar(s) {
        const x = this.x - s;
        const y = this.y - s;
        return new Vector2D(x, y);
    }

    divSkalar(d) {
        const x = this.x / d;
        const y = this.y / d;
        return new Vector2D(x, y);
    }

    multSkalar(s) {
        const x = this.x * s;
        const y = this.y * s;
        return new Vector2D(x, y);
    }

    norm() {
        return Math.sqrt(x*x + y*y);
    }

    toString() {
        return `[ ${x}, ${y} ]`;
    }
}