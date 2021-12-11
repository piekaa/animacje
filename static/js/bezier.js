import PiekoszekMath from "./math.js";
import Vector from "./Vector.js";

class Bezier {

    static points(p1, p2, p3, density = 100) {

        let result = []

        for (let i = 0; i <= density; i++) {
            const p12 = PiekoszekMath.lerpPoints(p1, p2, i / density);
            const p23 = PiekoszekMath.lerpPoints(p2, p3, i / density);
            result.push(PiekoszekMath.lerpPoints(p12, p23, i / density));
        }
        return result;
    }

    static triangles(p1, p2, p3, width = 4, density = 100) {
        let result = [];
        const points = this.points(p1, p2, p3, density);

        for (let i = 0; i < points.length - 1; i++) {
            result.push(...Bezier.#rectangle(points[i], points[i+1], width));
        }

        return result;
    }

    static #rectangle(p1, p2, width) {

        let result = [];

        const v1 = new Vector(p1.x, p1.y);
        const v2 = new Vector(p2.x, p2.y);

        const normal = v1.direction(v2).normal().normalized().multiply(width / 2);
        const minusNormal = normal.multiply(-1);

        result.push(v1.add(normal), v2.add(normal), v1.add(minusNormal));
        result.push(v1.add(minusNormal), v2.add(normal), v2.add(minusNormal));

        return result;
    }
}

export default Bezier