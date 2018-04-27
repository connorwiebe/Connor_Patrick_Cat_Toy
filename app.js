// require the johnny five module and create a new board instance
const five = require('johnny-five')
const board = new five.Board()

// wait for the arduino board to be ready
board.on('ready', () => {
  console.log('board ready')

  // instantiate components with their pin numbers
  const motion = new five.Motion(7)
  const servo = new five.Servo(8)
  const laser = new five.Led(4)

  // misc flag and timer
  let canStart = true
  let coolDown = 0

  // recursive function for randomly moving servo motor
  const random = session => {
    let num = Math.floor(Math.random() * 360)
    if (Date.now() < session) {
      setTimeout(() => {
        console.log('move servo')
        console.log(num)
        console.log(session - Date.now())
        servo.to(num)
        random(session)
      }, 500)
    } else {
      laser.off()
      servo.to(90)
      coolDown = Date.now() + (1 * 10 * 1000) // 10 seconds
      console.log('session ended')
      canStart = true
    }
  }

  // wait for motion detector to initialize
  motion.on('calibrated', () => {
    console.log('calibrated')

    // motion detection event listener
    motion.on('motionstart', () => {
      console.log('motionstart')

      // start session if canStart flag is true and cool down period is over
      if (canStart && Date.now() > coolDown) {
        console.log('session started')
        canStart = false
        laser.on()
        const session = Date.now() + (1 * 20 * 1000) // 20 seconds

        // kickoff new session
        random(session)
      }
    })

    motion.on('motionend', () => console.log('motionend'))

  })

})












// laser.blink()

// predefined array of potential degrees
// const degs = [0,72,144,216,288,360]

// let rand = Math.floor(Math.random() * degs.length)
// let num = degs[rand]
