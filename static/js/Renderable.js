import Matrix2D from "./Matrix.js";
import GL from "./GL.js";

class Renderable {

    static canvas;

    vertexData;

    visible = true;
    parent = undefined;
    children = [];

    zIndex = 0;

    pivot = Matrix2D.Translation(0, 0)
    position = Matrix2D.Translation(0, 0);
    rotation = Matrix2D.Rotation(0);
    scale = Matrix2D.Scale(1, 1);

    transformation = Matrix2D.Identity();

    shaderProgram;

    constructor(fragmentShaderPath = "/js/shader/fragment.shader", vertexShaderPath = "/js/shader/vertex.shader") {
        if (!Renderable.canvas) {
            Renderable.canvas = document.getElementById("canvas");
        }

        GL.createShaderProgramPromise(fragmentShaderPath, vertexShaderPath)
            .then(shader => this.shaderProgram = shader);
    }

    setPosition(x, y) {
        this.position = Matrix2D.Translation(x, y);
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

    update() {

    }

    updateTransformation(parentTransform = Matrix2D.Identity(), pivot = Matrix2D.Translation(0,0)) {
        this.transformation =
            parentTransform.multiply(pivot.minusXY())
                .multiply(this.position)
                .multiply(this.scale)
                .multiply(this.rotation)
                .multiply(this.pivot);

    }

    render() {
        if (!this.isReady() || !this.visible || !this.shaderProgram) {
            return;
        }

        GL.useShader(this.shaderProgram);
        const rect = Renderable.canvas.getBoundingClientRect();
        const texture = this.getTexture();
        if (texture) {
            GL.applyTexture(texture, "sprite");
        }
        const screen = Matrix2D.Scale(2 / rect.width, 2 / rect.height).multiply(Matrix2D.Translation(-rect.width / 2, -rect.height / 2));
        GL.applyMatrix(this.transformation, "transformation");
        GL.applyMatrix(screen, "screen");
        GL.drawTriangleStripPositionAndTexcoord(this.vertexData, "vertexPosition", "vertexTextureCoordinate");
    }
}

export default Renderable