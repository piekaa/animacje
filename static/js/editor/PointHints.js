import CodeAnalysis from "./CodeAnalysis.js";
import HintPoints from "./HintPoints.js";
import HintsGlobals from "./HintsGlobals.js";
import LineUpdateFunctions from "./LineUpdateFunctions.js";

class PointHints {

    static #currentHintPoints;

    static hide() {
        PointHints.#currentHintPoints?.destroy();
    }

    static lineHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 2, LineUpdateFunctions.pointsAndWidth, HintsGlobals.compileFunction);
    }

    static curveHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 3, LineUpdateFunctions.pointsAndWidth, HintsGlobals.compileFunction);
    }

    static customTypeHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 1, LineUpdateFunctions.point, HintsGlobals.compileFunction);
    }

    static callHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 1, LineUpdateFunctions.pointAndTime, HintsGlobals.compileFunction);
    }

}

export default PointHints