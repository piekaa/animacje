import MenuHints from "./MenuHints.js";
import CodeAnalysis from "./CodeAnalysis.js";
import HintsGlobals from "./HintsGlobals.js";

class VariableHints extends MenuHints {

    cutLine(text) {
        return text;
    }

    applyHint() {
        const data = CodeAnalysis.inputContextData();
        const variable = document.getElementById(`hint${this.selectedHint}`).innerText;
        const value = variable.slice(data.textSoFar?.trim().length || 0);
        const code = HintsGlobals.codeElement.value;
        const pos = data.globalPosition;
        HintsGlobals.updateCode(code.slice(0, pos) + value + code.slice(pos));
        HintsGlobals.codeElement.setSelectionRange(pos + value.length, pos + value.length);
        HintsGlobals.focusCode();
        this.destroy();
    }

}

export default VariableHints