import CodeAnalysis from "./CodeAnalysis.js";
import HintsGlobals from "./HintsGlobals.js";
import AutofillFunctions from "./AutofillFunctions.js";
import MenuHints from "./MenuHints.js";

class TypeHints extends MenuHints {

    cutLine(text) {
        return text.split("=")[1].trim();
    }

    addItem(type) {
        name = "";
        for (let i = 0; i < type.length; i++) {
            this.items[name] ||= new Set();
            this.items[name].add(type);
            name += type[i];
        }
        this.items[name] ||= new Set();
        this.items[name].add(type);
    }


    applyHint() {
        this.hints.style.display = "none";
        const data = CodeAnalysis.inputContextData();
        const type = document.getElementById(`hint${this.selectedHint}`).innerText;
        const value = AutofillFunctions.functions[type]?.(data.typeSoFar, type)
            || AutofillFunctions.functions["customType"](data.typeSoFar, type);
        const code = HintsGlobals.codeElement.value;
        const pos = data.globalPosition;
        HintsGlobals.updateCode(code.slice(0, pos) + value + code.slice(pos));
        HintsGlobals.codeElement.setSelectionRange(pos + value.length, pos + value.length);
        HintsGlobals.compileFunction();
        HintsGlobals.focusCode();
        this.destroy();
    }
}

export default TypeHints