import PiekoszekMath from "../math.js";

class LinearInterpolator {

    interpolate(a, b, p) {
        return PiekoszekMath.lerp(a, b, p);
    }

}

export default LinearInterpolator