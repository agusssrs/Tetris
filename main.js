import './style.css'
import { boardHeight, boardWidth, blockSize } from './consts'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('span')


let score = 0;

canvas.width = blockSize * boardWidth;
canvas.height = blockSize * boardHeight;

context.scale(blockSize, blockSize)


// board
const board = createBoard(boardWidth, boardHeight)

function createBoard (width, height) {
  return Array(height).fill().map(() => Array(width).fill(0))
}

// pieza
const piece = {
  position: {x: 5, y: 5},
  shape: [
    [1, 1],
    [1, 1]
  ]
}

// random pieces
const pieces = [
  [
    [1, 1],
    [1, 1]
  ],
  [
  
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [    
    [1, 0],
    [1, 1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1]
  ]
]

// game loop
// function update() {
//   draw();
//   window.requestAnimationFrame(update);
// }

// autodrop
let dropCounter = 0
let lastTime = 0

function update (time = 0) {
  const deltaTime = time - lastTime

  lastTime = time
  
  dropCounter += deltaTime

  if (dropCounter > 600) {
    piece.position.y++
    dropCounter = 0
  }

  if (checkCollision()) {
    piece.position.y--
    solidifyPiece()
    removeRows()
  }

  draw()
  window.requestAnimationFrame(update);
}

function draw () {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = 'red'
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1 )
      }
    })
  })

  $score.innerText = score
}

document.addEventListener('keydown', event => {
  if (event.key === 'a') {
    piece.position.x--
    
    if(checkCollision()) {
      piece.position.x++
    }     
  }

  if (event.key === 'd') {
    piece.position.x++
    if (checkCollision()) {
      piece.position.x--
    }
  }

  if (event.key === 's') {
    piece.position.y++
    if (checkCollision()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  if (event.key === 'w') {
    const rotate = []

    for (let i = 0; i < piece.shape[0].length; i++){
      const row = []

      for (let j = piece.shape.length - 1; j >= 0;  j--){
        row.push(piece.shape[j][i])
      }

      rotate.push(row)
    }

    const previousShape = piece.shape
    piece.shape = rotate
    if (checkCollision( )) {
      piece.shape = previousShape
    }
  }
});

function checkCollision(){
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}

function solidifyPiece () {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][ x + piece.position.x] = 1
      }
    })
  })

  // reset position
  piece.position.x = Math.floor(boardWidth / 2 - 2)
  piece.position.y = 0

  // get random shape
  piece.shape = pieces[Math.floor(Math.random() * pieces.length)]

  // game over
  if (checkCollision()) {
    window.alert('Perdiste 🤣🤣')
    board.forEach((row) => row.fill(0))
  }
}

function removeRows () {
  const rowsToRemove = []
  board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(boardWidth).fill(0)
    board.unshift(newRow)
    score += 10;
  })
}

update();

