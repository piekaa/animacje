import PiekoszekEngine from "../PiekoszekEngine.js";
import DragAndDropExtension from "../extensions/DragAndDropExtension.js";
import HintsGlobals from "./HintsGlobals.js";
import HintPoint from "./HintPoint.js";

class HintPoints {

    points = []
    data
    width = 1;
    lineUpdateFunction
    compileFunction

    constructor(lineData, numberOfPoints, lineUpdateFunction, compileFunction, skipArgs = 0) {
        this.lineUpdateFunction = lineUpdateFunction;
        this.compileFunction = compileFunction;
        this.data = lineData;

        const args = lineData.textSoFar.split(/[()]/)[1].split(",")
            .map(arg => arg.trim())
            .map(arg => parseFloat(arg));

        for (let i = 0; i < numberOfPoints; i++) {
            this.points.push(new HintPoint(args[i * 2 + skipArgs], args[i * 2 + 1 + skipArgs], 50));
        }
        this.width = args[numberOfPoints * 2] || 1;

        this.points.forEach(p => {
            DragAndDropExtension.updateExtension(p, 45, this.updateCode.bind(this));
            PiekoszekEngine.add(p);
            p.setColor(1, 0, 0, 1);
            p.zIndex = 99999999;
        });
    }

    updateCode() {
        const updatedLine = this.lineUpdateFunction(this.data.textSoFar, this.points, this.width);

        const code = HintsGlobals.codeElement.value;

        HintsGlobals.updateCode(code.slice(0, this.data.lineStartPosition)
            + updatedLine + code.slice(this.data.nextLineStartPosition));

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