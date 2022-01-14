import CodeAnalysis from "./CodeAnalysis.js";
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
        const data = CodeAnalysis.inputContextData();
        const type = document.getElementById(`hint${this.selectedHint}`).innerText;
        const value = AutofillFunctions.functions[type]?.(type)
            || AutofillFunctions.functions["customType"](type);
        this.updateCode(`${data.textSoFar.split("=")[0]}= ${value}`);
    }
}

export default TypeHints