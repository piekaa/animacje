import PiekoszekEngine from "../PiekoszekEngine.js";
import Move from "./Move.js";
import SmoothInterpolator from "./SmoothInterpolator.js";
import WiggleInterpolator from "./WiggleInterpolator.js";
import Call from "./Call.js";
import LinearInterpolator from "./LinearInterpolator.js";
import PopUp from "./PopUp.js";
import PopDown from "./PopDown.js";
import FadeIn from "./FadeIn.js";
import Zoom from "./Zoom.js";
import FadeOut from "./FadeOut.js";
import Color from "./Color.js";
import Rotate from "./Rotate.js";
import Look from "./Look.js";

// todo implement start(frame) in all animations

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

    lookSmoothWait(obj, x, y, sx, sy, time) {
        this.lookSmooth(obj, x, y, sx, sy, time);
        this.wait(time);
    }

    lookSmooth(obj, x, y, sx, sy, time) {
        this.look(obj, x, y, sx, sy, time, new SmoothInterpolator());
        // this.moveSmooth(obj, x, y, time);
        // this.zoomSmooth(obj, sx, sy, time); // zoom smooth??
    }

    lookWait(obj, x, y, sx, sy, time) {
        this.look(obj, x, y, sx, sy, time);
        this.wait(time);
    }

    look(obj, x, y, sx, sy, time, interpolator) {
        // this.move(obj, x, y, time);
        // this.zoom(obj, sx, sy, time);
        this.#look(obj, x, y, sx, sy, time, interpolator);

    }


    #look(obj, x, y, sx, sy, time, interpolator) {
        this.#initObjectIfNew(obj);
        const framesDuration = this.#timeToFrames(time);
        this.lastFrame = Math.max(this.lastFrame, this.frame + framesDuration);
        const look = new Look(obj, x, y, sx, framesDuration, interpolator);
        this.allActions.add(look);
        look.start(this.frame);
        this.#addToDoAtFrame(look);
    }


    // Z TYM UWAZAC
    call(obj, fun, ...params) {
        this.allObjects.add(new Call(obj, fun, this.frame, params));
    }

    moveWait(obj, x, y, time) {
        this.move(obj, x, y, time);
        this.wait(time);
    }

    move(obj, x, y, time) {
        this.#move(obj, x, y, time, new LinearInterpolator());
    }

    moveSmoothWait(obj, x, y, time) {
        this.moveSmooth(obj, x, y, time);
        this.wait(time);
    }

    moveSmooth(obj, x, y, time) {
        this.#move(obj, x, y, time, new SmoothInterpolator());
    }

    moveWiggleWait(obj, x, y, time) {
        this.moveWiggle(obj, x, y, time);
        this.wait(time);
    }

    moveWiggle(obj, x, y, time) {
        this.#move(obj, x, y, time, new WiggleInterpolator());
    }

    #move(obj, x, y, time, interpolator) {
        this.#initObjectIfNew(obj);
        const framesDuration = this.#timeToFrames(time);
        this.lastFrame = Math.max(this.lastFrame, this.frame + framesDuration);
        const move = new Move(obj, x, y, framesDuration, interpolator);
        this.allActions.add(move);
        move.start(this.frame);
        this.#addToDoAtFrame(move);
    }

    rotateWait(obj, r, time) {
        this.rotate(obj, r, time);
        this.wait(time);
    }

    rotate(obj, r, time) {
        this.#rotate(obj, r, time, new LinearInterpolator());
    }

    rotateSmoothWait(obj, r, time) {
        this.rotateSmooth(obj, r, time);
        this.wait(time);
    }

    rotateSmooth(obj, r, time) {
        this.#rotate(obj, r, time, new SmoothInterpolator());
    }

    rotateWiggleWait(obj, r, time) {
        this.rotateWiggle(obj, r, time);
        this.wait(time);
    }

    rotateWiggle(obj, r, time) {
        this.#rotate(obj, r, time, new WiggleInterpolator());
    }

    #rotate(obj, r, time, interpolator) {
        this.#initObjectIfNew(obj);
        const framesDuration = this.#timeToFrames(time);
        this.lastFrame = Math.max(this.lastFrame, this.frame + framesDuration);
        const rotate = new Rotate(obj, r, framesDuration, interpolator);
        this.allActions.add(rotate);
        rotate.start(this.frame);
        this.#addToDoAtFrame(rotate);
    }


    zoomWait(obj, x, y, time) {
        this.zoom(obj, x, y, time);
        this.wait(time);
    }

    zoom(obj, x, y, time) {
        this.#zoom(obj, x, y, time, new LinearInterpolator());
    }

    zoomSmoothWait(obj, x, y, time) {
        this.zoomSmooth(obj, x, y, time);
        this.wait(time);
    }

    zoomSmooth(obj, x, y, time) {
        this.#zoom(obj, x, y, time, new SmoothInterpolator());
    }

    zoomWiggleWait(obj, x, y, time) {
        this.zoomWiggle(obj, x, y, time);
        this.wait(time);
    }

    zoomWiggle(obj, x, y, time) {
        this.#zoom(obj, x, y, time, new WiggleInterpolator());
    }

    #zoom(obj, x, y, time, interpolator) {
        this.#initObjectIfNew(obj);
        const framesDuration = this.#timeToFrames(time);
        this.lastFrame = Math.max(this.lastFrame, this.frame + framesDuration);
        const zoom = new Zoom(obj, x, y, framesDuration, interpolator);
        this.allActions.add(zoom);
        zoom.start(this.frame);
        this.#addToDoAtFrame(zoom);
    }

    popUpWait(obj, time = "0.5s") {
        this.popUp(obj, time);
        this.wait(time);
    }

    popUp(obj, time = "0.5s") {
        this.#popUp(obj, time, new WiggleInterpolator(2.3));
    }

    popDownWait(obj, time = "1s") {
        this.popDown(obj, time);
        this.wait(time);
    }

    popDown(obj, time = "1s") {
        this.#popdown(obj, time, new SmoothInterpolator());
    }

    #popUp(obj, time, interpolator) {
        this.#initObjectIfNew(obj);
        const framesDuration = this.#timeToFrames(time);
        this.lastFrame = Math.max(this.lastFrame, this.frame + framesDuration);
        const show = new PopUp(obj, framesDuration, interpolator);
        show.start(this.frame);
        this.allActions.add(show);
        this.#addToDoAtFrame(show);
    }

    #popdown(obj, time, interpolator) {
        this.#initObjectIfNew(obj);
        const framesDuration = this.#timeToFrames(time);
        this.lastFrame = Math.max(this.lastFrame, this.frame + framesDuration);
        const hide = new PopDown(obj, framesDuration, interpolator);
        hide.start(this.frame);
        this.allActions.add(hide);
        this.#addToDoAtFrame(hide);
    }

    fadeInWait(obj, time = "1s") {
        this.#fadeIn(obj, time, new LinearInterpolator())
        this.wait(time);
    }

    fadeIn(obj, time = "1s") {
        this.#fadeIn(obj, time, new LinearInterpolator())
    }

    #fadeIn(obj, time, interpolator) {
        this.#initObjectIfNew(obj);
        const framesDuration = this.#timeToFrames(time);
        this.lastFrame = Math.max(this.lastFrame, this.frame + framesDuration);
        const fadeIn = new FadeIn(obj, framesDuration, interpolator);
        fadeIn.start(this.frame);
        this.allActions.add(fadeIn);
        this.#addToDoAtFrame(fadeIn);
    }

    fadeOutWait(obj, time = "1s") {
        this.#fadeOut(obj, time, new LinearInterpolator())
        this.wait(time);
    }

    fadeOut(obj, time = "1s") {
        this.#fadeOut(obj, time, new LinearInterpolator())
    }

    #fadeOut(obj, time, interpolator) {
        this.#initObjectIfNew(obj);
        const framesDuration = this.#timeToFrames(time);
        this.lastFrame = Math.max(this.lastFrame, this.frame + framesDuration);
        const fadeOut = new FadeOut(obj, framesDuration, interpolator);
        fadeOut.start(this.frame);
        this.allActions.add(fadeOut);
        this.#addToDoAtFrame(fadeOut);
    }

    colorWait(obj, r, g, b, a, time = "1s") {
        this.#color(obj, r, g, b, a, time, new LinearInterpolator())
        this.wait(time);
    }

    color(obj, r, g, b, a, time = "1s") {
        this.#color(obj, r, g, b, a, time, new LinearInterpolator())
    }

    #color(obj, r, g, b, a, time, interpolator) {
        this.#initObjectIfNew(obj);
        const framesDuration = this.#timeToFrames(time);
        this.lastFrame = Math.max(this.lastFrame, this.frame + framesDuration);
        const color = new Color(obj, r, g, b, a, framesDuration, interpolator);
        color.start(this.frame);
        this.allActions.add(color);
        this.#addToDoAtFrame(color);
    }

    wait(time) {
        const toSkip = this.#timeToFrames(time);
        for (let i = 0; i < toSkip; i++) {
            this.updateFrame();
        }
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