import FileStorage from "./FileStorage.js";

class Files {

    #allFiles = [];
    #selected = 0;
    #filesElement;
    #storage;
    #animation;

    #stopped = false;

    #intervalId;

    #onFileSelect;
    #onLoad;

    constructor(animation = true, storage = new FileStorage(), callbacks = {}) {
        this.#storage = storage;
        this.#animation = animation;
        this.#onFileSelect = callbacks.onFileSelect || (() => {
        });
        this.#onLoad = callbacks.onLoad || (() => {
        });
    }

    start(onlyLoad = false) {
        this.#storage.load()
            .then(files => {
                if (files.length === 0) {
                    files = [{name: "init", content: ""}]
                }
                this.#filesElement = document.getElementById("files");

                if (onlyLoad) {
                    this.#filesElement = document.createElement("div");
                }

                this.#filesElement.innerHTML = "";
                for (let i = 0; i < files.length; i++) {
                    const f = files[i];
                    this.#createAndAppendFileElement(f.name, f.content, f.init);
                }

                document.getElementById("newFile").onclick = () => {
                    this.#newFile();
                }

                this.#select(0);

                if (!onlyLoad) {
                    document.getElementById("code").addEventListener("input", this.#updateCode.bind(this));
                }

                this.#intervalId = setInterval(this.#save.bind(this), 1000);
                this.#onLoad();
            });
    }

    #updateCode(event) {
        if (this.#stopped) {
            return;
        }
        this.#allFiles[this.#selected].content = event.target.value;
    }

    stop() {
        clearInterval(this.#intervalId);
        this.#stopped = true;
    }

    #newFile() {
        if (this.#animation) {
            this.#createAndAppendFileElement("new init file", "", true)
        }
        this.#createAndAppendFileElement("new file")
    }

    #createAndAppendFileElement(name, content = "", init = false) {
        const fileElement = document.createElement("div");
        fileElement.classList.add("file");

        fileElement.contentEditable = "true";

        fileElement.innerHTML = name;

        const id = this.#allFiles.length;

        fileElement.id = `${id}`;

        if (init) {
            fileElement.classList.add("protected");
        }

        fileElement.onclick = () => {
            this.#select(id);
        }

        fileElement.addEventListener("focusout", (event) => {
            const name = event.target.innerText;
            this.#allFiles[id].name = name;
            if (name === "") {
                this.#remove(id);
            }
        });

        this.#allFiles.push(new File(name, content, fileElement, init));
        this.#filesElement.appendChild(fileElement);
    }

    #remove(id) {
        document.getElementById(`${id}`).style.display = "none";
        this.#selected = 0;
        this.#select(0);
    }

    #select(id) {
        const stringId = `${id}`;
        const intId = parseInt(stringId);

        this.#allFiles[this.#selected].element.classList.remove("selected");
        this.#allFiles[intId].element.classList.add("selected");

        const code = this.#allFiles[intId].content;

        document.getElementById("code").value = code;

        this.#selected = intId;

        this.#onFileSelect(code);
    }

    getRawData() {
        return this.#serializeAll();
    }

    #save() {
        this.#storage.save(this.#serializeAll());
    }

    #serializeAll() {
        return this.#allFiles
            .filter(f => f.name !== "")
            .map(f => f.serialize());
    }

    getInitCode() {
        return this.#allFiles
            .filter(f => f.init)
            .map(f => f.content)
            .join("\n");
    }

    getAnimationCode() {
        return this.#allFiles
            .map(f => f.content)
            .filter(c => !c.startsWith("/////"))
            .join("\n");
    }

    selectedFileCode() {
        return this.#allFiles[this.#selected].content;
    }

}

class File {
    name
    content
    element
    init

    constructor(name, content, element, init = false) {
        this.name = name;
        this.content = content;
        this.element = element;
        this.init = init;
    }

    serialize() {
        return {
            name: this.name,
            content: this.content,
            init: this.init
        }
    }
}

export default Files