import LinearInterpolator from "./LinearInterpolator.js";

class Rotate {

    #startR;
    #endR;
    #currentFrame = 0;
    #totalFrames;
    #obj;
    #interpolator;

    constructor(obj, r, frames, interpolator = new LinearInterpolator()) {
        this.#endR = r;
        this.#obj = obj;
        this.#totalFrames = frames;
        this.#interpolator = interpolator;
    }

    start(frame) {
        frame = Math.max(frame - 1, 0);
        this.#startR = this.#obj.getValuesAtFrame(frame).rotation.rDeg();
    }

    updateFrame() {
        if (this.#currentFrame >= this.#totalFrames) {
            return
        }

        this.#currentFrame++;
        const p = this.#currentFrame / this.#totalFrames;
        this.#obj.setFrameRotation(
            this.#interpolator.interpolate(this.#startR, this.#endR, p));
    }

}

export default Rotate