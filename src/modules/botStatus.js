const fetchData = require('../utils/fetchData')
const humanizeTime = require('../utils/humanizeTime')
const apiKeyHandler = require('./apiKeyHandler')
const db = require('./DatabaseManager')
const bot2 = require('../core/DiscordManager2')

var uptime = new Date().getTime()
var requestcount = 0
let statusdatacache = {
  "bot1": {
    "uptime": 0,
    "downtime": 0
  },
  "bot2": {
    "uptime": 0,
    "downtime": 0
  }
}
var botstatus = true

db.get("statusData").then(value => {
  if (value === null) {
    db.set("statusData", statusdatacache)
  } else if (value !== null) {
    statusdatacache = value
    console.log("Success get database from statusData")
  }
});

function enable() {
  botstatus = true
}

function disable() {
  botstatus = false
}

async function start(client) {
  if (botstatus) {
    const apikey = apiKeyHandler.get()

    let databot1 = await fetchData('https://api.hypixel.net/status?key=' + apikey + "&uuid=" + "bd45cd6d-5c4c-4d71-8d41-b267d5023333")
    let databot2 = await fetchData('https://api.hypixel.net/status?key=' + apikey + "&uuid=" + "ca7c8e9b-9309-4c82-b15a-3c51e8eaeba6")
    // let dataauctionapi1 = await fetchData('https://auction-scrapper.herokuapp.com/')
    let dataauctionapi2 = await fetchData('https://auction-scrapper2.herokuapp.com/')
    let dataauctionapi1 = {
      status: 503
    }
    let now = new Date().getTime()
    let botuptime = humanizeTime(now - uptime)
    let statusresponse = databot2.status
    let messageresponse
    let dataonline1 = "unknown",
        datagameType1 = "unknown",
        datamode1 = "unknown",
        timermessage1 = "Time: unknown",
        dataonline2 = "unknown",
        datagameType2 = "unknown",
        datamode2 = "unknown",
        timermessage2 = "Time: unknown",
        onlinewith = "unknown",
        auctionapi1 = "unknown",
        auctionapi2 = "unknown"
      
    if (databot1.status == 200) {
      dataonline1 = databot1.data.session.online
      datagameType1 = databot1.data.session.gameType
      datamode1 = databot1.data.session.mode
      requestcount += 1
    }

    if (databot2.status == 200) {
      dataonline2 = databot2.data.session.online
      datagameType2 = databot2.data.session.gameType
      datamode2 = databot2.data.session.mode
      requestcount += 1
    }

    if (dataonline1 === true) {
      dataonline1 = ":green_circle:"
      if (statusdatacache.bot1.uptime === 0) {
        statusdatacache.bot1.uptime = new Date().getTime()
        statusdatacache.bot1.downtime = 0
      }
      timermessage1 = 'UpTime: ' + humanizeTime(now - statusdatacache.bot1.uptime)
    } else if (dataonline1 === false) {
      dataonline1 = ":red_circle:"
      datagameType1 = "offline"
      datamode1 = "offline"
      if (statusdatacache.bot1.downtime === 0) {
        statusdatacache.bot1.downtime = new Date().getTime()
        statusdatacache.bot1.uptime = 0
      }
      timermessage1 = 'DownTime: ' + humanizeTime(now - statusdatacache.bot1.downtime)
    } else {
      dataonline1 = ":yellow_circle:"
    }

    if (dataonline2 === true) {
      if (datagameType2 === "MAIN" && datamode2 === "LOBBY") {
        dataonline2 = ":green_circle:"
        onlinewith = "bot"
      } else {
        dataonline2 = ":yellow_circle:"
        datagameType2 = "hidden"
        datamode2 = "hidden"
        onlinewith = "user"
      }
      if (statusdatacache.bot2.uptime === 0) {
        statusdatacache.bot2.uptime = new Date().getTime()
        statusdatacache.bot2.downtime = 0
      }
      timermessage2 = 'UpTime: ' + humanizeTime(now - statusdatacache.bot2.uptime)
    } else if (dataonline2 === false) {
      dataonline2 = ":red_circle:"
      onlinewith = "bot"
      datagameType2 = "offline"
      datamode2 = "offline"
      if (statusdatacache.bot2.downtime === 0) {
        statusdatacache.bot2.downtime = new Date().getTime()
        statusdatacache.bot2.uptime = 0
      }
      timermessage2 = 'DownTime: ' + humanizeTime(now - statusdatacache.bot2.downtime)
    } else {
      dataonline2 = ":yellow_circle:"
    }

    db.set("statusData", statusdatacache)
      
    if (statusresponse == 200) {
      messageresponse = "Good"
    } else if (statusresponse == 403 || statusresponse == 400) {
      messageresponse = "Invalid API key"
      // bot2.renew()
    } else if (statusresponse == 429) {
      messageresponse = "API rate limited"
    } else if (statusresponse == 500) {
      messageresponse = "Internal server error"
    } else if (statusresponse == 502) {
      messageresponse = "Hypixel API is not available (Bad Gateway)"
    } else if (statusresponse == 503) {
      messageresponse = "Hypixel API is not available / Under Attack Mode enabled"
    } else {
      messageresponse = "Error not defined"
    }
    try {
      if (dataauctionapi1.status == 200) {
      auctionapi1 = ":green_circle:"
      } else {
        auctionapi1 = ":red_circle:"
      }
    } catch(err) {}
    
    try {
      if (dataauctionapi2.status == 200) {
        auctionapi2 = ":green_circle:"
      } else {
        auctionapi2 = ":red_circle:"
      }
    } catch(err) {}


    client.channels.cache.get("851493171892191272").messages.fetch("851670496412303360")
    .then(msg => msg.edit({
      embed: {
        description: `This information will be updated every 30 seconds`,
        timestamp: new Date(),
        color: 'D400FF',
        author: {
          name: "Bot Status",
        },
        footer: {
          text: `Last Updated`
        },
        fields: [
          {
            "name": "SimpleFuturistic",
            "value": `Status: ${dataonline1}\n${timermessage1}`
          },
          {
            "name": "IcarusPhantom",
            "value": `OnlineMode: ${onlinewith}\nStatus: ${dataonline2}\n${timermessage2}`
          },
          {
            "name": "Hypixel API Key",
            "value": `Status: ${statusresponse}\nResponse: ${messageresponse}`
          },
          {
            "name": "Auction Scrapper API",
            "value": `**API1:**\n - Status: ${auctionapi1}\n - Response: ${dataauctionapi1.status}\n**API2:**\n - Status: ${auctionapi2}\n - Response: ${dataauctionapi2.status}`
          },
          {
            "name": "Stats",
            "value": `TrackingFor: ${botuptime}\nSuccessRequest: ${requestcount}`
          }
        ]
      },
    }))
  }

  setTimeout(() => {
    start(client)
  }, 1000 * 30)
}

exports.start = start;
exports.enable = enable;
exports.disable = disable;