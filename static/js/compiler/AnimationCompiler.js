import Animator from "../animation/Animator.js";
import Camera from "../Camera.js";

// todo wykrywanie cyklicznych zależności
// todo nadpisywanie zmiennych

class AnimationCompiler {

    static #variables = {};
    static #animator;

    static compile(code, variables = {}) {
        return new Promise(resolve => {
            AnimationCompiler.#animator = new Animator();
            this.#variables = variables;
            this.#variables["a"] = AnimationCompiler.#animator;
            this.#variables["camera"] = Camera.current;
            AnimationCompiler.#compile(code);
            resolve(this.#variables["a"]);
            console.log(`${window.performance.memory.usedJSHeapSize}/${window.performance.memory.totalJSHeapSize}`)
            console.log(`${window.performance.memory.usedJSHeapSize/window.performance.memory.totalJSHeapSize}`)
        });
    }

    static #compile(code) {
        const lines = code.split(/\r?\n/);
        let objects = [];
        lines.forEach(l => {
            if (l.length === 0) {
                return;
            }
            AnimationCompiler.#parseLine(l)
        });
        return objects;
    }

    static #parseLine(line) {

        if (line.startsWith("//")) {
            return;
        }

        const l = line.replace(/\s/g, '');

        const firstDotIndex = l.indexOf(".");
        const variableName = l.substring(0, firstDotIndex)
        const sp = l.substring(firstDotIndex + 1, l.length).split(/[(,)]/);

        sp.pop();
        if (l.includes("()")) {
            sp.pop();
        }
        const functionName = sp.shift();
        const args = AnimationCompiler.#parseArgs(sp);
        const obj = AnimationCompiler.#variables[variableName];

        if (variableName === "a") {
            obj[functionName](...args);
        } else {
            if (typeof AnimationCompiler.#animator[functionName] === "function") {
                AnimationCompiler.#animator[functionName](obj, ...args);
            }
        }
    }

    static
    #parseArgs(args) {
        return args.map(arg => {

            if (this.#variables[arg]) {
                return this.#variables[arg];
            }

            if (arg.startsWith(`"`)) {
                return arg.substring(1, arg.length - 1);
            }
            return parseFloat(arg);
        });
    }

}

export default AnimationCompiler