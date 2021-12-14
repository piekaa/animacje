import Line from "./primitives/Line.js";
import PiekoszekEngine from "./2d.js";
import DefinitionStorage from "./definitions/DefinitionStorage.js";
import StandardRenderable from "./StandardRenderable.js";

// todo wykrywanie cyklicznych zależności
// todo napisywanie zmiennych

class Compiler {

    static #primitives = {
        "line": Line,
    };

    static #definitions = {};

    static #variables = {};

    static compile(code, pivot) {
        Compiler.#variables["pivot"] = pivot;
        return new Promise(resolve => {
            PiekoszekEngine.removeAll();
            DefinitionStorage.loadAll().then(definitions => {
                Compiler.#definitions = definitions;
                Compiler.#compile(code, PiekoszekEngine.root(), pivot);
                resolve();
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
            const created = Compiler.#parseLine(l, parent, pivot)
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

            const args = Compiler.#parseArgs(sp);
            const obj = Compiler.#createObject(type, args, parent, pivot);
            Compiler.#variables[varName] = obj;
            return obj;
        } else {
            const sp = l.split(/[.(,)]/);
            sp.pop();
            if (l.includes("()")) {
                sp.pop();
            }
            const variableName = sp.shift();
            const functionName = sp.shift();
            const args = Compiler.#parseArgs(sp);
            const obj = Compiler.#variables[variableName];
            obj[functionName](...args);
        }
    }

    static #createObject(type, args, parent, pivot) {

        const primitiveType = Compiler.#primitives[type];
        if (primitiveType) {
            let obj = new primitiveType(...args);
            PiekoszekEngine.addAsChild(parent, obj);
            return obj;
        }

        const definition = Compiler.#definitions[type];
        if (definition) {
            const complexObject = new StandardRenderable(...args);
            Compiler.#compile(definition, complexObject);
            complexObject.setPivot(pivot.position.x() / 2, pivot.position.y() / 2);
            PiekoszekEngine.addAsChild(parent, complexObject);
            return complexObject;
        }

        throw new Error(`${type} is not defined`);
    }

    static #parseArgs(args) {
        return args.map(arg => {
            if (arg.startsWith(`"`)) {
                return arg.substring(1, arg.length - 1);
            } else {
                return parseFloat(arg);
            }
        });
    }

}

export default Compiler