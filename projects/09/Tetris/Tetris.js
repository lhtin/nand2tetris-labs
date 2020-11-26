// 将数组打乱，from https://bost.ocks.org/mike/shuffle/
const shuffle = (arr) => {
  let unshuffledLen = arr.length
  while (unshuffledLen) {
    unshuffledLen -= 1
    const i = Math.floor(Math.random() * unshuffledLen)
    const temp = arr[unshuffledLen]
    arr[unshuffledLen] = arr[i]
    arr[i] = temp
  }
  return arr;
}

// 方块的种类
const TetriminoTypes = {
  O: 'O',
  I: 'I',
  T: 'T',
  L: 'L',
  J: 'J',
  S: 'S',
  Z: 'Z'
}
// 方块的朝向
const TetriminoFacings = {
  North: 'North',
  East: 'East',
  South: 'South',
  West: 'West'
}
// 方块的旋转点
const TetriminoPoints = {
  Point1: 'Point1',
  Point2: 'Point2',
  Point3: 'Point3',
  Point4: 'Point4',
  Point5: 'Point5'
}
// 旋转方向
const RotateDirections = {
  Clockwise: 'Clockwise', // 顺时针旋转
  Counterclockwise: 'Counterclockwise' // 逆时针旋转
}
// 移动方向
const MoveDirections = {
  Left: 'Left',
  Right: 'Right'
}
// 记录在给定的方块类型、朝向，每个小方块与Point1的偏移量
// 用于快速通过方块类型、朝向和Point1的坐标，快速计算四个小方块的坐标
const PerMinosXYOffsetOfPoint1XY = {
  [TetriminoTypes.O]: {
    [TetriminoFacings.North]: [{dx: 0, dy: 0}, {dx: 0, dy: 1}, {dx: 1, dy: 1}, {dx: 1, dy: 0}],
    [TetriminoFacings.East]: [{dx: 0, dy: 0}, {dx: 0, dy: 1}, {dx: 1, dy: 1}, {dx: 1, dy: 0}],
    [TetriminoFacings.West]: [{dx: 0, dy: 0}, {dx: 0, dy: 1}, {dx: 1, dy: 1}, {dx: 1, dy: 0}],
    [TetriminoFacings.South]: [{dx: 0, dy: 0}, {dx: 0, dy: 1}, {dx: 1, dy: 1}, {dx: 1, dy: 0}]
  },
  [TetriminoTypes.I]: {
    [TetriminoFacings.North]: [{dx: -1, dy: 0}, {dx: 0, dy: 0}, {dx: 1, dy: 0}, {dx: 2, dy: 0}],
    [TetriminoFacings.East]: [{dx: 1, dy: 1}, {dx: 1, dy: 0}, {dx: 1, dy: -1}, {dx: 1, dy: -2}],
    [TetriminoFacings.West]: [{dx: 0, dy: 1}, {dx: 0, dy: 0}, {dx: 0, dy: -1}, {dx: 0, dy: -2}],
    [TetriminoFacings.South]: [{dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1}, {dx: 2, dy: -1}]
  },
  [TetriminoTypes.T]: {
    [TetriminoFacings.North]: [{dx: -1, dy: 0}, {dx: 0, dy: 0}, {dx: 1, dy: 0}, {dx: 0, dy: 1}],
    [TetriminoFacings.East]: [{dx: 0, dy: 1}, {dx: 0, dy: 0}, {dx: 0, dy: -1}, {dx: 1, dy: 0}],
    [TetriminoFacings.West]: [{dx: 0, dy: 1}, {dx: 0, dy: 0}, {dx: 0, dy: -1}, {dx: -1, dy: 0}],
    [TetriminoFacings.South]: [{dx: -1, dy: 0}, {dx: 0, dy: 0}, {dx: 1, dy: 0}, {dx: 0, dy: -1}]
  },
  [TetriminoTypes.L]: {
    [TetriminoFacings.North]: [{dx: -1, dy: 0}, {dx: 0, dy: 0}, {dx: 1, dy: 0}, {dx: 1, dy: 1}],
    [TetriminoFacings.East]: [{dx: 0, dy: 1}, {dx: 0, dy: 0}, {dx: 0, dy: -1}, {dx: 1, dy: -1}],
    [TetriminoFacings.West]: [{dx: 0, dy: 1}, {dx: 0, dy: 0}, {dx: 0, dy: -1}, {dx: -1, dy: 1}],
    [TetriminoFacings.South]: [{dx: -1, dy: 0}, {dx: 0, dy: 0}, {dx: 1, dy: 0}, {dx: -1, dy: -1}]
  },
  [TetriminoTypes.J]: {
    [TetriminoFacings.North]: [{dx: -1, dy: 0}, {dx: 0, dy: 0}, {dx: 1, dy: 0}, {dx: -1, dy: 1}],
    [TetriminoFacings.East]: [{dx: 0, dy: 1}, {dx: 0, dy: 0}, {dx: 0, dy: -1}, {dx: 1, dy: 1}],
    [TetriminoFacings.West]: [{dx: 0, dy: 1}, {dx: 0, dy: 0}, {dx: 0, dy: -1}, {dx: -1, dy: -1}],
    [TetriminoFacings.South]: [{dx: -1, dy: 0}, {dx: 0, dy: 0}, {dx: 1, dy: 0}, {dx: 1, dy: -1}]
  },
  [TetriminoTypes.S]: {
    [TetriminoFacings.North]: [{dx: -1, dy: 0}, {dx: 0, dy: 0}, {dx: 0, dy: 1}, {dx: 1, dy: 1}],
    [TetriminoFacings.East]: [{dx: 0, dy: 1}, {dx: 0, dy: 0}, {dx: 1, dy: 0}, {dx: 1, dy: -1}],
    [TetriminoFacings.West]: [{dx: -1, dy: 1}, {dx: -1, dy: 0}, {dx: 0, dy: 0}, {dx: 0, dy: -1}],
    [TetriminoFacings.South]: [{dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 0, dy: 0}, {dx: 1, dy: 0}]
  },
  [TetriminoTypes.Z]: {
    [TetriminoFacings.North]: [{dx: 1, dy: 0}, {dx: 0, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 1}],
    [TetriminoFacings.East]: [{dx: 0, dy: -1}, {dx: 0, dy: 0}, {dx: 1, dy: 0}, {dx: 1, dy: 1}],
    [TetriminoFacings.West]: [{dx: -1, dy: -1}, {dx: -1, dy: 0}, {dx: 0, dy: 0}, {dx: 0, dy: 1}],
    [TetriminoFacings.South]: [{dx: 1, dy: -1}, {dx: 0, dy: -1}, {dx: 0, dy: 0}, {dx: -1, dy: 0}]
  }
}
// 记录根据Point2～5非标准旋转之后，与根据Point1旋转之后的偏移量
// I为4*1型号，T、L、J、S、Z为3*2型号，O旋转后不变
const OffsetOfPoint1AfterRotate = {
  '2*2': {
    [TetriminoFacings.North]: {
      [TetriminoFacings.East]: {
        [TetriminoPoints.Point2]: {dx: 0, dy: 0},
        [TetriminoPoints.Point3]: {dx: 0, dy: 0},
        [TetriminoPoints.Point4]: {dx: 0, dy: 0},
        [TetriminoPoints.Point5]: {dx: 0, dy: 0}
      },
      [TetriminoFacings.West]: {
        [TetriminoPoints.Point2]: {dx: 0, dy: 0},
        [TetriminoPoints.Point3]: {dx: 0, dy: 0},
        [TetriminoPoints.Point4]: {dx: 0, dy: 0},
        [TetriminoPoints.Point5]: {dx: 0, dy: 0}
      }
    },
    [TetriminoFacings.East]: {
      [TetriminoFacings.South]: {
        [TetriminoPoints.Point2]: {dx: 0, dy: 0},
        [TetriminoPoints.Point3]: {dx: 0, dy: 0},
        [TetriminoPoints.Point4]: {dx: 0, dy: 0},
        [TetriminoPoints.Point5]: {dx: 0, dy: 0}
      },
      [TetriminoFacings.North]: {
        [TetriminoPoints.Point2]: {dx: 0, dy: 0},
        [TetriminoPoints.Point3]: {dx: 0, dy: 0},
        [TetriminoPoints.Point4]: {dx: 0, dy: 0},
        [TetriminoPoints.Point5]: {dx: 0, dy: 0}
      }
    },
    [TetriminoFacings.South]: {
      [TetriminoFacings.West]: {
        [TetriminoPoints.Point2]: {dx: 0, dy: 0},
        [TetriminoPoints.Point3]: {dx: 0, dy: 0},
        [TetriminoPoints.Point4]: {dx: 0, dy: 0},
        [TetriminoPoints.Point5]: {dx: 0, dy: 0}
      },
      [TetriminoFacings.East]: {
        [TetriminoPoints.Point2]: {dx: 0, dy: 0},
        [TetriminoPoints.Point3]: {dx: 0, dy: 0},
        [TetriminoPoints.Point4]: {dx: 0, dy: 0},
        [TetriminoPoints.Point5]: {dx: 0, dy: 0}
      }
    },
    [TetriminoFacings.West]: {
      [TetriminoFacings.North]: {
        [TetriminoPoints.Point2]: {dx: 0, dy: 0},
        [TetriminoPoints.Point3]: {dx: 0, dy: 0},
        [TetriminoPoints.Point4]: {dx: 0, dy: 0},
        [TetriminoPoints.Point5]: {dx: 0, dy: 0}
      },
      [TetriminoFacings.South]: {
        [TetriminoPoints.Point2]: {dx: 0, dy: 0},
        [TetriminoPoints.Point3]: {dx: 0, dy: 0},
        [TetriminoPoints.Point4]: {dx: 0, dy: 0},
        [TetriminoPoints.Point5]: {dx: 0, dy: 0}
      }
    },
  },
  '4*1': {
    [TetriminoFacings.North]: {
      [TetriminoFacings.East]: {
        [TetriminoPoints.Point2]: {dx: -2, dy: 0},
        [TetriminoPoints.Point3]: {dx: 1, dy: 0},
        [TetriminoPoints.Point4]: {dx: -2, dy: -1},
        [TetriminoPoints.Point5]: {dx: 1, dy: 2}
      },
      [TetriminoFacings.West]: {
        [TetriminoPoints.Point2]: {dx: -1, dy: 0},
        [TetriminoPoints.Point3]: {dx: 2, dy: 0},
        [TetriminoPoints.Point4]: {dx: -1, dy: 2},
        [TetriminoPoints.Point5]: {dx: 2, dy: -1}
      }
    },
    [TetriminoFacings.East]: {
      [TetriminoFacings.South]: {
        [TetriminoPoints.Point2]: {dx: -1, dy: 0},
        [TetriminoPoints.Point3]: {dx: 2, dy: 0},
        [TetriminoPoints.Point4]: {dx: -1, dy: 2},
        [TetriminoPoints.Point5]: {dx: 2, dy: -1}
      },
      [TetriminoFacings.North]: {
        [TetriminoPoints.Point2]: {dx: 2, dy: 0},
        [TetriminoPoints.Point3]: {dx: -1, dy: 0},
        [TetriminoPoints.Point4]: {dx: 2, dy: 1},
        [TetriminoPoints.Point5]: {dx: -1, dy: -2}
      }
    },
    [TetriminoFacings.South]: {
      [TetriminoFacings.West]: {
        [TetriminoPoints.Point2]: {dx: 2, dy: 0},
        [TetriminoPoints.Point3]: {dx: -1, dy: 0},
        [TetriminoPoints.Point4]: {dx: 2, dy: 1},
        [TetriminoPoints.Point5]: {dx: -1, dy: -2}
      },
      [TetriminoFacings.East]: {
        [TetriminoPoints.Point2]: {dx: 1, dy: 0},
        [TetriminoPoints.Point3]: {dx: -2, dy: 0},
        [TetriminoPoints.Point4]: {dx: 1, dy: -2},
        [TetriminoPoints.Point5]: {dx: -2, dy: 1}
      }
    },
    [TetriminoFacings.West]: {
      [TetriminoFacings.North]: {
        [TetriminoPoints.Point2]: {dx: 1, dy: 0},
        [TetriminoPoints.Point3]: {dx: -2, dy: 0},
        [TetriminoPoints.Point4]: {dx: 1, dy: -2},
        [TetriminoPoints.Point5]: {dx: -2, dy: 1}
      },
      [TetriminoFacings.South]: {
        [TetriminoPoints.Point2]: {dx: -2, dy: 0},
        [TetriminoPoints.Point3]: {dx: 1, dy: 0},
        [TetriminoPoints.Point4]: {dx: -2, dy: -1},
        [TetriminoPoints.Point5]: {dx: 1, dy: 2}
      }
    },
  },
  '3*2': {
    [TetriminoFacings.North]: {
      [TetriminoFacings.East]: {
        [TetriminoPoints.Point2]: {dx: -1, dy: 0},
        [TetriminoPoints.Point3]: {dx: -1, dy: 1},
        [TetriminoPoints.Point4]: {dx: 0, dy: -2},
        [TetriminoPoints.Point5]: {dx: -1, dy: -2}
      },
      [TetriminoFacings.West]: {
        [TetriminoPoints.Point2]: {dx: 1, dy: 0},
        [TetriminoPoints.Point3]: {dx: 1, dy: 1},
        [TetriminoPoints.Point4]: {dx: 0, dy: -2},
        [TetriminoPoints.Point5]: {dx: 1, dy: -2}
      }
    },
    [TetriminoFacings.East]: {
      [TetriminoFacings.South]: {
        [TetriminoPoints.Point2]: {dx: 1, dy: 0},
        [TetriminoPoints.Point3]: {dx: 1, dy: -1},
        [TetriminoPoints.Point4]: {dx: 0, dy: 2},
        [TetriminoPoints.Point5]: {dx: 1, dy: 2}
      },
      [TetriminoFacings.North]: {
        [TetriminoPoints.Point2]: {dx: 1, dy: 0},
        [TetriminoPoints.Point3]: {dx: 1, dy: -1},
        [TetriminoPoints.Point4]: {dx: 0, dy: 2},
        [TetriminoPoints.Point5]: {dx: 1, dy: 2}
      }
    },
    [TetriminoFacings.South]: {
      [TetriminoFacings.West]: {
        [TetriminoPoints.Point2]: {dx: 1, dy: 0},
        [TetriminoPoints.Point3]: {dx: 1, dy: 1},
        [TetriminoPoints.Point4]: {dx: 0, dy: -2},
        [TetriminoPoints.Point5]: {dx: 1, dy: -2}
      },
      [TetriminoFacings.East]: {
        [TetriminoPoints.Point2]: {dx: -1, dy: 0},
        [TetriminoPoints.Point3]: {dx: -1, dy: 1},
        [TetriminoPoints.Point4]: {dx: 0, dy: -2},
        [TetriminoPoints.Point5]: {dx: -1, dy: -2}
      }
    },
    [TetriminoFacings.West]: {
      [TetriminoFacings.North]: {
        [TetriminoPoints.Point2]: {dx: -1, dy: 0},
        [TetriminoPoints.Point3]: {dx: -1, dy: -1},
        [TetriminoPoints.Point4]: {dx: 0, dy: 2},
        [TetriminoPoints.Point5]: {dx: -1, dy: 2}
      },
      [TetriminoFacings.South]: {
        [TetriminoPoints.Point2]: {dx: -1, dy: 0},
        [TetriminoPoints.Point3]: {dx: -1, dy: -1},
        [TetriminoPoints.Point4]: {dx: 0, dy: 2},
        [TetriminoPoints.Point5]: {dx: -1, dy: 2}
      }
    },
  }
}
// 经过旋转后的朝向
const FacingAfterRotate = {
  [TetriminoFacings.North]: {
    [RotateDirections.Clockwise]: TetriminoFacings.East,
    [RotateDirections.Counterclockwise]: TetriminoFacings.West
  },
  [TetriminoFacings.East]: {
    [RotateDirections.Clockwise]: TetriminoFacings.South,
    [RotateDirections.Counterclockwise]: TetriminoFacings.North
  },
  [TetriminoFacings.South]: {
    [RotateDirections.Clockwise]: TetriminoFacings.West,
    [RotateDirections.Counterclockwise]: TetriminoFacings.East
  },
  [TetriminoFacings.West]: {
    [RotateDirections.Clockwise]: TetriminoFacings.North,
    [RotateDirections.Counterclockwise]: TetriminoFacings.South
  }
}
// 游戏过程
const Phases = {
  Generation: 'Generation',
  Falling: 'Falling',
  Lock: 'Lock',
  Pattern: 'Pattern',
  Iterate: 'Iterate',
  Animate: 'Animate',
  Eliminate: 'Eliminate',
  Completion: 'Completion',
  Pause: 'Pause',
  Over: 'Over',
  Success: 'Success'
}

class Queue {
  constructor () {
    this._nextQueue = this._generateBag()
    this._bag = []
  }
  // 当前方块lock down后，获取下一个方块
  getNext () {
    const next = this._nextQueue.shift()
    if (this._bag.length <= 0) {
      this._bag = this._generateBag()
    }
    this._nextQueue.push(this._bag.shift())
    return next
  }
  // 获取当前的Next Queue列表，共7个
  getNextQueue () {
    return this._nextQueue
  }
  _generateBag () {
    return shuffle(Object.values(TetriminoTypes))
  }
}

class Tetrimino {
  constructor (type, facing, x, y) {
    this.type = type
    this.facing = facing
    this.x = x
    this.y = y
  }
  fall (dy) {
    this.y += dy
  }
  move (dx) {
    this.x += dx
  }
  rotate (direction, point) {
    const {
      facing,
      d
    } = this.getRotateD(direction, point)
    this.facing = facing
    this.x += d.dx
    this.y += d.dy
  }
  getRotateD (direction, point) {
    const newFacing = FacingAfterRotate[this.facing][direction]
    let d
    switch (point) {
      case TetriminoPoints.Point1:
        d = {dx: 0, dy: 0}
        break
      case TetriminoPoints.Point2:
      case TetriminoPoints.Point3:
      case TetriminoPoints.Point4:
      case TetriminoPoints.Point5:
        let x
        switch (this.type) {
          case TetriminoTypes.O:
            x = '2*2'
            break
          case TetriminoTypes.I:
            x = '4*1'
            break
          case TetriminoTypes.J:
          case TetriminoTypes.L:
          case TetriminoTypes.S:
          case TetriminoTypes.T:
          case TetriminoTypes.Z:
            x = '3*2'
            break
        }
        d = OffsetOfPoint1AfterRotate[x][this.facing][newFacing][point]
        break
    }
    return {
      facing: newFacing,
      d: d
    }
  }
  getRotateList (direction, point) {
    const {
      facing,
      d
    } = this.getRotateD(direction, point)
    return this._getXYListByFacingAndPoint(facing, d)
  }
  _getXYListByFacingAndPoint (facing, d) {
    const x = this.x + d.dx
    const y = this.y + d.dy
    const dList = PerMinosXYOffsetOfPoint1XY[this.type][facing]
    return dList.map(({dx, dy}) => ({x: x + dx, y: y + dy}))
  }
  getXYList () {
    const dList = PerMinosXYOffsetOfPoint1XY[this.type][this.facing]
    return dList.map(({dx, dy}) => ({x: this.x + dx, y: this.y + dy}))
  }
}

class Matrix {
  constructor () {
    this.MIN_X = 1
    this.MIN_Y = 1
    this.MAX_X = 10
    this.MAX_Y = 22
    this.table = [[], [], [], [], [], [], [], [], [], [], []]
  }
  setTetrimino (tetrimino) {
    this.tetrimino = tetrimino
  }
  _getList () {
    if (!this.tetrimino) {
      return []
    }
    return this.tetrimino.getXYList()
  }
  _getNewList (dx, dy) {
    return this._getList().map((item) => ({x: item.x + dx, y: item.y + dy}))
  }
  canFall () {
    const newList = this._getNewList(0, -1)
    return newList.every(({x, y}) => {
      return y >= this.MIN_Y && !this.table[x][y]
    })
  }
  fall () {
    console.log('Fall')
    this.tetrimino.fall(-1)
  }
  move (direction) {
    const dx = direction === MoveDirections.Right ? 1 : -1
    const newList = this._getNewList(dx, 0)
    const canMove = newList.every(({x, y}) => x >= this.MIN_X && x <= this.MAX_X && !this.table[x][y])
    if (canMove) {
      console.log(`Move ${direction}`)
      this.tetrimino.move(dx)
    }
    return canMove;
  }
  canRotate (rotateList) {
    return rotateList.every(({x, y}) =>
      x >= this.MIN_X &&
      x <= this.MAX_X &&
      y >= this.MIN_Y &&
      !this.table[x][y])
  }
  rotate (direction) {
    const points = [
      TetriminoPoints.Point1,
      TetriminoPoints.Point2,
      TetriminoPoints.Point3,
      TetriminoPoints.Point4,
      TetriminoPoints.Point5
    ]
    for (let point of points) {
      const rotateList = this.tetrimino.getRotateList(direction, point)
      if (this.canRotate(rotateList)) {
        console.log(`Rotate ${direction}`)
        this.tetrimino.rotate(direction, point)
        return true
      }
    }
    return false;
  }
  hardDrop () {
    const dy = Math.min(...this._getList().map(({x, y}) => {
      const col = this.table[x]
      let dy = 0
      y -= 1
      while (y >= this.MIN_Y && !col[y]) {
        dy += 1
        y -= 1
      }
      return dy
    }))
    console.log('dy', dy)
    this.tetrimino.fall(-dy)
  }
  getSnapshot () {
    const snapshot = []
    const list = this._getList()
    // console.log(list)
    for (let y = this.MIN_Y; y <= this.MAX_Y; y += 1) {
      const row = []
      for (let x = this.MIN_X; x <= this.MAX_X; x += 1) {
        let bit = 0
        if (this.table[x][y]) {
          // 固定的方块占位
          bit = 1
        } else if (list.some(({x: x1, y: y1}) => x1 === x && y1 === y)) {
          // 在移动中的方块
          bit = 2
        }
        row.push({
          bit: bit,
          x: x,
          y: y
        })
      }
      snapshot.push(row)
    }
    return snapshot
  }
  getHitList () {
    const list = this._getList()
    const ySet = new Set()
    list.forEach(({x, y}) => {
      ySet.add(y)
      this.table[x][y] = true
    })
    const hitList = []
    const realTable = this.table.slice(this.MIN_X, this.MAX_X + 1)
    for (let y of ySet) {
      if (realTable.every((col) => col[y])) {
        hitList.push(y)
      }
    }
    return hitList.sort()
  }
  clear (hitList) {
    if (hitList.length <= 0) {
      return
    }
    this.table = this.table.map((col) => {
      const newCol = []
      for (let i = 0, len = hitList.length; i < len; i += 1) {
        if (i === 0) {
          newCol.push(...col.slice(0, hitList[i]))
        }
        newCol.push(...col.slice(hitList[i] + 1, hitList[i + 1]))
      }
      return newCol
    })
  }
  getIsOver () {
    for (let col of this.table) {
      if (col[this.MAX_Y] || col[this.MAX_Y - 1]) {
        return true
      }
    }
  }
}

class TetrisEngine {
  constructor () {
    this.init()
    document.addEventListener('keydown', ({ code }) => {
      switch (code) {
        case 'ArrowDown':
          if (this.phase === Phases.Falling) {
            console.log('down')
            this.switchFall(this.softDropSpeed)
          }
          break
        case 'Space':
          if (this.phase === Phases.Falling || this.phase === Phases.Lock) {
            this.switchHardDrop()
          }
          break
        case 'ArrowLeft':
          if (this.phase === Phases.Falling || this.phase === Phases.Lock) {
            this.doMove(MoveDirections.Left)
          }
          break
        case 'ArrowRight':
          if (this.phase === Phases.Falling || this.phase === Phases.Lock) {
            this.doMove(MoveDirections.Right)
          }
          break
        case 'ArrowUp':
          if (this.phase === Phases.Falling || this.phase === Phases.Lock) {
            this.doRotate(RotateDirections.Clockwise)
          }
          break
        case 'KeyZ':
          if (this.phase === Phases.Falling || this.phase === Phases.Lock) {
            this.doRotate(RotateDirections.Counterclockwise)
          }
          break
        case 'Escape':
          this.pauseOrResume()
          break
      }
    })
    document.addEventListener('keyup', ({ code }) => {
      if (code === 'ArrowDown') {
        if (this.phase === Phases.Falling) {
          this.switchFall(this.normallFallSpeed)
        }
      }
    })
    this.flushScreen()
    this.updateInfo()
    this.phase = Phases.Pause
  }
  init () {
    this.queue = new Queue()
    this.matrix = new Matrix()
    this.level = 1
    this.clearedLines = 0
    this.hardDropSpeed = 0.0001 * 1000
    this.lockDelay = 0.5 * 1000
    this.score = 0
    this.upgrade(this.level)
  }
  upgrade (level) {
    this.normallFallSpeed = Math.pow(0.8 - 0.007 * (level - 1), level - 1) * 1000
    this.softDropSpeed = this.normallFallSpeed / 20
  }
  flushMatrix (ctx, list, A) {
    for (let y = 0; y < list.length; y += 1) {
      for (let x = 0; x < list[y].length; x += 1) {
        const info = list[y][x]
        const x0 = (info.x - 1) * A + A / 2
        const y0 = (22 - info.y) * A + A / 2
        if ((info.bit === 1 || info.bit === 2) && info.y <= 20) {
          ctx.fillStyle = info.bit === 2 ? 'black' : 'gray'
          ctx.fillRect(x0 - A * 0.4, y0 - A * 0.4, A - 2, A - 2)
        }
      }
    }
  }
  flushScreen () {
    const canvas = document.getElementById('matrix')
    const A = 20
    const a = 10
    const b = 22
    canvas.width = a * A
    canvas.height = b * A
    const ctx = canvas.getContext('2d');
    this.autoRefresh(ctx, a, b, A, canvas.width, canvas.height)
  }
  autoRefresh (ctx, a, b, A, width, height) {
    requestAnimationFrame(() => {
      this.updateInfo()

      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = 'lightgray'
      ctx.beginPath()
      for (let y = 2; y < b; y += 1) {
        for (let x = 0; x < a; x += 1) {
          ctx.rect(x * A, y * A, A, A)
        }
      }
      ctx.closePath()
      ctx.stroke()
      this.flushMatrix(ctx, this.matrix.getSnapshot(), A)
      this.autoRefresh(ctx, a, b, A, width, height)
    })
  }
  doMove (direction) {
    if (this.matrix.move(direction)) {
      if (this.phase === Phases.Lock) {
        console.log('clear lock timer')
        clearTimeout(this.lockTimer)
        if (this.matrix.canFall()) {
          this.goFallingPhase()
        } else {
          this.goLockPhase()
        }
      }
    }
  }
  doRotate (direction) {
    if (this.matrix.rotate(direction)) {
      if (this.phase === Phases.Lock) {
        console.log('clear lock timer')
        clearTimeout(this.lockTimer)
        if (this.matrix.canFall()) {
          this.goFallingPhase()
        } else {
          this.goLockPhase()
        }
      }
    }
  }
  pauseOrResume () {
    if (this.phase === Phases.Pause) {
      if (this.prevPhase === Phases.Falling) {
        this.goFallingPhase(this.prevDelay)
      } else if (this.prevPhase === Phases.Lock) {
        this.goLockPhase(false, this.prevDelay)
      } else {
        this.goGenerationPhase()
      }
    } else if (this.phase === Phases.Over || this.phase === Phases.Success) {
      this.init()
      this.goGenerationPhase()
    } else {
      console.log('Pause')
      this.prevPhase = this.phase
      this.phase = Phases.Pause
      if (this.prevPhase === Phases.Falling) {
        clearTimeout(this.fallTimer)
        this.prevDelay = Date.now() - this.fallStartTime
      } else if (this.prevPhase === Phases.Lock) {
        clearTimeout(this.lockTimer)
        this.prevDelay = Date.now() - this.lockStartTime
      }
    }
  }
  goGenerationPhase () {
    this.phase = Phases.Generation
    // 1. 0.2秒内生成新的方块
    // 2. 确定方块掉落的位置（Point 1在坐标 (5, 21)）
    // 3. 立刻向下掉落一格
    // 4. goFallingPhase
    this.tetrimino = new Tetrimino(
      this.queue.getNext(),
      TetriminoFacings.North,
      5, 21
    )
    this.matrix.setTetrimino(this.tetrimino)
    if (this.matrix.canFall()) {
      this.matrix.fall()
    }
    this.goFallingPhase()
  }
  goFallingPhase (prevDelay = 0) {
    // 可以 移动、旋转、软着陆、硬着陆，根据速度自动掉落
    // 到达一个平面后，goLockPhase
    this.phase = Phases.Falling
    this.fallStartTime = Date.now() - prevDelay
    this.switchFall(this.normallFallSpeed)
  }
  fallLoop () {
    if (!this.matrix.canFall()) {
      this.goLockPhase(false)
    } else {
      this.matrix.fall()
      if (!this.matrix.canFall()) {
        this.goLockPhase(false)
        return
      }
      console.log('start fall timer')
      this.fallStartTime = Date.now()
      this.fallTimer = setTimeout(() => {
        this.fallLoop()
      }, this.fallSpeed)
    }
  }
  switchFall (speed) {
    this.fallSpeed = speed
    clearTimeout(this.fallTimer)
    const t = Date.now() - this.fallStartTime
    let delay = this.fallSpeed
    if (t >= delay) {
      if (!this.matrix.canFall()) {
        this.goLockPhase(false)
        return;
      } else {
        this.matrix.fall()
        if (!this.matrix.canFall()) {
          this.goLockPhase(false)
          return
        }
      }
    } else {
      delay -= t
    }
    this.fallStartTime = Date.now()
    console.log('start fall timer')
    this.fallTimer = setTimeout(() => {
      this.fallLoop()
    }, delay)
  }
  switchHardDrop () {
    clearTimeout(this.fallTimer)
    clearTimeout(this.lockTimer)
    this.matrix.hardDrop()
    this.goLockPhase(true)
  }
  goLockPhase (isHardDrop, prevDelay = 0) {
    this.phase = Phases.Lock
    // 1. 如果是硬着陆，立刻goPatternPhase
    // 2. 如果是正常掉落到一个表面，则0.5秒后锁定。注意移动或者旋转会导致定时器重新计时
    // 3. 如果移动或旋转后方块可以往下掉落，则goFallingPhase
    // 4. 锁定之后，goPatternPhase
    if (isHardDrop) {
      this.goPatternPhase()
    } else {
      console.log('start lock timer')
      this.lockStartTime = Date.now() - prevDelay
      this.lockTimer = setTimeout(() => {
        this.goPatternPhase()
      }, this.lockDelay)
    }
  }
  goPatternPhase () {
    this.phase = Phases.Pattern
    // 1. 确定哪几行可以清除 goIteratePhase
    // 2. 确定游戏是否结束
    this.hitList = this.matrix.getHitList()
    this.isOver = this.matrix.getIsOver()
    this.goIteratePhase()
  }
  goIteratePhase () {
    this.phase = Phases.Iterate
    // nothing todo
    // goAnimatePhase
    this.goAnimatePhase()
  }
  goAnimatePhase () {
    this.phase = Phases.Animate
    // nothing todo
    // goEliminatePhase
    this.goEliminatePhase()
  }
  goEliminatePhase () {
    this.phase = Phases.Eliminate
    this.matrix.clear(this.hitList)
    this.goCompletionPhase()
    // 清除table中可以清除的行
    // goCompletionPhase
  }
  goCompletionPhase () {
    this.phase = Phases.Completion
    if (this.isOver) {
      this.phase = Phases.Over
      console.log('游戏失败')
      return
    }
    const scores = [0, 100, 300, 500, 800]
    const clearedCount = this.hitList.length
    this.clearedLines += clearedCount
    this.score += scores[clearedCount] * this.level
    if (this.clearedLines >= 10 * this.level) {
      if (this.level < 15) {
        this.level += 1
        this.upgrade(this.level)
        this.goGenerationPhase()
      } else {
        this.phase = Phases.Success
        console.log('游戏完成')
      }
    } else {
      this.goGenerationPhase()
    }
    // 1. 计算分数
    // 2. 确定是否升级等级，进而影响速度
    // 3. 如果还没有结束，则goGenerationPhase
  }
  updateInfo () {
    const info = document.getElementById('info')
    info.innerText = `level: ${this.level}\nscore: ${this.score}\nclearedLines: ${this.clearedLines}\nspeed: ${this.normallFallSpeed/1000}s\nphase: ${this.phase}\nnextQueue: ${this.queue.getNextQueue().join(', ')}`
  }
}

export {
  TetriminoTypes,
  TetriminoFacings,
  TetriminoPoints,
  RotateDirections,
  MoveDirections,
  Matrix,
  Tetrimino,
  Queue,

  TetrisEngine
}
