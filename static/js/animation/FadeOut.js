import LinearInterpolator from "./LinearInterpolator.js";

class FadeOut {
    #currentFrame = 0;
    #totalFrames;
    #obj;
    #interpolator;

    #r
    #g
    #b

    constructor(obj, frames, interpolator = new LinearInterpolator()) {
        this.#obj = obj;
        this.#totalFrames = frames;
        this.#interpolator = interpolator;
    }

    start(frame) {
        frame = Math.max(frame-1, 0);
        [this.#r, this.#g, this.#b] = this.#obj.getValuesAtFrame(frame).color;
    }

    updateFrame() {
        if (this.#currentFrame >= this.#totalFrames) {
            return
        }

        if (this.#currentFrame === 0) {
            this.#obj.setFrameVisible(true);
        }

        this.#currentFrame++;
        const p = this.#currentFrame / this.#totalFrames;
        const a = this.#interpolator.interpolate(1, 0, p);
        this.#obj.setFrameColor([this.#r, this.#g, this.#b, a]);
    }
}

export default FadeOut