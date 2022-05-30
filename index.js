let character = document.querySelector('.character')
let map = document.querySelector('.map')
let foreground = document.querySelector('.foreground')

let pixelSize = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue('--pixel-size')
)

let held_directions = []
let speed = 1

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

class Boundary {
  static width = 48
  static height = 48
  constructor ({ position }) {
    this.position = position
    this.width = 48
    this.height = 48
  }

  draw () {
    c.fillStyle = 'rgba(255, 0, 0, 0)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

const boundaries = []
const player = {
  position: {
    x: 930,
    y: 550
  },
  width: 30,
  height: 36
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width,
            y: i * Boundary.height - 10
          }
        })
      )
  })
})

// for (let i = 0; i < boundaries.length; i++) {
//   const boundary = boundaries[i]
//   let divWall = document.createElement('div')
//   divWall.classList.add('collision')
//   divWall.style.left = `${boundary.position.x}px`
//   divWall.style.top = `${boundary.position.y + 10}px`
//   map.appendChild(divWall)
// }

function collision (wall) {
  let distX =
    player.position.x * 2 +
    player.width / 2 -
    (wall.position.x + wall.width / 2)
  let distY =
    player.position.y * 2 +
    player.width / 2 -
    (wall.position.y + wall.width / 2)
  let sumWidth = (player.width + wall.width) / 2
  let sumheight = (player.height + wall.height) / 2

  if (Math.abs(distX) < sumWidth && Math.abs(distY) < sumheight) {
    let overX = sumWidth - Math.abs(distX)
    let overY = sumheight - Math.abs(distY)

    if (overX > overY) {
      if (distY > 0) {
        player.position.y += 1
      } else {
        player.position.y -= 1
      }
    } else {
      if (distX > 0) {
        player.position.x += 1
      } else {
        player.position.x -= 1
      }
    }
  }
}

const placeCharacter = () => {
  const held_direction = held_directions[0]
  if (held_direction) {
    if (held_direction === directions.right) {
      player.position.x += speed
    }
    if (held_direction === directions.left) {
      player.position.x -= speed
    }
    if (held_direction === directions.down) {
      player.position.y += speed
    }
    if (held_direction === directions.up) {
      player.position.y -= speed
    }
    character.setAttribute('facing', held_direction)
  }
  character.setAttribute('walking', held_direction ? 'true' : 'false')

  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i]
    collision(boundary)
  }

  let camera_left = pixelSize * 68
  let camera_top = pixelSize * 42

  map.style.transform = `translate3d( ${-player.position.x * pixelSize +
    camera_left}px, ${-player.position.y * pixelSize + camera_top}px, 0 )`
  character.style.transform = `translate3d( ${player.position.x *
    pixelSize}px, ${player.position.y * pixelSize}px, 0 )`

  foreground.style.transform = `translate3d( ${-player.position.x * pixelSize +
    camera_left}px, ${-player.position.y * pixelSize + camera_top}px, 0 )`
  character.style.transform = `translate3d( ${player.position.x *
    pixelSize}px, ${player.position.y * pixelSize}px, 0 )`
}

//Set up the game loop
const step = () => {
  placeCharacter()

  window.requestAnimationFrame(() => {
    step()
  })
}
step()

/* Direction key state */
const directions = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right'
}
const keys = {
  38: directions.up,
  37: directions.left,
  39: directions.right,
  40: directions.down
}
document.addEventListener('keydown', e => {
  let dir = keys[e.which]
  if (dir && held_directions.indexOf(dir) === -1) {
    held_directions.unshift(dir)
  }
})

document.addEventListener('keyup', e => {
  let dir = keys[e.which]
  let index = held_directions.indexOf(dir)
  if (index > -1) {
    held_directions.splice(index, 1)
  }
})
