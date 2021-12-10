class CachedFetch {

    static #cache = [];

    static fetchText(url) {
        if (!this.#cache[url]) {
            this.#cache[url] = fetch(url).then(res => res.text());
        }
        return this.#cache[url];
    }

}

export default CachedFetch