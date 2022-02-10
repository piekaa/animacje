import LinearInterpolator from "./LinearInterpolator.js";

class PopDown {

    #currentFrame = 0;
    #totalFrames;
    #obj;
    #interpolator;

    #startScale

    constructor(obj, frames, interpolator = new LinearInterpolator()) {
        this.#obj = obj;
        this.#totalFrames = frames;
        this.#interpolator = interpolator;
    }

    start(frame) {
        frame = Math.max(frame-1, 0);
        this.#startScale = this.#obj.getValuesAtFrame(frame).scale.sx();
    }

    updateFrame() {

        if (this.#currentFrame === this.#totalFrames) {
            this.#obj.setFrameVisible(false);
        }

        this.#currentFrame++;

        if (this.#currentFrame >= this.#totalFrames) {
            return
        }


        const p = this.#currentFrame / this.#totalFrames;
        const s = this.#interpolator.interpolate(this.#startScale, 0, p);
        this.#obj.setFrameScale(s, s);
    }
}

export default PopDown