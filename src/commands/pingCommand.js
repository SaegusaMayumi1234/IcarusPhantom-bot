module.exports = {
  name: 'ping',
  description: 'Ping!',
  execute(message, args, client) {
    return
    message.channel.send('pong')
  }
}