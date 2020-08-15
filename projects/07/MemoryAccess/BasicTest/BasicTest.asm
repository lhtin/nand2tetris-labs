  // push constant 10
  @10
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // pop local 0
  @0
  D=A
  @LCL
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
  // push constant 21
  @21
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // push constant 22
  @22
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // pop argument 2
  @2
  D=A
  @ARG
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
  // pop argument 1
  @1
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
  // push constant 36
  @36
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // pop this 6
  @6
  D=A
  @THIS
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
  // push constant 42
  @42
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // push constant 45
  @45
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // pop that 5
  @5
  D=A
  @THAT
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
  // pop that 2
  @2
  D=A
  @THAT
  D=M+D
  @addr.5
  M=D
  @SP
  M=M-1
  A=M
  D=M
  @addr.5
  A=M
  M=D
  // push constant 510
  @510
  D=A
  @SP
  M=M+1
  A=M-1
  M=D
  // pop temp 6
  @11
  D=A
  @addr.6
  M=D
  @SP
  M=M-1
  A=M
  D=M
  @addr.6
  A=M
  M=D
  // push local 0
  @0
  D=A
  @LCL
  A=M+D
  D=M
  @SP
  M=M+1
  A=M-1
  M=D
  // push that 5
  @5
  D=A
  @THAT
  A=M+D
  D=M
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
  // push argument 1
  @1
  D=A
  @ARG
  A=M+D
  D=M
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
  // push this 6
  @6
  D=A
  @THIS
  A=M+D
  D=M
  @SP
  M=M+1
  A=M-1
  M=D
  // push this 6
  @6
  D=A
  @THIS
  A=M+D
  D=M
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
  // push temp 6
  @11
  D=M
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