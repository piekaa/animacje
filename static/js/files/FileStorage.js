class FileStorage {

    static load(project = "main") {
        return new Promise(resolve => {
            resolve(JSON.parse(localStorage.getItem(project)) || []);
        });
    }

    static save(files, project = "main") {
        localStorage.setItem(project, JSON.stringify(files));
    }
}

export default FileStorage