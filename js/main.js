// this is so we can refer to them later
const game = document.getElementById('canvas')
const movement = document.getElementById('movement')

// we also need to define our game context
const ctx = game.getContext('2d')

game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

console.log('this is the canvas width', game.width)
console.log('this is the canvas height', game.height)

// to instantiate instances of classes, or as we call them, objects
// we call the class method with a very specific syntax

class OgreCrawler {
    constructor(x, y, color, width, height, type) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.height = height,
        this.width = width,
        this.type = type,
        this.alive = true
    }

    render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// HeroCrawler will need a few additional properties in order for movement to be smooooooooooooooooth
class HeroCrawler {
    constructor(x, y, color, width, height) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.alive = true,
        // two additional properties related to smooth movement
        this.speed = 15,
        // smooth animation works a lil differently than what we saw before
        // the way this animation works, is putting our character in constant motion, but freezing their position
        // that way, we just 'decide' the direction and can unfreeze their position based on keypress input. We'll call this 'setting the direction'
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false
        }
    }
    // this is where we'll add our methods, all of these pertain to smoothing out our player's movement
    // setDirection tells player which way to move -ex changes up to true
    // this will be our keydown event
    setDirection = function (key) {
        console.log('this is the key that was pressed', key)
        if (key.toLowerCase() == 'w') { this.direction.up = true }
        if (key.toLowerCase() == 'a') { this.direction.left = true }
        if (key.toLowerCase() == 's') { this.direction.down = true }
        if (key.toLowerCase() == 'd') { this.direction.right = true }
    }
    // unSetDirection -> ex changes our direction back to false
    // this will be our keyup event
    unSetDirection = function (key) {
        console.log('this is the key that was pressed', key)
        if (key.toLowerCase() == 'w') { this.direction.up = false }
        if (key.toLowerCase() == 'a') { this.direction.left = false }
        if (key.toLowerCase() == 's') { this.direction.down = false }
        if (key.toLowerCase() == 'd') { this.direction.right = false }
    }
    movePlayer = function () {
        // move player looks at the direction, and sends the guy flying in whatever direction is true
        if (this.direction.up) {
            this.y -= this.speed
            // bc we're tracking up movement, let's stop our player
            // from exiting the top of the canvas
            if (this.y <= 0) {
                this.y = 0
            }
        }
        if (this.direction.left) {
            this.x -= this.speed
            // bc we're tracking the left moves, stop him at left edge
            if (this.x <= 0) {
                this.x = 0
            }
        }
        if (this.direction.down) {
            this.y += this.speed

            // this tracks down movement, so we need to consider the height
            if (this.y + this.height >= game.height) {
                this.y = game.height - this.height
            }
        }
        if (this.direction.right) {
            this.x += this.speed

            // this tracks right movement, so we need to consider the width
            if (this.x + this.width >= game.width) {
                this.x = game.width - this.width
            }
        }
    }
    // we'll keep our render method nice and simple, and keep it at the bottom of our class.
    render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const randomPlaceShrekX = (max) => {
    // we use this func to produce a random x coord for shrek 2
    return Math.floor(Math.random() * max)
}

let player = new HeroCrawler(10, 10, 'lightsteelblue', 16, 16)
let ogre = new OgreCrawler(200, 50, '#bada55', 32, 48, 'ogre')
let ogreTwo = new OgreCrawler(randomPlaceShrekX(game.width), 50, 'red', 64, 96, 'big ogre')

// The gameLoop function will be what helps us create an animation effect
// it also allows us to say what happens when and control those events to our liking.
// this is how we utilize movement

const gameLoop = () => {
    ctx.clearRect(0, 0, game.width, game.height)
    
    movement.textContent = player.x + ', ' + player.y
    
    // if ogre is alive, render and detect hit
    // if first ogre croaks, render the next one
    if (ogre.alive) {
        ogre.render()
        detectHit(ogre)
    } else if (ogreTwo.alive) {
        document.querySelector('#status').textContent = 'Now Kill Shrek 2!'
        ogreTwo.render()
        detectHit(ogreTwo)
    } else {
        stopGameLoop()
        document.querySelector('#status').textContent = 'You Win!'
    }

    player.render()
    player.movePlayer()
}

let gameInterval = setInterval(gameLoop, 60)

const stopGameLoop = () => {clearInterval(gameInterval)}
// we're going to use setInterval to repeat our game loop function at specific times
// we're going to do this, when the content loads
document.addEventListener('DOMContentLoaded', function () {
    // this starts the game when the content is loaded
    gameInterval
})

// two new event handlers are needed, one for keyup and one for keydown
document.addEventListener('keydown', (e) => {
    // when the key is down, set the direction according to our
    // player.setDirection method
    player.setDirection(e.key)
})

document.addEventListener('keyup', (e) => {
    // this one will look a lil different than keydown
    // we need to make sure it only applies to the keys we listed in unSetDirection
    if (['w', 'a', 's', 'd'].includes(e.key)) {
        player.unSetDirection(e.key)
    }
})


// to detect a collision between different objects
// we can give our function a parameter, and pass an argument every time it's called
const detectHit = (thing) => {
    // if detect hit happens, remove ogre.attackpoints from player.hp
    // move player to certain spot to simulate knockback
    // we'll use one big if statement that clearly defines any moment of collision.
    // that means utilizing, x, y, width and height of our objects
    if (player.x < thing.x + thing.width
        && player.x + player.width > thing.x
        && player.y < thing.y + thing.height
        && player.y + player.height > thing.y) {
            // console.log('we have a hit')
            thing.alive = false
        }
}