import PiekoszekMath from "../math.js";

class SmoothInterpolator {

    interpolate(a, b, p) {
        let smoothP = -1 / (1 + Math.pow(1.1, (130 * (p - 0.5)))) + 1;

        if (p >= 1) {
            smoothP = 1;
        }

        return PiekoszekMath.lerp(a, b, smoothP);
    }

}

export default SmoothInterpolator