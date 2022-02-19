import LinearInterpolator from "./LinearInterpolator.js";

class Look {

    #startX;
    #startY;
    #endX;
    #endY;

    #startS;
    #endS;

    #currentFrame = 0;
    #totalFrames;
    #obj;
    #interpolator;

    #percentX;
    #percentY;

    #signX;
    #signY;

    constructor(obj, x, y, s, frames, interpolator = new LinearInterpolator()) {
        this.#endS = s;

        this.#endX = x
        this.#endY = y;

        this.#obj = obj;
        this.#totalFrames = frames;
        this.#interpolator = interpolator;
    }

    start(frame) {
        frame = Math.max(frame - 1, 0);

        const scale = this.#obj.getValuesAtFrame(frame).scale.sx();
        this.#startS = scale;

        this.#startX = this.#obj.getValuesAtFrame(frame).position.x();
        this.#startY = this.#obj.getValuesAtFrame(frame).position.y();

        const dx = (this.#endX - this.#startX) * 9;
        const dy = (this.#endY - this.#startY) * 16;

        const dd = dx * dx + dy * dy;

        if (dd === 0) {
            this.#percentX = 0;
            this.#percentY = 0;
        } else {
            //todo prawie dobrze
            this.#percentX = dx * dx / dd;
            this.#percentY = dy * dy / dd;
        }

        const pxy = this.#percentX + this.#percentY;

        this.#signX = Math.sign(this.#endX - this.#startX) * Math.sign(this.#startS - this.#endS);
        this.#signY = Math.sign(this.#endY - this.#startY) * Math.sign(this.#startS - this.#endS);

        const startCorrectionX = this.correctionX(scale);
        const endCorrectionX = this.correctionX(this.#endS);

        const startCorrectionY = this.correctionY(scale);
        const endCorrectionY = this.correctionY(this.#endS);

        this.#startX += startCorrectionX * this.#signX;
        this.#endX += endCorrectionX * this.#signX;

        this.#startY += startCorrectionY * this.#signY;
        this.#endY += endCorrectionY * this.#signY;

    }

    updateFrame() {
        if (this.#currentFrame >= this.#totalFrames) {
            return
        }

        this.#currentFrame++;
        const p = this.#currentFrame / this.#totalFrames;

        const scale = this.#interpolator.interpolate(this.#startS, this.#endS, p)

        const correctionX = this.correctionX(scale) * this.#signX;
        const correctionY = this.correctionY(scale) * this.#signY;

        this.#obj.setFramePosition(
            this.#interpolator.interpolate(this.#startX, this.#endX, p) - correctionX,
            this.#interpolator.interpolate(this.#startY, this.#endY, p) - correctionY);

        this.#obj.setFrameScale(scale, scale);
    }

    correctionX(s) {
        return ((1920 - (1920 / s)) / 2) * this.#percentX * 1.4;
    }

    correctionY(s) {
        return ((1080 - (1080 / s)) / 2) * this.#percentY * 1.2;
    }

}

export default Look