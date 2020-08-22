
const Kinds = {
    STATIC: 'static',
    FIELD: 'field',
    ARG: 'arg',
    VAR: 'var'
}

class SymbolTable {
    constructor() {
        this._classSymbolTable = {}
        this._indexMap = {
            [Kinds.STATIC]: 0,
            [Kinds.FIELD]: 0,
            [Kinds.ARG]: undefined,
            [Kinds.VAR]: undefined
        }
        this._subroutineSymbolTable = null
    }
    startSubroutine () {
        this._indexMap[Kinds.ARG] = 0
        this._indexMap[Kinds.VAR] = 0
        this._subroutineSymbolTable = {}
    }
    define (name, type, kind) {
        let symbolTable
        if (kind === Kinds.STATIC || kind === Kinds.FIELD) {
            symbolTable = this._classSymbolTable
        } else if (kind === Kinds.ARG || kind === Kinds.VAR) {
            symbolTable = this._subroutineSymbolTable
        }
        if (symbolTable[name]) {
            throw new Error(`重复定义符号：${name}, ${type}, ${kind}`)
        }
        symbolTable[name] = {
            type: type,
            kind: kind,
            index: this._indexMap[kind]
        }
        this._indexMap[kind] += 1
    }
    varCount (kind) {
        return this._indexMap[kind]
    }
    kindOf (name) {
        const info = this._getInfo(name)
        if (info) {
            return info.kind
        } else {
            throw new Error(name + '在符号表中不存在')
        }
    }
    typeOf (name) {
        const info = this._getInfo(name)
        if (info) {
            return info.type
        } else {
            throw new Error(name + '在符号表中不存在')
        }
    }
    indexOf (name) {
        const info = this._getInfo(name)
        if (info) {
            return info.index
        } else {
            throw new Error(name + '在符号表中不存在')
        }
    }
    _getInfo (name) {
        return (this._subroutineSymbolTable && this._subroutineSymbolTable[name]) || this._classSymbolTable[name]
    }
    isInTable (name) {
        return this._getInfo(name)
    }
}

module.exports = {
    Kinds,
    SymbolTable
}