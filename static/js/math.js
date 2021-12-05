import Point from "./Point.js";

class PiekoszekMath {

    static lerp(a, b, p) {
        return (b - a) * p + a;
    }

    static lerpPoints(p1, p2, p) {
        return new Point(this.lerp(p1.x, p2.x, p), this.lerp(p1.y, p2.y, p));
    }
}

export default PiekoszekMath