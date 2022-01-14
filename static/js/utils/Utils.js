class Utils {
    static after(conditionFunction) {
        return new Promise(resolve => {
            const int = setInterval(
                () => {
                    if (conditionFunction()) {
                        clearInterval(int);
                        resolve();
                    }
                }, 100);
        });
    }
}

export default Utils