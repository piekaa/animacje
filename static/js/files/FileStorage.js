class FileStorage {

    #project

    constructor(project = "main") {
        this.#project = project;
    }

    load() {
        return new Promise(resolve => {
            resolve(JSON.parse(localStorage.getItem(this.#project)) || []);
        });
    }

    save(files) {
        localStorage.setItem(this.#project, JSON.stringify(files));
    }
}

export default FileStorage