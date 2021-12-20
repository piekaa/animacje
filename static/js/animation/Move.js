import LinearInterpolator from "./LinearInterpolator.js";

class Move {

    #startX;
    #startY;
    #endX;
    #endY;
    #currentFrame = 0;
    #totalFrames;
    #obj;
    #interpolator;

    constructor(obj, x, y, frames, interpolator = new LinearInterpolator()) {
        this.#endX = x;
        this.#endY = y;
        this.#obj = obj;
        this.#totalFrames = frames;
        this.#interpolator = interpolator;
    }

    start(frame) {
        frame = Math.max(frame-1, 0);
        this.#startX = this.#obj.getValuesAtFrame(frame).position.x();
        this.#startY = this.#obj.getValuesAtFrame(frame).position.y();
    }

    updateFrame() {
        if (this.#currentFrame >= this.#totalFrames) {
            return
        }

        this.#currentFrame++;
        const p = this.#currentFrame / this.#totalFrames;
        this.#obj.setFramePosition(
            this.#interpolator.interpolate(this.#startX, this.#endX, p),
            this.#interpolator.interpolate(this.#startY, this.#endY, p));
    }

}

export default Move