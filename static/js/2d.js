import Bezier from "./bezier.js";
import Point from "./Point.js";

class PiekoszekEngine {

    #canvas

    #gl

    #vertexShader
    #fragmentShader

    #shaderProgram

    constructor(canvas) {
        this.#canvas = canvas;
        this.#gl = canvas.getContext("webgl");
        this.#gl.clearColor(1, 0, 0, 1);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);

        fetch("/js/shader/fragment.shader")
            .then(res => res.text())
            .then(text => this.#fragmentShader = this.#loadShader(this.#gl.FRAGMENT_SHADER, text))
            .then(() => fetch("/js/shader/vertex.shader"))
            .then(res => res.text())
            .then(text => this.#vertexShader = this.#loadShader(this.#gl.VERTEX_SHADER, text))
            .then(() => this.#initShaderProgram())
            .then(() => setInterval(this.#update.bind(this), 100));
    }

    #initShaderProgram() {
        this.#shaderProgram = this.#gl.createProgram();
        this.#gl.attachShader(this.#shaderProgram, this.#vertexShader);
        this.#gl.attachShader(this.#shaderProgram, this.#fragmentShader);
        this.#gl.linkProgram(this.#shaderProgram);

        if (!this.#gl.getProgramParameter(this.#shaderProgram, this.#gl.LINK_STATUS)) {
            console.log(+this.#gl.getProgramInfoLog(this.#shaderProgram));
        }
    }

    #loadShader(type, source) {
        const shader = this.#gl.createShader(type);
        this.#gl.shaderSource(shader, source);
        this.#gl.compileShader(shader);

        if (!this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS)) {
            console.log(this.#gl.getShaderInfoLog(shader));
        }
        return shader;
    }


    #update() {

        this.#gl.clearColor(0, 0, 0, 1);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);


        const points = Bezier.points(
            new Point(50, 200),
            new Point(1300, 50),
            new Point(300, 600)
        )


        let pos = [];

        points.forEach( p => {
            pos.push(p.x);
            pos.push(p.y);
        })



        const positionBuffer = this.#gl.createBuffer();
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, positionBuffer);
        this.#gl.bufferData(this.#gl.ARRAY_BUFFER, new Float32Array(pos), this.#gl.STATIC_DRAW);

        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, positionBuffer);

        const vertexPositionLocation = this.#gl.getAttribLocation(this.#shaderProgram, 'vertexPosition');

        this.#gl.vertexAttribPointer(
            vertexPositionLocation,
            2,
            this.#gl.FLOAT,
            null,
            0,
            0
        );

        this.#gl.enableVertexAttribArray(vertexPositionLocation);

        this.#gl.useProgram(this.#shaderProgram);

        const rect = this.#canvas.getBoundingClientRect();

        this.#gl.uniform2fv(
            this.#gl.getUniformLocation(this.#shaderProgram, "screen"),
            new Float32Array([rect.width, rect.height])
        )

        this.#gl.drawArrays(this.#gl.LINE_STRIP, 0, points.length);

    }

}

export default PiekoszekEngine