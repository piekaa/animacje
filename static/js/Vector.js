import Matrix2D from "./Matrix.js";

class Vector {

    x = 0;
    y = 0;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static FromAngle(degrees) {
        let radian = degrees * 0.0174532925;
        return new Vector(Math.cos(radian), Math.sin(radian)).normalized();
    }

    static Direction(x1, y1, x2, y2) {
        return new Vector(x2 - x1, y2 - y1);
    }

    static FromMatrix(matrix) {
        return new Vector(matrix.x(), matrix.y());
    }

    static FromObject(obj) {
        return new Vector(obj.x, obj.y);
    }

    toAngleDegrees() {
        return Math.atan2(this.y, this.x) * 57.2957795;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalized() {
        if (this.x === 0) {
            return new Vector(0, 1);
        }

        const p = this.y / this.x;
        const x = Math.sqrt(1 / (p * p + 1));
        const y = p * x;
        return new Vector(this.#copySign(x, this.x), this.#copySign(y, this.y));
    }

    #copySign(a, b) {
        if (a * b < 0) {
            return a * -1;
        }
        return a;
    }

    multiply(v) {
        return new Vector(this.x * v, this.y * v);
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    toTranslationMatrix() {
        return Matrix2D.Translation(this.x, this.y);
    }

    display() {
        console.log(`x: ${this.x}, y: ${this.y}`);
    }

    // step is value from 0 to 1
    lerpClamp(vector, step) {
        step = Math.min(step, 1);
        step = Math.max(step, 0);
        return new Vector(
            (vector.x - this.x) * step + this.x,
            (vector.y - this.y) * step + this.y
        );
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    mid(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y).multiply(0.5);
    }

    toPoint(x, y) {
        return new Vector(x - this.x, y - this.y);
    }

    direction(vector) {
        return Vector.Direction(this.x, this.y, vector.x, vector.y);
    }

    normal(vector) {
        return this.direction(vector).#n();
    }

    #n() {
        return new Vector(-this.y, this.x);
    }

    copy() {
        return new Vector(this.x, this.y);
    }
}

export default Vector