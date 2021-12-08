import Text from "./Text.js";

class PiekoszekEngine {

    #canvas
    #gl
    #text

    constructor(canvas) {
        this.#canvas = canvas;
        this.#gl = canvas.getContext("webgl");
        this.#gl.clearColor(1, 0, 0, 1);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);

        this.#gl.enable(this.#gl.BLEND);
        this.#gl.blendFunc(this.#gl.SRC_ALPHA, this.#gl.ONE_MINUS_SRC_ALPHA);


        this.#text = new Text("Piekoszek");
        setInterval(this.#update.bind(this), 30);
    }


    #update() {


        this.#gl.clearColor(0, 0, 0, 1);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);

        this.#text.render();

        // this.#renderBezier();

    }
}

export default PiekoszekEngine