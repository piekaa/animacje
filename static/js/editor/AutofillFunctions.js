import Camera from "../Camera.js";

class AutofillFunctions {

    static functions = {
        "line": AutofillFunctions.#line,
        "curve": AutofillFunctions.#curve
    }

    static #line(typeSoFar) {
        const tp = AutofillFunctions.#translatedPoint;
        const autofill = `line(${tp(100, 100)}${tp(800, 800)}10)`;
        return AutofillFunctions.#cutTypeSoFar(typeSoFar, autofill);
    }

    static #curve(typeSoFar) {
        const tp = AutofillFunctions.#translatedPoint;
        const autofill = `curve(${tp(100, 100)}${tp(600, 200)}${tp(800, 800)}10)`;
        return AutofillFunctions.#cutTypeSoFar(typeSoFar, autofill);
    }

    static #translatedPoint(x, y) {
        const tx = Camera.current.position.x();
        const ty = Camera.current.position.y();
        return `${parseFloat(x + tx).toFixed(2)}, ${parseFloat(y + ty).toFixed(2)}, `;
    }

    static #cutTypeSoFar(typeSoFar, fullText) {
        return fullText.slice(typeSoFar.length);
    }

}

export default AutofillFunctions