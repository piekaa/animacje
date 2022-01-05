import CodeAnalysis from "./CodeAnalysis.js";
import InitCompiler from "../compiler/InitCompiler.js";
import HintsGlobals from "./HintsGlobals.js";
import AutofillFunctions from "./AutofillFunctions.js";

class TypeHints {

    static #hints;
    static #selectedHint = 0;
    static #currentHintsLength = 0;
    static #types = []
    static inHintMenu = false;

    static start() {
        TypeHints.#hints = document.getElementById("hints");
    }

    static setDefinitions(definitions) {
        TypeHints.#types = [];
        TypeHints.#addTypes(definitions.map(d => d.name));
        TypeHints.#addTypes(Object.keys(InitCompiler.primitives));
    }

    static #addTypes(types) {
        types.forEach(t => TypeHints.#addType(t));

    }

    static #addType(type) {
        name = "";
        for (let i = 0; i < type.length; i++) {
            TypeHints.#types[name] ||= new Set();
            TypeHints.#types[name].add(type);
            name += type[i];
        }
    }

    static showTypeHints(lineData) {
        const text = lineData.textSoFar;
        const typeStart = text.split("=")[1].trim();
        TypeHints.buildHintMenu(Array.from(TypeHints.#types[typeStart] || []));
        TypeHints.#hints.style.left = `${lineData.position * 8 + 10}px`;
        TypeHints.#hints.style.top = `${lineData.line * 15 + 2}px`;
    }

    static buildHintMenu(hints) {
        if (hints.length === 0) {
            TypeHints.#hints.style.display = "none";
            TypeHints.inHintMenu = false;
            return;
        }
        TypeHints.#hints.style.display = "flex";
        let i = 0;
        TypeHints.#hints.innerHTML = hints.map(hint => `<div id="hint${i++}" class="hint">${hint}</div>`).join("");
        TypeHints.inHintMenu = true;
        TypeHints.#currentHintsLength = hints.length;
        TypeHints.#selectedHint = -1;
        TypeHints.selectNextHint();
    }

    static navigateHintsMenu(event) {
        switch (event.key) {
            case "Escape":
                TypeHints.#hints.style.display = "none";
                TypeHints.inHintMenu = false;
                break;
            case "ArrowDown":
                TypeHints.selectNextHint();
                break;
            case "ArrowUp":
                TypeHints.selectPrevHint();
                break;
            case "Enter":
                TypeHints.applyHint();
        }
    }

    static selectNextHint() {
        document.getElementById(`hint${TypeHints.#selectedHint}`)?.classList.remove("selectedHint");
        TypeHints.#selectedHint++;
        TypeHints.#selectedHint %= TypeHints.#currentHintsLength;
        document.getElementById(`hint${TypeHints.#selectedHint}`)?.classList.add("selectedHint");
    }

    static selectPrevHint() {
        document.getElementById(`hint${TypeHints.#selectedHint}`)?.classList.remove("selectedHint");
        TypeHints.#selectedHint--;
        TypeHints.#selectedHint = ((TypeHints.#selectedHint % TypeHints.#currentHintsLength) + TypeHints.#currentHintsLength) % TypeHints.#currentHintsLength;
        document.getElementById(`hint${TypeHints.#selectedHint}`)?.classList.add("selectedHint");
    }

    static applyHint() {
        TypeHints.#hints.style.display = "none";
        TypeHints.inHintMenu = false;
        const data = CodeAnalysis.inputContextData();
        const type = document.getElementById(`hint${TypeHints.#selectedHint}`).innerText;
        const value = AutofillFunctions.functions[type]?.(data.typeSoFar) || type.slice(data.typeSoFar.length);
        const code = HintsGlobals.codeElement.value;
        const pos = data.globalPosition;
        HintsGlobals.updateCode(code.slice(0, pos) + value + code.slice(pos));
        HintsGlobals.codeElement.setSelectionRange(pos + value.length, pos + value.length);
        HintsGlobals.compileFunction();
        HintsGlobals.focusCode();
    }


    static hideHints() {
        TypeHints.#hints.style.display = "none";
        this.inHintMenu = false;
    }

}

export default TypeHints