import PiekoszekMath from "../math.js";

class WiggleInterpolator {

    interpolate(a, b, p) {
        const wiggleP = Math.sin(2*p) / Math.sin(2);
        return PiekoszekMath.lerp(a, b, wiggleP);
    }

}

export default WiggleInterpolator