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
  MEMORY: 'memory',
  BRANCH: 'branch',
  FUNCTION: 'function'
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
const BranchOpCodes = {
  LABEL: 'label',
  GOTO: 'goto',
  IF_GOTO: 'if-goto'
}
const FunctionOpCodes = {
  FUNCTION: 'function',
  CALL: 'call',
  RETURN: 'return'
}
const OptimizationLevels = { // 优化等级
  O0: 0,
  O1: 1,
  O2: 2
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
    const [opCode, arg1, arg2] = temp
    if (this.checkCommand(opCode, StackOpCodes)) {
      return {
        raw: line,
        type: CommandTypes.ARITHMETIC,
        op: opCode
      }
    } else if (this.checkCommand(opCode, MemoryOpCodes)) {
      if (this.checkSegment(arg1) && this.checkIndex(arg2)) {
        return {
          raw: line,
          type: CommandTypes.MEMORY,
          op: opCode,
          segment: arg1,
          index: Number(arg2)
        }
      } else {
        throw new Error('memory操作语法错误：', line)
      }
    } else if (this.checkCommand(opCode, BranchOpCodes)) {
      return {
        raw: line,
        type: CommandTypes.BRANCH,
        op: opCode,
        label: arg1
      }
    } else if (this.checkCommand(opCode, FunctionOpCodes)) {
      return {
        raw: line,
        type: CommandTypes.FUNCTION,
        op: opCode,
        funcName: arg1,
        n: Number(arg2)
      }
    }
  }
  checkIndex (indexStr) {
    return /^[0-9]+$/.test(indexStr)
  }
  checkCommand (opCode, OpCodes) {
    return Object.values(OpCodes).includes(opCode)
  }
  checkSegment (segment) {
    return Object.values(Segments).includes(segment)
  }
  getCommands () {
    return this.commands
  }
}

/** 优化
 *    1. 单个VM指令生成汇编指令的优化【完成】
 *    2. 整个汇编指令的优化【待完成】
 *  O1：优化1
 *  O2：优化1和2
 */
class CodeWriter {
  constructor (commands, fileName, OLevel = 'O0') {
    this.oLevel = OptimizationLevels[OLevel]
    this.fileName = fileName
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
    } else if (command.type === CommandTypes.BRANCH) {
      return this.emitBranch(command.op, command.label)
    } else if (command.type === CommandTypes.FUNCTION) {
      return this.emitFunction(command.op, command.funcName, command.n)
    }
  }
  emitFunction (opCode, funcName, n) {
    const codeList = []
    switch (opCode) {
      case FunctionOpCodes.CALL: {
        const returnAddress = `${this.funcName}$ret.${getUid()}`
        if (this.oLevel >= OptimizationLevels.O1) {
          codeList.push(
            // push return-address
            `@${returnAddress}`, 'D=A',
            '@SP', 'M=M+1', 'A=M-1', 'M=D',
            // push LCL
            '@LCL', 'D=M',
            '@SP', 'M=M+1', 'A=M-1', 'M=D',
            // push ARG
            '@ARG', 'D=M',
            '@SP', 'M=M+1', 'A=M-1', 'M=D',
            // push THIS
            '@THIS', 'D=M',
            '@SP', 'M=M+1', 'A=M-1', 'M=D',
            // push THAT
            '@THAT', 'D=M',
            '@SP', 'M=M+1', 'A=M-1', 'M=D',
            // ARG = SP-n-5
            `@${n + 5}`, 'D=A',
            '@SP', 'D=M-D',
            '@ARG', 'M=D',
            // LCL = SP
            '@SP', 'D=M',
            '@LCL', 'M=D',
            // goto f
            `@${funcName}`, '0;JMP',
            `(${returnAddress})`
          )
        } else {
          codeList.push(
            // push return-address
            `@${returnAddress}`, 'D=A',
            '@SP', 'A=M', 'M=D',
            '@SP', 'M=M+1',
            // push LCL
            '@LCL', 'D=M',
            '@SP', 'A=M', 'M=D',
            '@SP', 'M=M+1',
            // push ARG
            '@ARG', 'D=M',
            '@SP', 'A=M', 'M=D',
            '@SP', 'M=M+1',
            // push THIS
            '@THIS', 'D=M',
            '@SP', 'A=M', 'M=D',
            '@SP', 'M=M+1',
            // push THAT
            '@THAT', 'D=M',
            '@SP', 'A=M', 'M=D',
            '@SP', 'M=M+1',
            // ARG = SP-n-5
            `@${n + 5}`, 'D=A',
            '@SP', 'D=M-D',
            '@ARG', 'M=D',
            // LCL = SP
            '@SP', 'D=M',
            '@LCL', 'M=D',
            // goto f
            `@${funcName}`, '0;JMP',
            `(${returnAddress})`
          )
        }
        break
      }
      case FunctionOpCodes.FUNCTION: {
        codeList.push(
          `(${funcName})`
        )
        for (let i = 0; i < n; i += 1) {
          if (this.oLevel >= OptimizationLevels.O1) {
            codeList.push(
              // push 0
              '@SP', 'M=M+1', 'A=M-1', 'M=0'
            )
          } else {
            codeList.push(
              // push 0
              '@SP', 'A=M', 'M=0',
              '@SP', 'M=M+1'
            )
          }
        }
        this.funcName = funcName
        break
      }
      case FunctionOpCodes.RETURN: {
        const frame = `frame_${getUid()}`
        const ret = `ret_${getUid()}`
        if (this.oLevel >= OptimizationLevels.O1) {
          codeList.push(
            // FRAME=LCL
            '@LCL', 'D=M',
            `@${frame}`, 'M=D',
            // RET=*(FRAME-5)
            '@5', 'D=A',
            `@${frame}`, 'A=M-D', 'D=M',
            `@${ret}`, 'M=D',
            // *ARG=pop()
            '@SP', 'M=M-1', 'A=M', 'D=M',
            '@ARG', 'A=M', 'M=D',
            // SP=ARG+1
            '@ARG', 'D=M+1',
            '@SP', 'M=D',
            // THAT=*(FRAME-1)
            '@1', 'D=A',
            `@${frame}`, 'A=M-D', 'D=M',
            '@THAT', 'M=D',
            // THIS=*(FRAME-2)
            '@2', 'D=A',
            `@${frame}`, 'A=M-D', 'D=M',
            '@THIS', 'M=D',
            // ARG=*(FRAME-3)
            '@3', 'D=A',
            `@${frame}`, 'A=M-D', 'D=M',
            '@ARG', 'M=D',
            // LCL=*(FRAME-4)
            '@4', 'D=A',
            `@${frame}`, 'A=M-D', 'D=M',
            '@LCL', 'M=D',
            // goto RET
            `@${ret}`, 'A=M', '0;JMP'
          )
        } else {
          codeList.push(
            // FRAME=LCL
            '@LCL', 'D=M',
            `@${frame}`, 'M=D',
            // RET=*(FRAME-5)
            '@5', 'D=A',
            `@${frame}`, 'A=M-D', 'D=M',
            `@${ret}`, 'M=D',
            // *ARG=pop()
            '@SP', 'M=M-1',
            '@SP', 'A=M', 'D=M',
            '@ARG', 'A=M', 'M=D',
            // SP=ARG+1
            '@ARG', 'D=M+1',
            '@SP', 'M=D',
            // THAT=*(FRAME-1)
            '@1', 'D=A',
            `@${frame}`, 'A=M-D', 'D=M',
            '@THAT', 'M=D',
            // THIS=*(FRAME-2)
            '@2', 'D=A',
            `@${frame}`, 'A=M-D', 'D=M',
            '@THIS', 'M=D',
            // ARG=*(FRAME-3)
            '@3', 'D=A',
            `@${frame}`, 'A=M-D', 'D=M',
            '@ARG', 'M=D',
            // LCL=*(FRAME-4)
            '@4', 'D=A',
            `@${frame}`, 'A=M-D', 'D=M',
            '@LCL', 'M=D',
            // goto RET
            `@${ret}`, 'A=M', '0;JMP'
          )
        }
      }
      break
    }
    return codeList
  }
  emitBranch (opCode, label) {
    const codeList = []
    switch (opCode) {
      case BranchOpCodes.LABEL: {
        codeList.push(`(${this.funcName}$${label})`)
        break
      }
      case BranchOpCodes.GOTO: {
        codeList.push(
          `@${this.funcName}$${label}`, '0;JMP'
        )
        break
      }
      case BranchOpCodes.IF_GOTO: {
        if (this.oLevel >= OptimizationLevels.O1) {
          codeList.push(
            '@SP', 'AM=M-1', 'D=M',
            `@${this.funcName}$${label}`, 'D;JNE'
          )
        } else {
          codeList.push(
            '@SP', 'M=M-1', 'A=M', 'D=M',
            `@${this.funcName}$${label}`, 'D;JNE'
          )
        }
        break
      }
    }
    return codeList
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
        if (this.oLevel >= OptimizationLevels.O1) {
          codeList.push(
            '@SP', 'AM=M-1', 'D=M',
            '@SP', 'A=M-1', `M=M${op}D`
          )
        } else {
          codeList.push(
            '@SP', 'M=M-1', 'A=M', 'D=M',
            '@SP', 'M=M-1', 'A=M', `D=M${op}D`,
            '@SP', 'A=M', 'M=D',
            '@SP', 'M=M+1'
          )
        }
        break
      }
      case StackOpCodes.NEG:
      case StackOpCodes.NOT: {
        const op = {
          [StackOpCodes.NEG]: '-',
          [StackOpCodes.NOT]: '!',
        }[opCode]
        if (this.oLevel >= OptimizationLevels.O1) {
          codeList.push(
            '@SP', 'A=M-1', `M=${op}M`
          )
        } else {
          codeList.push(
            '@SP', 'M=M-1', 'A=M', `M=${op}M`,
            '@SP', 'M=M+1'
          )
        }
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
        if (this.oLevel >= OptimizationLevels.O1) {
          codeList.push(
            '@SP', 'AM=M-1', 'D=M',
            '@SP', 'A=M-1', 'D=M-D',
            `@${TRUE_BR}`, `D;${j}`,
            `(${FALSE_BR})`, 'D=0',
            `@${PUSH_BR}`, '0;JMP',
            `(${TRUE_BR})`, 'D=-1',
            `(${PUSH_BR})`,
            '@SP', 'A=M-1', 'M=D'
          )
        } else {
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
        }
        break
      }
    }
    return codeList
  }
  emitPushPop (opCode, segment, index) {
    const codeList = []
    switch (opCode) {
      case MemoryOpCodes.PUSH: {
        switch (segment) {
          case Segments.CONSTANT: {
            if (this.oLevel >= OptimizationLevels.O1) {
              codeList.push(
                `@${index}`, 'D=A',
                '@SP', 'M=M+1', 'A=M-1', 'M=D'
              )
            } else {
              codeList.push(
                `@${index}`, 'D=A',
                '@SP', 'A=M', 'M=D',
                '@SP', 'M=M+1'
              )
            }
            break
          }
          case Segments.LOCAL:
          case Segments.ARGUMENT:
          case Segments.THIS:
          case Segments.THAT:
          case Segments.TEMP:
          case Segments.STATIC:
          case Segments.POINTER: {
            if (segment === Segments.TEMP) {
              codeList.push(`@${index + 5}`, 'D=M')
            } else if (segment === Segments.STATIC) {
              const s = `${this.fileName}.${index}`
              codeList.push(`@${s}`, 'D=M')
            } else if (segment === Segments.POINTER) {
              const t = index === 0 ? 'THIS' : 'THAT'
              codeList.push(`@${t}`, 'D=M')
            } else {
              const seg = {
                [Segments.LOCAL]: 'LCL',
                [Segments.ARGUMENT]: 'ARG',
                [Segments.THIS]: 'THIS',
                [Segments.THAT]: 'THAT'
              }[segment]
              codeList.push(
                `@${index}`, 'D=A', // D=i
                `@${seg}`, 'A=M+D', 'D=M', // D=M[seg+i]
              )
            }
            if (this.oLevel >= OptimizationLevels.O1) {
              codeList.push(
                '@SP', 'M=M+1', 'A=M-1', 'M=D'
              )
            } else {
              codeList.push(
                '@SP', 'A=M', 'M=D', // *SP=D
                '@SP', 'M=M+1' // SP++
              )
            }
            break
          }
        }
        break
      }
      case MemoryOpCodes.POP:
        switch (segment) {
          case Segments.LOCAL:
          case Segments.ARGUMENT:
          case Segments.THIS:
          case Segments.THAT: {
            const seg = {
              [Segments.LOCAL]: 'LCL',
              [Segments.ARGUMENT]: 'ARG',
              [Segments.THIS]: 'THIS',
              [Segments.THAT]: 'THAT'
            }[segment]
            const id = getUid()
            if (this.oLevel >= OptimizationLevels.O1) {
              codeList.push(
                `@${index}`, 'D=A', // D=i
                `@${seg}`, `D=M+D`, // D=seg+i
                `@addr.${id}`, 'M=D', // addr=seg+i
                '@SP', 'AM=M-1', 'D=M', // SP--, D=*SP
                `@addr.${id}`, 'A=M', 'M=D' // M[addr]=D
              )
            } else {
              codeList.push(
                `@${index}`, 'D=A', // D=i
                `@${seg}`, `D=M+D`, // D=seg+i
                `@addr.${id}`, 'M=D', // addr=seg+i
                '@SP', 'M=M-1', 'A=M', 'D=M', // SP--, D=*SP
                `@addr.${id}`, 'A=M', 'M=D' // M[addr]=D
              )
            }
            break
          }
          case Segments.TEMP:
          case Segments.STATIC:
          case Segments.POINTER: {
            let s
            if (segment === Segments.TEMP) {
              s = index + 5
            } else if (segment === Segments.STATIC) {
              s = `${this.fileName}.${index}`
            } else if (segment === Segments.POINTER) {
              s = (index === 0) ? 'THIS' : 'THAT'
            }
            if (this.oLevel >= OptimizationLevels.O1) {
              codeList.push(
                '@SP', 'AM=M-1', 'D=M',
                `@${s}`, 'M=D'
              )
            } else {
              codeList.push(
                '@SP', 'M=M-1', // SP--
                '@SP', 'A=M', 'D=M',
                `@${s}`, 'M=D'
              )
            }
            break
          }
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
    this.oLevel = process.argv[3]
    const stat = fs.statSync(filePath)
    let fileNameList
    let outputPath
    if (stat.isDirectory()) {
      const files = fs.readdirSync(filePath)
      fileNameList = files
        .map((fileName) => path.join(filePath, fileName))
        .filter((file) => {
          return fs.statSync(file).isFile() && path.extname(file) === '.vm'
        })
      outputPath = path.join(filePath, path.basename(filePath)) + '.asm'
    } else {
      fileNameList = [filePath]
      outputPath = filePath.replace('.vm', '.asm')
    }
    const codeList = []
    if (stat.isDirectory()) {
      const initCommands = [
        {
          raw: 'call Sys.init 0',
          type: CommandTypes.FUNCTION,
          op: FunctionOpCodes.CALL,
          funcName: 'Sys.init',
          n: 0
        }
      ]
      const c = new CodeWriter(initCommands, 'unknow', this.oLevel)
      codeList.push(
        '@256', 'D=A',
        '@SP', 'M=D',
        ...c.getCodeList()
      )
    }
    fileNameList.forEach((file) => {
      codeList.push(...this.processFile(file))
    })
    const outContent = codeList.map((line) => {
      if (line.indexOf('(') === 0) {
        return line
      } else {
        return `  ${line}`
      }
    }).join('\n')
    console.log('output: ', outputPath)
    fs.writeFileSync(outputPath, outContent, 'utf-8')
  }
  processFile (file) {
    const name = path.basename(file, '.vm')
    const source = fs.readFileSync(file, 'utf-8')
    const p = new Parser(source)
    const c = new CodeWriter(p.getCommands(), name, this.oLevel)
    return c.getCodeList()
  }
}

// node ./VMTranslator.js path/to/vm/file 不优化
// node ./VMTranslator.js path/to/vm/file O1 优化等级1
// node ./VMTranslator.js path/to/vm/file O2 优化等级2
new Main()
