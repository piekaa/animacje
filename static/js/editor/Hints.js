import InitCompiler from "../compiler/InitCompiler.js";

class Hints {

    static #types = []

    static #code;
    static #hints;

    static #contextFunctions = {
        "type": Hints.#showTypeHints,
        "": () => {
        }
    }

    static start() {
        Hints.#code = document.getElementById("code");
        Hints.#hints = document.getElementById("hints");
        Hints.#code.addEventListener("input", Hints.#update);
    }

    static setDefinitions(definitions) {
        Hints.#types = [];
        Hints.#addTypes(definitions.map(d => d.name));
        Hints.#addTypes(Object.keys(InitCompiler.primitives));
    }

    static #addTypes(types) {
        types.forEach(t => Hints.#addType(t));

    }

    static #addType(type) {
        name = "";
        for (let i = 0; i < type.length; i++) {
            Hints.#types[name] ||= new Set();
            Hints.#types[name].add(type);
            name += type[i];
        }
    }

    static #update(event) {
        const lineData = Hints.#findCurrentLineAndPosition();
        Hints.#contextFunctions[Hints.#detectContext(lineData.textSoFar)](lineData)
    }

    static #findCurrentLineAndPosition() {
        const text = Hints.#code.value;
        const maxPos = Hints.#code.selectionStart;
        let line = 0;
        let position = 0;
        let textSoFar = "";
        for (let i = 0; i < maxPos; i++) {
            textSoFar += text[i];
            if (text[i] === '\n') {
                line++;
                position = -1;
                textSoFar = "";
            }
            position++;
        }
        return {line: line, position: position, textSoFar: textSoFar};
    }

    static #detectContext(text) {
        if (text.match(/.*=.*/)) {
            return "type"
        }
        return "";
    }

    static #showTypeHints(lineData) {
        const text = lineData.textSoFar;
        const typeStart = text.split("=")[1].trim();
        Hints.#hints.innerHTML = Array.from(Hints.#types[typeStart] || []).join(", ");
        Hints.#hints.style.left = `${lineData.position * 8 + 10}px`;
        Hints.#hints.style.top = `${lineData.line * 15 + 2}px`;
    }

}

export default Hints