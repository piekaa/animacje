import Matrix2D from "./Matrix.js";
import AnimatedRenderable from "./animation/AnimatedRenderable.js";
import Vector from "./Vector.js";

class Camera extends AnimatedRenderable {

    static current;

    constructor() {
        super();
        Camera.current = this;
    }

    worldPositionVector = new Vector(0, 0);

    matrix(rect) {
        const matrix = Matrix2D.Translation(rect.width / 2, rect.height / 2)
            .multiply(this.scale)
            .multiply(Matrix2D.Translation(-rect.width / 2, -rect.height / 2))
            .multiply(this.position.minusXY());

        this.worldPositionVector = Vector.FromMatrix(matrix);

        return matrix;
    }

    setPosition(x, y, ignoreLock = false) {
        if (document.getElementById("lockCamera").checked && !ignoreLock) {
            return;
        }
        super.setPosition(x, y);
        document.getElementById("cameraPosition").value = `${x.toFixed(2)}, ${y.toFixed(2)}`;
    }

    setScale(sx, sy, ignoreLock = false) {
        if (document.getElementById("lockCamera").checked && !ignoreLock) {
            return;
        }
        super.setScale(sx, sy);
        document.getElementById("cameraScale").value = `${sx.toFixed(2)}, ${sy.toFixed(2)}`;
    }

    setValuesAtFrame(frame) {
        if (document.getElementById("lockCamera").checked) {
            return;
        }
        super.setValuesAtFrame(frame);
    }
}

export default Camera