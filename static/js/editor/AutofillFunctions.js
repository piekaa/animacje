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

    static #line(typeSoFar) {
        const tp = AutofillFunctions.#translatedPoint;
        const autofill = `line(${tp(100, 100)}, ${tp(800, 800)}, 10)`;
        return AutofillFunctions.#cutTypeSoFar(typeSoFar, autofill);
    }

    static #text(typeSoFar) {
        const tp = AutofillFunctions.#translatedPoint;
        const autofill = `text("abc", ${tp(100, 100)})`;
        return AutofillFunctions.#cutTypeSoFar(typeSoFar, autofill);
    }

    static #curve(typeSoFar) {
        const tp = AutofillFunctions.#translatedPoint;
        const autofill = `curve(${tp(100, 100)}, ${tp(600, 200)}, ${tp(800, 800)}, 10)`;
        return AutofillFunctions.#cutTypeSoFar(typeSoFar, autofill);
    }

    static #customType(typeSoFar, type) {
        const tp = AutofillFunctions.#translatedPoint;
        const autofill = `${type}(${tp(400, 400)})`;
        return AutofillFunctions.#cutTypeSoFar(typeSoFar, autofill);
    }

    static #method(typeSoFar = "", method) {
        const tp = AutofillFunctions.#translatedPoint;
        const autofill = MethodAutofillFunctions.functions[method](method, tp(400,400));
        return AutofillFunctions.#cutTypeSoFar(typeSoFar.split(".")[1], autofill);
    }

    static #translatedPoint(x, y) {
        const tx = Camera.current.position.x();
        const ty = Camera.current.position.y();
        return `${parseFloat(x + tx).toFixed(2)}, ${parseFloat(y + ty).toFixed(2)}`;
    }

    static #cutTypeSoFar(typeSoFar, fullText) {
        return fullText.slice(typeSoFar.length);
    }

}

export default AutofillFunctions