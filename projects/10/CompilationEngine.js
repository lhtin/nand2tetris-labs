const {TokenType} = require('./JackTokenizer')
class CompilationEngine {
    constructor(tokenizer) {
        this._tok = tokenizer
        this._xml = ''
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
        this._appendXML('<class>')
        this._tok.advance()
        this._expect(TokenType.KEYWORD, 'class')
        this._expect(TokenType.IDENTIFIER)
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

        this._compileType()
        this._compileIdent()

        while (this._check(TokenType.SYMBOL, ',')) {
            this._eat()
            this._compileIdent()
        }

        this._expect(TokenType.SYMBOL, ';')

        this._appendXML('</classVarDec>')
    }
    compileSubroutineDec () {
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

        if (this._check(TokenType.KEYWORD, 'void')) {
            this._eat()
        } else {
            this._compileType()
        }
        this._compileIdent()
        this._expect(TokenType.SYMBOL, '(')
        this.compileParameterList()
        this._expect(TokenType.SYMBOL, ')')
        this._appendXML('<subroutineBody>')
        this._expect(TokenType.SYMBOL, '{')
        while (this._check(TokenType.KEYWORD, 'var')) {
            this.compileVarDesc()
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
            this._compileIdent()
            while (this._check(TokenType.SYMBOL, ',')) {
                this._eat()
                this._compileType()
                this._compileIdent()
            }
        }
        this._appendXML('</parameterList>')
    }
    compileVarDesc () {
        this._appendXML('<varDec>')
        this._expect(TokenType.KEYWORD, 'var')
        this._compileType()
        this._compileIdent()
        while (this._check(TokenType.SYMBOL, ',')) {
            this._eat()
            this._compileIdent()
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
        if (this._check(TokenType.SYMBOL, '(')) {
            this._eat()
            this.compileExpressionList()
            this._expect(TokenType.SYMBOL, ')')
        } else if (this._check(TokenType.SYMBOL, '.')) {
            this._eat()
            this._compileIdent()
            this._expect(TokenType.SYMBOL, '(')
            this.compileExpressionList()
            this._expect(TokenType.SYMBOL, ')')
        }
    }
    compileDo () {
        this._appendXML('<doStatement>')
        this._expect(TokenType.KEYWORD, 'do')
        this._compileSubroutineCall()
        this._expect(TokenType.SYMBOL, ';')
        this._appendXML('</doStatement>')
    }
    compileLet () {
        this._appendXML('<letStatement>')
        this._expect(TokenType.KEYWORD, 'let')
        this._compileIdent()
        if (this._check(TokenType.SYMBOL, '[')) {
            this._eat()
            this.compileExpression()
            this._expect(TokenType.SYMBOL, ']')
        }
        this._expect(TokenType.SYMBOL, '=')
        this.compileExpression()
        this._expect(TokenType.SYMBOL, ';')
        this._appendXML('</letStatement>')
    }
    compileWhile () {
        this._appendXML('<whileStatement>')
        this._expect(TokenType.KEYWORD, 'while')
        this._expect(TokenType.SYMBOL, '(')
        this.compileExpression()
        this._expect(TokenType.SYMBOL, ')')
        this._expect(TokenType.SYMBOL, '{')
        this.compileStatements()
        this._expect(TokenType.SYMBOL, '}')
        this._appendXML('</whileStatement>')
    }
    compileReturn () {
        this._appendXML('<returnStatement>')
        this._expect(TokenType.KEYWORD, 'return')
        if (this._check(TokenType.SYMBOL, ';')) {
            this._eat()
        } else {
            this.compileExpression()
            this._expect(TokenType.SYMBOL, ';')
        }
        this._appendXML('</returnStatement>')
    }
    compileIf () {
        this._appendXML('<ifStatement>')
        this._expect(TokenType.KEYWORD, 'if')
        this._expect(TokenType.SYMBOL, '(')
        this.compileExpression()
        this._expect(TokenType.SYMBOL, ')')
        this._expect(TokenType.SYMBOL, '{')
        this.compileStatements()
        this._expect(TokenType.SYMBOL, '}')
        if (this._check(TokenType.KEYWORD, 'else')) {
            this._eat()
            this._expect(TokenType.SYMBOL, '{')
            this.compileStatements()
            this._expect(TokenType.SYMBOL, '}')
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
            this.compileTerm()
        }
        this._appendXML('</expression>')
    }
    compileTerm () {
        this._appendXML('<term>')
        if (this._checkAny([{
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
        } else if (this._check(TokenType.IDENTIFIER)) {
            this._eat()
            if (this._check(TokenType.SYMBOL, '[')) {
                this._eat()
                this.compileExpression()
                this._expect(TokenType.SYMBOL, ']')
            } else if (this._check(TokenType.SYMBOL, '(')) {
                this._eat()
                this.compileExpressionList()
                this._expect(TokenType.SYMBOL, ')')
            } else if (this._check(TokenType.SYMBOL, '.')) {
                this._eat()
                this._compileIdent()
                this._expect(TokenType.SYMBOL, '(')
                this.compileExpressionList()
                this._expect(TokenType.SYMBOL, ')')
            }
        } else if (this._check(TokenType.SYMBOL, '(')) {
            this._eat()
            this.compileExpression()
            this._expect(TokenType.SYMBOL, ')')
        } else if (this._checkAny([{
            type: TokenType.SYMBOL,
            value: '-'
        }, {
            type: TokenType.SYMBOL,
            value: '~'
        }])) {
            this._eat()
            this.compileTerm()
        }
        this._appendXML('</term>')
    }
    compileExpressionList () {
        this._appendXML('<expressionList>')
        if (!this._check(TokenType.SYMBOL, ')')) {
            this.compileExpression()
            while (this._check(TokenType.SYMBOL, ',')) {
                this._eat()
                this.compileExpression()
            }
        }
        this._appendXML('</expressionList>')
    }

    getXML () {
        return this._xml
    }
}
module.exports = {
    CompilationEngine
}

