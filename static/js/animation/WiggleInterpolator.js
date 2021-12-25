import PiekoszekMath from "../math.js";

//todo czy one by nie mogli być statyczne?
class WiggleInterpolator {

    #amplitude;

    constructor(amplitude = 2) {
        this.#amplitude = amplitude;
    }

    interpolate(a, b, p) {
        const wiggleP = Math.sin(this.#amplitude * p) / Math.sin(this.#amplitude);
        return PiekoszekMath.lerp(a, b, wiggleP);
    }

}

export default WiggleInterpolator