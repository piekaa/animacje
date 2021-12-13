import Renderable from "./Renderable.js";

class StandardRenderable extends Renderable {

    constructor(x, y, sx = 1, sy = 1, r = 0) {
        super();

        this.setPosition(x, y);
        this.setScale(sx, sy);
        this.setRotation(r);

    }

    isReady() {
        return false;
    }

}

export default StandardRenderable;