// this is an extension and adjustment of the monsterMash branch of this repo. There are more comments on the monsterMash branch, explaining some of the lines in this branch.
// this incorporates smoother movement, and a more open ended collision detection function, as well as a second enemy.

// ////// RULES FOR DEVELOPING THE GAME //////////
// we need two entities, a hero and an ogre
// the hero should be moveable with the WASD or arrow keys
// the ogre should be stationary
// the hero and first ogre should be able to collide to make something happen
// when the hero and ogre1 collide, the ogre is removed from the canvas, and a second ogre appears
// when hero and ogre2 collide, the game stops, and sends a message to our user that they have won.
// ////////////// END RULES ////////////////////////////////


// first we need to grab our elements so we can make them do stuff
const game = document.getElementById('canvas')
const movement = document.getElementById('movement')
const message = document.getElementById('status')

// we need to set the game's context to be 2d
const ctx = game.getContext('2d')

game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

// we're now diverging, and making a different class for each type of entity. One for our hero, one for our Ogres+
// class for our ogre
class Ogre {
    constructor(x, y, color, width, height, alive) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.alive = alive,
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}
// class for our hero
class Hero {
    constructor(x, y, color, width, height) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.alive = true,
        // we need two additional properties in order to make our hero move around a little smoother.
        this.speed = 15,
        // because we're going to rework our movement handler, we need directions, set to be different values that we can update with a keypress
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false
        },
        // we need two key based functions here that will change our hero's movement direction
        // this time, we'll only use WASD keys(purely for the sake of time)
        // setDirection will be tied to a keyDown event
        this.setDirection = function (key) {
            console.log('this is the key that was pressed', key)
            if (key.toLowerCase() == 'w') { this.direction.up = true }
            if (key.toLowerCase() == 'a') { this.direction.left = true }
            if (key.toLowerCase() == 's') { this.direction.down = true }
            if (key.toLowerCase() == 'd') { this.direction.right = true }
        },
        // unsetDirection will be tied to a keyUp event
        this.unsetDirection = function (key) {
            console.log('this is the key that was released', key)
            if (key.toLowerCase() == 'w') { this.direction.up = false }
            if (key.toLowerCase() == 'a') { this.direction.left = false }
            if (key.toLowerCase() == 's') { this.direction.down = false }
            if (key.toLowerCase() == 'd') { this.direction.right = false }
        },
        // we're also adding a movePlayer function that is tied to our directions
        this.movePlayer = function () {
            // movePlayer, sends our guy flying in whatever direction is true
            if (this.direction.up) {
                this.y -= this.speed
                // while we're tracking movement, let's stop our hero from exiting the top of the screen
                if (this.y <= 0) {
                    this.y = 0
                }
            }
            if (this.direction.left) {
                this.x -= this.speed
                // while we're tracking movement, let's stop our hero from exiting the top of the screen
                if (this.x <= 0) {
                    this.x = 0
                }
            }
            if (this.direction.down) {
                this.y += this.speed
                // while we're tracking movement, let's stop our hero from exiting the top of the screen
                // for down, and right, we need the entire character for our detection of the wall, as well as the canvas width and height
                if (this.y + this.height >= game.height) {
                    this.y = game.height - this.height
                }
            }
            if (this.direction.right) {
                this.x += this.speed
                // while we're tracking movement, let's stop our hero from exiting the top of the screen
                // for down, and right, we need the entire character for our detection of the wall, as well as the canvas width and height
                if (this.x + this.width >= game.width) {
                    this.x = game.width - this.width
                }
            }
        },
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

// places ogres at random spots in the horizontal direction
const randomPlaceShrekX = (max) => {
    // we can use math random and canvas dimensions for this
    return Math.floor(Math.random() * max)
}

const player = new Hero(10, 10, 'lightsteelblue', 16, 16)
const ogre = new Ogre(200, 50, '#bada55', 32, 48, true)
const ogreTwo = new Ogre(randomPlaceShrekX(game.width), 50, 'red', 64, 96, true)

// function that changes the player's direction
document.addEventListener('keydown', (e) => {
    // when a key is pressed, call the setDirection method
    player.setDirection(e.key)
})
// function that stops player from going in specific direction
document.addEventListener('keyup', (e) => {
    // when a key is pressed, call the setDirection method
    if (['w', 'a', 's', 'd'].includes(e.key)) {
        player.unsetDirection(e.key)
    }
})

// detect when player has hit anything
const detectHit = (thing) => {
    // we're basically using one big if statement to cover all our bases
    // that means judging the player and ogre's x, y, width and height values
    if(player.x < thing.x + thing.width 
        && player.x + player.width > thing.x
        && player.y < thing.y + thing.height
        && player.y + player.height > thing.y) {
            thing.alive = false
        }
}

// we're going to set up a gameLoop function
// this will be attached to an interval
// this is how we will create animation in our canvas

const gameLoop = () => {
    // make sure you don't have any console.logs in here
    // console.log('frame running')
    ctx.clearRect(0, 0, game.width, game.height)

    if (ogre.alive) {
        ogre.render()
        detectHit(ogre)
    } else if (ogreTwo.alive) {
        message.textContent = 'Now kill the other ogre!'
        ogreTwo.render()
        detectHit(ogreTwo)
    } else {
        stopGameLoop()
        message.textContent = 'You win!'
    }
    

    movement.textContent = player.x + ", " + player.y
    player.render()
    player.movePlayer()
}
// used to render the game every 60 ms
const gameInterval = setInterval(gameLoop, 60)
// used to stop the game when the condition to do so is met
const stopGameLoop = () => {clearInterval(gameInterval)}

document.addEventListener('DOMContentLoaded', function () {
    // calls the game loop and runs the interval 
    gameInterval
})