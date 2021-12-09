import VertexData from "./VertexData.js";

class GL {

    static #gl;

    static drawTriangleStripPositionAndTexcoord(vertexData,
                                                vertexPositionVariableName,
                                                texcoordVariableName,
                                                shader) {
        const gl = GL.#getGl();

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexData.getBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, vertexData.getBufferData(), gl.STATIC_DRAW);

        const vertexPositionLocation = gl.getAttribLocation(shader, vertexPositionVariableName);
        const texcoordLocation = gl.getAttribLocation(shader, texcoordVariableName);


        gl.vertexAttribPointer(
            vertexPositionLocation,
            2,
            gl.FLOAT,
            null,
            16,
            0
        );

        gl.vertexAttribPointer(
            texcoordLocation,
            2,
            gl.FLOAT,
            null,
            16,
            8
        );

        gl.enableVertexAttribArray(vertexPositionLocation);
        gl.enableVertexAttribArray(texcoordLocation);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexData.getLength() / 4);
    }

    static createVertexData(data) {
        const gl = GL.#getGl();

        return new VertexData(data, gl.createBuffer(), new Float32Array(data));
    }

    static enableAlphaBlend() {
        const gl = GL.#getGl();

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    static clearToColor(r = 0, g = 0, b = 0) {
        const gl = GL.#getGl();

        gl.clearColor(r, g, b, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    static #getGl() {
        if (!GL.#gl) {
            GL.#gl = document.getElementById("canvas").getContext("webgl");
        }
        return this.#gl;
    }


}

export default GL