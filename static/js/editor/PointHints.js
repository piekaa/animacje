import CodeAnalysis from "./CodeAnalysis.js";
import HintPoints from "./HintPoints.js";
import HintsGlobals from "./HintsGlobals.js";

class PointHints {

    static #currentHintPoints;

    static hide() {
        PointHints.#currentHintPoints?.destroy();
    }

    static lineHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 2, HintsGlobals.compileFunction);
    }

    static curveHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 3, HintsGlobals.compileFunction);
    }
}

export default PointHints