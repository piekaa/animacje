class Regexps {

    static point = /-?[0-9]+\.?[0-9]* *, *-?[0-9]+\.?[0-9]*/;

    static varAndPoint = /\((.*?), *(-?[0-9]+\.?[0-9]* *, *-?[0-9]+\.?[0-9]*)/;

    static fullLine = / *(.*?) *([=.]) *(\w+?) *\((.*)\)/

    static assign = / *(.*?) *([?|]?=) *(.*)/

}

export default Regexps