const Discord = require('discord.js');

module.exports = {
  name: "remind",
  description: "Reminds the user.",
  usage: `<prefix>remind <Amount of time + what time(s [seconds], m [minutes], h [hours], or d [days])> <What message you want to send>\`
  Ex: <prefix>remind 10s Hello World`,
  usesDB: false,
  async execute(message, args, prefix) {
    if (!args[1] || !args[0]) {
      return message.reply(`Not enough arguments! Send command in the form: \`${prefix}remind <Amount of time + what time(s, m, h, or d)> <What message you want to send>\`
      Ex: \`${prefix}remind 10s Hello World!`);
    }

    let filteredMessage = args.slice(1).join().replace(/[^A-Za-z]/,' ');
    function reminder() {
      const embed = new Discord.MessageEmbed()
      .setTitle(`${message.author.username}'s Reminder from ${new Date().toLocaleTimeString('en-US', {dateStyle: "full", timeStyle: "long"})}`)
      .setDescription(filteredMessage);

      message.reply(embed);
    }

    // Try to think of a better way to do this
    let msDelay = args[0].slice(0, -1);
    switch (args[0].slice(-1)) {
      case 's': {
        msDelay *= 1000;
        message.reply('Your reminder has been set. I will remind you in ' + args[0].slice(0, -1) + ' seconds.');
        setTimeout(reminder, msDelay);
        break;
      }
      case 'm': {
        msDelay *= 60000;
        message.reply('Your reminder has been set. I will remind you in ' + args[0].slice(0, -1) + ' minutes.');
        setTimeout(reminder, msDelay);
        break;
      }
      case 'h': {
        msDelay *= 3600000;
        message.reply('Your reminder has been set. I will remind you in ' + args[0].slice(0, -1) + ' hours.');
        setTimeout(reminder, msDelay);
        break;
      }
      case 'd': {
        msDelay *= 86400000;
        message.reply('Your reminder has been set. I will remind you in ' + args[0].slice(0, -1) + ' days.');
        setTimeout(reminder, msDelay);
        break;
      }
      default : {
        message.reply('Wrong format! Remember to add what type of time it is (s, m, h, or d)!');
        break;
      }
    }
  }
};