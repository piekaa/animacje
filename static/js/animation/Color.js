import LinearInterpolator from "./LinearInterpolator.js";

class Color {
    #startR
    #startG
    #startB
    #startA

    #endR
    #endG
    #endB
    #endA

    #currentFrame = 0;
    #totalFrames;
    #obj;
    #interpolator;

    constructor(obj, r, g, b, a, frames, interpolator = new LinearInterpolator()) {

        this.#endR = r;
        this.#endG = g;
        this.#endB = b;
        this.#endA = a;

        this.#obj = obj;
        this.#totalFrames = frames;
        this.#interpolator = interpolator;
    }

    start(frame) {
        frame = Math.max(frame - 1, 0);
        const startColor = this.#obj.getValuesAtFrame(frame).color;
        this.#startR = startColor[0];
        this.#startG = startColor[1];
        this.#startB = startColor[2];
        this.#startA = startColor[3];
    }

    updateFrame() {
        if (this.#currentFrame >= this.#totalFrames) {
            return
        }

        this.#currentFrame++;
        const p = this.#currentFrame / this.#totalFrames;

        this.#obj.setFrameColor([
            this.#interpolator.interpolate(this.#startR, this.#endR, p),
            this.#interpolator.interpolate(this.#startG, this.#endG, p),
            this.#interpolator.interpolate(this.#startB, this.#endB, p),
            this.#interpolator.interpolate(this.#startA, this.#endA, p)]);
    }
}

export default Color