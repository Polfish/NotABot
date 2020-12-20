const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
const bot = new Discord.Client;

bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');

    bot.user.setPresence({
        activity: {
            name: 'humans complaining!', 
            type: 'LISTENING'
        },
        status: 'online'
    });
});

bot.login(auth.token);

bot.on('message', message => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                message.channel.send('Pong!');
            break;
            // Just add any case commands if you want to..
            case 'start':
                message.channel.send('Hello World!');
            break;
         }
     }
     
     if (message.content === 'bee') {
        message.channel.send('According to all known laws of aviation, there is no way a bee should be able to fly.' + 
            'Its wings are too small to get its fat little body off the ground.' + 
            'The bee, of course, flies anyway because bees don\'t care what humans think is impossible.');
     } else if (message.content === 'I am your father!') {
         message.channel.send('NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
     } else if (message.content === 'Shut up') {
         message.channel.send('No U');
     } else if (message.content.toLowerCase().includes('fr') && message.author.id != bot.user.id) {
         message.channel.send('FR');
     }
});