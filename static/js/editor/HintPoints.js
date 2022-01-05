import Square from "../primitives/Square.js";
import PiekoszekEngine from "../PiekoszekEngine.js";
import DragAndDropExtension from "../extensions/DragAndDropExtension.js";
import HintsGlobals from "./HintsGlobals.js";

class HintPoints {

    points = []
    data
    width = 1;
    compileFunction

    constructor(lineData, numberOfPoints, compileFunction) {
        this.compileFunction = compileFunction;
        this.data = lineData;

        const args = lineData.textSoFar.split(/[()]/)[1].split(",")
            .map(arg => arg.trim())
            .map(arg => parseFloat(arg));

        for (let i = 0; i < numberOfPoints; i++) {
            this.points.push(new Square(args[i * 2], args[i * 2 + 1], 30));
        }
        this.width = args[numberOfPoints * 2];

        this.points.forEach(p => {
            DragAndDropExtension.updateExtension(p, 45, this.updateCode.bind(this));
            PiekoszekEngine.add(p);
        });
    }

    updateCode() {
        let coordinates = "(";

        this.points.forEach(p => {
            coordinates += `${p.position.x()}, ${p.position.y()}, `;
        });

        const newTextSoFar = this.data.textSoFar.replace(/\(.*\)/,
            `${coordinates}${this.width})`);

        const code = HintsGlobals.codeElement.value;

        HintsGlobals.updateCode(code.slice(0, this.data.lineStartPosition)
            + newTextSoFar + code.slice(this.data.nextLineStartPosition));

        const newCarrot = this.data.globalPosition - (code.length - HintsGlobals.codeElement.value.length);
        HintsGlobals.codeElement.setSelectionRange(newCarrot, newCarrot);

        this.compileFunction();
        HintsGlobals.focusCode();
    }

    destroy() {
        this.points.forEach(p => {
            PiekoszekEngine.remove(p);
        });
    }
}

export default HintPoints