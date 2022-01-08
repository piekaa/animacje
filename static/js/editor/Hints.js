import CodeAnalysis from "./CodeAnalysis.js";
import TypeHints from "./TypeHints.js";
import HintsGlobals from "./HintsGlobals.js";
import PointHints from "./PointHints.js";
import InitCompiler from "../compiler/InitCompiler.js";
import VariableHints from "./VariableHints.js";
import MethodHints from "./MethodHints.js";

class Hints {

    static #menuNavigationKeys = ["ArrowDown", "ArrowUp", "Escape", "Enter"];

    static currentMenuHints;
    static definitions;

    static #contextFunctions = {
        "type": () => {
            Hints.currentMenuHints = new TypeHints(Hints.definitions, Hints.destroyCallback).instance;
        },
        "variable": () => {
            Hints.currentMenuHints = new VariableHints(Object.keys(InitCompiler.variables()), Hints.destroyCallback).instance;
        },
        "method": () => {
            Hints.currentMenuHints = new MethodHints([
                "move",
                "moveSmooth",
                "moveWiggle"
            ], Hints.destroyCallback).instance;
        },
        "line": PointHints.lineHints,
        "curve": PointHints.curveHints,
        "customType": PointHints.customTypeHints,
        "call": PointHints.callHints,
        "": () => {
            Hints.currentMenuHints = Hints.currentMenuHints?.destroy()
        },
    }

    static destroyCallback() {
        Hints.currentMenuHints = undefined;
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
        },
        {
            context: "variable",
            reg: /^ *[a-zA-Z0-9]*$/
        },
        {
            context: "method",
            reg: /^ *[a-zA-Z0-9]*\. *[a-zA-Z0-9]*$/
        },
        {
            context: "call",
            reg: /^.*\..*\(.*\) *$/
        }
    ]

    static start(compileFunction) {
        HintsGlobals.codeElement = document.getElementById("code");
        HintsGlobals.codeElement.addEventListener("input", Hints.#update);
        HintsGlobals.codeElement.addEventListener("click", Hints.#update);
        HintsGlobals.codeElement.addEventListener("focus", Hints.#update);
        HintsGlobals.codeElement.addEventListener("keydown", Hints.#navigationUpdate);
        HintsGlobals.compileFunction = compileFunction;
    }

    static setDefinitions(definitions) {
        Hints.definitions = definitions.map(def => def.name);
        Hints.definitions.push("square", "line", "curve");
        Hints.#contextRegexps.push(...definitions.map(def => ({
            context: "customType",
            reg: new RegExp(`.*= *${def.name} *\\(.*\\)`)
        })));
    }

    static #navigationUpdate(event) {
        if (Hints.currentMenuHints && Hints.#menuNavigationKeys.includes(event.key)) {
            Hints.currentMenuHints.navigateHintsMenu(event)
            event.preventDefault();
        }
    }

    static #update(event) {
        if (event.key === "Escape") {
            return;
        }

        if (this.currentMenuHints && Hints.#menuNavigationKeys.includes(event.key)) {
            return;
        }

        const lineData = CodeAnalysis.inputContextData();

        console.log(Hints.#detectContext(lineData.textSoFar));

        Hints.#contextFunctions[Hints.#detectContext(lineData.textSoFar)](lineData)
    }

    static #detectContext(text) {
        PointHints.hide();
        Hints.currentMenuHints = Hints.currentMenuHints?.destroy();
        for (let contextRegexp of Hints.#contextRegexps) {
            if (text.match(contextRegexp.reg)) {
                return contextRegexp.context;
            }
        }
        return "";
    }

}

export default Hints