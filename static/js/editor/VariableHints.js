import MenuHints from "./MenuHints.js";

class VariableHints extends MenuHints {

    cutLine(text) {
        return text;
    }

    applyHint() {
        const variable = document.getElementById(`hint${this.selectedHint}`).innerText;
        this.updateCode(variable);
    }

}

export default VariableHints