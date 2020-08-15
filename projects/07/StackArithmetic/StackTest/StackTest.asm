  // push constant 17
  @17
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // push constant 17
  @17
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // eq
  @SP
  AM=M-1
  D=M
  @SP
  A=M-1
  D=M-D
  @TRUE.0
  D;JEQ
(FALSE.0)
  D=0
  @PUSH.0
  0;JMP
(TRUE.0)
  D=-1
(PUSH.0)
  @SP
  A=M-1
  M=D
  // push constant 17
  @17
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // push constant 16
  @16
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // eq
  @SP
  AM=M-1
  D=M
  @SP
  A=M-1
  D=M-D
  @TRUE.1
  D;JEQ
(FALSE.1)
  D=0
  @PUSH.1
  0;JMP
(TRUE.1)
  D=-1
(PUSH.1)
  @SP
  A=M-1
  M=D
  // push constant 16
  @16
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // push constant 17
  @17
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // eq
  @SP
  AM=M-1
  D=M
  @SP
  A=M-1
  D=M-D
  @TRUE.2
  D;JEQ
(FALSE.2)
  D=0
  @PUSH.2
  0;JMP
(TRUE.2)
  D=-1
(PUSH.2)
  @SP
  A=M-1
  M=D
  // push constant 892
  @892
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // push constant 891
  @891
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // lt
  @SP
  AM=M-1
  D=M
  @SP
  A=M-1
  D=M-D
  @TRUE.3
  D;JLT
(FALSE.3)
  D=0
  @PUSH.3
  0;JMP
(TRUE.3)
  D=-1
(PUSH.3)
  @SP
  A=M-1
  M=D
  // push constant 891
  @891
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // push constant 892
  @892
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // lt
  @SP
  AM=M-1
  D=M
  @SP
  A=M-1
  D=M-D
  @TRUE.4
  D;JLT
(FALSE.4)
  D=0
  @PUSH.4
  0;JMP
(TRUE.4)
  D=-1
(PUSH.4)
  @SP
  A=M-1
  M=D
  // push constant 891
  @891
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // push constant 891
  @891
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // lt
  @SP
  AM=M-1
  D=M
  @SP
  A=M-1
  D=M-D
  @TRUE.5
  D;JLT
(FALSE.5)
  D=0
  @PUSH.5
  0;JMP
(TRUE.5)
  D=-1
(PUSH.5)
  @SP
  A=M-1
  M=D
  // push constant 32767
  @32767
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // push constant 32766
  @32766
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // gt
  @SP
  AM=M-1
  D=M
  @SP
  A=M-1
  D=M-D
  @TRUE.6
  D;JGT
(FALSE.6)
  D=0
  @PUSH.6
  0;JMP
(TRUE.6)
  D=-1
(PUSH.6)
  @SP
  A=M-1
  M=D
  // push constant 32766
  @32766
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // push constant 32767
  @32767
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // gt
  @SP
  AM=M-1
  D=M
  @SP
  A=M-1
  D=M-D
  @TRUE.7
  D;JGT
(FALSE.7)
  D=0
  @PUSH.7
  0;JMP
(TRUE.7)
  D=-1
(PUSH.7)
  @SP
  A=M-1
  M=D
  // push constant 32766
  @32766
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // push constant 32766
  @32766
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // gt
  @SP
  AM=M-1
  D=M
  @SP
  A=M-1
  D=M-D
  @TRUE.8
  D;JGT
(FALSE.8)
  D=0
  @PUSH.8
  0;JMP
(TRUE.8)
  D=-1
(PUSH.8)
  @SP
  A=M-1
  M=D
  // push constant 57
  @57
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // push constant 31
  @31
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // push constant 53
  @53
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // add
  @SP
  M=M-1
  A=M
  D=M
  @SP
  M=M-1
  A=M
  M=M+D
  @SP
  M=M+1
  // push constant 112
  @112
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // sub
  @SP
  M=M-1
  A=M
  D=M
  @SP
  M=M-1
  A=M
  M=M-D
  @SP
  M=M+1
  // neg
  @SP
  D=M-1
  A=D
  M=-M
  // and
  @SP
  M=M-1
  A=M
  D=M
  @SP
  M=M-1
  A=M
  M=M&D
  @SP
  M=M+1
  // push constant 82
  @82
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // or
  @SP
  M=M-1
  A=M
  D=M
  @SP
  M=M-1
  A=M
  M=M|D
  @SP
  M=M+1
  // not
  @SP
  D=M-1
  A=D
  M=!M