const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')

function createBot() {
  const bot = mineflayer.createBot({
    host: 'FeastMC.mine.bz',
    port: 26127,
    username: 'Jhonny',
    auth: 'offline',   // change to 'microsoft' if premium
    version: '1.21'
  })

  bot.loadPlugin(pathfinder)

  bot.once('spawn', () => {
    bot.chat('[Jhonny under Diddy] online ✅')
    setInterval(() => {
      bot.swingArm()
      bot.look(bot.entity.yaw + 0.3, 0, true)
    }, 60000)
  })

  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    if (message === '!ping') bot.chat('Pong! 🏓')
    if (message.startsWith('!say ')) bot.chat(message.slice(5))
    if (message === '!come') {
      const player = bot.players[username]?.entity
      if (!player) return bot.chat("I can't see you 👀")
      const mcData = require('minecraft-data')(bot.version)
      const defaultMove = new Movements(bot, mcData)
      bot.pathfinder.setMovements(defaultMove)
      bot.pathfinder.setGoal(new goals.GoalBlock(
        player.position.x, player.position.y, player.position.z
      ))
      bot.chat('On my way! 🚶')
    }
  })

  bot.on('kicked', (reason) => {
    console.log('Kicked:', reason)
    setTimeout(createBot, 5000) // reconnect after 5s
  })

  bot.on('error', (err) => {
    console.log('Error:', err)
    setTimeout(createBot, 5000) // reconnect after 5s
  })
}

createBot()
