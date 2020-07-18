/** 汇编器：将Hack汇编语言编译为Hack机器语言
 *  用法：node Assembler.mjs pong/Pong.asm
 *  会在asm所处的目录中输出同名的.hack文件
 **/

import fs from 'fs'
import path from 'path'

const CommandTypes = {
  A_COMMAND: 'A_COMMAND',
  C_COMMAND: 'C_COMMAND',
  L_COMMAND: 'L_COMMAND'
}


class Parser {
  constructor (source) {
    this.instructions = this.removeSymbol(this.parseInstList(source))
  }
  getInstList () {
    return this.instructions
  }
  checkNum (s) {
    return /^[0-9]+$/.test(s)
  }
  checkSymbol (s) {
    return /^[a-zA-Z_.$:][0-9a-zA-Z_.$:]+$/.test(s)
  }
  checkDest (s) {
    return ['', 'M', 'D', 'MD', 'DM', 'A', 'AM', 'AD', 'AMD'].includes(s)
  }
  checkComp (s) {
    return [
      '0', '1', '-1', 'D', 'A', '!D', '!A', '-D', '-A', 
      'D+1', 'A+1', 'D-1', 'A-1', 'D+A', 'D-A', 'A-D', 'D&A', 'D|A', 
      'M', '!M', '-M', 'M+1', 'M-1', 'D+M', 'D-M', 'M-D', 'D&M', 'D|M'].includes(s)
  }
  checkJump (s) {
    return ['', 'JGT', 'JEQ', 'JGE', 'JLT', 'JNE', 'JLE', 'JMP'].includes(s)
  }
  // 清除注释和空白字符
  cleanLine (line) {
    let newLine = ''
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i].trim()
      if (!char) {
        continue
      } else if (char === '\/' && line[i + 1] === '\/') {
        break
      } else {
        newLine += char
      }
    }
    return newLine
  }
  parseInstList (source) {
    const instList = []
    const lines = source.split('\n')
      .map((line) => this.cleanLine(line))
      .filter((line) => line)
    for (let i = 0, len = lines.length; i < len; i += 1) {
      const line = lines[i]
      let inst
      if (line[0] === '@') {
        const value = line.slice(1)
        const firstLetter = value[0]
        if (firstLetter >= '0' && firstLetter <= '9') {
          inst = {
            commandType: CommandTypes.A_COMMAND,
            symbol: value,
            isNumber: true,
            num: parseInt(value)
          }
          if (!this.checkNum(inst.symbol)) {
            throw new Error('@num instruction syntax error: ' + line)
          }
        } else {
          inst = {
            commandType: CommandTypes.A_COMMAND,
            symbol: value
          }
          if (!this.checkSymbol(inst.symbol)) {
            throw new Error('@symbol instruction syntax error: ' + line)
          }
        }
      } else if (line[0] === '(') {
        if (line[line.length - 1] !== ')') {
          throw new Error('(symbol) instruction must with ) in end: ' + line)
        }
        const symbol = line.slice(1, line.length - 1)
        inst = {
          commandType: CommandTypes.L_COMMAND,
          symbol: symbol
        }
        if (!this.checkSymbol(inst.symbol)) {
          throw new Error('(symbol) syntax error: ' + line)
        }
      } else {
        let newLine = line
        if (newLine.indexOf('=') === -1) {
          newLine = '=' + newLine
        }
        if (newLine.indexOf(';') === -1) {
          newLine = newLine + ';'
        }
        const temp = newLine.split(/=|;/)
        if (temp.length !== 3) {
          throw new Error('C-instruction syntax error: ' + line)
        }
        inst = {
          commandType: CommandTypes.C_COMMAND,
          dest: temp[0],
          comp: temp[1],
          jump: temp[2]
        }
        if (!this.checkDest(inst.dest)) {
          throw new Error('C-instruction dest part syntax error', line)
        }
        if (!this.checkComp(inst.comp)) {
          throw new Error('C-instruction comp part syntax error', line)
        }
        if (!this.checkJump(inst.jump)) {
          throw new Error('C-instruction jump part syntax error', line)
        }
      }
      instList.push(inst)
    }
    // fs.writeFileSync(filePath.replace('.asm', '.noOther.asm'), this.dumpInstList(instList), 'utf-8')
    return instList
  }
  dumpInstList (instList) {
    let strInstList = []
    for (let inst of instList) {
      if (inst.commandType === CommandTypes.A_COMMAND) {
        if (inst.isNumber) {
          strInstList.push(`  @${inst.num}`)
        } else {
          strInstList.push(`  @${inst.symbol}`)
        }
      } else if (inst.commandType === CommandTypes.C_COMMAND) {
        let str = '  '
        if (inst.dest) {
          str += inst.dest + '='
        }
        if (inst.comp) {
          str += inst.comp
        }
        if (inst.jump) {
          str += ';' + inst.jump
        }
        strInstList.push(str)
      } else if (inst.commandType === CommandTypes.L_COMMAND) {
        strInstList.push(`(${inst.symbol})`)
      }
    }
    return strInstList.join('\n')
  }
  // 移除symbol引用
  removeSymbol (instructions) {
    const symbolTable = {
      SP: 0, LCL: 1, ARG: 2, THIS: 3, THAT: 4,
      R0: 0, R1: 1, R2: 2, R3: 3, R4: 4,
      R5: 5, R6: 6, R7: 7, R8: 8, R9: 9,
      R10: 10, R11: 11, R12: 12, R13: 13, R14: 14, R15: 15,
      SCREEN: 16384, KBD: 24576
    }
    let alloc = 16
    const instList = []
    for (let inst of instructions) {
      if (inst.commandType === CommandTypes.L_COMMAND) {
        symbolTable[inst.symbol] = instList.length
        continue
      } else {
        instList.push(inst)
      }
    }
    for (let inst of instList) {
      if (inst.commandType === CommandTypes.A_COMMAND && !inst.isNumber) {
        let target = symbolTable[inst.symbol]
        if (target === undefined) {
          symbolTable[inst.symbol] = alloc
          alloc += 1
          target = symbolTable[inst.symbol]
        }
        inst.isNumber = true
        inst.num = target
      }
    }
    // fs.writeFileSync(filePath.replace('.asm', '.noSymbol.asm'), this.dumpInstList(instList), 'utf-8')
    return instList
  }
}

class Code {
  constructor (instList) {
    this.codeList = []
    for (let inst of instList) {
      this.codeList.push(this.emitInst(inst))
    }
  }
  getCodeList () {
    return this.codeList
  }
  emitInst (inst) {
    if (inst.commandType === CommandTypes.A_COMMAND) {
      return inst.num.toString(2).padStart(16, '0')
    } else if (inst.commandType === CommandTypes.C_COMMAND) {
      const a = inst.comp.indexOf('M') > -1 ? '1' : '0'
      const comp = this.comp(inst.comp)
      const dest = this.dest(inst.dest)
      const jump = this.jump(inst.jump)
      return `111${a}${comp}${dest}${jump}`
    }
  }
  dest (d) {
    let r = ''
    r += d.indexOf('A') > -1 ? '1' : '0'
    r += d.indexOf('D') > -1 ? '1' : '0'
    r += d.indexOf('M') > -1 ? '1' : '0'
    return r
  }
  comp (c) {
    const compTable = {
      '0': '101010', '1': '111111', '-1': '111010',
      'D': '001100', 'A': '110000', 'M': '110000',
      '!D': '001101', '!A': '110001', '!M': '110001',
      '-D': '001111', '-A': '110011', '-M': '110011',
      'D+1': '011111', 'A+1': '110111', 'M+1': '110111',
      'D-1': '001110', 'A-1': '110010', 'M-1': '110010',
      'D+A': '000010', 'D+M': '000010',
      'D-A': '010011', 'D-M': '010011',
      'A-D': '000111', 'M-D': '000111',
      'D&A': '000000', 'D&M': '000000',
      'D|A': '010101', 'D|M': '010101'
    }
    return compTable[c]
  }
  jump (j) {
    const jumpTable = {
      '': '000',
      JGT: '001',
      JEQ: '010',
      JGE: '011',
      JLT: '100',
      JNE: '101',
      JLE: '110',
      JMP: '111'
    }
    return jumpTable[j]
  }
}

class Assembler {
  constructor (filePath) {
    const source = fs.readFileSync(filePath, 'utf-8')
    const parser = new Parser(source)
    const coder = new Code(parser.getInstList())
    const outContent = coder.getCodeList().join('\n') + '\n'
    const outputPath = filePath.replace('.asm', '.hack')
    fs.writeFileSync(outputPath, outContent, 'utf-8')
    console.log('compile .asm to .hack successed.')
    console.log('output file: ' + outputPath)
  }
}

const filePath = path.join(process.cwd(), process.argv[2])
new Assembler(filePath)
