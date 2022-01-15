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

    static splitArgs(args) {
        let result = [];
        let insideString = false;
        let arg = "";
        for (let i = 0; i < args.length; i++) {
            if (args[i] === ',' && !insideString) {
                result.push(arg);
                arg = "";
                continue;
            }
            if (args[i] === '"') {
                insideString = !insideString;
            }
            arg += args[i];
        }
        if (arg.length > 0) {
            result.push(arg);
        }
        return result;
    }
}

export default Utils