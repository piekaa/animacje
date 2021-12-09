import Text from "./Text.js";
import GL from "./GL.js";

class PiekoszekEngine {

    #text

    constructor(canvas) {
        GL.enableAlphaBlend();
        this.#text = new Text("Piekoszek");
        setInterval(this.#update.bind(this), 30);
    }


    #update() {
        GL.clearToColor();
        this.#text.render();
    }
}

export default PiekoszekEngine