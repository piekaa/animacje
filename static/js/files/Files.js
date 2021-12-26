import FileStorage from "./FileStorage.js";

class Files {

    #allFiles = [];
    #selected = 0;
    #filesElement;
    #storage;
    #withInitFile;

    #intervalId;

    #onFileSelect;

    constructor(withInitFile = true, storage = new FileStorage(), onFileSelect = () => {
    }) {
        this.#storage = storage;
        this.#withInitFile = withInitFile;
        this.#onFileSelect = onFileSelect;
    }

    start() {
        this.#storage.load()
            .then(files => {
                if (files.length === 0) {
                    files = [{name: "init", content: ""}]
                }
                this.#filesElement = document.getElementById("files");
                this.#filesElement.innerHTML = "";
                for (let i = 0; i < files.length; i++) {
                    const f = files[i];
                    this.#createAndAppendFileElement(f.name, f.content, i !== 0 || !this.#withInitFile);
                }

                document.getElementById("newFile").onclick = () => {
                    this.#newFile();
                }

                this.#select(0);

                document.getElementById("code").oninput = (event) => {
                    this.#allFiles[this.#selected].content = event.target.value;
                };

                this.#intervalId = setInterval(this.#save.bind(this), 1000);
            });
    }

    stop() {
        clearInterval(this.#intervalId);
    }

    #newFile() {
        this.#createAndAppendFileElement("new file")
    }

    #createAndAppendFileElement(name, content = "", editable = true) {
        const fileElement = document.createElement("div");
        fileElement.classList.add("file");
        if (editable) {
            fileElement.contentEditable = "true";
        }
        fileElement.innerHTML = name;
        const id = this.#allFiles.length;
        fileElement.id = `${id}`;

        if (!editable) {
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

        this.#allFiles.push(new File(name, content, fileElement));
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
        return this.#allFiles[0].content;
    }

    getAnimationCode() {
        let code = "";
        for (let i = 1; i < this.#allFiles.length; i++) {
            code += this.#allFiles[i].content + "\n";
        }
        return code;
    }

    selectedFileCode() {
        return this.#allFiles[this.#selected].content;
    }

}

class File {
    name
    content
    element

    constructor(name, content, element) {
        this.name = name;
        this.content = content;
        this.element = element;
    }

    serialize() {
        return {
            name: this.name,
            content: this.content
        }
    }
}

export default Files