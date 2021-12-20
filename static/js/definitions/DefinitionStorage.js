class DefinitionStorage {

    static save(name, code) {
        return new Promise(resolve => {
            localStorage.setItem(name, code);
            DefinitionStorage.#addNewName(name);
            resolve();
        });
    }

    static load(name) {
        return new Promise(resolve => {
            resolve(localStorage.getItem(name));
        })
    }

    static #addNewName(name) {
        let names = localStorage.getItem("__allNames") || "";
        names = names.split(",");
        names.push(name);
        names = [...new Set(names)];
        localStorage.setItem("__allNames", names.filter(n => n !== "").join(","));
    }

    static loadAll() {
        return new Promise(resolve => {
            const names = localStorage.getItem("__allNames")?.split(",");
            let result = [];
            names?.forEach(name => {
                result[name] = localStorage.getItem(name);
            });
            resolve(result);
        });
    }

    static loadAllNames() {
        return new Promise(resolve => {
            resolve((localStorage.getItem("__allNames") || "").split(","));
        });
    }
}

export default DefinitionStorage;