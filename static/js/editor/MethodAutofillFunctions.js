class MethodAutofillFunctions {

    static functions = {
        move: MethodAutofillFunctions.pointAndTime,
        moveSmooth: MethodAutofillFunctions.pointAndTime,
        moveWiggle: MethodAutofillFunctions.pointAndTime,
        moveWait: MethodAutofillFunctions.pointAndTime,
        moveSmoothWait: MethodAutofillFunctions.pointAndTime,
        moveWiggleWait: MethodAutofillFunctions.pointAndTime,
        setPosition: MethodAutofillFunctions.point,
        setRotation: MethodAutofillFunctions.rotation,
        setScale: MethodAutofillFunctions.scale,
    }

    static pointAndTime(method, point) {
        return `${method}(${point}, "1s")`;
    }

    static point(method, point) {
        return `${method}(${point})`;
    }

    static rotation(method) {
        return `${method}(45)`;
    }

    static scale(method) {
        return `${method}(2,2)`;
    }
}

export default MethodAutofillFunctions