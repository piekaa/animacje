import Line from "../primitives/Line.js";
import PiekoszekEngine from "../PiekoszekEngine.js";
import DefinitionStorage from "../definitions/DefinitionStorage.js";
import StandardRenderable from "../animation/StandardRenderable.js";
import Square from "../primitives/Square.js";
import Camera from "../Camera.js";

// todo wykrywanie cyklicznych zależności
// todo nadpisywanie zmiennych

class InitCompiler {

    static #primitives = {
        "line": Line,
        "square": Square,
    };

    static #definitions = {};

    static #variables = {};

    static compile(code, pivot, variables = []) {
        InitCompiler.#variables["pivot"] = pivot;
        return new Promise(resolve => {
            PiekoszekEngine.removeAll();
            DefinitionStorage.loadAll().then(definitions => {
                InitCompiler.#definitions = definitions;
                InitCompiler.#variables["camera"] = Camera.current;
                variables.forEach(v => {
                    InitCompiler.#variables[v.name] = v.value;
                });
                InitCompiler.#compile(code, PiekoszekEngine.root(), pivot);
                resolve(InitCompiler.#variables);
            });
        });

    }

    static #compile(code, parent, pivot) {
        const lines = code.split(/\r?\n/);
        let objects = [];
        lines.forEach(l => {
            if (l.length === 0) {
                return;
            }
            const created = InitCompiler.#parseLine(l, parent, pivot)
            if (created) {
                objects.push(created);
            }
        });
        return objects;
    }

    static #parseLine(line, parent, pivot) {

        if (line.startsWith("//")) {
            return;
        }

        const l = line.replace(/\s/g, '');
        if (l.includes("=")) {
            const sp = l.split(/[=(,)]/);
            sp.pop();
            if (l.includes("()")) {
                sp.pop();
            }
            const varName = sp.shift();
            const type = sp.shift();

            const args = InitCompiler.#parseArgs(sp);
            const obj = InitCompiler.#createObject(type, args, parent, pivot);
            InitCompiler.#variables[varName] = obj;
            return obj;
        } else {
            const firstDotIndex = l.indexOf(".");
            const variableName = l.substring(0, firstDotIndex)
            const sp = l.substring(firstDotIndex + 1, l.length).split(/[(,)]/);

            sp.pop();
            if (l.includes("()")) {
                sp.pop();
            }
            const functionName = sp.shift();
            const args = InitCompiler.#parseArgs(sp);
            const obj = InitCompiler.#variables[variableName];
            obj[functionName](...args);
        }
    }

    static #createObject(type, args, parent, pivot) {

        const primitiveType = InitCompiler.#primitives[type];
        if (primitiveType) {
            let obj = new primitiveType(...args);
            PiekoszekEngine.addAsChild(parent, obj);
            return obj;
        }

        const definition = InitCompiler.#definitions[type];
        if (definition) {
            const complexObject = new StandardRenderable(...args);
            InitCompiler.#compile(definition, complexObject);
            complexObject.setPivot(pivot.position.x() / 2, pivot.position.y() / 2);
            PiekoszekEngine.addAsChild(parent, complexObject);
            return complexObject;
        }

        throw new Error(`${type} is not defined`);
    }

    static #parseArgs(args) {
        return args.map(arg => {

            if (InitCompiler.#variables[arg]) {
                return InitCompiler.#variables[arg];
            }

            if (arg.startsWith(`"`)) {
                return arg.substring(1, arg.length - 1);
            }
            return parseFloat(arg);
        });
    }

}

export default InitCompiler