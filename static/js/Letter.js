import TexturedRenderable from "./TexturedRenderable.js";

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

        if(Letter.loadedChars[char]) {
            this.texture = Letter.loadedChars[char];
            return;
        }
        const context = Letter.#fontCanvas.getContext("2d");

        context.clearRect(0, 0, Letter.#fontCanvas.width, Letter.#fontCanvas.height);
        context.rect(0, 0, Letter.#fontCanvas.width, Letter.#fontCanvas.height);
        context.fillStyle = "#F00";
        context.fill();

        let fontSize = 500;

        context.font = `${fontSize}px serif`;
        context.textBaseline = "middle";
        context.fillStyle = "#0F0";
        context.fillText(`${char}`, 0, Letter.#fontCanvas.height / 2);
        this.width = context.measureText(`${char}`).width;

        this.loadImage(Letter.#fontCanvas.toDataURL("image/png"),
            (img) => {
                Letter.loadedChars[char] = this.texture;
                this.setPivot(this.width/2, fontSize/2);
            });
    }

}

export default Letter