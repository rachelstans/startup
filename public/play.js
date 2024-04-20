const newHighScoreEvent = 'newHighScore';

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')

canvas.width = innerWidth
canvas.height = innerHeight

this.configureWebSocket();

class Boundary {
    static width = 30
    static height = 30

    constructor({position}) {
        this.position = position
        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'indigo'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Player {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 12
        this.radians = 0.75
        this.openRate = 0.11
        this.rotation = 0
    }

    draw() {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(
            this.position.x, 
            this.position.y, 
            this.radius,
            this.radians,
            Math.PI*2 - this.radians
            )
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate

        this.radians += this.openRate
    }
}

class Ghost {
    static speed = 2

    constructor({position, velocity, color = 'red'}) {
        this.position = position
        this.velocity = velocity
        this.radius = 13
        this.color = color
        this.prevCollisions = []
        this.speed = 2
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Pellet {
    constructor({position}) {
        this.position = position
        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}

const pellets = []
const boundaries = []
const ghosts = [
    new Ghost({
        position: {
            x: Boundary.width * 17 + Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: { x:Ghost.speed, y:0 },
    }),
    new Ghost({
        position: {
            x: Boundary.width * 18 + Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: { x:Ghost.speed, y:0 },
        color: 'pink'
    }),
    new Ghost({
        position: {
            x: Boundary.width * 17 + Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: { x:Ghost.speed, y:0 },
        color: 'blue'
    })
]
const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: { x: 0, y: 0 }
})

const keys = {
    ArrowUp: {

        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

let lastKey = ''
let score = 0

const map = [
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','-'],
    ['-','.','-','-','-','.','-','.','-','.','-','-','-','.','-','-','-','.','-','.','-','-','-','.','-','-','-','.','-','.','-','.','-','-','-','.','-'],
    ['-','.','-','.','.','.','-','.','-','.','-','.','.','.','.','.','.','.','-','.','.','.','.','.','.','.','-','.','-','.','-','.','.','.','-','.','-'],
    ['-','.','-','.','-','-','-','.','-','.','-','.','-','-','-','.','-','-','-','-','-','.','-','-','-','.','-','.','-','.','-','-','-','.','-','.','-'],
    ['-','.','-','.','.','.','-','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','-','.','.','.','-','.','-'],
    ['-','.','-','.','-','.','-','.','-','.','-','-','-','.','-','.','-','-',' ','-','-','.','-','.','-','-','-','.','-','.','-','.','-','.','-','.','-'],
    ['-','.','.','.','-','.','.','.','-','.','.','.','.','.','-','.','-',' ',' ',' ','-','.','-','.','.','.','.','.','-','.','.','.','-','.','.','.','-'],
    ['-','.','-','-','-','-','-','.','-','.','-','-','-','.','-','.','-','-','-','-','-','.','-','.','-','-','-','.','-','.','-','-','-','-','-','.','-'],
    ['-','.','.','.','.','.','.','.','-','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','-','.','.','.','.','.','.','.','-'],
    ['-','.','-','.','-','-','-','.','-','.','-','.','-','-','-','.','-','-','-','-','-','.','-','-','-','.','-','.','-','.','-','-','-','.','-','.','-'],
    ['-','.','-','.','.','.','-','.','-','.','-','.','.','.','.','.','.','.','-','.','.','.','.','.','.','.','-','.','-','.','-','.','.','.','-','.','-'],
    ['-','.','-','-','-','.','-','.','-','.','-','-','-','.','-','-','-','.','-','.','-','-','-','.','-','-','-','.','-','.','-','.','-','-','-','.','-'],
    ['-','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-']
]

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch(symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width*j,
                            y: Boundary.height*i
                        }
                    })
                )
                break
            case '.':
                pellets.push(
                    new Pellet({
                        position: {
                            x: Boundary.width * j + Boundary.width / 2,
                            y: Boundary.height * i + Boundary.height / 2
                        }
                    })
                )
                break
        }
    })
})

function circleCollidesWithRectangle({circle, rectangle}) {
    const padding = Boundary.width / 2 - circle.radius - 1
    return (
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding && 
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
    )
}

async function saveScore(score) {
    const userName = this.getPlayerName();
    const date = new Date().toLocaleDateString();
    const newScore = {name: userName, score: score, date: date};

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(newScore),
      });

      // Store what the service gave us as the high scores
      const scores = await response.json();
      if (scores[0].score === score) {
        this.broadcastEvent(this.getPlayerName(), newHighScoreEvent, score);
      }
      localStorage.setItem('scores', JSON.stringify(scores));
    } catch {
      // If there was an error then just track scores locally
      this.updateScoresLocal(newScore);
    }
}

function updateScoresLocal(newScore) {
    let scores = [];
    const scoresText = localStorage.getItem('scores');
    if (scoresText) {
        scores = JSON.parse(scoresText);
    }

    let found = false;
    for (const [i, prevScore] of scores.entries()) {
        if (newScore > prevScore.score) {
        scores.splice(i, 0, newScore);
        found = true;
        break;
        }
    }

    if (!found) {
        scores.push(newScore);
    }

    if (scores.length > 10) {
        scores.length = 10;
    }

    localStorage.setItem('scores', JSON.stringify(scores));
}

function getPlayerName() {
    return localStorage.getItem('userName') ?? 'Mystery player';
}

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.ArrowUp.pressed && lastKey === 'ArrowUp') {
        for (let i=0; i<boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle:{...player, velocity: {x:0,y:-5}}, 
                rectangle:boundary
            })) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -5
            }
        }
    } else if (keys.ArrowDown.pressed && lastKey === 'ArrowDown') {
        for (let i=0; i<boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle:{...player, velocity: {x:0,y:5}}, 
                rectangle:boundary
            })) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 5
            }
        }
    } else if (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft') {
        for (let i=0; i<boundaries.length; i++) {
            const boundary = boundaries[i]   
            if (circleCollidesWithRectangle({
                circle:{...player, velocity: {x:-5,y:0}}, 
                rectangle:boundary
            })) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -5
            }
        }
    } else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight') {
        for (let i=0; i<boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle:{...player, velocity: {x:5,y:0}}, 
                rectangle:boundary
            })) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 5
            }
        }
    }

    if (pellets.length === 0) {
        cancelAnimationFrame(animationId)
    }

    // touch pellets here
    for (let i=pellets.length-1; 0<i; i--) {
        const pellet = pellets[i]
        pellet.draw()

        if (
            Math.hypot(
                pellet.position.x - player.position.x, 
                pellet.position.y - player.position.y
                ) < pellet.radius + player.radius
            ) {
            pellets.splice(i,1)
            score += 10
            scoreEl.innerHTML = score
            saveScore(score)
        }
    }

    boundaries.forEach((boundary) => {
        boundary.draw()

        if (circleCollidesWithRectangle({circle:player, rectangle:boundary})) {
            console.log('collision')
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })

    player.update()

    ghosts.forEach((ghost) => {
        ghost.update()

        if (
            Math.hypot(
                ghost.position.x - player.position.x, 
                ghost.position.y - player.position.y
                ) < ghost.radius + player.radius
            ) {
                cancelAnimationFrame(animationId)
            }

        const collisions = []
        boundaries.forEach((boundary) => {
            if (
                !collisions.includes('right') &&
                circleCollidesWithRectangle({
                circle:{...ghost, velocity: {x:ghost.speed,y:0}}, 
                rectangle: boundary
            })) {
                collisions.push('right')
            }
            else if (
                !collisions.includes('left') &&
                circleCollidesWithRectangle({
                circle:{...ghost, velocity: {x:-ghost.speed,y:0}}, 
                rectangle: boundary
            })) {
                collisions.push('left')
            }
            else if (
                !collisions.includes('up') &&
                circleCollidesWithRectangle({
                circle:{...ghost, velocity: {x:0,y:-ghost.speed}}, 
                rectangle: boundary
            })) {
                collisions.push('up')
            }
            else if (
                !collisions.includes('down') &&
                circleCollidesWithRectangle({
                circle:{...ghost, velocity: {x:0,y:ghost.speed}}, 
                rectangle: boundary
            })) {
                collisions.push('down')
            }
        })

        if (collisions.length > ghost.prevCollisions.length) {
            ghost.prevCollisions = collisions
        }

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
            if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
            else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
            else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
            else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

            const pathways = ghost.prevCollisions.filter((collision) => {
                return !collisions.includes(collision)
            })

            const direction = pathways[Math.floor(Math.random() * pathways.length)]

            switch (direction) {
                case 'right':
                    ghost.velocity.x = ghost.speed
                    ghost.velocity.y = 0
                    break
                case 'left':
                    ghost.velocity.x = -ghost.speed
                    ghost.velocity.y = 0
                    break
                case 'up':
                    ghost.velocity.x = 0
                    ghost.velocity.y = -ghost.speed
                    break
                case 'down':
                    ghost.velocity.x = 0
                    ghost.velocity.y = ghost.speed
                    break
            }

            ghost.prevCollisions = []
        }
    })

    if (player.velocity.x > 0) player.rotation = 0
    else if (player.velocity.x < 0) player.rotation = Math.PI
    else if (player.velocity.y > 0) player.rotation = Math.PI / 2
    else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
}

animate()

addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            lastKey = 'ArrowUp'
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = true
            lastKey = 'ArrowDown'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            lastKey = 'ArrowLeft'
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            lastKey = 'ArrowRight'
            break
    }
})

addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
    }
})

// websocket

function configureWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    this.socket.onopen = (event) => {
        this.displayMsg('system', 'game', 'connected');
    };
    this.socket.onclose = (event) => {
        this.displayMsg('system', 'game', 'disconnected');
    };
    this.socket.onmessage = async (event) => {
        const msg = JSON.parse(await event.data.text());
        if (msg.type === newHighScoreEvent) {
            this.displayMsg(`Player ${msg.from} just scored ${msg.value}`);
        }
    };
}

function displayMsg(cls, from, msg) {
    const liveUpdates = document.querySelector('#live-updates');
    if (msg != 'connected' && msg != 'disconnected') {
        liveUpdates.innerHTML = msg;
    }
}

function broadcastEvent(from, type, value) {
    const event = {
      from: from,
      type: type,
      value: value,
    };
    this.socket.send(JSON.stringify(event));
}