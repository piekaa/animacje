import Line from "../primitives/Line.js";
import PiekoszekEngine from "../PiekoszekEngine.js";
import StandardRenderable from "../animation/StandardRenderable.js";
import Square from "../primitives/Square.js";
import Camera from "../Camera.js";
import Curve from "../primitives/Curve.js";
import Text from "../primitives/Text.js";
import Dialog from "../primitives/Dialog.js";

// todo wykrywanie cyklicznych zależności
// todo nadpisywanie zmiennych

class InitCompiler {

    static primitives = {
        "line": Line,
        "square": Square,
        "curve": Curve,
        "text": Text,
        "dialog": Dialog
    };

    static #definitions = {};

    static #variables = {};

    static compile(code, pivot, definitions, variables = []) {
        InitCompiler.#variables["pivot"] = pivot;
        return new Promise(resolve => {
            PiekoszekEngine.removeAll();
            definitions.forEach(definition => {
                InitCompiler.#definitions[definition.name] = definition.content;
            })
            InitCompiler.#variables["camera"] = Camera.current;
            variables.forEach(v => {
                InitCompiler.#variables[v.name] = v.value;
            });
            InitCompiler.#compile(code, PiekoszekEngine.root(), pivot);
            resolve(InitCompiler.#variables);
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

    static
    #parseLine(line, parent, pivot) {

        if (line.startsWith("//")) {
            return;
        }

        // const l = line.replace(/\s/g, '');
        const l = line;
        if (l.includes("=")) {
            const sp = l.split(/[=(,)]/);
            sp.pop();
            if (l.includes("()")) {
                sp.pop();
            }
            const varName = sp.shift().replace(/\s/g, '');
            const type = sp.shift().replace(/\s/g, '');

            const args = InitCompiler.#parseArgs(sp);
            const obj = InitCompiler.#createObject(type, args, parent, pivot);
            InitCompiler.#variables[varName] = obj;
            return obj;
        } else {
            const firstDotIndex = l.indexOf(".");
            const variableName = l.substring(0, firstDotIndex).replace(/\s/g, '');
            const sp = l.substring(firstDotIndex + 1, l.length).split(/[(,)]/);

            sp.pop();
            if (l.includes("()")) {
                sp.pop();
            }
            const functionName = sp.shift().replace(/\s/g, '');
            const args = InitCompiler.#parseArgs(sp);
            const obj = InitCompiler.#variables[variableName];
            obj[functionName](...args);
        }
    }

    static #createObject(type, args, parent, pivot) {

        const primitiveType = InitCompiler.primitives[type];
        if (primitiveType) {
            let obj = new primitiveType(...args);
            PiekoszekEngine.addAsChild(parent, obj);
            return obj;
        }

        const definition = InitCompiler.#definitions[type];
        if (definition) {
            const complexObject = new StandardRenderable(...args);
            InitCompiler.#compile(definition, complexObject, pivot);
            complexObject.setPivot(pivot.position.x() / 2, pivot.position.y() / 2);
            PiekoszekEngine.addAsChild(parent, complexObject);
            return complexObject;
        }

        throw new Error(`${type} is not defined`);
    }

    static #parseArgs(args) {
        return args.map(arg => {

            arg = arg.trim();

            if (arg.startsWith(`"`)) {
                return arg.substring(1, arg.length - 1);
            }

            arg = arg.replace(/\s/g, '');

            if (InitCompiler.#variables[arg]) {
                return InitCompiler.#variables[arg];
            }

            return parseFloat(arg);
        });
    }

}

export default InitCompiler