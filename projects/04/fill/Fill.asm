// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

// KBD > 0 
//   then color = -1 
//   else color = 0
(LOOP1)
  @KBD
  D=M
  @BLACK
  D;JGT
  @color
  M=0
  @PAINT
  0;JMP
(BLACK)
  @color
  M=-1

(PAINT)
  @8192
  D=A
  @i
  M=D // i = 8192
  @SCREEN
  D=A
  @screen
  M=D // screen = SCREEN
(LOOP2)
  @color
  D=M
  @screen
  A=M
  M=D // M[screen] = color
  @screen
  M=M+1 // screen = screen + 1
  @i
  M=M-1 // i = i - 1
  D=M
  @LOOP2
  D;JGT
  @LOOP1
  0;JMP