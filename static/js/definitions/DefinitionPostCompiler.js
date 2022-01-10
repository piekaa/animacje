import PiekoszekEngine from "../PiekoszekEngine.js";
import Hints from "../editor/Hints.js";

class DefinitionPostCompiler {

    static postCompileSteps(pivot, definitionFiles) {
        const root = PiekoszekEngine.root();
        this.#showAllChildren(root);
        PiekoszekEngine.add(pivot)
        Hints.setDefinitions(definitionFiles.getRawData());
    }

    static #showAllChildren(renderable) {
        renderable.children.forEach(child => {
            child.show();
            DefinitionPostCompiler.#showAllChildren(child);
        })
    }

}

export default DefinitionPostCompiler