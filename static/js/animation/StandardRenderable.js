import AnimatedRenderable from "./AnimatedRenderable.js";

class StandardRenderable extends AnimatedRenderable {

    constructor(x = 0, y = 0) {
        super();

        this.setPosition(x, y);
    }

    isReady() {
        return false;
    }

    setColor(r = 1, g = 1, b = 1, a = 1) {
        super.setColor(r, g, b, a);
        this.children.forEach(c => c.setColor(r, g, b, a));
    }

}

export default StandardRenderable;