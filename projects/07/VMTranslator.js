const fs = require('fs')
const path = require('path')

const getUid = (() => {
  let id = -1
  return () => {
    id += 1
    return id
  }
})()

const CommandTypes = {
  ARITHMETIC: 'arithmetic',
  MEMORY: 'memory'
}
const StackOpCodes = {
  ADD: 'add',
  SUB: 'sub',
  NEG: 'neg',
  EQ: 'eq',
  GT: 'gt',
  LT: 'lt',
  AND: 'and',
  OR: 'or',
  NOT: 'not',
}
const MemoryOpCodes = {
  PUSH: 'push',
  POP: 'pop'
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

class Parser {
  constructor (source) {
    this.commands = source
      .split('\n')
      .map(this.cleanLine.bind(this))
      .filter((line) => line)
      .map(this.parseLine.bind(this))
  }
  cleanLine (line) {
    line = line.trim()
    let commentIndex = line.indexOf('//')
    return commentIndex > -1 ? line.slice(0, commentIndex).trim() : line
  }
  parseLine (line) {
    const temp = line.split(/\s+/)
    const [opCode, segment, index] = temp
    if (temp.length === 1) {
      if (this.checkArithmeticOpcode(opCode)) {
        return {
          raw: line,
          type: CommandTypes.ARITHMETIC,
          op: opCode
        }
      } else {
        throw new Error('只能为固定的9个操作符')
      }
    } else {
      if (
        this.checkMemoryOpCode(opCode) && 
        this.checkSegment(segment) && 
        this.checkIndex(index)
      ) {
        return {
          raw: line,
          type: CommandTypes.MEMORY,
          op: opCode,
          segment: segment,
          index: Number(index)
        }
      }
    }
  }
  checkIndex (indexStr) {
    return /^[0-9]+$/.test(indexStr)
  }
  checkArithmeticOpcode (opCode) {
    return Object.values(StackOpCodes).includes(opCode)
  }
  
  checkMemoryOpCode (opCode) {
    return Object.values(MemoryOpCodes).includes(opCode)
  }
  checkSegment (segment) {
    return Object.values(Segments).includes(segment)
  }
  getCommands () {
    return this.commands
  }
}

class CodeWriter {
  constructor (commands, fileName) {
    this.fileName
    this.codeList = []
    for (let command of commands) {
      this.codeList.push('// ' + command.raw)
      this.codeList.push(...this.emitCommand(command))
    }
  }
  emitCommand (command) {
    if (command.type === CommandTypes.ARITHMETIC) {
      return this.emitArithmetic(command.op)
    } else if (command.type === CommandTypes.MEMORY) {
      return this.emitPushPop(command.op, command.segment, command.index)
    }
  }
  emitArithmetic (opCode) {
    const codeList = []
    switch (opCode) {
      case StackOpCodes.ADD:
      case StackOpCodes.SUB:
      case StackOpCodes.AND:
      case StackOpCodes.OR: {
        const op = {
          [StackOpCodes.ADD]: '+',
          [StackOpCodes.SUB]: '-',
          [StackOpCodes.AND]: '&',
          [StackOpCodes.OR]: '|'
        }[opCode]
        codeList.push(
          '@SP', 'M=M-1', 'A=M', 'D=M',
          '@SP', 'M=M-1', 'A=M', `D=M${op}D`,
          '@SP', 'A=M', 'M=D',
          '@SP', 'M=M+1'
        )
        break
      }
      case StackOpCodes.NEG:
      case StackOpCodes.NOT: {
        const op = {
          [StackOpCodes.NEG]: '-',
          [StackOpCodes.NOT]: '!',
        }[opCode]
        codeList.push(
          '@SP', 'M=M-1', 'A=M', `M=${op}M`,
          '@SP', 'M=M+1'
        )
        break
      }
      case StackOpCodes.EQ:
      case StackOpCodes.GT:
      case StackOpCodes.LT: {
        const j = {
          [StackOpCodes.EQ]: 'JEQ',
          [StackOpCodes.GT]: 'JGT',
          [StackOpCodes.LT]: 'JLT'
        }[opCode]
        const id = getUid()
        const TRUE_BR = 'TRUE.' + id
        const FALSE_BR = 'FALSE.' + id
        const PUSH_BR = 'PUSH.' + id
        codeList.push(
          '@SP', 'M=M-1', 'A=M', 'D=M',
          '@SP', 'M=M-1', 'A=M', `D=M-D`,
          `@${TRUE_BR}`, `D;${j}`,
          `(${FALSE_BR})`, 'D=0', 
          `@${PUSH_BR}`, '0;JMP',
          `(${TRUE_BR})`, 'D=-1',
          `(${PUSH_BR})`,
          '@SP', 'A=M', 'M=D',
          '@SP', 'M=M+1'
        )
        break
      }
    }
    return codeList
  }
  emitPushPop (opCode, segment, index) {
    const codeList = []
    switch (opCode) {
      case MemoryOpCodes.PUSH:
        switch (segment) {
          case Segments.CONSTANT:
            codeList.push(
              `@${index}`, 'D=A',
              '@SP', 'A=M', 'M=D',
              '@SP', 'M=M+1'
            )
            break
          case Segments.LOCAL:
          case Segments.ARGUMENT:
          case Segments.THIS:
          case Segments.THAT:
          case Segments.TEMP:
            const seg = {
              [Segments.LOCAL]: 'LCL',
              [Segments.ARGUMENT]: 'ARG',
              [Segments.THIS]: 'THIS',
              [Segments.THAT]: 'THAT'
            }[segment]
            const id = getUid()
            if (segment === Segments.TEMP) {
              codeList.push(`@${index + 5}`, 'D=M')
            } else {
              codeList.push(
                `@${index}`, 'D=A', // D=i
                `@${seg}`, 'A=M+D', 'D=M', // D=M[seg+i]
              )
            }
            codeList.push(
              '@SP', 'A=M', 'M=D', // *SP=D
              '@SP', 'M=M+1' // SP++
            )
            break
          case Segments.STATIC:
            const s = `${this.fileName}.${index}`
            codeList.push(
              `@${s}`, 'D=M',
              '@SP', 'A=M', 'M=D',
              '@SP', 'M=M+1'
            )
            break
          case Segments.POINTER:
            const t = index === 0 ? 'THIS' : 'THAT'
            codeList.push(
              `@${t}`, 'D=M',
              '@SP', 'A=M', 'M=D',
              '@SP', 'M=M+1'
            )
            break
        }
        break
      case MemoryOpCodes.POP:
        switch (segment) {
          case Segments.LOCAL:
          case Segments.ARGUMENT:
          case Segments.THIS:
          case Segments.THAT:
          case Segments.TEMP:
            const seg = {
              [Segments.LOCAL]: 'LCL',
              [Segments.ARGUMENT]: 'ARG',
              [Segments.THIS]: 'THIS',
              [Segments.THAT]: 'THAT'
            }[segment]
            const id = getUid()
            if (segment === Segments.TEMP) {
              codeList.push(`@${index + 5}`, 'D=A')
            } else {
              codeList.push(
                `@${index}`, 'D=A', // D=i
                `@${seg}`, `D=M+D`, // D=seg+i
              )
            }
            codeList.push(
              `@addr.${id}`, 'M=D', // addr=seg+i
              '@SP', 'M=M-1', 'A=M', 'D=M', // SP--, D=*SP
              `@addr.${id}`, 'A=M', 'M=D' // M[addr]=D
            )
            break
          case Segments.STATIC:
            const s = `${this.fileName}.${index}`
            codeList.push(
              '@SP', 'M=M-1', 'A=M', 'D=M',
              `@${s}`, 'M=D'
            )
            break 
          case Segments.POINTER:
            const t = index === 0 ? 'THIS' : 'THAT'
            codeList.push(
              '@SP', 'M=M-1', 'A=M', 'D=M',
              `@${t}`, 'M=D'
            )
            break
        }
        break
    }
    return codeList
  }
  getCodeList () {
    return this.codeList
  }
}

class Main {
  constructor () {
    const filePath = path.join(process.cwd(), process.argv[2])
    const source = fs.readFileSync(filePath, 'utf-8')
    const p = new Parser(source)
    const fileName = path.parse(filePath).name
    const c = new CodeWriter(p.getCommands(), fileName)
    const outContent = c.getCodeList().map((line) => {
      if (line.indexOf('(') === 0) {
        return line
      } else {
        return `  ${line}`
      }
    }).join('\n')
    const outputPath = filePath.replace('.vm', '.asm')
    fs.writeFileSync(outputPath, outContent, 'utf-8')
  }
}

new Main()