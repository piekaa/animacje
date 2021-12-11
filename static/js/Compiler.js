import Line from "./primitives/Line.js";
import PiekoszekEngine from "./2d.js";

class Compiler {

    static #primitives = {
        "line": Line,
    };

    static #variables = {};

    static compile(text) {
        PiekoszekEngine.removeAll();
        const lines = text.split(/\r?\n/);
        lines.forEach(l => {
            if (l.length === 0) {
                return;
            }
            Compiler.#parseLine(l)
        });
    }

    static #parseLine(line) {
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

            const obj = new Compiler.#primitives[type](...args);
            PiekoszekEngine.add(obj);
            Compiler.#variables[varName] = obj;
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

    static #parseArgs(args) {
        return args.map(arg => {
            if (arg.startsWith(`"`)) {
                return arg.substring(1, arg.length - 1);
            } else {
                return parseInt(arg);
            }
        });
    }

}

export default Compiler