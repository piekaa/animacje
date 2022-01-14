import TexturedRenderable from "./TexturedRenderable.js";
import Gl from "./GL.js";

class Letter extends TexturedRenderable {

    static charPromises = [];

    #char;

    width = 0;
    height = 500;

    loaded = false;

    constructor(char) {
        super(undefined, "/js/shader/font/fragment.shader");
        this.#char = char;
        this.loadTexture(char)
    }

    loadTexture(char) {
        let fontSize = this.height;

        if (Letter.charPromises[char]) {
            Letter.charPromises[char].then(charData => {
                this.texture = charData.texture;
                this.vertexData = Gl.cloneVertexData(charData.vertexData);
                this.width = charData.width;
                this.setPivot(this.width / 2, fontSize / 2);
                this.visible = true;
                this.loaded = true;
            });
            return;
        }

        Letter.charPromises[char] = new Promise(resolve => {

            const fontCanvas = document.createElement("canvas");
            fontCanvas.width = 500;
            fontCanvas.height = 500;

            const context = fontCanvas.getContext("2d");

            context.clearRect(0, 0, fontCanvas.width, fontCanvas.height);
            context.rect(0, 0, fontCanvas.width, fontCanvas.height);
            context.fillStyle = "#F00";
            context.fill();

            context.font = `${fontSize}px monospace`;
            context.textBaseline = "middle";
            context.fillStyle = "#0F0";
            context.fillText(`${char}`, 0, fontCanvas.height / 2);
            this.width = context.measureText(`${char}`).width;

            this.loadImage(fontCanvas.toDataURL("image/png"),
                () => {
                    this.setPivot(this.width / 2, fontSize / 2);
                    this.visible = true;
                    this.loaded = true;
                    resolve({
                        texture: this.texture,
                        vertexData: this.vertexData,
                        width: this.width
                    });
                });
        });
    }

    getChar() {
        return this.#char;
    }
}

export default Letter