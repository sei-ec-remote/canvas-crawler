// first, we need to save the canvas and the positioning message area to variables
// this is so we can refer to them later
const game = document.getElementById('canvas')
const movement = document.getElementById('movement')

// we also need to define our game context
const ctx = game.getContext('2d')

// so, we have a variable height and width on our canvas, so we need to get that height and width as a reference point so we can do stuff with it later.
// for this, we'll use, the built in getComputedStyle function
// we'll use this along with setAttribute
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

console.log('this is the canvas width', game.width)
console.log('this is the canvas height', game.height)

// This is where we start using OOP principles
// OOP = Object Oriented Programming 
// Here lies an example of an object
// const someObject = {
//     name: 'object',
//     height: 50,
//     favoriteFood: 'donut',
//     alive: false,
//     friends: ['billy', 'cindy', 'captain hook'],
//     itemsInPocket: [
//         { name: 'phone', size: 'small' },
//         { name: 'lint', size: 'extra small' }
//     ]
// }

// Sometimes, we want to make a bunch of the same object, for this, we can use a class
// We're going to use a class to create items on our canvas
// This way, we can write DRY code, and create elements of different shapes and sizes
// classes all start with a capital letter

// Objects are made of properties(K:v pairs) and methods(functions)
class Crawler {
    // classes can ALSO have(and usually do) a constructor function
    // this is how we tell our class, exactly how we want to build our object.
    // This also allows us to use the keyword 'this' in reference to whatever object has been made by the class
    // attributes that are variable, go in the constructor function
    constructor(x, y, color, width, height) {
        // in here, this is how I define what my object will be made of
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        // anything that is going to be the same for all instances of the objects we create, we can hard set the value here and leave that out of the constructor's parameters.
        this.alive = true,
        // we can also add methods
        // in our case, the method is going to be render
        this.render = function () {
            // here, we will set the fillStyle and the fillRect
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

// to instantiate instances of classes, or as we call them, objects
// we call the class method with a very specific syntax
let player = new Crawler(10, 10, 'lightsteelblue', 16, 16)
let ogre = new Crawler(200, 50, '#bada55', 32, 48)


// The gameLoop function will be what helps us create an animation effect
// it also allows us to say what happens when and control those events to our liking.
// this is how we utilize movement

const gameLoop = () => {
    // make sure you dont have console logs in your game loop
    // console.log('frame running')
    // the 'win' condition of our game is to kill shrek
    // so if our ogre is alive, then the game can continue
    // if the ogre is deceased, the game will end
    if (ogre.alive) {
        detectHit()
    }
    // we need to render both of our objects, and we'll use their respective render methods to do this.
    // we will also, update our movement box with the coordinates of our player
    // and to create the illusion of movement, we need to clear the canvas every single 'frame' so that our hero's movement doesn't turn him into a snake.
    
    ctx.clearRect(0, 0, game.width, game.height)
    
    movement.textContent = player.x + ', ' + player.y
    player.render()
    
    if (ogre.alive) {
        ogre.render()
        // detectHit()
    }
}

// we're going to use setInterval to repeat our game loop function at specific times
// we're going to do this, when the content loads
document.addEventListener('DOMContentLoaded', function () {
    // in here, we need to have our movement handler
    document.addEventListener('keydown', movementHandler)
    // we also need our game loop running at an interval
    setInterval(gameLoop, 60)
})

// this function is going to be how we move our player around
// we'll use e to take the place of an event
const movementHandler = (e) => {
    // this movement handler is going to be attached to an event listener
    // we'll attach it with a keydown event
    // key events can use the key itself or a keycode
    // we'll use keycodes
    // w = 87, a = 65, s = 83, d = 68
    // up=38, down=40, left=37, right=39
    // in order to do different things for different keys, we can use if statements, or we can use a switch case
    // switch cases are handy when you have a multiple possibilities
    // switch case has a main switch, and cases(in this our cases are inputs)
    // we also need a break in every case, so we can read this multiple times
    switch (e.keyCode) {
        // adding cases that are lined up with each other, not separated by breaks, allows you to use multiple cases for the same functionality.
        case (87):
        case (38):
            // this moves player up
            player.y -= 10
            // we also need to break the case
            break
        case (65):
        case (37):
            // this moves the player left
            player.x -= 10
            break
        case (83):
        case (40):
            // this will move the player down
            player.y += 10
            break
        case (68):
        case (39):
            // this moves the player to the right
            player.x += 10
            break
    }

}


// to detect a collision between objects,
// we need to account for the entire space that the object takes up
// here, we'll write a collision detection function that
// takes our dimensions into account, and says what to do if the collision happens
const detectHit = () => {
    // we'll use one big if statement that clearly defines any moment of collision.
    // that means utilizing, x, y, width and height of our objects
    if (player.x < ogre.x + ogre.width
        && player.x + player.width > ogre.x
        && player.y < ogre.y + ogre.height
        && player.y + player.height > ogre.y) {
            // here we can see if the hit happens at the right time
            // console.log('we have a hit')
            // if a hit occurs, shrek dies and we win
            ogre.alive = false
            document.getElementById('status').textContent = 'You Win!'
        }
}