const Discord = require('discord.js');
const logger = require('winston');
const fs = require('fs');
const { token } = require('./auth.json');
let { mongoPass } = require('./auth.json');
const mongoose = require('mongoose');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
const client = new Discord.Client;

client.on('ready', () => {
    // Showing whether bot has logged in
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.username + ' - (' + client.id + ')');

    // Setting presence of bot
    client.user.setPresence({
        activity: {
            name: 'humans complaining!',
            type: 'LISTENING'
        },
        status: 'online'
    });
});

client.login(token);

// Loading command files
client.commands = new Discord.Collection;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

logger.info('Loading commands...');

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

logger.info('Complete!');

// Executing commands
client.on('message', (message) => {
    // Use readFile (asynchronous) instead?
    const prefix = JSON.parse(fs.readFileSync('auth.json')).prefix;

    // If a message does not start with the prefix or the author of the message was the bot, then don't execute any commands and
    // just return
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    // Turning the message into an array
    const args = message.content.slice(prefix.length).trim().split(/ +/);

    // Take the first entry after the prefix, which should be the command
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) {
        return message.reply(`Command not found! Try \`${prefix}help\` to find the right command.`);
    }

    const guildName = client.guilds.cache.filter(guild => message.guild.id === guild.id).map(guild => guild.name);
    // Creates a new database for each new server
    mongoPass = mongoPass.replace('<dbname>', guildName);

    logger.info(`Logging into MongoDB dbname: ${guildName}`);

    mongoose.connect(mongoPass, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    logger.info('Complete!');

    try {
        client.commands.get(command).execute(message, args, prefix, client);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});