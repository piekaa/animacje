import CodeAnalysis from "./CodeAnalysis.js";
import HintPoints from "./HintPoints.js";
import HintsGlobals from "./HintsGlobals.js";
import DragUpdateFunctions from "./DragUpdateFunctions.js";

class PointHints {

    static #currentHintPoints;

    static hide() {
        PointHints.#currentHintPoints?.destroy();
    }

    static lineHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 2, DragUpdateFunctions.pointsAndWidth, HintsGlobals.compileFunction);
    }

    static curveHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 3, DragUpdateFunctions.pointsAndWidth, HintsGlobals.compileFunction);
    }

    static textHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 1, DragUpdateFunctions.textAndPoint, HintsGlobals.compileFunction, 1);
    }

    static textBoxHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 1, DragUpdateFunctions.textAndPointWidthHeight, HintsGlobals.compileFunction, 1);
    }

    static dialogHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 1, DragUpdateFunctions.textAndPoint, HintsGlobals.compileFunction, 1);
    }

    static imageHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 1, DragUpdateFunctions.textAndPoint, HintsGlobals.compileFunction, 1);
    }

    static customTypeHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 1, DragUpdateFunctions.pointAndCustomArgs, HintsGlobals.compileFunction);
    }

    static callHints() {
        const data = CodeAnalysis.inputContextData();
        PointHints.#currentHintPoints = new HintPoints(data, 1, DragUpdateFunctions.pointAndTime, HintsGlobals.compileFunction);
    }

}

export default PointHints