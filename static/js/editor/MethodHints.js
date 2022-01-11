import MenuHints from "./MenuHints.js";
import CodeAnalysis from "./CodeAnalysis.js";
import AutofillFunctions from "./AutofillFunctions.js";
import HintsGlobals from "./HintsGlobals.js";

class MethodHints extends MenuHints {

    cutLine(text) {
        return text.split(".")[1].trim();
    }

    addItem(type) {
        name = "";
        for (let i = 0; i < type.length; i++) {
            console.log(name)
            this.items[name] ||= new Set();
            console.log(this.items[name])
            this.items[name].add(type);
            name += type[i];
        }
        this.items[name] ||= new Set();
        this.items[name].add(type);
    }

    applyHint() {
        this.hints.style.display = "none";
        const data = CodeAnalysis.inputContextData();
        const method = document.getElementById(`hint${this.selectedHint}`).innerText;
        const value = AutofillFunctions.functions["method"](data.textSoFar, method);
        const code = HintsGlobals.codeElement.value;
        const pos = data.globalPosition;
        HintsGlobals.updateCode(code.slice(0, pos) + value + code.slice(pos));
        HintsGlobals.codeElement.setSelectionRange(pos + value.length, pos + value.length);
        HintsGlobals.compileFunction();
        HintsGlobals.focusCode();
        this.destroy();
    }

}

export default MethodHints