import AnimatedRenderable from "../animation/AnimatedRenderable.js";
import Vector from "../Vector.js";
import Bezier from "../bezier.js";
import Gl from "../GL.js";

class Curve extends AnimatedRenderable {

    constructor(x1, y1, x2, y2, x3, y3, width = 4, density = 30) {
        super();
        let triangles = Bezier.triangles(new Vector(x1, y1),
            new Vector(x2, y2),
            new Vector(x3, y3),
            width, density);
        this.vertexData = Gl.createVertexData(triangles.flatMap(t => [t.x, t.y]));
    }

}

export default Curve