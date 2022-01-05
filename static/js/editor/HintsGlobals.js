class HintsGlobals {

    static codeElement;
    static compileFunction;

    static updateCode(newCode) {
        HintsGlobals.codeElement.value = newCode;
        HintsGlobals.codeElement.dispatchEvent(new Event('input'));
    }

    static focusCode() {
        HintsGlobals.codeElement.blur();
        HintsGlobals.codeElement.focus();
    }
}

export default HintsGlobals