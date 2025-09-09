// === IMPORTS ===
const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const express = require('express')

// === CONFIG ===
const bot = mineflayer.createBot({
  host: 'us.zooming.host',  // ✅ your server IP
  port: 25089,              // ✅ your server port
  username: 'Jhonny_sins',  // bot username
  auth: 'offline',          // use 'microsoft' if premium
  version: '1.21'           // force Paper 1.21
})

// === LOAD PLUGINS ===
bot.loadPlugin(pathfinder)

// === EVENTS ===
bot.once('spawn', () => {
  console.log('✅ Bot has joined the server!')
  bot.chat('[Jhonny_sins under Diddy] online ✅')

  // simple anti-AFK (move arm + rotate every 60s)
  setInterval(() => {
    bot.swingArm()
    bot.look(bot.entity.yaw + 0.3, 0, true)
  }, 60000)
})

// === CHAT COMMANDS ===
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
    bot.chat('On my way! 🏃‍♂️')
  }
})

// === ERROR HANDLING ===
bot.on('kicked', console.log)
bot.on('error', console.log)

// === KEEP-ALIVE WEB SERVER (for Replit/UptimeRobot) ===
const app = express()
app.get("/", (req, res) => res.send("✅ Bot is alive!"))
app.listen(3000, () => console.log("🌐 Keep-alive web server ready on port 3000"))
