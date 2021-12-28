class VertexData {
    #buffer;
    #bufferData;
    #length;

    #data

    constructor(data, buffer, bufferData) {
        this.#data = data;
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

    getData() {
        return this.#data;
    }
}

export default VertexData;