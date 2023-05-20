class Names {

    static project() {
        const params = new URLSearchParams(window.location.search);
        return params.get("p");
    }

}

export default Names;