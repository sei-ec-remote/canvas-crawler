// here, we're saving the canvas and the positioning message
// so we can refer to them later
const game = document.getElementById('canvas')
const movement = document.getElementById('movement')

// we need to get the game's context, which will allows to specify where to put things and how big to make them
const ctx = game.getContext('2d')

// now we can set some attributes to our game,
// to set height and width based on COMPUTED STYLE
// basically it means reading how it's displaying in the current state in the browser.
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

// because our crawlers will be basically the same, we're going to build them using a class
// we could use the class syntax with a constructor
// or we can use a function that will do the same thing
class Crawler {
    constructor(x, y, color, height, width) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.height = height,
        this.width = width,
        this.alive = true,
        this.render = function () {
            // ctx.fillStyle will determine the color(or style) of your element
            ctx.fillStyle = this.color
            // ctx.fillRect will draw a rectangle on the canvas
            ctx.fillRect(this.x, this.y, this.height, this.width)
        }
    }
}

// You could also use this function syntax, to create objects
// function Crawler(x, y, color, height, width) {
// 	this.x = x
// 	this.y = y
// 	this.color = color
// 	this.height = height
// 	this.width = width
// 	this.alive = true
// 	this.render = function () {
// 		ctx.fillStyle = this.color
// 		ctx.fillRect(this.x, this.y, this.height, this.width)
// 	}
// }

let player = new Crawler(10, 10, 'blue', 16, 16)
let ogre = new Crawler(200, 50, 'lightgreen', 32, 48)

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('keydown', movementHandler)
    setInterval(gameLoop, 60)
})

// the gameloop function will be part of what allows us to control what happens and when
// the gameloop function is also going to be how we utilize movement
const gameLoop = () => {
    // the 'win' condition of our game, is to kill shrek
    // if our ogre is alive, then the game can continue
    // otherwise, the game will end.
    if (ogre.alive) {
        // this is where we will do 'collision detection'
        detectHit()
    }
    // we use clear rect because we're looping, and we want to clear out the old rendering
    ctx.clearRect(0, 0, game.width, game.height)
    movement.textContent = player.x + ', ' + player.y
    player.render()
    if (ogre.alive) {
        ogre.render()
    }
}

// this function is going to be how we move our player around
// here 'e' is referring to the event
const movementHandler = (e) => {
    // we can use if...else and keycodes to determine player movement
    // keycodes refer to specific keyboard keys with a number
    // if we want to use WASD the key codes are as follows:
    // w=87, a=65, s=83, d=68
    // up=38, down=40, left=37, right=39
    // we can also use a switch case which can be handy when we have multiple possibilities
    // switch case has a main switch, cases(which are our inputs in this instance)
    // we also need to break out of our cases, using the keyword break
    switch (e.keyCode) {
        case (87):
            // we'll move the player up
            player.y -= 10
            // then break the case
            break
        case (65):
            // move the player left
            player.x -= 10
            break
        case (83):
            // move player down
            player.y += 10
            break
        case (68):
            // move the player right
            player.x += 10
            break
    }
}

// to detect collision between elements in our canvas
// we need to refer to their size and shape to make a 'realistic' event happen
// here is our collision detection function detectHit()
const detectHit = () => {
    // we need an if statement that clearly defines the moment of collision
    // that means utilizing the x,y, width, and height of whatever we're detecting
    if (player.x < ogre.x + ogre.width
        && player.x + player.width > ogre.x
        && player.y < ogre.y + ogre.height
        && player.y + player.height > ogre.y) {
            ogre.alive = false
            document.getElementById('status').textContent = 'You win!'
        }
}
