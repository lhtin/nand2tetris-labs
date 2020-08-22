const Commands = {
    ADD: 'add',
    SUB: 'sub',
    NEG: 'neg',
    EQ: 'eq',
    GT: 'gt',
    LT: 'lt',
    AND: 'and',
    OR: 'or',
    NOT: 'not'
}
const Segments = {
    CONSTANT: 'constant',
    LOCAL: 'local',
    ARGUMENT: 'argument',
    THIS: 'this',
    THAT: 'that',
    STATIC: 'static',
    TEMP: 'temp',
    POINTER: 'pointer'
}

module.exports = {
    Segments,
    Commands
}