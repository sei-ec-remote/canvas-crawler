// requirements and goals 
// make a simple crawler game using canvas that we manipulate in js

// we need two entities, a hero and an ogre
// the hero should move with the WASD or ARROW keys(display hero coords)
// the ogre(for now) will be stationary
// the hero and the ogre should be able to collide to make something happen
// when the hero collides with the ogre, ogre is removed from the screen, the game stops, and sends a message to the user that they have won.

//////////// INITIAL SETUP /////////////////////

// first we grab our HTML elements for easy reference later
const game = document.getElementById('canvas')
const movement = document.getElementById('movement')
const status = document.getElementById('status')

// if we want to test if we got the right elements, you can do this:
// movement.innerText = 'some stuff'
// status.innerText = 'whats up how are you'

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

// console.log('this is game after setting width and height')
// console.log(game)

// const hero = {
//     x: 10,
//     y: 10,
//     color: 'hotpink',
//     width: 20,
//     height: 20,
//     alive: true,
//     render: function () {
//         // we can use builtin canvas methods for drawing basic shapes
//         ctx.fillStyle = this.color
//         ctx.fillRect(this.x, this.y, this.width, this.height)
//     }
// }

// const ogre = {
//     x: 200,
//     y: 100,
//     color: "#bada55",
//     width: 60,
//     height: 120,
//     alive: true,
//     render: function () {
//         ctx.fillStyle = this.color
//         // this built in function creates a rectangle
//         // must pass the following args in the following order:
//         // x coord, y coord, width in px, height in px
//         ctx.fillRect(this.x, this.y, this.width, this.height)
//     }
// }

//////////// CRAWLER CLASS /////////////////////
// Since these two objects are basically the same, we can create a class to keep our code dry.
class Crawler {
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

const player = new Crawler(10, 10, 16, 16, 'lightsteelblue')
const ogre = new Crawler(200, 50, 32, 48, '#bada55')

// player.render()
// ogre.render()

//////////// MOVEMENT HANDLER /////////////////////
// our movement handler function tells our code how and when to move the player around
// this will be tied to an event listener for key events
const movementHandler = (e) => {
    // here the e is standing for 'event' -> specifically will be a keydown
    // we're going to use keyCodes to tell it to do different movements for diff keys
    // here are some basic key codes:
    // w = 87, a = 65, s = 83, d = 68
    // up = 38, left = 37, down = 40, right = 39
    // by linking these keycodes to a function(or codeblock)
    // we can tell them to change the player x or y values
    console.log('what the heck is e?\n', e.keyCode)
    // conditional statements if keycode === something do something if keycode === somethingElse do somethingElse
    // could build a giant if...else for this
    // im going to use switch case instead
    // switch is my condition, and it opens up for a multitude of cases
    switch (e.keyCode) {
        // move up
        case (87):
        case (38):
            // this moves player up 10px every press
            player.y -= 10
            // we need the break keyword so we can move to another case if necessary
            break
        // move left
        case (65):
        case (37):
            player.x -= 10
            break
        // move down
        case (83):
        case (40):
            player.y += 10
            break
        // move right
        case (68):
        case (39):
            player.x += 10
            break
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
    
    // to resemble movement, we should clear the old canvas every loop
    // then, instead of drawing a snake because it's maintaining all the old positions of our character
    // we'll just see our player square moving around
    ctx.clearRect(0, 0, game.width, game.height)

    player.render()
    movement.textContent = `${player.x}, ${player.y}`

    if (ogre.alive) {
        ogre.render()
    }
}

//////////// CONTENT LOADED EVENT LISTENER /////////////////////

// here we'll add an event listener, when the DOMcontent loads, run the game on an interval
// eventually this event will have more in it.
document.addEventListener('DOMContentLoaded', function () {
    // this is where I'll link up the movementHandler event
    document.addEventListener('keydown', movementHandler)
    // here is our gameloop interval
    setInterval(gameLoop, 60)
})