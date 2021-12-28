import TexturedRenderable from "./TexturedRenderable.js";
import Gl from "./GL.js";

class Letter extends TexturedRenderable {

    static #canvas;
    static #fontCanvas;

    static loadedChars = [];

    #char;

    width = 0;

    constructor(char) {
        super(undefined, "/js/shader/font/fragment.shader");

        this.#char = char;

        if (!Letter.#canvas) {
            Letter.#canvas = document.getElementById("canvas");
            Letter.#fontCanvas = document.createElement("canvas");
            Letter.#fontCanvas.width = 500;
            Letter.#fontCanvas.height = 500;
        }
        this.#loadTexture(char)
    }

    #loadTexture(char) {
        let fontSize = 500;

        if (Letter.loadedChars[char]) {
            this.texture = Letter.loadedChars[char].texture;
            this.vertexData = Gl.cloneVertexData(Letter.loadedChars[char].vertexData);
            this.width = Letter.loadedChars[char].width;
            this.setPivot(this.width / 2, fontSize / 2);
            this.visible = true;
            return;
        }
        const context = Letter.#fontCanvas.getContext("2d");

        context.clearRect(0, 0, Letter.#fontCanvas.width, Letter.#fontCanvas.height);
        context.rect(0, 0, Letter.#fontCanvas.width, Letter.#fontCanvas.height);
        context.fillStyle = "#F00";
        context.fill();

        context.font = `${fontSize}px serif`;
        context.textBaseline = "middle";
        context.fillStyle = "#0F0";
        context.fillText(`${char}`, 0, Letter.#fontCanvas.height / 2);
        this.width = context.measureText(`${char}`).width;

        this.loadImage(Letter.#fontCanvas.toDataURL("image/png"),
            () => {
                Letter.loadedChars[char] = {
                    texture: this.texture,
                    vertexData: this.vertexData,
                    width: this.width
                };
                this.setPivot(this.width / 2, fontSize / 2);
                this.visible = true;
            });
    }

}

export default Letter