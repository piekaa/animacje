class Call {

    #obj
    #fun
    #params
    #frame

    constructor(obj, fun, frame, params) {
        this.#obj = obj;
        this.#fun = fun;
        this.#params = params;
        this.#frame = frame;
    }

    updateFrame() {
    }

    setValuesAtFrame(frame) {
        if(frame === this.#frame) {
            console.log(this.#params)
            this.#obj[this.#fun](...this.#params);
        }
    }
}

export default Call