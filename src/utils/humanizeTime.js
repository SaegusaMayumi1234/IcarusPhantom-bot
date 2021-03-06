function humanizeTime(timestamp) {
  var time = timestamp / 1000
  if (time < 1) {
    time = 1
  }
  const seconds = Math.floor(time >= 60 ? time % 60 : time)
  const minutes = Math.floor((time = time / 60) >= 60 ? time % 60 : time)
  const hours = Math.floor((time = time / 60) >= 24 ? time % 24 : time)
  const days = Math.floor((time = time / 24) >= 30 ? time % 30 : time)
  const months = Math.floor((time = time / 30) >= 12 ? time % 12 : time)
  const years = Math.floor(time / 12)

  let humanizedTime = []

  if (years > 0) {
    humanizedTime.push(years == 1 ? 'a year' : `${years} years`)
  }
  if (months > 0) {
    humanizedTime.push(months == 1 ? 'a month' : `${months} months`)
  }
  if (days > 0) {
    humanizedTime.push(days == 1 ? 'a day' : `${days} days`)
  }
  if (hours > 0) {
    humanizedTime.push(hours == 1 ? 'a hour' : `${hours} hours`)
  }
  if (minutes > 0) {
    humanizedTime.push(minutes == 1 ? 'a minute' : `${minutes} minutes`)
  }
  if (seconds > 0) {
    humanizedTime.push(seconds == 1 ? 'a second' : `${seconds} seconds`)
  }
  if (humanizedTime.length < 2) {
    return humanizedTime.join(', ')
  }
  const lastElement = humanizedTime.pop()

  return humanizedTime.join(', ') + ` and ${lastElement}`
}

module.exports = humanizeTime;