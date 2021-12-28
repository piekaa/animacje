import AnimatedRenderable from "../animation/AnimatedRenderable.js";
import Letter from "../Letter.js";
import PiekoszekEngine from "../PiekoszekEngine.js";

class Text extends AnimatedRenderable {

    constructor(x, y, text) {
        super();
        this.setPosition(x, y);
        x = 0;
        for (let i = 0; i < text.length; i++) {
            const l = new Letter(text[i]);
            x += l.width / 2;
            l.setPosition(x, 0)
            x += l.width / 2;
            PiekoszekEngine.addAsChild(this, l);
        }
    }

    isReady() {
        return false;
    }

}

export default Text