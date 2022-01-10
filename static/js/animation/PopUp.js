import LinearInterpolator from "./LinearInterpolator.js";

class PopUp {

    #currentFrame = 0;
    #totalFrames;
    #obj;
    #interpolator;
    #targetScale = 1;

    constructor(obj, frames, interpolator = new LinearInterpolator()) {
        this.#obj = obj;
        this.#totalFrames = frames;
        this.#interpolator = interpolator;
    }

    start() {
    }

    updateFrame() {
        if (this.#currentFrame >= this.#totalFrames) {
            return
        }

        if (this.#currentFrame === 0) {
            this.#obj.setFrameVisible(true);
            this.#targetScale = this.#obj.scale.sx();
        }

        this.#currentFrame++;
        const p = this.#currentFrame / this.#totalFrames;
        const s = this.#interpolator.interpolate(0, this.#targetScale, p);
        this.#obj.setFrameScale(s, s);
    }
}

export default PopUp