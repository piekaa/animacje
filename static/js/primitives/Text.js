import AnimatedRenderable from "../animation/AnimatedRenderable.js";
import Letter from "../Letter.js";
import PiekoszekEngine from "../PiekoszekEngine.js";
import Utils from "../utils/Utils.js";

class Text extends AnimatedRenderable {

    letters;

    constructor(text, x = 100, y = 100, scale = 1) {
        super();

        this.letters = [];

        for (let i = 0; i < text.length; i++) {
            const l = new Letter(text[i]);
            PiekoszekEngine.addAsChild(this, l);
            this.letters.push(l);
        }

        this.setPosition(x, y);
        this.setScale(scale, scale);


        Utils.after(() => {
            return this.letters.filter(l => !l.loaded).length === 0;
        })
            .then(() => {
                let offset = 0;
                for (let i = 0; i < this.letters.length; i++) {
                    offset += this.letters[i].width / 2;
                    this.letters[i].setPosition(offset, 0);
                    offset += this.letters[i].width / 2;
                }
            });
    }

    setColor(r = 1, g = 1, b = 1, a = 1) {
        super.setColor(r, g, b, a);
        this.letters.forEach(l => l.setColor(r, g, b, a));
    }

    isReady() {
        return false;
    }

}

export default Text