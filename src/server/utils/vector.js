"use strict";

class Vector2D {

    constructor(x, y) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
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

    dot(v) {
        const a = v.abs();
        const b = this.abs();
        return (a * b);
    }

    abs() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    norm() {
        return new Vector2D(this.x / this.abs(), this.y / this.abs());
    }

    toString() {
        return `[ ${this.x}, ${this.y} ]`;
    }
}

module.exports = Vector2D;