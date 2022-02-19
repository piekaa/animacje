import Names from "./Names.js";

class FileStorage {

    #section

    constructor(section = "main") {
        section = Names.project() + "_" + section;
        this.#section = section;
    }

    load() {
        return new Promise(resolve => {
            resolve(JSON.parse(localStorage.getItem(this.#section)) || []);
        });
    }

    save(files) {

        fetch(`/api/backup/${this.#section}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(files)
        });

        localStorage.setItem(this.#section, JSON.stringify(files));
    }
}

export default FileStorage