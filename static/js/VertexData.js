class VertexData {
    #buffer;
    #bufferData;
    #length;

    constructor(data, buffer, bufferData) {
        this.#buffer = buffer;
        this.#bufferData = bufferData;
        this.#length = data.length;
    }

    getBuffer() {
        return this.#buffer;
    }

    getBufferData() {
        return this.#bufferData;
    }

    getLength() {
        return this.#length;
    }

}

export default VertexData;