const {Commands, Segments} = require('./Constants')

class VMWriter {
    constructor() {
        this._output = ''
    }
    _appendOutput (inst) {
        this._output += inst + '\n'
    }
    writePush (segment, index) {
        this._appendOutput(`push ${segment} ${index}`)
    }
    writePop (segment, index) {
        this._appendOutput(`pop ${segment} ${index}`)
    }
    writeArithmetic (command) {
        this._appendOutput(`${command}`)
    }
    writeLabel (label) {
        this._appendOutput(`label ${label}`)
    }
    writeGoto (label) {
        this._appendOutput(`goto ${label}`)
    }
    writeIf (label) {
        this._appendOutput(`if-goto ${label}`)
    }
    writeCall (name, nArgs) {
        this._appendOutput(`call ${name} ${nArgs}`)
    }
    writeFunction (name, nLocals) {
        this._appendOutput(`function ${name} ${nLocals}`)
    }
    writeReturn () {
        this._appendOutput('return')
    }
    getOutput () {
        return this._output
    }
}

module.exports = {
    VMWriter
}