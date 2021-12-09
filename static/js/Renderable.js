import Matrix2D from "./Matrix.js";
import GL from "./GL.js";

class Renderable {

    static gl
    static canvas;

    static vertexShaders = [];
    static fragmentShaders = [];
    static shaderPrograms = [];

    vertexData;


    pivot = Matrix2D.Translation(0, 0)
    position = Matrix2D.Translation(0, 0);
    rotation = Matrix2D.Rotation(0);
    scale = Matrix2D.Scale(1, 1);

    transformation = Matrix2D.Identity();

    shaderProgram;
    #vertexShader;
    #fragmentShader;

    constructor(fragmentShaderPath = "/js/shader/fragment.shader", vertexShaderPath = "/js/shader/vertex.shader") {
        if (!Renderable.gl) {
            Renderable.canvas = document.getElementById("canvas");
            Renderable.gl = Renderable.canvas.getContext("webgl");
        }

        if (Renderable.vertexShaders[vertexShaderPath]) {
            this.#vertexShader = Renderable.vertexShaders[vertexShaderPath];
            this.#initShaderProgramIfReady(vertexShaderPath, fragmentShaderPath);
        } else {
            fetch(vertexShaderPath)
                .then(res => res.text())
                .then(text => {
                    this.#vertexShader = Renderable.#loadShader(Renderable.gl.VERTEX_SHADER, text);
                    Renderable.vertexShaders[vertexShaderPath] = this.#vertexShader;
                    this.#initShaderProgramIfReady(vertexShaderPath, fragmentShaderPath);
                });
        }

        if (Renderable.fragmentShaders[fragmentShaderPath]) {
            this.#fragmentShader = Renderable.fragmentShaders[fragmentShaderPath];
            this.#initShaderProgramIfReady(vertexShaderPath, fragmentShaderPath);
        } else {
            fetch(fragmentShaderPath)
                .then(res => res.text())
                .then(text => {
                    this.#fragmentShader = Renderable.#loadShader(Renderable.gl.FRAGMENT_SHADER, text);
                    Renderable.fragmentShaders[fragmentShaderPath] = this.#fragmentShader;
                    this.#initShaderProgramIfReady(vertexShaderPath, fragmentShaderPath);
                });
        }

    }


    #initShaderProgramIfReady(vertexShaderPath, fragmentShaderPath) {

        if (!this.#vertexShader || !this.#fragmentShader) {
            return
        }

        if (Renderable.shaderPrograms[vertexShaderPath + fragmentShaderPath]) {
            this.shaderProgram = Renderable.shaderPrograms[vertexShaderPath + fragmentShaderPath];
            return;
        }

        this.shaderProgram = Renderable.gl.createProgram();
        Renderable.gl.attachShader(this.shaderProgram, this.#vertexShader);
        Renderable.gl.attachShader(this.shaderProgram, this.#fragmentShader);
        Renderable.gl.linkProgram(this.shaderProgram);

        if (!Renderable.gl.getProgramParameter(this.shaderProgram, Renderable.gl.LINK_STATUS)) {
            console.log(Renderable.gl.getProgramInfoLog(this.shaderProgram));
            return;
        }

        Renderable.shaderPrograms[vertexShaderPath + fragmentShaderPath] = this.shaderProgram;
    }

    static #loadShader(type, source) {
        const shader = Renderable.gl.createShader(type);
        Renderable.gl.shaderSource(shader, source);
        Renderable.gl.compileShader(shader);

        if (!Renderable.gl.getShaderParameter(shader, Renderable.gl.COMPILE_STATUS)) {
            console.log(Renderable.gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    setPosition(x,y) {
        this.position = Matrix2D.Translation(x,y);
    }

    setRotation(degrees) {
        this.rotation = Matrix2D.RotationDeg(degrees);
    }

    setScale(sx, sy) {
        this.scale = Matrix2D.Scale(sx, sy);
    }

    setPivot(px, py) {
        this.pivot = Matrix2D.Translation(-px, -py);
    }

    isReady() {

    }

    getTexture() {
        return undefined;
    }

    updateTransformation() {

        this.transformation =
            this.position
                .multiply(this.scale)
                .multiply(this.rotation)
                .multiply(this.pivot);

    }

    render() {

        if (!this.isReady()) {
            return;
        }

        if (!this.shaderProgram) {
            return;
        }

        Renderable.gl.useProgram(this.shaderProgram);

        const rect = Renderable.canvas.getBoundingClientRect();

        const texture = this.getTexture();
        if (texture) {
            Renderable.gl.activeTexture(Renderable.gl.TEXTURE0);
            Renderable.gl.bindTexture(Renderable.gl.TEXTURE_2D, texture);
            Renderable.gl.uniform1i(Renderable.gl.getUniformLocation(this.shaderProgram, "sprite"), 0)
        }

        Renderable.gl.uniformMatrix3fv(
            Renderable.gl.getUniformLocation(this.shaderProgram, "transformation"),
            false,
            this.transformation.float32array());

        const screen = Matrix2D.Scale(2 / rect.width, 2 / rect.height).multiply(Matrix2D.Translation(-rect.width / 2, -rect.height / 2));

        Renderable.gl.uniformMatrix3fv(
            Renderable.gl.getUniformLocation(this.shaderProgram, "screen"),
            false,
            screen.float32array());

        GL.drawTriangleStripPositionAndTexcoord(this.vertexData, "vertexPosition", "vertexTextureCoordinate", this.shaderProgram);
    }

}

export default Renderable