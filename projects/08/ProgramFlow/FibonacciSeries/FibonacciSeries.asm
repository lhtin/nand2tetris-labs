  // push argument 1
  @1
  D=A
  @ARG
  A=M+D
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // pop pointer 1
  @SP
  M=M-1
  @SP
  A=M
  D=M
  @THAT
  M=D
  // push constant 0
  @0
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // pop that 0
  @0
  D=A
  @THAT
  D=M+D
  @addr.0
  M=D
  @SP
  M=M-1
  A=M
  D=M
  @addr.0
  A=M
  M=D
  // push constant 1
  @1
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // pop that 1
  @1
  D=A
  @THAT
  D=M+D
  @addr.1
  M=D
  @SP
  M=M-1
  A=M
  D=M
  @addr.1
  A=M
  M=D
  // push argument 0
  @0
  D=A
  @ARG
  A=M+D
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // push constant 2
  @2
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // sub
  @SP
  M=M-1
  A=M
  D=M
  @SP
  M=M-1
  A=M
  D=M-D
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // pop argument 0
  @0
  D=A
  @ARG
  D=M+D
  @addr.2
  M=D
  @SP
  M=M-1
  A=M
  D=M
  @addr.2
  A=M
  M=D
  // label MAIN_LOOP_START
(undefined$MAIN_LOOP_START)
  // push argument 0
  @0
  D=A
  @ARG
  A=M+D
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // if-goto COMPUTE_ELEMENT
  @SP
  M=M-1
  A=M
  D=M
  @undefined$COMPUTE_ELEMENT
  D;JNE
  // goto END_PROGRAM
  @undefined$END_PROGRAM
  0;JMP
  // label COMPUTE_ELEMENT
(undefined$COMPUTE_ELEMENT)
  // push that 0
  @0
  D=A
  @THAT
  A=M+D
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // push that 1
  @1
  D=A
  @THAT
  A=M+D
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // add
  @SP
  M=M-1
  A=M
  D=M
  @SP
  M=M-1
  A=M
  D=M+D
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // pop that 2
  @2
  D=A
  @THAT
  D=M+D
  @addr.3
  M=D
  @SP
  M=M-1
  A=M
  D=M
  @addr.3
  A=M
  M=D
  // push pointer 1
  @THAT
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // push constant 1
  @1
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // add
  @SP
  M=M-1
  A=M
  D=M
  @SP
  M=M-1
  A=M
  D=M+D
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // pop pointer 1
  @SP
  M=M-1
  @SP
  A=M
  D=M
  @THAT
  M=D
  // push argument 0
  @0
  D=A
  @ARG
  A=M+D
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // push constant 1
  @1
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // sub
  @SP
  M=M-1
  A=M
  D=M
  @SP
  M=M-1
  A=M
  D=M-D
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // pop argument 0
  @0
  D=A
  @ARG
  D=M+D
  @addr.4
  M=D
  @SP
  M=M-1
  A=M
  D=M
  @addr.4
  A=M
  M=D
  // goto MAIN_LOOP_START
  @undefined$MAIN_LOOP_START
  0;JMP
  // label END_PROGRAM
(undefined$END_PROGRAM)