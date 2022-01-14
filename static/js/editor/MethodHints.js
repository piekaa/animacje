import MenuHints from "./MenuHints.js";
import CodeAnalysis from "./CodeAnalysis.js";
import AutofillFunctions from "./AutofillFunctions.js";

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
        const data = CodeAnalysis.inputContextData();
        const method = document.getElementById(`hint${this.selectedHint}`).innerText;
        const value = AutofillFunctions.functions["method"](method);
        this.updateCode(`${data.textSoFar.split(".")[0]}.${value}`, data);
    }

}

export default MethodHints