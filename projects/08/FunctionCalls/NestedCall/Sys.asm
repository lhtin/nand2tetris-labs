  // function Sys.init 0
(Sys.init)
  // push constant 4000
  @4000
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // pop pointer 0
  @SP
  M=M-1
  @SP
  A=M
  D=M
  @THIS
  M=D
  // push constant 5000
  @5000
  D=A
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
  // call Sys.main 0
  @Sys.init$ret.0
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @LCL
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @ARG
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @THIS
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @THAT
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @5
  D=A
  @SP
  D=M-D
  @ARG
  M=D
  @SP
  D=M
  @LCL
  M=D
  @Sys.main
  0;JMP
(Sys.init$ret.0)
  // pop temp 1
  @SP
  M=M-1
  @SP
  A=M
  D=M
  @6
  M=D
  // label LOOP
(Sys.init$LOOP)
  // goto LOOP
  @Sys.init$LOOP
  0;JMP
  // function Sys.main 5
(Sys.main)
  @SP
  A=M
  M=0
  @SP
  M=M+1
  @SP
  A=M
  M=0
  @SP
  M=M+1
  @SP
  A=M
  M=0
  @SP
  M=M+1
  @SP
  A=M
  M=0
  @SP
  M=M+1
  @SP
  A=M
  M=0
  @SP
  M=M+1
  // push constant 4001
  @4001
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // pop pointer 0
  @SP
  M=M-1
  @SP
  A=M
  D=M
  @THIS
  M=D
  // push constant 5001
  @5001
  D=A
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
  // push constant 200
  @200
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // pop local 1
  @1
  D=A
  @LCL
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
  // push constant 40
  @40
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // pop local 2
  @2
  D=A
  @LCL
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
  // push constant 6
  @6
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // pop local 3
  @3
  D=A
  @LCL
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
  // push constant 123
  @123
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // call Sys.add12 1
  @Sys.main$ret.4
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @LCL
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @ARG
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @THIS
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @THAT
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  @6
  D=A
  @SP
  D=M-D
  @ARG
  M=D
  @SP
  D=M
  @LCL
  M=D
  @Sys.add12
  0;JMP
(Sys.main$ret.4)
  // pop temp 0
  @SP
  M=M-1
  @SP
  A=M
  D=M
  @5
  M=D
  // push local 0
  @0
  D=A
  @LCL
  A=M+D
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // push local 1
  @1
  D=A
  @LCL
  A=M+D
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // push local 2
  @2
  D=A
  @LCL
  A=M+D
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // push local 3
  @3
  D=A
  @LCL
  A=M+D
  D=M
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // push local 4
  @4
  D=A
  @LCL
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
  // return
  @LCL
  D=M
  @frame_5
  M=D
  @5
  D=A
  @frame_5
  A=M-D
  D=M
  @ret_6
  M=D
  @SP
  M=M-1
  @SP
  A=M
  D=M
  @ARG
  A=M
  M=D
  @ARG
  D=M+1
  @SP
  M=D
  @1
  D=A
  @frame_5
  A=M-D
  D=M
  @THAT
  M=D
  @2
  D=A
  @frame_5
  A=M-D
  D=M
  @THIS
  M=D
  @3
  D=A
  @frame_5
  A=M-D
  D=M
  @ARG
  M=D
  @4
  D=A
  @frame_5
  A=M-D
  D=M
  @LCL
  M=D
  @ret_6
  A=M
  0;JMP
  // function Sys.add12 0
(Sys.add12)
  // push constant 4002
  @4002
  D=A
  @SP
  A=M
  M=D
  @SP
  M=M+1
  // pop pointer 0
  @SP
  M=M-1
  @SP
  A=M
  D=M
  @THIS
  M=D
  // push constant 5002
  @5002
  D=A
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
  // push constant 12
  @12
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
  // return
  @LCL
  D=M
  @frame_7
  M=D
  @5
  D=A
  @frame_7
  A=M-D
  D=M
  @ret_8
  M=D
  @SP
  M=M-1
  @SP
  A=M
  D=M
  @ARG
  A=M
  M=D
  @ARG
  D=M+1
  @SP
  M=D
  @1
  D=A
  @frame_7
  A=M-D
  D=M
  @THAT
  M=D
  @2
  D=A
  @frame_7
  A=M-D
  D=M
  @THIS
  M=D
  @3
  D=A
  @frame_7
  A=M-D
  D=M
  @ARG
  M=D
  @4
  D=A
  @frame_7
  A=M-D
  D=M
  @LCL
  M=D
  @ret_8
  A=M
  0;JMP