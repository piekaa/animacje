import Matrix2D from "./Matrix.js";
import AnimatedRenderable from "./animation/AnimatedRenderable.js";
import Vector from "./Vector.js";

class Camera extends AnimatedRenderable {

    worldPositionVector = new Vector(0, 0);

    matrix(rect) {
        const matrix = Matrix2D.Translation(rect.width / 2, rect.height / 2)
            .multiply(this.scale)
            .multiply(Matrix2D.Translation(-rect.width / 2, -rect.height / 2))
            .multiply(this.position.minusXY());

        this.worldPositionVector = Vector.FromMatrix(matrix);

        return matrix;
    }
}

export default Camera