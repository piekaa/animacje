import Renderable from "../Renderable.js";
import Gl from "../GL.js";

class Square extends Renderable {
    constructor(x,y, size) {
        super();

        this.vertexData = Gl.createVertexData([
            -1, -1,
            -1, size,
            size, -1,
            size, size,
        ]);

        this.setPosition(x,y);
        this.setPivot(size/2, size/2);

        this.visible = true;
    }
}

export default Square;