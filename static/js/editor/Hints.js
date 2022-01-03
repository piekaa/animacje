import InitCompiler from "../compiler/InitCompiler.js";
import HintPoints from "./HintPoints.js";

class Hints {

    static #types = []

    static code;
    static #hints;

    static #currentHintPoints;

    static #inHintMenu = false;
    static #hintMenuKeys = ["ArrowDown", "ArrowUp", "Escape", "Enter"];

    static #contextFunctions = {
        "type": Hints.#showTypeHints,
        "line": Hints.#lineHints,
        "": Hints.#hideHints,
    }

    static #contextRegexps = [
        {
            context: "line",
            reg: /.*= *line *\(.*\)/,
        },
        {
            context: "type",
            reg: /.*= *[a-zA-Z0-9]*$/
        }
    ]

    static #selectedHint = 0;
    static #currentHintsLength = 0;

    static #compileFunction;

    static start(compileFunction) {
        Hints.code = document.getElementById("code");
        Hints.#hints = document.getElementById("hints");
        Hints.code.addEventListener("input", Hints.#update);
        Hints.code.addEventListener("click", Hints.#update);
        Hints.code.addEventListener("focus", Hints.#update);
        Hints.code.addEventListener("keydown", Hints.#navigationUpdate);
        Hints.#compileFunction = compileFunction;
        // Hints.#code.addEventListener("keyup", Hints.#update);
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

    static #navigationUpdate(event) {
        if (Hints.#inHintMenu && Hints.#hintMenuKeys.includes(event.key)) {
            Hints.#navigateHintsMenu(event)
            event.preventDefault();
        }
    }

    static #update(event) {

        if (event.key === "Escape") {
            return;
        }

        if (Hints.#inHintMenu && Hints.#hintMenuKeys.includes(event.key)) {
            return;
        }

        const lineData = Hints.#inputContextData();

        // console.log(lineData.textSoFar);
        // console.log(Hints.#detectContext(lineData.textSoFar));
        // console.log("")

        Hints.#contextFunctions[Hints.#detectContext(lineData.textSoFar)](lineData)
    }

    static #inputContextData() {
        const text = Hints.code.value;
        const maxPos = Hints.code.selectionStart;
        let line = 0;
        let position = 0;
        let lineStartPosition = 0;
        let textSoFar = "";
        for (let i = 0; i < maxPos; i++) {
            textSoFar += text[i];
            if (text[i] === '\n') {
                lineStartPosition = i + 1;
                line++;
                position = -1;
                textSoFar = "";
            }
            position++;
        }

        const newLineSearchResult = text.indexOf("\n", maxPos);

        return {
            line: line,
            position: position,
            textSoFar: textSoFar,
            typeSoFar: textSoFar.split("=")[1]?.trim(),
            globalPosition: maxPos,
            lineStartPosition: lineStartPosition,
            nextLineStartPosition: newLineSearchResult === -1 ? text.length : newLineSearchResult
        };
    }

    static #detectContext(text) {
        this.#currentHintPoints?.destroy();
        for (let contextRegexp of Hints.#contextRegexps) {
            if (text.match(contextRegexp.reg)) {
                return contextRegexp.context;
            }
        }
        return "";
    }

    static #showTypeHints(lineData) {
        const text = lineData.textSoFar;
        const typeStart = text.split("=")[1].trim();
        Hints.#buildHintMenu(Array.from(Hints.#types[typeStart] || []));
        Hints.#hints.style.left = `${lineData.position * 8 + 10}px`;
        Hints.#hints.style.top = `${lineData.line * 15 + 2}px`;
    }

    static #buildHintMenu(hints) {
        if (hints.length === 0) {
            Hints.#hints.style.display = "none";
            Hints.#inHintMenu = false;
            return;
        }
        Hints.#hints.style.display = "flex";
        let i = 0;
        Hints.#hints.innerHTML = hints.map(hint => `<div id="hint${i++}" class="hint">${hint}</div>`).join("");
        Hints.#inHintMenu = true;
        Hints.#currentHintsLength = hints.length;
        Hints.#selectedHint = -1;
        Hints.#selectNextHint();
    }

    static #navigateHintsMenu(event) {
        switch (event.key) {
            case "Escape":
                Hints.#hints.style.display = "none";
                Hints.#inHintMenu = false;
                break;
            case "ArrowDown":
                Hints.#selectNextHint();
                break;
            case "ArrowUp":
                Hints.#selectPrevHint();
                break;
            case "Enter":
                Hints.#applyHint();
        }
    }

    static #selectNextHint() {
        document.getElementById(`hint${Hints.#selectedHint}`)?.classList.remove("selectedHint");
        Hints.#selectedHint++;
        Hints.#selectedHint %= Hints.#currentHintsLength;
        document.getElementById(`hint${Hints.#selectedHint}`)?.classList.add("selectedHint");
    }

    static #selectPrevHint() {
        document.getElementById(`hint${Hints.#selectedHint}`)?.classList.remove("selectedHint");
        Hints.#selectedHint--;
        Hints.#selectedHint = ((Hints.#selectedHint % Hints.#currentHintsLength) + Hints.#currentHintsLength) % Hints.#currentHintsLength;
        document.getElementById(`hint${Hints.#selectedHint}`)?.classList.add("selectedHint");
    }

    static #applyHint() {
        Hints.#hints.style.display = "none";
        Hints.#inHintMenu = false;
        const data = Hints.#inputContextData();
        const value = document.getElementById(`hint${Hints.#selectedHint}`).innerText.slice(data.typeSoFar.length);
        const code = Hints.code.value;
        const pos = data.globalPosition;
        document.getElementById("code").value = code.slice(0, pos) + value + code.slice(pos);
        Hints.code.setSelectionRange(pos + value.length, pos + value.length);
    }


    static #hideHints() {
        Hints.#hints.style.display = "none";
    }

    static #lineHints() {
        const data = Hints.#inputContextData();
        Hints.#currentHintPoints = new HintPoints(data, Hints.#compileFunction);
    }

}

export default Hints