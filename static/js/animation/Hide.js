import LinearInterpolator from "./LinearInterpolator.js";

class Hide {

    #currentFrame = 0;
    #totalFrames;
    #obj;
    #interpolator;

    constructor(obj, frames, interpolator = new LinearInterpolator()) {
        this.#obj = obj;
        this.#totalFrames = frames;
        this.#interpolator = interpolator;
    }

    start() {
    }

    updateFrame() {

        if (this.#currentFrame === this.#totalFrames) {
            this.#obj.setFrameVisible(false);
        }

        if (this.#currentFrame >= this.#totalFrames) {
            return
        }

        if (this.#currentFrame === 0) {
            this.#obj.setFrameVisible(true);
        }

        this.#currentFrame++;
        const p = this.#currentFrame / this.#totalFrames;
        const s = this.#interpolator.interpolate(1, 0, p);
        this.#obj.setFrameScale(s, s);
    }
}

export default Hide