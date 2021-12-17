import PiekoszekEngine from "../PiekoszekEngine.js";
import Move from "./Move.js";
import SmoothInterpolator from "./SmoothInterpolator.js";
import WiggleInterpolator from "./WiggleInterpolator.js";

class Animator {

    frame = 0;

    lastFrame = 0;

    doAtFrame = []
    allObjects;

    allActions;

    constructor() {
        this.frame = 0;
        this.allObjects = new Set();
        this.allActions = new Set();
    }

    wait(time) {
        const toSkip = this.#timeToFrames(time);
        for (let i = 0; i < toSkip; i++) {
            this.updateFrame();
            console.log("skipping...");
        }
    }

    move(obj, x, y, time) {
        this.#initObjectIfNew(obj);
        const framesDuration = this.#timeToFrames(time);
        this.lastFrame = this.frame + framesDuration;
        const move = new Move(obj, x, y, framesDuration);
        this.allActions.add(move);
        move.start();
        this.#addToDoAtFrame(move);
    }

    moveSmooth(obj, x, y, time) {
        this.#initObjectIfNew(obj);
        const framesDuration = this.#timeToFrames(time);
        this.lastFrame = this.frame + framesDuration;
        const move = new Move(obj, x, y, framesDuration, new SmoothInterpolator());
        this.allActions.add(move);
        move.start();
        this.#addToDoAtFrame(move);
    }

    moveWiggle(obj, x, y, time) {
        this.#initObjectIfNew(obj);
        const framesDuration = this.#timeToFrames(time);
        this.lastFrame = this.frame + framesDuration;
        const move = new Move(obj, x, y, framesDuration, new WiggleInterpolator());
        this.allActions.add(move);
        move.start();
        this.#addToDoAtFrame(move);
    }

    #initObjectIfNew(obj) {
        if (!this.allObjects.has(obj)) {
            this.allObjects.add(obj);
            obj.setInitialValues(this.frame);
        }
    }

    #addToDoAtFrame(animation) {
        if (!this.doAtFrame[this.frame]) {
            this.doAtFrame[this.frame] = [];
        }
        this.doAtFrame[this.frame].push(animation);
    }

    completeRemainingFrames() {
        for (let i = this.frame; i < this.lastFrame; i++) {
            this.updateFrame();
        }
    }

    updateFrame() {
        this.allActions.forEach(a => a.updateFrame());
        this.allObjects.forEach(o => o.updateFrame());
        this.frame++;
    }

    setValuesAtFrame(frame) {
        this.allObjects.forEach(o => o.setValuesAtFrame(frame));
    }

    #timeToFrames(time) {
        const value = parseFloat(time.substr(0, time.length - 1));
        const unit = time[time.length - 1];
        if (unit === 's') {
            return value * PiekoszekEngine.FPS;
        }
        throw new Error("Unknown unit: " + unit);
    }

}

export default Animator