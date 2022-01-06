import CodeAnalysis from "./CodeAnalysis.js";
import TypeHints from "./TypeHints.js";
import HintsGlobals from "./HintsGlobals.js";
import PointHints from "./PointHints.js";

class Hints {

    static #hintMenuKeys = ["ArrowDown", "ArrowUp", "Escape", "Enter"];

    static #contextFunctions = {
        "type": TypeHints.showTypeHints,
        "line": PointHints.lineHints,
        "curve": PointHints.curveHints,
        "customType": PointHints.customTypeHints,
        "": TypeHints.hideHints,
    }

    static #contextRegexps = [
        {
            context: "line",
            reg: /.*= *line *\(.*\)/,
        },
        {
            context: "curve",
            reg: /.*= *curve *\(.*\)/,
        },
        {
            context: "type",
            reg: /.*= *[a-zA-Z0-9]*$/
        }
    ]

    static start(compileFunction) {
        HintsGlobals.codeElement = document.getElementById("code");
        HintsGlobals.codeElement.addEventListener("input", Hints.#update);
        HintsGlobals.codeElement.addEventListener("click", Hints.#update);
        HintsGlobals.codeElement.addEventListener("focus", Hints.#update);
        HintsGlobals.codeElement.addEventListener("keydown", Hints.#navigationUpdate);
        HintsGlobals.compileFunction = compileFunction;
        TypeHints.start();
    }

    static setDefinitions(definitions) {
        TypeHints.setDefinitions(definitions);
        Hints.#contextRegexps.push(...definitions.map(def => ({
            context: "customType",
            reg: new RegExp(`.*= *${def.name} *\\(.*\\)`)
        })));
    }

    static #navigationUpdate(event) {
        if (TypeHints.inHintMenu && Hints.#hintMenuKeys.includes(event.key)) {
            TypeHints.navigateHintsMenu(event)
            event.preventDefault();
        }
    }

    static #update(event) {

        if (event.key === "Escape") {
            return;
        }

        if (TypeHints.inHintMenu && Hints.#hintMenuKeys.includes(event.key)) {
            return;
        }

        const lineData = CodeAnalysis.inputContextData();

        Hints.#contextFunctions[Hints.#detectContext(lineData.textSoFar)](lineData)
    }

    static #detectContext(text) {
        PointHints.hide();
        for (let contextRegexp of Hints.#contextRegexps) {
            if (text.match(contextRegexp.reg)) {
                return contextRegexp.context;
            }
        }


        return "";
    }

}

export default Hints