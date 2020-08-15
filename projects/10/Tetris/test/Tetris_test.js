import {
  Matrix, Queue, Tetrimino,
  TetriminoTypes, TetriminoFacings, TetriminoPoints,
  RotateDirections, MoveDirections
} from '../Tetris.js'
import {
  assert,
  assertEquals,
  assertArrayContains,
} from "https://deno.land/std@0.63.0/testing/asserts.ts";

// utils
function testAllList (type, x, y, exceptedList) {
  [
    TetriminoFacings.North,
    TetriminoFacings.East,
    TetriminoFacings.South,
    TetriminoFacings.West
  ].forEach((facing, index) => {
    const t = new Tetrimino(type, facing, x, y)
    assertArrayContains(t.getXYList(), exceptedList[index])
  })
}
function testFall (type, x, y, excepted) {
  const t = new Tetrimino(type, TetriminoFacings.North, x, y)
  t.fall(-1)
  assertEquals({x: t.x, y: t.y}, excepted)
}
function testMove (type, x, y, exceptedList) {
  [
    -1,
    1
  ].forEach((dx, index) => {
    const t = new Tetrimino(type, TetriminoFacings.North, x, y)
    t.move(dx)
    assertEquals({x: t.x, y: t.y}, exceptedList[index])
  })
}
function testRotate (type, facing, x, y, direction, exceptedList, exceptedFacing) {
  function rotate ({type, facing, x, y}, direction, point) {
    const t = new Tetrimino(type, facing, x, y)
    t.rotate(direction, point)
    return t
  }
  [
    TetriminoPoints.Point1,
    TetriminoPoints.Point2,
    TetriminoPoints.Point3,
    TetriminoPoints.Point4,
    TetriminoPoints.Point5
  ].forEach((point, index) => {
    const excepted = exceptedList[index]
    if (excepted === null) {
      assert(true)
      return
    }
    assertEquals(
      rotate(
        {type: type, facing: facing, x: x, y: y}, direction, point
      ),
      {type: type, facing: exceptedFacing, ...exceptedList[index]})
  })
}

Deno.test('O tetrimino rotate, move, fall', () => {
  const type = TetriminoTypes.O
  // test xy list
  testAllList(type, 4, 4, [
    [{x: 4, y: 4}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 5, y: 4}],
    [{x: 4, y: 4}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 5, y: 4}],
    [{x: 4, y: 4}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 5, y: 4}],
    [{x: 4, y: 4}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 5, y: 4}]
  ])
  // test fall
  testFall(type, 4, 4, {x: 4, y: 3})
  // test move
  testMove(type, 4, 4, [
    {x: 3, y: 4},
    {x: 5, y: 4}
  ])
  // test rotate
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}],
    TetriminoFacings.South
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}, {x: 4, y: 4}],
    TetriminoFacings.South
  )
})
Deno.test('I tetrimino rotate, move, fall', () => {
  const type = TetriminoTypes.I
  // test xy list
  testAllList(type, 4, 4, [
    [{x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 6, y: 4}],
    [{x: 5, y: 5}, {x: 5, y: 4}, {x: 5, y: 3}, {x: 5, y: 2}],
    [{x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 6, y: 3}],
    [{x: 4, y: 5}, {x: 4, y: 4}, {x: 4, y: 3}, {x: 4, y: 2}],
  ])
  // test fall
  testFall(type, 4, 4, {x: 4, y: 3})
  // test move
  testMove(type, 4, 4, [
    {x: 3, y: 4},
    {x: 5, y: 4}
  ])
  // test rotate
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 2, y: 4}, {x: 5, y: 4}, {x: 2, y: 3}, {x: 5, y: 6}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 6, y: 4}, {x: 3, y: 6}, {x: 6, y: 3}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 6, y: 4}, {x: 3, y: 6}, {x: 6, y: 3}],
    TetriminoFacings.South
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 6, y: 4}, {x: 3, y: 4}, {x: 6, y: 5}, {x: 3, y: 2}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 6, y: 4}, {x: 3, y: 4}, {x: 6, y: 5}, {x: 3, y: 2}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 2, y: 4}, {x: 5, y: 2}, {x: 2, y: 5}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 2, y: 4}, {x: 5, y: 2}, {x: 2, y: 5}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 2, y: 4}, {x: 5, y: 4}, {x: 2, y: 3}, {x: 5, y: 6}],
    TetriminoFacings.South
  )
})
Deno.test('T tetrimino rotate, move, fall', () => {
  const type = TetriminoTypes.T
  // test xy list
  testAllList(type, 4, 4, [
    [{x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 4, y: 5}],
    [{x: 4, y: 5}, {x: 4, y: 4}, {x: 4, y: 3}, {x: 5, y: 4}],
    [{x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 4, y: 3}],
    [{x: 4, y: 5}, {x: 4, y: 4}, {x: 4, y: 3}, {x: 3, y: 4}]
  ])
  // test fall
  testFall(type, 4, 4, {x: 4, y: 3})
  // test move
  testMove(type, 4, 4, [
    {x: 3, y: 4},
    {x: 5, y: 4}
  ])
  // test rotate
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 5}, null, {x: 3, y: 2}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 5}, null, {x: 5, y: 2}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 3}, {x: 4, y: 6}, {x: 5, y: 6}],
    TetriminoFacings.South
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 3}, {x: 4, y: 6}, {x: 5, y: 6}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, null, {x: 4, y: 2}, {x: 5, y: 2}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, null, {x: 4, y: 2}, {x: 3, y: 2}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 3}, {x: 4, y: 6}, {x: 3, y: 6}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 3}, {x: 4, y: 6}, {x: 3, y: 6}],
    TetriminoFacings.South
  )
})
Deno.test('L tetrimino rotate, move, fall', () => {
  const type = TetriminoTypes.L
  // test xy list
  testAllList(type, 4, 4, [
    [{x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 5}],
    [{x: 4, y: 5}, {x: 4, y: 4}, {x: 4, y: 3}, {x: 5, y: 3}],
    [{x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 3, y: 3}],
    [{x: 4, y: 5}, {x: 4, y: 4}, {x: 4, y: 3}, {x: 3, y: 5}]
  ])
  // test fall
  testFall(type, 4, 4, {x: 4, y: 3})
  // test move
  testMove(type, 4, 4, [
    {x: 3, y: 4},
    {x: 5, y: 4}
  ])
  // test rotate
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 5}, {x: 4, y: 2}, {x: 3, y: 2}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 5}, {x: 4, y: 2}, {x: 5, y: 2}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 3}, {x: 4, y: 6}, {x: 5, y: 6}],
    TetriminoFacings.South
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 3}, {x: 4, y: 6}, {x: 5, y: 6}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 5}, {x: 4, y: 2}, {x: 5, y: 2}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 5}, {x: 4, y: 2}, {x: 3, y: 2}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 3}, {x: 4, y: 6}, {x: 3, y: 6}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 3}, {x: 4, y: 6}, {x: 3, y: 6}],
    TetriminoFacings.South
  )
})
Deno.test('J tetrimino rotate, move, fall', () => {
  const type = TetriminoTypes.J
  // test xy list
  testAllList(type, 4, 4, [
    [{x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 3, y: 5}],
    [{x: 4, y: 5}, {x: 4, y: 4}, {x: 4, y: 3}, {x: 5, y: 5}],
    [{x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 3}],
    [{x: 4, y: 5}, {x: 4, y: 4}, {x: 4, y: 3}, {x: 3, y: 3}]
  ])
  // test fall
  testFall(type, 4, 4, {x: 4, y: 3})
  // test move
  testMove(type, 4, 4, [
    {x: 3, y: 4},
    {x: 5, y: 4}
  ])
  // test rotate
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 5}, {x: 4, y: 2}, {x: 3, y: 2}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 5}, {x: 4, y: 2}, {x: 5, y: 2}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 3}, {x: 4, y: 6}, {x: 5, y: 6}],
    TetriminoFacings.South
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 3}, {x: 4, y: 6}, {x: 5, y: 6}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 5}, {x: 4, y: 2}, {x: 5, y: 2}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 5}, {x: 4, y: 2}, {x: 3, y: 2}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 3}, {x: 4, y: 6}, {x: 3, y: 6}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 3}, {x: 4, y: 6}, {x: 3, y: 6}],
    TetriminoFacings.South
  )
})
Deno.test('S tetrimino rotate, move, fall', () => {
  const type = TetriminoTypes.S
  // test xy list
  testAllList(type, 4, 4, [
    [{x: 3, y: 4}, {x: 4, y: 4}, {x: 4, y: 5}, {x: 5, y: 5}],
    [{x: 4, y: 5}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 3}],
    [{x: 3, y: 3}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 5, y: 4}],
    [{x: 3, y: 5}, {x: 3, y: 4}, {x: 4, y: 4}, {x: 4, y: 3}],
  ])
  // test fall
  testFall(type, 4, 4, {x: 4, y: 3})
  // test move
  testMove(type, 4, 4, [
    {x: 3, y: 4},
    {x: 5, y: 4}
  ])
  // test rotate
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 5}, {x: 4, y: 2}, {x: 3, y: 2}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 5}, {x: 4, y: 2}, {x: 5, y: 2}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 3}, {x: 4, y: 6}, {x: 5, y: 6}],
    TetriminoFacings.South
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 3}, {x: 4, y: 6}, {x: 5, y: 6}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 5}, {x: 4, y: 2}, {x: 5, y: 2}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 5}, {x: 4, y: 2}, {x: 3, y: 2}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 3}, {x: 4, y: 6}, {x: 3, y: 6}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 3}, {x: 4, y: 6}, {x: 3, y: 6}],
    TetriminoFacings.South
  )
})
Deno.test('Z tetrimino rotate, move, fall', () => {
  const type = TetriminoTypes.Z
  // test xy list
  testAllList(type, 4, 4, [
    [{x: 3, y: 5}, {x: 4, y: 5}, {x: 4, y: 4}, {x: 5, y: 4}],
    [{x: 5, y: 5}, {x: 5, y: 4}, {x: 4, y: 3}, {x: 4, y: 3}],
    [{x: 3, y: 4}, {x: 4, y: 4}, {x: 4, y: 3}, {x: 5, y: 3}],
    [{x: 3, y: 3}, {x: 3, y: 4}, {x: 4, y: 4}, {x: 4, y: 5}]
  ])
  // test fall
  testFall(type, 4, 4, {x: 4, y: 3})
  // test move
  testMove(type, 4, 4, [
    {x: 3, y: 4},
    {x: 5, y: 4}
  ])
  // test rotate
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 5}, {x: 4, y: 2}, {x: 3, y: 2}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.North, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 5}, {x: 4, y: 2}, {x: 5, y: 2}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 3}, {x: 4, y: 6}, {x: 5, y: 6}],
    TetriminoFacings.South
  )
  testRotate(type, TetriminoFacings.East, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 3}, {x: 4, y: 6}, {x: 5, y: 6}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 5, y: 4}, {x: 5, y: 5}, {x: 4, y: 2}, {x: 5, y: 2}],
    TetriminoFacings.West
  )
  testRotate(type, TetriminoFacings.South, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 5}, {x: 4, y: 2}, {x: 3, y: 2}],
    TetriminoFacings.East
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Clockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 3}, {x: 4, y: 6}, {x: 3, y: 6}],
    TetriminoFacings.North
  )
  testRotate(type, TetriminoFacings.West, 4, 4, RotateDirections.Counterclockwise,
    [{x: 4, y: 4}, {x: 3, y: 4}, {x: 3, y: 3}, {x: 4, y: 6}, {x: 3, y: 6}],
    TetriminoFacings.South
  )
})
