// This is an extension/refactoring of the fruitcakes branch of this repo.
// more notes and comments are in the code on that branch.
// this version incorporates smoother movement, and a more open ended collision detection
// this also has a second enemy to face, which creates a new win condition(kill two ogres)

// requirements and goals 
// make a simple crawler game using canvas that we manipulate in js

// ///////// RULES FOR THE GAME ////////////
// we need two entities, a hero and an ogre
// the hero should move with the WASD or ARROW keys(display hero coords)
// the ogre(for now) will be stationary
// the hero and the first ogre should be able to collide to make something happen
// when the hero collides with the first ogre, ogre 1 is removed from the screen, and ogre 2 appears
// after hitting ogre 2, the game stops, and sends a message to the user that they have won.
// ////////////// END RULES /////////////////

//////////// INITIAL SETUP /////////////////////

// first we grab our HTML elements for easy reference later
const game = document.getElementById('canvas')
const movement = document.getElementById('movement')
const message = document.getElementById('status')

// if we want to test if we got the right elements, you can do this:
// movement.innerText = 'some stuff'

// we need to SET the game's context to be 2d
// we also want to save that context to a variable for reference later
// this is how we tell code to work within the context of the canvas
const ctx = game.getContext('2d')

// console.log('game before setting w and H', game)

// one thing we need to do, is get the computed size of our canvas
// then we save that attribute to our canvas so we can refer to it later
// once we have the exact size of our canvas, we can use those dimensions to simulate movement in interesting ways.
// these two lines will set the width and height attributes according to the way they look in your browser at the time the code runs
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])
game.height = 360


//////////// CRAWLER CLASS /////////////////////
// Since these two objects are basically the same, we can create a class to keep our code dry.
class Ogre {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.alive = true
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

class Hero {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.alive = true
        // we need additional props on our hero class to make movement smoother
        this.speed = 15
        // now we'll add direction, which will be set with our move handler
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        // two other methods, tied to key events
        // one sets the direction, which sends our hero flying in that direction
        this.setDirection = function (key) {
            console.log('this is the key in setDirection', key)
            if (key.toLowerCase() == 'w') { this.direction.up = true }
            if (key.toLowerCase() == 'a') { this.direction.left = true }
            if (key.toLowerCase() == 's') { this.direction.down = true }
            if (key.toLowerCase() == 'd') { this.direction.right = true }
        }
        // the other unsets a direction, which stops our hero from moving in that dir
        this.unsetDirection = function (key) {
            console.log('this is the key in unsetDirection', key)
            if (key.toLowerCase() == 'w') { this.direction.up = false }
            if (key.toLowerCase() == 'a') { this.direction.left = false }
            if (key.toLowerCase() == 's') { this.direction.down = false }
            if (key.toLowerCase() == 'd') { this.direction.right = false }
        }
        // this is our new movementHandler, we'll get rid of the old one
        // this will allow us to use the direction property on our hero object
        this.movePlayer = function () {
            // send our guy flyin in whatever direction is true
            if (this.direction.up) {
                this.y -= this.speed
                // while we're tracking movement, lets wall off the sides of the canvas
                if (this.y <= 0) {
                    this.y = 0
                }
            }
            if (this.direction.left) {
                this.x -= this.speed
                if (this.x <= 0) {
                    this.x = 0
                }
            }
            if (this.direction.down) {
                this.y += this.speed
                // to stop down and right directions, we again need to account for the size of our player
                if (this.y + this.height >= game.height) {
                    this.y = game.height - this.height
                }
            }
            if (this.direction.right) {
                this.x += this.speed
                if (this.x + this.width >= game.width) {
                    this.x = game.width - this.width
                }
            }
        }

        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

const player = new Hero(10, 10, 16, 16, 'lightsteelblue')
const ogre = new Ogre(200, 50, 32, 48, '#bada55')

// player.render()
// ogre.render()

// MOVEMENT HANDLING KEY EVENTS

//////////// COLLISION DETECTION /////////////////////
// here, we'll detect a hit between entities
// to accurately do this, we need to account for the entire space that one entity takes up.
// this means using the player x, y, width and height
// this also means using the ogre x, y, w, h
const detectHit = () => {
    // we'll basically use a big if statement, to be able to tell if any of the sides
    // of our hero interact with any of the sides of our ogre
    if (player.x < ogre.x + ogre.width
        && player.x + player.width > ogre.x
        && player.y < ogre.y + ogre.height
        && player.y + player.height > ogre.y) {
            console.log('HIT!')
            // console.log('player x-> ', player.x)
            // console.log('player width-> ', player.x + player.width)
            // console.log('player y-> ', player.y)
            // console.log('player height-> ', player.y + player.height)
            // console.log('ogre x ->', ogre.x)
            // console.log('ogre x width ->', ogre.x + ogre.width)
            // console.log('ogre y ->', ogre.y)
            // console.log('ogre y height ->', ogre.y + ogre.height)
            ogre.alive = false
            message.textContent = 'You Win!'
        }
}


//////////// GAME LOOP /////////////////////
// we're going to set up a gameLoop function
// this will be attached to an interval
// this function will run every interval(amount of ms)
// this is how we will animate our game

const gameLoop = () => {
    // no console logs in here if you can avoid it
    // console.log('the game loop is running')
    // for testing, it's ok to add them, but final should not have any
    // putting our hit detection at the top so it takes precedence
    if (ogre.alive) {
        detectHit()
    }
    // to resemble movement, we should clear the old canvas every loop
    // then, instead of drawing a snake because it's maintaining all the old positions of our character
    // we'll just see our player square moving around
    ctx.clearRect(0, 0, game.width, game.height)

    
    if (ogre.alive) {
        ogre.render()
    }

    player.render()
    player.movePlayer()
    movement.textContent = `${player.x}, ${player.y}`
}

//////////// EVENT LISTENERS /////////////////////

// one key event for a keydown
// keydown will set a player's direction
document.addEventListener('keydown', (e) => {
    // when a key is pressed, set the appropriate direction
    player.setDirection(e.key)
})
// one key event for a keyup
// keyup, will unset a player's direction
document.addEventListener('keyup', (e) => {
    // when a key is released, call unsetDirection
    // this needs to be handled in a slightly different way
    if(['w', 'a', 's', 'd'].includes(e.key)) {
        player.unsetDirection(e.key)
    }
})

// here we'll add an event listener, when the DOMcontent loads, run the game on an interval
// eventually this event will have more in it.
document.addEventListener('DOMContentLoaded', function () {
    // here is our gameloop interval
    setInterval(gameLoop, 60)
})