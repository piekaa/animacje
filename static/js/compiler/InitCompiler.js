import Line from "../primitives/Line.js";
import PiekoszekEngine from "../PiekoszekEngine.js";
import StandardRenderable from "../animation/StandardRenderable.js";
import Square from "../primitives/Square.js";
import Camera from "../Camera.js";
import Curve from "../primitives/Curve.js";
import TextBox from "../primitives/TextBox.js";
import Dialog from "../primitives/Dialog.js";
import Text from "../primitives/Text.js";
import Regexps from "../editor/Regexps.js";
import Utils from "../utils/Utils.js";

// todo wykrywanie cyklicznych zależności
// todo nadpisywanie zmiennych

class InitCompiler {

    static primitives = {
        "line": Line,
        "square": Square,
        "curve": Curve,
        "textBox": TextBox,
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

        const l = line.trim();

        let fullLineResult = Regexps.fullLine.exec(l);
        if (fullLineResult) {
            const [, varName, operator, typeOrFunction, args] = fullLineResult;
            if (operator === "=") {
                const obj = InitCompiler.#createObject(typeOrFunction, InitCompiler.#parseArgs(args), parent, pivot);
                InitCompiler.#variables[varName] = obj;
                return obj;
            }
            if (operator === ".") {
                const obj = InitCompiler.#variables[varName];
                try {
                    obj[typeOrFunction](...InitCompiler.#parseArgs(args));
                } catch (e) {
                    console.log(l);
                    console.error(e);
                }
            }
            return;
        }

        let assignResult = Regexps.assign.exec(l);
        if (assignResult) {
            const [, varName, operator, value] = assignResult;

            const parsedValue = this.#parseArg(value)

            if (operator === "=") {
                InitCompiler.#variables[varName] = parsedValue;
            }

            if (operator === "|=") {
                InitCompiler.#variables[varName] ||= parsedValue;
            }
        }
    }

    static #createObject(type, args, parent, pivot) {
        const primitiveType = InitCompiler.primitives[type];
        if (primitiveType) {
            let obj = new primitiveType(...args);
            PiekoszekEngine.addAsChild(parent, obj);
            return obj;
        }

        for (let i = 0; i < 10; i++) {
            InitCompiler.#variables[`_arg${i}`] = undefined
        }

        for (let i = 2; i < args.length; i++) {
            InitCompiler.#variables[`_arg${i - 2}`] = args[i];
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
        return Utils.splitArgs(args).map(arg => InitCompiler.#parseArg(arg));
    }

    static #parseArg(arg) {
        arg = arg.trim();

        if (arg.startsWith(`"`)) {
            return arg.substring(1, arg.length - 1);
        }

        arg = arg.replace(/\s/g, '');

        if (InitCompiler.#variables[arg]) {
            return InitCompiler.#variables[arg];
        }

        return parseFloat(arg);
    }

    static variables() {
        return InitCompiler.#variables;
    }
}

export default InitCompiler