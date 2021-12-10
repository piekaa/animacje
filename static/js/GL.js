import VertexData from "./VertexData.js";
import CachedFetch from "./CachedFetch.js";
import TextureCreator from "./TextureCreator.js";

class GL {

    static #gl;

    static #currentShader;

    static #shaders = [];

    static createTextureForImage(img) {
        return TextureCreator.createTextureForImage(img, GL.#getGl())
    }

    static createShaderProgramPromise(fragmentShaderPath, vertexShaderPath) {

        let fragmentShaderSource;
        let vertexShaderSource;

        return new Promise((resolve => {
            CachedFetch.fetchText(vertexShaderPath)
                .then(text => vertexShaderSource = text)
                .then(() => CachedFetch.fetchText(fragmentShaderPath))
                .then(text => fragmentShaderSource = text)
                .then(() => resolve(GL.#createShaderProgram(vertexShaderSource, fragmentShaderSource)));
        }));


    }

    static #createShaderProgram(vertexShaderSource, fragmentShaderSource) {
        if (!GL.#shaders[vertexShaderSource + fragmentShaderSource]) {
            const gl = GL.#getGl();
            let shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, GL.#createVertexShader(vertexShaderSource));
            gl.attachShader(shaderProgram, GL.#createFragmentShader(fragmentShaderSource));
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                console.log(gl.getProgramInfoLog(shaderProgram));
                return undefined;
            }
            GL.#shaders[vertexShaderSource + fragmentShaderSource] = shaderProgram;
        }
        return GL.#shaders[vertexShaderSource + fragmentShaderSource];
    }

    static #createFragmentShader(source) {
        const gl = GL.#getGl();
        return GL.#createShader(source, gl.FRAGMENT_SHADER)
    }

    static #createVertexShader(source) {
        const gl = GL.#getGl();
        return GL.#createShader(source, gl.VERTEX_SHADER)
    }

    static #createShader(source, type) {
        const gl = GL.#getGl();
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    static useShader(shader) {
        const gl = GL.#getGl();
        this.#currentShader = shader;
        gl.useProgram(shader);
    }

    static applyMatrix(matrix, variableName) {
        const gl = GL.#getGl();
        gl.uniformMatrix3fv(
            gl.getUniformLocation(this.#currentShader, variableName),
            false,
            matrix.float32array());
    }

    static applyTexture(texture, variableName) {
        const gl = GL.#getGl();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(this.#currentShader, variableName), 0)
    }

    static drawTriangleStripPositionAndTexcoord(vertexData,
                                                vertexPositionVariableName,
                                                texcoordVariableName) {
        const gl = GL.#getGl();

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexData.getBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, vertexData.getBufferData(), gl.STATIC_DRAW);

        const vertexPositionLocation = gl.getAttribLocation(this.#currentShader, vertexPositionVariableName);
        const texcoordLocation = gl.getAttribLocation(this.#currentShader, texcoordVariableName);


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