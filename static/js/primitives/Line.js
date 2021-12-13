import Renderable from "../Renderable.js";
import GL from "../GL.js";
import Vector from "../Vector.js";
import PiekoszekMath from "../math.js";

class Line extends Renderable {

    constructor(startX, startY, endX, endY, width = 1) {
        super()

        const lx = (endX - startX) / 2;
        const ly = (endY - startY) / 2;


        const direction = Vector.Direction(-lx, -ly, lx, ly);
        const normal = direction.normal().normalized().multiply(width / 2);
        const minusNormal = direction.normal().normalized().multiply(width / 2).multiply(-1);

        const startVector = new Vector(-lx, -ly);
        const endVector = new Vector(lx, ly);

        const p1 = startVector.add(minusNormal);
        const p2 = startVector.add(normal);
        const p3 = endVector.add(minusNormal);
        const p4 = endVector.add(normal);

        this.vertexData = GL.createVertexData(
            [
                p1.x, p1.y,
                p2.x, p2.y,
                p3.x, p3.y,

                p2.x, p2.y,
                p3.x, p3.y,
                p4.x, p4.y,
            ]
        );
        this.setPivot(0, 0);
        this.setOrigin(PiekoszekMath.lerp(startX, endX, 0.5), PiekoszekMath.lerp(startY, endY, 0.5));

        this.triangleStrip = false;

        this.color = [1, 1, 1, 1];
    }
}

export default Line