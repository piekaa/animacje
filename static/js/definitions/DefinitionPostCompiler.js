import PiekoszekEngine from "../2d.js";
import DefinitionStorage from "./DefinitionStorage.js";

class DefinitionPostCompiler {

    static postCompileSteps(name, code,pivot) {
        const root = PiekoszekEngine.root();
        this.#showAllChildren(root);
        PiekoszekEngine.add(pivot)
        return DefinitionStorage.save(name, code);
    }

    static #showAllChildren(renderable) {
        renderable.children.forEach(child => {
            child.show();
            DefinitionPostCompiler.#showAllChildren(child);
        })
    }

}

export default DefinitionPostCompiler