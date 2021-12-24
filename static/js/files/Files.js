import FileStorage from "./FileStorage.js";

class Files {

    static #allFiles = [];
    static #selected = 0;
    static #filesElement;

    static start() {
        FileStorage.load()
            .then(files => {
                if (files.length === 0) {
                    files = [{name: "init", content: "// Create and set initial positions of objectes here\n"}]
                }
                Files.#filesElement = document.getElementById("files");
                for (let i = 0; i < files.length; i++) {
                    const f = files[i];
                    this.#createAndAppendFileElement(f.name, f.content, i !== 0);
                }

                document.getElementById("newFile").onclick = () => {
                    Files.#newFile();
                }

                Files.#select(0);

                document.getElementById("code").oninput = (event) => {
                    Files.#allFiles[Files.#selected].content = event.target.value;
                };

                setInterval(Files.#save, 1000);
            });
    }

    static #newFile() {
        Files.#createAndAppendFileElement("new file")
    }

    static #createAndAppendFileElement(name, content = "", editable = true) {
        const fileElement = document.createElement("div");
        fileElement.classList.add("file");
        if (editable) {
            fileElement.contentEditable = "true";
        }
        fileElement.innerHTML = name;
        const id = Files.#allFiles.length;
        fileElement.id = `${id}`;
        fileElement.onclick = () => {
            Files.#select(id);
        }

        fileElement.addEventListener("focusout", (event) => {
            const name = event.target.innerText;
            Files.#allFiles[id].name = name;
            if (name === "") {
                Files.#remove(id);
            }
        });

        Files.#allFiles.push(new File(name, content, fileElement));
        Files.#filesElement.appendChild(fileElement);
    }

    static #remove(id) {
        document.getElementById(`${id}`).style.display = "none";
        Files.#selected = 0;
        Files.#select(0);
    }

    static #select(id) {
        const stringId = `${id}`;
        const intId = parseInt(stringId);

        Files.#allFiles[Files.#selected].element.classList.remove("selected");
        Files.#allFiles[intId].element.classList.add("selected");

        document.getElementById("code").value = Files.#allFiles[intId].content;

        Files.#selected = intId;
    }

    static #save() {
        let serializedFiles = [];
        Files.#allFiles.forEach(f => {
            if (f.name !== "") {
                serializedFiles.push(f.serialize())
            }
        })
        FileStorage.save(serializedFiles);
    }

    static getInitCode() {
        return Files.#allFiles[0].content;
    }

    static getAnimationCode() {
        let code = "";
        for (let i = 1; i < Files.#allFiles.length; i++) {
            code += Files.#allFiles[i].content + "\n";
        }
        return code;
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