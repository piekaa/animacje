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
        hide: MethodAutofillFunctions.noArgsCall,
        show: MethodAutofillFunctions.noArgsCall,
        popUp: MethodAutofillFunctions.noArgsCall,
        popUpWait: MethodAutofillFunctions.noArgsCall,
        popDown: MethodAutofillFunctions.noArgsCall,
        popDownWait: MethodAutofillFunctions.noArgsCall,
        fadeIn: MethodAutofillFunctions.noArgsCall,
        fadeInWait: MethodAutofillFunctions.noArgsCall,
        fadeOut: MethodAutofillFunctions.noArgsCall,
        fadeOutWait: MethodAutofillFunctions.noArgsCall,
        color: MethodAutofillFunctions.color,
        colorWait: MethodAutofillFunctions.color,
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

    static noArgsCall(method) {
        return `${method}()`
    }

    static color(method) {
        return `${method}(1,1,1,1, "1s")`
    }
}

export default MethodAutofillFunctions