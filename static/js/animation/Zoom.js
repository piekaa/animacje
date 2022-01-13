import LinearInterpolator from "./LinearInterpolator.js";

class Zoom {

    #startSX;
    #startSY;
    #endSX;
    #endSY;
    #currentFrame = 0;
    #totalFrames;
    #obj;
    #interpolator;

    constructor(obj, x, y, frames, interpolator = new LinearInterpolator()) {
        this.#endSX = x;
        this.#endSY = y;
        this.#obj = obj;
        this.#totalFrames = frames;
        this.#interpolator = interpolator;
    }

    start(frame) {
        frame = Math.max(frame - 1, 0);
        this.#startSX = this.#obj.getValuesAtFrame(frame).scale.sx();
        this.#startSY = this.#obj.getValuesAtFrame(frame).scale.sy();
    }

    updateFrame() {
        if (this.#currentFrame >= this.#totalFrames) {
            return
        }

        this.#currentFrame++;
        const p = this.#currentFrame / this.#totalFrames;
        this.#obj.setFrameScale(
            this.#interpolator.interpolate(this.#startSX, this.#endSX, p),
            this.#interpolator.interpolate(this.#startSY, this.#endSY, p));
    }

}

export default Zoom