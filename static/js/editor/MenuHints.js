import CodeAnalysis from "./CodeAnalysis.js";
import HintsGlobals from "./HintsGlobals.js";

class MenuHints {

    hints;
    selectedHint = 0;
    currentHintsLength = 0;
    items = {}
    inHintMenu = false;
    instance

    destroyCallback

    constructor(items, destroyCallback) {
        this.instance = this;
        this.destroyCallback = destroyCallback;
        this.hints = document.getElementById("hints");
        this.addItems(items);
        const lineData = CodeAnalysis.inputContextData();
        const text = this.cutLine(lineData.textSoFar);
        const typeStart = text.trim();
        this.buildHintMenu(Array.from(this.items[typeStart] || []));
        this.hints.style.left = `${lineData.position * 8 + 10}px`;
        this.hints.style.top = `${lineData.line * 15 + 2 - HintsGlobals.codeElement.scrollTop}px`;
    }

    cutLine(text) {
        throw new Error("Should be implemented by subclass");
    }


    addItems(items) {
        items.forEach(t => this.addItem(t));

    }

    addItem(item) {
        name = item[0];
        for (let i = 1; i < item.length; i++) {
            this.items[name] ||= new Set();
            this.items[name].add(item);
            name += item[i];
        }
    }

    buildHintMenu(hints) {
        if (hints.length === 0) {
            this.destroy();
            return;
        }
        this.hints.style.display = "flex";
        let i = 0;
        this.hints.innerHTML = hints.map(hint => `<div id="hint${i++}" class="hint">${hint}</div>`).join("");
        this.inHintMenu = true;
        this.currentHintsLength = hints.length;
        this.selectedHint = -1;
        this.selectNextHint();
    }

    navigateHintsMenu(event) {
        switch (event.key) {
            case "Escape":
                this.destroy();
                break;
            case "ArrowDown":
                this.selectNextHint();
                break;
            case "ArrowUp":
                this.selectPrevHint();
                break;
            case "Enter":
                this.applyHint();
        }
    }

    applyHint() {
        throw new Error("Should be implemented by subclass");
    }

    selectNextHint() {
        document.getElementById(`hint${this.selectedHint}`)?.classList.remove("selectedHint");
        this.selectedHint++;
        this.selectedHint %= this.currentHintsLength;
        document.getElementById(`hint${this.selectedHint}`)?.classList.add("selectedHint");
    }

    selectPrevHint() {
        document.getElementById(`hint${this.selectedHint}`)?.classList.remove("selectedHint");
        this.selectedHint--;
        this.selectedHint = ((this.selectedHint % this.currentHintsLength) + this.currentHintsLength) % this.currentHintsLength;
        document.getElementById(`hint${this.selectedHint}`)?.classList.add("selectedHint");
    }

    destroy() {
        this.hints.style.display = "none";
        this.inHintMenu = false;
        this.destroyCallback?.();
        this.instance = undefined;
    }
}

export default MenuHints