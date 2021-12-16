import PiekoszekEngine from "../PiekoszekEngine.js";
import Move from "./Move.js";
import SmoothInterpolator from "./SmoothInterpolator.js";
import WiggleInterpolator from "./WiggleInterpolator.js";

class Animator {

    frame = 0;
    nextStepAt = 0;
    doAtFrame = []

    constructor() {
        PiekoszekEngine.addBehaviour(() => {
            this.frame++;
            if (this.frame > this.nextStepAt) {
                this.nextStepAt = this.frame;
            }

            if (this.doAtFrame[this.frame]) {
                this.doAtFrame[this.frame].forEach(f => f.start());
            }
        });
    }

    wait(time) {
        this.nextStepAt += this.#timeToFrames(time);
    }

    move(obj, x, y, time) {
        this.#addToDoAtFrame(new Move(obj, x, y, this.#timeToFrames(time)));
    }

    moveSmooth(obj, x, y, time) {
        this.#addToDoAtFrame(new Move(obj, x, y, this.#timeToFrames(time), new SmoothInterpolator()));
    }

    moveWiggle(obj, x, y, time) {
        this.#addToDoAtFrame(new Move(obj, x, y, this.#timeToFrames(time), new WiggleInterpolator()));
    }

    #addToDoAtFrame(animation) {
        const frame = this.#atFrame();
        if (!this.doAtFrame[frame]) {
            this.doAtFrame[frame] = [];
        }
        this.doAtFrame[frame].push(animation);
    }


    #timeToFrames(time) {
        const value = parseFloat(time.substr(0, time.length - 1));
        const unit = time[time.length - 1];
        if (unit === 's') {
            return value * PiekoszekEngine.FPS;
        }
        throw new Error("Unknown unit: " + unit);
    }

    #atFrame() {
        return this.nextStepAt === this.frame ? this.nextStepAt + 1 : this.nextStepAt;
    }

}

export default Animator