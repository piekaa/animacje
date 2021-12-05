import PiekoszekMath from "./math.js";

class Bezier {

    static points(p1, p2, p3, density = 100) {

        let result = []

        for (let i = 0; i < density; i++) {
            const p12 = PiekoszekMath.lerpPoints(p1, p2, i / density);
            const p23 = PiekoszekMath.lerpPoints(p2, p3, i / density);
            result.push(PiekoszekMath.lerpPoints(p12, p23, i / density));
        }
        return result;
    }
}

export default Bezier