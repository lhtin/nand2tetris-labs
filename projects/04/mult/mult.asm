// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.
  @R2
  M=0 // R2=0
  
  @R1
  D=M // D=R1
  @NEG
  D;JLT // R1 < 0 goto NEG
  @R1
  D=M // D=R1
  @i
  M=D // i=R1
  @LOOP
  0;JMP
(NEG)
  @R1
  D=-M 
  @i
  M=D // i=-R1
  @LOOP
  0;JMP

(LOOP)
  @i
  D=M
  @CHECK
  D;JLE // i<=0 goto CHECK
  @R0
  D=M
  @R2
  M=M+D // R2 = R2 + R0
  @i
  M=M-1 // i = i - 1
  @LOOP
  0;JMP

(CHECK)
  @R1
  D=M
  @END
  D;JGE // R1 >= 0 goto END
  @R2
  M=-M // R2 = -R2
  @END
  0;JMP

(END)
  @END
  0;JMP