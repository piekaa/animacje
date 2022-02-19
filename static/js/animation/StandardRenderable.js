import AnimatedRenderable from "./AnimatedRenderable.js";

class StandardRenderable extends AnimatedRenderable {

    passColor = true;

    constructor(x = 0, y = 0, passColor = "true") {
        super();

        if (passColor === "false") {
            this.passColor = false;
        }

        this.setPosition(x, y);
    }

    isReady() {
        return false;
    }

    setColor(r = 1, g = 1, b = 1, a = 1) {
        super.setColor(r, g, b, a);
        if (this.passColor) {
            this.children.forEach(c => c.setColor(r, g, b, a));
        }
    }
}

export default StandardRenderable;