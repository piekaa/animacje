import PiekoszekEngine from "../PiekoszekEngine.js";
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

    start() {
        this.#startX = this.#obj.position.x();
        this.#startY = this.#obj.position.y();
        PiekoszekEngine.addBehaviour(() => {

            //todo remove behaviour instead
            if (this.#currentFrame > this.#totalFrames) {
                return
            }

            this.#currentFrame++;
            const p = this.#currentFrame / this.#totalFrames;
            this.#obj.setPosition(
                this.#interpolator.interpolate(this.#startX, this.#endX, p),
                this.#interpolator.interpolate(this.#startY, this.#endY, p))
        });
    }

}

export default Move