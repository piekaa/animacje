import Camera from "../Camera.js";
import MethodAutofillFunctions from "./MethodAutofillFunctions.js";

class AutofillFunctions {

    static functions = {
        "line": AutofillFunctions.#line,
        "curve": AutofillFunctions.#curve,
        "text": AutofillFunctions.#text,
        "customType": AutofillFunctions.#customType,
        "method": AutofillFunctions.#method
    }

    static #line() {
        const tp = AutofillFunctions.#translatedPoint;
        return `line(${tp(100, 100)}, ${tp(800, 800)}, 10)`;
    }

    static #text() {
        const tp = AutofillFunctions.#translatedPoint;
        return `text("abc", ${tp(100, 100)})`;
    }

    static #curve() {
        const tp = AutofillFunctions.#translatedPoint;
        return `curve(${tp(100, 100)}, ${tp(600, 200)}, ${tp(800, 800)}, 10)`;
    }

    static #customType(type) {
        const tp = AutofillFunctions.#translatedPoint;
        return `${type}(${tp(400, 400)})`;
    }

    static #method(method) {
        const tp = AutofillFunctions.#translatedPoint;
        return MethodAutofillFunctions.functions[method](method, tp(400, 400));
    }

    static #translatedPoint(x, y) {
        const tx = Camera.current.position.x();
        const ty = Camera.current.position.y();
        return `${parseFloat(x + tx).toFixed(2)}, ${parseFloat(y + ty).toFixed(2)}`;
    }
}

export default AutofillFunctions