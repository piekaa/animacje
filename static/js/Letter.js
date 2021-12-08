import TexturedRenderable from "./TexturedRenderable.js";

class Letter extends TexturedRenderable {

    static #canvas;
    static #fontCanvas;

    static loadedChars = [];

    #char;

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

        context.font = '500px serif';
        context.textBaseline = "middle";
        context.fillStyle = "#0F0";
        context.fillText(`${char}`, 0, Letter.#fontCanvas.height / 2);

        this.loadImage(Letter.#fontCanvas.toDataURL("image/png"),
            () => {
                Letter.loadedChars[char] = this.texture;
            });
    }

}

export default Letter