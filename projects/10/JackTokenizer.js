const TokenType = {
    KEYWORD: 'keyword',
    SYMBOL: 'symbol',
    INTEGER_CONSTANT: 'integerConstant',
    STRING_CONSTANT: 'stringConstant',
    IDENTIFIER: 'identifier'
}

class JackTokenizer {
    constructor(str) {
        this._str = str;
        // console.log(this._str)

        this._maxAt = this._str.length - 1;
        this._at = 0;

        this._tokenType = null
        this._value = null
    }
    _isUselessChar (char) {
        return /\s/.test(char)
    }
    hasMoreTokens () {
        const str = this._str;
        let at = this._at;
        while (at <= this._maxAt) {
            if (str[at] === '/' && str[at + 1] === '*') {
                // 注释 /* */
                at += 2;
                while (at < this._maxAt && !(str[at] === '*' && str[at + 1] === '/')) {
                    at += 1
                }
                at += 2
                continue
            } else if (str[at] === '/' && str[at + 1] === '/') {
                // 注释 //
                at += 2
                while (at < this._maxAt && str[at] !== '\n') {
                    at += 1
                }
                at += 1
                continue
            } else  if (/\s/.test(str[at])) {
                // 空格或者换行符
                at += 1
                continue
            }
            this._at = at
            break
        }
        return at <= this._maxAt
    }
    _isSymbol (char) {
        return /^[{}()\[\].,;+\-*\/&|<>=~]$/.test(char)
    }
    _isDigit (char) {
        return /^[0-9]$/.test(char)
    }
    _isDoubleQuote (char) {
        return /^"$/.test(char)
    }
    _isIdentifierChar (char) {
        return /^[a-zA-Z_0-9]$/.test(char)
    }
    _isKeywords (word) {
        return /^(?:class|constructor|function|method|field|static|var|int|char|boolean|void|true|false|null|this|let|do|if|else|while|return)$/.test(word)
    }
    advance () {
        if (this.hasMoreTokens()) {
            let char = this._str[this._at]
            if (this._isSymbol(char)) {
                this._tokenType = TokenType.SYMBOL
                this._value = char
                this._at += 1
            } else if (this._isDigit(char)) {
                this._tokenType = TokenType.INTEGER_CONSTANT
                this._value = char
                this._at += 1
                char = this._str[this._at]
                while (this._isDigit(char)) {
                    this._value += char
                    this._at += 1
                    char = this._str[this._at]
                }
            } else if (this._isDoubleQuote(char)) {
                this._tokenType = TokenType.STRING_CONSTANT
                this._value = ''
                this._at += 1
                char = this._str[this._at]
                while (!this._isDoubleQuote(char)) {
                    this._value += char
                    this._at += 1
                    char = this._str[this._at]
                }
                this._at += 1
            } else if (this._isIdentifierChar(char)) {
                this._value = char
                this._at += 1
                char = this._str[this._at]
                while (this._isIdentifierChar(char)) {
                    this._value += char

                    this._at += 1
                    char = this._str[this._at]
                }
                if (this._isKeywords(this._value)) {
                    this._tokenType = TokenType.KEYWORD
                } else {
                    this._tokenType = TokenType.IDENTIFIER
                }
            } else {
                throw new Error(`无法识别：${this._str.slice(this._at)}(${this._at}), ${char}`)
            }
            return true
        } else {
            // console.log('没有更多')
            return false
        }
    }
    tokenType () {
        return this._tokenType
    }
    tokenValue () {
        return this._value
    }
    getXML () {
        let val = this._value
        const escapeMap = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;'
        }
        if (val === '<' || val === '>' || val === '&') {
            val = escapeMap[val]
        }
        return `<${this._tokenType}> ${val} </${this._tokenType}>`
    }
}

module.exports = {
    TokenType,
    JackTokenizer
}