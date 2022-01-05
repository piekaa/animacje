import HintsGlobals from "./HintsGlobals.js";

class CodeAnalysis {

    static inputContextData() {
        const text = HintsGlobals.codeElement.value;
        const maxPos = HintsGlobals.codeElement.selectionStart;
        let line = 0;
        let position = 0;
        let lineStartPosition = 0;
        let textSoFar = "";
        for (let i = 0; i < maxPos; i++) {
            textSoFar += text[i];
            if (text[i] === '\n') {
                lineStartPosition = i + 1;
                line++;
                position = -1;
                textSoFar = "";
            }
            position++;
        }

        const newLineSearchResult = text.indexOf("\n", maxPos);

        return {
            line: line,
            position: position,
            textSoFar: textSoFar,
            typeSoFar: textSoFar.split("=")[1]?.trim(),
            globalPosition: maxPos,
            lineStartPosition: lineStartPosition,
            nextLineStartPosition: newLineSearchResult === -1 ? text.length : newLineSearchResult
        };
    }
}

export default CodeAnalysis