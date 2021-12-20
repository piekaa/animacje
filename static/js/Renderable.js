import Matrix2D from "./Matrix.js";
import GL from "./GL.js";
import Vector from "./Vector.js";

class Renderable {

    #id

    static #nextId = 0;

    getId() {
        return this.#id;
    }

    static canvas;

    vertexData;

    visible = false;

    parent = undefined;
    children = [];

    // todo zIndex na tym samym poziomie hierarchii (cześćciowo dziedziczony od rodziców)
    zIndex = 0;

    origin = Matrix2D.Translation(0, 0);
    pivot = Matrix2D.Translation(0, 0)
    position = Matrix2D.Translation(0, 0);
    rotation = Matrix2D.Rotation(0);
    scale = Matrix2D.Scale(1, 1);

    worldPositionVector = new Vector(0, 0)

    transformation = Matrix2D.Identity();

    shaderProgram;

    color = [1, 1, 1, 1];

    useTexcoord = false;
    triangleStrip = true;

    constructor(fragmentShaderPath = "/js/shader/untexturedFragment.shader", vertexShaderPath = "/js/shader/vertex.shader") {
        this.#id = Renderable.#nextId++;

        if (!Renderable.canvas) {
            Renderable.canvas = document.getElementById("canvas");
        }

        GL.createShaderProgramPromise(fragmentShaderPath, vertexShaderPath)
            .then(shader => {
                this.shaderProgram = shader
            });
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    isVisible() {
        return this.visible && (this.parent === undefined || this.parent.isVisible());
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

    setOrigin(ox, oy) {
        this.origin = Matrix2D.Translation(ox, oy);
    }

    setColor(r = 1, g = 1, b = 1, a = 1) {
        this.color = [r, g, b, a];
    }

    isReady() {
        return this.shaderProgram;
    }

    getTexture() {
        return undefined;
    }

    update() {

    }

    updateTransformation(parentTransform = Matrix2D.Identity(), parentPivot = Matrix2D.Translation(0, 0)) {
        this.transformation =
            parentTransform.multiply(parentPivot)
                .multiply(this.origin)
                .multiply(this.position)
                .multiply(this.scale)
                .multiply(this.rotation)
                .multiply(this.pivot);

        //todo this might not work with scaled object
        const worldPosition = this.transformation.multiply(this.pivot.minusXY());
        this.worldPositionVector = new Vector(worldPosition.x(), worldPosition.y());

    }

    render() {

        if (!this.isReady() || !this.isVisible() || !this.shaderProgram) {
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
        GL.applyColor(this.color);


        if (this.useTexcoord) {
            GL.drawTriangleStripPositionAndTexcoord(this.vertexData, "vertexPosition", "vertexTextureCoordinate");
        } else {
            if (this.triangleStrip) {
                GL.drawTriangleStripVertexPosition(this.vertexData, "vertexPosition");
            } else {
                GL.drawTriangleVertexPosition(this.vertexData, "vertexPosition");
            }
        }
    }
}

export default Renderable