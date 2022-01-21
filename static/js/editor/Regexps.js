class Regexps {

    static point = /-?[0-9]+\.?[0-9]* *, *-?[0-9]+\.?[0-9]*/;

    static fullLine = / *(.*?) *([=.]) *(.*?) *\((.*)\)/

    static assign = / *(.*?) *([?|]?=) *(.*)/

}

export default Regexps