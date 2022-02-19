import AnimatedRenderable from "../animation/AnimatedRenderable.js";
import PiekoszekEngine from "../PiekoszekEngine.js";
import DragAndDropImages from "../files/DragAndDropImages.js";
import TexturedRenderable from "../TexturedRenderable.js";

class Image extends AnimatedRenderable {

    constructor(imageName, x, y, sx = 1, sy = 1) {
        super();

        const img = new TexturedRenderable(DragAndDropImages.getImage(imageName));

        this.setPosition(x, y);
        this.setScale(sx, sy);

        PiekoszekEngine.addAsChild(this, img);
    }


    isReady() {
        return false;
    }

}

export default Image