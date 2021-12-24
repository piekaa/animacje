import PiekoszekEngine from "../PiekoszekEngine.js";
import InitCompiler from "../compiler/InitCompiler.js";
import DefinitionPostCompiler from "./DefinitionPostCompiler.js";
import DefinitionStorage from "./DefinitionStorage.js";
import Square from "../primitives/Square.js";

PiekoszekEngine.start();

const pivot = new Square(100, 100, 10);
pivot.color = [0.2, 1, 0.2, 0.6];
pivot.zIndex = 10000;
PiekoszekEngine.add(pivot);

document.getElementById("compileButton").onclick = compile;

function compile() {
    const name = document.getElementById("definitionName").value;
    const code = document.getElementById("code").value;
    InitCompiler.compile(code, pivot)
        .then(() => DefinitionPostCompiler.postCompileSteps(name, code, pivot))
        .then(() => loadDefinitions());
}

function loadDefinitions() {
    DefinitionStorage.loadAllNames()
        .then(names => {
            const definitions = document.getElementById("definitions");
            definitions.innerHTML = "";
            names.forEach(name => {
                let button = document.createElement("button");
                button.innerText = name;
                button.onclick = () => {
                    DefinitionStorage.load(name)
                        .then(code => {
                            document.getElementById("definitionName").value = name;
                            document.getElementById("code").value = code;
                            compile();
                        });
                };
                definitions.appendChild(button);
            });
        });
}

loadDefinitions();

