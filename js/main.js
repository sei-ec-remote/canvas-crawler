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

// this was the original Crawler class, used for both the hero and the ogre
// class Crawler {
//     constructor(x, y, color, height, width) {
//         this.x = x,
//         this.y = y,
//         this.color = color,
//         this.height = height,
//         this.width = width,
//         this.alive = true,
//         this.render = function () {
//             // ctx.fillStyle will determine the color(or style) of your element
//             ctx.fillStyle = this.color
//             // ctx.fillRect will draw a rectangle on the canvas
//             ctx.fillRect(this.x, this.y, this.height, this.width)
//         }
//     }
// }

// what we want, are two separate classes for each of our types of entities
// one for the ogres, one for the hero
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
        // ctx.fillStyle will determine the color(or style) of your element
        ctx.fillStyle = this.color
        // ctx.fillRect will draw a rectangle on the canvas
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// HeroCrawler will be our playable character, will have additional properties
// Hero will be built for smoooooooooooth movement
class HeroCrawler {
	constructor(x, y, color, width, height) {
		this.x = x,
		this.y = y,
		this.color = color,
		this.height = height,
		this.width = width,
		this.alive = true,
        this.speed = 15,
        // smooth animation works differently than what we saw previously
        // the way this animation works, is putting our character in constant motion
        // the way we can decide direction, is by 'freezing' our character in place
        // and 'setting the direction' with our key event
		this.direction = {
            up: false,
            down: false,
            right: false,
            left: false,
        }
	}
	// add a setDirection method as well as an unsetDirection method.
	setDirection = function (key) {
		console.log('the key pressed is', key)
		// pressing key(keydown), changes direction from false to true
		if (key.toLowerCase() == 'w') this.direction.up = true
		if (key.toLowerCase() == 'a') this.direction.left = true
		if (key.toLowerCase() == 's') this.direction.down = true
		if (key.toLowerCase() == 'd') this.direction.right = true
	}
	// this method will 'unset' our direction when the key is lifted(keyup)
	// sets direction to false
	unsetDirection = function (key) {
		console.log('the key pressed is', key)
		// pressing key(keydown), changes direction from false to true
		if (key.toLowerCase() == 'w') this.direction.up = false
		if (key.toLowerCase() == 'a') this.direction.left = false
		if (key.toLowerCase() == 's') this.direction.down = false
		if (key.toLowerCase() == 'd') this.direction.right = false
	}
	movePlayer = function () {
		// movePlayer will take and look at the direction that is set
		// movePlayer will then send the guy flying in that direction
		// move up
		if (this.direction.up) {
			this.y -= this.speed
			// because we're tracking 'up' movement, we'll add our top of canvas case
			if (this.y <= 0) {
				this.y = 0
			}
		}
		// move left
		if (this.direction.left) {
			this.x -= this.speed
			// bc we're tracking left movement, we need the left edge of the canvas
			if (this.x <= 0) {
				this.x = 0
			}
		}
		// move down
		if (this.direction.down) {
			this.y += this.speed
			// bc we're tracking down movement, we need the bottom edge of the canvas
			// but we also need to consider the hero's height
			if (this.y + this.height >= game.height) {
				this.y = game.height - this.height
			}
		}
		// move right
		if (this.direction.right) {
			this.x += this.speed
			// bc we're tracking left movement, we need the left edge of the canvas
			if (this.x + this.width >= game.width) {
				this.x = game.width - this.width
			}
		}
	}
	render = function () {
		// ctx.fillStyle will determine the color(or style) of your element
		ctx.fillStyle = this.color
		// ctx.fillRect will draw a rectangle on the canvas
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}
}

// this function will place an ogre at a random x coordinate on the canvas
const randomPlaceShrekX = (max) => {
    // all this function needs to do is produce an X coordinate (any whole num)
    return Math.floor(Math.random() * max)
}

let player = new HeroCrawler(10, 10, 'blue', 16, 16)
// this is the old shrek, placed exactly at 200x coord
// let ogre = new OgreCrawler(200, 50, 'lightgreen', 32, 48, 'ogre')
// this is the new shrek, placed with a random x coord
let ogre = new OgreCrawler(randomPlaceShrekX(game.width), 50, 'lightgreen', 32, 48, 'ogre')
let ogreTwo = new OgreCrawler(randomPlaceShrekX(game.width), 100, 'red', 64, 96, 'big ogre')

// we're going to change up our game loop to run on a declared interval
// when we declare an interval, with a function, we can stop that interval

// declaring our interval in a variable, allows us to stop that interval
const stopGameLoop = () => {clearInterval(gameInterval)}

document.addEventListener('DOMContentLoaded', function () {
    // movementhandler is NO MORE
    // so we'll comment out this old event
    // document.addEventListener('keydown', movementHandler)
    gameInterval
})

// the gameloop function will be part of what allows us to control what happens and when
// the gameloop function is also going to be how we utilize movement
const gameLoop = () => {
    ctx.clearRect(0, 0, game.width, game.height)
    // the 'win' condition of our game, is to kill shrek
    // if our ogre is alive, then the game can continue
    // otherwise, the game will end.
    if (ogre.alive) {
        // if ogre is alive, render and detect the hit
        ogre.render()
        // this is where we will do 'collision detection'
        detectHit(ogre)
    } else if (ogreTwo.alive) {
        document.querySelector('#status').textContent = 'Now Kill Shrek 2!'
        ogreTwo.render()
        detectHit(ogreTwo)
    } else {
        stopGameLoop()
        document.querySelector('#status').textContent = 'You Win!!'
    }
    // we use clear rect because we're looping, and we want to clear out the old rendering
    movement.textContent = player.x + ', ' + player.y

    player.render()
    player.movePlayer()
}

// this function is going to be how we move our player around
// here 'e' is referring to the event
// THIS IS OUR OLD MOVEMENT HANDLER, THE NEW ONE IS PART OF HERO CLASS
// const movementHandler = (e) => {
//     // we can use if...else and keycodes to determine player movement
//     // keycodes refer to specific keyboard keys with a number
//     // if we want to use WASD the key codes are as follows:
//     // w=87, a=65, s=83, d=68
//     // up=38, down=40, left=37, right=39
//     // we can also use a switch case which can be handy when we have multiple possibilities
//     // switch case has a main switch, cases(which are our inputs in this instance)
//     // we also need to break out of our cases, using the keyword break
//     switch (e.keyCode) {
//         case (87):
//             // we'll move the player up
//             player.y -= 10
//             // then break the case
//             break
//         case (65):
//             // move the player left
//             player.x -= 10
//             break
//         case (83):
//             // move player down
//             player.y += 10
//             break
//         case (68):
//             // move the player right
//             player.x += 10
//             break
//     }
// }

// we'll add our key events for keyup and keydown and associate them with our 
// hero's set and unset direction methods
document.addEventListener('keydown', (e) => {
    // when the key is pressed, change the direction
    // according to the setDirection HeroCrawler method
    player.setDirection(e.key)
})

document.addEventListener('keyup', (e) => {
    // now if any of the keys that are released correspond to a movement key
    // change the corresponding direction to false
    if (['w', 'a', 's', 'd'].includes(e.key)) {
        player.unsetDirection(e.key)
    }
})

// to detect collision between elements in our canvas
// we need to refer to their size and shape to make a 'realistic' event happen
// here is our collision detection function detectHit()
// const detectHit = () => {
//     // we need an if statement that clearly defines the moment of collision
//     // that means utilizing the x,y, width, and height of whatever we're detecting
//     if (player.x < ogre.x + ogre.width
//         && player.x + player.width > ogre.x
//         && player.y < ogre.y + ogre.height
//         && player.y + player.height > ogre.y) {
//             ogre.alive = false
//             document.getElementById('status').textContent = 'You win!'
//         }
// }

// our update collision detection function will take a parameter
// that parameter will represent some item on the canvas,
// and do something accordingly
const detectHit = (thing) => {
	// we need an if statement that clearly defines the moment of collision
	// that means utilizing the x,y, width, and height of whatever we're detecting
	if (
		player.x < thing.x + thing.width &&
		player.x + player.width > thing.x &&
		player.y < thing.y + thing.height &&
		player.y + player.height > thing.y
	) {
		thing.alive = false
		document.getElementById('status').textContent = 'NICE!'
	}
}

let gameInterval = setInterval(gameLoop, 60)
