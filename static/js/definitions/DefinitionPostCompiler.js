import PiekoszekEngine from "../PiekoszekEngine.js";

class DefinitionPostCompiler {

    static postCompileSteps(pivot) {
        const root = PiekoszekEngine.root();
        this.#showAllChildren(root);
        PiekoszekEngine.add(pivot)
    }

    static #showAllChildren(renderable) {
        renderable.children.forEach(child => {
            child.show();
            DefinitionPostCompiler.#showAllChildren(child);
        })
    }

}

export default DefinitionPostCompiler