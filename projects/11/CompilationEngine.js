const {TokenType} = require('./JackTokenizer')
const {SymbolTable, Kinds} = require('./SymbolTable')
const {VMWriter} = require('./VMWriter')
const {Commands, Segments} = require('./Constants')
const getUid = (() => {
    let id = -1
    return () => {
        id += 1
        return id
    }
})()

const BinaryOpsMap = {
    '+': Commands.ADD,
    '-': Commands.SUB,
    '&': Commands.AND,
    '|': Commands.OR,
    '<': Commands.LT,
    '>': Commands.GT,
    '=': Commands.EQ
    // 缺少 * /
}
const UnaryOpsMap = {
    '-': Commands.NEG,
    '~': Commands.NOT
}

class CompilationEngine {
    constructor(tokenizer) {
        this._tok = tokenizer
        this._xml = ''
        this._st = new SymbolTable()
        this._writer = new VMWriter()
        this.compileClass()

        // console.log(this._xml)
    }
    _updateXML () {
        this._appendXML(this._tok.getXML())
    }
    _appendXML (xml) {
        this._xml += xml + '\n'
    }
    _check (tokenType, tokenValue) {
        return !(this._tok.tokenType() !== tokenType ||
            (tokenValue !== undefined && this._tok.tokenValue() !== tokenValue))
    }
    _checkAny (toks) {
        const item = toks.find(({type, value}) => {
            return this._check(type, value)
        })
        return !!item
    }
    _eat () {
        this._tokenType = this._tok.tokenType()
        this._tokenValue = this._tok.tokenValue()
        this._updateXML()
        this._tok.advance()
    }
    _expect (tokenType, tokenValue) {
        if (this._check(tokenType, tokenValue)) {
            this._eat()
            return true
        } else {
            console.log(this._tok._str.slice(this._tok._at))
            throw new Error(`期望${tokenValue}(${tokenType})，实际${this._tok.tokenValue()}(${this._tok.tokenType()})`)
        }
    }
    _expectAny (toks) {
        if (this._checkAny(toks)) {
            this._eat()
            return true
        } else {
            throw new Error(`期望${toks.map(({type, value}) => value + '(' + type + ')').join(', ')}，实际${this._tok.tokenValue()}(${this._tok.tokenType()})`)
        }
    }
    compileClass () {
        /**
         * class name {
         *     field type variable;
         *     static type variable;
         *     constructor type new (type arg1, type arg2) {
         *         statements
         *     }
         *     method type methodName (type arg1, ...) {
         *         statements
         *     }
         *     function type functionName (...) {
         *         statements
         *     }
         * }
         */
        this._appendXML('<class>')
        this._tok.advance()
        this._expect(TokenType.KEYWORD, 'class')
        this._expect(TokenType.IDENTIFIER)
        this._className = this._tokenValue
        this._expect(TokenType.SYMBOL, '{')

        while (this._checkAny([{
            type: TokenType.KEYWORD,
            value: 'static'
        }, {
            type: TokenType.KEYWORD,
            value: 'field'
        }])) {
            this.compileClassVarDec()
        }
        while (this._checkAny([{
            type: TokenType.KEYWORD,
            value: 'constructor'
        }, {
            type: TokenType.KEYWORD,
            value: 'function'
        }, {
            type: TokenType.KEYWORD,
            value: 'method'
        }])) {
            this.compileSubroutineDec()
        }

        this._expect(TokenType.SYMBOL, '}')
        this._appendXML('</class>')
    }
    _compileType () {
        this._expectAny([{
            type: TokenType.KEYWORD,
            value: 'int'
        }, {
            type: TokenType.KEYWORD,
            value: 'char'
        }, {
            type: TokenType.KEYWORD,
            value: 'boolean'
        }, {
            type: TokenType.IDENTIFIER
        }])
    }
    _compileIdent () {
        this._expect(TokenType.IDENTIFIER)
    }
    compileClassVarDec () {
        this._appendXML('<classVarDec>')
        this._expectAny([{
            type: TokenType.KEYWORD,
            value: 'static'
        }, {
            type: TokenType.KEYWORD,
            value: 'field'
        }])
        const kind = this._tokenValue
        this._compileType()
        const type = this._tokenValue
        this._compileIdent()

        this._st.define(this._tokenValue, type, kind)

        while (this._check(TokenType.SYMBOL, ',')) {
            this._eat()
            this._compileIdent()
            this._st.define(this._tokenValue, type, kind)
        }

        this._expect(TokenType.SYMBOL, ';')

        this._appendXML('</classVarDec>')
    }
    compileSubroutineDec () {
        /**
         * 1. constructor type name (...) {...}
         * =>
         * function class.name varCount(args)
         *   push varCount(filed)
         *   call Memory.alloc 1
         *   pop pointer 0
         *
         *   push pointer 0
         *   return
         * 2. method type name (...) {}
         * function class.name varCount(args)
         *   push arg 0
         *   pop point 0
         *
         */
        this._appendXML('<subroutineDec>')
        this._expectAny([{
            type: TokenType.KEYWORD,
            value: 'constructor'
        }, {
            type: TokenType.KEYWORD,
            value: 'function'
        }, {
            type: TokenType.KEYWORD,
            value: 'method'
        }])
        const subroutineType = this._tokenValue
        this._st.startSubroutine()
        if (subroutineType === 'method') {
            this._st.define(this._tokenValue, this._className, Kinds.ARG)
        }
        let funcType
        if (this._check(TokenType.KEYWORD, 'void')) {
            this._eat()
            funcType = 'void'
        } else {
            this._compileType()
            funcType = this._tokenValue
        }
        this._compileIdent()
        const funcName = this._tokenValue
        this._expect(TokenType.SYMBOL, '(')
        this.compileParameterList()
        this._expect(TokenType.SYMBOL, ')')
        this._appendXML('<subroutineBody>')
        this._expect(TokenType.SYMBOL, '{')
        while (this._check(TokenType.KEYWORD, 'var')) {
            this.compileVarDesc()
        }
        let nArgs = this._st.varCount(Kinds.VAR)
        if (subroutineType === 'constructor') {
            if (funcType !== this._className || funcName !== 'new') {
                throw new Error('类的构造函数的返回值类型必须和类名称相同，并且函数名称必须叫new')
            }
            this._writer.writeFunction(this._className + '.' + funcName, nArgs)

            this._writer.writePush(Segments.CONSTANT, this._st.varCount(Kinds.FIELD))
            this._writer.writeCall('Memory.alloc', 1)
            this._writer.writePop(Segments.POINTER, 0)
        } else if (subroutineType === 'method') {
            this._writer.writeFunction(this._className + '.' + funcName, nArgs)

            this._writer.writePush(Segments.ARGUMENT, 0)
            this._writer.writePop(Segments.POINTER, 0)
        } else {
            this._writer.writeFunction(this._className + '.' + funcName, nArgs)
        }
        this.compileStatements()
        this._expect(TokenType.SYMBOL, '}')
        this._appendXML('</subroutineBody>')
        this._appendXML('</subroutineDec>')
    }
    compileParameterList () {
        this._appendXML('<parameterList>')
        if (!this._check(TokenType.SYMBOL, ')')) {
            this._compileType()
            const type = this._tokenValue
            this._compileIdent()
            this._st.define(this._tokenValue, type, Kinds.ARG)
            while (this._check(TokenType.SYMBOL, ',')) {
                this._eat()
                this._compileType()
                const type = this._tokenValue
                this._compileIdent()
                this._st.define(this._tokenValue, type, Kinds.ARG)
            }
        }
        this._appendXML('</parameterList>')
    }
    compileVarDesc () {
        this._appendXML('<varDec>')
        this._expect(TokenType.KEYWORD, 'var')
        this._compileType()
        const type = this._tokenValue
        this._compileIdent()
        this._st.define(this._tokenValue, type, Kinds.VAR)
        while (this._check(TokenType.SYMBOL, ',')) {
            this._eat()
            this._compileIdent()
            this._st.define(this._tokenValue, type, Kinds.VAR)
        }
        this._expect(TokenType.SYMBOL, ';')
        this._appendXML('</varDec>')
    }
    compileStatements () {
        this._appendXML('<statements>')
        do {
            if (this._check(TokenType.KEYWORD, 'let')) {
                this.compileLet()
            } else if (this._check(TokenType.KEYWORD, 'if')) {
                this.compileIf()
            } else if (this._check(TokenType.KEYWORD, 'while')) {
                this.compileWhile()
            } else if (this._check(TokenType.KEYWORD, 'do')) {
                this.compileDo()
            } else if (this._check(TokenType.KEYWORD, 'return')) {
                this.compileReturn()
            } else {
                break
            }
        } while (true)
        this._appendXML('</statements>')
    }
    _compileSubroutineCall () {
        this._compileIdent()
        const name = this._tokenValue
        if (this._check(TokenType.SYMBOL, '(')) {
            // method调用
            // push this
            // push args
            // call name nArgs + 1
            this._eat()
            this._writer.writePush(Segments.POINTER, 0)
            let nArgs = 1
            this.compileExpressionList((count) => {
                nArgs += count
            })
            this._writer.writeCall(this._className + '.' + name, nArgs)
            this._expect(TokenType.SYMBOL, ')')
        } else if (this._check(TokenType.SYMBOL, '.')) {
            if (this._st.isInTable(name)) {
                // method调用
            } else {
                // constructor或者function调用
            }
            this._eat()
            this._compileIdent()
            const funcName = this._tokenValue
            this._expect(TokenType.SYMBOL, '(')
            let nArgs = 0
            if (this._st.isInTable(name)) {
                // method调用
                // push this
                this._writer.writePush(this._segmentByKind(this._st.kindOf(name)), this._st.indexOf(name))
                nArgs += 1
            }
            this.compileExpressionList((count) => {
                nArgs += count
            })
            let className
            if (this._st.isInTable(name)) {
                className = this._st.typeOf(name)
            } else {
                className = name
            }
            this._writer.writeCall(className + '.' + funcName, nArgs)
            this._expect(TokenType.SYMBOL, ')')
        }
    }
    compileDo () {
        this._appendXML('<doStatement>')
        this._expect(TokenType.KEYWORD, 'do')
        this._compileSubroutineCall()
        this._writer.writePop(Segments.TEMP, 0)
        this._expect(TokenType.SYMBOL, ';')
        this._appendXML('</doStatement>')
    }
    _segmentByKind (kind) {
        return {
            [Kinds.VAR]: Segments.LOCAL,
            [Kinds.ARG]: Segments.ARGUMENT,
            [Kinds.FIELD]: Segments.THIS,
            [Kinds.STATIC]: Segments.STATIC
        }[kind]
    }
    compileLet () {
        /**
         * variable: static, local, field, parameter
         * 1. let variable = expression; =>
         * push expression
         * pop segment index
         * 2. let variable[expression1] = expression2; =>
         * push variable
         * push expression1
         * add
         * pop pointer 1
         * push expression2
         * pop that 0
         */
        this._appendXML('<letStatement>')
        this._expect(TokenType.KEYWORD, 'let')
        this._compileIdent()
        const name = this._tokenValue
        let isArray = false
        if (this._check(TokenType.SYMBOL, '[')) {
            isArray = true
            this._eat()
            this.compileExpression()
            this._writer.writePush(this._segmentByKind(this._st.kindOf(name)), this._st.indexOf(name))
            this._expect(TokenType.SYMBOL, ']')
            this._writer.writeArithmetic(Commands.ADD)
        }
        this._expect(TokenType.SYMBOL, '=')
        this.compileExpression()
        if (isArray) {
            this._writer.writePop(Segments.TEMP, 0)
            this._writer.writePop(Segments.POINTER, 1)
            this._writer.writePush(Segments.TEMP, 0)
        }
        if (isArray) {
            this._writer.writePop(Segments.THAT, 0)
        } else {
            this._writer.writePop(this._segmentByKind(this._st.kindOf(name)), this._st.indexOf(name))
        }
        this._expect(TokenType.SYMBOL, ';')
        this._appendXML('</letStatement>')
    }
    compileWhile () {
        /**
         * while (expression) {
         *     statements
         * }
         * ==>
         * label l1
         * push expression
         * not
         * if-goto l2
         * push statements
         * goto l1
         * label l2
         */
        this._appendXML('<whileStatement>')
        const l1 = `WHILE_EXP_${getUid()}`
        const l2 = `WHILE_END_${getUid()}`
        this._expect(TokenType.KEYWORD, 'while')
        this._expect(TokenType.SYMBOL, '(')
        this._writer.writeLabel(l1)
        this.compileExpression()
        this._writer.writeArithmetic(Commands.NOT)
        this._writer.writeIf(l2)
        this._expect(TokenType.SYMBOL, ')')
        this._expect(TokenType.SYMBOL, '{')
        this.compileStatements()
        this._writer.writeGoto(l1)
        this._writer.writeLabel(l2)
        this._expect(TokenType.SYMBOL, '}')
        this._appendXML('</whileStatement>')
    }
    compileReturn () {
        /**
         * 1. return expression;
         * =>
         * push expression
         * return
         *
         * 2. return;
         * =>
         * return
         */
        this._appendXML('<returnStatement>')
        this._expect(TokenType.KEYWORD, 'return')
        if (this._check(TokenType.SYMBOL, ';')) {
            this._eat()
            this._writer.writePush(Segments.CONSTANT, 0)
        } else {
            this.compileExpression()
            this._expect(TokenType.SYMBOL, ';')
        }
        this._writer.writeReturn()
        this._appendXML('</returnStatement>')
    }
    compileIf () {
        /**
         * 1. if (expression) { statements }
         * =>
         * push expression
         * not
         * if-goto l1
         * push statements
         * label l1
         *
         * 2. if (expression) { statements1 } else { statements2 }
         * =>
         * push expression
         * not
         * if-goto l1
         * push statements1
         * goto l2
         * label l1
         * push statements2
         * label l2
         */
        this._appendXML('<ifStatement>')
        const l1 = `IF_TRUE_${getUid()}`
        const l2 = `IF_FALSE_${getUid()}`
        const l3 = `IF_END_${getUid()}`
        this._expect(TokenType.KEYWORD, 'if')
        this._expect(TokenType.SYMBOL, '(')
        this.compileExpression()
        this._writer.writeIf(l1)
        this._writer.writeGoto(l2)
        this._expect(TokenType.SYMBOL, ')')
        this._expect(TokenType.SYMBOL, '{')
        this._writer.writeLabel(l1)
        this.compileStatements()
        this._expect(TokenType.SYMBOL, '}')
        if (this._check(TokenType.KEYWORD, 'else')) {
            this._eat()
            this._expect(TokenType.SYMBOL, '{')
            this._writer.writeGoto(l3)
            this._writer.writeLabel(l2)
            this.compileStatements()
            this._writer.writeLabel(l3)
            this._expect(TokenType.SYMBOL, '}')
        } else {
            this._writer.writeLabel(l2)
        }
        this._appendXML('</ifStatement>')
    }
    compileExpression () {
        this._appendXML('<expression>')
        this.compileTerm()
        while (this._checkAny([
            {type: TokenType.SYMBOL, value: '+'},
            {type: TokenType.SYMBOL, value: '-'},
            {type: TokenType.SYMBOL, value: '*'},
            {type: TokenType.SYMBOL, value: '/'},
            {type: TokenType.SYMBOL, value: '&'},
            {type: TokenType.SYMBOL, value: '|'},
            {type: TokenType.SYMBOL, value: '<'},
            {type: TokenType.SYMBOL, value: '>'},
            {type: TokenType.SYMBOL, value: '='}
        ])) {
            this._eat()
            const op = this._tokenValue
            this.compileTerm()
            if (BinaryOpsMap[op]) {
                this._writer.writeArithmetic(BinaryOpsMap[op])
            } else if (op === '*') {
                this._writer.writeCall('Math.multiply', 2)
            } else if (op === '/') {
                this._writer.writeCall('Math.divide', 2)
            }
        }
        this._appendXML('</expression>')
    }
    compileTerm () {
        this._appendXML('<term>')
        if (this._check(TokenType.SYMBOL, '(')) {
            this._eat()
            this.compileExpression()
            this._expect(TokenType.SYMBOL, ')')
        } else if (this._checkAny([{
            type: TokenType.INTEGER_CONSTANT
        }, {
            type: TokenType.STRING_CONSTANT
        }, {
            type: TokenType.KEYWORD,
            value: 'true'
        }, {
            type: TokenType.KEYWORD,
            value: 'false'
        }, {
            type: TokenType.KEYWORD,
            value: 'null'
        }, {
            type: TokenType.KEYWORD,
            value: 'this'
        }])) {
            this._eat()
            const value = this._tokenValue
            if (this._tokenType === TokenType.STRING_CONSTANT) {
                this._writer.writePush(Segments.CONSTANT, value.length)
                this._writer.writeCall('String.new', 1)
                for (let i = 0; i < value.length; i += 1) {
                    this._writer.writePush(Segments.CONSTANT, value.charCodeAt(i))
                    this._writer.writeCall('String.appendChar', 2)
                }
            } else if (this._tokenType === TokenType.KEYWORD && value === 'this') {
                this._writer.writePush(Segments.POINTER, 0)
            } else if (this._tokenType === TokenType.KEYWORD && value === 'false') {
                this._writer.writePush(Segments.CONSTANT, 0)
            } else if (this._tokenType === TokenType.KEYWORD && value === 'true') {
                this._writer.writePush(Segments.CONSTANT, 0)
                this._writer.writeArithmetic(Commands.NOT)
            } else if (this._tokenType === TokenType.KEYWORD && value === 'null') {
                this._writer.writePush(Segments.CONSTANT, 0)
            } else if (this._tokenType === TokenType.INTEGER_CONSTANT) {
                const n = Number(value)
                if (!Number.isInteger(n) || n > 32767 || n < -32768) {
                    throw new Error('只能接受 -32768～32767 直接的整数')
                }
                this._writer.writePush(Segments.CONSTANT, n)
            }
        } else if (this._check(TokenType.IDENTIFIER)) {
            this._eat()
            const name = this._tokenValue
            if (this._check(TokenType.SYMBOL, '[')) {
                this._eat()
                this.compileExpression()
                this._writer.writePush(this._segmentByKind(this._st.kindOf(name)), this._st.indexOf(name))
                this._writer.writeArithmetic(Commands.ADD)
                this._writer.writePop(Segments.POINTER, 1)
                this._writer.writePush(Segments.THAT, 0)
                this._expect(TokenType.SYMBOL, ']')
            } else if (this._check(TokenType.SYMBOL, '(')) {
                this._eat()
                this._writer.writePush(Segments.POINTER, 0)
                let nArgs = 1
                this.compileExpressionList((count) => {
                    nArgs += count
                })
                this._writer.writeCall(this._className + '.' + name, nArgs)
                this._expect(TokenType.SYMBOL, ')')
            } else if (this._check(TokenType.SYMBOL, '.')) {
                this._eat()
                this._compileIdent()
                const funcName = this._tokenValue
                let nArgs = 0
                let className
                if (this._st.isInTable(name)) {
                    nArgs += 1
                    this._writer.writePush(this._segmentByKind(this._st.kindOf(name)), this._st.indexOf(name))
                    className = this._st.typeOf(name)
                } else {
                    className = name
                }
                this._expect(TokenType.SYMBOL, '(')
                this.compileExpressionList((count) => {
                    nArgs += count
                })
                this._writer.writeCall(`${className}.${funcName}`, nArgs)
                this._expect(TokenType.SYMBOL, ')')
            } else {
                this._writer.writePush(this._segmentByKind(this._st.kindOf(name)), this._st.indexOf(name))
            }
        } else if (this._checkAny([{
            type: TokenType.SYMBOL,
            value: '-'
        }, {
            type: TokenType.SYMBOL,
            value: '~'
        }])) {
            this._eat()
            const unaryOp = this._tokenValue
            this.compileTerm()
            this._writer.writeArithmetic({
                '-': Commands.NEG,
                '~': Commands.NOT
            }[unaryOp])
        }
        this._appendXML('</term>')
    }
    compileExpressionList (cb) {
        this._appendXML('<expressionList>')
        if (!this._check(TokenType.SYMBOL, ')')) {
            let count = 0
            this.compileExpression()
            count += 1
            while (this._check(TokenType.SYMBOL, ',')) {
                this._eat()
                this.compileExpression()
                count += 1
            }
            cb && cb(count)
        }
        this._appendXML('</expressionList>')
    }

    getXML () {
        return this._xml
    }
    getOutput () {
        return this._writer.getOutput()
    }
}
module.exports = {
    CompilationEngine
}

