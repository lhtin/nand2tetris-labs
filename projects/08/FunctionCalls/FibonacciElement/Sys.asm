  @256
  D=A
  @SP
  M=D
  @Sys.init
  0;JMP
  // function Sys.init 0
  // push constant 4
  @4
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // call Main.fibonacci 1
  // label WHILE
(Sys.WHILE)
  // goto WHILE
  @Sys.WHILE
  0;JMP